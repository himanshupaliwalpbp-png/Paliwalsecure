import { verifyAccessToken, type JwtPayload } from "@/lib/auth";
import { NextRequest } from "next/server";

// ── Simple hash function for voter fingerprinting ─────────────────────────
export function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  // Convert to unsigned hex string for consistency
  return (hash >>> 0).toString(16).padStart(8, "0");
}

// ── Generate voter fingerprint from IP + User-Agent ──────────────────────
export function generateVoterFingerprint(request: NextRequest): string {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown-ip";
  const userAgent = request.headers.get("user-agent") ?? "unknown-ua";
  return simpleHash(`${ip}:${userAgent}`);
}

// ── Extract authenticated admin from request ─────────────────────────────
export function getAdminFromRequest(
  request: NextRequest
): JwtPayload | null {
  const authHeader = request.headers.get("Authorization");
  let token: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  if (!token) {
    token = request.cookies.get("admin_access_token")?.value ?? null;
  }

  if (!token) return null;

  return verifyAccessToken(token);
}

// ── Valid insurance types ────────────────────────────────────────────────
export const VALID_INSURANCE_TYPES = [
  "health",
  "life",
  "motor",
  "travel",
  "home",
] as const;

export type InsuranceType = (typeof VALID_INSURANCE_TYPES)[number];

// ── Valid review statuses ────────────────────────────────────────────────
export const VALID_REVIEW_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "flagged",
] as const;

export type ReviewStatus = (typeof VALID_REVIEW_STATUSES)[number];

// ── Valid vote types ─────────────────────────────────────────────────────
export const VALID_VOTE_TYPES = ["helpful", "not_helpful"] as const;

export type VoteType = (typeof VALID_VOTE_TYPES)[number];

// ── Valid bulk actions ───────────────────────────────────────────────────
export const VALID_BULK_ACTIONS = [
  "approve",
  "reject",
  "flag",
  "delete",
] as const;

export type BulkAction = (typeof VALID_BULK_ACTIONS)[number];
