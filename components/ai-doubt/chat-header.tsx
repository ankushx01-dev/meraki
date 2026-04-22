"use client";

import type { SVGProps } from "react";

import type { ThemeMode } from "@/components/ai-doubt/theme";
import { TrashIcon } from "@/components/dashboard/icons";
import { cx } from "@/components/dashboard/ui";
import { MerakiLogoImage } from "@/components/meraki-logo-image";

function RefreshIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M19 7.5v4.5h-4.5M5 16.5V12h4.5m8.2-2.2a6 6 0 0 0-10-2m-1.4 6.4a6 6 0 0 0 10 2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M14.5 3.8a7.8 7.8 0 1 0 5.7 13.2A8.6 8.6 0 0 1 14.5 3.8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="3.75" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.75v2.1M12 19.15v2.1M4.75 12h2.1m10.3 0h2.1M5.7 5.7l1.48 1.48m9.64 9.64 1.48 1.48m0-12.6-1.48 1.48M7.18 16.82 5.7 18.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ChatHeader({
  conversationCount,
  onClear,
  onRegenerate,
  onThemeToggle,
  regenerateDisabled,
  sourceLabel,
  theme,
}: {
  conversationCount: number;
  onClear: () => void;
  onRegenerate: () => void;
  onThemeToggle: () => void;
  regenerateDisabled: boolean;
  sourceLabel: string;
  theme: ThemeMode;
}) {
  const isFallback = sourceLabel === "Fallback mode";

  return (
    <div className="border-b border-neutral-200/80 bg-white/82 px-6 py-5 backdrop-blur-xl dark:border-red-500/20 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 shadow-[0_18px_40px_rgba(239,68,68,0.14)] ring-1 ring-red-500/20">
              <MerakiLogoImage
                width={28}
                height={28}
                className="h-7 w-7 hover:scale-100 hover:rotate-0"
                priority
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif-heading text-3xl tracking-[-0.05em] text-neutral-950 dark:text-white sm:text-4xl">
                  AI Coach
                </h1>
                <span
                  className={cx(
                    "inline-flex rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
                    isFallback
                      ? "border border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100"
                      : "border border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-100",
                  )}
                >
                  {sourceLabel}
                </span>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600 dark:text-white/60">
                Ask fitness questions in plain language and get clear, practical answers without
                breaking your Meraki workflow.
              </p>

              <p className="mt-3 text-xs font-medium text-neutral-500 dark:text-white/45">
                {conversationCount} {conversationCount === 1 ? "chat" : "chats"} saved on this
                device
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <button
            type="button"
            onClick={onThemeToggle}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/85 px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-red-300 hover:text-red-700 dark:border-red-500/20 dark:bg-white/[0.04] dark:text-white/82 dark:hover:bg-red-500/10 dark:hover:text-white"
          >
            {theme === "dark" ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-500/14 dark:text-red-100"
          >
            <TrashIcon className="h-4 w-4" />
            Clear Chat
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            disabled={regenerateDisabled}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/85 px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-red-300 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:bg-white/[0.04] dark:text-white/82 dark:hover:bg-red-500/10 dark:hover:text-white"
          >
            <RefreshIcon className="h-4 w-4" />
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}
