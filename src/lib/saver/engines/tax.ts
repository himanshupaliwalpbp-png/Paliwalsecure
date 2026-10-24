/**
 * SERVER-SIDE income-tax engine — DB-free static rulebook port.
 * Slabs, rebate, presumptive taxation (44AD/44ADA/44AE) — all read from
 * the in-file STATIC_TAX_RULES (rulebook v1, sourced: Income Tax Department /
 * Income-tax Act, 1961; GST Portal / CBIC for the ITC map in gst.ts).
 */

type Slab = [number, number]; // [upperBound, rate]

type SlabConfig = {
  fy: string;
  ay: string;
  slabs: Slab[];
  cess: number;
  note?: string;
};

type RebateConfig = {
  new: { maxTotalIncome: number; maxRebate: number };
  old: { maxTotalIncome: number; maxRebate: number };
  note?: string;
};

type Cfg44AD = {
  deemedRateDigital: number;
  deemedRateOther: number;
  baseLimit: number;
  higherLimit: number;
  cashReceiptsMaxPercent: number;
  eligibleStructures: string[];
  notes: string;
};

type Cfg44ADA = {
  deemedRate: number;
  baseLimit: number;
  higherLimit: number;
  cashReceiptsMaxPercent: number;
  professions: string[];
  notes: string;
};

type Cfg44AE = {
  maxVehicles: number;
  vehicleRates: {
    heavy: { rate: number; label: string };
    other: { rate: number; label: string };
  };
  notes: string;
};

type TaxRuleMeta = {
  section: string;
  condition: string;
  source: string;
  sourceUrl: string;
  verifiedDate: string; // ISO
};

const ITD = {
  source: "Income Tax Department / Income-tax Act, 1961",
  sourceUrl: "https://incometax.gov.in",
};
const VERIFIED_AT = "2026-09-18T00:00:00.000Z";

// ------------------------------------------------------------- static rulebook (v1)

/**
 * STATIC_TAX_RULES — mirrors the seeded v1 TaxRule payloads of the Paliwal
 * Saver engine exactly (44AD/44ADA/44AE, SLAB_NEW/OLD, REBATE_87A).
 */
export const STATIC_TAX_RULES = {
  "44AD": {
    meta: {
      section: "Section 44AD — Presumptive taxation for eligible businesses",
      condition:
        "Resident individual / HUF / partnership firm (not LLP). Deemed income: 6% of turnover received digitally + 8% otherwise.",
      source: ITD.source,
      sourceUrl: ITD.sourceUrl,
      verifiedDate: VERIFIED_AT,
    } satisfies TaxRuleMeta,
    cfg: {
      deemedRateDigital: 6,
      deemedRateOther: 8,
      baseLimit: 20000000,
      higherLimit: 30000000,
      cashReceiptsMaxPercent: 5,
      eligibleStructures: ["individual", "proprietorship", "huf", "partnership"],
      notes:
        "Turnover limit ₹2 crore; ₹3 crore where total cash receipts ≤ 5% of turnover (and total payments in cash ≤ 5%). Declare at least deemed income to avoid books/audit requirement.",
    } satisfies Cfg44AD,
  },
  "44ADA": {
    meta: {
      section: "Section 44ADA — Presumptive taxation for professionals",
      condition:
        "Resident individual in a specified profession. Deemed income: 50% of gross receipts.",
      source: ITD.source,
      sourceUrl: ITD.sourceUrl,
      verifiedDate: VERIFIED_AT,
    } satisfies TaxRuleMeta,
    cfg: {
      deemedRate: 50,
      baseLimit: 5000000,
      higherLimit: 7500000,
      cashReceiptsMaxPercent: 5,
      professions: [
        "legal", "medical", "engineering", "architectural", "accountancy",
        "technical_consultancy", "interior_decoration", "other_notified",
      ],
      notes:
        "Gross receipts limit ₹50 lakh; ₹75 lakh where cash receipts ≤ 5%. Not for companies/LLPs.",
    } satisfies Cfg44ADA,
  },
  "44AE": {
    meta: {
      section: "Section 44AE — Presumptive income for goods carriages",
      condition:
        "Assessee owning not more than ten goods carriages at any time during the year.",
      source: ITD.source,
      sourceUrl: ITD.sourceUrl,
      verifiedDate: VERIFIED_AT,
    } satisfies TaxRuleMeta,
    cfg: {
      maxVehicles: 10,
      vehicleRates: {
        heavy: { rate: 7500, label: "Heavy goods vehicle (GCM > 12 tonnes)" },
        other: { rate: 3500, label: "Other goods carriage — indicative, verify Rule 7F" },
      },
      notes:
        "Presumptive income per vehicle per month or part thereof. Rates per Income-tax Rules as configured — verify the current Rule 7F before filing.",
    } satisfies Cfg44AE,
  },
  SLAB_NEW: {
    fy: "2026-27",
    ay: "2027-28",
    slabs: [
      [400000, 0], [800000, 0.05], [1200000, 0.10],
      [1600000, 0.15], [2000000, 0.20], [2400000, 0.25], [999999999, 0.30],
    ] as Slab[],
    cess: 0.04,
    note: "Configured slab rates — verify the Finance Act applicable to your year before filing.",
  },
  SLAB_OLD: {
    fy: "—",
    ay: "—",
    slabs: [
      [250000, 0], [500000, 0.05], [1000000, 0.20], [999999999, 0.30],
    ] as Slab[],
    cess: 0.04,
  },
  REBATE_87A: {
    new: { maxTotalIncome: 1200000, maxRebate: 60000 },
    old: { maxTotalIncome: 500000, maxRebate: 12500 },
    note: "Business income does not receive the salary standard deduction — rebate applies to total income.",
  } satisfies RebateConfig,
} as const;

function slabTax(totalIncome: number, slabs: readonly Slab[]): number {
  let tax = 0;
  let prev = 0;
  for (const [upper, rate] of slabs) {
    if (totalIncome > prev) {
      const taxable = Math.min(totalIncome, upper) - prev;
      tax += taxable * rate;
      prev = upper;
    }
  }
  return tax;
}

export type RegimeInput = {
  totalIncome: number; // net taxable income before deductions
  deductions?: number; // Chapter VI-A style deductions (old regime only)
  regime: "new" | "old";
};

export type RegimeResult = {
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

export async function computeRegimeTax(input: RegimeInput): Promise<RegimeResult> {
  const cfg: SlabConfig =
    input.regime === "new" ? STATIC_TAX_RULES.SLAB_NEW : STATIC_TAX_RULES.SLAB_OLD;
  const rebateCfg: RebateConfig = STATIC_TAX_RULES.REBATE_87A;

  const deductions = input.regime === "old" ? Math.max(0, input.deductions ?? 0) : 0;
  const taxableIncome = Math.max(0, input.totalIncome - deductions);

  let tax = slabTax(taxableIncome, cfg.slabs);
  const rb = rebateCfg[input.regime] ?? rebateCfg.new;
  let rebate = 0;
  if (taxableIncome <= rb.maxTotalIncome) {
    rebate = Math.min(tax, rb.maxRebate);
    tax -= rebate;
  }
  const cess = tax * cfg.cess;
  const totalTax = Math.round((tax + cess) * 100) / 100;

  return {
    regime: input.regime,
    fy: cfg.fy,
    ay: cfg.ay,
    totalIncome: input.totalIncome,
    deductions,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    taxBeforeRebate: Math.round(slabTax(taxableIncome, cfg.slabs) * 100) / 100,
    rebate: Math.round(rebate * 100) / 100,
    cess: Math.round(cess * 100) / 100,
    totalTax,
    note: cfg.note,
  };
}

// ------------------------------------------------------------- 44AD

export type Presumptive44ADInput = {
  turnover: number;
  digitalReceiptsPercent: number; // 0-100
  structure: string; // business structure key
  regularNetProfit?: number | null; // estimated net profit if books were kept
};

export async function calc44AD(input: Presumptive44ADInput) {
  const rule = STATIC_TAX_RULES["44AD"];
  const cfg = rule.cfg;

  const digitalShare = Math.min(100, Math.max(0, input.digitalReceiptsPercent)) / 100;
  const digital = input.turnover * digitalShare;
  const other = input.turnover * (1 - digitalShare);
  const deemedIncome = Math.round(((digital * cfg.deemedRateDigital) / 100 + (other * cfg.deemedRateOther) / 100) * 100) / 100;

  const eligibleStructure = cfg.eligibleStructures.includes(input.structure);
  const cashReceiptsPercent = 100 - input.digitalReceiptsPercent;
  const applicableLimit =
    cashReceiptsPercent <= cfg.cashReceiptsMaxPercent ? cfg.higherLimit : cfg.baseLimit;
  const withinLimit = input.turnover <= applicableLimit;

  const eligible = eligibleStructure && withinLimit;

  const reasons: string[] = [];
  if (!eligibleStructure)
    reasons.push(`Structure "${input.structure}" is not eligible for 44AD (eligible: resident individual, HUF, partnership firm — not LLP/company).`);
  if (withinLimit)
    reasons.push(`Turnover ₹${input.turnover.toLocaleString("en-IN")} is within the ₹${applicableLimit.toLocaleString("en-IN")} limit ${cashReceiptsPercent <= cfg.cashReceiptsMaxPercent ? "(higher limit applies as cash receipts ≤ 5%)" : ""}.`);
  else
    reasons.push(`Turnover ₹${input.turnover.toLocaleString("en-IN")} exceeds the applicable ₹${applicableLimit.toLocaleString("en-IN")} limit — regular books/audit may apply.`);

  // Compare with regular taxation (new regime)
  const deemedTax = await computeRegimeTax({ totalIncome: deemedIncome, regime: "new" });
  const regularIncome = input.regularNetProfit ?? null;
  const regularTax = regularIncome != null ? await computeRegimeTax({ totalIncome: Math.max(0, regularIncome), regime: "new" }) : null;

  return {
    section: "44AD",
    eligible,
    reasons,
    applicableLimit,
    deemedRateDigital: cfg.deemedRateDigital,
    deemedRateOther: cfg.deemedRateOther,
    turnover: input.turnover,
    deemedIncome,
    deemedTax,
    regularIncome,
    regularTax,
    taxDifference: regularTax ? Math.round((regularTax.totalTax - deemedTax.totalTax) * 100) / 100 : null,
    compliance: [
      "Declare at least the deemed income (6%/8%) to skip maintaining books and tax audit under 44AB for eligible turnover.",
      "Advance tax: single instalment by 15 March of the financial year (for presumptive assesses).",
      "If you declare lower than deemed income, books of account and audit requirements can apply.",
      "Deductions u/s 30–38 are not allowed additionally — the deemed % replaces them; Chapter VI-A deductions remain available.",
      "Business expenses paid in cash above prescribed limits can disallow the presumptive benefit for that year.",
    ],
    source: rule.meta.source,
    sourceUrl: rule.meta.sourceUrl,
    verifiedDate: rule.meta.verifiedDate,
    disclaimer:
      "Estimated under current configured rules. Presumptive eligibility and limits depend on the Finance Act applicable to your year — confirm with a qualified professional before electing.",
  };
}

// ------------------------------------------------------------- 44ADA

export type Presumptive44ADAInput = {
  grossReceipts: number;
  digitalReceiptsPercent: number;
  profession: string;
  structure: string;
  regularNetProfit?: number | null;
};

export async function calc44ADA(input: Presumptive44ADAInput) {
  const rule = STATIC_TAX_RULES["44ADA"];
  const cfg = rule.cfg;

  const deemedIncome = Math.round((input.grossReceipts * cfg.deemedRate) / 100 * 100) / 100;
  const eligibleStructure = ["individual", "proprietorship"].includes(input.structure);
  const eligibleProfession = cfg.professions.includes(input.profession);
  const cashReceiptsPercent = 100 - input.digitalReceiptsPercent;
  const applicableLimit =
    cashReceiptsPercent <= cfg.cashReceiptsMaxPercent ? cfg.higherLimit : cfg.baseLimit;
  const withinLimit = input.grossReceipts <= applicableLimit;
  const eligible = eligibleStructure && eligibleProfession && withinLimit;

  const reasons: string[] = [];
  if (!eligibleStructure) reasons.push("44ADA is available to resident individuals (not companies/LLPs/HUFs).");
  if (!eligibleProfession) reasons.push("Profession not in the specified list for 44ADA.");
  if (withinLimit)
    reasons.push(`Gross receipts ₹${input.grossReceipts.toLocaleString("en-IN")} within the ₹${applicableLimit.toLocaleString("en-IN")} limit ${cashReceiptsPercent <= cfg.cashReceiptsMaxPercent ? "(higher limit applies as cash receipts ≤ 5%)" : ""}.`);
  else
    reasons.push(`Gross receipts exceed the applicable ₹${applicableLimit.toLocaleString("en-IN")} limit.`);

  const deemedTax = await computeRegimeTax({ totalIncome: deemedIncome, regime: "new" });
  const regularTax = input.regularNetProfit != null
    ? await computeRegimeTax({ totalIncome: Math.max(0, input.regularNetProfit), regime: "new" })
    : null;

  return {
    section: "44ADA",
    eligible,
    reasons,
    applicableLimit,
    deemedRate: cfg.deemedRate,
    grossReceipts: input.grossReceipts,
    deemedIncome,
    deemedTax,
    regularIncome: input.regularNetProfit ?? null,
    regularTax,
    taxDifference: regularTax ? Math.round((regularTax.totalTax - deemedTax.totalTax) * 100) / 100 : null,
    compliance: [
      "Declare at least 50% of gross receipts as income to avoid books/audit requirements.",
      "Advance tax: single instalment by 15 March.",
      "Declaring lower than 50% can attract books + audit requirements.",
      "Chapter VI-A deductions remain available on the deemed income.",
    ],
    source: rule.meta.source,
    sourceUrl: rule.meta.sourceUrl,
    verifiedDate: rule.meta.verifiedDate,
    disclaimer:
      "Estimated under current configured rules. Confirm the specified-profession list and limits for your year with a qualified professional.",
  };
}

// ------------------------------------------------------------- 44AE

export type Presumptive44AEInput = {
  vehicles: Array<{ type: "heavy" | "other"; count: number; months: number }>;
  regularNetProfit?: number | null;
};

export async function calc44AE(input: Presumptive44AEInput) {
  const rule = STATIC_TAX_RULES["44AE"];
  const cfg = rule.cfg;

  let totalVehicles = 0;
  const lines = input.vehicles.map((v) => {
    totalVehicles += v.count;
    const rate = cfg.vehicleRates[v.type]?.rate ?? 0;
    const income = rate * v.count * Math.max(1, v.months);
    return { type: v.type, label: cfg.vehicleRates[v.type]?.label ?? v.type, count: v.count, months: v.months, monthlyRate: rate, income };
  });
  const deemedIncome = Math.round(lines.reduce((a, b) => a + b.income, 0) * 100) / 100;
  const eligible = totalVehicles <= cfg.maxVehicles;

  const deemedTax = await computeRegimeTax({ totalIncome: deemedIncome, regime: "new" });
  const regularTax = input.regularNetProfit != null
    ? await computeRegimeTax({ totalIncome: Math.max(0, input.regularNetProfit), regime: "new" })
    : null;

  return {
    section: "44AE",
    eligible,
    maxVehicles: cfg.maxVehicles,
    reasons: [
      eligible
        ? `${totalVehicles} goods carriage(s) — within the ${cfg.maxVehicles}-vehicle limit for 44AE.`
        : `More than ${cfg.maxVehicles} goods carriages owned — 44AE may not apply; books/audit may be required.`,
    ],
    lines,
    deemedIncome,
    deemedTax,
    regularIncome: input.regularNetProfit ?? null,
    regularTax,
    taxDifference: regularTax ? Math.round((regularTax.totalTax - deemedTax.totalTax) * 100) / 100 : null,
    compliance: [
      "Presumptive income is per vehicle per month or part thereof.",
      "No additional expense deductions (30–38) on the presumptive income.",
      "Advance tax: single instalment by 15 March.",
      "Rates configured per Income-tax Rules — verify the current Rule 7F before filing.",
    ],
    source: rule.meta.source,
    sourceUrl: rule.meta.sourceUrl,
    verifiedDate: rule.meta.verifiedDate,
    disclaimer: "Estimated under current configured rules. Vehicle-type definitions follow the Income-tax Rules — verify current rates.",
  };
}

// ------------------------------------------------------- regular vs presumptive

export type RegularVsPresumptiveInput = {
  structure: string;
  businessType: string;
  profession?: string | null;
  annualReceipts: number; // turnover or gross receipts
  digitalReceiptsPercent: number;
  estimatedAnnualProfit?: number | null;
  vehicles?: Array<{ type: "heavy" | "other"; count: number; months: number }> | null;
  oldRegimeDeductions?: number | null;
};

export async function calcRegularVsPresumptive(input: RegularVsPresumptiveInput) {
  const results: Array<Record<string, unknown>> = [];

  // 44AD path (businesses)
  if (input.businessType !== "professional" && input.businessType !== "freelancer") {
    const r44ad = await calc44AD({
      turnover: input.annualReceipts,
      digitalReceiptsPercent: input.digitalReceiptsPercent,
      structure: input.structure,
      regularNetProfit: input.estimatedAnnualProfit ?? null,
    });
    results.push(r44ad as unknown as Record<string, unknown>);
  }

  // 44ADA path (professionals)
  if (
    (input.businessType === "professional" || input.businessType === "freelancer") &&
    input.profession
  ) {
    const r44ada = await calc44ADA({
      grossReceipts: input.annualReceipts,
      digitalReceiptsPercent: input.digitalReceiptsPercent,
      profession: input.profession,
      structure: input.structure,
      regularNetProfit: input.estimatedAnnualProfit ?? null,
    });
    results.push(r44ada as unknown as Record<string, unknown>);
  }

  // 44AE path (transport)
  if (input.businessType === "transport" && input.vehicles && input.vehicles.length > 0) {
    const r44ae = await calc44AE({
      vehicles: input.vehicles,
      regularNetProfit: input.estimatedAnnualProfit ?? null,
    });
    results.push(r44ae as unknown as Record<string, unknown>);
  }

  // Regular taxation under both regimes
  const regularIncome = input.estimatedAnnualProfit ?? null;
  const regularNew = regularIncome != null ? await computeRegimeTax({ totalIncome: Math.max(0, regularIncome), regime: "new" }) : null;
  const regularOld = regularIncome != null && (input.oldRegimeDeductions ?? 0) > 0
    ? await computeRegimeTax({ totalIncome: Math.max(0, regularIncome), regime: "old", deductions: input.oldRegimeDeductions ?? 0 })
    : null;

  return {
    presumptiveOptions: results,
    regularNew,
    regularOld,
    guidance:
      "Compare eligibility and estimated outcomes — presumptive taxation trades lower compliance for a deemed income that may exceed your actual profit. Where actual profit is materially lower than the deemed rate, regular assessment with books can result in lower tax (with audit obligations where applicable). This is an estimate, not advice to choose either way.",
    disclaimer:
      "Estimated under current configured rules and the information you entered. Section limits, deemed rates and slab rates change with Finance Acts — verify for your year before acting.",
  };
}

// ------------------------------------------- (GST ITC map lives in gst.ts)
