import { jwtVerify } from "jose";

// ── JWT Payload Type ────────────────────────────────────────────────────────
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// ── Environment Variables ───────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || "paliwal-secure-jwt-secret-dev-placeholder";

// ── Secret key as Uint8Array for jose (Edge Runtime compatible) ─────────────
function getSecretKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

// ── Verify Access Token — Edge Runtime compatible ──────────────────────────
export async function verifyAccessTokenEdge(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(JWT_SECRET));
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}
