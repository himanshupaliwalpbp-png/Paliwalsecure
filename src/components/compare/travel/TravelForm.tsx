'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plane,
  Globe,
  Globe2,
  Map,
  ChevronRight,
  Users,
  HeartPulse,
  Calendar,
  Clock,
  Baby,
  User,
  UserPlus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GSTNote } from '@/components/compare/shared/GSTNote';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type TravelDestination =
  | 'DOMESTIC'
  | 'ASIA'
  | 'WORLDWIDE_EXCL_USA'
  | 'WORLDWIDE_INCL_USA';

export type MedicalCover = 50000 | 100000 | 250000 | 500000;

export interface TravelFormData {
  destination: TravelDestination;
  tripDurationDays: number;
  adults: number;
  children: number;
  seniors: number;
  medicalCover: MedicalCover;
  addons: string[];
  departureDate: string;
}

interface TravelFormProps {
  onCompare: (data: TravelFormData) => void;
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const DESTINATION_OPTIONS: Array<{
  value: TravelDestination;
  label: string;
  description: string;
  icon: typeof Globe;
}> = [
  { value: 'DOMESTIC', label: 'Domestic India', description: 'Within India', icon: Map },
  { value: 'ASIA', label: 'Asia', description: 'Asia-Pacific', icon: Globe },
  { value: 'WORLDWIDE_EXCL_USA', label: 'Worldwide excl USA', description: 'Excl USA/Canada', icon: Globe2 },
  { value: 'WORLDWIDE_INCL_USA', label: 'Worldwide incl USA', description: 'Incl USA/Canada', icon: Globe2 },
];

const MEDICAL_COVER_OPTIONS: Array<{ value: MedicalCover; label: string }> = [
  { value: 50000, label: '$50K' },
  { value: 100000, label: '$100K' },
  { value: 250000, label: '$250K' },
  { value: 500000, label: '$500K' },
];

const DURATION_PRESETS = [
  { days: 7, label: '7 Days' },
  { days: 14, label: '14 Days' },
  { days: 30, label: '30 Days' },
];

const ADDON_OPTIONS = [
  { id: 'Trip Cancellation & Curtailment', label: 'Trip Cancellation', description: 'Reimburses non-refundable trip costs' },
  { id: 'Home Burglary Cover', label: 'Baggage Loss', description: 'Covers lost/delayed baggage' },
  { id: 'Hijack Distress Allowance', label: 'Flight Delay', description: 'Compensation for flight delays' },
  { id: 'Adventure Sports Cover', label: 'Adventure Sports', description: 'Skiing, scuba, bungee jumping' },
  { id: 'Personal Liability', label: 'Personal Liability', description: 'Accidental injury/damage to third party' },
  { id: 'Loss of Passport', label: 'Passport Loss', description: 'Replacement passport cost abroad' },
];

// ---------------------------------------------------------------------------
// TravelForm Component
// ---------------------------------------------------------------------------
export function TravelForm({ onCompare, loading = false }: TravelFormProps) {
  const [destination, setDestination] = useState<TravelDestination>('ASIA');
  const [tripDurationDays, setTripDurationDays] = useState(14);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [seniors, setSeniors] = useState(0);
  const [medicalCover, setMedicalCover] = useState<MedicalCover>(100000);
  const [addons, setAddons] = useState<string[]>([]);
  const [departureDate, setDepartureDate] = useState('');

  const totalTravellers = adults + children + seniors;

  const isFormValid =
    tripDurationDays >= 1 &&
    tripDurationDays <= 180 &&
    totalTravellers >= 1 &&
    departureDate.trim().length > 0;

  const toggleAddon = (addonId: string) => {
    setAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((a) => a !== addonId)
        : [...prev, addonId]
    );
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    onCompare({
      destination,
      tripDurationDays,
      adults,
      children,
      seniors,
      medicalCover,
      addons,
      departureDate,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-teal-200 dark:border-teal-800 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">✈️</span>
            Travel Insurance Comparison
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Compare quotes from 7 IRDAI-licensed insurers — 18% GST applicable
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Destination — Radio Cards */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <Globe2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Destination
            </Label>
            <RadioGroup
              value={destination}
              onValueChange={(val) => setDestination(val as TravelDestination)}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {DESTINATION_OPTIONS.map((opt) => {
                const isSelected = destination === opt.value;
                const Icon = opt.icon;
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`dest-${opt.value}`}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30 dark:border-teal-600'
                        : 'border-border hover:border-teal-300 dark:hover:border-teal-700'
                    }`}
                  >
                    <RadioGroupItem value={opt.value} id={`dest-${opt.value}`} className="sr-only" />
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-medium ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-muted-foreground'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{opt.description}</span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

          {/* Trip Duration */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Trip Duration
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                max={180}
                value={tripDurationDays}
                onChange={(e) => {
                  const val = Math.min(180, Math.max(1, Number(e.target.value) || 1));
                  setTripDurationDays(val);
                }}
                className="w-24 text-center"
              />
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            <div className="flex gap-2">
              {DURATION_PRESETS.map((preset) => (
                <Button
                  key={preset.days}
                  variant={tripDurationDays === preset.days ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTripDurationDays(preset.days)}
                  className={
                    tripDurationDays === preset.days
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'border-teal-300 text-teal-700 dark:border-teal-700 dark:text-teal-400'
                  }
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            {tripDurationDays > 30 && (
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                🎉 Long-trip discount applies! ({tripDurationDays > 60 ? '10' : '5'}% off)
              </p>
            )}
          </div>

          <Separator />

          {/* Travellers */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <Users className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Travellers
            </Label>
            <div className="grid grid-cols-3 gap-4">
              {/* Adults */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Adults (18-59)
                </Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setAdults(Math.max(0, adults - 1))} disabled={adults <= 0} className="h-8 w-8 p-0">−</Button>
                  <span className="text-sm font-semibold w-6 text-center tabular-nums">{adults}</span>
                  <Button variant="outline" size="sm" onClick={() => setAdults(Math.min(6, adults + 1))} disabled={adults >= 6} className="h-8 w-8 p-0">+</Button>
                </div>
              </div>
              {/* Children */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Baby className="h-3 w-3" /> Children (0-17)
                </Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setChildren(Math.max(0, children - 1))} disabled={children <= 0} className="h-8 w-8 p-0">−</Button>
                  <span className="text-sm font-semibold w-6 text-center tabular-nums">{children}</span>
                  <Button variant="outline" size="sm" onClick={() => setChildren(Math.min(4, children + 1))} disabled={children >= 4} className="h-8 w-8 p-0">+</Button>
                </div>
              </div>
              {/* Seniors */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <UserPlus className="h-3 w-3" /> Seniors (60+)
                </Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSeniors(Math.max(0, seniors - 1))} disabled={seniors <= 0} className="h-8 w-8 p-0">−</Button>
                  <span className="text-sm font-semibold w-6 text-center tabular-nums">{seniors}</span>
                  <Button variant="outline" size="sm" onClick={() => setSeniors(Math.min(2, seniors + 1))} disabled={seniors >= 2} className="h-8 w-8 p-0">+</Button>
                </div>
              </div>
            </div>
            {totalTravellers === 0 && (
              <p className="text-xs text-red-500 font-medium">Please add at least one traveller</p>
            )}
            {seniors > 0 && (
              <Badge variant="outline" className="border-amber-400 text-amber-700 dark:border-amber-600 dark:text-amber-400 text-[10px]">
                Senior loading (2.8×) applies for travellers aged 60+
              </Badge>
            )}
          </div>

          <Separator />

          {/* Medical Cover — Radio Cards */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <HeartPulse className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Medical Cover
            </Label>
            <RadioGroup
              value={String(medicalCover)}
              onValueChange={(val) => setMedicalCover(Number(val) as MedicalCover)}
              className="grid grid-cols-4 gap-2"
            >
              {MEDICAL_COVER_OPTIONS.map((opt) => {
                const isSelected = medicalCover === opt.value;
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`mc-${opt.value}`}
                    className={`flex items-center justify-center p-2.5 rounded-lg border-2 cursor-pointer transition-all text-center ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30 dark:border-teal-600'
                        : 'border-border hover:border-teal-300 dark:hover:border-teal-700'
                    }`}
                  >
                    <RadioGroupItem value={String(opt.value)} id={`mc-${opt.value}`} className="sr-only" />
                    <span className={`text-xs font-semibold ${isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-muted-foreground'}`}>
                      {opt.label}
                    </span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

          {/* Add-ons */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Add-Ons</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ADDON_OPTIONS.map((addon) => (
                <Label
                  key={addon.id}
                  htmlFor={`taddon-${addon.id}`}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    addons.includes(addon.id)
                      ? 'border-teal-400 bg-teal-50 dark:border-teal-700 dark:bg-teal-950/30'
                      : 'border-border hover:border-teal-300 dark:hover:border-teal-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`taddon-${addon.id}`}
                    checked={addons.includes(addon.id)}
                    onChange={() => toggleAddon(addon.id)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-tight">{addon.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{addon.description}</p>
                  </div>
                </Label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Departure Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Departure Date
            </Label>
            <Input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="max-w-xs"
            />
          </div>

          {/* GST Note */}
          <GSTNote category="travel" />

          <Separator />

          {/* Compare Button */}
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Comparing Quotes...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Compare Now
                <ChevronRight className="h-5 w-5" />
              </span>
            )}
          </Button>

          {!isFormValid && (
            <p className="text-[10px] text-muted-foreground text-center">
              Please add at least one traveller, set trip duration (1-180 days), and select a departure date
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
