'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';

/**
 * SafeThemeProvider wraps next-themes ThemeProvider to ensure
 * resolvedTheme never returns undefined during the first client render.
 *
 * The `useSafeTheme` hook should be used instead of `useTheme` from next-themes
 * to guarantee `resolvedTheme` is always 'dark' | 'light', never undefined.
 */

interface SafeThemeContextValue {
  resolvedTheme: 'dark' | 'light';
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

const SafeThemeContext = createContext<SafeThemeContextValue>({
  resolvedTheme: 'dark',
  theme: undefined,
  setTheme: () => {},
});

export function SafeThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SafeThemeContextWrapper>{children}</SafeThemeContextWrapper>
    </NextThemesProvider>
  );
}

function SafeThemeContextWrapper({ children }: { children: ReactNode }) {
  const { resolvedTheme, theme, setTheme } = useNextTheme();

  const value = useMemo<SafeThemeContextValue>(() => ({
    // If resolvedTheme is undefined (before next-themes reads localStorage),
    // default to 'dark' to match our defaultTheme="dark"
    resolvedTheme: (resolvedTheme === 'light' ? 'light' : 'dark') as 'dark' | 'light',
    theme,
    setTheme,
  }), [resolvedTheme, theme, setTheme]);

  return (
    <SafeThemeContext.Provider value={value}>
      {children}
    </SafeThemeContext.Provider>
  );
}

/**
 * useSafeTheme — Drop-in replacement for useTheme() from next-themes.
 * Guaranteed to return resolvedTheme as 'dark' | 'light' (never undefined).
 */
export function useSafeTheme(): SafeThemeContextValue {
  return useContext(SafeThemeContext);
}
