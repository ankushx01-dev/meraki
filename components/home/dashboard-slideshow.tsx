"use client";

import { useState } from "react";

const dashboardSlides = [
  {
    title: "Weight Progress",
    subtitle: "Your weight over the last 12 weeks",
    chart: "weight",
  },
  {
    title: "Strength Progress",
    subtitle: "Weekly max lifts by exercise",
    chart: "strength",
  },
  {
    title: "Weekly Activity",
    subtitle: "Workouts and calories by week",
    chart: "activity",
  },
];

function WeightChart() {
  return (
    <div className="h-full w-full flex items-center justify-center rounded-[20px] bg-[#08120c] p-4 shadow-inner">
      <svg viewBox="0 0 300 180" className="h-full w-full">
        <defs>
          <linearGradient id="weight-chart-gradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>
        </defs>
        <g stroke="#334155" strokeWidth="1">
          {[40, 80, 120, 160].map((y) => (
            <line key={y} x1="20" x2="280" y1={y} y2={y} />
          ))}
        </g>
        <path
          d="M20 140 C80 110 120 100 170 90 C210 85 240 80 280 60"
          fill="none"
          stroke="url(#weight-chart-gradient)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {[
          { x: 20, y: 140 },
          { x: 80, y: 110 },
          { x: 120, y: 100 },
          { x: 170, y: 90 },
          { x: 210, y: 85 },
          { x: 240, y: 80 },
          { x: 280, y: 60 },
        ].map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="#22c55e"
            stroke="#d9f99d"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  );
}

function StrengthChart() {
  const bars = [
    { label: "Bench", value: 72 },
    { label: "Squat", value: 88 },
    { label: "Deadlift", value: 98 },
    { label: "OHP", value: 58 },
  ];

  return (
    <div className="h-full w-full flex items-center justify-center rounded-[20px] bg-[#08120c] p-4 shadow-inner">
      <div className="grid h-full grid-cols-4 gap-3">
        {bars.map((bar) => (
          <div key={bar.label} className="flex flex-col items-center gap-3">
            <div className="relative flex h-full w-full items-end overflow-hidden rounded-full bg-[#152a20]">
              <div
                className="w-full rounded-full bg-gradient-to-t from-[#16a34a] to-[#86efac]"
                style={{ height: `${bar.value}%` }}
              />
            </div>
            <span className="text-white/70 text-xs">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyActivityChart() {
  const weeks = [
    { label: "W1", value: 50 },
    { label: "W2", value: 68 },
    { label: "W3", value: 42 },
    { label: "W4", value: 82 },
  ];

  return (
    <div className="h-full w-full flex items-center justify-center rounded-[20px] bg-[#08120c] p-4 shadow-inner">
      <div className="flex h-full items-end justify-between gap-3">
        {weeks.map((week) => (
          <div key={week.label} className="flex w-full flex-col items-center gap-3">
            <div className="flex h-48 w-full items-end overflow-hidden rounded-3xl bg-[#152a20]">
              <div
                className="w-full rounded-3xl bg-gradient-to-t from-[#16a34a] to-[#86efac]"
                style={{ height: `${week.value}%` }}
              />
            </div>
            <span className="text-[0.68rem] text-white/60">{week.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSlideshow() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md p-8 w-[520px] h-[420px]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[#97e4b7]">Dashboard preview</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{dashboardSlides[activeSlide].title}</h3>
        </div>
        <span className="inline-flex items-center rounded-full border border-white/10 bg-[#0f1b15] px-3 py-2 text-xs text-[#a7f3d0]">
          Live data
        </span>
      </div>

      <div className="relative overflow-hidden rounded-[24px] bg-[#06110d] p-5">
        {dashboardSlides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-all duration-500 ${
              index === activeSlide ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-white/80 text-sm mb-4">{slide.subtitle}</p>

              <div className="mt-4 h-[300px] w-full flex items-center justify-center">
                {slide.chart === "weight" && <WeightChart />}
                {slide.chart === "strength" && (
                  <img
                    src="/radar-chart.svg"
                    alt="Strength Radar"
                    className="w-[260px] h-auto"
                  />
                )}
                {slide.chart === "activity" && <WeeklyActivityChart />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {dashboardSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition ${
                activeSlide === index ? "w-8 bg-[#22c55e]" : "w-3 bg-white/20"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSlide((current) => (current - 1 + dashboardSlides.length) % dashboardSlides.length)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
            aria-label="Previous slide"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setActiveSlide((current) => (current + 1) % dashboardSlides.length)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
            aria-label="Next slide"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
