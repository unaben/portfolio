import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { COOKIE, signSession } from "@/lib/auth";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const isDebugEnabled = process.env.NODE_ENV !== "production";

const maskValue = (value: string) =>
  value.length <= 2
    ? "*".repeat(value.length)
    : `${value[0]}${"*".repeat(value.length - 2)}${value.at(-1)}`;

function passwordsMatch(
  submittedPassword: string,
  expectedPassword: string,
): boolean {
  const submittedBytes = Buffer.from(submittedPassword);
  const expectedBytes = Buffer.from(expectedPassword);
  return (
    submittedBytes.length === expectedBytes.length &&
    timingSafeEqual(submittedBytes, expectedBytes)
  );
}

export async function POST(request: Request) {
  try {
    const expectedPassword = process.env.ADMIN_PASSWORD;
    const authSecret = process.env.AUTH_SECRET;

    if (!expectedPassword || !authSecret) {
      console.error("[login] Missing environment variables", {
        hasAdminPassword: Boolean(expectedPassword),
        hasAuthSecret: Boolean(authSecret),
      });
      return NextResponse.json(
        { error: "ADMIN_PASSWORD and AUTH_SECRET must be set" },
        { status: 500 },
      );
    }

    let requestBody: { password?: unknown };
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.warn("[login] Request body is not valid JSON", parseError);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const submittedPassword =
      typeof requestBody.password === "string" ? requestBody.password : "";
    const isPasswordCorrect = passwordsMatch(
      submittedPassword,
      expectedPassword,
    );

    if (isDebugEnabled) {
      console.log("[login] env vs request body", {
        expectedLength: expectedPassword.length,
        submittedLength: submittedPassword.length,
        expectedMasked: maskValue(expectedPassword),
        submittedMasked: maskValue(submittedPassword),
        exactMatch: isPasswordCorrect,
        matchesIgnoringWhitespace:
          submittedPassword.trim() === expectedPassword.trim(),
        envValueHasQuotes: /^["']|["']$/.test(expectedPassword),
      });
    }

    if (!isPasswordCorrect) {
      console.warn("[login] Rejected: password did not match");
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE, await signSession(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch (error) {
    console.error(
      "[login] Unexpected error:",
      error instanceof Error ? (error.stack ?? error.message) : error,
    );
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
