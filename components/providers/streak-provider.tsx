"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  createCompletionEntryFromDateKey,
  dateKeyFromValue,
  getStreak,
  getWeeklyCompletion,
  isTodayCompleted as getIsTodayCompleted,
  normalizeStreakDate,
  normalizeStreakEntries,
  setCompletionForDate,
  type StreakCompletionEntry,
} from "@/lib/streak-utils";
import { startOfWorkoutWeek, workoutDateKey } from "@/lib/workout-calendar";

const FITNESS_ACTIVITY_EVENT = "meraki-fitness-activity-change";
const STREAK_STORAGE_PREFIX = "meraki_streak_entries_v1";

type ActivityDay = {
  key: string;
  shortLabel: string;
  dateLabel: string;
  completed: boolean;
  active: boolean;
  isToday: boolean;
};

export type StreakSnapshot = {
  entries: StreakCompletionEntry[];
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
  completedToday: boolean;
};

type MarkableWorkoutDay = {
  dateKey: string;
  workout: string;
  focus: string;
  summary: string;
  exercises: string[];
};

type WorkoutSessionSyncPayload = {
  dateKey: string;
  exercises: unknown[];
};

type StreakContextValue = StreakSnapshot & {
  isTodayCompleted: boolean;
  refresh: () => Promise<void>;
  setDayCompletion: (day: MarkableWorkoutDay, completed: boolean) => Promise<void>;
  toggleDayCompletion: (day: MarkableWorkoutDay) => Promise<boolean>;
  syncWorkoutSession: (payload: WorkoutSessionSyncPayload) => Promise<void>;
};

type StreakApiResponse = {
  entries?: StreakCompletionEntry[];
  completedDates?: string[];
  message?: string;
};

const StreakContext = createContext<StreakContextValue | null>(null);

function getStorageKey(userId: string) {
  return `${STREAK_STORAGE_PREFIX}:${userId}`;
}

function readCurrentUserId() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem("meraki_auth") ?? "";
}

function readCachedEntries(userId: string) {
  if (typeof window === "undefined" || !userId) {
    return [] as StreakCompletionEntry[];
  }

  const raw = window.localStorage.getItem(getStorageKey(userId));
  if (!raw) {
    return [] as StreakCompletionEntry[];
  }

  try {
    return normalizeStreakEntries(JSON.parse(raw));
  } catch {
    return [] as StreakCompletionEntry[];
  }
}

function writeCachedEntries(userId: string, entries: StreakCompletionEntry[]) {
  if (typeof window === "undefined" || !userId) {
    return;
  }

  window.localStorage.setItem(getStorageKey(userId), JSON.stringify(entries));
}

function hasMeaningfulWorkoutSession(exercises: unknown[]) {
  return exercises.some((exercise) => {
    if (!exercise || typeof exercise !== "object") {
      return false;
    }

    const candidate = exercise as { sets?: unknown };
    if (!Array.isArray(candidate.sets)) {
      return false;
    }

    return candidate.sets.some((set) => {
      if (!set || typeof set !== "object") {
        return false;
      }

      const maybeSet = set as {
        completed?: unknown;
        isCompleted?: unknown;
        pr?: unknown;
        isPR?: unknown;
        weight?: unknown;
        reps?: unknown;
      };

      if (Boolean(maybeSet.completed ?? maybeSet.isCompleted ?? maybeSet.pr ?? maybeSet.isPR)) {
        return true;
      }

      return Number(maybeSet.weight ?? 0) > 0 || Number(maybeSet.reps ?? 0) > 0;
    });
  });
}

async function fetchEntriesFromApi(userId: string) {
  const res = await fetch(`/api/streak?userId=${encodeURIComponent(userId)}`, {
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as StreakApiResponse;

  if (!res.ok) {
    throw new Error(json.message ?? "Failed to load streak.");
  }

  if (Array.isArray(json.completedDates)) {
    return normalizeStreakEntries(
      json.completedDates.map((dateKey) => createCompletionEntryFromDateKey(dateKey)),
    );
  }

  if (Array.isArray(json.entries)) {
    return normalizeStreakEntries(json.entries);
  }

  return [] as StreakCompletionEntry[];
}

function buildDays(referenceStart: Date, count: number, completedDates: Set<string>) {
  const todayKey = workoutDateKey(new Date());

  return Array.from({ length: count }).map((_, index) => {
    const date = normalizeStreakDate(new Date(referenceStart));
    date.setDate(referenceStart.getDate() + index);
    const key = workoutDateKey(date);
    const completed = completedDates.has(key);

    return {
      key,
      shortLabel: date.toLocaleDateString("en-US", { weekday: "short" }),
      dateLabel: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      completed,
      active: completed,
      isToday: key === todayKey,
    } satisfies ActivityDay;
  });
}

function createSnapshot(entries: StreakCompletionEntry[]): StreakSnapshot {
  const normalizedEntries = normalizeStreakEntries(entries);
  const completedDates = normalizedEntries.map((entry) => dateKeyFromValue(entry.date));
  const completedSet = new Set(completedDates);
  const weeklyCompletedCount = getWeeklyCompletion(normalizedEntries);
  const weekStart = startOfWorkoutWeek(new Date());
  const recentStart = normalizeStreakDate(new Date());
  recentStart.setDate(recentStart.getDate() - 6);

  return {
    entries: normalizedEntries,
    completedDates,
    aiUsageDates: [],
    activeDates: completedDates,
    currentStreak: getStreak(normalizedEntries),
    totalCompletedDays: normalizedEntries.length,
    weeklyCompletedCount,
    weeklyActiveCount: weeklyCompletedCount,
    weeklyCompletionPercentage: Math.round((weeklyCompletedCount / 7) * 100),
    weeklyDays: buildDays(weekStart, 7, completedSet),
    recentDays: buildDays(recentStart, 7, completedSet),
    completedToday: getIsTodayCompleted(normalizedEntries),
  };
}

export function notifyFitnessActivityChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(FITNESS_ACTIVITY_EVENT));
}

export function StreakProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState(readCurrentUserId);
  const [entries, setEntries] = useState<StreakCompletionEntry[]>([]);
  const entriesRef = useRef<StreakCompletionEntry[]>([]);

  useEffect(() => {
    entriesRef.current = entries;
  }, [entries]);

  const refresh = useCallback(async () => {
    if (!userId) {
      setEntries([]);
      return;
    }

    const fresh = await fetchEntriesFromApi(userId);
    writeCachedEntries(userId, fresh);
    setEntries(fresh);
  }, [userId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleFocus = () => {
      setUserId(readCurrentUserId());
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "meraki_auth") {
        setUserId(readCurrentUserId());
        return;
      }

      if (userId && event.key === getStorageKey(userId)) {
        setEntries(readCachedEntries(userId));
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setEntries([]);
      return;
    }

    let cancelled = false;
    const cached = readCachedEntries(userId);
    setEntries(cached);

    async function load() {
      try {
        const fresh = await fetchEntriesFromApi(userId);
        if (cancelled) {
          return;
        }

        writeCachedEntries(userId, fresh);
        setEntries(fresh);
      } catch {
        if (!cancelled) {
          setEntries(cached);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const snapshot = useMemo(
    () => createSnapshot(userId ? entries : []),
    [entries, userId],
  );

  const setDayCompletion = useCallback(
    async (day: MarkableWorkoutDay, completed: boolean) => {
      if (!userId) {
        throw new Error("Log in to update your streak.");
      }

      const normalizedDate = createCompletionEntryFromDateKey(day.dateKey).date;
      const previousEntries = entriesRef.current;
      const optimisticEntries = setCompletionForDate(previousEntries, normalizedDate, completed);

      setEntries(optimisticEntries);
      writeCachedEntries(userId, optimisticEntries);
      notifyFitnessActivityChanged();

      try {
        const res = await fetch("/api/workout-calendar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            dateKey: day.dateKey,
            workout: day.workout,
            focus: day.focus,
            summary: day.summary,
            exercises: day.exercises,
            completed,
          }),
        });
        const json = (await res.json().catch(() => ({}))) as { message?: string };

        if (!res.ok) {
          throw new Error(json.message ?? "Failed to update streak.");
        }
      } catch (error) {
        setEntries(previousEntries);
        writeCachedEntries(userId, previousEntries);
        notifyFitnessActivityChanged();
        throw error instanceof Error ? error : new Error("Failed to update streak.");
      }
    },
    [userId],
  );

  const toggleDayCompletion = useCallback(
    async (day: MarkableWorkoutDay) => {
      const nextCompleted = !entriesRef.current.some(
        (entry) => dateKeyFromValue(entry.date) === day.dateKey,
      );
      await setDayCompletion(day, nextCompleted);
      return nextCompleted;
    },
    [setDayCompletion],
  );

  const syncWorkoutSession = useCallback(
    async (payload: WorkoutSessionSyncPayload) => {
      if (!userId) {
        throw new Error("Log in to sync your workout streak.");
      }

      const normalizedDate = createCompletionEntryFromDateKey(payload.dateKey).date;
      const previousEntries = entriesRef.current;
      const nextCompleted = hasMeaningfulWorkoutSession(payload.exercises);
      const optimisticEntries = setCompletionForDate(previousEntries, normalizedDate, nextCompleted);

      setEntries(optimisticEntries);
      writeCachedEntries(userId, optimisticEntries);
      notifyFitnessActivityChanged();

      try {
        const res = await fetch("/api/workout-session", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            dateKey: payload.dateKey,
            exercises: payload.exercises,
          }),
        });
        const json = (await res.json().catch(() => ({}))) as { message?: string };

        if (!res.ok) {
          throw new Error(json.message ?? "Failed to sync workout.");
        }
      } catch (error) {
        setEntries(previousEntries);
        writeCachedEntries(userId, previousEntries);
        notifyFitnessActivityChanged();
        throw error instanceof Error ? error : new Error("Failed to sync workout.");
      }
    },
    [userId],
  );

  const value = useMemo<StreakContextValue>(
    () => ({
      ...snapshot,
      isTodayCompleted: snapshot.completedToday,
      refresh,
      setDayCompletion,
      toggleDayCompletion,
      syncWorkoutSession,
    }),
    [refresh, setDayCompletion, snapshot, syncWorkoutSession, toggleDayCompletion],
  );

  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>;
}

export function useStreak() {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error("useStreak must be used inside StreakProvider");
  }

  return context;
}

export function useFitnessActivity() {
  return useStreak();
}

export type FitnessActivitySnapshot = StreakSnapshot;

export function recordAiActivity() {
  // Workout completion is the only thing that keeps the streak alive.
}

export function getActivityDayLabel(dateKey: string) {
  return normalizeStreakDate(createCompletionEntryFromDateKey(dateKey).date).toLocaleDateString(
    "en-US",
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    },
  );
}
