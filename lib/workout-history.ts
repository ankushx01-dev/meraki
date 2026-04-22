export const WORKOUT_HISTORY_STORAGE_KEY = "workout_history";

export type WorkoutHistorySet = {
  id: string;
  weight: number;
  reps: number;
  isPR: boolean;
  isCompleted: boolean;
};

export type WorkoutHistoryExercise = {
  id: string;
  name: string;
  sets: WorkoutHistorySet[];
};

export type WorkoutHistorySession = {
  id: string;
  userId: string;
  date: string;
  createdAt: string;
  exercises: WorkoutHistoryExercise[];
};

export type WorkoutSetInput = {
  id?: string;
  weight?: number | string;
  reps?: number | string;
  isPR?: boolean;
  isCompleted?: boolean;
  pr?: boolean;
  completed?: boolean;
};

export type WorkoutExerciseInput = {
  id?: string;
  name?: string;
  exercise?: string;
  sets: WorkoutSetInput[];
};

export type ChartDatum = {
  label: string;
  value: number;
};

export type MonthlyStrengthSnapshot = {
  monthLabel: string;
  volume: number;
  prCount: number;
  doneSets: number;
};

export type WeightProgressPoint = {
  date: string;
  label: string;
  weight: number;
  hasPR: boolean;
  prCount: number;
};

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EMPTY_SNAPSHOT: MonthlyStrengthSnapshot = {
  monthLabel: "This month",
  volume: 0,
  prCount: 0,
  doneSets: 0,
};

function sanitizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function toPositiveNumber(value: unknown) {
  return Math.max(0, toNumber(value));
}

function safeDate(dateLike: string | Date) {
  const parsed = dateLike instanceof Date ? dateLike : new Date(dateLike);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
}

export function toDateKey(dateLike: string | Date) {
  const date = safeDate(dateLike);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDayLabel(dateKey: string) {
  const date = safeDate(`${dateKey}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function normalizeSet(value: unknown, index: number): WorkoutHistorySet | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as WorkoutSetInput;
  const weight = toPositiveNumber(candidate.weight);
  const reps = toPositiveNumber(candidate.reps);
  const isPR = Boolean(candidate.isPR ?? candidate.pr);
  const isCompleted =
    candidate.isCompleted ?? candidate.completed ?? (weight > 0 || reps > 0 || isPR);

  if (!isCompleted && weight === 0 && reps === 0 && !isPR) {
    return null;
  }

  return {
    id: sanitizeText(candidate.id) || `set-${index + 1}`,
    weight,
    reps,
    isPR,
    isCompleted,
  };
}

function normalizeExercise(
  value: unknown,
  index: number,
): WorkoutHistoryExercise | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as WorkoutExerciseInput;
  const name = sanitizeText(candidate.name ?? candidate.exercise);
  if (!name) {
    return null;
  }

  const sets = Array.isArray(candidate.sets)
    ? candidate.sets
        .map((set, setIndex) => normalizeSet(set, setIndex))
        .filter((set): set is WorkoutHistorySet => Boolean(set))
    : [];

  if (sets.length === 0) {
    return null;
  }

  return {
    id: sanitizeText(candidate.id) || `exercise-${index + 1}`,
    name,
    sets,
  };
}

function normalizeSession(value: unknown, index: number): WorkoutHistorySession | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as {
    id?: unknown;
    userId?: unknown;
    date?: unknown;
    createdAt?: unknown;
    exercises?: unknown;
  };

  const rawDate = sanitizeText(candidate.date);
  const date = DATE_KEY_PATTERN.test(rawDate) ? rawDate : toDateKey(new Date());
  const exercises = Array.isArray(candidate.exercises)
    ? candidate.exercises
        .map((exercise, exerciseIndex) => normalizeExercise(exercise, exerciseIndex))
        .filter((exercise): exercise is WorkoutHistoryExercise => Boolean(exercise))
    : [];

  if (exercises.length === 0) {
    return null;
  }

  return {
    id: sanitizeText(candidate.id) || `session-${Date.now()}-${index + 1}`,
    userId: sanitizeText(candidate.userId),
    date,
    createdAt: sanitizeText(candidate.createdAt) || new Date().toISOString(),
    exercises,
  };
}

export function normalizeWorkoutHistory(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as WorkoutHistorySession[];
  }

  const sessions = value
    .map((session, index) => normalizeSession(session, index))
    .filter((session): session is WorkoutHistorySession => Boolean(session));

  sessions.sort((a, b) => {
    if (a.date === b.date) {
      return a.createdAt.localeCompare(b.createdAt);
    }
    return a.date.localeCompare(b.date);
  });

  return sessions;
}

export function createWorkoutSession(params: {
  userId?: string;
  date?: string | Date;
  exercises: WorkoutExerciseInput[];
}) {
  const date = toDateKey(params.date ?? new Date());
  const createdAt = new Date().toISOString();
  const session: WorkoutHistorySession = {
    id: `session-${Date.now()}`,
    userId: sanitizeText(params.userId),
    date,
    createdAt,
    exercises: params.exercises
      .map((exercise, index) => normalizeExercise(exercise, index))
      .filter((exercise): exercise is WorkoutHistoryExercise => Boolean(exercise)),
  };

  if (session.exercises.length === 0) {
    return null;
  }

  return session;
}

export function isCompletedSet(set: WorkoutHistorySet) {
  return set.isCompleted;
}

export function calculateSetVolume(set: WorkoutHistorySet) {
  return set.isCompleted ? set.weight * set.reps : 0;
}

export function calculateMonthlyStrengthSnapshot(
  sessions: WorkoutHistorySession[],
  date = new Date(),
) {
  const monthKey = toDateKey(date).slice(0, 7);
  const monthLabel = date.toLocaleDateString("en-US", { month: "long" });

  let volume = 0;
  let prCount = 0;
  let doneSets = 0;

  for (const session of sessions) {
    if (!session.date.startsWith(monthKey)) {
      continue;
    }
    for (const exercise of session.exercises) {
      for (const set of exercise.sets) {
        if (isCompletedSet(set)) {
          doneSets += 1;
          volume += calculateSetVolume(set);
        }
        if (set.isPR) {
          prCount += 1;
        }
      }
    }
  }

  return {
    monthLabel,
    volume: Math.round(volume),
    prCount,
    doneSets,
  } satisfies MonthlyStrengthSnapshot;
}

export function monthlyStrengthToChart(snapshot: MonthlyStrengthSnapshot): ChartDatum[] {
  return [
    { label: "Volume", value: snapshot.volume },
    { label: "PRs", value: snapshot.prCount },
    { label: "Done Sets", value: snapshot.doneSets },
  ];
}

export function calculateYearlyCompletionTrend(
  sessions: WorkoutHistorySession[],
  date = new Date(),
) {
  const year = date.getFullYear();
  const daysByMonth = Array.from({ length: 12 }, () => new Set<string>());

  for (const session of sessions) {
    if (!session.date.startsWith(`${year}-`)) {
      continue;
    }
    const monthIndex = Number(session.date.slice(5, 7)) - 1;
    if (!Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
      continue;
    }
    const hasWorkout = session.exercises.some((exercise) => exercise.sets.length > 0);
    if (hasWorkout) {
      daysByMonth[monthIndex].add(session.date);
    }
  }

  return daysByMonth.map((monthSet, monthIndex) => ({
    label: new Date(year, monthIndex, 1).toLocaleDateString("en-US", {
      month: "short",
    }),
    value: monthSet.size,
  }));
}

export function listExercises(sessions: WorkoutHistorySession[]) {
  const names = new Set<string>();
  for (const session of sessions) {
    for (const exercise of session.exercises) {
      if (exercise.name) {
        names.add(exercise.name);
      }
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

export function calculateWeightProgress(
  sessions: WorkoutHistorySession[],
  exerciseName: string,
) {
  const target = sanitizeText(exerciseName).toLowerCase();
  if (!target) {
    return [] as WeightProgressPoint[];
  }

  const byDate = new Map<string, WeightProgressPoint>();
  for (const session of sessions) {
    const matchingExercises = session.exercises.filter(
      (exercise) => exercise.name.toLowerCase() === target,
    );

    if (matchingExercises.length === 0) {
      continue;
    }

    let maxWeight = 0;
    let prCount = 0;
    for (const exercise of matchingExercises) {
      for (const set of exercise.sets) {
        if (set.weight > maxWeight && set.isCompleted) {
          maxWeight = set.weight;
        }
        if (set.isPR) {
          prCount += 1;
        }
      }
    }

    if (maxWeight <= 0) {
      continue;
    }

    const existing = byDate.get(session.date);
    if (!existing) {
      byDate.set(session.date, {
        date: session.date,
        label: formatDayLabel(session.date),
        weight: maxWeight,
        hasPR: prCount > 0,
        prCount,
      });
      continue;
    }

    existing.weight = Math.max(existing.weight, maxWeight);
    existing.prCount += prCount;
    existing.hasPR = existing.prCount > 0;
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function defaultMonthlySnapshot() {
  return EMPTY_SNAPSHOT;
}
