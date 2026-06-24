import { NextResponse } from 'next/server';

/**
 * /.well-known/agents — DNS-AID fallback endpoint
 * 
 * While DNS-AID requires DNS SVCB records at _index._agents.paliwalsecure.in,
 * this HTTP endpoint serves as a fallback for agent discovery.
 * 
 * DNS records that need to be added (at DNS provider):
 * _index._agents.paliwalsecure.in  SVCB 1 paliwalsecure.in alpn=h2 endpoint=https://paliwalsecure.in
 * _a2a._agents.paliwalsecure.in    SVCB 1 paliwalsecure.in alpn=h2 endpoint=https://paliwalsecure.in/api/a2a
 */
export async function GET() {
  return NextResponse.json({
    resource: 'paliwalsecure.in',
    description: 'Paliwal Secure AI — Insurance Intelligence Platform',
    agents: {
      index: {
        endpoint: 'https://paliwalsecure.in',
        transport: 'https',
        capabilities: ['chat', 'tools', 'resources'],
      },
      a2a: {
        endpoint: 'https://paliwalsecure.in/api/a2a',
        transport: 'https',
        protocol: 'a2a',
      },
      mcp: {
        endpoint: 'https://paliwalsecure.in/api/mcp',
        transport: 'streamable-http',
        protocol: 'mcp',
        serverCard: 'https://paliwalsecure.in/.well-known/mcp/server-card.json',
      },
    },
    dns_aid_records: {
      note: 'DNS SVCB records should be published at DNS provider',
      records: [
        {
          name: '_index._agents.paliwalsecure.in',
          type: 'SVCB',
          data: { priority: 1, target: 'paliwalsecure.in', alpn: 'h2', endpoint: 'https://paliwalsecure.in' },
        },
        {
          name: '_a2a._agents.paliwalsecure.in',
          type: 'SVCB',
          data: { priority: 1, target: 'paliwalsecure.in', alpn: 'h2', endpoint: 'https://paliwalsecure.in/api/a2a' },
        },
      ],
    },
    links: {
      apiCatalog: 'https://paliwalsecure.in/.well-known/api-catalog',
      mcpServerCard: 'https://paliwalsecure.in/.well-known/mcp/server-card.json',
      agentSkills: 'https://paliwalsecure.in/.well-known/agent-skills/index.json',
      authMd: 'https://paliwalsecure.in/auth.md',
      openapi: 'https://paliwalsecure.in/openapi.json',
    },
  }, {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
  });
}
