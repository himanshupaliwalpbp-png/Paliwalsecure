// ── TTS (Text-to-Speech) API Route ────────────────────────────────────────────
// Accepts POST with text, returns audio via z-ai-web-dev-sdk
// Rate limited: 10 requests per minute per IP
// Max text length: 1024 characters (API constraint)

import { NextRequest, NextResponse } from 'next/server';
import { ttsRateLimiter, getClientIp } from '@/lib/server-rate-limiter';

export const maxDuration = 20;

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // ── Rate limiting: 10 TTS requests per minute per IP ────────────────
    const rateLimit = ttsRateLimiter.check(clientIp, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many TTS requests. Please try again later.',
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

    if (!body || typeof body !== 'object' || !('text' in body)) {
      return NextResponse.json(
        { error: 'Missing required field: text' },
        {
          status: 400,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
        }
      );
    }

    const { text, voice, speed } = body as { text: unknown; voice?: string; speed?: number };

    if (typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text must be a non-empty string.' },
        {
          status: 400,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
        }
      );
    }

    // Truncate text to 1024 characters (API constraint)
    const truncatedText = text.trim().slice(0, 1024);

    // Validate speed (0.5 - 2.0)
    const validSpeed = typeof speed === 'number' && speed >= 0.5 && speed <= 2.0 ? speed : 1.0;

    // Validate voice
    const validVoices = ['tongtong', 'chuichui', 'xiaochen', 'jam', 'kazi', 'douji', 'luodo'];
    const validVoice = typeof voice === 'string' && validVoices.includes(voice) ? voice : 'tongtong';

    // ── Clean text for TTS ───────────────────────────────────────────────
    // Remove markdown formatting, emojis, and special characters for cleaner speech
    let cleanText = truncatedText
      .replace(/\*\*(.+?)\*\*/g, '$1') // bold
      .replace(/\*(.+?)\*/g, '$1') // italic
      .replace(/`(.+?)`/g, '$1') // code
      .replace(/```[\s\S]*?```/g, '') // code blocks
      .replace(/^[-•]\s+/gm, '') // list markers
      .replace(/^\d+\.\s+/gm, '') // numbered lists
      .replace(/^---$/gm, '') // horizontal rules
      // Remove common emojis and unicode symbols
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1FFFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '')
      .replace(/⚠️|✅|❌|💰|📋|🏠|🚗|✈️|🛡️|🏥|🩺|🔧|💡|🛵|📈|🎯|🤖|🙏|👋|📱|📊/g, '')
      .replace(/\s+/g, ' ') // collapse whitespace
      .trim();

    if (cleanText.length === 0) {
      cleanText = truncatedText.replace(/[^\w\s.,!?;:'"()₹%-]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    if (cleanText.length === 0) {
      return NextResponse.json(
        { error: 'Text is empty after cleaning.' },
        { status: 400 }
      );
    }

    // ── Dynamically import SDK and generate TTS ──────────────────────────
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    // Race with a timeout of 15 seconds
    const ttsPromise = zai.audio.tts.create({
      input: cleanText,
      voice: validVoice,
      speed: validSpeed,
      response_format: 'wav',
      stream: false,
    });

    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), 15000);
    });

    const response = await Promise.race([ttsPromise, timeoutPromise]);

    if (!response) {
      console.error('TTS API timeout after 15 seconds');
      return NextResponse.json(
        { error: 'TTS request timed out. Please try again.' },
        { status: 504 }
      );
    }

    // Determine content type from response headers
    const contentType = response.headers?.get?.('content-type') || 'audio/wav';
    const isJson = contentType.includes('application/json');

    // If the API returned JSON (error), parse it
    if (isJson) {
      try {
        const errorData = await response.json();
        console.error('TTS API returned JSON error:', errorData);
        return NextResponse.json(
          { error: errorData?.error?.message || errorData?.message || 'TTS API error' },
          { status: 500 }
        );
      } catch {
        // If JSON parsing fails, fall through to binary handling
      }
    }

    // Get array buffer from Response object
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { error: 'TTS generated empty audio.' },
        { status: 500 }
      );
    }

    // Determine the actual audio format from content-type
    const audioContentType = contentType.startsWith('audio/') ? contentType : 'audio/wav';

    // Return audio as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': audioContentType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    const message = error instanceof Error ? error.message : 'TTS failed unexpectedly.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
