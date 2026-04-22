"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { normalizePlanId, PlanId } from "@/lib/plans";

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

async function ensureRazorpayScript() {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout script."));
    document.body.appendChild(script);
  });

  return Boolean(window.Razorpay);
}

type PlanCheckoutButtonProps = {
  planId: string;
  className: string;
  children: React.ReactNode;
};

export function PlanCheckoutButton({
  planId,
  className,
  children,
}: PlanCheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    const normalizedPlan = normalizePlanId(planId) as PlanId | null;
    if (!normalizedPlan) {
      window.alert("Invalid plan selected.");
      return;
    }

    const userId =
      typeof window !== "undefined"
        ? window.localStorage.getItem("meraki_auth") ?? ""
        : "";

    if (!userId) {
      router.push(`/signup?tab=signup&plan=${normalizedPlan}`);
      return;
    }

    if (normalizedPlan === "free") {
      window.alert("Free plan is already available. You can continue using it now.");
      return;
    }

    try {
      setLoading(true);
      const loaded = await ensureRazorpayScript();
      if (!loaded || !window.Razorpay) {
        throw new Error("Razorpay is unavailable right now.");
      }

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planId: normalizedPlan }),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderJson?.message ?? "Failed to initialize payment.");
      }

      const razorpay = new window.Razorpay({
        key: orderJson.keyId,
        amount: orderJson?.order?.amount,
        currency: orderJson?.order?.currency,
        name: "Meraki",
        description: `${orderJson?.plan?.label ?? "Plan"} subscription`,
        order_id: orderJson?.order?.id,
        theme: { color: "#ff4d4f" },
        prefill: {
          email: userId,
        },
        handler: async (response: RazorpaySuccess) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              planId: normalizedPlan,
              ...response,
            }),
          });
          const verifyJson = await verifyRes.json();
          if (!verifyRes.ok) {
            window.alert(verifyJson?.message ?? "Payment verification failed.");
            return;
          }
          window.alert("Payment successful. Your subscription is now active.");
          router.push("/dashboard/plans");
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });

      razorpay.open();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not start payment.";
      window.alert(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" className={className} onClick={handleCheckout} disabled={loading}>
      {loading ? "Processing..." : children}
    </button>
  );
}

