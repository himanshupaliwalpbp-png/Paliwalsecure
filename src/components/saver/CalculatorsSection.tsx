"use client";

/**
 * CalculatorsSection — the three engine-backed calculators behind a glass
 * tab bar (framer layoutId pill) + aggregated annual-impact summary strip.
 */

import { motion } from "framer-motion";
import { Calculator, ReceiptText, Wallet } from "lucide-react";
import { useState } from "react";
import PayDeskTab from "./PayDeskTab";
import TaxTab from "./TaxTab";
import GstTab from "./GstTab";
import { CountUpMoney, Reveal, SectionHeading } from "./saver-ui";

export type CalcTab = "payments" | "tax" | "gst";

const TABS: Array<{ id: CalcTab; label: string; sub: string; icon: typeof Wallet }> = [
  { id: "payments", label: "PayDesk", sub: "UPI fees & MDR", icon: Wallet },
  { id: "tax", label: "Income Tax", sub: "44AD · regime", icon: Calculator },
  { id: "gst", label: "GST ITC", sub: "input credit", icon: ReceiptText },
];

export default function CalculatorsSection({
  activeTab,
  onTabChange,
}: {
  activeTab: CalcTab;
  onTabChange: (t: CalcTab) => void;
}) {
  const [upi, setUpi] = useState<number | null>(null);
  const [tax, setTax] = useState<number | null>(null);
  const [itc, setItc] = useState<number | null>(null);

  const parts = [
    { label: "UPI fees saved", value: upi },
    { label: "Tax optimised", value: tax },
    { label: "GST ITC recovered", value: itc },
  ].filter((p): p is { label: string; value: number } => p.value != null && p.value > 0);
  const total = parts.reduce((a, p) => a + p.value, 0);

  return (
    <section id="saver-calculators" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Rule-engine calculators"
            title="Three engines."
            accent="Every rupee sourced."
            sub="No sign-up. No data grab. Enter business-level estimates and get rule-matched results with sources, conditions and verification dates."
          />
        </Reveal>

        {/* tab bar */}
        <Reveal delay={0.08}>
          <div
            className="mt-12 flex gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-1.5"
            role="tablist"
            aria-label="Saver calculators"
          >
            {TABS.map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`saver-panel-${t.id}`}
                  id={`saver-tab-${t.id}`}
                  onClick={() => onTabChange(t.id)}
                  className={`relative flex min-h-[56px] flex-1 items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] ${
                    active ? "text-[#17130A]" : "text-[#9BA3AE] hover:text-[#FAF7F2]"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="calc-tab-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#E8C97E] via-[#D4A853] to-[#B8863B] shadow-[0_6px_28px_-8px_rgba(212,168,83,0.55)]"
                      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                    />
                  ) : null}
                  <t.icon className="relative h-4 w-4 shrink-0" aria-hidden />
                  <span className="relative leading-tight">
                    <span className="block text-sm font-bold">{t.label}</span>
                    <span className={`block text-[10px] font-medium uppercase tracking-wider ${active ? "opacity-70" : "opacity-50"}`}>
                      {t.sub}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* panels */}
        <div className="mt-8">
          <div role="tabpanel" id="saver-panel-payments" aria-labelledby="saver-tab-payments" hidden={activeTab !== "payments"}>
            <PayDeskTab onImpact={setUpi} />
          </div>
          <div role="tabpanel" id="saver-panel-tax" aria-labelledby="saver-tab-tax" hidden={activeTab !== "tax"}>
            <TaxTab onImpact={setTax} />
          </div>
          <div role="tabpanel" id="saver-panel-gst" aria-labelledby="saver-tab-gst" hidden={activeTab !== "gst"}>
            <GstTab onImpact={setItc} />
          </div>
        </div>

        {/* annual impact strip */}
        {total > 0 ? (
          <Reveal delay={0.05}>
            <div className="saver-glass relative mt-10 overflow-hidden rounded-2xl p-6 sm:p-7">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4A853]/70 to-transparent" aria-hidden />
              <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8B93A1]">
                    Your annual impact map — this session
                  </p>
                  <CountUpMoney
                    amount={total}
                    className="mt-1.5 block font-mono text-4xl font-bold tabular-nums saver-gold-text"
                  />
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {parts.map((p) => (
                    <span key={p.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[12px] text-[#C7CCD4]">
                      {p.label}: <span className="font-mono font-semibold tabular-nums text-[#FAF7F2]">{new Intl.NumberFormat("en-IN").format(Math.round(p.value))}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
