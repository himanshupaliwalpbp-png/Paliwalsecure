'use client';

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSafeTheme } from '@/lib/safe-theme-provider';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Heart,
  Car,
  BookOpen,
  BarChart3,
  Menu,
  Globe,
  Plane,
  Home,
  Calculator,
  HelpCircle,
  Phone,
  FileText,
  MessageCircle,
  Users,
  Receipt,
  Instagram,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { useLanguage, type Language } from '@/lib/i18n';
import SkyToggle from '@/components/ui/sky-toggle';
import { openInsureGPT } from '@/lib/insuregpt-state';

/* ────────────────────────────────────────────────────────────────────────────
   HinglishToggleButton — cycles: En → हिंदी → Hinglish
   Premium pill-shaped toggle with smooth transitions
   ──────────────────────────────────────────────────────────────────────────── */
const LANG_CYCLE: { value: Language; labelKey: string }[] = [
  { value: 'en', labelKey: 'v2.header.langEn' },
  { value: 'hi', labelKey: 'v2.header.langHi' },
  { value: 'hinglish', labelKey: 'v2.header.langHinglish' },
];

function HinglishToggleButton() {
  const { language, setLanguage, t } = useLanguage();
  const { resolvedTheme } = useSafeTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const isLight = mounted && resolvedTheme === 'light';

  const currentIndex = LANG_CYCLE.findIndex((l) => l.value === language);
  const nextIndex = (currentIndex + 1) % LANG_CYCLE.length;

  const handleCycle = useCallback(() => {
    setLanguage(LANG_CYCLE[nextIndex].value);
  }, [nextIndex, setLanguage]);

  const currentLabel =
    currentIndex >= 0 ? t(LANG_CYCLE[currentIndex].labelKey) : 'En';

  return (
    <button
      onClick={handleCycle}
      className={`group relative flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-all duration-300 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#043C50]/40 focus-visible:ring-offset-1 ${
        isLight
          ? 'bg-[#FBF5ED] border-[#D7C2A5]/80 text-[#D7C2A5] hover:bg-[#043C50]/5 hover:border-[#043C50]/20 hover:text-[#043C50]'
          : 'bg-white/[0.04] border-white/[0.08] text-[#D7C2A5] hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-[#EED9BE]'
      }`}
      aria-label={`Language: ${currentLabel}. Click to switch.`}
    >
      <Globe className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" />
      <span>{currentLabel}</span>
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Navigation links configuration
   ──────────────────────────────────────────────────────────────────────────── */

interface NavLink {
  href: string;
  labelKey: string;
  label: string;
  icon: React.ElementType;
}

const NAV_LINKS: NavLink[] = [
  {
    href: '/health-insurance',
    labelKey: 'nav.healthInsurance',
    label: 'Health',
    icon: Heart,
  },
  {
    href: '/car-insurance',
    labelKey: 'v2.header.motorInsurance',
    label: 'Motor',
    icon: Car,
  },
  {
    href: '/life-insurance',
    labelKey: 'nav.lifeInsurance',
    label: 'Life',
    icon: Shield,
  },
  {
    href: '/travel-insurance',
    labelKey: 'nav.travelInsurance',
    label: 'Travel',
    icon: Plane,
  },
  {
    href: '/home-insurance',
    labelKey: 'nav.homeInsurance',
    label: 'Home',
    icon: Home,
  },
  {
    href: '/compare',
    labelKey: 'nav.compare',
    label: 'Compare',
    icon: BarChart3,
  },
  {
    href: '/claim-guide',
    labelKey: 'nav.claims',
    label: 'Claims',
    icon: FileText,
  },
  {
    href: '/tax-saving',
    labelKey: 'nav.taxSaving',
    label: 'Tax',
    icon: Receipt,
  },
  {
    href: '#calculators',
    labelKey: 'nav.calculators',
    label: 'Calc',
    icon: Calculator,
  },
  {
    href: '/blog',
    labelKey: 'nav.blog',
    label: 'Blog',
    icon: BookOpen,
  },
  {
    href: '#faq',
    labelKey: 'nav.faq',
    label: 'FAQ',
    icon: HelpCircle,
  },
  {
    href: '/about',
    labelKey: 'nav.contact',
    label: 'About',
    icon: Users,
  },
  {
    href: 'https://instagram.com/paliwalinsure',
    labelKey: 'nav.instagram',
    label: 'Insta',
    icon: Instagram,
  },
];

/* ────────────────────────────────────────────────────────────────────────────
   SiteHeader Component — Premium Apple/Stripe-quality navbar
   Clean, minimal, with smooth animations and premium hover effects.
   Supports both light and dark mode.
   ──────────────────────────────────────────────────────────────────────────── */

/* Hydration-safe mounted check using useSyncExternalStore */
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function SiteHeader() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mounted = useHasMounted();
  const pathname = usePathname();
  const { t } = useLanguage();
  const { resolvedTheme } = useSafeTheme();
  const isLight = mounted && resolvedTheme === 'light';

  // Track scroll position with threshold for subtle state change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body scroll lock when mobile sheet is open
  useEffect(() => {
    if (sheetOpen || mobileMenuOpen) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }
    return () => document.body.classList.remove('scroll-locked');
  }, [sheetOpen, mobileMenuOpen]);

  // Close mobile menus on route change
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSheetOpen(false);
      setMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timeout);
  }, [pathname]);

  // Determine active link
  const isActive = useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/';
      if (href.startsWith('#')) return false;
      return pathname.startsWith(href);
    },
    [pathname]
  );

  // Refs for animated underline positioning
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close mobile dropdown on outside click
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileMenuOpen]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
        isLight
          ? scrolled
            ? 'bg-white/90 backdrop-blur-2xl border-b border-[#D7C2A5]/60 shadow-[0_1px_0_0_rgba(0,0,0,0.03),0_2px_8px_-4px_rgba(0,0,0,0.04)]'
            : 'bg-white/70 backdrop-blur-2xl border-b border-[#D7C2A5]/30'
          : scrolled
            ? 'bg-[#021E29]/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_0_0_rgba(255,255,255,0.03),0_2px_12px_-4px_rgba(0,0,0,0.5)]'
            : 'bg-[#021E29]/60 backdrop-blur-2xl border-b border-white/[0.04]'
      }`}
      role="banner"
    >
      <nav
        className={`max-w-7xl mx-auto transition-all duration-500 ease-out ${
          scrolled ? 'px-4 sm:px-6 lg:px-8' : 'px-4 sm:px-6 lg:px-8'
        }`}
        aria-label="Main navigation"
      >
        <div className={`flex items-center justify-between transition-all duration-500 ease-out ${
          scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-[72px]'
        }`}>

          {/* ══ Logo — Left ════════════════════════════════════════════════════ */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label="Paliwal Secure AI – Home"
            >
              {/* Logo mark with subtle glow */}
              <div className="relative">
                <div className={`absolute inset-0 blur-lg rounded-full transition-all duration-500 ${
                  isLight
                    ? 'bg-[#08799A] opacity-0 group-hover:opacity-15'
                    : 'bg-[#3DB8D8] opacity-0 group-hover:opacity-20'
                }`} />
                <div className={`relative flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-300 ${
                  isLight
                    ? 'bg-[#043C50] group-hover:bg-[#065A75]'
                    : 'bg-white/[0.06] group-hover:bg-white/[0.10] border border-white/[0.06]'
                }`}>
                  <Shield className={`h-5 w-5 transition-colors duration-300 ${
                    isLight ? 'text-white' : 'text-[#EED9BE]'
                  }`} strokeWidth={2.2} />
                </div>
              </div>
              {/* Logo text */}
              <div className="flex flex-col">
                <span className={`text-lg font-bold tracking-[-0.025em] leading-tight font-heading transition-colors duration-300 ${
                  isLight ? 'text-[#043C50]' : 'text-white'
                }`}>
                  Paliwal{' '}
                  <span className={`transition-colors duration-300 ${
                    isLight ? 'text-[#043C50]' : 'text-[#3DB8D8]'
                  }`}>Secure</span>
                </span>
                <span className={`text-[10px] font-medium tracking-[0.08em] uppercase leading-tight transition-colors duration-300 ${
                  isLight ? 'text-[#D7C2A5]' : 'text-[#D7C2A5]'
                }`}>
                  Financial Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* ══ Desktop Nav Links — Center ════════════════════════════════════ */}
          <div ref={navContainerRef} className="hidden xl:flex items-center gap-0.5 relative">
            {NAV_LINKS.map((link) => {
              const LinkIcon = link.icon;
              const active = isActive(link.href);
              const isExternal = link.href.startsWith('http');

              if (isExternal) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                      isLight
                        ? 'text-[#D7C2A5] hover:text-[#043C50] hover:bg-[#FBF5ED]'
                        : 'text-[#D7C2A5] hover:text-[#EED9BE] hover:bg-white/[0.05]'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5 shrink-0 opacity-50" />
                    <span>{t(link.labelKey) || link.label}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                    active
                      ? isLight
                        ? 'text-[#043C50]'
                        : 'text-[#3DB8D8]'
                      : isLight
                        ? 'text-[#D7C2A5] hover:text-[#043C50] hover:bg-[#FBF5ED]'
                        : 'text-[#D7C2A5] hover:text-[#EED9BE] hover:bg-white/[0.05]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <LinkIcon className={`w-3.5 h-3.5 shrink-0 transition-all duration-200 ${
                    active ? 'opacity-100' : 'opacity-50'
                  }`} />
                  <span>{t(link.labelKey) || link.label}</span>
                  {/* Active animated underline — Stripe-style spring animation */}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className={`absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full ${
                        isLight
                          ? 'bg-[#043C50]'
                          : 'bg-[#3DB8D8]'
                      }`}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        mass: 0.8,
                      }}
                    />
                  )}
                  {/* Hover highlight background */}
                  {!active && (
                    <motion.div
                      className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ══ Right Side: CTAs + Toggles ════════════════════════════════════ */}
          <div className="flex items-center gap-1.5 shrink-0">

            {/* Phone Call button — desktop */}
            <Button
              variant="ghost"
              size="sm"
              className={`hidden xl:flex items-center gap-2 text-[13px] font-medium transition-all duration-200 h-9 px-2.5 rounded-lg ${
                isLight
                  ? 'text-[#D7C2A5] hover:text-[#043C50] hover:bg-[#FBF5ED]'
                  : 'text-[#D7C2A5] hover:text-[#EED9BE] hover:bg-white/[0.05]'
              }`}
              asChild
            >
              <a href="tel:+919257877312" aria-label="Call us">
                <Phone className="h-4 w-4" />
                <span className="hidden 2xl:inline">Call</span>
              </a>
            </Button>

            {/* WhatsApp button — desktop — Emerald green premium CTA */}
            <Button
              size="sm"
              className={`hidden xl:flex items-center gap-2 h-9 px-3.5 text-[13px] font-semibold transition-all duration-300 rounded-lg shadow-sm hover:shadow-md active:scale-[0.97] ${
                isLight
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-emerald-700/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 hover:shadow-emerald-500/30'
              }`}
              asChild
            >
              <a
                href="https://wa.me/919257877312"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden 2xl:inline">WhatsApp</span>
              </a>
            </Button>

            {/* Separator — desktop */}
            <div className={`hidden xl:block h-5 w-px mx-0.5 ${
              isLight ? 'bg-[#D7C2A5]' : 'bg-white/[0.08]'
            }`} />

            {/* HinglishToggleButton — Desktop */}
            <div className="hidden sm:block">
              <HinglishToggleButton />
            </div>

            {/* ThemeToggle — Desktop (SkyToggle) */}
            <div className="hidden md:block">
              <SkyToggle />
            </div>

            {/* InsureGPT AI Button — Desktop — Gradient premium CTA */}
            <motion.button
              onClick={() => openInsureGPT()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`hidden lg:flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[13px] font-semibold transition-all duration-300 cursor-pointer ${
                isLight
                  ? 'bg-gradient-to-r from-[#043C50] via-[#065A75] to-[#043C50] text-white shadow-[0_1px_3px_rgba(4,60,80,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_2px_8px_rgba(4,60,80,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]'
                  : 'bg-gradient-to-r from-[#043C50] via-[#08799A] to-[#043C50] text-white shadow-[0_1px_3px_rgba(8,121,154,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_2px_8px_rgba(8,121,154,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]'
              }`}
              aria-label="Open InsureGPT AI Chat"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>InsureGPT</span>
            </motion.button>

            {/* InsureGPT AI Button — Mobile (icon only, gradient) */}
            <motion.button
              onClick={() => openInsureGPT()}
              whileTap={{ scale: 0.92 }}
              className={`lg:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 cursor-pointer ${
                isLight
                  ? 'bg-gradient-to-br from-[#043C50] to-[#08799A] text-white shadow-sm'
                  : 'bg-gradient-to-br from-[#043C50] to-[#08799A] text-white shadow-sm'
              }`}
              aria-label="Open InsureGPT AI Chat"
            >
              <Sparkles className="w-4 h-4" />
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              className={`xl:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
                isLight
                  ? 'text-[#D7C2A5] hover:text-[#043C50] hover:bg-[#FBF5ED]'
                  : 'text-[#D7C2A5] hover:text-[#EED9BE] hover:bg-white/[0.05]'
              }`}
              onClick={() => setSheetOpen(true)}
              aria-label={t('v2.header.openMenu')}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ══ Mobile Sheet Menu — Premium slide-over ════════════════════════════ */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className={`w-[304px] sm:max-w-sm p-0 flex flex-col ${
            isLight
              ? 'bg-white border-l border-[#D7C2A5]/60'
              : 'bg-[#021E29] border-l border-white/[0.06]'
          }`}
        >
          {/* Sheet Header — Logo */}
          <SheetHeader className={`px-5 py-5 border-b ${
            isLight ? 'border-[#D7C2A5]' : 'border-white/[0.06]'
          }`}>
            <SheetTitle className="flex items-center gap-2.5">
              <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${
                isLight ? 'bg-[#043C50]' : 'bg-white/[0.06] border border-white/[0.06]'
              }`}>
                <Shield className={`h-4.5 w-4.5 ${isLight ? 'text-white' : 'text-[#EED9BE]'}`} strokeWidth={2.2} />
              </div>
              <div>
                <span className={`font-heading font-bold tracking-[-0.025em] text-base ${
                  isLight ? 'text-[#043C50]' : 'text-white'
                }`}>
                  Paliwal{' '}
                  <span className={isLight ? 'text-[#043C50]' : 'text-[#3DB8D8]'}>Secure</span>
                </span>
                <div className={`text-[10px] font-medium tracking-[0.08em] uppercase ${
                  isLight ? 'text-[#D7C2A5]' : 'text-[#D7C2A5]'
                }`}>
                  Financial Intelligence
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* Nav Links — Scrollable area */}
          <div className="flex-1 py-2 px-2 overflow-y-auto scrollbar-chat">
            {NAV_LINKS.map((link, index) => {
              const LinkIcon = link.icon;
              const active = isActive(link.href);
              const isExternal = link.href.startsWith('http');

              if (isExternal) {
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <SheetClose asChild>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 gap-3 min-h-[44px] ${
                          isLight
                            ? 'text-[#D7C2A5] hover:text-[#043C50] hover:bg-[#FBF5ED]'
                            : 'text-[#D7C2A5] hover:text-[#EED9BE] hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
                          isLight ? 'bg-[#FBF5ED]' : 'bg-white/[0.04]'
                        }`}>
                          <LinkIcon className="w-4 h-4 opacity-60" />
                        </span>
                        {t(link.labelKey) || link.label}
                      </a>
                    </SheetClose>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 1) * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SheetClose asChild>
                    <Link
                      href={link.href}
                      className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 gap-3 min-h-[44px] ${
                        active
                          ? isLight
                            ? 'bg-[#043C50]/5 text-[#043C50] font-semibold'
                            : 'bg-[#08799A]/[0.08] text-[#3DB8D8] font-semibold'
                          : isLight
                            ? 'text-[#D7C2A5] hover:text-[#043C50] hover:bg-[#FBF5ED]'
                            : 'text-[#D7C2A5] hover:text-[#EED9BE] hover:bg-white/[0.04]'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
                        active
                          ? isLight
                            ? 'bg-[#043C50]/10'
                            : 'bg-[#08799A]/15'
                          : isLight
                            ? 'bg-[#FBF5ED]'
                            : 'bg-white/[0.04]'
                      }`}>
                        <LinkIcon className={`w-4 h-4 transition-colors duration-200 ${
                          active
                            ? isLight ? 'text-[#043C50]' : 'text-[#3DB8D8]'
                            : 'opacity-60'
                        }`} />
                      </span>
                      {t(link.labelKey) || link.label}
                    </Link>
                  </SheetClose>
                </motion.div>
              );
            })}

            {/* ── Divider ────────────────────────────────────────────────────── */}
            <div className={`my-2 mx-3 h-px ${
              isLight ? 'bg-[#D7C2A5]' : 'bg-white/[0.06]'
            }`} />

            {/* Extra links in mobile: InsureGPT, WhatsApp, Phone */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (NAV_LINKS.length + 1) * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <SheetClose asChild>
                <button
                  onClick={() => {
                    setSheetOpen(false);
                    setTimeout(() => openInsureGPT(), 300);
                  }}
                  className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 gap-3 min-h-[44px] ${
                    isLight
                      ? 'text-[#043C50] hover:bg-[#043C50]/5'
                      : 'text-[#3DB8D8] hover:bg-[#08799A]/[0.08]'
                  }`}
                >
                  <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                    isLight ? 'bg-[#043C50]/10'
                          : 'bg-[#08799A]/15'
                  }`}>
                    <Sparkles className={`w-4 h-4 ${isLight ? 'text-[#043C50]' : 'text-[#3DB8D8]'}`} />
                  </span>
                  <span className="flex-1 text-left">InsureGPT AI</span>
                </button>
              </SheetClose>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (NAV_LINKS.length + 2) * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <SheetClose asChild>
                <a
                  href="https://wa.me/919257877312"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full px-3 py-2.5 text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 gap-3 min-h-[44px] mt-1"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/15">
                    <MessageCircle className="w-4 h-4" />
                  </span>
                  {t('nav.chatWhatsApp')}
                </a>
              </SheetClose>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (NAV_LINKS.length + 3) * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <SheetClose asChild>
                <a
                  href="tel:+919257877312"
                  className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 gap-3 min-h-[44px] ${
                    isLight
                      ? 'text-[#D7C2A5] hover:text-[#043C50] hover:bg-[#FBF5ED]'
                      : 'text-[#D7C2A5] hover:text-[#EED9BE] hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                    isLight ? 'bg-[#FBF5ED]' : 'bg-white/[0.04]'
                  }`}>
                    <Phone className="w-4 h-4 opacity-60" />
                  </span>
                  {t('nav.callNow')}: 9257877312
                </a>
              </SheetClose>
            </motion.div>
          </div>

          {/* ── Bottom section — Language + Theme + CTA ──────────────────────── */}
          <div className={`border-t p-5 space-y-4 ${
            isLight ? 'border-[#D7C2A5]' : 'border-white/[0.06]'
          }`}>
            {/* Language Toggle + Theme Toggle */}
            <div className="flex items-center gap-2.5">
              <Globe className={`w-4 h-4 ${isLight ? 'text-[#D7C2A5]' : 'text-[#D7C2A5]'}`} />
              <span className={`text-xs font-medium ${isLight ? 'text-[#D7C2A5]' : 'text-[#D7C2A5]'}`}>{t('insureGPT.language')}</span>
              <div className="ml-auto flex items-center gap-2">
                <HinglishToggleButton />
                <SkyToggle />
              </div>
            </div>

            {/* Get Quote CTA — Premium dark button */}
            <SheetClose asChild>
              <Button
                className={`w-full rounded-xl font-bold h-12 text-sm transition-all duration-300 active:scale-[0.98] ${
                  isLight
                    ? 'bg-[#043C50] text-white hover:bg-[#065A75] shadow-[0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.06)]'
                    : 'bg-gradient-to-r from-[#043C50] via-[#08799A] to-[#043C50] text-white shadow-[0_1px_3px_rgba(8,121,154,0.25),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_2px_8px_rgba(8,121,154,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]'
                }`}
                onClick={() => {
                  setSheetOpen(false);
                  setTimeout(() => {
                    const el = document.getElementById('motor-comparison');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 300);
                }}
              >
                {t('v2.header.getQuote')}
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
}
