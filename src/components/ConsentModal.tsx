'use client';

import { useState, useCallback, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSafeTheme } from '@/lib/safe-theme-provider';
import Link from 'next/link';

const CONSENT_KEY = 'paliwal_consent_given';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

type ConsentState = 'undecided' | 'accepted' | 'declined';

function readConsentFromStorage(): ConsentState {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.accepted && parsed.timestamp) {
        const elapsed = Date.now() - parsed.timestamp;
        if (elapsed < ONE_YEAR_MS) {
          return 'accepted';
        }
      }
      if (parsed.declined) {
        return 'declined';
      }
    }
  } catch {
    // If localStorage is unavailable, show the modal
  }
  return 'undecided';
}

function subscribeToStorage(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === CONSENT_KEY) callback();
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}

export default function ConsentModal() {
  const [liveState, setLiveState] = useState<ConsentState | null>(null);
  const { resolvedTheme } = useSafeTheme();

  // Hydration-safe mounted check
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Read initial consent state from localStorage via useSyncExternalStore
  const storedConsent = useSyncExternalStore(
    subscribeToStorage,
    readConsentFromStorage,
    () => 'undecided' as ConsentState // server snapshot
  );

  // liveState overrides storedConsent when user interacts
  const consentState = liveState ?? storedConsent;

  const handleAccept = useCallback(() => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ accepted: true, timestamp: Date.now() })
      );
    } catch {
      // localStorage unavailable
    }
    setLiveState('accepted');
  }, []);

  const handleDecline = useCallback(() => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ declined: true, timestamp: Date.now() })
      );
    } catch {
      // localStorage unavailable
    }
    setLiveState('declined');
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  // Don't render if already accepted
  if (!mounted || consentState === 'accepted') return null;

  // Hydration-safe: only treat as light when explicitly 'light'
  const isDark = resolvedTheme !== 'light';

  return (
    <AnimatePresence>
      {consentState === 'undecided' ? (
        // Full bottom-sheet modal
        <div
          className="fixed inset-0 z-[9999]"
          role="dialog"
          aria-modal="true"
          aria-label="Data Consent — DPDP Act 2023"
          key="consent-modal"
        >
          {/* Overlay with blur */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleDecline}
            aria-hidden="true"
          />

          {/* Bottom sheet card */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 w-full"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 300,
              mass: 0.8,
            }}
          >
            {/* Gold accent line at top */}
            <div
              className="h-1.5 rounded-t-2xl"
              style={{
                background: 'linear-gradient(90deg, #C98A1C, #C98A1C, #C98A1C)',
              }}
            />

            <div
              className="rounded-t-2xl px-4 py-6 sm:px-8 sm:py-8"
              style={{
                backgroundColor: isDark ? '#0A1330' : '#FFFFFF',
                borderTop: 'none',
              }}
            >
              {/* Header with cookie emoji */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl" role="img" aria-label="cookie">
                  🍪
                </span>
                <h2
                  className="text-lg sm:text-xl font-bold"
                  style={{
                    color: isDark ? '#C98A1C' : '#C98A1C',
                  }}
                >
                  Data Consent — DPDP Act 2023
                </h2>
              </div>

              {/* Body text */}
              <p
                className="text-sm sm:text-base leading-relaxed mb-5"
                style={{
                  color: isDark ? '#CBD5E1' : '#475569',
                }}
              >
                Paliwal Secure aapka naam aur email sirf insurance services
                provide karne ke liye use karega. Aapka data kisi third party ko
                nahi becha jayega.
              </p>

              {/* Privacy policy link */}
              <Link
                href="/privacy-policy"
                className="inline-block text-sm font-medium mb-6 underline underline-offset-4 transition-colors hover:opacity-80"
                style={{
                  color: isDark ? '#C98A1C' : '#C98A1C',
                }}
              >
                Privacy Policy padhein →
              </Link>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Accept button with gold/navy gradient */}
                <button
                  onClick={handleAccept}
                  className="flex-1 px-6 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all hover:opacity-90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C98A1C]"
                  style={{
                    background: 'linear-gradient(135deg, #C98A1C, #C98A1C)',
                    color: '#0A1330',
                  }}
                  aria-label="Agree to data consent and continue"
                >
                  ✅ Agree &amp; Continue
                </button>

                {/* Decline button - subtle gray */}
                <button
                  onClick={handleDecline}
                  className="px-6 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                  style={{
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(0,0,0,0.06)',
                    color: isDark ? '#94A3B8' : '#64748B',
                  }}
                  aria-label="Decline data consent"
                >
                  Decline
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : consentState === 'declined' ? (
        // Minimal banner at bottom
        <motion.div
          key="consent-banner"
          className="fixed bottom-0 left-0 right-0 z-[9999] px-4 py-3"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 260,
            mass: 0.8,
          }}
        >
          <div
            className="max-w-3xl mx-auto rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center gap-3 shadow-lg"
            style={{
              backgroundColor: isDark ? '#162D5A' : '#F1F5F9',
              borderTop: '3px solid #C98A1C',
            }}
            role="status"
            aria-label="Data consent declined banner"
          >
            <p
              className="text-xs sm:text-sm flex-1 text-center sm:text-left"
              style={{
                color: isDark ? '#CBD5E1' : '#475569',
              }}
            >
              🍪 You&apos;ve declined data consent. Some features may be
              limited.{' '}
              <Link
                href="/privacy-policy"
                className="underline underline-offset-2 font-medium"
                style={{
                  color: isDark ? '#C98A1C' : '#C98A1C',
                }}
              >
                Privacy Policy padhein →
              </Link>
            </p>
            <button
              onClick={handleAccept}
              className="shrink-0 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#C98A1C]"
              style={{
                background: 'linear-gradient(135deg, #C98A1C, #C98A1C)',
                color: '#0A1330',
              }}
              aria-label="Accept data consent"
            >
              Accept
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
