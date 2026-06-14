// ============================================================================
// Paliwal Secure AI - Advisor Lead Capture API Route
// POST endpoint: Captures leads from WhatsApp/callback flow
// without AI recommendations (for the human advisor follow-up flow)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ── Input Types ──────────────────────────────────────────────────────────────
interface LeadCaptureRequest {
  name: string;
  phone: string;
  message?: string;
  source: string;
}

// ── Validation ───────────────────────────────────────────────────────────────
function validateLeadInputs(body: LeadCaptureRequest): string | null {
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    return 'Name is required';
  }
  if (body.name.trim().length > 200) {
    return 'Name must be under 200 characters';
  }

  if (!body.phone || typeof body.phone !== 'string' || body.phone.trim().length === 0) {
    return 'Phone number is required';
  }
  // Basic Indian phone validation: 10 digits, optionally prefixed with +91 or 0
  const phoneDigits = body.phone.replace(/[\s\-\(\)]/g, '');
  const indianPhoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
  if (!indianPhoneRegex.test(phoneDigits)) {
    return 'Please provide a valid 10-digit Indian mobile number';
  }

  if (body.message !== undefined && typeof body.message !== 'string') {
    return 'Message must be a string';
  }
  if (body.message && body.message.length > 2000) {
    return 'Message must be under 2000 characters';
  }

  if (!body.source || typeof body.source !== 'string' || body.source.trim().length === 0) {
    return 'Source is required';
  }

  return null;
}

// ── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: LeadCaptureRequest = await request.json();

    // Validate inputs
    const validationError = validateLeadInputs(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const { name, phone, message, source } = body;

    // Clean phone number to standard 10-digit format
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '').replace(/^(\+91|0)/, '');

    // ── Save lead to database ─────────────────────────────────────────────
    // We store this as a Lead entry in the existing Lead model, since
    // this is a general lead capture (not tied to the AI advisor flow).
    // The AdvisorLead model is specifically for AI-generated recommendations.
    const lead = await db.lead.create({
      data: {
        name: name.trim(),
        email: '', // Required by schema, empty for phone-only leads
        phone: cleanPhone,
        message: message?.trim() || null,
        source: source.trim(),
        status: 'NEW',
        city: null,
        insuranceType: null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        message: 'Thank you! Our advisor will contact you shortly.',
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('[Advisor Lead API] Unhandled error:', error);

    // Check for database-specific errors
    if (error instanceof Error && error.message.includes('database')) {
      return NextResponse.json(
        { success: false, error: 'Unable to save your details right now. Please try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
