/**
 * Paliwal Saver API helpers — standalone, DB-free.
 * In-memory rate limiting (per-process), same-origin CSRF check and
 * uniform JSON response envelopes ({ ok: true, ... } / { ok: false, error }).
 */
import { NextRequest, NextResponse } from "next/server";

/** CSRF mitigation: mutations must originate from the same host. */
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients (curl / server-to-server)
  try {
    const host = req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Best-effort client IP (behind proxies) for rate-limit bucketing. */
export function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "local";
}

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();

/** Simple in-memory rate limiter (per-process; 60s sliding window). */
export function checkRateLimit(key: string, limit = 30, windowMs = 60_000): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
  if (buckets.size > 5000) {
    // prevent unbounded growth
    for (const [k, v] of buckets) {
      if (v.hits.length === 0) buckets.delete(k);
    }
  }
  return true;
}

/** Uniform error envelope: { ok: false, error } with a proper status code. */
export function apiError(message: string, status = 400): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status });
}

/** Uniform success envelope: { ok: true, ...payload }. */
export function apiOk(payload: Record<string, unknown> = {}): NextResponse {
  return NextResponse.json({ ok: true, ...payload });
}

/** Safely parse a JSON body, returning null on failure. */
export async function safeJson(req: NextRequest): Promise<unknown | null> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
