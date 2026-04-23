import { connectDB } from "@/lib/db";
import { workoutCalendarSaveSchema } from "@/lib/validation";
import WorkoutCalendar from "@/models/WorkoutCalendar";
import { NextResponse } from "next/server";

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function key(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDays(value: string | null) {
  const parsed = Number(value ?? 7);
  if (!Number.isInteger(parsed)) {
    return 7;
  }
  return Math.min(90, Math.max(1, parsed));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") ?? "";
    const start = searchParams.get("start") ?? "";
    const days = parseDays(searchParams.get("days"));

    if (!userId || !start) {
      return NextResponse.json({ message: "Missing userId/start" }, { status: 400 });
    }

    await connectDB();

    const startDate = new Date(`${start}T00:00:00`);
    const endDate = addDays(startDate, days - 1);
    const docs = await WorkoutCalendar.find({
      userId,
      dateKey: { $gte: key(startDate), $lte: key(endDate) },
    })
      .select("dateKey workout focus summary exercises completed completedAt")
      .lean();

    return NextResponse.json({ data: docs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error fetching workout calendar";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = String(body?.userId ?? "");
    const parsed = workoutCalendarSaveSchema.safeParse(body);
    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { message: issue?.message ?? "Invalid calendar payload" },
        { status: 400 },
      );
    }

    const { dateKey, workout, focus, summary, exercises, completed } = parsed.data;
    await connectDB();

    const update: {
      userId: string;
      dateKey: string;
      workout: string;
      focus: string;
      summary: string;
      exercises: string[];
      completed?: boolean;
      completedAt?: Date | null;
    } = {
      userId,
      dateKey,
      workout,
      focus,
      summary,
      exercises,
    };

    if (typeof completed === "boolean") {
      update.completed = completed;
      update.completedAt = completed ? new Date() : null;
    }

    const updated = await WorkoutCalendar.findOneAndUpdate(
      { userId, dateKey },
      { $set: update },
      { upsert: true, new: true },
    )
      .select("dateKey workout focus summary exercises completed completedAt")
      .lean();

    return NextResponse.json({ message: "Saved", data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error saving workout calendar";
    return NextResponse.json({ message }, { status: 500 });
  }
}
