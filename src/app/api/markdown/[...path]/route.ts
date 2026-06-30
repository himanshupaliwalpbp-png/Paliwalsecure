import { NextRequest, NextResponse } from 'next/server';

/**
 * /api/markdown/[...path] — Markdown for Agents
 * 
 * Fetches the HTML page and converts to markdown.
 * Returns Content-Type: text/markdown.
 * 
 * This implements the "Markdown for Agents" spec so agents requesting
 * Accept: text/markdown can get markdown versions of pages.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const baseUrl = `https://paliwalsecure.in/${path}`;
  
  try {
    // Fetch the HTML page
    const res = await fetch(baseUrl, {
      headers: { 'Accept': 'text/html' },
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      return new NextResponse('# Page Not Found\n\nThe requested page could not be found.', {
        status: 404,
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      });
    }
    
    const html = await res.text();
    const markdown = htmlToMarkdown(html, baseUrl);
    
    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Vary': 'Accept',
      },
    });
  } catch {
    return new NextResponse('# Error\n\nFailed to fetch page.', {
      status: 500,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }
}

function htmlToMarkdown(html: string, url: string): string {
  let md = html;
  
  // Remove scripts, styles, nav, footer
  md = md.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  md = md.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  md = md.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
  md = md.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  md = md.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');
  
  // Extract title
  const titleMatch = md.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Paliwal Secure AI';
  
  // Convert headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n##### $1\n');
  
  // Convert links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Convert bold/italic
  md = md.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, '**$2**');
  md = md.replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, '*$2*');
  
  // Convert lists
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<\/?(ul|ol)[^>]*>/gi, '\n');
  
  // Convert paragraphs and divs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n');
  md = md.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n');
  
  // Convert line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');
  
  // Remove remaining tags
  md = md.replace(/<[^>]+>/g, '');
  
  // Decode HTML entities
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&nbsp;/g, ' ');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&quot;/g, '"');
  
  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();
  
  // Add header
  return `<!-- Source: ${url} -->\n<!-- Content-Type: text/markdown -->\n\n# ${title}\n\n${md}`;
}
