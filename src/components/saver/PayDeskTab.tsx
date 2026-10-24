"use client";

/**
 * PayDeskTab — UPI/payment fee calculator (POST /api/saver/payment).
 * Scenarios (today + upcoming rule dates), monthly/annual impact,
 * potential saving, sources & rule version.
 */

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, ExternalLink, Info, Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import type { FeeScenario, PaymentFeeResult } from "@/lib/saver/engines/payment";
import { formatINR } from "@/lib/saver/format";
import {
  Chip,
  CountUpMoney,
  EngineStatusChip,
  FieldLabel,
  GlassCard,
  GoldButton,
  postJSON,
  TextInput,
} from "./saver-ui";

const AMOUNT_CHIPS = [500, 2000, 5000, 25000];

const TX_TYPES = [
  { value: "P2M", label: "P2M", hint: "You are a merchant (QR / business)" },
  { value: "P2PM", label: "P2PM", hint: "Small-merchant via QR" },
  { value: "P2P", label: "P2P", hint: "Person to person" },
] as const;

const CLASSIFICATIONS = [
  { value: "small_merchant", label: "Small merchant (QR ≤ ₹1L/mo allowance)" },
  { value: "large_merchant", label: "Large merchant / business" },
  { value: "not_sure", label: "Not sure — show both" },
] as const;

function ScenarioRow({ s }: { s: FeeScenario }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-white/[0.06] px-4 py-3.5 last:border-0 sm:grid-cols-[1.4fr_1fr_1fr_auto]">
      <div>
        <p className="text-[13px] font-semibold text-[#FAF7F2]">{s.label}</p>
        <p className="mt-0.5 text-[11px] text-[#7A8290]">
          {s.ruleName ?? "No configured rule"} · {s.dateISO}
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <p className="font-mono text-sm tabular-nums text-[#C7CCD4]">{s.ratePercent.toFixed(2)}%</p>
        <p className="text-[10px] uppercase tracking-wide text-[#6B7280]">rate</p>
      </div>
      <div className="text-right">
        <p className={`font-mono text-sm font-semibold tabular-nums ${s.fee > 0 ? "text-[#F09A91]" : "text-[#6FDDB9]"}`}>
          {formatINR(s.fee, { decimals: 2 })}
        </p>
        <p className="text-[10px] uppercase tracking-wide text-[#6B7280]">fee</p>
      </div>
      <div className="justify-self-end">
        <EngineStatusChip status={s.status} />
      </div>
    </div>
  );
}

export default function PayDeskTab({ onImpact }: { onImpact: (annual: number | null) => void }) {
  const [amount, setAmount] = useState("2500");
  const [txType, setTxType] = useState<"P2M" | "P2PM" | "P2P">("P2M");
  const [classification, setClassification] = useState<string>("small_merchant");
  const [monthlyReceipts, setMonthlyReceipts] = useState("80000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PaymentFeeResult | null>(null);
  const [showWhy, setShowWhy] = useState(false);

  async function calculate() {
    setLoading(true);
    setError(null);
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid payment amount.");
      setLoading(false);
      return;
    }
    const res = await postJSON<{ result: PaymentFeeResult }>("/api/saver/payment", {
      amount: amt,
      transactionType: txType,
      merchantClassification: classification,
      monthlyUpiReceipts: monthlyReceipts ? Number(monthlyReceipts) : null,
      businessType: null,
      date: null,
    });
    setLoading(false);
    if (!res.ok || !res.data) {
      setError(res.error ?? "Calculation failed — please retry.");
      setResult(null);
      onImpact(null);
      return;
    }
    setResult(res.data.result);
    onImpact(res.data.result.potentialSaving ?? res.data.result.annualImpact ?? null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      {/* ── Form ── */}
      <GlassCard className="p-6 sm:p-7" hover={false}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-[#FAF7F2]">PayDesk — UPI fee finder</h3>
          <Chip tone="gold">P2M · 0.4% &gt; ₹2,000</Chip>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <FieldLabel htmlFor="pd-amount" hint="per payment">Payment amount</FieldLabel>
            <TextInput id="pd-amount" type="number" prefix="₹" value={amount} onChange={setAmount} placeholder="2500" min={1} />
            <div className="mt-2.5 flex flex-wrap gap-2">
              {AMOUNT_CHIPS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAmount(String(c))}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs tabular-nums transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] ${
                    Number(amount) === c
                      ? "border-[#D4A853]/60 bg-[#D4A853]/15 text-[#E8C97E]"
                      : "border-white/10 bg-white/[0.03] text-[#9BA3AE] hover:border-[#D4A853]/40 hover:text-[#E8C97E]"
                  }`}
                  aria-pressed={Number(amount) === c}
                >
                  ₹{c.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>Transaction type</FieldLabel>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Transaction type">
              {TX_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  role="radio"
                  aria-checked={txType === t.value}
                  title={t.hint}
                  onClick={() => setTxType(t.value)}
                  className={`min-h-[48px] rounded-xl border px-2 py-2.5 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] ${
                    txType === t.value
                      ? "border-[#D4A853]/60 bg-[#D4A853]/12 text-[#E8C97E]"
                      : "border-white/10 bg-white/[0.03] text-[#9BA3AE] hover:border-white/25"
                  }`}
                >
                  <span className="block font-mono text-sm font-semibold">{t.label}</span>
                  <span className="mt-0.5 block text-[9px] uppercase tracking-wide opacity-70">
                    {t.value === "P2M" ? "merchant" : t.value === "P2PM" ? "small QR" : "personal"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="pd-class" hint="from your bank / PSP">Merchant classification</FieldLabel>
            <select
              id="pd-class"
              value={classification}
              onChange={(e) => setClassification(e.target.value)}
              className="saver-input h-12 w-full appearance-none rounded-xl pl-4 pr-10 text-sm"
            >
              {CLASSIFICATIONS.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#161A21] text-[#FAF7F2]">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel htmlFor="pd-monthly" hint="optional">Monthly UPI collections</FieldLabel>
            <TextInput id="pd-monthly" type="number" prefix="₹" value={monthlyReceipts} onChange={setMonthlyReceipts} placeholder="80000" min={0} />
          </div>

          <GoldButton onClick={calculate} loading={loading} className="w-full">
            {loading ? "Matching rules…" : "Check my fees"}
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4A853]/25 bg-[#D4A853]/8">
              <TrendingDown className="h-5 w-5 text-[#D4A853]" aria-hidden />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#8B93A1]">
              Enter an amount and check fees under the announced 0.4% UPI P2M framework — plus which
              zero-MDR categories your business may qualify for.
            </p>
          </GlassCard>
        ) : null}

        {loading ? (
          <GlassCard className="flex h-full min-h-[280px] items-center justify-center p-8" hover={false}>
            <Loader2 className="h-6 w-6 animate-spin text-[#D4A853]" aria-label="Calculating" />
          </GlassCard>
        ) : null}

        <AnimatePresence>
          {result ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="space-y-5"
            >
              {/* highlight card */}
              <div className="saver-glass console-crown relative overflow-hidden rounded-2xl p-6 sm:p-7">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2DD4A8]/70 to-transparent" aria-hidden />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B93A1]">
                  {result.potentialSaving != null ? "Potential legal saving" : "Fee exposure today"}
                </p>
                <CountUpMoney
                  amount={result.potentialSaving ?? result.annualImpact ?? 0}
                  className="crown-total mt-2 block font-mono text-4xl font-bold tabular-nums sm:text-5xl"
                />
                <p className="mt-1 text-sm text-[#7A8290]">per year · estimated</p>
                {result.savingWhy ? (
                  <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-[#C7CCD4]">
                    <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#2DD4A8]" aria-hidden />
                    {result.savingWhy}
                  </p>
                ) : null}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-mono text-lg font-semibold tabular-nums text-[#F09A91]">
                        {formatINR(result.monthlyImpact)}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-[#6B7280]">monthly fees</p>
                    </div>
                    <div>
                      <p className="font-mono text-lg font-semibold tabular-nums text-[#F09A91]">
                        {formatINR(result.annualImpact)}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-[#6B7280]">annual fees</p>
                    </div>
                  </div>
              </div>

              {/* scenarios */}
              <GlassCard className="overflow-hidden" hover={false}>
                <div className="border-b border-white/[0.06] px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B93A1]">
                    Scenarios — today &amp; upcoming rule dates
                  </p>
                </div>
                {result.scenarios.map((s) => (
                  <ScenarioRow key={`${s.dateISO}-${s.label}`} s={s} />
                ))}
              </GlassCard>

              {/* why + sources */}
              <GlassCard hover={false}>
                <button
                  type="button"
                  onClick={() => setShowWhy((v) => !v)}
                  aria-expanded={showWhy}
                  className="flex w-full items-center justify-between px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#FAF7F2]">
                    <Info className="h-4 w-4 text-[#D4A853]" aria-hidden />
                    Why this is legal — rules, sources &amp; version
                  </span>
                  <ChevronDown className={`h-4 w-4 text-[#7A8290] transition-transform ${showWhy ? "rotate-180" : ""}`} aria-hidden />
                </button>
                <AnimatePresence initial={false}>
                  {showWhy ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 border-t border-white/[0.06] px-5 py-4">
                        <p className="text-[13px] leading-relaxed text-[#9BA3AE]">{result.why}</p>
                        {result.ruleVersionsUsed.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {result.ruleVersionsUsed.map((rv) => (
                              <Chip key={rv.id} tone="muted">
                                rulebook v{rv.version} · {rv.ruleType}
                              </Chip>
                            ))}
                          </div>
                        ) : null}
                        {result.scenarios
                          .filter((s) => s.sourceName)
                          .slice(0, 3)
                          .map((s) => (
                            <a
                              key={s.label}
                              href={s.sourceUrl ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-[13px] font-medium text-[#E8C97E] underline-offset-4 hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                              {s.sourceName}
                              {s.lastVerifiedAt ? ` · verified ${s.lastVerifiedAt.slice(0, 10)}` : ""}
                            </a>
                          ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </GlassCard>

              <p className="px-1 text-[11px] leading-relaxed text-[#5B6270]">{result.disclaimer}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
