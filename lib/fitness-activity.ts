"use client";

import { useMemo, useSyncExternalStore } from "react";

import { startOfWorkoutWeek, workoutDateKey } from "@/lib/workout-calendar";

const FITNESS_ACTIVITY_STORAGE_KEY = "meraki_fitness_activity_v1";
const FITNESS_ACTIVITY_EVENT = "meraki-fitness-activity-change";

type FitnessActivityStorage = {
  completedDates: string[];
  aiUsageDates: string[];
};

type ActivityDay = {
  key: string;
  shortLabel: string;
  dateLabel: string;
  completed: boolean;
  active: boolean;
  isToday: boolean;
};

export type FitnessActivitySnapshot = {
  completedDates: string[];
  aiUsageDates: string[];
  activeDates: string[];
  currentStreak: number;
  totalCompletedDays: number;
  weeklyCompletedCount: number;
  weeklyActiveCount: number;
  weeklyCompletionPercentage: number;
  weeklyDays: ActivityDay[];
  recentDays: ActivityDay[];
};

function createEmptyStorage(): FitnessActivityStorage {
  return {
    completedDates: [],
    aiUsageDates: [],
  };
}

const EMPTY_STORAGE = createEmptyStorage();
let cachedStorageRaw: string | null | undefined;
let cachedStorage: FitnessActivityStorage = EMPTY_STORAGE;

function uniqSorted(values: string[]) {
  return [...new Set(values)].sort();
}

function isDateKey(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeStorage(value: unknown): FitnessActivityStorage {
  if (!value || typeof value !== "object") {
    return createEmptyStorage();
  }

  const candidate = value as {
    completedDates?: unknown;
    aiUsageDates?: unknown;
  };

  return {
    completedDates: Array.isArray(candidate.completedDates)
      ? uniqSorted(candidate.completedDates.filter(isDateKey))
      : [],
    aiUsageDates: Array.isArray(candidate.aiUsageDates)
      ? uniqSorted(candidate.aiUsageDates.filter(isDateKey))
      : [],
  };
}

function dateFromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  next.setHours(0, 0, 0, 0);
  return next;
}

function readStorage(): FitnessActivityStorage {
  if (typeof window === "undefined") {
    return EMPTY_STORAGE;
  }

  const raw = window.localStorage.getItem(FITNESS_ACTIVITY_STORAGE_KEY);
  if (raw === cachedStorageRaw) {
    return cachedStorage;
  }

  cachedStorageRaw = raw;
  if (!raw) {
    cachedStorage = EMPTY_STORAGE;
    return cachedStorage;
  }

  try {
    cachedStorage = normalizeStorage(JSON.parse(raw));
  } catch {
    cachedStorage = EMPTY_STORAGE;
  }

  return cachedStorage;
}

function writeStorage(next: FitnessActivityStorage) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeStorage(next);
  const serialized = JSON.stringify(normalized);
  cachedStorageRaw = serialized;
  cachedStorage = normalized;
  window.localStorage.setItem(FITNESS_ACTIVITY_STORAGE_KEY, serialized);
  window.dispatchEvent(new Event(FITNESS_ACTIVITY_EVENT));
}

function getServerStorageSnapshot() {
  return EMPTY_STORAGE;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => callback();
  const handleStorage = (event: StorageEvent) => {
    if (event.key === FITNESS_ACTIVITY_STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener(FITNESS_ACTIVITY_EVENT, handleChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(FITNESS_ACTIVITY_EVENT, handleChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function getCurrentStreak(activeSet: Set<string>) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayKey = workoutDateKey(today);
  const yesterday = addDays(today, -1);
  const yesterdayKey = workoutDateKey(yesterday);

  if (!activeSet.has(todayKey) && !activeSet.has(yesterdayKey)) {
    return 0;
  }

  let cursor = activeSet.has(todayKey) ? today : yesterday;
  let streak = 0;

  while (activeSet.has(workoutDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function buildDays(referenceStart: Date, completedSet: Set<string>, activeSet: Set<string>, count: number): ActivityDay[] {
  const todayKey = workoutDateKey(new Date());

  return Array.from({ length: count }).map((_, index) => {
    const date = addDays(referenceStart, index);
    const key = workoutDateKey(date);

    return {
      key,
      shortLabel: date.toLocaleDateString("en-US", { weekday: "short" }),
      dateLabel: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      completed: completedSet.has(key),
      active: activeSet.has(key),
      isToday: key === todayKey,
    };
  });
}

function createSnapshot(storage: FitnessActivityStorage): FitnessActivitySnapshot {
  const activeDates = uniqSorted([...storage.completedDates, ...storage.aiUsageDates]);
  const completedSet = new Set(storage.completedDates);
  const activeSet = new Set(activeDates);

  const weekStart = startOfWorkoutWeek(new Date());
  const weeklyDays = buildDays(weekStart, completedSet, activeSet, 7);
  const recentDays = buildDays(addDays(new Date(), -6), completedSet, activeSet, 7);

  const weeklyCompletedCount = weeklyDays.filter((day) => day.completed).length;
  const weeklyActiveCount = weeklyDays.filter((day) => day.active).length;

  return {
    completedDates: storage.completedDates,
    aiUsageDates: storage.aiUsageDates,
    activeDates,
    currentStreak: getCurrentStreak(activeSet),
    totalCompletedDays: storage.completedDates.length,
    weeklyCompletedCount,
    weeklyActiveCount,
    weeklyCompletionPercentage: Math.round((weeklyCompletedCount / 7) * 100),
    weeklyDays,
    recentDays,
  };
}

export function toggleCompletedDay(dateKey: string) {
  const current = readStorage();
  const completedSet = new Set(current.completedDates);

  if (completedSet.has(dateKey)) {
    completedSet.delete(dateKey);
  } else {
    completedSet.add(dateKey);
  }

  writeStorage({
    ...current,
    completedDates: [...completedSet],
  });

  return completedSet.has(dateKey);
}

export function recordAiActivity(dateKey = workoutDateKey(new Date())) {
  const current = readStorage();
  const aiUsageSet = new Set(current.aiUsageDates);
  if (aiUsageSet.has(dateKey)) {
    return;
  }

  aiUsageSet.add(dateKey);
  writeStorage({
    ...current,
    aiUsageDates: [...aiUsageSet],
  });
}

export function useFitnessActivity() {
  const storage = useSyncExternalStore(
    subscribe,
    readStorage,
    getServerStorageSnapshot,
  );

  return useMemo(() => createSnapshot(storage), [storage]);
}

export function getFitnessActivitySnapshot() {
  return createSnapshot(readStorage());
}

export function isDayCompleted(dateKey: string) {
  return readStorage().completedDates.includes(dateKey);
}

export function getActivityDayLabel(dateKey: string) {
  return dateFromKey(dateKey).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
