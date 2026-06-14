'use client';

import { useSafeTheme } from '@/lib/safe-theme-provider';
import { useSyncExternalStore } from 'react';

/**
 * Hook to detect dark/light mode with hydration safety.
 * Now uses useSafeTheme internally which guarantees resolvedTheme
 * is always 'dark' | 'light', never undefined.
 *
 * Usage:
 *   const { isDark, mounted, resolvedTheme } = useThemeAware();
 *   // isDark is safe to use immediately (no hydration mismatch)
 *   // resolvedTheme is always 'dark' | 'light'
 */
export function useThemeAware() {
  const { resolvedTheme } = useSafeTheme();

  // Keep mounted for backward compatibility with consumers that use it
  const mounted = useSyncExternalStore(
    (onStoreChange) => {
      // Subscribe to nothing — just signal that we're on the client
      return () => {};
    },
    () => true,  // Client value
    () => false, // Server value
  );

  // useSafeTheme ensures resolvedTheme is always 'dark' | 'light',
  // so no need for the !mounted guard in isDark
  const isDark = resolvedTheme !== 'light';

  return { isDark, mounted, resolvedTheme };
}
