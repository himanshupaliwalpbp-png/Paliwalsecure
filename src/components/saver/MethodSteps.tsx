"use client";

/**
 * MethodSteps — the 3-step "zero-evasion method" strip.
 */

import { BadgeIndianRupee, ScrollText, SlidersHorizontal } from "lucide-react";
import { Reveal, SectionHeading } from "./saver-ui";

const STEPS = [
  {
    n: "01",
    icon: SlidersHorizontal,
    title: "Enter your real numbers",
    body: "Turnover, collection mix, expense categories — plain business estimates. We never ask for PINs, OTPs or bank passwords.",
    tone: "gold" as const,
  },
  {
    n: "02",
    icon: ScrollText,
    title: "We match official rules",
    body: "The engine maps your numbers against RBI MDR circulars, NPCI limits, Section 44AD/44ADA and the GST ITC map — with sources and dates.",
    tone: "emerald" as const,
  },
  {
    n: "03",
    icon: BadgeIndianRupee,
    title: "Save legally — on the record",
    body: "Every rupee of savings comes with the exact rule, eligibility conditions and documents you need. Nothing hidden, nothing evasive.",
    tone: "gold" as const,
  },
];

const TONE_CLS: Record<"gold" | "emerald", { icon: string; num: string }> = {
  gold: { icon: "border-[#D4A853]/30 bg-[#D4A853]/10 text-[#E8C97E]", num: "text-[#D4A853]/25" },
  emerald: { icon: "border-[#2DD4A8]/30 bg-[#2DD4A8]/10 text-[#6FDDB9]", num: "text-[#2DD4A8]/20" },
};

export default function MethodSteps() {
  return (
    <section className="relative py-20 sm:py-28" aria-labelledby="saver-method">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            title="The"
            accent="zero-evasion method"
            sub="Paliwal Saver finds money you are legally entitled to keep — not loopholes that break payment-network or tax rules."
          />
        </Reveal>

        <div className="relative mt-14 grid gap-6 md:grid-cols-3">
          {/* connecting gradient line (desktop) */}
          <div
            className="absolute left-[16%] right-[16%] top-[52px] hidden h-px bg-gradient-to-r from-[#D4A853]/40 via-[#2DD4A8]/40 to-[#D4A853]/40 md:block"
            aria-hidden
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12} className="h-full">
              <div className="saver-glass saver-glass-hover relative h-full rounded-2xl p-6 sm:p-7">
                <span className={`pointer-events-none absolute right-5 top-4 font-mono text-5xl font-bold tabular-nums ${TONE_CLS[s.tone].num}`} aria-hidden>
                  {s.n}
                </span>
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl border ${TONE_CLS[s.tone].icon}`}>
                  <s.icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#FAF7F2]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8B93A1]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
