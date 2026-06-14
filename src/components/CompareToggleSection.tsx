'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, Users, User, CheckCircle2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ElasticToggle from './ElasticToggle';

export default function CompareToggleSection() {
  const [isFamily, setIsFamily] = useState(false);

  const individual = { title: 'Individual Plan', price: 6200, icon: User, color: '#0A2540', features: ['Cover for 1 person', 'Sum insured up to ₹5 Lakh', 'Cashless at 8,000+ hospitals', 'Pre-existing diseases after 2 yrs', 'Free health check-up yearly'] };
  const family = { title: 'Family Floater', subtitle: 'Self + Spouse + 2 Kids', price: 11500, icon: Users, color: '#00A9A6', features: ['Cover for 4 family members', 'Sum insured up to ₹10 Lakh (shared)', 'Cashless at 12,000+ hospitals', 'Maternity benefit included', 'Free health check-up for all', 'Child vaccination cover'] };

  const current = isFamily ? family : individual;
  const Icon = current.icon;

  return (
    <section id="compare-toggle" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/50 scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-10">
          <Badge className="mb-4 bg-[#0A2540]/10 text-[#0A2540] dark:bg-[#00A9A6]/20 dark:text-[#00A9A6] border-[#0A2540]/20 dark:border-[#00A9A6]/30 rounded-full px-4 py-1">
            <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />Compare Plans
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            Compare: Individual vs <span className="text-teal-700 dark:text-[#00A9A6]">Family Floater</span>
          </h2>
        </motion.div>

        {/* Toggle Switch */}
        <div className="max-w-md mx-auto mb-10">
          <Card className="rounded-2xl p-4 shadow-md border-2 hover:border-[#00A9A6]/30 transition-colors">
            <ElasticToggle
              label={isFamily ? 'Family Floater (Self+Spouse+2 kids)' : 'Individual Plan'}
              description="Toggle to switch between plans"
              onChange={setIsFamily}
            />
          </Card>
        </div>

        {/* Plan Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isFamily ? 'family' : 'individual'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-lg mx-auto"
          >
            <Card className="rounded-3xl overflow-hidden border-2" style={{ borderColor: current.color + '40' }}>
              <CardHeader className="pb-4" style={{ background: `linear-gradient(135deg, ${current.color}15, ${current.color}05)` }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${current.color}, ${current.color}CC)` }}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{current.title}</CardTitle>
                    {isFamily && family.subtitle && <CardDescription className="text-xs">{family.subtitle}</CardDescription>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="text-center py-4 rounded-2xl" style={{ background: `${current.color}08` }}>
                  <AnimatePresence mode="wait">
                    <motion.div key={current.price} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.35 }}>
                      <p className="text-4xl sm:text-5xl font-extrabold" style={{ color: current.color }}>₹{current.price.toLocaleString('en-IN')}</p>
                      <p className="text-sm text-muted-foreground mt-1">/year</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="space-y-2">
                  {current.features.map((f, i) => (
                    <motion.div key={f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: current.color }} />
                      <span className="text-sm">{f}</span>
                    </motion.div>
                  ))}
                </div>
                {isFamily && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#00A9A6]/10 rounded-xl p-3 text-center">
                    <p className="text-xs text-teal-700 dark:text-[#00A9A6] font-medium">Just ₹{Math.round(11500 / 12).toLocaleString('en-IN')}/month — ₹{Math.round(11500 / 4).toLocaleString('en-IN')} per person/year</p>
                  </motion.div>
                )}
                <Button className="w-full rounded-full font-semibold text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${current.color}, ${current.color}CC)` }}>
                  <Sparkles className="w-4 h-4 mr-1" />Get This Plan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Quick comparison */}
        <div className="mt-10 grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {[{ l: 'Individual', p: '₹6,200/yr', a: !isFamily }, { l: 'Family (4)', p: '₹11,500/yr', a: isFamily }].map((plan) => (
            <button key={plan.l} onClick={() => setIsFamily(plan.l === 'Family (4)')} className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 ${plan.a ? 'border-[#00A9A6] bg-[#00A9A6]/10 shadow-lg' : 'border-border hover:border-[#00A9A6]/30'}`}>
              <p className={`text-sm font-semibold ${plan.a ? 'text-teal-700 dark:text-[#00A9A6]' : 'text-muted-foreground'}`}>{plan.l}</p>
              <p className={`text-lg font-bold mt-1 ${plan.a ? '' : 'text-muted-foreground'}`}>{plan.p}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
