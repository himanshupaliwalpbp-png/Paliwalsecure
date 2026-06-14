'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Car, Bike, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';

// ============================================
// DATA (Source: IRDAI 2025-26 Motor TP Rates)
// ============================================

const CAR_TP_RATES: Record<string, number> = {
  '<1000cc': 2094,
  '1000-1500cc': 3316,
  '>1500cc': 7789,
};

const BIKE_TP_RATE = 1000; // approx, varies by cc but simplified

const OD_RATES: Record<string, number> = {
  car: 0.035, // 3.5% of IDV
  bike: 0.05, // 5% of IDV
};

const NCB_SLABS = [
  { years: 0, percent: 0 },
  { years: 1, percent: 20 },
  { years: 2, percent: 25 },
  { years: 3, percent: 35 },
  { years: 4, percent: 45 },
  { years: 5, percent: 50 },
];

const ADDON_PRICES: Record<string, number> = {
  zeroDep: 2500,
  engineCover: 1500,
  roadsideAssistance: 800,
  consumables: 1200,
  returnToInvoice: 4000,
};

const DEPRECIATION_RATES = [
  { year: 1, rate: 5 },
  { year: 2, rate: 10 },
  { year: 3, rate: 15 },
  { year: 4, rate: 25 },
  { year: 5, rate: 35 },
  { year: 6, rate: 40 },
];

const ADDON_INFO: Record<string, { label: string; price: number; description: string }> = {
  zeroDep: { label: 'Zero Depreciation', price: 2500, description: 'Full claim without depreciation deduction' },
  engineCover: { label: 'Engine Cover', price: 1500, description: 'Engine & gearbox damage protection' },
  roadsideAssistance: { label: 'Roadside Assistance', price: 800, description: '24x7 breakdown support' },
  consumables: { label: 'Consumables Cover', price: 1200, description: 'Covers oil, coolant, nuts & bolts' },
  returnToInvoice: { label: 'Return to Invoice', price: 4000, description: 'Get full invoice value in total loss' },
};

// Helper: Calculate IDV based on ex-showroom price and vehicle age
function calculateIDV(exShowroomPrice: number, vehicleAgeYears: number): number {
  let depreciation = 0;
  for (const d of DEPRECIATION_RATES) {
    if (vehicleAgeYears >= d.year) {
      depreciation = d.rate;
    } else {
      break;
    }
  }
  if (vehicleAgeYears > 6) depreciation = 40; // cap at 40% for older vehicles
  return exShowroomPrice * (1 - depreciation / 100);
}

// Helper: Get TP premium based on engine cc
function getTPPremium(vehicleType: string, engineCC?: number): number {
  if (vehicleType === 'bike') return BIKE_TP_RATE;
  if (!engineCC) return CAR_TP_RATES['<1000cc'];
  if (engineCC <= 1000) return CAR_TP_RATES['<1000cc'];
  if (engineCC <= 1500) return CAR_TP_RATES['1000-1500cc'];
  return CAR_TP_RATES['>1500cc'];
}

// Helper: Format Indian currency
function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(amount));
}

// ============================================
// COMPONENT
// ============================================

export default function MotorCalculator() {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const [vehicleType, setVehicleType] = useState<'car' | 'bike'>('car');
  const [exShowroomPrice, setExShowroomPrice] = useState<number>(800000);
  const [vehicleAge, setVehicleAge] = useState<number>(1);
  const [engineCC, setEngineCC] = useState<number>(1200);
  const [ncbYears, setNcbYears] = useState<number>(0);
  const [addOns, setAddOns] = useState({
    zeroDep: false,
    engineCover: false,
    roadsideAssistance: false,
    consumables: false,
    returnToInvoice: false,
  });
  const [result, setResult] = useState<null | {
    idv: number;
    odPremium: number;
    tpPremium: number;
    ncbDiscount: number;
    addOnsTotal: number;
    subtotal: number;
    gst: number;
    total: number;
  }>(null);

  const calculate = () => {
    // 1. Calculate IDV
    const idv = calculateIDV(exShowroomPrice, vehicleAge);

    // 2. Own Damage (OD) Premium
    const odRate = OD_RATES[vehicleType];
    const odPremium = idv * odRate;

    // 3. Third Party (TP) Premium
    const tpPremium = getTPPremium(vehicleType, engineCC);

    // 4. NCB Discount
    const ncbPercent = NCB_SLABS.find(s => s.years === ncbYears)?.percent || 0;
    const ncbDiscount = odPremium * (ncbPercent / 100);

    // 5. Add-ons total
    let addOnsTotal = 0;
    if (addOns.zeroDep) addOnsTotal += ADDON_PRICES.zeroDep;
    if (addOns.engineCover) addOnsTotal += ADDON_PRICES.engineCover;
    if (addOns.roadsideAssistance) addOnsTotal += ADDON_PRICES.roadsideAssistance;
    if (addOns.consumables) addOnsTotal += ADDON_PRICES.consumables;
    if (addOns.returnToInvoice) addOnsTotal += ADDON_PRICES.returnToInvoice;

    // 6. Subtotal (OD - NCB + TP + Add-ons)
    const subtotal = odPremium - ncbDiscount + tpPremium + addOnsTotal;

    // 7. GST 18%
    const gst = subtotal * 0.18;

    // 8. Total
    const total = subtotal + gst;

    setResult({
      idv,
      odPremium,
      tpPremium,
      ncbDiscount,
      addOnsTotal,
      subtotal,
      gst,
      total,
    });
  };

  const ncbPercent = NCB_SLABS.find(s => s.years === ncbYears)?.percent || 0;

  return (
    <div className="space-y-6">
      <Card className="w-full bg-white/90 dark:bg-white/10 border-slate-200 dark:border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-white">
            <Calculator className="h-5 w-5 text-teal-700 dark:text-[#00A9A6]" />
            {isHindi ? 'मोटर इंश्योरेंस प्रीमियम कैलकुलेटर' : 'Motor Insurance Premium Calculator'}
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            {isHindi ? 'IRDAI 2025-26 दरों के अनुसार अपना कार या बाइक इंश्योरेंस प्रीमियम कैलकुलेट करें।' : isEnglish ? 'Calculate your car or bike insurance premium as per IRDAI 2025-26 rates.' : 'Calculate your car or bike insurance premium as per IRDAI 2025-26 rates.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Vehicle Type Toggle */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant={vehicleType === 'car' ? 'default' : 'outline'}
              onClick={() => setVehicleType('car')}
              className={`flex-1 ${vehicleType === 'car' ? 'bg-teal-700 hover:bg-teal-800 dark:bg-[#00A9A6] dark:hover:bg-[#009090]' : 'border-slate-300 dark:border-white/20'}`}
            >
              <Car className="h-4 w-4 mr-2" /> Car
            </Button>
            <Button
              type="button"
              variant={vehicleType === 'bike' ? 'default' : 'outline'}
              onClick={() => setVehicleType('bike')}
              className={`flex-1 ${vehicleType === 'bike' ? 'bg-teal-700 hover:bg-teal-800 dark:bg-[#00A9A6] dark:hover:bg-[#009090]' : 'border-slate-300 dark:border-white/20'}`}
            >
              <Bike className="h-4 w-4 mr-2" /> Bike
            </Button>
          </div>

          {/* Input fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300">Ex-Showroom Price (₹)</Label>
              <Input
                type="number"
                value={exShowroomPrice}
                onChange={(e) => setExShowroomPrice(Number(e.target.value))}
                placeholder="e.g., 800000"
                className="bg-white dark:bg-slate-800/50 border-slate-300 dark:border-white/20"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300">Vehicle Age (years)</Label>
              <Select value={vehicleAge.toString()} onValueChange={(v) => setVehicleAge(Number(v))}>
                <SelectTrigger className="bg-white dark:bg-slate-800/50 border-slate-300 dark:border-white/20">
                  <SelectValue placeholder="Select age" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(age => (
                    <SelectItem key={age} value={age.toString()}>
                      {age} year{age > 1 ? 's' : ''} ({DEPRECIATION_RATES.find(d => d.year === (age <= 6 ? age : 6))?.rate || 40}% dep)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {vehicleType === 'car' && (
              <div className="space-y-1.5">
                <Label className="text-slate-700 dark:text-slate-300">Engine Capacity (cc)</Label>
                <Select value={engineCC.toString()} onValueChange={(v) => setEngineCC(Number(v))}>
                  <SelectTrigger className="bg-white dark:bg-slate-800/50 border-slate-300 dark:border-white/20">
                    <SelectValue placeholder="Select cc" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="800">Below 1000 cc — TP: ₹2,094</SelectItem>
                    <SelectItem value="1200">1000 - 1500 cc — TP: ₹3,316</SelectItem>
                    <SelectItem value="2000">Above 1500 cc — TP: ₹7,789</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-slate-700 dark:text-slate-300">
                No Claim Bonus (NCB) — {ncbPercent}% discount
              </Label>
              <Select value={ncbYears.toString()} onValueChange={(v) => setNcbYears(Number(v))}>
                <SelectTrigger className="bg-white dark:bg-slate-800/50 border-slate-300 dark:border-white/20">
                  <SelectValue placeholder="Select NCB years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 years (0%)</SelectItem>
                  <SelectItem value="1">1 year (20%)</SelectItem>
                  <SelectItem value="2">2 years (25%)</SelectItem>
                  <SelectItem value="3">3 years (35%)</SelectItem>
                  <SelectItem value="4">4 years (45%)</SelectItem>
                  <SelectItem value="5">5+ years (50%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Add-ons */}
          <div className="border border-slate-200 dark:border-white/10 rounded-lg p-4 space-y-3 bg-slate-50/50 dark:bg-white/5">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
              Add-ons (Optional)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(ADDON_INFO).map(([key, addon]) => (
                <label
                  key={key}
                  className={`flex items-center gap-2.5 text-sm p-2 rounded-lg cursor-pointer transition-colors ${
                    addOns[key as keyof typeof addOns]
                      ? 'bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/30'
                      : 'hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={addOns[key as keyof typeof addOns]}
                    onChange={(e) => setAddOns({ ...addOns, [key]: e.target.checked })}
                    className="rounded border-slate-300 dark:border-white/20"
                  />
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {addon.label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                      +₹{addon.price.toLocaleString()}
                    </span>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{addon.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Estimated IDV Preview */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800/30">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span>
              Estimated IDV: <strong className="text-slate-800 dark:text-white">₹{formatINR(calculateIDV(exShowroomPrice, vehicleAge))}</strong>
              {' '}({DEPRECIATION_RATES.find(d => d.year === (vehicleAge <= 6 ? vehicleAge : 6))?.rate || 40}% depreciation for {vehicleAge} year{vehicleAge > 1 ? 's' : ''})
            </span>
          </div>

          <Button
            onClick={calculate}
            className="w-full bg-teal-700 hover:bg-teal-800 dark:bg-[#00A9A6] dark:hover:bg-[#009090] text-white font-semibold"
          >
            {isHindi ? 'प्रीमियम कैलकुलेट करें' : 'Calculate Premium'}
          </Button>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 rounded-xl border border-teal-200 dark:border-teal-800/30 space-y-3"
              >
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">{isHindi ? 'प्रीमियम सारांश' : 'Premium Summary'}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Insured Declared Value (IDV):</span>
                  <span className="font-medium text-slate-800 dark:text-white">₹{formatINR(result.idv)}</span>
                  <span className="text-slate-600 dark:text-slate-400">Own Damage (OD):</span>
                  <span className="text-slate-700 dark:text-slate-300">₹{formatINR(result.odPremium)}</span>
                  <span className="text-slate-600 dark:text-slate-400">NCB Discount ({ncbPercent}%):</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">-₹{formatINR(result.ncbDiscount)}</span>
                  <span className="text-slate-600 dark:text-slate-400">Third Party (TP):</span>
                  <span className="text-slate-700 dark:text-slate-300">₹{formatINR(result.tpPremium)}</span>
                  <span className="text-slate-600 dark:text-slate-400">Add-ons Total:</span>
                  <span className="text-slate-700 dark:text-slate-300">₹{formatINR(result.addOnsTotal)}</span>
                  <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                  <span className="text-slate-700 dark:text-slate-300">₹{formatINR(result.subtotal)}</span>
                  <span className="text-slate-600 dark:text-slate-400">GST (18%):</span>
                  <span className="text-slate-700 dark:text-slate-300">₹{formatINR(result.gst)}</span>
                  <span className="font-bold text-slate-800 dark:text-white text-base">Total Premium:</span>
                  <span className="font-bold text-teal-700 dark:text-[#00A9A6] text-lg">₹{formatINR(result.total)}</span>
                </div>

                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1">
                  <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Monthly: ₹{formatINR(result.total / 12)} | Daily: ₹{Math.round(result.total / 365).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1 mt-2">
                  <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>TP rates may increase 18-25% soon as per IRDAI proposal. OD rates vary by insurer.</span>
                </div>

                {/* IRDAI TP Rate Reference */}
                <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/10">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">IRDAI 2025-26 TP Rates (Car):</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded">
                      <div className="font-bold text-blue-700 dark:text-blue-300">₹2,094</div>
                      <div className="text-slate-500 dark:text-slate-400">&lt;1000cc</div>
                    </div>
                    <div className="text-center p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded">
                      <div className="font-bold text-blue-700 dark:text-blue-300">₹3,316</div>
                      <div className="text-slate-500 dark:text-slate-400">1000-1500cc</div>
                    </div>
                    <div className="text-center p-1.5 bg-blue-50 dark:bg-blue-950/20 rounded">
                      <div className="font-bold text-blue-700 dark:text-blue-300">₹7,789</div>
                      <div className="text-slate-500 dark:text-slate-400">&gt;1500cc</div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Source: IRDAI Motor Tariff 2025-26. Actual premium may vary by insurer, city, and vehicle model.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
