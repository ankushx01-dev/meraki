import { connectDB } from "@/lib/db";
import Calorie from "@/models/Calorie";
import User from "@/models/User";
import { NextResponse } from "next/server";

const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
} as const;

const goalAdjustments = {
  loss: -300,
  maintain: 0,
  gain: 300,
} as const;

type ActivityLevel = keyof typeof activityFactors;
type Goal = keyof typeof goalAdjustments;
type Gender = "male" | "female";

function getEmail(req: Request) {
  return req.headers.get("x-user-email") ?? "";
}

function computeTargets({
  age,
  weight,
  height,
  gender,
  activity,
  goal,
}: {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activity: ActivityLevel;
  goal: Goal;
}) {
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = bmr * activityFactors[activity];
  const calories = Math.round(tdee + goalAdjustments[goal]);
  const protein = Math.round(weight * 2);
  const fat = Math.round(weight * 0.8);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { calories, protein, carbs, fat };
}

export async function GET(req: Request) {
  try {
    const email = getEmail(req);
    if (!email) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email })
      .select("onboardingCompleted age weight height gender activity goal")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const alreadyCompleted = Boolean((user as any).onboardingCompleted);
    const hasBasicUserMetrics =
      Number((user as any).age) > 0 &&
      Number((user as any).weight) > 0 &&
      Number((user as any).height) > 0;
    const latestCalorie = await Calorie.findOne({ userId: email }).sort({ createdAt: -1 }).lean();
    const hasCalculatorData = Boolean(latestCalorie);
    const inferredCompleted = alreadyCompleted || hasBasicUserMetrics || hasCalculatorData;

    // Backfill older accounts that filled calculator before onboarding flag existed.
    if (inferredCompleted && !alreadyCompleted) {
      await User.updateOne(
        { email },
        {
          $set: {
            onboardingCompleted: true,
            onboardingCompletedAt: new Date(),
            ...(Number((user as any).age) > 0 || !(latestCalorie as any)?.age
              ? {}
              : { age: (latestCalorie as any).age }),
            ...(Number((user as any).weight) > 0 || !(latestCalorie as any)?.weight
              ? {}
              : { weight: (latestCalorie as any).weight }),
            ...(Number((user as any).height) > 0 || !(latestCalorie as any)?.height
              ? {}
              : { height: (latestCalorie as any).height }),
            ...((user as any).gender || !(latestCalorie as any)?.gender
              ? {}
              : { gender: (latestCalorie as any).gender }),
            ...((user as any).activity || !(latestCalorie as any)?.activity
              ? {}
              : { activity: (latestCalorie as any).activity }),
            ...((user as any).goal || !(latestCalorie as any)?.goal
              ? {}
              : { goal: (latestCalorie as any).goal }),
          },
        }
      ).exec();
    }

    return NextResponse.json({
      onboardingCompleted: inferredCompleted,
      data: {
        age: (user as any).age ?? (latestCalorie as any)?.age ?? null,
        weight: (user as any).weight ?? (latestCalorie as any)?.weight ?? null,
        height: (user as any).height ?? (latestCalorie as any)?.height ?? null,
        gender: (user as any).gender ?? (latestCalorie as any)?.gender ?? null,
        activity: (user as any).activity ?? (latestCalorie as any)?.activity ?? null,
        goal: (user as any).goal ?? (latestCalorie as any)?.goal ?? null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load onboarding status";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const email = getEmail(req);
    if (!email) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const age = Number(body?.age);
    const weight = Number(body?.weight);
    const height = Number(body?.height);
    const gender = String(body?.gender ?? "") as Gender;
    const activity = String(body?.activity ?? "") as ActivityLevel;
    const goal = String(body?.goal ?? "") as Goal;

    if (
      !Number.isFinite(age) ||
      !Number.isFinite(weight) ||
      !Number.isFinite(height) ||
      age <= 0 ||
      weight <= 0 ||
      height <= 0
    ) {
      return NextResponse.json({ message: "Invalid age, weight, or height." }, { status: 400 });
    }
    if (!(gender === "male" || gender === "female")) {
      return NextResponse.json({ message: "Invalid gender." }, { status: 400 });
    }
    if (!(activity in activityFactors)) {
      return NextResponse.json({ message: "Invalid activity level." }, { status: 400 });
    }
    if (!(goal in goalAdjustments)) {
      return NextResponse.json({ message: "Invalid goal." }, { status: 400 });
    }

    const result = computeTargets({ age, weight, height, gender, activity, goal });
    await connectDB();

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          age,
          weight,
          height,
          gender,
          activity,
          goal,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date(),
        },
      },
      { new: true }
    ).lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await Calorie.create({
      userId: email,
      age,
      weight,
      height,
      gender,
      activity,
      goal,
      calories: result.calories,
      protein: result.protein,
      carbs: result.carbs,
      fat: result.fat,
    });

    return NextResponse.json({ message: "Onboarding saved", result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save onboarding";
    return NextResponse.json({ message }, { status: 500 });
  }
}

