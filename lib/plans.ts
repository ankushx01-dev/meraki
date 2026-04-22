export type PlanId = "free" | "pro" | "elite";

type PlanConfig = {
  id: PlanId;
  label: string;
  amountInPaise: number;
  currency: "INR";
};

export const PLAN_CONFIG: Record<PlanId, PlanConfig> = {
  free: { id: "free", label: "Free Plan", amountInPaise: 0, currency: "INR" },
  pro: { id: "pro", label: "Pro Plan", amountInPaise: 19900, currency: "INR" },
  elite: { id: "elite", label: "Elite Plan", amountInPaise: 49900, currency: "INR" },
};

export function normalizePlanId(raw: unknown): PlanId | null {
  const text = String(raw ?? "").trim().toLowerCase();
  if (text.includes("free")) return "free";
  if (text.includes("pro")) return "pro";
  if (text.includes("elite") || text.includes("premium")) return "elite";
  return null;
}

