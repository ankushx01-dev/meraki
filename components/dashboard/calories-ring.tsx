"use client";

import { Panel, cx } from "@/components/dashboard/ui";

export function CaloriesRing({
  remaining,
  goal,
  food = 0,
  streak = 0,
}: {
  remaining: number;
  goal: number;
  food?: number;
  streak?: number;
}) {
  const size = 210;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = goal > 0 ? Math.min(1, Math.max(0, remaining / goal)) : 0;
  const dashOffset = circumference * (1 - progress);

  return (
    <Panel className="bg-[#0b0f0c] p-6 shadow-[0_24px_65px_rgba(0,0,0,0.32)] ring-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Today</h2>
          <p className="mt-1 text-sm text-[#8fb4ff]">
            Remaining = Goal − Food
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="flex justify-center">
          <div className="relative">
            <svg width={size} height={size}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={stroke}
                fill="transparent"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#f59e0b"
                strokeWidth={stroke}
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div className="px-2 leading-none">
                <p className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {remaining.toLocaleString()}
                </p>
                <p className="mt-2 text-sm font-semibold text-white/55">
                  / {goal.toLocaleString()} kcal
                </p>
                <p className="mt-1 text-xs font-medium text-white/50">Remaining</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <StatRow label="Base Goal" value={goal} icon="flag" />
          <StatRow label="Food" value={food} icon="fork" />
          <StatRow label="Streak" value={streak} icon="flame" />
        </div>
      </div>
    </Panel>
  );
}

function StatRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: "flag" | "fork" | "flame";
}) {
  const iconLabel = icon === "flag" ? "🏁" : icon === "fork" ? "🍴" : "🔥";
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-white/10">
      <div className="flex items-center gap-3">
        <span
          className={cx(
            "grid h-9 w-9 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/10"
          )}
        >
          {iconLabel}
        </span>
        <p className="text-sm font-medium text-[#c3d1f2]">{label}</p>
      </div>
      <p className="text-lg font-semibold tabular-nums text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
