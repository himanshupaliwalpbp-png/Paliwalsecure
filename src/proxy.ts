import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessTokenEdge } from "@/lib/auth-edge";

// ── Public paths that never require auth ─────────────────────────────────────
const PUBLIC_PATHS = ["/", "/admin/login"];

// ── Paths prefixes that are public ──────────────────────────────────────────
const PUBLIC_PREFIXES = ["/api/admin/auth"];

// ── Known search engine bot user agents (partial match, lowercase) ───────────
// Used to hide admin routes from crawlers (return 404 so admin is invisible)
const BOT_PATTERNS = [
  "googlebot",
  "bingbot",
  "slurp",          // Yahoo
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "sogou",
  "exabot",
  "facebot",
  "facebookexternalhit",
  "ia_archiver",    // Alexa
  "mj12bot",
  "ahrefsbot",
  "semrushbot",
  "dotbot",
  "rogerbot",
  "seznambot",
  "twitterbot",
  "linkedinbot",
  "applebot",
  "petalbot",
  "bytespider",
  "crawler",
  "spider",
  "bot;",
  "bot/",
];

// ── Suspicious patterns for attack detection ────────────────────────────────
const ATTACK_PATTERNS: { pattern: RegExp; name: string }[] = [
  // SQL Injection
  { pattern: /(\b(union\s+select|select\s+.+\s+from|insert\s+into|delete\s+from|drop\s+table|alter\s+table|exec\s*\(|execute\s*\(|xp_cmdshell|information_schema|pg_sleep|waitfor\s+delay)\b)/i, name: "SQL_INJECTION" },
  { pattern: /('|\")\s*(or|and)\s+('|\")?\d+('|\")?\s*=\s*('|\")?\d+/i, name: "SQL_INJECTION" },
  { pattern: /;\s*(drop|delete|update|insert|alter|exec|create)\s/i, name: "SQL_INJECTION" },
  // XSS
  { pattern: /<script[\s>]/i, name: "XSS" },
  { pattern: /javascript\s*:/i, name: "XSS" },
  { pattern: /on(error|load|click|mouseover|focus|blur)\s*=/i, name: "XSS" },
  { pattern: /(alert|confirm|prompt)\s*\(/i, name: "XSS" },
  { pattern: /document\.(cookie|location|write)/i, name: "XSS" },
  // Path Traversal
  { pattern: /\.\.[\/\\]/, name: "PATH_TRAVERSAL" },
  { pattern: /(%2e%2e|%252e|%c0%ae)/i, name: "PATH_TRAVERSAL" },
  // Command Injection
  { pattern: /(\b(cat|ls|pwd|whoami|uname|id|wget|curl|nc|bash|sh|python|perl|ruby|php)\b)\s*[\|;`$]/i, name: "CMD_INJECTION" },
  { pattern: /[\|;`]\s*(cat|ls|pwd|whoami|uname|id|wget|curl|nc|bash|sh)/i, name: "CMD_INJECTION" },
];

// ── In-memory rate limiter for admin login (Edge-compatible) ─────────────────
interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil: number;
}

const adminLoginRateLimit = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 2 minutes
const CLEANUP_INTERVAL = 2 * 60 * 1000;
let lastCleanup = Date.now();

function getRateLimit(ip: string): RateLimitEntry {
  const now = Date.now();

  // Periodic cleanup
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, entry] of adminLoginRateLimit) {
      if (now > entry.resetTime && now > entry.blockedUntil) {
        adminLoginRateLimit.delete(key);
      }
    }
    lastCleanup = now;
  }

  let entry = adminLoginRateLimit.get(ip);
  if (!entry || now > entry.resetTime) {
    entry = { count: 0, resetTime: now + 60 * 1000, blockedUntil: 0 }; // 1-minute window
    adminLoginRateLimit.set(ip, entry);
  }
  return entry;
}

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
    "media-src 'self' blob: https://d8j0ntlcm91z4.cloudfront.net; " +
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
  "Cross-Origin-Resource-Policy": "cross-origin",
  // NOTE: Cross-Origin-Embedder-Policy removed — 'require-corp' blocks Google Analytics,
  // Google Fonts, and other essential cross-origin resources, causing page hangs.
  // Cross-Origin-Resource-Policy and Cross-Origin-Opener-Policy are sufficient for security.
};

// ── Admin-specific extra security headers ───────────────────────────────────
const ADMIN_SECURITY_HEADERS: Record<string, string> = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

// ── Static asset extensions for cache headers ───────────────────────────────
const STATIC_EXTENSIONS = [
  ".js", ".css", ".woff", ".woff2", ".ttf", ".otf",
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".avif",
  ".ico", ".json", ".xml", ".webmanifest",
];

// ── Canonical URL configuration ─────────────────────────────────────────────
const CANONICAL_HOST = "paliwalsecure.in";

// ── Helper: check if user agent looks like a bot ───────────────────────────
function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((pattern) => ua.includes(pattern));
}

// ── Helper: check for attack patterns in URL + query ────────────────────────
function detectAttackPatterns(url: string): string | null {
  for (const { pattern, name } of ATTACK_PATTERNS) {
    if (pattern.test(url)) return name;
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") ?? "";

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
  // 2. Bot Protection — Block known malicious bots & AI scrapers site-wide
  // ========================================================================
  const uaLower = userAgent.toLowerCase();
  const BLOCKED_BOTS = [
    "semrushbot", "ahrefsbot", "mj12bot", "dotbot", "rogerbot",
    "seznambot", "baiduspider", "yandexbot", "exabot", "sistrix",
    "scanbot", "lipperhey", "wotbox", "sslscan", "sqlmap",
    "nikto", "nessus", "openvas", "burpsuite", "zap", "arachni",
    "w3af", "dirbuster", "gobuster", "ffuf", "hydra", "metasploit",
  ];
  const isBlockedBot = BLOCKED_BOTS.some(bot => uaLower.includes(bot));

  if (isBlockedBot && !pathname.startsWith("/api/")) {
    // Return 403 for malicious bots on page routes
    const response = new NextResponse(null, { status: 403 });
    addHeaders(response, pathname, searchParams);
    return response;
  }

  // ========================================================================
  // 3. Admin Route Security Checks
  // ========================================================================
  const isAdminPage = pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isSecretEntry = pathname.startsWith("/p4l1w4l-s3cur3-4dm1n");

  if (isAdminPage || isAdminApi || isSecretEntry) {
    // ── 3a. Block bots/crawlers — return 404 so admin routes are invisible ──
    if (isBot(userAgent)) {
      return new NextResponse(null, { status: 404, statusText: "Not Found" });
    }

    // ── 3b. Check for attack patterns in URL ────────────────────────────────
    const fullUrl = pathname + (searchParams.toString() ? "?" + searchParams.toString() : "");
    const attackType = detectAttackPatterns(decodeURIComponent(fullUrl));
    if (attackType) {
      return new NextResponse(null, { status: 400, statusText: "Bad Request" });
    }

    // ── 3c. Rate limit admin login attempts (5 per minute per IP) ───────────
    const isLoginAttempt = pathname === "/api/admin/auth/login" && request.method === "POST";
    if (isLoginAttempt) {
      const clientIp =
        request.headers.get("x-forwarded-for")?.split(",")?.[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "unknown";

      const rateLimit = getRateLimit(clientIp);

      // If temporarily blocked due to too many attempts
      if (rateLimit.blockedUntil > Date.now()) {
        const retryAfter = Math.ceil((rateLimit.blockedUntil - Date.now()) / 1000);
        return NextResponse.json(
          {
            success: false,
            error: "Too many login attempts. Please try again later.",
            retryAfter,
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(retryAfter),
              "X-RateLimit-Remaining": "0",
              ...ADMIN_SECURITY_HEADERS,
            },
          }
        );
      }

      rateLimit.count++;
      if (rateLimit.count > 5) {
        // Block for 5 minutes after exceeding rate
        rateLimit.blockedUntil = Date.now() + 5 * 60 * 1000;
        const retryAfter = Math.ceil((rateLimit.blockedUntil - Date.now()) / 1000);
        return NextResponse.json(
          {
            success: false,
            error: "Too many login attempts. Please try again later.",
            retryAfter,
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(retryAfter),
              "X-RateLimit-Remaining": "0",
              ...ADMIN_SECURITY_HEADERS,
            },
          }
        );
      }
    }
  }

  // ========================================================================
  // 4. Auth Logic
  // ========================================================================
  // Allow public exact paths
  if (PUBLIC_PATHS.includes(pathname)) {
    const response = NextResponse.next();
    addHeaders(response, pathname, searchParams);
    return response;
  }

  // Allow secret admin entry (redirect happens in page.tsx)
  if (isSecretEntry) {
    const response = NextResponse.next();
    addHeaders(response, pathname, searchParams);
    // Add admin security headers for secret entry too
    for (const [key, value] of Object.entries(ADMIN_SECURITY_HEADERS)) {
      response.headers.set(key, value);
    }
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
    // Add admin security headers
    for (const [key, value] of Object.entries(ADMIN_SECURITY_HEADERS)) {
      response.headers.set(key, value);
    }
    return response;
  }

  // Only protect /admin/* and /api/admin/* routes
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
  // Add admin security headers for all authenticated admin routes
  for (const [key, value] of Object.entries(ADMIN_SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
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
