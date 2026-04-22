import type { Metadata } from "next";
import { WeeklyWorkoutCalendar } from "@/components/dashboard/weekly-workout-calendar";
import { PageIntro } from "@/components/dashboard/ui";

export const metadata: Metadata = {
  title: "Workout Calendar ",
  description:
    "Plan your week in Meraki with an automatically generated workout split calendar.",
};

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Weekly Workout Calendar"
        description="Your Monday-to-Sunday training split updates automatically, and completed days sync into streaks and progress in real time."
      />

      <WeeklyWorkoutCalendar />
    </div>
  );
}
