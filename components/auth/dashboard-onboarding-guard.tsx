"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function DashboardOnboardingGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("meraki_auth") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    let cancelled = false;
    fetch("/api/onboarding", {
      headers: { "x-user-email": token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const completed = Boolean(data?.onboardingCompleted);
        const isOnboardingPage = pathname === "/dashboard/onboarding";
        if (!completed && !isOnboardingPage) {
          router.replace("/dashboard/onboarding");
          return;
        }
        if (completed && isOnboardingPage) {
          router.replace("/dashboard");
        }
      })
      .catch(() => {
        // If onboarding status fails, keep user on current page.
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return <>{children}</>;
}