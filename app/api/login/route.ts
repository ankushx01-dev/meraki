import { connectDB } from "@/lib/db";
import { loginSchema } from "@/lib/validation";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const parsed = loginSchema.safeParse(payload);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { message: issue?.message || "Invalid login details" },
        { status: 400 },
      );
    }
    const { email, password } = parsed.data;

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found, please signup first" },
        { status: 400 }
      );
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json({ message: "Wrong password" }, { status: 400 });
    }

    return NextResponse.json({ message: "Login success" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ message }, { status: 500 });
  }
}
