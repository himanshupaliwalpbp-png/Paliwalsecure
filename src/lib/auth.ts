import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";

// ── JWT Payload Type ────────────────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// ── Environment Variables (fail-closed in production, lazy-eval) ────────────
// SECURITY: Never ship fallback secrets. If a deployment forgets to set
// JWT_SECRET, we hard-fail at RUNTIME (when first used to sign/verify a token)
// rather than silently signing with a publicly-known dev string.
//
// We use lazy evaluation via a getter function so the check does NOT fire
// during `next build` page-data collection — only on actual request handling.
function requireSecret(name: string, fallbackDev: string): string {
  const v = process.env[name];
  if (v) return v;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `FATAL: ${name} environment variable is required in production. ` +
      `Set it in your hosting provider's environment variables. ` +
      `See .env.example for the full list.`
    );
  }
  // Dev only — emit a loud warning so it's never missed.
  if (typeof console !== "undefined") {
    console.warn(`[SECURITY WARNING] ${name} not set — using dev-only fallback. NEVER ship this to production.`);
  }
  return fallbackDev;
}

// Lazy-cached secret values. First access triggers requireSecret() — at
// request time, not at module load. Subsequent accesses return the cache.
let _jwtSecret: string | undefined;
let _jwtRefreshSecret: string | undefined;

function getJwtSecret(): string {
  if (_jwtSecret === undefined) _jwtSecret = requireSecret("JWT_SECRET", "paliwal-secure-jwt-secret-dev-placeholder");
  return _jwtSecret;
}

function getJwtRefreshSecret(): string {
  if (_jwtRefreshSecret === undefined) _jwtRefreshSecret = requireSecret("JWT_REFRESH_SECRET", "paliwal-secure-jwt-refresh-secret-dev-placeholder");
  return _jwtRefreshSecret;
}

// ── Secret keys as Uint8Array for jose (Edge Runtime compatible) ─────────────
function getSecretKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

// ── Access Token (15 min) — Node.js runtime (jsonwebtoken) ───────────────────
export function generateAccessToken(payload: {
  userId: string;
  email: string;
  role: string;
}): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "15m" });
}

// ── Refresh Token (7 days) — Node.js runtime (jsonwebtoken) ──────────────────
export function generateRefreshToken(payload: {
  userId: string;
  email: string;
  role: string;
}): string {
  return jwt.sign(payload, getJwtRefreshSecret(), { expiresIn: "7d" });
}

// ── Verify Access Token — Node.js runtime (jsonwebtoken) ─────────────────────
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

// ── Verify Refresh Token — Node.js runtime ───────────────────────────────────
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, getJwtRefreshSecret()) as JwtPayload;
  } catch {
    return null;
  }
}

// ── Verify Access Token — Edge Runtime compatible (jose) ─────────────────────
export async function verifyAccessTokenEdge(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(getJwtSecret()));
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

// ── Hash Password (bcryptjs, 12 salt rounds) ───────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ── Compare Password ────────────────────────────────────────────────────────
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
