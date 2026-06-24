import { NextResponse } from 'next/server';

/**
 * /auth.md — Agent registration instructions (auth.md spec)
 */
export async function GET() {
  const md = `# Paliwal Secure AI — Agent Authentication

## Overview
Paliwal Secure AI supports AI agent authentication via OAuth 2.0 / OpenID Connect.

## Registration
Agents can register at: https://paliwalsecure.in/api/auth/register

### Supported Identity Types
- **DID** — Decentralized Identifiers
- **OAuth** — Standard OAuth 2.0 client credentials
- **API Key** — Simple API key authentication

### Credential Types
- Bearer Token
- API Key
- DID

## Authentication Flow
1. Register your agent at \`/api/auth/register\`
2. Receive client credentials (client_id, client_secret)
3. Request access token at \`/api/auth/token\` using client_credentials grant
4. Use token in \`Authorization: Bearer <token>\` header for API calls

## Scopes
| Scope | Description |
|-------|-------------|
| \`read:leads\` | Read insurance leads |
| \`write:leads\` | Create insurance leads |
| \`read:audit\` | Read policy audits |
| \`write:audit\` | Create policy audits |
| \`chat:insuregpt\` | Chat with InsureGPT |

## Token Revocation
Revoke tokens at: https://paliwalsecure.in/api/auth/revoke

## Claims
View token claims at: https://paliwalsecure.in/api/auth/claims

## Contact
- Email: himanshupaliwalpbp@gmail.com
- WhatsApp: +91 9257877312
- IRDAI POSP Code: IP429834
`;
  return new NextResponse(md, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
