'use client'

import * as React from 'react'
import { useSafeTheme } from '@/lib/safe-theme-provider'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

/* ──────────────────────────────────────────────
   Decorative star positions around the moon
   ────────────────────────────────────────────── */
const STARS = [
  { x: -12, y: -9, size: 3, delay: 0 },
  { x: 11, y: -11, size: 2, delay: 0.35 },
  { x: 10, y: 9, size: 2.5, delay: 0.7 },
  { x: -10, y: 11, size: 2, delay: 1.05 },
  { x: 1, y: -14, size: 1.5, delay: 0.5 },
]

/* ──────────────────────────────────────────────
   Number of animated sun rays
   ────────────────────────────────────────────── */
const RAY_COUNT = 8

/* ──────────────────────────────────────────────
   3D Ultra-Premium Theme Toggle
   ────────────────────────────────────────────── */
export function ThemeToggle3D() {
  const { resolvedTheme, setTheme } = useSafeTheme()
  const [mounted, setMounted] = React.useState(false)
  const [flipping, setFlipping] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme !== 'light'

  const handleToggle = React.useCallback(() => {
    setFlipping(true)
    setTheme(isDark ? 'light' : 'dark')
    const timer = setTimeout(() => setFlipping(false), 750)
    return () => clearTimeout(timer)
  }, [isDark, setTheme])

  /* ── SSR skeleton placeholder ──────────────── */
  if (!mounted) {
    return (
      <div
        className="h-10 w-10 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-amber-300/50 dark:border-blue-400/50 animate-pulse"
        aria-hidden="true"
      />
    )
  }

  return (
    <motion.button
      onClick={handleToggle}
      className={`
        relative h-10 w-10 rounded-full
        bg-white/20 dark:bg-white/10
        backdrop-blur-xl
        border border-amber-300/50 dark:border-blue-400/50
        cursor-pointer
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-amber-400 dark:focus-visible:outline-blue-400
        select-none
      `}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* ── Outer ambient glow (spring-animated on theme change) ── */}
      <motion.div
        className="absolute inset-[-4px] rounded-full pointer-events-none -z-10"
        animate={{
          boxShadow: isDark
            ? '0 0 16px 3px rgba(96,165,250,0.35), 0 0 36px 6px rgba(139,92,246,0.12)'
            : '0 0 16px 3px rgba(245,158,11,0.35), 0 0 36px 6px rgba(251,191,36,0.12)',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      />

      {/* ── Pulsing glow ring (3 keyframes → tween) ── */}
      <motion.div
        className="absolute inset-[-8px] rounded-full pointer-events-none -z-10"
        animate={{ opacity: [0.25, 0.7, 0.25], scale: [0.95, 1.06, 0.95] }}
        transition={{
          type: 'tween',
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          boxShadow: isDark
            ? '0 0 22px 5px rgba(96,165,250,0.28)'
            : '0 0 22px 5px rgba(245,158,11,0.28)',
        }}
      />

      {/* ── Glass-sphere 3D highlight ── */}
      <div className="absolute inset-[1px] rounded-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-transparent to-black/5 dark:from-white/20 dark:to-black/10" />
      </div>

      {/* ── Inner tinted glow ── */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: isDark
            ? 'inset 0 0 12px rgba(96,165,250,0.12)'
            : 'inset 0 0 12px rgba(245,158,11,0.12)',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      />

      {/* ── Flip flash (specular highlight during rotation) ── */}
      <AnimatePresence>
        {flipping && (
          <motion.div
            className="absolute inset-0 rounded-full z-20 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.7) 0%, transparent 65%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.9, 0, 0] }}
            exit={{ opacity: 0 }}
            transition={{ type: 'tween', duration: 0.7, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      {/* ── 3D perspective container ── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: 600 }}
      >
        {/* ── Rotating coin ── */}
        <motion.div
          className="relative flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
          animate={{ rotateY: isDark ? 180 : 0 }}
          transition={{
            type: 'tween',
            duration: 0.7,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {/* ── Sun face (front) ── */}
          <div
            className="flex items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="relative flex items-center justify-center">
              <Sun
                className="size-[18px] text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                strokeWidth={2.5}
              />
              {/* Animated golden rays */}
              {Array.from({ length: RAY_COUNT }).map((_, i) => {
                const angle = (360 / RAY_COUNT) * i
                const rad = (angle * Math.PI) / 180
                const dist = 15
                const x = Math.cos(rad) * dist
                const y = Math.sin(rad) * dist
                return (
                  <motion.div
                    key={`ray-${i}`}
                    className="absolute rounded-full bg-amber-400/70"
                    style={{
                      width: 2,
                      height: 5,
                      left: `calc(50% + ${x}px - 1px)`,
                      top: `calc(50% + ${y}px - 2.5px)`,
                      transform: `rotate(${angle}deg)`,
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scaleY: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                      type: 'tween',
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                )
              })}
            </div>
          </div>

          {/* ── Moon face (back) ── */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="relative flex items-center justify-center">
              <Moon
                className="size-[18px] text-blue-300 drop-shadow-[0_0_6px_rgba(96,165,250,0.5)]"
                strokeWidth={2.5}
              />
              {/* Twinkling stars */}
              {STARS.map((star, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: star.size,
                    height: star.size,
                    left: `calc(50% + ${star.x}px - ${star.size / 2}px)`,
                    top: `calc(50% + ${star.y}px - ${star.size / 2}px)`,
                    background:
                      'radial-gradient(circle, rgba(191,219,254,0.9) 0%, rgba(147,197,253,0.4) 100%)',
                  }}
                  animate={{
                    opacity: [0.15, 1, 0.15],
                    scale: [0.4, 1.4, 0.4],
                  }}
                  transition={{
                    type: 'tween',
                    duration: 1.8,
                    repeat: Infinity,
                    delay: star.delay,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <span className="sr-only">Toggle theme</span>
    </motion.button>
  )
}
