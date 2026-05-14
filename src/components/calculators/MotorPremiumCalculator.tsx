'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Bike, Calculator, Shield, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type VehicleType = 'car' | 'bike';
type VehicleAge = 'new' | '1yr' | '2yr' | '3yr' | '4yr' | '5yr' | '6yr+';
type EngineCapacity = 'below1000' | '1000-1500' | 'above1500';
type NCBPercent = 0 | 20 | 25 | 35 | 45 | 50;

const VEHICLE_AGE_OPTIONS: { label: string; value: VehicleAge }[] = [
  { label: 'New (0-1 year)', value: 'new' },
  { label: '1 Year Old', value: '1yr' },
  { label: '2 Years Old', value: '2yr' },
  { label: '3 Years Old', value: '3yr' },
  { label: '4 Years Old', value: '4yr' },
  { label: '5 Years Old', value: '5yr' },
  { label: '6+ Years Old', value: '6yr+' },
];

const DEPRECIATION_MAP: Record<VehicleAge, number> = {
  'new': 5,
  '1yr': 10,
  '2yr': 15,
  '3yr': 25,
  '4yr': 35,
  '5yr': 35,
  '6yr+': 40,
};

const TP_PREMIUM_CAR: Record<EngineCapacity, number> = {
  'below1000': 2094,
  '1000-1500': 3316,
  'above1500': 7789,
};

const TP_PREMIUM_BIKE = 1366; // IRDAI fixed for bikes >75cc

const OD_RATE_CAR = 0.035; // 3.5% average
const OD_RATE_BIKE = 0.07; // 7% average

interface AddOnPrices {
  zeroDep: number;
  engineCover: number;
  roadside: number;
  consumables: number;
  returnToInvoice: number;
}

const ADDON_PRICES_CAR: AddOnPrices = {
  zeroDep: 3000,
  engineCover: 1500,
  roadside: 800,
  consumables: 1200,
  returnToInvoice: 2000,
};

const ADDON_PRICES_BIKE: AddOnPrices = {
  zeroDep: 1000,
  engineCover: 800,
  roadside: 400,
  consumables: 600,
  returnToInvoice: 1000,
};

const GST_RATE = 18;

// ============================================================================
// HELPERS
// ============================================================================

function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${Math.round(amount)}`;
}

function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

interface MotorCalculationResult {
  showroomPrice: number;
  depreciationPercent: number;
  depreciationAmount: number;
  idv: number;
  odRate: number;
  odPremium: number;
  tpPremium: number;
  ncbPercent: number;
  ncbDiscount: number;
  addOns: {
    zeroDep: number;
    engineCover: number;
    roadside: number;
    consumables: number;
    returnToInvoice: number;
    total: number;
  };
  subtotal: number;
  gstAmount: number;
  finalPremium: number;
  hinglishMessage: string;
}

function calculateMotorPremium(
  vehicleType: VehicleType,
  vehicleAge: VehicleAge,
  showroomPrice: number,
  engineCapacity: EngineCapacity,
  ncb: NCBPercent,
  addOns: { zeroDep: boolean; engineCover: boolean; roadside: boolean; consumables: boolean; returnToInvoice: boolean }
): MotorCalculationResult {
  const depreciationPercent = DEPRECIATION_MAP[vehicleAge];
  const depreciationAmount = (showroomPrice * depreciationPercent) / 100;
  const idv = showroomPrice - depreciationAmount;

  const odRate = vehicleType === 'car' ? OD_RATE_CAR : OD_RATE_BIKE;
  const odPremium = idv * odRate;

  const tpPremium = vehicleType === 'car'
    ? TP_PREMIUM_CAR[engineCapacity]
    : TP_PREMIUM_BIKE;

  const ncbDiscount = (odPremium * ncb) / 100;

  const prices = vehicleType === 'car' ? ADDON_PRICES_CAR : ADDON_PRICES_BIKE;
  const zeroDep = addOns.zeroDep ? prices.zeroDep : 0;
  const engineCover = addOns.engineCover ? prices.engineCover : 0;
  const roadside = addOns.roadside ? prices.roadside : 0;
  const consumables = addOns.consumables ? prices.consumables : 0;
  const returnToInvoice = addOns.returnToInvoice ? prices.returnToInvoice : 0;
  const addOnTotal = zeroDep + engineCover + roadside + consumables + returnToInvoice;

  const subtotal = odPremium + tpPremium - ncbDiscount + addOnTotal;
  const gstAmount = (subtotal * GST_RATE) / 100;
  const finalPremium = subtotal + gstAmount;

  const hinglishMessage = `आपकी ${vehicleType === 'car' ? 'गाड़ी' : 'बाइक'} का IDV ${formatCurrency(idv)} है, प्रीमियम ${formatCurrencyFull(Math.round(finalPremium))} सालाना`;

  return {
    showroomPrice,
    depreciationPercent,
    depreciationAmount,
    idv,
    odRate,
    odPremium,
    tpPremium,
    ncbPercent: ncb,
    ncbDiscount,
    addOns: { zeroDep, engineCover, roadside, consumables, returnToInvoice, total: addOnTotal },
    subtotal,
    gstAmount,
    finalPremium,
    hinglishMessage,
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function MotorPremiumCalculator() {
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [vehicleAge, setVehicleAge] = useState<VehicleAge>('new');
  const [showroomPrice, setShowroomPrice] = useState(800000);
  const [engineCapacity, setEngineCapacity] = useState<EngineCapacity>('1000-1500');
  const [ncb, setNcb] = useState<NCBPercent>(0);
  const [addOns, setAddOns] = useState({
    zeroDep: true,
    engineCover: false,
    roadside: false,
    consumables: false,
    returnToInvoice: false,
  });
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(
    () => calculateMotorPremium(vehicleType, vehicleAge, showroomPrice, engineCapacity, ncb, addOns),
    [vehicleType, vehicleAge, showroomPrice, engineCapacity, ncb, addOns]
  );

  const handleCalculate = () => {
    setShowResult(true);
  };

  const toggleAddOn = (key: keyof typeof addOns) => {
    setAddOns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card className="w-full border-0 shadow-lg shadow-amber-500/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl">Motor Insurance Premium Calculator</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              IRDAI 2025-26 rules ke anusaar accurate premium
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Vehicle Type Toggle */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Vehicle Type</Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={vehicleType === 'car' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVehicleType('car')}
              className={vehicleType === 'car' ? 'bg-amber-600 hover:bg-amber-700 gap-2' : 'gap-2'}
            >
              <Car className="h-4 w-4" /> Car
            </Button>
            <Button
              type="button"
              variant={vehicleType === 'bike' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVehicleType('bike')}
              className={vehicleType === 'bike' ? 'bg-amber-600 hover:bg-amber-700 gap-2' : 'gap-2'}
            >
              <Bike className="h-4 w-4" /> Bike
            </Button>
          </div>
        </div>

        {/* Vehicle Age */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Vehicle Age / Registration Year</Label>
          <Select value={vehicleAge} onValueChange={(v) => setVehicleAge(v as VehicleAge)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_AGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label} ({DEPRECIATION_MAP[opt.value]}% depreciation)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Showroom Price / IDV */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {vehicleType === 'car' ? 'Showroom Price (Ex-Showroom)' : 'Showroom Price'}
            </Label>
            <Badge variant="secondary" className="text-sm font-semibold">
              {formatCurrency(showroomPrice)}
            </Badge>
          </div>
          <Slider
            value={[showroomPrice]}
            onValueChange={(v) => setShowroomPrice(v[0])}
            min={100000}
            max={5000000}
            step={50000}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹1 Lakh</span>
            <span>₹50 Lakh</span>
          </div>
        </div>

        {/* Engine Capacity (Cars only) */}
        {vehicleType === 'car' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Engine Capacity</Label>
            <Select value={engineCapacity} onValueChange={(v) => setEngineCapacity(v as EngineCapacity)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="below1000">Below 1000cc (TP: ₹2,094/yr)</SelectItem>
                <SelectItem value="1000-1500">1000–1500cc (TP: ₹3,316/yr)</SelectItem>
                <SelectItem value="above1500">Above 1500cc (TP: ₹7,789/yr)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* NCB */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">No Claim Bonus (NCB)</Label>
          <Select value={String(ncb)} onValueChange={(v) => setNcb(Number(v) as NCBPercent)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0% (First year / New claim)</SelectItem>
              <SelectItem value="20">20% (1 claim-free year)</SelectItem>
              <SelectItem value="25">25% (2 claim-free years)</SelectItem>
              <SelectItem value="35">35% (3 claim-free years)</SelectItem>
              <SelectItem value="45">45% (4 claim-free years)</SelectItem>
              <SelectItem value="50">50% (5+ claim-free years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add-ons */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Add-on Covers</Label>
          <div className="space-y-2">
            {[
              { key: 'zeroDep' as const, label: 'Zero Depreciation', price: vehicleType === 'car' ? '₹3,000' : '₹1,000' },
              { key: 'engineCover' as const, label: 'Engine Cover', price: vehicleType === 'car' ? '₹1,500' : '₹800' },
              { key: 'roadside' as const, label: 'Roadside Assistance', price: vehicleType === 'car' ? '₹800' : '₹400' },
              { key: 'consumables' as const, label: 'Consumables Cover', price: vehicleType === 'car' ? '₹1,200' : '₹600' },
              { key: 'returnToInvoice' as const, label: 'Return to Invoice', price: vehicleType === 'car' ? '₹2,000' : '₹1,000' },
            ].map((addon) => (
              <div key={addon.key} className="flex items-center gap-3">
                <Checkbox
                  id={`addon-${addon.key}`}
                  checked={addOns[addon.key]}
                  onCheckedChange={() => toggleAddOn(addon.key)}
                />
                <label htmlFor={`addon-${addon.key}`} className="text-sm flex-1 cursor-pointer">
                  {addon.label}
                </label>
                <span className="text-xs text-muted-foreground">{addon.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2"
          size="lg"
        >
          <Calculator className="h-4 w-4" />
          Calculate Premium
        </Button>

        {/* Results */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <Separator />

              {/* IDV Calculation */}
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-5 dark:from-amber-950/30 dark:to-orange-950/30">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  IDV (Insured Declared Value) Calculation
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Showroom Price (Ex-Showroom)</span>
                    <span className="font-medium">{formatCurrencyFull(result.showroomPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Depreciation ({result.depreciationPercent}%)</span>
                    <span className="font-medium text-red-600">- {formatCurrencyFull(result.depreciationAmount)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-amber-700 dark:text-amber-300 text-base">
                    <span>IDV (Your Vehicle&apos;s Current Value)</span>
                    <span>{formatCurrencyFull(result.idv)}</span>
                  </div>
                </div>
              </div>

              {/* Premium Breakdown */}
              <div className="rounded-xl bg-white/50 dark:bg-white/5 p-4 border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-amber-600" />
                  Premium Components Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Own Damage (OD) Premium ({(result.odRate * 100).toFixed(1)}% of IDV)</span>
                    <span className="font-medium">{formatCurrencyFull(result.odPremium)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Third-Party (TP) Premium (IRDAI Fixed)</span>
                    <span className="font-medium">{formatCurrencyFull(result.tpPremium)}</span>
                  </div>
                  {result.ncbDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NCB Discount ({result.ncbPercent}%)</span>
                      <span className="font-medium text-blue-600">- {formatCurrencyFull(result.ncbDiscount)}</span>
                    </div>
                  )}
                  {result.addOns.total > 0 && (
                    <>
                      <Separator />
                      <p className="text-xs font-semibold text-muted-foreground mt-1">Add-on Covers</p>
                      {result.addOns.zeroDep > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Zero Depreciation</span>
                          <span className="font-medium">{formatCurrencyFull(result.addOns.zeroDep)}</span>
                        </div>
                      )}
                      {result.addOns.engineCover > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Engine Cover</span>
                          <span className="font-medium">{formatCurrencyFull(result.addOns.engineCover)}</span>
                        </div>
                      )}
                      {result.addOns.roadside > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Roadside Assistance</span>
                          <span className="font-medium">{formatCurrencyFull(result.addOns.roadside)}</span>
                        </div>
                      )}
                      {result.addOns.consumables > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Consumables Cover</span>
                          <span className="font-medium">{formatCurrencyFull(result.addOns.consumables)}</span>
                        </div>
                      )}
                      {result.addOns.returnToInvoice > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Return to Invoice</span>
                          <span className="font-medium">{formatCurrencyFull(result.addOns.returnToInvoice)}</span>
                        </div>
                      )}
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrencyFull(result.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST ({GST_RATE}%)</span>
                    <span className="font-medium">{formatCurrencyFull(result.gstAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Final Premium */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 p-4 text-white text-center"
              >
                <p className="text-sm opacity-90">Final Annual Premium</p>
                <p className="text-2xl sm:text-3xl font-bold">{formatCurrencyFull(Math.round(result.finalPremium))}</p>
                <p className="text-xs opacity-75 mt-1">({formatCurrency(Math.round(result.finalPremium / 12))}/month)</p>
              </motion.div>

              {/* NCB Savings Highlight */}
              {result.ncbDiscount > 0 && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    NCB se aapne {formatCurrencyFull(result.ncbDiscount)} bachaye! Claim-free driving ka reward.
                  </p>
                </div>
              )}

              {/* Hinglish Message */}
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  {result.hinglishMessage}
                </p>
              </div>

              {/* IRDAI Disclaimer */}
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  Premium estimates are based on IRDAI 2025-26 tariff rates and market averages. Actual premiums may vary by insurer, vehicle model, and location. TP premiums are fixed by IRDAI and are non-negotiable.
                </p>
              </div>

              {/* Branding */}
              <p className="text-center text-xs text-muted-foreground pt-1">
                Powered by <span className="font-semibold text-amber-600">Himanshu Paliwal</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
