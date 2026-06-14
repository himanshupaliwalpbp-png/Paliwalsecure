'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Check if already installed (runs once on mount)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if app is already in standalone mode (installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }
  }, []);

  // Show prompt after deferredPrompt becomes available (with delay)
  useEffect(() => {
    if (!deferredPrompt || isInstalled) return;

    // Check if user dismissed the prompt recently
    const dismissedAt = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      // Don't show again for 48 hours after dismissal
      if (hoursSinceDismissed < 48) return;
    }

    // Show prompt after 8 seconds
    const showTimer = setTimeout(() => {
      setShowPrompt(true);
    }, 8000);

    return () => clearTimeout(showTimer);
  }, [deferredPrompt, isInstalled]);

  // Listen for the beforeinstallprompt event
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch {
      // Prompt failed
    } finally {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  }, []);

  // Don't render if already installed or no prompt available
  if (isInstalled || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-[55] max-w-[320px]"
        >
          <div
            className="relative rounded-2xl border border-[#C98A1C]/25 p-4 shadow-2xl backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, #0A1330 0%, #1A2D50 100%)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 20px rgba(201,138,28,0.1)',
            }}
          >
            {/* Gold accent line */}
            <div
              className="absolute top-0 left-4 right-4 h-px rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(201,138,28,0.5), transparent)',
              }}
            />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
              aria-label="Dismiss install prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Content */}
            <div className="flex items-start gap-3 pr-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center shrink-0 shadow-md shadow-[#C98A1C]/20">
                <Smartphone className="w-5 h-5 text-[#0A1330]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white mb-1">Install Paliwal Secure</h3>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Add to home screen for quick access — works offline, loads faster!
                </p>
              </div>
            </div>

            {/* Install Button */}
            <Button
              onClick={handleInstall}
              className="w-full mt-3 h-9 bg-gradient-to-r from-[#C98A1C] to-[#E0A830] hover:from-[#E0A830] hover:to-[#C98A1C] text-[#0A1330] text-xs font-bold rounded-xl shadow-md shadow-[#C98A1C]/20"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Install App
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
