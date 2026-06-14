'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car, Bike, Zap, Search, ChevronRight, ChevronLeft, Info,
  Shield, Trophy, AlertTriangle, Star, MapPin, Calendar,
  IndianRupee, CheckCircle2, Clock, Phone, Loader2,
  Sparkles, ArrowDown, Wrench, MessageCircle, X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';
import { useThemeAware } from '@/lib/use-theme-aware';

// =============================================================================
// Types
// =============================================================================
interface VehicleItem {
  id: string;
  make: string;
  model: string;
  type: 'BIKE' | 'EV_BIKE' | 'CAR' | 'EV_CAR' | 'SCOOTER';
  fuelType: string;
  cc?: number;
  kw?: number;
  exShowroom: number;
  popular: boolean;
}

interface AddOnItem {
  name: string;
  premium: number;
}

interface QuoteResult {
  insurer: string;
  insurerDisplayName?: string;
  insurerId: string;
  idv: number;
  basicOD: number;
  ncbDiscount: number;
  odAfterNCB: number;
  addOns: AddOnItem[];
  totalAddOn: number;
  tpPremium: number;
  paCover: number;
  netPremium: number;
  gst: number;
  totalPremium: number;
  dataSource: string;
  accuracy: string;
  csr: number;
  garages: number;
}

interface Recommendation {
  winner: string;
  winnerDisplayName?: string;
  cheapest: string;
  cheapestDisplayName?: string;
  savingVsTop: number;
  flags: string[];
  tip: string;
}

interface VehicleInfo {
  id: string;
  make: string;
  model: string;
  type: 'BIKE' | 'EV_BIKE' | 'CAR' | 'EV_CAR' | 'SCOOTER';
  fuelType: string;
  cc?: number;
  kw?: number;
  exShowroom: number;
  segment: string;
}

interface MetaInfo {
  year: number;
  zone: 'A' | 'B';
  ncbYears: number;
  isNew: boolean;
  estimatedIDV: number;
  addOns: string[];
  ncbDiscountPercent: number;
  depreciationPercent: number;
  generatedAt: string;
}

// =============================================================================
// Add-On Definitions (for Step 2)
// =============================================================================
interface AddonOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  appliesTo: ('CAR' | 'EV_CAR' | 'BIKE' | 'EV_BIKE' | 'SCOOTER')[];
  condition?: (data: Step2Data) => boolean;
  recommended?: (data: Step2Data) => boolean;
  estimatedCostRange: [number, number];
}

interface Step2Data {
  vehicleType: string;
  ncbYears: number;
  isNew: boolean;
  vehicleAge: number;
}

// Add-on i18n key mapping
const ADDON_I18N_KEYS: Record<string, { nameKey: string; descKey: string }> = {
  zeroDep: { nameKey: 'motor.addon.zeroDep.name', descKey: 'motor.addon.zeroDep.desc' },
  returnToInvoice: { nameKey: 'motor.addon.returnToInvoice.name', descKey: 'motor.addon.returnToInvoice.desc' },
  roadSideAssistance: { nameKey: 'motor.addon.rsa.name', descKey: 'motor.addon.rsa.desc' },
  consumables: { nameKey: 'motor.addon.consumables.name', descKey: 'motor.addon.consumables.desc' },
  engineProtect: { nameKey: 'motor.addon.engineProtect.name', descKey: 'motor.addon.engineProtect.desc' },
  tyreProtect: { nameKey: 'motor.addon.tyreRim.name', descKey: 'motor.addon.tyreRim.desc' },
  evMotorCover: { nameKey: 'motor.addon.evMotor.name', descKey: 'motor.addon.evMotor.desc' },
  ncbProtect: { nameKey: 'motor.addon.ncbProtection.name', descKey: 'motor.addon.ncbProtection.desc' },
  keyReplacement: { nameKey: 'motor.addon.keyReplacement.name', descKey: 'motor.addon.keyReplacement.desc' },
  passengerCover: { nameKey: 'motor.addon.passengerCover.name', descKey: 'motor.addon.passengerCover.desc' },
  lossOfBelongings: { nameKey: 'motor.addon.lossOfBelongings.name', descKey: 'motor.addon.lossOfBelongings.desc' },
  hospitalDailyCash: { nameKey: 'motor.addon.hospitalDailyCash.name', descKey: 'motor.addon.hospitalDailyCash.desc' },
  personalAccidentEnhanced: { nameKey: 'motor.addon.personalAccidentEnhanced.name', descKey: 'motor.addon.personalAccidentEnhanced.desc' },
  windshieldCover: { nameKey: 'motor.addon.windshieldCover.name', descKey: 'motor.addon.windshieldCover.desc' },
};

const ADDON_OPTIONS: AddonOption[] = [
  {
    id: 'zeroDep',
    name: 'Zero Depreciation',
    description: 'Full claim without depreciation on parts — no deduction for plastic, metal, glass',
    icon: '🛡️',
    appliesTo: ['CAR', 'EV_CAR', 'BIKE', 'EV_BIKE', 'SCOOTER'],
    recommended: (data) => data.isNew || data.vehicleAge <= 2,
    estimatedCostRange: [1500, 15000],
  },
  {
    id: 'returnToInvoice',
    name: 'Return to Invoice',
    description: 'Get full invoice value (incl. registration & road tax) if total loss or theft',
    icon: '🧾',
    appliesTo: ['CAR', 'EV_CAR', 'BIKE', 'EV_BIKE'],
    condition: (data) => data.vehicleAge < 3,
    estimatedCostRange: [1000, 12000],
  },
  {
    id: 'roadSideAssistance',
    name: 'Road Side Assistance',
    description: '24×7 towing, flat tyre, fuel delivery, jump-start — anywhere in India',
    icon: '🚗',
    appliesTo: ['CAR', 'EV_CAR', 'BIKE', 'EV_BIKE', 'SCOOTER'],
    estimatedCostRange: [300, 800],
  },
  {
    id: 'consumables',
    name: 'Consumables Cover',
    description: 'Covers engine oil, coolant, nuts, bolts, grease, AC gas during claims',
    icon: '🔧',
    appliesTo: ['CAR', 'EV_CAR', 'BIKE', 'EV_BIKE', 'SCOOTER'],
    estimatedCostRange: [400, 900],
  },
  {
    id: 'engineProtect',
    name: 'Engine Protect',
    description: 'Covers engine/gearbox damage from water ingression or lubricant leakage',
    icon: '⚙️',
    appliesTo: ['CAR', 'EV_CAR'],
    estimatedCostRange: [500, 1500],
  },
  {
    id: 'tyreProtect',
    name: 'Tyre & Rim Protect',
    description: 'Covers accidental tyre damage & replacement (not wear & tear)',
    icon: '🛞',
    appliesTo: ['CAR', 'EV_CAR', 'BIKE', 'EV_BIKE', 'SCOOTER'],
    estimatedCostRange: [800, 2000],
  },
  {
    id: 'evMotorCover',
    name: 'EV Motor Cover',
    description: 'Covers electric motor damage, battery pack water ingression — EV essential',
    icon: '🔋',
    appliesTo: ['EV_BIKE', 'EV_CAR'],
    estimatedCostRange: [800, 2000],
  },
  {
    id: 'ncbProtect',
    name: 'NCB Protection',
    description: 'Your NCB stays unchanged even after one claim in the policy period',
    icon: '🏅',
    appliesTo: ['CAR', 'EV_CAR', 'BIKE', 'EV_BIKE', 'SCOOTER'],
    condition: (data) => data.ncbYears > 0,
    estimatedCostRange: [500, 5000],
  },
  {
    id: 'keyReplacement',
    name: 'Key Replacement Cover',
    description: 'Lost or damaged car keys replacement — includes programming & lockset',
    icon: '🔑',
    appliesTo: ['CAR', 'EV_CAR'],
    estimatedCostRange: [300, 500],
  },
  {
    id: 'passengerCover',
    name: 'Passenger Cover',
    description: 'Covers injury to co-passengers — ₹2 lakh per passenger, up to 4 passengers',
    icon: '👨‍👩‍👧',
    appliesTo: ['CAR', 'EV_CAR', 'BIKE', 'EV_BIKE', 'SCOOTER'],
    estimatedCostRange: [500, 800],
  },
  {
    id: 'lossOfBelongings',
    name: 'Loss of Personal Belongings',
    description: 'Covers theft of personal items from vehicle — laptop, phone, bags',
    icon: '👜',
    appliesTo: ['CAR', 'EV_CAR'],
    estimatedCostRange: [175, 300],
  },
  {
    id: 'hospitalDailyCash',
    name: 'Hospital Daily Cash',
    description: '₹1,000-2,000/day for each 24hrs in hospital after accident — covers food & incidentals',
    icon: '🏥',
    appliesTo: ['CAR', 'EV_CAR', 'BIKE', 'EV_BIKE', 'SCOOTER'],
    estimatedCostRange: [120, 200],
  },
  {
    id: 'personalAccidentEnhanced',
    name: 'Enhanced Personal Accident',
    description: 'Up to ₹30 lakh accidental death cover + ₹15 lakh disability — beyond mandatory PA',
    icon: '🦺',
    appliesTo: ['CAR', 'EV_CAR', 'BIKE', 'EV_BIKE', 'SCOOTER'],
    estimatedCostRange: [200, 350],
  },
  {
    id: 'windshieldCover',
    name: 'Windshield/Glass Cover',
    description: 'Standalone windshield replacement without affecting NCB — no depreciation on glass',
    icon: '🪟',
    appliesTo: ['CAR', 'EV_CAR'],
    estimatedCostRange: [400, 800],
  },
];

// =============================================================================
// NCB Discount Slab
// =============================================================================
const NCB_SLABS = [
  { years: 0, discount: 0, label: '0%' },
  { years: 1, discount: 20, label: '20%' },
  { years: 2, discount: 25, label: '25%' },
  { years: 3, discount: 35, label: '35%' },
  { years: 4, discount: 45, label: '45%' },
  { years: 5, discount: 50, label: '50%' },
];

// =============================================================================
// Popular vehicles for quick select
// =============================================================================
const POPULAR_VEHICLES = [
  { id: 'ms_swift', label: 'Maruti Swift', icon: '🚗' },
  { id: 'hyundai_creta', label: 'Hyundai Creta', icon: '🚙' },
  { id: 'tata_nexon', label: 'Tata Nexon', icon: '🚙' },
  { id: 'honda_activa6g', label: 'Honda Activa', icon: '🏍️' },
  { id: 'bajaj_pulsar_150', label: 'Bajaj Pulsar 150', icon: '🏍️' },
  { id: 're_classic350', label: 'RE Classic 350', icon: '🏍️' },
  { id: 'tata_nexon_ev', label: 'Tata Nexon EV', icon: '⚡' },
  { id: 'ola_s1_pro', label: 'Ola S1 Pro', icon: '⚡' },
];

// =============================================================================
// Currency Formatter
// =============================================================================
function formatINR(amount: number): string {
  const fixed = Math.round(amount).toString();
  const isNegative = fixed.startsWith('-');
  const absInt = isNegative ? fixed.slice(1) : fixed;

  let formatted: string;
  if (absInt.length <= 3) {
    formatted = absInt;
  } else {
    const last3 = absInt.slice(-3);
    const rest = absInt.slice(0, -3);
    const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formatted = `${grouped},${last3}`;
  }

  return `${isNegative ? '-' : '₹'}${formatted}`;
}

// =============================================================================
// Vehicle type helpers
// =============================================================================
function getVehicleTypeIcon(type: string) {
  switch (type) {
    case 'CAR': return Car;
    case 'EV_CAR': return Zap;
    case 'BIKE': return Bike;
    case 'EV_BIKE': return Zap;
    case 'SCOOTER': return Bike;
    default: return Car;
  }
}

function getVehicleTypeEmoji(type: string) {
  switch (type) {
    case 'CAR': return '🚗';
    case 'EV_CAR': return '⚡';
    case 'BIKE': return '🏍️';
    case 'EV_BIKE': return '⚡';
    case 'SCOOTER': return '🛵';
    default: return '🚗';
  }
}

// =============================================================================
// Step Indicator Component
// =============================================================================
function StepIndicator({ currentStep, isDark }: { currentStep: number; isDark: boolean }) {
  const { t } = useLanguage();
  const steps = [
    { num: 1, label: t('motor.step.vehicle') },
    { num: 2, label: t('motor.step.policy') },
    { num: 3, label: t('motor.step.compare') },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, idx) => (
        <div key={step.num} className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              currentStep >= step.num
                ? 'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#060B1E] shadow-lg shadow-[#C98A1C]/30'
                : `${isDark ? 'bg-[#0A0E18]' : 'bg-gray-100'} border border-[#C98A1C]/20 ${isDark ? 'text-[#8A96A8]' : 'text-[#6B7280]'}`
            }`}
          >
            {currentStep > step.num ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              step.num
            )}
          </div>
          <span
            className={`text-xs lg:text-sm font-medium hidden sm:inline transition-colors ${
              currentStep >= step.num ? 'text-[#C98A1C]' : isDark ? 'text-[#8A96A8]' : 'text-[#6B7280]'
            }`}
          >
            {step.label}
          </span>
          {idx < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-0.5 rounded-full transition-colors ${
                currentStep > step.num ? 'bg-[#C98A1C]' : 'bg-[#C98A1C]/20'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Main Component
// =============================================================================
export default function MotorComparisonTool() {
  const { t } = useLanguage();
  const { isDark } = useThemeAware();
  // ── Step State ──────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);

  // ── Step 1 State ────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VehicleItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
  const [vehicleTypeTab, setVehicleTypeTab] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedZone, setSelectedZone] = useState<'A' | 'B' | ''>('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ── Step 2 State ────────────────────────────────────────────────────────────
  const [ncbYears, setNcbYears] = useState(0);
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // ── Step 3 State ────────────────────────────────────────────────────────────
  const [quotes, setQuotes] = useState<QuoteResult[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [metaInfo, setMetaInfo] = useState<MetaInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // ── Debounced Search ────────────────────────────────────────────────────────
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (query.trim().length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const typeParam = vehicleTypeTab !== 'all' ? `&type=${vehicleTypeTab}` : '';
        const res = await fetch(`/api/motor-compare?q=${encodeURIComponent(query)}${typeParam}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.vehicles ?? []);
          setShowDropdown(true);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, [vehicleTypeTab]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Vehicle Selection ───────────────────────────────────────────────────────
  const handleVehicleSelect = useCallback((vehicle: VehicleItem) => {
    setSelectedVehicle(vehicle);
    setSearchQuery(`${vehicle.make} ${vehicle.model}`);
    setShowDropdown(false);
  }, []);

  const handlePopularSelect = useCallback(async (vehicleId: string) => {
    try {
      const res = await fetch(`/api/motor-compare?q=${vehicleId}`);
      if (res.ok) {
        const data = await res.json();
        const found = data.vehicles?.find((v: VehicleItem) => v.id === vehicleId);
        if (found) handleVehicleSelect(found);
      }
    } catch { /* ignore */ }
  }, [handleVehicleSelect]);

  // ── Year Options ────────────────────────────────────────────────────────────
  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const years: number[] = [];
    for (let y = current; y >= 2010; y--) years.push(y);
    return years;
  }, []);

  // ── Step 1 Validation ───────────────────────────────────────────────────────
  const isStep1Valid = selectedVehicle && selectedYear && selectedZone;

  // ── Step 2 Computed ─────────────────────────────────────────────────────────
  const vehicleAge = useMemo(() => {
    return Math.max(0, new Date().getFullYear() - selectedYear);
  }, [selectedYear]);

  const step2Data = useMemo<Step2Data>(() => ({
    vehicleType: selectedVehicle?.type ?? 'CAR',
    ncbYears,
    isNew: isNewVehicle,
    vehicleAge,
  }), [selectedVehicle, ncbYears, isNewVehicle, vehicleAge]);

  const availableAddOns = useMemo(() => {
    if (!selectedVehicle) return [];
    return ADDON_OPTIONS.filter(a => {
      if (!a.appliesTo.includes(selectedVehicle.type)) return false;
      if (a.condition && !a.condition(step2Data)) return false;
      return true;
    });
  }, [selectedVehicle, step2Data]);

  // Estimated IDV (using IRDAI standard depreciation from calibrated rates)
  const estimatedIDV = useMemo(() => {
    if (!selectedVehicle) return 0;
    // IRDAI standard: 0yr=0%, 1yr=5%, 2yr=15%, 3yr=20%, 4yr=30%, 5+yr=40%
    const depRates: Record<number, number> = {
      0: 0.00, 1: 0.05, 2: 0.15, 3: 0.20, 4: 0.30, 5: 0.40,
    };
    const depKey = Math.min(vehicleAge, 5);
    const depRate = depRates[depKey] ?? 0.40;
    return Math.round(selectedVehicle.exShowroom * (1 - depRate));
  }, [selectedVehicle, vehicleAge]);

  // ── Step Transitions ────────────────────────────────────────────────────────
  const goToStep2 = () => {
    if (isStep1Valid) setCurrentStep(2);
  };

  const goToStep3 = async () => {
    if (!selectedVehicle) return;
    setIsLoading(true);
    setCurrentStep(3);

    try {
      const res = await fetch('/api/motor-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: selectedVehicle.id,
          year: selectedYear,
          zone: selectedZone,
          ncbYears,
          isNew: isNewVehicle,
          addOns: selectedAddOns,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes ?? []);
        setRecommendation(data.recommendation ?? null);
        setVehicleInfo(data.vehicle ?? null);
        setMetaInfo(data.meta ?? null);
      }
    } catch (error) {
      console.error('Compare error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => setCurrentStep(prev => Math.max(1, prev - 1));

  // ── Toggle AddOn ────────────────────────────────────────────────────────────
  const toggleAddon = (id: string) => {
    setSelectedAddOns(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  // ── Toggle Card Expand ──────────────────────────────────────────────────────
  const toggleCardExpand = (insurerId: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(insurerId)) next.delete(insurerId);
      else next.add(insurerId);
      return next;
    });
  };

  // ── Animation Variants ──────────────────────────────────────────────────────
  const pageVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <TooltipProvider delayDuration={300}>
      <section id="motor-comparison" className={`w-full ${isDark ? 'bg-[#060B1E]' : 'bg-[#FAFAF8]'} py-8 sm:py-12 lg:py-20 px-4 sm:px-6`}>
        <div className="max-w-5xl mx-auto">
          {/* ── Header ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="bg-[#C98A1C]/15 text-[#C98A1C] border-[#C98A1C]/30 mb-3 text-xs px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              {t('motor.header.badge')}
            </Badge>
            <h2 className={`text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold ${isDark ? 'text-white' : 'text-[#0A1330]'} mb-2`}>
              {t('motor.header.title')}
            </h2>
            <p className={`${isDark ? 'text-[#8A96A8]' : 'text-[#6B7280]'} text-sm sm:text-base lg:text-lg xl:text-xl max-w-xl mx-auto`}>
              {t('motor.header.subtitle')}
            </p>
          </motion.div>

          {/* ── Step Indicator ───────────────────────────────────────────────── */}
          <StepIndicator currentStep={currentStep} isDark={isDark} />

          {/* ── Step Content ─────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {/* ================================================================
                STEP 1 — Vehicle Selection
                ================================================================ */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <Card className={`${isDark ? 'bg-[#0A0E18]' : 'bg-white'} border-[#C98A1C]/20 shadow-xl`}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-[#C98A1C] text-lg lg:text-xl flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      {t('motor.step1.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Vehicle Type Tabs */}
                    <div>
                      <Label className="text-[#8A96A8] text-xs mb-2 block">{t('motor.step1.vehicleType')}</Label>
                      <Tabs value={vehicleTypeTab} onValueChange={(val) => {
                        setVehicleTypeTab(val);
                        if (searchQuery) handleSearch(searchQuery);
                      }}>
                        <TabsList className="bg-[#060B1E] border border-[#C98A1C]/20 h-auto p-1 w-full overflow-x-auto">
                          {[
                            { value: 'all', label: t('motor.all'), icon: null },
                            { value: 'BIKE', label: t('motor.bikes'), icon: Bike },
                            { value: 'EV_BIKE', label: t('motor.evBikes'), icon: Zap },
                            { value: 'CAR', label: t('motor.cars'), icon: Car },
                            { value: 'EV_CAR', label: t('motor.evCars'), icon: Zap },
                          ].map(tab => (
                            <TabsTrigger
                              key={tab.value}
                              value={tab.value}
                              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C98A1C] data-[state=active]:to-[#E0A830] data-[state=active]:text-[#060B1E] text-[#8A96A8] text-xs px-3 py-2 gap-1.5"
                            >
                              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                              {tab.label}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    </div>

                    {/* Search Input */}
                    <div ref={searchRef} className="relative">
                      <Label className="text-[#8A96A8] text-xs mb-2 block">{t('motor.step1.searchVehicle')}</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A96A8]" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                          placeholder={t('motor.step1.searchPlaceholder')}
                          className="pl-10 pr-10 bg-[#060B1E] border-[#C98A1C]/20 text-white placeholder:text-[#8A96A8]/50 focus:border-[#C98A1C] h-12"
                        />
                        {isSearching && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C98A1C] animate-spin" />
                        )}
                        {searchQuery && !isSearching && (
                          <button
                            onClick={() => { setSearchQuery(''); setSearchResults([]); setShowDropdown(false); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <X className="w-4 h-4 text-[#8A96A8] hover:text-white" />
                          </button>
                        )}
                      </div>

                      {/* Search Dropdown */}
                      {showDropdown && searchResults.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-[#0A0E18] border border-[#C98A1C]/20 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                          {searchResults.map(v => {
                            const TypeIcon = getVehicleTypeIcon(v.type);
                            return (
                              <button
                                key={v.id}
                                onClick={() => handleVehicleSelect(v)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#C98A1C]/10 transition-colors ${
                                  selectedVehicle?.id === v.id ? 'bg-[#C98A1C]/15 border-l-2 border-[#C98A1C]' : ''
                                }`}
                              >
                                <TypeIcon className="w-4 h-4 text-[#C98A1C] shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm font-medium truncate">
                                    {v.make} {v.model}
                                  </p>
                                  <p className="text-[#8A96A8] text-xs">
                                    {v.cc ? `${v.cc}cc` : v.kw ? `${v.kw}kW` : ''} · {v.fuelType} · {formatINR(v.exShowroom)}
                                  </p>
                                </div>
                                {v.popular && (
                                  <Badge className="bg-[#C98A1C]/20 text-[#C98A1C] text-[9px] px-1.5 shrink-0">
                                    {t('motor.step1.popular')}
                                  </Badge>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Popular Vehicles Quick Select */}
                    <div>
                      <Label className="text-[#8A96A8] text-xs mb-2 block">{t('motor.step1.popularVehicles')}</Label>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR_VEHICLES.map(pv => (
                          <button
                            key={pv.id}
                            onClick={() => handlePopularSelect(pv.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              selectedVehicle?.id === pv.id
                                ? 'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#060B1E] border-[#C98A1C]'
                                : 'bg-[#060B1E] border-[#C98A1C]/20 text-[#C98A1C] hover:border-[#C98A1C]/50 hover:bg-[#C98A1C]/10'
                            }`}
                          >
                            <span>{pv.icon}</span>
                            {pv.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selected Vehicle Card */}
                    {selectedVehicle && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#060B1E] border border-[#C98A1C]/30 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#C98A1C]/20 to-[#E0A830]/10 flex items-center justify-center text-2xl shrink-0">
                            {getVehicleTypeEmoji(selectedVehicle.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-sm">
                              {selectedVehicle.make} {selectedVehicle.model}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              <Badge variant="outline" className="border-[#C98A1C]/30 text-[#C98A1C] text-[10px]">
                                {selectedVehicle.cc ? `${selectedVehicle.cc}cc` : selectedVehicle.kw ? `${selectedVehicle.kw}kW` : ''}
                              </Badge>
                              <Badge variant="outline" className="border-[#C98A1C]/30 text-[#C98A1C] text-[10px]">
                                {selectedVehicle.fuelType}
                              </Badge>
                              <Badge variant="outline" className="border-[#C98A1C]/30 text-[#C98A1C] text-[10px]">
                                {selectedVehicle.type}
                              </Badge>
                            </div>
                            <p className="text-[#C98A1C] font-bold text-sm mt-2">
                              {t('motor.exShowroomLabel')} {formatINR(selectedVehicle.exShowroom)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <Separator className="bg-[#C98A1C]/10" />

                    {/* Year & Zone Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[#8A96A8] text-xs mb-2 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {t('motor.step1.registrationYear')}
                        </Label>
                        <div className="relative">
                          <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="w-full h-12 bg-[#060B1E] border border-[#C98A1C]/20 rounded-lg px-4 text-white text-sm focus:border-[#C98A1C] focus:outline-none appearance-none cursor-pointer"
                          >
                            {yearOptions.map(y => (
                              <option key={y} value={y} className="bg-[#0A0E18]">{y}</option>
                            ))}
                          </select>
                          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A96A8] rotate-90 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-[#8A96A8] text-xs mb-2 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {t('motor.step1.zone')}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 text-[#8A96A8] cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-xs bg-[#0A0E18] border-[#C98A1C]/20">
                              {t('motor.step1.zoneTooltip')}
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedZone('A')}
                            className={`h-12 rounded-lg border text-sm font-medium transition-all ${
                              selectedZone === 'A'
                                ? 'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#060B1E] border-[#C98A1C]'
                                : 'bg-[#060B1E] border-[#C98A1C]/20 text-[#8A96A8] hover:border-[#C98A1C]/50'
                            }`}
                          >
                            🏙️ Zone A
                            <span className="block text-[9px] font-normal mt-0.5 opacity-70">{t('motor.step1.metro')}</span>
                          </button>
                          <button
                            onClick={() => setSelectedZone('B')}
                            className={`h-12 rounded-lg border text-sm font-medium transition-all ${
                              selectedZone === 'B'
                                ? 'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#060B1E] border-[#C98A1C]'
                                : 'bg-[#060B1E] border-[#C98A1C]/20 text-[#8A96A8] hover:border-[#C98A1C]/50'
                            }`}
                          >
                            🏘️ Zone B
                            <span className="block text-[9px] font-normal mt-0.5 opacity-70">{t('motor.step1.restOfIndia')}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Estimated IDV Preview */}
                    {selectedVehicle && selectedYear && (
                      <div className="bg-[#C98A1C]/5 border border-[#C98A1C]/15 rounded-lg p-3 flex items-center gap-3">
                        <Shield className="w-5 h-5 text-[#C98A1C] shrink-0" />
                        <div>
                          <p className="text-[#8A96A8] text-xs">{t('motor.step1.estimatedIDV')}</p>
                          <p className="text-[#C98A1C] font-bold text-sm lg:text-xl">{formatINR(estimatedIDV)}</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-[#8A96A8] text-[10px]">
                            {vehicleAge === 0 ? t('motor.depreciationNewLabel') : `${Math.round((1 - estimatedIDV / selectedVehicle.exShowroom) * 100)}% ${t('motor.depreciationLabel')}`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Next Button */}
                    <ShinyButton
                      variant="blue"
                      onClick={goToStep2}
                      disabled={!isStep1Valid}
                      className="w-full text-base"
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        {t('motor.step1.nextButton')}
                        <ChevronRight className="w-5 h-5" />
                      </span>
                    </ShinyButton>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ================================================================
                STEP 2 — Policy Details
                ================================================================ */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <Card className={`${isDark ? 'bg-[#0A0E18]' : 'bg-white'} border-[#C98A1C]/20 shadow-xl`}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-[#C98A1C] text-lg lg:text-xl flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      {t('motor.step2.title')}
                    </CardTitle>
                    {selectedVehicle && (
                      <p className="text-[#8A96A8] text-xs">
                        {selectedVehicle.make} {selectedVehicle.model} · {selectedYear} · Zone {selectedZone}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* NCB Years */}
                    <div>
                      <Label className="text-[#8A96A8] text-xs mb-3 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5" />
                        {t('motor.step2.ncbLabel')}
                      </Label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {NCB_SLABS.map(slab => (
                          <button
                            key={slab.years}
                            onClick={() => setNcbYears(slab.years)}
                            className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all min-h-[70px] ${
                              ncbYears === slab.years
                                ? 'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] border-[#C98A1C] text-[#060B1E] shadow-lg shadow-[#C98A1C]/20'
                                : 'bg-[#060B1E] border-[#C98A1C]/20 text-[#8A96A8] hover:border-[#C98A1C]/50'
                            }`}
                          >
                            <span className="text-lg font-bold">{slab.years}</span>
                            <span className={`text-[10px] font-medium ${ncbYears === slab.years ? 'text-[#060B1E]/70' : 'text-[#C98A1C]/70'}`}>
                              {slab.label} {t('motor.ncbSlabOff')}
                            </span>
                          </button>
                        ))}
                      </div>
                      {ncbYears > 0 && (
                        <p className="text-[#C98A1C] text-xs mt-2 flex items-center gap-1">
                          <Trophy className="w-3 h-3" />
                          {t('motor.youSaveLabel')} {NCB_SLABS[ncbYears].label} {t('motor.step2.onODPremium')}
                        </p>
                      )}
                    </div>

                    <Separator className="bg-[#C98A1C]/10" />

                    {/* New Vehicle Toggle */}
                    <div className="flex items-center justify-between bg-[#060B1E] border border-[#C98A1C]/15 rounded-xl p-4">
                      <div>
                        <Label className="text-white text-sm font-medium">{t('motor.step2.brandNewVehicle')}</Label>
                        <p className="text-[#8A96A8] text-xs mt-0.5">
                          {isNewVehicle
                            ? t('motor.step2.newVehicleTP')
                            : t('motor.step2.annualTP')}
                        </p>
                      </div>
                      <Switch
                        checked={isNewVehicle}
                        onCheckedChange={setIsNewVehicle}
                        className="data-[state=checked]:bg-[#C98A1C]"
                      />
                    </div>

                    <Separator className="bg-[#C98A1C]/10" />

                    {/* Add-ons Selection */}
                    <div>
                      <Label className="text-[#8A96A8] text-xs mb-3 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5" />
                        {t('motor.step2.chooseAddons')}
                        <span className="text-[#C98A1C] ml-1">({selectedAddOns.length} {t('motor.step2.selected')})</span>
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availableAddOns.map(addon => {
                          const isSelected = selectedAddOns.includes(addon.id);
                          const isRecommended = addon.recommended?.(step2Data);
                          return (
                            <motion.button
                              key={addon.id}
                              onClick={() => toggleAddon(addon.id)}
                              className={`text-left p-4 rounded-xl border-2 transition-all ${
                                isSelected
                                  ? 'bg-[#C98A1C]/10 border-[#C98A1C] shadow-md shadow-[#C98A1C]/10'
                                  : 'bg-[#060B1E] border-[#C98A1C]/15 hover:border-[#C98A1C]/40'
                              }`}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                  isSelected
                                    ? 'bg-[#C98A1C] border-[#C98A1C]'
                                    : 'border-[#C98A1C]/30'
                                }`}>
                                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#060B1E]" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm">{addon.icon}</span>
                                    <span className={`text-sm lg:text-base font-semibold ${isSelected ? 'text-[#C98A1C]' : 'text-white'}`}>
                                      {ADDON_I18N_KEYS[addon.id] ? t(ADDON_I18N_KEYS[addon.id].nameKey) : addon.name}
                                    </span>
                                    {isRecommended && (
                                      <Badge className="bg-[#C98A1C]/20 text-[#C98A1C] text-[9px] px-1.5 py-0 border-0">
                                        {t('motor.step2.recommended')}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-[#8A96A8] text-xs lg:text-sm mt-1 leading-relaxed">
                                    {ADDON_I18N_KEYS[addon.id] ? t(ADDON_I18N_KEYS[addon.id].descKey) : addon.description}
                                  </p>
                                  <p className={`text-xs mt-1.5 font-medium ${isSelected ? 'text-[#C98A1C]' : 'text-[#8A96A8]/60'}`}>
                                    ~{formatINR(addon.estimatedCostRange[0])} – {formatINR(addon.estimatedCostRange[1])}{t('motor.perYear')}
                                  </p>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Estimated IDV */}
                    <div className="bg-[#C98A1C]/5 border border-[#C98A1C]/15 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-[#C98A1C]" />
                          <div>
                            <p className="text-[#8A96A8] text-xs">{t('motor.estimatedIDVFull')}</p>
                            <p className="text-[#C98A1C] font-bold text-lg lg:text-xl">{formatINR(estimatedIDV)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[#8A96A8] text-[10px]">{t('motor.ncbDiscountLabel')}</p>
                          <p className="text-[#C98A1C] font-bold">{NCB_SLABS[ncbYears].label}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                      <ShinyButton
                        variant="secondary"
                        onClick={goBack}
                        className="flex-1 text-sm"
                      >
                        <span className="flex items-center justify-center gap-1">
                          <ChevronLeft className="w-4 h-4" />
                          {t('motor.step2.backButton')}
                        </span>
                      </ShinyButton>
                      <ShinyButton
                        variant="blue"
                        onClick={goToStep3}
                        className="flex-[2] text-base"
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          <Sparkles className="w-4 h-4" />
                          {t('motor.step2.compareNow')}
                          <ChevronRight className="w-5 h-5" />
                        </span>
                      </ShinyButton>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ================================================================
                STEP 3 — Comparison Results
                ================================================================ */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {/* Loading State */}
                {isLoading && (
                  <Card className={`${isDark ? 'bg-[#0A0E18]' : 'bg-white'} border-[#C98A1C]/20 shadow-xl`}>
                    <CardContent className="p-8 space-y-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full border-4 border-[#C98A1C]/20 border-t-[#C98A1C] animate-spin" />
                          <Sparkles className="w-6 h-6 text-[#C98A1C] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-semibold">{t('motor.comparing')}</p>
                          <p className="text-[#8A96A8] text-sm mt-1">{t('motor.calculatingQuotes')}</p>
                        </div>
                      </div>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="space-y-3">
                          <Skeleton className="h-4 w-3/4 bg-[#C98A1C]/10" />
                          <Skeleton className="h-10 w-full bg-[#C98A1C]/5" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Results */}
                {!isLoading && quotes.length > 0 && (
                  <div className="space-y-6">
                    {/* Vehicle Info Banner */}
                    <div className="bg-gradient-to-r from-[#C98A1C]/10 to-[#E0A830]/5 border border-[#C98A1C]/20 rounded-xl p-4">
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="text-lg">
                          {vehicleInfo ? getVehicleTypeEmoji(vehicleInfo.type) : '🚗'}
                        </span>
                        <span className="text-white font-semibold">
                          {vehicleInfo ? `${vehicleInfo.make} ${vehicleInfo.model}` : t('motor.vehicle')}
                        </span>
                        <span className="text-[#8A96A8]">|</span>
                        <span className="text-[#C98A1C]">
                          {t('motor.idvLabel')} {formatINR(metaInfo?.estimatedIDV ?? estimatedIDV)}
                        </span>
                        <span className="text-[#8A96A8]">|</span>
                        <span className="text-[#8A96A8]">
                          {t('motor.zoneLabel')} {metaInfo?.zone ?? selectedZone} · {metaInfo?.year ?? selectedYear}
                        </span>
                        <span className="text-[#8A96A8]">|</span>
                        <span className="text-[#C98A1C]">
                          {t('motor.ncbLabelShort')} {metaInfo?.ncbDiscountPercent ?? 0}%
                        </span>
                      </div>
                    </div>

                    {/* AI Recommendation Card */}
                    {recommendation && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#C98A1C] to-[#E0A830] rounded-xl blur-sm opacity-30" />
                        <Card className={`relative ${isDark ? 'bg-[#0A0E18]' : 'bg-white'} border-[#C98A1C]/50 shadow-xl`}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-[#C98A1C] text-base flex items-center gap-2">
                              <Sparkles className="w-5 h-5" />
                              {t('motor.smartAIRecommendation')}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {/* Winner */}
                              <div className="bg-[#C98A1C]/10 border border-[#C98A1C]/20 rounded-lg p-3">
                                <p className="text-[#8A96A8] text-xs flex items-center gap-1">
                                  <Trophy className="w-3 h-3" />
                                  {t('motor.bestValue')}
                                </p>
                                <p className="text-[#C98A1C] font-bold text-lg lg:text-2xl mt-1">{recommendation.winnerDisplayName || recommendation.winner}</p>
                              </div>
                              {/* Cheapest */}
                              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                                <p className="text-emerald-400/70 text-xs flex items-center gap-1">
                                  <IndianRupee className="w-3 h-3" />
                                  {t('motor.cheapest')}
                                </p>
                                <p className="text-emerald-400 font-bold text-lg lg:text-2xl mt-1">{recommendation.cheapestDisplayName || recommendation.cheapest}</p>
                              </div>
                              {/* Savings */}
                              <div className="bg-[#C98A1C]/10 border border-[#C98A1C]/20 rounded-lg p-3">
                                <p className="text-[#C98A1C]/70 text-xs flex items-center gap-1">
                                  <ArrowDown className="w-3 h-3" />
                                  {t('motor.savingsVsTop')}
                                </p>
                                <p className="text-[#C98A1C] font-bold text-lg lg:text-2xl mt-1">{formatINR(recommendation.savingVsTop)}</p>
                              </div>
                            </div>

                            {/* AI Flags */}
                            {recommendation.flags.length > 0 && (
                              <div className="space-y-1.5">
                                {recommendation.flags.map((flag, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-xs">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                                    <span className="text-amber-400/80">{flag}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* AI Tip */}
                            <div className="bg-[#C98A1C]/5 border border-[#C98A1C]/10 rounded-lg p-3 flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-[#C98A1C] mt-0.5 shrink-0" />
                              <p className="text-[#8A96A8] text-xs leading-relaxed">{recommendation.tip}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Insurer Cards Grid */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <IndianRupee className="w-5 h-5 text-[#C98A1C]" />
                        <h3 className="text-[#C98A1C] text-base font-semibold">{t('motor.premiumBreakdownTitle')}</h3>
                        <span className="text-[#8A96A8] text-xs ml-auto">{quotes.length} insurers · sorted by price</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {quotes.map((q, idx) => {
                          const isCheapest = idx === 0;
                          const isBestValue = recommendation?.winner === q.insurer;
                          const isMostExpensive = idx === quotes.length - 1 && quotes.length > 2;
                          const isExpanded = expandedCards.has(q.insurerId);
                          const borderClass = isCheapest
                            ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                            : isBestValue
                              ? 'border-[#C98A1C]/50 shadow-lg shadow-[#C98A1C]/15'
                              : isMostExpensive
                                ? 'border-[#8A96A8]/20 opacity-75'
                                : 'border-[#C98A1C]/20';

                          return (
                            <motion.div
                              key={q.insurerId}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * Math.min(idx, 5) }}
                              className={`relative ${isDark ? 'bg-[#0A0E18]' : 'bg-white'} rounded-xl border-2 ${borderClass} transition-all hover:shadow-xl overflow-hidden`}
                            >
                              {/* Badge Row */}
                              <div className="flex items-center gap-1.5 px-4 pt-3 flex-wrap">
                                {isCheapest && (
                                  <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 border-0">
                                    <Trophy className="w-3 h-3 mr-0.5" />
                                    Cheapest
                                  </Badge>
                                )}
                                {isBestValue && !isCheapest && (
                                  <Badge className="bg-[#C98A1C]/20 text-[#C98A1C] text-[10px] px-2 border-0">
                                    <Sparkles className="w-3 h-3 mr-0.5" />
                                    Best Value
                                  </Badge>
                                )}
                                {isMostExpensive && (
                                  <Badge className="bg-[#8A96A8]/15 text-[#8A96A8] text-[10px] px-2 border-0">
                                    Most Expensive
                                  </Badge>
                                )}
                              </div>

                              {/* Insurer Name & Premium */}
                              <div className="px-4 pt-2 pb-3">
                                <h4 className="text-white font-bold text-base leading-tight">
                                  {q.insurerDisplayName || q.insurer}
                                </h4>
                                <p className="text-[#C98A1C] font-bold text-2xl mt-1.5">
                                  {formatINR(q.totalPremium)}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="border-[#C98A1C]/20 text-[#C98A1C] text-[10px] px-1.5">
                                    <CheckCircle2 className="w-3 h-3 mr-0.5" />
                                    CSR {q.csr}%
                                  </Badge>
                                  <Badge variant="outline" className="border-[#C98A1C]/20 text-[#8A96A8] text-[10px] px-1.5">
                                    <Wrench className="w-3 h-3 mr-0.5" />
                                    {q.garages.toLocaleString()} garages
                                  </Badge>
                                </div>
                                <p className="text-[#8A96A8] text-xs mt-2">
                                  IDV: <span className="text-white font-medium">{formatINR(q.idv)}</span>
                                </p>
                              </div>

                              {/* Expand/Collapse Toggle */}
                              <button
                                onClick={() => toggleCardExpand(q.insurerId)}
                                className="w-full flex items-center justify-center gap-1.5 py-2 border-t border-[#C98A1C]/10 text-[#8A96A8] hover:text-[#C98A1C] hover:bg-[#C98A1C]/5 transition-colors text-xs"
                              >
                                {isExpanded ? 'Hide' : 'Show'} Breakdown
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </motion.div>
                              </button>

                              {/* Expandable Breakdown */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-4 pb-4 space-y-1.5 border-t border-[#C98A1C]/10 pt-3">
                                      <BreakdownRow label={t('motor.basicOD')} value={formatINR(q.basicOD)} />
                                      {q.ncbDiscount > 0 && (
                                        <BreakdownRow label={t('motor.ncbDiscount')} value={`- ${formatINR(q.ncbDiscount)}`} className="text-emerald-400" />
                                      )}
                                      <BreakdownRow label={t('motor.odAfterNCB')} value={formatINR(q.odAfterNCB)} />
                                      {q.addOns.length > 0 && (
                                        <>
                                          <div className="border-t border-[#C98A1C]/8 pt-1.5 mt-1">
                                            <span className="text-[#8A96A8] text-[10px] font-medium uppercase tracking-wide">Add-ons</span>
                                          </div>
                                          {q.addOns.map((addon, aIdx) => (
                                            <BreakdownRow key={aIdx} label={addon.name} value={formatINR(addon.premium)} className="text-[#8A96A8]" />
                                          ))}
                                          <BreakdownRow label={t('motor.totalAddOns')} value={formatINR(q.totalAddOn)} className="text-[#8A96A8]" bold />
                                        </>
                                      )}
                                      <BreakdownRow label={t('motor.tpIRDAIFixed')} value={formatINR(q.tpPremium)} className="text-[#162D5A]" badge={t('motor.irdaiVerifiedMark')} />
                                      <BreakdownRow label={t('motor.paCover')} value={formatINR(q.paCover)} />
                                      <BreakdownRow label={t('motor.netPremium')} value={formatINR(q.netPremium)} bold />
                                      <BreakdownRow label={t('motor.gst18')} value={formatINR(q.gst)} className="text-[#8A96A8]" />
                                      <div className="border-t border-[#C98A1C]/20 pt-2 mt-2 flex justify-between items-center">
                                        <span className="text-[#C98A1C] font-bold text-sm">{t('motor.totalPremium')}</span>
                                        <span className="text-[#C98A1C] font-bold text-lg">{formatINR(q.totalPremium)}</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* WhatsApp CTA */}
                              <div className="px-4 pb-3">
                                <a
                                  href={`https://wa.me/919257877312?text=Hi! I need a motor insurance quote from ${q.insurerDisplayName || q.insurer}. I compared on your website.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/25 text-xs font-medium transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  Get Quote on WhatsApp
                                </a>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* Data Source Badge */}
                    <div className="flex flex-wrap items-center gap-3 justify-center">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs px-3 py-1">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {t('motor.irdaiVerifiedRates')}
                      </Badge>
                      <Badge className="bg-[#C98A1C]/10 text-[#C98A1C] border-[#C98A1C]/20 text-xs px-3 py-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {t('motor.updatedLabel')} {metaInfo?.generatedAt ? new Date(metaInfo.generatedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Mar 2026'}
                      </Badge>
                      <Badge className="bg-[#162D5A]/10 text-[#162D5A] dark:text-[#3A5090] border-[#162D5A]/20 text-xs px-3 py-1">
                        <Shield className="w-3 h-3 mr-1" />
                        {quotes[0]?.accuracy ?? '98%'} {t('motor.accuracyLabel')}
                      </Badge>
                    </div>

                    {/* WhatsApp CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Card className="bg-gradient-to-r from-[#C98A1C]/10 to-[#E0A830]/5 border-[#C98A1C]/30 overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C98A1C] to-[#E0A830]" />
                        <CardContent className="p-6 text-center space-y-4">
                          <h3 className="text-white font-bold text-lg lg:text-2xl">
                            {t('motor.getQuoteWhatsApp')}
                          </h3>
                          <p className="text-[#8A96A8] text-sm max-w-md mx-auto">
                            {t('motor.whatsappDesc')}
                          </p>
                          <a
                            href="https://wa.me/919257877312?text=Hi! I need a motor insurance quote. I compared on your website."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105"
                          >
                            <MessageCircle className="w-5 h-5" />
                            {t('motor.chatWhatsApp')}
                            <Phone className="w-4 h-4 opacity-60" />
                          </a>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Accuracy Disclaimer */}
                    <div
                      className={`${isDark ? 'bg-[#0A0E18]' : 'bg-white'} border border-[#C98A1C]/10 rounded-lg p-4`}
                    >
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-[#8A96A8] mt-0.5 shrink-0" />
                        <p className="text-[#8A96A8] text-[11px] lg:text-sm leading-relaxed">
                          <strong className="text-[#C98A1C]">Disclaimer:</strong> {t('motor.disclaimerText')}
                        </p>
                      </div>
                    </div>

                    {/* Back Button */}
                    <ShinyButton
                      variant="secondary"
                      onClick={goBack}
                      className="w-full text-sm"
                    >
                      <span className="flex items-center justify-center gap-1">
                        <ChevronLeft className="w-4 h-4" />
                        {t('motor.modifyDetails')}
                      </span>
                    </ShinyButton>
                  </div>
                )}

                {/* No Results */}
                {!isLoading && quotes.length === 0 && currentStep === 3 && (
                  <Card className={`${isDark ? 'bg-[#0A0E18]' : 'bg-white'} border-[#C98A1C]/20 shadow-xl`}>
                    <CardContent className="p-8 text-center">
                      <AlertTriangle className="w-12 h-12 text-[#C98A1C] mx-auto mb-4" />
                      <h3 className="text-white font-semibold text-lg mb-2">{t('motor.noQuotesFound')}</h3>
                      <p className="text-[#8A96A8] text-sm mb-4">
                        {t('motor.noQuotesDesc')}
                      </p>
                      <ShinyButton
                        variant="blue"
                        onClick={goBack}
                        className="text-sm"
                      >
                        <span className="flex items-center justify-center gap-1">
                          <ChevronLeft className="w-4 h-4" />
                          {t('motor.goBackModify')}
                        </span>
                      </ShinyButton>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </TooltipProvider>
  );
}

// =============================================================================
// Breakdown Row Component (for insurer card expand)
// =============================================================================
function BreakdownRow({
  label,
  value,
  className,
  bold,
  badge,
}: {
  label: string;
  value: string;
  className?: string;
  bold?: boolean;
  badge?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-xs ${bold ? 'text-white font-semibold' : 'text-[#8A96A8]'}`}>
        {label}
        {badge && (
          <Badge className="ml-1.5 bg-emerald-500/10 text-emerald-400 text-[7px] px-1 py-0 border-0 align-middle">
            {badge}
          </Badge>
        )}
      </span>
      <span className={`text-xs ${bold ? 'font-semibold text-white' : className ?? 'text-[#8A96A8]'}`}>
        {value}
      </span>
    </div>
  );
}
