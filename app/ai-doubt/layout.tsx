import type { Metadata } from "next";

import { DashboardOnboardingGuard } from "@/components/auth/dashboard-onboarding-guard";
import { DashboardAppShell } from "@/components/dashboard/app-shell";
import { StreakProvider } from "@/components/providers/streak-provider";

export const metadata: Metadata = {
  title: "AI Doubt Solver",
  description: "Ask Meraki's AI coach fitness and nutrition questions inside the dashboard.",
};

export default function AIDoubtLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <StreakProvider>
      <DashboardAppShell>
        <DashboardOnboardingGuard>{children}</DashboardOnboardingGuard>
      </DashboardAppShell>
    </StreakProvider>
  );
}
