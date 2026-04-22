import { connectDB } from "@/lib/db";
import Calorie from "@/models/Calorie";
import Intake from "@/models/Intake";
import WorkoutSession from "@/models/WorkoutSession";
import { NextResponse } from "next/server";

type SessionSet = {
  weight?: string;
  reps?: string;
  completed?: boolean;
  pr?: boolean;
};

type SessionExercise = {
  sets?: SessionSet[];
};

type SessionDoc = {
  dateKey?: string;
  exercises?: SessionExercise[];
};

type MealDoc = {
  calories?: number;
};

type IntakeDoc = {
  date?: string;
  breakfast?: MealDoc;
  lunch?: MealDoc;
  snacks?: MealDoc;
  dinner?: MealDoc;
  caloriesConsumed?: number;
};

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthRange(year: number, monthZero: number) {
  const start = new Date(year, monthZero, 1);
  const end = new Date(year, monthZero + 1, 0);
  return { start, end };
}

function toNumber(raw: unknown) {
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

function parseLift(set: SessionSet) {
  const weight = toNumber(set.weight);
  const reps = toNumber(set.reps);
  return weight * reps;
}

function intakeCalories(intake: IntakeDoc) {
  const fromMeals =
    toNumber(intake.breakfast?.calories) +
    toNumber(intake.lunch?.calories) +
    toNumber(intake.snacks?.calories) +
    toNumber(intake.dinner?.calories);

  const explicit = toNumber(intake.caloriesConsumed);
  return Math.max(fromMeals, explicit);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = String(searchParams.get("userId") ?? "").trim();
    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    await connectDB();

    const now = new Date();
    const year = now.getFullYear();
    const currentMonth = now.getMonth();

    const yearStartKey = `${year}-01-01`;
    const yearEndKey = `${year}-12-31`;
    const monthStartKey = toDateKey(new Date(year, currentMonth, 1));
    const monthEndKey = toDateKey(new Date(year, currentMonth + 1, 0));

    const [sessionsRaw, intakesRaw, latestPlan] = await Promise.all([
      WorkoutSession.find({
        userId,
        dateKey: { $gte: yearStartKey, $lte: yearEndKey },
      })
        .select("dateKey exercises")
        .lean(),
      Intake.find({
        userId,
        date: { $gte: yearStartKey, $lte: yearEndKey },
      })
        .select("date breakfast lunch snacks dinner caloriesConsumed")
        .lean(),
      Calorie.findOne({ userId }).sort({ createdAt: -1 }).select("calories").lean(),
    ]);

    const sessions = (sessionsRaw as SessionDoc[]) ?? [];
    const intakes = (intakesRaw as IntakeDoc[]) ?? [];
    const calorieTarget = Math.max(0, toNumber((latestPlan as { calories?: number } | null)?.calories));

    let totalSetsMonth = 0;
    let completedSetsMonth = 0;
    let prMonth = 0;
    let workoutDaysMonth = 0;
    let strengthVolumeMonth = 0;

    const monthlyCompletionValues: number[] = [];
    const completionByMonth = Array.from({ length: 12 }, () => ({
      workoutRatios: [] as number[],
      dietRatios: [] as number[],
    }));

    for (const session of sessions) {
      const dateKey = String(session.dateKey ?? "");
      const monthIndex = Number(dateKey.slice(5, 7)) - 1;
      if (!Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) continue;

      const sets = (session.exercises ?? []).flatMap((exercise) => exercise.sets ?? []);
      const totalSets = sets.length;
      const completedSets = sets.filter((set) => Boolean(set.completed)).length;
      const workoutRatio = totalSets > 0 ? completedSets / totalSets : 0;
      completionByMonth[monthIndex].workoutRatios.push(workoutRatio);

      if (dateKey >= monthStartKey && dateKey <= monthEndKey) {
        if (totalSets > 0) {
          workoutDaysMonth += 1;
        }
        totalSetsMonth += totalSets;
        completedSetsMonth += completedSets;
        prMonth += sets.filter((set) => Boolean(set.pr)).length;
        strengthVolumeMonth += sets
          .filter((set) => Boolean(set.completed))
          .reduce((sum, set) => sum + parseLift(set), 0);
      }
    }

    for (const intake of intakes) {
      const date = String(intake.date ?? "");
      const monthIndex = Number(date.slice(5, 7)) - 1;
      if (!Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) continue;
      const consumed = intakeCalories(intake);
      const dietRatio =
        calorieTarget > 0 ? Math.min(consumed / calorieTarget, 1) : consumed > 0 ? 1 : 0;
      completionByMonth[monthIndex].dietRatios.push(dietRatio);
    }

    const yearlyCompletion = completionByMonth.map((monthEntry, index) => {
      const workoutAvg =
        monthEntry.workoutRatios.length > 0
          ? monthEntry.workoutRatios.reduce((a, b) => a + b, 0) / monthEntry.workoutRatios.length
          : 0;
      const dietAvg =
        monthEntry.dietRatios.length > 0
          ? monthEntry.dietRatios.reduce((a, b) => a + b, 0) / monthEntry.dietRatios.length
          : 0;
      const combined = workoutAvg * 0.6 + dietAvg * 0.4;
      if (index === currentMonth) {
        monthlyCompletionValues.push(combined);
      }
      return combined;
    });

    const currentCompletion = Math.round((yearlyCompletion[currentMonth] ?? 0) * 100);
    const prevCompletion = Math.round(((yearlyCompletion[currentMonth - 1] ?? 0) as number) * 100);

    const change = currentCompletion - prevCompletion;
    const completionChangeLabel = `${change >= 0 ? "+" : ""}${change}% vs last month`;

    const monthLabel = now.toLocaleString("en-US", { month: "long" });

    return NextResponse.json({
      summary: {
        monthLabel,
        workoutDays: workoutDaysMonth,
        completedSets: completedSetsMonth,
        totalSets: totalSetsMonth,
        prs: prMonth,
        strengthVolume: Math.round(strengthVolumeMonth),
        calorieTarget,
        completionPercent: currentCompletion,
        completionChangeLabel,
      },
      yearlyTrend: yearlyCompletion.map((value, index) => ({
        label: new Date(year, index, 1).toLocaleString("en-US", { month: "short" }),
        value: Math.round(value * 100),
      })),
      strengthByLift: [
        { label: "Volume", value: Math.round(strengthVolumeMonth / 10) },
        { label: "PRs", value: prMonth * 10 },
        { label: "Done Sets", value: completedSetsMonth },
      ],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load progress";
    return NextResponse.json({ message }, { status: 500 });
  }
}

