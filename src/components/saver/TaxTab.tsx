"use client";

/**
 * TaxTab — income-tax engine (POST /api/saver/tax).
 * Sub-mode A "Smart Compare": regular vs presumptive (44AD/44ADA/44AE).
 * Sub-mode B "Quick Regime": new vs old slab comparison (two parallel calls).
 */

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BadgeCheck, Calculator, Loader2, Scale } from "lucide-react";
import { useState } from "react";
import type { RegimeResult } from "@/lib/saver/engines/tax";
import { formatINR } from "@/lib/saver/format";
import { Chip, CountUpMoney, FieldLabel, GlassCard, GoldButton, postJSON, TextInput } from "./saver-ui";

/* ── local result types (tolerant mirrors of engine returns) ── */

type PresumptiveOption = {
  section: string;
  eligible: boolean;
  reasons?: string[];
  applicableLimit?: number;
  deemedIncome: number;
  deemedTax: RegimeResult;
  regularIncome?: number | null;
  regularTax?: RegimeResult | null;
  taxDifference?: number | null;
  compliance?: string[];
  source?: string;
  sourceUrl?: string;
  disclaimer?: string;
};

type CompareResult = {
  presumptiveOptions: PresumptiveOption[];
  regularNew: RegimeResult | null;
  regularOld: RegimeResult | null;
  guidance: string;
  disclaimer: string;
};

const STRUCTURES = [
  { v: "individual", l: "Individual / sole owner" },
  { v: "proprietorship", l: "Proprietorship" },
  { v: "huf", l: "HUF" },
  { v: "partnership", l: "Partnership firm (not LLP)" },
  { v: "llp", l: "LLP" },
  { v: "company", l: "Private limited company" },
];

const BUSINESS_TYPES = [
  { v: "trader", l: "Trader / retailer / manufacturer", prof: false },
  { v: "services", l: "Services business (non-professional)", prof: false },
  { v: "professional", l: "Professional (CA, doctor, lawyer…)", prof: true },
  { v: "freelancer", l: "Freelancer / consultant", prof: true },
  { v: "transport", l: "Goods transport (trucks)", prof: false },
];

const PROFESSIONS = [
  { v: "legal", l: "Legal" },
  { v: "medical", l: "Medical" },
  { v: "engineering", l: "Engineering" },
  { v: "architectural", l: "Architecture" },
  { v: "accountancy", l: "Accountancy" },
  { v: "technical_consultancy", l: "Technical consultancy" },
  { v: "interior_decoration", l: "Interior design" },
  { v: "other_notified", l: "Other notified profession" },
];

function Bar({ pct, tone }: { pct: number; tone: "gold" | "emerald" | "red" | "muted" }) {
  const tones = {
    gold: "from-[#E8C97E] to-[#B8863B]",
    emerald: "from-[#2DD4A8] to-[#0E9E7C]",
    red: "from-[#E86A5E] to-[#B84A40]",
    muted: "from-white/25 to-white/10",
  } as const;
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]" role="presentation">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(2, Math.min(100, pct))}%` }}
        transition={{ duration: 0.9, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={`h-full rounded-full bg-gradient-to-r ${tones[tone]}`}
      />
    </div>
  );
}

function TaxLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1">
      <span className={`text-[13px] ${strong ? "font-semibold text-[#FAF7F2]" : "text-[#8B93A1]"}`}>{label}</span>
      <span className={`font-mono text-[13px] tabular-nums ${strong ? "font-semibold text-[#FAF7F2]" : "text-[#C7CCD4]"}`}>{value}</span>
    </div>
  );
}

function RegimeCard({
  title,
  r,
  best,
  note,
}: {
  title: string;
  r: RegimeResult | null;
  best?: boolean;
  note?: string;
}) {
  if (!r) return null;
  return (
    <div className={`saver-glass relative rounded-2xl p-5 ${best ? "border-[#2DD4A8]/45 shadow-[0_0_44px_-16px_rgba(45,212,168,0.4)]" : ""}`}>
      {best ? (
        <span className="absolute -top-2.5 right-4">
          <Chip tone="emerald">
            <BadgeCheck className="h-3 w-3" aria-hidden /> Best
          </Chip>
        </span>
      ) : null}
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B93A1]">{title}</p>
      <p className={`mt-2 font-mono text-2xl font-bold tabular-nums ${best ? "text-[#2DD4A8]" : "text-[#FAF7F2]"}`}>
        {formatINR(r.totalTax)}
      </p>
      <p className="text-[10px] uppercase tracking-wide text-[#6B7280]">total tax · {r.fy}</p>
      <div className="mt-4 border-t border-white/[0.06] pt-3">
        <TaxLine label="Taxable income" value={formatINR(r.taxableIncome)} />
        <TaxLine label="Tax before rebate" value={formatINR(r.taxBeforeRebate)} />
        <TaxLine label="87A rebate" value={`− ${formatINR(r.rebate)}`} />
        <TaxLine label="Cess (4%)" value={formatINR(r.cess)} />
        <TaxLine label="Total tax" value={formatINR(r.totalTax)} strong />
      </div>
      {note ?? (r.note ? <p className="mt-3 text-[11px] leading-relaxed text-[#7A8290]">{r.note}</p> : null)}
    </div>
  );
}

/* ── Smart Compare ─────────────────────────────────────────────────────────── */

function SmartCompare({ onImpact }: { onImpact: (annual: number | null) => void }) {
  const [structure, setStructure] = useState("proprietorship");
  const [businessType, setBusinessType] = useState("trader");
  const [profession, setProfession] = useState("medical");
  const [receipts, setReceipts] = useState("4500000");
  const [digitalPct, setDigitalPct] = useState(85);
  const [profit, setProfit] = useState("1500000");
  const [deductions, setDeductions] = useState("150000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);

  const isProf = BUSINESS_TYPES.find((b) => b.v === businessType)?.prof ?? false;

  async function run() {
    setLoading(true);
    setError(null);
    const res = await postJSON<{ result: CompareResult }>("/api/saver/tax", {
      mode: "compare",
      structure,
      businessType,
      profession: isProf ? profession : null,
      annualReceipts: Number(receipts) || 0,
      digitalReceiptsPercent: digitalPct,
      estimatedAnnualProfit: profit ? Number(profit) : null,
      vehicles: null,
      oldRegimeDeductions: deductions ? Number(deductions) : null,
    });
    setLoading(false);
    if (!res.ok || !res.data) {
      setError(res.error ?? "Calculation failed — please retry.");
      setResult(null);
      onImpact(null);
      return;
    }
    setResult(res.data.result);
    const opts: Array<{ tax: number }> = [
      ...res.data.result.presumptiveOptions
        .filter((o) => o.eligible)
        .map((o) => ({ tax: o.deemedTax?.totalTax ?? 0 })),
      ...(res.data.result.regularNew ? [{ tax: res.data.result.regularNew.totalTax }] : []),
      ...(res.data.result.regularOld ? [{ tax: res.data.result.regularOld.totalTax }] : []),
    ];
    onImpact(opts.length ? Math.max(0, Math.round(Math.max(...opts.map((o) => o.tax)) - Math.min(...opts.map((o) => o.tax)))) : null);
  }

  const candidates: Array<{ key: string; title: string; tax: number | null; render: React.ReactNode }> = result
    ? [
        ...result.presumptiveOptions.map((o, i) => ({
          key: `p-${i}`,
          title: `Section ${o.section}`,
          tax: o.eligible ? (o.deemedTax?.totalTax ?? null) : null,
          render: null,
        })),
        result.regularNew ? { key: "rn", title: "Regular · New regime", tax: result.regularNew.totalTax, render: null } : null,
        result.regularOld ? { key: "ro", title: "Regular · Old regime", tax: result.regularOld.totalTax, render: null } : null,
      ].filter(Boolean as unknown as <T>(v: T | null) => T is T)
    : [];
  const bestKey = result && candidates.length
    ? candidates.reduce((a, b) => ((a.tax ?? Infinity) <= (b.tax ?? Infinity) ? a : b)).key
    : null;
  const maxTax = result ? Math.max(1, ...candidates.map((c) => c.tax ?? 0)) : 1;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <GlassCard className="p-6 sm:p-7" hover={false}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-[#FAF7F2]">Smart Compare</h3>
          <Chip tone="sienna">44AD · 44ADA · slabs</Chip>
        </div>
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="tx-structure">Business structure</FieldLabel>
              <select id="tx-structure" value={structure} onChange={(e) => setStructure(e.target.value)} className="saver-input h-12 w-full appearance-none rounded-xl pl-4 pr-8 text-sm">
                {STRUCTURES.map((s) => <option key={s.v} value={s.v} className="bg-[#161A21]">{s.l}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="tx-type">Business type</FieldLabel>
              <select id="tx-type" value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="saver-input h-12 w-full appearance-none rounded-xl pl-4 pr-8 text-sm">
                {BUSINESS_TYPES.map((b) => <option key={b.v} value={b.v} className="bg-[#161A21]">{b.l}</option>)}
              </select>
            </div>
          </div>

          {isProf ? (
            <div>
              <FieldLabel htmlFor="tx-prof">Profession (for 44ADA)</FieldLabel>
              <select id="tx-prof" value={profession} onChange={(e) => setProfession(e.target.value)} className="saver-input h-12 w-full appearance-none rounded-xl pl-4 pr-8 text-sm">
                {PROFESSIONS.map((p) => <option key={p.v} value={p.v} className="bg-[#161A21]">{p.l}</option>)}
              </select>
            </div>
          ) : null}

          <div>
            <FieldLabel htmlFor="tx-receipts" hint="turnover / gross receipts">Annual receipts</FieldLabel>
            <TextInput id="tx-receipts" type="number" prefix="₹" value={receipts} onChange={setReceipts} placeholder="4500000" min={0} />
          </div>

          <div>
            <FieldLabel htmlFor="tx-digital" hint={`${digitalPct}% digital`}>Digital receipts share</FieldLabel>
            <input
              id="tx-digital"
              type="range" min={0} max={100} value={digitalPct}
              onChange={(e) => setDigitalPct(Number(e.target.value))}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/[0.08] accent-[#D4A853]"
              aria-valuetext={`${digitalPct} percent digital`}
            />
            <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wide text-[#6B7280]">
              <span>all cash (8% deemed)</span><span>all digital (6% deemed)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="tx-profit" hint="optional">Actual net profit</FieldLabel>
              <TextInput id="tx-profit" type="number" prefix="₹" value={profit} onChange={setProfit} placeholder="600000" min={0} />
            </div>
            <div>
              <FieldLabel htmlFor="tx-ded" hint="old regime">80C+VI-A deductions</FieldLabel>
              <TextInput id="tx-ded" type="number" prefix="₹" value={deductions} onChange={setDeductions} placeholder="150000" min={0} />
            </div>
          </div>

          <GoldButton onClick={run} loading={loading} className="w-full">
            <Scale className="h-4 w-4" aria-hidden />
            {loading ? "Comparing all paths…" : "Compare my tax paths"}
          </GoldButton>
        </div>
      </GlassCard>

      <div aria-live="polite">
        {error ? (
          <GlassCard className="flex items-start gap-3 border-[#E86A5E]/30 p-5" hover={false}>
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#E86A5E]" aria-hidden />
            <p className="text-sm text-[#F09A91]">{error}</p>
          </GlassCard>
        ) : null}

        {!result && !error && !loading ? (
          <GlassCard className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 p-8 text-center" hover={false}>
            <Calculator className="h-6 w-6 text-[#D4A853]" aria-hidden />
            <p className="max-w-sm text-sm leading-relaxed text-[#8B93A1]">
              Compare presumptive taxation (44AD/44ADA) against regular books under both regimes —
              one view, all paths, sourced to the Income-tax Act.
            </p>
          </GlassCard>
        ) : null}

        {loading ? (
          <GlassCard className="flex h-full min-h-[280px] items-center justify-center" hover={false}>
            <Loader2 className="h-6 w-6 animate-spin text-[#D4A853]" aria-label="Calculating" />
          </GlassCard>
        ) : null}

        <AnimatePresence>
          {result ? (
            <motion.div key="tax-res" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-5">
              {/* best path highlight */}
              <div className="saver-glass console-crown relative overflow-hidden rounded-2xl p-6 sm:p-7">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2DD4A8]/70 to-transparent" aria-hidden />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B93A1]">Lowest-tax path (estimate)</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <CountUpMoney
                    amount={Math.min(...candidates.map((c) => c.tax ?? Infinity))}
                    className="crown-total font-mono text-4xl font-bold tabular-nums"
                  />
                  <span className="text-sm text-[#7A8290]">
                    {candidates.find((c) => c.key === bestKey)?.title ?? ""}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-[#9BA3AE]">{result.guidance}</p>
              </div>

              {/* path comparison bars */}
              <GlassCard className="p-5" hover={false}>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B93A1]">All paths · total tax</p>
                <div className="space-y-4">
                  {candidates.map((c) => (
                    <div key={c.key}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <span className={`text-[13px] ${c.key === bestKey ? "font-semibold text-[#6FDDB9]" : "text-[#C7CCD4]"}`}>{c.title}</span>
                        <span className="font-mono text-[13px] font-semibold tabular-nums text-[#FAF7F2]">
                          {c.tax == null ? "not eligible" : formatINR(c.tax)}
                        </span>
                      </div>
                      <Bar pct={((c.tax ?? 0) / maxTax) * 100} tone={c.key === bestKey ? "emerald" : c.tax == null ? "muted" : "gold"} />
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* presumptive details */}
              {result.presumptiveOptions.map((o, i) => (
                <GlassCard key={i} className="p-5" hover={false}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#FAF7F2]">Section {o.section} — presumptive</p>
                    <Chip tone={o.eligible ? "emerald" : "red"}>{o.eligible ? "Eligible" : "Not eligible"}</Chip>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="font-mono text-base font-semibold tabular-nums text-[#FAF7F2]">{formatINR(o.deemedIncome)}</p>
                      <p className="text-[10px] uppercase tracking-wide text-[#6B7280]">deemed income</p>
                    </div>
                    <div>
                      <p className="font-mono text-base font-semibold tabular-nums text-[#FAF7F2]">{formatINR(o.deemedTax?.totalTax)}</p>
                      <p className="text-[10px] uppercase tracking-wide text-[#6B7280]">tax on deemed</p>
                    </div>
                    <div>
                      <p className={`font-mono text-base font-semibold tabular-nums ${(o.taxDifference ?? 0) > 0 ? "text-[#6FDDB9]" : "text-[#C7CCD4]"}`}>
                        {o.taxDifference != null ? (o.taxDifference > 0 ? `− ${formatINR(o.taxDifference)}` : formatINR(o.taxDifference)) : "—"}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-[#6B7280]">vs regular books</p>
                    </div>
                  </div>
                  {o.reasons && o.reasons.length > 0 ? (
                    <ul className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-3">
                      {o.reasons.slice(0, 3).map((r, j) => (
                        <li key={j} className="text-[12px] leading-relaxed text-[#8B93A1]">· {r}</li>
                      ))}
                    </ul>
                  ) : null}
                  {o.compliance && o.compliance.length > 0 ? (
                    <details className="mt-3 group">
                      <summary className="cursor-pointer list-none text-[12px] font-semibold text-[#E8C97E] hover:underline">
                        Compliance notes ({o.compliance.length})
                      </summary>
                      <ul className="mt-2 space-y-1.5">
                        {o.compliance.map((c, j) => (
                          <li key={j} className="text-[12px] leading-relaxed text-[#8B93A1]">· {c}</li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </GlassCard>
              ))}

              {/* regime cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <RegimeCard title="Regular · New regime" r={result.regularNew} best={bestKey === "rn"} />
                <RegimeCard title="Regular · Old regime" r={result.regularOld} best={bestKey === "ro"} />
              </div>

              <p className="px-1 text-[11px] leading-relaxed text-[#5B6270]">{result.disclaimer}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Quick Regime ──────────────────────────────────────────────────────────── */

function QuickRegime({ onImpact }: { onImpact: (annual: number | null) => void }) {
  const [income, setIncome] = useState("1200000");
  const [deductions, setDeductions] = useState("150000");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newR, setNewR] = useState<RegimeResult | null>(null);
  const [oldR, setOldR] = useState<RegimeResult | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    const inc = Number(income) || 0;
    const ded = Number(deductions) || 0;
    const [rn, ro] = await Promise.all([
      postJSON<{ result: RegimeResult }>("/api/saver/tax", { mode: "regime", totalIncome: inc, regime: "new" }),
      postJSON<{ result: RegimeResult }>("/api/saver/tax", { mode: "regime", totalIncome: inc, deductions: ded, regime: "old" }),
    ]);
    setLoading(false);
    if (!rn.ok || !ro.ok || !rn.data || !ro.data) {
      setError(rn.error ?? ro.error ?? "Calculation failed — please retry.");
      setNewR(null); setOldR(null); onImpact(null);
      return;
    }
    setNewR(rn.data.result);
    setOldR(ro.data.result);
    onImpact(Math.max(0, Math.round(Math.max(rn.data.result.totalTax, ro.data.result.totalTax) - Math.min(rn.data.result.totalTax, ro.data.result.totalTax))));
  }

  const best = newR && oldR ? (newR.totalTax <= oldR.totalTax ? "new" : "old") : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <GlassCard className="p-6 sm:p-7" hover={false}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-[#FAF7F2]">Quick Regime Check</h3>
          <Chip tone="gold">New vs Old</Chip>
        </div>
        <div className="mt-6 space-y-5">
          <div>
            <FieldLabel htmlFor="qr-income" hint="gross annual income">Total income</FieldLabel>
            <TextInput id="qr-income" type="number" prefix="₹" value={income} onChange={setIncome} placeholder="1200000" min={0} />
          </div>
          <div>
            <FieldLabel htmlFor="qr-ded" hint="old regime only">Deductions (80C, 80D, VI-A…)</FieldLabel>
            <TextInput id="qr-ded" type="number" prefix="₹" value={deductions} onChange={setDeductions} placeholder="150000" min={0} />
            <p className="mt-2 text-[11px] leading-relaxed text-[#6B7280]">
              Old regime allows Chapter VI-A deductions; new regime has wider slabs + 87A rebate up to ₹60,000.
            </p>
          </div>
          <GoldButton onClick={run} loading={loading} className="w-full">
            {loading ? "Computing both…" : "Compare regimes"}
          </GoldButton>
        </div>
      </GlassCard>

      <div aria-live="polite">
        {error ? (
          <GlassCard className="flex items-start gap-3 border-[#E86A5E]/30 p-5" hover={false}>
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#E86A5E]" aria-hidden />
            <p className="text-sm text-[#F09A91]">{error}</p>
          </GlassCard>
        ) : null}
        {!newR && !error && !loading ? (
          <GlassCard className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 p-8 text-center" hover={false}>
            <Scale className="h-6 w-6 text-[#D4A853]" aria-hidden />
            <p className="max-w-sm text-sm leading-relaxed text-[#8B93A1]">
              New regime or old? Enter income + deductions and see total tax on both sides — slabs,
              87A rebate and cess included.
            </p>
          </GlassCard>
        ) : null}
        {loading ? (
          <GlassCard className="flex h-full min-h-[280px] items-center justify-center" hover={false}>
            <Loader2 className="h-6 w-6 animate-spin text-[#D4A853]" aria-label="Calculating" />
          </GlassCard>
        ) : null}
        <AnimatePresence>
          {newR && oldR ? (
            <motion.div key="qr-res" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="saver-glass console-crown relative overflow-hidden rounded-2xl p-6 sm:p-7">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2DD4A8]/70 to-transparent" aria-hidden />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B93A1]">You save more with the {best === "new" ? "NEW" : "OLD"} regime</p>
                <CountUpMoney
                  amount={Math.abs(newR.totalTax - oldR.totalTax)}
                  className="crown-total mt-2 block font-mono text-4xl font-bold tabular-nums"
                />
                <p className="mt-1 text-sm text-[#7A8290]">
                  {best === "new"
                    ? `New: ${formatINR(newR.totalTax)} vs Old: ${formatINR(oldR.totalTax)}`
                    : `Old: ${formatINR(oldR.totalTax)} vs New: ${formatINR(newR.totalTax)}`}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <RegimeCard title="New regime (FY 2026-27)" r={newR} best={best === "new"} />
                <RegimeCard title="Old regime (with deductions)" r={oldR} best={best === "old"} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Tab shell ─────────────────────────────────────────────────────────────── */

export default function TaxTab({ onImpact }: { onImpact: (annual: number | null) => void }) {
  const [sub, setSub] = useState<"compare" | "regime">("compare");
  return (
    <div>
      <div className="mb-6 inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1" role="tablist" aria-label="Tax calculator mode">
        {(["compare", "regime"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={sub === m}
            onClick={() => setSub(m)}
            className={`relative min-h-[40px] rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] ${
              sub === m ? "text-[#17130A]" : "text-[#9BA3AE] hover:text-[#FAF7F2]"
            }`}
          >
            {sub === m ? (
              <motion.span layoutId="tax-sub-pill" className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#E8C97E] to-[#D4A853]" transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }} />
            ) : null}
            <span className="relative">{m === "compare" ? "Smart Compare" : "Quick Regime"}</span>
          </button>
        ))}
      </div>
      {sub === "compare" ? <SmartCompare onImpact={onImpact} /> : <QuickRegime onImpact={onImpact} />}
    </div>
  );
}
