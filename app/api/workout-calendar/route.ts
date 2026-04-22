import { connectDB } from "@/lib/db";
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") ?? "";
    const start = searchParams.get("start") ?? "";

    if (!userId || !start) {
      return NextResponse.json({ message: "Missing userId/start" }, { status: 400 });
    }

    await connectDB();

    const startDate = new Date(`${start}T00:00:00`);
    const endDate = addDays(startDate, 6);
    const docs = await WorkoutCalendar.find({
      userId,
      dateKey: { $gte: key(startDate), $lte: key(endDate) },
    })
      .select("dateKey workout focus summary exercises")
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
    const dateKey = String(body?.dateKey ?? "");
    const workout = String(body?.workout ?? "").trim();
    const focus = String(body?.focus ?? "").trim();
    const summary = String(body?.summary ?? "").trim();
    const exercises = Array.isArray(body?.exercises)
      ? body.exercises.map((v: unknown) => String(v).trim()).filter(Boolean)
      : [];

    if (!userId || !dateKey || !workout) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const updated = await WorkoutCalendar.findOneAndUpdate(
      { userId, dateKey },
      { $set: { userId, dateKey, workout, focus, summary, exercises } },
      { upsert: true, new: true }
    )
      .select("dateKey workout focus summary exercises")
      .lean();

    return NextResponse.json({ message: "Saved", data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error saving workout calendar";
    return NextResponse.json({ message }, { status: 500 });
  }
}

