import { NextResponse } from 'next/server';

/**
 * /openapi.json — OpenAPI 3.1 specification
 *
 * Documents all public API endpoints including:
 * - AI tools (/api/tools/*)
 * - MCP server (/api/mcp)
 * - Chat (/api/chat, /api/chat/stream)
 * - Leads (/api/leads)
 * - Reviews (/api/reviews)
 * - Compare (/api/compare/*)
 * - Callback (/api/callback)
 * - OG images (/api/og)
 * - Discovery (.well-known/*)
 */
export async function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Paliwal Secure AI — Insurance Intelligence API',
      version: '2.0.0',
      description: 'AI-powered insurance advisory platform with 51+ IRDAI-registered insurers. Tools: protection score, plan comparison, InsureGPT chat, claim guidance, policy audit, and MCP server.',
      contact: { email: 'himanshupaliwalpbp@gmail.com', name: 'Himanshu Paliwal' },
      license: { name: 'Proprietary', url: 'https://paliwalsecure.in/terms-of-service' },
    },
    servers: [{ url: 'https://paliwalsecure.in/api', description: 'Production' }],
    tags: [
      { name: 'AI Tools', description: 'Agent-discoverable insurance tools' },
      { name: 'MCP', description: 'Model Context Protocol server' },
      { name: 'Chat', description: 'InsureGPT AI advisor' },
      { name: 'Leads', description: 'Lead capture and management' },
      { name: 'Reviews', description: 'Customer reviews' },
      { name: 'Compare', description: 'Insurance plan comparison' },
      { name: 'Callback', description: 'Callback request management' },
      { name: 'Discovery', description: 'AI/LLM discovery endpoints' },
    ],
    paths: {
      // ── AI Tools ────────────────────────────────────────────────────────
      '/tools/protection-score': {
        post: {
          tags: ['AI Tools'],
          summary: 'Calculate insurance protection score (0-100)',
          description: 'Returns a personalized protection score with breakdown and recommendations.',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ProtectionScoreInput' } } },
          },
          responses: {
            '200': { description: 'Protection score result', content: { 'application/json': { schema: { $ref: '#/components/schemas/ProtectionScoreOutput' } } } },
            '400': { description: 'Invalid input' },
            '429': { description: 'Rate limit exceeded (30/min)' },
          },
        },
        get: { tags: ['AI Tools'], summary: 'Tool metadata (inputSchema, outputSchema)', responses: { '200': { description: 'Tool metadata' } } },
      },
      '/tools/compare-plans': {
        post: {
          tags: ['AI Tools'],
          summary: 'Compare insurance plans from 51+ insurers',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { insuranceType: { type: 'string', enum: ['health', 'motor', 'life', 'travel', 'home'] } } } } } },
          responses: { '200': { description: 'Comparison results' }, '400': { description: 'Invalid input' }, '429': { description: 'Rate limit exceeded' } },
        },
        get: { tags: ['AI Tools'], summary: 'Tool metadata', responses: { '200': { description: 'Tool metadata' } } },
      },
      '/tools/insuregpt': {
        post: {
          tags: ['AI Tools'],
          summary: 'Ask InsureGPT AI advisor (Hindi/English/Hinglish)',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', maxLength: 2000 }, language: { type: 'string', enum: ['en', 'hi', 'hing'] } }, required: ['message'] } } } },
          responses: { '200': { description: 'AI response' }, '400': { description: 'Invalid input' }, '429': { description: 'Rate limit exceeded (20/min)' } },
        },
        get: { tags: ['AI Tools'], summary: 'Tool metadata', responses: { '200': { description: 'Tool metadata' } } },
      },
      '/tools/claim-guidance': {
        post: {
          tags: ['AI Tools'],
          summary: 'Get step-by-step claim filing guidance + IRDAI escalation',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { claimType: { type: 'string', enum: ['health', 'motor', 'life', 'travel', 'home'] }, insurer: { type: 'string' } }, required: ['claimType'] } } } },
          responses: { '200': { description: 'Claim guidance with steps, documents, escalation' }, '400': { description: 'Invalid input' } },
        },
        get: { tags: ['AI Tools'], summary: 'Tool metadata', responses: { '200': { description: 'Tool metadata' } } },
      },
      '/tools/policy-audit': {
        post: {
          tags: ['AI Tools'],
          summary: 'Audit existing insurance policies for coverage gaps',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { policies: { type: 'array', items: { type: 'object' } }, userProfile: { type: 'object' } }, required: ['policies'] } } } },
          responses: { '200': { description: 'Audit report with score, gaps, recommendations' }, '400': { description: 'Invalid input' } },
        },
        get: { tags: ['AI Tools'], summary: 'Tool metadata', responses: { '200': { description: 'Tool metadata' } } },
      },

      // ── MCP ─────────────────────────────────────────────────────────────
      '/mcp': {
        post: {
          tags: ['MCP'],
          summary: 'MCP streamable-http transport (JSON-RPC 2.0)',
          description: 'Methods: initialize, tools/list, tools/call, resources/list, prompts/list, ping',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { jsonrpc: { type: 'string', enum: ['2.0'] }, method: { type: 'string' }, params: { type: 'object' }, id: { type: ['number', 'string'] } }, required: ['jsonrpc', 'method'] } } } },
          responses: { '200': { description: 'JSON-RPC 2.0 response' }, '400': { description: 'Invalid JSON-RPC' }, '404': { description: 'Method not found' }, '429': { description: 'Rate limit exceeded (30/min)' } },
        },
        get: { tags: ['MCP'], summary: 'MCP server discovery info', responses: { '200': { description: 'Server info, tool count, resource count' } } },
      },

      // ── Chat ────────────────────────────────────────────────────────────
      '/chat': {
        post: {
          tags: ['Chat'],
          summary: 'Chat with InsureGPT (non-streaming)',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', maxLength: 2000 }, profile: { type: 'object' }, history: { type: 'array' }, language: { type: 'string' } }, required: ['message'] } } } },
          responses: { '200': { description: 'Chat response with recommendations' }, '400': { description: 'Invalid input' }, '429': { description: 'Rate limit exceeded (20/min)' } },
        },
      },
      '/chat/stream': {
        post: {
          tags: ['Chat'],
          summary: 'Chat with InsureGPT (SSE streaming)',
          description: 'Returns Server-Sent Events stream with real-time AI response.',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', maxLength: 2000 }, history: { type: 'array' }, language: { type: 'string' } }, required: ['message'] } } } },
          responses: { '200': { description: 'SSE stream (text/event-stream)' }, '400': { description: 'Invalid input' }, '429': { description: 'Rate limit exceeded' } },
        },
      },

      // ── Leads ───────────────────────────────────────────────────────────
      '/leads': {
        post: {
          tags: ['Leads'],
          summary: 'Submit insurance lead (public)',
          description: 'Accepts encrypted (base64) or plain lead data. Rate limited: 5/min/IP. Honeypot field "website" traps bots.',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, phone: { type: 'string', pattern: '^[6-9]\\d{9}$' }, email: { type: 'string', format: 'email' }, insuranceType: { type: 'string' }, city: { type: 'string' }, encrypted: { type: 'boolean' }, website: { type: 'string', description: 'Honeypot — must be empty' } }, required: ['name', 'phone'] } } } },
          responses: { '201': { description: 'Lead created with WhatsApp URL' }, '400': { description: 'Validation error' }, '429': { description: 'Rate limit exceeded' } },
        },
      },

      // ── Callback ────────────────────────────────────────────────────────
      '/callback': {
        post: {
          tags: ['Callback'],
          summary: 'Request a callback (public)',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, mobile: { type: 'string', pattern: '^[6-9]\\d{9}$' }, preferredTime: { type: 'string', enum: ['asap', '1hour', '2-5pm'] }, message: { type: 'string', maxLength: 500 } }, required: ['name', 'mobile', 'preferredTime'] } } } },
          responses: { '201': { description: 'Callback request created' }, '400': { description: 'Validation error' }, '429': { description: 'Rate limit exceeded (5/min)' } },
        },
      },

      // ── Reviews ─────────────────────────────────────────────────────────
      '/reviews': {
        get: { tags: ['Reviews'], summary: 'Get approved reviews (public)', parameters: [{ name: 'insuranceType', in: 'query', schema: { type: 'string' } }, { name: 'limit', in: 'query', schema: { type: 'number', default: 20 } }], responses: { '200': { description: 'List of approved reviews' } } },
        post: { tags: ['Reviews'], summary: 'Submit a review (public, rate limited)', responses: { '201': { description: 'Review submitted for moderation' }, '429': { description: 'Rate limit exceeded' } } },
      },
      '/reviews/stats': {
        get: { tags: ['Reviews'], summary: 'Get review statistics (public)', parameters: [{ name: 'insuranceType', in: 'query', schema: { type: 'string' } }], responses: { '200': { description: 'Aggregate review stats (count, avg rating)' } } },
      },

      // ── OG Images ───────────────────────────────────────────────────────
      '/og': {
        get: {
          tags: ['Discovery'],
          summary: 'Generate dynamic OG image (PNG, 1200×630)',
          parameters: [
            { name: 'title', in: 'query', required: true, schema: { type: 'string' } },
            { name: 'type', in: 'query', schema: { type: 'string', enum: ['article', 'blog', 'compare', 'city', 'vehicle', 'product', 'calculator', 'ai', 'knowledge', 'claim', 'news', 'default'] } },
            { name: 'author', in: 'query', schema: { type: 'string' } },
            { name: 'date', in: 'query', schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'PNG image (image/png)' }, '500': { description: 'Generation failed' } },
        },
      },
    },
    components: {
      schemas: {
        ProtectionScoreInput: {
          type: 'object',
          properties: {
            age: { type: 'number', minimum: 18, maximum: 100, description: 'Age' },
            income: { type: 'number', minimum: 0, description: 'Annual income in INR' },
            dependents: { type: 'number', minimum: 0, description: 'Number of dependents' },
            hasHealthInsurance: { type: 'boolean' },
            hasLifeInsurance: { type: 'boolean' },
            hasMotorInsurance: { type: 'boolean' },
            healthConditions: { type: 'array', items: { type: 'string' } },
          },
          required: ['age', 'income', 'dependents'],
        },
        ProtectionScoreOutput: {
          type: 'object',
          properties: {
            score: { type: 'number', minimum: 0, maximum: 100 },
            rating: { type: 'string', enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'] },
            maxScore: { type: 'number', example: 100 },
            breakdown: { type: 'object', description: 'Score by component (health, life, motor, coverage, age)' },
            recommendations: { type: 'array', items: { type: 'string' } },
            summary: { type: 'string' },
          },
        },
      },
      securitySchemes: {
        ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'Authorization', description: 'Bearer token for admin endpoints (not required for public endpoints)' },
      },
    },
    security: [],
    info_extra: {
      rate_limits: { public: '30 requests/minute per IP', chat: '20 messages/minute per IP', leads: '5 submissions/minute per IP' },
      authentication: 'Public endpoints require no authentication. Admin endpoints require Bearer token (admin access only).',
      irdai_registration: 'IRDAI POSP Code: IP429834',
      ai_discovery: {
        agent_skills: 'https://paliwalsecure.in/.well-known/agent-skills/index.json',
        mcp_server: 'https://paliwalsecure.in/.well-known/mcp/server-card.json',
        api_catalog: 'https://paliwalsecure.in/.well-known/api-catalog',
        openapi: 'https://paliwalsecure.in/openapi.json',
        llms_txt: 'https://paliwalsecure.in/llms.txt',
      },
    },
  };

  return NextResponse.json(spec, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
