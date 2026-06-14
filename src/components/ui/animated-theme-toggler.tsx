'use client';

import { useSafeTheme } from '@/lib/safe-theme-provider';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useSyncExternalStore, useState, useCallback } from 'react';

/* ────────────────────────────────────────────────────────────────────────────
   AnimatedThemeToggler — MagicUI-inspired theme toggle
   PaliwalSecure brand colors: Gold (#C98A1C) & Navy (#0A1330)

   - variant="rectangle": pill-shaped toggle with sliding indicator
   - variant="circle": circular toggle with 3D flip animation
   ──────────────────────────────────────────────────────────────────────────── */

interface AnimatedThemeTogglerProps {
  variant?: 'circle' | 'rectangle';
  className?: string;
}

/* Hydration-safe mounted check */
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/* ── Circle variant ──────────────────────────────────────────────────────── */
function CircleVariant({ className = '' }: { className?: string }) {
  const { setTheme, resolvedTheme } = useSafeTheme();
  const mounted = useHasMounted();
  const [isHovered, setIsHovered] = useState(false);

  // Hydration-safe: default to dark when undefined (matches defaultTheme='dark')
  const isDark = resolvedTheme !== 'light';

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  if (!mounted) {
    return <div className={`h-10 w-10 rounded-full ${className}`} />;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.9 }}
      className={`relative h-10 w-10 rounded-full overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-shadow duration-300 ${className}`}
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0F1C40, #162D5A)'
          : 'linear-gradient(135deg, #F5F1E6, #FDF0D5)',
        border: isDark
          ? '1px solid rgba(201, 138, 28, 0.3)'
          : '1px solid rgba(201, 138, 28, 0.2)',
        boxShadow: isDark
          ? '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 4px 16px rgba(201,138,28,0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
        perspective: '200px',
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Inner depth glow */}
      <div
        className="absolute inset-[2px] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 30% 30%, rgba(201,138,28,0.1) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.6) 0%, transparent 60%)',
        }}
      />

      {/* Twinkling stars in dark mode */}
      <AnimatePresence>
        {isDark && (
          <>
            {[
              { top: '18%', left: '22%', size: 2.5, delay: 0 },
              { top: '28%', left: '72%', size: 2, delay: 0.4 },
              { top: '62%', left: '18%', size: 1.5, delay: 0.7 },
              { top: '72%', left: '70%', size: 2, delay: 0.2 },
            ].map((star, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-[#C98A1C] pointer-events-none"
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.3, 0.9, 0.3],
                  scale: [0.8, 1.3, 0.8],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 2.5,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main icon */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun-circle"
              initial={{ rotateY: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: 90, opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Sun
                className="w-5 h-5 text-[#C98A1C]"
                style={{ filter: 'drop-shadow(0 0 6px rgba(201,138,28,0.6))' }}
                strokeWidth={2}
              />
            </motion.div>
          ) : (
            <motion.div
              key="moon-circle"
              initial={{ rotateY: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: 90, opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Moon
                className="w-5 h-5 text-[#0A1330]"
                style={{ filter: 'drop-shadow(0 0 4px rgba(10,19,48,0.2))' }}
                strokeWidth={2}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover glow ring */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              boxShadow: '0 0 18px rgba(201,138,28,0.35), inset 0 0 10px rgba(201,138,28,0.1)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Bottom reflection */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-full pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)'
            : 'linear-gradient(to top, rgba(201,138,28,0.06), transparent)',
        }}
      />
    </motion.button>
  );
}

/* ── Rectangle (pill) variant ────────────────────────────────────────────── */
function RectangleVariant({ className = '' }: { className?: string }) {
  const { setTheme, resolvedTheme } = useSafeTheme();
  const mounted = useHasMounted();
  const [isHovered, setIsHovered] = useState(false);

  // Hydration-safe: default to dark when undefined (matches defaultTheme='dark')
  const isDark = resolvedTheme !== 'light';

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  if (!mounted) {
    return <div className={`h-9 w-[76px] rounded-full ${className}`} />;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
      className={`relative h-9 w-[76px] rounded-full overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-shadow duration-300 ${className}`}
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0F1C40, #162D5A)'
          : 'linear-gradient(135deg, #F5F1E6, #FDF0D5)',
        border: isDark
          ? '1px solid rgba(201, 138, 28, 0.3)'
          : '1px solid rgba(201, 138, 28, 0.2)',
        boxShadow: isDark
          ? '0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 2px 12px rgba(201,138,28,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Sliding indicator pill */}
      <motion.div
        className="absolute top-[3px] bottom-[3px] w-[32px] rounded-full"
        style={{
          background: 'linear-gradient(135deg, #C98A1C, #C98A1C)',
          boxShadow: isDark
            ? '0 2px 8px rgba(201, 138, 28, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
            : '0 2px 8px rgba(201, 138, 28, 0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
          zIndex: 5,
        }}
        animate={{
          left: isDark ? '3px' : 'calc(100% - 35px)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      {/* Sun icon — left side (highlighted in dark mode = "click to go light") */}
      <div className="absolute left-0 w-1/2 h-full flex items-center justify-center z-[3]">
        <Sun
          className={`w-3.5 h-3.5 transition-colors duration-300 ${
            isDark
              ? 'text-[#0A1330]'
              : 'text-[#9CA3AF]/40'
          }`}
          style={isDark ? { filter: 'drop-shadow(0 0 2px rgba(10,19,48,0.3))' } : undefined}
          strokeWidth={2.5}
        />
      </div>

      {/* Moon icon — right side (highlighted in light mode = "click to go dark") */}
      <div className="absolute right-0 w-1/2 h-full flex items-center justify-center z-[3]">
        <Moon
          className={`w-3.5 h-3.5 transition-colors duration-300 ${
            isDark
              ? 'text-[#9CA3AF]/40'
              : 'text-[#0A1330]'
          }`}
          style={!isDark ? { filter: 'drop-shadow(0 0 2px rgba(10,19,48,0.2))' } : undefined}
          strokeWidth={2.5}
        />
      </div>

      {/* Hover glow effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none z-[2]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              boxShadow: '0 0 14px rgba(201,138,28,0.3), inset 0 0 8px rgba(201,138,28,0.08)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Subtle top highlight */}
      <div
        className="absolute top-0 left-2 right-2 h-1/2 rounded-t-full pointer-events-none z-[1]"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
        }}
      />
    </motion.button>
  );
}

/* ── Main export ─────────────────────────────────────────────────────────── */
export function AnimatedThemeToggler({ variant = 'rectangle', className = '' }: AnimatedThemeTogglerProps) {
  if (variant === 'circle') {
    return <CircleVariant className={className} />;
  }
  return <RectangleVariant className={className} />;
}
