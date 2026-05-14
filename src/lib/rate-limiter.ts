// ============================================================================
// Client-Side Rate Limiter Utility
// ============================================================================
// Simple in-memory rate limiter for preventing spam clicking and abuse.
// Tracks actions by key, limits to maxAttempts per windowMs.
// Usage:
//   const limiter = new RateLimiter(5, 60_000); // 5 attempts per 60 seconds
//   const result = limiter.check('claim_status_check');
//   if (!result.allowed) { showToast(`Try again in ${Math.ceil(result.resetTime / 1000)}s`); }
// ============================================================================

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: number; // ms until the window resets
  totalAttempts: number;
}

interface RateLimitEntry {
  attempts: number[];
}

export class RateLimiter {
  private maxAttempts: number;
  private windowMs: number;
  private entries: Map<string, RateLimitEntry>;

  /**
   * @param maxAttempts Maximum number of attempts allowed within the window
   * @param windowMs Time window in milliseconds
   */
  constructor(maxAttempts: number = 5, windowMs: number = 60_000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.entries = new Map();
  }

  /**
   * Check if an action is allowed for the given key
   * @param key Unique identifier for the action (e.g., 'claim_status_check', 'contact_form_submit')
   * @returns RateLimitResult with allowed status and remaining attempts
   */
  check(key: string): RateLimitResult {
    const now = Date.now();
    const entry = this.entries.get(key);

    if (!entry) {
      // First attempt — create entry
      this.entries.set(key, { attempts: [now] });
      return {
        allowed: true,
        remainingAttempts: this.maxAttempts - 1,
        resetTime: this.windowMs,
        totalAttempts: 1,
      };
    }

    // Filter out attempts outside the current window
    const validAttempts = entry.attempts.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (validAttempts.length >= this.maxAttempts) {
      // Rate limited — find when the oldest attempt expires
      const oldestAttempt = validAttempts[0];
      const resetTime = oldestAttempt + this.windowMs - now;

      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime,
        totalAttempts: validAttempts.length,
      };
    }

    // Allowed — record the attempt
    validAttempts.push(now);
    entry.attempts = validAttempts;

    // Calculate reset time based on oldest valid attempt
    const oldestValid = validAttempts[0];
    const resetTime = oldestValid + this.windowMs - now;

    return {
      allowed: true,
      remainingAttempts: this.maxAttempts - validAttempts.length,
      resetTime,
      totalAttempts: validAttempts.length,
    };
  }

  /**
   * Reset the rate limit for a specific key
   * @param key The key to reset
   */
  reset(key: string): void {
    this.entries.delete(key);
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.entries.clear();
  }

  /**
   * Get the current status for a key without recording an attempt
   * @param key Unique identifier for the action
   * @returns RateLimitResult with current status
   */
  peek(key: string): RateLimitResult {
    const now = Date.now();
    const entry = this.entries.get(key);

    if (!entry) {
      return {
        allowed: true,
        remainingAttempts: this.maxAttempts,
        resetTime: this.windowMs,
        totalAttempts: 0,
      };
    }

    const validAttempts = entry.attempts.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (validAttempts.length >= this.maxAttempts) {
      const oldestAttempt = validAttempts[0];
      const resetTime = oldestAttempt + this.windowMs - now;

      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime,
        totalAttempts: validAttempts.length,
      };
    }

    const oldestValid = validAttempts[0];
    const resetTime = oldestValid ? oldestValid + this.windowMs - now : this.windowMs;

    return {
      allowed: true,
      remainingAttempts: this.maxAttempts - validAttempts.length,
      resetTime,
      totalAttempts: validAttempts.length,
    };
  }
}

// ── Pre-configured rate limiters for common actions ──────────────────────────
export const claimStatusLimiter = new RateLimiter(10, 60_000); // 10 checks per minute
export const contactFormLimiter = new RateLimiter(3, 300_000); // 3 submissions per 5 minutes
export const reviewSubmitLimiter = new RateLimiter(5, 300_000); // 5 reviews per 5 minutes

// ── Singleton pattern for global use ─────────────────────────────────────────
let globalLimiter: RateLimiter | null = null;

export function getGlobalLimiter(): RateLimiter {
  if (!globalLimiter) {
    globalLimiter = new RateLimiter(5, 60_000);
  }
  return globalLimiter;
}
