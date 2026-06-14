'use client';

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSafeTheme } from '@/lib/safe-theme-provider';
import { motion } from 'framer-motion';
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
  // Hydration-safe: only switch to light when resolvedTheme is explicitly 'light'
  const isDark = !mounted || resolvedTheme !== 'light';

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
      className={`flex items-center gap-1 h-6 px-2 rounded-full text-[10px] font-semibold transition-all duration-300 border min-w-[52px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
        isDark
          ? 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50'
          : 'bg-primary/8 border-primary/25 text-primary hover:bg-primary/15 hover:border-primary/40'
      }`}
      aria-label={`Language: ${currentLabel}. Click to switch.`}
    >
      <Globe className="w-3 h-3" />
      <span>{currentLabel}</span>
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Navigation links configuration — COMPREHENSIVE with ALL options
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
   SiteHeader Component — Premium glass navbar for BOTH dark & light modes
   EldoraUI-inspired: clean, spacious, with subtle animations
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
  const [scrolled, setScrolled] = useState(false);
  const mounted = useHasMounted();
  const pathname = usePathname();
  const { t } = useLanguage();
  const { resolvedTheme } = useSafeTheme();
  // Hydration-safe: default to dark when undefined (matches defaultTheme='dark')
  const isDark = resolvedTheme !== 'light';

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body scroll lock when mobile sheet is open
  useEffect(() => {
    if (sheetOpen) {
      document.body.classList.add('scroll-locked');
    } else {
      document.body.classList.remove('scroll-locked');
    }
    return () => document.body.classList.remove('scroll-locked');
  }, [sheetOpen]);

  // Close mobile sheet on route change
  useEffect(() => {
    const timeout = setTimeout(() => setSheetOpen(false), 0);
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

  // FloatingNav-style sliding indicator
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navBtnRefs = useRef<(HTMLElement | null)[]>([]);
  const [navIndicator, setNavIndicator] = useState({ width: 0, left: 0, opacity: 0 });

  // Update nav indicator position
  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = NAV_LINKS.findIndex(link => isActive(link.href) && !link.href.startsWith('http'));
      if (activeIndex >= 0 && navBtnRefs.current[activeIndex] && navContainerRef.current) {
        const btn = navBtnRefs.current[activeIndex];
        const container = navContainerRef.current;
        if (!btn) { setNavIndicator(prev => ({ ...prev, opacity: 0 })); return; }
        const btnRect = btn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        setNavIndicator({
          width: btnRect.width - 4,
          left: btnRect.left - containerRect.left + 2,
          opacity: 1,
        });
      } else {
        setNavIndicator(prev => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [pathname, isActive]);

  // Theme-aware class helpers (fallback to dark if not yet mounted)
  // Use isDark consistently: only switch to light classes when explicitly light
  const safeIsDark = !mounted || isDark;
  const textFg = 'text-foreground';
  const textMuted = 'text-muted-foreground';
  const hoverBg = !safeIsDark ? 'hover:bg-black/5' : 'hover:bg-white/5';

  return (
    <header
      className={`sticky top-0 z-50 glass-nav-universal border-b border-border ${scrolled ? 'scrolled' : ''}`}
      role="banner"
    >
      {/* Clean hairline bottom border — no glow animation */}

      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* ── Logo on LEFT ───────────────────────────── */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="Paliwal Secure AI – Home"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-shadow duration-300 relative"
              >
                <span className="font-heading font-bold text-primary-foreground text-lg leading-none">
                  P
                </span>
              </motion.div>
              <span className={`font-heading text-lg sm:text-xl font-bold tracking-tight ${textFg}`}>
                Paliwal{' '}
                <span className="text-primary">
                  Secure
                </span>
              </span>
            </Link>

          </div>

          {/* ── Desktop Nav Links ────────────────────────────────────────────── */}
          <div ref={navContainerRef} className="hidden xl:flex items-center gap-0.5 relative overflow-x-auto flex-1 min-w-0">
            {/* FloatingNav-style Sliding Active Indicator */}
            <motion.div
              animate={navIndicator}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute bottom-0 h-[2px] rounded-full bg-primary"
            />
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
                    className={`relative flex items-center gap-1 min-h-[32px] px-2 py-1 text-xs font-medium rounded-lg transition-all duration-200 group ${textMuted} hover:text-primary ${hoverBg} whitespace-nowrap`}
                  >
                    <LinkIcon className="w-3 h-3 shrink-0" />
                    <span>{t(link.labelKey) || link.label}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={(el) => { navBtnRefs.current[NAV_LINKS.indexOf(link)] = el; }}
                  className={`relative flex items-center gap-1 min-h-[32px] px-2 py-1 text-xs font-medium rounded-lg transition-all duration-200 group ${
                    active
                      ? 'nav-link-active font-semibold text-primary'
                      : `${textMuted} hover:text-primary ${hoverBg}`
                  } whitespace-nowrap`}
                  aria-current={active ? 'page' : undefined}
                >
                  <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{t(link.labelKey) || link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right Side: Toggle + Get Quote + Mobile ──── */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Phone icon — desktop */}
            <a
              href="tel:+919257877312"
              className={`hidden xl:flex items-center justify-center w-7 h-7 rounded-full ${textMuted} hover:text-primary ${hoverBg} transition-all duration-200`}
              aria-label="Call us"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            {/* HinglishToggleButton */}
            <div className="hidden sm:block">
              <HinglishToggleButton />
            </div>

            {/* ThemeToggle — Desktop (SkyToggle with clouds/stars/sun/moon) */}
            <div className="hidden md:block">
              <SkyToggle />
            </div>

            {/* Get Quote CTA — Desktop */}
            <Button
              className="hidden xl:inline-flex px-5 py-2.5 rounded-full font-medium text-sm tracking-tight bg-primary text-primary-foreground shadow-[0_1px_0_inset_rgba(255,255,255,.15),0_4px_12px_-4px_rgba(194,86,44,0.3)] hover:bg-primary/90 h-auto"
              onClick={() => {
                const el = document.getElementById('motor-comparison');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {t('v2.header.getQuote')}
            </Button>

            {/* InsureGPT AI Button — Desktop (regular nav item style) */}
            <button
              onClick={() => openInsureGPT()}
              className="hidden lg:flex items-center gap-1 h-7 px-2.5 rounded-full text-xs font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-all duration-200 cursor-pointer"
              aria-label="Open InsureGPT AI Chat"
            >
              <Sparkles className="w-3 h-3" />
              <span>InsureGPT</span>
            </button>

            {/* InsureGPT AI Button — Mobile (icon only) */}
            <button
              onClick={() => openInsureGPT()}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 text-muted-foreground hover:text-primary hover:bg-muted"
              aria-label="Open InsureGPT AI Chat"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden ${textMuted} hover:text-primary ${hoverBg} rounded-lg w-10 h-10`}
              onClick={() => setSheetOpen(true)}
              aria-label={t('v2.header.openMenu')}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Sheet Menu ──────────────────────────────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className={`sheet-menu-dark ${textFg} w-[300px] sm:max-w-sm p-0`}
        >
          <SheetHeader className={`p-4 border-b border-border`}>
            <SheetTitle className={`flex items-center gap-2 ${textFg}`}>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-heading font-bold text-primary-foreground text-sm leading-none">
                  P
                </span>
              </div>
              <span className="font-heading font-bold">
                Paliwal{' '}
                <span className="text-primary">
                  Secure
                </span>
              </span>
            </SheetTitle>
          </SheetHeader>

          {/* Nav Links */}
          <div className="py-3 px-2 space-y-0.5 max-h-[55vh] overflow-y-auto scrollbar-chat">
            {NAV_LINKS.map((link, index) => {
              const LinkIcon = link.icon;
              const active = isActive(link.href);
              const isExternal = link.href.startsWith('http');

              if (isExternal) {
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                  >
                    <SheetClose asChild>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl ${textMuted} hover:text-primary ${hoverBg} transition-all duration-200 gap-3 min-h-[44px]`}
                      >
                        <LinkIcon className="w-4 h-4 shrink-0" />
                        {t(link.labelKey) || link.label}
                      </a>
                    </SheetClose>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index + 1) * 0.04, duration: 0.2 }}
                >
                  <SheetClose asChild>
                    <Link
                      href={link.href}
                      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 gap-3 min-h-[44px] ${
                        active
                          ? 'nav-link-active font-semibold text-primary'
                          : `${textMuted} hover:text-primary ${hoverBg}`
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      <LinkIcon className="w-4 h-4 shrink-0" />
                      {t(link.labelKey) || link.label}
                    </Link>
                  </SheetClose>
                </motion.div>
              );
            })}

            {/* Extra links in mobile: InsureGPT, About, Contact, WhatsApp */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (NAV_LINKS.length + 1) * 0.04, duration: 0.2 }}
            >
              <SheetClose asChild>
                <button
                  onClick={() => {
                    setSheetOpen(false);
                    setTimeout(() => openInsureGPT(), 300);
                  }}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl ${textMuted} hover:text-primary ${hoverBg} transition-all duration-200 gap-3 min-h-[44px]`}
                >
                  <Sparkles className="w-4 h-4 shrink-0 text-primary" />
                  <span className="flex-1 text-left">InsureGPT AI</span>
                </button>
              </SheetClose>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (NAV_LINKS.length + 2) * 0.04, duration: 0.2 }}
            >
              <SheetClose asChild>
                <a
                  href="https://wa.me/919257877312"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl ${textMuted} hover:text-primary ${hoverBg} transition-all duration-200 gap-3 min-h-[44px]`}
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  {t('nav.chatWhatsApp')}
                </a>
              </SheetClose>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (NAV_LINKS.length + 3) * 0.04, duration: 0.2 }}
            >
              <SheetClose asChild>
                <a
                  href="tel:+919257877312"
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl ${textMuted} hover:text-primary ${hoverBg} transition-all duration-200 gap-3 min-h-[44px]`}
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  {t('nav.callNow')}: 9257877312
                </a>
              </SheetClose>
            </motion.div>
          </div>

          {/* Bottom section — Language + Theme + CTA */}
          <div className={`mt-auto border-t border-border p-4 space-y-3`}>
            {/* Language Toggle + Theme Toggle */}
            <div className="flex items-center gap-2">
              <Globe className={`w-4 h-4 ${textMuted}`} />
              <span className={`text-xs ${textMuted}`}>{t('insureGPT.language')}</span>
              <div className="ml-auto flex items-center gap-2">
                <HinglishToggleButton />
                <SkyToggle />
              </div>
            </div>

            {/* Get Quote CTA */}
            <SheetClose asChild>
              <Button
                className="w-full rounded-xl font-bold h-11 bg-primary text-primary-foreground shadow-[0_1px_0_inset_rgba(255,255,255,.15),0_4px_12px_-4px_rgba(194,86,44,0.3)] hover:bg-primary/90"
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
    </header>
  );
}
