'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Settings, CreditCard, Bell, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ElasticToggle from './ElasticToggle';

export default function PolicyDashboardSection() {
  const [autoPay, setAutoPay] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  }, []);

  return (
    <section id="policy-dashboard" className="py-16 sm:py-24 bg-background scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-10">
          <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800 rounded-full px-4 py-1">
            <Settings className="w-3.5 h-3.5 mr-1" />Dashboard
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            Your Policy <span className="text-teal-700 dark:text-[#00A9A6]">Settings</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">Manage your policy preferences — toggle auto-pay, alerts, and more</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Active Policy Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <Card className="rounded-3xl border-2 border-[#00A9A6]/20 hover:border-[#00A9A6]/40 transition-colors h-full">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A9A6] to-teal-600 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-base">Active Policy</CardTitle>
                <CardDescription className="text-xs">Health Shield Pro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { l: 'Policy No.', v: 'PS-2025-8842' },
                  { l: 'Premium', v: '₹5,500/mo' },
                  { l: 'Next Due', v: '15 Mar 2025' },
                ].map((item) => (
                  <div key={item.l} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{item.l}</span>
                    <span className="font-semibold">{item.v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800 rounded-full text-[10px] px-2">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Toggle Settings Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Card className="rounded-3xl h-full">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A9A6] to-teal-600 flex items-center justify-center mb-3">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-base">Quick Settings</CardTitle>
                <CardDescription className="text-xs">Toggle features on/off</CardDescription>
              </CardHeader>
              <CardContent>
                <ElasticToggle
                  label="Auto-Pay (Monthly Premium)"
                  description="Automatically deduct premium"
                  defaultOn={true}
                  onChange={(val) => { setAutoPay(val); showToast(val ? 'Auto-pay enabled ✅' : 'Auto-pay disabled'); }}
                />
                <div className="border-t border-border/40 my-1" />
                <ElasticToggle
                  label="SMS Alerts for Claim Status"
                  description="Get SMS updates on claims"
                  defaultOn={false}
                  onChange={(val) => { setSmsAlerts(val); showToast(val ? 'SMS alerts enabled 📱' : 'SMS alerts off'); }}
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    {autoPay ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                    <span className={autoPay ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>Auto-pay {autoPay ? 'active' : 'inactive'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {smsAlerts ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <AlertCircle className="w-3.5 h-3.5 text-slate-400" />}
                    <span className={smsAlerts ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>SMS alerts {smsAlerts ? 'on' : 'off'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Card className="rounded-3xl h-full">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <CardDescription className="text-xs">Latest transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { date: '15 Feb', desc: 'Premium paid', amount: '₹5,500' },
                  { date: '15 Jan', desc: 'Premium paid', amount: '₹5,500' },
                  { date: '02 Jan', desc: 'Claim #2841 settled', amount: '₹12,400' },
                  { date: '15 Dec', desc: 'Premium paid', amount: '₹5,500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <div>
                        <p className="text-xs font-medium">{item.desc}</p>
                        <p className="text-[10px] text-muted-foreground">{item.date} 2025</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold">{item.amount}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-foreground text-background dark:bg-[#0A2540] dark:text-white border border-transparent dark:border-[#00A9A6]/30 px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-2"
          >
            <Bell className="w-4 h-4 text-[#00A9A6]" />
            {toastMsg}
          </motion.div>
        )}
      </div>
    </section>
  );
}
