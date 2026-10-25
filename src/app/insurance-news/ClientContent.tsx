'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /insurance-news — SAFFRON DAWN v19 news index
 * Featured IRDAI deep-dives + full newsroom links + insights
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import {
  ChevronRight,
  Home,
  Newspaper,
  IndianRupee,
  Car,
  ArrowRight,
  MessageCircle,
  BarChart3,
  Shield,
  CalendarDays,
  Tag,
} from 'lucide-react';
import { ShinyButton } from '@/components/ui/shiny-button';

const WA = 'https://wa.me/919257877312';
const SIENNA = '#B8482C';
const MAROON = '#8B3520';
const GOLD = '#C98A1C';
const GOLD_L = '#E8C97E';
const INK = '#0E1116';

/* ── Featured deep-dives (full articles under /insurance-news/irdai-…) ── */
const FEATURED = [
  {
    href: '/insurance-news/gst-exempt-health-insurance',
    icon: IndianRupee,
    category: 'Tax & Premium',
    date: 'July 2025',
    tone: SIENNA,
    title: 'IRDAI Removes GST on Health Insurance — What It Means for You',
    summary:
      'The biggest premium cut in a decade. Which policies qualify, how much you actually save per ₹10 lakh cover, and when it kicks in on renewals.',
    impact: 'Premiums drop ~18% on qualifying health plans',
  },
  {
    href: '/insurance-news/tp-rate-revision-2024',
    icon: Car,
    category: 'Motor Insurance',
    date: 'April 2024',
    tone: MAROON,
    title: 'MoRTH Revises Third-Party Motor Insurance Rates — Impact on Your Premium',
    summary:
      'Engine-capacity slab changes across bikes, cars and EVs. Who pays more, who pays less, and why comprehensive plans now make even more sense.',
    impact: 'EV third-party rates cut up to 15%',
  },
];

/* ── Newsroom quick index (full hub at /hub/news) ─────────────────────── */
const NEWSROOM = [
  { slug: 'irdai-age-limit-removed', label: 'IRDAI Removes Age Limit on Health Insurance', date: 'April 2025', tone: GOLD },
  { slug: 'irdai-cashless-mandate', label: 'Cashless Claim Mandate — 1-Hour Authorization', date: 'January 2025', tone: SIENNA },
  { slug: 'irdai-portability-rules', label: 'Portability Rules Simplified — Switch Insurers Easily', date: 'March 2025', tone: MAROON },
  { slug: 'medical-inflation-india', label: 'Medical Inflation in India — Why Cover Must Grow 12%/Year', date: 'Ongoing', tone: GOLD },
];

export default function ClientContent() {
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
            <span className="text-white/80">Insurance News</span>
          </nav>

          <div
            className="nl-eyebrow nl-eyebrow-center mb-6 nl-rise nl-rise-1"
            style={{ background: 'rgba(232,201,126,0.12)', color: GOLD_L, border: '1px solid rgba(232,201,126,0.3)' }}
          >
            <Newspaper className="w-3.5 h-3.5 shrink-0" />
            <span>REGULATION DECODED — NOT JUST REPORTED</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 nl-rise nl-rise-2 gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Insurance News That
          </h1>
          <p className="text-2xl sm:text-3xl font-bold mb-5 nl-rise nl-rise-2" style={{ color: GOLD_L }}>
            Actually Affects Your Wallet
          </p>
          <p className="text-white/65 max-w-2xl mx-auto mb-8 nl-rise nl-rise-3">
            IRDAI circulars, GST changes and motor rate revisions — every update explained in plain
            language with the exact action you should take.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 nl-rise nl-rise-4">
            <a href="#featured">
              <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span className="inline-flex items-center gap-2">
                  Latest Deep-Dives <ArrowRight className="w-4 h-4" />
                </span>
              </ShinyButton>
            </a>
            <a href={WA} target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Ask What It Means for Me
                </span>
              </ShinyButton>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED DEEP-DIVES ═══════════ */}
      <section id="featured" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-16 scroll-mt-24">
        <div className="nl-eyebrow nl-eyebrow-center mb-4" style={{ background: 'rgba(184,72,44,0.1)', color: SIENNA, border: '1px solid rgba(184,72,44,0.25)' }}>
          <Shield className="w-3.5 h-3.5 shrink-0" />
          <span>FEATURED DEEP-DIVES</span>
        </div>
        <h2 className="nl-h2 text-center mb-10">
          The Two Updates That <span className="gradient-text">Changed Premiums</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURED.map((a, i) => (
            <Link
              key={i}
              href={a.href}
              className="glass-card p-6 sm:p-8 group hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              <span
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, ${a.tone}, ${GOLD})` }}
              />
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full text-white" style={{ background: a.tone }}>
                  <Tag className="w-3 h-3" /> {a.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="w-3.5 h-3.5" /> {a.date}
                </span>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <span
                  className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `linear-gradient(135deg, ${a.tone}, ${GOLD})` }}
                >
                  <a.icon className="w-6 h-6" />
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug group-hover:underline decoration-2 underline-offset-4" style={{ textDecorationColor: GOLD }}>
                  {a.title}
                </h3>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{a.summary}</p>

              <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(46,125,91,0.08)', border: '1px solid rgba(46,125,91,0.2)' }}>
                <span className="text-xs font-semibold" style={{ color: '#2E7D5B' }}>IMPACT: {a.impact}</span>
              </div>

              <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: SIENNA }}>
                Read Full Analysis <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ NEWSROOM QUICK INDEX ═══════════ */}
      <section className="py-14 md:py-16" style={{ background: 'rgba(201,138,28,0.06)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="nl-eyebrow nl-eyebrow-center mb-4" style={{ background: 'rgba(201,138,28,0.12)', color: GOLD, border: '1px solid rgba(201,138,28,0.3)' }}>
            <Newspaper className="w-3.5 h-3.5 shrink-0" />
            <span>MORE FROM THE NEWSROOM</span>
          </div>
          <h2 className="nl-h2 text-center mb-10">
            Every Rule Change, <span className="gradient-text">One Swipe Away</span>
          </h2>

          <div className="space-y-3">
            {NEWSROOM.map((n, i) => (
              <Link
                key={i}
                href={`/hub/news#${n.slug}`}
                className="glass-card p-4 sm:p-5 flex items-center gap-4 group hover:translate-x-1.5 transition-transform duration-300"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: `linear-gradient(135deg, ${n.tone}, ${GOLD})` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm sm:text-base truncate group-hover:underline decoration-2 underline-offset-4" style={{ textDecorationColor: GOLD }}>
                    {n.label}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">{n.date}</span>
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: SIENNA }} />
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/hub/news">
              <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm">
                <span className="inline-flex items-center gap-2">
                  <Newspaper className="w-4 h-4" /> Open Full Newsroom
                </span>
              </ShinyButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ DEEPER ANALYSIS CTA ═══════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-16">
        <div
          className="rounded-3xl p-8 sm:p-10 relative overflow-hidden text-center"
          style={{ background: `linear-gradient(135deg, ${MAROON}, ${SIENNA} 60%, ${GOLD})` }}
        >
          <div className="orb orb-1" />
          <div className="relative z-10">
            <BarChart3 className="w-10 h-10 mx-auto mb-4 text-white/90" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Beyond Headlines — the Data Layer
            </h3>
            <p className="text-white/85 max-w-xl mx-auto mb-6 text-sm sm:text-base">
              CSR trends, incurred claim ratios, solvency margins and market analysis in our Industry
              Insights dashboard — the same data advisers use.
            </p>
            <Link href="/industry-insights">
              <ShinyButton variant="secondary" className="rounded-xl px-6 py-3">
                <span className="inline-flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> Explore Industry Insights
                </span>
              </ShinyButton>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
