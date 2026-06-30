import { NextResponse } from 'next/server';

/**
 * /.well-known/oauth-protected-resource — RFC 9728
 * Tells agents how to obtain access tokens for protected APIs.
 */
export async function GET() {
  const metadata = {
    resource: 'https://paliwalsecure.in/api',
    authorization_servers: [
      'https://paliwalsecure.in',
    ],
    scopes_supported: [
      'read:leads',
      'write:leads',
      'read:audit',
      'write:audit',
      'chat:insuregpt',
    ],
    bearer_methods_supported: ['header'],
    resource_documentation: 'https://paliwalsecure.in/docs/api',
  };

  return NextResponse.json(metadata, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
