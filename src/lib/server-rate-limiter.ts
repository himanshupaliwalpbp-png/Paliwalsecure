// ── In-memory rate limiter for API routes ──────────────────────────────────────
// Stores: Map<string, { count: number, resetTime: number }>
// Configurable: maxAttempts, windowMs
// Methods: check(key), reset(key)
// Auto-cleanup of expired entries

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class ServerRateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  check(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true, remaining: maxAttempts - 1, resetTime: now + windowMs };
    }

    if (entry.count >= maxAttempts) {
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    entry.count++;
    return { allowed: true, remaining: maxAttempts - entry.count, resetTime: entry.resetTime };
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// ── Singleton instances for different rate limit types ────────────────────────
export const loginRateLimiter = new ServerRateLimiter();     // 5 attempts per 15 min per IP
export const apiRateLimiter = new ServerRateLimiter();        // 30 requests per minute per IP
export const contactRateLimiter = new ServerRateLimiter();    // 3 submissions per 15 min per IP
export const chatRateLimiter = new ServerRateLimiter();       // 20 messages per minute per IP

// ── Helper to get client IP ──────────────────────────────────────────────────
export function getClientIp(request: Request): string {
  return (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown');
}
