// ── In-memory cache for blog translations with TTL ────────────────────────────
// Stores: Map<string, { content: string; expiresAt: number }>
// Default TTL: 1 hour (3600000 ms)
// Auto-cleanup of expired entries every 10 minutes

interface CacheEntry {
  content: string;
  expiresAt: number;
}

class BlogTranslateCache {
  private store = new Map<string, CacheEntry>();
  private cleanupInterval: ReturnType<typeof setInterval>;
  private readonly defaultTtlMs: number;

  constructor(ttlMs: number = 60 * 60 * 1000) {
    this.defaultTtlMs = ttlMs;

    // Cleanup expired entries every 10 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 10 * 60 * 1000);
  }

  /**
   * Generate a cache key from content + language + optional title.
   * Uses a simple hash to avoid excessively long keys.
   */
  getKey(content: string, language: string, title?: string): string {
    const raw = `${language}:${title ? title + ':' : ''}${content}`;
    return this.simpleHash(raw);
  }

  /**
   * Retrieve a cached translation if it exists and hasn't expired.
   */
  get(key: string): string | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.content;
  }

  /**
   * Store a translated content entry with the default TTL.
   */
  set(key: string, content: string, ttlMs?: number): void {
    this.store.set(key, {
      content,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs),
    });
  }

  /**
   * Check if a key exists and is not expired.
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove a specific entry.
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Get current cache size (including potentially expired entries).
   */
  get size(): number {
    return this.store.size;
  }

  /**
   * Clear all cached entries.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Remove all expired entries.
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Simple, fast hash function for generating cache keys.
   * Uses the djb2 algorithm — sufficient for cache key deduplication.
   */
  private simpleHash(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff;
    }
    return `bt_${(hash >>> 0).toString(36)}`;
  }
}

// ── Singleton instance with 6-hour TTL (longer cache = fewer LLM calls = more reliable) ──
export const blogTranslateCache = new BlogTranslateCache(6 * 60 * 60 * 1000);
