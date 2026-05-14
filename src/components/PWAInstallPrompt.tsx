'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GAEvents } from '@/lib/ga-events';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const VISIT_COUNT_KEY = 'paliwal_visit_count';
const DISMISSED_KEY = 'paliwal_install_dismissed';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// Detect iOS Safari once at module level (safe for client-only)
function getIsIOS(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOSDevice = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  const isStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
  return isIOSDevice && isSafari && !isStandalone;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS] = useState(getIsIOS);
  const visitCounted = useRef(false);

  // Check if banner should be shown (reads localStorage only)
  const shouldShowBanner = useCallback(() => {
    if (typeof window === 'undefined') return false;

    // Check if already dismissed recently
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < THIRTY_DAYS_MS) return false;
    }

    // Check visit count — show only on 2nd visit or later
    const visitCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
    return visitCount >= 2;
  }, []);

  useEffect(() => {
    // Increment visit count (side-effect on external storage, not React state)
    if (!visitCounted.current) {
      visitCounted.current = true;
      const currentCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
      localStorage.setItem(VISIT_COUNT_KEY, String(currentCount + 1));
    }

    // Listen for beforeinstallprompt (Chrome/Edge/Android)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if we should show the banner (schedule after mount to avoid sync setState)
    if (shouldShowBanner()) {
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [shouldShowBanner]);

  const handleInstallClick = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        GAEvents.pwaInstallAccept();
        setDeferredPrompt(null);
        setShowBanner(false);
      } else {
        GAEvents.pwaInstallDismiss();
      }
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    GAEvents.pwaInstallDismiss();
    setShowBanner(false);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  }, []);

  // Don't render if not showing
  if (!showBanner) return null;

  // iOS Safari — show manual instructions
  const showIOSInstructions = isIOS && !deferredPrompt;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[60] max-w-md mx-auto sm:mx-0"
        >
          <div className="relative rounded-2xl border border-white/20 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl p-5">
            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Dismiss install prompt"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>

            {showIOSInstructions ? (
              /* iOS Safari Instructions */
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Install Paliwal Secure</h3>
                    <p className="text-xs text-muted-foreground">Add to Home Screen for quick access</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <Share className="w-5 h-5 text-blue-500" />
                    </div>
                    <p>
                      <span className="font-medium text-foreground">Step 1:</span> Tap the{' '}
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
                        <Share className="w-4 h-4" /> Share
                      </span>{' '}
                      button at the bottom of Safari
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <Plus className="w-5 h-5 text-amber-500" />
                    </div>
                    <p>
                      <span className="font-medium text-foreground">Step 2:</span> Scroll down and tap{' '}
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <Plus className="w-4 h-4" /> Add to Home Screen
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard Install Prompt (Chrome/Edge/Android) */
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-sm">Install Paliwal Secure</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Quick access, works offline</p>
                </div>
                <Button
                  onClick={handleInstallClick}
                  className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full px-4 text-xs font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
                >
                  Install
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
