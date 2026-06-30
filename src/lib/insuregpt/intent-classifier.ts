// ============================================================================
// InsureGPT — Intent Classifier
// ============================================================================
// Pre-classifies user's message into one of N intents BEFORE calling LLM.
// This lets us:
//   1. Skip tool calls for simple questions (faster, cheaper)
//   2. Choose the right tool automatically
//   3. Set intent-specific temperature/prompt
// ============================================================================

import { INTENT_HINTS, type IntentType } from './system-prompt';

// ---------------------------------------------------------------------------
// Exported Intent Type
// ---------------------------------------------------------------------------
export type { IntentType } from './system-prompt';

export interface IntentResult {
  /** Primary intent */
  intent: IntentType;
  /** Confidence 0-1 */
  confidence: number;
  /** Secondary intent if mixed */
  secondaryIntent?: IntentType;
  /** Detected insurance category */
  category?: 'health' | 'life' | 'motor' | 'travel' | 'home' | 'general';
  /** Whether user is asking in Hinglish / Hindi / English */
  detectedLanguage: 'hing' | 'hi' | 'en';
  /** Suggested tools to call (LLM can override) */
  suggestedTools: string[];
  /** Whether LLM should be invoked at all (vs. pure template) */
  useLLM: boolean;
}

// ---------------------------------------------------------------------------
// Language detection (Hinglish / Hindi / English)
// ---------------------------------------------------------------------------
export function detectLanguage(message: string): 'hing' | 'hi' | 'en' {
  const hasDevanagari = /[\u0900-\u097F]/.test(message);
  const hasLatin = /[a-zA-Z]/.test(message);

  if (hasDevanagari && hasLatin) return 'hing';
  if (hasDevanagari) return 'hi';
  if (hasLatin) {
    // If pure English but has Hindi-style grammar/words → Hinglish
    const hinglishIndicators = /\b(aap|hai|hoon|kya|kyun|kaise|kaha|kuch|bhi|toh|hi|na|mat|kar|karo|lena|lete|chahiye|sahi|galat|achha|bahut|thoda|zyada|kam|bhi)\b/i;
    if (hinglishIndicators.test(message)) return 'hing';
    return 'en';
  }
  return 'hing'; // default
}

// ---------------------------------------------------------------------------
// Category detection (Health / Life / Motor / Travel / Home)
// ---------------------------------------------------------------------------
const CATEGORY_PATTERNS: Record<NonNullable<IntentResult['category']>, RegExp[]> = {
  health: [
    /\b(health|medical|hospital|disease|illness|surgery|cashless|sehat|swasthya|bima|aspat|rog|upchar)\b/i,
    /\b(diabetes|bp|blood\s*pressure|heart|cancer|kidney|liver|asthma)\b/i,
  ],
  life: [
    /\b(life|jivan|jeevan|term|endowment|death|sum\s*assured|maturity|annuity|pension)\b/i,
    /\b(ulip|money\s*back)\b/i,
  ],
  motor: [
    /\b(car|bike|motor|vehicle|auto|gadi|gaadi|car\s*insurance|bike\s*insurance)\b/i,
    /\b(swift|wagonr|baleno|creta|nexon|pulsar|activa|royal\s*enfield|ktm)\b/i,
    /\b(zero\s*dep|idv|ncb|third\s*party|comprehensive|own\s*damage)\b/i,
  ],
  travel: [
    /\b(travel|trip|flight|visa|international|yatra|foreign|abroad)\b/i,
    /\b(schengen|usa\s*trip|europe\s*trip)\b/i,
  ],
  home: [
    /\b(home|house|property|ghar|makaan|fire|earthquake|theft|burglary)\b/i,
    /\b(structure|contents|valuable)\b/i,
  ],
  general: [],
};

export function detectCategory(message: string): NonNullable<IntentResult['category']> {
  const lower = message.toLowerCase();
  for (const [cat, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    if (cat === 'general') continue;
    if (patterns.some((p) => p.test(lower))) {
      return cat as NonNullable<IntentResult['category']>;
    }
  }
  return 'general';
}

// ---------------------------------------------------------------------------
// Intent classification
// ---------------------------------------------------------------------------
export function classifyIntent(message: string): IntentResult {
  const lower = message.toLowerCase().trim();
  const detectedLanguage = detectLanguage(message);
  const category = detectCategory(message);

  // Score each intent by counting keyword matches
  const scores: Record<IntentType, number> = {
    recommendation: 0,
    comparison: 0,
    claim: 0,
    tax: 0,
    regulation: 0,
    calculation: 0,
    general: 0,
  };

  for (const [intent, keywords] of Object.entries(INTENT_HINTS)) {
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lower)) {
        scores[intent as IntentType] += 1;
      }
    }
  }

  // "best"/"top" patterns also count as recommendation
  if (/\b(best|top|sahi|achha|recommend|suggest)\b/i.test(lower)) {
    scores.recommendation += 2;
  }
  // Comparison patterns
  if (/\bvs\.?|versus|compare|tulna|fark\s*kya|better\s*than/i.test(lower)) {
    scores.comparison += 3;
  }
  // "How much" patterns → calculation
  if (/\b(how\s*much|kitna|kitne|kitni|cost|price|rate|premium\s*kitna)\b/i.test(lower)) {
    scores.calculation += 2;
  }
  // "How to" → general/claim
  if (/\b(kaise|how\s*to|process|step)\b/i.test(lower)) {
    if (/\b(claim|file|reimbursement|cashless)\b/i.test(lower)) {
      scores.claim += 3;
    } else {
      scores.general += 1;
    }
  }

  // Find top 2 intents
  const ranked = (Object.entries(scores) as Array<[IntentType, number]>)
    .sort((a, b) => b[1] - a[1]);

  const [topIntent, topScore] = ranked[0];
  const [secondIntent, secondScore] = ranked[1] ?? ['general', 0];

  // Confidence: topScore normalized
  const total = ranked.reduce((sum, [, s]) => sum + s, 0) || 1;
  const confidence = topScore / total;

  // If all scores are 0, default to general
  const finalIntent: IntentType = topScore === 0 ? 'general' : topIntent;
  const secondaryIntent: IntentType | undefined = secondScore > 0 ? secondIntent : undefined;

  // Suggested tools based on intent + category
  const suggestedTools: string[] = [];
  if (finalIntent === 'comparison' && category !== 'general') {
    suggestedTools.push('comparePlans');
  }
  if (finalIntent === 'calculation' && category !== 'general') {
    suggestedTools.push('calculatePremium');
  }
  if (finalIntent === 'recommendation' && category !== 'general') {
    suggestedTools.push('getPolicyDetails');
  }
  if (finalIntent === 'regulation') {
    suggestedTools.push('fetchIRDAIData');
  }

  // Greetings / thank-you / very short messages → no LLM needed
  const isGreeting = /^(hi|hello|hey|namaste|namaskar|pranaam|thanks|thank you|thx|ok|okay|cool|nice|great|bye|good\s*(morning|afternoon|evening|night))\b/i.test(lower);
  const useLLM = !isGreeting && lower.length > 2;

  return {
    intent: finalIntent,
    confidence,
    secondaryIntent,
    category,
    detectedLanguage,
    suggestedTools,
    useLLM,
  };
}

// ---------------------------------------------------------------------------
// Greeting responses (return instantly, no LLM call)
// ---------------------------------------------------------------------------
export function getGreetingResponse(language: 'hing' | 'hi' | 'en'): string {
  switch (language) {
    case 'hi':
      return `नमस्ते! 🙏 **InsureGPT** में आपका स्वागत है। मैं आपका AI बीमा सलाहकार हूं — **Paliwal Secure** (IRDAI POSP IP429834) द्वारा संचालित।

मैं आपकी मदद कर सकता हूं:
• 🏥 स्वास्थ्य बीमा (Health Insurance)
• 🛡️ जीवन/टर्म बीमा (Life/Term Insurance)
• 🚗 मोटर बीमा (Car/Bike Insurance)
• ✈️ यात्रा बीमा (Travel Insurance)
• 🏠 गृह बीमा (Home Insurance)
• 💰 कर बचत (Tax Savings — 80D, 80C)
• 📄 दावा प्रक्रिया (Claim Process)

कृपया अपना प्रश्न पूछें — मैं विशिष्ट योजनाएं, प्रीमियम और IRDAI डेटा के साथ उत्तर दूंगा!`;

    case 'en':
      return `Hello! 🙏 Welcome to **InsureGPT** — your AI insurance advisor by **Paliwal Secure** (IRDAI POSP IP429834).

I can help you with:
• 🏥 Health Insurance (family floater, senior citizen, disease-specific)
• 🛡️ Life/Term Insurance (₹1 Cr+ cover, return of premium)
• 🚗 Motor Insurance (car, bike, comprehensive, zero dep)
• ✈️ Travel Insurance (international, multi-trip)
• 🏠 Home Insurance (structure, contents)
• 💰 Tax Savings (Section 80D, 80C)
• 📄 Claim Process (cashless, reimbursement)

Ask me anything — I'll give you specific plans, real premiums (₹), and IRDAI-verified data!`;

    case 'hing':
    default:
      return `Namaste! 🙏 **InsureGPT** mein aapka swagat hai — aapka AI insurance advisor by **Paliwal Secure** (IRDAI POSP IP429834).

Main aapki madad kar sakta hu:
• 🏥 **Health Insurance** — family floater, senior citizen, diabetes/BP/heart
• 🛡️ **Life/Term Insurance** — ₹1 Cr+ cover, return of premium
• 🚗 **Motor Insurance** — car, bike, comprehensive, zero dep
• ✈️ **Travel Insurance** — international, multi-trip
• 🏠 **Home Insurance** — structure + contents
• 💰 **Tax Savings** — Section 80D (₹75k) + 80C (₹1.5L)
• 📄 **Claim Process** — cashless (1hr approval) + reimbursement

Apna sawaal puchiye — main specific plans, real premiums (₹), aur IRDAI-verified data ke saath jawab dunga! 🚀`;
  }
}
