'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  House,
  GitCompare,
  MessageCircle,
  BookOpen,
  Shield,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

/* ═══════════════════════════════════════════════════════════════════════════
   MobileBottomNav — Premium Floating Pill Navigation Bar
   PaliwalSecure Edition: FloatingNav-style floating pill + spring animations

   Features:
   - Floating centered pill shape (not full-width)
   - Sliding active indicator with spring physics
   - Dark blue glass + gold accents
   - Theme-aware (dark/light mode)
   - Icon scale + glow on active
   - Gold top accent line
   - Entrance animation (slide up + fade)
   - Tap ripple effect
   ═══════════════════════════════════════════════════════════════════════════ */

interface NavItem {
  id: string;
  label: string;
  labelKey: string;
  icon: React.ElementType;
  href?: string;
  isExternal?: boolean;
  color?: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', labelKey: 'v2.mobileNav.home', icon: House },
  { id: 'plans', label: 'Plans', labelKey: 'nav.lifeInsurance', icon: Shield, href: '/life-insurance' },
  { id: 'compare', label: 'Compare', labelKey: 'v2.mobileNav.compare', icon: GitCompare, href: '/compare' },
  { id: 'blog', label: 'Blog', labelKey: 'nav.blog', icon: BookOpen, href: '/blog' },
  { id: 'chat', label: 'Chat', labelKey: 'v2.mobileNav.chat', icon: MessageCircle, href: 'https://wa.me/919257877312', isExternal: true, color: '#22C55E' },
];

/* ─── Tap Ripple Effect ──────────────────────────────────────────────────── */
function TapRipple({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.span
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'radial-gradient(circle at center, rgba(201,138,28,0.10) 0%, transparent 70%)',
          }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 1.6, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main MobileBottomNav Component
   ═══════════════════════════════════════════════════════════════════════════ */
export default function MobileBottomNav() {
  const pathname = usePathname();
  const [manualActiveId, setManualActiveId] = useState<string | null>(null);
  const [tapRipple, setTapRipple] = useState<string | null>(null);
  const { t } = useLanguage();

  // Derive active ID from route or manual tap
  const activeId = manualActiveId ?? (() => {
    if (pathname === '/') return 'home';
    const match = navItems.find(item => item.href === pathname);
    return match ? match.id : 'home';
  })();

  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const [navVisible, setNavVisible] = useState(false);

  // Entrance animation — slide up from below
  useEffect(() => {
    const timer = setTimeout(() => setNavVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Update indicator position when active changes or resize
  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = navItems.findIndex(item => item.id === activeId);
      if (activeIndex >= 0 && btnRefs.current[activeIndex] && containerRef.current) {
        const btn = btnRefs.current[activeIndex];
        const container = containerRef.current;
        if (!btn) return;
        const btnRect = btn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setIndicatorStyle({
          width: btnRect.width,
          left: btnRect.left - containerRect.left,
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeId]);

  const handleNav = useCallback((item: NavItem) => {
    setManualActiveId(item.id);
    setTapRipple(item.id);
    setTimeout(() => setTapRipple(null), 600);

    if (item.id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (item.isExternal && item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (item.href) {
      const sectionId = item.href.replace('#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (item.href.startsWith('/')) {
        window.location.href = item.href;
      }
    }
  }, []);

  // Scroll-based active section detection (only on homepage)
  useEffect(() => {
    if (pathname !== '/') return;
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setManualActiveId('home');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return (
    <motion.nav
      className="fixed z-50 md:hidden left-0 right-0 px-3"
      style={{ bottom: '12px' }}
      initial={{ y: 100, opacity: 0 }}
      animate={navVisible ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.1 }}
      aria-label="Mobile navigation"
    >
      <div
        className="relative max-w-md mx-auto"
      >
        {/* ─── Floating Pill Container ─── */}
        <div
          ref={containerRef}
          className="relative flex items-center justify-between rounded-2xl px-1.5 py-2 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #0A0A0C 0%, #141416 50%, #0E0E10 100%)',
            border: '1px solid rgba(201, 138, 28, 0.20)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 12px rgba(201, 138, 28, 0.10), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* ─── Gold Top Accent Line ─── */}
          <div
            className="absolute top-0 left-4 right-4 h-px rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(201, 138, 28, 0.35), rgba(212, 162, 76, 0.40), rgba(201, 138, 28, 0.35), transparent)',
            }}
          />

          {/* ─── Sliding Active Indicator — Spring Physics ─── */}
          <motion.div
            animate={indicatorStyle}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute top-1.5 bottom-1.5 rounded-xl z-0"
            style={{
              background: 'linear-gradient(135deg, rgba(201, 138, 28, 0.18) 0%, rgba(201, 138, 28, 0.06) 100%)',
              border: '1px solid rgba(201, 138, 28, 0.25)',
              boxShadow: '0 0 8px rgba(201, 138, 28, 0.12), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 8px rgba(232,201,122,0.04)',
            }}
          />

          {/* ─── Nav Items ─── */}
          {navItems.map((item, index) => {
            const isActive = activeId === item.id;
            const IconComp = item.icon;

            return (
              <motion.button
                key={item.id}
                ref={(el) => { btnRefs.current[index] = el; }}
                onClick={() => handleNav(item)}
                className="relative flex flex-col items-center justify-center flex-1 px-1.5 py-1.5 text-sm font-medium rounded-xl transition-colors duration-200 z-10"
                whileTap={{ scale: 0.88 }}
                animate={{
                  scale: isActive ? 1.02 : 0.96,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
                aria-label={item.label}
                aria-current={isActive ? 'true' : undefined}
              >
                {/* ─── Icon Container ─── */}
                <motion.div
                  className="relative flex items-center justify-center z-10"
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 20,
                  }}
                >
                  {/* Active glow ring around icon */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, rgba(201,138,28,0.20) 0%, rgba(232,201,122,0.06) 40%, rgba(201,138,28,0.04) 60%, transparent 80%)`,
                        width: 44,
                        height: 44,
                        left: '50%',
                        top: '50%',
                        x: '-50%',
                        y: '-50%',
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.8, opacity: [0, 1, 0] }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  )}

                  <IconComp
                    size={isActive ? 22 : 19}
                    style={{
                      color: isActive
                        ? (item.color || '#C98A1C')
                        : 'rgba(255,255,255,0.55)',
                      filter: isActive
                        ? `drop-shadow(0 0 4px rgba(201,138,28,0.35)) drop-shadow(0 0 1px rgba(255,255,255,0.15))`
                        : 'none',
                      transition: 'color 0.2s, filter 0.2s',
                    }}
                  />
                </motion.div>

                {/* ─── Label ─── */}
                <motion.span
                  className="mt-0.5 tracking-wide font-semibold leading-none"
                  animate={{
                    fontSize: isActive ? 10 : 9,
                    color: isActive
                      ? (item.color || '#C98A1C')
                      : 'rgba(255,255,255,0.50)',
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    textShadow: isActive
                      ? `0 0 4px ${item.color || 'rgba(201,138,28,0.20)'}`
                      : 'none',
                  }}
                >
                  {t(item.labelKey) || item.label}
                </motion.span>

                {/* ─── Active Dot Below Icon ─── */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: item.color || '#C98A1C',
                      boxShadow: `0 0 4px ${item.color || 'rgba(201,138,28,0.30)'}`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  />
                )}

                {/* ─── Tap Ripple Effect ─── */}
                <TapRipple active={tapRipple === item.id} />
              </motion.button>
            );
          })}
        </div>

        {/* ─── Shimmer Reflection Below Pill ─── */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[70%] h-3 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(201,138,28,0.04) 0%, rgba(201,138,28,0.01) 50%, transparent 80%)',
            filter: 'blur(10px)',
          }}
          aria-hidden="true"
        />
      </div>
    </motion.nav>
  );
}
