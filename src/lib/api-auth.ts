import { NextRequest } from "next/server";
import { verifyAccessToken, JwtPayload } from "@/lib/auth";

// ── Extract authenticated user from request ──────────────────────────────────
export function getAuthUser(request: NextRequest): JwtPayload | null {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : request.cookies.get("admin_access_token")?.value ?? null;

  if (!token) return null;
  return verifyAccessToken(token);
}

// ── Require ADMIN role ───────────────────────────────────────────────────────
export function requireAdmin(request: NextRequest): JwtPayload | null {
  const user = getAuthUser(request);
  if (!user || user.role !== "ADMIN") return null;
  return user;
}
