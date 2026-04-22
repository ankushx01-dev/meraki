import { connectDB } from "@/lib/db";
import Calorie from "@/models/Calorie";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    await connectDB();

    const latest = await Calorie.findOne(userId ? { userId } : {})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: latest ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error fetching";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await connectDB();

    const data = await Calorie.create(body);

    // Keep User profile in sync with latest calculator inputs.
    // userId is currently the user's email (stored in localStorage as meraki_auth).
    const userEmail = typeof body?.userId === "string" ? body.userId : "";
    const weight = body?.weight == null ? undefined : Number(body.weight);
    const height = body?.height == null ? undefined : Number(body.height);
    if (
      userEmail &&
      typeof weight === "number" &&
      Number.isFinite(weight) &&
      weight > 0
    ) {
      await User.updateOne({ email: userEmail }, { $set: { weight } }).exec();
    }
    if (
      userEmail &&
      typeof height === "number" &&
      Number.isFinite(height) &&
      height > 0
    ) {
      await User.updateOne({ email: userEmail }, { $set: { height } }).exec();
    }

    return NextResponse.json({ message: "Saved", data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error saving";
    return NextResponse.json({ message }, { status: 500 });
  }
}

