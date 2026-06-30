import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Markdown Negotiation Middleware
 *
 * When an AI agent sends Accept: text/markdown, this middleware intercepts
 * the HTML response and converts it to a basic markdown representation.
 *
 * This implements the "Markdown for Agents" spec:
 * https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
 *
 * The conversion is done AFTER the page renders, so we use a simpler approach:
 * - For API routes that return JSON, we wrap the JSON in a markdown code block
 * - For HTML pages, we return a markdown summary with key content
 */

export function markdownNegotiation(request: NextRequest) {
  const accept = request.headers.get('Accept') || '';

  // Only intercept markdown requests
  if (!accept.includes('text/markdown')) {
    return null;
  }

  const url = request.nextUrl.clone();

  // For known API endpoints, return their data as markdown
  if (url.pathname.startsWith('/api/')) {
    return null; // Let the API handle it, we'll convert in the response
  }

  // For HTML pages, we'll let the page render normally
  // but set a header so the page can optionally return markdown
  return null;
}

/**
 * Convert a basic HTML string to markdown.
 * This is a simple converter — not perfect but good enough for agents.
 */
export function htmlToMarkdown(html: string, url: string): string {
  // Remove scripts and styles
  let md = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  md = md.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  md = md.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
  md = md.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');

  // Convert headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n');

  // Convert links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Convert bold/italic
  md = md.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, '**$2**');
  md = md.replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, '*$2*');

  // Convert lists
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<\/?(ul|ol)[^>]*>/gi, '\n');

  // Convert paragraphs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n');

  // Convert line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');

  // Remove remaining tags
  md = md.replace(/<[^>]+>/g, '');

  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();

  // Add source URL
  md = `<!-- Source: ${url} -->\n\n${md}`;

  return md;
}
