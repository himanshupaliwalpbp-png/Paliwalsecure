'use client';

import { useEffect, useState } from 'react';
import GoogleAnalytics from '@/components/GoogleAnalytics';

// Hardcoded fallback — ensures GA always loads even if DB setting is missing
const FALLBACK_GA_ID = 'G-WTQDXFZC5F';

export default function GAProvider() {
  const [gaId, setGaId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the GA Measurement ID from public settings API
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.ga_measurement_id) {
          setGaId(data.settings.ga_measurement_id);
        } else {
          // Use fallback if DB doesn't have the setting
          setGaId(FALLBACK_GA_ID);
        }
      })
      .catch(() => {
        // Silently fail but still use fallback — GA is non-critical but should load
        setGaId(FALLBACK_GA_ID);
      });
  }, []);

  if (!gaId) return null;

  return <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />;
}
