"use client";

import { useEffect, useMemo, useState } from "react";
import { Panel } from "@/components/dashboard/ui";
import { CircularProgress } from "@/components/dashboard/circular-progress";
import { CaloriesRing } from "@/components/dashboard/calories-ring";
import { useFitnessActivity } from "@/lib/fitness-activity";

type CalorieDoc = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
};

export function MacrosProgress() {
  const [data, setData] = useState<CalorieDoc | null>(null);
  const [consumed, setConsumed] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [error, setError] = useState("");
  const activity = useFitnessActivity();

  const userId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("meraki_auth") ?? "";
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const [planRes, intakeRes] = await Promise.all([
          fetch(`/api/calorie?userId=${encodeURIComponent(userId)}`),
          fetch(`/api/intake?userId=${encodeURIComponent(userId)}`),
        ]);

        const planJson = await planRes.json();
        const intakeJson = await intakeRes.json();

        if (!planRes.ok) throw new Error(planJson?.message);
        if (!intakeRes.ok) throw new Error(intakeJson?.message);

        if (!cancelled) {
          setData(planJson?.data ?? null);

          setConsumed({
            calories: Number(intakeJson?.total?.calories ?? 0),
            protein: Number(intakeJson?.total?.protein ?? 0),
            carbs: Number(intakeJson?.total?.carbs ?? 0),
            fat: Number(intakeJson?.total?.fat ?? 0),
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Error");
        }
      }
    }

    if (userId) run();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // 🎯 TARGETS
  const targets = {
    calories: Number(data?.calories ?? 0),
    protein: Number(data?.protein ?? 0),
    carbs: Number(data?.carbs ?? 0),
    fat: Number(data?.fat ?? 0),
  };

  // ✅ IMPORTANT FIX (NO Math.max)
  const remaining = {
    calories: targets.calories - consumed.calories,
    protein: targets.protein - consumed.protein,
    carbs: targets.carbs - consumed.carbs,
    fat: targets.fat - consumed.fat,
  };

  // 🔴 EXCEEDED
  const exceeded = {
    calories: remaining.calories < 0,
    protein: remaining.protein < 0,
    carbs: remaining.carbs < 0,
    fat: remaining.fat < 0,
  };

  // 🔴 EXCEEDED AMOUNT
  const exceededAmount = {
    calories: Math.abs(Math.min(0, remaining.calories)),
    protein: Math.abs(Math.min(0, remaining.protein)),
    carbs: Math.abs(Math.min(0, remaining.carbs)),
    fat: Math.abs(Math.min(0, remaining.fat)),
  };

  // ✅ DISPLAY
  const getStatus = (remain: number) => {
    if (remain < 0) return "Exceeded";
    if (remain === 0) return "Completed";
    return "Remaining";
  };

  return (
    <div className="space-y-6">
      {error && (
        <p className="text-sm font-medium text-red-500">{error}</p>
      )}

      {!error && !data && (
        <Panel className="bg-[#0b0f0c] p-6">
          <h2 className="font-semibold text-white">Today</h2>
          <p className="mt-2 text-sm text-gray-400">
            No saved plan. Go to calculator.
          </p>
        </Panel>
      )}

      {data && (
        <>
          {/* 🔥 CALORIES RING */}
          <CaloriesRing
            remaining={Math.max(0, remaining.calories)}
            goal={targets.calories}
            food={consumed.calories}
            streak={activity.currentStreak}
          />

          {/* 🔥 MACROS */}
          <Panel className="bg-[#0b0f0c] p-6">
            <h3 className="text-sm font-semibold text-white">Macros</h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <CircularProgress
                label="Protein"
                value={remaining.protein}
                max={targets.protein}
                color="#f59e0b"
                unit="g"
                status={getStatus(remaining.protein)}
                exceededAmount={exceededAmount.protein}
              />

              <CircularProgress
                label="Carbs"
                value={remaining.carbs}
                max={targets.carbs}
                color="#2dd4bf"
                unit="g"
                status={getStatus(remaining.carbs)}
                exceededAmount={exceededAmount.carbs}
              />

              <CircularProgress
                label="Fat"
                value={remaining.fat}
                max={targets.fat}
                color="#a855f7"
                unit="g"
                status={getStatus(remaining.fat)}
                exceededAmount={exceededAmount.fat}
              />

              <CircularProgress
                label="Calories"
                value={remaining.calories}
                max={targets.calories}
                color="#22c55e"
                unit="kcal"
                status={getStatus(remaining.calories)}
                exceededAmount={exceededAmount.calories}
              />
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
