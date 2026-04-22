"use client";

import { useState } from "react";

const slides = [
  {
    title: "Weight Progress",
    subtitle: "Your body metrics and momentum over time",
    type: "weight",
  },
  {
    title: "Strength Progress",
    subtitle: "Weekly max lifts by exercise",
    type: "strength",
  },
  {
    title: "Muscle Group Analysis",
    subtitle: "Relative strength by muscle group",
    type: "radar",
  },
  {
    title: "Weekly Activity",
    subtitle: "Workouts and calories by week",
    type: "activity",
  },
] as const;

function WeightProgressChart() {
  const points = [
    { x: 40, y: 170 },
    { x: 120, y: 150 },
    { x: 200, y: 130 },
    { x: 280, y: 100 },
    { x: 340, y: 70 },
  ];

  return (
    <div className="w-full rounded-3xl bg-neutral-900/70 p-6">
      <svg viewBox="0 0 400 220" className="h-[220px] w-full">
        <defs>
          <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.28)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
          </linearGradient>
        </defs>

        <path
          d="M0 180 C100 170 150 150 200 130 C260 110 300 90 380 70 L380 220 L0 220 Z"
          fill="rgba(239, 68, 68, 0.15)"
        />

        <path
          d="M0 180 C100 170 150 150 200 130 C260 110 300 90 380 70 L380 220 L0 220 Z"
          fill="url(#redGradient)"
        />

        <path
          d="M0 180 C100 170 150 150 200 130 C260 110 300 90 380 70"
          fill="none"
          stroke="#ef4444"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="#ef4444"
            stroke="#171717"
            strokeWidth="3"
          />
        ))}

        <g fill="#a3a3a3" fontSize="10" className="opacity-55">
          <text x="40" y="205">Jan</text>
          <text x="120" y="205">Feb</text>
          <text x="200" y="205">Mar</text>
          <text x="280" y="205">Apr</text>
        </g>
      </svg>
    </div>
  );
}

function StrengthProgressChart() {
  const bars = [
    { label: "Bench", value: 50, weight: "100" },
    { label: "Squat", value: 75, weight: "150" },
    { label: "Deadlift", value: 100, weight: "200" },
  ];

  return (
    <div className="flex w-full max-w-[520px] flex-wrap items-end justify-between gap-x-10 gap-y-10 px-2 sm:flex-nowrap sm:justify-center sm:gap-12 md:gap-16">
      {bars.map((bar) => (
        <div key={bar.label} className="flex flex-col items-center gap-4">
          <div className="flex h-[240px] items-end gap-3">
            <div className="flex h-full flex-col justify-end pb-2">
              <span className="text-xl font-black leading-none text-red-400 md:text-2xl">
                {bar.weight}
                <span className="ml-0.5 text-[10px] uppercase tracking-tighter opacity-50">
                  kg
                </span>
              </span>
            </div>

            <div className="flex h-full w-12 items-end overflow-hidden rounded-full border border-red-500/10 bg-white/5 md:w-16">
              <div
                className="w-full rounded-full bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-1000"
                style={{ height: `${bar.value}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/40">
            {bar.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function RadarProgressChart() {
  const data = [
    { label: "Chest", value: 90 },
    { label: "Back", value: 75 },
    { label: "Legs", value: 80 },
    { label: "Shoulders", value: 65 },
    { label: "Arms", value: 70 },
  ];

  const center = 100;
  const radius = 70;

  const getPoint = (value: number, index: number) => {
    const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
    const scaledRadius = (value / 100) * radius;
    return {
      x: center + scaledRadius * Math.cos(angle),
      y: center + scaledRadius * Math.sin(angle),
    };
  };

  const points = data.map((item, index) => getPoint(item.value, index));
  const polygonPoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg viewBox="0 0 200 200" className="h-[350px] w-[350px]">
        {[20, 40, 60, 80].map((ring) => (
          <circle
            key={ring}
            cx={center}
            cy={center}
            r={(ring / 100) * radius}
            fill="none"
            stroke="white"
            strokeOpacity="0.08"
          />
        ))}

        {data.map((_, index) => {
          const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="white"
              strokeOpacity="0.1"
            />
          );
        })}

        <polygon
          points={polygonPoints}
          fill="rgba(239, 68, 68, 0.2)"
          stroke="#ef4444"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="4" fill="#ef4444" />
        ))}

        {data.map((item, index) => {
          const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
          const x = center + (radius + 25) * Math.cos(angle);
          const y = center + (radius + 25) * Math.sin(angle);

          return (
            <text
              key={item.label}
              x={x}
              y={y}
              textAnchor="middle"
              fill="white"
              fontSize="10"
              className="font-bold opacity-70"
            >
              {item.label} {item.value}%
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function WeeklyActivityChart() {
  const data = [40, 70, 55, 90, 65, 80, 100];

  return (
    <div className="flex h-[300px] w-full items-end justify-between gap-3 px-4">
      {data.map((value, index) => (
        <div
          key={index}
          className="flex h-full flex-1 flex-col items-center justify-end gap-4"
        >
          <div className="flex h-full w-full items-end overflow-hidden rounded-2xl border border-red-500/10 bg-white/5">
            <div
              className="w-full rounded-2xl bg-red-500/80 transition-all duration-700"
              style={{ height: `${value}%` }}
            />
          </div>
          <span className="text-[10px] font-bold uppercase text-white/30">
            Wk {index + 1}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ProgressSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((index) => (index + 1) % slides.length);
  const prev = () =>
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length);

  return (
    <div className="w-full max-w-full">
      <div className="relative flex min-h-[560px] w-full flex-col overflow-hidden rounded-[2.5rem] border border-red-500/10 bg-neutral-900/85 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.42)] transition-all duration-300 sm:p-8 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.14),_transparent_48%)] opacity-90" />

        <div className="relative mb-12 flex items-start justify-between gap-6">
          <div>
            <h3 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
              {slides[activeIndex].title}
            </h3>
            <p className="text-base font-medium tracking-wide text-red-300">
              {slides[activeIndex].subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-red-500/15 bg-red-500/10 px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
              Live Sync
            </span>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[2.25rem] border border-red-500/10 bg-black/35 p-5 sm:p-8">
          {slides[activeIndex].type === "weight" && <WeightProgressChart key="weight" />}
          {slides[activeIndex].type === "strength" && (
            <StrengthProgressChart key="strength" />
          )}
          {slides[activeIndex].type === "radar" && <RadarProgressChart key="radar" />}
          {slides[activeIndex].type === "activity" && (
            <WeeklyActivityChart key="activity" />
          )}
        </div>

        <div className="relative mt-10 flex items-center justify-between gap-6">
          <div className="flex gap-3">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                aria-label={`Show ${slide.title}`}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-12 bg-red-400 shadow-[0_0_18px_rgba(239,68,68,0.35)]"
                    : "w-3 bg-white/10 hover:bg-red-400/50"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              aria-label="Previous chart"
              onClick={prev}
              className="group flex h-14 w-14 items-center justify-center rounded-full border border-red-500/15 bg-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 active:scale-95"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/40 transition-all duration-300 group-hover:text-neutral-950"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Next chart"
              onClick={next}
              className="group flex h-14 w-14 items-center justify-center rounded-full border border-red-500/15 bg-white/5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 active:scale-95"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/40 transition-all duration-300 group-hover:text-neutral-950"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
