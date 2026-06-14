'use client';

import { motion } from 'framer-motion';
import { Shield, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const insurers = [
  { name: 'HDFC ERGO', csr: 98, color: '#0047AB' },
  { name: 'Star Health', csr: 95, color: '#E31937' },
  { name: 'Acko', csr: 92, color: '#6C3AED' },
  { name: 'ICICI Lombard', csr: 96, color: '#F37021' },
  { name: 'LIC', csr: 98, color: '#006341' },
  { name: 'Bajaj Allianz', csr: 94, color: '#00529B' },
];

export default function HoverRevealTrustBadges() {
  return (
    <section id="trust-badges" className="py-16 sm:py-20 bg-background scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800 rounded-full px-4 py-1">
            <Award className="w-3.5 h-3.5 mr-1" />Trusted Partners
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Our Insurance <span className="text-teal-700 dark:text-[#00A9A6]">Partners</span></h2>
          <p className="mt-3 text-sm text-muted-foreground">Hover over each insurer to see their claim settlement ratio</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {insurers.map((ins, i) => (
            <motion.div key={ins.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group relative">
              {/* Tooltip — Pure CSS */}
              <div className="trust-badge-tooltip absolute -top-14 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                <div className="bg-foreground text-background dark:bg-[#0A2540] dark:text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xl whitespace-nowrap flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-[#00A9A6]" />Claim Settlement: {ins.csr}%
                </div>
                <div className="w-3 h-3 bg-foreground dark:bg-[#0A2540] rotate-45 mx-auto -mt-1.5" />
              </div>

              {/* Card */}
              <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border border-border/50 bg-card hover:border-[#00A9A6]/30 hover:shadow-lg hover:shadow-[#00A9A6]/5 transition-all duration-300 cursor-default min-h-[120px]">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110" style={{ backgroundColor: ins.color + '15' }}>
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-500" style={{ color: ins.color }} />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center leading-tight">{ins.name}</p>
                <div className="w-full mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: ins.color }} initial={{ width: 0 }} whileInView={{ width: `${ins.csr}%` }} viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{ins.csr}% CSR</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">Average Claim Settlement Ratio: <span className="font-bold text-teal-700 dark:text-[#00A9A6]">{Math.round(insurers.reduce((a, b) => a + b.csr, 0) / insurers.length)}%</span> — Based on IRDAI 2023-24 Annual Report</p>
        </motion.div>
      </div>
    </section>
  );
}
