"use client";

/**
 * SaverShowcase — homepage showpiece for the /saver module.
 * Dark ink panel with gold/emerald glows, animated counters, a live
 * mini UPI-fee demo and strong CTAs. Sits inside the light homepage
 * as a premium contrast band (like a product launch strip).
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BadgeIndianRupee, MessageCircleQuestion, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatINRPlain } from "@/lib/saver/format";

function useCountUp(target: number, active: boolean, duration = 1400): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration, reduced]);
  return value;
}

const STATS = [
  { amount: 18400, prefix: "₹", suffix: "/yr", label: "UPI fees saved", tone: "gold" },
  { amount: 46800, prefix: "₹", suffix: "/yr", label: "Tax via 44AD", tone: "emerald" },
  { amount: 32200, prefix: "₹", suffix: "/yr", label: "GST ITC back", tone: "emerald" },
];

function Stat({ s, active }: { s: (typeof STATS)[number]; active: boolean }) {
  const v = useCountUp(s.amount, active);
  const color = s.tone === "gold" ? "text-[#E8C97E]" : "text-[#6FDDB9]";
  return (
    <div className="text-center sm:text-left">
      <p className={`font-mono text-2xl font-bold tabular-nums sm:text-3xl ${color}`}>
        {s.prefix}
        {formatINRPlain(Math.round(v))}
        <span className="text-sm opacity-70">{s.suffix}</span>
      </p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8B93A1]">{s.label}</p>
    </div>
  );
}

/** Mini live demo: a ₹2,500 UPI payment vs ₹1,500 — shows the ₹2,000 cliff. */
function MiniDemo() {
  return (
    <div className="saver-glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8B93A1]">UPI P2M · live rule</p>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#6FDDB9]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4A8]" aria-hidden /> engine v1
        </span>
      </div>
      <div className="mt-4 space-y-2.5">
        <div className="flex items-center justify-between rounded-xl border border-[#2DD4A8]/25 bg-[#2DD4A8]/8 px-3.5 py-2.5">
          <span className="font-mono text-sm tabular-nums text-[#FAF7F2]">₹1,500</span>
          <span className="text-[11px] font-semibold text-[#6FDDB9]">ZERO MDR ✓</span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[#E86A5E]/25 bg-[#E86A5E]/8 px-3.5 py-2.5">
          <span className="font-mono text-sm tabular-nums text-[#FAF7F2]">₹2,500</span>
          <span className="font-mono text-[11px] font-semibold text-[#F09A91]">₹10 fee · 0.4%</span>
        </div>
      </div>
      <p className="mt-3.5 text-[11px] leading-relaxed text-[#7A8290]">
        The ₹2,000 cliff, visualised. Above it — the announced 0.4% merchant fee from Oct 2026.
      </p>
    </div>
  );
}

export default function SaverShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();

  return (
    <section ref={ref} className="relative py-16 sm:py-24" aria-labelledby="saver-showcase">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="saver-canvas relative overflow-hidden rounded-3xl border border-white/[0.08] shadow-[0_24px_80px_-32px_rgba(14,17,22,0.5)]"
        >
          {/* glows + grid */}
          <div className="saver-grid-bg absolute inset-0" aria-hidden />
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#D4A853]/16 blur-[90px]" aria-hidden />
          <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#2DD4A8]/12 blur-[90px]" aria-hidden />

          <div className="relative grid items-center gap-10 p-7 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            {/* copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4A853]/40 bg-[#D4A853]/12 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8C97E]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                New · Paliwal Saver
              </span>

              <h2
                id="saver-showcase"
                className="mt-5 font-display text-3xl leading-[1.1] tracking-tight text-[#FAF7F2] sm:text-4xl lg:text-[2.9rem]"
              >
                Business money you can{" "}
                <em className="saver-gold-text font-semibold italic">legally</em> keep —
                calculated, sourced, dated.
              </h2>

              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#9BA3AE]">
                Our new rule-engine reads RBI MDR circulars, Section 44AD and the GST ITC map —
                then shows exactly which fees, taxes and credits your business can save.
                <span className="text-[#E8C97E]"> 100% legal. Zero evasion.</span>
              </p>

              {/* stats */}
              <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6">
                {STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.25 + i * 0.12, duration: 0.5 }}
                  >
                    <Stat s={s} active={inView} />
                  </motion.div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/saver"
                  className="saver-gold-btn inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1116]"
                >
                  <BadgeIndianRupee className="h-4 w-4" aria-hidden />
                  Open Paliwal Saver
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/saver#saver-ai"
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-[#FAF7F2] transition-all hover:border-[#2DD4A8]/50 hover:bg-[#2DD4A8]/10 hover:text-[#7CE8C9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4A8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1116]"
                >
                  <MessageCircleQuestion className="h-4 w-4" aria-hidden />
                  Ask Saver AI
                </Link>
              </div>

              <p className="mt-6 flex items-center gap-2 text-[11px] font-medium text-[#7A8290]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2DD4A8]" aria-hidden />
                Free · no sign-up · sources: RBI · NPCI · ITD · CBIC
              </p>
            </div>

            {/* mini demo */}
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="space-y-4"
            >
              <MiniDemo />
              <div className="saver-glass flex items-center justify-between rounded-2xl px-5 py-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B93A1]">Section 44AD</p>
                  <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#FAF7F2]">
                    6% <span className="text-sm font-medium text-[#9BA3AE]">deemed · digital</span>
                  </p>
                </div>
                <div className="h-10 w-px bg-white/[0.08]" aria-hidden />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B93A1]">GST ITC</p>
                  <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#6FDDB9]">
                    18% <span className="text-sm font-medium text-[#9BA3AE]">on inputs</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
