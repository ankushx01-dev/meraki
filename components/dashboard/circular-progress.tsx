"use client";

import { cx } from "@/components/dashboard/ui";

export function CircularProgress({
  label,
  value,
  max,
  color,
  unit,
  status,
  exceededAmount,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  unit: string;
  status?: string;
  exceededAmount?: number;
}) {
  const size = 112;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress =
    max > 0 ? Math.min(1, Math.max(0, (max - value) / max)) : 0;

  const dashOffset = circumference * (1 - progress);

  const remaining = Math.round(value);

  return (
    <div className="rounded-[22px] bg-white/[0.03] px-5 py-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)] ring-1 ring-white/10">
      <p className="text-sm font-medium text-[#c3d1f2]">{label}</p>

      <div className="mt-4 flex items-center gap-4">
        {/* 🔵 CIRCLE */}
        <div className="relative">
          <svg width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth={stroke}
              fill="transparent"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={status === "Exceeded" ? "#ef4444" : color}
              strokeWidth={stroke}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>

          {/* CENTER */}
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-xl font-bold text-white">
                {status === "Exceeded"
                  ? `+${exceededAmount}`
                  : remaining}
              </p>
              <p className="text-xs text-white/50">
                / {max}
                {unit}
              </p>
            </div>
          </div>
        </div>

        {/* TEXT */}
        <div>
          {status === "Exceeded" ? (
            <p className="text-red-500 font-semibold text-sm">
              +{exceededAmount}
              {unit} exceeded
            </p>
          ) : status === "Completed" ? (
            <p className="text-green-500 font-semibold text-sm">
              Completed ✅
            </p>
          ) : (
            <p className="text-white text-sm">
              {remaining}
              {unit} left
            </p>
          )}

          <p className="text-xs text-white/50 mt-1">
            Based on your latest saved plan.
          </p>
        </div>
      </div>
    </div>
  );
}