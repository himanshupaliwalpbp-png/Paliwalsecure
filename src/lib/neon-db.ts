// ============================================================================
// Paliwal Secure — Neon PostgreSQL Database Client
// Uses @neondatabase/serverless for direct SQL queries to Neon PostgreSQL
// Env var: DATABASE_URL_NEON (separate from SQLite Prisma DATABASE_URL)
// Falls back gracefully when DATABASE_URL_NEON is not set
// ============================================================================

import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

// ── Type Definitions ────────────────────────────────────────────────────────
// These types mirror the Neon PostgreSQL tables exactly (snake_case column names)

export interface NeonTrend {
  id: string;
  title: string;
  description: string | null;
  category: string;
  source: string | null;
  source_url: string | null;
  trigger_date: Date | string;
  processed: boolean;
  created_at: Date | string;
}

export interface NeonArticle {
  id: string;
  slug: string;
  title: string;
  seo_title: string | null;
  seo_description: string | null;
  content: string | null;
  json_ld: string | null;
  meta_keywords: string[] | null;
  category: string | null;
  trend_id: string | null;
  status: string;
  published_at: Date | string | null;
  views: number;
  created_at: Date | string;
}

export interface NeonInternalLink {
  id: string;
  from_article_id: string;
  to_article_id: string;
  anchor_text: string | null;
  score: number | null;
}

// ── Module State ────────────────────────────────────────────────────────────

let _sql: NeonQueryFunction<false, false> | null = null;
let _initAttempted = false;
let _neonWarned = false;

/**
 * Check if the Neon database is available (DATABASE_URL_NEON is set)
 */
export function isNeonAvailable(): boolean {
  return !!process.env.DATABASE_URL_NEON;
}

/**
 * Get the Neon SQL client (tagged template function).
 * Uses the neon() function from @neondatabase/serverless.
 * Returns null if DATABASE_URL_NEON is not configured.
 */
export async function getNeonSql(): Promise<NeonQueryFunction<false, false> | null> {
  if (_sql) return _sql;
  if (_initAttempted) return null;
  _initAttempted = true;

  const connectionString = process.env.DATABASE_URL_NEON;
  if (!connectionString) {
    if (!_neonWarned) {
      console.warn(
        '[neon-db] DATABASE_URL_NEON is not set. Neon database features are disabled. ' +
        'Auto-publish will fall back to file-based article storage.'
      );
      _neonWarned = true;
    }
    return null;
  }

  try {
    _sql = neon(connectionString);
    console.log('[neon-db] Successfully initialized Neon SQL client');
    return _sql;
  } catch (error) {
    console.error('[neon-db] Failed to initialize Neon SQL client:', error);
    return null;
  }
}

/**
 * Safe wrapper that executes a function with the Neon SQL client.
 * Returns null if Neon is not available or if an error occurs.
 */
export async function withNeonDb<T>(
  fn: (sql: NeonQueryFunction<false, false>) => Promise<T>
): Promise<T | null> {
  const sql = await getNeonSql();
  if (!sql) return null;

  try {
    return await fn(sql);
  } catch (error) {
    console.error('[neon-db] Query error:', error);
    return null;
  }
}

// Alias for backward compatibility
export const getNeonDb = getNeonSql;

// ── Helper Functions for Common Queries ─────────────────────────────────────

/**
 * Fetch unprocessed trends from the trends table
 */
export async function fetchUnprocessedTrends(
  limit: number = 10
): Promise<NeonTrend[]> {
  const sql = await getNeonSql();
  if (!sql) return [];

  try {
    const trends = await sql`
      SELECT id, title, description, category, source, source_url, trigger_date, processed, created_at
      FROM trends
      WHERE processed = false
      ORDER BY trigger_date DESC
      LIMIT ${limit}
    `;
    return trends as unknown as NeonTrend[];
  } catch (error) {
    console.error('[neon-db] fetchUnprocessedTrends error:', error);
    return [];
  }
}

/**
 * Fetch all trends with optional filtering
 */
export async function fetchTrends(
  options: {
    processed?: boolean;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ trends: NeonTrend[]; total: number }> {
  const sql = await getNeonSql();
  if (!sql) return { trends: [], total: 0 };

  const { processed, category, limit = 20, offset = 0 } = options;

  try {
    // Use sql.query() for dynamic WHERE clause building
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (processed !== undefined) {
      conditions.push(`processed = $${paramIdx}`);
      params.push(processed);
      paramIdx++;
    }

    if (category) {
      conditions.push(`category = $${paramIdx}`);
      params.push(category);
      paramIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const trends = await sql.query(
      `SELECT id, title, description, category, source, source_url, trigger_date, processed, created_at
       FROM trends
       ${whereClause}
       ORDER BY trigger_date DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset]
    );

    const countResult = await sql.query(
      `SELECT COUNT(*) as total FROM trends ${whereClause}`,
      params
    );

    return {
      trends: trends as unknown as NeonTrend[],
      total: Number((countResult as Array<Record<string, unknown>>)[0]?.total ?? 0),
    };
  } catch (error) {
    console.error('[neon-db] fetchTrends error:', error);
    return { trends: [], total: 0 };
  }
}

/**
 * Create a new trend entry
 */
export async function createTrend(data: {
  title: string;
  description?: string | null;
  category: string;
  source?: string | null;
  sourceUrl?: string | null;
}): Promise<NeonTrend | null> {
  const sql = await getNeonSql();
  if (!sql) return null;

  try {
    const result = await sql`
      INSERT INTO trends (title, description, category, source, source_url, processed)
      VALUES (${data.title}, ${data.description ?? null}, ${data.category}, ${data.source ?? null}, ${data.sourceUrl ?? null}, false)
      RETURNING id, title, description, category, source, source_url, trigger_date, processed, created_at
    `;
    return (result as unknown as NeonTrend[])[0] ?? null;
  } catch (error) {
    console.error('[neon-db] createTrend error:', error);
    return null;
  }
}

/**
 * Mark a trend as processed
 */
export async function markTrendAsProcessed(id: string): Promise<boolean> {
  const sql = await getNeonSql();
  if (!sql) return false;

  try {
    await sql`
      UPDATE trends SET processed = true WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('[neon-db] markTrendAsProcessed error:', error);
    return false;
  }
}

/**
 * Fetch articles with optional filtering and pagination
 */
export async function fetchArticles(
  options: {
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ articles: NeonArticle[]; total: number }> {
  const sql = await getNeonSql();
  if (!sql) return { articles: [], total: 0 };

  const { status, category, limit = 10, offset = 0 } = options;

  try {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (status) {
      conditions.push(`status = $${paramIdx}`);
      params.push(status);
      paramIdx++;
    }

    if (category) {
      conditions.push(`category = $${paramIdx}`);
      params.push(category);
      paramIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const articles = await sql.query(
      `SELECT id, slug, title, seo_title, seo_description, content, json_ld, meta_keywords, category, trend_id, status, published_at, views, created_at
       FROM articles
       ${whereClause}
       ORDER BY COALESCE(published_at, created_at) DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset]
    );

    const countResult = await sql.query(
      `SELECT COUNT(*) as total FROM articles ${whereClause}`,
      params
    );

    return {
      articles: articles as unknown as NeonArticle[],
      total: Number((countResult as Array<Record<string, unknown>>)[0]?.total ?? 0),
    };
  } catch (error) {
    console.error('[neon-db] fetchArticles error:', error);
    return { articles: [], total: 0 };
  }
}

/**
 * Fetch a single article by slug
 */
export async function fetchArticleBySlug(
  slug: string
): Promise<NeonArticle | null> {
  const sql = await getNeonSql();
  if (!sql) return null;

  try {
    const result = await sql`
      SELECT id, slug, title, seo_title, seo_description, content, json_ld, meta_keywords, category, trend_id, status, published_at, views, created_at
      FROM articles
      WHERE slug = ${slug}
      LIMIT 1
    `;
    return (result as unknown as NeonArticle[])[0] ?? null;
  } catch (error) {
    console.error('[neon-db] fetchArticleBySlug error:', error);
    return null;
  }
}

/**
 * Fetch a single article by ID
 */
export async function fetchArticleById(
  id: string
): Promise<NeonArticle | null> {
  const sql = await getNeonSql();
  if (!sql) return null;

  try {
    const result = await sql`
      SELECT id, slug, title, seo_title, seo_description, content, json_ld, meta_keywords, category, trend_id, status, published_at, views, created_at
      FROM articles
      WHERE id = ${id}
      LIMIT 1
    `;
    return (result as unknown as NeonArticle[])[0] ?? null;
  } catch (error) {
    console.error('[neon-db] fetchArticleById error:', error);
    return null;
  }
}

/**
 * Create a new article in the database
 * By default, articles are saved with status 'draft'
 */
export async function createArticle(data: {
  slug: string;
  title: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  content?: string | null;
  jsonLd?: string | null;
  metaKeywords?: string[] | null;
  category?: string | null;
  trendId?: string | null;
  status?: string;
}): Promise<NeonArticle | null> {
  const sql = await getNeonSql();
  if (!sql) return null;

  const status = data.status || 'draft';
  const publishedAt = status === 'published' ? new Date().toISOString() : null;

  try {
    const result = await sql`
      INSERT INTO articles (slug, title, seo_title, seo_description, content, json_ld, meta_keywords, category, trend_id, status, published_at)
      VALUES (
        ${data.slug},
        ${data.title},
        ${data.seoTitle ?? null},
        ${data.seoDescription ?? null},
        ${data.content ?? null},
        ${data.jsonLd ?? null},
        ${data.metaKeywords ?? null},
        ${data.category ?? null},
        ${data.trendId ?? null},
        ${status},
        ${publishedAt}
      )
      RETURNING id, slug, title, seo_title, seo_description, content, json_ld, meta_keywords, category, trend_id, status, published_at, views, created_at
    `;
    return (result as unknown as NeonArticle[])[0] ?? null;
  } catch (error) {
    console.error('[neon-db] createArticle error:', error);
    return null;
  }
}

/**
 * Update article status (e.g., publish a draft)
 */
export async function updateArticleStatus(
  id: string,
  status: string
): Promise<NeonArticle | null> {
  const sql = await getNeonSql();
  if (!sql) return null;

  const publishedAt = status === 'published' ? new Date().toISOString() : null;

  try {
    const result = await sql`
      UPDATE articles
      SET status = ${status}, published_at = COALESCE(published_at, ${publishedAt})
      WHERE id = ${id}
      RETURNING id, slug, title, seo_title, seo_description, content, json_ld, meta_keywords, category, trend_id, status, published_at, views, created_at
    `;
    return (result as unknown as NeonArticle[])[0] ?? null;
  } catch (error) {
    console.error('[neon-db] updateArticleStatus error:', error);
    return null;
  }
}

/**
 * Increment article view count
 */
export async function incrementArticleViews(id: string): Promise<boolean> {
  const sql = await getNeonSql();
  if (!sql) return false;

  try {
    await sql`
      UPDATE articles SET views = views + 1 WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('[neon-db] incrementArticleViews error:', error);
    return false;
  }
}

/**
 * Fetch a single trend by ID
 */
export async function fetchTrendById(
  id: string
): Promise<NeonTrend | null> {
  const sql = await getNeonSql();
  if (!sql) return null;

  try {
    const result = await sql`
      SELECT id, title, description, category, source, source_url, trigger_date, processed, created_at
      FROM trends
      WHERE id = ${id}
      LIMIT 1
    `;
    return (result as unknown as NeonTrend[])[0] ?? null;
  } catch (error) {
    console.error('[neon-db] fetchTrendById error:', error);
    return null;
  }
}

/**
 * Update a trend entry
 */
export async function updateTrend(
  id: string,
  data: {
    processed?: boolean;
    title?: string;
    description?: string;
    category?: string;
    source?: string;
    sourceUrl?: string;
  }
): Promise<NeonTrend | null> {
  const sql = await getNeonSql();
  if (!sql) return null;

  try {
    // Build SET clause dynamically using sql.query()
    const setClauses: string[] = [];
    const params: unknown[] = [];
    let paramIdx = 1;

    if (data.processed !== undefined) {
      setClauses.push(`processed = $${paramIdx}`);
      params.push(data.processed);
      paramIdx++;
    }
    if (data.title !== undefined) {
      setClauses.push(`title = $${paramIdx}`);
      params.push(data.title);
      paramIdx++;
    }
    if (data.description !== undefined) {
      setClauses.push(`description = $${paramIdx}`);
      params.push(data.description);
      paramIdx++;
    }
    if (data.category !== undefined) {
      setClauses.push(`category = $${paramIdx}`);
      params.push(data.category);
      paramIdx++;
    }
    if (data.source !== undefined) {
      setClauses.push(`source = $${paramIdx}`);
      params.push(data.source);
      paramIdx++;
    }
    if (data.sourceUrl !== undefined) {
      setClauses.push(`source_url = $${paramIdx}`);
      params.push(data.sourceUrl);
      paramIdx++;
    }

    if (setClauses.length === 0) return fetchTrendById(id);

    params.push(id);

    const result = await sql.query(
      `UPDATE trends SET ${setClauses.join(', ')} WHERE id = $${paramIdx}
       RETURNING id, title, description, category, source, source_url, trigger_date, processed, created_at`,
      params
    );

    return (result as unknown as NeonTrend[])[0] ?? null;
  } catch (error) {
    console.error('[neon-db] updateTrend error:', error);
    return null;
  }
}

// ── Internal Links Helpers ──────────────────────────────────────────────────

/**
 * Create an internal link between two articles
 */
export async function createInternalLink(data: {
  fromArticleId: string;
  toArticleId: string;
  anchorText?: string | null;
  score?: number | null;
}): Promise<NeonInternalLink | null> {
  const sql = await getNeonSql();
  if (!sql) return null;

  try {
    const result = await sql`
      INSERT INTO internal_links (from_article_id, to_article_id, anchor_text, score)
      VALUES (${data.fromArticleId}, ${data.toArticleId}, ${data.anchorText ?? null}, ${data.score ?? null})
      RETURNING id, from_article_id, to_article_id, anchor_text, score
    `;
    return (result as unknown as NeonInternalLink[])[0] ?? null;
  } catch (error) {
    console.error('[neon-db] createInternalLink error:', error);
    return null;
  }
}

/**
 * Fetch internal links for a specific article
 */
export async function fetchInternalLinks(
  articleId: string,
  direction: 'from' | 'to' | 'both' = 'both'
): Promise<NeonInternalLink[]> {
  const sql = await getNeonSql();
  if (!sql) return [];

  try {
    if (direction === 'from') {
      const result = await sql`
        SELECT id, from_article_id, to_article_id, anchor_text, score
        FROM internal_links
        WHERE from_article_id = ${articleId}
      `;
      return result as unknown as NeonInternalLink[];
    } else if (direction === 'to') {
      const result = await sql`
        SELECT id, from_article_id, to_article_id, anchor_text, score
        FROM internal_links
        WHERE to_article_id = ${articleId}
      `;
      return result as unknown as NeonInternalLink[];
    } else {
      const result = await sql`
        SELECT id, from_article_id, to_article_id, anchor_text, score
        FROM internal_links
        WHERE from_article_id = ${articleId} OR to_article_id = ${articleId}
      `;
      return result as unknown as NeonInternalLink[];
    }
  } catch (error) {
    console.error('[neon-db] fetchInternalLinks error:', error);
    return [];
  }
}

/**
 * Delete internal links for an article
 */
export async function deleteInternalLinks(
  articleId: string
): Promise<boolean> {
  const sql = await getNeonSql();
  if (!sql) return false;

  try {
    await sql`
      DELETE FROM internal_links
      WHERE from_article_id = ${articleId} OR to_article_id = ${articleId}
    `;
    return true;
  } catch (error) {
    console.error('[neon-db] deleteInternalLinks error:', error);
    return false;
  }
}

// ── Publish Article Endpoint Helper ────────────────────────────────────────

/**
 * Publish a draft article (change status from draft to published)
 */
export async function publishArticle(
  id: string
): Promise<NeonArticle | null> {
  return updateArticleStatus(id, 'published');
}

/**
 * Convenience: neonDb function for backward compatibility
 */
export const neonDb = getNeonSql;
