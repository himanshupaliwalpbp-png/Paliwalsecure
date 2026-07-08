import { jwtVerify } from "jose";

// ── JWT Payload Type ────────────────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// ── Environment Variables (fail-closed in production, lazy-eval) ────────────
// SECURITY: Edge runtime — first request triggers the secret check. If env
// var is missing in production, we throw (surfacing as 500 to the client).
// Lazy evaluation so the check does NOT fire during `next build`.
let _jwtSecretCached: string | undefined;
function getJwtSecret(): string {
  if (_jwtSecretCached !== undefined) return _jwtSecretCached;
  const v = process.env.JWT_SECRET;
  if (v) {
    _jwtSecretCached = v;
    return v;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("FATAL: JWT_SECRET environment variable is required in production.");
  }
  _jwtSecretCached = "paliwal-secure-jwt-secret-dev-placeholder";
  return _jwtSecretCached;
}

// ── Secret key as Uint8Array for jose (Edge Runtime compatible) ─────────────
function getSecretKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

// ── Verify Access Token — Edge Runtime compatible ──────────────────────────
export async function verifyAccessTokenEdge(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(getJwtSecret()));
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}
