import { NextResponse } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __merakiRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const store = globalThis.__merakiRateLimitStore ?? new Map<string, RateLimitEntry>();
globalThis.__merakiRateLimitStore = store;

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function consumeRateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + windowMs };
    store.set(key, next);
    return {
      ok: true as const,
      remaining: limit - 1,
      resetAt: next.resetAt,
      retryAfterMs: 0,
    };
  }

  if (current.count >= limit) {
    return {
      ok: false as const,
      remaining: 0,
      resetAt: current.resetAt,
      retryAfterMs: Math.max(0, current.resetAt - now),
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    ok: true as const,
    remaining: Math.max(0, limit - current.count),
    resetAt: current.resetAt,
    retryAfterMs: 0,
  };
}

export function rateLimitResponse(
  message: string,
  retryAfterMs: number,
) {
  return NextResponse.json(
    { message },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.max(1, Math.ceil(retryAfterMs / 1000))),
      },
    },
  );
}
