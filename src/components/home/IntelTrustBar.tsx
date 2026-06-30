'use client';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * IntelTrustBar — Design Bible v9.0 Trust Bar Section
 * ═══════════════════════════════════════════════════════════════════════════
 * Per Blueprint Section 2:
 *   - 120px height, full-width band
 *   - Single row of 6 partner insurer logos in monochrome
 *   - Background: slightly lighter than hero (#0F1729)
 *   - Logos: grayscale 60% opacity, hover to 100% + slight scale
 */

import { motion } from 'framer-motion';

const INSURER_LOGOS = [
  { name: 'LIC', display: 'LIC' },
  { name: 'HDFC Ergo', display: 'HDFC ERGO' },
  { name: 'ICICI Lombard', display: 'ICICI Lombard' },
  { name: 'Star Health', display: 'Star Health' },
  { name: 'Bajaj Allianz', display: 'Bajaj Allianz' },
  { name: 'Tata AIG', display: 'TATA AIG' },
];

export default function IntelTrustBar() {
  return (
    <section className="intel-trust-bar">
      <div className="intel-container">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="intel-label-sage text-center">
            POWERED BY 51+ TRUSTED INSURERS
          </div>

          <div className="intel-trust-bar-logos w-full">
            {INSURER_LOGOS.map((logo) => (
              <div
                key={logo.name}
                className="intel-trust-bar-logo"
                title={logo.name}
              >
                {logo.display}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
