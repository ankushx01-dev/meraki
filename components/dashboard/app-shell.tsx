"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  MERAKI_AI_THEME_EVENT,
  MERAKI_AI_THEME_KEY,
  isThemeMode,
  type ThemeMode,
} from "@/components/ai-doubt/theme";
import {
  CalculatorIcon,
  CalendarIcon,
  DashboardIcon,
  FlameIcon,
  HelpIcon,
  MenuIcon,
  PlansIcon,
  ProfileIcon,
  ProgressIcon,
  WorkoutsIcon,
} from "@/components/dashboard/icons";
import { MerakiLogoImage } from "@/components/meraki-logo-image";
import { cx } from "@/components/dashboard/ui";
import { dashboardRoutes } from "@/data/dashboard-content";
import { useFitnessActivity } from "@/lib/fitness-activity";

const navIcons = {
  "/dashboard": DashboardIcon,
  "/dashboard/calendar": CalendarIcon,
  "/calculator": CalculatorIcon,
  "/ai-doubt": HelpIcon,
  "/dashboard/nutrition": CalculatorIcon,
  "/dashboard/workouts": WorkoutsIcon,
  "/dashboard/progress": ProgressIcon,
  "/dashboard/plans": PlansIcon,
  "/dashboard/profile": ProfileIcon,
};

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

export function DashboardAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAIDoubtRoute = pathname.startsWith("/ai-doubt");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const activity = useFitnessActivity();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedMode = window.localStorage.getItem(MERAKI_AI_THEME_KEY);
    if (isThemeMode(storedMode)) {
      setThemeMode(storedMode);
    }

    const handleThemeEvent = (event: Event) => {
      const nextTheme = (event as CustomEvent<ThemeMode>).detail;
      if (isThemeMode(nextTheme)) {
        setThemeMode(nextTheme);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === MERAKI_AI_THEME_KEY && isThemeMode(event.newValue)) {
        setThemeMode(event.newValue);
      }
    };

    window.addEventListener(MERAKI_AI_THEME_EVENT, handleThemeEvent as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        MERAKI_AI_THEME_EVENT,
        handleThemeEvent as EventListener,
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(MERAKI_AI_THEME_KEY, themeMode);
    document.documentElement.style.colorScheme = themeMode;
    document.documentElement.classList.toggle("dark", themeMode === "dark");
    window.dispatchEvent(
      new CustomEvent<ThemeMode>(MERAKI_AI_THEME_EVENT, { detail: themeMode }),
    );
  }, [themeMode]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("meraki_auth");
      }
      await signOut({ redirect: false, redirectTo: "/login" });
      router.replace("/login");
      router.refresh();
    } finally {
      setMobileMenuOpen(false);
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060907] text-white">
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="lg:grid lg:min-h-screen lg:grid-cols-[15rem_minmax(0,1fr)] 2xl:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className={cx(
          "fixed inset-y-0 left-0 z-50 min-h-screen w-80 transform border-r border-white/8 bg-[#080d0b] transition-transform lg:relative lg:z-auto lg:flex lg:w-auto lg:translate-x-0 lg:flex-col",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="border-b border-white/8 px-4 py-5">
            <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
              <MerakiLogoImage width={36} height={45} />
              <div>
                <p className="font-brand text-2xl tracking-[-0.03em] text-white">
                  Meraki
                </p>
                <p className="text-xs text-white/45">Smart Gym Tracker</p>
              </div>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="px-3 py-5">
              <ul className="space-y-2">
                {dashboardRoutes.map((route) => {
                  const Icon = navIcons[route.href as keyof typeof navIcons];
                  const active = isActive(pathname, route.href);

                  return (
                    <li key={route.href}>
                      <Link
                        href={route.href}
                        className={cx(
                          "group flex items-center gap-3 rounded-lg border-l-4 border-transparent px-4 py-2.5 text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-red-500/20 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                            : "text-neutral-400 hover:bg-red-500/10 hover:text-white",
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon
                          className={cx(
                            "h-4 w-4 transition-all duration-200",
                            active ? "text-red-400" : "text-neutral-400 group-hover:text-red-400",
                          )}
                        />
                        {route.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-4 px-3 pb-4">
              <div className="rounded-[24px] bg-[linear-gradient(180deg,#11161f_0%,#0d1218_100%)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.2)] ring-1 ring-white/8">
                <div className="flex items-center gap-2 text-[#ff8a56]">
                  <div className="rounded-full bg-[#291812] p-2">
                    <FlameIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-white">Streak</span>
                </div>
                <div className="mt-4">
                  <p className="font-brand text-4xl tracking-[-0.05em] text-white">
                    {activity.currentStreak}
                  </p>
                  <p className="mt-1 text-sm text-[#9db0a4]">
                    {activity.currentStreak === 1 ? "day in a row" : "days in a row"}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-1.5">
                  {activity.recentDays.map((day) => (
                    <span
                      key={day.key}
                      title={`${day.shortLabel} ${day.dateLabel}`}
                      className={cx(
                        "h-2.5 rounded-full transition-all",
                        day.completed
                          ? "bg-[#ff4d4f] shadow-[0_0_14px_rgba(239,68,68,0.28)]"
                          : day.active
                            ? "bg-[#ff9a9b]"
                            : "bg-white/10",
                      )}
                    />
                  ))}
                </div>
                <div className="mt-4 rounded-[18px] bg-white/[0.03] px-3 py-3 ring-1 ring-white/6">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#ff9583]">
                    This week
                  </p>
                  <p className="mt-2 text-sm text-white">
                    {activity.weeklyCompletedCount}/7 workouts completed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/8 px-3 py-4">
            <div className="rounded-[20px] bg-white/[0.04] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] ring-1 ring-white/6">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#ff4d4f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#ff5f61] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="sticky top-0 z-30 border-b border-white/8 bg-[#060907]/95 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <button
                type="button"
                className="rounded-full bg-white/[0.04] p-2 text-[#c8d4cd] hover:text-white"
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon className="h-5 w-5" />
              </button>

              <Link href="/dashboard" className="flex items-center gap-3">
                <MerakiLogoImage width={32} height={40} />
                <div>
                  <p className="font-brand text-xl tracking-[-0.03em] text-white">
                    Meraki
                  </p>
                  <p className="text-[0.7rem] text-white/45">
                    Smart Gym Tracker
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard/profile"
                className="rounded-full bg-white/[0.04] p-2 text-[#b9c6e4]"
              >
                <ProfileIcon className="h-5 w-5" />
              </Link>
            </div>

            <div className="overflow-x-auto px-4 pb-4">
              <div className="flex min-w-max gap-2">
                {dashboardRoutes.map((route) => {
                  const Icon = navIcons[route.href as keyof typeof navIcons];
                  const active = isActive(pathname, route.href);

                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cx(
                        "group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 transition-all duration-200",
                        active
                          ? "bg-red-500/20 text-white ring-red-500/35 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                          : "bg-white/[0.03] text-neutral-400 ring-white/8 hover:bg-red-500/10 hover:text-white",
                      )}
                    >
                      <Icon
                        className={cx(
                          "h-4 w-4 transition-all duration-200",
                          active ? "text-red-400" : "text-neutral-400 group-hover:text-red-400",
                        )}
                      />
                      {route.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 2xl:px-10">
            <div className="mx-auto w-full max-w-none">{children}</div>
          </main>

          <div className="fixed bottom-4 right-4 lg:bottom-5 lg:right-5">
            <Link
              href="/ai-doubt"
              aria-label="Open AI Doubt Solver"
              className={cx(
                "rounded-full p-2.5 shadow-[0_14px_30px_rgba(0,0,0,0.24)] hover:text-white",
                isAIDoubtRoute
                  ? "bg-[#2b1315] text-[#ff9a9b] ring-1 ring-[#ef4444]/20"
                  : "bg-[#1d1113] text-[#ff9a9b] ring-1 ring-[#ef4444]/20",
              )}
            >
              <HelpIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
