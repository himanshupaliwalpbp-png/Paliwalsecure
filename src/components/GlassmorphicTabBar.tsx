'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Shield, MessageSquare, Phone, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useSafeTheme } from '@/lib/safe-theme-provider';

interface GlassmorphicTabBarProps {
  onNavigate: (sectionId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  gradient: string;
  lightGradient: string; // subtle gradient for light mode
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', icon: Home, gradient: 'from-blue-500 to-cyan-400', lightGradient: 'from-blue-400 to-sky-300' },
  { id: 'knowledge-base', label: 'Gyaan', icon: BookOpen, gradient: 'from-violet-500 to-purple-400', lightGradient: 'from-violet-400 to-fuchsia-300' },
  { id: 'insuregpt-chat', label: 'Chat', icon: MessageSquare, gradient: 'from-teal-500 to-cyan-400', lightGradient: 'from-teal-400 to-sky-300' },
  { id: 'products', label: 'Plans', icon: Shield, gradient: 'from-amber-500 to-orange-400', lightGradient: 'from-amber-400 to-yellow-300' },
  { id: 'contact', label: 'Call', icon: Phone, gradient: 'from-rose-500 to-pink-400', lightGradient: 'from-rose-400 to-red-300' },
];

/* ─── reduced‑motion hook ─────────────────────────────────────── */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reduced;
}

const BOUNCE_SPRING = { type: 'spring' as const, stiffness: 500, damping: 15 };
const GENTLE_SPRING = { type: 'spring' as const, stiffness: 300, damping: 25 };

/* ─── 3D Tab Button ──────────────────────────────────────────── */
function TabButton({
  item,
  isActive,
  onClick,
  reduced,
  layout,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
  reduced: boolean;
  layout: 'mobile' | 'desktop';
}) {
  const IconComp = item.icon;
  const isMobile = layout === 'mobile';
  const { resolvedTheme } = useSafeTheme();
  const isDark = resolvedTheme !== 'light';

  return (
    <motion.button
      onClick={onClick}
      whileTap={reduced ? { scale: 0.95 } : { scale: 0.9 }}
      whileHover={!isMobile && !reduced ? { y: -2 } : undefined}
      className={`
        relative flex flex-col items-center justify-center
        ${isMobile ? 'min-w-[64px] min-h-[56px] gap-1' : 'px-5 py-2.5 rounded-2xl gap-1.5'}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A9A6]/50
        transition-all duration-300 group
      `}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* ── Active: 3D Floating Icon Platform ── */}
      <div style={{ perspective: isMobile ? '500px' : '800px' }}>
        <motion.div
          animate={
            reduced
              ? { scale: 1, y: 0, translateZ: 0 }
              : isActive
                ? { scale: 1.22, y: isMobile ? -10 : -6, translateZ: 20 }
                : { scale: 1, y: 0, translateZ: 0 }
          }
          transition={
            reduced
              ? { duration: 0 }
              : isActive
                ? BOUNCE_SPRING
                : GENTLE_SPRING
          }
          style={{ transformStyle: 'preserve-3d' }}
          className="relative"
        >
          {/* ── Active: Soft Pill Platform behind icon (no green glow in light mode) ── */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute inset-0 -m-4 rounded-[16px]"
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(0,169,166,0.12) 0%, rgba(99,102,241,0.08) 50%, rgba(0,169,166,0.12) 100%)'
                    : 'linear-gradient(135deg, rgba(29,78,216,0.06) 0%, rgba(99,102,241,0.04) 50%, rgba(29,78,216,0.06) 100%)',
                  border: isDark
                    ? '1px solid rgba(0,169,166,0.2)'
                    : '1px solid rgba(29,78,216,0.12)',
                  boxShadow: isDark
                    ? `0 4px 16px rgba(0,169,166,0.15), 0 0 30px rgba(0,169,166,0.06), inset 0 1px 0 rgba(255,255,255,0.2)`
                    : `0 2px 8px rgba(29,78,216,0.08), 0 0 0 1px rgba(29,78,216,0.04), inset 0 1px 0 rgba(255,255,255,0.5)`,
                  transform: 'translateZ(-10px)',
                  backdropFilter: 'blur(8px)',
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* ── Active: Subtle Ring (NOT green glow in light mode) ── */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute inset-0 -m-2.5 rounded-full"
                style={{
                  background: isDark
                    ? `conic-gradient(from 0deg, rgba(0,169,166,0.35), rgba(99,102,241,0.25), rgba(0,169,166,0.35))`
                    : `conic-gradient(from 0deg, rgba(29,78,216,0.12), rgba(99,102,241,0.08), rgba(29,78,216,0.12))`,
                  filter: isDark ? 'blur(4px)' : 'blur(6px)',
                  animation: 'tabNeonSpin 3s linear infinite',
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: isDark ? 1.4 : 1.3 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* ── Icon Container with 3D depth ── */}
          <div
            className={`
              relative z-10 flex items-center justify-center rounded-2xl
              transition-all duration-300
              ${isMobile ? 'w-10 h-10' : 'w-8 h-8'}
              ${isActive
                ? `bg-gradient-to-br ${isDark ? item.gradient : item.lightGradient} shadow-lg`
                : 'bg-transparent'
              }
            `}
            style={{
              transform: 'translateZ(5px)',
              boxShadow: isActive
                ? isDark
                  ? `0 4px 12px rgba(0,169,166,0.25), 0 0 20px rgba(0,169,166,0.1), inset 0 1px 0 rgba(255,255,255,0.3)`
                  : `0 2px 8px rgba(29,78,216,0.15), inset 0 1px 0 rgba(255,255,255,0.5)`
                : 'none',
            }}
          >
            <IconComp
              className={`
                ${isMobile ? 'w-5 h-5' : 'w-4 h-4'}
                transition-all duration-300
                ${isActive
                  ? isDark
                    ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]'
                    : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]'
                  : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }
              `}
              strokeWidth={isActive ? 2.5 : 1.8}
            />
          </div>

          {/* ── Active: 3D Shadow beneath icon ── */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-2"
                style={{
                  width: isMobile ? '28px' : '20px',
                  height: '4px',
                  background: isDark
                    ? 'radial-gradient(ellipse, rgba(0,169,166,0.25) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse, rgba(29,78,216,0.1) 0%, transparent 70%)',
                  filter: 'blur(2px)',
                  transform: 'translateZ(-15px)',
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Label ── */}
      <motion.span
        className={`
          font-bold leading-tight tracking-wide
          ${isMobile ? 'text-[10px]' : 'text-xs'}
          transition-colors duration-300
          ${isActive
            ? isDark
              ? 'text-[#00D4D0]'
              : 'text-blue-700'
            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
          }
        `}
        style={{
          textShadow: isActive && isDark ? '0 0 12px rgba(0,169,166,0.5)' : 'none',
        }}
        animate={reduced ? {} : { opacity: isActive ? 1 : 0.5 }}
        transition={{ duration: 0.2 }}
      >
        {item.label}
      </motion.span>
    </motion.button>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */
export default function GlassmorphicTabBar({ onNavigate }: GlassmorphicTabBarProps) {
  const [activeId, setActiveId] = useState<string>('hero');
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const reduced = usePrefersReducedMotion();
  const { resolvedTheme } = useSafeTheme();
  const isDark = resolvedTheme !== 'light';

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current + 5 && currentY > 200) {
        setVisible(false);
      } else if (currentY < lastScrollY.current - 5) {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = useCallback(
    (id: string) => {
      setActiveId(id);
      onNavigate(id);
    },
    [onNavigate],
  );

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          MOBILE BOTTOM NAV — True 3D Floating Glass
          ══════════════════════════════════════════════════════════ */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        initial={false}
        animate={{ y: visible ? 0 : 120 }}
        transition={{ type: 'spring' as const, stiffness: 400, damping: 30 }}
        aria-label="Main navigation"
      >
        <div className="mx-2 mb-2 safe-area-bottom">
          <div
            className={`
              relative rounded-[24px]
              bg-white/85 dark:bg-slate-900/90
              supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-900/80
              supports-[backdrop-filter]:backdrop-blur-2xl
              border border-slate-200/50 dark:border-white/10
            `}
            style={{
              boxShadow: isDark
                ? `0 20px 60px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,169,166,0.08), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.05)`
                : `0 20px 60px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04), 0 0 0 1px rgba(29,78,216,0.06), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.02)`,
            }}
          >
            {/* ── Animated top border — subtle in light mode ── */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: isDark
                  ? `linear-gradient(90deg, transparent 0%, rgba(0,169,166,0.5) 15%, rgba(99,102,241,0.4) 40%, rgba(0,169,166,0.6) 60%, rgba(245,158,11,0.3) 85%, transparent 100%)`
                  : `linear-gradient(90deg, transparent 0%, rgba(29,78,216,0.3) 15%, rgba(99,102,241,0.2) 40%, rgba(29,78,216,0.35) 60%, rgba(245,158,11,0.15) 85%, transparent 100%)`,
                boxShadow: isDark ? '0 0 12px rgba(0,169,166,0.3)' : '0 0 6px rgba(29,78,216,0.1)',
                animation: 'tabBorderGlow 4s ease-in-out infinite alternate',
              }}
            />

            {/* ── Holographic shimmer sweep (very subtle in light mode) ── */}
            <div
              className="absolute inset-0 rounded-[24px] pointer-events-none overflow-hidden"
              style={{
                backgroundImage: isDark
                  ? `linear-gradient(105deg, transparent 35%, rgba(0,169,166,0.05) 42%, rgba(99,102,241,0.05) 48%, rgba(245,158,11,0.03) 54%, transparent 62%)`
                  : `linear-gradient(105deg, transparent 35%, rgba(29,78,216,0.02) 42%, rgba(99,102,241,0.02) 48%, rgba(245,158,11,0.01) 54%, transparent 62%)`,
                animation: 'tabShimmer 5s ease-in-out infinite',
                backgroundSize: '250% 100%',
              }}
            />

            {/* ── 3D top light reflection ── */}
            <div
              className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-[24px]"
              style={{
                backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)',
              }}
            />

            {/* ── Tab buttons ── */}
            <div className="relative flex items-center justify-around h-[72px] px-1">
              {navItems.map((item) => (
                <TabButton
                  key={item.id}
                  item={item}
                  isActive={activeId === item.id}
                  onClick={() => handleNav(item.id)}
                  reduced={reduced}
                  layout="mobile"
                />
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════════
          DESKTOP FLOATING PILL — True 3D Floating Glass
          ══════════════════════════════════════════════════════════ */}
      <div
        className="hidden md:flex fixed top-20 left-1/2 z-40 -translate-x-1/2"
        role="navigation"
        aria-label="Main navigation"
      >
        <motion.div
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...GENTLE_SPRING, delay: 0.3 }}
          className="relative"
        >
          {/* ── 3D depth shadow layer ── */}
          <div
            className="absolute inset-0 rounded-[22px] translate-y-[3px]"
            style={{
              background: isDark ? 'rgba(0,169,166,0.06)' : 'rgba(29,78,216,0.04)',
              filter: 'blur(8px)',
            }}
          />

          {/* ── Main glass pill ── */}
          <div
            className={`
              relative
              flex items-center gap-1 px-3 py-2.5
              rounded-[22px]
              bg-white/85 dark:bg-slate-900/90
              supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-900/80
              supports-[backdrop-filter]:backdrop-blur-2xl
              border border-slate-200/50 dark:border-white/10
            `}
            style={{
              boxShadow: isDark
                ? `0 16px 48px rgba(0,0,0,0.2), 0 6px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,169,166,0.06), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.03)`
                : `0 16px 48px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.03), 0 0 0 1px rgba(29,78,216,0.04), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.01)`,
            }}
          >
            {/* ── Animated border (subtle in light mode) ── */}
            <div
              className="absolute inset-0 rounded-[22px] pointer-events-none"
              style={{
                background: isDark
                  ? `linear-gradient(90deg, transparent 0%, rgba(0,169,166,0.1) 20%, rgba(99,102,241,0.08) 50%, rgba(0,169,166,0.1) 80%, transparent 100%)`
                  : `linear-gradient(90deg, transparent 0%, rgba(29,78,216,0.05) 20%, rgba(99,102,241,0.04) 50%, rgba(29,78,216,0.05) 80%, transparent 100%)`,
                animation: 'tabBorderGlow 4s ease-in-out infinite alternate',
              }}
            />

            {/* ── Holographic shimmer (very subtle in light mode) ── */}
            <div
              className="absolute inset-0 rounded-[22px] pointer-events-none overflow-hidden"
              style={{
                backgroundImage: isDark
                  ? `linear-gradient(105deg, transparent 35%, rgba(0,169,166,0.05) 42%, rgba(99,102,241,0.05) 48%, rgba(245,158,11,0.03) 54%, transparent 62%)`
                  : `linear-gradient(105deg, transparent 35%, rgba(29,78,216,0.02) 42%, rgba(99,102,241,0.01) 48%, rgba(245,158,11,0.01) 54%, transparent 62%)`,
                animation: 'tabShimmer 5s ease-in-out infinite',
                backgroundSize: '250% 100%',
              }}
            />

            {/* ── 3D top reflection ── */}
            <div
              className="absolute inset-x-0 top-0 h-1/2 rounded-t-[22px] pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
              }}
            />

            {navItems.map((item) => (
              <TabButton
                key={item.id}
                item={item}
                isActive={activeId === item.id}
                onClick={() => handleNav(item.id)}
                reduced={reduced}
                layout="desktop"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── CSS Animations ── */}
      <style jsx>{`
        @keyframes tabNeonSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes tabShimmer {
          0% { background-position: 250% 0; }
          100% { background-position: -250% 0; }
        }
        @keyframes tabBorderGlow {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
