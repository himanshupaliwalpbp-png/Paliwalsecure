'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Heart, Car, UserCheck, IndianRupee, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';

const HealthPremiumCalculator = dynamic(() => import('@/components/calculators/HealthPremiumCalculator'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
    </div>
  ),
});
const MotorPremiumCalculator = dynamic(() => import('@/components/calculators/MotorPremiumCalculator'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
    </div>
  ),
});
const TermLifeCalculator = dynamic(() => import('@/components/calculators/TermLifeCalculator'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
    </div>
  ),
});
const TaxSavingsCalculator = dynamic(() => import('@/components/calculators/TaxSavingsCalculator'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
    </div>
  ),
});
const ClaimSettlementPredictor = dynamic(() => import('@/components/calculators/ClaimSettlementPredictor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
    </div>
  ),
});

export default function CalculatorSection() {
  const [activeTab, setActiveTab] = useState('health');

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="health" className="text-xs sm:text-sm py-2 gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Heart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Health</span>
          </TabsTrigger>
          <TabsTrigger value="motor" className="text-xs sm:text-sm py-2 gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Car className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Motor</span>
          </TabsTrigger>
          <TabsTrigger value="term" className="text-xs sm:text-sm py-2 gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Term</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="text-xs sm:text-sm py-2 gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <IndianRupee className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tax</span>
          </TabsTrigger>
          <TabsTrigger value="claim" className="text-xs sm:text-sm py-2 gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Claim</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="mt-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <HealthPremiumCalculator />
          </motion.div>
        </TabsContent>

        <TabsContent value="motor" className="mt-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <MotorPremiumCalculator />
          </motion.div>
        </TabsContent>

        <TabsContent value="term" className="mt-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <TermLifeCalculator />
          </motion.div>
        </TabsContent>

        <TabsContent value="tax" className="mt-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <TaxSavingsCalculator />
          </motion.div>
        </TabsContent>

        <TabsContent value="claim" className="mt-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <ClaimSettlementPredictor />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
