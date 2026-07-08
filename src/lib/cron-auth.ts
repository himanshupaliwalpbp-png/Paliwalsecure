import { NextRequest, NextResponse } from "next/server";

/**
 * Verify that an incoming cron request is authorized.
 *
 * Accepts either:
 *   1. Authorization: Bearer <CRON_SECRET>  (Vercel Cron convention)
 *   2. x-cron-secret: <CRON_SECRET>        (alternate header)
 *
 * In production, CRON_SECRET MUST be set. In dev/test, if CRON_SECRET is
 * missing we allow the request through so local `curl` works, but log a
 * warning. NEVER rely on this in production.
 */
export function verifyCronSecret(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      // Hard-fail in production if secret is missing — fail closed.
      return false;
    }
    // Dev/test only — allow without secret.
    return true;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const altHeader = request.headers.get("x-cron-secret");
  if (altHeader === secret) return true;

  return false;
}

export function unauthorizedCronResponse(): NextResponse {
  return NextResponse.json(
    { success: false, error: "Unauthorized — missing or invalid CRON_SECRET" },
    { status: 401 },
  );
}
