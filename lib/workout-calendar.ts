export const workoutSplit = ["Push", "Pull", "Legs", "Rest"] as const;

export type WorkoutType = (typeof workoutSplit)[number];

export type WorkoutTemplate = {
  focus: string;
  summary: string;
  exercises: string[];
};

export type WorkoutScheduleDay = {
  key: string;
  dayLabel: string;
  dateLabel: string;
  workout: string;
  isToday: boolean;
  focus: string;
  summary: string;
  exercises: string[];
};

export type SavedWorkoutCalendarDay = {
  dateKey: string;
  workout?: string;
  focus?: string;
  summary?: string;
  exercises?: string[];
  completed?: boolean;
};

export type WorkoutDayDraft = {
  workout: string;
  focus: string;
  summary: string;
  exercisesText: string;
};

const workoutDetails: Record<WorkoutType, WorkoutTemplate> = {
  Push: {
    focus: "Chest, shoulders, and triceps",
    summary: "Heavy compounds with one hypertrophy finisher.",
    exercises: [
      "Bench Press — 4 sets",
      "Overhead Press — 3 sets",
      "Incline Dumbbell Press — 3 sets",
      "Cable Triceps Pressdown — 3 sets",
    ],
  },
  Pull: {
    focus: "Back, biceps, and posterior chain",
    summary: "Strength-first pull work with grip and upper-back volume.",
    exercises: [
      "Barbell Row — 4 sets",
      "Pull-ups — 4 sets",
      "Lat Pulldown — 3 sets",
      "Hammer Curl — 3 sets",
    ],
  },
  Legs: {
    focus: "Quads, glutes, hamstrings, and calves",
    summary: "Big lower-body session with a strength top set and accessories.",
    exercises: [
      "Back Squat — 4 sets",
      "Romanian Deadlift — 3 sets",
      "Leg Press — 3 sets",
      "Standing Calf Raise — 4 sets",
    ],
  },
  Rest: {
    focus: "Recovery and mobility",
    summary: "Low-intensity day focused on walking, stretching, and sleep.",
    exercises: [
      "20-minute walk",
      "10-minute mobility flow",
      "Foam rolling",
      "Hydration + recovery check-in",
    ],
  },
};

export function startOfWorkoutWeek(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function workoutDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseWorkoutDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getWorkoutTypeForDate(date: Date) {
  const weekStart = startOfWorkoutWeek(date);
  const dayOffset = Math.round(
    (parseWorkoutDateKey(workoutDateKey(date)).getTime() - weekStart.getTime()) /
      (24 * 60 * 60 * 1000),
  );
  const normalizedIndex =
    ((dayOffset % workoutSplit.length) + workoutSplit.length) % workoutSplit.length;
  return workoutSplit[normalizedIndex];
}

export function getWorkoutTemplate(workout: string): WorkoutTemplate {
  if (workout in workoutDetails) {
    return workoutDetails[workout as WorkoutType];
  }

  return {
    focus: "Custom training split",
    summary: "User-defined workout day.",
    exercises: ["Add your custom exercises below"],
  };
}

export function createWorkoutScheduleDay(date: Date): WorkoutScheduleDay {
  const normalizedDate = parseWorkoutDateKey(workoutDateKey(date));
  const workout = getWorkoutTypeForDate(normalizedDate);
  const template = getWorkoutTemplate(workout);
  const key = workoutDateKey(normalizedDate);
  const todayKey = workoutDateKey(new Date());

  return {
    key,
    dayLabel: normalizedDate.toLocaleDateString("en-US", { weekday: "short" }),
    dateLabel: normalizedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    workout,
    isToday: key === todayKey,
    focus: template.focus,
    summary: template.summary,
    exercises: template.exercises,
  };
}

export function buildWorkoutSchedule(startDate: Date, count: number) {
  const normalizedStart = parseWorkoutDateKey(workoutDateKey(startDate));

  return Array.from({ length: count }).map((_, index) => {
    const date = new Date(normalizedStart);
    date.setDate(normalizedStart.getDate() + index);
    return createWorkoutScheduleDay(date);
  });
}

export function getWorkoutDayDefaults(dateKey: string) {
  const day = createWorkoutScheduleDay(parseWorkoutDateKey(dateKey));

  return {
    workout: day.workout,
    focus: day.focus,
    summary: day.summary,
    exercises: day.exercises,
  };
}

export function buildWorkoutScheduleDayFromKey(dateKey: string) {
  return createWorkoutScheduleDay(parseWorkoutDateKey(dateKey));
}

export function buildWeeklyWorkoutSchedule(referenceDate: Date) {
  return buildWorkoutSchedule(startOfWorkoutWeek(referenceDate), 7);
}

export function mergeWorkoutCalendarDays(
  schedule: WorkoutScheduleDay[],
  savedDays: SavedWorkoutCalendarDay[],
) {
  const byKey = new Map(savedDays.map((day) => [day.dateKey, day]));

  return schedule.map((day) => {
    const saved = byKey.get(day.key);
    if (!saved) {
      return day;
    }

    const workout = typeof saved.workout === "string" && saved.workout.trim()
      ? saved.workout.trim()
      : day.workout;
    const template = getWorkoutTemplate(workout);

    return {
      ...day,
      workout,
      focus:
        typeof saved.focus === "string" && saved.focus.trim()
          ? saved.focus.trim()
          : template.focus,
      summary:
        typeof saved.summary === "string" && saved.summary.trim()
          ? saved.summary.trim()
          : template.summary,
      exercises:
        Array.isArray(saved.exercises) && saved.exercises.length > 0
          ? saved.exercises.map((exercise) => String(exercise))
          : template.exercises,
    };
  });
}

export function getSelectedWorkoutDay(
  schedule: WorkoutScheduleDay[],
  selectedKey?: string,
) {
  if (selectedKey) {
    const selected = schedule.find((day) => day.key === selectedKey);
    if (selected) {
      return selected;
    }
  }

  return schedule.find((day) => day.isToday) ?? schedule[0] ?? null;
}

export function createWorkoutDayDraft(day: WorkoutScheduleDay): WorkoutDayDraft {
  return {
    workout: day.workout,
    focus: day.focus,
    summary: day.summary,
    exercisesText: day.exercises.join("\n"),
  };
}
