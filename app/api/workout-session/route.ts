import { connectDB } from "@/lib/db";
import { getWorkoutDayDefaults } from "@/lib/workout-calendar";
import WorkoutCalendar from "@/models/WorkoutCalendar";
import WorkoutSession from "@/models/WorkoutSession";
import { NextResponse } from "next/server";

function toPositiveNumber(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
}

function hasMeaningfulWorkoutEntry(
  exercises: Array<{
    sets?: Array<{
      completed?: boolean;
      isCompleted?: boolean;
      pr?: boolean;
      isPR?: boolean;
      weight?: unknown;
      reps?: unknown;
    }>;
  }>,
) {
  return exercises.some(
    (exercise) =>
      Array.isArray(exercise?.sets) &&
      exercise.sets.some((set) => {
        if (!set || typeof set !== "object") {
          return false;
        }

        if (set.completed || set.isCompleted || set.pr || set.isPR) {
          return true;
        }

        return (
          toPositiveNumber(set.weight) > 0 || toPositiveNumber(set.reps) > 0
        );
      }),
  );
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = String(searchParams.get("userId") ?? "");
    const dateKey = String(searchParams.get("dateKey") ?? "");
    if (!userId || !dateKey) {
      return NextResponse.json(
        { message: "Missing userId/dateKey" },
        { status: 400 },
      );
    }

    await connectDB();
    const doc = await WorkoutSession.findOne({ userId, dateKey }).lean();
    return NextResponse.json({ data: doc ?? null });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error fetching session";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const userId = String(body?.userId ?? "");
    const dateKey = String(body?.dateKey ?? "");
    const exercises = Array.isArray(body?.exercises) ? body.exercises : [];
    if (!userId || !dateKey) {
      return NextResponse.json(
        { message: "Missing userId/dateKey" },
        { status: 400 },
      );
    }

    await connectDB();
    const updated = await WorkoutSession.findOneAndUpdate(
      { userId, dateKey },
      { $set: { userId, dateKey, exercises } },
      { upsert: true, new: true },
    ).lean();

    const hasCompletedWorkout = hasMeaningfulWorkoutEntry(exercises);

    const existingCalendar = await WorkoutCalendar.findOne({ userId, dateKey })
      .select("workout focus summary exercises completedAt")
      .lean();

    if (existingCalendar || hasCompletedWorkout) {
      const defaults = getWorkoutDayDefaults(dateKey);
      const resolvedWorkout =
        typeof existingCalendar?.workout === "string" &&
        existingCalendar.workout.trim()
          ? existingCalendar.workout.trim()
          : defaults.workout;
      const resolvedFocus =
        typeof existingCalendar?.focus === "string" &&
        existingCalendar.focus.trim()
          ? existingCalendar.focus.trim()
          : defaults.focus;
      const resolvedSummary =
        typeof existingCalendar?.summary === "string" &&
        existingCalendar.summary.trim()
          ? existingCalendar.summary.trim()
          : defaults.summary;
      const resolvedExercises =
        Array.isArray(existingCalendar?.exercises) &&
        existingCalendar.exercises.length > 0
          ? existingCalendar.exercises.map((exercise: string) =>
              String(exercise),
            )
          : defaults.exercises;

      await WorkoutCalendar.findOneAndUpdate(
        { userId, dateKey },
        {
          $set: {
            userId,
            dateKey,
            workout: resolvedWorkout,
            focus: resolvedFocus,
            summary: resolvedSummary,
            exercises: resolvedExercises,
            completed: hasCompletedWorkout,
            completedAt: hasCompletedWorkout
              ? (existingCalendar?.completedAt ?? new Date())
              : null,
          },
        },
        { upsert: true, new: true },
      ).lean();
    }

    return NextResponse.json({ message: "Saved", data: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error saving session";
    return NextResponse.json({ message }, { status: 500 });
  }
}
