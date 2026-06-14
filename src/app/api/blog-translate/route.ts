import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

/**
 * Blog Translation Route
 * 
 * Translates blog content using z-ai-web-dev-sdk LLM directly.
 * NEVER returns "translation unavailable" — always gracefully falls back to English.
 */

// ── In-memory server-side cache ────────────────────────────────────────────
const serverTranslationCache = new Map<string, { translatedContent: string; translatedTitle: string; translatedDescription: string }>();
const CACHE_MAX_SIZE = 200;

// ── Call LLM SDK directly ─────────────────────────────────────────────────
async function translateWithLLM(
  content: string,
  language: 'hi' | 'hinglish',
  title: string,
  description: string
): Promise<{ translatedContent: string; translatedTitle: string; translatedDescription: string } | null> {
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const languageInstruction = language === 'hi'
      ? `You are translating an insurance blog post from English to SIMPLE Hindi (aasan Hindi).

CRITICAL RULES:
1. Write in SIMPLE CONVERSATIONAL Hindi - like explaining to a friend at a chai shop
2. Replace ALL English technical jargon with simple Hindi equivalents:
   - "Comprehensive" → "पूरा बीमा" (NOT "कॉम्प्रिहेंसिव")
   - "Depreciation" → "कीमत कम होना" (NOT "डेप्रिसिएशन")
   - "Replacement" → "नई चीज़ लगवाना" (NOT "रिप्लेसमेंट")
   - "Premium" → "बीमा का पैसा" or "प्रीमियम" (common word, OK to keep)
   - "Claim" → "क्लेम" (common word, OK to keep)
   - "IDV" → "IDV / बीमा राशि" (keep abbreviation, add Hindi meaning)
   - "NCB" → "NCB / क्लेम बोनस" (keep abbreviation, add Hindi meaning)
   - "Third Party" → "थर्ड पार्टी / दूसरे का नुकसान" (keep common term, add Hindi)
   - "Zero Depreciation" → "जीरो डेप / बिना कटोती" (NOT "जीरो डेप्रिसिएशन")
   - "Deductible" → "खुद का हिस्सा" (NOT "डिडक्टिबल")
   - "Reimbursement" → "पहले भरो, बाद में रिफंड" (NOT "रीम्बर्समेंट")
   - "Endorsement" → "बदलाव / सुधार" (NOT "एंडोर्समेंट")
   - "Super Top-Up" → "सुपर टॉप-अप / एक्स्ट्रा कवर" (NOT just transliteration)
   - "Co-payment" → "हिस्सेदारी" (NOT "को-पेमेंट")
   - "Floater" → "परिवार वाला प्लान" (NOT "फ्लोटर")
   - "Rider" → "राइडर / एक्स्ट्रा बीमा" (add Hindi meaning)
   - "Coverage" → "कवर / सुरक्षा" (NOT "कवरेज")
   - "Calculation" → "हिसाब" (NOT "कैलकुलेशन")
   - "Proportionally" → "जितना ज्यादा, उतना कटेगा" (NOT "प्रोपोरशनली")
   - "Critical Illness" → "गंभीर बीमारी (CI)" (NOT "क्रिटिकल इलनेस")
   - "Accidental Death" → "एक्सीडेंट से देहांत" (NOT "एक्सीडेंटल डेथ")
   - "Waiver of Premium" → "प्रीमियम माफ" (NOT "वेवर ऑफ प्रीमियम")
   - "Pre-existing Disease" → "पुरानी बीमारी (PED)" (NOT "प्री-एग्जिस्टिंग डिजीज")
   - "Maternity" → "प्रेगनेंसी / मैटरनिटी" (NOT just "मैटरनिटी" alone)
   - "Battery Degradation" → "बैटरी कम होना" (NOT "बैटरी डिग्रेडेशन")
   - "Lump Sum" → "एकमुश्त" (NOT "लम्प सम")
   - "Cost-Benefit Analysis" → "फायदा-नुकसान हिसाब" (NOT "कॉस्ट-बेनिफिट एनालिसिस")
3. Keep these English words as-is (they're commonly used in India): Insurance, Claim, Policy, Premium, EMI, GST, IRDAI, POSP, TP, NCB, IDV, EV
4. Numbers and ₹ amounts MUST stay as-is
5. Use short sentences. Break long complex sentences into 2-3 simple ones
6. Add analogies from daily life where helpful (like "जैसे घर का किराया")
7. Preserve ALL markdown formatting (headings, bullet points, bold, tables)
8. DO NOT use Sanskrit-heavy Hindi (like "कवरेज", "कैलकुलेशन") - use everyday words
9. FAQ answers must be in full simple Hindi sentences — no half-English mixing
10. Example: "Comprehensive insurance covers your car + third party" → "पूरा बीमा (comprehensive) आपकी कार और दूसरे के नुकसान दोनों कवर करता है"
11. Example: "Battery depreciation cover is NON-NEGOTIABLE" → "बैटरी कम होने का कवर लेना ज़रूरी है — बिना इसके मत लें"
12. Example: "800V ultra-fast charging port damage ₹30K-₹80K" → "तेज़ चार्जिंग पोर्ट खराब होने पर ₹30,000 से ₹80,000 तक का खर्चा आ सकता है"
13. Title and description must also be fully translated with simple Hindi`
      : `You are translating an insurance blog post from English to HINGLISH (Hindi+English mix, how Indians actually speak on WhatsApp/social media).

CRITICAL RULES:
1. Write EXACTLY how an Indian friend would explain insurance to another friend on WhatsApp
2. Mix Hindi and English naturally - like "Bhai, comprehensive matlab poora cover - apna bhi, dusre ka bhi"
3. Replace technical jargon with simple Hinglish:
   - "Comprehensive insurance" → "poora insurance" or "full cover wala insurance"
   - "Depreciation" → "value kam hona" or "purana hone pe price girta hai"
   - "Zero depreciation" → "zero dep" (commonly used, but explain: "matlab koi cut nahi")
   - "Deductible" → "apna hissa dena padega"
   - "Co-payment" → "hissedari"
   - "Reimbursement" → "pehle khud pay karo, baad mein refund"
   - "Endorsement" → "policy mein badlav"
   - "Critical Illness" → "bimari jaise cancer, heart attack (CI)"
   - "Accidental Death" → "accident se death"
   - "Waiver of Premium" → "premium maaf"
   - "Pre-existing Disease" → "purani bimari (PED)"
   - "Lump Sum" → "ekmushth"
   - "Floater" → "parivar wala plan"
   - "Super Top-Up" → "super top-up / extra cover"
4. Keep numbers and ₹ as-is
5. Use WhatsApp-style language: "Bhai", "Yaar", "Dekho", "Samjho", "Matlab", etc.
6. Short, punchy sentences - no long paragraphs
7. Preserve ALL markdown formatting
8. Add emoji where appropriate (🚗, 💰, ⚠️, ✅, etc.)
9. FAQ answers in full Hinglish — not half-English technical jargon
10. Example: "Comprehensive insurance covers your car + third party" → "Poora insurance (comprehensive) — apni car bhi, dusre ka nuksan bhi, sab cover! 🚗"
11. Example: "Battery depreciation cover is NON-NEGOTIATORY" → "Battery depreciation cover lena ZAROORI hai — bina iske mat lena ⚠️"
12. Example: "800V ultra-fast charging port damage ₹30K-₹80K" → "Fast charging port kharab hone par ₹30K se ₹80K tak ka kharcha aa sakta hai 💸"
13. Title and description must also be fully translated into Hinglish`;

    const maxContentLength = 15000;
    const truncatedContent = content.length > maxContentLength
      ? content.slice(0, maxContentLength) + '\n\n*[बाकी लेख अंग्रेज़ी में उपलब्ध है। / Remaining article available in English.]*'
      : content;

    const fullPrompt = `${languageInstruction}

TITLE (translate this):
${title || 'N/A'}

DESCRIPTION (translate this):
${description || 'N/A'}

ARTICLE CONTENT (translate this):
${truncatedContent}

IMPORTANT: You MUST respond with valid JSON only. No markdown, no code fences, no extra text.
Respond with this exact JSON structure:
{"translatedTitle":"your translated title","translatedDescription":"your translated description","translatedContent":"your translated content with \\n for newlines"}`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: languageInstruction + '\n\nYou MUST respond with valid JSON only. No markdown, no code fences, no extra text outside the JSON object.' },
        { role: 'user', content: fullPrompt },
      ],
      thinking: { type: 'disabled' },
    });

    if (completion?.choices?.[0]?.message?.content) {
      let response = completion.choices[0].message.content.trim();
      response = response.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

      let translatedContent = '';
      let translatedTitle = title;
      let translatedDescription = description;

      try {
        const parsed = JSON.parse(response);
        if (parsed.translatedTitle) translatedTitle = parsed.translatedTitle;
        if (parsed.translatedDescription) translatedDescription = parsed.translatedDescription;
        translatedContent = parsed.translatedContent || parsed.content || '';
      } catch {
        translatedContent = response;
      }

      if (translatedContent && translatedContent.length > 20) {
        return { translatedContent, translatedTitle, translatedDescription };
      }
    }
  } catch (err) {
    console.error('[blog-translate] LLM SDK error:', err instanceof Error ? err.message : err);
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, language, title, description, slug } = body;

    if (!content || !language || !slug) {
      return NextResponse.json({
        success: true,
        translatedContent: content || '',
        translatedTitle: title || '',
        translatedDescription: description || '',
        fallback: true,
      });
    }

    if (language !== 'hi' && language !== 'hinglish') {
      return NextResponse.json({
        success: true,
        translatedContent: content,
        translatedTitle: title || '',
        translatedDescription: description || '',
        fallback: true,
      });
    }

    // Check server-side cache first
    const cacheKey = `${slug}:${language}`;
    const cached = serverTranslationCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, ...cached, cached: true });
    }

    // Use LLM SDK directly for translation
    const llmResult = await translateWithLLM(content, language, title, description);
    if (llmResult) {
      // Cache the result
      if (serverTranslationCache.size >= CACHE_MAX_SIZE) {
        const firstKey = serverTranslationCache.keys().next().value;
        if (firstKey) serverTranslationCache.delete(firstKey);
      }
      serverTranslationCache.set(cacheKey, llmResult);
      return NextResponse.json({ success: true, ...llmResult, cached: false });
    }

    // Final fallback — return English content (never show "unavailable" error)
    return NextResponse.json({
      success: true,
      translatedContent: content,
      translatedTitle: title || '',
      translatedDescription: description || '',
      fallback: true,
    });

  } catch (error) {
    console.error('[blog-translate] Error:', error);
    // Even on error, return original English content gracefully (never show error to user)
    try {
      const body = await request.clone().json().catch(() => ({}));
      return NextResponse.json({
        success: true,
        translatedContent: body.content || '',
        translatedTitle: body.title || '',
        translatedDescription: body.description || '',
        fallback: true,
      });
    } catch {
      return NextResponse.json({
        success: true,
        translatedContent: '',
        translatedTitle: '',
        translatedDescription: '',
        fallback: true,
      });
    }
  }
}
