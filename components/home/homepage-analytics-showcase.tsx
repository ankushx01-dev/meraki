"use client";

import { LineChart } from "@/components/dashboard/charts";

const progressOverviewData = [
  { label: "Jan", value: 62 },
  { label: "Feb", value: 68 },
  { label: "Mar", value: 71 },
  { label: "Apr", value: 76 },
  { label: "May", value: 84 },
  { label: "Jun", value: 90 },
];

const monthlyVolumePreview = {
  lastMonthVolume: 1000,
  currentMonthVolume: 1120,
};

export function HomepageAnalyticsShowcase() {
  const { currentMonthVolume, lastMonthVolume } = monthlyVolumePreview;
  const growth =
    ((currentMonthVolume - lastMonthVolume) / lastMonthVolume) * 100;
  const roundedGrowth = Math.round(growth);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border border-red-500/10 bg-neutral-900 p-6 transition-all duration-300 hover:border-red-500/30">
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
            Progress Overview
          </h3>
          <p className="mt-2 text-sm text-neutral-400">
            Track your consistency and strength growth
          </p>
        </div>

        <div className="mt-6">
          <LineChart
            data={progressOverviewData}
            min={58}
            max={94}
            color="#ef4444"
            heightClassName="h-[16rem] sm:h-[18rem]"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-red-500/10 bg-neutral-900 p-6 transition-all duration-300 hover:border-red-500/30">
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
            AI Coach Insights
          </h3>
          <p className="mt-2 text-sm text-neutral-400">
            Structured feedback from your training trend preview
          </p>
        </div>

        <div className="space-y-1 rounded-xl bg-black/20 p-4">
          <p className="text-sm text-neutral-400">Growth</p>
          <p className="text-white">
            Your strength has increased by {roundedGrowth}% this month.
          </p>
        </div>

        <div className="space-y-1 rounded-xl bg-black/20 p-4">
          <p className="text-sm text-neutral-400">Consistency</p>
          <p className="text-white">
            You completed 5 out of 7 workouts this week.
          </p>
        </div>

        <div className="space-y-1 rounded-xl bg-black/20 p-4">
          <p className="text-sm text-neutral-400">Recommendation</p>
          <p className="text-white">
            Increase training intensity gradually to avoid plateau.
          </p>
        </div>
      </div>
    </div>
  );
}
