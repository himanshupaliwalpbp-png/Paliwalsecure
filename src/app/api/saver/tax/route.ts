/**
 * POST /api/saver/tax — income-tax engine (regime / 44AD / 44ADA / 44AE / compare).
 * Request/response contracts mirror the Paliwal Saver /api/calc/tax route.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  computeRegimeTax,
  calc44AD,
  calc44ADA,
  calc44AE,
  calcRegularVsPresumptive,
} from "@/lib/saver/engines/tax";
import {
  sameOrigin,
  clientKey,
  checkRateLimit,
  apiError,
  apiOk,
  safeJson,
} from "@/lib/saver/api-helpers";

const Vehicle = z.object({
  type: z.enum(["heavy", "other"]),
  count: z.number().int().min(1).max(50),
  months: z.number().int().min(1).max(12),
});

const Schema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("regime"),
    totalIncome: z.number().min(0).max(1000000000),
    deductions: z.number().min(0).max(1000000000).optional(),
    regime: z.enum(["new", "old"]),
  }),
  z.object({
    mode: z.literal("44ad"),
    turnover: z.number().min(0).max(1000000000),
    digitalReceiptsPercent: z.number().min(0).max(100),
    structure: z.string().max(32),
    regularNetProfit: z.number().min(0).max(1000000000).nullable().optional(),
  }),
  z.object({
    mode: z.literal("44ada"),
    grossReceipts: z.number().min(0).max(1000000000),
    digitalReceiptsPercent: z.number().min(0).max(100),
    profession: z.string().max(32),
    structure: z.string().max(32),
    regularNetProfit: z.number().min(0).max(1000000000).nullable().optional(),
  }),
  z.object({
    mode: z.literal("44ae"),
    vehicles: z.array(Vehicle).min(1).max(20),
    regularNetProfit: z.number().min(0).max(1000000000).nullable().optional(),
  }),
  z.object({
    mode: z.literal("compare"),
    structure: z.string().max(32),
    businessType: z.string().max(32),
    profession: z.string().max(32).nullable().optional(),
    annualReceipts: z.number().min(0).max(1000000000),
    digitalReceiptsPercent: z.number().min(0).max(100),
    estimatedAnnualProfit: z.number().min(0).max(1000000000).nullable().optional(),
    vehicles: z.array(Vehicle).nullable().optional(),
    oldRegimeDeductions: z.number().min(0).max(1000000000).nullable().optional(),
  }),
]);

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return apiError("Forbidden origin", 403);
  if (!checkRateLimit(`saver-tax:${clientKey(req)}`, 30)) {
    return apiError("Too many requests — slow down a little.", 429);
  }

  const body = await safeJson(req);
  if (body === null) return apiError("Invalid JSON body");

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const d = parsed.data;
    let result: unknown;

    switch (d.mode) {
      case "regime":
        result = await computeRegimeTax({
          totalIncome: d.totalIncome,
          deductions: d.deductions,
          regime: d.regime,
        });
        break;
      case "44ad":
        result = await calc44AD({
          turnover: d.turnover,
          digitalReceiptsPercent: d.digitalReceiptsPercent,
          structure: d.structure,
          regularNetProfit: d.regularNetProfit ?? null,
        });
        break;
      case "44ada":
        result = await calc44ADA({
          grossReceipts: d.grossReceipts,
          digitalReceiptsPercent: d.digitalReceiptsPercent,
          profession: d.profession,
          structure: d.structure,
          regularNetProfit: d.regularNetProfit ?? null,
        });
        break;
      case "44ae":
        result = await calc44AE({
          vehicles: d.vehicles,
          regularNetProfit: d.regularNetProfit ?? null,
        });
        break;
      case "compare":
        result = await calcRegularVsPresumptive({
          structure: d.structure,
          businessType: d.businessType,
          profession: d.profession ?? null,
          annualReceipts: d.annualReceipts,
          digitalReceiptsPercent: d.digitalReceiptsPercent,
          estimatedAnnualProfit: d.estimatedAnnualProfit ?? null,
          vehicles: d.vehicles ?? null,
          oldRegimeDeductions: d.oldRegimeDeductions ?? null,
        });
        break;
    }

    return apiOk({ result });
  } catch (e) {
    console.error("[saver/tax] calculation error", e);
    return apiError("Calculation failed — please retry.", 500);
  }
}
