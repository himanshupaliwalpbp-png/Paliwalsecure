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
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1.5 + Math.random() * 2,
      duration: 10 + Math.random() * 14,
      delay: Math.random() * 6,
      opacity: 0.1 + Math.random() * 0.15,
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
            background: `radial-gradient(circle, #E8C872 ${0}%, #E8C872 100%)`,
          }}
          animate={{
            y: [0, -25, 0, 15, 0],
            x: [0, 8, -8, 4, 0],
            opacity: [p.opacity, p.opacity * 0.4, p.opacity, p.opacity * 0.6, p.opacity],
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
   Animation variants
   ──────────────────────────────────────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
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
      className="relative bg-[#021E29] pb-16 md:pb-0 mt-auto"
      role="contentinfo"
    >
      {/* Floating Gold Particles Background */}
      <GoldParticles />

      {/* Top gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#E8C872]/20 to-transparent" />

      {/* ═══════════════════════════════════════════════════════════════════════
          PREMIUM CTA BANNER
          ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        variants={ctaVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="relative overflow-hidden"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* Left: Heading + subtext */}
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-heading font-bold tracking-tight text-white">
                <span className="inline-block mr-1.5 text-[#E8C872]">&#10022;</span>
                {language === 'hi'
                  ? 'मुफ़्त बीमा परामर्श प्राप्त करें'
                  : language === 'hinglish'
                    ? 'Free Insurance Consultation Lo'
                    : 'Get Free Insurance Consultation'}
              </h2>
              <p className="text-[#D7C2A5] text-sm mt-2 max-w-md font-sans">
                {language === 'hi'
                  ? 'हमारे IRDAI पंजीकृत विशेषज्ञ से बात करें — बिल्कुल मुफ़्त!'
                  : language === 'hinglish'
                    ? 'IRDAI Registered Expert se baat karein — bilkul free!'
                    : 'Talk to our IRDAI-registered expert — absolutely free!'}
              </p>
            </div>

            {/* Right: Button + Phone */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury-gold group"
              >
                {language === 'hi' ? 'कॉलबैक पाएं' : language === 'hinglish' ? 'Callback Lo' : 'Get Callback'}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>

              <div className="flex items-center gap-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[#22C55E] hover:text-[#22C55E]/80 transition-colors font-sans"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="sr-only sm:not-sr-only text-xs">
                    {t('footer.whatsapp', language)}
                  </span>
                </a>
                <a
                  href={`tel:${PHONE.replace(/[^+\d]/g, '')}`}
                  className="flex items-center gap-1.5 text-sm text-[#D7C2A5] hover:text-[#E8C872] transition-colors font-sans"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-xs">{PHONE}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
          STATS ROW
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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
                className="relative group rounded-xl p-4 sm:p-5 text-center overflow-hidden bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(232,200,114,0.04) 0%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <Icon className="w-4 h-4 text-[#E8C872] mx-auto mb-2" />
                  <div className="text-lg sm:text-xl font-bold text-white font-heading">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-[#D7C2A5] uppercase tracking-[0.1em] mt-0.5 font-heading">
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
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* ── Main Grid ──────────────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* ─── Column 1: Brand ──────────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            {/* Logo */}
            <button
              onClick={() => onNavigate('hero')}
              className="group flex items-center gap-2.5 mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C872]/50 rounded-xl"
              aria-label="Paliwal Secure – go to top"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#E8C872] to-[#D4A853] shadow-md shadow-[#E8C872]/20 transition-transform duration-200 group-hover:scale-105">
                <span className="font-heading font-bold text-[#021E29] text-lg leading-none">
                  P
                </span>
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                Paliwal{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E8C872] to-[#F0D890]">
                  Secure AI
                </span>
              </span>
            </button>

            {/* Tagline */}
            <p className="text-[#D7C2A5] text-sm leading-relaxed mb-5 max-w-[260px] font-sans">
              {t('v2.footer.brandTagline', language)}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 mb-5">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/icon relative w-8 h-8 rounded-lg border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-[#D7C2A5] hover:text-[#E8C872] hover:border-[#E8C872]/30 hover:bg-[#E8C872]/[0.06] transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                  </a>
                );
              })}
            </div>

            {/* Contact: WhatsApp + Email */}
            <ul className="space-y-3">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 text-sm text-[#D7C2A5] hover:text-[#E8C872] transition-colors duration-200 font-sans"
                >
                  <MessageCircle className="h-4 w-4 text-[#22C55E] group-hover:text-[#22C55E] transition-colors" />
                  <span className="relative">
                    {t('footer.whatsapp', language)}
                    <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-px bg-[#E8C872] transition-all duration-300" />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="group flex items-center gap-2.5 text-sm text-[#D7C2A5] hover:text-[#E8C872] transition-colors duration-200 font-sans"
                >
                  <Mail className="h-4 w-4 group-hover:text-[#E8C872] transition-colors" />
                  <span className="relative break-all">
                    {EMAIL}
                    <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-px bg-[#E8C872] transition-all duration-300" />
                  </span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* ─── Column 2: Insurance Types ──────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-[#E8C872]" />
              <h3 className="text-white text-xs font-semibold uppercase tracking-[0.12em] font-heading">
                {t('v2.footer.insuranceTypes', language)}
              </h3>
            </div>
            <div className="h-px w-8 bg-gradient-to-r from-[#E8C872]/50 to-transparent mb-4" />
            <ul className="space-y-3">
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
                      className="group flex items-center gap-2.5 text-sm text-[#D7C2A5] hover:text-[#E8C872] transition-colors duration-200 font-sans"
                    >
                      <Icon className={`w-3.5 h-3.5 ${link.color} shrink-0`} />
                      <span className="relative">
                        {t(link.labelKey, language)}
                        <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-px bg-[#E8C872] transition-all duration-300" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* ─── Column 3: Resources ──────────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-[#E8C872]" />
              <h3 className="text-white text-xs font-semibold uppercase tracking-[0.12em] font-heading">
                {t('footer.resources', language)}
              </h3>
            </div>
            <div className="h-px w-8 bg-gradient-to-r from-[#E8C872]/50 to-transparent mb-4" />
            <ul className="space-y-3">
              {[
                { href: '/blog', labelKey: 'v2.footer.blog', icon: BookOpen, color: 'text-[#E8C872]' },
                { href: '/compare', labelKey: 'v2.footer.compare', icon: BarChart3, color: 'text-emerald-400' },
                { href: '/insuregpt', labelKey: 'v2.footer.insureGPT', icon: Bot, color: 'text-[#E8C872]' },
                { href: '#faq', labelKey: 'v2.footer.faq', icon: FileText, color: 'text-sky-400' },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2.5 text-sm text-[#D7C2A5] hover:text-[#E8C872] transition-colors duration-200 font-sans"
                    >
                      <Icon className={`w-3.5 h-3.5 ${link.color} shrink-0`} />
                      <span className="relative">
                        {t(link.labelKey, language)}
                        <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-px bg-[#E8C872] transition-all duration-300" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* ─── Column 4: Legal ──────────────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-3.5 h-3.5 text-[#E8C872]" />
              <h3 className="text-white text-xs font-semibold uppercase tracking-[0.12em] font-heading">
                {t('footer.legal', language)}
              </h3>
            </div>
            <div className="h-px w-8 bg-gradient-to-r from-[#E8C872]/50 to-transparent mb-4" />
            <ul className="space-y-3">
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
                      className="group flex items-center gap-2.5 text-sm text-[#D7C2A5] hover:text-[#E8C872] transition-colors duration-200 font-sans"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#D7C2A5]/50 shrink-0" />
                      <span className="relative">
                        {t(link.labelKey, language)}
                        <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-px bg-[#E8C872] transition-all duration-300" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* IRDAI compliance badge */}
            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5 mb-2">
                <Award className="w-3.5 h-3.5 text-[#E8C872]" />
                <span className="text-[10px] font-semibold text-[#E8C872] uppercase tracking-[0.12em] font-heading">
                  {t('footer.irdaiVerified', language)}
                </span>
              </div>
              <p className="text-[10px] text-[#D7C2A5]/70 leading-relaxed font-sans">
                {t('footer.irdaiDisclaimer', language)}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BOTTOM BAR
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="border-t border-white/[0.06]" style={{ background: 'rgba(2,30,41,0.8)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: IRDAI Badge + Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              {/* IRDAI Compliance Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#E8C872]/[0.06] border border-[#E8C872]/[0.12]">
                <Shield className="w-3.5 h-3.5 text-[#E8C872]" />
                <span className="text-[10px] font-semibold text-[#E8C872] tracking-wide font-heading">IRDAI POSP IP429834</span>
              </div>
              <p className="text-xs text-[#D7C2A5] font-sans">
                {t('v2.footer.copyright', language)} | {t('v2.footer.solicitation', language)}
              </p>
            </div>

            {/* Right: Social Links + Contact */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {/* Social Icons */}
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={`bottom-${social.label}`}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social relative flex items-center justify-center w-8 h-8 rounded-full text-[#D7C2A5] hover:text-[#E8C872] transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                  </a>
                );
              })}

              {/* Separator */}
              <div className="h-4 w-px bg-white/[0.08] hidden sm:block" />

              {/* Phone */}
              <a
                href={`tel:${PHONE.replace(/[^+\d]/g, '')}`}
                className="flex items-center gap-1.5 text-xs text-[#D7C2A5] hover:text-[#E8C872] transition-colors duration-200 font-sans"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{PHONE}</span>
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#D7C2A5] hover:text-[#22C55E] transition-colors duration-200 font-sans"
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
