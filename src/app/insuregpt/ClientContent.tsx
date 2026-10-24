'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  MessageCircle,
  ShieldCheck,
  Globe,
  Zap,
  Heart,
  Car,
  Shield,
  FileText,
  Calculator,
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Phone,
  Send,
  Bot,
  Star,
  Languages,
  Scale,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ── Example Questions ───────────────────────────────────────────────────────
const exampleQuestions = [
  { icon: Heart, question: 'Best health plan for family?', questionHi: 'परिवार के लिए बेस्ट हेल्थ प्लान?', category: 'Health' },
  { icon: Car, question: 'Zero dep vs comprehensive car insurance?', questionHi: 'ज़ीरो डेप या कॉम्प्रिहेंसिव?', category: 'Motor' },
  { icon: Shield, question: 'How much term insurance do I need?', questionHi: 'कितना टर्म इंश्योरेंस चाहिए?', category: 'Life' },
  { icon: FileText, question: 'How to file a cashless claim?', questionHi: 'कैशलेस क्लेम कैसे करें?', category: 'Claims' },
  { icon: Calculator, question: 'Tax benefits under Section 80D?', questionHi: 'सेक्शन 80D में टैक्स बचत?', category: 'Tax' },
  { icon: Globe, question: 'Travel insurance for international trip?', questionHi: 'विदेश यात्रा बीमा?', category: 'Travel' },
];

// ── Capability marquee items ────────────────────────────────────────────────
const capabilities = [
  '⚡ Instant plan comparison',
  '🛡️ IRDAI-rule grounded answers',
  '💰 Tax saving calculator',
  '📋 Step-by-step claim guidance',
  '🏥 1000+ plans knowledge',
  '🗣️ English • हिन्दी • Hinglish',
  '🚗 Motor IDV expertise',
  '👨‍👩‍👧 Family floater advice',
  '👴 Senior citizen plans',
  '🧾 GST & ITC guidance',
];

// ── Features ────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: 'AI-Powered Intelligence',
    titleHi: 'AI-संचालित बुद्धिमत्ता',
    desc: 'InsureGPT uses advanced AI trained on IRDAI regulations, 1000+ insurance plans, and real-time market data to give you accurate, personalized advice.',
  },
  {
    icon: ShieldCheck,
    title: 'IRDAI-Compliant Answers',
    titleHi: 'IRDAI-अनुपालित उत्तर',
    desc: 'Every response is grounded in IRDAI regulations and current policy terms. No misleading advice — only factual, verified information.',
  },
  {
    icon: Clock,
    title: '24/7 Instant Responses',
    titleHi: '24/7 तत्काल प्रतिक्रिया',
    desc: "No waiting for business hours. Get answers to your insurance questions instantly, whether it's 2 PM or 2 AM.",
  },
  {
    icon: Zap,
    title: 'Personalized Recommendations',
    titleHi: 'व्यक्तिगत सिफारिशें',
    desc: 'Based on your age, family size, income, and health profile, InsureGPT recommends the most suitable plans — not generic advice.',
  },
  {
    icon: Languages,
    title: 'Trilingual — EN / हिं / Hinglish',
    titleHi: 'बहुभाषी समर्थन',
    desc: 'Chat in English, Hindi, or Hinglish — switch anytime with one tap. Insurance jargon is hard enough — language shouldn\u2019t be a barrier.',
  },
  {
    icon: Scale,
    title: 'Saver-Grade Tax Intel',
    titleHi: 'टैक्स बचत बुद्धिमत्ता',
    desc: 'Section 80D/80C, GST ITC, presumptive taxation — InsureGPT is wired into the Paliwal Saver engines for legally-optimized savings.',
  },
];

// ── Sample conversation data (auto-typing demo) ─────────────────────────────
const sampleConversations = [
  {
    question: 'What is the best health insurance for my family?',
    answer: 'For a family of 3-4, I recommend a Family Floater Plan with ₹15-25L coverage. Top picks: Star Health Family Optima, HDFC Ergo Optima Secure, Niva Bupa Health Companion.',
  },
  {
    question: 'How much tax can I save with health insurance?',
    answer: 'Under Section 80D, you can save up to ₹75,000/year: ₹25,000 (self + family) + ₹50,000 (senior citizen parents). Add preventive check-up ₹5,000 within limits.',
  },
  {
    question: 'Is zero depreciation cover worth it?',
    answer: 'Yes! Zero dep covers full repair cost without depreciation deduction. For cars under 5 years old, it can save ₹3,000-₹15,000 per claim. Costs only 15-20% extra on OD premium.',
  },
];

// ── Word-by-word animated headline ─────────────────────────────────────────
// LUMEN v17: ink headline on the light cream mesh hero.
function AnimatedHeadline() {
  const words = ['Meet', 'InsureGPT'];
  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-[#0E1116] text-display-h1">
      {words.map((word, i) => (
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.15 + i * 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={i === 1 ? 'grail-text' : undefined}
        >
          {word}
          {i === 0 ? ' ' : ''}
        </motion.span>
      ))}
    </h1>
  );
}

// ── Auto-typing conversation demo ───────────────────────────────────────────
function AutoTypeDemo() {
  const [convIdx, setConvIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState<'typing' | 'answering' | 'pause'>('typing');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const conv = sampleConversations[convIdx];
    if (phase === 'typing') {
      if (typed.length < conv.question.length) {
        timerRef.current = setTimeout(() => setTyped(conv.question.slice(0, typed.length + 1)), 42);
      } else {
        timerRef.current = setTimeout(() => setPhase('answering'), 500);
      }
    } else if (phase === 'answering') {
      timerRef.current = setTimeout(() => setPhase('pause'), 3400);
    } else {
      timerRef.current = setTimeout(() => {
        setConvIdx((i) => (i + 1) % sampleConversations.length);
        setTyped('');
        setPhase('typing');
      }, 1200);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [typed, phase, convIdx]);

  const conv = sampleConversations[convIdx];

  return (
    <div className="card-aurum overflow-hidden text-left">
      {/* Chat header — LUMEN v17 light ivory band, ink text */}
      <div className="igpt-header px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#B8482C]/12">
        <div className="flex items-center gap-2.5">
          <div className="igpt-avatar w-9 h-9">
            <Bot className="w-5 h-5 text-[#FDF6EC]" />
          </div>
          <div>
            <span className="text-sm font-bold text-[#0E1116]">InsureGPT</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-[#2D7A77] font-medium">Live demo</span>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-[#D4A853]/50 text-[#8F5A1E] bg-[#D4A853]/15">
          <ShieldCheck className="w-3 h-3 mr-1" />IRDAI Compliant
        </Badge>
      </div>

      {/* Conversation */}
      <div className="px-4 sm:px-6 py-5 space-y-4 min-h-[230px] bg-white/60 dark:bg-[#140508]/40">
        {/* User bubble (typing) */}
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-[#FDF6EC] shadow-lg bg-gradient-to-br from-[#C2552F] to-[#5E1223]">
            {phase === 'typing' ? (
              <span className="type-caret">{typed}</span>
            ) : (
              conv.question
            )}
          </div>
        </div>

        {/* Bot answer */}
        {(phase === 'answering' || phase === 'pause') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex justify-start"
          >
            <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm bg-[#F8EFD3]/80 dark:bg-[#231009]/80 text-[#2A1608] dark:text-[#F5E7B8] border border-[#D4A853]/30">
              {conv.answer}
            </div>
          </motion.div>
        )}

        {/* Thinking dots while typing question is being composed */}
        {phase === 'typing' && typed.length >= conv.question.length && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-[#F8EFD3]/80 dark:bg-[#231009]/80 border border-[#D4A853]/30 flex items-center gap-2">
              <span className="igpt-dot" />
              <span className="igpt-dot" />
              <span className="igpt-dot" />
            </div>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-1">
          {sampleConversations.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setConvIdx(idx); setTyped(''); setPhase('typing'); }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === convIdx ? 'bg-[#D4A853] scale-125' : 'bg-[#B8482C]/25 dark:bg-[#D4A853]/25 hover:bg-[#B8482C]/50'
              }`}
              aria-label={`View demo ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// InsureGPT Landing Page — AURUM INTELLIGENCE v16
// ============================================================================
export default function InsureGPTPage() {
  const openChat = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-insuregpt'));
    }
  }, []);

  return (
    <>
      {/* ===================== HERO — mesh aurum ===================== */}
      <section className="mesh-aurum relative overflow-hidden py-16 sm:py-24 md:py-28">
        {/* Grid + orbs */}
        <div className="mesh-aurum-grid" aria-hidden="true" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="orb orb-gold w-[380px] h-[380px] top-8 left-[4%]" />
          <div className="orb orb-sienna w-[320px] h-[320px] bottom-6 right-[8%]" style={{ animationDelay: '-4s' }} />
          <div className="orb orb-emerald w-[240px] h-[240px] top-1/3 right-1/4 opacity-30" style={{ animationDelay: '-7s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge — LUMEN v17: ivory glass with terracotta icon */}
            <div className="badge-aurum mb-6">
              <Brain className="w-3.5 h-3.5 text-[#B8482C]" />
              India&apos;s First AI Insurance Advisor
            </div>

            {/* Headline */}
            <AnimatedHeadline />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-lg md:text-xl text-[#4A4F57] max-w-3xl mx-auto mb-3"
            >
              Your AI-powered insurance advisor — trained on IRDAI rules, 1000+ plans &amp; live market data.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="text-sm text-[#7A4A12] max-w-xl mx-auto mb-10"
            >
              आपका AI इंश्योरेंस सलाहकार — अंग्रेज़ी, हिंदी या हिंगलिश में कोई भी सवाल पूछें। 🙏
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <button onClick={openChat} className="btn-aurum group">
                <MessageCircle className="w-5 h-5" />
                Chat with InsureGPT
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20with%20insurance"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-aurum-ghost text-[#5E1223]"
              >
                <Phone className="w-5 h-5 text-[#2D7A77]" />
                Talk to Expert
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-[#4A4F57]/85"
            >
              {[
                { icon: ShieldCheck, text: 'IRDAI Certified' },
                { icon: CheckCircle2, text: '51+ Insurers' },
                { icon: Sparkles, text: '100% Free' },
                { icon: Star, text: '500+ Families' },
                { icon: Languages, text: '3 Languages' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-[#B8482C]" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* POSP strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.6 }}
              className="mt-8 flex justify-center"
            >
              <div className="posP-strip">
                <ShieldCheck className="w-3 h-3 text-[#8F5A1E]" />
                By Himanshu Paliwal — IRDAI Registered POSP (IP429834)
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-[2]" style={{ background: 'linear-gradient(to top, var(--background, #F8FAFC), transparent)' }} aria-hidden="true" />
      </section>

      {/* ===================== CAPABILITY MARQUEE ===================== */}
      <section className="py-5 border-y border-[#D4A853]/20 bg-[#FDF9F0]/60 dark:bg-[#170608]/60" aria-label="InsureGPT capabilities">
        <div className="marquee-aurum max-w-6xl mx-auto">
          <div className="marquee-aurum-track">
            {[...capabilities, ...capabilities].map((cap, idx) => (
              <span key={idx} className="text-sm font-medium text-[#6E4A12] dark:text-[#E8C872]/80 whitespace-nowrap flex items-center gap-3">
                {cap}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-display-h2">
              How <span className="aurum-text">InsureGPT</span> Works
            </h2>
            <p className="text-sm text-[#6E4A12] dark:text-[#D4A853]">InsureGPT कैसे काम करता है</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 max-w-4xl mx-auto items-start">
            {[
              {
                step: '1',
                title: 'Ask Your Question',
                titleHi: 'अपना सवाल पूछें',
                desc: 'Type or speak your insurance question in English, Hindi, or Hinglish. No login required.',
                icon: MessageCircle,
              },
              {
                step: '2',
                title: 'AI Analyzes & Responds',
                titleHi: 'AI विश्लेषण करता है',
                desc: 'InsureGPT processes your query against 1000+ plans and IRDAI rules to give accurate answers.',
                icon: Brain,
              },
              {
                step: '3',
                title: 'Take Action',
                titleHi: 'कार्रवाई करें',
                desc: 'Compare plans, connect with a certified advisor, or get help filing a claim — all for free.',
                icon: ArrowRight,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="text-center relative"
                >
                  {idx > 0 && (
                    <div className="step-rail hidden md:block absolute -left-1/2 top-6 w-full" aria-hidden="true" />
                  )}
                  <div className="tilt-card inline-block mb-4">
                    <div className="tilt-inner">
                      <div className="medallion mb-4 mx-auto">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold tracking-[0.2em] text-[#B8482C] dark:text-[#D4A853] mb-2">STEP {item.step}</div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-xs text-[#6E4A12] dark:text-[#D4A853] mb-2">{item.titleHi}</p>
                  <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES SECTION ===================== */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-display-h2">
              Why Choose <span className="aurum-text">InsureGPT</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              India&apos;s first AI-powered insurance advisor built on IRDAI regulations, 1000+ insurance plans, and real-time market data.
            </p>
            <p className="text-sm text-[#6E4A12] dark:text-[#D4A853] mt-1">
              InsureGPT भारत का पहला AI-संचालित इंश्योरेंस चैटबॉट है।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="card-aurum p-6 tilt-card"
                >
                  <div className="tilt-inner">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-[#B8482C]/15 to-[#D4A853]/20 border border-[#D4A853]/30">
                      <Icon className="w-6 h-6 text-[#B8482C] dark:text-[#E8C872]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                    <p className="text-xs text-[#6E4A12] dark:text-[#D4A853] mb-2">{feature.titleHi}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== EXAMPLE QUESTIONS ===================== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-display-h2">
              What Can You <span className="aurum-text">Ask InsureGPT</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From plan comparisons to claim guidance, InsureGPT handles it all. Click any question to try it!
            </p>
            <p className="text-sm text-[#6E4A12] dark:text-[#D4A853] mt-1">
              प्लान तुलना से लेकर क्लेम मार्गदर्शन तक — InsureGPT सब संभालता है।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exampleQuestions.map((q, idx) => {
              const Icon = q.icon;
              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={openChat}
                  className="card-aurum p-5 text-left group cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-[#B8482C]/12 to-[#D4A853]/18 border border-[#D4A853]/25 group-hover:border-[#B8482C]/50 transition-colors">
                      <Icon className="w-5 h-5 text-[#B8482C] dark:text-[#E8C872]" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{q.category}</span>
                      <p className="text-sm font-medium mt-0.5 group-hover:text-[#B8482C] dark:group-hover:text-[#E8C872] transition-colors">{q.question}</p>
                      <p className="text-[11px] text-[#6E4A12] dark:text-[#D4A853]/70 mt-0.5">{q.questionHi}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#D4A853] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== LIVE DEMO — auto-typing ===================== */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-display-h2">
              See <span className="aurum-text">InsureGPT</span> in Action
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A live preview of how InsureGPT responds — auto-playing right now. Click below to start your own conversation!
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <AutoTypeDemo />

            {/* CTA to open real chat */}
            <div className="mt-8 text-center">
              <button onClick={openChat} className="btn-aurum group">
                <Send className="w-4 h-4" />
                Start Chatting Now
              </button>
              <p className="text-xs text-muted-foreground mt-3">
                No login required. Free &amp; instant. / लॉगिन ज़रूरी नहीं। मुफ़्त और तत्काल।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA — mesh aurum ===================== */}
      <section className="mesh-aurum relative overflow-hidden py-20 md:py-28">
        <div className="mesh-aurum-grid" aria-hidden="true" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="orb orb-gold w-[300px] h-[300px] top-0 left-[12%]" />
          <div className="orb orb-sienna w-[260px] h-[260px] bottom-4 right-[10%]" style={{ animationDelay: '-5s' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-4 text-[#0E1116] text-display-h2"
          >
            Ready to Chat with <span className="grail-text">InsureGPT</span>?
          </motion.h2>
          <p className="text-lg text-[#4A4F57] mb-3 max-w-2xl mx-auto">
            Get instant, personalized insurance guidance. It&apos;s free, it&apos;s smart, and it&apos;s available 24/7.
          </p>
          <p className="text-sm text-[#7A4A12] italic mb-8">
            तत्काल, व्यक्तिगत इंश्योरेंस मार्गदर्शन प्राप्त करें। यह मुफ़्त है, समझदार है, और 24/7 उपलब्ध है।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={openChat} className="btn-aurum group">
              <MessageCircle className="w-5 h-5" />
              Chat with InsureGPT
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20with%20insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-aurum-ghost text-[#5E1223]"
            >
              <Phone className="w-5 h-5 text-[#2D7A77]" />
              Chat on WhatsApp
            </a>
          </div>
          <p className="mt-8 text-xs text-[#0E1116]/60">
            By Himanshu Paliwal — IRDAI Certified Insurance Advisor (POSP Code: IP429834)
          </p>
        </div>
      </section>
    </>
  );
}
