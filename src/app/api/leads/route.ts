import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ── Decryption helper ──────────────────────────────────────────────────────
function decryptData(data: string): string {
  try {
    return decodeURIComponent(atob(data));
  } catch {
    return data;
  }
}

// ── POST /api/leads — Public lead submission (no auth required) ────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const isEncrypted = body.encrypted === true;

    const name = isEncrypted ? decryptData(body.name) : body.name;
    const phone = isEncrypted ? decryptData(body.phone) : body.phone;
    const email = body.email ? (isEncrypted ? decryptData(body.email) : body.email) : undefined;
    const { insuranceType, city, source } = body;

    // Validate
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json({ success: false, error: 'Please provide a valid Indian phone number' }, { status: 400 });
    }

    if (email && typeof email === 'string' && email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return NextResponse.json({ success: false, error: 'Please provide a valid email address' }, { status: 400 });
      }
    }

    // Create lead
    const lead = await db.lead.create({
      data: {
        name: name.trim(),
        email: email?.trim() || cleanPhone + '@paliwalinsure.in',
        phone: cleanPhone,
        insuranceType: insuranceType || null,
        city: city?.trim() || null,
        source: source || 'website',
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (error) {
    console.error('[LEADS_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
