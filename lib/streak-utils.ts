import {
  parseWorkoutDateKey,
  startOfWorkoutWeek,
  workoutDateKey,
} from "@/lib/workout-calendar";

export type StreakCompletionEntry = {
  date: string;
  completed: true;
};

function asValidDate(value: string | Date) {
  const next = value instanceof Date ? new Date(value) : new Date(value);
  return Number.isNaN(next.getTime()) ? new Date() : next;
}

export function normalizeStreakDate(value: string | Date = new Date()) {
  const next = asValidDate(value);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function dateKeyFromValue(value: string | Date) {
  return workoutDateKey(normalizeStreakDate(value));
}

export function createCompletionEntry(value: string | Date): StreakCompletionEntry {
  return {
    date: normalizeStreakDate(value).toISOString(),
    completed: true,
  };
}

export function createCompletionEntryFromDateKey(dateKey: string) {
  return createCompletionEntry(parseWorkoutDateKey(dateKey));
}

export function normalizeStreakEntries(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as StreakCompletionEntry[];
  }

  const byDateKey = new Map<string, StreakCompletionEntry>();

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const candidate = item as {
      date?: unknown;
      completed?: unknown;
    };

    if (candidate.completed !== true || typeof candidate.date !== "string") {
      continue;
    }

    const entry = createCompletionEntry(candidate.date);
    byDateKey.set(dateKeyFromValue(entry.date), entry);
  }

  return [...byDateKey.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, entry]) => entry);
}

export function mergeCompletionEntries(...groups: StreakCompletionEntry[][]) {
  return normalizeStreakEntries(groups.flat());
}

export function setCompletionForDate(
  entries: StreakCompletionEntry[],
  value: string | Date,
  completed: boolean,
) {
  const targetKey = dateKeyFromValue(value);
  const byDateKey = new Map(entries.map((entry) => [dateKeyFromValue(entry.date), entry]));

  if (completed) {
    byDateKey.set(targetKey, createCompletionEntry(value));
  } else {
    byDateKey.delete(targetKey);
  }

  return [...byDateKey.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, entry]) => entry);
}

export function getStreak(entries: StreakCompletionEntry[], referenceDate = new Date()) {
  const completedSet = new Set(entries.map((entry) => dateKeyFromValue(entry.date)));
  const today = normalizeStreakDate(referenceDate);
  const todayKey = workoutDateKey(today);
  const yesterday = normalizeStreakDate(new Date(today));
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = workoutDateKey(yesterday);

  if (!completedSet.has(todayKey) && !completedSet.has(yesterdayKey)) {
    return 0;
  }

  let cursor = completedSet.has(todayKey) ? today : yesterday;
  let streak = 0;

  while (completedSet.has(workoutDateKey(cursor))) {
    streak += 1;
    cursor = normalizeStreakDate(new Date(cursor));
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function getWeeklyCompletion(entries: StreakCompletionEntry[], referenceDate = new Date()) {
  const completedSet = new Set(entries.map((entry) => dateKeyFromValue(entry.date)));
  const weekStart = startOfWorkoutWeek(normalizeStreakDate(referenceDate));

  return Array.from({ length: 7 }).reduce((count, _, index) => {
    const cursor = normalizeStreakDate(new Date(weekStart));
    cursor.setDate(weekStart.getDate() + index);
    return count + (completedSet.has(workoutDateKey(cursor)) ? 1 : 0);
  }, 0);
}

export function isTodayCompleted(entries: StreakCompletionEntry[], referenceDate = new Date()) {
  return entries.some((entry) => dateKeyFromValue(entry.date) === dateKeyFromValue(referenceDate));
}
