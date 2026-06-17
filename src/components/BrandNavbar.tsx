'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  BookOpen,
  Target,
  Calculator,
  ShieldCheck,
  Heart,
  Scale,
  LayoutGrid,
  Menu,
  X,
} from 'lucide-react';
import { ShinyButton } from '@/components/ui/shiny-button';
import { Badge } from '@/components/ui/badge';
import { LanguageToggle, useLanguage } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { t } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';

/* ────────────────────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────────────────────── */

interface BrandNavbarProps {
  onNavigate: (sectionId: string) => void;
  onCTAClick: () => void;
}

interface NavItem {
  id: string;
  labelKey: string;
  icon: React.ElementType;
  type: 'section' | 'page';
  href?: string;
}

/* ────────────────────────────────────────────────────────────────────────────
   Navigation items definition
   ──────────────────────────────────────────────────────────────────────────── */

const NAV_ITEMS: NavItem[] = [
  { id: 'coverage-score', labelKey: 'nav.coverageScore', icon: Target, type: 'section' },
  { id: 'tip-quiz', labelKey: 'nav.quiz', icon: BookOpen, type: 'section' },
  { id: 'features', labelKey: 'sections.features', icon: ShieldCheck, type: 'section' },
  { id: 'plans', labelKey: 'nav.plans', icon: Heart, type: 'section' },
  { id: 'calculators', labelKey: 'nav.calculators', icon: Calculator, type: 'page', href: '/calculators' },
  { id: 'compare', labelKey: 'nav.compare', icon: Scale, type: 'section' },
  { id: 'gyaan', labelKey: 'nav.insureGyaan', icon: BookOpen, type: 'section' },
  { id: 'rights', labelKey: 'nav.rights', icon: Shield, type: 'section' },
  { id: 'blog', labelKey: 'nav.blog', icon: BookOpen, type: 'page', href: '/blog' },
  { id: 'hubs', labelKey: 'nav.hubs', icon: LayoutGrid, type: 'page', href: '/hub' },
];

/* ────────────────────────────────────────────────────────────────────────────
   Language option for mobile bottom selector
   ──────────────────────────────────────────────────────────────────────────── */

const MOBILE_LANG_OPTIONS: { value: Language; shortLabel: string; fullLabel: string }[] = [
  { value: 'en', shortLabel: 'EN', fullLabel: 'English' },
  { value: 'hi', shortLabel: 'हिं', fullLabel: 'हिन्दी' },
  { value: 'hinglish', shortLabel: 'Hg', fullLabel: 'Hinglish' },
];

/* ────────────────────────────────────────────────────────────────────────────
   Framer Motion Variants
   ──────────────────────────────────────────────────────────────────────────── */

const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.04,
      delayChildren: 0.06,
    },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -16, y: 4 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 28 },
  },
};

/* ────────────────────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────────────────────── */

export default function BrandNavbar({ onNavigate, onCTAClick }: BrandNavbarProps) {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  /* ── Scroll shadow listener ───────────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Active section tracking via IntersectionObserver ─────────────────── */
  useEffect(() => {
    const sectionIds = NAV_ITEMS.filter((item) => item.type === 'section').map((item) => item.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  /* ── Close mobile menu on resize ──────────────────────────────────────── */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ── Lock body scroll when mobile menu is open ────────────────────────── */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  /* ── Handlers ─────────────────────────────────────────────────────────── */
  const handleNavClick = useCallback(
    (item: NavItem) => {
      if (item.type === 'page' && item.href) {
        router.push(item.href);
      } else {
        onNavigate(item.id);
      }
      setMobileOpen(false);
    },
    [onNavigate, router]
  );

  const handleCTA = useCallback(() => {
    onCTAClick();
    setMobileOpen(false);
  }, [onCTAClick]);

  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);

  /* ── Derived ──────────────────────────────────────────────────────────── */
  const isItemActive = (id: string) => activeSection === id;

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          backdrop-blur-2xl
          transition-all duration-500 ease-out
        `}
        style={{
          backgroundColor: scrolled ? 'rgba(6, 13, 26, 0.95)' : 'rgba(6, 13, 26, 0.85)',
          borderBottom: '1px solid rgba(201, 138, 28, 0.2)',
          boxShadow: scrolled
            ? '0 4px 30px rgba(201, 138, 28, 0.08), 0 1px 3px rgba(0, 0, 0, 0.3), 0 0 60px rgba(201, 138, 28, 0.04)'
            : '0 1px 3px rgba(0, 0, 0, 0.2)',
        }}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between gap-4">
            {/* ── Logo ────────────────────────────────────────────────── */}
            <button
              onClick={() => onNavigate('hero')}
              className="group flex shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50 rounded-2xl px-1 py-1 -ml-1"
              aria-label="Go to top"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F1C40] to-[#1a3a6a] shadow-md shadow-[#C98A1C]/15 transition-transform duration-200 group-hover:scale-105">
                <Shield className="h-5 w-5 text-[#C98A1C]" strokeWidth={2.2} />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Paliwal
              </span>
              <span
                className="text-lg font-bold tracking-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #C98A1C 0%, #C98A1C 100%)',
                }}
              >
                Secure
              </span>
            </button>

            {/* ── Desktop Nav Links ───────────────────────────────────── */}
            <ul className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = item.type === 'section' && isItemActive(item.id);
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item)}
                      className={`
                        group relative flex items-center gap-1.5 rounded-2xl px-3 py-2 text-[13px] font-medium
                        transition-all duration-200 ease-out
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50
                        ${
                          active
                            ? 'text-[#C98A1C]'
                            : 'text-white/80 hover:text-[#C98A1C] hover:bg-white/[0.06] hover:-translate-y-[1px]'
                        }
                      `}
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon
                        className={`h-4 w-4 transition-colors duration-200 ${
                          active
                            ? 'text-[#C98A1C]'
                            : 'text-white/50 group-hover:text-[#C98A1C]'
                        }`}
                        strokeWidth={2}
                      />
                      <span>{t(item.labelKey, language)}</span>
                      {/* Animated gold underline indicator */}
                      {active && (
                        <motion.span
                          layoutId="navbar-active-underline"
                          className="absolute -bottom-1 left-2 right-2 h-[2px] rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, #C98A1C, #C98A1C, #C98A1C)',
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* ── Right Actions ───────────────────────────────────────── */}
            <div className="flex items-center gap-2">
              {/* Language Toggle - Desktop */}
              <div className="hidden sm:block">
                <LanguageToggle />
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* CTA Button - Desktop */}
              <div className="hidden md:block">
                <ShinyButton
                  onClick={handleCTA}
                  className="h-10 items-center gap-1.5 rounded-full px-5 text-sm font-semibold"
                >
                  {t('nav.getAIQuote', language)}
                </ShinyButton>
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={toggleMobile}
                className={`
                  lg:hidden relative flex h-10 w-10 items-center justify-center rounded-2xl
                  transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50
                  ${
                    mobileOpen
                      ? 'bg-white/10 text-[#C98A1C]'
                      : 'text-white/70 hover:bg-white/[0.06] hover:text-[#C98A1C]'
                  }
                `}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.15 }}
                      className="flex"
                    >
                      <X className="h-5 w-5" strokeWidth={2.5} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.15 }}
                      className="flex"
                    >
                      <Menu className="h-5 w-5" strokeWidth={2.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>

        {/* ── Mobile Dropdown Menu ──────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="lg:hidden overflow-hidden"
              style={{ borderTop: '1px solid rgba(201, 138, 28, 0.15)' }}
            >
              <div
                className="max-h-[70vh] overflow-y-auto overscroll-contain backdrop-blur-2xl"
                style={{ backgroundColor: 'rgba(6, 13, 26, 0.97)' }}
              >
                {/* Nav items */}
                <div className="px-4 py-3 space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = item.type === 'section' && isItemActive(item.id);
                    return (
                      <motion.button
                        key={item.id}
                        variants={mobileItemVariants}
                        onClick={() => handleNavClick(item)}
                        className={`
                          group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium
                          transition-all duration-200
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50
                          min-h-[44px]
                          ${
                            active
                              ? 'text-[#C98A1C] bg-[#C98A1C]/10'
                              : 'text-white/80 hover:bg-white/[0.06] active:bg-white/[0.08]'
                          }
                        `}
                        aria-current={active ? 'page' : undefined}
                      >
                        <div
                          className={`
                            flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                            transition-colors duration-200
                            ${
                              active
                                ? 'bg-[#C98A1C]/20 text-[#C98A1C]'
                                : 'bg-white/[0.06] text-white/40 group-hover:text-[#C98A1C]'
                            }
                          `}
                        >
                          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                        </div>
                        <span>{t(item.labelKey, language)}</span>
                        {active && (
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-[#C98A1C]/20 text-[#C98A1C] border-0 text-[10px] px-2 py-0.5 rounded-full"
                          >
                            {t('nav.active', language)}
                          </Badge>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="mx-4" style={{ borderTop: '1px solid rgba(201, 138, 28, 0.12)' }} />

                {/* Mobile CTA */}
                <div className="px-4 pt-3 pb-2">
                  <ShinyButton
                    onClick={handleCTA}
                    className="w-full h-12 rounded-2xl text-base font-semibold"
                  >
                    {t('nav.getAIQuote', language)}
                  </ShinyButton>
                </div>

                {/* Mobile Language Selector */}
                <div className="px-4 py-3">
                  <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2 px-1">
                    {t('language.selectLanguage', language)}
                  </p>
                  <div className="flex gap-2">
                    {MOBILE_LANG_OPTIONS.map((opt) => {
                      const isSelected = language === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setLanguage(opt.value)}
                          className={`
                            flex-1 flex flex-col items-center justify-center gap-0.5
                            rounded-2xl py-2.5 px-2 text-sm font-medium
                            transition-all duration-200 min-h-[44px]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50
                            ${
                              isSelected
                                ? 'bg-[#C98A1C]/15 text-[#C98A1C] ring-1 ring-[#C98A1C]/30'
                                : 'bg-white/[0.05] text-white/50 hover:bg-white/[0.08] hover:text-white/70'
                            }
                          `}
                          aria-label={`Switch to ${opt.fullLabel}`}
                          aria-pressed={isSelected}
                        >
                          <span className="text-base font-bold leading-none">{opt.shortLabel}</span>
                          <span className="text-[10px] leading-none opacity-70">{opt.fullLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom safe area spacer */}
                <div className="h-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Body offset spacer so content isn't hidden behind the fixed navbar ── */}
      <div className="h-18" aria-hidden="true" />
    </>
  );
}
