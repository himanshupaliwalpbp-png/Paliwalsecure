'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import {
  Shield,
  Phone,
  Mail,
  Heart,
  Car,
  BookOpen,
  BarChart3,
  Bot,
  FileText,
  Lock,
  Plane,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
  Star,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage, t } from '@/lib/i18n';

/* ────────────────────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────────────────────── */

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
}

/* ────────────────────────────────────────────────────────────────────────────
   Social links
   ──────────────────────────────────────────────────────────────────────────── */

const SOCIAL_LINKS = [
  { icon: Twitter, href: 'https://x.com/Paliwalinsure', label: 'X (Twitter)' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/himanshu-paliwal-41aa37414', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/palival_visuals?igsh=YnB4MmVkdXdiejVk', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/@paliwalinsure', label: 'YouTube' },
];

/* ────────────────────────────────────────────────────────────────────────────
   Stats data
   ──────────────────────────────────────────────────────────────────────────── */

const STATS = [
  { icon: Shield, value: '50+', labelEn: 'Insurers', labelHi: 'बीमाकर्ता', labelHinglish: 'Insurance Companies' },
  { icon: CheckCircle2, value: '98%', labelEn: 'Claims', labelHi: 'क्लेम', labelHinglish: 'Claims Settled' },
  { icon: Users, value: '500+', labelEn: 'Families', labelHi: 'परिवार', labelHinglish: 'Parivaar' },
  { icon: Star, value: '4.9★', labelEn: 'Rating', labelHi: 'रेटिंग', labelHinglish: 'Rating' },
];

/* ────────────────────────────────────────────────────────────────────────────
   Floating Gold Particles
   ──────────────────────────────────────────────────────────────────────────── */

function GoldParticles() {
  const prefersReducedMotion = useReducedMotion();

  const particles = useMemo(() => {
    if (prefersReducedMotion) return [];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 6,
      opacity: 0.15 + Math.random() * 0.25,
    }));
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, #C98A1C ${0}%, #C98A1C 100%)`,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 10, -10, 5, 0],
            opacity: [p.opacity, p.opacity * 0.5, p.opacity, p.opacity * 0.7, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Animated Divider
   ──────────────────────────────────────────────────────────────────────────── */

function AnimatedDivider({ vertical = false }: { vertical?: boolean }) {
  if (vertical) {
    return (
      <div className="hidden lg:block absolute right-0 top-4 bottom-4 w-px">
        <motion.div
          className="w-full h-full"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(201,138,28,0.3), rgba(232,201,122,0.5), rgba(201,138,28,0.3), transparent)',
          }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }
  return (
    <motion.div
      className="h-px w-full"
      style={{
        background: 'linear-gradient(to right, transparent, rgba(201,138,28,0.3), rgba(232,201,122,0.5), rgba(201,138,28,0.3), transparent)',
      }}
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Gold Heading Accent
   ──────────────────────────────────────────────────────────────────────────── */

function GoldHeadingAccent() {
  return (
    <motion.div
      className="h-0.5 w-8 rounded-full mt-1.5"
      style={{ background: 'linear-gradient(to right, #C98A1C, #C98A1C)' }}
      initial={{ width: 0, opacity: 0 }}
      whileInView={{ width: 32, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Animation variants
   ──────────────────────────────────────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

/* ────────────────────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────────────────────── */

export default function Footer({ onNavigate = () => {} }: FooterProps) {
  const { language } = useLanguage();

  const WHATSAPP_URL = 'https://wa.me/919257877312';
  const PHONE = '+91-92587-77312';
  const EMAIL = 'himanshupaliwalpbp@gmail.com';

  const getStatLabel = (stat: typeof STATS[0]) => {
    if (language === 'hi') return stat.labelHi;
    if (language === 'hinglish') return stat.labelHinglish;
    return stat.labelEn;
  };

  return (
    <footer
      className="relative bg-[#08080A] pb-20 md:pb-0 mt-auto"
      role="contentinfo"
    >
      {/* Floating Gold Particles Background */}
      <GoldParticles />

      {/* Gold top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C98A1C]/60 to-transparent" />

      {/* ═══════════════════════════════════════════════════════════════════════
          PREMIUM CTA BANNER
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={ctaVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F1C40 0%, #0A1330 50%, #0F1C40 100%)',
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(201,138,28,0.5) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-8">
            {/* Left: Heading + subtext */}
            <div className="text-center sm:text-left">
              <h2
                className="text-xl sm:text-2xl font-heading font-bold tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #C98A1C 0%, #C98A1C 50%, #C98A1C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <span className="inline-block mr-1.5" style={{ color: '#C98A1C' }}>&#10022;</span>
                {language === 'hi'
                  ? 'मुफ़्त बीमा परामर्श प्राप्त करें'
                  : language === 'hinglish'
                    ? 'Free Insurance Consultation Lo'
                    : 'Get Free Insurance Consultation'}
              </h2>
              <p className="text-[#8A96A8] text-sm mt-1.5 max-w-md">
                {language === 'hi'
                  ? 'हमारे IRDAI पंजीकृत विशेषज्ञ से बात करें — बिल्कुल मुफ़्त!'
                  : language === 'hinglish'
                    ? 'IRDAI Registered Expert se baat karein — bilkul free!'
                    : 'Talk to our IRDAI-registered expert — absolutely free!'}
              </p>
            </div>

            {/* Right: Button + Phone */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <Button
                asChild
                className="relative group px-6 py-2.5 font-semibold text-sm rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#C98A1C]/20"
                style={{
                  background: 'linear-gradient(135deg, #0A1330, #0F1C40)',
                  border: '1.5px solid #C98A1C',
                  color: '#FFFFFF',
                }}
              >
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <span className="relative z-10 flex items-center gap-2">
                    {language === 'hi' ? 'कॉलबैक पाएं' : language === 'hinglish' ? 'Callback Lo' : 'Get Callback'}
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </Button>

              <div className="flex items-center gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[#22C55E] hover:text-[#22C55E]/80 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="sr-only sm:not-sr-only text-xs">
                    {t('footer.whatsapp', language)}
                  </span>
                </a>
                <a
                  href={`tel:${PHONE.replace(/[^+\d]/g, '')}`}
                  className="flex items-center gap-1.5 text-sm text-[#8A96A8] hover:text-[#C98A1C] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-xs">{PHONE}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gold accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#C98A1C]/30 to-transparent" />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
          STATS ROW
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.labelEn}
                custom={i}
                variants={statVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-20px' }}
                className="relative group rounded-xl p-3 sm:p-4 text-center overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(201,138,28,0.12)',
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(201,138,28,0.06) 0%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <Icon className="w-4 h-4 text-[#C98A1C] mx-auto mb-1.5" />
                  <div className="text-lg sm:text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-[#8A96A8] uppercase tracking-wider mt-0.5">
                    {getStatLabel(stat)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedDivider />
      </div>

      {/* ── Main Grid ──────────────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 relative">
          {/* ─── Column 1: Brand ──────────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="relative">
            {/* Vertical divider (desktop) */}
            <AnimatedDivider vertical />

            {/* Logo */}
            <button
              onClick={() => onNavigate('hero')}
              className="group flex items-center gap-2.5 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50 rounded-xl"
              aria-label="Paliwal Secure – go to top"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#C98A1C] to-[#E0A830] shadow-md shadow-[#C98A1C]/20 transition-transform duration-200 group-hover:scale-105">
                <span className="font-heading font-bold text-[#060B1E] text-lg leading-none">
                  P
                </span>
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                Paliwal{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C98A1C] to-[#E0A830]">
                  Secure AI
                </span>
              </span>
            </button>

            {/* Tagline */}
            <p className="text-[#8A96A8] text-sm leading-relaxed mb-5 max-w-[260px]">
              {t('v2.footer.brandTagline', language)}
            </p>

            {/* Social Icons with animated gold hover */}
            <div className="flex items-center gap-3 mb-5">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/icon relative w-9 h-9 rounded-lg border border-[#C98A1C]/15 bg-[#0A1330] flex items-center justify-center text-[#8A96A8] hover:text-[#C98A1C] hover:border-[#C98A1C]/50 hover:bg-[#C98A1C]/10 transition-all duration-300 overflow-hidden"
                    aria-label={social.label}
                  >
                    {/* Gold sweep effect */}
                    <span
                      className="absolute inset-0 -translate-x-full group-hover/icon:translate-x-full transition-transform duration-500"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(232,201,122,0.15), transparent)',
                      }}
                      aria-hidden="true"
                    />
                    <Icon className="w-4 h-4 relative z-10" />
                  </a>
                );
              })}
            </div>

            {/* Contact: WhatsApp + Email */}
            <ul className="space-y-2.5">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-sm text-[#8A96A8] hover:text-[#C98A1C] transition-colors duration-200"
                >
                  <MessageCircle className="h-4 w-4 text-[#22C55E] group-hover:text-[#22C55E] transition-colors" />
                  <span className="relative">
                    {t('footer.whatsapp', language)}
                    <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-px bg-gradient-to-r from-[#C98A1C] to-[#E0A830] transition-all duration-300" />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="group flex items-center gap-2.5 text-sm text-[#8A96A8] hover:text-[#C98A1C] transition-colors duration-200"
                >
                  <Mail className="h-4 w-4 group-hover:text-[#C98A1C] transition-colors" />
                  <span className="relative break-all">
                    {EMAIL}
                    <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-px bg-gradient-to-r from-[#C98A1C] to-[#E0A830] transition-all duration-300" />
                  </span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* ─── Column 2: Insurance Types ──────────────────────────────────── */}
          <motion.div variants={itemVariants} className="relative">
            <AnimatedDivider vertical />
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C98A1C]" />
              {t('v2.footer.insuranceTypes', language)}
            </h3>
            <GoldHeadingAccent />
            <ul className="space-y-2.5 mt-3">
              {[
                { href: '/health-insurance', labelKey: 'v2.footer.health', icon: Heart, color: 'text-rose-400' },
                { href: '/car-insurance', labelKey: 'v2.footer.motor', icon: Car, color: 'text-amber-400' },
                { href: '/life-insurance', labelKey: 'v2.footer.life', icon: Shield, color: 'text-violet-400' },
                { href: '/travel-insurance', labelKey: 'v2.footer.travel', icon: Plane, color: 'text-sky-400' },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-[#8A96A8] hover:text-[#C98A1C] transition-colors duration-200"
                    >
                      <Icon className={`w-3.5 h-3.5 ${link.color} shrink-0`} />
                      <span className="relative">
                        {t(link.labelKey, language)}
                        <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-px bg-gradient-to-r from-[#C98A1C] to-[#E0A830] transition-all duration-300" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* ─── Column 3: Resources ──────────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="relative">
            <AnimatedDivider vertical />
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C98A1C]" />
              {t('footer.resources', language)}
            </h3>
            <GoldHeadingAccent />
            <ul className="space-y-2.5 mt-3">
              {[
                { href: '/blog', labelKey: 'v2.footer.blog', icon: BookOpen, color: 'text-[#C98A1C]' },
                { href: '/compare', labelKey: 'v2.footer.compare', icon: BarChart3, color: 'text-emerald-400' },
                { href: '/insuregpt', labelKey: 'v2.footer.insureGPT', icon: Bot, color: 'text-[#C98A1C]' },
                { href: '#faq', labelKey: 'v2.footer.faq', icon: FileText, color: 'text-sky-400' },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-[#8A96A8] hover:text-[#C98A1C] transition-colors duration-200"
                    >
                      <Icon className={`w-3.5 h-3.5 ${link.color} shrink-0`} />
                      <span className="relative">
                        {t(link.labelKey, language)}
                        <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-px bg-gradient-to-r from-[#C98A1C] to-[#E0A830] transition-all duration-300" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* ─── Column 4: Legal ──────────────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="relative">
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#C98A1C]" />
              {t('footer.legal', language)}
            </h3>
            <GoldHeadingAccent />
            <ul className="space-y-2.5 mt-3">
              {[
                { href: '/about', labelKey: 'v2.footer.about', icon: FileText },
                { href: '/privacy-policy', labelKey: 'v2.footer.privacyPolicy', icon: Lock },
                { href: '/terms-of-service', labelKey: 'v2.footer.terms', icon: FileText },
                { href: '/disclaimer', labelKey: 'v2.footer.disclaimer', icon: Shield },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-[#8A96A8] hover:text-[#C98A1C] transition-colors duration-200"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#8A96A8]/60 shrink-0" />
                      <span className="relative">
                        {t(link.labelKey, language)}
                        <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-px bg-gradient-to-r from-[#C98A1C] to-[#E0A830] transition-all duration-300" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* IRDAI compliance badge */}
            <div className="mt-5 pt-4 border-t border-[#C98A1C]/10">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Award className="w-3.5 h-3.5 text-[#C98A1C]" />
                <span className="text-[10px] font-semibold text-[#C98A1C] uppercase tracking-wider">
                  {t('footer.irdaiVerified', language)}
                </span>
              </div>
              <p className="text-[10px] text-[#8A96A8]/70 leading-relaxed">
                {t('footer.irdaiDisclaimer', language)}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BOTTOM BAR
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="border-t border-[#C98A1C]/10" style={{ background: 'rgba(10,22,40,0.6)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: IRDAI Badge + Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              {/* IRDAI Compliance Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ background: 'rgba(201,138,28,0.08)', border: '1px solid rgba(201,138,28,0.2)' }}>
                <Shield className="w-3.5 h-3.5 text-[#C98A1C]" />
                <span className="text-[10px] font-semibold text-[#C98A1C] tracking-wide">IRDAI POSP IP429834</span>
              </div>
              <p className="text-xs text-[#8A96A8]">
                {t('v2.footer.copyright', language)} | {t('v2.footer.solicitation', language)}
              </p>
            </div>

            {/* Right: Social Links + Contact */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {/* Social Icons with gold hover */}
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={`bottom-${social.label}`}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social relative flex items-center justify-center w-8 h-8 rounded-full text-[#8A96A8] hover:text-[#C98A1C] transition-all duration-300 overflow-hidden"
                    aria-label={social.label}
                  >
                    {/* Gold sweep effect */}
                    <span
                      className="absolute inset-0 -translate-x-full group-hover/social:translate-x-full transition-transform duration-500 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(232,201,122,0.12), transparent)',
                      }}
                      aria-hidden="true"
                    />
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                  </a>
                );
              })}

              {/* Separator */}
              <div className="h-4 w-px bg-[#C98A1C]/20 hidden sm:block" />

              {/* Phone */}
              <a
                href={`tel:${PHONE.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-1.5 text-xs text-[#8A96A8] hover:text-[#C98A1C] transition-colors duration-200"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{PHONE}</span>
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#8A96A8] hover:text-[#22C55E] transition-colors duration-200"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{t('footer.whatsapp', language)}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
