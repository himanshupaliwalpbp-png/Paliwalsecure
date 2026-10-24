"use client";

/**
 * GstTab — GST input-tax-credit checker (POST /api/saver/gst).
 * Expense entries → eligibility per item, recoverable ITC, blocked credits,
 * missing documents and core statutory conditions.
 */

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, FileCheck2, Loader2, Plus, ReceiptText, ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import type { GstItcResult } from "@/lib/saver/engines/gst";
import { EXPENSE_CATEGORIES, ITC_ELIGIBILITY_META, type ItcEligibility } from "@/lib/saver/constants";
import { formatINR } from "@/lib/saver/format";
import { Chip, CountUpMoney, FieldLabel, GlassCard, GoldButton, postJSON, TextInput } from "./saver-ui";

type Entry = {
  category: string;
  amount: string;
  invoice: boolean;
};

const START_ENTRIES: Entry[] = [
  { category: "rent", amount: "25000", invoice: true },
  { category: "software", amount: "6000", invoice: true },
  { category: "food_beverages", amount: "4000", invoice: true },
];

const TONE_MAP: Record<ItcEligibility, "gold" | "emerald" | "red" | "muted" | "sienna"> = {
  LIKELY_ELIGIBLE: "emerald",
  REQUIRES_REVIEW: "gold",
  NOT_GENERALLY_ELIGIBLE: "red",
  BLOCKED_17_5: "red",
  NOT_APPLICABLE: "muted",
  UNKNOWN: "sienna",
};

function EligibilityBadge({ e }: { e: ItcEligibility }) {
  const meta = ITC_ELIGIBILITY_META[e];
  return <Chip tone={TONE_MAP[e]}>{meta.short ?? meta.label}</Chip>;
}

export default function GstTab({ onImpact }: { onImpact: (annual: number | null) => void }) {
  const [registered, setRegistered] = useState(true);
  const [entries, setEntries] = useState<Entry[]>(START_ENTRIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GstItcResult | null>(null);

  const setEntry = (i: number, patch: Partial<Entry>) =>
    setEntries((rows) => rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  async function run() {
    setLoading(true);
    setError(null);
    const payload = {
      gstRegistered: registered,
      entries: entries
        .filter((e) => Number(e.amount) > 0)
        .map((e) => ({
          category: e.category,
          amount: Number(e.amount),
          invoiceAvailable: e.invoice,
        })),
    };
    if (payload.entries.length === 0) {
      setError("Add at least one expense with an amount.");
      setLoading(false);
      return;
    }
    const res = await postJSON<{ result: GstItcResult }>("/api/saver/gst", payload);
    setLoading(false);
    if (!res.ok || !res.data) {
      setError(res.error ?? "Check failed — please retry.");
      setResult(null);
      onImpact(null);
      return;
    }
    setResult(res.data.result);
    onImpact(res.data.result.totals.potentialItcAnnual);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      {/* ── Form ── */}
      <GlassCard className="p-6 sm:p-7" hover={false}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-[#FAF7F2]">GST ITC Scanner</h3>
          <Chip tone="emerald">Section 16/17(5)</Chip>
        </div>

        <div className="mt-6">
          <FieldLabel hint="required for any ITC">GST registered?</FieldLabel>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="GST registered">
            {[
              { v: true, l: "Yes — I have a GSTIN" },
              { v: false, l: "No / not registered" },
            ].map((o) => (
              <button
                key={String(o.v)}
                type="button"
                role="radio"
                aria-checked={registered === o.v}
                onClick={() => setRegistered(o.v)}
                className={`min-h-[48px] rounded-xl border px-3 text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] ${
                  registered === o.v
                    ? "border-[#D4A853]/60 bg-[#D4A853]/12 text-[#E8C97E]"
                    : "border-white/10 bg-white/[0.03] text-[#9BA3AE] hover:border-white/25"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <FieldLabel hint="incl. GST, monthly">Monthly business expenses</FieldLabel>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
                <div className="flex items-center gap-2.5">
                  <select
                    value={e.category}
                    onChange={(ev) => setEntry(i, { category: ev.target.value })}
                    aria-label={`Expense ${i + 1} category`}
                    className="saver-input h-11 min-w-0 flex-1 appearance-none rounded-lg pl-3 pr-8 text-[13px]"
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key} className="bg-[#161A21]">{c.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setEntries((rows) => rows.filter((_, j) => j !== i))}
                    disabled={entries.length <= 1}
                    aria-label={`Remove expense ${i + 1}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-[#7A8290] transition-colors hover:border-[#E86A5E]/50 hover:text-[#E86A5E] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E86A5E]"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <div className="mt-2.5 flex items-center gap-2.5">
                  <TextInput
                    value={e.amount}
                    onChange={(v) => setEntry(i, { amount: v })}
                    type="number"
                    prefix="₹"
                    placeholder="25000"
                    ariaLabel={`Expense ${i + 1} monthly amount including GST`}
                    className="flex-1"
                    min={0}
                  />
                  <label className="flex shrink-0 cursor-pointer select-none items-center gap-2 text-[12px] text-[#9BA3AE]">
                    <input
                      type="checkbox"
                      checked={e.invoice}
                      onChange={(ev) => setEntry(i, { invoice: ev.target.checked })}
                      className="h-4 w-4 accent-[#D4A853]"
                      aria-label={`Expense ${i + 1} has GST tax invoice`}
                    />
                    Tax invoice
                  </label>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setEntries((rows) => [...rows, { category: "office_supplies", amount: "", invoice: true }])}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-2 text-[13px] font-medium text-[#9BA3AE] transition-all hover:border-[#D4A853]/50 hover:text-[#E8C97E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]"
          >
            <Plus className="h-4 w-4" aria-hidden /> Add expense
          </button>
        </div>

        <div className="mt-6">
          <GoldButton onClick={run} loading={loading} className="w-full">
            <ReceiptText className="h-4 w-4" aria-hidden />
            {loading ? "Scanning rulebook…" : "Scan my ITC"}
          </GoldButton>
        </div>
      </GlassCard>

      {/* ── Results ── */}
      <div aria-live="polite">
        {error ? (
          <GlassCard className="flex items-start gap-3 border-[#E86A5E]/30 p-5" hover={false}>
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#E86A5E]" aria-hidden />
            <p className="text-sm text-[#F09A91]">{error}</p>
          </GlassCard>
        ) : null}

        {!result && !error && !loading ? (
          <GlassCard className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 p-8 text-center" hover={false}>
            <FileCheck2 className="h-6 w-6 text-[#2DD4A8]" aria-hidden />
            <p className="max-w-sm text-sm leading-relaxed text-[#8B93A1]">
              Rent, software, supplies — see which expenses carry claimable input tax credit, which
              are blocked under 17(5), and what documents you are missing.
            </p>
          </GlassCard>
        ) : null}

        {loading ? (
          <GlassCard className="flex h-full min-h-[280px] items-center justify-center" hover={false}>
            <Loader2 className="h-6 w-6 animate-spin text-[#2DD4A8]" aria-label="Scanning" />
          </GlassCard>
        ) : null}

        <AnimatePresence>
          {result ? (
            <motion.div key="gst-res" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="saver-glass relative overflow-hidden rounded-2xl p-6 sm:p-7">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2DD4A8]/70 to-transparent" aria-hidden />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B93A1]">Potential ITC recovery</p>
                <CountUpMoney
                  amount={result.totals.potentialItcAnnual}
                  className="mt-2 block font-mono text-4xl font-bold tabular-nums text-[#2DD4A8] sm:text-5xl"
                />
                <p className="mt-1 text-sm text-[#7A8290]">per year · estimated, before conditions</p>
                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-4 text-center">
                  <div>
                    <p className="font-mono text-base font-semibold tabular-nums text-[#6FDDB9]">{formatINR(result.totals.likelyEligibleItcAnnual)}</p>
                    <p className="text-[10px] uppercase tracking-wide text-[#6B7280]">likely eligible</p>
                  </div>
                  <div>
                    <p className="font-mono text-base font-semibold tabular-nums text-[#E8C97E]">{formatINR(result.totals.requiresReviewItcAnnual)}</p>
                    <p className="text-[10px] uppercase tracking-wide text-[#6B7280]">needs review</p>
                  </div>
                  <div>
                    <p className={`font-mono text-base font-semibold tabular-nums ${result.totals.missingDocumentCount > 0 ? "text-[#F09A91]" : "text-[#C7CCD4]"}`}>
                      {result.totals.missingDocumentCount}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-[#6B7280]">missing docs</p>
                  </div>
                </div>
              </div>

              {/* per-item breakdown */}
              <GlassCard className="overflow-hidden" hover={false}>
                <div className="border-b border-white/[0.06] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B93A1]">Item-by-item eligibility</p>
                </div>
                {result.items.map((it, i) => (
                  <div key={i} className="border-b border-white/[0.06] px-4 py-4 last:border-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-semibold text-[#FAF7F2]">{it.label}</p>
                        <p className="mt-0.5 font-mono text-[11px] tabular-nums text-[#7A8290]">
                          {formatINR(it.monthlyAmount)}/mo · GST {it.gstRate}% · {formatINR(it.gstPaidAnnual)}/yr paid
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <EligibilityBadge e={it.eligibility} />
                        <span className={`font-mono text-[13px] font-semibold tabular-nums ${it.potentialItcAnnual > 0 ? "text-[#6FDDB9]" : "text-[#7A8290]"}`}>
                          {formatINR(it.potentialItcAnnual)}
                        </span>
                      </div>
                    </div>
                    {it.missingDocuments.length > 0 ? (
                      <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-[#D4A853]/90">
                        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                        Missing: {it.missingDocuments.join(" · ")}
                      </p>
                    ) : null}
                  </div>
                ))}
              </GlassCard>

              {/* core conditions */}
              <GlassCard className="p-5" hover={false}>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B93A1]">Statutory conditions for any ITC</p>
                <ul className="mt-3 space-y-2">
                  {result.coreConditions.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed text-[#9BA3AE]">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2DD4A8]" aria-hidden />
                      {c}
                    </li>
                  ))}
                </ul>
                {result.source ? (
                  <a
                    href={result.sourceUrl ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-[12px] font-medium text-[#E8C97E] underline-offset-4 hover:underline"
                  >
                    Source: {result.source} →
                  </a>
                ) : null}
              </GlassCard>

              <p className="px-1 text-[11px] leading-relaxed text-[#5B6270]">{result.disclaimer}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
