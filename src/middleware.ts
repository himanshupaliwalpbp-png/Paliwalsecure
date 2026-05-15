import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessTokenEdge } from "@/lib/auth";

// ── Public paths that never require auth ─────────────────────────────────────
const PUBLIC_PATHS = ["/", "/admin/login"];

// ── Paths prefixes that are public ──────────────────────────────────────────
const PUBLIC_PREFIXES = ["/api/admin/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public exact paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow non-admin API routes (e.g. /api/contact, /api/chat, /api/reviews)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  // Allow auth-related admin API routes (login, refresh, setup)
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Only protect API routes (admin pages are protected by client-side auth)
  const isAdminApi = pathname.startsWith("/api/admin/");

  if (!isAdminApi) {
    // Allow admin PAGE routes through — client-side auth handles redirect
    return NextResponse.next();
  }

  // ── Extract token for API routes ──────────────────────────────────────────
  let token: string | null = null;

  // 1. Check Authorization: Bearer <token>
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  // 2. Fallback: check admin_access_token cookie
  if (!token) {
    token = request.cookies.get("admin_access_token")?.value ?? null;
  }

  // ── Verify token (Edge Runtime compatible) ─────────────────────────────────
  const payload = token ? await verifyAccessTokenEdge(token) : null;

  if (!payload) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|robots.txt|manifest.json|offline.html).*)",
  ],
};
