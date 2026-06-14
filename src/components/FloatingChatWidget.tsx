'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import type { UserProfile } from '@/lib/insurance-data';

// ---------------------------------------------------------------------------
// Dynamic import of EmbeddedChatBot (SSR disabled — same pattern as page.tsx)
// ---------------------------------------------------------------------------
const EmbeddedChatBot = dynamic(() => import('@/components/EmbeddedChatBot'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-[#C98A1C]/30 dark:border-[#C98A1C]/30 border-t-[#C98A1C] dark:border-t-[#C98A1C] rounded-full" />
    </div>
  ),
});

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface FloatingChatWidgetProps {
  profile: UserProfile | null;
}

// ---------------------------------------------------------------------------
// FloatingChatWidget Component — Premium Frosted Glass Design
// ---------------------------------------------------------------------------
export default function FloatingChatWidget({ profile }: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Track very small screens (< 320px) where the widget should not render
  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 320);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Don't render on very small screens
  if (isSmallScreen) return null;

  return (
    <>
      {/* ----------------------------------------------------------------- */}
      {/*  Chat Panel — Frosted Glass                                       */}
      {/* ----------------------------------------------------------------- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28, mass: 0.8 }}
            className="fixed z-[60] bottom-20 sm:bottom-24 right-4 sm:right-6
                       w-[calc(100vw-2rem)] sm:w-[400px] h-[550px] sm:h-[550px]
                       max-h-[70vh] sm:max-h-[70vh]
                       rounded-2xl overflow-hidden
                       border border-white/20 dark:border-white/10
                       bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
                       flex flex-col"
            style={{
              boxShadow:
                '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1) inset',
            }}
          >
            {/* Glass Header — Premium Gradient with Paliwal Secure Badge */}
            <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-[#C98A1C] via-[#C98A1C] to-emerald-600 text-white px-4 py-3 flex items-center justify-between">
              {/* Animated gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#C98A1C] via-[#C98A1C] to-emerald-600 opacity-80" style={{ backgroundSize: '200% 100%', animation: 'shimmer-gradient 6s ease infinite' }} />

              {/* Decorative circles */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle className="w-4.5 h-4.5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm leading-tight">InsureGPT</h3>
                    <span className="text-[9px] text-white/60">•</span>
                    <span className="text-[10px] text-white/70 font-medium">Powered by AI</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/70">Online</span>
                    <span className="inline-flex items-center gap-0.5 bg-white/15 px-1.5 py-0 rounded-full text-[8px] font-semibold">
                      <Sparkles className="w-2 h-2" />
                      Paliwal Secure
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 relative z-10">
                <div className="flex items-center gap-0.5 bg-white/15 px-1.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span className="text-[8px] font-medium">IRDAI</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="relative z-10 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <style jsx>{`
                @keyframes shimmer-gradient {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}</style>
            </div>

            {/* Chat Body — EmbeddedChatBot lives here */}
            <div className="flex-1 overflow-hidden">
              <EmbeddedChatBot profile={profile} isFloating />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------- */}
      {/*  Floating Button — Premium Gradient with Tooltip                  */}
      {/* ----------------------------------------------------------------- */}
      <div
        className="fixed z-[60] bottom-20 sm:bottom-6 right-4 sm:right-6 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip on hover */}
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full right-0 mb-2.5 px-3 py-1.5 rounded-xl
                         bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium
                         whitespace-nowrap pointer-events-none shadow-lg
                         flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-[#C98A1C]" />
              Chat with InsureGPT
              <div className="absolute top-full right-5 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800 dark:border-t-slate-700" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing ring (visible when panel is closed) */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-pulse-ring">
            <span className="absolute inset-0 rounded-full bg-[#C98A1C]/30 scale-150 animate-ping opacity-40" />
          </span>
        )}

        <motion.button
          id="floating-chat-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center
                     shadow-lg transition-shadow duration-300 hover:shadow-xl
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C98A1C] focus-visible:ring-offset-2"
          style={{
            background: 'linear-gradient(135deg, #C98A1C, #C98A1C, #10b981)',
          }}
          aria-label={isOpen ? 'Close InsureGPT chat' : 'Open InsureGPT chat'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <X className="w-6 h-6 text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center"
              >
                <Brain className="w-6 h-6 text-white" />
                <span className="text-[8px] font-bold text-white/90 leading-none mt-0.5">AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

    </>
  );
}
