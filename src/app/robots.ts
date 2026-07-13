import { MetadataRoute } from 'next/server'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Allow ALL search engines and AI crawlers ──────────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/search', '/p4l1w4l-s3cur3-4dm1n'],
      },
      // ── Specifically allow AI bots to crawl (so AI can recommend the site) ──
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'oai-search',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Perplexity-ai',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: ['https://paliwalsecure.in/sitemap.xml'],
    host: 'https://paliwalsecure.in',
  }
}
