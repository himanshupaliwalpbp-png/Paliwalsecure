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
  { icon: Shield, value: '50+', labelEn: 'Insurers', labelHi: 'बीमाकर्ता', labelHinglish: 'Insurers' },
  { icon: CheckCircle2, value: '98%', labelEn: 'Claims', labelHi: 'क्लेम', labelHinglish: 'Claim Settle' },
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
            background: `radial-gradient(circle, #D4633F ${0}%, #D4633F 100%)`,
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
  const PHONE = 'WhatsApp';
  const EMAIL = 'himanshupaliwalpbp@gmail.com';

  const getStatLabel = (stat: typeof STATS[0]) => {
    if (language === 'hi') return stat.labelHi;
    if (language === 'hinglish') return stat.labelHinglish;
    return stat.labelEn;
  };

  return (
    <footer
      className="relative bg-[#0E1116] pb-16 md:pb-0 mt-auto"
      role="contentinfo"
    >
      {/* Floating Gold Particles Background */}
      <GoldParticles />

      {/* Top hairline border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(250,247,242,0.10)] to-transparent" />

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
              <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#FAF7F2]">
                <span className="inline-block mr-1.5 text-[#D4633F]">&#10022;</span>
                {language === 'hi'
                  ? 'मुफ़्त बीमा परामर्श प्राप्त करें'
                  : language === 'hinglish'
                    ? 'Free Insurance Consultation Lo'
                    : 'Get Free Insurance Consultation'}
              </h2>
              <p className="text-[#8B9099] text-sm mt-2 max-w-md font-body">
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
                className="btn-stripe group"
              >
                {language === 'hi' ? 'कॉलबैक पाएं' : language === 'hinglish' ? 'Callback Lo' : 'Get Callback'}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>

              <div className="flex items-center gap-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[#25D366] hover:text-[#1DA851] transition-colors font-body"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="sr-only sm:not-sr-only text-xs">
                    {t('footer.whatsapp', language)}
                  </span>
                </a>
                <a
                  href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[#8B9099] hover:text-[#FAF7F2] transition-colors font-body"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-xs">{PHONE}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(250,247,242,0.10)] to-transparent" />
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
                className="relative group rounded-xl p-4 sm:p-5 text-center overflow-hidden bg-white/[0.02] border border-[rgba(250,247,242,0.10)] hover:border-[rgba(250,247,242,0.20)] hover:bg-white/[0.04] transition-all duration-300"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(212,99,63,0.04) 0%, transparent 70%)',
                  }}
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <Icon className="w-4 h-4 text-[#D4633F] mx-auto mb-2" />
                  <div className="font-display text-lg sm:text-xl font-semibold text-[#FAF7F2] tabular-nums">{stat.value}</div>
                  <div className="text-caption-premium text-[#8B9099] mt-0.5">
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
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(250,247,242,0.10)] to-transparent" />
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
              className="group flex items-center gap-2.5 mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4633F]/50 rounded-xl"
              aria-label="Paliwal Secure – go to top"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0E1116] border border-[rgba(250,247,242,0.10)] shadow-md shadow-black/30 transition-transform duration-200 group-hover:scale-105">
                <span className="font-display font-semibold text-[#D4633F] text-lg leading-none">
                  P
                </span>
              </div>
              <span className="font-display text-lg font-semibold tracking-tight text-[#FAF7F2]">
                Paliwal{' '}
                <span className="text-accent-gradient">Secure AI</span>
              </span>
            </button>

            {/* Tagline */}
            <p className="text-[#8B9099] text-sm leading-relaxed mb-5 max-w-[260px] font-body">
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
                    className="group/icon relative w-8 h-8 rounded-lg border border-[rgba(250,247,242,0.10)] bg-white/[0.02] flex items-center justify-center text-[#FAF7F2]/70 hover:text-[#D4633F] hover:border-[#D4633F]/30 hover:bg-[#D4633F]/[0.06] transition-all duration-300"
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
                  className="group flex items-center gap-2.5 text-sm text-[#FAF7F2]/70 hover:text-[#D4633F] transition-colors duration-200 font-body"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366] group-hover:text-[#25D366] transition-colors" />
                  <span className="link-underline-reveal">
                    {t('footer.whatsapp', language)}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="group flex items-center gap-2.5 text-sm text-[#FAF7F2]/70 hover:text-[#D4633F] transition-colors duration-200 font-body"
                >
                  <Mail className="h-4 w-4 group-hover:text-[#D4633F] transition-colors" />
                  <span className="link-underline-reveal break-all">
                    {EMAIL}
                  </span>
                </a>
              </li>
            </ul>
          </motion.div>

          {/* ─── Column 2: Insurance Types ──────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-[#D4633F]" />
              <h3 className="text-caption-premium text-[#8B9099]">
                {t('v2.footer.insuranceTypes', language)}
              </h3>
            </div>
            <div className="h-px w-8 bg-gradient-to-r from-[#D4633F]/50 to-transparent mb-4" />
            <ul className="space-y-3">
              {[
                { href: '/health-insurance', labelKey: 'v2.footer.health', icon: Heart, color: 'text-[#D4633F]' },
                { href: '/car-insurance', labelKey: 'v2.footer.motor', icon: Car, color: 'text-[#D4633F]' },
                { href: '/life-insurance', labelKey: 'v2.footer.life', icon: Shield, color: 'text-[#D4633F]' },
                { href: '/travel-insurance', labelKey: 'v2.footer.travel', icon: Plane, color: 'text-[#D4633F]' },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2.5 text-sm text-[#FAF7F2]/70 hover:text-[#D4633F] transition-colors duration-200 font-body"
                    >
                      <Icon className={`w-3.5 h-3.5 ${link.color} shrink-0`} />
                      <span className="link-underline-reveal">
                        {t(link.labelKey, language)}
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
              <BookOpen className="w-3.5 h-3.5 text-[#D4633F]" />
              <h3 className="text-caption-premium text-[#8B9099]">
                {t('footer.resources', language)}
              </h3>
            </div>
            <div className="h-px w-8 bg-gradient-to-r from-[#D4633F]/50 to-transparent mb-4" />
            <ul className="space-y-3">
              {[
                { href: '/blog', labelKey: 'v2.footer.blog', icon: BookOpen, color: 'text-[#D4633F]' },
                { href: '/compare', labelKey: 'v2.footer.compare', icon: BarChart3, color: 'text-[#D4633F]' },
                { href: '/insuregpt', labelKey: 'v2.footer.insureGPT', icon: Bot, color: 'text-[#D4633F]' },
                { href: '#faq', labelKey: 'v2.footer.faq', icon: FileText, color: 'text-[#D4633F]' },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2.5 text-sm text-[#FAF7F2]/70 hover:text-[#D4633F] transition-colors duration-200 font-body"
                    >
                      <Icon className={`w-3.5 h-3.5 ${link.color} shrink-0`} />
                      <span className="link-underline-reveal">
                        {t(link.labelKey, language)}
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
              <Lock className="w-3.5 h-3.5 text-[#D4633F]" />
              <h3 className="text-caption-premium text-[#8B9099]">
                {t('footer.legal', language)}
              </h3>
            </div>
            <div className="h-px w-8 bg-gradient-to-r from-[#D4633F]/50 to-transparent mb-4" />
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
                      className="group flex items-center gap-2.5 text-sm text-[#FAF7F2]/70 hover:text-[#D4633F] transition-colors duration-200 font-body"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#8B9099]/50 shrink-0" />
                      <span className="link-underline-reveal">
                        {t(link.labelKey, language)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* IRDAI compliance badge */}
            <div className="mt-6 pt-4 border-t border-[rgba(250,247,242,0.10)]">
              <div className="flex items-center gap-1.5 mb-2">
                <Award className="w-3.5 h-3.5 text-[#D4633F]" />
                <span className="text-caption-premium text-[#D4633F]">
                  {t('footer.irdaiVerified', language)}
                </span>
              </div>
              <p className="text-[10px] text-[#8B9099]/70 leading-relaxed font-body">
                {t('footer.irdaiDisclaimer', language)}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BOTTOM BAR
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="border-t border-[rgba(250,247,242,0.10)]" style={{ background: 'rgba(14,17,22,0.8)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: IRDAI Badge + Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              {/* IRDAI Compliance Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#D4633F]/[0.06] border border-[#D4633F]/[0.12]">
                <Shield className="w-3.5 h-3.5 text-[#D4633F]" />
                <span className="text-[10px] font-semibold text-[#D4633F] tracking-wide font-body">IRDAI POSP IP429834</span>
              </div>
              <p className="text-xs text-[#8B9099] font-body">
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
                    className="group/social relative flex items-center justify-center w-8 h-8 rounded-full text-[#FAF7F2]/70 hover:text-[#D4633F] transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                  </a>
                );
              })}

              {/* Separator */}
              <div className="h-4 w-px bg-[rgba(250,247,242,0.10)] hidden sm:block" />

              {/* Phone */}
              <a
                href="https://wa.me/919257877312" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#8B9099] hover:text-[#FAF7F2] transition-colors duration-200 font-body"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{PHONE}</span>
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-[#8B9099] hover:text-[#25D366] transition-colors duration-200 font-body"
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
