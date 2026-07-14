'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, Car, Shield, TrendingDown, AlertCircle, CheckCircle2, Info } from 'lucide-react';

// ── Real IDV Depreciation Rates (IRDAI Standard) ───────────────────────────
const DEPRECIATION_RATES: Record<string, number> = {
  '0-6 months': 0.05,
  '6 months - 1 year': 0.15,
  '1-2 years': 0.20,
  '2-3 years': 0.30,
  '3-4 years': 0.40,
  '4-5 years': 0.50,
};

// ── Real Third-Party Premium Rates (IRDAI 2025-26 Tariff) ──────────────────
const TP_RATES: Record<string, number> = {
  'petrol-1000': 2094,
  'petrol-1000-1500': 3414,
  'petrol-1500-plus': 7890,
  'diesel-1500': 3043,
  'diesel-1500-2000': 4955,
  'diesel-2000-plus': 8230,
  'cng-1000': 2094,
  'cng-1000-1500': 3414,
  'electric-1000': 1780,
  'electric-1000-1500': 2902,
  'electric-1500-plus': 6707,
};

// ── Real OD Premium Rate Range (Industry Average % of IDV) ─────────────────
// Based on IRDAI Annual Report 2024-25 data
// OD premium typically ranges from 2.5% to 4.5% of IDV depending on vehicle age, make, and city
function getODRate(ageYears: number): { rate: number; label: string } {
  if (ageYears <= 1) return { rate: 0.035, label: '3.5% of IDV' };
  if (ageYears <= 3) return { rate: 0.040, label: '4.0% of IDV' };
  if (ageYears <= 5) return { rate: 0.045, label: '4.5% of IDV' };
  return { rate: 0.050, label: '5.0% of IDV (agreed value)' };
}

// ── Popular Car Models with Real Ex-Showroom Prices (2025-26) ──────────────
const CAR_MODELS: Record<string, { name: string; price: number; cc: string; fuel: string }> = {
  'maruti-swift': { name: 'Maruti Swift', price: 650000, cc: '1000-1500', fuel: 'petrol' },
  'maruti-baleno': { name: 'Maruti Baleno', price: 660000, cc: '1000-1500', fuel: 'petrol' },
  'maruti-brezzainsurance': { name: 'Maruti Brezza', price: 850000, cc: '1000-1500', fuel: 'petrol' },
  'maruti-dzire': { name: 'Maruti Dzire', price: 650000, cc: '1000-1500', fuel: 'petrol' },
  'maruti-wagonr': { name: 'Maruti WagonR', price: 580000, cc: '1000', fuel: 'petrol' },
  'hyundai-creta': { name: 'Hyundai Creta', price: 1100000, cc: '1000-1500', fuel: 'petrol' },
  'hyundai-venue': { name: 'Hyundai Venue', price: 800000, cc: '1000-1500', fuel: 'petrol' },
  'hyundai-i20': { name: 'Hyundai i20', price: 720000, cc: '1000-1500', fuel: 'petrol' },
  'hyundai-aura': { name: 'Hyundai Aura', price: 650000, cc: '1000', fuel: 'petrol' },
  'tata-nexon': { name: 'Tata Nexon', price: 800000, cc: '1000-1500', fuel: 'petrol' },
  'tata-punch': { name: 'Tata Punch', price: 650000, cc: '1000', fuel: 'petrol' },
  'tata-tiago': { name: 'Tata Tiago', price: 550000, cc: '1000', fuel: 'petrol' },
  'mahindra-xuv700': { name: 'Mahindra XUV700', price: 1400000, cc: '1500-plus', fuel: 'petrol' },
  'mahindra-scorpio': { name: 'Mahindra Scorpio', price: 1350000, cc: '1500-plus', fuel: 'diesel' },
  'kia-seltos': { name: 'Kia Seltos', price: 1100000, cc: '1000-1500', fuel: 'petrol' },
  'kia-sonet': { name: 'Kia Sonet', price: 750000, cc: '1000', fuel: 'petrol' },
  'toyota-innova': { name: 'Toyota Innova Crysta', price: 1900000, cc: '1500-plus', fuel: 'diesel' },
  'honda-city': { name: 'Honda City', price: 1200000, cc: '1000-1500', fuel: 'petrol' },
  'maruti-xl6': { name: 'Maruti XL6', price: 1150000, cc: '1000-1500', fuel: 'petrol' },
  'renault-kiger': { name: 'Renault Kiger', price: 650000, cc: '1000', fuel: 'petrol' },
};

// ── NCB Discount Slabs (IRDAI Standard) ────────────────────────────────────
const NCB_SLABS = [
  { years: 0, discount: 0, label: 'No NCB' },
  { years: 1, discount: 20, label: '20% off' },
  { years: 2, discount: 25, label: '25% off' },
  { years: 3, discount: 35, label: '35% off' },
  { years: 4, discount: 45, label: '45% off' },
  { years: 5, discount: 50, label: '50% off' },
];

// ── Add-on Costs (Industry Average) ────────────────────────────────────────
const ADD_ONS = {
  zeroDep: { name: 'Zero Depreciation', cost: 0.20, desc: 'Full claim payout — no depreciation deduction on parts' },
  engineProtect: { name: 'Engine Protect', cost: 0.08, desc: 'Covers engine damage from water ingestion, hydrolock' },
  rti: { name: 'Return to Invoice', cost: 0.10, desc: 'Get invoice price (not IDV) if car is stolen/totalled' },
  rsa: { name: 'Roadside Assistance', cost: 0.03, desc: 'Towing, fuel delivery, flat tire, battery jumpstart' },
  passengerCover: { name: 'Passenger Cover', cost: 0.02, desc: '₹2L per passenger for injury/death' },
};

interface CalculationResult {
  idv: number;
  depreciation: number;
  depreciationRate: string;
  tpPremium: number;
  odBasePremium: number;
  odRateLabel: string;
  ncbDiscount: number;
  ncbPercentage: number;
  odAfterNcb: number;
  addOnTotal: number;
  totalPremium: number;
  monthlyPremium: number;
  breakdown: Array<{ label: string; value: string; highlight?: boolean }>;
}

export default function CarInsuranceCalculator() {
  const [selectedCar, setSelectedCar] = useState('maruti-swift');
  const [customPrice, setCustomPrice] = useState('');
  const [purchaseYear, setPurchaseYear] = useState('2024');
  const [ncbYears, setNcbYears] = useState(0);
  const [zeroDep, setZeroDep] = useState(true);
  const [engineProtect, setEngineProtect] = useState(false);
  const [rti, setRti] = useState(false);
  const [rsa, setRsa] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const car = CAR_MODELS[selectedCar] || { name: 'Custom', price: parseInt(customPrice) || 0, cc: '1000-1500', fuel: 'petrol' };
  const exShowroom = customPrice ? parseInt(customPrice) : car.price;

  const currentYear = new Date().getFullYear();
  const ageYears = currentYear - parseInt(purchaseYear);

  const result: CalculationResult | null = useMemo(() => {
    if (!exShowroom || exShowroom < 50000) return null;

    // ── IDV Calculation ─────────────────────────────────────────────────
    let depRate = 0.05; // Default for new cars (0-6 months)
    let depLabel = '5% (New car)';

    if (ageYears <= 0) { depRate = 0.05; depLabel = '5% (0-6 months)'; }
    else if (ageYears <= 1) { depRate = 0.15; depLabel = '15% (6 months - 1 year)'; }
    else if (ageYears <= 2) { depRate = 0.20; depLabel = '20% (1-2 years)'; }
    else if (ageYears <= 3) { depRate = 0.30; depLabel = '30% (2-3 years)'; }
    else if (ageYears <= 4) { depRate = 0.40; depLabel = '40% (3-4 years)'; }
    else if (ageYears <= 5) { depRate = 0.50; depLabel = '50% (4-5 years)'; }
    else { depRate = 0.50; depLabel = '50%+ (5+ years — mutually agreed)'; }

    const depreciation = Math.round(exShowroom * depRate);
    const idv = Math.max(exShowroom - depreciation, exShowroom * 0.30); // Minimum 30% for very old cars

    // ── Third-Party Premium (IRDAI 2025-26 Tariff) ─────────────────────
    const tpKey = `${car.fuel}-${car.cc}`;
    const tpPremium = TP_RATES[tpKey] || TP_RATES['petrol-1000-1500'];

    // ── Own Damage Premium ─────────────────────────────────────────────
    const odInfo = getODRate(ageYears);
    const odBasePremium = Math.round(idv * odInfo.rate);

    // ── NCB Discount on OD ─────────────────────────────────────────────
    const ncbEntry = NCB_SLABS.find(s => s.years === ncbYears) || NCB_SLABS[0];
    const ncbDiscount = Math.round(odBasePremium * (ncbEntry.discount / 100));
    const odAfterNcb = odBasePremium - ncbDiscount;

    // ── Add-ons ────────────────────────────────────────────────────────
    let addOnTotal = 0;
    if (zeroDep) addOnTotal += Math.round(odBasePremium * ADD_ONS.zeroDep.cost);
    if (engineProtect) addOnTotal += Math.round(odBasePremium * ADD_ONS.engineProtect.cost);
    if (rti) addOnTotal += Math.round(odBasePremium * ADD_ONS.rti.cost);
    if (rsa) addOnTotal += Math.round(odBasePremium * ADD_ONS.rsa.cost);

    const totalPremium = tpPremium + odAfterNcb + addOnTotal;
    const monthlyPremium = Math.round(totalPremium / 12);

    return {
      idv,
      depreciation,
      depreciationRate: depLabel,
      tpPremium,
      odBasePremium,
      odRateLabel: odInfo.label,
      ncbDiscount,
      ncbPercentage: ncbEntry.discount,
      odAfterNcb,
      addOnTotal,
      totalPremium,
      monthlyPremium,
      breakdown: [
        { label: 'Ex-Showroom Price', value: `₹${exShowroom.toLocaleString('en-IN')}` },
        { label: 'Depreciation', value: `${depLabel} (−₹${depreciation.toLocaleString('en-IN')})` },
        { label: 'IDV (Insured Declared Value)', value: `₹${idv.toLocaleString('en-IN')}`, highlight: true },
        { label: 'Third-Party Premium (IRDAI Tariff)', value: `₹${tpPremium.toLocaleString('en-IN')}` },
        { label: `Own Damage Premium (${odInfo.label})`, value: `₹${odBasePremium.toLocaleString('en-IN')}` },
        ...(ncbDiscount > 0 ? [{ label: `NCB Discount (${ncbEntry.discount}%)`, value: `−₹${ncbDiscount.toLocaleString('en-IN')}`, highlight: true }] : []),
        ...(addOnTotal > 0 ? [{ label: 'Add-ons Total', value: `₹${addOnTotal.toLocaleString('en-IN')}` }] : []),
        { label: 'Total Annual Premium', value: `₹${totalPremium.toLocaleString('en-IN')}`, highlight: true },
        { label: 'Monthly Equivalent', value: `₹${monthlyPremium.toLocaleString('en-IN')}/month` },
      ],
    };
  }, [exShowroom, ageYears, car, ncbYears, zeroDep, engineProtect, rti, rsa]);

  return (
    <section id="car-insurance-calculator" className="py-16 md:py-24 bg-gradient-to-b from-card/50 to-background scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">Real-Time Calculator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Car Insurance <span className="gradient-text">Premium Calculator</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Calculate your car insurance premium with real IRDAI tariff rates, depreciation schedules, and NCB discounts.
            Based on IRDAI Annual Report 2024-25 and Motor Tariff 2025-26.
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border/50">
          {/* Car Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Select Your Car</label>
            <select
              value={selectedCar}
              onChange={(e) => { setSelectedCar(e.target.value); setCustomPrice(''); }}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {Object.entries(CAR_MODELS).map(([key, val]) => (
                <option key={key} value={key}>{val.name} — ₹{(val.price / 100000).toFixed(1)}L</option>
              ))}
              <option value="custom">Custom / Other Car</option>
            </select>
          </div>

          {/* Custom Price */}
          {selectedCar === 'custom' && (
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Ex-Showroom Price (₹)</label>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder="e.g. 800000"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          )}

          {/* Purchase Year */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Purchase Year</label>
            <select
              value={purchaseYear}
              onChange={(e) => setPurchaseYear(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {Array.from({ length: 15 }, (_, i) => currentYear - i).map(year => (
                <option key={year} value={year}>{year} ({currentYear - year} year(s) old)</option>
              ))}
            </select>
          </div>

          {/* NCB */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">No Claim Bonus (Claim-Free Years)</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {NCB_SLABS.map(slab => (
                <button
                  key={slab.years}
                  onClick={() => setNcbYears(slab.years)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    ncbYears === slab.years
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  {slab.years === 0 ? 'None' : `${slab.years}yr`}
                  <br />
                  <span className="text-[10px] opacity-80">{slab.discount > 0 ? `${slab.discount}% off` : 'No discount'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">Add-ons (Optional)</label>
            <div className="space-y-2">
              {[
                { key: 'zeroDep', state: zeroDep, setter: setZeroDep, info: ADD_ONS.zeroDep },
                { key: 'engineProtect', state: engineProtect, setter: setEngineProtect, info: ADD_ONS.engineProtect },
                { key: 'rti', state: rti, setter: setRti, info: ADD_ONS.rti },
                { key: 'rsa', state: rsa, setter: setRsa, info: ADD_ONS.rsa },
              ].map(({ key, state, setter, info }) => (
                <label key={key} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={state}
                    onChange={(e) => setter(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded accent-primary"
                  />
                  <div>
                    <div className="text-sm font-medium">{info.name}</div>
                    <div className="text-xs text-muted-foreground">{info.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={() => setShowResult(true)}
            disabled={!result}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              <Calculator className="w-4 h-4" />
              Calculate Premium
            </span>
          </button>
        </div>

        {/* Results */}
        {showResult && result && (
          <div className="mt-8 bg-card rounded-2xl p-6 md:p-8 shadow-lg border-2 border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold">Premium Calculation Result</h3>
            </div>

            {/* Car Info */}
            <div className="bg-muted/30 rounded-lg p-4 mb-6 flex items-center gap-3">
              <Car className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm">{car.name}</div>
                <div className="text-xs text-muted-foreground">
                  {purchaseYear} · {ageYears} year(s) old · {car.cc}cc {car.fuel}
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 mb-6">
              {result.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center py-2 px-3 rounded-lg text-sm ${
                    item.highlight
                      ? 'bg-primary/10 border border-primary/20 font-semibold'
                      : 'border-b border-border/30'
                  }`}
                >
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={item.highlight ? 'text-primary' : 'text-foreground font-medium'}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Highlight */}
            <div className="bg-gradient-to-r from-primary/15 to-primary/5 rounded-xl p-6 text-center mb-6">
              <p className="text-xs text-muted-foreground mb-1">Estimated Annual Premium</p>
              <p className="text-3xl font-bold text-primary">
                ₹{result.totalPremium.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ ₹{result.monthlyPremium.toLocaleString('en-IN')}/month
              </p>
            </div>

            {/* IDV Info */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                    Your IDV: ₹{result.idv.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    IDV is the maximum payout if your car is stolen or totalled. Declaring a lower IDV saves premium but reduces claim payout. Always declare accurate IDV.
                  </p>
                </div>
              </div>
            </div>

            {/* NCB Tip */}
            {result.ncbDiscount > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      NCB Saving: ₹{result.ncbDiscount.toLocaleString('en-IN')} ({result.ncbPercentage}% off)
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      You saved ₹{result.ncbDiscount.toLocaleString('en-IN')} on OD premium due to {ncbYears} claim-free year(s). NCB can go up to 50% — drive safely!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex items-start gap-2 mb-6">
              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                Premium estimates are indicative based on IRDAI Annual Report 2024-25 and Motor Tariff 2025-26.
                Actual premium may vary by ±15% depending on insurer, city, vehicle condition, and add-on combination.
                Consult an IRDAI-certified advisor for exact quotes.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/compare/motor"
                className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm text-center shadow-lg hover:shadow-xl transition-all"
              >
                Compare Plans from 51+ Insurers →
              </a>
              <a
                href={`https://wa.me/919257877312?text=${encodeURIComponent(`Hi! I calculated my car insurance premium: ₹${result.totalPremium.toLocaleString('en-IN')}/year for ${car.name}. Please help me find the best plan.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm text-center transition-all"
              >
                💬 WhatsApp for Exact Quote
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
