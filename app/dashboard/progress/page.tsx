"use client";

import { useMemo, useState } from "react";

import {
  AreaTrendChart,
  BarChart,
  WeightProgressChart,
} from "@/components/dashboard/charts";
import { PageIntro, Panel } from "@/components/dashboard/ui";
import {
  CalendarIcon,
  CheckCircleIcon,
  FlameIcon,
  ProgressIcon,
} from "@/components/dashboard/icons";
import { useWorkoutHistory } from "@/components/providers/workout-history-provider";
import { useFitnessActivity } from "@/lib/fitness-activity";

export default function ProgressPage() {
  const activity = useFitnessActivity();
  const {
    loading,
    workoutHistory,
    monthlySnapshot,
    monthlyStrengthData,
    yearlyCompletionData,
    exerciseOptions,
    getWeightProgressData,
  } = useWorkoutHistory();
  const [selectedExercisePreference, setSelectedExercisePreference] = useState("");
  const selectedExercise = exerciseOptions.includes(selectedExercisePreference)
    ? selectedExercisePreference
    : exerciseOptions[0] ?? "";

  const weightProgressData = useMemo(
    () =>
      selectedExercise ? getWeightProgressData(selectedExercise) : [],
    [getWeightProgressData, selectedExercise],
  );

  const hasWorkoutData = workoutHistory.length > 0;
  const weeklyConsistencyLabel = `${activity.weeklyCompletedCount}/7 days`;
  const completionPercent = `${activity.weeklyCompletionPercentage}%`;
  const completedWorkoutDaysThisYear = yearlyCompletionData.reduce(
    (sum, month) => sum + month.value,
    0,
  );
  const totalPrCount = workoutHistory.reduce(
    (sum, session) =>
      sum +
      session.exercises.reduce(
        (exerciseSum, exercise) =>
          exerciseSum + exercise.sets.filter((set) => set.isPR).length,
        0,
      ),
    0,
  );

  return (
    <div className="space-y-6">
      <PageIntro
        title="Progress Dashboard"
        description="Your saved workouts now power every stat and graph in real time."
      />

      {loading ? (
        <Panel>
          <p className="text-sm text-[#8fb4ff]">Loading your workout history...</p>
        </Panel>
      ) : null}

      {!loading && !hasWorkoutData ? (
        <Panel>
          <p className="text-sm text-[#c7d2c9]">
            No data yet. Save your first workout from the Workouts page to unlock dynamic progress charts.
          </p>
        </Panel>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-4">
        <Panel>
          <div className="inline-flex rounded-2xl bg-[#2d1817] p-3 text-[#ff595b]">
            <FlameIcon className="h-5 w-5" />
          </div>
          <p className="mt-5 text-sm text-[#8fb4ff]">Current streak</p>
          <p className="mt-2 font-brand text-4xl tracking-[-0.04em] text-white">
            {activity.currentStreak}
          </p>
          <p className="mt-1 text-sm text-[#7f8c83]">
            {activity.currentStreak === 1 ? "day in a row" : "days in a row"}
          </p>
        </Panel>

        <Panel>
          <div className="inline-flex rounded-2xl bg-[#2d1817] p-3 text-[#ff595b]">
            <CheckCircleIcon className="h-5 w-5" />
          </div>
          <p className="mt-5 text-sm text-[#8fb4ff]">Workout days this year</p>
          <p className="mt-2 font-brand text-4xl tracking-[-0.04em] text-white">
            {completedWorkoutDaysThisYear}
          </p>
          <p className="mt-1 text-sm text-[#7f8c83]">
            Unique days with saved workouts
          </p>
        </Panel>

        <Panel>
          <div className="inline-flex rounded-2xl bg-[#2d1817] p-3 text-[#ff595b]">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <p className="mt-5 text-sm text-[#8fb4ff]">Weekly consistency</p>
          <p className="mt-2 font-brand text-4xl tracking-[-0.04em] text-white">
            {weeklyConsistencyLabel}
          </p>
          <p className="mt-1 text-sm text-[#7f8c83]">Completed sessions in the current week</p>
        </Panel>

        <Panel>
          <div className="inline-flex rounded-2xl bg-[#2d1817] p-3 text-[#ff595b]">
            <ProgressIcon className="h-5 w-5" />
          </div>
          <p className="mt-5 text-sm text-[#8fb4ff]">Completion percentage</p>
          <p className="mt-2 font-brand text-4xl tracking-[-0.04em] text-white">
            {completionPercent}
          </p>
          <p className="mt-1 text-sm text-[#7f8c83]">
            You completed {activity.weeklyCompletedCount} of 7 planned days
          </p>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-semibold text-white">Weekly completion</h2>
          <p className="mt-1 text-sm text-[#8fb4ff]">
            Calendar check-offs now update your saved workout streak and weekly momentum.
          </p>
          </div>
          <div className="rounded-full bg-[#2a1214] px-4 py-2 text-sm font-semibold text-[#ff9a9b] ring-1 ring-[#ef4444]/20">
            You completed {weeklyConsistencyLabel} this week
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-7">
          {activity.weeklyDays.map((day) => (
            <div
              key={day.key}
              className={`
                rounded-[20px] px-4 py-4 ring-1 transition
                ${
                  day.completed
                    ? "bg-[linear-gradient(180deg,#271214_0%,#180d0e_100%)] text-white ring-[#ef4444]/24"
                    : day.active
                      ? "bg-[linear-gradient(180deg,#171415_0%,#111011_100%)] text-white ring-white/10"
                      : "bg-white/[0.02] text-white/80 ring-white/8"
                }
              `}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{day.shortLabel}</p>
                {day.isToday ? (
                  <span className="rounded-full bg-[#ef4444] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white">
                    Today
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-xs text-[#8fb4ff]">{day.dateLabel}</p>
              <p className="mt-4 text-sm font-semibold">
                {day.completed ? "Workout done" : "Missed"}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <Panel>
          <h2 className="font-semibold text-white">Yearly Completion Trend</h2>
          <p className="mt-1 text-sm text-[#8fb4ff]">
            Completed workout days per month ({new Date().getFullYear()})
          </p>
          <div className="mt-5">
            <AreaTrendChart data={yearlyCompletionData} color="#ff4d4f" />
          </div>
        </Panel>

        <Panel>
          <h2 className="font-semibold text-white">Monthly Strength Snapshot</h2>
          <p className="mt-1 text-sm text-[#8fb4ff]">
            Live totals from saved workout sessions this month
          </p>
          <div className="mt-5">
            <BarChart data={monthlyStrengthData} color="#ef4444" />
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-white">Weight Progress Tracking</h2>
            <p className="mt-1 text-sm text-[#8fb4ff]">
              Top working weight by date for each exercise. PR points are highlighted.
            </p>
          </div>
          <select
            value={selectedExercise}
            onChange={(event) => setSelectedExercisePreference(event.target.value)}
            className="h-11 rounded-xl bg-[#0f1511] px-3 text-sm text-white outline-none ring-1 ring-white/8 focus:ring-[#22c55e]/60"
          >
            {exerciseOptions.length === 0 ? (
              <option value="">No data yet</option>
            ) : null}
            {exerciseOptions.map((exercise) => (
              <option key={exercise} value={exercise}>
                {exercise}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <WeightProgressChart data={weightProgressData} color="#22c55e" />
        </div>

        {weightProgressData.some((point) => point.hasPR) ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {weightProgressData
              .filter((point) => point.hasPR)
              .map((point) => (
                <span
                  key={`${point.date}-pr`}
                  className="inline-flex items-center rounded-full bg-[#f59e0b]/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#ffd18a] ring-1 ring-[#f59e0b]/35"
                >
                  PR {point.label}
                </span>
              ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-[#6f8877]">
            No PR points yet for {selectedExercise || "this exercise"}.
          </p>
        )}
      </Panel>

      <Panel>
        <h2 className="font-semibold text-white">Monthly Workout Stats</h2>
        <p className="mt-1 text-sm text-[#8fb4ff]">
          Automatically calculated from local workout history (`workout_history`).
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[18px] bg-white/[0.02] px-4 py-4 ring-1 ring-white/8">
            <p className="text-sm text-[#8fb4ff]">Volume ({monthlySnapshot.monthLabel})</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {loading ? "--" : monthlySnapshot.volume}
            </p>
          </div>
          <div className="rounded-[18px] bg-white/[0.02] px-4 py-4 ring-1 ring-white/8">
            <p className="text-sm text-[#8fb4ff]">Done Sets</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {loading ? "--" : monthlySnapshot.doneSets}
            </p>
          </div>
          <div className="rounded-[18px] bg-white/[0.02] px-4 py-4 ring-1 ring-white/8">
            <p className="text-sm text-[#8fb4ff]">PR Hits (All Saved)</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {loading ? "--" : totalPrCount}
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
