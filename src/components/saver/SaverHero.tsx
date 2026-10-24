"use client";

/**
 * SaverHero — full-viewport dark hero: gold/emerald glows, dot grid,
 * Fraunces display headline with gold italic accent, live savings ticker card.
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, BadgeIndianRupee, MessageCircleQuestion, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Chip, GhostButton, GoldButton } from "./saver-ui";

const TICKER_STATS = [
  { label: "UPI fees saved per year", amount: 18400, note: "Zero-MDR routing, small-merchant QR" },
  { label: "Tax saved via Section 44AD", amount: 46800, note: "6% deemed on digital turnover" },
  { label: "GST input credit recovered", amount: 32200, note: "Rent, software & supplies ITC" },
];

function TickerStat({ stat }: { stat: (typeof TICKER_STATS)[number] }) {
  return (
    <motion.div
      key={stat.label}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
      role="status"
      aria-label={`Example: ${stat.label}`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#8B93A1]">
          {stat.label}
        </span>
      </div>
      <div className="mt-1 font-mono text-3xl font-semibold tabular-nums text-[#2DD4A8] sm:text-[2.1rem]">
        ₹{stat.amount.toLocaleString("en-IN")}
        <span className="text-sm text-[#6FDDB9]">/yr</span>
      </div>
      <p className="mt-1 text-xs text-[#7A8290]">{stat.note}</p>
    </motion.div>
  );
}

export default function SaverHero() {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setTick((v) => (v + 1) % TICKER_STATS.length), 4200);
    return () => clearInterval(t);
  }, [reduced]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <section className="relative overflow-hidden" aria-labelledby="saver-hero-h1">
      {/* backdrop layers */}
      <div className="saver-grid-bg absolute inset-0" aria-hidden />
      <div
        className="absolute -top-32 left-[8%] h-80 w-80 rounded-full bg-[#D4A853]/14 blur-[110px]"
        aria-hidden
      />
      <div
        className="absolute right-[4%] top-24 h-72 w-72 rounded-full bg-[#2DD4A8]/10 blur-[100px]"
        aria-hidden
      />
      {/* oversized decorative ₹ glyph */}
      <span
        className="pointer-events-none absolute -right-10 bottom-[-70px] select-none font-display text-[22rem] leading-none text-white/[0.025]"
        aria-hidden
      >
        ₹
      </span>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pb-28">
        {/* ── Copy column ── */}
        <div>
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4A853]/35 bg-[#D4A853]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#E8C97E]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Paliwal Saver · 100% Legal
            </span>
          </motion.div>

          <motion.h1
            id="saver-hero-h1"
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mt-6 font-display text-[2.6rem] leading-[1.05] tracking-tight text-[#FAF7F2] sm:text-6xl lg:text-[4.2rem]"
          >
            How much business money can you{" "}
            <em className="saver-gold-text font-semibold italic">legally</em> save?
          </motion.h1>

          <motion.p
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-[#9BA3AE] sm:text-lg"
          >
            RBI, NPCI &amp; Income-Tax rules — decoded into plain language for Indian small
            businesses. Every rupee we show you is backed by an official rule, a source link
            and a verification date. <span className="text-[#E8C97E]">Zero tax evasion. Ever.</span>
          </motion.p>

          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
          >
            <GoldButton onClick={() => scrollTo("saver-calculators")} className="sm:min-w-[220px]">
              <BadgeIndianRupee className="h-4 w-4" aria-hidden />
              Calculate My Savings
            </GoldButton>
            <GhostButton onClick={() => scrollTo("saver-ai")}>
              <MessageCircleQuestion className="h-4 w-4" aria-hidden />
              Ask Saver AI
            </GhostButton>
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-2"
          >
            <Chip tone="gold">RBI · MDR rules</Chip>
            <Chip tone="emerald">NPCI · UPI circulars</Chip>
            <Chip tone="muted">ITD · Section 44AD</Chip>
            <Chip tone="muted">GST Portal · ITC</Chip>
          </motion.div>
        </div>

        {/* ── Live ticker card ── */}
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 34, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative"
        >
          <div className="saver-glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4A853]/60 to-transparent"
              aria-hidden
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DD4A8] opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2DD4A8]" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9BA3AE]">
                  Rule Engine Live
                </span>
              </div>
              <Sparkles className="h-4 w-4 text-[#D4A853]" aria-hidden />
            </div>

            <div className="mt-6 min-h-[132px]">
              <AnimatePresence mode="wait">
                <TickerStat key={tick} stat={TICKER_STATS[tick]} />
              </AnimatePresence>
            </div>

            <div className="saver-hairline my-6" aria-hidden />

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { v: "18", l: "Free tools" },
                { v: "5+", l: "Gov sources" },
                { v: "0", l: "Evasion routes" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-mono text-xl font-semibold tabular-nums text-[#FAF7F2]">{s.v}</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-[#7A8290]">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* floating mini chip */}
          <motion.div
            animate={reduced ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="saver-glass absolute -bottom-5 -left-4 hidden items-center gap-2 rounded-xl px-4 py-2.5 sm:flex"
          >
            <ShieldCheck className="h-4 w-4 text-[#2DD4A8]" aria-hidden />
            <span className="text-xs font-medium text-[#C7CCD4]">Sourced · Dated · Verifiable</span>
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.button
        onClick={() => scrollTo("saver-search")}
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-[#7A8290] transition-colors hover:text-[#E8C97E] lg:flex"
        aria-label="Scroll to savings search"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em]">Explore</span>
        <motion.span animate={reduced ? {} : { y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </motion.button>
    </section>
  );
}
