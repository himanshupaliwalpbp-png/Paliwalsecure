import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';

/**
 * Dynamic OG Image Generation API — Paliwal Secure AI
 *
 * Generates branded PNG Open Graph images on-the-fly for social sharing.
 * Compatible with: Facebook, X (Twitter), LinkedIn, WhatsApp, Telegram,
 * Discord, Slack, Perplexity, ChatGPT, Gemini.
 *
 * Accepts query params:
 *   - title (required, max 90 chars displayed)
 *   - description (optional, max 140 chars)
 *   - type (article|compare|city|vehicle|product|calculator|ai|knowledge|claim|default)
 *   - author (optional)
 *   - date (optional, ISO date string)
 *   - category (optional, overrides type label)
 *
 * Output: 1200×630 PNG (industry standard OG image dimensions)
 * Cache: 1 year (s-maxage=31536000, stale-while-revalidate)
 */

export const runtime = 'edge';

const TYPE_LABELS: Record<string, string> = {
  article: 'ARTICLE',
  blog: 'BLOG',
  compare: 'COMPARE',
  city: 'CITY GUIDE',
  vehicle: 'VEHICLE GUIDE',
  product: 'INSURANCE PRODUCT',
  calculator: 'CALCULATOR',
  ai: 'AI TOOL',
  knowledge: 'KNOWLEDGE',
  claim: 'CLAIM GUIDE',
  news: 'IRDAI NEWS',
  default: 'INSURANCE',
};

const TYPE_COLORS: Record<string, string> = {
  article: '#0891b2',
  blog: '#0891b2',
  compare: '#0d9488',
  city: '#0284c7',
  vehicle: '#059669',
  product: '#7c3aed',
  calculator: '#db2777',
  ai: '#2563eb',
  knowledge: '#9333ea',
  claim: '#dc2626',
  news: '#ea580c',
  default: '#0891b2',
};

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.substring(0, max - 1).trimEnd() + '…';
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'Paliwal Secure AI — Insurance Advisor';
  const description =
    searchParams.get('description') ||
    "India's #1 AI-powered insurance advisor. Compare 51+ IRDAI-registered insurers.";
  const type = (searchParams.get('type') || 'default').toLowerCase();
  const author = searchParams.get('author');
  const date = searchParams.get('date');
  const category = searchParams.get('category');

  const typeLabel = category || TYPE_LABELS[type] || TYPE_LABELS.default;
  const accentColor = TYPE_COLORS[type] || TYPE_COLORS.default;

  const displayTitle = truncate(title, 88);
  const displayDesc = truncate(description, 140);
  // Title size adapts to length for readability
  const titleSize = displayTitle.length > 60 ? 44 : displayTitle.length > 40 ? 52 : 60;

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #0c1222 0%, #0a2540 40%, #0d2137 100%)',
            fontFamily: 'sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative background circles */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: accentColor,
              opacity: 0.08,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: '-80px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: '#0d9488',
              opacity: 0.06,
            }}
          />

          {/* Top accent bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: `linear-gradient(90deg, ${accentColor}, #0d9488, ${accentColor})`,
            }}
          />

          {/* Header: Brand + Category badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '48px 64px 0 64px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Shield logo */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${accentColor}, #0d9488)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                🛡
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: 'white', fontSize: '24px', fontWeight: 700, lineHeight: 1.1 }}>
                  Paliwal Secure
                </div>
                <div style={{ color: '#94a3b8', fontSize: '14px', marginTop: '2px' }}>
                  paliwalsecure.in
                </div>
              </div>
            </div>

            {/* Category badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 18px',
                borderRadius: '20px',
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}66`,
                color: accentColor,
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '1px',
              }}
            >
              {typeLabel}
            </div>
          </div>

          {/* Main title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '40px 64px 0 64px',
              flex: 1,
            }}
          >
            <div
              style={{
                color: 'white',
                fontSize: titleSize,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-1px',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {displayTitle}
            </div>

            {/* Description */}
            {displayDesc && (
              <div
                style={{
                  color: '#cbd5e1',
                  fontSize: '22px',
                  lineHeight: 1.4,
                  marginTop: '20px',
                  maxWidth: '900px',
                }}
              >
                {displayDesc}
              </div>
            )}
          </div>

          {/* Footer: author + date + IRDAI */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 64px 48px 64px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {author && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${accentColor}, #0d9488)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 700,
                    }}
                  >
                    {author.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: 'white', fontSize: '16px', fontWeight: 600 }}>{author}</div>
                    <div style={{ color: '#94a3b8', fontSize: '13px' }}>IRDAI POSP IP429834</div>
                  </div>
                </div>
              )}
              {date && !author && (
                <div style={{ color: '#94a3b8', fontSize: '16px' }}>{formatDate(date)}</div>
              )}
              {author && date && (
                <div style={{ color: '#64748b', fontSize: '16px' }}>· {formatDate(date)}</div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#64748b',
                fontSize: '13px',
              }}
            >
              <span>India's #1 AI Insurance Advisor</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('[OG_IMAGE_ERROR]', error);
    // Return a 500 — do NOT fall back to SVG (social platforms reject SVG)
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
