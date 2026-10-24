/**
 * POST /api/saver/gst — GST input tax credit evaluator (DB-free static rulebook).
 * Request/response contracts mirror the Paliwal Saver /api/calc/gst-itc route.
 * The `persist` flag is accepted for schema compatibility but ignored — this
 * port is DB-free and stores nothing.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { evaluateGstItc } from "@/lib/saver/engines/gst";
import {
  sameOrigin,
  clientKey,
  checkRateLimit,
  apiError,
  apiOk,
  safeJson,
} from "@/lib/saver/api-helpers";

const Entry = z.object({
  category: z.string().max(48),
  amount: z.number().min(0).max(100000000),
  gstRate: z.number().min(0).max(28).optional(),
  businessUsePercent: z.number().min(0).max(100).optional(),
  invoiceAvailable: z.boolean().optional(),
  paymentMode: z.string().max(32).nullable().optional(),
  notes: z.string().max(240).nullable().optional(),
});

const Schema = z.object({
  gstRegistered: z.boolean(),
  entries: z.array(Entry).min(1).max(60),
  persist: z.boolean().optional().default(true),
});

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return apiError("Forbidden origin", 403);
  if (!checkRateLimit(`saver-gst:${clientKey(req)}`, 30)) {
    return apiError("Too many requests — slow down a little.", 429);
  }

  const body = await safeJson(req);
  if (body === null) return apiError("Invalid JSON body");

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  try {
    const result = await evaluateGstItc(parsed.data.gstRegistered, parsed.data.entries);
    return apiOk({ result });
  } catch (e) {
    console.error("[saver/gst] calculation error", e);
    return apiError("Calculation failed — please retry.", 500);
  }
}
