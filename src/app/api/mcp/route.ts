import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimiter } from '@/lib/server-rate-limiter';

/**
 * POST /api/mcp — MCP (Model Context Protocol) Server Endpoint
 *
 * Implements the MCP streamable-http transport as declared in
 * /.well-known/mcp/server-card.json
 *
 * Supports:
 * - initialize: MCP handshake
 * - tools/list: List available tools
 * - tools/call: Invoke a tool
 * - resources/list: List available resources
 *
 * Rate limited: 30 requests/minute per IP
 */

export const maxDuration = 60;

interface MCPRequest {
  jsonrpc: string;
  id: number | string;
  method: string;
  params?: Record<string, unknown>;
}

interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

const MCP_TOOLS: MCPTool[] = [
  {
    name: 'calculate_protection_score',
    description: 'Calculate personalized insurance protection score (0-100) based on user profile',
    inputSchema: {
      type: 'object',
      properties: {
        age: { type: 'number', description: 'Age (18-100)' },
        income: { type: 'number', description: 'Annual income in INR' },
        dependents: { type: 'number', description: 'Number of dependents' },
        hasHealthInsurance: { type: 'boolean' },
        hasLifeInsurance: { type: 'boolean' },
        hasMotorInsurance: { type: 'boolean' },
      },
      required: ['age', 'income', 'dependents'],
    },
  },
  {
    name: 'compare_insurance_plans',
    description: 'Compare insurance plans from 51+ IRDAI-registered insurers',
    inputSchema: {
      type: 'object',
      properties: {
        insuranceType: { type: 'string', enum: ['health', 'motor', 'life', 'travel', 'home'] },
        age: { type: 'number' },
        sumInsured: { type: 'number' },
        city: { type: 'string' },
      },
      required: ['insuranceType'],
    },
  },
  {
    name: 'ask_insuregpt',
    description: 'Ask insurance questions to InsureGPT AI advisor (Hindi/English/Hinglish)',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Insurance question (1-2000 chars)' },
        language: { type: 'string', enum: ['en', 'hi', 'hing'] },
      },
      required: ['message'],
    },
  },
  {
    name: 'get_claim_guidance',
    description: 'Get step-by-step claim filing guidance + IRDAI escalation path',
    inputSchema: {
      type: 'object',
      properties: {
        claimType: { type: 'string', enum: ['health', 'motor', 'life', 'travel', 'home'] },
        insurer: { type: 'string' },
      },
      required: ['claimType'],
    },
  },
  {
    name: 'audit_existing_policies',
    description: 'Audit existing insurance policies for coverage gaps and recommendations',
    inputSchema: {
      type: 'object',
      properties: {
        policies: { type: 'array', items: { type: 'object' } },
        userProfile: { type: 'object' },
      },
      required: ['policies'],
    },
  },
];

const MCP_RESOURCES = [
  { uri: 'https://paliwalsecure.in/insurance-glossary', name: 'Insurance Glossary', description: 'Complete insurance terminology glossary', mimeType: 'text/html' },
  { uri: 'https://paliwalsecure.in/insurance-faq', name: 'Insurance FAQ', description: 'Frequently asked insurance questions', mimeType: 'text/html' },
  { uri: 'https://paliwalsecure.in/claim-settlement-ratio', name: 'CSR Guide', description: 'Claim settlement ratio guide with IRDAI data', mimeType: 'text/html' },
  { uri: 'https://paliwalsecure.in/blog', name: 'Insurance Blog', description: '390+ insurance knowledge articles', mimeType: 'text/html' },
  { uri: 'https://paliwalsecure.in/llms.txt', name: 'LLMs Overview', description: 'Site overview for LLMs', mimeType: 'text/plain' },
  { uri: 'https://paliwalsecure.in/openapi.json', name: 'OpenAPI Spec', description: 'OpenAPI specification', mimeType: 'application/json' },
];

function handleInitialize() {
  return {
    protocolVersion: '2025-06-18',
    capabilities: {
      tools: { listChanged: true },
      resources: { listChanged: true, subscribe: true },
      prompts: { listChanged: true },
      logging: {},
    },
    serverInfo: {
      name: 'paliwal-secure-insurance',
      version: '1.0.0',
      title: 'Paliwal Secure AI — Insurance Intelligence Platform',
    },
  };
}

async function handleToolCall(params: Record<string, unknown>, request: NextRequest) {
  const toolName = params.name as string;
  const args = (params.arguments || {}) as Record<string, unknown>;

  switch (toolName) {
    case 'calculate_protection_score': {
      const res = await fetch(new URL('/api/tools/protection-score', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
      const data = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }], isError: !res.ok };
    }
    case 'compare_insurance_plans': {
      const res = await fetch(new URL('/api/tools/compare-plans', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
      const data = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }], isError: !res.ok };
    }
    case 'ask_insuregpt': {
      const res = await fetch(new URL('/api/tools/insuregpt', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
      const data = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }], isError: !res.ok };
    }
    case 'get_claim_guidance': {
      const res = await fetch(new URL('/api/tools/claim-guidance', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
      const data = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }], isError: !res.ok };
    }
    case 'audit_existing_policies': {
      const res = await fetch(new URL('/api/tools/policy-audit', request.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
      const data = await res.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }], isError: !res.ok };
    }
    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${toolName}` }], isError: true };
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = apiRateLimiter.check(`mcp:${ip}`, 30, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { jsonrpc: '2.0', error: { code: -32603, message: 'Rate limit exceeded' }, id: null },
        { status: 429 }
      );
    }

    const body: MCPRequest = await request.json();

    // Validate JSON-RPC 2.0
    if (body.jsonrpc !== '2.0') {
      return NextResponse.json(
        { jsonrpc: '2.0', error: { code: -32600, message: 'Invalid Request: jsonrpc must be "2.0"' }, id: body.id },
        { status: 400 }
      );
    }

    let result: unknown;

    switch (body.method) {
      case 'initialize':
        result = handleInitialize();
        break;

      case 'tools/list':
        result = { tools: MCP_TOOLS };
        break;

      case 'tools/call':
        if (!body.params?.name) {
          return NextResponse.json(
            { jsonrpc: '2.0', error: { code: -32602, message: 'Missing tool name in params' }, id: body.id },
            { status: 400 }
          );
        }
        result = await handleToolCall(body.params, request);
        break;

      case 'resources/list':
        result = { resources: MCP_RESOURCES };
        break;

      case 'prompts/list':
        result = {
          prompts: [
            { name: 'insurance_recommendation', description: 'Get personalized insurance recommendation' },
            { name: 'claim_assistance', description: 'Get step-by-step claim filing guidance' },
          ],
        };
        break;

      case 'ping':
        result = {};
        break;

      default:
        return NextResponse.json(
          { jsonrpc: '2.0', error: { code: -32601, message: `Method not found: ${body.method}` }, id: body.id },
          { status: 404 }
        );
    }

    return NextResponse.json({ jsonrpc: '2.0', result, id: body.id });
  } catch (error) {
    console.error('[MCP_ERROR]', error);
    return NextResponse.json(
      { jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null },
      { status: 500 }
    );
  }
}

// GET returns MCP server info for discovery
export async function GET() {
  return NextResponse.json({
    server: 'paliwal-secure-insurance',
    version: '1.0.0',
    protocol: '2025-06-18',
    transport: 'streamable-http',
    tools: MCP_TOOLS.length,
    resources: MCP_RESOURCES.length,
    endpoints: {
      initialize: 'POST /api/mcp { method: "initialize" }',
      toolsList: 'POST /api/mcp { method: "tools/list" }',
      toolsCall: 'POST /api/mcp { method: "tools/call", params: { name, arguments } }',
      resourcesList: 'POST /api/mcp { method: "resources/list" }',
    },
  });
}
