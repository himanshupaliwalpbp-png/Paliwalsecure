'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, X } from 'lucide-react';

type ConnectionState = 'online' | 'offline' | null;

export default function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionState>(null);
  const [visible, setVisible] = useState(false);
  const initialCheckDone = useRef(false);

  const handleOnline = useCallback(() => {
    setStatus('online');
    setVisible(true);
  }, []);

  const handleOffline = useCallback(() => {
    setStatus('offline');
    setVisible(true);
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial status if already offline — use microtask to avoid synchronous setState in effect
    if (!initialCheckDone.current) {
      initialCheckDone.current = true;
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        // Schedule outside the effect's synchronous execution
        queueMicrotask(() => {
          setStatus('offline');
          setVisible(true);
        });
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Auto-dismiss online status after 3 seconds
  useEffect(() => {
    if (visible && status === 'online') {
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, status]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <AnimatePresence>
      {visible && status && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-[4.5rem] left-1/2 -translate-x-1/2 z-[55] w-[90%] max-w-md"
        >
          <div
            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-xl ${
              status === 'offline'
                ? 'bg-red-50/90 dark:bg-red-950/80 border-red-200 dark:border-red-800'
                : 'bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {status === 'offline' ? (
              <WifiOff className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" />
            ) : (
              <Wifi className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
            )}
            <p
              className={`text-sm font-medium flex-1 ${
                status === 'offline'
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {status === 'offline'
                ? "You're offline — some features may not work"
                : 'Back online!'}
            </p>
            <button
              onClick={handleDismiss}
              className={`p-1 rounded-full transition-colors flex-shrink-0 ${
                status === 'offline'
                  ? 'hover:bg-red-100 dark:hover:bg-red-900/50'
                  : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
              }`}
              aria-label="Dismiss connection status"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
