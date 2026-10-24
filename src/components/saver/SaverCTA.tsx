"use client";

/**
 * SaverCTA — final conversion panel: gold/emerald gradient-border glass,
 * bilingual headline, calculator + WhatsApp CTAs, micro-trust row.
 */

import { BadgeIndianRupee, MessageCircle, ShieldCheck } from "lucide-react";
import { GhostButton, GoldButton, Reveal, SAVER_WHATSAPP } from "./saver-ui";

export default function SaverCTA({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="relative pb-24 pt-4 sm:pb-32" aria-labelledby="saver-cta">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl p-[1.5px]">
            {/* animated gradient border */}
            <div
              className="absolute inset-0 bg-[linear-gradient(120deg,#B8863B,#D4A853,#2DD4A8,#D4A853,#B8863B)] bg-[length:200%_200%]"
              style={{ animation: "saver-cta-shift 7s linear infinite" }}
              aria-hidden
            />
            <style>{`@keyframes saver-cta-shift { to { background-position: 200% 0; } }
@media (prefers-reduced-motion: reduce) { [style*="saver-cta-shift"] { animation: none !important; } }`}</style>
            <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#10131A] px-6 py-12 text-center sm:px-12 sm:py-16">
              <div className="absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#D4A853]/16 blur-[90px]" aria-hidden />
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4A853]/35 bg-[#D4A853]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8C97E]">
                <BadgeIndianRupee className="h-3.5 w-3.5" aria-hidden />
                Paliwal Saver · Free forever
              </span>
              <h2
                id="saver-cta"
                className="mx-auto mt-6 max-w-2xl font-display text-3xl leading-[1.1] tracking-tight text-[#FAF7F2] sm:text-5xl"
              >
                Aapka paisa.{" "}
                <em className="saver-gold-text font-semibold italic">Aapke haath.</em>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#9BA3AE] sm:text-base">
                Run all three engines, add up your annual impact, and keep every rupee the rules
                already owe you — legally, on the record.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
                <GoldButton onClick={onRestart} className="sm:min-w-[220px]">
                  <BadgeIndianRupee className="h-4 w-4" aria-hidden />
                  Calculate My Savings
                </GoldButton>
                <GhostButton href={SAVER_WHATSAPP}>
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp an Expert
                </GhostButton>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-medium text-[#6B7280]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#2DD4A8]" aria-hidden />
                  IRDAI Registered POSP · IP429834
                </span>
                <span>Rule-sourced · dated · verifiable</span>
                <span>No PINs · no OTPs · ever</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
