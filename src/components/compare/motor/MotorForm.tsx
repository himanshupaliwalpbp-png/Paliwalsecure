'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Car, Bike, Zap, ChevronRight, IndianRupee, Info } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IDV_DEPRECIATION_RATES, ADDON_DEFINITIONS } from '@/lib/compare/motor-rates';
import { formatINR } from '@/lib/compare/compare-engine';
import {
  getVehicleDisplayList,
  getUniqueMakes,
  getModelsByMake,
  type VehicleCategory,
  type VehicleModel,
} from '@/lib/compare/vehicle-database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric';

export interface MotorFormData {
  vehicleCategory: VehicleCategory;
  vehicleId: string;
  makeModel: string;
  fuelType: FuelType;
  registrationYear: number;
  rtoCode: string;
  exShowroomPrice: number;
  engineCC: number;
  seatingCapacity: number;
  ncbYears: number;
  addons: string[];
}

interface MotorFormProps {
  onCompare: (data: MotorFormData) => void;
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Vehicle & Model Data
// ---------------------------------------------------------------------------
const VEHICLE_OPTION_KEYS: { value: VehicleCategory; labelKey: string; icon: typeof Car; fuelDefault: FuelType }[] = [
  { value: 'Car', labelKey: 'motorCompare.car', icon: Car, fuelDefault: 'Petrol' },
  { value: 'Bike', labelKey: 'motorCompare.bike', icon: Bike, fuelDefault: 'Petrol' },
  { value: 'EV_CAR', labelKey: 'motorCompare.evCar', icon: Zap, fuelDefault: 'Electric' },
  { value: 'EV_BIKE', labelKey: 'motorCompare.evScooter', icon: Zap, fuelDefault: 'Electric' },
];

const FUEL_OPTIONS: Record<VehicleCategory, FuelType[]> = {
  Car: ['Petrol', 'Diesel', 'CNG'],
  Bike: ['Petrol'],
  EV_CAR: ['Electric'],
  EV_BIKE: ['Electric'],
};

const REGISTRATION_YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

// ---------------------------------------------------------------------------
// Zone Helper
// ---------------------------------------------------------------------------
const ZONE_A_RTO_PREFIXES = ['DL', 'MH01', 'MH02', 'MH03', 'KA', 'TN01', 'TN02', 'GJ01', 'TS', 'AP01', 'PN'];

function getZone(rtoCode: string): 'A' | 'B' {
  const prefix = rtoCode.trim().toUpperCase().slice(0, 2);
  return ZONE_A_RTO_PREFIXES.some((z) => rtoCode.trim().toUpperCase().startsWith(z)) ? 'A' : 'B';
}

export { getZone };

// ---------------------------------------------------------------------------
// MotorForm Component
// ---------------------------------------------------------------------------
export function MotorForm({ onCompare, loading = false }: MotorFormProps) {
  const { t } = useLanguage();
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('Car');
  const [selectedMake, setSelectedMake] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [registrationYear, setRegistrationYear] = useState(2023);
  const [rtoCode, setRtoCode] = useState('');
  const [exShowroomPrice, setExShowroomPrice] = useState(800000);
  const [engineCC, setEngineCC] = useState(1197);
  const [seatingCapacity, setSeatingCapacity] = useState(5);
  const [ncbYears, setNcbYears] = useState(0);
  const [addons, setAddons] = useState<string[]>([]);

  const isEV = vehicleCategory === 'EV_CAR' || vehicleCategory === 'EV_BIKE';

  // Get makes and models for the selected category
  const makes = useMemo(() => getUniqueMakes(vehicleCategory), [vehicleCategory]);
  const filteredModels = useMemo(() => {
    if (!selectedMake) return getVehicleDisplayList(vehicleCategory);
    const models = getModelsByMake(vehicleCategory, selectedMake);
    return models.map((v) => {
      const priceLakh = (v.exShowroomPrice / 100000).toFixed(2);
      const ccInfo = v.engineCC > 0 ? `${v.engineCC}cc` : `${v.powerKW}kW`;
      return {
        id: v.id,
        label: `${v.model} (${v.variant}) — ₹${priceLakh}L · ${ccInfo} · ${v.fuelType}`,
        vehicle: v,
      };
    });
  }, [vehicleCategory, selectedMake]);

  // Selected vehicle details
  const selectedVehicle = useMemo<VehicleModel | null>(() => {
    if (!vehicleId) return null;
    return filteredModels.find((m) => m.id === vehicleId)?.vehicle ?? null;
  }, [vehicleId, filteredModels]);

  // Available add-ons for this vehicle type
  const availableAddons = useMemo(() => {
    return ADDON_DEFINITIONS.filter((a) => a.appliesTo.includes(vehicleCategory));
  }, [vehicleCategory]);

  // Real-time IDV estimate
  const idvEstimate = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const ageYears = Math.max(0, currentYear - registrationYear);
    const depKey = ageYears === 0 ? 0 : ageYears >= 5 ? 5 : ageYears;
    const depRate = IDV_DEPRECIATION_RATES[depKey] ?? 0.45;
    return Math.round(exShowroomPrice * (1 - depRate));
  }, [exShowroomPrice, registrationYear]);

  // Estimated OD premium (average rate) for add-on cost preview
  const estimatedODPremium = useMemo(() => {
    const avgRate = vehicleCategory === 'Car' || vehicleCategory === 'EV_CAR' ? 1.60 : 0.95;
    return Math.round((idvEstimate * avgRate) / 100);
  }, [idvEstimate, vehicleCategory]);

  // Auto-set fuel type when vehicle category changes
  const handleVehicleCategoryChange = useCallback((val: VehicleCategory) => {
    setVehicleCategory(val);
    const option = VEHICLE_OPTIONS.find((o) => o.value === val);
    if (option) setFuelType(option.fuelDefault);
    setSelectedMake('');
    setVehicleId('');
    // Remove addons that don't apply to new category
    const validAddonIds = ADDON_DEFINITIONS.filter((a) => a.appliesTo.includes(val)).map((a) => a.id);
    setAddons((prev) => prev.filter((a) => validAddonIds.includes(a)));
  }, []);

  // Auto-fill price/CC when a model is selected
  const handleModelSelect = useCallback((id: string) => {
    setVehicleId(id);
    const model = filteredModels.find((m) => m.id === id)?.vehicle;
    if (model) {
      setExShowroomPrice(model.exShowroomPrice);
      setEngineCC(model.engineCC);
      setSeatingCapacity(model.seatingCapacity);
      setFuelType(model.fuelType as FuelType);
    }
  }, [filteredModels]);

  // Addon toggle
  const toggleAddon = (addonId: string) => {
    setAddons((prev) =>
      prev.includes(addonId) ? prev.filter((a) => a !== addonId) : [...prev, addonId]
    );
  };

  // Estimate add-on cost for display
  const getAddonEstimatedCost = (addonDef: typeof ADDON_DEFINITIONS[number]): number => {
    if (addonDef.type === 'percent' && addonDef.defaultRatePercent) {
      return Math.round(estimatedODPremium * addonDef.defaultRatePercent);
    }
    return addonDef.defaultFlatRate ?? 0;
  };

  // Submit
  const handleSubmit = () => {
    const displayName = selectedVehicle
      ? `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.variant}`
      : `Custom ${vehicleCategory}`;
    onCompare({
      vehicleCategory,
      vehicleId,
      makeModel: displayName,
      fuelType,
      registrationYear,
      rtoCode,
      exShowroomPrice,
      engineCC,
      seatingCapacity,
      ncbYears,
      addons,
    });
  };

  const isFormValid = exShowroomPrice > 0 && rtoCode.trim().length >= 2 && vehicleId.trim().length > 0;

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-amber-200 dark:border-amber-800 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <span className="text-2xl">🚘</span>
              {t('motorCompare.title')}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('motorCompare.subtitle')}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Vehicle Type */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">{t('motorCompare.vehicleType')}</Label>
              <RadioGroup
                value={vehicleCategory}
                onValueChange={(val) => handleVehicleCategoryChange(val as VehicleCategory)}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {VEHICLE_OPTION_KEYS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = vehicleCategory === opt.value;
                  return (
                    <Label
                      key={opt.value}
                      htmlFor={`vtype-${opt.value}`}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600'
                          : 'border-border hover:border-amber-300 dark:hover:border-amber-700'
                      }`}
                    >
                      <RadioGroupItem value={opt.value} id={`vtype-${opt.value}`} className="sr-only" />
                      <Icon className={`h-6 w-6 ${isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`} />
                      <span className={`text-xs font-medium ${isSelected ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}`}>
                        {t(opt.labelKey)}
                      </span>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>

            <Separator />

            {/* Make Filter + Model Select + Fuel Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('motorCompare.make')}</Label>
                <Select value={selectedMake} onValueChange={(val) => { setSelectedMake(val); setVehicleId(''); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('motorCompare.allMakes')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">{t('motorCompare.allMakes')}</SelectItem>
                    {makes.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('motorCompare.modelVariant')}</Label>
                <Select value={vehicleId} onValueChange={handleModelSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('motorCompare.selectModel')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {filteredModels.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <span className="text-xs">{item.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('motorCompare.fuelType')}</Label>
                <Select value={fuelType} onValueChange={(val) => setFuelType(val as FuelType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FUEL_OPTIONS[vehicleCategory].map((ft) => (
                      <SelectItem key={ft} value={ft}>
                        {ft}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vehicle info summary */}
            {selectedVehicle && (
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {selectedVehicle.engineCC > 0 ? `${selectedVehicle.engineCC}cc` : `${selectedVehicle.powerKW}kW`}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {selectedVehicle.fuelType}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {selectedVehicle.seatingCapacity} {t('motorCompare.seater')}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {selectedVehicle.segment}
                </Badge>
              </div>
            )}

            {/* Registration Year + RTO Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('motorCompare.registrationYear')}</Label>
                <Select
                  value={String(registrationYear)}
                  onValueChange={(val) => setRegistrationYear(Number(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGISTRATION_YEARS.map((yr) => (
                      <SelectItem key={yr} value={String(yr)}>
                        {yr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('motorCompare.rtoCode')}</Label>
                <Input
                  placeholder={t('motorCompare.rtoPlaceholder')}
                  value={rtoCode}
                  onChange={(e) => setRtoCode(e.target.value.toUpperCase())}
                  className="uppercase"
                  maxLength={6}
                />
                {rtoCode.trim().length >= 2 && (
                  <Badge variant="outline" className="text-[10px]">
                    {t('motorCompare.zone')} {getZone(rtoCode)} {getZone(rtoCode) === 'A' ? t('motorCompare.metro') : t('motorCompare.nonMetro')}
                  </Badge>
                )}
              </div>
            </div>

            {/* Ex-Showroom Price */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('motorCompare.exShowroomPrice')}</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  value={exShowroomPrice || ''}
                  onChange={(e) => setExShowroomPrice(Number(e.target.value))}
                  className="pl-9"
                  placeholder={t('motorCompare.enterPrice')}
                  min={1}
                />
              </div>
              {exShowroomPrice > 0 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-[10px]">
                    {t('motorCompare.estimatedIDV')} {formatINR(idvEstimate)}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    ({(() => {
                      const age = Math.max(0, new Date().getFullYear() - registrationYear);
                      const depKey = age === 0 ? 0 : age >= 5 ? 5 : age;
                      const depRate = IDV_DEPRECIATION_RATES[depKey] ?? 0.45;
                      return `${(depRate * 100).toFixed(0)}% depreciation → ${((1 - depRate) * 100).toFixed(0)}% ${t('motorCompare.depreciationOfExShowroom')}`;
                    })()})
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* NCB Years Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{t('motorCompare.ncbYears')}</Label>
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs px-3">
                  {ncbYears} {ncbYears === 1 ? t('motorCompare.year') : t('motorCompare.years')}
                  {ncbYears > 0 && (
                    <span className="ml-1">
                      → {ncbYears === 1 ? '20' : ncbYears === 2 ? '25' : ncbYears === 3 ? '35' : ncbYears === 4 ? '45' : '50'}%
                    </span>
                  )}
                </Badge>
              </div>
              <Slider
                min={0}
                max={5}
                step={1}
                value={[ncbYears]}
                onValueChange={(val) => setNcbYears(val[0])}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{t('motorCompare.noNCB')}</span>
                <span>{t('motorCompare.maxNCB')}</span>
              </div>
            </div>

            <Separator />

            {/* Add-ons with estimated cost */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-semibold">{t('motorCompare.addons')}</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    {t('motorCompare.addonTooltip')}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableAddons.map((addon) => {
                  const estCost = getAddonEstimatedCost(addon);
                  const isEVAddon = addon.id === 'evMotorCover' || addon.id === 'electricSurge';
                  return (
                    <Label
                      key={addon.id}
                      htmlFor={`addon-${addon.id}`}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        addons.includes(addon.id)
                          ? isEVAddon
                            ? 'border-green-400 bg-green-50 dark:border-green-700 dark:bg-green-950/30'
                            : 'border-amber-400 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30'
                          : 'border-border hover:border-amber-300 dark:hover:border-amber-700'
                      }`}
                    >
                      <Checkbox
                        id={`addon-${addon.id}`}
                        checked={addons.includes(addon.id)}
                        onCheckedChange={() => toggleAddon(addon.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-medium leading-tight">{addon.label}</p>
                          {isEVAddon && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 text-[8px] h-4 px-1">
                              EV
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                          {addon.description}
                        </p>
                        <p className={`text-[10px] font-medium mt-1 ${
                          addons.includes(addon.id)
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-muted-foreground/70'
                        }`}>
                          ~{formatINR(estCost)}
                          {addon.type === 'percent' ? ` (${t('motorCompare.pctOfOD')})` : ` (${t('motorCompare.flat')})`}
                        </p>
                      </div>
                    </Label>
                  );
                })}
              </div>
              {addons.length > 0 && (
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {addons.length} {addons.length === 1 ? t('motorCompare.addonsSelected') : t('motorCompare.addonsSelectedPlural')} ~{formatINR(addons.reduce((sum, id) => {
                    const def = ADDON_DEFINITIONS.find((a) => a.id === id);
                    return sum + (def ? getAddonEstimatedCost(def) : 0);
                  }, 0))}
                </div>
              )}
            </div>

            <Separator />

            {/* Compare Button */}
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className="w-full h-12 text-base font-bold bg-gradient-to-r from-[#C98A1C] to-[#0A1330] hover:from-[#0A1330] hover:to-[#0F1C40] text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('motorCompare.comparingQuotes')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {t('motorCompare.compareNow')}
                  <ChevronRight className="h-5 w-5" />
                </span>
              )}
            </Button>

            {!isFormValid && (
              <p className="text-[10px] text-muted-foreground text-center">
                {t('motorCompare.fillRequired')}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}
