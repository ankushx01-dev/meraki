"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ChatBubble, TypingBubble } from "@/components/ai-doubt/chat-bubble";
import { ChatHeader } from "@/components/ai-doubt/chat-header";
import { ChatInput } from "@/components/ai-doubt/chat-input";
import { SuggestedPanel } from "@/components/ai-doubt/suggested-panel";
import {
  MERAKI_AI_THEME_EVENT,
  MERAKI_AI_THEME_KEY,
  isThemeMode,
  type ThemeMode,
} from "@/components/ai-doubt/theme";
import type {
  AIDoubtApiResponse,
  ChatMessage,
} from "@/components/ai-doubt/types";
import { cx } from "@/components/dashboard/ui";
import {
  AI_DOUBT_SUGGESTED_QUESTIONS,
  formatAIDoubtReply,
  type AIDoubtReply,
  type AIDoubtSource,
  type ConversationMessage,
} from "@/lib/ai-doubt";
import { recordAiActivity } from "@/lib/fitness-activity";

const MESSAGE_STORAGE_KEY = "meraki_ai_doubt_history_v3";

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `msg-${Math.random().toString(36).slice(2, 10)}`;
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: "welcome",
    role: "assistant",
    content:
      "Hi, I’m your Meraki AI coach.\nAsk about workouts, muscle gain, fat loss, recovery, supplements, or nutrition and I’ll keep the answer clear and practical.",
    createdAt: new Date().toISOString(),
    status: "ready",
  };
}

function createUserMessage(content: string): ChatMessage {
  return {
    id: createId(),
    role: "user",
    content: content.trim(),
    createdAt: new Date().toISOString(),
    status: "ready",
  };
}

function createAssistantMessage(
  reply: AIDoubtReply,
  status: ChatMessage["status"],
  source: AIDoubtSource,
): ChatMessage {
  return {
    id: createId(),
    role: "assistant",
    content: formatAIDoubtReply(reply),
    createdAt: new Date().toISOString(),
    status,
    reply,
    source,
  };
}

function isStoredReply(value: unknown): value is AIDoubtReply {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.answer === "string" &&
    typeof candidate.tip === "string" &&
    typeof candidate.warning === "string"
  );
}

function isStoredChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const reply = candidate.reply;
  const source = candidate.source;

  return (
    typeof candidate.id === "string" &&
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string" &&
    typeof candidate.createdAt === "string" &&
    (candidate.status === "ready" || candidate.status === "typing") &&
    (reply == null || isStoredReply(reply)) &&
    (source == null || source === "openai" || source === "fallback")
  );
}

function getLastUserIndex(messages: ChatMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "user") {
      return index;
    }
  }

  return -1;
}

function toConversation(messages: ChatMessage[]): ConversationMessage[] {
  return messages.map(({ role, content }) => ({ role, content }));
}

export function CoachWorkspace() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [themeReady, setThemeReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcomeMessage()]);
  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [modelLabel, setModelLabel] = useState("");
  const [sourceLabel, setSourceLabel] = useState<AIDoubtSource>("openai");
  const [hasHydrated, setHasHydrated] = useState(false);
  const [typedContentById, setTypedContentById] = useState<Record<string, string>>({});

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    document.title = "AI Coach | Meraki";

    if (typeof window !== "undefined") {
      const storedTheme = window.localStorage.getItem(MERAKI_AI_THEME_KEY);
      if (isThemeMode(storedTheme)) {
        setTheme(storedTheme);
      }

      const handleThemeEvent = (event: Event) => {
        const nextTheme = (event as CustomEvent<ThemeMode>).detail;
        if (isThemeMode(nextTheme)) {
          setTheme(nextTheme);
        }
      };

      const handleStorage = (event: StorageEvent) => {
        if (event.key === MERAKI_AI_THEME_KEY && isThemeMode(event.newValue)) {
          setTheme(event.newValue);
        }
      };

      window.addEventListener(MERAKI_AI_THEME_EVENT, handleThemeEvent as EventListener);
      window.addEventListener("storage", handleStorage);

      const params = new URLSearchParams(window.location.search);
      const prompt = params.get("prompt")?.trim() ?? "";
      if (prompt) {
        setDraft(prompt);
      }

      try {
        const raw = window.localStorage.getItem(MESSAGE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as unknown;
          if (Array.isArray(parsed)) {
            const safeMessages = parsed.filter(isStoredChatMessage).map((message) => ({
              ...message,
              status: "ready" as const,
            }));

            if (safeMessages.length > 0) {
              setMessages(safeMessages);
              const lastAssistant = [...safeMessages].reverse().find(
                (message) => message.role === "assistant",
              );
              if (lastAssistant?.source) {
                setSourceLabel(lastAssistant.source);
              }
            }
          }
        }
      } catch {
        setMessages([createWelcomeMessage()]);
      } finally {
        setThemeReady(true);
        setHasHydrated(true);
      }

      return () => {
        window.removeEventListener(
          MERAKI_AI_THEME_EVENT,
          handleThemeEvent as EventListener,
        );
        window.removeEventListener("storage", handleStorage);
      };
    }

    setThemeReady(true);
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!themeReady || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(MERAKI_AI_THEME_KEY, theme);
    document.documentElement.style.colorScheme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.dispatchEvent(
      new CustomEvent<ThemeMode>(MERAKI_AI_THEME_EVENT, {
        detail: theme,
      }),
    );
  }, [theme, themeReady]);

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") {
      return;
    }

    const storableMessages = messages.map((message) => ({
      ...message,
      status: "ready" as const,
    }));

    window.localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(storableMessages));
  }, [hasHydrated, messages]);

  useEffect(() => {
    const pendingMessage = messages.find(
      (message) => message.role === "assistant" && message.status === "typing",
    );

    if (!pendingMessage) {
      return;
    }

    const fullText = pendingMessage.content;
    let visibleLength = 0;

    setTypedContentById((current) => {
      if (current[pendingMessage.id] != null) {
        return current;
      }

      return { ...current, [pendingMessage.id]: "" };
    });

    const timer = window.setInterval(() => {
      visibleLength = Math.min(fullText.length, visibleLength + 5);

      setTypedContentById((current) => ({
        ...current,
        [pendingMessage.id]: fullText.slice(0, visibleLength),
      }));

      if (visibleLength >= fullText.length) {
        window.clearInterval(timer);
        setMessages((current) =>
          current.map((message) =>
            message.id === pendingMessage.id ? { ...message, status: "ready" } : message,
          ),
        );
      }
    }, 14);

    return () => {
      window.clearInterval(timer);
    };
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSubmitting, typedContentById]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [draft]);

  const canSubmit = draft.trim().length > 0 && !isSubmitting;
  const lastUserIndex = useMemo(() => getLastUserIndex(messages), [messages]);
  const conversationCount = messages.filter((message) => message.role === "user").length;

  async function requestReply(conversation: ChatMessage[]) {
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/ai-doubt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          messages: toConversation(conversation),
        }),
      });

      const data = (await res.json()) as AIDoubtApiResponse;

      if (!res.ok) {
        throw new Error(
          typeof data.message === "string"
            ? data.message
            : "Unable to generate a reply right now.",
        );
      }

      if (!data.reply) {
        throw new Error("The AI response was empty.");
      }

      const source = data.source === "fallback" ? "fallback" : "openai";
      const assistantMessage = createAssistantMessage(data.reply, "typing", source);

      setMessages([...conversation, assistantMessage]);
      setTypedContentById((current) => {
        const next = { ...current };
        delete next[assistantMessage.id];
        return next;
      });
      setModelLabel(data.model || "");
      setSourceLabel(source);
    } catch (issue) {
      const message =
        issue instanceof Error ? issue.message : "Something went wrong while contacting the AI.";
      setMessages(conversation);
      setError(message);
    } finally {
      setIsSubmitting(false);
      textareaRef.current?.focus();
    }
  }

  async function submitQuestion(question: string) {
    const nextQuestion = question.trim();
    if (!nextQuestion || isSubmitting) {
      return;
    }

    recordAiActivity();
    const userMessage = createUserMessage(nextQuestion);
    const conversation = [...messages, userMessage];

    setDraft("");
    setMessages(conversation);
    await requestReply(conversation);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitQuestion(draft);
  }

  async function handleRegenerate() {
    if (isSubmitting || lastUserIndex === -1) {
      if (lastUserIndex === -1) {
        setError("Ask a fitness question first, then regenerate the latest answer.");
      }
      return;
    }

    const conversation = messages.slice(0, lastUserIndex + 1).map((message) => ({
      ...message,
      status: "ready" as const,
    }));

    setTypedContentById({});
    setMessages(conversation);
    await requestReply(conversation);
  }

  function handleClearChat() {
    setMessages([createWelcomeMessage()]);
    setDraft("");
    setError("");
    setModelLabel("");
    setSourceLabel("openai");
    setTypedContentById({});

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(MESSAGE_STORAGE_KEY);
    }

    textareaRef.current?.focus();
  }

  const sourceMeta =
    sourceLabel === "fallback"
      ? {
          label: "Fallback mode",
        }
      : {
          label: modelLabel || "Live AI",
        };

  return (
    <div className={cx("relative", theme === "dark" && "dark")}>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,800px)_300px] xl:justify-center 2xl:grid-cols-[800px_300px]">
        <section className="min-w-0">
          <div className="mx-auto flex h-[calc(100vh-10rem)] min-h-[38rem] w-full max-w-[800px] flex-col overflow-hidden rounded-[32px] border border-neutral-200/80 bg-white/78 shadow-[0_28px_90px_rgba(239,68,68,0.08)] backdrop-blur-xl dark:border-red-500/20 dark:bg-neutral-950/76 dark:shadow-[0_28px_90px_rgba(239,68,68,0.14)]">
            <ChatHeader
              conversationCount={conversationCount}
              onClear={handleClearChat}
              onRegenerate={() => {
                void handleRegenerate();
              }}
              onThemeToggle={() =>
                setTheme((current) => (current === "dark" ? "light" : "dark"))
              }
              regenerateDisabled={isSubmitting || lastUserIndex === -1}
              sourceLabel={sourceMeta.label}
              theme={theme}
            />

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="mx-auto w-full max-w-[700px] space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
                  <span className="rounded-full border border-neutral-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/45">
                    Today
                  </span>
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
                </div>

                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    typedContent={typedContentById[message.id] ?? ""}
                  />
                ))}

                {isSubmitting ? <TypingBubble /> : null}

                <div ref={chatEndRef} />
              </div>
            </div>

            <ChatInput
              draft={draft}
              disabled={!canSubmit}
              error={error}
              onChange={setDraft}
              onShortcutSubmit={() => {
                void submitQuestion(draft);
              }}
              onSubmit={handleSubmit}
              textareaRef={textareaRef}
            />
          </div>
        </section>

        <SuggestedPanel
          conversationCount={conversationCount}
          isSubmitting={isSubmitting}
          onSelect={(question) => {
            void submitQuestion(question);
          }}
          questions={AI_DOUBT_SUGGESTED_QUESTIONS}
        />
      </div>
    </div>
  );
}
