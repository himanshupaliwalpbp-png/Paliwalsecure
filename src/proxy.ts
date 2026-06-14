import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessTokenEdge } from "@/lib/auth-edge";

// ── Public paths that never require auth ─────────────────────────────────────
const PUBLIC_PATHS = ["/", "/admin/login"];

// ── Paths prefixes that are public ──────────────────────────────────────────
const PUBLIC_PREFIXES = ["/api/admin/auth"];

// ── Security Headers (HARDENED — Hacker + AI Bot Resistant) ─────────────────
const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
  "Permissions-Policy":
    "camera=(), microphone=(self), geolocation=(), browsing-topics=()",
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://apis.google.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; " +
    "img-src 'self' data: blob: https://paliwalsecure.in https://www.google-analytics.com https://www.googletagmanager.com; " +
    "connect-src 'self' https://paliwalsecure.in https://wa.me https://api.anthropic.com https://www.google-analytics.com https://www.googletagmanager.com https://*.firebase.com https://open.bigmodel.cn; " +
    "frame-src 'none'; " +
    "object-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    "frame-ancestors 'none'; " +
    "upgrade-insecure-requests",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Permitted-Cross-Domain-Policies": "none",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  // NOTE: Cross-Origin-Embedder-Policy removed — 'require-corp' blocks Google Analytics,
  // Google Fonts, and other essential cross-origin resources, causing page hangs.
  // Cross-Origin-Resource-Policy and Cross-Origin-Opener-Policy are sufficient for security.
};

// ── Static asset extensions for cache headers ───────────────────────────────
const STATIC_EXTENSIONS = [
  ".js", ".css", ".woff", ".woff2", ".ttf", ".otf",
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif",
  ".ico", ".json", ".xml", ".webmanifest",
];

// ── Canonical URL configuration ─────────────────────────────────────────────
const CANONICAL_HOST = "paliwalsecure.in";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const url = request.nextUrl.clone();

  // ========================================================================
  // 1. Canonical URL Redirect (www → non-www, http → https)
  //    Skip in development (localhost) to avoid redirect loops
  // ========================================================================
  const host = request.headers.get("host") || "";
  const isLocalDev = host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("21.0.");
  const isWww = host.startsWith("www.");
  const isHttp = request.headers.get("x-forwarded-proto") === "http";

  if (!isLocalDev && (isWww || isHttp)) {
    const redirectUrl = new URL(request.url);
    redirectUrl.protocol = "https:";
    redirectUrl.hostname = CANONICAL_HOST;
    redirectUrl.port = "";
    return NextResponse.redirect(redirectUrl, 301);
  }

  // ========================================================================
  // 2. Bot Protection — Block known malicious bots & AI scrapers
  // ========================================================================
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const BLOCKED_BOTS = [
    "semrushbot", "ahrefsbot", "mj12bot", "dotbot", "rogerbot",
    "seznambot", "baiduspider", "yandexbot", "exabot", "sistrix",
    "scanbot", "lipperhey", "wotbox", "sslscan", "sqlmap",
    "nikto", "nessus", "openvas", "burpsuite", "zap", "arachni",
    "w3af", "dirbuster", "gobuster", "ffuf", "hydra", "metasploit",
  ];
  const isBlockedBot = BLOCKED_BOTS.some(bot => userAgent.includes(bot));

  if (isBlockedBot && !pathname.startsWith("/api/")) {
    // Return 403 for malicious bots on page routes
    const response = new NextResponse(null, { status: 403 });
    addHeaders(response, pathname, searchParams);
    return response;
  }

  // ========================================================================
  // 3. Auth Logic (existing, preserved)
  // ========================================================================
  // Allow public exact paths
  if (PUBLIC_PATHS.includes(pathname)) {
    const response = NextResponse.next();
    addHeaders(response, pathname, searchParams);
    return response;
  }

  // Allow non-admin API routes (e.g. /api/contact, /api/chat, /api/reviews)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/admin/")) {
    const response = NextResponse.next();
    addHeaders(response, pathname, searchParams);
    return response;
  }

  // Allow auth-related admin API routes (login, refresh, setup)
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    const response = NextResponse.next();
    addHeaders(response, pathname, searchParams);
    return response;
  }

  // Only protect /admin/* and /api/admin/* routes
  const isAdminPage = pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");

  if (!isAdminPage && !isAdminApi) {
    const response = NextResponse.next();
    addHeaders(response, pathname, searchParams);
    return response;
  }

  // ── Extract token ─────────────────────────────────────────────────────────
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
    // For API routes, return 401 JSON
    if (isAdminApi) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // For page routes, redirect to login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  addHeaders(response, pathname, searchParams);
  return response;
}

// ============================================================================
// Header Addition Helper
// ============================================================================

function addHeaders(
  response: NextResponse,
  pathname: string,
  searchParams: URLSearchParams
): void {
  // ── Security Headers ───────────────────────────────────────────────────
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // ── Cache Headers for Static Assets ────────────────────────────────────
  const isStaticAsset = STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  const isNextStatic = pathname.startsWith("/_next/static/");
  const hasCacheParam = searchParams.has("v") || searchParams.has("ver");

  if (isStaticAsset || isNextStatic || hasCacheParam) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  } else if (pathname.startsWith("/api/")) {
    // API routes: no cache (dynamic data)
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
  } else if (
    pathname === "/" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    // Core pages: short cache, stale-while-revalidate
    response.headers.set(
      "Cache-Control",
      "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400"
    );
  } else {
    // Other pages: moderate cache
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, s-maxage=3600, stale-while-revalidate=3600"
    );
  }

  // ── Compression Hint ───────────────────────────────────────────────────
  // Vercel/CDN handles compression; we set Accept-Encoding hint
  response.headers.set("Vary", "Accept-Encoding");
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
