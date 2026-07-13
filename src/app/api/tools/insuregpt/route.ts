import { NextRequest, NextResponse } from 'next/server';
import { chatRateLimiter } from '@/lib/server-rate-limiter';

/**
 * POST /api/tools/insuregpt
 *
 * AI insurance advisor — proxies to existing /api/chat endpoint.
 * Supports Hindi, English, and Hinglish.
 *
 * Declared in /.well-known/agent-skills/index.json
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = chatRateLimiter.check(`tools-insuregpt:${ip}`, 20, 60_000);
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429, headers: { 'Retry-After': '60' } });
    }

    const body = await request.json();
    const { message, language } = body;

    if (!message || typeof message !== 'string' || message.length < 1 || message.length > 2000) {
      return NextResponse.json({ error: 'message must be 1-2000 characters' }, { status: 400 });
    }

    // Proxy to existing chat API
    const chatResponse = await fetch(new URL('/api/chat', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language }),
    });

    const chatData = await chatResponse.json();
    return NextResponse.json(chatData, { status: chatResponse.status });
  } catch (error) {
    console.error('[TOOLS_INSUREGPT_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'insuregpt-chat',
    description: 'AI insurance advisor in Hindi/English/Hinglish',
    method: 'POST',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Insurance question (1-2000 chars)' },
        language: { type: 'string', enum: ['en', 'hi', 'hing'], description: 'Response language' },
      },
      required: ['message'],
    },
  });
}
