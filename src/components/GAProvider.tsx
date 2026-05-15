'use client';

import { useEffect, useState } from 'react';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export default function GAProvider() {
  const [gaId, setGaId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the GA Measurement ID from public settings API
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.ga_measurement_id) {
          setGaId(data.settings.ga_measurement_id);
        }
      })
      .catch(() => {
        // Silently fail — GA is non-critical
      });
  }, []);

  if (!gaId) return null;

  return <GoogleAnalytics GA_MEASUREMENT_ID={gaId} />;
}
