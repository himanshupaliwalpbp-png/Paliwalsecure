// ── ASR (Speech-to-Text) API Route ────────────────────────────────────────────
// Accepts POST with base64 audio data, returns transcribed text via z-ai-web-dev-sdk
// Rate limited: 10 requests per minute per IP

import { NextRequest, NextResponse } from 'next/server';
import { asrRateLimiter, getClientIp } from '@/lib/server-rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // ── Rate limiting: 10 requests per minute per IP ─────────────────────
    const rateLimit = asrRateLimiter.check(clientIp, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many transcription requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // ── Parse and validate request body ──────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body.' },
        {
          status: 400,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
        }
      );
    }

    if (!body || typeof body !== 'object' || !('audio' in body)) {
      return NextResponse.json(
        { error: 'Missing required field: audio' },
        {
          status: 400,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
        }
      );
    }

    const { audio } = body as { audio: unknown };

    if (typeof audio !== 'string' || audio.trim().length === 0) {
      return NextResponse.json(
        { error: 'Audio must be a non-empty base64-encoded string.' },
        {
          status: 400,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
        }
      );
    }

    // ── Dynamically import SDK and transcribe ─────────────────────────────
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const response = await zai.audio.asr.create({
      file_base64: audio,
    });

    const transcribedText = response.text;

    if (!transcribedText || typeof transcribedText !== 'string') {
      return NextResponse.json(
        { error: 'Transcription returned empty result.' },
        {
          status: 422,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
        }
      );
    }

    return NextResponse.json(
      { success: true, text: transcribedText },
      {
        headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
      }
    );
  } catch (error) {
    console.error('ASR transcription error:', error);

    // Handle SDK-specific errors gracefully
    const message =
      error instanceof Error ? error.message : 'Transcription failed unexpectedly.';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
