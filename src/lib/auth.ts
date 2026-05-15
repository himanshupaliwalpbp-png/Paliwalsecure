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

// ── Environment Variables (with dev placeholders) ────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || "paliwal-secure-jwt-secret-dev-placeholder";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "paliwal-secure-jwt-refresh-secret-dev-placeholder";

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
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

// ── Refresh Token (7 days) — Node.js runtime (jsonwebtoken) ──────────────────
export function generateRefreshToken(payload: {
  userId: string;
  email: string;
  role: string;
}): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

// ── Verify Access Token — Node.js runtime (jsonwebtoken) ─────────────────────
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// ── Verify Refresh Token — Node.js runtime ───────────────────────────────────
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// ── Verify Access Token — Edge Runtime compatible (jose) ─────────────────────
export async function verifyAccessTokenEdge(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(JWT_SECRET));
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
