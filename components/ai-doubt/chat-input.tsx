"use client";

import type { FormEvent, KeyboardEvent, MutableRefObject, SVGProps } from "react";

function SendIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M20.5 4.5 10.4 14.6m10.1-10.1-6.1 15-3.1-6.1-6.1-3.1 15.3-5.8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ChatInput({
  draft,
  disabled,
  error,
  onChange,
  onShortcutSubmit,
  onSubmit,
  textareaRef,
}: {
  draft: string;
  disabled: boolean;
  error: string;
  onChange: (value: string) => void;
  onShortcutSubmit: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!disabled) {
        onShortcutSubmit();
      }
    }
  }

  return (
    <div className="border-t border-neutral-200/80 bg-white/78 px-4 py-4 backdrop-blur-xl dark:border-red-500/20 dark:bg-neutral-950/80 sm:px-6">
      {error ? (
        <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mx-auto w-full max-w-[700px]">
        <label htmlFor="ai-doubt-input" className="sr-only">
          Ask your fitness doubt
        </label>
        <div className="flex items-end gap-3 rounded-full border border-neutral-200/80 bg-white/85 p-2 pl-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-red-500/20 dark:bg-white/[0.05] dark:shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
          <textarea
            id="ai-doubt-input"
            ref={textareaRef}
            rows={1}
            value={draft}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your fitness doubt..."
            className="min-h-[54px] flex-1 resize-none bg-transparent py-3 text-sm leading-7 text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white dark:placeholder:text-white/30"
          />

          <button
            type="submit"
            disabled={disabled}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_16px_32px_rgba(239,68,68,0.24)] transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            <SendIcon className="h-4.5 w-4.5" />
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-neutral-500 dark:text-white/40">
          Meraki can make mistakes. Double-check anything important to your health.
        </p>
      </form>
    </div>
  );
}
