'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Shield, Car, IndianRupee, ChevronRight, Info,
  Calculator, Cigarette, User, Users, Baby, Clock, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  calculateHealthPremium,
  calculateTermPremium,
  calculateMotorPremium,
  formatRupees,
  formatIndianCurrency,
  type HealthCalcInput,
  type TermCalcInput,
  type MotorCalcInput,
  type PremiumBreakdown,
} from '@/lib/premiumUtils';

// ── Tooltip helper for insurance terms ────────────────────
function InfoTip({ text }: { text: string }) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center ml-1 text-muted-foreground hover:text-blue-500 transition-colors" aria-label="Info">
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px] text-xs leading-relaxed">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ── Breakdown Card ────────────────────────────────────────
function BreakdownCard({ breakdown, type }: { breakdown: PremiumBreakdown; type: 'health' | 'term' | 'motor' }) {
  const gradientMap = {
    health: 'from-rose-500 to-pink-600',
    term: 'from-blue-500 to-indigo-600',
    motor: 'from-amber-500 to-orange-600',
  };
  const iconMap = { health: Heart, term: Shield, motor: Car };
  const labelMap = { health: 'Health Insurance', term: 'Term Life Insurance', motor: 'Motor Insurance' };
  const Icon = iconMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden border-0 shadow-xl rounded-2xl bg-card">
        {/* Header gradient */}
        <div className={`bg-gradient-to-r ${gradientMap[type]} px-6 py-4`}>
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-lg">{labelMap[type]} Premium</p>
              <p className="text-white/80 text-xs">Estimated quote based on your details</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-5">
          {/* Premium highlight */}
          <div className="flex items-end gap-6">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Monthly</p>
              <p className="text-3xl sm:text-4xl font-extrabold gradient-text tracking-tight">
                {formatRupees(breakdown.totalMonthly)}
              </p>
              <p className="text-xs text-muted-foreground">incl. GST</p>
            </div>
            <div className="border-l border-border pl-6">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Yearly</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {formatRupees(breakdown.totalYearly)}
              </p>
              <p className="text-xs text-muted-foreground">incl. GST</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Itemized breakdown */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Breakdown</p>

            {/* Base premium */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Base premium</span>
              <span className="font-medium">+{formatRupees(breakdown.base)}</span>
            </div>

            {/* Loadings */}
            {breakdown.loadings.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  {item.amount >= 0 ? (
                    <span className="text-rose-500 text-xs font-bold">+</span>
                  ) : (
                    <span className="text-emerald-500 text-xs font-bold">−</span>
                  )}
                  {item.name}
                </span>
                <span className={`font-medium ${item.amount >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {item.amount >= 0 ? '+' : ''}{formatRupees(Math.abs(item.amount))}
                </span>
              </div>
            ))}

            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm pt-2 border-t border-dashed border-border">
              <span className="font-semibold text-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">{formatRupees(breakdown.subtotal)}</span>
            </div>

            {/* GST */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center">
                GST (18%)
                <InfoTip text="Insurance par 18% GST lagta hai, jo government ke rules ke according mandatory hai." />
              </span>
              <span className="font-medium text-amber-600">+{formatRupees(breakdown.gst)}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* CTA */}
          <Button
            onClick={() => {
              const el = document.getElementById('insuregpt-chat');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl h-12 text-base font-semibold gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4" />
            Get Personalized Plans from InsureGPT
            <ChevronRight className="w-4 h-4" />
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">
            *Yeh estimated premium hai. Actual premium insurer ke underwriting rules pe depend karta hai.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Health Tab ────────────────────────────────────────────
function HealthTab() {
  const [age, setAge] = useState(30);
  const [sumInsured, setSumInsured] = useState('5');
  const [familyComp, setFamilyComp] = useState<HealthCalcInput['familyComposition']>('self');
  const [peds, setPeds] = useState<string[]>([]);
  const [cityTier, setCityTier] = useState<1 | 2 | 3>(2);
  const [smoker, setSmoker] = useState(false);
  const [result, setResult] = useState<PremiumBreakdown | null>(null);

  const calculate = useCallback(() => {
    const input: HealthCalcInput = {
      age,
      sumInsured: Number(sumInsured),
      familyComposition: familyComp,
      preExistingDiseases: peds,
      cityTier,
      smoker,
    };
    setResult(calculateHealthPremium(input));
  }, [age, sumInsured, familyComp, peds, cityTier, smoker]);

  const togglePed = (disease: string) => {
    setPeds(prev => prev.includes(disease) ? prev.filter(d => d !== disease) : [...prev, disease]);
  };

  const familyOptions: { value: HealthCalcInput['familyComposition']; label: string; icon: React.ElementType }[] = [
    { value: 'self', label: 'Self Only', icon: User },
    { value: 'self-spouse', label: 'Self + Spouse', icon: Users },
    { value: 'self-spouse-kids', label: 'Family Floater', icon: Baby },
    { value: 'self-parents', label: 'Self + Parents', icon: Clock },
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Form */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="glass-card rounded-2xl border-0 shadow-lg bg-card">
          <CardContent className="p-6 space-y-6">
            {/* Age slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center">
                  Age
                  <InfoTip text="Premium age ke saath badhta hai — jaldi karein, kam pay karein!" />
                </Label>
                <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
                  {age} years
                </Badge>
              </div>
              <Slider
                value={[age]}
                onValueChange={(v) => setAge(v[0])}
                min={18}
                max={80}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>18 yrs</span>
                <span>80 yrs</span>
              </div>
            </div>

            {/* Sum Insured */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center">
                Sum Insured
                <InfoTip text="Sum Insured = maximum amount insurance company pay karegi ek year mein." />
              </Label>
              <Select value={sumInsured} onValueChange={setSumInsured}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">₹5 Lakh</SelectItem>
                  <SelectItem value="10">₹10 Lakh</SelectItem>
                  <SelectItem value="25">₹25 Lakh</SelectItem>
                  <SelectItem value="50">₹50 Lakh</SelectItem>
                  <SelectItem value="100">₹1 Crore</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Family Composition */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center">
                Family Composition
                <InfoTip text="Kitne log cover honge? Family floater mein sab ek policy mein covered hain." />
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {familyOptions.map((opt) => {
                  const OptIcon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFamilyComp(opt.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        familyComp === opt.value
                          ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/40 dark:border-blue-700 dark:text-blue-300 shadow-sm'
                          : 'bg-background border-border text-muted-foreground hover:border-blue-200 hover:text-blue-600'
                      }`}
                    >
                      <OptIcon className="w-4 h-4 shrink-0" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pre-existing Diseases */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center">
                Pre-existing Diseases (PED)
                <InfoTip text="Agar aapko pehle se koi bimari hai toh premium thoda badh jayega, lekin cover zaroor milega!" />
              </Label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'diabetes', label: 'Diabetes' },
                  { id: 'bp', label: 'BP / Hypertension' },
                  { id: 'heart', label: 'Heart Disease' },
                ].map((d) => (
                  <label key={d.id} className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox
                      checked={peds.includes(d.id)}
                      onCheckedChange={() => togglePed(d.id)}
                    />
                    <span className={peds.includes(d.id) ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                      {d.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* City Tier */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center">
                City Tier
                <InfoTip text="Tier-1 cities (Metro) mein healthcare zyada expensive hota hai, isliye premium bhi zyada lagta hai." />
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 1 as const, label: 'Tier 1', sublabel: 'Metro' },
                  { value: 2 as const, label: 'Tier 2', sublabel: 'Standard' },
                  { value: 3 as const, label: 'Tier 3', sublabel: 'Discount' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCityTier(opt.value)}
                    className={`px-3 py-2.5 rounded-xl text-center transition-all duration-200 border ${
                      cityTier === opt.value
                        ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/40 dark:border-blue-700 dark:text-blue-300 shadow-sm'
                        : 'bg-background border-border text-muted-foreground hover:border-blue-200'
                    }`}
                  >
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className="text-[10px] opacity-70">{opt.sublabel}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Smoker toggle */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold flex items-center">
                <Cigarette className="w-4 h-4 mr-1.5 text-amber-500" />
                Smoker?
                <InfoTip text="Smokers ko zyada premium lagta hai kyunki health risks zyada hote hain." />
              </Label>
              <Switch checked={smoker} onCheckedChange={setSmoker} />
            </div>

            {/* Calculate button */}
            <Button
              onClick={calculate}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl h-12 text-base font-semibold gap-2 shadow-lg shadow-rose-500/20 transition-all duration-300"
            >
              <Calculator className="w-4 h-4" />
              Calculate Health Premium
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Result */}
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {result ? (
            <BreakdownCard breakdown={result} type="health" />
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="glass-card rounded-2xl border-0 shadow-lg bg-card">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8 text-rose-400" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Apni details bhariye aur <span className="gradient-text font-semibold">Health Premium</span> calculate karein
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    IRDAI 2025-26 data ke saath accurate estimate
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Term Life Tab ─────────────────────────────────────────
function TermTab() {
  const [age, setAge] = useState(30);
  const [sumAssured, setSumAssured] = useState('1');
  const [policyTerm, setPolicyTerm] = useState('30');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [smoker, setSmoker] = useState(false);
  const [result, setResult] = useState<PremiumBreakdown | null>(null);

  const calculate = useCallback(() => {
    const input: TermCalcInput = {
      age,
      sumAssured: Number(sumAssured),
      policyTerm: Number(policyTerm),
      gender,
      smoker,
    };
    setResult(calculateTermPremium(input));
  }, [age, sumAssured, policyTerm, gender, smoker]);

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Form */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="glass-card rounded-2xl border-0 shadow-lg bg-card">
          <CardContent className="p-6 space-y-6">
            {/* Age slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center">
                  Age
                  <InfoTip text="Jitni chhoti umar, utna kam premium. Term plan jaldi lena hamesha faydemand!" />
                </Label>
                <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
                  {age} years
                </Badge>
              </div>
              <Slider
                value={[age]}
                onValueChange={(v) => setAge(v[0])}
                min={18}
                max={65}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>18 yrs</span>
                <span>65 yrs</span>
              </div>
            </div>

            {/* Sum Assured */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center">
                Sum Assured (Cover Amount)
                <InfoTip text="Sum Assured = family ko kitna milega aapke na rahne pe. Zyada cover = zyada protection." />
              </Label>
              <Select value={sumAssured} onValueChange={setSumAssured}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">₹50 Lakh</SelectItem>
                  <SelectItem value="1">₹1 Crore</SelectItem>
                  <SelectItem value="2">₹2 Crore</SelectItem>
                  <SelectItem value="5">₹5 Crore</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Policy Term */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center">
                Policy Term
                <InfoTip text="Kitne saal tak cover chahiye? Longer term = longer protection at locked premium." />
              </Label>
              <Select value={policyTerm} onValueChange={setPolicyTerm}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Years</SelectItem>
                  <SelectItem value="20">20 Years</SelectItem>
                  <SelectItem value="30">30 Years</SelectItem>
                  <SelectItem value="40">40 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center">
                Gender
                <InfoTip text="Females ko generally 10% discount milta hai term insurance mein — lower risk profile ki wajah se." />
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setGender('male')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    gender === 'male'
                      ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/40 dark:border-blue-700 dark:text-blue-300 shadow-sm'
                      : 'bg-background border-border text-muted-foreground hover:border-blue-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Male
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    gender === 'female'
                      ? 'bg-pink-50 border-pink-300 text-pink-700 dark:bg-pink-950/40 dark:border-pink-700 dark:text-pink-300 shadow-sm'
                      : 'bg-background border-border text-muted-foreground hover:border-pink-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Female
                </button>
              </div>
            </div>

            {/* Smoker toggle */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold flex items-center">
                <Cigarette className="w-4 h-4 mr-1.5 text-amber-500" />
                Smoker?
                <InfoTip text="Smokers ko 30% zyada premium lagta hai term insurance mein." />
              </Label>
              <Switch checked={smoker} onCheckedChange={setSmoker} />
            </div>

            {/* Calculate button */}
            <Button
              onClick={calculate}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl h-12 text-base font-semibold gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              <Calculator className="w-4 h-4" />
              Calculate Term Premium
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Result */}
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {result ? (
            <BreakdownCard breakdown={result} type="term" />
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="glass-card rounded-2xl border-0 shadow-lg bg-card">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Apni details bhariye aur <span className="gradient-text font-semibold">Term Life Premium</span> calculate karein
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Starting from just ₹750/month for ₹1Cr cover
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Motor Tab ─────────────────────────────────────────────
function MotorTab() {
  const currentYear = new Date().getFullYear();
  const [vehicleType, setVehicleType] = useState<'car' | 'bike'>('car');
  const [regYear, setRegYear] = useState(String(currentYear - 2));
  const [idv, setIdv] = useState('500000');
  const [ncb, setNcb] = useState('0');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [result, setResult] = useState<PremiumBreakdown | null>(null);

  const calculate = useCallback(() => {
    const input: MotorCalcInput = {
      vehicleType,
      registrationYear: Number(regYear),
      idv: Number(idv),
      ncb: Number(ncb),
      addOns,
    };
    setResult(calculateMotorPremium(input));
  }, [vehicleType, regYear, idv, ncb, addOns]);

  const toggleAddOn = (addOn: string) => {
    setAddOns(prev => prev.includes(addOn) ? prev.filter(a => a !== addOn) : [...prev, addOn]);
  };

  // Generate registration year options
  const yearOptions = [];
  for (let y = currentYear; y >= 2015; y--) {
    yearOptions.push(y);
  }

  const addOnOptions = [
    { id: 'zeroDep', label: 'Zero Depreciation', desc: 'Full claim without depreciation', price: '₹2,500' },
    { id: 'engineCover', label: 'Engine Cover', desc: 'Engine damage protection', price: '₹1,500' },
    { id: 'rsa', label: 'Roadside Assistance', desc: '24x7 breakdown help', price: '₹800' },
  ];

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Form */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="glass-card rounded-2xl border-0 shadow-lg bg-card">
          <CardContent className="p-6 space-y-6">
            {/* Vehicle Type toggle */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Vehicle Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setVehicleType('car')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    vehicleType === 'car'
                      ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-300 shadow-sm'
                      : 'bg-background border-border text-muted-foreground hover:border-amber-200'
                  }`}
                >
                  <Car className="w-5 h-5" />
                  Car
                </button>
                <button
                  onClick={() => setVehicleType('bike')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    vehicleType === 'bike'
                      ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-300 shadow-sm'
                      : 'bg-background border-border text-muted-foreground hover:border-amber-200'
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="M5 18h3l2-7h4l2 7h3"/>
                  </svg>
                  Bike
                </button>
              </div>
            </div>

            {/* Registration Year */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center">
                Registration Year
                <InfoTip text="Vehicle kitna purana hai, uspe IDV aur premium depend karta hai." />
              </Label>
              <Select value={regYear} onValueChange={setRegYear}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(y => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* IDV Input */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center">
                IDV (Insured Declared Value)
                <InfoTip text="IDV = aapki gaadi/bike ka current market value. Zyada IDV = zyada premium lekin zyada protection." />
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={idv ? formatIndianCurrency(Number(idv)) : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setIdv(val);
                  }}
                  placeholder="e.g. 5,00,000"
                  className="pl-9 rounded-xl h-11"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Current market value of your {vehicleType === 'car' ? 'car' : 'bike'}
              </p>
            </div>

            {/* NCB dropdown */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center">
                NCB (No Claim Bonus)
                <InfoTip text="Agar pichle saal koi claim nahi kiya toh NCB discount milta hai — 50% tak! Claim-free driving ka reward." />
              </Label>
              <Select value={ncb} onValueChange={setNcb}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% — First year / Claim made</SelectItem>
                  <SelectItem value="20">20% — 1 year claim-free</SelectItem>
                  <SelectItem value="25">25% — 2 years claim-free</SelectItem>
                  <SelectItem value="35">35% — 3 years claim-free</SelectItem>
                  <SelectItem value="45">45% — 4 years claim-free</SelectItem>
                  <SelectItem value="50">50% — 5+ years claim-free 🏆</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add-ons */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center">
                Add-ons
                <InfoTip text="Optional covers jo extra protection dete hain. Zero Dep sabse popular hai!" />
              </Label>
              <div className="space-y-2">
                {addOnOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      addOns.includes(opt.id)
                        ? 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800'
                        : 'bg-background border-border hover:border-amber-200'
                    }`}
                  >
                    <Checkbox
                      checked={addOns.includes(opt.id)}
                      onCheckedChange={() => toggleAddOn(opt.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{opt.label}</p>
                      <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {opt.price}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>

            {/* Calculate button */}
            <Button
              onClick={calculate}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl h-12 text-base font-semibold gap-2 shadow-lg shadow-amber-500/20 transition-all duration-300"
            >
              <Calculator className="w-4 h-4" />
              Calculate Motor Premium
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Result */}
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {result ? (
            <BreakdownCard breakdown={result} type="motor" />
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="glass-card rounded-2xl border-0 shadow-lg bg-card">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mx-auto">
                    <Car className="w-8 h-8 text-amber-400" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Apni gaadi/bike details bhariye aur <span className="gradient-text font-semibold">Motor Premium</span> calculate karein
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    IRDAI 2025-26 TP rates ke saath accurate estimate
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Main Premium Calculator Component ─────────────────────
export default function PremiumCalculator() {
  const [activeTab, setActiveTab] = useState('health');

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto gap-1 bg-muted/50 p-1.5 rounded-xl">
          <TabsTrigger
            value="health"
            className="text-xs sm:text-sm py-2.5 gap-1.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-rose-500/20 transition-all duration-300"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Health</span>
            <span className="sm:hidden">Health</span>
          </TabsTrigger>
          <TabsTrigger
            value="term"
            className="text-xs sm:text-sm py-2.5 gap-1.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/20 transition-all duration-300"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Term Life</span>
            <span className="sm:hidden">Term</span>
          </TabsTrigger>
          <TabsTrigger
            value="motor"
            className="text-xs sm:text-sm py-2.5 gap-1.5 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-amber-500/20 transition-all duration-300"
          >
            <Car className="w-4 h-4" />
            <span className="hidden sm:inline">Motor</span>
            <span className="sm:hidden">Motor</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HealthTab />
          </motion.div>
        </TabsContent>

        <TabsContent value="term" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TermTab />
          </motion.div>
        </TabsContent>

        <TabsContent value="motor" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MotorTab />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
