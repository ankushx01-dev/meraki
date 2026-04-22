import { NextResponse } from "next/server";
import { z } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function getZodErrorMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid request.";
}

export async function parseJsonBody<T>(
  request: Request,
  schema: z.ZodType<T>,
) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return {
        success: false as const,
        response: jsonError(getZodErrorMessage(parsed.error)),
      };
    }

    return {
      success: true as const,
      data: parsed.data,
    };
  } catch {
    return {
      success: false as const,
      response: jsonError("Invalid JSON body."),
    };
  }
}

export function parseSearchParams<T>(
  request: Request,
  schema: z.ZodType<T>,
) {
  const parsed = schema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams.entries()),
  );

  if (!parsed.success) {
    return {
      success: false as const,
      response: jsonError(getZodErrorMessage(parsed.error)),
    };
  }

  return {
    success: true as const,
    data: parsed.data,
  };
}
