// ============================================================================
// WhatsApp Send Message API — for outbound messages (lead notifications)
// ============================================================================
// Sends WhatsApp messages via Meta Cloud API.
// Use cases:
//   1. Notify Himanshu when a new lead comes in via website form
//   2. Auto-reply to incoming WhatsApp messages
//   3. Send policy reminders, claim status updates
//
// Setup:
//   1. Get Access Token from Meta Business app
//   2. Set in .env: WHATSAPP_TOKEN=EAAG..., WHATSAPP_PHONE_NUMBER_ID=123...
//   3. Use template messages first (Meta requires pre-approved templates)
//
// Until WhatsApp Business API is active, this endpoint will:
//   - Save the message intent to database (Lead table)
//   - Return a deep link that opens WhatsApp Web/Desktop with pre-filled message
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const HIMAL_PHONE = '919257877312'; // Himanshu Paliwal

// ── Request schema ────────────────────────────────────────────────────────
const sendMessageSchema = z.object({
  // User's phone (who is messaging)
  userPhone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian mobile required').optional(),
  // Pre-filled message
  message: z.string().min(1).max(2000),
  // Topic for categorization
  topic: z.enum([
    'health', 'car', 'bike', 'life', 'travel', 'home',
    'claim', 'policy-review', 'tax', 'general', 'disease', 'city',
  ]).default('general'),
  // Source page (where the user clicked)
  source: z.string().max(200).optional(),
  // Optional: name if user provides
  userName: z.string().max(100).optional(),
});

// ── POST: Send WhatsApp message ───────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = sendMessageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { userPhone, message, topic, source, userName } = validation.data;

    // ── Mode 1: WhatsApp Business API is active (production) ───────────
    const whatsappToken = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (whatsappToken && phoneNumberId && userPhone) {
      try {
        // Send via Meta Cloud API
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${whatsappToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: userPhone,
              type: 'text',
              text: { body: message },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`WhatsApp API failed: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ WhatsApp message sent:', result.messages?.[0]?.id);

        return NextResponse.json({
          success: true,
          messageId: result.messages?.[0]?.id,
          mode: 'api',
        });
      } catch (apiError) {
        console.error('WhatsApp API error, falling back to deep link:', apiError);
        // Fall through to Mode 2 (deep link)
      }
    }

    // ── Mode 2: Deep link fallback (no API setup yet) ──────────────────
    // Generate a wa.me link that opens WhatsApp with pre-filled message to Himanshu
    const deepLink = `https://wa.me/${HIMAL_PHONE}?text=${encodeURIComponent(message)}`;

    // TODO: Save to database (Lead table) when DB is connected
    // For now, just log (PII-masked — never log raw phone/name per DPDP Act)
    console.log('📝 WhatsApp lead captured:', {
      topic,
      source: source || 'unknown',
      userName: userName ? (userName.slice(0,1) + '***') : 'anonymous',
      userPhone: userPhone ? (userPhone.slice(0,4) + '******' + userPhone.slice(-2)) : 'not-provided',
      messagePreview: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
      timestamp: new Date().toISOString(),
      deepLink,
    });

    return NextResponse.json({
      success: true,
      mode: 'deep-link',
      deepLink,
      message: 'Click the deep link to open WhatsApp with pre-filled message.',
      // For UI: open this link in new tab
      action: 'open-whatsapp',
    });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json(
      { error: 'Failed to process WhatsApp message' },
      { status: 500 }
    );
  }
}

// ── GET: Endpoint info ────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/whatsapp/send',
    method: 'POST',
    description: 'Send WhatsApp message (or generate deep link fallback)',
    modes: {
      api: 'Active when WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID env vars are set',
      'deep-link': 'Fallback — generates wa.me link with pre-filled message',
    },
    requiredFields: ['message'],
    optionalFields: ['userPhone', 'topic', 'source', 'userName'],
    topics: ['health', 'car', 'bike', 'life', 'travel', 'home', 'claim', 'policy-review', 'tax', 'general', 'disease', 'city'],
    setup: {
      step1: 'Create Meta Business app at https://developers.facebook.com/apps',
      step2: 'Add WhatsApp product, get Phone Number ID + Access Token',
      step3: 'Set env vars: WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN',
      step4: 'Configure webhook URL: https://paliwalsecure.in/api/whatsapp/webhook',
    },
  });
}
