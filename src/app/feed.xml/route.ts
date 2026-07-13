import { NextResponse } from 'next/server';
import { blogPosts } from '@/lib/blog-data';
import * as fs from 'fs';
import * as path from 'path';

export const revalidate = 3600; // Revalidate every hour

/**
 * RSS 2.0 Feed — Paliwal Secure AI
 *
 * Dynamically generates RSS feed from actual blog posts (markdown files).
 * Site: https://paliwalsecure.in
 */

const BASE_URL = 'https://paliwalsecure.in';
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    // Read actual markdown files to build RSS items
    let availableSlugs: Set<string> = new Set();
    try {
      if (fs.existsSync(BLOG_DIR)) {
        availableSlugs = new Set(
          fs
            .readdirSync(BLOG_DIR)
            .filter((f) => f.endsWith('.md'))
            .map((f) => f.replace(/\.md$/, ''))
        );
      }
    } catch {
      // Fallback: use blogPosts from blog-data.ts
      availableSlugs = new Set(blogPosts.map((p) => p.slug));
    }

    // Build RSS items from blog posts (most recent 50)
    const items = blogPosts
      .filter((post) => availableSlugs.has(post.slug))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 50)
      .map((post) => {
        const pubDate = new Date(post.date).toUTCString();
        return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || post.title)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>Insurance</category>
    </item>`;
      })
      .join('\n');

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Paliwal Secure AI — Insurance Knowledge</title>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>India's #1 AI-powered insurance knowledge platform. Compare 51+ IRDAI-registered insurers. Trusted by 500+ families.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <category>Insurance</category>
    <category>Health Insurance</category>
    <category>Motor Insurance</category>
    <category>Life Insurance</category>
    <category>Travel Insurance</category>
    <category>Home Insurance</category>
    <ttl>60</ttl>
    <image>
      <url>${BASE_URL}/api/og?title=Paliwal%20Secure%20AI&type=default</url>
      <title>Paliwal Secure AI</title>
      <link>${BASE_URL}</link>
      <width>1200</width>
      <height>630</height>
    </image>
${items}
  </channel>
</rss>`;

    return new NextResponse(feed, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[RSS_FEED_ERROR]', error);
    return new NextResponse('Failed to generate RSS feed', { status: 500 });
  }
}
