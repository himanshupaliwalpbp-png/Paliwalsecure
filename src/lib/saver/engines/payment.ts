/**
 * SERVER-SIDE UPI/payment fee rule engine — DB-free static rulebook port.
 * Rules below mirror the seeded v1 configuration of the Paliwal Saver engine
 * (RBI / NPCI announced frameworks). Every result carries rule version + source.
 */

export type PaymentFeeInput = {
  amount: number;
  transactionType: "P2M" | "P2PM" | "P2P";
  merchantClassification: "small_merchant" | "large_merchant" | "not_sure";
  monthlyUpiReceipts?: number | null;
  businessType?: string | null;
  date?: string | null;
};

export type FeeScenario = {
  dateISO: string;
  label: string;
  amount: number;
  fee: number;
  ratePercent: number;
  fixedFee: number;
  feeCapApplied: boolean;
  ruleName: string | null;
  ruleId: string | null;
  status: "APPLIES" | "NO_RULE" | "ZERO_MDR";
  notes: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  lastVerifiedAt: string | null;
  thresholdMargin: number | null;
  monthlyLimitMargin: number | null;
};

export type PaymentFeeResult = {
  scenarios: FeeScenario[];
  classificationOptions: string[];
  monthlyImpact: number | null;
  annualImpact: number | null;
  monthlyBasis: string | null;
  ruleVersionsUsed: Array<{ id: string; version: number; ruleType: string; effectiveFrom: string }>;
  why: string;
  potentialSaving: number | null;
  savingWhy: string | null;
  disclaimer: string;
};

type RuleRow = {
  id: string;
  name: string;
  transactionType: string;
  thresholdAmount: number | null;
  comparisonOperator: string | null;
  ratePercent: number;
  fixedFee: number;
  feeCap: number | null;
  monthlyLimit: number | null;
  merchantClassification: string;
  effectiveFrom: Date;
  effectiveUntil: Date | null;
  sourceUrl: string | null;
  sourceName: string | null;
  lastVerifiedAt: Date | null;
  priority: number;
  notes: string | null;
};

// ------------------------------------------------------------- static rulebook (v1)

const VERIFIED_AT = new Date("2026-09-18T00:00:00Z");

const RBI_SRC = {
  sourceName: "Reserve Bank of India — Circulars & Notifications",
  sourceUrl: "https://www.rbi.org.in",
};
const NPCI_SRC = {
  sourceName: "NPCI — UPI product & pricing framework",
  sourceUrl: "https://www.npci.org.in/what-we-do/upi",
};

/**
 * STATIC_RULES — the 5 payment rules of rulebook v1 (mirrors the seeded
 * Paliwal Saver database exactly: names, thresholds, rates, effective dates,
 * priorities, notes, sources).
 */
export const STATIC_RULES: RuleRow[] = [
  {
    id: "pr-p2m-zero-lte-2000",
    name: "UPI P2M — zero MDR at ₹2,000 and below",
    transactionType: "P2M",
    thresholdAmount: 2000,
    comparisonOperator: "LTE",
    ratePercent: 0,
    fixedFee: 0,
    feeCap: null,
    monthlyLimit: null,
    merchantClassification: "any",
    effectiveFrom: new Date("2020-01-01T00:00:00Z"),
    effectiveUntil: null,
    sourceName: RBI_SRC.sourceName,
    sourceUrl: RBI_SRC.sourceUrl,
    lastVerifiedAt: VERIFIED_AT,
    priority: 10,
    notes:
      "P2M transactions of ₹2,000 and below remain within the zero-MDR framework. Estimated under current configured rules.",
  },
  {
    id: "pr-p2m-04-gt-2000",
    name: "UPI P2M — 0.4% MDR above ₹2,000 (specified merchants, as announced)",
    transactionType: "P2M",
    thresholdAmount: 2000,
    comparisonOperator: "GT",
    ratePercent: 0.4,
    fixedFee: 0,
    feeCap: null,
    monthlyLimit: null,
    merchantClassification: "any",
    effectiveFrom: new Date("2026-10-15T00:00:00Z"),
    effectiveUntil: null,
    sourceName: RBI_SRC.sourceName,
    sourceUrl: RBI_SRC.sourceUrl,
    lastVerifiedAt: VERIFIED_AT,
    priority: 5,
    notes:
      "Announced framework: 0.4% MDR on specified UPI P2M merchant transactions above ₹2,000 from 15 Oct 2026. Category-specific rules, caps and exclusions may apply per the applicable circular — confirm with your acquirer before relying on this estimate.",
  },
  {
    id: "pr-p2pm-small-zero-1l",
    name: "UPI P2PM small merchant — zero MDR up to ₹1 lakh/month via UPI QR",
    transactionType: "P2PM",
    merchantClassification: "small",
    thresholdAmount: 0,
    comparisonOperator: "GTE",
    ratePercent: 0,
    fixedFee: 0,
    feeCap: null,
    monthlyLimit: 100000,
    effectiveFrom: new Date("2020-01-01T00:00:00Z"),
    effectiveUntil: null,
    sourceName: NPCI_SRC.sourceName,
    sourceUrl: NPCI_SRC.sourceUrl,
    lastVerifiedAt: VERIFIED_AT,
    priority: 20,
    notes:
      "Qualifying small merchants in the P2PM category receiving up to ₹1 lakh/month through UPI QR remain zero-MDR, subject to applicable classification and conditions.",
  },
  {
    id: "pr-p2pm-small-fallback-04",
    name: "UPI P2PM small merchant beyond ₹1 lakh/month — 0.4% indicative (requires review)",
    transactionType: "P2PM",
    merchantClassification: "small",
    thresholdAmount: 0,
    comparisonOperator: "GTE",
    ratePercent: 0.4,
    fixedFee: 0,
    feeCap: null,
    monthlyLimit: null,
    effectiveFrom: new Date("2026-10-15T00:00:00Z"),
    effectiveUntil: null,
    sourceName: NPCI_SRC.sourceName,
    sourceUrl: NPCI_SRC.sourceUrl,
    lastVerifiedAt: VERIFIED_AT,
    priority: 1,
    notes:
      "Fallback estimate once the small-merchant QR monthly limit is exceeded. Classification and caps are governed by the applicable circular — verify with your acquirer.",
  },
  {
    id: "pr-p2p-no-mdr",
    name: "UPI P2P — no MDR",
    transactionType: "P2P",
    thresholdAmount: 0,
    comparisonOperator: "GTE",
    ratePercent: 0,
    fixedFee: 0,
    feeCap: null,
    monthlyLimit: null,
    merchantClassification: "any",
    effectiveFrom: new Date("2016-01-01T00:00:00Z"),
    effectiveUntil: null,
    sourceName: NPCI_SRC.sourceName,
    sourceUrl: NPCI_SRC.sourceUrl,
    lastVerifiedAt: VERIFIED_AT,
    priority: 10,
    notes: "Person-to-person UPI transfers do not attract merchant MDR.",
  },
];

/** Rulebook version v1 (matches the seeded RuleVersion of Paliwal Saver). */
export const STATIC_RULE_VERSIONS = [
  {
    id: "rv-saver-v1",
    version: 1,
    ruleType: "all",
    effectiveFrom: VERIFIED_AT.toISOString(),
  },
];

// ------------------------------------------------------------------ rule matching

function typeMatches(ruleType: string, inputType: string): boolean {
  return ruleType === "ANY" || ruleType === inputType;
}

function classMatches(ruleClass: string, cls: string): boolean {
  return ruleClass === "any" || ruleClass === cls;
}

function thresholdOk(rule: RuleRow, amount: number): boolean {
  if (rule.comparisonOperator == null || rule.thresholdAmount == null) return true;
  const t = rule.thresholdAmount;
  switch (rule.comparisonOperator) {
    case "GT": return amount > t;
    case "GTE": return amount >= t;
    case "LT": return amount < t;
    case "LTE": return amount <= t;
    default: return true;
  }
}

function monthlyOk(rule: RuleRow, monthly: number | null): boolean {
  if (rule.monthlyLimit == null) return true;
  if (monthly == null) return true; // cannot test — let it apply, engine notes it
  return monthly <= rule.monthlyLimit;
}

function computeFee(rule: RuleRow, amount: number) {
  let fee = (amount * rule.ratePercent) / 100 + (rule.fixedFee || 0);
  let capped = false;
  if (rule.feeCap != null && fee > rule.feeCap) {
    fee = rule.feeCap;
    capped = true;
  }
  fee = Math.round(fee * 100) / 100;
  return { fee, capped };
}

function currentRuleVersions() {
  return STATIC_RULE_VERSIONS.map((v) => ({ ...v }));
}

function scenarioLabel(d: Date, today: Date): string {
  const sameDay = d.toDateString() === today.toDateString();
  if (sameDay) return "Today";
  return `From ${d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`;
}

export async function calcPaymentFee(input: PaymentFeeInput): Promise<PaymentFeeResult> {
  const rules = STATIC_RULES;
  const versionsUsed = currentRuleVersions();

  const today = input.date ? new Date(input.date) : new Date();
  const amount = input.amount;

  const clsInput =
    input.merchantClassification === "small_merchant"
      ? "small"
      : input.merchantClassification === "large_merchant"
        ? "large"
        : null;
  const classList: string[] = clsInput ? [clsInput] : ["small", "large"];

  // Evaluation dates: today + every distinct upcoming effectiveFrom (next 365 days)
  const evalDates: Date[] = [today];
  const upcoming = rules
    .filter((r) => r.effectiveFrom > today)
    .map((r) => r.effectiveFrom)
    .sort((a, b) => a.getTime() - b.getTime());
  for (const d of upcoming) {
    if (d.getTime() - today.getTime() < 365 * 24 * 3600 * 1000) evalDates.push(d);
  }
  const uniqueDates = evalDates.filter(
    (d, i) => evalDates.findIndex((x) => x.toDateString() === d.toDateString()) === i
  );

  const scenarios: FeeScenario[] = [];

  for (const evalDate of uniqueDates) {
    for (const cls of classList) {
      const candidates = rules.filter(
        (r) =>
          typeMatches(r.transactionType, input.transactionType) &&
          classMatches(r.merchantClassification, cls) &&
          r.effectiveFrom <= evalDate &&
          (!r.effectiveUntil || r.effectiveUntil >= evalDate) &&
          thresholdOk(r, amount) &&
          monthlyOk(r, input.monthlyUpiReceipts ?? null)
      );
      candidates.sort((a, b) => b.priority - a.priority || b.effectiveFrom.getTime() - a.effectiveFrom.getTime());
      const rule = candidates[0];

      if (!rule) {
        scenarios.push({
          dateISO: evalDate.toISOString(),
          label: `${scenarioLabel(evalDate, today)} · ${cls === "small" ? "small merchant" : "specified merchant"}`,
          amount,
          fee: 0,
          ratePercent: 0,
          fixedFee: 0,
          feeCapApplied: false,
          ruleName: null,
          ruleId: null,
          status: "NO_RULE",
          notes:
            "No active rule matches this profile for the selected date based on the currently configured rules. Confirm your merchant classification with your acquirer — classification is what selects the applicable framework.",
          sourceName: null,
          sourceUrl: null,
          lastVerifiedAt: null,
          thresholdMargin: null,
          monthlyLimitMargin: null,
        });
        continue;
      }

      const { fee, capped } = computeFee(rule, amount);
      scenarios.push({
        dateISO: evalDate.toISOString(),
        label: `${scenarioLabel(evalDate, today)} · ${cls === "small" ? "small merchant" : "specified merchant"}`,
        amount,
        fee,
        ratePercent: rule.ratePercent,
        fixedFee: rule.fixedFee,
        feeCapApplied: capped,
        ruleName: rule.name,
        ruleId: rule.id,
        status: fee > 0 ? "APPLIES" : "ZERO_MDR",
        notes: rule.notes,
        sourceName: rule.sourceName,
        sourceUrl: rule.sourceUrl,
        lastVerifiedAt: rule.lastVerifiedAt ? rule.lastVerifiedAt.toISOString() : null,
        thresholdMargin:
          input.transactionType === "P2M" && amount <= 2000 ? 2000 - amount : null,
        monthlyLimitMargin:
          rule.monthlyLimit != null && input.monthlyUpiReceipts != null
            ? rule.monthlyLimit - input.monthlyUpiReceipts
            : null,
      });
    }
  }

  const primary = scenarios.find((s) => s.label.startsWith("Today")) ?? scenarios[0];
  const worst = scenarios.reduce((m, s) => Math.max(m, s.fee), 0);

  // Monthly impact — illustrative: monthly UPI receipts assumed as tickets of `amount`
  let monthlyImpact: number | null = null;
  let annualImpact: number | null = null;
  let monthlyBasis: string | null = null;
  if (input.monthlyUpiReceipts && input.monthlyUpiReceipts > 0 && amount > 0 && worst > 0) {
    const tickets = input.monthlyUpiReceipts / amount;
    monthlyImpact = Math.round(tickets * worst * 100) / 100;
    annualImpact = Math.round(monthlyImpact * 12 * 100) / 100;
    monthlyBasis = `Illustrative: assumes your ₹${input.monthlyUpiReceipts.toLocaleString("en-IN")} monthly UPI receipts arrive as ~${Math.round(tickets * 10) / 10} payments of ₹${amount.toLocaleString("en-IN")} each.`;
  }

  const potentialSaving = worst > 0 ? worst : null;
  const savingWhy = worst > 0
    ? "A lower-cost eligible payment route (e.g., bank transfer for B2B amounts, or UPI within the zero-MDR threshold/category where applicable) may be available under the current configured rules. This is a comparison of legitimate options — never artificial splitting."
    : null;

  const why = primary
    ? primary.status === "APPLIES"
      ? `A fee of ${primary.ratePercent}% is estimated on this ${input.transactionType} payment of ₹${amount.toLocaleString("en-IN")} under rule "${primary.ruleName}" — estimated under current configured rules.`
      : primary.status === "ZERO_MDR"
        ? `This payment currently falls within a zero-MDR framework under rule "${primary.ruleName}".`
        : "No active rule matched this profile today — verify your merchant classification."
    : "";

  return {
    scenarios,
    classificationOptions: classList,
    monthlyImpact,
    annualImpact,
    monthlyBasis,
    ruleVersionsUsed: versionsUsed,
    why,
    potentialSaving,
    savingWhy,
    disclaimer:
      "Estimate based on the information provided. Estimated under current configured rules — category-specific caps, exclusions and merchant classification govern actual applicability. Final treatment depends on the applicable circular and your bank/payment provider.",
  };
}

/** Legitimate multi-payer shared bill split (NOT marketed as MDR beating). */
export function splitSharedBill(billAmount: number, payers: number) {
  if (!Number.isFinite(billAmount) || billAmount <= 0) throw new Error("Invalid bill amount");
  if (!Number.isFinite(payers) || payers < 1 || payers > 100) throw new Error("Invalid payer count");
  const base = Math.floor((billAmount / payers) * 100) / 100;
  let remainder = Math.round((billAmount - base * payers) * 100) / 100;
  const shares = Array.from({ length: payers }, () => base);
  let i = 0;
  while (remainder > 0.009 && i < payers) {
    shares[i] = Math.round((shares[i] + 0.01) * 100) / 100;
    remainder = Math.round((remainder - 0.01) * 100) / 100;
    i++;
  }
  const total = Math.round(shares.reduce((a, b) => a + b, 0) * 100) / 100;
  return {
    billAmount,
    payers,
    shares,
    total,
    note:
      "This is a legitimate multi-payer split — each share is a real payment by a different person for their own portion. It must not be used to split one payer's single payment artificially to avoid applicable charges.",
    disclaimer:
      "Splitting a single payment artificially to avoid applicable payment charges may not comply with payment-network or merchant-acquirer rules.",
  };
}

// --------------------------------------------------------------- UPI mix analyzer

export type UpiMixRowInput = { amount: number; count: number };

export type UpiMixRowResult = {
  amount: number;
  count: number;
  rowTotal: number;
  feePerPayment: number;
  rowFee: number;
  status: "APPLIES" | "ZERO_MDR" | "NO_RULE";
  ruleName: string | null;
};

export type UpiMixResult = {
  evalDateLabel: string;
  classificationNote: string | null;
  rows: UpiMixRowResult[];
  monthlyTotal: number;
  totalPayments: number;
  feeFreeAmount: number;
  feeBearingAmount: number;
  feeBearingSharePercent: number;
  monthlyMdr: number;
  annualMdr: number;
  smallMerchantNote: string | null;
  potentialSaving: number | null;
  savingWhy: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  lastVerifiedAt: string | null;
  ruleVersionsUsed: Array<{ id: string; version: number; ruleType: string; effectiveFrom: string }>;
  why: string;
  disclaimer: string;
};

/**
 * Maps a merchant's monthly UPI collection mix (payment size × count rows)
 * against the configured rule set — shows how much sits above the fee-bearing
 * threshold and the estimated monthly/annual MDR exposure. Rule-driven,
 * server-side, static rulebook v1. Legitimate comparison only.
 */
export async function calcUpiMix(input: {
  rows: UpiMixRowInput[];
  transactionType: "P2M" | "P2PM" | "P2P";
  merchantClassification: "small_merchant" | "large_merchant" | "not_sure";
}): Promise<UpiMixResult> {
  const rules = STATIC_RULES;
  const versionsUsed = currentRuleVersions();

  const today = new Date();
  const round2 = (n: number) => Math.round(n * 100) / 100;

  const monthlyTotal = round2(input.rows.reduce((a, r) => a + r.amount * r.count, 0));
  const totalPayments = input.rows.reduce((a, r) => a + r.count, 0);

  // Evaluate at the next upcoming framework effective date (what merchants plan for); else today
  const upcoming = rules
    .filter((r) => r.effectiveFrom > today && typeMatches(r.transactionType, input.transactionType))
    .map((r) => r.effectiveFrom)
    .sort((a, b) => a.getTime() - b.getTime());
  const evalDate = upcoming[0] ?? today;
  const evalDateLabel = upcoming[0] ? scenarioLabel(evalDate, today) : "Today";

  // "not sure" → evaluate conservatively as a specified merchant, and say so
  const cls =
    input.merchantClassification === "small_merchant" ? "small" : "large";
  const classificationNote =
    input.merchantClassification === "not_sure"
      ? "You selected “not sure” — evaluated as a specified merchant (the conservative case). Small-merchant P2PM QR collections follow a different framework; confirm your classification with your acquirer."
      : null;

  const rowResults: UpiMixRowResult[] = input.rows.map((r) => {
    const candidates = rules.filter(
      (rule) =>
        typeMatches(rule.transactionType, input.transactionType) &&
        classMatches(rule.merchantClassification, cls) &&
        rule.effectiveFrom <= evalDate &&
        (!rule.effectiveUntil || rule.effectiveUntil >= evalDate) &&
        thresholdOk(rule, r.amount) &&
        monthlyOk(rule, monthlyTotal)
    );
    candidates.sort((a, b) => b.priority - a.priority || b.effectiveFrom.getTime() - a.effectiveFrom.getTime());
    const rule = candidates[0];
    const rowTotal = round2(r.amount * r.count);
    if (!rule) {
      return { amount: r.amount, count: r.count, rowTotal, feePerPayment: 0, rowFee: 0, status: "NO_RULE", ruleName: null };
    }
    const { fee } = computeFee(rule, r.amount);
    return {
      amount: r.amount,
      count: r.count,
      rowTotal,
      feePerPayment: fee,
      rowFee: round2(fee * r.count),
      status: fee > 0 ? "APPLIES" : "ZERO_MDR",
      ruleName: rule.name,
    };
  });

  const monthlyMdr = round2(rowResults.reduce((a, r) => a + r.rowFee, 0));
  const annualMdr = round2(monthlyMdr * 12);
  const feeBearingAmount = round2(
    rowResults.filter((r) => r.status === "APPLIES").reduce((a, r) => a + r.rowTotal, 0)
  );
  const feeFreeAmount = round2(monthlyTotal - feeBearingAmount);
  const feeBearingSharePercent =
    monthlyTotal > 0 ? Math.round((feeBearingAmount / monthlyTotal) * 1000) / 10 : 0;

  // Source from the first fee-bearing row's matched rule
  const appliesRuleName = rowResults.find((r) => r.status === "APPLIES")?.ruleName ?? null;
  const appliesRule = appliesRuleName ? rules.find((r) => r.name === appliesRuleName) : undefined;

  let smallMerchantNote: string | null = null;
  if (input.merchantClassification === "small_merchant" && input.transactionType === "P2PM" && monthlyTotal <= 100000) {
    smallMerchantNote =
      "Your monthly UPI QR collections are within the ₹1,00,000/month small-merchant limit — if your QR operates in the qualifying P2PM small-merchant category (conditions apply), these collections may remain zero-MDR. Confirm your category with your bank/acquirer.";
  } else if (input.merchantClassification === "small_merchant" && input.transactionType === "P2M") {
    smallMerchantNote =
      "The ₹1 lakh/month zero-MDR category applies to qualifying UPI P2PM QR collections — not to P2M merchant collections. As a specified merchant collecting P2M payments, the ₹2,000 threshold framework applies as configured above.";
  }

  const potentialSaving = monthlyMdr > 0 ? monthlyMdr : null;
  const savingWhy =
    monthlyMdr > 0
      ? "Up to this estimated MDR per month could be avoided by routing eligible large-ticket or B2B collections through zero-MDR routes — bank transfer (NEFT/RTGS/IMPS) for invoiced amounts, or UPI within the zero-MDR threshold or an eligible QR category. A comparison of legitimate options — never artificial splitting."
      : null;

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const why =
    monthlyMdr > 0
      ? `You collect an estimated ${fmt(monthlyTotal)}/month by UPI across ~${totalPayments.toLocaleString("en-IN")} payments, of which ${feeBearingSharePercent}% (${fmt(feeBearingAmount)}) sits in fee-bearing payments under the configured rules. ${evalDateLabel === "Today" ? "At today's configured rates" : `From ${evalDateLabel.replace("From ", "")}`}, that is an estimated ${fmt(monthlyMdr)}/month in merchant-side fees.`
      : `None of your mapped payment rows carry a fee under the currently configured rules for this profile — estimated zero merchant-side MDR exposure across ${fmt(monthlyTotal)}/month.`;

  return {
    evalDateLabel,
    classificationNote,
    rows: rowResults,
    monthlyTotal,
    totalPayments,
    feeFreeAmount,
    feeBearingAmount,
    feeBearingSharePercent,
    monthlyMdr,
    annualMdr,
    smallMerchantNote,
    potentialSaving,
    savingWhy,
    sourceName: appliesRule?.sourceName ?? null,
    sourceUrl: appliesRule?.sourceUrl ?? null,
    lastVerifiedAt: appliesRule?.lastVerifiedAt ? appliesRule.lastVerifiedAt.toISOString() : null,
    ruleVersionsUsed: versionsUsed,
    why,
    disclaimer:
      "Estimate based on the payment mix you entered. Estimated under current configured rules — category-specific caps, exclusions and merchant classification govern actual applicability. Final treatment depends on the applicable framework and your bank/payment provider.",
  };
}

// ---------------------------------------------------------------- zero-MDR eligibility check

export type ZeroMdrInput = {
  monthlyUpiReceipts: number; // total monthly UPI QR collections (₹)
  merchantClassification: "small_merchant" | "large_merchant" | "not_sure";
  /** 0–100: share of receipt VALUE that comes from payments at/below the P2M zero-MDR threshold */
  shareBelowThresholdPercent: number;
  businessType?: string | null;
};

export type ZeroMdrRoute = {
  key: "small_qr" | "p2m_threshold" | "bank_b2b" | "p2p_clarification";
  title: string;
  verdict: "ELIGIBLE" | "CONDITIONAL" | "LIMIT_EXCEEDED" | "NOT_APPLICABLE" | "INFO";
  summary: string;
  details: string[];
  headroom: { used: number; limit: number } | null;
};

export type ZeroMdrResult = {
  asOfLabel: string;
  frameworkDate: string | null;
  routes: ZeroMdrRoute[];
  totals: {
    monthlyReceipts: number;
    feeFreeMonthly: number;
    feeBearingMonthly: number;
    estimatedMonthlyMdr: number;
    estimatedAnnualMdr: number;
  };
  smallMerchantLimit: number;
  p2mThreshold: number;
  p2mRatePercent: number;
  classificationNote: string | null;
  ruleVersionsUsed: Array<{ id: string; version: number; ruleType: string; effectiveFrom: string }>;
  why: string;
  disclaimer: string;
  sourceName: string | null;
  sourceUrl: string | null;
  lastVerifiedAt: string | null;
};

export async function checkZeroMdrEligibility(input: ZeroMdrInput): Promise<ZeroMdrResult> {
  const rules = STATIC_RULES;
  const versionsUsed = currentRuleVersions();

  // Locate the framework rules (all values come from the rulebook — never hard-coded).
  const p2mZero = rules
    .filter((r) => r.transactionType === "P2M" && r.ratePercent === 0 && r.thresholdAmount != null)
    .sort((a, b) => b.effectiveFrom.getTime() - a.effectiveFrom.getTime())[0];
  const p2mFee = rules
    .filter((r) => r.transactionType === "P2M" && r.ratePercent > 0)
    .sort((a, b) => a.effectiveFrom.getTime() - b.effectiveFrom.getTime())[0];
  const smallQr = rules
    .filter((r) => r.transactionType === "P2PM" && r.monthlyLimit != null && r.ratePercent === 0)
    .sort((a, b) => b.effectiveFrom.getTime() - a.effectiveFrom.getTime())[0];
  const smallOver = rules
    .filter((r) => r.transactionType === "P2PM" && r.merchantClassification === "small" && r.ratePercent > 0)
    .sort((a, b) => a.effectiveFrom.getTime() - b.effectiveFrom.getTime())[0];

  const p2mThreshold = p2mZero?.thresholdAmount ?? 2000;
  const p2mRate = p2mFee?.ratePercent ?? 0.4;
  const smallLimit = smallQr?.monthlyLimit ?? 100000;
  const frameworkDate = p2mFee?.effectiveFrom ?? null;
  const frameworkLabel = frameworkDate
    ? frameworkDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "the announced framework";
  const asOfLabel = `Planning basis: the announced MDR framework${frameworkDate ? ` from ${frameworkLabel}` : ""}. Until then, currently configured rates remain zero for these categories.`;

  const receipts = Math.max(0, input.monthlyUpiReceipts);
  const shareBelow = Math.min(100, Math.max(0, input.shareBelowThresholdPercent));
  const cls = input.merchantClassification;

  // ---- Route 1: small-merchant UPI QR (P2PM)
  let smallRoute: ZeroMdrRoute;
  if (cls === "large_merchant") {
    smallRoute = {
      key: "small_qr",
      title: "Small-merchant UPI QR (P2PM category)",
      verdict: "NOT_APPLICABLE",
      summary: `Your profile says specified/large merchant (P2M) — the small-merchant QR category doesn't apply to your collections.`,
      details: [
        `The ₹${smallLimit.toLocaleString("en-IN")}/month zero-MDR QR category is for qualifying small merchants in the P2PM classification.`,
        "Your acquirer's merchant category decides this — it cannot be chosen per transaction.",
      ],
      headroom: null,
    };
  } else if (cls === "small_merchant") {
    const used = receipts;
    const within = used <= smallLimit;
    smallRoute = {
      key: "small_qr",
      title: "Small-merchant UPI QR (P2PM category)",
      verdict: within ? "ELIGIBLE" : "LIMIT_EXCEEDED",
      summary: within
        ? `Within the category: ₹${used.toLocaleString("en-IN")} of your ₹${smallLimit.toLocaleString("en-IN")}/month zero-MDR QR allowance is in use.`
        : `Collections of ₹${used.toLocaleString("en-IN")}/month exceed the ₹${smallLimit.toLocaleString("en-IN")}/month small-merchant QR allowance by ₹${(used - smallLimit).toLocaleString("en-IN")}.`,
      details: within
        ? [
            `Remaining headroom: ₹${(smallLimit - used).toLocaleString("en-IN")}/month.`,
            smallOver
              ? `Collections beyond the allowance attract ${smallOver.ratePercent}% indicative MDR under the configured fallback rule.`
              : "Collections beyond the allowance may attract MDR — verify with your acquirer.",
            "Subject to NPCI classification conditions — confirm your category with your bank/PSP.",
          ]
        : [
            `An estimated ₹${(used - smallLimit).toLocaleString("en-IN")}/month sits beyond the allowance and may attract ${smallOver?.ratePercent ?? p2mRate}% indicative MDR.`,
            "Growth beyond the category usually means graduating to the P2M framework — plan pricing and payment routes accordingly.",
            "Subject to NPCI classification conditions — confirm your category with your bank/PSP.",
          ],
      headroom: { used, limit: smallLimit },
    };
  } else {
    smallRoute = {
      key: "small_qr",
      title: "Small-merchant UPI QR (P2PM category)",
      verdict: "CONDITIONAL",
      summary: `If your acquirer classifies you as a qualifying small merchant, up to ₹${smallLimit.toLocaleString("en-IN")}/month of UPI QR collections stay zero-MDR.`,
      details: [
        "Classification depends on your merchant category with your bank/PSP — not on how a single payment is made.",
        `At your current ₹${receipts.toLocaleString("en-IN")}/month, you would be ${receipts <= smallLimit ? "within" : "beyond"} the allowance.`,
        "Ask your acquirer two questions: which category am I in, and what happens above the allowance?",
      ],
      headroom: receipts > 0 ? { used: receipts, limit: smallLimit } : null,
    };
  }

  // ---- Route 2: P2M ≤ threshold (per-payment zero-MDR)
  const feeFreeShare = (receipts * shareBelow) / 100;
  const feeBearingShare = receipts - feeFreeShare;
  const p2mRoute: ZeroMdrRoute = {
    key: "p2m_threshold",
    title: `Specified P2M payments of ₹${p2mThreshold.toLocaleString("en-IN")} and below`,
    verdict: "ELIGIBLE",
    summary: `${shareBelow}% of your receipt value (₹${Math.round(feeFreeShare).toLocaleString("en-IN")}/month) comes from payments at or below ₹${p2mThreshold.toLocaleString("en-IN")} — these stay zero-MDR for specified merchants.`,
    details: [
      `The remaining ₹${Math.round(feeBearingShare).toLocaleString("en-IN")}/month (payments above ₹${p2mThreshold.toLocaleString("en-IN")}) would attract an estimated ${p2mRate}% MDR ≈ ₹${Math.round((feeBearingShare * p2mRate) / 100).toLocaleString("en-IN")}/month from ${frameworkLabel}.`,
      "The threshold applies per payment as configured — it is not something you engineer by splitting; acquirers monitor split patterns.",
      shareBelow >= 100
        ? "Your entire mapped intake sits at or below the threshold — estimated zero MDR exposure under this route."
        : "Use the UPI Mix Analyzer to map exactly which payment sizes carry the exposure.",
    ],
    headroom: null,
  };

  // ---- Route 3: bank transfer for B2B
  const bankRoute: ZeroMdrRoute = {
    key: "bank_b2b",
    title: "Bank transfer for invoiced / B2B amounts",
    verdict: "INFO",
    summary: "NEFT/IMPS/RTGS credits to a current account do not carry UPI merchant MDR — the natural route for large-ticket and invoice-based collections.",
    details: [
      "Best fit: wholesale buyers, corporate clients, rent, and any payment you already invoice.",
      "Costs are usually fixed per transfer (often ₹0–₹25 depending on channel) instead of a percentage.",
      "Keep the invoice and bank statement paired — it also strengthens GST and income-tax records.",
    ],
    headroom: null,
  };

  // ---- Route 4: P2P clarification (compliance)
  const p2pRoute: ZeroMdrRoute = {
    key: "p2p_clarification",
    title: "Personal UPI (P2P) — not a business route",
    verdict: "INFO",
    summary: "Genuine person-to-person transfers never carry MDR — but routing business sales through personal QR codes is misclassification, and this tool will never recommend it.",
    details: [
      "Acquirers and payment networks can reclassify personal accounts used for business sales, with funds holds and account closure.",
      "It also breaks your own paper trail: business income needs business records for GST and income tax.",
      "If a payment is genuinely personal (family, friends), P2P is correct — for anything you sell, use a merchant route.",
    ],
    headroom: null,
  };

  // ---- Totals (planning basis)
  let feeFreeMonthly: number;
  let feeBearingMonthly: number;
  let classificationNote: string | null = null;
  if (cls === "small_merchant") {
    if (receipts <= smallLimit) {
      feeFreeMonthly = receipts;
      feeBearingMonthly = 0;
    } else {
      feeFreeMonthly = smallLimit;
      feeBearingMonthly = receipts - smallLimit;
    }
  } else if (cls === "large_merchant") {
    feeFreeMonthly = feeFreeShare;
    feeBearingMonthly = feeBearingShare;
  } else {
    // Not sure → conservative: evaluate as specified merchant (P2M framework)
    feeFreeMonthly = feeFreeShare;
    feeBearingMonthly = feeBearingShare;
    classificationNote =
      "You chose “Not sure” — the estimates below use the specified-merchant (P2M) framework, which is the conservative planning view. If your acquirer classifies you as a qualifying small merchant, your zero-MDR allowance is ₹" +
      smallLimit.toLocaleString("en-IN") +
      "/month via UPI QR instead.";
  }
  const estimatedMonthlyMdr = Math.round(((feeBearingMonthly * p2mRate) / 100) * 100) / 100;
  const estimatedAnnualMdr = Math.round(estimatedMonthlyMdr * 12 * 100) / 100;

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
  const why =
    estimatedMonthlyMdr > 0
      ? `Under the announced framework from ${frameworkLabel}, an estimated ${fmt(feeBearingMonthly)}/month of your ${fmt(receipts)} UPI collections would sit in fee-bearing categories (${p2mRate}% ≈ ${fmt(estimatedMonthlyMdr)}/month, ${fmt(estimatedAnnualMdr)}/year). The zero-MDR routes above cover the remaining ${fmt(feeFreeMonthly)}/month — legitimate categories only, never artificial splitting.`
      : `All ${fmt(receipts)}/month of your mapped UPI collections sit inside zero-MDR categories under the currently configured rules — estimated merchant-side MDR exposure is zero. Keep the eligibility conditions (classification, thresholds, monthly allowances) in mind as your volumes grow.`;

  return {
    asOfLabel,
    frameworkDate: frameworkDate ? frameworkDate.toISOString() : null,
    routes: [smallRoute, p2mRoute, bankRoute, p2pRoute],
    totals: {
      monthlyReceipts: receipts,
      feeFreeMonthly: Math.round(feeFreeMonthly * 100) / 100,
      feeBearingMonthly: Math.round(feeBearingMonthly * 100) / 100,
      estimatedMonthlyMdr,
      estimatedAnnualMdr,
    },
    smallMerchantLimit: smallLimit,
    p2mThreshold,
    p2mRatePercent: p2mRate,
    classificationNote,
    ruleVersionsUsed: versionsUsed,
    why,
    disclaimer:
      "Eligibility states and estimates are based on the rules currently configured in this platform (versioned, sourced, dated). Actual applicability depends on your acquirer's merchant classification, the applicable circular's caps and exclusions, and your bank/payment provider. This check never recommends routing business payments through personal (P2P) accounts or splitting single payments to stay under thresholds.",
    sourceName: p2mFee?.sourceName ?? smallQr?.sourceName ?? null,
    sourceUrl: p2mFee?.sourceUrl ?? smallQr?.sourceUrl ?? null,
    lastVerifiedAt: (p2mFee?.lastVerifiedAt ?? smallQr?.lastVerifiedAt)?.toISOString() ?? null,
  };
}
