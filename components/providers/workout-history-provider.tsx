"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  WORKOUT_HISTORY_STORAGE_KEY,
  calculateMonthlyStrengthSnapshot,
  calculateWeightProgress,
  calculateYearlyCompletionTrend,
  createWorkoutSession,
  defaultMonthlySnapshot,
  listExercises,
  monthlyStrengthToChart,
  normalizeWorkoutHistory,
  type ChartDatum,
  type MonthlyStrengthSnapshot,
  type WorkoutExerciseInput,
  type WorkoutHistorySession,
  type WeightProgressPoint,
} from "@/lib/workout-history";

type SaveWorkoutSessionParams = {
  date?: string | Date;
  exercises: WorkoutExerciseInput[];
  userId?: string;
};

type SaveWorkoutSessionResult = {
  ok: boolean;
  message: string;
  session?: WorkoutHistorySession;
};

type WorkoutHistoryContextValue = {
  loading: boolean;
  workoutHistory: WorkoutHistorySession[];
  monthlySnapshot: MonthlyStrengthSnapshot;
  monthlyStrengthData: ChartDatum[];
  yearlyCompletionData: ChartDatum[];
  exerciseOptions: string[];
  saveWorkoutSession: (
    params: SaveWorkoutSessionParams,
  ) => SaveWorkoutSessionResult;
  getWeightProgressData: (exerciseName: string) => WeightProgressPoint[];
};

const WorkoutHistoryContext = createContext<WorkoutHistoryContextValue | null>(null);

function readStoredHistory() {
  if (typeof window === "undefined") {
    return [] as WorkoutHistorySession[];
  }

  const raw = window.localStorage.getItem(WORKOUT_HISTORY_STORAGE_KEY);
  if (!raw) {
    return [] as WorkoutHistorySession[];
  }

  try {
    return normalizeWorkoutHistory(JSON.parse(raw));
  } catch {
    return [] as WorkoutHistorySession[];
  }
}

function readCurrentUserId() {
  if (typeof window === "undefined") {
    return "";
  }
  return window.localStorage.getItem("meraki_auth") ?? "";
}

export function WorkoutHistoryProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<WorkoutHistorySession[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    setHistory(readStoredHistory());
    setCurrentUserId(readCurrentUserId());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(WORKOUT_HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history, loading]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === WORKOUT_HISTORY_STORAGE_KEY) {
        setHistory(readStoredHistory());
      }
      if (event.key === "meraki_auth") {
        setCurrentUserId(readCurrentUserId());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const workoutHistory = useMemo(() => {
    if (!currentUserId) {
      return history;
    }
    return history.filter((session) => !session.userId || session.userId === currentUserId);
  }, [currentUserId, history]);

  const monthlySnapshot = useMemo(() => {
    if (loading) {
      return defaultMonthlySnapshot();
    }
    return calculateMonthlyStrengthSnapshot(workoutHistory);
  }, [loading, workoutHistory]);

  const monthlyStrengthData = useMemo(
    () => monthlyStrengthToChart(monthlySnapshot),
    [monthlySnapshot],
  );

  const yearlyCompletionData = useMemo(
    () => calculateYearlyCompletionTrend(workoutHistory),
    [workoutHistory],
  );

  const exerciseOptions = useMemo(
    () => listExercises(workoutHistory),
    [workoutHistory],
  );

  const getWeightProgressData = useCallback(
    (exerciseName: string) => calculateWeightProgress(workoutHistory, exerciseName),
    [workoutHistory],
  );

  const saveWorkoutSession = useCallback(
    (params: SaveWorkoutSessionParams): SaveWorkoutSessionResult => {
      const session = createWorkoutSession({
        userId: params.userId ?? currentUserId,
        date: params.date,
        exercises: params.exercises,
      });

      if (!session) {
        return {
          ok: false,
          message: "Add at least one filled set before saving your workout.",
        };
      }

      setHistory((current) =>
        normalizeWorkoutHistory([...current, session]),
      );

      return {
        ok: true,
        message: `Workout saved for ${session.date}.`,
        session,
      };
    },
    [currentUserId],
  );

  const value = useMemo<WorkoutHistoryContextValue>(
    () => ({
      loading,
      workoutHistory,
      monthlySnapshot,
      monthlyStrengthData,
      yearlyCompletionData,
      exerciseOptions,
      saveWorkoutSession,
      getWeightProgressData,
    }),
    [
      exerciseOptions,
      getWeightProgressData,
      loading,
      monthlySnapshot,
      monthlyStrengthData,
      saveWorkoutSession,
      workoutHistory,
      yearlyCompletionData,
    ],
  );

  return (
    <WorkoutHistoryContext.Provider value={value}>
      {children}
    </WorkoutHistoryContext.Provider>
  );
}

export function useWorkoutHistory() {
  const context = useContext(WorkoutHistoryContext);
  if (!context) {
    throw new Error("useWorkoutHistory must be used inside WorkoutHistoryProvider");
  }
  return context;
}
