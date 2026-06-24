import { NextResponse } from 'next/server';

/**
 * /.well-known/api-catalog — RFC 9727 API Catalog
 * Returns application/linkset+json with all API endpoints.
 */
export async function GET() {
  const catalog = {
    linkset: [
      {
        anchor: 'https://paliwalsecure.in/api/chat',
        'service-desc': [
          { href: 'https://paliwalsecure.in/openapi.json#chat', type: 'application/vnd.oai.openapi+json' },
        ],
        'service-doc': [
          { href: 'https://paliwalsecure.in/docs/api#chat', type: 'text/html' },
        ],
        status: [
          { href: 'https://paliwalsecure.in/api/health', type: 'application/json' },
        ],
      },
      {
        anchor: 'https://paliwalsecure.in/api/leads',
        'service-desc': [
          { href: 'https://paliwalsecure.in/openapi.json#leads', type: 'application/vnd.oai.openapi+json' },
        ],
        'service-doc': [
          { href: 'https://paliwalsecure.in/docs/api#leads', type: 'text/html' },
        ],
        status: [
          { href: 'https://paliwalsecure.in/api/health', type: 'application/json' },
        ],
      },
      {
        anchor: 'https://paliwalsecure.in/api/audit',
        'service-desc': [
          { href: 'https://paliwalsecure.in/openapi.json#audit', type: 'application/vnd.oai.openapi+json' },
        ],
        'service-doc': [
          { href: 'https://paliwalsecure.in/docs/api#audit', type: 'text/html' },
        ],
        status: [
          { href: 'https://paliwalsecure.in/api/health', type: 'application/json' },
        ],
      },
    ],
  };

  return NextResponse.json(catalog, {
    headers: {
      'Content-Type': 'application/linkset+json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
