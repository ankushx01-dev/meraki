"use client";

import { MerakiLogoImage } from "@/components/meraki-logo-image";
import { cx } from "@/components/dashboard/ui";
import type { ChatMessage } from "@/components/ai-doubt/types";

function formatMessageTime(createdAt: string) {
  if (!createdAt) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

function BotAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 shadow-[0_14px_28px_rgba(239,68,68,0.24)] ring-1 ring-red-400/25">
      <MerakiLogoImage
        width={20}
        height={20}
        className="h-5 w-5 hover:scale-100 hover:rotate-0"
      />
    </div>
  );
}

function ReplySection({
  label,
  tone,
  value,
}: {
  label: "Answer" | "Tip" | "Warning";
  tone: "answer" | "tip" | "warning";
  value: string;
}) {
  const sectionClass =
    tone === "answer"
      ? "border-neutral-200/80 bg-white/80 text-neutral-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/88"
      : tone === "tip"
        ? "border-red-200 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-50"
        : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-50";

  const badgeClass =
    tone === "answer"
      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
      : tone === "tip"
        ? "bg-red-500 text-white"
        : "bg-amber-500 text-white";

  return (
    <div className={cx("rounded-2xl border p-4", sectionClass)}>
      <span
        className={cx(
          "inline-flex rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em]",
          badgeClass,
        )}
      >
        {label}
      </span>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7">{value}</p>
    </div>
  );
}

export function ChatBubble({
  message,
  typedContent,
}: {
  message: ChatMessage;
  typedContent?: string;
}) {
  const isUser = message.role === "user";
  const isTyping = message.status === "typing";

  if (isUser) {
    return (
      <div className="ai-message-fade flex justify-end">
        <div className="max-w-[78%] rounded-[28px] bg-gradient-to-br from-red-500 to-red-600 px-5 py-4 text-white shadow-[0_18px_40px_rgba(239,68,68,0.24)] ring-1 ring-red-400/20 sm:max-w-[70%]">
          <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>
          <p className="mt-2 text-right text-xs text-white/70">
            {formatMessageTime(message.createdAt)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-message-fade flex items-start gap-3">
      <BotAvatar />

      <div className="max-w-[78%] rounded-[28px] border border-neutral-200/80 bg-white/82 px-4 py-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-red-500/20 dark:bg-white/[0.04] dark:shadow-[0_18px_48px_rgba(0,0,0,0.34)] sm:max-w-[70%] sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              Meraki Coach
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-white/45">
              {message.source === "fallback" ? "Fallback coach" : "AI assistant"}
            </p>
          </div>
          <p className="text-xs text-neutral-400 dark:text-white/35">
            {formatMessageTime(message.createdAt)}
          </p>
        </div>

        {isTyping ? (
          <div className="mt-4 text-sm leading-7 text-neutral-700 dark:text-white/88">
            {typedContent ? (
              <>
                {typedContent}
                <span className="ml-1 inline-block h-5 w-[2px] animate-pulse rounded-full bg-red-500" />
              </>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="ai-typing-dot h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="ai-typing-dot h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="ai-typing-dot h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
            )}
          </div>
        ) : message.reply ? (
          <div className="mt-4 space-y-3">
            <ReplySection label="Answer" tone="answer" value={message.reply.answer} />
            <ReplySection label="Tip" tone="tip" value={message.reply.tip} />
            {message.reply.warning.trim() ? (
              <ReplySection
                label="Warning"
                tone="warning"
                value={message.reply.warning}
              />
            ) : null}
          </div>
        ) : (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-neutral-700 dark:text-white/88">
            {message.content}
          </p>
        )}
      </div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="ai-message-fade flex items-start gap-3">
      <BotAvatar />

      <div className="rounded-[28px] border border-neutral-200/80 bg-white/82 px-5 py-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-red-500/20 dark:bg-white/[0.04] dark:shadow-[0_18px_48px_rgba(0,0,0,0.34)]">
        <div className="flex items-center gap-1.5">
          <span className="ai-typing-dot h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="ai-typing-dot h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="ai-typing-dot h-2.5 w-2.5 rounded-full bg-red-500" />
        </div>
      </div>
    </div>
  );
}
