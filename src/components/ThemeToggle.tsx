'use client'

import * as React from 'react'
import { useSafeTheme } from '@/lib/safe-theme-provider'
import { Sun, Moon, Stars } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useSafeTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-full" />
    )
  }

  const isDark = resolvedTheme !== 'light'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <motion.button
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.9 }}
      className={`
        relative h-10 w-10 rounded-full
        transition-all duration-500
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
        overflow-hidden
      `}
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)'
          : 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)',
        boxShadow: isDark
          ? `0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)`
          : `0 4px 16px rgba(59,130,246,0.15), 0 0 0 1px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)`,
        perspective: '200px',
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Inner 3D depth layer */}
      <div
        className="absolute inset-[2px] rounded-full"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 30% 30%, rgba(99,102,241,0.15) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.6) 0%, transparent 60%)',
        }}
      />

      {/* Stars (visible in dark mode) */}
      <AnimatePresence>
        {isDark && (
          <>
            {[
              { top: '15%', left: '20%', size: 3, delay: 0 },
              { top: '25%', left: '70%', size: 2, delay: 0.3 },
              { top: '60%', left: '15%', size: 2, delay: 0.6 },
              { top: '75%', left: '75%', size: 3, delay: 0.15 },
            ].map((star, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 2,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main icon (Sun/Moon) */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotateY: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: 90, opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Moon
                className="w-5 h-5 text-blue-300"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(147,197,253,0.5))',
                }}
                strokeWidth={2}
              />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotateY: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: 90, opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Sun
                className="w-5 h-5 text-amber-500"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.4))',
                }}
                strokeWidth={2}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover ring effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              boxShadow: isDark
                ? '0 0 16px rgba(0,169,166,0.3), inset 0 0 8px rgba(0,169,166,0.1)'
                : '0 0 16px rgba(59,130,246,0.2), inset 0 0 8px rgba(59,130,246,0.05)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Bottom light reflection (3D effect) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-full pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)'
            : 'linear-gradient(to top, rgba(59,130,246,0.08), transparent)',
        }}
      />
    </motion.button>
  )
}
