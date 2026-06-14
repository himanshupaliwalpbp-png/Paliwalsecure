import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactRateLimiter, getClientIp } from '@/lib/server-rate-limiter';
import { contactFormSchema, validateInput, sanitizeString } from '@/lib/validation';
import { createAuditLog } from '@/lib/audit-log';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // ── Rate limiting: 3 submissions per 15 min per IP ───────────────────
    const rateLimit = contactRateLimiter.check(clientIp, 3, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many submissions. Please try again later.',
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

    // ── Validate input with Zod ──────────────────────────────────────────
    const body = await request.json();
    const validation = validateInput(contactFormSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.errors[0] },
        {
          status: 400,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
        }
      );
    }

    const { name, email, phone, message, insuranceType } = validation.data;

    // ── Sanitize string inputs ───────────────────────────────────────────
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = sanitizeString(email);
    const sanitizedPhone = phone && phone !== '' ? sanitizeString(phone) : null;
    const sanitizedMessage = sanitizeString(message);
    const sanitizedInsuranceType = insuranceType ? sanitizeString(insuranceType) : null;

    // ── Save lead to database ────────────────────────────────────────────
    const lead = await db.lead.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        message: sanitizedMessage,
        insuranceType: sanitizedInsuranceType,
        status: 'NEW',
        source: 'website',
      },
    });

    // ── Create audit log entry ───────────────────────────────────────────
    await createAuditLog({
      action: 'CREATE',
      entity: 'Lead',
      entityId: lead.id,
      details: {
        name: sanitizedName,
        email: sanitizedEmail,
        insuranceType: sanitizedInsuranceType || 'Not specified',
        source: 'website',
        ip: clientIp,
      },
      ipAddress: clientIp,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your inquiry! Our insurance advisor will contact you within 24 hours.',
      },
      {
        status: 200,
        headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
