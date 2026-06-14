'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Car, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ElasticToggle from './ElasticToggle';
import { FormCharacterWithAutoMood } from './FormCharacter3D';

export default function QuoteFormSection() {
  const [roadsideAssist, setRoadsideAssist] = useState(false);

  const baseQuote = 5500;
  const roadsideCost = 199;
  const totalQuote = roadsideAssist ? baseQuote + roadsideCost : baseQuote;

  return (
    <section id="quote-form" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-background dark:from-[#0c1322] dark:via-[#111b33] dark:to-background scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800 rounded-full px-4 py-1">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Get Your AI Plan
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground dark:text-white tracking-tight">
            Instant Health Insurance{' '}
            <span className="text-teal-700 dark:text-[#00A9A6]">Quote</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            AI-calculated premium based on your needs — add roadside assistance with a single toggle
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* 3D Character — left side */}
          <div className="lg:col-span-2 flex justify-center lg:items-center lg:pt-8 mb-4 lg:mb-0">
            <FormCharacterWithAutoMood
              formStage={roadsideAssist ? 2 : 1}
              hasResult={false}
              size="md"
              className="scale-105"
            />
          </div>
          {/* Left: Quote Card */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5">
            <Card className="bg-white/80 border-slate-200/60 shadow-sm backdrop-blur-xl dark:bg-white/10 dark:border-white/20 rounded-3xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00A9A6] to-teal-600 flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground dark:text-white text-lg">Health Shield Pro</CardTitle>
                    <CardDescription className="text-muted-foreground text-xs">Comprehensive coverage for you & family</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  {[
                    'Hospitalization cover up to ₹10 Lakh',
                    'Pre & Post hospitalization',
                    'Day care procedures',
                    'Ambulance charges covered',
                    'No room rent capping',
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-700 dark:text-[#00A9A6] shrink-0" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Elastic Toggle — Roadside Assistance */}
                <div className="border-t border-slate-200/60 dark:border-white/10 pt-4">
                  <ElasticToggle
                    label="Include Roadside Assistance (+₹199/month)"
                    description="24/7 emergency roadside support anywhere in India"
                    onChange={setRoadsideAssist}
                  />
                </div>

                {/* Price Display */}
                <div className="border-t border-slate-200/60 dark:border-white/10 pt-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Monthly Premium</p>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={totalQuote}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="text-3xl sm:text-4xl font-extrabold text-foreground dark:text-white mt-1"
                        >
                          ₹{totalQuote.toLocaleString('en-IN')}
                          <span className="text-sm font-normal text-muted-foreground">/month</span>
                        </motion.p>
                      </AnimatePresence>
                      {roadsideAssist && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-teal-700 dark:text-[#00A9A6] mt-1">
                          Includes ₹199 roadside assistance
                        </motion.p>
                      )}
                    </div>
                    <Button className="bg-gradient-to-r from-[#00A9A6] to-teal-500 hover:from-[#00A9A6] hover:to-teal-600 text-white rounded-full px-6 font-semibold shadow-lg shadow-[#00A9A6]/25">
                      Get Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Breakdown Card */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5">
            <Card className="bg-white/80 border-slate-200/60 dark:bg-white/10 dark:border-white/20 backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-foreground dark:text-white text-lg">Premium Breakdown</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">See exactly what you&apos;re paying for</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Base Health Premium', amount: baseQuote, highlight: false },
                  ...(roadsideAssist ? [{ label: 'Roadside Assistance', amount: roadsideCost, highlight: true }] : []),
                  { label: 'GST (18%)', amount: Math.round(totalQuote * 0.18), highlight: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 dark:border-white/5 last:border-0">
                    <span className={`text-sm ${item.highlight ? 'text-teal-700 dark:text-[#00A9A6] font-medium' : 'text-muted-foreground'}`}>{item.label}</span>
                    <span className={`text-sm font-semibold ${item.highlight ? 'text-teal-700 dark:text-[#00A9A6]' : 'text-foreground dark:text-white'}`}>₹{item.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t border-border dark:border-white/20">
                  <span className="text-base font-bold text-foreground dark:text-white">Total (incl. GST)</span>
                  <span className="text-lg font-extrabold text-teal-700 dark:text-[#00A9A6]">₹{Math.round(totalQuote * 1.18).toLocaleString('en-IN')}</span>
                </div>
              </CardContent>
            </Card>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { icon: Shield, label: 'Sum Insured', value: '₹10 Lakh' },
                { icon: Car, label: 'Roadside', value: roadsideAssist ? 'Included' : 'Add ₹199' },
              ].map((info) => (
                <Card key={info.label} className="bg-white/80 border-slate-200/60 dark:bg-white/10 dark:border-white/20 rounded-2xl p-4">
                  <info.icon className="w-5 h-5 text-teal-700 dark:text-[#00A9A6] mb-2" />
                  <p className="text-xs text-muted-foreground">{info.label}</p>
                  <p className="text-sm font-semibold text-foreground dark:text-white">{info.value}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
