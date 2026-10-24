/**
 * SERVER-SIDE GST / Input Tax Credit engine — DB-free static rulebook port.
 * Eligibility states: LIKELY_ELIGIBLE | REQUIRES_REVIEW | NOT_GENERALLY_ELIGIBLE |
 * BLOCKED_17_5 | NOT_APPLICABLE | UNKNOWN — never a guaranteed credit.
 * BLOCKED_17_5 marks statutory blocked credits (Section 17(5) — food &
 * beverages, outdoor catering, certain insurance): no ITC is computed.
 */
import { EXPENSE_CATEGORIES } from "../constants";
import type { ItcEligibility } from "../constants";

export type ExpenseInput = {
  category: string; // key from EXPENSE_CATEGORIES
  amount: number; // monthly amount INCLUDING GST
  gstRate?: number; // override; defaults to category typical rate
  businessUsePercent?: number; // 0-100
  invoiceAvailable?: boolean;
  paymentMode?: string | null;
  notes?: string | null;
};

export type ExpenseEvaluation = {
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
  items: ExpenseEvaluation[];
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

// ------------------------------------------------------------- static rulebook (v1)

type ItcCategoryCfg = {
  key: string;
  label: string;
  typicalGstRate: number;
  eligibility: ItcEligibility;
  conditions: string[];
  documents: string[];
  riskFlags: string[];
  notes: string;
};

function itcConditions(key: string): string[] {
  switch (key) {
    case "rent":
      return ["Commercial premises used for business", "Landlord is GST-registered and charges GST on rent", "Rent invoice quotes your GSTIN"];
    case "internet":
    case "software":
    case "advertising":
    case "office_supplies":
      return ["Used in course or furtherance of business", "Tax invoice with your GSTIN", "Personal-use portion excluded"];
    case "professional_fees":
      return ["Service received in course of business", "Not blocked under Section 17(5)", "Tax invoice available"];
    case "business_travel":
      return ["Travel is for business purpose", "Food & beverage and certain employee travel benefits are blocked credits u/s 17(5) — review the split", "Tax invoice available"];
    case "food_beverages":
      return ["Food, beverages and catering are blocked credits u/s 17(5) — no ITC arises", "A statutory canteen may be an exception — verify before claiming", "Track the spend for income-tax deduction instead of GST credit"];
    case "repairs":
      return ["Premises/equipment repairs usually eligible", "Motor-vehicle repairs restricted where the vehicle itself is a blocked credit", "Tax invoice available"];
    case "raw_materials":
    case "inventory":
    case "equipment":
      return ["Goods received and used in business", "Tax invoice with GSTIN", "Supplier tax deposited (GSTR-2B match)"];
    default:
      return ["Verify the expense is used in course or furtherance of business", "Obtain a tax invoice quoting your GSTIN", "Confirm the category is not a blocked credit under Section 17(5)"];
  }
}

function itcDocuments(key: string): string[] {
  const base = ["Tax invoice with supplier GSTIN and your GSTIN", "Payment proof (bank/UPI statement)", "GSTR-2B reconciliation record"];
  switch (key) {
    case "equipment":
      return [...base, "Fixed-asset register entry", "Business-purpose note"];
    case "business_travel":
      return [...base, "Travel authorization / purpose note"];
    case "food_beverages":
      return [...base, "Canteen statutory exception proof, if claimed"];
    case "rent":
      return [...base, "Registered leave & licence agreement"];
    default:
      return [...base, "Business-purpose note"];
  }
}

function itcRiskFlags(key: string): string[] {
  switch (key) {
    case "electricity":
    case "salary":
    case "loan_interest":
      return ["No GST is charged on this head — no ITC arises"];
    case "fuel":
      return ["Motor fuel largely outside/blocked GST credit — claiming may trigger notice"];
    case "insurance":
      return ["Health/life premiums are blocked credits u/s 17(5) except statutory covers"];
    case "business_travel":
      return ["Food, beverages and employee travel benefits are blocked credits — split carefully"];
    case "food_beverages":
      return ["Blocked credit u/s 17(5) — GST paid here cannot be claimed as ITC", "Claiming blocked credits is a common trigger for GST notices"];
    case "repairs":
      return ["Vehicle-linked repairs may be blocked where the vehicle is a blocked credit"];
    default:
      return ["Credit allowed only if supplier has deposited the tax — match GSTR-2B before claiming"];
  }
}

/**
 * GST_ITC_MAP — static rulebook v1 (mirrors the seeded GST_ITC_MAP payload:
 * categories from EXPENSE_CATEGORIES + Section 16 / 17(5) conditions).
 */
export const GST_ITC_MAP: {
  categories: ItcCategoryCfg[];
  coreConditions: string[];
} = {
  categories: EXPENSE_CATEGORIES.map((c) => ({
    key: c.key,
    label: c.label,
    typicalGstRate: c.typicalGstRate,
    eligibility: c.eligibility,
    conditions: itcConditions(c.key),
    documents: itcDocuments(c.key),
    riskFlags: itcRiskFlags(c.key),
    notes: c.hint,
  })),
  coreConditions: [
    "You hold an active GST registration",
    "Supplier has charged GST on a valid tax invoice quoting your GSTIN",
    "Goods or services have been received",
    "Supplier has deposited the tax and it appears in your GSTR-2B",
    "You have filed the relevant return (GSTR-3B) within time",
    "The credit is not blocked under Section 17(5)",
    "The input is used in the course or furtherance of business",
  ],
};

const GSTP = {
  source: "GST Portal / CBIC",
  sourceUrl: "https://www.gst.gov.in",
  verifiedDate: "2026-09-18T00:00:00.000Z",
};

export async function evaluateGstItc(
  gstRegistered: boolean,
  entries: ExpenseInput[]
): Promise<GstItcResult> {
  const cfg = GST_ITC_MAP;
  const map: Record<string, ItcCategoryCfg> = {};
  for (const c of cfg.categories) map[c.key] = c;

  const items: ExpenseEvaluation[] = entries.map((e) => {
    const meta = map[e.category] ?? {
      key: e.category,
      label: e.category,
      typicalGstRate: 18,
      eligibility: "UNKNOWN" as ItcEligibility,
      conditions: ["Verify the expense is for business use", "Obtain a tax invoice quoting your GSTIN"],
      documents: ["Tax invoice", "Payment proof"],
      riskFlags: ["Unclassified category — verify before claiming"],
      notes: "Category not recognised — classify it to assess ITC.",
    };
    const gstRate = e.gstRate ?? meta.typicalGstRate ?? 0;
    const bu = Math.min(100, Math.max(0, e.businessUsePercent ?? 100)) / 100;
    const gstPaidMonthly = Math.round(((e.amount * gstRate) / (100 + gstRate)) * 100) / 100;
    const eligibleForCredit =
      meta.eligibility === "LIKELY_ELIGIBLE" || meta.eligibility === "REQUIRES_REVIEW";
    const potentialItcMonthly =
      gstRegistered && eligibleForCredit ? Math.round(gstPaidMonthly * bu * 100) / 100 : 0;

    const missingDocuments: string[] = [];
    if (gstRegistered && gstRate > 0 && eligibleForCredit) {
      if (!e.invoiceAvailable) missingDocuments.push("Tax invoice with GSTIN");
      if (!e.paymentMode || e.paymentMode === "cash")
        missingDocuments.push("Payment proof (bank/UPI statement for payments above prescribed cash limits)");
      missingDocuments.push(
        "GSTR-2B reconciliation record",
        "Business-purpose note"
      );
    }

    return {
      category: e.category,
      label: meta.label,
      monthlyAmount: e.amount,
      annualAmount: e.amount * 12,
      gstRate,
      gstPaidMonthly,
      gstPaidAnnual: gstPaidMonthly * 12,
      potentialItcMonthly,
      potentialItcAnnual: potentialItcMonthly * 12,
      eligibility: !gstRegistered ? ("NOT_APPLICABLE" as ItcEligibility) : meta.eligibility,
      conditions: meta.conditions,
      documents: meta.documents,
      riskFlags: meta.riskFlags,
      missingDocuments,
      notes: e.notes ?? meta.notes ?? null,
    };
  });

  const sum = (f: (i: ExpenseEvaluation) => number) =>
    Math.round(items.reduce((a, i) => a + f(i), 0) * 100) / 100;

  return {
    gstRegistered,
    items,
    totals: {
      monthlyExpenses: sum((i) => i.monthlyAmount),
      annualExpenses: sum((i) => i.annualAmount),
      gstPaidAnnual: sum((i) => i.gstPaidAnnual),
      potentialItcAnnual: sum((i) => i.potentialItcAnnual),
      likelyEligibleItcAnnual: sum((i) => (i.eligibility === "LIKELY_ELIGIBLE" ? i.potentialItcAnnual : 0)),
      requiresReviewItcAnnual: sum((i) => (i.eligibility === "REQUIRES_REVIEW" ? i.potentialItcAnnual : 0)),
      missingDocumentCount: items.reduce((a, i) => a + i.missingDocuments.length, 0),
    },
    coreConditions: cfg.coreConditions,
    source: GSTP.source,
    sourceUrl: GSTP.sourceUrl,
    verifiedDate: GSTP.verifiedDate,
    disclaimer:
      "Potential ITC — subject to eligibility conditions. No credit is guaranteed until statutory conditions (valid tax invoice, receipt of goods/services, supplier tax deposit, GSTR-2B match, timely return, non-blocked category) are satisfied.",
  };
}
