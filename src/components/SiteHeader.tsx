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
      className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-all duration-300 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
        isLight
          ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:bg-[#EFF6FF] hover:border-[#2563EB]/30 hover:text-[#2563EB]'
          : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-primary/30 hover:text-primary'
      }`}
      aria-label={`Language: ${currentLabel}. Click to switch.`}
    >
      <Globe className="w-3.5 h-3.5" />
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
   SiteHeader Component — Light-mode premium navbar
   Inspired by reference Navigation.tsx: clean white bg, blur backdrop,
   blue accent on active, green WhatsApp CTA
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

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
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

  // Animated underline indicator for desktop nav
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navBtnRefs = useRef<(HTMLElement | null)[]>([]);

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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isLight
          ? scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            : 'bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0]'
          : scrolled
            ? 'bg-[#060E22]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
            : 'bg-[#060E22]/72 backdrop-blur-xl border-b border-white/[0.04]'
      }`}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* ── Logo on LEFT ───────────────────────────── */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Paliwal Secure AI – Home"
            >
              <div className="relative">
                <div className={`absolute inset-0 blur-xl rounded-full transition-opacity duration-300 ${
                  isLight ? 'bg-[#2563EB] opacity-10 group-hover:opacity-20' : 'bg-primary opacity-20 group-hover:opacity-30'
                }`} />
                <Shield className={`h-8 w-8 relative transition-colors duration-300 ${
                  isLight ? 'text-[#0F172A]' : 'text-foreground'
                }`} strokeWidth={2} />
              </div>
              <div>
                <span className={`text-xl font-bold tracking-[-0.02em] font-heading transition-colors duration-300 ${
                  isLight ? 'text-[#0F172A]' : 'text-foreground'
                }`}>
                  Paliwal{' '}
                  <span className={isLight ? 'text-[#2563EB]' : 'text-primary'}>
                    Secure
                  </span>
                </span>
                <div className={`text-xs font-body transition-colors duration-300 ${
                  isLight ? 'text-[#64748B]' : 'text-muted-foreground'
                }`}>
                  Financial Intelligence
                </div>
              </div>
            </Link>
          </div>

          {/* ── Desktop Nav Links ────────────────────────────────────────────── */}
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
                    className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                      isLight
                        ? 'text-[#64748B] hover:text-[#0F172A]'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    <span>{t(link.labelKey) || link.label}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={(el) => { navBtnRefs.current[NAV_LINKS.indexOf(link)] = el; }}
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? isLight
                        ? 'text-[#2563EB] font-semibold'
                        : 'text-primary font-semibold'
                      : isLight
                        ? 'text-[#64748B] hover:text-[#0F172A]'
                        : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <LinkIcon className={`w-3.5 h-3.5 shrink-0 transition-opacity ${active ? 'opacity-100' : 'opacity-60'}`} />
                  <span>{t(link.labelKey) || link.label}</span>
                  {/* Active animated underline */}
                  {active && (
                    <motion.div
                      layoutId="activeNavTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        isLight ? 'bg-[#2563EB]' : 'bg-primary'
                      }`}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right Side: CTAs + Toggles ──── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Phone Call button — desktop */}
            <Button
              variant="ghost"
              size="sm"
              className={`hidden xl:flex items-center gap-2 text-sm font-medium transition-colors h-9 px-3 ${
                isLight
                  ? 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
              asChild
            >
              <a href="tel:+919257877312" aria-label="Call us">
                <Phone className="h-4 w-4" />
                <span className="hidden 2xl:inline">Call</span>
              </a>
            </Button>

            {/* WhatsApp button — desktop */}
            <Button
              size="sm"
              className={`hidden xl:flex items-center gap-2 h-9 px-4 text-sm font-medium shadow-sm transition-all duration-200 ${
                isLight
                  ? 'bg-[#10B981] hover:bg-[#059669] text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
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

            {/* HinglishToggleButton */}
            <div className="hidden sm:block">
              <HinglishToggleButton />
            </div>

            {/* ThemeToggle — Desktop (SkyToggle) */}
            <div className="hidden md:block">
              <SkyToggle />
            </div>

            {/* InsureGPT AI Button — Desktop */}
            <button
              onClick={() => openInsureGPT()}
              className={`hidden lg:flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer border ${
                isLight
                  ? 'text-[#64748B] hover:text-[#2563EB] hover:border-[#2563EB]/30 hover:bg-[#EFF6FF] border-[#E2E8F0]'
                  : 'text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/[0.06] border-white/10'
              }`}
              aria-label="Open InsureGPT AI Chat"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>InsureGPT</span>
            </button>

            {/* InsureGPT AI Button — Mobile (icon only) */}
            <button
              onClick={() => openInsureGPT()}
              className={`lg:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ${
                isLight
                  ? 'text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF]'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/[0.06]'
              }`}
              aria-label="Open InsureGPT AI Chat"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle — uses Sheet on md+, dropdown on sm */}
            <button
              className={`xl:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                isLight
                  ? 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
              onClick={() => setSheetOpen(true)}
              aria-label={t('v2.header.openMenu')}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Sheet Menu ──────────────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className={`w-[300px] sm:max-w-sm p-0 ${
            isLight
              ? 'bg-white border-l border-[#E2E8F0]'
              : 'bg-[#0A1330] border-l border-white/[0.06]'
          }`}
        >
          <SheetHeader className={`p-5 border-b ${
            isLight ? 'border-[#E2E8F0]' : 'border-white/[0.06]'
          }`}>
            <SheetTitle className={`flex items-center gap-3 ${
              isLight ? 'text-[#0F172A]' : 'text-foreground'
            }`}>
              <Shield className={`h-6 w-6 ${isLight ? 'text-[#0F172A]' : 'text-foreground'}`} strokeWidth={2} />
              <div>
                <span className="font-heading font-bold tracking-[-0.02em]">
                  Paliwal{' '}
                  <span className={isLight ? 'text-[#2563EB]' : 'text-primary'}>
                    Secure
                  </span>
                </span>
                <div className={`text-xs ${isLight ? 'text-[#64748B]' : 'text-muted-foreground'}`}>
                  Financial Intelligence
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* Nav Links */}
          <div className="py-4 px-3 space-y-0.5 max-h-[55vh] overflow-y-auto scrollbar-chat">
            {NAV_LINKS.map((link, index) => {
              const LinkIcon = link.icon;
              const active = isActive(link.href);
              const isExternal = link.href.startsWith('http');

              if (isExternal) {
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <SheetClose asChild>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 gap-3 min-h-[44px] ${
                          isLight
                            ? 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                            : 'text-muted-foreground hover:text-primary hover:bg-primary/[0.06]'
                        }`}
                      >
                        <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${
                          isLight ? 'bg-[#F1F5F9]' : 'bg-white/5'
                        }`}>
                          <LinkIcon className="w-3.5 h-3.5" />
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
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 1) * 0.03, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SheetClose asChild>
                    <Link
                      href={link.href}
                      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 gap-3 min-h-[44px] ${
                        active
                          ? isLight
                            ? 'bg-[#EFF6FF] font-semibold text-[#2563EB]'
                            : 'bg-primary/[0.08] font-semibold text-primary'
                          : isLight
                            ? 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                            : 'text-muted-foreground hover:text-primary hover:bg-primary/[0.06]'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${
                        active
                          ? isLight
                            ? 'bg-[#2563EB]/10'
                            : 'bg-primary/15'
                          : isLight
                            ? 'bg-[#F1F5F9]'
                            : 'bg-white/5'
                      }`}>
                        <LinkIcon className={`w-3.5 h-3.5 ${active ? (isLight ? 'text-[#2563EB]' : 'text-primary') : ''}`} />
                      </span>
                      {t(link.labelKey) || link.label}
                    </Link>
                  </SheetClose>
                </motion.div>
              );
            })}

            {/* Extra links in mobile: InsureGPT, WhatsApp, Phone */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (NAV_LINKS.length + 1) * 0.03, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <SheetClose asChild>
                <button
                  onClick={() => {
                    setSheetOpen(false);
                    setTimeout(() => openInsureGPT(), 300);
                  }}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 gap-3 min-h-[44px] ${
                    isLight
                      ? 'text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF]'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/[0.06]'
                  }`}
                >
                  <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${
                    isLight ? 'bg-[#EFF6FF]' : 'bg-primary/10'
                  }`}>
                    <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-[#2563EB]' : 'text-primary'}`} />
                  </span>
                  <span className="flex-1 text-left">InsureGPT AI</span>
                </button>
              </SheetClose>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (NAV_LINKS.length + 2) * 0.03, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <SheetClose asChild>
                <a
                  href="https://wa.me/919257877312"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl text-white bg-[#10B981] hover:bg-[#059669] transition-all duration-200 gap-3 min-h-[44px]"
                >
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/20">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </span>
                  {t('nav.chatWhatsApp')}
                </a>
              </SheetClose>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (NAV_LINKS.length + 3) * 0.03, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <SheetClose asChild>
                <a
                  href="tel:+919257877312"
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 gap-3 min-h-[44px] ${
                    isLight
                      ? 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${
                    isLight ? 'bg-[#F1F5F9]' : 'bg-white/5'
                  }`}>
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  {t('nav.callNow')}: 9257877312
                </a>
              </SheetClose>
            </motion.div>
          </div>

          {/* Bottom section — Language + Theme */}
          <div className={`mt-auto border-t p-5 space-y-4 ${
            isLight ? 'border-[#E2E8F0]' : 'border-white/[0.06]'
          }`}>
            {/* Language Toggle + Theme Toggle */}
            <div className="flex items-center gap-2">
              <Globe className={`w-4 h-4 ${isLight ? 'text-[#64748B]' : 'text-muted-foreground'}`} />
              <span className={`text-xs ${isLight ? 'text-[#64748B]' : 'text-muted-foreground'}`}>{t('insureGPT.language')}</span>
              <div className="ml-auto flex items-center gap-2">
                <HinglishToggleButton />
                <SkyToggle />
              </div>
            </div>

            {/* Get Quote CTA */}
            <SheetClose asChild>
              <Button
                className={`w-full rounded-xl font-bold h-12 transition-all duration-200 ${
                  isLight
                    ? 'bg-[#0F172A] text-white hover:bg-[#0F172A]/90 shadow-sm'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_0_1px_rgba(212,168,83,0.2),0_2px_8px_-2px_rgba(212,168,83,0.3)]'
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
