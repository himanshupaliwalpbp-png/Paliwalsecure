import { NextRequest, NextResponse } from 'next/server';
import { chatRateLimiter, getClientIp } from '@/lib/server-rate-limiter';
import { aiClaimAssessmentSchema, sanitizeString, validateInput } from '@/lib/validation';

export const maxDuration = 30;

// ── TypeScript response types ─────────────────────────────────────────────────
interface KeyFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface ClaimAssessment {
  approvalProbability: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  keyFactors: KeyFactor[];
  potentialIssues: string[];
  requiredDocuments: string[];
  filingSteps: string[];
  estimatedTimeline: string;
  tips: string[];
  aiRecommendation: string;
}

// ── System prompt for AI claim assessor ───────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert Indian insurance claim assessor with 20+ years of experience in the Indian insurance industry. You have deep knowledge of IRDAI (Insurance Regulatory and Development Authority of India) guidelines, claim settlement practices, and the Indian insurance ecosystem.

YOUR ROLE:
- Analyze insurance claim scenarios submitted by users
- Provide honest, data-driven assessments of claim approval probability
- Never give false hope — be transparent about risks and potential rejections
- Use IRDAI guidelines, regulations, and claim settlement data to inform your analysis
- Cite relevant IRDAI rules when applicable (e.g., IRDAI (Health Insurance) Regulations 2016, IRDAI (Protection of Policyholders' Interests) Regulations 2017, etc.)

IMPORTANT RULES:
1. You MUST respond with valid JSON only — no markdown, no extra text, no explanation outside the JSON structure
2. All Hinglish explanations should be natural — mix Hindi and English the way Indians speak (e.g., "Claim file karein", "Documents ready rakhein")
3. Be brutally honest about claim probabilities — don't inflate numbers to please the user
4. Consider real-world Indian insurance practices: delays, documentation strictness, investigation for high-value claims
5. Factor in claim settlement ratios of Indian insurers when estimating probabilities
6. Reference IRDAI mandates like: cashless approval within 1 hour, discharge within 3 hours, claim intimation within 24-48 hours
7. For health claims: consider PED waiting periods (typically 24-48 months), network vs non-network hospitals, room rent limits, co-payment clauses
8. For motor claims: consider FIR requirements, surveyor inspection, depreciation deductions, IDV calculation
9. For life claims: consider nominee verification, cause of death investigation, policy contestability period (first 3 years), suicide clause
10. For travel claims: consider documentation from foreign hospitals, currency conversion, pre-approval requirements

ANALYSIS FRAMEWORK:
- Start with base probability from insurer CSR (if provided) or industry average
- Adjust for: claim-to-sum-insured ratio, policy age, PED status, waiting period, claim type specifics
- Consider: documentation completeness, investigation triggers, fraud markers, policy exclusions
- Factor in: hospital type (for health), FIR/survey (for motor), cause of death (for life), overseas documentation (for travel)

YOUR JSON RESPONSE MUST EXACTLY MATCH THIS STRUCTURE:
{
  "approvalProbability": <number 0-100>,
  "riskLevel": "<Low|Medium|High>",
  "keyFactors": [
    {
      "factor": "<factor name>",
      "impact": "<positive|negative|neutral>",
      "description": "<Hinglish explanation of this factor's impact>"
    }
  ],
  "potentialIssues": ["<Hinglish description of each potential issue>"],
  "requiredDocuments": ["<Specific documents needed for this claim type>"],
  "filingSteps": ["<Step-by-step claim filing guide in Hinglish>"],
  "estimatedTimeline": "<e.g., '15-30 days', '7-14 days'>",
  "tips": ["<Hinglish tips for smooth claim processing>"],
  "aiRecommendation": "<Overall recommendation in Hinglish — be specific, actionable, and honest>"
}

RISK LEVEL RULES:
- "Low" risk = approval probability >= 75% (claim likely to be approved with standard processing)
- "Medium" risk = approval probability 40-74% (claim may face some hurdles but has decent chance)
- "High" risk = approval probability < 40% (claim likely to face significant issues or rejection)

APPROVAL PROBABILITY GUIDELINES:
- Health claim at network hospital, no PED, low claim ratio: 85-95%
- Health claim with PED within waiting period: 15-35%
- Motor claim with proper FIR and survey: 75-90%
- Life claim within contestability period: 50-70%
- Life claim after contestability with clear nominee: 90-98%
- Travel claim with foreign documentation: 60-80%
- Any claim exceeding 80% of sum insured: reduce by 5-15%
- Policy less than 1 year old: reduce by 10-20% (early claim scrutiny)

REQUIRED DOCUMENTS — include type-specific documents:
Health: Discharge summary, original bills, doctor's prescription, medical reports, claim form, ID proof, policy copy, pre-approval letter (for cashless), NEFT/bank details
Motor: FIR copy, driving license, RC copy, survey report, repair estimate, original bills, claim form, policy copy, photos of damage
Life: Death certificate, policy document, nominee ID proof, claim form, bank details, medical records (if applicable), post-mortem report (if accidental), employer certificate (if group policy)
Travel: Passport copy, visa copy, boarding pass, foreign hospital bills (with translation), doctor's report, police report (if theft/loss), travel insurance policy, claim form, credit card statements

FILING STEPS — provide 5-8 steps in Hinglish, specific to the claim type.

TIPS — provide 4-6 actionable Hinglish tips specific to this claim scenario.

AI RECOMMENDATION — 2-4 sentences in Hinglish summarizing the overall outlook and the single most important action the user should take.`;

// ── Fallback static assessment generator ──────────────────────────────────────
function generateFallbackAssessment(data: {
  claimType: string;
  claimAmount: number;
  sumInsured: number;
  policyAge: string;
  hasPED: boolean;
  waitingPeriodCompleted: boolean;
  hospitalType?: string;
  insurerCsr?: number;
}): ClaimAssessment {
  const claimRatio = data.claimAmount / data.sumInsured;
  let probability = data.insurerCsr ?? 85;

  const keyFactors: KeyFactor[] = [];
  const potentialIssues: string[] = [];

  // Policy age factor
  const policyAgeMonths = parsePolicyAge(data.policyAge);
  if (policyAgeMonths < 12) {
    probability -= 15;
    keyFactors.push({ factor: 'Early Claim', impact: 'negative', description: 'Policy abhi nayi hai (1 saal se kam), isliye insurer zyada scrutiny karega. Early claims ko fraud suspicion se dekha jaata hai.' });
    potentialIssues.push('Kam policy age wale claims mein investigation zyada hoti hai — insurer ko lagta hai ki policy claim ke liye li gayi thi.');
  } else if (policyAgeMonths >= 36) {
    probability += 3;
    keyFactors.push({ factor: 'Mature Policy', impact: 'positive', description: 'Policy 3 saal se purani hai, yeh positive signal hai — contestability period complete ho chuki hai.' });
  } else {
    keyFactors.push({ factor: 'Policy Age', impact: 'neutral', description: 'Policy ki age theek hai — na zyada nayi na zyada purani.' });
  }

  // PED factors
  if (data.hasPED && !data.waitingPeriodCompleted) {
    probability -= 25;
    keyFactors.push({ factor: 'PED Within Waiting Period', impact: 'negative', description: 'Pre-existing disease hai aur waiting period complete nahi hui. IRDAI rules ke according PED ke liye 24-48 mahine ka waiting period mandatory hai.' });
    potentialIssues.push('PED waiting period complete nahi hone par claim reject hone ki 70%+ probability hai — IRDAI (Health Insurance) Regulations 2016 ke under yeh exclusion valid hai.');
  } else if (data.hasPED && data.waitingPeriodCompleted) {
    probability -= 5;
    keyFactors.push({ factor: 'PED — Waiting Period Completed', impact: 'neutral', description: 'PED hai lekin waiting period complete ho chuki hai. Ab claim eligible hai lekin insurer dhyan se review karega.' });
    potentialIssues.push('PED ke baad bhi insurer medical records verify karega — treatment related hone par kuch reduction ho sakti hai.');
  } else {
    keyFactors.push({ factor: 'No Pre-existing Disease', impact: 'positive', description: 'Koi pre-existing disease nahi hai — yeh claim approval ke liye bahut positive hai.' });
  }

  // Claim-to-sum-insured ratio
  if (claimRatio > 0.8) {
    probability -= 10;
    keyFactors.push({ factor: 'High Claim-to-Cover Ratio', impact: 'negative', description: `Claim amount sum insured ke ${Math.round(claimRatio * 100)}% hai — high-value claims mein zyada investigation hoti hai.` });
    potentialIssues.push('High-value claims mein insurer surveyor/auditor appoint karta hai — isliye processing time badh jata hai.');
  } else if (claimRatio < 0.2) {
    probability += 2;
    keyFactors.push({ factor: 'Low Claim Ratio', impact: 'positive', description: 'Claim amount sum insured ka sirf ${Math.round(claimRatio * 100)}% hai — chhote claims generally easily approve hote hain.' });
  }

  // Hospital type (health)
  if (data.claimType === 'health') {
    if (data.hospitalType === 'network') {
      probability += 3;
      keyFactors.push({ factor: 'Network Hospital', impact: 'positive', description: 'Network hospital mein cashless claim hai — IRDAI rule ke according 1 ghante mein pre-approval aana chahiye. Yeh sabse smooth process hai.' });
    } else if (data.hospitalType === 'non-network') {
      probability -= 5;
      keyFactors.push({ factor: 'Non-Network Hospital', impact: 'negative', description: 'Non-network hospital mein reimbursement claim karni padegi — bills khud pay karne padenge aur baad mein reimbursement milega. Isme zyada documentation chahiye.' });
      potentialIssues.push('Non-network hospital mein room rent limit, co-payment, aur other deductions apply ho sakte hain jo claim amount kam kar denge.');
    }
  }

  // Claim type specific adjustments
  if (data.claimType === 'motor') {
    keyFactors.push({ factor: 'Motor Claim', impact: 'neutral', description: 'Motor claim mein FIR, surveyor inspection, aur depreciation calculation important hai. Third-party claims tribunal se hoti hain.' });
    potentialIssues.push('Motor claim mein depreciation deduction hoga — plastic parts 50%, metal parts 25-30%, fiberglass 30%. Zero Dep add-on hai toh bach jayega.');
  } else if (data.claimType === 'life') {
    keyFactors.push({ factor: 'Life Insurance Claim', impact: 'neutral', description: 'Life claim mein nominee verification aur cause of death investigation key hai. Contestability period (3 saal) ke andar claim mein zyada scrutiny hoti hai.' });
    potentialIssues.push('Agar policy 3 saal se kam purani hai toh insurer detailed investigation karega — medical history verify hogi.');
  } else if (data.claimType === 'travel') {
    keyFactors.push({ factor: 'Travel Claim', impact: 'neutral', description: 'Travel claim mein foreign documentation aur currency conversion important hai. Pre-approval ke bina treatment kiya toh claim amount pe limit lag sakti hai.' });
    potentialIssues.push('Foreign hospital bills ka Hindi/English translation chahiye — originals ke saath certified translation mandatory hai.');
  }

  probability = Math.max(5, Math.min(98, Math.round(probability)));

  const riskLevel: 'Low' | 'Medium' | 'High' = probability >= 75 ? 'Low' : probability >= 40 ? 'Medium' : 'High';

  // Required documents by type
  const requiredDocumentsByType: Record<string, string[]> = {
    health: [
      'Discharge Summary (original — sabse important document)',
      'Original hospital bills aur payment receipts',
      "Doctor's prescription aur consultation notes",
      'Medical reports (blood test, X-ray, MRI, etc.)',
      'Duly filled claim form (insurer ki website se download)',
      'Health card / Policy document copy',
      'Pre-approval letter (cashless claim ke liye)',
      'ID proof (Aadhaar / PAN / Passport)',
      'Cancelled cheque ya bank details (NEFT ke liye)',
      'Pharmacy bills with doctor prescription',
    ],
    motor: [
      'FIR Copy (police se registered)',
      'Driving License copy (valid hona chahiye)',
      'Registration Certificate (RC) copy',
      'Insurance Policy document',
      'Surveyor report (insurer dwara appoint)',
      'Repair estimate from authorized garage',
      'Original repair bills aur payment receipts',
      'Duly filled claim form',
      'Photos of vehicle damage (multiple angles)',
      'No Trace Certificate (theft case mein police se)',
    ],
    life: [
      'Death Certificate (municipal corporation se original)',
      'Policy document (original)',
      'Nominee ki ID proof aur address proof',
      'Claim form (Form A — duly filled)',
      'Bank details / Cancelled cheque (nominee ka)',
      'Age proof of life assured',
      'Medical records (last illness ke liye)',
      'Post-mortem report (accidental death mein)',
      'Employer certificate (group policy mein)',
      'Cremation/Burial receipt',
    ],
    travel: [
      'Passport copy (with exit/entry stamps)',
      'Visa copy',
      'Boarding pass / Flight tickets',
      'Original foreign hospital bills',
      'English translation of foreign bills (certified)',
      "Doctor's report / Discharge summary",
      'Police report (theft/loss ke liye)',
      'Travel insurance policy document',
      'Claim form (duly filled)',
      'Credit card statements (payment proof)',
    ],
  };

  // Filing steps by type (Hinglish)
  const filingStepsByType: Record<string, string[]> = {
    health: [
      'Sabse pehle insurer ko intimate karein — 24-48 ghante ke andar call ya email karein (IRDAI mandate).',
      'Network hospital mein hain toh health card dikhayein aur pre-approval karwayein — 1 ghante mein approval aana chahiye.',
      'Non-network hospital mein bills khud pay karein aur original bills safe rakhein.',
      'Discharge ke baad 15-30 din ke andar saari documents insurer ko submit karein.',
      'Claim form carefully fill karein — saari details accurate honi chahiye.',
      'Claim reference number note karke rakhein — tracking ke liye.',
      'Agar 15 din mein koi response nahi aaya toh IRDAI portal (igms.irda.gov.in) pe complaint karein.',
    ],
    motor: [
      'Accident ke baad turant police mein FIR register karwayein — bina FIR claim nahi hoti.',
      'Insurer ko 48 ghante ke andar inform karein — call ya app se.',
      'Vehicle ko insurer ke authorized surveyor ko dikhayein — bina survey repair mat karwayein.',
      'Surveyor inspection ke baad authorized garage mein repair karwayein.',
      'Saari original bills, FIR copy, RC, DL, aur photos insurer ko submit karein.',
      'Claim form fill karein aur repair estimate attach karein.',
      'Tracking number lein aur regularly follow-up karein.',
    ],
    life: [
      'Sabse pehle insurer ko death ki information dein — call centre ya branch jaakar.',
      'Claim form (Form A) lein aur carefully fill karein — nominee ko sign karna hai.',
      'Death Certificate municipal corporation se original lein — yeh sabse important document hai.',
      'Saari documents insurer ke branch office mein submit karein — receipt lein.',
      'Agar policy 3 saal se kam purani hai toh investigation hoga — cooperate karein.',
      'Claim amount generally 30 din mein nominee ke bank account mein transfer hota hai.',
      'Agar delay ho toh IRDAI grievance portal pe complaint karein.',
    ],
    travel: [
      'Emergency mein pehle insurer ki helpline call karein — pre-approval lein agar possible ho.',
      'Foreign hospital mein treatment ke baad saari original bills aur reports collect karein.',
      'Police report file karein agar theft/loss/baggage issue hai.',
      'India wapas aakar 30 din ke andar claim submit karein.',
      'Foreign bills ka certified English translation karwayein — yeh mandatory hai.',
      'Saari documents — passport, visa, boarding pass, bills — insurer ko submit karein.',
      'Claim tracking number lein aur follow-up karein.',
    ],
  };

  // Tips by type (Hinglish)
  const tipsByType: Record<string, string[]> = {
    health: [
      'Discharge summary sabse important document hai — iske bina claim reject ho sakta hai. Hamesha original lein.',
      'Room rent limit check karein — agar limit se zyada ka room liya toh difference khud pay karna padega.',
      'Pre-approval leke treatment start karein — baad mein rejection ka risk kam hota hai.',
      'Co-payment clause check karein — kuch policies mein 10-20% co-pay hota hai.',
      'Cashless claim mein 3 ghante ke andar discharge hona chahiye — IRDAI mandate hai.',
      'No Claim Bonus (NCB) bachane ke liye chhote claims khud pay karein — NCB next year premium kam karta hai.',
    ],
    motor: [
      'Zero Depreciation add-on hai toh full claim milega — bina iske plastic parts pe 50% depreciation kategi.',
      'FIR bina delay ke karwayein — late FIR se claim reject ho sakti hai.',
      'Surveyor aane se pehle vehicle ko repair mat karwayein — reject ho jayega.',
      'Engine Protect add-on hai toh flooding damage bhi cover hoga — otherwise excluded hai.',
      'NCB bachane ke liye small repairs khud karein — 20% se kam claims se NCB safe rehta hai.',
      'Return to Invoice add-on hai toh total loss mein full invoice value milega.',
    ],
    life: [
      'Nominee details hamesha updated rakhein — galat nominee se claim mein delay hota hai.',
      'Policy document safe jagah rakhein — family members ko bata dein ki policy kahan hai.',
      'Suicide clause: Pehle 12 months mein suicide se death pe claim nahi hota (IRDAI standard).',
      'Accidental death benefit rider hai toh additional amount milega — death certificate mein cause clear hona chahiye.',
      'Multiple policies hain toh sabse claim kar sakte hain — life insurance mein contribution principle nahi hota.',
      'Maturity benefit wali policy (endowment/ULIP) mein survival benefit bhi claim karein.',
    ],
    travel: [
      'Travel karne se pehle insurer ki helpline number save karein — emergency mein turant call karein.',
      'Pre-existing conditions travel insurance mein generally excluded hain — check karein.',
      'Adventure sports cover nahi hote standard policy mein — separate add-on chahiye.',
      'Baggage delay ke liye 24 ghante ka wait karna padta hai pehle claim file karne se.',
      'Medical emergency mein pre-approval lein — bina approval ke treatment pe claim limit lag sakti hai.',
      'Trip cancellation claim ke liye reason valid hona chahiye — medical emergency, death in family, etc.',
    ],
  };

  // Estimated timeline by type and risk
  const timelineByType: Record<string, string> = {
    health: probability >= 75 ? '15-30 days' : probability >= 40 ? '30-45 days (investigation likely)' : '45-90 days (detailed investigation)',
    motor: probability >= 75 ? '7-21 days' : probability >= 40 ? '21-45 days (survey + investigation)' : '30-60 days (dispute possible)',
    life: probability >= 75 ? '15-30 days' : probability >= 40 ? '30-60 days (investigation period)' : '60-90 days (detailed probe)',
    travel: probability >= 75 ? '15-30 days' : probability >= 40 ? '30-60 days (document verification)' : '45-90 days (foreign verification)',
  };

  // AI recommendation based on type and risk
  let aiRecommendation = '';
  if (probability >= 75) {
    aiRecommendation = `Aapka claim strong hai — probability ${probability}% hai. Saari documents properly collect karein aur time pe submit karein. ${data.hasPED ? 'PED waiting period complete hai, isliye confident rahen lekin medical records ready rakhein.' : 'Koi PED nahi hai toh process smooth rahega.'} Cashless option hai toh use karein — sabse fast aur hassle-free process hai.`;
  } else if (probability >= 40) {
    aiRecommendation = `Aapka claim mein kuch challenges hain — probability ${probability}% hai. Sabse important hai ki saari documentation complete aur accurate ho. ${data.hasPED && !data.waitingPeriodCompleted ? 'PED waiting period complete nahi hai — yeh sabse bada risk factor hai. Medical records aur doctor certificate se link break karne ki koshish karein.' : 'Insurer investigation kar sakta hai, isliye saari original bills aur medical reports ready rakhein.'} IRDAI ke complaint portal ka use karein agar unreasonable delay ho.`;
  } else {
    aiRecommendation = `Aapka claim mein significant risk hai — probability sirf ${probability}% hai. ${data.hasPED && !data.waitingPeriodCompleted ? 'PED waiting period complete nahi hone ki wajah se rejection ki high probability hai. IRDAI rules ke according yeh valid exclusion hai — legal challenge karna mushkil hoga.' : 'Multiple negative factors hain — documentation mein koi gap na chhoda jaye, yeh ensure karein.'} Agar claim reject hota hai toh 30 din ke andar insurer se written rejection maangein aur IRDAI ombudsman se appeal karein.`;
  }

  return {
    approvalProbability: probability,
    riskLevel,
    keyFactors,
    potentialIssues,
    requiredDocuments: requiredDocumentsByType[data.claimType] || requiredDocumentsByType.health,
    filingSteps: filingStepsByType[data.claimType] || filingStepsByType.health,
    estimatedTimeline: timelineByType[data.claimType] || timelineByType.health,
    tips: tipsByType[data.claimType] || tipsByType.health,
    aiRecommendation,
  };
}

// ── Parse policy age string to months ────────────────────────────────────────
function parsePolicyAge(policyAge: string): number {
  const lower = policyAge.toLowerCase().trim();
  const yearMatch = lower.match(/(\d+)\s*ye?a?r/);
  const monthMatch = lower.match(/(\d+)\s*mo?n?th/);

  let months = 0;
  if (yearMatch) months += parseInt(yearMatch[1], 10) * 12;
  if (monthMatch) months += parseInt(monthMatch[1], 10);

  // If no pattern matched, try to parse as a single number (assume years)
  if (months === 0) {
    const numMatch = lower.match(/(\d+)/);
    if (numMatch) months = parseInt(numMatch[1], 10) * 12;
  }

  return months;
}

// ── POST Handler ──────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // ── Rate limiting: 10 assessments per minute per IP ──────────────────
    const rateLimit = chatRateLimiter.check(clientIp, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Maximum 10 claim assessments per minute. Please try again shortly.',
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
    const validation = validateInput(aiClaimAssessmentSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] },
        {
          status: 400,
          headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
        }
      );
    }

    const { claimType, claimAmount, sumInsured, policyAge, hasPED, waitingPeriodCompleted, hospitalType, description, insurerCsr } = validation.data;

    // ── Sanitize description ─────────────────────────────────────────────
    const sanitizedDescription = sanitizeString(description);

    // ── Build AI prompt with claim details ────────────────────────────────
    const claimDetails = [
      `Claim Type: ${claimType.toUpperCase()}`,
      `Claim Amount: ₹${claimAmount.toLocaleString('en-IN')}`,
      `Sum Insured: ₹${sumInsured.toLocaleString('en-IN')}`,
      `Claim-to-Sum-Insured Ratio: ${((claimAmount / sumInsured) * 100).toFixed(1)}%`,
      `Policy Age: ${policyAge}`,
      `Pre-existing Disease (PED): ${hasPED ? 'Yes' : 'No'}`,
      `Waiting Period Completed: ${waitingPeriodCompleted ? 'Yes' : 'No'}`,
      hospitalType ? `Hospital Type: ${hospitalType}` : null,
      insurerCsr ? `Insurer Claim Settlement Ratio: ${insurerCsr}%` : null,
      `Claim Description: ${sanitizedDescription}`,
    ].filter(Boolean).join('\n');

    // ── Try AI assessment with z-ai-web-dev-sdk ──────────────────────────
    let assessment: ClaimAssessment | null = null;

    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const zai = await ZAI.create();

      const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [
        {
          role: 'assistant',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Please analyze the following Indian insurance claim scenario and provide a detailed assessment:\n\n${claimDetails}\n\nProvide your response as structured JSON matching the exact format specified in your instructions. Be honest, thorough, and include Hinglish explanations.`,
        },
      ];

      // Use thinking mode for comprehensive claim analysis
      const completionPromise = zai.chat.completions.create({
        messages,
        thinking: { type: 'enabled' },
      });

      // Race with 20-second timeout (thinking mode needs more time)
      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 20000);
      });

      const completion = await Promise.race([completionPromise, timeoutPromise]);

      if (completion && completion.choices?.[0]?.message?.content) {
        const rawContent = completion.choices[0].message.content.trim();

        // Try to extract JSON from the response (handle markdown code blocks)
        let jsonStr = rawContent;
        const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          jsonStr = jsonMatch[1].trim();
        }

        // Try to find JSON object in the response
        const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          jsonStr = objectMatch[0];
        }

        const parsed = JSON.parse(jsonStr);

        // Validate and normalize the parsed response
        assessment = {
          approvalProbability: typeof parsed.approvalProbability === 'number'
            ? Math.max(0, Math.min(100, Math.round(parsed.approvalProbability)))
            : 50,
          riskLevel: ['Low', 'Medium', 'High'].includes(parsed.riskLevel)
            ? parsed.riskLevel
            : (parsed.approvalProbability >= 75 ? 'Low' : parsed.approvalProbability >= 40 ? 'Medium' : 'High'),
          keyFactors: Array.isArray(parsed.keyFactors)
            ? parsed.keyFactors.slice(0, 10).map((f: Record<string, unknown>) => ({
                factor: String(f.factor || 'Unknown Factor'),
                impact: ['positive', 'negative', 'neutral'].includes(f.impact as string)
                  ? (f.impact as 'positive' | 'negative' | 'neutral')
                  : 'neutral',
                description: String(f.description || ''),
              }))
            : [],
          potentialIssues: Array.isArray(parsed.potentialIssues)
            ? parsed.potentialIssues.slice(0, 8).map((s: unknown) => String(s))
            : [],
          requiredDocuments: Array.isArray(parsed.requiredDocuments)
            ? parsed.requiredDocuments.slice(0, 15).map((s: unknown) => String(s))
            : [],
          filingSteps: Array.isArray(parsed.filingSteps)
            ? parsed.filingSteps.slice(0, 10).map((s: unknown) => String(s))
            : [],
          estimatedTimeline: String(parsed.estimatedTimeline || '15-30 days'),
          tips: Array.isArray(parsed.tips)
            ? parsed.tips.slice(0, 8).map((s: unknown) => String(s))
            : [],
          aiRecommendation: String(parsed.aiRecommendation || ''),
        };
      }
    } catch (aiError) {
      console.error('AI Claim Assessment LLM Error:', aiError);
      // Fall through to static fallback
    }

    // ── Fallback to static assessment if AI fails ────────────────────────
    if (!assessment) {
      assessment = generateFallbackAssessment({
        claimType,
        claimAmount,
        sumInsured,
        policyAge,
        hasPED,
        waitingPeriodCompleted,
        hospitalType,
        insurerCsr,
      });
    }

    return NextResponse.json(
      {
        success: true,
        assessment,
      },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error('AI Claim Assessment API error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong while processing your claim assessment. Please try again.' },
      { status: 500 }
    );
  }
}
