'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  ChevronRight,
  Shield,
  Building2,
  MapPin,
  TreePine,
  TreePalm,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GSTNote } from '@/components/compare/shared/GSTNote';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type HomeCoverType = 'STRUCTURE_ONLY' | 'STRUCTURE_CONTENTS' | 'CONTENTS_ONLY';

export type PropertyType = 'APARTMENT' | 'INDEPENDENT_HOUSE' | 'VILLA';

export interface HomeFormData {
  coverType: HomeCoverType;
  propertyType: PropertyType;
  structureSI: number;
  contentsSI: number;
  state: string;
  city: string;
  earthquakeCover: boolean;
  burglaryCover: boolean;
}

interface HomeFormProps {
  onCompare: (data: HomeFormData) => void;
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const COVER_TYPE_OPTIONS: Array<{
  value: HomeCoverType;
  label: string;
  description: string;
  icon: typeof Shield;
}> = [
  { value: 'STRUCTURE_ONLY', label: 'Structure Only', description: 'Building / structure cover', icon: Building2 },
  { value: 'STRUCTURE_CONTENTS', label: 'Structure + Contents', description: 'Full property cover', icon: Home },
  { value: 'CONTENTS_ONLY', label: 'Contents Only', description: 'Household items cover', icon: Shield },
];

const PROPERTY_TYPE_OPTIONS: Array<{
  value: PropertyType;
  label: string;
  icon: typeof Building2;
}> = [
  { value: 'APARTMENT', label: 'Apartment', icon: Building2 },
  { value: 'INDEPENDENT_HOUSE', label: 'Independent House', icon: Home },
  { value: 'VILLA', label: 'Villa', icon: TreePalm },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const HIGH_SEISMIC_STATES = [
  'Gujarat', 'Maharashtra', 'Bihar', 'Himachal Pradesh', 'Uttarakhand',
  'Jammu & Kashmir', 'Sikkim',
];

const FLOOD_PRONE_CITIES = [
  'Mumbai', 'Chennai', 'Kolkata', 'Hyderabad', 'Patna', 'Guwahati', 'Srinagar',
];

// ---------------------------------------------------------------------------
// Indian Number Formatter (for slider display)
// ---------------------------------------------------------------------------
function formatINRShort(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(0)}L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

// ---------------------------------------------------------------------------
// HomeForm Component
// ---------------------------------------------------------------------------
export function HomeForm({ onCompare, loading = false }: HomeFormProps) {
  const [coverType, setCoverType] = useState<HomeCoverType>('STRUCTURE_CONTENTS');
  const [propertyType, setPropertyType] = useState<PropertyType>('APARTMENT');
  const [structureSI, setStructureSI] = useState(3000000); // ₹30L default
  const [contentsSI, setContentsSI] = useState(500000); // ₹5L default
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [earthquakeCover, setEarthquakeCover] = useState(false);
  const [burglaryCover, setBurglaryCover] = useState(false);

  const showStructureSI = coverType === 'STRUCTURE_ONLY' || coverType === 'STRUCTURE_CONTENTS';
  const showContentsSI = coverType === 'CONTENTS_ONLY' || coverType === 'STRUCTURE_CONTENTS';
  const showBurglaryOption = showContentsSI;

  const isHighSeismic = HIGH_SEISMIC_STATES.some((s) => s === state);
  const isFloodProne = FLOOD_PRONE_CITIES.some((c) => c.toLowerCase() === city.toLowerCase());

  const isFormValid =
    state.trim().length > 0 &&
    city.trim().length > 0 &&
    (showStructureSI ? structureSI >= 100000 : true) &&
    (showContentsSI ? contentsSI >= 100000 : true);

  const handleSubmit = () => {
    if (!isFormValid) return;
    onCompare({
      coverType,
      propertyType,
      structureSI: showStructureSI ? structureSI : 0,
      contentsSI: showContentsSI ? contentsSI : 0,
      state,
      city,
      earthquakeCover,
      burglaryCover,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">🏠</span>
            Home Insurance Comparison
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Compare quotes from 8 IRDAI-licensed insurers — 18% GST applicable
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Cover Type — Radio Cards */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Cover Type</Label>
            <RadioGroup
              value={coverType}
              onValueChange={(val) => setCoverType(val as HomeCoverType)}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {COVER_TYPE_OPTIONS.map((opt) => {
                const isSelected = coverType === opt.value;
                const Icon = opt.icon;
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`ct-${opt.value}`}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-600'
                        : 'border-border hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <RadioGroupItem value={opt.value} id={`ct-${opt.value}`} className="sr-only" />
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-medium ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}`}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{opt.description}</span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

          {/* Property Type — Radio */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Property Type</Label>
            <RadioGroup
              value={propertyType}
              onValueChange={(val) => setPropertyType(val as PropertyType)}
              className="grid grid-cols-3 gap-3"
            >
              {PROPERTY_TYPE_OPTIONS.map((opt) => {
                const isSelected = propertyType === opt.value;
                const Icon = opt.icon;
                return (
                  <Label
                    key={opt.value}
                    htmlFor={`pt-${opt.value}`}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-600'
                        : 'border-border hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <RadioGroupItem value={opt.value} id={`pt-${opt.value}`} className="sr-only" />
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-medium ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}`}>
                      {opt.label}
                    </span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

          {/* Sum Insured (Structure) Slider */}
          {showStructureSI && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Sum Insured (Structure)</Label>
                <Badge variant="outline" className="text-xs font-bold tabular-nums">
                  {formatINRShort(structureSI)}
                </Badge>
              </div>
              <Slider
                value={[structureSI]}
                min={100000}
                max={50000000}
                step={100000}
                onValueChange={(val) => setStructureSI(val[0])}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>₹10L</span>
                <span>₹5Cr</span>
              </div>
            </div>
          )}

          {/* Sum Insured (Contents) Slider */}
          {showContentsSI && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Sum Insured (Contents)</Label>
                <Badge variant="outline" className="text-xs font-bold tabular-nums">
                  {formatINRShort(contentsSI)}
                </Badge>
              </div>
              <Slider
                value={[contentsSI]}
                min={100000}
                max={5000000}
                step={50000}
                onValueChange={(val) => setContentsSI(val[0])}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>₹1L</span>
                <span>₹50L</span>
              </div>
            </div>
          )}

          <Separator />

          {/* State Dropdown */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {INDIAN_STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isHighSeismic && (
              <Badge variant="outline" className="border-red-400 text-red-700 dark:border-red-600 dark:text-red-400 text-[10px]">
                <AlertTriangle className="h-3 w-3 mr-1" />
                High-seismic zone — 1.25× loading applies
              </Badge>
            )}
          </div>

          {/* City Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              City
            </Label>
            <Input
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {isFloodProne && (
              <Badge variant="outline" className="border-amber-400 text-amber-700 dark:border-amber-600 dark:text-amber-400 text-[10px]">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Flood-prone city — 1.20× loading applies
              </Badge>
            )}
          </div>

          <Separator />

          {/* Earthquake Cover */}
          {showStructureSI && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Earthquake Cover</Label>
              <RadioGroup
                value={earthquakeCover ? 'yes' : 'no'}
                onValueChange={(val) => setEarthquakeCover(val === 'yes')}
                className="flex gap-4"
              >
                <Label
                  htmlFor="eq-yes"
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                    earthquakeCover
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                      : 'border-border hover:border-emerald-300'
                  }`}
                >
                  <RadioGroupItem value="yes" id="eq-yes" />
                  <span className="text-xs font-medium">Yes</span>
                  <span className="text-[10px] text-muted-foreground">(+seismic rate)</span>
                </Label>
                <Label
                  htmlFor="eq-no"
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                    !earthquakeCover
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                      : 'border-border hover:border-emerald-300'
                  }`}
                >
                  <RadioGroupItem value="no" id="eq-no" />
                  <span className="text-xs font-medium">No</span>
                  <span className="text-[10px] text-muted-foreground">(standard rate)</span>
                </Label>
              </RadioGroup>
            </div>
          )}

          {/* Burglary Cover (for contents) */}
          {showBurglaryOption && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Burglary Cover (Contents)</Label>
              <RadioGroup
                value={burglaryCover ? 'yes' : 'no'}
                onValueChange={(val) => setBurglaryCover(val === 'yes')}
                className="flex gap-4"
              >
                <Label
                  htmlFor="burg-yes"
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                    burglaryCover
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                      : 'border-border hover:border-emerald-300'
                  }`}
                >
                  <RadioGroupItem value="yes" id="burg-yes" />
                  <span className="text-xs font-medium">Yes</span>
                  <span className="text-[10px] text-muted-foreground">(+burglary rate)</span>
                </Label>
                <Label
                  htmlFor="burg-no"
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                    !burglaryCover
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                      : 'border-border hover:border-emerald-300'
                  }`}
                >
                  <RadioGroupItem value="no" id="burg-no" />
                  <span className="text-xs font-medium">No</span>
                  <span className="text-[10px] text-muted-foreground">(standard rate)</span>
                </Label>
              </RadioGroup>
            </div>
          )}

          {/* GST Note */}
          <GSTNote category="home" />

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
                <Home className="h-5 w-5" />
                Compare Now
                <ChevronRight className="h-5 w-5" />
              </span>
            )}
          </Button>

          {!isFormValid && (
            <p className="text-[10px] text-muted-foreground text-center">
              Please select a state and enter a city name
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
