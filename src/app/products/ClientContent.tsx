'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * /products — SAFFRON DAWN v19 hub: every product, tool & partnership
 * ═══════════════════════════════════════════════════════════════════════════
 */

import Link from 'next/link';
import {
  Shield,
  HeartPulse,
  Car,
  Bike,
  Home as HomeIcon,
  Baby,
  ChevronRight,
  Home,
  Calculator,
  GitCompareArrows,
  SearchCheck,
  Bot,
  Landmark,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { ShinyButton } from '@/components/ui/shiny-button';

const WA = 'https://wa.me/919257877312';
const SIENNA = '#B8482C';
const MAROON = '#8B3520';
const GOLD = '#C98A1C';
const GOLD_L = '#E8C97E';
const INK = '#0E1116';

/* ── Insurance categories ─────────────────────────────────────────────── */
const CATEGORIES = [
  {
    icon: Shield,
    href: '/best-term-insurance-india',
    title: 'Term Life Insurance',
    desc: '₹1 Crore cover from ~₹500/month. 15–20× income rule, CSR-ranked insurers, riders decoded.',
    tag: 'Most Viewed',
    tone: SIENNA,
  },
  {
    icon: HeartPulse,
    href: '/best-health-insurance-india',
    title: 'Health Insurance',
    desc: 'Family floaters, super top-ups, waiting periods & room-rent traps — compared honestly.',
    tag: 'Claim-First',
    tone: GOLD,
  },
  {
    icon: Car,
    href: '/car-insurance',
    title: 'Car Insurance',
    desc: 'IDV calculation, zero-depot vs bumper-to-bumper, NCB saving tricks, renewal reminders.',
    tag: 'Save ₹2,000+',
    tone: MAROON,
  },
  {
    icon: Bike,
    href: '/bike-insurance',
    title: 'Bike & Scooter',
    desc: 'Two-wheeler comprehensive plans, third-party rates 2025, instant policy issuance.',
    tag: 'Fast Issuance',
    tone: SIENNA,
  },
  {
    icon: HomeIcon,
    href: '/home-insurance',
    title: 'Home Insurance',
    desc: 'Structure + content cover from ₹180/month. Fire, theft & natural calamity protection.',
    tag: 'Underrated',
    tone: GOLD,
  },
  {
    icon: Baby,
    href: '/family-health-insurance',
    title: 'Family & Parents',
    desc: 'Floaters for young families and dedicated senior plans for parents up to age 99.',
    tag: 'Parents Cover',
    tone: MAROON,
  },
];

/* ── Free tools ───────────────────────────────────────────────────────── */
const TOOLS = [
  {
    icon: Calculator,
    href: '/calculators',
    title: 'Premium Calculators',
    desc: 'Term, health, car & IDV calculators with real 2025 rate tables.',
  },
  {
    icon: GitCompareArrows,
    href: '/compare',
    title: 'Compare Plans',
    desc: 'Side-by-side insurer comparison with live quotes and city/profession loadings.',
  },
  {
    icon: SearchCheck,
    href: '/free-audit',
    title: 'Free Policy Audit',
    desc: 'Existing policy line-by-line x-ray — exclusions, loadings & mis-selling check.',
  },
  {
    icon: Bot,
    href: '/insuregpt',
    title: 'InsureGPT AI',
    desc: '24×7 AI adviser in Hinglish. Instant answers on clauses, exclusions & claim steps.',
  },
  {
    icon: Shield,
    href: '/protection-score',
    title: 'Protection Score™',
    desc: '2-minute audit → one number that defines your family\u2019s security grade.',
  },
];

export default function ClientContent() {
  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section
        className="nl-dark-hero relative overflow-hidden py-14 md:py-20"
        style={{ background: `linear-gradient(135deg, #1A130C 0%, ${MAROON} 55%, ${INK} 100%)` }}
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <nav className="flex items-center justify-center gap-2 text-sm text-white/65 mb-5">
            <Link href="/" className="hover:text-white transition-colors inline-flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/80">Products & Tools</span>
          </nav>

          <div
            className="nl-eyebrow nl-eyebrow-center mb-6 nl-rise nl-rise-1"
            style={{ background: 'rgba(232,201,126,0.12)', color: GOLD_L, border: '1px solid rgba(232,201,126,0.3)' }}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>EVERYTHING IN ONE PLACE</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 nl-rise nl-rise-2 gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Products, Tools &amp;
          </h1>
          <p className="text-2xl sm:text-3xl font-bold mb-5 nl-rise nl-rise-2" style={{ color: GOLD_L }}>
            Partnerships Built for You
          </p>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 nl-rise nl-rise-3">
            From ₹1 Crore term plans to zero-balance banking — one adviser, every product, zero spam.
            Pick a category below or start with a free tool.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 nl-rise nl-rise-4">
            <a href="#categories">
              <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span className="inline-flex items-center gap-2">
                  Browse Categories <ArrowRight className="w-4 h-4" />
                </span>
              </ShinyButton>
            </a>
            <a href={WA} target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Ask Which Is Right for Me
                </span>
              </ShinyButton>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ INSURANCE CATEGORIES ═══════════ */}
      <section id="categories" className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-16 scroll-mt-24">
        <div className="nl-eyebrow nl-eyebrow-center mb-4" style={{ background: 'rgba(184,72,44,0.1)', color: SIENNA, border: '1px solid rgba(184,72,44,0.25)' }}>
          <Shield className="w-3.5 h-3.5 shrink-0" />
          <span>INSURANCE CATEGORIES</span>
        </div>
        <h2 className="nl-h2 text-center mb-10">
          Full-Stack Protection, <span className="gradient-text">One Adviser Deep</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((c, i) => (
            <Link
              key={i}
              href={c.href}
              className="glass-card p-6 group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <span
                className="absolute top-4 right-4 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full text-white"
                style={{ background: `linear-gradient(135deg, ${c.tone}, ${c.tone}CC)` }}
              >
                {c.tag}
              </span>
              <span
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ background: `linear-gradient(135deg, ${c.tone}, ${GOLD})` }}
              >
                <c.icon className="w-6 h-6" />
              </span>
              <h3 className="font-bold text-foreground text-lg mb-2 group-hover:underline decoration-2 underline-offset-4" style={{ textDecorationColor: GOLD }}>
                {c.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: SIENNA }}>
                Explore <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ FREE TOOLS ═══════════ */}
      <section className="py-14 md:py-16" style={{ background: 'rgba(201,138,28,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="nl-eyebrow nl-eyebrow-center mb-4" style={{ background: 'rgba(201,138,28,0.12)', color: GOLD, border: '1px solid rgba(201,138,28,0.3)' }}>
            <Calculator className="w-3.5 h-3.5 shrink-0" />
            <span>FREE TOOLS — NO SIGNUP</span>
          </div>
          <h2 className="nl-h2 text-center mb-10">
            Decide With Numbers, <span className="gradient-text">Not Pressure</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TOOLS.map((t, i) => (
              <Link
                key={i}
                href={t.href}
                className="glass-card p-5 text-center group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300"
              >
                <span
                  className="w-11 h-11 mx-auto rounded-2xl flex items-center justify-center mb-3 text-white group-hover:scale-110 transition-transform duration-300"
                  style={{ background: `linear-gradient(135deg, ${MAROON}, ${SIENNA})` }}
                >
                  <t.icon className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-foreground text-sm mb-1.5">{t.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ BANKING PARTNERSHIP ═══════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-16">
        <div className="nl-eyebrow nl-eyebrow-center mb-4" style={{ background: 'rgba(139,53,32,0.1)', color: MAROON, border: '1px solid rgba(139,53,32,0.25)' }}>
          <Landmark className="w-3.5 h-3.5 shrink-0" />
          <span>BANKING PARTNERSHIP</span>
        </div>
        <h2 className="nl-h2 text-center mb-10">
          Beyond Insurance — <span className="gradient-text">Money That Grows</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto">
          {/* Kotak 811 featured card */}
          <Link
            href="/products/kotak-811-super-savings-account"
            className="rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 text-white"
            style={{ background: `linear-gradient(135deg, ${MAROON}, ${SIENNA} 70%, ${GOLD})` }}
          >
            <div className="orb orb-2" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-4 text-white" style={{ background: 'rgba(255,255,255,0.18)' }}>
                <Sparkles className="w-3 h-3" /> Featured
              </span>
              <span className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-white bg-white/15 backdrop-blur">
                <Landmark className="w-7 h-7" />
              </span>
              <h3 className="text-2xl font-bold mb-2">Kotak 811 Super Savings Account</h3>
              <p className="text-white/85 text-sm leading-relaxed mb-6">
                Zero balance. Premium banking. Digital KYC in minutes — opened through our official
                partnership with referral support.
              </p>
              <span className="inline-flex items-center gap-2 font-semibold text-sm">
                Open Account Guide <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Adviser CTA card */}
          <div className="glass-card p-8 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-foreground mb-3">Confused Where to Start?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              One honest conversation saves years of regret. Tell Himanshu your budget and family
              picture — get a no-obligation plan in writing.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={WA} target="_blank" rel="noopener noreferrer">
                <ShinyButton variant="blue" className="rounded-xl px-5 py-2.5 text-sm">
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> WhatsApp Now
                  </span>
                </ShinyButton>
              </a>
              <Link href="/free-audit">
                <ShinyButton variant="secondary" className="rounded-xl px-5 py-2.5 text-sm">
                  <span>Free Audit First</span>
                </ShinyButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
