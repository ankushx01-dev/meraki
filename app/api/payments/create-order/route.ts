import Razorpay from "razorpay";
import { connectDB } from "@/lib/db";
import { normalizePlanId, PLAN_CONFIG } from "@/lib/plans";
import Subscription from "@/models/Subscription";
import { NextResponse } from "next/server";

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID ?? "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";
  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys missing in environment.");
  }
  return {
    keyId,
    client: new Razorpay({ key_id: keyId, key_secret: keySecret }),
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = String(body?.userId ?? "").trim();
    const planId = normalizePlanId(body?.planId);

    if (!userId) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }
    if (!planId) {
      return NextResponse.json({ message: "Invalid plan" }, { status: 400 });
    }

    const plan = PLAN_CONFIG[planId];
    if (plan.amountInPaise <= 0) {
      return NextResponse.json({ message: "Free plan does not require payment" }, { status: 400 });
    }

    const { keyId, client } = getRazorpayClient();
    const order = await client.orders.create({
      amount: plan.amountInPaise,
      currency: plan.currency,
      receipt: `${plan.id}-${Date.now()}`,
      notes: {
        userId,
        planId: plan.id,
      },
    });

    await connectDB();
    await Subscription.create({
      userId,
      planId: plan.id,
      status: "created",
      amount: plan.amountInPaise,
      currency: plan.currency,
      razorpayOrderId: order.id,
    });

    return NextResponse.json({
      keyId,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      plan: {
        id: plan.id,
        label: plan.label,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create payment order";
    return NextResponse.json({ message }, { status: 500 });
  }
}

