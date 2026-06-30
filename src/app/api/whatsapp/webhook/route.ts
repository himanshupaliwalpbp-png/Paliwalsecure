// ============================================================================
// WhatsApp Webhook Receiver — Future-ready for WhatsApp Business API
// ============================================================================
// When you set up WhatsApp Business API (via Meta Cloud API or Twilio),
// configure this endpoint as your webhook URL.
//
// Setup steps (when ready):
// 1. Go to https://developers.facebook.com/apps → Create app → Business
// 2. Add WhatsApp product → Get Phone Number ID + Access Token
// 3. Set webhook URL: https://paliwalsecure.in/api/whatsapp/webhook
// 4. Set verify token in .env: WHATSAPP_VERIFY_TOKEN=your_secret
// 5. Subscribe to messages webhook field
//
// For now, this endpoint:
// - Handles GET verification (Meta calls this when you set up webhook)
// - Logs incoming POST messages (future: process them)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// ── GET: Webhook verification (Meta calls this on setup) ─────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'paliwal_secure_verify_2026';

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('✅ WhatsApp webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn('❌ WhatsApp webhook verification failed', { mode, token });
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

// ── POST: Incoming WhatsApp message ──────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log for debugging (in production, use proper logging)
    console.log('📩 WhatsApp webhook received:', JSON.stringify(body, null, 2));

    // Meta WhatsApp webhook structure:
    // body.entry[0].changes[0].value.messages[0] = incoming message
    // body.entry[0].changes[0].value.contacts[0] = sender info

    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    if (value?.messages?.[0]) {
      const message = value.messages[0];
      const from = message.from; // phone number
      const text = message.text?.body || '';
      const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString();

      console.log(`📱 Message from ${from} at ${timestamp}: ${text}`);

      // TODO: When WhatsApp Business API is active:
      // 1. Save to database (Lead table)
      // 2. Send auto-reply via /api/whatsapp/send
      // 3. If complex query, route to InsureGPT AI
      // 4. Notify Himanshu via WhatsApp

      // For now: just acknowledge receipt
      return NextResponse.json({ success: true, received: true });
    }

    // Status updates (delivered, read, etc.)
    if (value?.statuses?.[0]) {
      const status = value.statuses[0];
      console.log(`📊 Message ${status.id} status: ${status.status}`);
      return NextResponse.json({ success: true, status: status.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
