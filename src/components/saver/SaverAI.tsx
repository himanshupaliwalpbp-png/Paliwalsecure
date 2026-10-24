"use client";

/**
 * SaverAI — chat panel (POST /api/saver/chat, JSON non-streaming).
 * Quick prompts, typing indicator, history, WhatsApp handoff.
 */

import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, IndianRupee, Languages, Send, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GhostButton, GlassCard, Reveal, SAVER_WHATSAPP, SectionHeading } from "./saver-ui";

type Msg = { role: "user" | "assistant"; content: string };

/* ── lightweight markdown renderer (headings, bullets, tables, bold) ── */

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**") && p.length > 4) {
      return (
      <strong key={`${keyBase}-b${i}`} className="font-semibold text-[#FAF7F2]">
        {p.slice(2, -2)}
      </strong>
      );
    }
    return <span key={`${keyBase}-t${i}`}>{p}</span>;
  });
}

function MarkdownLite({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    if (!t) { i++; continue; }
    if (t.startsWith("###")) {
      out.push(
        <p key={i} className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#E8C97E]">
          {t.replace(/^#+\s*/, "")}
        </p>
      );
    } else if (t.startsWith("##")) {
      out.push(
        <p key={i} className="mt-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#E8C97E]">
          {t.replace(/^#+\s*/, "")}
        </p>
      );
    } else if (t.startsWith("|")) {
      // collect table block
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
        if (!cells.every((c) => /^[-: ]*$/.test(c))) rows.push(cells);
        i++;
      }
      out.push(
        <div key={`tbl-${i}`} className="my-2 overflow-hidden rounded-lg border border-white/[0.08]">
          {rows.map((r, ri) => (
            <div key={ri} className={`grid gap-2 px-3 py-2 text-[12px] ${ri === 0 ? "bg-white/[0.05] font-semibold text-[#FAF7F2]" : "border-t border-white/[0.06] text-[#C7CCD4]"}`} style={{ gridTemplateColumns: `repeat(${r.length}, minmax(0, 1fr))` }}>
              {r.map((c, ci) => <span key={ci} className={ri > 0 && ci === r.length - 1 ? "font-mono tabular-nums text-[#6FDDB9]" : ""}>{renderInline(c, `${ri}-${ci}`)}</span>)}
            </div>
          ))}
        </div>
      );
      continue;
    } else if (/^[-*•]\s+/.test(t)) {
      out.push(
        <div key={i} className="mt-1 flex items-start gap-2 text-[13px] leading-relaxed">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4A853]" aria-hidden />
          <span>{renderInline(t.replace(/^[-*•]\s+/, ""), `l${i}`)}</span>
        </div>
      );
    } else if (/^\d+\.\s+/.test(t)) {
      out.push(
        <div key={i} className="mt-1 flex items-start gap-2 text-[13px] leading-relaxed">
          <span className="font-mono text-[12px] font-semibold text-[#D4A853]">{t.match(/^\d+/)?.[0]}.</span>
          <span>{renderInline(t.replace(/^\d+\.\s+/, ""), `n${i}`)}</span>
        </div>
      );
    } else if (t === "---") {
      out.push(<div key={i} className="my-2 h-px bg-white/[0.08]" aria-hidden />);
    } else {
      out.push(
        <p key={i} className="mt-2 text-[13px] leading-relaxed">{renderInline(t, `p${i}`)}</p>
      );
    }
    i++;
  }
  return <>{out}</>;
}

const QUICK_PROMPTS = [
  "UPI fees kaise bachaye?",
  "44AD vs regular slab — kya better?",
  "GST ITC checklist do",
  "New vs old regime for ₹12L",
];

const CAPABILITIES = [
  {
    icon: IndianRupee,
    title: "Payment costs decoded",
    body: "RBI/NPCI MDR rules, small-merchant QR allowances, zero-MDR categories — explained in your language.",
  },
  {
    icon: BrainCircuit,
    title: "Tax paths compared",
    body: "44AD/44ADA presumptive vs regular books, new vs old regime, 87A rebate — with eligibility conditions.",
  },
  {
    icon: Languages,
    title: "EN · हिंदी · Hinglish",
    body: "Ask in whichever language you think in. Saver AI mirrors you — no translation friction.",
  },
];

function Bubble({ m }: { m: Msg }) {
  const isUser = m.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
          isUser
            ? "whitespace-pre-wrap rounded-br-md border border-[#D4A853]/30 bg-[#D4A853]/12 text-[#FAF7F2]"
            : "rounded-bl-md border border-white/[0.08] bg-white/[0.05] text-[#C7CCD4]"
        }`}
      >
        {isUser ? m.content : <MarkdownLite text={m.content} />}
      </div>
    </motion.div>
  );
}

export default function SaverAI() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Namaste! Main Saver AI hoon — Paliwal Saver ka rule-engine brain. 🛡️\n\nAsk me anything about UPI fees, Section 44AD, new vs old regime, or GST input credit. Main sirf legal, rule-sourced batata hoon — sources ke saath.\n\nKis side se shuru karein?",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || busy) return;
    setInput("");
    setError(null);
    const history = messages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setBusy(true);
    try {
      const res = await fetch("/api/saver/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; reply?: string; error?: string } | null;
      if (!res.ok || !json?.ok || !json.reply) {
        throw new Error(json?.error ?? "Saver AI thoda busy hai — ek baar phir try karein.");
      }
      setMessages((prev) => [...prev, { role: "assistant", content: json.reply! }]);
    } catch (e) {
      const msgText = e instanceof Error ? e.message : "Kuch gadbad ho gayi — phir se try karein.";
      setError(msgText);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry — technical hiccup. Thodi der baad phir poochein, ya WhatsApp par human expert se baat karein." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="saver-ai" className="relative scroll-mt-24 bg-[#12151B] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={
              <>
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> Saver AI
              </>
            }
            title="The rulebook,"
            accent="on call."
            sub="A compliance-first AI that answers in English, Hindi or Hinglish — and refuses evasion tricks with the exact reason why."
            align="left"
          />
        </Reveal>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* pitch column */}
          <div className="space-y-4">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} delay={0.08 + i * 0.08}>
                <GlassCard className="flex items-start gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4A853]/25 bg-[#D4A853]/8">
                    <c.icon className="h-5 w-5 text-[#E8C97E]" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#FAF7F2]">{c.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#8B93A1]">{c.body}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <div className="flex items-center gap-2.5 rounded-xl border border-[#2DD4A8]/25 bg-[#2DD4A8]/8 px-4 py-3">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#2DD4A8]" aria-hidden />
                <p className="text-[12px] leading-relaxed text-[#9BA3AE]">
                  Compliance-first: evasion attempts are refused with the exact rule. Insurance
                  questions route to Paliwal Secure AI (IRDAI POSP IP429834).
                </p>
              </div>
            </Reveal>
          </div>

          {/* chat card */}
          <Reveal delay={0.12}>
            <div className="saver-glass flex h-[560px] flex-col overflow-hidden rounded-3xl">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8C97E] to-[#B8863B]">
                    <Sparkles className="h-4 w-4 text-[#17130A]" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#FAF7F2]">Saver AI</p>
                    <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-[#2DD4A8]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2DD4A8]" aria-hidden /> rule engine v1
                    </p>
                  </div>
                </div>
                <a
                  href={SAVER_WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#2DD4A8]/40 bg-[#2DD4A8]/10 px-3 py-1.5 text-[11px] font-semibold text-[#6FDDB9] transition-colors hover:bg-[#2DD4A8]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2DD4A8]"
                >
                  Human expert →
                </a>
              </div>

              <div ref={scrollRef} className="saver-chat-scroll flex-1 space-y-3.5 overflow-y-auto px-5 py-5" aria-live="polite" role="log" aria-label="Saver AI conversation">
                {messages.map((m, i) => (
                  <Bubble key={i} m={m} />
                ))}
                {busy ? (
                  <div className="flex justify-start" aria-label="Saver AI is typing">
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.05] px-4 py-3.5">
                      <span className="saver-typing-dot h-1.5 w-1.5 rounded-full bg-[#D4A853]" />
                      <span className="saver-typing-dot h-1.5 w-1.5 rounded-full bg-[#D4A853]" />
                      <span className="saver-typing-dot h-1.5 w-1.5 rounded-full bg-[#D4A853]" />
                    </div>
                  </div>
                ) : null}
              </div>

              {/* quick prompts */}
              <div className="flex gap-2 overflow-x-auto border-t border-white/[0.07] px-5 py-3">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    disabled={busy}
                    className="shrink-0 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium text-[#9BA3AE] transition-all hover:border-[#D4A853]/50 hover:text-[#E8C97E] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* input */}
              <form
                className="flex items-center gap-2.5 border-t border-white/[0.07] p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about UPI fees, 44AD, GST ITC…"
                  aria-label="Message Saver AI"
                  maxLength={2000}
                  className="saver-input h-12 min-w-0 flex-1 rounded-xl px-4 text-[13px] placeholder:font-sans"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send message"
                  className="saver-gold-btn flex h-12 w-12 shrink-0 items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" aria-hidden />
                </button>
              </form>
              <p className="px-5 pb-4 text-[10px] leading-relaxed text-[#5B6270]">
                {error ? <span className="text-[#E86A5E]">{error} · </span> : null}
                Estimates only — verify with a qualified professional before acting. Saver AI nevers asks for PINs/OTPs.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
