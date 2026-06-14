'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, MapPin, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PEDSelector } from '@/components/compare/health/PEDSelector';
import { HEALTH_GST, ZONE_1_CITIES, PED_LOADING } from '@/lib/compare/health-rates';
import { formatINR } from '@/lib/compare/compare-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type PolicyType = 'individual' | 'familyFloater';

export interface HealthFormData {
  policyType: PolicyType;
  age: number;
  sumInsured: number;
  city: string;
  adults: number;
  children: number;
  ped: string[];
  addons: string[];
}

interface HealthFormProps {
  onCompare: (data: HealthFormData) => void;
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SUM_INSURED_OPTIONS = [
  { value: 300000, label: '₹3L' },
  { value: 500000, label: '₹5L' },
  { value: 1000000, label: '₹10L' },
  { value: 1500000, label: '₹15L' },
  { value: 2500000, label: '₹25L' },
];

const ZONE_1_AUTOCOMPLETE_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad',
  'Pune', 'Kolkata', 'Ahmedabad', 'Kota', 'Jaipur',
];

const ADDON_OPTIONS = [
  { id: 'maternity', label: 'Maternity', description: 'Delivery & newborn expenses cover' },
  { id: 'opd', label: 'OPD', description: 'Out-patient department expenses' },
  { id: 'criticalIllness', label: 'Critical Illness', description: 'Lump sum on critical illness diagnosis' },
  { id: 'internationalCoverage', label: 'International Coverage', description: 'Worldwide hospitalization cover' },
  { id: 'roomRentWaiver', label: 'Room Rent Waiver', description: 'Remove room rent sub-limits' },
  { id: 'personalAccident', label: 'Personal Accident', description: 'Accidental injury & disability cover' },
];

const AGE_OPTIONS = Array.from({ length: 48 }, (_, i) => i + 18); // 18-65

// ---------------------------------------------------------------------------
// Estimated premium helper (for the banner)
// ---------------------------------------------------------------------------
function estimateGSTSaving(age: number, sumInsured: number, city: string, ped: string[]): number {
  // Rough base premium estimate
  const ageBand =
    age <= 25 ? '18-25' :
    age <= 30 ? '26-30' :
    age <= 35 ? '31-35' :
    age <= 40 ? '36-40' :
    age <= 45 ? '41-45' :
    age <= 50 ? '46-50' :
    age <= 55 ? '51-55' :
    age <= 60 ? '56-60' : '61-65';

  const siKey = sumInsured <= 500000 ? 'SI_5L' : 'SI_10L';

  // Use HDFC_ERGO as reference for estimate
  const baseEstimate: Record<string, Record<string, number>> = {
    SI_5L: { '18-25': 4999, '26-30': 5699, '31-35': 6499, '36-40': 7999, '41-45': 10499, '46-50': 13999, '51-55': 18499, '56-60': 24499, '61-65': 31999 },
    SI_10L: { '18-25': 8499, '26-30': 9699, '31-35': 11099, '36-40': 13699, '41-45': 17999, '46-50': 23999, '51-55': 31499, '56-60': 41999, '61-65': 54999 },
  };

  let base = baseEstimate[siKey]?.[ageBand] ?? 8000;

  // Scale for non-standard SI
  if (sumInsured > 1000000) {
    base = Math.round(base * (sumInsured / 1000000));
  } else if (sumInsured < 500000 && sumInsured === 300000) {
    base = Math.round(base * 0.7);
  }

  // Zone loading
  const isZone1 = (ZONE_1_CITIES as readonly string[]).some(
    (c) => c.toLowerCase() === city.toLowerCase()
  );
  if (isZone1) base = Math.round(base * 1.12);

  // PED loading
  const totalPEDLoading = ped
    .filter((p) => p !== 'none')
    .reduce((sum, p) => {
      const rate = PED_LOADING[p as keyof typeof PED_LOADING] ?? 0;
      return sum + rate;
    }, 0);
  base = Math.round(base * (1 + totalPEDLoading));

  // GST saving = what would have been 18%
  return Math.round(base * 0.18);
}

// ---------------------------------------------------------------------------
// HealthForm Component
// ---------------------------------------------------------------------------
export function HealthForm({ onCompare, loading = false }: HealthFormProps) {
  const [policyType, setPolicyType] = useState<PolicyType>('individual');
  const [age, setAge] = useState(30);
  const [sumInsured, setSumInsured] = useState(500000);
  const [city, setCity] = useState('');
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [ped, setPed] = useState<string[]>(['none']);
  const [addons, setAddons] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // City autocomplete
  const citySuggestions = useMemo(() => {
    if (!city.trim()) return [];
    const input = city.toLowerCase().trim();
    return ZONE_1_AUTOCOMPLETE_CITIES.filter((c) =>
      c.toLowerCase().startsWith(input)
    );
  }, [city]);

  // GST saving estimate
  const gstSavingEstimate = useMemo(() => {
    if (!city.trim()) return 0;
    return estimateGSTSaving(age, sumInsured, city, ped);
  }, [age, sumInsured, city, ped]);

  // Click outside to close city suggestions
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(e.target as Node)
      ) {
        setShowCitySuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setShowCitySuggestions(false);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setShowCitySuggestions(true);
  };

  const toggleAddon = (addonId: string) => {
    setAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((a) => a !== addonId)
        : [...prev, addonId]
    );
  };

  const handleSubmit = () => {
    onCompare({
      policyType,
      age,
      sumInsured,
      city,
      adults: policyType === 'familyFloater' ? adults : 1,
      children: policyType === 'familyFloater' ? childrenCount : 0,
      ped,
      addons,
    });
  };

  const isFormValid = age >= 18 && age <= 65 && city.trim().length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">🏥</span>
            Health Insurance Comparison
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Compare quotes from 7 IRDAI-licensed insurers — 0% GST from 22 Sept 2025
          </p>

          {/* GST Savings Banner */}
          {gstSavingEstimate > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 px-3 py-2 mt-2">
                <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                <span className="text-xs font-semibold text-green-800 dark:text-green-300">
                  0% GST — Save up to {formatINR(gstSavingEstimate)} vs last year
                </span>
              </div>
            </motion.div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Policy Type */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Policy Type</Label>
            <RadioGroup
              value={policyType}
              onValueChange={(val) => setPolicyType(val as PolicyType)}
              className="grid grid-cols-2 gap-3"
            >
              {[
                { value: 'individual', label: 'Individual', desc: 'Single person cover' },
                { value: 'familyFloater', label: 'Family Floater', desc: 'Full family cover' },
              ].map((opt) => {
                const isSelected = policyType === opt.value;
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`ptype-${opt.value}`}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-600'
                        : 'border-border hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <RadioGroupItem value={opt.value} id={`ptype-${opt.value}`} className="sr-only" />
                    <Heart className={`h-5 w-5 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-medium ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

          {/* Age + Sum Insured */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Eldest Member Age</Label>
              <Select
                value={String(age)}
                onValueChange={(val) => setAge(Number(val))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {AGE_OPTIONS.map((a) => (
                    <SelectItem key={a} value={String(a)}>
                      {a} years
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Sum Insured</Label>
              <Select
                value={String(sumInsured)}
                onValueChange={(val) => setSumInsured(Number(val))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUM_INSURED_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sum Insured Radio Cards */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sum Insured</Label>
            <RadioGroup
              value={String(sumInsured)}
              onValueChange={(val) => setSumInsured(Number(val))}
              className="grid grid-cols-5 gap-2"
            >
              {SUM_INSURED_OPTIONS.map((opt) => {
                const isSelected = sumInsured === opt.value;
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`si-${opt.value}`}
                    className={`flex items-center justify-center p-2.5 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-600'
                        : 'border-border hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <RadioGroupItem value={String(opt.value)} id={`si-${opt.value}`} className="sr-only" />
                    <span className={`text-xs font-semibold ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}`}>
                      {opt.label}
                    </span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          {/* City with Autocomplete */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">City</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={cityInputRef}
                placeholder="Enter city name"
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                onFocus={() => setShowCitySuggestions(true)}
                className="pl-9"
              />

              {/* Autocomplete dropdown */}
              {showCitySuggestions && citySuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border rounded-lg shadow-lg max-h-40 overflow-y-auto"
                >
                  {citySuggestions.map((suggestion) => {
                    const isZone1 = (ZONE_1_CITIES as readonly string[]).some(
                      (c) => c.toLowerCase() === suggestion.toLowerCase()
                    );
                    return (
                      <button
                        key={suggestion}
                        type="button"
                        className="flex items-center justify-between w-full px-3 py-2 text-xs hover:bg-muted/50 transition-colors text-left"
                        onClick={() => handleCitySelect(suggestion)}
                      >
                        <span>{suggestion}</span>
                        {isZone1 && (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[9px] h-4 px-1.5">
                            Zone 1
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {city.trim().length >= 2 && (
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  (ZONE_1_CITIES as readonly string[]).some(
                    (c) => c.toLowerCase() === city.toLowerCase()
                  )
                    ? 'border-amber-400 text-amber-700 dark:border-amber-600 dark:text-amber-400'
                    : 'border-green-400 text-green-700 dark:border-green-600 dark:text-green-400'
                }`}
              >
                {(ZONE_1_CITIES as readonly string[]).some(
                  (c) => c.toLowerCase() === city.toLowerCase()
                )
                  ? 'Zone 1 (Metro) — +12% loading'
                  : 'Zone 2 (Rest of India) — No loading'}
              </Badge>
            )}
          </div>

          {/* Family Floater: Members */}
          {policyType === 'familyFloater' && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Family Members</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Adults (18+)</Label>
                    <Select
                      value={String(adults)}
                      onValueChange={(val) => setAdults(Number(val))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} {n === 1 ? 'Adult' : 'Adults'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Children (0-17)</Label>
                    <Select
                      value={String(childrenCount)}
                      onValueChange={(val) => setChildrenCount(Number(val))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n} {n === 1 ? 'Child' : n === 0 ? 'No Children' : 'Children'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* PED Selector */}
          <PEDSelector selected={ped} onChange={setPed} />

          <Separator />

          {/* Add-ons */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Add-Ons</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ADDON_OPTIONS.map((addon) => (
                <Label
                  key={addon.id}
                  htmlFor={`haddon-${addon.id}`}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    addons.includes(addon.id)
                      ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30'
                      : 'border-border hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`haddon-${addon.id}`}
                    checked={addons.includes(addon.id)}
                    onChange={() => toggleAddon(addon.id)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-tight">{addon.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      {addon.description}
                    </p>
                  </div>
                </Label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Compare Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Comparing Quotes...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Compare Now
                <ChevronRight className="h-5 w-5" />
              </span>
            )}
          </Button>

          {!isFormValid && (
            <p className="text-[10px] text-muted-foreground text-center">
              Please fill in all required fields (Age and City)
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
