import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { createCompletionEntryFromDateKey } from "@/lib/streak-utils";
import WorkoutCalendar from "@/models/WorkoutCalendar";

type CompletedDayDoc = {
  dateKey?: string;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = String(searchParams.get("userId") ?? "").trim();

    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    await connectDB();

    const completedDocs =
      ((await WorkoutCalendar.find({ userId, completed: true }).select("dateKey").lean()) as
        | CompletedDayDoc[]
        | null) ?? [];
    const completedDates = completedDocs
      .map((doc) => String(doc.dateKey ?? "").trim())
      .filter(Boolean)
      .filter((dateKey, index, values) => values.indexOf(dateKey) === index)
      .sort();

    return NextResponse.json({
      entries: completedDates.map((dateKey) => createCompletionEntryFromDateKey(dateKey)),
      completedDates,
      totalCompletedDays: completedDates.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load streak";
    return NextResponse.json({ message }, { status: 500 });
  }
}
