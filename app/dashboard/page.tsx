"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { HelpIcon } from "@/components/dashboard/icons";
import { BarChart, LineChart } from "@/components/dashboard/charts";
import { MacrosProgress } from "@/components/dashboard/macros-progress";
import { TodaysWorkoutPlan } from "@/components/dashboard/todays-workout-plan";
import { PageIntro, Panel } from "@/components/dashboard/ui";

type ChartDatum = {
  label: string;
  value: number;
};

function firstNameFromUser(name: unknown, emailFallback: string) {
  const raw = typeof name === "string" ? name.trim() : "";
  if (raw) {
    return raw.split(/\s+/)[0] ?? raw;
  }
  const local = emailFallback.includes("@")
    ? emailFallback.split("@")[0] ?? emailFallback
    : emailFallback;
  return local.replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DashboardPage() {
  const [welcomeName, setWelcomeName] = useState("");
  const [yearlyTrend, setYearlyTrend] = useState<ChartDatum[]>([]);
  const [strengthSnapshot, setStrengthSnapshot] = useState<ChartDatum[]>([]);

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("meraki_auth") || ""
      : "";

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    fetch("/api/me", { headers: { "x-user-email": userId } })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const n = firstNameFromUser(data?.user?.name, userId);
        setWelcomeName(n);
      })
      .catch(() => {
        if (!cancelled) setWelcomeName(firstNameFromUser("", userId));
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (welcomeName) {
      document.title = `Welcome back, ${welcomeName} | Meraki`;
    } else {
      document.title = "Dashboard | Meraki";
    }
  }, [welcomeName]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    fetch(`/api/progress?userId=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setYearlyTrend(Array.isArray(data?.yearlyTrend) ? data.yearlyTrend : []);
        setStrengthSnapshot(
          Array.isArray(data?.strengthByLift) ? data.strengthByLift : [],
        );
      })
      .catch(() => {
        if (!cancelled) {
          setYearlyTrend([]);
          setStrengthSnapshot([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const trendMin = Math.max(
    0,
    Math.min(...yearlyTrend.map((d) => d.value), 100) - 5,
  );
  const trendMax = Math.min(
    100,
    Math.max(...yearlyTrend.map((d) => d.value), 0) + 5,
  );
  const strengthMax = Math.max(...strengthSnapshot.map((d) => d.value), 10);

  return (
    <div className="space-y-6">
      <PageIntro
        title={welcomeName ? `Welcome back, ${welcomeName}` : "Dashboard"}
        description="Here's your fitness overview."
        actions={
          <Link
            href="/ai-doubt"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff4d4f] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(255,77,79,0.24)] transition hover:bg-[#ff5f61]"
          >
            <HelpIcon className="h-4 w-4" />
            Ask AI Coach
          </Link>
        }
      />

      <TodaysWorkoutPlan />
      <MacrosProgress />

      <div className="grid gap-6 xl:grid-cols-[1.08fr_1fr]">
        <Panel>
          <h2 className="font-semibold text-white">Yearly Completion Trend</h2>
          <p className="mt-1 text-sm text-[#8fb4ff]">
            Combined score from workouts and diet consistency
          </p>
          <div className="mt-5">
            <LineChart
              data={yearlyTrend}
              min={trendMin}
              max={trendMax}
              color="#ff4d4f"
            />
          </div>
        </Panel>

        <Panel>
          <h2 className="font-semibold text-white">Monthly Strength Snapshot</h2>
          <p className="mt-1 text-sm text-[#8fb4ff]">
            Strength + workout output from your backend logs
          </p>
          <div className="mt-5">
            <BarChart data={strengthSnapshot} max={strengthMax} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
