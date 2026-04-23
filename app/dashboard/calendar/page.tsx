import type { Metadata } from "next";
import { WeeklyWorkoutCalendar } from "@/components/dashboard/weekly-workout-calendar";
import { PageIntro } from "@/components/dashboard/ui";

export const metadata: Metadata = {
  title: "Weekly Workout Calendar",
  description: "Track this week's workout streak and manage your weekly training plan in Meraki.",
};

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Weekly Workout Calendar"
        description="Your current 7-day streak and weekly plan in one place."
      />

      <WeeklyWorkoutCalendar />
    </div>
  );
}
