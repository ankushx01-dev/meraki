import { connectDB } from "@/lib/db";
import WorkoutSession from "@/models/WorkoutSession";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = String(searchParams.get("userId") ?? "");
    const dateKey = String(searchParams.get("dateKey") ?? "");
    if (!userId || !dateKey) {
      return NextResponse.json({ message: "Missing userId/dateKey" }, { status: 400 });
    }

    await connectDB();
    const doc = await WorkoutSession.findOne({ userId, dateKey }).lean();
    return NextResponse.json({ data: doc ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error fetching session";
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
      return NextResponse.json({ message: "Missing userId/dateKey" }, { status: 400 });
    }

    await connectDB();
    const updated = await WorkoutSession.findOneAndUpdate(
      { userId, dateKey },
      { $set: { userId, dateKey, exercises } },
      { upsert: true, new: true }
    ).lean();
    return NextResponse.json({ message: "Saved", data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error saving session";
    return NextResponse.json({ message }, { status: 500 });
  }
}

