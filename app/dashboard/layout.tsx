import type { Metadata } from "next";
import { DashboardOnboardingGuard } from "@/components/auth/dashboard-onboarding-guard";
import { DashboardAppShell } from "@/components/dashboard/app-shell";
import { StreakProvider } from "@/components/providers/streak-provider";
import { WorkoutHistoryProvider } from "@/components/providers/workout-history-provider";

export const metadata: Metadata = {
  title: "Dashboard - Meraki",
  description: "Post-login training dashboard for Meraki Smart Gym Tracker.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <StreakProvider>
      <DashboardAppShell>
        <WorkoutHistoryProvider>
          <DashboardOnboardingGuard>{children}</DashboardOnboardingGuard>
        </WorkoutHistoryProvider>
      </DashboardAppShell>
    </StreakProvider>
  );
}
