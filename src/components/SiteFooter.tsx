'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import {
  Shield,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  Lock,
  Heart,
  Car,
  Plane,
  Home as HomeIcon,
  ExternalLink,
  ArrowUp,
  MessageCircle,
  Star,
  Users,
  CheckCircle2,
  Send,
  BookOpen,
  BarChart3,
  Bot,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n';
import { IRDAI_MANDATORY_DISCLAIMER } from '@/lib/insurance-data';

/* ────────────────────────────────────────────────────────────────────────────
   Quick Links (page routes)
   ──────────────────────────────────────────────────────────────────────────── */

const QUICK_LINKS = [
  { href: '/', labelKey: 'footer.link.home' },
  { href: '/health-insurance', labelKey: 'footer.link.healthInsurance' },
  { href: '/car-insurance', labelKey: 'footer.link.carInsurance' },
  { href: '/bike-insurance', labelKey: 'footer.link.bikeInsurance' },
  { href: '/life-insurance', labelKey: 'footer.link.lifeInsurance' },
  { href: '/compare', labelKey: 'footer.link.comparePlans' },
  { href: '/insuregpt', labelKey: 'footer.link.insureGPT' },
  { href: '/blog', labelKey: 'footer.link.blog' },
  { href: '/vehicle-launch-hub', labelKey: 'footer.link.newVehicleInsurance' },
  { href: '/insurance-faq', labelKey: 'footer.link.faq' },
  { href: '/insurance-glossary', labelKey: 'footer.link.glossary' },
];

/* ──────────────────────────────────────────────────────────────────────────── */

const PRODUCTS = [
  { href: '/health-insurance', labelKey: 'footer.link.healthInsurance', icon: Heart },
  { href: '/car-insurance', labelKey: 'footer.link.carInsurance', icon: Car },
  { href: '/life-insurance', labelKey: 'footer.link.lifeInsurance', icon: Shield },
  { href: '/compare', labelKey: 'footer.link.compareAllPlans', icon: Plane },
  { href: '/car-insurance-renewal', labelKey: 'footer.link.carRenewal', icon: HomeIcon },
  { href: '/best-health-insurance-india', labelKey: 'footer.link.bestHealthPlans', icon: Heart },
];

/* ──────────────────────────────────────────────────────────────────────────── */

const COMPLIANCE_LINKS = [
  { href: '/policyholder-rights', labelKey: 'footer.link.policyholderRights' },
  { href: '/claim-guide', labelKey: 'footer.link.claimGuide' },
  { href: '/insurance-faq', labelKey: 'footer.link.insuranceFAQ' },
  { href: '/insurance-glossary', labelKey: 'footer.link.glossary' },
  { href: '/about', labelKey: 'footer.link.about' },
  { href: '/privacy-policy', labelKey: 'footer.link.privacyPolicy' },
  { href: '/terms-of-service', labelKey: 'footer.link.termsOfService' },
  { href: '/disclaimer', labelKey: 'footer.link.disclaimer' },
  { href: '/grievance-policy', labelKey: 'footer.link.grievancePolicy' },
  { href: '/cookie-policy', labelKey: 'footer.link.cookiePolicy' },
  { href: 'https://www.irdai.gov.in/', labelKey: 'footer.link.irdaiWebsite', external: true },
  {
    href: 'https://www.irdai.gov.in/protect-policyholders',
    labelKey: 'footer.link.policyholderProtection',
    external: true,
  },
];

/* ──────────────────────────────────────────────────────────────────────────── */

const SOCIAL_LINKS = [
  { icon: Instagram, href: 'https://www.instagram.com/paliwalinsure', label: 'Instagram (@paliwalinsure)' },
  { icon: MessageCircle, href: 'https://wa.me/919257877312', label: 'WhatsApp' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/himanshu-paliwal-41aa37414', label: 'LinkedIn' },
  { icon: FileText, href: 'https://youtube.com/@paliwalinsure?si=8lAfmh697DPGZAbU', label: 'YouTube' },
];

/* ──────────────────────────────────────────────────────────────────────────── */

const TRUSTED_PARTNERS = [
  'HDFC Ergo',
  'ICICI Lombard',
  'Star Health',
  'Bajaj Allianz',
  'New India Assurance',
  'SBI General',
];

const WHATSAPP_URL = 'https://wa.me/919257877312';
const INSTAGRAM_URL = 'https://www.instagram.com/paliwalinsure';
const PHONE = '+91-92587-77312';
const PHONE_TEL = 'tel:9257877312';
const EMAIL = 'himanshupaliwalpbp@gmail.com';
const POSP_CODE = 'IP429834';

/* ────────────────────────────────────────────────────────────────────────────
   Animated Counter Hook
   ──────────────────────────────────────────────────────────────────────────── */

function useAnimatedCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [hasStarted, target, duration]);

  return { count, ref, hasStarted };
}

/* ────────────────────────────────────────────────────────────────────────────
   Divider — simple border line (premium hairline)
   ──────────────────────────────────────────────────────────────────────────── */

function Divider({ vertical = false }: { vertical?: boolean }) {
  if (vertical) {
    return <div className="hidden lg:block absolute right-0 top-4 bottom-4 w-px bg-[rgba(14,17,22,0.08)]" />;
  }
  return <div className="h-px w-full bg-[rgba(14,17,22,0.08)]" />;
}

/* ────────────────────────────────────────────────────────────────────────────
   Heading Accent — burnt sienna underline
   ──────────────────────────────────────────────────────────────────────────── */

function HeadingAccent() {
  return (
    <motion.div
      className="h-0.5 w-8 rounded-full mt-1.5 bg-[#B8482C]"
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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const partnerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' },
  }),
};

/* ────────────────────────────────────────────────────────────────────────────
   SiteFooter Component
   ──────────────────────────────────────────────────────────────────────────── */

export default function SiteFooter() {
  const { t } = useLanguage();
  const currentYear = 2026;
  const { count: familiesCount, ref: familiesRef, hasStarted: familiesStarted } = useAnimatedCounter(500, 2500);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  // Back to top visibility
  useEffect(() => {
    function handleScroll() {
      setShowBackToTop(window.scrollY > 600);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <footer
      className="relative bg-background pt-14 pb-24 md:pb-8 footer-sticky shrink-0"
      role="contentinfo"
    >
      {/* ── Top border (premium hairline) ─────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(14,17,22,0.08)] to-transparent" />

      {/* ═══════════════════════════════════════════════════════════════════════
          TRUSTED BY PARTNERS ROW
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center mb-5">
          <span className="text-caption-premium text-muted-foreground/60">
            {t('footer.trustedBy') || 'Trusted Partner Insurers'}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5 sm:gap-x-6">
          {TRUSTED_PARTNERS.map((partner, i) => (
            <motion.div
              key={partner}
              custom={i}
              variants={partnerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-body font-medium text-muted-foreground/70 hover:text-primary transition-all duration-300 bg-muted/30 border border-[rgba(14,17,22,0.08)] hover:border-[#B8482C]/30 hover:bg-[#F4E5DD]/40"
            >
              {partner}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Divider after partners */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Divider />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          STATS ROW WITH ANIMATED COUNTER
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { icon: Shield, value: '50+', labelKey: 'footer.stat.insurers' },
            { icon: CheckCircle2, value: '98%', labelKey: 'footer.stat.claims' },
            { icon: Users, value: `${familiesStarted ? familiesCount : 500}+`, labelKey: 'footer.stat.families', animated: true, refProp: familiesRef },
            { icon: Star, value: '4.9★', labelKey: 'footer.stat.rating' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.labelKey}
                custom={i}
                variants={statVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-20px' }}
                ref={stat.animated ? stat.refProp : undefined}
                className="rounded-2xl border border-[rgba(14,17,22,0.08)] bg-muted/20 p-3 sm:p-4 text-center transition-colors duration-300 hover:bg-[#F4E5DD]/40 hover:border-[#B8482C]/30"
              >
                <Icon className="w-4 h-4 text-[#B8482C] mx-auto mb-1.5" />
                <div className="text-lg sm:text-xl font-display font-semibold text-primary tracking-tight tabular-nums">
                  {stat.value}
                </div>
                <div className="text-caption-premium text-muted-foreground/70 mt-0.5">
                  {t(stat.labelKey)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Divider after stats */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Divider />
      </div>

      {/* ── Main Grid ──────────────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 relative">
          {/* ─── Column 1: Brand ──────────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="relative sm:col-span-2 lg:col-span-1">
            {/* Vertical divider (desktop) */}
            <Divider vertical />

            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2.5 mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8482C]/40 rounded-xl"
              aria-label="Paliwal Secure AI – Home"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/90 shadow-[0_0_0_1px_rgba(184,72,44,0.18),0_2px_8px_-2px_rgba(184,72,44,0.22)] transition-all duration-300 group-hover:shadow-[0_0_0_1px_rgba(184,72,44,0.32),0_4px_14px_-2px_rgba(184,72,44,0.28)] group-hover:scale-105">
                <Shield className="h-5 w-5 text-primary-foreground" strokeWidth={2.2} />
              </div>
              <span className="text-lg font-display font-semibold tracking-[-0.02em] text-foreground">Paliwal</span>
              <span className="text-lg font-display font-semibold tracking-[-0.02em] text-accent-gradient">
                Secure AI
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-muted-foreground/80 text-sm leading-relaxed mb-5 max-w-[260px] font-body">
              {t('footer.description')}
            </p>

            {/* POSP Code */}
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span className="text-xs text-muted-foreground/60 font-mono">{t('footer.pospCode')}: {POSP_CODE}</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 mb-5">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl border border-[rgba(14,17,22,0.08)] bg-muted/20 flex items-center justify-center text-muted-foreground/70 hover:text-[#B8482C] hover:border-[#B8482C]/30 hover:bg-[#F4E5DD]/40 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* Contact Info */}
            <ul className="space-y-3 mb-5">
              <li>
                <a
                  href={PHONE_TEL}
                  className="flex items-center gap-2.5 text-sm font-body text-muted-foreground/70 hover:text-primary transition-colors duration-200 group"
                >
                  <Phone className="h-4 w-4 text-muted-foreground/50 group-hover:text-[#B8482C] transition-colors" />
                  <span className="link-underline-reveal">{PHONE}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-2.5 text-sm font-body text-muted-foreground/70 hover:text-primary transition-colors duration-200 group"
                >
                  <Mail className="h-4 w-4 text-muted-foreground/50 group-hover:text-[#B8482C] transition-colors" />
                  <span className="break-all text-overflow-safe link-underline-reveal">{EMAIL}</span>
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm font-body text-muted-foreground/70 hover:text-primary transition-colors duration-200 group"
                >
                  <Instagram className="h-4 w-4 text-muted-foreground/50 group-hover:text-[#B8482C] transition-colors" />
                  <span className="link-underline-reveal">@paliwalinsure</span>
                </a>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button
                className="rounded-xl text-sm font-body font-semibold shadow-[0_0_0_1px_rgba(184,72,44,0.18),0_2px_8px_-2px_rgba(184,72,44,0.22)] hover:shadow-[0_0_0_1px_rgba(184,72,44,0.28),0_4px_16px_-2px_rgba(184,72,44,0.30)] transition-all duration-300 hover:-translate-y-[1px] active:translate-y-0 h-11 px-5 bg-primary text-primary-foreground hover:bg-[#B8482C]"
                size="sm"
              >
                <MessageCircle className="w-4 h-4 mr-2 text-[#25D366]" />
                {t('footer.whatsapp')}
              </Button>
            </a>
          </motion.div>

          {/* ─── Column 2: Quick Links ─────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="relative">
            <Divider vertical />
            <h3 className="text-foreground text-caption-premium mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#B8482C]" />
              {t('footer.quickLinks')}
            </h3>
            <HeadingAccent />
            <ul className="space-y-2 mt-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group text-sm font-body text-muted-foreground/70 hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8482C]/40 rounded text-overflow-safe block min-h-[28px] flex items-center"
                  >
                    <span className="link-underline-reveal">
                      {t(link.labelKey)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ─── Column 3: Products ─────────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="relative">
            <Divider vertical />
            <h3 className="text-foreground text-caption-premium mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#B8482C]" />
              {t('footer.products')}
            </h3>
            <HeadingAccent />
            <ul className="space-y-2 mt-3">
              {PRODUCTS.map((product) => {
                const ProductIcon = product.icon;
                return (
                  <li key={product.href}>
                    <Link
                      href={product.href}
                      className="group flex items-center gap-2 text-sm font-body text-muted-foreground/70 hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8482C]/40 rounded text-overflow-safe min-h-[28px]"
                    >
                      <ProductIcon className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-[#B8482C] transition-colors shrink-0" />
                      <span className="link-underline-reveal">
                        {t(product.labelKey)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* ─── Column 4: Compliance ──────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="relative">
            <Divider vertical />
            <h3 className="text-foreground text-caption-premium mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#B8482C]" />
              {t('footer.compliance')}
            </h3>
            <HeadingAccent />

            {/* IRDAI Disclaimer */}
            <p className="text-xs font-body text-muted-foreground/60 leading-relaxed mt-3 mb-4 break-words">
              {IRDAI_MANDATORY_DISCLAIMER}
            </p>

            {/* Regulatory Links */}
            <ul className="space-y-2">
              {COMPLIANCE_LINKS.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 text-sm font-body text-muted-foreground/70 hover:text-primary transition-colors duration-200 min-h-[28px]"
                    >
                      <span className="link-underline-reveal">
                        {t(link.labelKey)}
                      </span>
                      <ExternalLink className="w-3 h-3 shrink-0 text-muted-foreground/50 group-hover:text-[#B8482C]" />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="group text-sm font-body text-muted-foreground/70 hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8482C]/40 rounded text-overflow-safe min-h-[28px] block"
                    >
                      <span className="link-underline-reveal">
                        {t(link.labelKey)}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* IRDAI Certification Badge */}
            <div className="mt-5 pt-4 border-t border-[rgba(14,17,22,0.08)]">
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#F4E5DD]/40 border border-[#B8482C]/15">
                <Shield className="w-5 h-5 text-[#B8482C]" />
                <div>
                  <span className="text-caption-premium text-primary block leading-tight">
                    {t('footer.irdaiCertified')}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60 font-mono">
                    POSP {POSP_CODE}
                  </span>
                </div>
              </div>
            </div>

            {/* IRDAI Helpline */}
            <div className="mt-3 p-3 rounded-xl bg-muted/20 border border-[rgba(14,17,22,0.08)]">
              <p className="text-[11px] font-body text-muted-foreground/60 leading-relaxed">
                {t('footer.ombudsman')}
              </p>
            </div>
          </motion.div>

          {/* ─── Column 5: Newsletter ──────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="relative">
            <h3 className="text-foreground text-caption-premium mb-1 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#B8482C]" />
              {t('footer.newsletter')}
            </h3>
            <HeadingAccent />
            <p className="text-xs font-body text-muted-foreground/60 leading-relaxed mt-3 mb-4 max-w-[220px]">
              {t('footer.newsletterDesc')}
            </p>

            {/* Email input */}
            <div className="relative mb-4">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your@email.com"
                className="w-full h-11 pl-4 pr-12 rounded-xl text-sm font-body text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-300 bg-muted/20 border border-[rgba(14,17,22,0.08)] focus:border-[#B8482C]/50 focus:ring-2 focus:ring-[#B8482C]/20"
                aria-label="Email for newsletter"
              />
              <button
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 bg-primary/90 text-primary-foreground shadow-[0_0_0_1px_rgba(184,72,44,0.18),0_2px_6px_-2px_rgba(184,72,44,0.22)] hover:bg-[#B8482C]"
                aria-label="Subscribe to newsletter"
                type="button"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick resource links */}
            <div className="space-y-2">
              {[
                { href: '/blog', labelKey: 'footer.link.blog', icon: BookOpen },
                { href: '/compare', labelKey: 'footer.link.comparePlans', icon: BarChart3 },
                { href: '/insuregpt', labelKey: 'footer.link.insureGPT', icon: Bot },
                { href: '/insurance-faq', labelKey: 'footer.link.faq', icon: FileText },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-2 text-sm font-body text-muted-foreground/70 hover:text-primary transition-colors duration-200 min-h-[28px]"
                  >
                    <Icon className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-[#B8482C] transition-colors shrink-0" />
                    <span className="link-underline-reveal">
                      {t(link.labelKey)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BOTTOM BAR
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative border-t border-[rgba(14,17,22,0.08)] bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: IRDAI Badge + Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
              {/* IRDAI Compliance Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F4E5DD]/40 border border-[#B8482C]/15">
                <Shield className="w-3.5 h-3.5 text-[#B8482C]" />
                <span className="text-caption-premium text-[#B8482C]">
                  IRDAI POSP {POSP_CODE}
                </span>
              </div>
              <p className="text-xs font-body text-muted-foreground/50">
                &copy; {currentYear} Paliwal Secure. {t('footer.allRightsReserved')} | {t('footer.pospCode')}: {POSP_CODE}
              </p>
            </div>

            {/* IRDAI Disclaimer — Desktop */}
            <p className="text-[11px] font-body text-muted-foreground/40 text-center hidden lg:block max-w-xl break-words">
              {IRDAI_MANDATORY_DISCLAIMER}
            </p>

            {/* Legal Compliance — Grievance Officer */}
            <p className="text-[10px] font-body text-muted-foreground/50 text-center w-full">
              {t('footer.grievanceOfficer')}:{' '}
              <a
                href="mailto:himanshupaliwalpbp@gmail.com"
                className="link-underline-reveal hover:text-primary transition-colors duration-200"
              >
                himanshupaliwalpbp@gmail.com
              </a>
              {' '}| {t('footer.responseTime')}: 30 {t('footer.days')}{' '}
              <Link
                href="/grievance-policy"
                className="text-primary/60 hover:text-primary transition-colors duration-200 underline underline-offset-2"
              >
                {t('footer.viewPolicy')}
              </Link>
            </p>

            {/* Right: Social Links + Contact */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Social Icons */}
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={`bottom-${social.label}`}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground/50 hover:text-[#B8482C] transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}

              {/* Separator */}
              <div className="h-4 w-px bg-[rgba(14,17,22,0.08)] hidden sm:block" />

              {/* Phone */}
              <a
                href={PHONE_TEL}
                className="flex items-center gap-1.5 text-xs font-body text-muted-foreground/60 hover:text-primary transition-colors duration-200"
              >
                <Phone className="h-3.5 w-3.5" />
                <span className="link-underline-reveal">{PHONE}</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-1.5 text-xs font-body text-muted-foreground/60 hover:text-primary transition-colors duration-200"
              >
                <Mail className="h-3.5 w-3.5" />
                <span className="link-underline-reveal">{t('footer.link.email')}</span>
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-body text-muted-foreground/60 hover:text-primary transition-colors duration-200"
              >
                <Instagram className="h-3.5 w-3.5" />
                <span className="link-underline-reveal">{t('footer.link.instagram')}</span>
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-body text-muted-foreground/60 hover:text-[#25D366] transition-colors duration-200"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="link-underline-reveal">{t('footer.whatsapp')}</span>
              </a>

              {/* Admin */}
              <Link
                href="/admin/login"
                className="text-xs font-body text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors duration-200"
              >
                {t('footer.admin')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BACK TO TOP BUTTON
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-[0_0_0_1px_rgba(184,72,44,0.18),0_4px_16px_-2px_rgba(0,0,0,0.3)] transition-all duration-200 hover:scale-110 hover:bg-[#B8482C] hover:shadow-[0_0_0_1px_rgba(184,72,44,0.30),0_6px_24px_-2px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8482C]/50 bg-primary/90 text-primary-foreground backdrop-blur-sm"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
