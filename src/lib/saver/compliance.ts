/**
 * Compliance classifier + Saver AI system prompt — DB-free standalone port
 * for the Paliwal Secure AI website. The classifier runs BEFORE the LLM;
 * evasion requests never reach the model.
 */

export type ComplianceVerdict = {
  flagged: boolean;
  category: string | null;
  response: string | null; // canned response when flagged
};

type Pattern = { category: string; re: RegExp };

const PATTERNS: Pattern[] = [
  {
    category: "ARTIFICIAL_SPLITTING",
    re: /(split|break|divide|divide|todi|tod|part|piece|chunk)\w*\s+(this|the|a|my)?\s*(payment|bill|transaction|amount|invoice|upi|sale|purchase)?/i,
  },
];

const INTENT_SPLIT = /(avoid|evade|beat|bypass|escape|save)\s+(the\s+)?(mdr|fee|charges?|upi\s*(charge|fee)|payment\s*(charge|fee))/i;
const INTENT_TAX = /(avoid|evade|beat|bypass|escape|reduce)\s+(the\s+)?(tax(es)?|gst|income\s*tax|itc)/i;
const SPLIT_SIZE = /(₹?\s*2,?000|two thousand|2k)\s*(me|ke|into|in|per)?\s*(parts?|pieces?|chunks?|batches?|payments?|bills?|invoices?)/i;

const EVASION_DIRECT = [
  /\bhide\s+(my|the)?\s*(income|sales|revenue|turnover|cash)/i,
  /\bsuppress\w*\s+(sales|income|revenue|receipts)/i,
  /bina\s*bill/i,
  /\bkachh?ai?\s*bill/i,
  /\b(fake|nakli|bogus|fabricat\w*|false)\b[\s\S]{0,24}\b(invoice|bill|expense|purchase|receipt|entry|itc|credit|document)/i,
  /\bclaim\w*\s+(fake|false|bogus)\s*(itc|credit|input)/i,
  /\bshow\w*\s+(less|lower|reduced)\s+(sales|income|turnover)/i,
  /\bunder\s*report/i,
  /\btax\s*(evasion|chori)/i,
  /\bgst\s*(chori|theft|evasion)/i,
  /\bhawala/i,
  /\bbenami/i,
  /\bround\s*trip\w*/i,
  /\bshell\s*(company|entity|firm)/i,
  /\bsham\s*(transaction|entity|firm|company)/i,
  /\bcash\s*sale\w*\s*(without|no)\s*(bill|record|entry)/i,
  /\bunrecorded\s+(cash|sales)/i,
  /\bnot\s*(declaring|disclosing)\s+(income|sales|cash)/i,
  /\bpan\s*cash\s*sales/i,
  /\bunder\s*the\s*table/i,
];

export function classifyCompliance(message: string): ComplianceVerdict {
  const m = message || "";

  // 1) Direct evasion language
  for (const re of EVASION_DIRECT) {
    if (re.test(m)) {
      return {
        flagged: true,
        category: "EVASION",
        response:
          "I can help you find legitimate tax and payment-cost savings, compare eligible options, and organize genuine business expenses and documents.\n\nI won't help with hiding income, suppressing sales, or falsifying records — that's illegal and carries serious penalties including prosecution.\n\nWhat I can do instead:\n• Check which of your expenses carry potential GST input tax credit\n• Compare regular vs presumptive taxation for your profile\n• Compare legitimate payment methods and their costs\n• Build a documentation checklist so every rupee you can legally claim, you do\n\nDisclaimer: I'm an information assistant, not a tax advisor — every figure is an estimate.",
      };
    }
  }

  // 2) Artificial splitting to avoid MDR/fees
  const splitMention = PATTERNS[0].re.test(m);
  if (splitMention && (INTENT_SPLIT.test(m) || INTENT_TAX.test(m) || SPLIT_SIZE.test(m))) {
    return {
      flagged: true,
      category: "ARTIFICIAL_SPLITTING",
      response:
        "Splitting a single payment artificially to avoid applicable payment charges may not comply with payment-network or merchant-acquirer rules. I can compare legitimate payment methods and check whether your business qualifies for a zero-MDR category — such as the small-merchant UPI QR allowance (up to ₹1 lakh/month, subject to conditions) or the ₹2,000 per-payment threshold for specified merchants.\n\nIf you meant a genuine shared bill — where several different people each pay their own portion — that's a legitimate multi-payer split, and different from artificial splitting.\n\nDisclaimer: I'm an information assistant, not a tax advisor — every figure is an estimate.",
    };
  }

  // 3) Splitting phrasing near thresholds without explicit intent — nudge, don't block
  if (splitMention && SPLIT_SIZE.test(m)) {
    return {
      flagged: true,
      category: "ARTIFICIAL_SPLITTING",
      response:
        "Splitting a single payment artificially to avoid applicable payment charges may not comply with payment-network or merchant-acquirer rules. I can compare legitimate payment methods and check whether your business qualifies for a zero-MDR category — such as the small-merchant UPI QR allowance (up to ₹1 lakh/month, subject to conditions) or the ₹2,000 per-payment threshold for specified merchants.\n\nIf you meant a genuine shared bill — where several different people each pay their own portion — that's a legitimate multi-payer split, and different from artificial splitting.\n\nDisclaimer: I'm an information assistant, not a tax advisor — every figure is an estimate.",
    };
  }

  return { flagged: false, category: null, response: null };
}

/**
 * System prompt for Paliwal Saver AI on the Paliwal Secure AI website
 * (backend only). Adapted from the Paliwal Saver app's saverAiSystemPrompt.
 */
export function saverAiSystemPrompt(): string {
  return `You are Paliwal Saver AI — the savings assistant inside the Paliwal Secure AI website (paliwalsecure). Paliwal Saver is a legal tax-optimization, payment-cost intelligence and business-savings product by Paliwal Secure AI (Himanshu Paliwal, IRDAI Registered POSP IP429834) for Indian small businesses.

You are an expert on: RBI/NPCI UPI MDR rules (the ₹2,000 zero-MDR threshold for specified P2M merchants and the announced 0.4% MDR above it from 15 Oct 2026; the ₹1 lakh/month zero-MDR UPI QR allowance for qualifying small merchants in the P2PM category), Section 44AD/44ADA/44AE presumptive taxation (6%/8% deemed rates, ₹2/₹3 crore turnover limits, 50% for specified professions up to ₹50/₹75 lakh, per-vehicle rates for goods carriages), the new vs old income-tax regimes (new-regime slabs with the Section 87A rebate up to ₹60,000 where total income is up to ₹12 lakh; old-regime ₹12,500 rebate at up to ₹5 lakh), and GST input tax credit eligibility (Section 16 conditions and Section 17(5) blocked credits).

ABSOLUTE RULES (never break):
1. You are NOT a tax advisor. You are an information assistant. Every financial figure you mention is an estimate.
2. NEVER assist tax evasion: no hiding income, fake invoices, fake expenses, cash-sale suppression, sham businesses, false GST ITC, fraudulent deductions, false classification, artificial UPI transaction splitting, or MDR evasion. If asked, refuse and offer legitimate alternatives.
3. NEVER invent data: no incomes, expenses, invoices, GSTINs, transactions, or eligibility you have not been given. If information is missing, reply exactly in the spirit of: "I need this information before I can calculate that." and say what's missing.
4. Separate savings into these categories and use their exact names:
   A. Payment Fee Saving (MDR and collection costs — never call this "tax saved")
   B. GST / Input Tax Credit Opportunity (subject to statutory conditions)
   C. Income Tax Optimization (presumptive eligibility, allowable expenses, depreciation, regime comparison)
   D. Business Cost Saving (provider charges, subscriptions, working capital)
   E. Compliance / Penalty Risk Reduction (missing documents, late filings)
5. Use the words "potential", "estimated", "illustrative". NEVER "guaranteed".
6. When a calculation is involved, structure answers as: RESULT, WHY, POTENTIAL SAVING (if any), ELIGIBILITY, DOCUMENTS REQUIRED (if relevant), RISK/WARNING, SOURCE (official source name), LAST VERIFIED (say the configured rulebook was last verified 18 Sep 2026 when relevant).
7. Never say "government approved". Cite official sources generically (Income Tax Department, CBIC, GST Portal, NPCI, RBI) rather than fabricating circular numbers.
8. Politely correct the misconception that the ₹2,000 UPI threshold is a "tax" — it is a merchant-side MDR framework; customers don't pay it.
9. Keep answers concise, warm and plain-spoken for small shopkeepers. Use ₹ formatting with Indian commas. No jargon without a one-line explanation.
10. If asked for personalized numbers and the user has not provided the data, ask for exactly the missing fields. You may also suggest they run exact numbers in the /saver calculators on this website — the UPI payment fee calculator, the income tax saver (regime comparison + 44AD/44ADA/44AE) and the GST input tax credit checker.
11. ALWAYS end every reply with a one-line compliance disclaimer, e.g.: "Disclaimer: estimates only, not tax advice — verify with a qualified professional before acting."
12. When the topic is insurance-related (health, life, motor, shop, business insurance, claims…), mention that Paliwal Secure AI (Himanshu Paliwal, IRDAI Registered POSP IP429834) can help with a free consultation.

Answer in English by default, but mirror the user's language — if they write in Hindi or Hinglish, reply in the same style, keeping it simple and warm.`;
}
