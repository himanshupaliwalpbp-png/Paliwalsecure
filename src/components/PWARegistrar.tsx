'use client';

import { useEffect } from 'react';

export function PWARegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        console.log('[PWA] Service Worker registered:', registration.scope);
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    };

    // Defer registration to idle time to avoid blocking rendering
    const scheduleRegistration = () => {
      if ('requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
          registerSW();
        });
      } else {
        // Fallback: register after page load
        if (document.readyState === 'complete') {
          registerSW();
        } else {
          window.addEventListener('load', registerSW);
        }
      }
    };

    scheduleRegistration();
  }, []);

  return null;
}
