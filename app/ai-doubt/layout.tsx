import type { Metadata } from "next";

import { DashboardOnboardingGuard } from "@/components/auth/dashboard-onboarding-guard";
import { DashboardAppShell } from "@/components/dashboard/app-shell";

export const metadata: Metadata = {
  title: "AI Doubt Solver",
  description: "Ask Meraki's AI coach fitness and nutrition questions inside the dashboard.",
};

export default function AIDoubtLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <DashboardAppShell>
      <DashboardOnboardingGuard>{children}</DashboardOnboardingGuard>
    </DashboardAppShell>
  );
}
