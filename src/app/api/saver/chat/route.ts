/**
 * POST /api/saver/chat — Paliwal Saver AI (compliance-classified, DB-free).
 * Mirrors the Paliwal Saver /api/ai/chat implementation: the compliance
 * classifier runs BEFORE the LLM, the z-ai SDK call follows the same pattern,
 * and any SDK failure degrades to a helpful static reply (never an error).
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import ZAI from "z-ai-web-dev-sdk";
import { classifyCompliance, saverAiSystemPrompt } from "@/lib/saver/compliance";
import {
  sameOrigin,
  clientKey,
  checkRateLimit,
  apiError,
  apiOk,
  safeJson,
} from "@/lib/saver/api-helpers";

export const maxDuration = 60;

const Schema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(10)
    .optional()
    .default([]),
});

const MAX_HISTORY = 8;

const FALLBACK_REPLY = `Paliwal Saver AI is momentarily unavailable — sorry! Meanwhile, you can run your exact numbers yourself in the three /saver calculators on this site:

1. UPI Payment Fee Calculator — estimate the 0.4% MDR above ₹2,000 (P2M) and check zero-MDR categories
2. Income Tax Saver — new vs old regime comparison plus 44AD / 44ADA / 44AE presumptive taxation
3. GST Input Tax Credit Checker — which business expenses may carry claimable ITC, with documents and risk flags

For a personal consultation, WhatsApp Paliwal Secure AI (Himanshu Paliwal, IRDAI Registered POSP IP429834) — the first consult is free. Please try me again in a minute.

Disclaimer: estimates only, not tax advice — verify with a qualified professional before acting.`;

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return apiError("Forbidden origin", 403);
  if (!checkRateLimit(`saver-ai:${clientKey(req)}`, 20)) {
    return apiError("Saver AI needs a short breather — try again in a minute.", 429);
  }

  const body = await safeJson(req);
  if (body === null) return apiError("Invalid JSON body");

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const userMessage = parsed.data.message.trim();

  // 1) Compliance classifier runs BEFORE the LLM — evasion requests never reach the model
  const verdict = classifyCompliance(userMessage);
  if (verdict.flagged && verdict.response) {
    return apiOk({ reply: verdict.response, flagged: true, category: verdict.category });
  }

  // 2) Static, versioned system prompt — no user data is stored or injected (DB-free)
  const system = saverAiSystemPrompt();

  const messages: Array<{ role: "assistant" | "user"; content: string }> = [
    { role: "assistant", content: system },
    ...parsed.data.history.slice(-MAX_HISTORY).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  // 3) LLM call — same construction pattern as the Paliwal Saver app
  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: "disabled" },
    });
    let reply = completion.choices[0]?.message?.content?.trim() ?? "";

    if (!reply) {
      reply =
        "I couldn't produce an answer just now. Could you rephrase? If you were asking for a calculation, try the relevant /saver calculator first and then ask me about the result.";
    }

    // Safety net: strip any accidental evasion instructions from the model
    const low = reply.toLowerCase();
    if (
      /\b(step-by-step|instructions?)\b.{0,40}\b(hide|suppress|fake|fabricat\w*|evade)\b/.test(low)
    ) {
      reply =
        "I can help you find legitimate tax and payment-cost savings, compare eligible options, and organize genuine business expenses and documents. Ask me about payment fee estimates, GST input credit eligibility, presumptive taxation comparison or your document checklist.";
    }

    return apiOk({ reply, flagged: false });
  } catch (e) {
    console.error("[saver/chat] Saver AI error — falling back", e);
    return apiOk({ reply: FALLBACK_REPLY, degraded: true });
  }
}
