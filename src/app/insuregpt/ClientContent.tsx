'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ── Example Questions ───────────────────────────────────────────────────────
const exampleQuestions = [
  { icon: Heart, question: 'Best health plan for family?', category: 'Health' },
  { icon: Car, question: 'Zero dep vs comprehensive car insurance?', category: 'Motor' },
  { icon: Shield, question: 'How much term insurance do I need?', category: 'Life' },
  { icon: FileText, question: 'How to file a cashless claim?', category: 'Claims' },
  { icon: Calculator, question: 'Tax benefits under Section 80D?', category: 'Tax' },
  { icon: Globe, question: 'Travel insurance for international trip?', category: 'Travel' },
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
    icon: Globe,
    title: 'Multi-Language Support',
    titleHi: 'बहुभाषी समर्थन',
    desc: "Chat in English, Hindi, or Hinglish. Insurance jargon is hard enough — language shouldn't be a barrier.",
  },
  {
    icon: Sparkles,
    title: '100% Free, No Obligation',
    titleHi: '100% मुफ़्त, कोई बाध्यता नहीं',
    desc: 'No hidden charges, no sales pressure. Ask as many questions as you want. When you\'re ready, connect with a certified advisor for free.',
  },
];

// ── Sample conversation data ────────────────────────────────────────────────
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
    answer: 'Yes! Zero dep covers full repair cost without depreciation deduction. For bikes/cars under 5 years old, it can save ₹3,000-₹15,000 per claim. Costs only 15-20% extra on OD premium.',
  },
];

// ============================================================================
// InsureGPT Landing Page
// ============================================================================
export default function InsureGPTPage() {
  const [activeSample, setActiveSample] = useState(0);

  const openChat = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-insuregpt'));
    }
  }, []);

  return (
    <>
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative overflow-hidden py-16 sm:py-24 md:py-28" style={{ background: 'linear-gradient(160deg, #071B3B 0%, #2563EB 40%, #082247 70%, #061A36 100%)' }}>
        {/* Decorative orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute w-[400px] h-[400px] bg-[#F4B400]/10 rounded-full blur-[100px] top-10 left-[5%]" />
          <div className="absolute w-[350px] h-[350px] bg-[#2563EB]/30 rounded-full blur-[80px] bottom-10 right-[10%]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <Badge className="mb-6 bg-[#F4B400]/15 text-amber-300 border-[#F4B400]/30 rounded-full px-5 py-1.5 text-sm">
              <Brain className="w-3.5 h-3.5 mr-1.5" />
              India&apos;s First AI Insurance Advisor
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white">
              Meet <span className="bg-gradient-to-r from-[#F4B400] to-[#F0D060] bg-clip-text text-transparent">InsureGPT</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-3">
              Your AI-powered insurance advisor. Ask any question in English, Hindi, or Hinglish.
            </p>
            <p className="text-sm text-white/50 italic max-w-xl mx-auto mb-8">
              आपका AI इंश्योरेंस सलाहकार। अंग्रेजी, हिंदी या हिंगलिश में कोई भी सवाल पूछें।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={openChat}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#F4B400] to-[#C89E00] hover:from-[#E8B828] hover:to-[#F4B400] text-[#071B3B] font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-lg shadow-[#F4B400]/20 hover:shadow-[#F4B400]/40 hover:scale-[1.03] text-base"
              >
                <MessageCircle className="w-5 h-5" />
                Chat with InsureGPT
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20with%20insurance"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold border border-white/20 text-white hover:bg-white/10 transition-all duration-300 text-base"
              >
                <Phone className="w-5 h-5 text-emerald-400" />
                Talk to Expert
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-white/60">
              {[
                { icon: ShieldCheck, text: 'IRDAI Certified' },
                { icon: CheckCircle2, text: '51+ Insurers' },
                { icon: Sparkles, text: '100% Free' },
                { icon: Star, text: '500+ Families' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-[#F4B400]" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-[2]" style={{ background: 'linear-gradient(to top, var(--background, #F8FAFC), transparent)' }} aria-hidden="true" />
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              How <span className="gradient-text">InsureGPT</span> Works
            </h2>
            <p className="text-sm text-[#F4B400] dark:text-amber-400">InsureGPT कैसे काम करता है</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Ask Your Question',
                titleHi: 'अपना सवाल पूछें',
                desc: 'Type your insurance question in English, Hindi, or Hinglish. No login required.',
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#071B3B]/10 to-[#F4B400]/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#071B3B] dark:text-[#F4B400]" />
                  </div>
                  <div className="text-xs font-bold text-[#F4B400] mb-2">STEP {item.step}</div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-xs text-[#F4B400]/70 dark:text-amber-400/60 mb-2">{item.titleHi}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Why Choose <span className="gradient-text">InsureGPT</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              InsureGPT is India&apos;s first AI-powered insurance chatbot built on IRDAI regulations,
              1000+ insurance plans, and real-time market data.
            </p>
            <p className="text-sm text-[#F4B400] dark:text-amber-400 mt-1">
              InsureGPT भारत का पहला AI-संचालित इंश्योरेंस चैटबॉट है।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-[#071B3B]/[0.06] dark:border-[#F4B400]/[0.1]"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#071B3B]/10 to-[#F4B400]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#071B3B] dark:text-[#F4B400]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                  <p className="text-xs text-[#F4B400]/70 dark:text-amber-400/60 mb-2">{feature.titleHi}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              What Can You <span className="gradient-text">Ask InsureGPT</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From plan comparisons to claim guidance, InsureGPT handles it all. Click any question to try it!
            </p>
            <p className="text-sm text-[#F4B400] dark:text-amber-400 mt-1">
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
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm text-left hover:shadow-md hover:border-[#F4B400]/30 border border-[#071B3B]/[0.06] dark:border-[#F4B400]/[0.1] transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#071B3B]/10 dark:bg-[#F4B400]/10 flex items-center justify-center shrink-0 group-hover:bg-[#F4B400]/20 transition">
                      <Icon className="w-5 h-5 text-[#071B3B] dark:text-[#F4B400]" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{q.category}</span>
                      <p className="text-sm font-medium mt-0.5 group-hover:text-[#071B3B] dark:group-hover:text-[#F4B400] transition">{q.question}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#F4B400] transition shrink-0 mt-1" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== LIVE CHAT SECTION ===================== */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              See <span className="gradient-text">InsureGPT</span> in Action
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here&apos;s a preview of how InsureGPT responds. Click the button below to start your own conversation!
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-[#071B3B]/[0.06] dark:border-[#F4B400]/[0.1]">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#071B3B]/[0.06] dark:border-[#F4B400]/[0.1] bg-gradient-to-r from-[#071B3B]/5 to-[#F4B400]/5">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Bot className="w-5 h-5 text-[#071B3B] dark:text-[#F4B400]" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800" />
                  </div>
                  <div>
                    <span className="text-sm font-bold">InsureGPT</span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2">● Online</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-[#F4B400]/40 text-[#071B3B] dark:text-[#F4B400]">
                  <ShieldCheck className="w-3 h-3 mr-1" />IRDAI Compliant
                </Badge>
              </div>

              {/* Sample Conversation Carousel */}
              <div className="px-4 sm:px-6 py-5 space-y-4 min-h-[200px]">
                {sampleConversations.map((conv, idx) => (
                  <div key={idx} className={`transition-all duration-300 ${activeSample === idx ? 'opacity-100' : 'opacity-40 scale-95'}`}>
                    {/* User question */}
                    <div className="flex justify-end mb-3">
                      <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-[#071B3B] text-white rounded-br-md">
                        {conv.question}
                      </div>
                    </div>
                    {/* Bot answer */}
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-muted/80 text-foreground rounded-bl-md border border-border/50">
                        {conv.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample navigation dots */}
              <div className="flex justify-center gap-2 pb-4">
                {sampleConversations.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSample(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${activeSample === idx ? 'bg-[#F4B400] scale-125' : 'bg-[#071B3B]/20 dark:bg-[#F4B400]/30'}`}
                    aria-label={`View sample ${idx + 1}`}
                  />
                ))}
              </div>

              {/* CTA to open real chat */}
              <div className="px-4 sm:px-6 py-4 border-t border-[#071B3B]/[0.06] dark:border-[#F4B400]/[0.1] text-center">
                <Button
                  onClick={openChat}
                  className="bg-gradient-to-r from-[#F4B400] to-[#C89E00] hover:from-[#E8B828] hover:to-[#F4B400] text-[#071B3B] font-bold rounded-full px-6 gap-2 shadow-md"
                  size="lg"
                >
                  <Send className="w-4 h-4" />
                  Start Chatting Now
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  No login required. Free & instant. / लॉगिन ज़रूरी नहीं। मुफ़्त और तत्काल।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CTA SECTION ===================== */}
      <section className="py-20 md:py-28" style={{ background: 'linear-gradient(160deg, #071B3B 0%, #2563EB 40%, #082247 70%, #061A36 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
            Ready to Chat with <span className="bg-gradient-to-r from-[#F4B400] to-[#F0D060] bg-clip-text text-transparent">InsureGPT</span>?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Get instant, personalized insurance guidance. It&apos;s free, it&apos;s smart, and it&apos;s available 24/7.
          </p>
          <p className="text-sm text-white/50 italic mb-8">
            तत्काल, व्यक्तिगत इंश्योरेंस मार्गदर्शन प्राप्त करें। यह मुफ़्त है, समझदार है, और 24/7 उपलब्ध है।
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openChat}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#F4B400] to-[#C89E00] hover:from-[#E8B828] hover:to-[#F4B400] text-[#071B3B] font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-lg shadow-[#F4B400]/20 hover:shadow-[#F4B400]/40 hover:scale-[1.03] text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Chat with InsureGPT
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20help%20with%20insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold border border-white/20 text-white hover:bg-white/10 transition-all duration-300 text-base"
            >
              <Phone className="w-5 h-5 text-emerald-400" />
              Chat on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-xs text-white/40">
            By Himanshu Paliwal — IRDAI Certified Insurance Advisor (POSP Code: IP429834)
          </p>
        </div>
      </section>
    </>
  );
}
