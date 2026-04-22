import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { normalizePlanId } from "@/lib/plans";
import Subscription from "@/models/Subscription";
import { NextResponse } from "next/server";

function verifySignature({
  orderId,
  paymentId,
  signature,
  secret,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

export async function POST(req: Request) {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
    if (!secret) {
      return NextResponse.json({ message: "Razorpay secret missing in environment." }, { status: 500 });
    }

    const body = await req.json();
    const userId = String(body?.userId ?? "").trim();
    const planId = normalizePlanId(body?.planId);
    const orderId = String(body?.razorpay_order_id ?? "").trim();
    const paymentId = String(body?.razorpay_payment_id ?? "").trim();
    const signature = String(body?.razorpay_signature ?? "").trim();

    if (!userId || !planId || !orderId || !paymentId || !signature) {
      return NextResponse.json({ message: "Missing payment verification fields." }, { status: 400 });
    }

    const valid = verifySignature({
      orderId,
      paymentId,
      signature,
      secret,
    });
    if (!valid) {
      return NextResponse.json({ message: "Invalid payment signature." }, { status: 400 });
    }

    await connectDB();
    await Subscription.findOneAndUpdate(
      { razorpayOrderId: orderId },
      {
        $set: {
          userId,
          planId,
          status: "paid",
          razorpayPaymentId: paymentId,
          paidAt: new Date(),
        },
      },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ message: "Payment verified", planId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to verify payment";
    return NextResponse.json({ message }, { status: 500 });
  }
}

