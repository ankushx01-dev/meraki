"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ArrowRightIcon } from "@/components/home/icons";
import { Panel } from "@/components/dashboard/ui";
import {
  buildWeeklyWorkoutSchedule,
  getSelectedWorkoutDay,
  mergeWorkoutCalendarDays,
  startOfWorkoutWeek,
  workoutDateKey,
  type SavedWorkoutCalendarDay,
  type WorkoutScheduleDay,
} from "@/lib/workout-calendar";

export function TodaysWorkoutPlan() {
  const [data, setData] = useState<WorkoutScheduleDay | null>(() =>
    getSelectedWorkoutDay(buildWeeklyWorkoutSchedule(new Date())),
  );
  const [error, setError] = useState("");

  const userId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("meraki_auth") ?? "";
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadToday() {
      setError("");

      const baseSchedule = buildWeeklyWorkoutSchedule(new Date());
      const baseToday = getSelectedWorkoutDay(baseSchedule);

      if (!userId) {
        if (!cancelled) {
          setData(baseToday);
        }
        return;
      }

      try {
        const start = workoutDateKey(startOfWorkoutWeek(new Date()));
        const res = await fetch(
          `/api/workout-calendar?userId=${encodeURIComponent(userId)}&start=${encodeURIComponent(start)}`,
        );
        const json = (await res.json()) as {
          data?: SavedWorkoutCalendarDay[];
          message?: string;
        };

        if (!res.ok) {
          throw new Error(json.message ?? "Failed to load workout");
        }

        const merged = mergeWorkoutCalendarDays(baseSchedule, json.data ?? []);
        if (!cancelled) {
          setData(getSelectedWorkoutDay(merged));
        }
      } catch (issue) {
        if (!cancelled) {
          setData(baseToday);
          setError(issue instanceof Error ? issue.message : "Failed to load workout");
        }
      }
    }

    void loadToday();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#97f4b5]">
            Today&apos;s Workout
          </p>
          <h2 className="mt-3 font-brand text-3xl tracking-[-0.04em] text-white sm:text-4xl">
            {data ? `${data.workout} Day` : "Today’s plan"}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[#8fb4ff]">
            Your daily training focus always shows up on the dashboard, even before you customize
            the calendar.
          </p>
        </div>

        <Link
          href="/dashboard/calendar"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/[0.08]"
        >
          Manage Calendar
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {error ? <p className="mt-4 text-sm font-medium text-[#ff6b6d]">{error}</p> : null}

      {data ? (
        <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm text-[#8fb4ff]">
                {data.dayLabel}, {data.dateLabel}
              </p>
              <h3 className="mt-1 font-brand text-3xl tracking-[-0.04em] text-white">
                {data.workout} Day
              </h3>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#6f8877]">{data.focus}</p>
          </div>

          <p className="mt-3 text-sm leading-7 text-[#c8d3ca]">{data.summary}</p>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.exercises.map((exercise) => (
              <div
                key={exercise}
                className="rounded-[18px] border border-white/8 bg-[#111612] px-4 py-3 text-sm text-white shadow-[0_14px_34px_rgba(0,0,0,0.18)]"
              >
                {exercise}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
