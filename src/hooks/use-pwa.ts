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

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Every hour

        console.log('[PWA] Service Worker registered:', registration.scope);
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    };

    // Register after page load for better performance
    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
    }
  }, []);
}
