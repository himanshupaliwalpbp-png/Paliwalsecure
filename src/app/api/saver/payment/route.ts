/**
 * POST /api/saver/payment — UPI/payment fee estimator (DB-free static rulebook).
 * Request/response contracts mirror the Paliwal Saver /api/calc/payment route.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { calcPaymentFee } from "@/lib/saver/engines/payment";
import {
  sameOrigin,
  clientKey,
  checkRateLimit,
  apiError,
  apiOk,
  safeJson,
} from "@/lib/saver/api-helpers";

const Schema = z.object({
  amount: z.number().positive().max(100000000),
  transactionType: z.enum(["P2M", "P2PM", "P2P"]),
  merchantClassification: z.enum(["small_merchant", "large_merchant", "not_sure"]),
  monthlyUpiReceipts: z.number().min(0).max(1000000000).nullable().optional(),
  businessType: z.string().max(64).nullable().optional(),
  date: z.string().max(32).nullable().optional(),
});

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return apiError("Forbidden origin", 403);
  if (!checkRateLimit(`saver-pay:${clientKey(req)}`, 40)) {
    return apiError("Too many requests — slow down a little.", 429);
  }

  const body = await safeJson(req);
  if (body === null) return apiError("Invalid JSON body");

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const result = await calcPaymentFee(parsed.data);
    return apiOk({ result });
  } catch (e) {
    console.error("[saver/payment] calculation error", e);
    return apiError("Calculation failed — please retry.", 500);
  }
}
