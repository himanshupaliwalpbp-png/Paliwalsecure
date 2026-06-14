import { NextResponse } from 'next/server';

// Node.js runtime — no edge needed for sitemap index generation

/**
 * Sitemap Index — Paliwal Secure
 *
 * Generates a sitemap index XML that references the main sitemap only.
 * All URLs are included in the single sitemap.ts file, so no sub-sitemaps
 * are needed. Adding sub-sitemap references that don't exist would cause
 * 404 errors in Google Search Console.
 */

const BASE_URL = 'https://paliwalsecure.in';

interface SitemapEntry {
  loc: string;
  lastmod: string;
}

const sitemaps: SitemapEntry[] = [
  {
    loc: `${BASE_URL}/sitemap.xml`,
    lastmod: new Date().toISOString().split('T')[0],
  },
];

export async function GET() {
  const sitemapEntries = sitemaps
    .map(
      (s) => `  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
