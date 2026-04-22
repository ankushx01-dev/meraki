"use client";

import { useRouter } from "next/navigation";

export function AiCoachCta() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/signup")}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(239,68,68,0.24)] transition-all duration-300 hover:scale-105 hover:bg-red-600"
    >
      Try AI Coach
      <span aria-hidden="true">&gt;</span>
    </button>
  );
}
