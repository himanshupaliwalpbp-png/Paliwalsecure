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
import { useLanguage, type Language } from "@/lib/i18n";

// ── Trilingual copy (EN / हिन्दी / Hinglish) ─────────────────────────────
const STRINGS: Record<Language, {
  badge: string; headlineA: string; headlineEm: string; headlineB: string;
  para: string; paraAccent: string; stat1: string; stat2: string; stat3: string;
  cta1: string; cta2: string; foot: string; demoTitle: string; demoNote: string;
  s44ad: string; s44adSub: string; gst: string; gstSub: string;
}> = {
  en: {
    badge: "New · Paliwal Saver",
    headlineA: "Business money you can ",
    headlineEm: "legally",
    headlineB: " keep — calculated, sourced, dated.",
    para: "Our new rule-engine reads RBI MDR circulars, Section 44AD and the GST ITC map — then shows exactly which fees, taxes and credits your business can save.",
    paraAccent: " 100% legal. Zero evasion.",
    stat1: "UPI fees saved", stat2: "Tax via 44AD", stat3: "GST ITC back",
    cta1: "Open Paliwal Saver", cta2: "Ask Saver AI",
    foot: "Free · no sign-up · sources: RBI · NPCI · ITD · CBIC",
    demoTitle: "UPI P2M · live rule",
    demoNote: "The ₹2,000 cliff, visualised. Above it — the announced 0.4% merchant fee from Oct 2026.",
    s44ad: "Section 44AD", s44adSub: "deemed · digital", gst: "GST ITC", gstSub: "on inputs",
  },
  hi: {
    badge: "नया · पालीवाल सेवर",
    headlineA: "अपना बिज़नेस पैसा जो आप ",
    headlineEm: "कानूनी रूप से",
    headlineB: " बचा सकते हैं — गणना, स्रोत और तारीख के साथ।",
    para: "हमारा नया रूल-इंजन RBI के MDR सर्कुलर, सेक्शन 44AD और GST ITC मैप पढ़ता है — फिर बताता है कि आपका बिज़नेस कौन सी फीस, टैक्स और क्रेडिट बचा सकता है।",
    paraAccent: " 100% कानूनी। ज़ीरो चोरी।",
    stat1: "UPI फीस बचत", stat2: "44AD से टैक्स", stat3: "GST ITC वापस",
    cta1: "पालीवाल सेवर खोलें", cta2: "सेवर AI से पूछें",
    foot: "मुफ़्त · साइन-अप नहीं · स्रोत: RBI · NPCI · ITD · CBIC",
    demoTitle: "UPI P2M · लाइव नियम",
    demoNote: "₹2,000 का दरार, साफ़ दिखता है। इसके ऊपर — अक्टूबर 2026 से लागू 0.4% मर्चेंट फीस।",
    s44ad: "सेक्शन 44AD", s44adSub: "डीम्ड · डिजिटल", gst: "GST ITC", gstSub: "इनपुट्स पर",
  },
  hinglish: {
    badge: "Naya · Paliwal Saver",
    headlineA: "Business ka paisa jo aap ",
    headlineEm: "legally",
    headlineB: " bacha sakte ho — calculated, sourced, dated.",
    para: "Hamara naya rule-engine RBI MDR circulars, Section 44AD aur GST ITC map padhta hai — phir exactly batata hai kaunsi fees, tax aur credits aapka business bacha sakta hai.",
    paraAccent: " 100% legal. Zero evasion.",
    stat1: "UPI fees bache", stat2: "44AD se tax", stat3: "GST ITC wapas",
    cta1: "Paliwal Saver kholo", cta2: "Saver AI se pucho",
    foot: "Free · sign-up nahi · sources: RBI · NPCI · ITD · CBIC",
    demoTitle: "UPI P2M · live rule",
    demoNote: "₹2,000 ka cliff, saaf dikh raha hai. Uske upar — Oct 2026 se announced 0.4% merchant fee.",
    s44ad: "Section 44AD", s44adSub: "deemed · digital", gst: "GST ITC", gstSub: "on inputs",
  },
};

const STATS_BY_LANG: Record<Language, string[]> = {
  en: ["UPI fees saved", "Tax via 44AD", "GST ITC back"],
  hi: ["UPI फीस बचत", "44AD से टैक्स", "GST ITC वापस"],
  hinglish: ["UPI fees bache", "44AD se tax", "GST ITC wapas"],
};

function useCountUp(target: number, active: boolean, duration = 1400): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    if (reduced) {
      raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }
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
  { amount: 18400, prefix: "₹", suffix: "/yr", tone: "gold" },
  { amount: 46800, prefix: "₹", suffix: "/yr", tone: "emerald" },
  { amount: 32200, prefix: "₹", suffix: "/yr", tone: "emerald" },
];

function Stat({ s, active, label }: { s: (typeof STATS)[number]; active: boolean; label: string }) {
  const v = useCountUp(s.amount, active);
  const color = s.tone === "gold" ? "text-[#E8C97E]" : "text-[#6FDDB9]";
  return (
    <div className="text-center sm:text-left">
      <p className={`font-mono text-2xl font-bold tabular-nums sm:text-3xl ${color}`}>
        {s.prefix}
        {formatINRPlain(Math.round(v))}
        <span className="text-sm opacity-70">{s.suffix}</span>
      </p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#8B93A1]">{label}</p>
    </div>
  );
}

/** Mini live demo: a ₹2,500 UPI payment vs ₹1,500 — shows the ₹2,000 cliff. */
function MiniDemo({ demoTitle, demoNote }: { demoTitle: string; demoNote: string }) {
  return (
    <div className="saver-glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8B93A1]">{demoTitle}</p>
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
      <p className="mt-3.5 text-[11px] leading-relaxed text-[#7A8290]">{demoNote}</p>
    </div>
  );
}

export default function SaverShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();
  const { language } = useLanguage();
  const L = STRINGS[language] ?? STRINGS.en;
  const statLabels = STATS_BY_LANG[language] ?? STATS_BY_LANG.en;

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
              <span className="nl-eyebrow text-[#E8C97E]! nl-rise nl-rise-1">
                <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>{L.badge}</span>
              </span>

              <h2
                id="saver-showcase"
                className="mt-5 font-display text-3xl leading-[1.1] tracking-tight text-[#FAF7F2] sm:text-4xl lg:text-[2.9rem] nl-rise nl-rise-2"
              >
                {L.headlineA}{" "}
                <em className="saver-gold-text font-semibold italic">{L.headlineEm}</em>{" "}
                {L.headlineB}
              </h2>

              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#9BA3AE] nl-rise nl-rise-3">
                {L.para}
                <span className="text-[#E8C97E]">{L.paraAccent}</span>
              </p>

              {/* stats */}
              <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6">
                {STATS.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.25 + i * 0.12, duration: 0.5 }}
                  >
                    <Stat s={s} active={inView} label={statLabels[i]} />
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
                  {L.cta1}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/saver#saver-ai"
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-7 py-3 text-sm font-semibold text-[#FAF7F2] transition-all hover:border-[#2DD4A8]/50 hover:bg-[#2DD4A8]/10 hover:text-[#7CE8C9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4A8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1116]"
                >
                  <MessageCircleQuestion className="h-4 w-4" aria-hidden />
                  {L.cta2}
                </Link>
              </div>

              <p className="mt-6 flex items-center gap-2 text-[11px] font-medium text-[#7A8290]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2DD4A8]" aria-hidden />
                {L.foot}
              </p>
            </div>

            {/* mini demo */}
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="space-y-4"
            >
              <MiniDemo demoTitle={L.demoTitle} demoNote={L.demoNote} />
              <div className="saver-glass flex items-center justify-between rounded-2xl px-5 py-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B93A1]">{L.s44ad}</p>
                  <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#FAF7F2]">
                    6% <span className="text-sm font-medium text-[#9BA3AE]">{L.s44adSub}</span>
                  </p>
                </div>
                <div className="h-10 w-px bg-white/[0.08]" aria-hidden />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8B93A1]">{L.gst}</p>
                  <p className="mt-1 font-mono text-xl font-bold tabular-nums text-[#6FDDB9]">
                    18% <span className="text-sm font-medium text-[#9BA3AE]">{L.gstSub}</span>
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
