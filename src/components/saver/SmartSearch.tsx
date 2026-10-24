"use client";

/**
 * SmartSearch — "Google for business savings". Live-filters the 18-tool
 * registry from the saver rulebook constants. Tool cards link/scroll into
 * the matching calculator tab.
 */

import { Search, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { TOOLS, type ToolMeta } from "@/lib/saver/constants";
import { Chip, GlassCard, Reveal, SectionHeading } from "./saver-ui";

const CATEGORY_TONE: Record<ToolMeta["category"], "gold" | "emerald" | "sienna" | "muted"> = {
  payments: "gold",
  gst: "emerald",
  tax: "sienna",
  business: "muted",
};

const CATEGORY_LABEL: Record<ToolMeta["category"], string> = {
  payments: "Payments",
  gst: "GST",
  tax: "Income Tax",
  business: "Business",
};

/** Where each tool takes you inside the /saver experience. */
function toolTarget(tool: ToolMeta): { tab: "payments" | "tax" | "gst" | null; blurb: string } {
  switch (tool.slug) {
    case "payment-cost-calculator":
    case "upipayments-calculator":
    case "upi-mix-calculator":
    case "zero-mdr-checker":
      return { tab: "payments", blurb: "PayDesk calculator" };
    case "gst-itc-checker":
    case "gst-calculator":
      return { tab: "gst", blurb: "GST ITC checker" };
    case "income-tax-saver":
    case "44ad-calculator":
    case "44ada-calculator":
    case "44ae-calculator":
      return { tab: "tax", blurb: "Tax engine" };
    default:
      return { tab: null, blurb: "Guide + AI" };
  }
}

function ToolCard({ tool, onOpen }: { tool: ToolMeta; onOpen: (tab: "payments" | "tax" | "gst" | null) => void }) {
  const target = toolTarget(tool);
  return (
    <button
      type="button"
      onClick={() => onOpen(target.tab)}
      className="saver-glass saver-glass-hover group flex h-full flex-col items-start rounded-2xl border-white/[0.1] p-5 text-left transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1116] hover:-translate-y-1"
    >
      <div className="flex w-full items-center justify-between gap-3">
        <Chip tone={CATEGORY_TONE[tool.category]} className="px-3 py-1.5 text-[11px]">{CATEGORY_LABEL[tool.category]}</Chip>
        {target.tab ? (
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#D4A853]/80 transition-colors group-hover:text-[#E8C97E]">
            Open →
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B7280]">Free</span>
        )}
      </div>
      <h3 className="mt-3.5 text-[15px] font-semibold leading-snug text-[#FAF7F2]">{tool.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[#8B93A1]">{tool.description}</p>
      <span className="mt-auto pt-3.5 text-[11px] font-medium text-[#7A8290]">{target.blurb}</span>
    </button>
  );
}

export default function SmartSearch({ onOpenTool }: { onOpenTool: (tab: "payments" | "tax" | "gst" | null) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOOLS.slice(0, 9);
    return TOOLS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.includes(q) ||
        t.h1.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  return (
    <section id="saver-search" className="relative scroll-mt-24 bg-[#12151B] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={
              <>
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> Smart Search
              </>
            }
            title="The"
            accent="Google of business savings"
            sub="Ask anything about UPI fees, 44AD, GST credit or regime choice — we surface the exact free tool for it."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mx-auto mt-10 max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6B7280]" aria-hidden />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “UPI fees”, “44AD”, “GST ITC”, “regime”…"
              aria-label="Search business savings tools"
              className="saver-input h-14 w-full rounded-2xl pl-12 pr-24 text-base placeholder:font-sans"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-1 sm:flex">
              <kbd className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-[#7A8290]">/</kbd>
            </span>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Savings tools">
          {filtered.map((tool, i) => (
            <Reveal key={tool.slug} delay={Math.min(i * 0.05, 0.3)} className="h-full">
              <ToolCard tool={tool} onOpen={onOpenTool} />
            </Reveal>
          ))}
          {filtered.length === 0 ? (
            <Reveal>
              <GlassCard className="col-span-full p-8 text-center" hover={false}>
                <p className="text-sm text-[#9BA3AE]">
                  No tool matches “{query}”. Try <button type="button" onClick={() => { setQuery("UPI"); inputRef.current?.focus(); }} className="font-semibold text-[#E8C97E] underline underline-offset-4">“UPI fees”</button> or{" "}
                  <button type="button" onClick={() => { setQuery("44AD"); inputRef.current?.focus(); }} className="font-semibold text-[#E8C97E] underline underline-offset-4">“44AD”</button>.
                </p>
              </GlassCard>
            </Reveal>
          ) : null}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-8 text-center text-xs text-[#6B7280]">
            {TOOLS.length} free tools · every answer sourced from RBI, NPCI, Income Tax Dept, CBIC or GST Portal
          </p>
        </Reveal>
      </div>
    </section>
  );
}
