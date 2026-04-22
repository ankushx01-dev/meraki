import { NextResponse } from "next/server";

import {
  AI_DOUBT_FORMAT_INSTRUCTIONS,
  AI_DOUBT_SYSTEM_PROMPT,
  formatAIDoubtReply,
  getFallbackAIDoubtReply,
  type AIDoubtReply,
  type ConversationMessage,
  type AIDoubtSource,
} from "@/lib/ai-doubt";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_OPENAI_MODEL = process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-5-mini";
const MAX_MESSAGES = 16;
const MAX_MESSAGE_LENGTH = 1500;

type OpenAITextPart = {
  type?: string;
  text?: string;
};

type OpenAIMessageResponse = {
  content?: string | OpenAITextPart[];
  refusal?: string | null;
};

type OpenAIChatResponse = {
  model?: string;
  choices?: Array<{
    message?: OpenAIMessageResponse;
  }>;
  error?: {
    code?: string | null;
    message?: string;
    type?: string | null;
  };
};

function isConversationMessage(value: unknown): value is ConversationMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    (candidate.role === "user" || candidate.role === "assistant") &&
    typeof candidate.content === "string"
  );
}

function sanitizeMessages(rawMessages: unknown): ConversationMessage[] | null {
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return null;
  }

  const nextMessages: ConversationMessage[] = [];

  for (const message of rawMessages) {
    if (!isConversationMessage(message)) {
      return null;
    }

    const content = message.content.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) {
      return null;
    }

    nextMessages.push({
      role: message.role,
      content,
    });
  }

  return nextMessages.slice(-MAX_MESSAGES);
}

function extractContent(content: OpenAIMessageResponse["content"]) {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((part) => (part?.type === "text" && typeof part.text === "string" ? part.text : ""))
    .join("");
}

function toReply(value: unknown): AIDoubtReply {
  if (!value || typeof value !== "object") {
    throw new Error("OpenAI returned an invalid response format.");
  }

  const candidate = value as Record<string, unknown>;
  const answer = typeof candidate.answer === "string" ? candidate.answer.trim() : "";
  const tip = typeof candidate.tip === "string" ? candidate.tip.trim() : "";
  const warning = typeof candidate.warning === "string" ? candidate.warning.trim() : "";

  if (!answer || !tip) {
    throw new Error("OpenAI returned an incomplete response.");
  }

  return { answer, tip, warning };
}

async function parseOpenAIError(response: Response) {
  try {
    const payload = (await response.json()) as OpenAIChatResponse;
    return {
      code: payload?.error?.code || "",
      message: payload?.error?.message || "OpenAI request failed.",
    };
  } catch {
    return {
      code: "",
      message: "OpenAI request failed.",
    };
  }
}

function createSuccessPayload(reply: AIDoubtReply, model: string, source: AIDoubtSource) {
  return {
    reply,
    message: {
      role: "assistant" as const,
      content: formatAIDoubtReply(reply),
    },
    model,
    source,
  };
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = sanitizeMessages(body?.messages);

    if (!messages) {
      return NextResponse.json(
        { message: "Please send a valid conversation history." },
        { status: 400 },
      );
    }

    if (messages[messages.length - 1]?.role !== "user") {
      return NextResponse.json(
        { message: "The final message in the conversation must come from the user." },
        { status: 400 },
      );
    }

    const latestQuestion = messages[messages.length - 1]?.content ?? "";
    const fallbackReply = getFallbackAIDoubtReply(latestQuestion);
    const apiKey = process.env.OPENAI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        createSuccessPayload(fallbackReply, "Meraki fallback coach", "fallback"),
      );
    }

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_OPENAI_MODEL,
        messages: [
          {
            role: "developer",
            content: `${AI_DOUBT_SYSTEM_PROMPT}\n\n${AI_DOUBT_FORMAT_INSTRUCTIONS}`,
          },
          ...messages,
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "fitness_doubt_solver_reply",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                answer: {
                  type: "string",
                  description: "A short, beginner-friendly answer that explains why.",
                },
                tip: {
                  type: "string",
                  description: "One practical action the user can try next.",
                },
                warning: {
                  type: "string",
                  description:
                    "A safety warning only when genuinely needed, otherwise an empty string.",
                },
              },
              required: ["answer", "tip", "warning"],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const error = await parseOpenAIError(response);

      if (error.code === "insufficient_quota" || response.status >= 500 || response.status === 429) {
        return NextResponse.json(
          createSuccessPayload(fallbackReply, "Meraki fallback coach", "fallback"),
        );
      }

      return NextResponse.json({ message: error.message }, { status: response.status });
    }

    const payload = (await response.json()) as OpenAIChatResponse;
    const choiceMessage = payload.choices?.[0]?.message;

    const refusal = typeof choiceMessage?.refusal === "string" ? choiceMessage.refusal.trim() : "";
    const reply = refusal
      ? {
          answer: refusal,
          tip: "If this is about pain, injury, or a medical condition, speak to a qualified professional.",
          warning: "",
        }
      : toReply(JSON.parse(extractContent(choiceMessage?.content)));

    return NextResponse.json(
      createSuccessPayload(reply, payload.model || DEFAULT_OPENAI_MODEL, "openai"),
    );
  } catch {
    return NextResponse.json(
      createSuccessPayload(getFallbackAIDoubtReply(""), "Meraki fallback coach", "fallback"),
    );
  }
}
