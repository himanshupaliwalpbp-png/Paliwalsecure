/**
 * Paliwal Saver — API response types (client-side mirrors of the server engines).
 * Structurally identical to the shapes returned by /api/saver/* (Task 2-a).
 * Kept local + type-only so the module compiles independently of engine internals.
 */

/* ───────────────────────────── payment ───────────────────────────── */

export type FeeScenario = {
  dateISO: string;
  label: string;
  amount: number;
  fee: number;
  ratePercent: number;
  fixedFee: number;
  feeCapApplied: boolean;
  ruleName: string | null;
  ruleId?: string | null;
  status: "APPLIES" | "NO_RULE" | "ZERO_MDR";
  notes: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  lastVerifiedAt?: string | null;
  thresholdMargin: number | null;
  monthlyLimitMargin: number | null;
};

export type PaymentFeeResult = {
  scenarios: FeeScenario[];
  monthlyImpact: number | null;
  annualImpact: number | null;
  monthlyBasis?: string | null;
  potentialSaving: number | null;
  why: string;
  savingWhy: string | null;
  disclaimer: string;
  classificationOptions: string[];
  ruleVersionsUsed: Array<{
    id: string;
    version: number;
    ruleType: string;
    effectiveFrom: string;
  }>;
};

/* ─────────────────────────────── tax ─────────────────────────────── */

export type RegimeTaxResult = {
  regime: "new" | "old";
  fy: string;
  ay: string;
  totalIncome: number;
  deductions: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  cess: number;
  totalTax: number;
  note?: string;
};

export type PresumptiveOption = {
  section: string;
  eligible: boolean;
  reasons: string[];
  applicableLimit: number;
  deemedRateDigital?: number;
  deemedRateOther?: number;
  deemedRate?: number;
  deemedIncome: number;
  deemedTax: RegimeTaxResult;
  regularIncome: number | null;
  regularTax: RegimeTaxResult | null;
  taxDifference: number | null;
  compliance: string[];
  source: string | null;
  sourceUrl: string | null;
  verifiedDate: string | null;
};

export type TaxCompareResult = {
  presumptiveOptions: PresumptiveOption[];
  regularNew: RegimeTaxResult | null;
  regularOld: RegimeTaxResult | null;
  guidance: string;
  disclaimer: string;
};

/* ─────────────────────────────── gst ─────────────────────────────── */

export type ItcEligibility =
  | "LIKELY_ELIGIBLE"
  | "REQUIRES_REVIEW"
  | "NOT_GENERALLY_ELIGIBLE"
  | "BLOCKED_17_5"
  | "NOT_APPLICABLE"
  | "UNKNOWN";

export type GstItemEvaluation = {
  category: string;
  label: string;
  monthlyAmount: number;
  annualAmount: number;
  gstRate: number;
  gstPaidMonthly: number;
  gstPaidAnnual: number;
  potentialItcMonthly: number;
  potentialItcAnnual: number;
  eligibility: ItcEligibility;
  conditions: string[];
  documents: string[];
  riskFlags: string[];
  missingDocuments: string[];
  notes: string | null;
};

export type GstItcResult = {
  gstRegistered: boolean;
  items: GstItemEvaluation[];
  totals: {
    monthlyExpenses: number;
    annualExpenses: number;
    gstPaidAnnual: number;
    potentialItcAnnual: number;
    likelyEligibleItcAnnual: number;
    requiresReviewItcAnnual: number;
    missingDocumentCount: number;
  };
  coreConditions: string[];
  source: string | null;
  sourceUrl: string | null;
  verifiedDate: string | null;
  disclaimer: string;
};

/* ─────────────────────────── chat + transport ─────────────────────────── */

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ApiEnvelope<T> =
  | { ok: true; result: T }
  | { ok: false; error?: string };
