'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /contact — SAFFRON DAWN v19 contact page
 * ⛔ LOCKED: phone +91 9257877312 / wa.me/919257877312 / himanshupaliwalpbp@gmail.com
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Home,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Shield,
  BadgeCheck,
  Send,
  SearchCheck,
  Bot,
  Gauge,
  Calculator,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { ShinyButton } from '@/components/ui/shiny-button';

/* ┛ LOCKED CONTACTS — never change these */
const PHONE_DISPLAY = '+91 9257877312';
const PHONE_TEL = 'tel:+919257877312';
const WA = 'https://wa.me/919257877312';
const EMAIL = 'himanshupaliwalpbp@gmail.com';
const EMAIL_HREF = `mailto:${EMAIL}`;

const SIENNA = '#B8482C';
const MAROON = '#8B3520';
const GOLD = '#C98A1C';
const GOLD_L = '#E8C97E';
const INK = '#0E1116';

/* ── Purpose options for the quick message builder ────────────────────── */
const PURPOSES = [
  { id: 'new-policy', label: 'New Policy Advice', msg: 'Namaste! Mujhe ek nayi policy lene hai — please guide kijiye.' },
  { id: 'audit', label: 'Free Policy Audit', msg: 'Namaste! Mujhe apni existing policy ka free audit karana hai.' },
  { id: 'claim', label: 'Claim Help', msg: 'Namaste! Mujhe ek claim ke bare mein madad chahiye.' },
  { id: 'renewal', label: 'Renewal / Better Quote', msg: 'Namaste! Meri policy renew ho rahi hai — better quote chahiye.' },
  { id: 'score', label: 'Protection Score Review', msg: 'Namaste! Mera Protection Score banana hai — roadmap chahiye.' },
  { id: 'banking', label: 'Kotak 811 Account', msg: 'Namaste! Mujhe Kotak 811 Super Savings Account ke bare mein janna hai.' },
];

export default function ClientContent() {
  const [purpose, setPurpose] = useState<string>('new-policy');
  const selected = PURPOSES.find((p) => p.id === purpose) ?? PURPOSES[0];

  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section
        className="relative overflow-hidden py-14 md:py-20"
        style={{ background: `linear-gradient(135deg, #1A130C 0%, ${MAROON} 55%, ${INK} 100%)` }}
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <nav className="flex items-center justify-center gap-2 text-sm text-white/50 mb-5">
            <Link href="/" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/80">Contact</span>
          </nav>

          <div
            className="nl-eyebrow nl-eyebrow-center mb-6 nl-rise nl-rise-1"
            style={{ background: 'rgba(232,201,126,0.12)', color: GOLD_L, border: '1px solid rgba(232,201,126,0.3)' }}
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span>REAL HUMAN. REAL ADVICE.</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 nl-rise nl-rise-2 gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Talk Directly to
          </h1>
          <p className="text-2xl sm:text-3xl font-bold mb-5 nl-rise nl-rise-2" style={{ color: GOLD_L }}>
            Himanshu Paliwal
          </p>
          <p className="text-white/65 max-w-2xl mx-auto mb-8 nl-rise nl-rise-3">
            No call centers. No commission-hungry agents. When you reach out, you reach Himanshu —
            IRDAI Registered POSP (IP429834) and founder of Paliwal Secure.
          </p>

          {/* Hero contact chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 nl-rise nl-rise-4">
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 transition-transform"
              style={{ background: 'linear-gradient(135deg, #2E7D5B, #1F5E41)' }}
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp {PHONE_DISPLAY}
            </a>
            <a
              href={PHONE_TEL}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 transition-transform"
              style={{ background: `linear-gradient(135deg, ${SIENNA}, ${MAROON})` }}
            >
              <Phone className="w-4 h-4" /> Call {PHONE_DISPLAY}
            </a>
            <a
              href={EMAIL_HREF}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:-translate-y-0.5 transition-transform"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #8B6914)` }}
            >
              <Mail className="w-4 h-4" /> Email
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ CONTACT CHANNELS ═══════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-16">
        <div className="grid md:grid-cols-3 gap-4">
          {/* WhatsApp — recommended */}
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-6 group hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
          >
            <span className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #2E7D5B, #4E8A3C)' }} />
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4 text-white" style={{ background: '#2E7D5B' }}>
              Fastest — Recommended
            </span>
            <span className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #2E7D5B, #1F5E41)' }}>
              <MessageCircle className="w-6 h-6" />
            </span>
            <h3 className="font-bold text-foreground text-lg mb-1">WhatsApp</h3>
            <p className="text-2xl font-black text-foreground mb-2 tabular-nums">{PHONE_DISPLAY}</p>
            <p className="text-xs text-muted-foreground">Typical reply within minutes during working hours. Documents, quotes & claim support — all on chat.</p>
          </a>

          {/* Call */}
          <a href={PHONE_TEL} className="glass-card p-6 group hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <span className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${SIENNA}, ${GOLD})` }} />
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4 text-white" style={{ background: SIENNA }}>
              Voice Call
            </span>
            <span className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${SIENNA}, ${MAROON})` }}>
              <Phone className="w-6 h-6" />
            </span>
            <h3 className="font-bold text-foreground text-lg mb-1">Direct Call</h3>
            <p className="text-2xl font-black text-foreground mb-2 tabular-nums">{PHONE_DISPLAY}</p>
            <p className="text-xs text-muted-foreground">Prefer talking it out? Call for a 10-minute clarity session — no obligation.</p>
          </a>

          {/* Email */}
          <a href={EMAIL_HREF} className="glass-card p-6 group hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <span className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L})` }} />
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4 text-white" style={{ background: GOLD }}>
              For Documents
            </span>
            <span className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${GOLD}, #8B6914)` }}>
              <Mail className="w-6 h-6" />
            </span>
            <h3 className="font-bold text-foreground text-lg mb-1">Email</h3>
            <p className="text-base font-bold text-foreground mb-2 break-all">{EMAIL}</p>
            <p className="text-xs text-muted-foreground">Policy PDFs, audits & formal correspondence. Replies within one working day.</p>
          </a>
        </div>

        {/* Hours & credentials strip */}
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <div className="glass-card p-4 flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: `linear-gradient(135deg, ${MAROON}, ${SIENNA})` }}>
              <Clock className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Mon–Sat, 9 AM – 8 PM IST</p>
              <p className="text-[11px] text-muted-foreground">Sunday: WhatsApp-only for urgent claims</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: `linear-gradient(135deg, ${GOLD}, #8B6914)` }}>
              <BadgeCheck className="w-[18px] h-[18px]" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">IRDAI Registered POSP</p>
              <p className="text-[11px] text-muted-foreground">License IP429834 · Direct broker-grade service</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: 'linear-gradient(135deg, #2E7D5B, #1F5E41)' }}>
              <Shield className="w-[18px] h-[18px]" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Zero Spam Promise</p>
              <p className="text-[11px] text-muted-foreground">Your number is never sold or over-called</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ QUICK MESSAGE BUILDER ═══════════ */}
      <section className="py-14 md:py-16" style={{ background: 'rgba(184,72,44,0.05)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="nl-eyebrow nl-eyebrow-center mb-4" style={{ background: 'rgba(184,72,44,0.1)', color: SIENNA, border: '1px solid rgba(184,72,44,0.25)' }}>
            <Send className="w-3.5 h-3.5 shrink-0" />
            <span>START IN 5 SECONDS</span>
          </div>
          <h2 className="nl-h2 text-center mb-3">
            What Do You Need? <span className="gradient-text">Pick One.</span>
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Tap your purpose — we&apos;ll open WhatsApp with your message pre-written. Zero typing.
          </p>

          <div className="nl-glass rounded-3xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {PURPOSES.map((p) => {
                const active = purpose === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPurpose(p.id)}
                    className={`rounded-2xl border p-4 text-left transition-all duration-200 group ${
                      active
                        ? 'border-transparent text-white shadow-xl'
                        : 'border-black/10 dark:border-white/10 hover:-translate-y-0.5 hover:shadow-md bg-white/60 dark:bg-white/5'
                    }`}
                    style={active ? { background: `linear-gradient(135deg, ${SIENNA}, ${MAROON})` } : undefined}
                  >
                    <span className={`flex items-center gap-2 font-semibold text-sm ${active ? 'text-white' : 'text-foreground'}`}>
                      <HelpCircle className={`w-4 h-4 shrink-0 ${active ? 'text-[#E8C97E]' : 'text-muted-foreground'}`} />
                      {p.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <motion.div
              key={purpose}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl p-4 mb-6"
              style={{ background: 'rgba(46,125,91,0.08)', border: '1px solid rgba(46,125,91,0.2)' }}
            >
              <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: '#2E7D5B' }}>Your pre-filled message</p>
              <p className="text-sm text-foreground leading-relaxed">{selected.msg}</p>
            </motion.div>

            <div className="text-center">
              <a href={`${WA}?text=${encodeURIComponent(selected.msg)}`} target="_blank" rel="noopener noreferrer">
                <ShinyButton variant="blue" className="rounded-xl px-8 py-3.5">
                  <span className="inline-flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send on WhatsApp
                  </span>
                </ShinyButton>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SELF-SERVICE SHORTCUTS ═══════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-16">
        <div className="nl-eyebrow nl-eyebrow-center mb-4" style={{ background: 'rgba(201,138,28,0.12)', color: GOLD, border: '1px solid rgba(201,138,28,0.3)' }}>
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>ANSWERS BEFORE YOU EVEN ASK</span>
        </div>
        <h2 className="nl-h2 text-center mb-10">
          Maybe You Don&apos;t Need to Wait — <span className="gradient-text">DIY First</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Gauge, href: '/protection-score', title: 'Protection Score™', desc: '2-min audit → know your grade instantly' },
            { icon: Calculator, href: '/calculators', title: 'Calculators', desc: 'Term, health & car premium estimates' },
            { icon: SearchCheck, href: '/free-audit', title: 'Free Policy Audit', desc: 'Existing policy x-ray checklist' },
            { icon: Bot, href: '/insuregpt', title: 'InsureGPT AI', desc: '24×7 Hinglish AI adviser, instant' },
          ].map((s, i) => (
            <Link key={i} href={s.href} className="glass-card p-5 group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
              <span className="w-11 h-11 rounded-2xl flex items-center justify-center mb-3 text-white group-hover:scale-110 transition-transform" style={{ background: `linear-gradient(135deg, ${MAROON}, ${GOLD})` }}>
                <s.icon className="w-5 h-5" />
              </span>
              <h3 className="font-bold text-foreground text-sm mb-1">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ FINAL CTA BAND ═══════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${MAROON}, ${SIENNA} 60%, ${GOLD})` }}>
          <div className="orb orb-1" />
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              One Message Today = Years of Clarity Tomorrow
            </h3>
            <p className="text-white/85 max-w-xl mx-auto mb-6 text-sm sm:text-base">
              Paliwal Secure — trusted advisory for term, health, motor & home insurance across India.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={WA} target="_blank" rel="noopener noreferrer">
                <ShinyButton variant="secondary" className="rounded-xl px-6 py-3">
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> WhatsApp {PHONE_DISPLAY}
                  </span>
                </ShinyButton>
              </a>
              <a href={PHONE_TEL} className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-medium">
                <Phone className="w-4 h-4" /> Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
