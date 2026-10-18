import { NextResponse } from "next/server";

const isDev = process.env.NODE_ENV !== "production";

export const errorResponse = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

export const validationErrorResponse = (errors: string[]) =>
  NextResponse.json({ errors }, { status: 400 });

export async function readJsonBody(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch (parseError) {
    if (isDev) console.warn("[api] Request body is not valid JSON:", parseError);
    return null;
  }
}

export function logRouteError(routeLabel: string, error: unknown) {
  console.error(
    `[${routeLabel}]`,
    isDev && error instanceof Error
      ? (error.stack ?? error.message)
      : "unexpected error",
  );
}