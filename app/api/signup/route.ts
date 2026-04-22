import { connectDB } from "@/lib/db";
import { signupSchema } from "@/lib/validation";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const parsed = signupSchema.safeParse(payload);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { message: issue?.message || "Invalid signup details" },
        { status: 400 },
      );
    }
    const { name, email, password } = parsed.data;

    await connectDB();

    const exist = await User.findOne({ email });
    if (exist) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      onboardingCompleted: false,
      plan: "free",
      subscriptionStatus: "inactive",
    });

    return NextResponse.json({ message: "Signup successful" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
