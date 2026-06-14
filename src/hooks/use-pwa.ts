'use client';

import { useEffect } from 'react';

export function usePWA() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    // Register service worker
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        // Check for updates periodically using a less aggressive interval
        // and only when the page is visible
        let updateInterval: ReturnType<typeof setInterval> | null = null;

        const scheduleUpdates = () => {
          if (updateInterval) clearInterval(updateInterval);
          updateInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
              registration.update();
            }
          }, 60 * 60 * 1000); // Every hour
        };

        // Only start update checks when page is visible
        if (document.visibilityState === 'visible') {
          scheduleUpdates();
        }

        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            scheduleUpdates();
          } else if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;
          }
        });

        console.log('[PWA] Service Worker registered:', registration.scope);
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    };

    // Defer registration to idle time to avoid blocking rendering
    if ('requestIdleCallback' in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
        registerSW();
      });
    } else if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
    }
  }, []);
}
