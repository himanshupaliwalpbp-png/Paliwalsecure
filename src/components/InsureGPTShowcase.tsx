'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, User, ArrowRight, MessageCircle, ShieldCheck, Sparkles, Zap, Globe,
  Clock, HandCoins, HeartPulse, Brain, Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';

// ── Animation variants ────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const chatBubbleVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.2 } },
};

// ── Mock Chat Messages ────────────────────────────────────────────────────
interface MockMessage {
  role: 'user' | 'bot';
  content: string;
  time: string;
}

const mockMessages: MockMessage[] = [
  {
    role: 'user',
    content: 'Mujhe apne parents ke liye health insurance chahiye — unki age 58 aur 54 hai. Kya best plan suggest kar sakte ho?',
    time: '10:32 AM',
  },
  {
    role: 'bot',
    content:
      'Namaste! 🙏 Parents ke liye insurance lena ek bahut samajhdari ka faisla hai. Main aapke liye 51+ insurers se top plans shortlist karta hoon:\n\n⭐ Care Senior — ₹2,180/mo | CSR 100% | 21,700+ hospitals | No capping on room rent\n⭐ Niva Bupa Health Companion — ₹2,340/mo | CSR 100% | Modern treatment covered | Domiciliary care\n⭐ HDFC Ergo Optima Secure — ₹2,490/mo | CSR 99.16% | Maternity + Restore benefit\n\nSab plans me cashless treatment aur pre-existing diseases 2-year waiting period ke baad covered hain. Kaunsa plan aapko zyada suitable lagta hai?',
    time: '10:32 AM',
  },
  {
    role: 'user',
    content: 'Agar claim karna pade toh process kaisa hai? Kitna time lagta hai settlement me?',
    time: '10:33 AM',
  },
  {
    role: 'bot',
    content:
      'Great question! Claim process bahut simple hai — main step-by-step samjhata hoon:\n\n1️⃣ Intimate claim within 48 hours (app pe ya call karke)\n2️⃣ Upload documents — Aadhaar, policy copy, hospital bills\n3️⃣ Cashless: Instant approval at network hospitals | Reimbursement: 7–15 working days\n\n📌 Average settlement time: Cashless claims in 2 hours, reimbursement in 12 days\n📌 Our claim support team aapko filing se lekar settlement tak guide karegi\n\nKya aap kisi specific plan ke claim ratio ke baare me aur jaanna chahenge?',
    time: '10:33 AM',
  },
  {
    role: 'user',
    content: 'Niva Bupa wala plan achha lag raha hai. Tax benefit bhi milega?',
    time: '10:34 AM',
  },
  {
    role: 'bot',
    content:
      'Bilkul! 💰 Niva Bupa Health Companion ke saap aap Section 80D me ₹75,000 tak ka tax save kar sakte hain:\n\n• Self + Family: Up to ₹25,000 deduction\n• Parents (Senior Citizens): Additional ₹50,000 deduction\n• Preventive health check-up: ₹5,000 included\n\nEffective cost after tax savings: ₹1,680/mo — that\'s 28% savings! 🎯\n\nShall I help you start the application? It takes under 2 minutes.',
    time: '10:34 AM',
  },
];

// ── Feature Items with Icons ──────────────────────────────────────────────
const featureKeys = [
  { icon: Sparkles, titleKey: 'insureGPT.feature.ai.title', textKey: 'insureGPT.feature.ai.text' },
  { icon: Globe, titleKey: 'insureGPT.feature.language.title', textKey: 'insureGPT.feature.language.text' },
  { icon: Zap, titleKey: 'insureGPT.feature.instant.title', textKey: 'insureGPT.feature.instant.text' },
  { icon: ShieldCheck, titleKey: 'insureGPT.feature.irdai.title', textKey: 'insureGPT.feature.irdai.text' },
  { icon: HandCoins, titleKey: 'insureGPT.feature.tax.title', textKey: 'insureGPT.feature.tax.text' },
  { icon: HeartPulse, titleKey: 'insureGPT.feature.claims.title', textKey: 'insureGPT.feature.claims.text' },
];

// ── Main Component ────────────────────────────────────────────────────────
export default function InsureGPTShowcase() {
  const { t } = useLanguage();
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const handleOpenInsureGPT = () => {
    window.dispatchEvent(new CustomEvent('open-insuregpt'));
  };

  // Progressive message reveal
  const startChatAnimation = useCallback(() => {
    if (chatStarted) return;
    setChatStarted(true);
  }, [chatStarted]);

  useEffect(() => {
    if (!chatStarted) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < mockMessages.length; i++) {
      const delay = i === 0 ? 600 : (mockMessages[i - 1].role === 'bot' ? 2800 : 1200);

      if (mockMessages[i].role === 'bot') {
        const typingDelay = delay - 800;
        timers.push(setTimeout(() => setIsTyping(true), typingDelay > 0 ? typingDelay : 0));
        timers.push(setTimeout(() => setIsTyping(false), delay));
      }

      timers.push(setTimeout(() => {
        setVisibleMessages(i + 1);
      }, delay));
    }

    return () => timers.forEach(clearTimeout);
  }, [chatStarted]);

  // Auto-start chat when section comes into view
  const [sectionRef, setSectionRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startChatAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef);
    return () => observer.disconnect();
  }, [sectionRef, startChatAnimation]);

  return (
    <section
      id="insuregpt-showcase"
      dir="ltr"
      ref={setSectionRef}
      className="relative py-16 sm:py-20 lg:py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(165deg, #071B3B 0%, #0C2D5A 35%, #081221 70%, #060E1A 100%)',
        writingMode: 'horizontal-tb',
      }}
      aria-label="InsureGPT AI Insurance Advisor showcase"
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* Decorative radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#F4B400]/[0.05] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#2563EB]/[0.1] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#1E3A5F]/[0.08] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ──────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-12 lg:mb-16"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-5">
            <Badge
              className="bg-[#F4B400]/10 text-[#F4B400] border border-[#F4B400]/25 px-5 py-2 text-xs sm:text-sm font-semibold rounded-full backdrop-blur-sm"
              dir="ltr"
              style={{ writingMode: 'horizontal-tb' }}
            >
              <Brain className="w-4 h-4 mr-2 inline" />
              {t('insureGPT.badge')}
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading text-white leading-tight"
            dir="ltr"
            style={{ writingMode: 'horizontal-tb' }}
          >
            {t('insureGPT.heading')}
          </motion.h2>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="mt-4 text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed"
            dir="ltr"
            style={{ writingMode: 'horizontal-tb' }}
          >
            {t('insureGPT.subheading')}
          </motion.p>

          {/* Powered by — CRITICAL: Must be horizontal, single line */}
          <motion.div
            variants={itemVariants}
            className="flex flex-row items-center justify-center gap-1.5 mt-4"
            dir="ltr"
            style={{ writingMode: 'horizontal-tb' }}
          >
            <Zap className="w-3.5 h-3.5 text-[#F4B400]/70" />
            <span
              className="text-xs text-white/55 font-medium whitespace-nowrap"
              dir="ltr"
              style={{ writingMode: 'horizontal-tb' }}
            >
              Powered by Paliwal Secure
            </span>
          </motion.div>
        </motion.div>

        {/* ── Two Column Layout ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* ── Left Column: Info Cards ──────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-4"
          >
            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {featureKeys.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -3, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group relative bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#F4B400]/25 p-4 sm:p-5 transition-all duration-300 hover:bg-white/[0.09] hover:shadow-lg hover:shadow-[#F4B400]/[0.06]"
                  dir="ltr"
                  style={{ writingMode: 'horizontal-tb' }}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F4B400]/20 to-[#2563EB]/10 border border-[#F4B400]/15 flex items-center justify-center mb-3 group-hover:from-[#F4B400]/30 group-hover:border-[#F4B400]/30 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-[#F4B400]" />
                  </div>

                  {/* Title */}
                  <p
                    className="text-sm font-semibold text-white leading-snug mb-1 whitespace-nowrap"
                    dir="ltr"
                    style={{ writingMode: 'horizontal-tb' }}
                  >
                    {t(feature.titleKey)}
                  </p>

                  {/* Description */}
                  <p
                    className="text-xs text-white/60 leading-relaxed line-clamp-2"
                    dir="ltr"
                    style={{ writingMode: 'horizontal-tb' }}
                  >
                    {t(feature.textKey)}
                  </p>

                  {/* Hover glow accent */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F4B400]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2"
              dir="ltr"
              style={{ writingMode: 'horizontal-tb' }}
            >
              <Button
                size="lg"
                onClick={handleOpenInsureGPT}
                className="bg-gradient-to-r from-[#F4B400] to-[#C89E00] hover:from-[#FFD54F] hover:to-[#F4B400] text-[#071B3B] text-sm sm:text-base font-semibold px-6 sm:px-8 py-5 rounded-full shadow-lg shadow-[#F4B400]/20 hover:shadow-xl hover:shadow-[#F4B400]/30 transition-all duration-300 group/btn min-h-[48px]"
              >
                {t('insureGPT.cta.chat')}
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </Button>
              <a
                href="https://wa.me/919257877312"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#F4B400]/30 text-[#F4B400] hover:bg-[#F4B400]/10 hover:border-[#F4B400]/50 text-sm sm:text-base font-semibold px-6 sm:px-8 py-5 rounded-full transition-all duration-300 backdrop-blur-sm bg-transparent min-h-[48px]"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t('insureGPT.cta.whatsapp')}
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right Column: Chat Interface ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative"
          >
            {/* Chat container */}
            <div
              className="relative bg-white/[0.06] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden"
              dir="ltr"
              style={{ writingMode: 'horizontal-tb' }}
            >
              {/* Chat Header */}
              <div
                className="relative px-4 sm:px-5 py-3.5 flex flex-row items-center justify-between overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, rgba(7,27,59,0.8), rgba(37,99,235,0.3), rgba(244,180,0,0.2), rgba(37,99,235,0.3), rgba(7,27,59,0.8))',
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 8s ease infinite',
                  writingMode: 'horizontal-tb',
                }}
                dir="ltr"
              >
                <div className="flex flex-row items-center gap-3" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>
                  {/* Bot Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#071B3B] to-[#F4B400] flex items-center justify-center shadow-md shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col gap-0.5" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>
                    <div className="flex flex-row items-center gap-2" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>
                      <span className="font-bold text-sm text-white whitespace-nowrap" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>InsureGPT</span>
                      <span className="inline-flex flex-row items-center gap-0.5 bg-white/15 px-1.5 py-0.5 rounded-full text-[8px] font-semibold text-white/80 whitespace-nowrap" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>
                        <ShieldCheck className="w-2.5 h-2.5" />
                        IRDAI
                      </span>
                    </div>
                    {/* CRITICAL: "Powered by Paliwal Secure" — MUST be horizontal, single line */}
                    <span
                      className="flex flex-row items-center gap-1 text-[9px] text-white/55 font-medium whitespace-nowrap"
                      dir="ltr"
                      style={{ writingMode: 'horizontal-tb' }}
                    >
                      <Zap className="w-2.5 h-2.5 text-[#F4B400]/60" />
                      Powered by Paliwal Secure
                    </span>
                  </div>
                </div>
                {/* Header status */}
                <div className="flex flex-row items-center gap-1.5 text-white/55 shrink-0" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-medium whitespace-nowrap" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>{t('insureGPT.onlineStatus')}</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="px-4 sm:px-5 py-5 space-y-4 min-h-[380px] sm:min-h-[420px] max-h-[460px] sm:max-h-[500px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                <AnimatePresence mode="popLayout">
                  {mockMessages.slice(0, visibleMessages).map((msg, index) => (
                    <motion.div
                      key={index}
                      variants={chatBubbleVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className={`flex flex-row items-start gap-2.5 ${
                        msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                      dir="ltr"
                      style={{ writingMode: 'horizontal-tb' }}
                    >
                      {/* Avatar */}
                      {msg.role === 'bot' ? (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#071B3B] to-[#F4B400] flex items-center justify-center shrink-0 shadow-md shadow-[#071B3B]/15">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F4B400] to-[#071B3B] flex items-center justify-center shrink-0 shadow-md shadow-[#F4B400]/15">
                          <User className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={`max-w-[80%] relative break-words ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-[#071B3B] to-[#F4B400] text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 shadow-md shadow-[#071B3B]/15'
                            : 'bg-white/90 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 border border-slate-100 dark:border-slate-700/50 shadow-sm'
                        }`}
                        dir="ltr"
                        style={{ writingMode: 'horizontal-tb' }}
                      >
                        <p className="text-[13px] leading-relaxed whitespace-pre-line" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>{msg.content}</p>
                        <p
                          className={`text-[9px] mt-1.5 ${
                            msg.role === 'user'
                              ? 'text-white/55 text-right'
                              : 'text-slate-400 dark:text-slate-500'
                          }`}
                          dir="ltr"
                          style={{ writingMode: 'horizontal-tb' }}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-row items-start gap-2.5"
                      dir="ltr"
                      style={{ writingMode: 'horizontal-tb' }}
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#071B3B] to-[#F4B400] flex items-center justify-center shrink-0 shadow-md shadow-[#071B3B]/15">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-white/90 dark:bg-slate-800/70 rounded-2xl rounded-tl-sm px-4 py-2.5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                        <div className="flex flex-row items-center gap-1.5" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="w-2 h-2 rounded-full"
                              style={{
                                background: i === 0 ? '#071B3B' : i === 1 ? '#F4B400' : '#C89E00',
                              }}
                              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 ml-1 whitespace-nowrap" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>typing</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat Input (decorative) */}
              <div className="px-4 sm:px-5 py-3 border-t border-white/10" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>
                <div className="flex flex-row items-center gap-2 bg-white/[0.05] rounded-full px-4 py-2.5 border border-white/10" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>
                  <span className="text-white/30 text-sm flex-1 whitespace-nowrap" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>{t('insureGPT.chatPlaceholder')}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#071B3B] to-[#F4B400] flex items-center justify-center shrink-0 shadow-md">
                    <Send className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center gap-3 mt-2" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>
                  <span className="text-[9px] text-white/25 flex flex-row items-center gap-1 whitespace-nowrap" dir="ltr" style={{ writingMode: 'horizontal-tb' }}>
                    <ShieldCheck className="w-2.5 h-2.5" />
                    IRDAI Registered POSP
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative glow behind chat */}
            <div className="absolute -inset-4 bg-[#F4B400]/[0.04] rounded-3xl blur-2xl -z-10 pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
