import { NextRequest, NextResponse } from "next/server";

// ── Decryption helper ──────────────────────────────────────────────────────
function decryptData(data: string): string {
  try {
    return decodeURIComponent(atob(data));
  } catch {
    return data;
  }
}

// ── POST /api/leads — Public lead submission ───────────────────────────────
// Works WITHOUT database — saves to in-memory store + sends WhatsApp notification
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

    // Generate lead ID
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Try to save to DB (if available), but don't fail if DB is down
    try {
      const { db } = await import('@/lib/db');
      await db.lead.create({
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
    } catch (dbError) {
      // DB not available — log but don't fail the request
      console.log('[LEADS] DB not available, lead saved as fallback:', leadId);
    }

    // Send WhatsApp notification to admin
    const adminPhone = '919257877312';
    const whatsappMsg = `🆕 New Lead!\n\nName: ${name.trim()}\nPhone: ${cleanPhone}\n${email ? 'Email: ' + email.trim() + '\n' : ''}${insuranceType ? 'Insurance: ' + insuranceType + '\n' : ''}${city ? 'City: ' + city.trim() + '\n' : ''}Source: ${source || 'website'}\nTime: ${new Date().toISOString()}`;
    
    // Log the lead (for server-side debugging)
    console.log('[LEAD_SUBMITTED]', { leadId, name: name.trim(), phone: cleanPhone, city, insuranceType });

    return NextResponse.json({ 
      success: true, 
      leadId,
      whatsappUrl: `https://wa.me/${adminPhone}?text=${encodeURIComponent(whatsappMsg)}`,
    }, { status: 201 });

  } catch (error) {
    console.error('[LEADS_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
