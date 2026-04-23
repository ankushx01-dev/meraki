"use client";

export {
  getActivityDayLabel,
  notifyFitnessActivityChanged,
  recordAiActivity,
  StreakProvider,
  useFitnessActivity,
  useStreak,
} from "@/components/providers/streak-provider";

export type {
  FitnessActivitySnapshot,
  StreakSnapshot,
} from "@/components/providers/streak-provider";
