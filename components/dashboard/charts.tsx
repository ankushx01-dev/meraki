"use client";

import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState, type ReactNode } from "react";

type ChartDatum = {
  label: string;
  value: number;
};

export type WeightProgressDatum = {
  date: string;
  label: string;
  weight: number;
  hasPR: boolean;
  prCount: number;
};

type LineChartProps = {
  data: ChartDatum[];
  min?: number;
  max?: number;
  color?: string;
  heightClassName?: string;
};

type BarChartProps = {
  data: ChartDatum[];
  max?: number;
  color?: string;
  heightClassName?: string;
};

type AreaTrendChartProps = {
  data: ChartDatum[];
  color?: string;
  heightClassName?: string;
};

type WeightProgressChartProps = {
  data: WeightProgressDatum[];
  color?: string;
  heightClassName?: string;
};

function ChartShell({
  children,
  heightClassName,
}: {
  children: ReactNode;
  heightClassName: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-full rounded-2xl bg-white/[0.02] ring-1 ring-white/8 ${heightClassName}`}
      />
    );
  }

  return (
    <div className={`w-full ${heightClassName}`}>
      <ResponsiveContainer width="100%" height="100%" minHeight={220}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart({ heightClassName }: { heightClassName: string }) {
  return (
    <div
      className={`flex w-full items-center justify-center rounded-2xl bg-white/[0.02] text-sm text-[#6f8877] ring-1 ring-white/8 ${heightClassName}`}
    >
      No data yet
    </div>
  );
}

function chartTooltipStyle() {
  return {
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: "12px",
    backgroundColor: "rgba(8,12,10,0.96)",
    color: "#eaf2ed",
    fontSize: "12px",
  };
}

export function BarChart({
  data,
  max,
  color = "#29d16d",
  heightClassName = "h-[15rem] sm:h-[17rem]",
}: BarChartProps) {
  if (data.length === 0) {
    return <EmptyChart heightClassName={heightClassName} />;
  }

  const yMax = Math.max(max ?? 0, ...data.map((item) => item.value), 1);

  return (
    <ChartShell heightClassName={heightClassName}>
      <RechartsBarChart
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 2 }}
      >
        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 7" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#8fb4ff", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
        />
        <YAxis
          domain={[0, yMax]}
          tick={{ fill: "#8fb4ff", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={chartTooltipStyle()}
        />
        <Bar
          dataKey="value"
          fill={color}
          radius={[9, 9, 2, 2]}
          isAnimationActive
          animationDuration={500}
        />
      </RechartsBarChart>
    </ChartShell>
  );
}

export function LineChart({
  data,
  min = 0,
  max,
  color = "#29d16d",
  heightClassName = "h-[15rem] sm:h-[17rem]",
}: LineChartProps) {
  if (data.length === 0) {
    return <EmptyChart heightClassName={heightClassName} />;
  }

  const computedMax = Math.max(max ?? 0, ...data.map((item) => item.value), min + 1);

  return (
    <ChartShell heightClassName={heightClassName}>
      <RechartsLineChart
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 2 }}
      >
        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 7" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#8fb4ff", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
        />
        <YAxis
          domain={[min, computedMax]}
          tick={{ fill: "#8fb4ff", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip contentStyle={chartTooltipStyle()} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          dot={{ r: 4, fill: color, stroke: "#0b0f0d", strokeWidth: 2 }}
          activeDot={{ r: 6, fill: color, stroke: "#0b0f0d", strokeWidth: 2 }}
          isAnimationActive
          animationDuration={500}
        />
      </RechartsLineChart>
    </ChartShell>
  );
}

export function AreaTrendChart({
  data,
  color = "#ff4d4f",
  heightClassName = "h-[15rem] sm:h-[17rem]",
}: AreaTrendChartProps) {
  if (data.length === 0) {
    return <EmptyChart heightClassName={heightClassName} />;
  }

  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <ChartShell heightClassName={heightClassName}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 2 }}
      >
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.45} />
            <stop offset="95%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 7" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#8fb4ff", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
        />
        <YAxis
          domain={[0, max]}
          tick={{ fill: "#8fb4ff", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip contentStyle={chartTooltipStyle()} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          fill="url(#trendFill)"
          isAnimationActive
          animationDuration={550}
        />
      </RechartsAreaChart>
    </ChartShell>
  );
}

export function WeightProgressChart({
  data,
  color = "#22c55e",
  heightClassName = "h-[15rem] sm:h-[17rem]",
}: WeightProgressChartProps) {
  if (data.length === 0) {
    return <EmptyChart heightClassName={heightClassName} />;
  }

  const max = Math.max(...data.map((item) => item.weight), 1);
  const min = Math.max(0, Math.min(...data.map((item) => item.weight), max) - 5);

  return (
    <ChartShell heightClassName={heightClassName}>
      <RechartsLineChart
        data={data}
        margin={{ top: 8, right: 8, left: 0, bottom: 2 }}
      >
        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 7" />
        <XAxis
          dataKey="label"
          tick={{ fill: "#8fb4ff", fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
        />
        <YAxis
          domain={[min, max + 5]}
          tick={{ fill: "#8fb4ff", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip
          contentStyle={chartTooltipStyle()}
          formatter={(value, _name, item) => {
            const payload = item.payload as WeightProgressDatum;
            const suffix = payload.hasPR ? ` (PR x${payload.prCount})` : "";
            return [`${value} kg${suffix}`, "Top set"];
          }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke={color}
          strokeWidth={3}
          isAnimationActive
          animationDuration={550}
          dot={(props: { cx?: number; cy?: number; payload?: WeightProgressDatum }) => {
            const { cx, cy, payload } = props;
            if (typeof cx !== "number" || typeof cy !== "number" || !payload) {
              return null;
            }
            const dotColor = payload.hasPR ? "#f59e0b" : color;
            const radius = payload.hasPR ? 5 : 4;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill={dotColor}
                stroke="#0b0f0d"
                strokeWidth={2}
              />
            );
          }}
          activeDot={{ r: 6, fill: "#f59e0b", stroke: "#0b0f0d", strokeWidth: 2 }}
        />
      </RechartsLineChart>
    </ChartShell>
  );
}

export function RadarChart({
  axes,
}: {
  axes: Array<{ label: string; value: number }>;
}) {
  const size = 360;
  const center = size / 2;
  const radius = 110;
  const levels = 4;

  const angleFor = (index: number) =>
    -Math.PI / 2 + (Math.PI * 2 * index) / axes.length;

  const polygon = axes
    .map((axis, index) => {
      const angle = angleFor(index);
      const x = center + Math.cos(angle) * radius * axis.value;
      const y = center + Math.sin(angle) * radius * axis.value;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      aria-hidden="true"
      className="mx-auto h-[16rem] w-full max-w-[20rem]"
      fill="none"
      viewBox={`0 0 ${size} ${size}`}
    >
      {Array.from({ length: levels }).map((_, levelIndex) => {
        const level = (levels - levelIndex) / levels;
        const points = axes
          .map((_, index) => {
            const angle = angleFor(index);
            const x = center + Math.cos(angle) * radius * level;
            const y = center + Math.sin(angle) * radius * level;
            return `${x},${y}`;
          })
          .join(" ");

        return (
          <polygon
            key={level}
            points={points}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        );
      })}

      {axes.map((axis, index) => {
        const angle = angleFor(index);
        const x = center + Math.cos(angle) * radius;
        const y = center + Math.sin(angle) * radius;
        const labelX = center + Math.cos(angle) * (radius + 24);
        const labelY = center + Math.sin(angle) * (radius + 24);

        return (
          <g key={axis.label}>
            <line
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
            />
            <text
              x={labelX}
              y={labelY}
              fill="#8fb4ff"
              fontSize="12"
              textAnchor="middle"
            >
              {axis.label}
            </text>
          </g>
        );
      })}

      <polygon
        points={polygon}
        fill="rgba(41,209,109,0.35)"
        stroke="#29d16d"
        strokeWidth="2"
      />
      {axes.map((axis, index) => {
        const angle = angleFor(index);
        const x = center + Math.cos(angle) * radius * axis.value;
        const y = center + Math.sin(angle) * radius * axis.value;

        return <circle key={`${axis.label}-point`} cx={x} cy={y} r="4" fill="#29d16d" />;
      })}
    </svg>
  );
}
