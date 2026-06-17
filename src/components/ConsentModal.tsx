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
        /* ── Non-blocking bottom consent banner (does NOT cover page content) ── */
        <motion.div
          key="consent-banner-undecided"
          className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center p-3 sm:p-4 pointer-events-none"
          role="dialog"
          aria-modal="false"
          aria-label="Data Consent — DPDP Act 2023"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 320,
            mass: 0.7,
          }}
        >
          <div
            className="pointer-events-auto relative w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{
              backgroundColor: isDark
                ? 'rgba(15, 23, 42, 0.92)'
                : 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(24px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
              boxShadow: isDark
                ? '0 -12px 48px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.08) inset'
                : '0 -12px 48px -12px rgba(20, 15, 10, 0.18), 0 0 0 1px rgba(15,19,32,0.06) inset',
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

            <div className="px-4 py-3.5 sm:px-6 sm:py-4">
              {/* Shield icon + Title + body — compact row on desktop, stacked on mobile */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg"
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
                <div className="flex-1 min-w-0">
                  <h2
                    className="font-[family-name:var(--font-heading)] text-sm sm:text-base font-bold leading-snug mb-1"
                    style={{
                      color: isDark ? '#F1F5F9' : '#0F172A',
                    }}
                  >
                    Data Consent — DPDP Act 2023
                  </h2>
                  <p
                    className="text-[12px] sm:text-[13px] leading-relaxed"
                    style={{
                      color: isDark ? '#94A3B8' : '#64748B',
                      fontFamily:
                        'var(--font-sans), Inter, system-ui, sans-serif',
                    }}
                  >
                    Paliwal Secure aapka naam/email sirf insurance services ke liye
                    use karega. Data third party ko nahi becha jayega.{' '}
                    <Link
                      href="/privacy-policy"
                      className="font-semibold underline underline-offset-2 decoration-current"
                      style={{
                        color: isDark ? '#E8C872' : '#C98A1C',
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2.5">
                <button
                  onClick={handleDecline}
                  className="btn-luxury-secondary btn-luxury-sm flex-1"
                  aria-label="Decline data consent"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  className="btn-luxury-primary btn-luxury-sm flex-[1.4]"
                  aria-label="Agree to data consent and continue"
                >
                  Agree &amp; Continue
                </button>
              </div>
            </div>
          </div>
        </motion.div>
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
                ? 'rgba(15, 23, 42, 0.85)'
                : 'rgba(255, 255, 255, 0.90)',
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
                color: isDark ? '#94A3B8' : '#64748B',
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
