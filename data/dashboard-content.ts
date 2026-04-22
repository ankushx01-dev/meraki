export type NavRoute = {
  label: string;
  href: string;
};

export type OverviewStat = {
  label: string;
  value: string;
  detail: string;
  icon: "calendar" | "trend" | "flame" | "goal";
  accent?: "red" | "green";
};

export const dashboardRoutes: NavRoute[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Calendar", href: "/dashboard/calendar" },
  { label: "Calculator", href: "/calculator" },
  { label: "AI Doubt Solver", href: "/ai-doubt" },
  { label: "Nutrition", href: "/dashboard/nutrition" },
  { label: "Workouts", href: "/dashboard/workouts" },
  { label: "Progress", href: "/dashboard/progress" },
  { label: "Plans", href: "/dashboard/plans" },
  { label: "Profile", href: "/dashboard/profile" },
];

export const dashboardOverviewStats: OverviewStat[] = [
  {
    label: "Today's Workout",
    value: "Chest & Back",
    detail: "3 exercises remaining",
    icon: "calendar",
  },
  {
    label: "Weekly Progress",
    value: "5/7 days",
    detail: "Great consistency!",
    icon: "trend",
  },
  {
    label: "Calories Burned",
    value: "2,850",
    detail: "This week",
    icon: "flame",
  },
  {
    label: "Goal Progress",
    value: "82%",
    detail: "Keep pushing!",
    icon: "goal",
  },
];

export const weeklyCalories = [
  { label: "Mon", value: 450 },
  { label: "Tue", value: 380 },
  { label: "Wed", value: 520 },
  { label: "Thu", value: 495 },
  { label: "Fri", value: 605 },
  { label: "Sat", value: 420 },
  { label: "Sun", value: 390 },
];

export const dashboardWeightProgress = [
  { label: "W1", value: 150 },
  { label: "W2", value: 148 },
  { label: "W3", value: 147 },
  { label: "W4", value: 145 },
];

export const todayWorkoutPlan = [
  {
    name: "Bench Press",
    detail: "4 sets • 8-10 reps",
    done: true,
  },
  {
    name: "Incline Dumbbell Press",
    detail: "3 sets • 10-12 reps",
    done: true,
  },
  {
    name: "Pull-ups",
    detail: "4 sets • 8-10 reps",
    done: false,
  },
  {
    name: "Barbell Rows",
    detail: "4 sets • 8-10 reps",
    done: false,
  },
  {
    name: "Cable Flyes",
    detail: "3 sets • 12-15 reps",
    done: false,
  },
];

export const workoutEntries = [
  {
    name: "Bench Press",
    sets: "4",
    reps: "8",
    weight: "185 lbs",
  },
  {
    name: "Squats",
    sets: "4",
    reps: "10",
    weight: "225 lbs",
  },
];

export const progressHeaderStats = [
  {
    label: "Weight Change",
    value: "-6 lbs",
    delta: "↓ -3.6%",
    detail: "Last 4 months",
  },
  {
    label: "Strength Gain",
    value: "+45 lbs",
    delta: "↑ +22%",
    detail: "Total lifts",
  },
  {
    label: "Workouts Completed",
    value: "22",
    delta: "↑ +15%",
    detail: "This month",
  },
];

export const monthlyWeight = [
  { label: "Jan", value: 166 },
  { label: "Feb", value: 164 },
  { label: "Mar", value: 162 },
  { label: "Apr", value: 160 },
];

export const strengthByLift = [
  { label: "Bench", value: 160 },
  { label: "Squat", value: 210 },
  { label: "Deadlift", value: 260 },
  { label: "OHP", value: 110 },
];

export const weeklyActivity = [
  { label: "Week 1", value: 5 },
  { label: "Week 2", value: 6 },
  { label: "Week 3", value: 4 },
  { label: "Week 4", value: 7 },
];

export const muscleGroupAnalysis = [
  { label: "Chest", value: 0.76 },
  { label: "Back", value: 0.83 },
  { label: "Legs", value: 0.8 },
  { label: "Shoulders", value: 0.68 },
  { label: "Arms", value: 0.59 },
  { label: "Core", value: 0.72 },
];

export const milestones = [
  {
    title: "Personal Record: Bench Press",
    detail: "New max of 185 lbs",
    time: "2 days ago",
  },
  {
    title: "Consistency Streak",
    detail: "7 days in a row",
    time: "Today",
  },
  {
    title: "Weight Goal Reached",
    detail: "Hit 160 lbs target",
    time: "1 week ago",
  },
];

export const planTiers = [
  {
    name: "Free Plan",
    price: "₹0",
    detail: "Get users hooked with essential tracking",
    featured: false,
    features: [
      "5 workouts per month",
      "Basic dashboard (Today view)",
      "Simple progress with numbers only",
      "Manual workout logging",
      "No charts",
      "No history insights",
      "No smart suggestions",
    ],
  },
  {
    name: "Pro Plan",
    price: "₹199",
    detail: "Main revenue plan built to feel essential",
    featured: true,
    features: [
      "Unlimited workouts",
      "Full progress dashboard with charts and trends",
      "Calendar-based workout planning",
      "Smart workout suggestions",
      "Workout history with filter and search",
      "Streak tracking",
    ],
  },
  {
    name: "Elite Plan",
    price: "₹499",
    detail: "Premium coaching-style experience",
    featured: false,
    features: [
      "Everything in Pro",
      "Nutrition tracking with calories and macros",
      "AI insights for consistency and missed sessions",
      "Advanced analytics and muscle-group tracking",
      "Weekly performance scoring",
      "Personalized plans from onboarding data",
      "Priority support",
    ],
  },
];

export const profileSummary = {
  name: "Alex Morgan",
  tier: "Pro Member",
  memberSince: "January 2026",
  totalWorkouts: "142 completed",
  currentStreak: "7 days",
};
