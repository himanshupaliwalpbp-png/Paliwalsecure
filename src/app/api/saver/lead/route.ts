/**
 * POST /api/saver/lead — lead capture for the /saver funnel (DB-optional).
 * Validates a 10-digit Indian mobile number with zod, then tries to persist
 * through the repo's existing prisma Lead model (same pattern as
 * /api/leads). If the database is unavailable, the route still returns
 * { ok: true, persisted: false } with 200 so the UI never breaks.
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { clientKey, checkRateLimit, apiError, apiOk, safeJson } from "@/lib/saver/api-helpers";

const Phone = z
  .string()
  .transform((p) => p.replace(/[\s\-()+]/g, ""))
  .refine((p) => /^[6-9]\d{9}$/.test(p), {
    message: "Please provide a valid 10-digit Indian mobile number",
  });

const Schema = z.object({
  phone: Phone,
  name: z.string().min(1).max(120).optional(),
  message: z.string().max(1000).optional(),
  source: z.string().max(64).optional(),
});

export async function POST(req: NextRequest) {
  if (!checkRateLimit(`saver-lead:${clientKey(req)}`, 10)) {
    return apiError("Too many requests — please try again in a minute.", 429);
  }

  const body = await safeJson(req);
  if (body === null) return apiError("Invalid JSON body");

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const { phone, name, message, source } = parsed.data;

  // Try to save to the DB (if available); never fail the request without one.
  try {
    const { db } = await import("@/lib/db");
    await db.lead.create({
      data: {
        name: (name ?? "Saver Lead").trim(),
        email: `${phone}@paliwalinsure.in`,
        phone,
        insuranceType: null,
        city: null,
        message: message ?? null,
        source: source ?? "saver",
        status: "NEW",
      },
    });
    return apiOk({ persisted: true });
  } catch (dbError) {
    // DB not available — log (PII-masked) and succeed anyway
    console.log(
      "[saver/lead] DB not available, lead accepted without persistence:",
      { phone: phone.slice(0, 2) + "********" + phone.slice(-1), source: source ?? "saver" }
    );
    void dbError;
    return apiOk({ persisted: false });
  }
}
