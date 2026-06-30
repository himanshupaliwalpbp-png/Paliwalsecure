import { NextResponse } from 'next/server';

/**
 * /.well-known/oauth-authorization-server — RFC 8414
 * OAuth 2.0 Authorization Server Metadata
 */
export async function GET() {
  return NextResponse.json({
    issuer: 'https://paliwalsecure.in',
    authorization_endpoint: 'https://paliwalsecure.in/api/auth/authorize',
    token_endpoint: 'https://paliwalsecure.in/api/auth/token',
    userinfo_endpoint: 'https://paliwalsecure.in/api/auth/userinfo',
    jwks_uri: 'https://paliwalsecure.in/api/auth/jwks',
    registration_endpoint: 'https://paliwalsecure.in/api/auth/register',
    revocation_endpoint: 'https://paliwalsecure.in/api/auth/revoke',
    introspection_endpoint: 'https://paliwalsecure.in/api/auth/introspect',
    response_types_supported: ['code', 'token', 'id_token'],
    grant_types_supported: ['authorization_code', 'refresh_token', 'client_credentials'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    scopes_supported: ['openid', 'profile', 'email', 'read:leads', 'write:leads', 'read:audit', 'write:audit', 'chat:insuregpt'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
    claims_supported: ['sub', 'name', 'email', 'phone_number', 'role'],
    code_challenge_methods_supported: ['S256'],
    agent_auth: {
      register_uri: 'https://paliwalsecure.in/api/auth/register',
      supported_identity_types: ['did', 'oauth', 'api_key'],
      credential_types: ['bearer_token', 'api_key', 'did'],
      claims_uri: 'https://paliwalsecure.in/api/auth/claims',
      revocation_uri: 'https://paliwalsecure.in/api/auth/revoke',
    },
  }, {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
  });
}
