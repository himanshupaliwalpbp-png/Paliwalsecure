import { NextRequest, NextResponse } from 'next/server';
import { chatRateLimiter, getClientIp } from '@/lib/server-rate-limiter';

export const maxDuration = 30;

// ── Rate limiter: reuse chat limiter (20 per minute per IP) ────────────────
const translateRateLimiter = chatRateLimiter;

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // ── Rate limiting ─────────────────────────────────────────────────────
    const rateLimit = translateRateLimiter.check(clientIp, 20, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'बहुत अधिक अनुवाद अनुरोध। कृपया कुछ सेकंड प्रतीक्षा करें। / Too many translation requests. Please wait a moment.',
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

    // ── Validate input ────────────────────────────────────────────────────
    const body = await request.json();
    const { content, language } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string.' },
        {
          status: 400,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
        }
      );
    }

    if (content.length > 80000) {
      return NextResponse.json(
        { error: 'सामग्री बहुत लंबी है। अधिकतम 80,000 अक्षर। / Content is too long. Maximum 80,000 characters allowed.' },
        {
          status: 400,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
        }
      );
    }

    if (!language || (language !== 'hi' && language !== 'en' && language !== 'hing')) {
      return NextResponse.json(
        { error: 'भाषा "hi", "en", या "hing" होनी चाहिए। / Language must be "hi", "en", or "hing".' },
        {
          status: 400,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
        }
      );
    }

    // If language is 'en', just return the original content
    if (language === 'en') {
      return NextResponse.json({
        success: true,
        translatedContent: content,
        language: 'en',
      }, {
        headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
      });
    }

    // ── Translate using z-ai-web-dev-sdk ──────────────────────────────────
    // Split content into chunks if too long (max ~4000 chars per chunk for fewer API calls)
    const MAX_CHUNK = 4000;
    const chunks: string[] = [];
    if (content.length <= MAX_CHUNK) {
      chunks.push(content);
    } else {
      // Split on paragraph boundaries
      const paragraphs = content.split(/\n\n+/);
      let currentChunk = '';
      for (const para of paragraphs) {
        if ((currentChunk + '\n\n' + para).length > MAX_CHUNK && currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = para;
        } else {
          currentChunk = currentChunk ? currentChunk + '\n\n' + para : para;
        }
      }
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
    }

    // ── System prompts per language ─────────────────────────────────────────
    const systemPrompts: Record<string, string> = {
      hi: `You are translating an insurance text from English to SIMPLE Hindi (aasan Hindi).

CRITICAL RULES:
1. Write in SIMPLE CONVERSATIONAL Hindi - like explaining to a friend at a chai shop
2. Replace ALL English technical jargon with simple Hindi equivalents:
   - "Comprehensive" → "पूरा बीमा" (NOT "कॉम्प्रिहेंसिव")
   - "Depreciation" → "कीमत कम होना" (NOT "डेप्रिसिएशन")
   - "Zero Depreciation" → "जीरो डेप / बिना कटोती" (NOT "जीरो डेप्रिसिएशन")
   - "Deductible" → "खुद का हिस्सा" (NOT "डिडक्टिबल")
   - "Reimbursement" → "पहले भरो, बाद में रिफंड" (NOT "रीम्बर्समेंट")
   - "Co-payment" → "हिस्सेदारी" (NOT "को-पेमेंट")
   - "Coverage" → "कवर / सुरक्षा" (NOT "कवरेज")
   - "Critical Illness" → "गंभीर बीमारी (CI)" (NOT "क्रिटिकल इलनेस")
   - "Accidental Death" → "एक्सीडेंट से देहांत" (NOT "एक्सीडेंटल डेथ")
   - "Waiver of Premium" → "प्रीमियम माफ" (NOT "वेवर ऑफ प्रीमियम")
   - "Pre-existing Disease" → "पुरानी बीमारी (PED)" (NOT "प्री-एग्जिस्टिंग डिजीज")
   - "Maternity" → "प्रेगनेंसी / मैटरनिटी" (NOT just "मैटरनिटी")
   - "Lump Sum" → "एकमुश्त" (NOT "लम्प सम")
   - "Calculation" → "हिसाब" (NOT "कैलकुलेशन")
   - "Floater" → "परिवार वाला प्लान" (NOT "फ्लोटर")
3. Keep these English words as-is: Insurance, Claim, Policy, Premium, EMI, GST, IRDAI, POSP, TP, NCB, IDV, EV
4. Numbers and ₹ amounts stay as-is
5. Keep ALL markdown formatting (##, **, •, |, tables)
6. Use short sentences. Break long sentences into 2-3 simple ones
7. DO NOT use Sanskrit-heavy Hindi - use everyday bol-chaal ki Hindi
8. Example: "Comprehensive insurance covers your car + third party" → "पूरा बीमा आपकी कार और दूसरे के नुकसान दोनों कवर करता है"
9. Return ONLY the translated Hindi text, nothing else.`,

      hing: `You are translating an insurance text from English to HINGLISH (Hindi+English mix, how Indians actually speak on WhatsApp).

CRITICAL RULES:
1. Write EXACTLY how an Indian friend would explain insurance to another friend on WhatsApp
2. Mix Hindi and English naturally - "Bhai, comprehensive matlab poora cover - apna bhi, dusre ka bhi"
3. Replace technical jargon with simple Hinglish:
   - "Comprehensive insurance" → "poora insurance" or "full cover wala insurance"
   - "Depreciation" → "value kam hona" or "purana hone pe price girta hai"
   - "Zero depreciation" → "zero dep" (commonly used, explain: "matlab koi cut nahi")
   - "Deductible" → "apna hissa dena padega"
   - "Co-payment" → "hissedari"
   - "Reimbursement" → "pehle khud pay karo, baad mein refund"
   - "Critical Illness" → "bimari jaise cancer, heart attack (CI)"
   - "Accidental Death" → "accident se death"
   - "Waiver of Premium" → "premium maaf"
   - "Pre-existing Disease" → "purani bimari (PED)"
   - "Lump Sum" → "ekmushth"
   - "Floater" → "parivar wala plan"
4. Keep numbers and ₹ as-is
5. Use WhatsApp-style language: "Bhai", "Yaar", "Dekho", "Samjho", "Matlab", etc.
6. Short, punchy sentences - no long paragraphs
7. Keep ALL markdown formatting (##, **, •, |, tables)
8. Add emoji where appropriate (🚗, 💰, ⚠️, ✅, etc.)
9. Return ONLY the translated Hinglish text, nothing else.`,
    };

    const systemPrompt = systemPrompts[language] || systemPrompts.hi;

    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    // Translate each chunk and combine results
    const translatedChunks: string[] = [];

    for (const chunk of chunks) {
      try {
        const completionPromise = zai.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: chunk },
          ],
          thinking: { type: 'disabled' },
        });

        const timeoutPromise = new Promise<null>((resolve) => {
          setTimeout(() => resolve(null), 30000);
        });

        const completion = await Promise.race([completionPromise, timeoutPromise]);

        if (completion && completion.choices?.[0]?.message?.content) {
          translatedChunks.push(completion.choices[0].message.content);
        } else {
          // If a chunk times out, use original chunk as fallback
          translatedChunks.push(chunk);
        }
      } catch {
        // If a chunk fails, use original as fallback
        translatedChunks.push(chunk);
      }
    }

    const translatedContent = translatedChunks.join('\n\n');

    return NextResponse.json({
      success: true,
      translatedContent,
      language,
    }, {
      headers: {
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Translation API error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'अनुवाद विफल हुआ। कृपया बाद में पुनः प्रयास करें। / Translation failed. Please try again later.' },
      { status: 500 }
    );
  }
}
