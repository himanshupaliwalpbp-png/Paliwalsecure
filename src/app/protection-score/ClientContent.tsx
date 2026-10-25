'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Protection Score™ — SAFFRON DAWN v19 interactive audit page
 * 7 questions → animated gauge → personalized roadmap → WhatsApp CTA
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  ChevronRight,
  Home,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  HeartPulse,
  Umbrella,
  Landmark,
  Banknote,
  Users,
  PiggyBank,
  MessageCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Gauge,
  Lightbulb,
  Phone,
} from 'lucide-react';
import { ShinyButton } from '@/components/ui/shiny-button';

/* ── Locked contact constants ─────────────────────────────────────────── */
const WA = 'https://wa.me/919257877312';
const TEL = 'tel:+919257877312';

/* ── Palette (SAFFRON DAWN) ───────────────────────────────────────────── */
const SIENNA = '#B8482C';
const MAROON = '#8B3520';
const GOLD = '#C98A1C';
const GOLD_L = '#E8C97E';
const INK = '#0E1116';

/* ── Question model ───────────────────────────────────────────────────── */
type Option = { label: string; sub?: string; score: number };
type Question = {
  id: string;
  icon: React.ElementType;
  title: string;
  sub: string;
  options: Option[];
};

const QUESTIONS: Question[] = [
  {
    id: 'age',
    icon: Gauge,
    title: 'What is your age bracket?',
    sub: 'Protection needs change with every life stage.',
    options: [
      { label: '25–34 years', sub: 'Best time to lock low premiums', score: 20 },
      { label: '35–44 years', sub: 'Peak earning + family responsibilities', score: 16 },
      { label: '45–54 years', sub: 'Pre-retirement consolidation', score: 12 },
      { label: '55+ years', sub: 'Legacy & health focus', score: 8 },
    ],
  },
  {
    id: 'income',
    icon: Banknote,
    title: 'What is your annual household income?',
    sub: 'Your income determines ideal life cover (15–20×).',
    options: [
      { label: 'Up to ₹6 lakh', score: 20 },
      { label: '₹6–12 lakh', score: 16 },
      { label: '₹12–25 lakh', score: 12 },
      { label: '₹25 lakh+', score: 10 },
    ],
  },
  {
    id: 'dependents',
    icon: Users,
    title: 'How many people depend on your income?',
    sub: 'Spouse, kids, parents — everyone who relies on you.',
    options: [
      { label: 'None', sub: 'Only myself', score: 20 },
      { label: '1–2 members', score: 16 },
      { label: '3–4 members', score: 10 },
      { label: '5+ members', sub: 'Joint family', score: 6 },
    ],
  },
  {
    id: 'term',
    icon: Umbrella,
    title: 'Do you have a term life insurance policy?',
    sub: 'The purest form of protection — ₹1 Cr cover from ₹500/month.',
    options: [
      { label: 'Yes, cover above ₹1 Crore', sub: 'Excellent!', score: 20 },
      { label: 'Yes, ₹25 lakh – ₹1 Crore', sub: 'Good start, can be topped up', score: 14 },
      { label: 'Yes, below ₹25 lakh', sub: 'Critically under-insured', score: 7 },
      { label: 'No term policy', sub: 'Biggest gap — fix this first', score: 0 },
    ],
  },
  {
    id: 'health',
    icon: HeartPulse,
    title: 'How much health insurance cover does your family have?',
    sub: 'Post-COVID, ₹10 lakh family floater is the minimum sensible cover.',
    options: [
      { label: '₹25 lakh+ / members covered', sub: 'Truly future-ready', score: 20 },
      { label: '₹10–25 lakh family floater', sub: 'Solid baseline', score: 16 },
      { label: '₹3–10 lakh', sub: 'Risky for metro cities', score: 10 },
      { label: 'Below ₹3 lakh or none', sub: 'One hospitalization can wipe savings', score: 0 },
    ],
  },
  {
    id: 'emergency',
    icon: PiggyBank,
    title: 'How many months of expenses are in your emergency fund?',
    sub: 'Liquid savings you can access within 24 hours.',
    options: [
      { label: '6+ months', sub: 'Textbook perfect', score: 20 },
      { label: '3–6 months', sub: 'Adequate cushion', score: 15 },
      { label: '1–3 months', sub: 'Thin buffer', score: 8 },
      { label: 'No emergency fund', score: 0 },
    ],
  },
  {
    id: 'loans',
    icon: Landmark,
    title: 'How much loan (home/car/personal) do you currently owe?',
    sub: 'Debt reduces the cover your family actually needs.',
    options: [
      { label: 'No active loans', sub: 'Debt-free — powerful position', score: 20 },
      { label: 'Under ₹10 lakh', score: 16 },
      { label: '₹10–50 lakh', score: 10 },
      { label: 'Over ₹50 lakh', sub: 'Cover must exceed debt', score: 5 },
    ],
  },
];

const MAX_RAW = QUESTIONS.reduce((s, q) => s + Math.max(...q.options.map((o) => o.score)), 0);

/* ── Grade model ──────────────────────────────────────────────────────── */
function gradeFor(score: number) {
  if (score >= 85)
    return { grade: 'A+', label: 'Fortress Level', tone: '#2E7D5B', msg: 'Your family stands on solid rock. Fine-tuning is all that remains.' };
  if (score >= 70)
    return { grade: 'A', label: 'Well Protected', tone: '#4E8A3C', msg: 'Strong base — a couple of smart top-ups will make you bulletproof.' };
  if (score >= 55)
    return { grade: 'B', label: 'Partially Protected', tone: GOLD, msg: 'You have started, but gaps remain that could cost lakhs.' };
  if (score >= 40)
    return { grade: 'C', label: 'Vulnerable', tone: SIENNA, msg: 'One bad year can dent your family\'s finances badly. Act now.' };
  return { grade: 'D', label: 'At Risk', tone: '#9E2B25', msg: 'Your family is exposed on multiple fronts — urgent action needed.' };
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function ClientContent() {
  const [step, setStep] = useState(0); // 0..QUESTIONS.length-1 quiz, QUESTIONS.length = result
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const answeredCount = Object.keys(answers).length;
  const quizDone = answeredCount === QUESTIONS.length;

  const score = useMemo(() => {
    if (!quizDone) return 0;
    const raw = QUESTIONS.reduce((s, q) => s + (answers[q.id] ?? 0), 0);
    return Math.round((raw / MAX_RAW) * 100);
  }, [answers, quizDone]);

  const g = gradeFor(score);
  const waMessage = encodeURIComponent(
    `Namaste Himanshu! Mera Protection Score ${score}/100 (${g.grade} — ${g.label}) aaya hai. Please mera personalized optimization roadmap bhejiye.`
  );

  const pick = (qid: string, optScore: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: optScore }));
    // advance after a beat for micro-feedback
    setTimeout(() => setStep((s) => Math.min(s + 1, QUESTIONS.length)), 180);
  };

  const current = step < QUESTIONS.length ? QUESTIONS[step] : null;
  const R = 84;
  const CIRC = 2 * Math.PI * R;

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
            <span className="text-white/80">Protection Score™</span>
          </nav>

          <div
            className="nl-eyebrow nl-eyebrow-center mb-6 nl-rise nl-rise-1"
            style={{ background: 'rgba(232,201,126,0.12)', color: GOLD_L, border: '1px solid rgba(232,201,126,0.3)' }}
          >
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>FREE 2-MINUTE AUDIT</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 nl-rise nl-rise-2 gradient-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Your Family&apos;s Security,
          </h1>
          <p className="text-2xl sm:text-3xl font-bold mb-5 nl-rise nl-rise-2" style={{ color: GOLD_L }}>
            Summed Up in One Number
          </p>
          <p className="text-white/65 max-w-2xl mx-auto mb-8 nl-rise nl-rise-3">
            Most Indian families are either under-insured (paying for inadequate cover) or over-insured
            (wasting premium). Answer 7 quick questions — get your Protection Score™ instantly, with a
            personalized optimization roadmap.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 nl-rise nl-rise-4">
            <a href="#score-tool">
              <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span className="inline-flex items-center gap-2">
                  <Gauge className="w-4 h-4" /> Calculate My Score — Free
                </span>
              </ShinyButton>
            </a>
            <a href={`${WA}?text=${encodeURIComponent('Namaste! Mujhe apna Protection Score banana hai — please help kijiye.')}`} target="_blank" rel="noopener noreferrer">
              <ShinyButton variant="secondary" className="rounded-xl px-6 py-3 text-sm md:text-base">
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Talk to Adviser
                </span>
              </ShinyButton>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST STRIP ═══════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { v: '7', l: 'Smart Questions' },
            { v: '2 min', l: 'Average Time' },
            { v: '100%', l: 'Free & Private' },
            { v: 'IP429834', l: 'IRDAI POSP Verified' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-4 sm:p-5 text-center hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ THE SCORE TOOL ═══════════ */}
      <section id="score-tool" className="max-w-4xl mx-auto px-4 sm:px-6 py-14 md:py-20 scroll-mt-24">
        {!quizDone || step < QUESTIONS.length ? (
          <div className="nl-glass rounded-3xl p-6 sm:p-10">
            {/* Progress */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: SIENNA }}>
                Question {step + 1} of {QUESTIONS.length}
              </span>
              <span className="text-xs text-muted-foreground">{Math.round((step / QUESTIONS.length) * 100)}% complete</span>
            </div>
            <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden mb-8">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${SIENNA}, ${GOLD})` }}
                animate={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {current && (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-start gap-4 mb-7">
                  <span
                    className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${SIENNA}, ${GOLD})` }}
                  >
                    <current.icon className="w-6 h-6" />
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">{current.title}</h2>
                    <p className="text-sm text-muted-foreground">{current.sub}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {current.options.map((opt, i) => {
                    const active = answers[current.id] === opt.score;
                    return (
                      <button
                        key={i}
                        onClick={() => pick(current.id, opt.score)}
                        className={`text-left rounded-2xl border p-4 transition-all duration-200 group ${
                          active
                            ? 'border-transparent text-white shadow-xl'
                            : 'border-black/10 dark:border-white/10 hover:-translate-y-0.5 hover:shadow-md bg-white/60 dark:bg-white/5'
                        }`}
                        style={active ? { background: `linear-gradient(135deg, ${SIENNA}, ${MAROON})` } : undefined}
                      >
                        <span className="flex items-center justify-between gap-2 mb-0.5">
                          <span className={`font-semibold ${active ? 'text-white' : 'text-foreground'}`}>{opt.label}</span>
                          <CheckCircle2
                            className={`w-5 h-5 shrink-0 transition-opacity ${active ? 'opacity-100 text-[#E8C97E]' : 'opacity-0 group-hover:opacity-30'}`}
                          />
                        </span>
                        {opt.sub && (
                          <span className={`text-xs ${active ? 'text-white/75' : 'text-muted-foreground'}`}>{opt.sub}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-7">
                  <button
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    disabled={step === 0}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-xs text-muted-foreground">Answers stay on your device — nothing is stored</span>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          /* ── RESULT ── */
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <div className="nl-glass rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden">
              <div className="orb orb-1" />
              <div className="relative z-10">
                <div className="nl-eyebrow nl-eyebrow-center mb-6" style={{ background: `${g.tone}1A`, color: g.tone, border: `1px solid ${g.tone}55` }}>
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>YOUR PROTECTION SCORE™</span>
                </div>

                {/* Gauge */}
                <div className="relative w-[220px] h-[220px] mx-auto mb-6">
                  <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                    <circle cx="100" cy="100" r={R} fill="none" stroke="currentColor" strokeWidth="14" className="text-black/10 dark:text-white/10" />
                    <motion.circle
                      cx="100"
                      cy="100"
                      r={R}
                      fill="none"
                      stroke={g.tone}
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray={CIRC}
                      initial={{ strokeDashoffset: CIRC }}
                      animate={{ strokeDashoffset: CIRC - (CIRC * score) / 100 }}
                      transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-5xl sm:text-6xl font-black text-foreground tabular-nums"
                    >
                      {score}
                    </motion.span>
                    <span className="text-sm text-muted-foreground font-medium">out of 100</span>
                  </div>
                </div>

                <div
                  className="inline-flex items-center gap-3 rounded-2xl px-6 py-3 mb-5 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${g.tone}, ${g.tone}CC)` }}
                >
                  <span className="text-3xl font-black text-white">{g.grade}</span>
                  <span className="text-left">
                    <span className="block text-sm font-bold text-white">{g.label}</span>
                    <span className="block text-[11px] text-white/80">Protection Grade</span>
                  </span>
                </div>

                <p className="max-w-xl mx-auto text-foreground/80 mb-8">{g.msg}</p>

                {/* Pillar breakdown */}
                <div className="grid sm:grid-cols-4 gap-3 mb-8 text-left">
                  {[
                    { icon: Umbrella, label: 'Life Cover', val: answers.term ?? 0, max: 20 },
                    { icon: HeartPulse, label: 'Health Cover', val: answers.health ?? 0, max: 20 },
                    { icon: PiggyBank, label: 'Emergency Fund', val: answers.emergency ?? 0, max: 20 },
                    { icon: Landmark, label: 'Debt Position', val: answers.loans ?? 0, max: 20 },
                  ].map((p, i) => (
                    <div key={i} className="glass-card p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <p.icon className="w-4 h-4" style={{ color: GOLD }} />
                        <span className="text-xs font-semibold text-foreground">{p.label}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(p.val / p.max) * 100}%`, background: `linear-gradient(90deg, ${SIENNA}, ${GOLD})` }}
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground mt-1 block">{p.val}/{p.max} points</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href={`${WA}?text=${waMessage}`} target="_blank" rel="noopener noreferrer">
                    <ShinyButton variant="blue" className="rounded-xl px-6 py-3 text-sm md:text-base">
                      <span className="inline-flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Get My Free Roadmap on WhatsApp
                      </span>
                    </ShinyButton>
                  </a>
                  <button
                    onClick={() => {
                      setAnswers({});
                      setStep(0);
                      document.getElementById('score-tool')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> Retake Audit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* ═══════════ WHY IT MATTERS ═══════════ */}
      <section className="py-14 md:py-16" style={{ background: 'rgba(184,72,44,0.05)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="nl-eyebrow nl-eyebrow-center mb-4" style={{ background: 'rgba(184,72,44,0.1)', color: SIENNA, border: '1px solid rgba(184,72,44,0.25)' }}>
            <Lightbulb className="w-3.5 h-3.5 shrink-0" />
            <span>WHY THIS NUMBER MATTERS</span>
          </div>
          <h2 className="nl-h2 text-center mb-10">
            India&apos;s Protection Gap Is Real —{' '}
            <span className="gradient-text">Don&apos;t Be a Statistic</span>
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: AlertTriangle, stat: '₹8,400 Cr', text: 'Estimated annual protection gap in life cover among Indian households', tone: SIENNA },
              { icon: TrendingUp, stat: '76%', text: 'Of Indian families rely on savings, not insurance, for medical emergencies', tone: GOLD },
              { icon: Shield, stat: '4×', text: 'Claim rejection odds drop when policies are reviewed by an expert yearly', tone: '#2E7D5B' },
            ].map((c, i) => (
              <div key={i} className="glass-card p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <span
                  className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-4 text-white"
                  style={{ background: `linear-gradient(135deg, ${c.tone}, ${c.tone}BB)` }}
                >
                  <c.icon className="w-6 h-6" />
                </span>
                <p className="text-3xl font-black text-foreground mb-2">{c.stat}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT HAPPENS NEXT ═══════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 md:py-16">
        <h2 className="nl-h2 text-center mb-3">
          After Your Score, <span className="gradient-text">the Real Work Begins</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          Share your score on WhatsApp and Himanshu personally maps your exact optimization path —
          no spam, no pushy calls, just numbers that make sense.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: '01', t: 'Policy X-Ray', d: 'Your existing policies (if any) are reviewed line-by-line for hidden exclusions and loading traps.' },
            { n: '02', t: 'Gap Blueprint', d: 'A written roadmap: exact cover amounts, right insurers by CSR, and premium that fits your budget.' },
            { n: '03', t: 'Claim-Ready Setup', d: 'Digital records, nominee verification, and a WhatsApp lifeline when you actually need to claim.' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <span
                className="absolute -top-3 -right-2 text-7xl font-black opacity-[0.07] group-hover:opacity-[0.12] transition-opacity"
                style={{ color: SIENNA }}
              >
                {s.n}
              </span>
              <h3 className="font-bold text-foreground mb-2 text-lg">{s.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>

        {/* Final CTA band */}
        <div
          className="mt-12 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${MAROON}, ${SIENNA} 60%, ${GOLD})` }}
        >
          <div className="orb orb-1" />
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Your Score Is Free. Your Peace of Mind Is Priceless.
            </h3>
            <p className="text-white/80 max-w-xl mx-auto mb-6 text-sm sm:text-base">
              Paliwal Secure — trusted by families across India. IRDAI Registered POSP (IP429834).
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={`${WA}?text=${waMessage}`} target="_blank" rel="noopener noreferrer">
                <ShinyButton variant="secondary" className="rounded-xl px-6 py-3">
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" /> WhatsApp: +91 9257877312
                  </span>
                </ShinyButton>
              </a>
              <a href={TEL} className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-medium">
                <Phone className="w-4 h-4" /> Or call +91 9257877312
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
