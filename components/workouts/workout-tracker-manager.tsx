"use client";

import { useEffect, useMemo, useState } from "react";
import { PlusIcon, SaveIcon, TrashIcon } from "@/components/dashboard/icons";
import { PageIntro, Panel, cx } from "@/components/dashboard/ui";
import { useWorkoutHistory } from "@/components/providers/workout-history-provider";
import type { WorkoutExerciseInput } from "@/lib/workout-history";

const storageKey = "meraki-workout-tracker";

type WorkoutSet = {
  id: string;
  weight: string;
  reps: string;
  isPR: boolean;
  isCompleted: boolean;
};

type WorkoutExercise = {
  id: string;
  name: string;
  sets: WorkoutSet[];
};

type StoredWorkoutState = {
  exercises?: unknown;
  dateKey?: string;
};

type RawWorkoutSet = {
  id?: unknown;
  weight?: unknown;
  reps?: unknown;
  isPR?: unknown;
  isCompleted?: unknown;
  pr?: unknown;
  completed?: unknown;
};

type RawWorkoutExercise = {
  id?: unknown;
  name?: unknown;
  exercise?: unknown;
  sets?: unknown;
};

const defaultExercises: WorkoutExercise[] = [
  {
    id: "bench-press",
    name: "Bench Press",
    sets: [
      { id: "bench-1", weight: "82.5", reps: "8", isPR: false, isCompleted: true },
      { id: "bench-2", weight: "85", reps: "6", isPR: false, isCompleted: true },
    ],
  },
  {
    id: "squats",
    name: "Squats",
    sets: [
      { id: "squat-1", weight: "100", reps: "8", isPR: false, isCompleted: true },
      { id: "squat-2", weight: "105", reps: "6", isPR: false, isCompleted: true },
    ],
  },
];

function sanitizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toPositiveNumber(value: string) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
}

function normalizeNumericInput(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value <= 0 ? "" : String(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return "";
    }
    const numeric = Number(trimmed);
    return Number.isFinite(numeric) ? (numeric <= 0 ? "" : trimmed) : "";
  }

  return "";
}

function createSet(index: number): WorkoutSet {
  return {
    id: `set-${Date.now()}-${index}`,
    weight: "",
    reps: "",
    isPR: false,
    isCompleted: false,
  };
}

function normalizeIncomingExercises(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as WorkoutExercise[];
  }

  return value
    .map((item, exerciseIndex) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as RawWorkoutExercise;
      const name = sanitizeText(candidate.name ?? candidate.exercise);
      if (!name) {
        return null;
      }

      const sets = Array.isArray(candidate.sets)
        ? candidate.sets
            .map((set, setIndex) => {
              if (!set || typeof set !== "object") {
                return null;
              }

              const rawSet = set as RawWorkoutSet;
              const weight = normalizeNumericInput(rawSet.weight);
              const reps = normalizeNumericInput(rawSet.reps);
              const isPR = Boolean(rawSet.isPR ?? rawSet.pr);
              const isCompleted = Boolean(rawSet.isCompleted ?? rawSet.completed);

              return {
                id: sanitizeText(rawSet.id) || `set-${exerciseIndex + 1}-${setIndex + 1}`,
                weight,
                reps,
                isPR,
                isCompleted,
              } satisfies WorkoutSet;
            })
            .filter((set): set is WorkoutSet => Boolean(set))
        : [];

      return {
        id:
          sanitizeText(candidate.id) ||
          `exercise-${slugify(name)}-${exerciseIndex + 1}`,
        name,
        sets: sets.length > 0 ? sets : [createSet(1)],
      } satisfies WorkoutExercise;
    })
    .filter((exercise): exercise is WorkoutExercise => Boolean(exercise));
}

function loadWorkoutState() {
  if (typeof window === "undefined") {
    return defaultExercises;
  }

  const saved = window.localStorage.getItem(storageKey);
  if (!saved) {
    return defaultExercises;
  }

  try {
    const parsed = JSON.parse(saved) as StoredWorkoutState;
    const normalized = normalizeIncomingExercises(parsed.exercises);
    if (normalized.length > 0) {
      return normalized;
    }
  } catch {
    window.localStorage.removeItem(storageKey);
  }

  return defaultExercises;
}

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function toDbExercisePayload(exercises: WorkoutExercise[]) {
  return exercises.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    sets: exercise.sets.map((set) => ({
      id: set.id,
      weight: set.weight,
      reps: set.reps,
      isPR: set.isPR,
      pr: set.isPR,
      isCompleted: set.isCompleted,
      completed: set.isCompleted,
    })),
  }));
}

export function WorkoutTrackerManager() {
  const [exerciseName, setExerciseName] = useState("");
  const [exercises, setExercises] = useState<WorkoutExercise[]>(loadWorkoutState);
  const [statusMessage, setStatusMessage] = useState(
    "Workout progress is saved locally in your browser.",
  );
  const userId =
    typeof window !== "undefined" ? window.localStorage.getItem("meraki_auth") || "" : "";
  const [hydratedFromDb, setHydratedFromDb] = useState(false);
  const { monthlySnapshot, saveWorkoutSession } = useWorkoutHistory();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        exercises,
        dateKey: todayKey(),
      }),
    );
  }, [exercises]);

  useEffect(() => {
    if (!userId || !hydratedFromDb) {
      return;
    }

    const timer = window.setTimeout(async () => {
      await fetch("/api/workout-session", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          dateKey: todayKey(),
          exercises: toDbExercisePayload(exercises),
        }),
      });
    }, 400);

    return () => window.clearTimeout(timer);
  }, [exercises, hydratedFromDb, userId]);

  useEffect(() => {
    if (typeof window === "undefined" || !userId) {
      return;
    }

    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as StoredWorkoutState;
        const normalized = normalizeIncomingExercises(parsed.exercises);
        if (parsed.dateKey === todayKey() && normalized.length > 0) {
          setExercises(normalized);
          setHydratedFromDb(true);
          return;
        }
      } catch {
        // ignore invalid local draft
      }
    }

    async function loadFromCalendar() {
      const sessionRes = await fetch(
        `/api/workout-session?userId=${encodeURIComponent(userId)}&dateKey=${encodeURIComponent(todayKey())}`,
      );
      const sessionJson = await sessionRes.json().catch(() => ({}));
      const sessionExercises = normalizeIncomingExercises(sessionJson?.data?.exercises);

      if (sessionRes.ok && sessionExercises.length > 0) {
        setExercises(sessionExercises);
        setStatusMessage("Loaded today's workout from database.");
        setHydratedFromDb(true);
        return;
      }

      const start = todayKey();
      const res = await fetch(
        `/api/workout-calendar?userId=${encodeURIComponent(
          userId,
        )}&start=${encodeURIComponent(start)}`,
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        return;
      }

      const match = (json?.data ?? []).find((d: { dateKey?: string }) => d?.dateKey === todayKey());
      const list: string[] = Array.isArray(match?.exercises) ? match.exercises : [];
      if (list.length === 0) {
        setHydratedFromDb(true);
        return;
      }

      setExercises(
        list.map((name, index) => ({
          id: `exercise-${slugify(name)}-${index + 1}`,
          name,
          sets: [createSet(1)],
        })),
      );
      setStatusMessage("Loaded today's exercises from your calendar.");
      setHydratedFromDb(true);
    }

    void loadFromCalendar();
  }, [userId]);

  const prLifts = useMemo(() => {
    return exercises
      .flatMap((exercise) =>
        exercise.sets
          .filter((set) => set.isPR)
          .map((set) => ({
            exerciseName: exercise.name,
            weight: set.weight,
            reps: set.reps,
            isCompleted: set.isCompleted,
          })),
      )
      .reverse();
  }, [exercises]);

  const draftSetCount = useMemo(
    () => exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0),
    [exercises],
  );

  const draftDoneCount = useMemo(
    () =>
      exercises.reduce(
        (sum, exercise) => sum + exercise.sets.filter((set) => set.isCompleted).length,
        0,
      ),
    [exercises],
  );

  const draftPrCount = useMemo(
    () =>
      exercises.reduce(
        (sum, exercise) => sum + exercise.sets.filter((set) => set.isPR).length,
        0,
      ),
    [exercises],
  );

  const canSaveWorkout = useMemo(
    () =>
      exercises.some((exercise) =>
        exercise.sets.some(
          (set) =>
            toPositiveNumber(set.weight) > 0 ||
            toPositiveNumber(set.reps) > 0 ||
            set.isPR ||
            set.isCompleted,
        ),
      ),
    [exercises],
  );

  function buildSessionPayload(): WorkoutExerciseInput[] {
    return exercises
      .map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        sets: exercise.sets.map((set) => ({
          id: set.id,
          weight: toPositiveNumber(set.weight),
          reps: toPositiveNumber(set.reps),
          isPR: set.isPR,
          isCompleted: set.isCompleted,
        })),
      }))
      .filter((exercise) => sanitizeText(exercise.name).length > 0);
  }

  function handleSaveWorkout() {
    if (!canSaveWorkout) {
      setStatusMessage("Add at least one set before saving your workout.");
      return;
    }

    const result = saveWorkoutSession({
      date: todayKey(),
      userId,
      exercises: buildSessionPayload(),
    });

    if (!result.ok) {
      setStatusMessage(result.message);
      return;
    }

    const prLabel =
      draftPrCount > 0
        ? ` ${draftPrCount} ${draftPrCount === 1 ? "PR set" : "PR sets"} captured.`
        : "";
    setStatusMessage(`${result.message}${prLabel}`);
  }

  function addExercise() {
    const trimmedName = exerciseName.trim();
    if (!trimmedName) {
      setStatusMessage("Add an exercise name before creating a new section.");
      return;
    }

    setExercises((current) => [
      ...current,
      {
        id: `exercise-${Date.now()}`,
        name: trimmedName,
        sets: [createSet(1)],
      },
    ]);
    setExerciseName("");
    setStatusMessage(`${trimmedName} added to today's workout.`);
  }

  function addSet(exerciseId: string) {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [...exercise.sets, createSet(exercise.sets.length + 1)],
            }
          : exercise,
      ),
    );
    setStatusMessage("New set added.");
  }

  function updateSet(
    exerciseId: string,
    setId: string,
    field: keyof WorkoutSet,
    value: string | boolean,
  ) {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, [field]: value } : set,
              ),
            }
          : exercise,
      ),
    );
  }

  function removeExercise(exerciseId: string) {
    setExercises((current) => current.filter((exercise) => exercise.id !== exerciseId));
    setStatusMessage("Exercise removed from workout.");
  }

  return (
    <div className="space-y-6">
      <PageIntro
        title="Workout Tracker"
        description="Log weight, reps, PR, and completion in a clean workflow."
        actions={
          <button
            type="button"
            onClick={handleSaveWorkout}
            disabled={!canSaveWorkout}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#ef4444] px-5 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(239,68,68,0.28)] transition-all hover:bg-[#dc2626] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#ef4444]"
          >
            <SaveIcon className="h-4 w-4" />
            Save Workout
          </button>
        }
      />

      <div className="space-y-6">
        <Panel className="h-fit">
          <div className="flex items-center gap-3">
            <span className="rounded-2xl bg-[#143523] p-3 text-[#22c55e]">
              <PlusIcon className="h-5 w-5" />
            </span>
            <h2 className="font-brand text-2xl tracking-[-0.04em] text-white">
              Add Exercise
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#8fb4ff]">
                Exercise Name
              </span>
              <input
                type="text"
                value={exerciseName}
                onChange={(event) => setExerciseName(event.target.value)}
                placeholder="e.g., Romanian Deadlift"
                className="h-12 w-full rounded-2xl bg-white/[0.03] px-4 text-white outline-none ring-1 ring-white/10 placeholder:text-white/35 focus:ring-[#22c55e]/60"
              />
            </label>

            <button
              type="button"
              onClick={addExercise}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#22c55e] text-base font-semibold text-[#041108] shadow-[0_18px_34px_rgba(34,197,94,0.28)] hover:bg-[#16a34a]"
            >
              <PlusIcon className="h-4 w-4" />
              Add Exercise
            </button>
          </div>

          <div className="mt-6 rounded-[22px] bg-white/[0.03] px-4 py-4 text-sm text-[#c7d2c9] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {statusMessage}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="rounded-[18px] bg-white/[0.02] px-4 py-3 ring-1 ring-white/8">
              <p className="text-xs uppercase tracking-[0.14em] text-[#8fb4ff]">Draft sets</p>
              <p className="mt-2 text-xl font-semibold text-white">{draftSetCount}</p>
            </div>
            <div className="rounded-[18px] bg-white/[0.02] px-4 py-3 ring-1 ring-white/8">
              <p className="text-xs uppercase tracking-[0.14em] text-[#8fb4ff]">Draft done sets</p>
              <p className="mt-2 text-xl font-semibold text-white">{draftDoneCount}</p>
            </div>
            <div className="rounded-[18px] bg-white/[0.02] px-4 py-3 ring-1 ring-white/8">
              <p className="text-xs uppercase tracking-[0.14em] text-[#8fb4ff]">Draft PR sets</p>
              <p className="mt-2 text-xl font-semibold text-white">{draftPrCount}</p>
            </div>
            <div className="rounded-[18px] bg-white/[0.02] px-4 py-3 ring-1 ring-white/8">
              <p className="text-xs uppercase tracking-[0.14em] text-[#8fb4ff]">
                {monthlySnapshot.monthLabel} volume
              </p>
              <p className="mt-2 text-xl font-semibold text-white">{monthlySnapshot.volume}</p>
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <Panel key={exercise.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-brand text-2xl tracking-[-0.04em] text-white">
                      {exercise.name}
                    </h2>
                    <p className="mt-1 text-sm text-[#8fb4ff]">
                      Set, Weight, Reps, PR, Done.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => addSet(exercise.id)}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#143523] px-4 text-sm font-semibold text-[#7ff0a6] hover:bg-[#18492f]"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add Set
                    </button>
                    <button
                      type="button"
                      onClick={() => removeExercise(exercise.id)}
                      className="rounded-2xl bg-white/[0.03] p-3 text-white/55 hover:bg-white/[0.06] hover:text-white"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#8fb4ff]">
                        <th className="px-3">Set</th>
                        <th className="px-3">Weight (kg)</th>
                        <th className="px-3">Reps</th>
                        <th className="px-3">PR</th>
                        <th className="px-3">Done</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, index) => (
                        <tr
                          key={set.id}
                          className={cx(
                            "bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-transparent transition-all",
                            set.isCompleted && "ring-[#22c55e]/35 shadow-[0_0_18px_rgba(34,197,94,0.18)]",
                            set.isPR && "bg-[rgba(239,68,68,0.08)]",
                          )}
                        >
                          <td className="rounded-l-2xl px-3 py-3 text-sm font-semibold text-white">
                            {index + 1}
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(event) =>
                                updateSet(exercise.id, set.id, "weight", event.target.value)
                              }
                              placeholder="0"
                              className="h-10 w-full rounded-xl bg-[#0f1511] px-3 text-sm text-white outline-none ring-1 ring-white/8 placeholder:text-white/25 focus:ring-[#22c55e]/60"
                            />
                          </td>
                          <td className="px-3 py-3">
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(event) =>
                                updateSet(exercise.id, set.id, "reps", event.target.value)
                              }
                              placeholder="0"
                              className="h-10 w-full rounded-xl bg-[#0f1511] px-3 text-sm text-white outline-none ring-1 ring-white/8 placeholder:text-white/25 focus:ring-[#22c55e]/60"
                            />
                          </td>
                          <td className="px-3 py-3">
                            <label className="inline-flex items-center gap-2 text-sm text-[#c7d2c9]">
                              <input
                                type="checkbox"
                                checked={set.isPR}
                                onChange={(event) =>
                                  updateSet(exercise.id, set.id, "isPR", event.target.checked)
                                }
                                className="h-4 w-4 rounded border-0 bg-white/20 text-[#ff4d4f] focus:ring-[#ff4d4f]/50"
                              />
                              PR
                            </label>
                            {set.isPR ? (
                              <span className="ml-2 inline-flex rounded-full bg-[#ef4444]/25 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#ffd0d1] ring-1 ring-[#ef4444]/45">
                                PR Badge
                              </span>
                            ) : null}
                          </td>
                          <td className="rounded-r-2xl px-3 py-3">
                            <label className="inline-flex items-center gap-2 text-sm text-[#c7d2c9]">
                              <input
                                type="checkbox"
                                checked={set.isCompleted}
                                onChange={(event) =>
                                  updateSet(
                                    exercise.id,
                                    set.id,
                                    "isCompleted",
                                    event.target.checked,
                                  )
                                }
                                className="h-4 w-4 rounded border-0 bg-white/20 text-[#22c55e] focus:ring-[#22c55e]/50"
                              />
                              Done
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            ))}
          </div>

          <Panel>
            <h2 className="font-brand text-2xl tracking-[-0.04em] text-white">PR Lifts</h2>
            <p className="mt-1 text-sm text-[#8fb4ff]">
              PR sets saved from this workout draft.
            </p>

            {prLifts.length === 0 ? (
              <p className="mt-5 text-sm text-[#6f8877]">
                No PRs yet. Tick the PR checkbox on any set.
              </p>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {prLifts.map((item, index) => (
                  <div
                    key={`${item.exerciseName}-${index}`}
                    className="rounded-[18px] bg-white/[0.03] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-white/10"
                  >
                    <p className="text-sm font-semibold text-white">{item.exerciseName}</p>
                    <p className="mt-1 text-sm text-[#c3d1f2]">
                      {item.weight || "—"} kg · {item.reps || "—"} reps
                    </p>
                    <p className="mt-1 text-xs text-white/55">
                      {item.isCompleted ? "Completed set" : "Marked as PR"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
