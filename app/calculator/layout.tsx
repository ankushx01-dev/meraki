import { DashboardAppShell } from "@/components/dashboard/app-shell";
import { StreakProvider } from "@/components/providers/streak-provider";

export default function CalculatorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <StreakProvider>
      <DashboardAppShell>{children}</DashboardAppShell>
    </StreakProvider>
  );
}
