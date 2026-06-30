import { NextResponse } from 'next/server';

/**
 * /.well-known/mcp/server-card.json — MCP Server Card (SEP-1649)
 */
export async function GET() {
  return NextResponse.json({
    $schema: 'https://raw.githubusercontent.com/modelcontextprotocol/modelcontextprotocol/main/schema/2025-06-18/server-card.json',
    serverInfo: {
      name: 'paliwal-secure-insurance',
      version: '1.0.0',
      title: 'Paliwal Secure AI — Insurance Intelligence Platform',
      description: 'AI-powered insurance advisory with 51+ insurers. Tools: protection score, plan comparison, InsureGPT chat, claim guidance.',
    },
    transport: {
      type: 'streamable-http',
      endpoint: 'https://paliwalsecure.in/api/mcp',
    },
    capabilities: {
      tools: { listChanged: true },
      resources: { listChanged: true, subscribe: true },
      prompts: { listChanged: true },
      logging: {},
    },
    tools: [
      { name: 'calculate_protection_score', description: 'Calculate 0-100 protection score' },
      { name: 'compare_insurance_plans', description: 'Compare plans from 51+ insurers' },
      { name: 'ask_insuregpt', description: 'Ask insurance questions in Hindi/English/Hinglish' },
    ],
    links: {
      documentation: 'https://paliwalsecure.in/docs/api',
      apiCatalog: 'https://paliwalsecure.in/.well-known/api-catalog',
      authMd: 'https://paliwalsecure.in/auth.md',
    },
  }, {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
  });
}
