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

    // ── System prompts per language ─────────────────────────────────────
    const systemPrompts: Record<string, string> = {
      hi: `You are an expert Hindi translator for insurance content. Translate English to SHUDDH, SIMPLE, NATURAL Hindi (आसान हिंदी).

QUALITY RULES (STRICT):
1. NEVER write English words in Devanagari script. "हेल्थ इन्श्योरेंस", "प्लान", "हॉस्पिटल", "कवर" — ये सब गलत हैं।
   "Health Insurance" → "स्वास्थ्य बीमा"
   "Hospital" → "अस्पताल"
   "Plan" → "पॉलिसी" या "योजना"
   "Cover/Coverage" → "कवरेज" नहीं — "सुरक्षा" या "कवर"
   "Premium" → "प्रीमियम" (यह ठीक है)
   "Claim" → "क्लेम" (यह ठीक है)
   "Policy" → "पॉलिसी" (यह ठीक है)
2. पहली बार आने वाले technical शब्दों के आगे bracket में English दें:
   "स्वास्थ्य बीमा (Health Insurance)", "बिना कटोती (Zero Dep)", "पुरानी बीमारी (PED)"
   दूसरी बार से सिर्फ हिंदी शब्द इस्तेमाल करें।
3. सरल बोल-चाल की हिंदी — जैसे दुकान पर दोस्त को समझाओ। छोटे वाक्य।
4. Technical शब्दों के आसान हिंदी विकल्प:
   - "Comprehensive" → "पूरा बीमा" / "कंप्रिहेंसिव (पूरा)"
   - "Depreciation" → "कीमत कम होना" / "कटोती"
   - "Zero Depreciation" → "बिना कटोती (Zero Dep)"
   - "Deductible" → "खुद का हिस्सा"
   - "Reimbursement" → "पहले भरो, बाद में रिफंड"
   - "Co-payment" → "हिस्सेदारी"
   - "Critical Illness" → "गंभीर बीमारी"
   - "Accidental Death" → "दुर्घटना में मृत्यु"
   - "Waiver of Premium" → "प्रीमियम माफ"
   - "Pre-existing Disease" → "पुरानी बीमारी"
   - "Maternity" → "प्रेगनेंसी / मातृत्व"
   - "Lump Sum" → "एकमुश्त"
   - "Network Hospital" → "नेटवर्क अस्पताल"
   - "Cashless" → "कैशलेस (बिना पैसे दिए इलाज)"
   - "Sum Insured" → "बीमा राशि"
   - "Floater" → "परिवार फ्लोटर प्लान"
   - "Add-on/Rider" → "ऐड-ऑन/राइडर"
   - "No Claim Bonus" → "नो क्लेम बोनस (NCB)"
   - "Third Party" → "थर्ड पार्टी (दूसरे का नुकसान)"
   - "Waiting Period" → "इंतज़ार अवधि"
5. ये शब्द English में ही रखें: Insurance (बीमा के साथ), Claim, Policy, Premium, EMI, GST, IRDAI, POSP, TP, NCB, IDV, EV, TPA
6. Numbers और ₹ amounts जस के तस।
7. सारा markdown formatting (##, **, •, |, tables, links) बरकरार रखें। Links के URL मत बदलो — सिर्फ link text का अनुवाद करो।
8. लंबे वाक्यों को 2-3 छोटे वाक्यों में तोड़ें।
9. देवनागरी मात्राएँ सही लगाओ — शुद्ध वर्तनी (spellings) का ध्यान रखो।
10. Output: सिर्फ अनुवादित हिंदी text, कोई explanation नहीं, कोई code block / markdown fence नहीं।`,

      hing: `You are translating insurance text from English to HINGLISH (Hindi+English mix, how Indians actually speak on WhatsApp).

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
7. Keep ALL markdown formatting (##, **, •, |, tables) and link URLs unchanged
8. Add emoji where appropriate (🚗, 💰, ⚠️, ✅, etc.)
9. Return ONLY the translated Hinglish text, nothing else — no code fences.`,
    };

    const systemPrompt = systemPrompts[language] || systemPrompts.hi;

    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    // Translate each chunk and combine results
    const translatedChunks: string[] = [];

    // Models sometimes wrap output in ``` fences — strip them
    const stripFences = (s: string): string => {
      const trimmed = s.trim();
      const fenceMatch = trimmed.match(/^```[a-zA-Z]*\n([\s\S]*?)\n?```$/);
      return fenceMatch ? fenceMatch[1].trim() : trimmed;
    };

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
          const raw = completion.choices[0].message.content;
          // Guard: if the model returned English unchanged (bad translation),
          // still pass it through — the cache on client will keep it consistent.
          translatedChunks.push(stripFences(raw));
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
