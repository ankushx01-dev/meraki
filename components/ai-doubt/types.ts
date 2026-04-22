import type {
  AIDoubtReply,
  AIDoubtSource,
  ConversationMessage,
} from "@/lib/ai-doubt";

export type ChatMessage = ConversationMessage & {
  id: string;
  createdAt: string;
  status: "ready" | "typing";
  reply?: AIDoubtReply;
  source?: AIDoubtSource;
};

export type AIDoubtApiResponse = {
  reply?: AIDoubtReply;
  message?: string | ConversationMessage;
  model?: string;
  source?: AIDoubtSource;
};
