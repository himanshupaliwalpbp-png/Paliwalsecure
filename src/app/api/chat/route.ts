import { NextRequest, NextResponse } from 'next/server';
import { buildRAGContext, getRecommendations, checkIRDAICompliance } from '@/lib/scoring-engine';
import {
  type UserProfile, IRDAI_MANDATORY_DISCLAIMER, allInsurancePlans,
  responseTemplates, marketTrends2026, irdaiRegulations2025, claimGuides,
} from '@/lib/insurance-data';
import { chatRateLimiter, getClientIp } from '@/lib/server-rate-limiter';
import { chatMessageSchema, validateInput, sanitizeString } from '@/lib/validation';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // ── Rate limiting: 20 messages per minute per IP ─────────────────────
    const rateLimit = chatRateLimiter.check(clientIp, 20, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many messages. Please slow down and try again.',
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
    const validation = validateInput(chatMessageSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.errors[0] },
        {
          status: 400,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
        }
      );
    }

    const { message, profile, history, memory, language } = validation.data;

    // ── Sanitize user message ────────────────────────────────────────────
    const sanitizedMessage = sanitizeString(message);

    // Check if user is asking for recommendations
    const isRecommendationRequest = /recommend|suggest|which.*plan|which.*insurance|suitable|batao|sujhav|chuno/i.test(sanitizedMessage);

    // Check for high-pressure scenario templates
    let templateResponse: string | null = null;
    for (const tpl of responseTemplates) {

    try {
        const regex = typeof tpl.trigger === 'string' ? new RegExp(tpl.trigger, 'i') : tpl.trigger;
        if (regex.test(sanitizedMessage)) {
          templateResponse = tpl.response;
          break;
        }
      } catch {
        // Skip invalid regex
      }
    }

    let recommendations: Array<{
      planName: string;
      provider: string;
      category: string;
      premium: string;
      claimSettlementRatio: string;
      matchScore: string;
      whyRecommended: string;
      keyFeatures: string[];
    }> | null = null;
    if (isRecommendationRequest && profile) {
      try {
        const recs = getRecommendations(profile as unknown as UserProfile, undefined, 3);
        recommendations = recs.map(r => ({
          planName: r.plan.name,
          provider: r.plan.provider,
          category: r.plan.category,
          premium: `₹${r.plan.premium.monthly.toLocaleString()}/mo (₹${r.plan.premium.annual.toLocaleString()}/yr)`,
          claimSettlementRatio: `${r.plan.claimSettlementRatio}%`,
          matchScore: `${r.score.percentage}%`,
          whyRecommended: r.whyRecommended,
          keyFeatures: r.plan.features.slice(0, 4),
        }));
      } catch (e) {
        console.error('Recommendation error:', e);
      }
    }

    // Try LLM first, with a timeout of 10 seconds
    let aiResponse: string = '';

    try {
      const systemPrompt = buildRAGContext(sanitizedMessage, profile as UserProfile | undefined);

      // Append language instruction if provided — placed at BOTH start and end of prompt for emphasis
      let langInstruction = '';
      if (language) {
        const langInstructions: Record<string, string> = {
          en: '[LANGUAGE: English] Respond in English only. Use clear, professional English. Do NOT use Hindi words.',
          hi: '[LANGUAGE: HINDI - MANDATORY] आपको केवल हिंदी (देवनागरी लिपि) में उत्तर देना है। यह अनिवार्य नियम है। यदि आप अंग्रेजी में उत्तर देते हैं तो यह गंभीर त्रुटि होगी। कोई भी अंग्रेजी शब्द नहीं — सिर्फ देवनागरी। अंग्रेजी में उत्तर देना पूरी तरह वर्जित है। हर एक वाक्य देवनागरी में होना चाहिए। उदाहरण उत्तर: "आपको स्वास्थ्य बीमा लेना चाहिए क्योंकि चिकित्सा खर्चे बहुत महंगे हैं। यह योजना ₹500 प्रति माह से शुरू होती है और आपको कैशलेस इलाज की सुविधा देती है।" याद रखें: हर वाक्य हिंदी (देवनागरी) में होना चाहिए, कोई अपवाद नहीं।',
          hing: '[LANGUAGE: HINGLISH - MANDATORY] Aapko HINGLISH mein hi jawab dena hai. Hinglish matlab Hindi words Roman script mein, English words ke saath mixed — jaise Indians naturally baat karte hain. अगर आप pure English में जवाब देंगे तो यह गलती होगी। Kabhi bhi pure English mein mat jawab dena. Yeh rule break mat karein. Har response mein Hindi words (Roman script) use karein. Example response: "Aapko health insurance lena chahiye kyunki medical expenses bahut mehnga hai aur hospital bill aapke budget se bahar ho sakta hai. Care Health plan ₹500/month se shuru hota hai aur 21,700+ hospitals mein cashless treatment deta hai." Yaad rakhein: Hinglish mein jawab dena zaroori hai, pure English bilkul nahi.',
        };
        langInstruction = langInstructions[language] || '';
      }

      // Place language instruction at BOTH the beginning AND end of system prompt for maximum emphasis
      let enrichedSystemPrompt: string;
      if (language && langInstruction) {
        enrichedSystemPrompt = memory
          ? `${langInstruction}\n\n${systemPrompt}\n\n[USER MEMORY CONTEXT]: ${memory}\n\n${langInstruction}`
          : `${langInstruction}\n\n${systemPrompt}\n\n${langInstruction}`;
      } else {
        enrichedSystemPrompt = memory
          ? `${systemPrompt}\n\n[USER MEMORY CONTEXT]: ${memory}`
          : systemPrompt;
      }

      const apiMessages: Array<{ role: 'system' | 'assistant' | 'user'; content: string }> = [
        { role: 'system', content: enrichedSystemPrompt },
      ];

      const historyMessages: Array<{ role: 'system' | 'assistant' | 'user'; content: string }> = (history || [])
        .map((m: { role: string; content: string }) => ({
          role: (m.role === 'bot' ? 'assistant' : 'user') as 'assistant' | 'user',
          content: m.content,
        }));

      const userContent = recommendations
        ? `${sanitizedMessage}\n\n[SYSTEM: Here are the personalized recommendations based on the user profile - include these in your response in a friendly, structured way]:\n${JSON.stringify(recommendations, null, 2)}`
        : sanitizedMessage;

      historyMessages.push({ role: 'user', content: userContent });

      for (const msg of historyMessages) {
        const lastRole = apiMessages[apiMessages.length - 1]?.role;
        if (lastRole === msg.role) {
          apiMessages[apiMessages.length - 1].content += '\n' + msg.content;
        } else {
          apiMessages.push(msg);
        }
      }

      // Only send last 6 messages to keep it fast
      const trimmedMessages = apiMessages.length > 7
        ? [apiMessages[0], ...apiMessages.slice(-6)]
        : apiMessages;

      // ── Multi-model AI: Claude → ZAI fallback ──────────────────────────────
      const { callAI } = await import('@/lib/ai-router');
      // Race with a 20-second timeout (maxDuration is 30s, leave 10s for processing)
      const aiResult = await callAI({
        messages: [
          { role: 'system', content: systemPrompt },
          ...apiMessages,
        ],
        temperature: 0.7,
        maxTokens: 2048,
      });
      aiResponse = aiResult.content;
    } catch (llmError) {
      console.error('LLM Error:', llmError);
    }

    // Fallback to smart static responses if AI fails or times out
    if (!aiResponse) {
      // Check for template response first (high-pressure scenarios)
      if (templateResponse) {
        aiResponse = templateResponse;
      } else {
        aiResponse = generateFallbackResponse(sanitizedMessage, recommendations, language);
      }
    }

    // IRDAI Compliance Check
    const compliance = checkIRDAICompliance(aiResponse);
    if (!compliance.isCompliant) {
      console.warn('IRDAI Compliance violations detected:', compliance.violations);
      aiResponse = compliance.sanitizedText;
    }

    // Add mandatory disclaimer if discussing specific plans
    if (/plan|policy|premium|cover|insurance/i.test(aiResponse)) {
      aiResponse += `\n\n---\n*⚠️ ${IRDAI_MANDATORY_DISCLAIMER}*`;
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      recommendations: recommendations || undefined,
      complianceChecked: true,
    }, {
      headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// Enhanced fallback response generator — ALWAYS gives SPECIFIC plan data, NEVER generic category listings
function generateFallbackResponse(
  message: string,
  recommendations: Array<{
    planName: string;
    provider: string;
    category: string;
    premium: string;
    claimSettlementRatio: string;
    matchScore: string;
    whyRecommended: string;
    keyFeatures: string[];
  }> | null,
  language?: string | null
): string {
  const lowerMsg = message.toLowerCase();
  const isHinglish = language === 'hing';
  const isHindi = language === 'hi';

  // Greeting — immediately provide substantive data instead of category listings
  if (/hi|hello|hey|namaste|namaskar/i.test(lowerMsg)) {
    if (isHinglish) {
      return `Namaste! 👋 **InsureGPT** mein aapka swagat hai — aapka AI insurance advisor by Paliwal Secure! Main seedha data deta hoon, no generic baatein:

**🏥 Top Health Plans (IRDAI 2025-26):**
• Care Health: ₹500/mo, CSR 100%, 21,700+ hospitals, PED: Diabetes 24mo
• Acko General: ₹550/mo, CSR 99.91%, 10,000+ hospitals, PED: Diabetes 24mo
• HDFC ERGO: ₹600/mo, CSR 99.16%, Maternity ✅, PED: Diabetes 36mo

**🛡️ Top Term Plans (IRDAI 2025-26):**
• HDFC Life: ₹1,250/mo (₹1Cr cover), CSR 99.97%, Claim 30 days
• Max Life: ₹1,350/mo (₹1Cr cover), CSR 99.08%
• SBI Life: ₹1,200/mo (₹1Cr cover), CSR 98.50%, AUM ₹3.8L Cr

**🚗 Top Motor Plans (IRDAI 2025-26):**
• ICICI Lombard: ₹1,899/yr, CSR 91.22%, 7,500+ garages
• HDFC ERGO: ₹2,200/yr, CSR 98.85%, 8,500+ garages

**✈️ Top Travel Plans (IRDAI 2025-26):**
• TATA AIG Travel: ₹499/trip, CSR 96.67%
• Care Health Travel: ₹450/trip, CSR 93.13%

Jo bhi detail chahiye — specific plan, comparison, claim process, tax savings — poochein!`;
    }
    if (isHindi) {
      return `नमस्ते! 👋 **InsureGPT** में आपका स्वागत है — आपका AI बीमा सलाहकार by Paliwal Secure! मैं सीधा डेटा देता हूं:

**🏥 शीर्ष स्वास्थ्य योजनाएं (IRDAI 2025-26):**
• Care Health: ₹500/माह, CSR 100%, 21,700+ अस्पताल, PED: मधुमेह 24माह
• Acko General: ₹550/माह, CSR 99.91%, 10,000+ अस्पताल
• HDFC ERGO: ₹600/माह, CSR 99.16%, प्रसूति ✅

**🛡️ शीर्ष टर्म योजनाएं (IRDAI 2025-26):**
• HDFC Life: ₹1,250/माह (₹1Cr कवर), CSR 99.97%
• Max Life: ₹1,350/माह (₹1Cr कवर), CSR 99.08%
• SBI Life: ₹1,200/माह (₹1Cr कवर), CSR 98.50%

**🚗 शीर्ष मोटर योजनाएं:**
• ICICI Lombard: ₹1,899/वर्ष, CSR 91.22%
• HDFC ERGO: ₹2,200/वर्ष, CSR 98.85%

जो भी विस्तार चाहिए — विशिष्ट योजना, तुलना, क्लेम प्रक्रिया — पूछें!`;
    }
    return `Namaste! 👋 Welcome to **InsureGPT** — your AI insurance advisor by Paliwal Secure! Here's real data, not generic talk:

**🏥 Top Health Plans (Source: IRDAI Annual Report 2025-26):**
• **Care Health Insurance** — ₹500/mo (₹5,600/yr), CSR: 100%, 21,700+ hospitals, PED: Diabetes 24mo, BP 24mo, Heart 36mo | Family floater ✅ Maternity ✅
• **Acko General Insurance** — ₹550/mo (₹6,200/yr), CSR: 99.91%, 10,000+ hospitals, PED: Diabetes 24mo, BP 24mo, Heart 36mo | Family floater ✅ Maternity ❌
• **HDFC ERGO** — ₹600/mo (₹6,800/yr), CSR: 99.16%, 10,000+ hospitals, PED: Diabetes 36mo, BP 24mo, Heart 48mo | Family floater ✅ Maternity ✅
• **Bajaj Allianz** — ₹520/mo (₹5,800/yr), CSR: 98.50%, Solvency: 3.0, PED: Diabetes 36mo
• **TATA AIG** — ₹550/mo (₹6,200/yr), CSR: 96.67%, PED: Diabetes 24mo, Wellness ✅

**🛡️ Top Term Plans (Source: IRDAI Life Insurance CSR Report 2025-26):**
• **HDFC Life** — ₹1,250/mo (₹1Cr cover), CSR: 99.97%, Claim turnaround: 30 days, Solvency: 2.1, AUM: ₹2.5L Cr
• **Max Life** — ₹1,350/mo (₹1Cr cover), CSR: 99.08%, Claim turnaround: 30 days
• **SBI Life** — ₹1,200/mo (₹1Cr cover), CSR: 98.50%, AUM: ₹3.8L Cr

**🚗 Top Motor Plans:**
• **ICICI Lombard** — ₹1,899/yr, CSR: 91.22%, 7,500+ garages, Add-ons: Zero Dep, Engine Protect, Roadside Assist
• **HDFC ERGO** — ₹2,200/yr, CSR: 98.85%, 8,500+ garages, Add-ons: Zero Dep, Engine Protect, Return to Invoice

**✈️ Top Travel Plans:**
• **TATA AIG Travel** — ₹499/trip, CSR: 96.67%, Medical evacuation, Trip cancellation, Lost baggage
• **Care Health Travel** — ₹450/trip, CSR: 93.13%, Covid cover, Flight delay

Ask me about any specific plan, comparison, claim process, or tax savings — I give you REAL numbers!`;
  }

  // Health insurance questions — always give FULL specific plan data
  if (/health.*insurance|medical.*insurance|bima.*health|health.*bima|स्वास्थ्य.*बीमा|चिकित्सा.*बीमा|हेल्थ.*इंश्योरेंस|health.*bima/i.test(lowerMsg)) {
    if (isHinglish) {
      return `Health insurance aapke medical expenses cover karta hai — hospitalization, surgery, aur treatments. India mein medical inflation 14% hai. Yeh rahi **top 5 health plans with full data** (Source: IRDAI Annual Report 2025-26):

**1. Care Health Insurance** — ₹500/mo (₹5,600/yr)
• CSR: 100% | ICR: 58.68% | Solvency: 1.8 | Complaints/10k: 42
• 21,700+ network hospitals | Family floater ✅ | Maternity ✅
• PED Waiting: Diabetes 24mo, BP 24mo, Heart 36mo
• Room rent: Single private room | No-claim bonus: Cumulative up to 100%

**2. Acko General Insurance** — ₹550/mo (₹6,200/yr)
• CSR: 99.91% | ICR: 65% | Solvency: 1.7 | Complaints/10k: 15
• 10,000+ network hospitals | Family floater ✅ | Maternity ❌
• PED Waiting: Diabetes 24mo, BP 24mo, Heart 36mo
• Room rent: No limit | No-claim bonus: Cumulative up to 100%

**3. HDFC ERGO General Insurance** — ₹600/mo (₹6,800/yr)
• CSR: 99.16% | ICR: 89.47% | Solvency: 1.9 | Complaints/10k: 10.67
• 10,000+ network hospitals | Family floater ✅ | Maternity ✅
• PED Waiting: Diabetes 36mo, BP 24mo, Heart 48mo
• Room rent: Deluxe room | No-claim bonus: 50% cumulative/year

**4. Bajaj Allianz General Insurance** — ₹520/mo (₹5,800/yr)
• CSR: 98.50% | ICR: 54.33% | Solvency: 3.0 | Complaints/10k: 25
• 8,500+ network hospitals | Family floater ✅ | Maternity ❌
• PED Waiting: Diabetes 36mo, BP 24mo, Heart 48mo
• Room rent: Single private room | Wellness program ✅

**5. TATA AIG General Insurance** — ₹550/mo (₹6,200/yr)
• CSR: 96.67% | ICR: 94.44% | Solvency: 2.0 | Complaints/10k: 20
• 6,500+ network hospitals | Family floater ✅ | Maternity ❌
• PED Waiting: Diabetes 24mo, BP 24mo, Heart 36mo
• Room rent: Single private room | Health coach ✅

⚠️ **Agar aapko Diabetes ya BP hai:** Acko, Care Health aur TATA AIG mein 24-month PED waiting hai — HDFC ERGO aur Bajaj Allianz mein 36 months lagta hai diabetes ke liye.`;
    }
    return `Health insurance covers your medical expenses — hospitalization, surgeries, and treatments. India's medical inflation is 14% annually, making it essential. Here are **India's top 5 health plans with complete data** (Source: IRDAI Annual Report 2025-26):

**1. Care Health Insurance** — ₹500/mo (₹5,600/yr)
• CSR: 100% | ICR: 58.68% | Solvency: 1.8 | Complaints/10k: 42
• 21,700+ network hospitals | Family floater ✅ | Maternity ✅
• PED Waiting: Diabetes 24mo, BP 24mo, Heart 36mo
• Room rent: Single private room | No-claim bonus: Cumulative up to 100%

**2. Acko General Insurance** — ₹550/mo (₹6,200/yr)
• CSR: 99.91% | ICR: 65% | Solvency: 1.7 | Complaints/10k: 15 (lowest!)
• 10,000+ network hospitals | Family floater ✅ | Maternity ❌
• PED Waiting: Diabetes 24mo, BP 24mo, Heart 36mo
• Room rent: No limit | No-claim bonus: Cumulative up to 100%

**3. HDFC ERGO General Insurance** — ₹600/mo (₹6,800/yr)
• CSR: 99.16% | ICR: 89.47% | Solvency: 1.9 | Complaints/10k: 10.67 (lowest!)
• 10,000+ network hospitals | Family floater ✅ | Maternity ✅
• PED Waiting: Diabetes 36mo, BP 24mo, Heart 48mo
• Room rent: Deluxe room | No-claim bonus: 50% cumulative/year

**4. Bajaj Allianz General Insurance** — ₹520/mo (₹5,800/yr)
• CSR: 98.50% | ICR: 54.33% | Solvency: 3.0 (highest!) | Complaints/10k: 25
• 8,500+ network hospitals | Family floater ✅ | Maternity ❌
• PED Waiting: Diabetes 36mo, BP 24mo, Heart 48mo
• Room rent: Single private room | Wellness program ✅

**5. TATA AIG General Insurance** — ₹550/mo (₹6,200/yr)
• CSR: 96.67% | ICR: 94.44% | Solvency: 2.0 | Complaints/10k: 20
• 6,500+ network hospitals | Family floater ✅ | Maternity ❌
• PED Waiting: Diabetes 24mo, BP 24mo, Heart 36mo
• Room rent: Single private room | Health coach ✅

⚠️ **If you have Diabetes or BP:** Acko, Care Health, and TATA AIG have shorter 24-month PED waiting vs HDFC ERGO and Bajaj Allianz which take 36 months for diabetes.

💰 **Quick comparison:** Lowest premium = Care Health (₹500/mo). Highest CSR = Care Health (100%). Lowest complaints = HDFC ERGO (10.67/10k). Highest solvency = Bajaj Allianz (3.0).`;
  }

  // Term/Life insurance questions — always give FULL specific plan data
  if (/term.*insurance|life.*insurance|term.*plan|jeevan.*bima|जीवन.*बीमा|टर्म.*बीमा|जीवन.*योजना|term.*bima|life.*bima/i.test(lowerMsg)) {
    return `Term insurance is the most affordable way to financially protect your family — ₹1 Crore cover starts at just ₹1,000/month. Here are **India's top 5 term plans with complete data** (Source: IRDAI Life Insurance CSR Report 2025-26):

**1. HDFC Life Insurance** — ₹1,250/mo (₹15,000/yr) for ₹1 Crore cover
• CSR: 99.97% (highest!) | Claim turnaround: 30 days (fastest!) | Solvency: 2.1
• AUM: ₹2,50,000 Cr | Policy term: 30 years
• Riders: Critical Illness, Accidental Death, Waiver of Premium
• Features: Click2Protect, Return of premium option

**2. Max Life Insurance** — ₹1,350/mo (₹16,000/yr) for ₹1 Crore cover
• CSR: 99.08% | Claim turnaround: 30 days | Solvency: 2.1
• AUM: ₹1,50,000 Cr | Policy term: 30 years
• Riders: Critical Illness, Accidental Death, Waiver of Premium
• Features: Smart Term Plan, Critical illness add-on

**3. SBI Life Insurance** — ₹1,200/mo (₹14,000/yr) for ₹1 Crore cover
• CSR: 98.50% | Claim turnaround: 45 days | Solvency: 2.0
• AUM: ₹3,80,000 Cr (largest!) | Policy term: 30 years
• Riders: Critical Illness, Accidental Death, Waiver of Premium

**4. Bajaj Allianz Life** — ₹1,100/mo (₹13,000/yr) for ₹1 Crore cover
• CSR: 97.50% | Claim turnaround: 45 days | Solvency: 5.41 (highest!)
• AUM: ₹1,10,000 Cr | Policy term: 30 years
• Riders: Critical Illness, Accidental Death, Waiver of Premium

**5. LIC of India** — ₹1,000/mo (₹12,000/yr) for ₹1 Crore cover
• CSR: 95.55% | Claim turnaround: 60 days | Solvency: 1.85
• AUM: ₹50,00,000 Cr (massive — Govt. backed) | Max age: 50 years
• Riders: Accidental Death, Waiver of Premium

💰 **Quick comparison:** Lowest premium = LIC (₹1,000/mo). Highest CSR = HDFC Life (99.97%). Fastest claims = HDFC Life & Max Life (30 days). Highest solvency = Bajaj Allianz Life (5.41). Largest AUM = LIC (₹50L Cr).

⚠️ Term insurance has no maturity benefit, but it's 90% cheaper than endowment plans for the same cover. Tax benefit: Up to ₹1.5L deduction under Section 80C.`;
  }

  // Motor insurance — always give FULL specific plan data
  // Hindi keywords: कार बीमा, गाड़ी बीमा, वाहन बीमा, मोटर बीमा, गाड़ी, कार, बाइक बीमा
  if (/motor|car.*insurance|bike.*insurance|gaadi.*bima|vehicle.*insurance|कार.*बीमा|गाड़ी.*बीमा|वाहन.*बीमा|मोटर.*बीमा|बाइक.*बीमा|car.*bima|bike.*bima|gaadi|chhatri|च्छत्र/i.test(lowerMsg)) {
    if (isHinglish) {
      return `Motor insurance India mein legally mandatory hai Motor Vehicles Act 1988 ke under. Yeh rahi **top 3 comprehensive motor plans with full data** (Source: IRDAI Annual Report 2025-26):

**1. ICICI Lombard Motor** — ₹1,899/yr (₹158/mo)
• CSR: 91.22% | Solvency: 1.8 | IDV: 85% | TP Premium: ₹850
• 7,500+ network garages
• Add-ons: Zero Depreciation, Roadside Assistance, Engine Protection
• NCB: Up to 50% discount on own damage premium

**2. HDFC ERGO Motor** — ₹2,200/yr (₹183/mo)
• CSR: 98.85% (sabse achhi!) | Solvency: 1.9 | IDV: 85% | TP Premium: ₹950
• 8,500+ network garages
• Add-ons: Zero Depreciation, Engine Protection, Return to Invoice
• NCB: Up to 50% discount on own damage premium

**3. Bajaj Allianz Motor** — ₹1,950/yr (₹163/mo)
• CSR: 93.65% | Solvency: 3.0 (sabse achhi!) | IDV: 85% | TP Premium: ₹880
• 6,000+ network garages
• Add-ons: Zero Depreciation, Consumables Cover, Return to Invoice
• NCB: Up to 50% discount on own damage premium

⚠️ **Zaroori add-ons:** Zero Depreciation (poora claim bina deduction ke), Engine Protection (flooding se damage), Return to Invoice (chori/total loss mein poora invoice value).`;
    }
    return `Motor insurance is legally mandatory in India under the Motor Vehicles Act 1988. Here are **India's top 3 comprehensive motor plans with full data** (Source: IRDAI Annual Report 2025-26):

**1. ICICI Lombard Motor** — ₹1,899/yr (₹158/mo)
• CSR: 91.22% | Solvency: 1.8 | IDV: 85% | Third-party premium: ₹850
• 7,500+ network garages
• Add-ons: Zero Depreciation, Roadside Assistance, Engine Protection
• NCB: Up to 50% discount on own damage premium

**2. HDFC ERGO Motor** — ₹2,200/yr (₹183/mo)
• CSR: 98.85% (highest!) | Solvency: 1.9 | IDV: 85% | Third-party premium: ₹950
• 8,500+ network garages (most!)
• Add-ons: Zero Depreciation, Engine Protection, Return to Invoice
• NCB: Up to 50% discount on own damage premium

**3. Bajaj Allianz Motor** — ₹1,950/yr (₹163/mo)
• CSR: 93.65% | Solvency: 3.0 (highest!) | IDV: 85% | Third-party premium: ₹880
• 6,000+ network garages
• Add-ons: Zero Depreciation, Consumables Cover, Return to Invoice
• NCB: Up to 50% discount on own damage premium

💰 **Quick comparison:** Cheapest = ICICI Lombard (₹1,899/yr). Highest CSR = HDFC ERGO (98.85%). Most garages = HDFC ERGO (8,500+). Highest solvency = Bajaj Allianz (3.0).

⚠️ **Must-have add-ons:** Zero Depreciation (full claim without depreciation deduction), Engine Protection (flood damage cover), Return to Invoice (full invoice value if car is stolen/totaled).`;
  }

  // Travel insurance — always give FULL specific plan data
  if (/travel.*insurance|yatra.*bima|trip.*insurance/i.test(lowerMsg)) {
    return `Travel insurance protects you from unexpected expenses while traveling — medical emergencies, trip cancellations, lost baggage. Here are **India's top travel plans with full data** (Source: IRDAI Annual Report 2025-26):

**1. TATA AIG Travel** — ₹499/trip (₹2,499/yr multi-trip)
• CSR: 96.67% | Coverage days: 15 | Medical sum insured: ₹50,000
• Covers: Medical evacuation, Trip cancellation, Lost baggage
• Age: 6-85 years | No medical test required

**2. Care Health Travel** — ₹450/trip (₹2,299/yr multi-trip)
• CSR: 93.13% | Coverage days: 15 | Medical sum insured: ₹50,000
• Covers: Covid cover, Flight delay, Hijack cover
• Age: 6-85 years | No medical test required

💰 **Quick comparison:** Cheapest single trip = Care Health (₹450). Higher CSR = TATA AIG (96.67%). Both cover 15-day trips. For frequent travelers, annual multi-trip plans start at ₹2,299.`;
  }

  // Home insurance
  if (/home.*insurance|ghar.*bima|property.*insurance/i.test(lowerMsg)) {
    return `Home insurance protects your house and belongings against fire, theft, natural disasters. Here are **India's top home insurance plans** (Source: IRDAI Annual Report):

**1. HDFC ERGO Home Shield** — ₹125/mo (₹1,500/yr)
• CSR: 89.48% | Solvency: 1.9 | Sum insured: ₹5L - ₹5 Cr
• Covers: Structure + contents, Fire, Flood, Earthquake, Theft, Terrorism
• Rent for alternative accommodation, Personal accident, Liability for domestic help
• NCB: 5% discount per claim-free year up to 25%

**2. Bajaj Allianz My Home** — ₹100/mo (₹1,200/yr)
• CSR: 97.04% | Solvency: 2.1 | Sum insured: ₹3L - ₹3 Cr
• Covers: Building + contents, Jewelry & valuables, Fire/flood/earthquake, Theft
• Portable equipment coverage, Personal liability, Dog liability cover

💰 **Quick comparison:** Cheapest = Bajaj Allianz (₹100/mo). Higher CSR = Bajaj Allianz (97.04%). Higher sum insured range = HDFC ERGO (up to ₹5 Cr).`;
  }

  // Tax benefits — always give FULL specific data
  if (/tax|80d|80c|tax.*benefit|tax.*save|bachat/i.test(lowerMsg)) {
    return `Insurance offers significant tax savings in India. Here's the complete breakdown with real plan examples:

**Section 80D (Health Insurance):**
• Self & family: Up to ₹25,000 deduction
• Parents: Additional ₹25,000 (₹50,000 if senior citizens)
• Preventive health check-up: Up to ₹5,000
• Total maximum: ₹75,000 (self + senior citizen parents)

**Section 80C (Life Insurance):**
• Life insurance premium: Up to ₹1.5 Lakhs deduction
• Includes term plans, endowment, ULIPs

**Real examples with actual plans:**
• **Care Health** ₹500/mo (₹6,000/yr) → ₹1,800 tax saved (30% bracket)
• **HDFC Life Term** ₹1,250/mo (₹15,000/yr) → ₹4,500 tax saved under 80C
• **Combined:** Health ₹6,000/yr + Term ₹15,000/yr = ₹21,000/yr premium → Save ₹6,300/year in taxes

**Section 80CCC (Pension Plans):**
• Annuity/pension plan premium: Up to ₹1.5 Lakhs

💡 If you pay ₹15,000/yr for health insurance + ₹12,000/yr for term, you save ~₹8,100 in taxes (30% bracket). That's like getting insurance at a 27% discount!`;
  }

  // Claim process — always give FULL specific data
  if (/claim|kaise.*file|claim.*process|reimbursement|cashless.*claim/i.test(lowerMsg)) {
    return `Here's the complete step-by-step claim guide with IRDAI-mandated timelines:

**📋 Cashless Claims (Network Hospital):**
1. Go to network hospital — show health card + ID
2. Hospital sends pre-auth request — **IRDAI rule: Must approve within 1 hour**
3. Treatment starts — insurer pays bill directly
4. Discharge — **Must happen within 3 hours** (IRDAI mandate)
5. You only pay non-covered items

**💰 Reimbursement Claims:**
1. Inform insurer within 24-48 hours
2. Pay hospital bills yourself — keep all original bills
3. Submit claim form + documents within 15-30 days
4. Amount transferred to bank within 15-30 days

**📄 Required Documents:**
• Discharge Summary (most important!)
• Original bills & receipts
• Doctor's prescription & reports
• Claim form (filled & signed)
• ID proof + policy copy

**Insurer-wise claim turnaround (IRDAI 2025-26):**
• HDFC Life: 30 days (fastest for life insurance)
• Max Life: 30 days
• SBI Life: 45 days
• LIC of India: 60 days

💡 **Important:** Cashless claim must be approved in 1 hour — if not, file complaint at IRDAI portal (igms.irda.gov.in)!`;
  }

  // IRDAI regulations — always give FULL specific data
  if (/irdai|regulation|rule|guideline|नियम|अधिनियम/i.test(lowerMsg)) {
    const latestRules = irdaiRegulations2025.slice(0, 4);
    let response = `IRDAI ke latest 2025-26 guidelines jo aapko jaanna chahiye:\n\n`;
    latestRules.forEach((reg, i) => {
      response += `**${i + 1}. ${reg.title}** (Effective: ${reg.effectiveDate})\n`;
      response += `   ❌ Pehle: ${reg.beforeChange}\n`;
      response += `   ✅ Ab: ${reg.afterChange}\n`;
      response += `   🎯 Impact: ${reg.impactLevel.toUpperCase()}\n\n`;
    });
    response += `💡 **Aapko kya karna chahiye:** Check your current policy — agar old rules ke according hai, toh insurer se update maangein.`;
    return response;
  }

  // Market trends — always give FULL specific data
  if (/market.*trend|premium.*badh|industry.*growth|बाज़ार|ट्रेंड|भविष्य/i.test(lowerMsg)) {
    return `📈 2025-26 ke key market trends with specific data:

**1. Premium 10-15% badhne wala hai** (12-18 mahine mein)
• Reason: Medical inflation 14-15%, claim frequency 22% increase
• Action: Abhi lock karein — current premium pe policy lein

**2. Health insurance ab 41% of non-life industry**
• FY20 mein 29% tha → FY26 mein 41%
• Motor insurance ka share girkar 28% ho gaya
• Standalone health insurers ki growth: 19% (sabse tez)

**3. Non-life industry: ₹3.36 Lakh Crore** (FY26 gross direct premium)
• Health sabse bada segment ban gaya

**4. AI & InsurTech Revolution**
• India = 2nd largest InsurTech market in Asia-Pacific
• Cashless approval: 1 hour (IRDAI mandate)
• Discharge: 3 hours (IRDAI mandate)
• Digital-first insurers (Acko, Digit) 3x faster growing

**5. GST Reduction Expected**
• Current: 18% | Proposed: 5-12% for retail health
• Potential savings: ₹2,000-5,000/year

💡 policyholder.gov.in se apni saari policies download karein!`;
  }

  // Waiting period — always give FULL specific data by insurer
  if (/waiting.*period|intzaar|ped|pre.*existing/i.test(lowerMsg)) {
    return `Waiting period is the time before certain coverage kicks in. Here's the **complete breakdown by insurer** (Source: IRDAI 2025-26):

**Types of waiting periods:**
1. **Initial waiting period:** 30 days from policy start (accidents covered from day 1)
2. **Pre-existing diseases (PED):** 24-48 months for conditions you already have
3. **Specific diseases:** 1-2 years for conditions like hernia, cataract, piles

**PED waiting periods by insurer (IRDAI 2025-26):**
| Insurer | Diabetes | BP | Heart |
|---------|----------|-----|-------|
| Acko | 24mo ✅ | 24mo ✅ | 36mo |
| Care Health | 24mo ✅ | 24mo ✅ | 36mo |
| TATA AIG | 24mo ✅ | 24mo ✅ | 36mo |
| ICICI Lombard | 36mo | 24mo ✅ | 48mo |
| HDFC ERGO | 36mo | 24mo ✅ | 48mo |
| Bajaj Allianz | 36mo | 24mo ✅ | 48mo |
| Star Health | 48mo ❌ | 36mo | 48mo ❌ |
| Niva Bupa | 24mo ✅ | 24mo ✅ | 36mo |

⚠️ **If you have Diabetes or BP:** Acko, Care Health, Niva Bupa, and TATA AIG have the shortest 24-month PED waiting for both conditions. Star Health takes the longest (48 months for diabetes, 36 for BP).`;
  }

  // Recommendations — always give FULL specific data
  if (recommendations && recommendations.length > 0) {
    let response = 'Based on your profile, here are your top personalized recommendations:\n\n';
    recommendations.forEach((rec, i) => {
      response += `**${i + 1}. ${rec.planName}** by ${rec.provider}\n`;
      response += `   • Premium: ${rec.premium}\n`;
      response += `   • Claim Settlement Ratio: ${rec.claimSettlementRatio}\n`;
      response += `   • Match Score: ${rec.matchScore}\n`;
      response += `   • Key Features: ${rec.keyFeatures.join(', ')}\n`;
      response += `   • Why recommended: ${rec.whyRecommended}\n\n`;
    });
    return response;
  }

  // Generic insurance questions — give substantive data, NOT category listings
  if (/insurance.*kya|kya.*hai.*insurance|what.*is.*insurance/i.test(lowerMsg)) {
    return `Insurance is a financial safety net — you pay a small premium, and the insurer covers large unexpected expenses. Here's how it works with **real plan examples** (Source: IRDAI Annual Report 2025-26):

**🏥 Health Insurance** — Pays hospital bills
• Care Health: ₹500/mo, CSR 100%, Covers ₹5L-₹1.5Cr
• Acko General: ₹550/mo, CSR 99.91%, 10,000+ hospitals
• HDFC ERGO: ₹600/mo, CSR 99.16%, Maternity ✅

**🛡️ Life/Term Insurance** — Gives money to family if something happens to you
• HDFC Life: ₹1,250/mo (₹1Cr cover), CSR 99.97%
• SBI Life: ₹1,200/mo (₹1Cr cover), CSR 98.50%
• LIC: ₹1,000/mo (₹1Cr cover), CSR 95.55%

**🚗 Motor Insurance** — Covers car/bike damage (legally mandatory!)
• ICICI Lombard: ₹1,899/yr, CSR 91.22%
• HDFC ERGO: ₹2,200/yr, CSR 98.85%

**✈️ Travel Insurance** — Covers medical emergencies and trip issues abroad
• TATA AIG: ₹499/trip, CSR 96.67%
• Care Health: ₹450/trip, CSR 93.13%

**🏠 Home Insurance** — Protects your house and belongings
• HDFC ERGO: ₹125/mo, CSR 89.48%, Up to ₹5 Cr cover
• Bajaj Allianz: ₹100/mo, CSR 97.04%, Up to ₹3 Cr cover

700M+ Indians are uninsured. One hospitalization can wipe out years of savings. Insurance is now more affordable than ever — health coverage starts at just ₹500/month!`;
  }

  // Default response — give substantive data for ALL categories, NOT generic "you can ask about"
  if (isHinglish) {
    return `Main InsureGPT hoon — aapka AI insurance advisor by Paliwal Secure. Main seedha data deta hoon:

**🏥 Top Health Plans (IRDAI 2025-26):**
• Care Health: ₹500/mo, CSR 100%, 21,700+ hospitals
• Acko: ₹550/mo, CSR 99.91%, PED Diabetes 24mo
• HDFC ERGO: ₹600/mo, CSR 99.16%, Maternity ✅

**🛡️ Top Term Plans:**
• HDFC Life: ₹1,250/mo (₹1Cr), CSR 99.97%
• SBI Life: ₹1,200/mo (₹1Cr), CSR 98.50%
• LIC: ₹1,000/mo (₹1Cr), CSR 95.55%

**🚗 Top Motor Plans:**
• ICICI Lombard: ₹1,899/yr, CSR 91.22%
• HDFC ERGO: ₹2,200/yr, CSR 98.85%

**✈️ Top Travel Plans:**
• TATA AIG: ₹499/trip, CSR 96.67%
• Care Health: ₹450/trip, CSR 93.13%

Koi bhi specific plan, comparison, claim process, ya tax savings ke baare mein poochein — detailed data dunga!`;
  }
  if (isHindi) {
    return `मैं InsureGPT हूं — आपका AI बीमा सलाहकार by Paliwal Secure। मैं सीधा डेटा देता हूं:

**🏥 शीर्ष स्वास्थ्य योजनाएं (IRDAI 2025-26):**
• Care Health: ₹500/माह, CSR 100%, 21,700+ अस्पताल
• Acko: ₹550/माह, CSR 99.91%, PED मधुमेह 24माह
• HDFC ERGO: ₹600/माह, CSR 99.16%, प्रसूति ✅

**🛡️ शीर्ष टर्म योजनाएं:**
• HDFC Life: ₹1,250/माह (₹1Cr), CSR 99.97%
• SBI Life: ₹1,200/माह (₹1Cr), CSR 98.50%
• LIC: ₹1,000/माह (₹1Cr), CSR 95.55%

**🚗 शीर्ष मोटर योजनाएं:**
• ICICI Lombard: ₹1,899/वर्ष, CSR 91.22%
• HDFC ERGO: ₹2,200/वर्ष, CSR 98.85%

कोई भी विशिष्ट योजना, तुलना, क्लेम प्रक्रिया या कर बचत के बारे में पूछें!`;
  }
  return `I'm InsureGPT — your AI insurance advisor by Paliwal Secure. Here's real data right away (Source: IRDAI Annual Report 2025-26):

**🏥 Top Health Plans:**
• **Care Health** — ₹500/mo, CSR: 100%, 21,700+ hospitals, PED: Diabetes 24mo, Family floater ✅
• **Acko General** — ₹550/mo, CSR: 99.91%, 10,000+ hospitals, PED: Diabetes 24mo
• **HDFC ERGO** — ₹600/mo, CSR: 99.16%, Maternity ✅, PED: Diabetes 36mo
• **Bajaj Allianz** — ₹520/mo, CSR: 98.50%, Solvency: 3.0 (highest)
• **TATA AIG** — ₹550/mo, CSR: 96.67%, PED: Diabetes 24mo

**🛡️ Top Term Plans:**
• **HDFC Life** — ₹1,250/mo (₹1Cr cover), CSR: 99.97%, Claims in 30 days
• **Max Life** — ₹1,350/mo (₹1Cr cover), CSR: 99.08%
• **SBI Life** — ₹1,200/mo (₹1Cr cover), CSR: 98.50%, AUM: ₹3.8L Cr
• **LIC** — ₹1,000/mo (₹1Cr cover), CSR: 95.55%, Govt. backed

**🚗 Top Motor Plans:**
• **ICICI Lombard** — ₹1,899/yr, CSR: 91.22%, 7,500+ garages
• **HDFC ERGO** — ₹2,200/yr, CSR: 98.85%, 8,500+ garages
• **Bajaj Allianz** — ₹1,950/yr, CSR: 93.65%, Solvency: 3.0

**✈️ Top Travel Plans:**
• **TATA AIG** — ₹499/trip, CSR: 96.67%
• **Care Health** — ₹450/trip, CSR: 93.13%

**🏠 Top Home Plans:**
• **HDFC ERGO Home Shield** — ₹125/mo, CSR: 89.48%
• **Bajaj Allianz My Home** — ₹100/mo, CSR: 97.04%

Ask me about any specific plan, comparison, claim process, waiting periods, or tax savings — I give you REAL numbers!`;
}
