"use client";

import type { SVGProps } from "react";

function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Zm6.2 11.6.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8ZM5.2 14.3l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SuggestedPanel({
  conversationCount,
  isSubmitting,
  onSelect,
  questions,
}: {
  conversationCount: number;
  isSubmitting: boolean;
  onSelect: (question: string) => void;
  questions: string[];
}) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-0 w-full max-w-[300px] space-y-4">
        <div className="rounded-[28px] border border-neutral-200/80 bg-white/78 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-red-500/20 dark:bg-white/[0.04] dark:shadow-[0_18px_48px_rgba(0,0,0,0.34)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 dark:bg-red-500/14 dark:text-red-300">
              <SparkleIcon className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Suggested questions
              </h2>
              <p className="mt-1 text-xs text-neutral-500 dark:text-white/45">
                {conversationCount > 0
                  ? `${conversationCount} saved chats on this device`
                  : "Tap a prompt to start quickly"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {questions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onSelect(question)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/82 px-3.5 py-2 text-left text-sm text-neutral-700 shadow-sm transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-55 dark:border-red-500/15 dark:bg-white/[0.03] dark:text-white/80 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-white"
              >
                <span className="max-w-[13rem] truncate">{question}</span>
                <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-red-500" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-neutral-200/80 bg-white/78 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-red-500/20 dark:bg-white/[0.04] dark:shadow-[0_18px_48px_rgba(0,0,0,0.34)]">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            How to ask better
          </h3>

          <div className="mt-4 space-y-3 text-sm leading-6 text-neutral-600 dark:text-white/65">
            <div className="rounded-2xl border border-neutral-200/80 bg-white/82 px-4 py-3 dark:border-red-500/15 dark:bg-white/[0.03]">
              Tell the coach your goal: fat loss, muscle gain, performance, or recovery.
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white/82 px-4 py-3 dark:border-red-500/15 dark:bg-white/[0.03]">
              Mention what you already tried and what feels stuck.
            </div>
            <div className="rounded-2xl border border-neutral-200/80 bg-white/82 px-4 py-3 dark:border-red-500/15 dark:bg-white/[0.03]">
              Include limits like schedule, soreness, appetite, or equipment.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
