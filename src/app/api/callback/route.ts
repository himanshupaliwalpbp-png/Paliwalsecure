import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { requireAdmin } from '@/lib/api-auth';
import { apiRateLimiter } from '@/lib/server-rate-limiter';

const callbackSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  preferredTime: z.enum(['asap', '1hour', '2-5pm']),
  message: z.string().max(500).optional(),
  source: z.enum(['chatbot', 'website', 'whatsapp']).default('chatbot'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate-limit public submissions (per IP)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = apiRateLimiter.check(`callback-post:${ip}`, 5, 60_000); // 5/min
    if (!rl.allowed) {
      return NextResponse.json({ success: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const validated = callbackSchema.parse(body);

    const callback = await db.callbackRequest.create({
      data: {
        name: validated.name,
        mobile: validated.mobile,
        preferredTime: validated.preferredTime,
        message: validated.message || null,
        source: validated.source,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Callback request submitted successfully! Our team will call you shortly.',
      data: { id: callback.id },
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues?.[0];
      const msg = firstIssue?.message || 'Validation failed';
      return NextResponse.json(
        { success: false, error: msg },
        { status: 400 }
      );
    }
    console.error('Callback request error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // ── AUTH: admin-only ─────────────────────────────────────────────────────
  const admin = requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const where = status && status !== 'ALL' ? { status } : {};

  const [callbacks, total] = await Promise.all([
    db.callbackRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.callbackRequest.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: callbacks,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
