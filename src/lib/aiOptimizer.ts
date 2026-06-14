/**
 * AI Overview Optimization Utilities — Paliwal Secure
 *
 * Google's AI Overview (formerly SGE / Search Generative Experience) now
 * answers user queries directly in search results. To be cited as a source,
 * our content must be structured for AI extraction.
 *
 * Optimization Strategy:
 * 1. Entity Extraction: Identify key entities (insurers, plans, CSR) in content
 * 2. Definition Format: Structure terms as "X is Y" — AI Overviews love definitions
 * 3. Structured Content: Use clear Q&A format with key points for easy extraction
 * 4. FAQ Schema: Generate FAQ schema alongside content for dual SERP presence
 * 5. Comprehensive Answers: AI prefers content that fully answers a question
 *
 * Key AI Overview Principles:
 * - Be the best answer, not just another answer
 * - Lead with a clear, concise definition
 * - Support with specific data points (CSR%, premium ranges)
 * - Include expert perspective (IRDAI-certified advisor)
 * - Structure with headers that match common queries
 *
 * @see https://developers.google.com/search/docs/appearance/ai-overviews
 */

// ============================================================================
// Entity Extraction
// ============================================================================

/**
 * Known Indian insurance entities for extraction.
 * Used by extractEntities() to identify insurer names, plan names,
 * and CSR numbers in text content.
 */
const KNOWN_INSURERS = [
  'HDFC ERGO',
  'Star Health',
  'Care Health',
  'Niva Bupa',
  'Acko',
  'ICICI Lombard',
  'New India Assurance',
  'United India Insurance',
  'SBI General',
  'Bajaj Allianz',
  'Max Bupa',
  'Religare',
  'Aditya Birla Health',
  'Digit Insurance',
  'Royal Sundaram',
  'Tata AIG',
  'Liberty General',
  'IFFCO Tokio',
  'Oriental Insurance',
  'National Insurance',
  'Magma HDI',
  'Shriram General',
  'Raheja QBE',
  'Zurich Kotak',
  'Navi General',
  'Zuno Insurance',
  'Go Digit',
]

const KNOWN_PLAN_PATTERNS = [
  /Optima\s+(Secure|Super|Restore|Plus)/i,
  /Family\s+(Health\s+)?Optima/i,
  /Young\s+Star/i,
  /Star\s+(Women|Health|Comprehensive)/i,
  /Compass/i,
  /Health\s+Companion/i,
  /Activ\s+(Health|Care|Fit)/i,
  /ReAssure/i,
  /iCan/i,
  /Super\s+(Saver|Medi)/i,
  /Arogya\s+(Sanjeevani|Premier|Plus)/i,
  /Corona\s+(Kavach|Rakshak)/i,
  /Saral\s+Jeevan/i,
  /Amrit/i,
  /Jeevan\s+(Anand|Labh|Umang)/i,
  /e-Term/i,
  /iSelect\s+Star/i,
  /Tech\s+Term/i,
  /Life\s+Shield/i,
  /Smart\s+Term/i,
  /Insta\s+(Secure|Safeguard)/i,
]

/**
 * Extracts named entities from insurance-related text.
 *
 * SEO Rationale:
 * - Google's NLP identifies entities to understand content context
 * - Mentioning specific insurers and plans signals topical depth
 * - CSR numbers are data points AI Overviews frequently cite
 * - Entity-rich content is more likely to be selected as AI source
 *
 * @param text - Raw text content to analyze
 * @returns Array of extracted entity strings
 */
export function extractEntities(text: string): string[] {
  const entities: string[] = []

  // Extract insurer names (case-insensitive matching)
  for (const insurer of KNOWN_INSURERS) {
    if (text.toLowerCase().includes(insurer.toLowerCase())) {
      entities.push(insurer)
    }
  }

  // Extract plan names using regex patterns
  for (const pattern of KNOWN_PLAN_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      entities.push(match[0])
    }
  }

  // Extract CSR percentages (e.g., "95.2%", "CSR of 93%")
  const csrPattern = /(?:CSR|claim settlement ratio)\s*(?:of|is|:)?\s*(\d+\.?\d*%)/gi
  let csrMatch
  while ((csrMatch = csrPattern.exec(text)) !== null) {
    entities.push(`CSR ${csrMatch[1]}`)
  }

  // Also match standalone percentage patterns near "claim" or "settlement"
  const standaloneCsrPattern = /(\d{2,3}\.?\d*)%/g
  let standaloneMatch
  while ((standaloneMatch = standaloneCsrPattern.exec(text)) !== null) {
    const val = parseFloat(standaloneMatch[1])
    // Only include percentages in the CSR range (50-100%)
    if (val >= 50 && val <= 100) {
      const contextStart = Math.max(0, standaloneMatch.index - 50)
      const context = text.substring(contextStart, standaloneMatch.index).toLowerCase()
      if (
        context.includes('claim') ||
        context.includes('csr') ||
        context.includes('settlement') ||
        context.includes('ratio')
      ) {
        entities.push(`CSR ${standaloneMatch[1]}%`)
      }
    }
  }

  // Extract premium amounts (₹X,XXX format)
  const premiumPattern = /₹\s*[\d,]+/g
  let premiumMatch
  while ((premiumMatch = premiumPattern.exec(text)) !== null) {
    entities.push(premiumMatch[0].replace(/\s/g, ''))
  }

  // Extract sum insured amounts
  const sumInsuredPattern = /(?:sum insured|coverage|cover)\s*(?:of|:)?\s*₹?\s*[\d,]+\s*(?:lakh|lakhs|crore|L|Cr)/gi
  let siMatch
  while ((siMatch = sumInsuredPattern.exec(text)) !== null) {
    entities.push(siMatch[0].trim())
  }

  // Remove duplicates while preserving order
  return [...new Set(entities)]
}

// ============================================================================
// Definition Generator
// ============================================================================

export interface DefinitionResult {
  term: string
  definition: string
  structuredForAI: string
}

/**
 * Generates AI-optimized definitions for insurance terms.
 *
 * SEO Rationale:
 * - AI Overviews frequently pull definitions as the opening line
 * - "X is Y" format is the most commonly extracted pattern
 * - Structured format: Term → Short definition → Key attributes → Example
 * - This structure makes it easy for AI to extract and cite
 *
 * Example output:
 * "Claim Settlement Ratio (CSR) is the percentage of insurance claims
 *  an insurer settles out of total claims received. Key attributes:
 *  Higher CSR indicates better claim reliability.
 *  Example: HDFC ERGO has a CSR of 95.2%, meaning it settles 95 out of 100 claims."
 *
 * @param term - Insurance term to define
 * @param definition - Plain-language definition
 * @returns Structured definition object
 */
export function generateDefinition(
  term: string,
  definition: string
): DefinitionResult {
  // Structure for AI Overview extraction
  const structuredForAI = `${term} is ${definition.startsWith(term.toLowerCase()) ? definition.substring(term.length).trim().replace(/^is\s+/i, '') : definition} This is an important metric in Indian insurance, as per IRDAI guidelines. Expert insight from Paliwal Secure, IRDAI-certified insurance advisor.`

  return {
    term,
    definition,
    structuredForAI,
  }
}

// ============================================================================
// AI Overview Optimizer
// ============================================================================

export interface OptimizedContent {
  question: string
  answer: string
  keyPoints: string[]
}

export interface AIOverviewResult {
  structuredContent: string
  faqSchema: object
}

/**
 * Optimizes content for Google AI Overview citation.
 *
 * SEO Rationale:
 * - AI Overview selects content that directly answers the query
 * - Structure: Definition → Key Points → Expert Insight → Data
 * - FAQ schema provides dual benefit: rich snippets + AI extraction
 * - Key points in bullet format are easily parsed by AI
 * - Expert attribution (IRDAI-certified) builds E-E-A-T signals
 *
 * Content Structure for AI Optimization:
 * 1. Direct answer in first 40-60 words (the "snippet" AI extracts)
 * 2. Key points as structured bullets (AI can enumerate these)
 * 3. Supporting data with specific numbers (AI loves concrete data)
 * 4. Expert attribution for trust signals
 *
 * @param content - Question, answer, and key points
 * @returns Structured content string and FAQ schema object
 */
export function optimizeForAIOverview(
  content: OptimizedContent
): AIOverviewResult {
  const { question, answer, keyPoints } = content

  // Build structured content for AI extraction
  const structuredParts: string[] = []

  // 1. Direct answer (first sentence is most important for AI)
  structuredParts.push(answer)

  // 2. Key points as structured bullets
  if (keyPoints.length > 0) {
    structuredParts.push('\n\nKey Points:')
    keyPoints.forEach((point, index) => {
      structuredParts.push(`${index + 1}. ${point}`)
    })
  }

  // 3. Expert attribution (E-E-A-T signal)
  structuredParts.push(
    '\n\n— Expert guidance from Paliwal Secure, IRDAI-certified insurance advisor, Kota, Rajasthan.'
  )

  // Generate matching FAQ schema for dual SERP presence
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer + (keyPoints.length > 0 ? ` Key points: ${keyPoints.join('; ')}` : ''),
        },
      },
    ],
  }

  return {
    structuredContent: structuredParts.join(''),
    faqSchema,
  }
}

// ============================================================================
// AI-Optimized FAQs — Pre-built for Common Insurance Queries
// ============================================================================

/**
 * 20+ AI-optimized FAQs covering the most common Indian insurance queries.
 *
 * These FAQs are designed to be cited by Google's AI Overview:
 * - Clear, concise answers in first 40-60 words
 * - Specific data points that AI can extract
 * - Expert attribution for E-E-A-T
 * - Hinglish terms for Indian audience relevance
 * - Key points as structured data for AI enumeration
 *
 * Usage: Include these in page content and generate FAQ schema
 * for maximum AI Overview + rich snippet visibility.
 */
export const aiOptimizedFAQs: OptimizedContent[] = [
  {
    question: 'What is Claim Settlement Ratio (CSR) in insurance?',
    answer:
      'Claim Settlement Ratio (CSR) is the percentage of insurance claims an insurer approves out of total claims received in a financial year. A CSR above 90% indicates reliable claim settlement. IRDAI publishes annual CSR data for all Indian insurers.',
    keyPoints: [
      'CSR = (Claims Settled / Total Claims) × 100',
      'CSR above 95% is considered excellent',
      'CSR between 90-95% is good',
      'CSR below 90% may indicate claim settlement issues',
      'Always check latest IRDAI annual report for updated CSR',
      'CSR applies to both life and health insurance',
    ],
  },
  {
    question: 'What is the waiting period in health insurance?',
    answer:
      'Waiting period is the time you must wait after buying a health insurance policy before certain conditions are covered. Initial waiting period is 30 days for all illnesses. Pre-existing disease waiting period is 2-4 years. Maternity waiting period is typically 2-3 years.',
    keyPoints: [
      'Initial waiting period: 30 days (accidents covered from day 1)',
      'Pre-existing disease (PED) waiting period: 2-4 years',
      'Maternity waiting period: 2-3 years',
      'Specific disease waiting period: 1-2 years (cataract, hernia, etc.)',
      'Some plans offer waiting period waiver at extra premium',
      'Waiting period resets if you port your policy',
    ],
  },
  {
    question: 'What is cashless hospitalization in health insurance?',
    answer:
      'Cashless hospitalization means the insurance company directly settles the hospital bill — you do not pay upfront. This works only at network hospitals that have a tie-up with your insurer. You need to show your health card and get pre-authorization from the insurer.',
    keyPoints: [
      'Works only at insurer\'s network hospitals',
      'Pre-authorization required before treatment (except emergencies)',
      'No upfront payment needed for approved claims',
      'You only pay for non-covered items and co-payment if applicable',
      'Network hospitals vary by insurer — check before buying',
      'Emergency admissions can be intimated within 24-48 hours',
    ],
  },
  {
    question: 'What is No Claim Bonus (NCB) in insurance?',
    answer:
      'No Claim Bonus (NCB) is a discount on your insurance premium for not making any claims during the policy year. In motor insurance, NCB starts at 20% and goes up to 50% after 5 claim-free years. In health insurance, NCB increases your sum insured by 5-10% per claim-free year.',
    keyPoints: [
      'Motor NCB: 20% (Year 1) → 25% → 35% → 45% → 50% (Year 5)',
      'Health NCB: Sum insured increases 5-10% per claim-free year',
      'NCB is retained even if you switch insurers (motor)',
      'NCB protects your discount, not the policy',
      'One small claim can reset years of NCB accumulation',
      'NCB protector add-on available in motor insurance',
    ],
  },
  {
    question: 'How much term insurance coverage do I need?',
    answer:
      'Your term insurance coverage should be 10-15 times your annual income, or enough to cover all your liabilities (home loan, car loan) plus 5-7 years of family expenses. For example, if you earn ₹10 lakhs/year, you need ₹1-1.5 crore term cover minimum.',
    keyPoints: [
      'Minimum: 10x annual income',
      'Recommended: 15-20x annual income for young families',
      'Add: All outstanding loans (home, car, personal)',
      'Add: 5-7 years of family living expenses',
      'Consider: Children\'s education fund',
      'Factor: Inflation — ₹1 crore today ≠ ₹1 crore in 20 years',
    ],
  },
  {
    question: 'What is zero depreciation in car insurance?',
    answer:
      'Zero depreciation (Zero Dep or Bumper-to-Bumper) cover means the insurer pays the full claim amount without deducting depreciation on car parts. Without zero dep, you receive only 50-70% of parts cost as depreciation is deducted. Zero dep is recommended for cars under 5 years old.',
    keyPoints: [
      'Full claim without depreciation deduction on parts',
      'Typically costs 15-20% more than comprehensive insurance',
      'Available for cars up to 5-7 years (varies by insurer)',
      'Covers: Metal, plastic, rubber, fiberglass, and glass parts',
      'Does NOT cover: Engine damage, tyres, batteries, tubeless valves',
      'Maximum 2 zero dep claims per year (some insurers allow more)',
    ],
  },
  {
    question: 'What is IDV in car insurance?',
    answer:
      'IDV (Insured Declared Value) is the maximum amount your insurer will pay if your car is stolen or totally damaged. IDV is the current market value of your car after depreciation. It decreases by 5-15% each year. Higher IDV means higher premium but better claim payout.',
    keyPoints: [
      'IDV = Ex-showroom price - Depreciation',
      'Year 1: 5% depreciation (95% of ex-showroom)',
      'Year 2: 10% depreciation',
      'Year 3-4: 15-20% depreciation',
      'Above 5 years: IDV by mutual agreement / survey',
      'Always declare correct IDV — under-reporting reduces claim payout',
    ],
  },
  {
    question: 'What is co-payment in health insurance?',
    answer:
      'Co-payment (co-pay) is the percentage of the claim amount you must pay from your pocket, while the insurer pays the rest. For example, with 10% co-pay on a ₹1 lakh bill, you pay ₹10,000 and insurer pays ₹90,000. Plans with co-pay have lower premiums.',
    keyPoints: [
      'Co-pay range: 10-30% of claim amount',
      'Higher co-pay = lower premium',
      'Some plans have co-pay only for specific treatments',
      'Senior citizen plans often have mandatory co-pay (20-30%)',
      'Co-pay applies per claim, not per policy year',
      'Co-pay is different from deductible',
    ],
  },
  {
    question: 'What is the free look period in insurance?',
    answer:
      'Free look period is a 15-30 day window after receiving your policy document during which you can cancel the policy and get a refund. IRDAI mandates this for all life and health insurance policies. You will receive premium refund after deducting stamp duty, medical test costs, and proportionate risk premium for the days covered.',
    keyPoints: [
      'Life insurance: 15 days free look (30 days for online policies)',
      'Health insurance: 15 days free look period',
      'Applies from the date you receive the policy document',
      'Refund: Premium - stamp duty - medical tests - risk premium',
      'Reason for cancellation not required',
      'Does NOT apply to motor insurance or travel insurance',
    ],
  },
  {
    question: 'Can I have two health insurance policies in India?',
    answer:
      'Yes, you can have multiple health insurance policies in India. If the claim amount is within one policy\'s limit, you claim from that insurer. If the claim exceeds one policy\'s sum insured, you can claim the balance from the second insurer. You cannot claim more than the total hospital bill from all policies combined.',
    keyPoints: [
      'Multiple policies are legally allowed',
      'Contribution clause: Insurers share claims proportionately',
      'You cannot make profit from claims (indemnity principle)',
      'Claim from one insurer first, then balance from second',
      'Disclose all existing policies when buying a new one',
      'Both policies\' waiting periods apply independently',
    ],
  },
  {
    question: 'What is health insurance portability in India?',
    answer:
      'Health insurance portability allows you to switch from one insurer to another without losing the benefits of your existing policy, including waiting period credit. You must apply for portability at least 45 days before your current policy renewal date. IRDAI mandates portability to protect policyholders.',
    keyPoints: [
      'Apply 45 days before current policy renewal date',
      'Waiting period credit carried over to new insurer',
      'No Claim Bonus (NCB) also carried forward',
      'New insurer can reject portability request (with valid reason)',
      'Portability applies to individual and family floater plans',
      'Group insurance to individual: Waiting period credit given',
    ],
  },
  {
    question: 'What is a deductible in insurance?',
    answer:
      'A deductible is the fixed amount you pay out-of-pocket before the insurance company starts covering costs. For example, with a ₹10,000 deductible, you pay the first ₹10,000 and the insurer pays the rest. Higher deductibles result in lower premiums. Common in health and motor insurance.',
    keyPoints: [
      'Deductible amount is paid by you before insurance kicks in',
      'Higher deductible = lower premium',
      'Compulsory deductible: Mandated by insurer (cannot remove)',
      'Voluntary deductible: You choose to lower premium',
      'Different from co-payment (co-pay is percentage, deductible is fixed amount)',
      'Common in international health insurance and motor insurance',
    ],
  },
  {
    question: 'How to file a health insurance claim in India?',
    answer:
      'To file a health insurance claim: For cashless claims, get pre-authorization at a network hospital by showing your health card and ID. For reimbursement claims, pay the hospital, collect all documents (bills, reports, discharge summary), and submit the claim form within 30-60 days of discharge.',
    keyPoints: [
      'Cashless: Pre-auth at network hospital → insurer pays directly',
      'Reimbursement: Pay first → submit documents → get refund',
      'Documents needed: Claim form, discharge summary, bills, reports',
      'Submit claim within 30-60 days of discharge',
      'Keep copies of all submitted documents',
      'Follow up with insurer if no response in 15 days',
    ],
  },
  {
    question: 'Is health insurance premium tax deductible in India?',
    answer:
      'Yes, under Section 80D of the Income Tax Act, you can deduct health insurance premiums up to ₹25,000/year for self, spouse, and children. For parents below 60, additional ₹25,000. For senior citizen parents, additional ₹50,000. For preventive health check-up, up to ₹5,000 within the overall limit.',
    keyPoints: [
      'Self + family: Up to ₹25,000 deduction',
      'Parents (below 60): Additional ₹25,000',
      'Parents (senior citizens): Additional ₹50,000',
      'Maximum total deduction: ₹75,000 (₹1 lakh with senior citizen parents)',
      'Preventive health check-up: ₹5,000 within overall limit',
      'Cash premium payment NOT eligible for deduction',
    ],
  },
  {
    question: 'What is room rent capping in health insurance?',
    answer:
      'Room rent capping limits the daily hospital room charges your insurance will cover. For example, if your sum insured is ₹5 lakhs with 1% room rent cap, maximum room rent is ₹5,000/day. If you choose a room costing ₹10,000/day, you pay the difference AND the entire bill may be reduced proportionately.',
    keyPoints: [
      'Room rent cap: Usually 1-2% of sum insured per day',
      'No room rent cap plans are recommended',
      'Exceeding room rent limit affects ALL bill items proportionately',
      'ICU cap: Usually 2-4% of sum insured',
      'This is the #1 reason for claim shortfalls',
      'Always prefer plans without room rent sub-limits',
    ],
  },
  {
    question: 'What is comprehensive car insurance?',
    answer:
      'Comprehensive car insurance (also called "own damage + third party") covers both damage to your own car and your liability towards third parties. It covers accidents, theft, fire, natural calamities, vandalism, and third-party injury/death/property damage. It is more expensive than third-party only but offers complete protection.',
    keyPoints: [
      'Covers: Own car damage + third-party liability',
      'Also covers: Theft, fire, flood, earthquake, vandalism',
      'Third-party only: Covers only damage to others, not your car',
      'Comprehensive is recommended for all cars',
      'Add zero dep, engine protect, and NCB protector for best coverage',
      'IRDAI mandates third-party insurance — comprehensive is optional',
    ],
  },
  {
    question: 'What is a floater policy in health insurance?',
    answer:
      'A floater policy covers the entire family under a single sum insured that is shared among all members. For example, a ₹10 lakh family floater covers you, spouse, and children with a shared ₹10 lakh pool. It is more affordable than buying individual policies for each member.',
    keyPoints: [
      'Single sum insured shared by all family members',
      'More affordable than individual policies',
      'If one member uses ₹6L, remaining ₹4L available for others',
      'Covers: Self, spouse, and up to 4 children',
      'Some plans allow parents/parents-in-law addition',
      'Risk: One major illness can exhaust the entire cover',
    ],
  },
  {
    question: 'What is pre-existing disease (PED) in health insurance?',
    answer:
      'A pre-existing disease (PED) is any medical condition you had before buying the insurance policy. Common PEDs include diabetes, hypertension, heart disease, and asthma. Insurers impose a 2-4 year waiting period before covering PEDs. You must disclose all PEDs at the time of buying — non-disclosure can lead to claim rejection.',
    keyPoints: [
      'PED: Condition diagnosed/treated before policy start date',
      'Waiting period for PED: 2-4 years depending on insurer',
      'Non-disclosure of PED leads to claim rejection',
      'Some plans cover PED from day 1 at higher premium',
      '48-month moratorium: PED covered after 4 years of continuous coverage (IRDAI rule)',
      'PED loading: 10-30% extra premium for pre-existing conditions',
    ],
  },
  {
    question: 'What is IRDAI and how does it protect insurance customers?',
    answer:
      'IRDAI (Insurance Regulatory and Development Authority of India) is the government body that regulates all insurance companies in India. It protects policyholders by setting rules for claim settlement, grievance redressal, policy terms, and solvency margins. You can file complaints with IRDAI if your insurer unfairly rejects your claim.',
    keyPoints: [
      'IRDAI regulates all life and general insurance companies in India',
      'Ensures insurers maintain solvency margin (financial stability)',
      'Mandates: Free look period, portability, grievance redressal',
      'IRDAI Integrated Grievance Management System (IGMS) for complaints',
      'Insurance Ombudsman: Free dispute resolution for claims up to ₹30 lakhs',
      'IRDAI certifies insurance agents and advisors',
    ],
  },
  {
    question: 'How to choose the best health insurance plan in India?',
    answer:
      'To choose the best health insurance plan, check: (1) Claim Settlement Ratio above 90%, (2) Adequate sum insured (minimum ₹5-10 lakhs), (3) Wide network of cashless hospitals, (4) No room rent capping, (5) Reasonable waiting periods, (6) No co-payment for under-60, (7) Good NCB structure, (8) Coverage for modern treatments.',
    keyPoints: [
      'CSR above 90% — indicates reliable claim settlement',
      'Sum insured: At least ₹5-10L (consider medical inflation)',
      'No room rent cap — prevents proportionate bill reduction',
      'Network hospitals: 5,000+ cashless hospitals preferred',
      'Waiting period: Shorter is better (2 years for PED ideal)',
      'Compare at least 3-4 plans before buying',
    ],
  },
  {
    question: 'What is the grace period in insurance premium payment?',
    answer:
      'Grace period is the extra time (15-30 days) after the premium due date during which you can pay without losing coverage. For health insurance, the grace period is typically 15-30 days. For life insurance, it is 15-30 days. If you do not pay within the grace period, the policy lapses and you lose coverage.',
    keyPoints: [
      'Health insurance: 15-30 days grace period',
      'Life insurance: 15-30 days grace period',
      'Coverage continues during grace period',
      'Claim filed during grace period is valid if premium is paid',
      'After grace period: Policy lapses, coverage stops',
      'Revival possible within 6 months to 2 years (with medical tests)',
    ],
  },
]
