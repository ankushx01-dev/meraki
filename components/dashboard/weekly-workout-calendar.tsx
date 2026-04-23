"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CalendarIcon, CheckCircleIcon, SaveIcon } from "@/components/dashboard/icons";
import { Panel, cx } from "@/components/dashboard/ui";
import { getActivityDayLabel, useStreak } from "@/lib/fitness-activity";
import {
  buildWeeklyWorkoutSchedule,
  createWorkoutDayDraft,
  getSelectedWorkoutDay,
  mergeWorkoutCalendarDays,
  startOfWorkoutWeek,
  workoutDateKey,
  type SavedWorkoutCalendarDay,
  type WorkoutDayDraft,
  type WorkoutScheduleDay,
} from "@/lib/workout-calendar";

function createInitialSchedule() {
  return buildWeeklyWorkoutSchedule(new Date());
}

function createInitialSelectedKey(schedule: WorkoutScheduleDay[]) {
  return getSelectedWorkoutDay(schedule)?.key ?? "";
}

export function WeeklyWorkoutCalendar({ editable = true }: { editable?: boolean }) {
  const [schedule, setSchedule] = useState<WorkoutScheduleDay[]>(() => createInitialSchedule());
  const [selectedKey, setSelectedKey] = useState<string>(() =>
    createInitialSelectedKey(createInitialSchedule()),
  );
  const [draftsByKey, setDraftsByKey] = useState<Record<string, WorkoutDayDraft>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [completionMsg, setCompletionMsg] = useState("");
  const [completionSavingKey, setCompletionSavingKey] = useState("");
  const { completedDates, toggleDayCompletion } = useStreak();

  const userId =
    typeof window !== "undefined" ? window.localStorage.getItem("meraki_auth") || "" : "";

  useEffect(() => {
    if (!userId) {
      return;
    }

    let cancelled = false;

    async function loadWeek() {
      try {
        const start = workoutDateKey(startOfWorkoutWeek(new Date()));
        const res = await fetch(
          `/api/workout-calendar?userId=${encodeURIComponent(userId)}&start=${encodeURIComponent(start)}`,
        );
        const json = (await res.json()) as { data?: SavedWorkoutCalendarDay[] };
        if (!res.ok || cancelled) {
          return;
        }

        setSchedule((current) => mergeWorkoutCalendarDays(current, json.data ?? []));
      } catch {
        // Keep rendering the default week even if saved data fails.
      }
    }

    void loadWeek();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!completionMsg) {
      return;
    }

    const timer = window.setTimeout(() => setCompletionMsg(""), 1800);
    return () => {
      window.clearTimeout(timer);
    };
  }, [completionMsg]);

  const selectedDay = useMemo(
    () => getSelectedWorkoutDay(schedule, selectedKey),
    [schedule, selectedKey],
  );
  const completedSet = useMemo(() => new Set(completedDates), [completedDates]);

  const baseDraft = selectedDay ? createWorkoutDayDraft(selectedDay) : null;
  const selectedDraft =
    selectedDay && baseDraft
      ? draftsByKey[selectedDay.key] ?? baseDraft
      : null;

  const previewDay =
    selectedDay && selectedDraft
      ? {
          ...selectedDay,
          workout: selectedDraft.workout.trim() || selectedDay.workout,
          focus: selectedDraft.focus.trim() || selectedDay.focus,
          summary: selectedDraft.summary.trim() || selectedDay.summary,
          exercises:
            selectedDraft.exercisesText
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean).length > 0
              ? selectedDraft.exercisesText
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
              : selectedDay.exercises,
        }
      : selectedDay;

  const isDirty = Boolean(
    baseDraft &&
      selectedDraft &&
      (
        selectedDraft.workout.trim() !== baseDraft.workout.trim() ||
        selectedDraft.focus.trim() !== baseDraft.focus.trim() ||
        selectedDraft.summary.trim() !== baseDraft.summary.trim() ||
        selectedDraft.exercisesText.trim() !== baseDraft.exercisesText.trim()
      ),
  );

  function updateDraft(patch: Partial<WorkoutDayDraft>) {
    if (!selectedDay || !baseDraft) {
      return;
    }

    setSaveMsg("");
    setDraftsByKey((current) => ({
      ...current,
      [selectedDay.key]: {
        ...(current[selectedDay.key] ?? baseDraft),
        ...patch,
      },
    }));
  }

  async function handleToggleCompletion(day: WorkoutScheduleDay) {
    if (!userId) {
      setCompletionMsg("Log in to update your streak.");
      return;
    }

    setCompletionSavingKey(day.key);
    setCompletionMsg("");

    try {
      const nextCompleted = await toggleDayCompletion({
        dateKey: day.key,
        workout: day.workout,
        focus: day.focus,
        summary: day.summary,
        exercises: day.exercises,
      });
      setCompletionMsg(
        nextCompleted
          ? `${getActivityDayLabel(day.key)} marked complete.`
          : `${getActivityDayLabel(day.key)} removed from your streak.`,
      );
    } catch (error) {
      setCompletionMsg(
        error instanceof Error ? error.message : "Failed to update streak.",
      );
    } finally {
      setCompletionSavingKey("");
    }
  }

  async function saveDay() {
    if (!selectedDay || !selectedDraft || !userId) {
      return;
    }

    setSaving(true);
    setSaveMsg("");

    const exercises = selectedDraft.exercisesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      userId,
      dateKey: selectedDay.key,
      workout: selectedDraft.workout.trim() || selectedDay.workout,
      focus: selectedDraft.focus.trim() || selectedDay.focus,
      summary: selectedDraft.summary.trim() || selectedDay.summary,
      exercises: exercises.length > 0 ? exercises : selectedDay.exercises,
    };

    try {
      const res = await fetch("/api/workout-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };

      if (!res.ok) {
        setSaveMsg(json.message ?? "Save failed");
        return;
      }

      setSchedule((current) =>
        current.map((day) =>
          day.key === selectedDay.key
            ? {
                ...day,
                workout: payload.workout,
                focus: payload.focus,
                summary: payload.summary,
                exercises: payload.exercises,
              }
            : day,
        ),
      );

      setDraftsByKey((current) => {
        const next = { ...current };
        delete next[selectedDay.key];
        return next;
      });

      setSaveMsg("Saved");
      window.setTimeout(() => setSaveMsg(""), 1500);
    } catch {
      setSaveMsg("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel className="h-full">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#251314] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#ff9a9b] ring-1 ring-[#ef4444]/16">
            <CalendarIcon className="h-3.5 w-3.5" />
            Weekly Workout Calendar
          </div>
          <h2 className="mt-4 font-brand text-3xl tracking-[-0.04em] text-white sm:text-[2rem]">
            Your training week, mapped clearly.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#8fb4ff]">
            Mark days complete as you train. Every completed session syncs your streak and weekly
            progress instantly across Meraki.
          </p>
        </div>

        {!editable ? (
          <Link
            href="/dashboard/calendar"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ef4444]/16 bg-[#1b1112] px-4 py-2.5 text-sm font-semibold text-[#ffb0b1] transition hover:bg-[#241314] hover:text-white"
          >
            Open Calendar
            <CalendarIcon className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
        {schedule.map((day) => {
          const isSelected = day.key === selectedKey;
          const isCompleted = completedSet.has(day.key);

          return (
            <div
              key={day.key}
              className={cx(
                "rounded-[24px] border px-4 py-4 text-left transition-all duration-200",
                isSelected && isCompleted
                  ? "border-red-400/35 bg-[linear-gradient(180deg,#281113_0%,#180d0e_100%)] text-white shadow-[0_20px_40px_rgba(239,68,68,0.16)]"
                  : isSelected
                    ? "border-red-500/25 bg-[linear-gradient(180deg,#181111_0%,#120d0d_100%)] text-white shadow-[0_20px_40px_rgba(239,68,68,0.12)]"
                    : isCompleted
                      ? "border-red-500/16 bg-[linear-gradient(180deg,#151010_0%,#110d0d_100%)] text-white hover:bg-[linear-gradient(180deg,#1a1212_0%,#120d0d_100%)]"
                      : "border-white/8 bg-white/[0.03] text-white hover:bg-white/[0.06]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedKey(day.key);
                    setSaveMsg("");
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="text-sm font-semibold">{day.dayLabel}</span>
                  <p className="mt-2 text-xs text-[#9eb8f0]">{day.dateLabel}</p>
                  <p className="mt-4 font-brand text-2xl tracking-[-0.04em] text-[#ff6b6c]">
                    {day.workout}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/55">{day.focus}</p>
                </button>

                <div className="flex flex-col items-end gap-2">
                  {day.isToday ? (
                    <span className="rounded-full bg-[#ef4444] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white">
                      Today
                    </span>
                  ) : null}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleToggleCompletion(day);
                      }}
                      disabled={completionSavingKey === day.key}
                      className={cx(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition",
                        isCompleted
                          ? "bg-red-500 text-white shadow-[0_12px_24px_rgba(239,68,68,0.2)]"
                          : "bg-white/[0.06] text-white/70 hover:bg-red-500/14 hover:text-white",
                        completionSavingKey === day.key && "cursor-not-allowed opacity-60",
                      )}
                    >
                      <CheckCircleIcon className="h-3.5 w-3.5" />
                      {completionSavingKey === day.key
                        ? "Saving"
                        : isCompleted
                          ? "Done"
                          : "Mark"}
                    </button>
                  </div>
                </div>
            </div>
          );
        })}
      </div>

      {previewDay ? (
        <div className="mt-6 rounded-[26px] border border-white/8 bg-white/[0.03] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm text-[#8fb4ff]">
                {previewDay.dayLabel}, {previewDay.dateLabel}
              </p>
              <h3 className="mt-1 font-brand text-3xl tracking-[-0.04em] text-white sm:text-4xl">
                {previewDay.workout} Day
              </h3>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <button
                type="button"
                onClick={() => {
                  void handleToggleCompletion(previewDay);
                }}
                disabled={completionSavingKey === previewDay.key}
                className={cx(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                  completedSet.has(previewDay.key)
                    ? "bg-red-500 text-white shadow-[0_14px_30px_rgba(239,68,68,0.22)]"
                    : "bg-white/[0.06] text-white/80 ring-1 ring-white/10 hover:bg-red-500/14 hover:text-white",
                  completionSavingKey === previewDay.key && "cursor-not-allowed opacity-60",
                )}
              >
                <CheckCircleIcon className="h-4 w-4" />
                {completionSavingKey === previewDay.key
                  ? "Saving..."
                  : completedSet.has(previewDay.key)
                    ? "Completed"
                    : "Mark as completed"}
              </button>
              <p className="max-w-lg text-sm leading-7 text-[#8f8e8c]">{previewDay.focus}</p>
            </div>
          </div>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#c8d3ca]">{previewDay.summary}</p>

          {completionMsg ? (
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {completionMsg}
            </div>
          ) : null}

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {previewDay.exercises.map((exercise) => (
              <div
                key={exercise}
                className="rounded-[20px] border border-white/8 bg-[#111612] px-4 py-3 text-sm text-white shadow-[0_14px_34px_rgba(0,0,0,0.18)]"
              >
                {exercise}
              </div>
            ))}
          </div>

          {editable && selectedDraft ? (
            <div className="mt-7 rounded-[24px] border border-white/10 bg-[#0f1411] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.22)]">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-white">Customize this day</p>
                <p className="text-xs text-white/55">Edit the workout and save it for this date.</p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  value={selectedDraft.workout}
                  onChange={(event) => updateDraft({ workout: event.target.value })}
                  placeholder="Workout name (Push, Chest, Arms...)"
                  className="h-11 rounded-xl bg-white/[0.04] px-3 text-sm text-white outline-none ring-1 ring-white/10"
                />
                <input
                  value={selectedDraft.focus}
                  onChange={(event) => updateDraft({ focus: event.target.value })}
                  placeholder="Focus"
                  className="h-11 rounded-xl bg-white/[0.04] px-3 text-sm text-white outline-none ring-1 ring-white/10"
                />
                <input
                  value={selectedDraft.summary}
                  onChange={(event) => updateDraft({ summary: event.target.value })}
                  placeholder="Summary"
                  className="h-11 rounded-xl bg-white/[0.04] px-3 text-sm text-white outline-none ring-1 ring-white/10 sm:col-span-2"
                />
                <textarea
                  value={selectedDraft.exercisesText}
                  onChange={(event) => updateDraft({ exercisesText: event.target.value })}
                  placeholder="Exercises (one per line)"
                  className="min-h-[118px] rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 sm:col-span-2"
                />
              </div>

              <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                {saveMsg ? <p className="text-xs text-[#8fb4ff]">{saveMsg}</p> : null}
                <button
                  type="button"
                  onClick={saveDay}
                  disabled={saving || !isDirty}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ef4444] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#dc2626] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <SaveIcon className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Day"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </Panel>
  );
}
