"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Hides its children whenever the user is on /admin/* routes.
 *
 * Use this to wrap site-wide floating widgets (FloatingChatBot, WhatsAppFAB,
 * ScrollProgress, etc.) that should NOT appear in the admin dashboard.
 */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Defer the mount flag via rAF so setState never fires synchronously
  // inside the effect body (react-hooks/set-state-in-effect).
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (mounted && pathname?.startsWith("/admin")) {
    return null;
  }
  return <>{children}</>;
}
