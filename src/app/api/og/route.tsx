import { NextRequest, NextResponse } from 'next/server';

/**
 * Dynamic OG Image Generation API — Paliwal Secure AI
 *
 * Generates branded Open Graph images on-the-fly for social sharing.
 * Accepts query params: title, description, type (article/compare/city/vehicle)
 * Size: 1200×630 (standard OG image dimensions)
 * Branding: Paliwal Secure AI + InsureGPT, cyan/teal color scheme
 * Compliance: IRDAI POSP Code IP429834
 */

const TYPE_LABELS: Record<string, string> = {
  article: 'ARTICLE',
  compare: 'COMPARE',
  city: 'CITY GUIDE',
  vehicle: 'VEHICLE',
  default: 'INSURANCE',
};

const TYPE_COLORS: Record<string, string> = {
  article: '#0891b2',
  compare: '#0d9488',
  city: '#0284c7',
  vehicle: '#059669',
  default: '#0891b2',
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'Paliwal Secure AI — Insurance Advisor';
  const description =
    searchParams.get('description') ||
    'India\'s AI-powered insurance advisor. Compare 51+ insurers instantly.';
  const type = searchParams.get('type') || 'default';

  const typeLabel = TYPE_LABELS[type] || TYPE_LABELS.default;
  const accentColor = TYPE_COLORS[type] || TYPE_COLORS.default;

  const displayTitle = title.length > 70 ? title.substring(0, 67) + '...' : title;
  const displayDesc = description.length > 120 ? description.substring(0, 117) + '...' : description;
  const titleSize = displayTitle.length > 50 ? 36 : 44;

  // Generate SVG OG image — fully compatible, no Satori/ImageResponse dependency
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0c1222"/>
      <stop offset="40%" style="stop-color:#0a2540"/>
      <stop offset="100%" style="stop-color:#0d2137"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0891b2"/>
      <stop offset="50%" style="stop-color:#0d9488"/>
      <stop offset="100%" style="stop-color:#0891b2"/>
    </linearGradient>
    <linearGradient id="shield" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0891b2"/>
      <stop offset="100%" style="stop-color:#0d9488"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Decorative circles -->
  <circle cx="1050" cy="80" r="200" fill="${accentColor}" opacity="0.06"/>
  <circle cx="100" cy="550" r="150" fill="#0d9488" opacity="0.05"/>

  <!-- Top bar: Shield icon + Brand -->
  <rect x="48" y="28" width="44" height="44" rx="12" fill="url(#shield)"/>
  <path d="M70 40L63 44V49C63 54 65.8 57.5 70 59C74.2 57.5 77 54 77 49V44L70 40Z" fill="white" opacity="0.9"/>

  <!-- Brand text -->
  <text x="110" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" fill="#ffffff">Paliwal Secure AI</text>
  <text x="110" y="66" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#67e8f9">⚡ InsureGPT Powered</text>

  <!-- Type badge -->
  <rect x="1020" y="32" width="130" height="28" rx="14" fill="${accentColor}" opacity="0.15" stroke="${accentColor}" stroke-opacity="0.35" stroke-width="1"/>
  <text x="1085" y="51" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#67e8f9" text-anchor="middle" letter-spacing="1">${typeLabel}</text>

  <!-- Title -->
  <text x="48" y="260" font-family="system-ui, -apple-system, sans-serif" font-size="${titleSize}" font-weight="800" fill="#ffffff">${escapeXml(displayTitle)}</text>

  <!-- Description -->
  <text x="48" y="330" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#94a3b8">${escapeXml(displayDesc)}</text>

  <!-- Bottom: IRDAI POSP badge -->
  <rect x="48" y="575" width="270" height="36" rx="10" fill="#10b981" opacity="0.1" stroke="#10b981" stroke-opacity="0.25" stroke-width="1"/>
  <text x="64" y="599" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#6ee7b7">✅ IRDAI POSP Code: IP429834</text>

  <!-- URL -->
  <text x="1132" y="599" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="#64748b" text-anchor="end">paliwalsecure.in</text>

  <!-- Accent line at bottom -->
  <rect y="626" width="1200" height="4" fill="url(#accent)"/>
</svg>`;

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
