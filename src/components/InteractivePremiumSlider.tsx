'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ShieldCheck, Heart, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';

const COVERAGE_MIN = 500000;
const COVERAGE_MAX = 10000000;
const BASE_PREMIUM = 450;
const BASE_COVERAGE = 1000000;

function fmtCurrency(amt: number) {
  if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)} Crore`;
  if (amt >= 100000) return `₹${(amt / 100000).toFixed(amt % 100000 === 0 ? 0 : 1)} Lakh`;
  return `₹${amt.toLocaleString('en-IN')}`;
}

function getTier(c: number) {
  if (c <= 3000000) return { tier: 'Basic', color: '#64748B', emoji: '🥉' };
  if (c <= 7000000) return { tier: 'Standard', color: '#00A9A6', emoji: '🥈' };
  return { tier: 'Premium', color: '#F59E0B', emoji: '🥇' };
}

export default function InteractivePremiumSlider() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const [coverage, setCoverage] = useState(5000000);
  const premium = useMemo(() => Math.round(BASE_PREMIUM * (coverage / BASE_COVERAGE)), [coverage]);
  const yearlyPremium = useMemo(() => premium * 12, [premium]);
  const tier = useMemo(() => getTier(coverage), [coverage]);
  const pct = ((coverage - COVERAGE_MIN) / (COVERAGE_MAX - COVERAGE_MIN)) * 100;

  return (
    <section id="premium-slider" className="py-16 sm:py-24 bg-background scroll-mt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800 rounded-full px-4 py-1">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" />{isHindi ? 'प्रीमियम कैलकुलेटर' : 'Premium Calculator'}
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">{isHindi ? 'हेल्थ इंश्योरेंस' : 'Health Insurance'} — <span className="text-teal-700 dark:text-[#00A9A6]">{isHindi ? 'कवरेज चुनें' : 'Choose Coverage'}</span></h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">{isHindi ? 'स्लाइड करें अपनी कवरेज राशि चुनने के लिए और रियल-टाइम में मासिक प्रीमियम देखें' : isEnglish ? 'Slide to pick your coverage amount and see your monthly premium in real-time' : 'Slide to pick your coverage amount and see your monthly premium in real-time'}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="rounded-3xl overflow-hidden border-2 border-slate-200/60 dark:border-white/10 hover:border-[#00A9A6]/30 dark:hover:border-[#00A9A6]/40 transition-colors">
            <CardHeader className="pb-2" style={{ background: `linear-gradient(135deg, ${tier.color}08, ${tier.color}03)` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}CC)` }}>
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{isHindi ? 'हेल्थ कवरेज सिलेक्टर' : 'Health Coverage Selector'}</CardTitle>
                    <CardDescription className="text-xs">{isHindi ? 'कवरेज एडजस्ट करें प्रीमियम देखने के लिए' : 'Adjust coverage to see premium'}</CardDescription>
                  </div>
                </div>
                <Badge className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: tier.color + '20', color: tier.color, borderColor: tier.color + '40' }}>{tier.emoji} {tier.tier}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">{isHindi ? 'कवरेज राशि' : 'Coverage Amount'}</p>
                <motion.p key={coverage} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} className="text-4xl sm:text-5xl font-extrabold" style={{ color: tier.color }}>{fmtCurrency(coverage)}</motion.p>
              </div>

              {/* Slider */}
              <div className="premium-slider px-2">
                <input
                  type="range" min={COVERAGE_MIN} max={COVERAGE_MAX} step={100000} value={coverage}
                  onChange={(e) => setCoverage(Number(e.target.value))}
                  style={{ '--slider-pct': `${pct}%` } as React.CSSProperties}
                  aria-label="Coverage amount"
                />
                <div className="flex justify-between mt-3 px-1">
                  {['₹5L', '₹25L', '₹50L', '₹75L', '₹1Cr'].map((l, i) => <span key={i} className="text-[10px] text-muted-foreground font-medium">{l}</span>)}
                </div>
              </div>

              {/* Premium Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-2xl bg-muted/50">
                  <div className="flex items-center justify-center gap-1.5 mb-1"><Zap className="w-4 h-4 text-teal-700 dark:text-[#00A9A6]" /><p className="text-xs text-muted-foreground uppercase tracking-wider">{isHindi ? 'मासिक' : 'Monthly'}</p></div>
                  <motion.p key={premium} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-white">₹{premium.toLocaleString('en-IN')}</motion.p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-muted/50">
                  <div className="flex items-center justify-center gap-1.5 mb-1"><ShieldCheck className="w-4 h-4 text-[#0A2540] dark:text-[#00A9A6]" /><p className="text-xs text-muted-foreground uppercase tracking-wider">{isHindi ? 'वार्षिक' : 'Yearly'}</p></div>
                  <motion.p key={yearlyPremium} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} className="text-2xl sm:text-3xl font-extrabold text-foreground dark:text-white">₹{yearlyPremium.toLocaleString('en-IN')}</motion.p>
                </div>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[500000, 3000000, 5000000, 7500000, 10000000].map((v) => (
                  <button key={v} onClick={() => setCoverage(v)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${coverage === v ? 'border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-700 dark:bg-teal-950/50 dark:text-teal-300' : 'border-border dark:border-white/10 hover:border-[#00A9A6]/40 text-muted-foreground dark:text-muted-foreground'}`}>
                    {fmtCurrency(v)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
