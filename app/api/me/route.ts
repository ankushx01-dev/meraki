import { connectDB } from "@/lib/db";
import Calorie from "@/models/Calorie";
import User from "@/models/User";
import { NextResponse } from "next/server";

function getEmail(req: Request) {
  return req.headers.get("x-user-email") ?? "";
}

export async function GET(req: Request) {
  try {
    const email = getEmail(req);
    if (!email) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email })
      .select("name email weight height age gender activity goal onboardingCompleted plan subscriptionStatus")
      .lean();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // If profile fields aren't set yet, fall back to latest calculator save.
    if ((user as any).weight == null || (user as any).height == null) {
      const latest = await Calorie.findOne({ userId: email }).sort({ createdAt: -1 }).lean();
      if (latest) {
        const patched = {
          ...user,
          weight: (user as any).weight ?? (latest as any).weight,
          height: (user as any).height ?? (latest as any).height,
        };
        return NextResponse.json({ user: patched });
      }
    }

    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load profile";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const email = getEmail(req);
    if (!email) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const weight = body?.weight === "" || body?.weight == null ? undefined : Number(body.weight);
    const height = body?.height === "" || body?.height == null ? undefined : Number(body.height);

    if (weight !== undefined && (!Number.isFinite(weight) || weight <= 0)) {
      return NextResponse.json({ message: "Invalid weight" }, { status: 400 });
    }
    if (height !== undefined && (!Number.isFinite(height) || height <= 0)) {
      return NextResponse.json({ message: "Invalid height" }, { status: 400 });
    }

    await connectDB();
    const updated = await User.findOneAndUpdate(
      { email },
      {
        ...(name ? { name } : {}),
        ...(weight !== undefined ? { weight } : {}),
        ...(height !== undefined ? { height } : {}),
      },
      { new: true }
    )
      .select("name email weight height age gender activity goal onboardingCompleted plan subscriptionStatus")
      .lean();

    if (!updated) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Saved", user: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save profile";
    return NextResponse.json({ message }, { status: 500 });
  }
}

