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

/* ── Shield/lock trust icon (inline SVG) ── */
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
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
        /* ── Centered premium consent modal ── */
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Data Consent — DPDP Act 2023"
          key="consent-modal"
        >
          {/* Overlay with blur */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={handleDecline}
            aria-hidden="true"
          />

          {/* Modal card — glassmorphism, compact */}
          <motion.div
            className="relative w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 350,
              mass: 0.6,
            }}
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                backgroundColor: isDark
                  ? 'rgba(2, 30, 41, 0.85)'
                  : 'rgba(238, 217, 190, 0.88)',
                backdropFilter: 'blur(24px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
                boxShadow: isDark
                  ? '0 24px 64px -16px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.06) inset'
                  : '0 24px 64px -16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.04) inset',
              }}
            >
              {/* Top accent line — subtle gold */}
              <div
                className="h-[2px] w-full"
                style={{
                  background: isDark
                    ? 'linear-gradient(90deg, transparent, #E8C872, transparent)'
                    : 'linear-gradient(90deg, transparent, #C98A1C, transparent)',
                }}
              />

              <div className="px-6 pt-6 pb-5 sm:px-7 sm:pt-7 sm:pb-6">
                {/* Shield icon + Title */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{
                      backgroundColor: isDark
                        ? 'rgba(232, 200, 114, 0.12)'
                        : 'rgba(201, 138, 28, 0.08)',
                    }}
                  >
                    <ShieldIcon
                      className={isDark ? 'text-[#E8C872]' : 'text-[#C98A1C]'}
                    />
                  </div>
                  <h2
                    className="font-[family-name:var(--font-heading)] text-base sm:text-lg font-bold leading-snug pt-1.5"
                    style={{
                      color: isDark ? '#EED9BE' : '#043C50',
                    }}
                  >
                    Data Consent — DPDP Act 2023
                  </h2>
                </div>

                {/* Body text */}
                <p
                  className="text-[13px] sm:text-sm leading-relaxed mb-4"
                  style={{
                    color: isDark ? '#D7C2A5' : '#D7C2A5',
                    fontFamily:
                      'var(--font-sans), Inter, system-ui, sans-serif',
                  }}
                >
                  Paliwal Secure aapka naam aur email sirf insurance services
                  provide karne ke liye use karega. Aapka data kisi third party ko
                  nahi becha jayega.
                </p>

                {/* Privacy policy link — prominent */}
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-1 text-[13px] sm:text-sm font-semibold mb-5 transition-all duration-200 hover:gap-1.5 group"
                  style={{
                    color: isDark ? '#E8C872' : '#C98A1C',
                    fontFamily:
                      'var(--font-heading), Plus Jakarta Sans, system-ui, sans-serif',
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  Privacy Policy padhein
                  <span
                    className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>

                {/* Action buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-2.5">
                  <button
                    onClick={handleDecline}
                    className="btn-luxury-secondary btn-luxury-sm flex-1"
                    aria-label="Decline data consent"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAccept}
                    className="btn-luxury-primary btn-luxury-sm flex-1"
                    aria-label="Agree to data consent and continue"
                  >
                    Agree &amp; Continue
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : consentState === 'declined' ? (
        /* ── Minimal declined banner ── */
        <motion.div
          key="consent-banner"
          className="fixed bottom-4 left-4 right-4 z-[9999] sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm"
          initial={{ y: 24, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.96 }}
          transition={{
            type: 'spring',
            damping: 28,
            stiffness: 300,
            mass: 0.7,
          }}
        >
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{
              backgroundColor: isDark
                ? 'rgba(2, 30, 41, 0.85)'
                : 'rgba(238, 217, 190, 0.90)',
              backdropFilter: 'blur(20px) saturate(1.3)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
              boxShadow: isDark
                ? '0 12px 40px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset'
                : '0 12px 40px -8px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04) inset',
            }}
            role="status"
            aria-label="Data consent declined banner"
          >
            <ShieldIcon
              className={`flex-shrink-0 w-4 h-4 ${isDark ? 'text-[#E8C872]' : 'text-[#C98A1C]'}`}
            />
            <p
              className="text-xs sm:text-sm flex-1"
              style={{
                color: isDark ? '#D7C2A5' : '#D7C2A5',
              }}
            >
              You&apos;ve declined data consent. Some features may be limited.{' '}
              <Link
                href="/privacy-policy"
                className="font-semibold underline underline-offset-2 decoration-current"
                style={{
                  color: isDark ? '#E8C872' : '#C98A1C',
                }}
              >
                Privacy Policy →
              </Link>
            </p>
            <button
              onClick={handleAccept}
              className="btn-luxury-primary btn-luxury-sm shrink-0 text-xs"
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
