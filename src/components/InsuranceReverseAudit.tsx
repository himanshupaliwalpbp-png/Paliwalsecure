'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Upload, Brain, FileText, ArrowRight, ArrowLeft,
  AlertTriangle, CheckCircle2, Phone, Car, Bike,
  ChevronDown, Sparkles, TrendingDown, AlertCircle,
  MessageCircle, X, Loader2, ShieldCheck, BadgeCheck,
  IndianRupee, Gauge, Zap, ChevronRight, Camera, Heart,
  ImagePlus, Eye, FileUp, Download, AlertOctagon,
  GitCompareArrows, Plane, Home as HomeIcon, MapPin, Clock,
  Building2, Hammer, Box, BadgePercent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/lib/i18n';

// ── Types ─────────────────────────────────────────────────────
type AuditPhase = 'intro' | 'form' | 'report';
type PolicyType = 'car' | 'bike' | 'ev_car' | 'ev_bike' | 'health' | 'term' | 'travel' | 'home';

interface AuditFormData {
  policyType: PolicyType | '';
  insurer: string;
  vehicle: string;
  idv: string;
  premium: string;
  addOns: string[];
  ncb: string;
  claimsLast3Years: string;
  vehicleAge: string;
  name: string;
  mobile: string;
  email: string;
  // Health-specific
  sumInsured: string;
  age: string;
  familyMembers: string;
  coverageType: string;
  // Travel-specific
  destination: string;
  tripDuration: string;
  // Home-specific
  propertyValue: string;
  city: string;
  constructionType: string;
  contentValue: string;
}

interface RedFlag {
  issue: string;
  impact: string;
  severity: 'high' | 'medium' | 'low';
}

interface SavingsBreakdown {
  idv: number;
  addOns: number;
  insurerSwitch: number;
  ncb: number;
}

interface ComparisonPlan {
  insurer: string;
  planName: string;
  premium: number;
  idv: number;
  csr: number;
  cashlessGarages: number;
  addOnsIncluded: string[];
  addOnsAvailable: string[];
  keyFeatures: string[];
  claimRating: number;
  savings: number;
  badge: 'Best Value' | 'Lowest Price' | 'Best Coverage' | 'Most Popular' | null;
  networkHospitals?: number;
  roomRentLimit?: string;
  waitingPeriodPED?: string;
  restoration?: string;
  solvencyRatio?: string;
  claimTurnaroundDays?: number;
  policyTerm?: string;
  maxMaturityAge?: string;
}

interface AIInsights {
  summary: string;
  isOverpaying: boolean;
  overpayingAmount: number;
  coverageGaps: string[];
  moneySavingTips: string[];
  personalizedNote: string;
  detailedBreakdown?: string;
  marketComparison?: string;
  riskAssessment?: string;
  actionPlan?: string[];
}

interface AuditReport {
  healthScore: number;
  potentialSavings: number;
  savingsBreakdown: SavingsBreakdown;
  redFlags: RedFlag[];
  recommendations: string[];
  currentPolicy: {
    premium: number;
    idv: number;
    addOns: string[];
    csr: string;
  };
  recommendedPolicy: {
    insurer: string;
    premium: number;
    idv: number;
    addOns: string[];
    csr: string;
    savings: number;
  };
  comparisonPlans: ComparisonPlan[];
  aiInsights: AIInsights | null;
  rawReport: string;
}

// ── Constants ─────────────────────────────────────────────────
const MOTOR_INSURERS = [
  'HDFC ERGO', 'ICICI Lombard', 'Bajaj Allianz', 'Acko',
  'TATA AIG', 'Digit', 'Niva Bupa', 'Star Health',
  'Care Health', 'New India Assurance', 'United India',
  'Oriental', 'Magma HDI', 'Shriram', 'Royal Sundaram',
  'Liberty', 'Raheja QBE', 'Other',
];

const HEALTH_INSURERS = [
  'HDFC ERGO', 'ICICI Lombard', 'Star Health', 'Care Health',
  'Niva Bupa', 'Bajaj Allianz', 'TATA AIG', 'Acko',
  'Digit', 'Aditya Birla', 'New India Assurance', 'Oriental', 'Other',
];

const TERM_INSURERS = [
  'HDFC Life', 'ICICI Pru', 'SBI Life', 'Max Life',
  'Bajaj Allianz Life', 'LIC', 'Kotak Life', 'Tata AIA',
  'PNB MetLife', 'Other',
];

const TRAVEL_INSURERS = [
  'HDFC ERGO', 'ICICI Lombard', 'Bajaj Allianz', 'TATA AIG',
  'Star Health', 'Care Health', 'Digit', 'New India Assurance',
  'United India', 'Bharti AXA', 'Other',
];

const HOME_INSURERS = [
  'HDFC ERGO', 'ICICI Lombard', 'Bajaj Allianz', 'TATA AIG',
  'New India Assurance', 'United India', 'Oriental',
  'SBI General', 'Digit', 'Other',
];

const MOTOR_ADD_ONS = [
  'Zero Depreciation', 'Engine Cover', 'Roadside Assistance',
  'Return to Invoice', 'Consumables Cover', 'NCB Protection',
];

const EV_ADD_ONS = [
  'Zero Depreciation', 'Roadside Assistance', 'Return to Invoice',
  'Consumables Cover', 'NCB Protection', 'Battery Degradation Cover',
  'Charging Cable Cover', 'Charging Station RSA', 'EV Motor Cover',
];

const HEALTH_ADD_ONS = [
  'Critical Illness Rider', 'Hospital Cash', 'Maternity Plus',
  'Personal Accident', 'Global Cover', 'OPD Cover',
  'Room Rent Upgrade', 'Consumables Cover',
];

const TERM_RIDERS = [
  'Critical Illness', 'Accidental Death', 'Waiver of Premium',
  'Income Accelerator', 'Terminal Illness', 'Disability Income',
];

const TRAVEL_ADD_ONS = [
  'Adventure Sports Cover', 'Baggage Loss', 'Trip Cancellation',
  'Flight Delay', 'Emergency Evacuation', 'Personal Liability',
  'Hijack Cover', 'Cashless Hospitalization Abroad',
];

const HOME_ADD_ONS = [
  'Earthquake Cover', 'Flood Cover', 'Terrorism Cover',
  'Jewellery & Valuables', 'Temporary Resettlement',
  'Rent Alternative Accommodation', 'Loss of Documents',
];

const NCB_OPTIONS = ['0%', '20%', '25%', '35%', '45%', '50%'];

const VEHICLE_AGE_OPTIONS = [
  '< 1 year', '1-2 years', '2-3 years', '3-5 years', '5-7 years', '7+ years',
];

const COVERAGE_TYPE_OPTIONS = ['Individual', 'Floater'];
const DESTINATION_OPTIONS = ['Domestic', 'International'];
const TRIP_DURATION_OPTIONS = ['1-7 days', '8-15 days', '16-30 days', '31-60 days', '61-180 days', 'Annual Multi-trip'];
const CONSTRUCTION_TYPE_OPTIONS = ['Kutcha', 'Pucca'];

const GST_INFO = 'GST: Health=0% (w.e.f. 22 Sept 2025), Life=0% (w.e.f. 22 Sept 2025), Motor=18%, Travel=18%, Home=18%';

const POLICY_TYPE_TITLES: Record<PolicyType, string> = {
  car: 'Car Insurance Audit + Compare',
  bike: 'Bike Insurance Audit + Compare',
  ev_car: 'EV Car Insurance Audit + Compare',
  ev_bike: 'EV Bike Insurance Audit + Compare',
  health: 'Health Insurance Audit + Compare',
  term: 'Term Insurance Audit + Compare',
  travel: 'Travel Insurance Audit + Compare',
  home: 'Home Insurance Audit + Compare',
};

const INSURANCE_TYPE_CARDS: { type: PolicyType; icon: typeof Car; label: string; desc: string; emoji: string }[] = [
  { type: 'car', icon: Car, label: 'Car', desc: 'Comprehensive & third-party', emoji: '🚗' },
  { type: 'bike', icon: Bike, label: 'Bike', desc: 'Two-wheeler protection', emoji: '🏍️' },
  { type: 'ev_car', icon: Zap, label: 'EV Car', desc: 'Electric vehicle specialist', emoji: '⚡' },
  { type: 'ev_bike', icon: Zap, label: 'EV Bike', desc: 'Electric two-wheeler cover', emoji: '⚡' },
  { type: 'health', icon: Heart, label: 'Health', desc: 'Medical & hospitalization', emoji: '🏥' },
  { type: 'term', icon: Shield, label: 'Term', desc: 'Life protection plan', emoji: '🛡️' },
  { type: 'travel', icon: Plane, label: 'Travel', desc: 'Domestic & international trips', emoji: '✈️' },
  { type: 'home', icon: HomeIcon, label: 'Home', desc: 'Property & contents cover', emoji: '🏠' },
];

const INITIAL_FORM_DATA: AuditFormData = {
  policyType: '', insurer: '', vehicle: '', idv: '', premium: '',
  addOns: [], ncb: '', claimsLast3Years: '0', vehicleAge: '',
  name: '', mobile: '', email: '', sumInsured: '', age: '',
  familyMembers: '', coverageType: '',
  destination: '', tripDuration: '',
  propertyValue: '', city: '', constructionType: '', contentValue: '',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_DOC_TYPES = [...ACCEPTED_IMAGE_TYPES, 'application/pdf'];

// ── Animation Variants ────────────────────────────────────────
const phaseVariants = {
  enter: { opacity: 0, x: 60, scale: 0.97 },
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, x: -60, scale: 0.97, transition: { duration: 0.3, ease: 'easeIn' as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// ── Helpers ───────────────────────────────────────────────────
function getScoreColor(score: number): string {
  if (score <= 40) return '#EF4444';
  if (score <= 60) return '#F97316';
  if (score <= 80) return '#1E40AF';
  return '#10B981';
}

function getScoreLabel(score: number): string {
  if (score <= 40) return 'Poor';
  if (score <= 60) return 'Fair';
  if (score <= 80) return 'Good';
  return 'Excellent';
}

function getSeverityEmoji(severity: 'high' | 'medium' | 'low'): string {
  return severity === 'high' ? '🔴' : severity === 'medium' ? '🟠' : '🟡';
}

function formatCurrency(num: number): string {
  return `₹${num.toLocaleString('en-IN')}`;
}

function isMotorType(pt: string): boolean {
  return pt === 'car' || pt === 'bike' || pt === 'ev_car' || pt === 'ev_bike';
}
function isEVType(pt: string): boolean { return pt === 'ev_car' || pt === 'ev_bike'; }
function isHealthType(pt: string): boolean { return pt === 'health'; }
function isTermType(pt: string): boolean { return pt === 'term'; }
function isTravelType(pt: string): boolean { return pt === 'travel'; }
function isHomeType(pt: string): boolean { return pt === 'home'; }

function getAddOnOptions(pt: string): string[] {
  if (isEVType(pt)) return EV_ADD_ONS;
  if (isMotorType(pt)) return MOTOR_ADD_ONS;
  if (isHealthType(pt)) return HEALTH_ADD_ONS;
  if (isTermType(pt)) return TERM_RIDERS;
  if (isTravelType(pt)) return TRAVEL_ADD_ONS;
  if (isHomeType(pt)) return HOME_ADD_ONS;
  return [];
}

function getInsurerList(pt: string): string[] {
  if (isMotorType(pt)) return MOTOR_INSURERS;
  if (isHealthType(pt)) return HEALTH_INSURERS;
  if (isTermType(pt)) return TERM_INSURERS;
  if (isTravelType(pt)) return TRAVEL_INSURERS;
  if (isHomeType(pt)) return HOME_INSURERS;
  return MOTOR_INSURERS;
}

function getGstRate(pt: string): string {
  if (isHealthType(pt)) return '0%';
  if (isTermType(pt)) return '0%';
  return '18%';
}

// ── Animated Counter Sub-component ────────────────────────────
function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2000 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!hasStartedRef.current) { hasStartedRef.current = true; }
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

// ── Savings Progress Bar Sub-component ────────────────────────
function SavingsBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-foreground/80">{label}</span>
        <span className="text-sm font-bold text-foreground">{formatCurrency(value)}</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted/40 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        />
      </div>
    </div>
  );
}

// ── Circular Gauge SVG ────────────────────────────────────────
function HealthScoreGauge({ score }: { score: number }) {
  const color = getScoreColor(score);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
        <motion.circle
          cx="80" cy="80" r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="text-4xl sm:text-5xl font-extrabold" style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}>
          {score}
        </motion.span>
        <span className="text-xs sm:text-sm font-medium text-muted-foreground mt-1">{getScoreLabel(score)}</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function InsuranceReverseAudit() {
  const [phase, setPhase] = useState<AuditPhase>('intro');
  const [formData, setFormData] = useState<AuditFormData>(INITIAL_FORM_DATA);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AuditFormData, string>>>({});
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<'image' | 'pdf' | null>(null);
  const [extractionLoading, setExtractionLoading] = useState(false);
  const [extractionConfidence, setExtractionConfidence] = useState<'high' | 'medium' | 'low' | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File Upload Handler ─────────────────────────────────────
  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED_DOC_TYPES.includes(file.type)) { setError('Please upload a JPEG, PNG, WebP image, or PDF document.'); return; }
    if (file.size > MAX_FILE_SIZE) { setError('File size must be under 10MB.'); return; }
    setError(null); setExtractionLoading(true); setExtractionConfidence(null); setUploadedFileName(file.name);
    const isPDF = file.type === 'application/pdf'; setUploadedFileType(isPDF ? 'pdf' : 'image');
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string; const base64 = dataUrl.split(',')[1];
      if (!isPDF) setUploadedImage(dataUrl); else { setUploadedImage(null); setPdfLoading(true); }
      try {
        const requestBody: Record<string, unknown> = isPDF
          ? { pdfBase64: base64, fileType: 'pdf' }
          : { imageBase64: base64, mimeType: file.type, fileType: 'image' };
        const response = await fetch('/api/audit/extract', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
        const data = await response.json();
        if (data.success && data.data) {
          const ex = data.data; setExtractionConfidence(ex.confidence || 'medium');
          setFormData((prev) => ({
            ...prev,
            policyType: (ex.policyType as PolicyType) || prev.policyType,
            insurer: ex.insurer || prev.insurer, vehicle: ex.vehicle || prev.vehicle,
            idv: ex.idv ? String(ex.idv) : (ex.sumInsured ? String(ex.sumInsured) : prev.idv),
            premium: ex.premium ? String(ex.premium) : (ex.totalPremium ? String(ex.totalPremium) : prev.premium),
            addOns: Array.isArray(ex.addOns) ? ex.addOns : prev.addOns,
            ncb: ex.ncb ? `${ex.ncb}%` : prev.ncb,
            claimsLast3Years: ex.claimsLast3Years != null ? String(ex.claimsLast3Years) : prev.claimsLast3Years,
            vehicleAge: ex.vehicleAge || prev.vehicleAge, name: ex.policyholderName || prev.name,
            sumInsured: ex.sumInsured ? String(ex.sumInsured) : (ex.sumInsuredForHealth ? String(ex.sumInsuredForHealth) : prev.sumInsured),
            coverageType: ex.coverageType || prev.coverageType,
          }));
        } else { setError(data.error || 'Could not extract details. Please fill manually.'); }
      } catch { setError('Failed to process document. Please fill the form manually.'); }
      finally { setExtractionLoading(false); setPdfLoading(false); }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) processFile(f); }, [processFile]);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }, [processFile]);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => { setDragOver(false); }, []);
  const removeUploadedFile = useCallback(() => { setUploadedImage(null); setUploadedFileName(null); setUploadedFileType(null); setExtractionConfidence(null); setPdfLoading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }, []);

  // ── Form Handlers ──────────────────────────────────────────
  const updateField = useCallback(<K extends keyof AuditFormData>(key: K, value: AuditFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, []);

  const toggleAddOn = useCallback((addOn: string) => {
    setFormData((prev) => ({ ...prev, addOns: prev.addOns.includes(addOn) ? prev.addOns.filter((a) => a !== addOn) : [...prev.addOns, addOn] }));
    setFormErrors((prev) => { const n = { ...prev }; delete n.addOns; return n; });
  }, []);

  const handlePolicyTypeChange = useCallback((val: string) => {
    const newType = val as PolicyType; const validAddOns = getAddOnOptions(newType);
    setFormData((prev) => ({ ...prev, policyType: newType, insurer: '', addOns: prev.addOns.filter((a) => validAddOns.includes(a)) }));
    setFormErrors((prev) => { const n = { ...prev }; delete n.policyType; delete n.insurer; return n; });
  }, []);

  // ── Validation ─────────────────────────────────────────────
  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof AuditFormData, string>> = {};
    const pt = formData.policyType;
    if (!pt) errors.policyType = 'Policy type is required';
    if (!formData.insurer) errors.insurer = 'Select your current insurer';
    if (isMotorType(pt)) {
      if (!formData.vehicle.trim()) errors.vehicle = 'Vehicle make & model is required';
      if (!formData.idv || Number(formData.idv) <= 0) errors.idv = 'Enter a valid IDV amount';
      if (!formData.ncb) errors.ncb = 'Select NCB percentage';
      if (!formData.vehicleAge) errors.vehicleAge = 'Select vehicle age';
    }
    if (isHealthType(pt)) {
      if (!formData.sumInsured || Number(formData.sumInsured) <= 0) errors.sumInsured = 'Enter a valid sum insured amount';
      if (!formData.age || Number(formData.age) <= 0) errors.age = 'Enter your age';
      if (!formData.coverageType) errors.coverageType = 'Select coverage type';
    }
    if (isTermType(pt)) {
      if (!formData.idv || Number(formData.idv) <= 0) errors.idv = 'Enter a valid sum assured amount';
      if (!formData.age || Number(formData.age) <= 0) errors.age = 'Enter your age';
    }
    if (isTravelType(pt)) {
      if (!formData.destination) errors.destination = 'Select destination type';
      if (!formData.tripDuration) errors.tripDuration = 'Select trip duration';
      if (!formData.age || Number(formData.age) <= 0) errors.age = 'Enter your age';
      if (!formData.sumInsured || Number(formData.sumInsured) <= 0) errors.sumInsured = 'Enter sum insured';
    }
    if (isHomeType(pt)) {
      if (!formData.propertyValue || Number(formData.propertyValue) <= 0) errors.propertyValue = 'Enter property value';
      if (!formData.city.trim()) errors.city = 'Enter city';
      if (!formData.constructionType) errors.constructionType = 'Select construction type';
    }
    if (!formData.premium || Number(formData.premium) <= 0) errors.premium = 'Enter a valid premium amount';
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile.trim())) errors.mobile = 'Enter a valid 10-digit mobile number';
    setFormErrors(errors); return Object.keys(errors).length === 0;
  }, [formData]);

  // ── Submit Handler ─────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setLoading(true); setError(null);
    try {
      const pt = formData.policyType;
      const body: Record<string, unknown> = {
        policyType: pt, insurer: formData.insurer, premium: Number(formData.premium),
        addOns: formData.addOns, claimsLast3Years: Number(formData.claimsLast3Years),
        name: formData.name.trim(), mobile: formData.mobile.trim(), email: formData.email.trim() || undefined,
      };
      if (isMotorType(pt)) { body.vehicle = formData.vehicle.trim(); body.idv = Number(formData.idv); body.ncb = Number(formData.ncb.replace('%', '')); body.vehicleAge = formData.vehicleAge; }
      if (isHealthType(pt)) { body.sumInsured = Number(formData.sumInsured); body.age = Number(formData.age); body.familyMembers = Number(formData.familyMembers) || 0; body.coverageType = formData.coverageType; body.idv = Number(formData.sumInsured); }
      if (isTermType(pt)) { body.sumInsured = Number(formData.idv); body.idv = Number(formData.idv); body.age = Number(formData.age); }
      if (isTravelType(pt)) { body.sumInsured = Number(formData.sumInsured); body.idv = Number(formData.sumInsured); body.age = Number(formData.age); body.destination = formData.destination; body.tripDuration = formData.tripDuration; }
      if (isHomeType(pt)) { body.idv = Number(formData.propertyValue); body.sumInsured = Number(formData.propertyValue); body.propertyValue = Number(formData.propertyValue); body.city = formData.city.trim(); body.constructionType = formData.constructionType; body.contentValue = Number(formData.contentValue) || 0; }
      const response = await fetch('/api/audit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error('Audit analysis failed. Please try again.');
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Audit analysis failed.');
      setReport({ healthScore: data.healthScore, potentialSavings: data.potentialSavings, savingsBreakdown: data.savingsBreakdown, redFlags: data.redFlags, recommendations: data.recommendations, currentPolicy: data.currentPolicy, recommendedPolicy: data.recommendedPolicy, comparisonPlans: data.comparisonPlans || [], aiInsights: data.aiInsights || null, rawReport: data.rawReport });
      setPhase('report');
    } catch (err: any) { setError(err.message || 'Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  }, [formData, validateForm]);

  const handleWhatsAppCTA = useCallback(() => {
    const message = encodeURIComponent(`Namaste! 🙏 Maine Insurance Reverse Audit complete kiya hai. Mujhe apni policy optimize karni hai. Please help!`);
    window.open(`https://wa.me/919257877312?text=${message}`, '_blank');
  }, []);

  // ── Download PDF Report ──────────────────────────────────────
  const handleDownloadPDF = useCallback(() => {
    if (!report) return;
    const doc = new jsPDF(); const pageW = doc.internal.pageSize.getWidth(); const margin = 14; const contentW = pageW - margin * 2; let y = 20;
    const addText = (text: string, size: number, style: string, color: [number, number, number] = [0, 0, 0]) => {
      doc.setFontSize(size); doc.setFont('helvetica', style as any); doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, contentW);
      if (y + lines.length * (size * 0.5) > 270) { doc.addPage(); y = 20; }
      doc.text(lines, margin, y); y += lines.length * (size * 0.45) + 3;
    };
    const addLine = () => { doc.setDrawColor(200, 200, 200); doc.line(margin, y, pageW - margin, y); y += 5; };
    doc.setFillColor(30, 64, 175); doc.rect(0, 0, pageW, 35, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text('Insurance Reverse Audit Report', margin, 15);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Paliwal Secure | IRDAI Certified POSP | POSP Code: IP429834 | paliwalsecure.in', margin, 23);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, 29);
    y = 42;
    doc.setFillColor(240, 253, 244); doc.roundedRect(margin, y, contentW, 22, 3, 3, 'F');
    addText(`Insurance Health Score: ${report.healthScore}/100 — ${getScoreLabel(report.healthScore)}`, 14, 'bold', getScoreColor(report.healthScore).startsWith('#10') ? [16, 185, 129] : getScoreColor(report.healthScore).startsWith('#EF') ? [239, 68, 68] : [30, 64, 175]);
    addText(`Potential Savings: ${formatCurrency(report.potentialSavings)}/year`, 11, 'normal', [16, 185, 129]);
    y += 5;
    addText('CURRENT POLICY', 13, 'bold', [30, 64, 175]); addLine();
    addText(`Insurer: ${report.currentPolicy.csr?.replace('%', '') ? 'Current Insurer' : 'N/A'}`, 10, 'normal');
    addText(`Premium: ${formatCurrency(report.currentPolicy.premium)}/year | IDV: ${formatCurrency(report.currentPolicy.idv)}`, 10, 'normal');
    addText(`CSR: ${report.currentPolicy.csr} | Add-ons: ${report.currentPolicy.addOns.join(', ') || 'None'}`, 10, 'normal'); y += 3;
    addText('RECOMMENDED POLICY', 13, 'bold', [16, 185, 129]); addLine();
    addText(`Insurer: ${report.recommendedPolicy.insurer}`, 10, 'normal');
    addText(`Premium: ${formatCurrency(report.recommendedPolicy.premium)}/year | IDV: ${formatCurrency(report.recommendedPolicy.idv)}`, 10, 'normal');
    addText(`CSR: ${report.recommendedPolicy.csr} | Savings: ${formatCurrency(report.recommendedPolicy.savings)}/year`, 10, 'bold', [16, 185, 129]);
    addText(`Add-ons: ${report.recommendedPolicy.addOns.join(', ') || 'None'}`, 10, 'normal'); y += 3;
    if (report.redFlags.length > 0) {
      addText('RED FLAGS', 13, 'bold', [239, 68, 68]); addLine();
      report.redFlags.forEach((flag) => { addText(`${getSeverityEmoji(flag.severity)} ${flag.issue}`, 10, 'bold'); addText(`   Impact: ${flag.impact} (${flag.severity} severity)`, 9, 'normal', [100, 100, 100]); }); y += 3;
    }
    if (report.recommendations.length > 0) {
      addText('RECOMMENDATIONS', 13, 'bold', [30, 64, 175]); addLine();
      report.recommendations.forEach((rec, i) => { addText(`${i + 1}. ${rec}`, 10, 'normal'); }); y += 3;
    }
    if (report.comparisonPlans.length > 0) {
      addText('COMPARISON PLANS (Cheapest First) — IRDAI Accurate Rates', 13, 'bold', [217, 119, 6]); addLine();
      report.comparisonPlans.forEach((plan, i) => {
        const badge = plan.badge ? ` [${plan.badge}]` : '';
        addText(`${i + 1}. ${plan.insurer} - ${plan.planName}${badge} — IRDAI Accurate`, 10, 'bold');
        addText(`   Premium: ${formatCurrency(plan.premium)}/yr | CSR: ${plan.csr}% | ${plan.savings > 0 ? `Save ${formatCurrency(plan.savings)}/yr` : `+${formatCurrency(Math.abs(plan.savings))}/yr extra`}`, 9, 'normal');
        if (plan.addOnsIncluded.length > 0) addText(`   Add-ons: ${plan.addOnsIncluded.join(', ')}`, 9, 'normal', [16, 185, 129]);
        if (plan.keyFeatures.length > 0) addText(`   Features: ${plan.keyFeatures.join(' | ')}`, 8, 'normal', [100, 100, 100]);
      }); y += 3;
    }
    if (report.aiInsights) {
      addText('AI DEEP ANALYSIS (Claude AI)', 13, 'bold', [124, 58, 237]); addLine();
      addText(report.aiInsights.summary, 10, 'normal');
      if (report.aiInsights.isOverpaying) addText(`OVERPAYING: ~${formatCurrency(report.aiInsights.overpayingAmount)}/year`, 11, 'bold', [239, 68, 68]);
      if (report.aiInsights.detailedBreakdown) { addText('Detailed Breakdown:', 10, 'bold'); addText(report.aiInsights.detailedBreakdown, 9, 'normal'); }
      if (report.aiInsights.marketComparison) { addText('Market Comparison:', 10, 'bold'); addText(report.aiInsights.marketComparison, 9, 'normal'); }
      if (report.aiInsights.riskAssessment) { addText('Risk Assessment:', 10, 'bold'); addText(report.aiInsights.riskAssessment, 9, 'normal'); }
      if (report.aiInsights.coverageGaps.length > 0) { addText('Coverage Gaps:', 10, 'bold'); report.aiInsights.coverageGaps.forEach((g) => addText(`• ${g}`, 9, 'normal')); }
      if (report.aiInsights.moneySavingTips.length > 0) { addText('Money Saving Tips:', 10, 'bold'); report.aiInsights.moneySavingTips.forEach((tp) => addText(`• ${tp}`, 9, 'normal')); }
      if (report.aiInsights.actionPlan?.length) { addText('Action Plan:', 10, 'bold'); report.aiInsights.actionPlan.forEach((s, i) => addText(`${i + 1}. ${s}`, 9, 'normal')); }
      if (report.aiInsights.personalizedNote) addText(`Personal Note: ${report.aiInsights.personalizedNote}`, 9, 'italic');
      y += 3;
    }
    addText('SAVINGS BREAKDOWN', 13, 'bold', [16, 185, 129]); addLine();
    addText(`IDV Optimization: ${formatCurrency(report.savingsBreakdown.idv)}`, 10, 'normal');
    addText(`Add-on Optimization: ${formatCurrency(report.savingsBreakdown.addOns)}`, 10, 'normal');
    addText(`Insurer Switch: ${formatCurrency(report.savingsBreakdown.insurerSwitch)}`, 10, 'normal');
    addText(`NCB Benefit: ${formatCurrency(report.savingsBreakdown.ncb)}`, 10, 'normal'); y += 3;
    addText(`GST Info: ${GST_INFO}`, 8, 'italic', [100, 100, 100]); y += 3;
    doc.setFillColor(30, 64, 175); doc.rect(0, 275, pageW, 22, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(8);
    doc.text('Paliwal Secure | IRDAI Certified POSP | POSP: IP429834 | Contact: 9257877312 | wa.me/919257877312', margin, 282);
    doc.text('This audit is based on information provided and market data. Actual savings may vary. Not investment advice.', margin, 288);
    doc.save(`Insurance-Audit-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  }, [report]);

  const currentInsurerList = useMemo(() => getInsurerList(formData.policyType || 'car'), [formData.policyType]);
  const currentAddOnOptions = useMemo(() => getAddOnOptions(formData.policyType || 'car'), [formData.policyType]);

  // ── Render: Intro ──────────────────────────────────────────
  const renderIntro = () => (
    <motion.div key="intro" variants={phaseVariants} initial="enter" animate="center" exit="exit" className="max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-violet-900 p-6 sm:p-10 text-white">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#C98A1C]/10 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-wrap items-center gap-2 mb-4">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 px-3 py-1 text-xs font-medium rounded-full">
              <Shield className="w-3 h-3 mr-1" /> Insurance Reverse Audit™
            </Badge>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 px-3 py-1 text-xs font-bold rounded-full">
              <BadgeCheck className="w-3 h-3 mr-1" /> IRDAI Accurate Rates
            </Badge>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Insurance{' '}
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">Reverse Audit™</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 text-lg sm:text-xl text-amber-200/90 font-bold">
            Audit + Compare + Save — Sab ek jagah!
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-sm text-blue-200/70 max-w-xl leading-relaxed">
            Apni policy ko audit karao, IRDAI accurate rates se compare karo, aur bachao! Motor, Health, Term, EV, Travel, Home — AI-powered analysis, plan comparison, real savings — Free mein, sirf 2 minute mein!
          </motion.p>

          {/* Animated Counter Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-6 grid grid-cols-3 gap-3 max-w-md">
            {[
              { value: 500, prefix: '', suffix: '+', label: 'Policies Audited' },
              { value: 8000, prefix: '₹', suffix: '+', label: 'Avg Savings' },
              { value: 8, prefix: '', suffix: '', label: 'Categories' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/8 backdrop-blur-sm border border-white/10 px-3 py-2 text-center">
                <p className="text-lg sm:text-xl font-extrabold text-amber-300">
                  <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="text-[10px] sm:text-xs text-blue-200/70 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 flex flex-wrap gap-2">
            {[
              { icon: ShieldCheck, text: '500+ Policies Audited' },
              { icon: BadgeCheck, text: 'IRDAI Accurate Rates' },
              { icon: IndianRupee, text: '₹8,000+ Avg Savings' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
                <item.icon className="w-4 h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-medium text-white/90">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* POSP Trust */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-3 flex items-center gap-2 text-xs text-blue-200/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>IRDAI Certified POSP • POSP Code: <strong className="text-blue-200/70">IP429834</strong></span>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => setPhase('form')}
                className="rounded-full gap-2 h-14 px-10 text-base font-bold shadow-2xl shadow-[#C98A1C]/30 bg-gradient-to-r from-[#C98A1C] to-[#0A1330] hover:from-[#0A1330] hover:to-[#0F1C40] text-white text-lg">
                Start Free Audit <ArrowRight className="w-5 h-5" />
              </Button>
              <a href="https://wa.me/919257877312?text=Hi%20I%20want%20to%20compare%20insurance%20plans" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline"
                  className="rounded-full gap-2 h-14 px-6 text-sm font-semibold bg-white/10 backdrop-blur border-white/25 text-white hover:bg-white/20 hover:text-white">
                  <Phone className="w-4 h-4" /> Talk to Advisor
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Insurance Type Cards */}
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="mt-8 sm:mt-10">
        <h3 className="text-center text-lg sm:text-xl font-bold text-foreground mb-2">8 Insurance Categories Covered</h3>
        <p className="text-center text-sm text-muted-foreground mb-6">Choose your policy type — hum har category mein best deal dhundenge</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {INSURANCE_TYPE_CARDS.map((item) => (
            <motion.div key={item.type} variants={staggerItem} whileHover={{ y: -3, scale: 1.02 }}
              className="cursor-pointer" onClick={() => { setFormData((p) => ({ ...p, policyType: item.type })); setPhase('form'); }}>
              <Card className="h-full rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur border-border/50 hover:border-amber-300/60 dark:hover:border-amber-600/40 hover:shadow-lg transition-all duration-300 text-center">
                <CardContent className="p-4 sm:p-5">
                  <div className="text-2xl sm:text-3xl mb-2">{item.emoji}</div>
                  <h4 className="text-sm sm:text-base font-bold text-foreground">{item.label}</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="mt-8 sm:mt-10">
        <h3 className="text-center text-lg sm:text-xl font-bold text-foreground mb-6">How It Works</h3>
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: Camera, title: 'Upload Policy or Fill Details', desc: 'Policy photo/PDF upload karo ya details bharo — AI auto-fill karega', gradient: 'from-blue-800 to-blue-600', step: 1 },
            { icon: Brain, title: 'AI Audit + IRDAI Compare', desc: '50+ parameters pe audit + IRDAI accurate rates se insurer comparison', gradient: 'from-amber-600 to-amber-500', step: 2 },
            { icon: FileText, title: 'Save Money — Guaranteed', desc: 'Health score, red flags, savings breakdown, best plan recommendation + PDF report', gradient: 'from-[#C98A1C] to-[#E0A830]', step: 3 },
          ].map((step) => (
            <motion.div key={step.step} variants={staggerItem} whileHover={{ y: -4 }}>
              <Card className="h-full rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur border-border/50 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5 sm:p-6 text-center">
                  <div className="relative mx-auto mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg mx-auto`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 sm:right-6 w-6 h-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white text-xs font-bold flex items-center justify-center shadow-md">{step.step}</div>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-foreground mb-1.5">{step.title}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  // ── Render: Form ───────────────────────────────────────────
  const renderForm = () => {
    const pt = formData.policyType;
    const showMotorFields = isMotorType(pt);
    const showEVFields = isEVType(pt);
    const showHealthFields = isHealthType(pt);
    const showTermFields = isTermType(pt);
    const showTravelFields = isTravelType(pt);
    const showHomeFields = isHomeType(pt);
    const formTitle = pt ? POLICY_TYPE_TITLES[pt as PolicyType] : 'Insurance Audit';

    // Step indicator logic
    const steps = ['Upload / Basic Info', 'Policy Details', 'Contact Info'];
    const currentStep = !pt ? 0 : (showMotorFields ? (formData.vehicleAge ? 2 : 1) : (showTravelFields ? (formData.tripDuration ? 2 : 1) : (showHomeFields ? (formData.constructionType ? 2 : 1) : (formData.premium ? 2 : 1))));

    return (
      <motion.div key="form" variants={phaseVariants} initial="enter" animate="center" exit="exit" ref={formRef} className="max-w-2xl mx-auto">
        <Card className="rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur border-border/50 shadow-xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setPhase('intro')} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors" aria-label="Go back">
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{formTitle}</h3>
                <p className="text-xs sm:text-sm text-blue-200/80 mt-0.5 flex items-center gap-1.5">
                  <GitCompareArrows className="w-3.5 h-3.5" /> Audit + IRDAI Compare — Best deal dhundenge
                </p>
              </div>
            </div>
            {/* Step Indicator */}
            <div className="mt-4 flex items-center gap-1">
              {steps.map((s, i) => (
                <div key={s} className="flex-1 flex items-center gap-1">
                  <div className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${i <= currentStep ? 'bg-amber-400' : 'bg-white/20'}`} />
                </div>
              ))}
            </div>
            <div className="mt-1 flex justify-between">
              {steps.map((s, i) => (
                <span key={s} className={`text-[10px] font-medium ${i <= currentStep ? 'text-amber-300' : 'text-white/30'}`}>{s}</span>
              ))}
            </div>
          </div>

          <CardContent className="p-5 sm:p-6 space-y-5">
            {/* Upload Section */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <FileUp className="w-4 h-4 text-blue-600" />
                Upload Policy Photo or PDF <span className="text-muted-foreground text-xs font-normal">(AI auto-fills your form)</span>
              </Label>
              {!uploadedImage && !pdfLoading && uploadedFileType !== 'pdf' ? (
                <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all duration-300 ${dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.02]' : 'border-border/60 bg-muted/20 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/10'}`}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 flex items-center justify-center">
                      <Upload className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Drag & drop your policy document here</p>
                      <p className="text-xs text-muted-foreground mt-1">Photo (JPEG, PNG, WebP) or PDF • Max 10MB</p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" className="rounded-full gap-2 text-xs"
                        onClick={(e) => { e.stopPropagation(); if (fileInputRef.current) { fileInputRef.current.accept = 'image/jpeg,image/png,image/webp'; fileInputRef.current.removeAttribute('capture'); } fileInputRef.current?.click(); }}>
                        <Camera className="w-3.5 h-3.5" /> Take Photo
                      </Button>
                      <Button type="button" variant="outline" size="sm" className="rounded-full gap-2 text-xs"
                        onClick={(e) => { e.stopPropagation(); if (fileInputRef.current) { fileInputRef.current.accept = 'application/pdf,image/*'; fileInputRef.current.removeAttribute('capture'); } fileInputRef.current?.click(); }}>
                        <FileText className="w-3.5 h-3.5" /> Upload PDF / Photo
                      </Button>
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={handleFileChange} aria-label="Upload policy document" />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-border/50">
                  {uploadedFileType === 'pdf' ? (
                    <div className="p-6 text-center bg-muted/20">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-800/30 flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-7 h-7 text-red-600 dark:text-red-400" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{uploadedFileName || 'PDF Document'}</p>
                      <p className="text-xs text-muted-foreground mt-1">{extractionLoading ? 'AI is analyzing your PDF...' : 'PDF uploaded successfully'}</p>
                      <button onClick={removeUploadedFile} className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium">Remove & upload again</button>
                    </div>
                  ) : (
                    <div className="relative">
                      <img src={uploadedImage || ''} alt="Uploaded policy document" className="w-full max-h-64 object-contain bg-muted/20" />
                      <button onClick={removeUploadedFile} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors" aria-label="Remove uploaded file">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {extractionLoading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/60 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-sm font-semibold text-foreground">AI is reading your policy...</p>
                      <p className="text-xs text-muted-foreground">{uploadedFileType === 'pdf' ? 'Extracting text & analyzing document' : 'Extracting details automatically'}</p>
                    </div>
                  )}
                  {extractionConfidence && !extractionLoading && (
                    <div className="p-3 flex items-center gap-2 bg-muted/30">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">AI extraction confidence:</span>
                      <Badge className={`text-[10px] px-2 py-0.5 border-0 font-bold rounded-full ${extractionConfidence === 'high' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : extractionConfidence === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'}`}>
                        {extractionConfidence === 'high' ? '🟢 High' : extractionConfidence === 'medium' ? '🟡 Medium' : '🔴 Low'}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground ml-auto">Please verify & edit if needed</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Policy Type */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Policy Type <span className="text-red-500">*</span></Label>
              <Select value={formData.policyType} onValueChange={handlePolicyTypeChange}>
                <SelectTrigger className={`w-full rounded-xl h-11 ${formErrors.policyType ? 'border-red-500 ring-1 ring-red-500/30' : ''}`}>
                  <SelectValue placeholder="Select policy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">🚗 Car Insurance</SelectItem>
                  <SelectItem value="bike">🏍️ Bike Insurance</SelectItem>
                  <SelectItem value="ev_car">⚡ EV Car Insurance</SelectItem>
                  <SelectItem value="ev_bike">⚡ EV Bike Insurance</SelectItem>
                  <SelectItem value="health">🏥 Health Insurance</SelectItem>
                  <SelectItem value="term">🛡️ Term Insurance</SelectItem>
                  <SelectItem value="travel">✈️ Travel Insurance</SelectItem>
                  <SelectItem value="home">🏠 Home Insurance</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.policyType && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.policyType}</p>}
            </div>

            {/* Insurer */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Current Insurer <span className="text-red-500">*</span>
                <span className="text-muted-foreground text-xs font-normal ml-2">— Your current insurance provider</span>
              </Label>
              <Select value={formData.insurer} onValueChange={(val) => updateField('insurer', val)}>
                <SelectTrigger className={`w-full rounded-xl h-11 ${formErrors.insurer ? 'border-red-500 ring-1 ring-red-500/30' : ''}`}>
                  <SelectValue placeholder="Select your insurer" />
                </SelectTrigger>
                <SelectContent>
                  {currentInsurerList.map((ins) => <SelectItem key={ins} value={ins}>{ins}</SelectItem>)}
                </SelectContent>
              </Select>
              {formErrors.insurer && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.insurer}</p>}
            </div>

            {/* Motor/EV Fields */}
            {showMotorFields && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Vehicle Make & Model <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs font-normal ml-2">— e.g., Maruti Swift 2021</span>
                  </Label>
                  <Input placeholder={showEVFields ? "e.g., Tata Nexon EV 2023" : "e.g., Maruti Swift 2021"} value={formData.vehicle} onChange={(e) => updateField('vehicle', e.target.value)}
                    className={`rounded-xl h-11 ${formErrors.vehicle ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} aria-label="Vehicle make and model" />
                  {formErrors.vehicle && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.vehicle}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Current IDV (₹) <span className="text-red-500">*</span>
                      <span className="text-muted-foreground text-xs font-normal ml-1">— Insured Declared Value</span>
                    </Label>
                    <Input type="number" placeholder="e.g., 500000" value={formData.idv} onChange={(e) => updateField('idv', e.target.value)}
                      className={`rounded-xl h-11 ${formErrors.idv ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={0} />
                    {formErrors.idv && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.idv}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Annual Premium Paid (₹) <span className="text-red-500">*</span>
                      <span className="text-muted-foreground text-xs font-normal ml-1">— Before GST</span>
                    </Label>
                    <Input type="number" placeholder="e.g., 12000" value={formData.premium} onChange={(e) => updateField('premium', e.target.value)}
                      className={`rounded-xl h-11 ${formErrors.premium ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={0} />
                    {formErrors.premium && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.premium}</p>}
                  </div>
                </div>
              </>
            )}

            {/* Health Fields */}
            {showHealthFields && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Sum Insured (₹) <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs font-normal ml-1">— Coverage amount</span>
                  </Label>
                  <Input type="number" placeholder="e.g., 1000000" value={formData.sumInsured} onChange={(e) => updateField('sumInsured', e.target.value)}
                    className={`rounded-xl h-11 ${formErrors.sumInsured ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={0} />
                  {formErrors.sumInsured && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.sumInsured}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Annual Premium Paid (₹) <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs font-normal ml-1">— GST exempt (0%)</span>
                  </Label>
                  <Input type="number" placeholder="e.g., 15000" value={formData.premium} onChange={(e) => updateField('premium', e.target.value)}
                    className={`rounded-xl h-11 ${formErrors.premium ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={0} />
                  {formErrors.premium && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.premium}</p>}
                </div>
              </div>
            )}

            {/* Term Fields */}
            {showTermFields && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Sum Assured (₹) <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs font-normal ml-1">— Life cover amount</span>
                  </Label>
                  <Input type="number" placeholder="e.g., 10000000" value={formData.idv} onChange={(e) => updateField('idv', e.target.value)}
                    className={`rounded-xl h-11 ${formErrors.idv ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={0} />
                  {formErrors.idv && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.idv}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Annual Premium Paid (₹) <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs font-normal ml-1">— GST exempt (0%)</span>
                  </Label>
                  <Input type="number" placeholder="e.g., 12000" value={formData.premium} onChange={(e) => updateField('premium', e.target.value)}
                    className={`rounded-xl h-11 ${formErrors.premium ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={0} />
                  {formErrors.premium && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.premium}</p>}
                </div>
              </div>
            )}

            {/* Travel Fields */}
            {showTravelFields && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Destination <span className="text-red-500">*</span>
                      <span className="text-muted-foreground text-xs font-normal ml-1">— Domestic or International</span>
                    </Label>
                    <Select value={formData.destination} onValueChange={(val) => updateField('destination', val)}>
                      <SelectTrigger className={`w-full rounded-xl h-11 ${formErrors.destination ? 'border-red-500 ring-1 ring-red-500/30' : ''}`}>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {DESTINATION_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d === 'Domestic' ? '🇮🇳 Domestic' : '🌍 International'}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {formErrors.destination && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.destination}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Trip Duration <span className="text-red-500">*</span>
                      <span className="text-muted-foreground text-xs font-normal ml-1">— Travel period</span>
                    </Label>
                    <Select value={formData.tripDuration} onValueChange={(val) => updateField('tripDuration', val)}>
                      <SelectTrigger className={`w-full rounded-xl h-11 ${formErrors.tripDuration ? 'border-red-500 ring-1 ring-red-500/30' : ''}`}>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRIP_DURATION_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {formErrors.tripDuration && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.tripDuration}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Your Age <span className="text-red-500">*</span>
                      <span className="text-muted-foreground text-xs font-normal ml-1">— Primary traveller age</span>
                    </Label>
                    <Input type="number" placeholder="e.g., 30" value={formData.age} onChange={(e) => updateField('age', e.target.value)}
                      className={`rounded-xl h-11 ${formErrors.age ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={18} max={100} />
                    {formErrors.age && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.age}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Sum Insured (₹) <span className="text-red-500">*</span>
                      <span className="text-muted-foreground text-xs font-normal ml-1">— Coverage amount + 18% GST</span>
                    </Label>
                    <Input type="number" placeholder="e.g., 500000" value={formData.sumInsured} onChange={(e) => updateField('sumInsured', e.target.value)}
                      className={`rounded-xl h-11 ${formErrors.sumInsured ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={0} />
                    {formErrors.sumInsured && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.sumInsured}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Annual Premium Paid (₹) <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs font-normal ml-1">— Including 18% GST</span>
                  </Label>
                  <Input type="number" placeholder="e.g., 3000" value={formData.premium} onChange={(e) => updateField('premium', e.target.value)}
                    className={`rounded-xl h-11 ${formErrors.premium ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={0} />
                  {formErrors.premium && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.premium}</p>}
                </div>
              </>
            )}

            {/* Home Fields */}
            {showHomeFields && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Property Value (₹) <span className="text-red-500">*</span>
                      <span className="text-muted-foreground text-xs font-normal ml-1">— Reconstruction cost</span>
                    </Label>
                    <Input type="number" placeholder="e.g., 5000000" value={formData.propertyValue} onChange={(e) => updateField('propertyValue', e.target.value)}
                      className={`rounded-xl h-11 ${formErrors.propertyValue ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={0} />
                    {formErrors.propertyValue && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.propertyValue}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1.5"><Hammer className="w-3.5 h-3.5" /> Construction Type <span className="text-red-500">*</span>
                      <span className="text-muted-foreground text-xs font-normal ml-1">— Building structure</span>
                    </Label>
                    <Select value={formData.constructionType} onValueChange={(val) => updateField('constructionType', val)}>
                      <SelectTrigger className={`w-full rounded-xl h-11 ${formErrors.constructionType ? 'border-red-500 ring-1 ring-red-500/30' : ''}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONSTRUCTION_TYPE_OPTIONS.map((ct) => <SelectItem key={ct} value={ct}>{ct === 'Pucca' ? '🧱 Pucca (Permanent)' : '🛖 Kutcha (Temporary)'}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {formErrors.constructionType && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.constructionType}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">City <span className="text-red-500">*</span>
                      <span className="text-muted-foreground text-xs font-normal ml-1">— Property location</span>
                    </Label>
                    <Input placeholder="e.g., Mumbai" value={formData.city} onChange={(e) => updateField('city', e.target.value)}
                      className={`rounded-xl h-11 ${formErrors.city ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} />
                    {formErrors.city && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold flex items-center gap-1.5"><Box className="w-3.5 h-3.5" /> Content Value (₹)
                      <span className="text-muted-foreground text-xs font-normal ml-1">— Optional: valuables inside</span>
                    </Label>
                    <Input type="number" placeholder="e.g., 500000" value={formData.contentValue} onChange={(e) => updateField('contentValue', e.target.value)} className="rounded-xl h-11" min={0} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Annual Premium Paid (₹) <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs font-normal ml-1">— Including 18% GST</span>
                  </Label>
                  <Input type="number" placeholder="e.g., 5000" value={formData.premium} onChange={(e) => updateField('premium', e.target.value)}
                    className={`rounded-xl h-11 ${formErrors.premium ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={0} />
                  {formErrors.premium && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.premium}</p>}
                </div>
              </>
            )}

            {/* Add-ons / Riders */}
            {pt && currentAddOnOptions.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  {showHealthFields && <Heart className="w-4 h-4 text-rose-500" />}
                  {showTermFields && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                  {showTravelFields && <Plane className="w-4 h-4 text-blue-500" />}
                  {showHomeFields && <HomeIcon className="w-4 h-4 text-orange-500" />}
                  {showMotorFields && !showEVFields && <Zap className="w-4 h-4 text-amber-500" />}
                  {showEVFields && <Zap className="w-4 h-4 text-[#C98A1C]" />}
                  {showHealthFields ? 'Health Add-ons' : showTermFields ? 'Term Riders' : showTravelFields ? 'Travel Add-ons' : showHomeFields ? 'Home Add-ons' : showEVFields ? 'EV Add-ons' : 'Add-ons Selected'}
                  <span className="text-muted-foreground text-xs font-normal">— Select applicable ones</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentAddOnOptions.map((addOn) => (
                    <label key={addOn} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-pointer transition-all duration-200 ${formData.addOns.includes(addOn) ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700/50' : 'bg-background border-border/60 hover:border-border'}`}>
                      <Checkbox checked={formData.addOns.includes(addOn)} onCheckedChange={() => toggleAddOn(addOn)} className="data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700" />
                      <span className="text-sm font-medium text-foreground">{addOn}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Motor: NCB + Claims + Vehicle Age */}
            {showMotorFields && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">NCB % <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs font-normal ml-1">— No Claim Bonus</span>
                  </Label>
                  <Select value={formData.ncb} onValueChange={(val) => updateField('ncb', val)}>
                    <SelectTrigger className={`w-full rounded-xl h-11 ${formErrors.ncb ? 'border-red-500 ring-1 ring-red-500/30' : ''}`}><SelectValue placeholder="Select NCB" /></SelectTrigger>
                    <SelectContent>{NCB_OPTIONS.map((ncb) => <SelectItem key={ncb} value={ncb}>{ncb}</SelectItem>)}</SelectContent>
                  </Select>
                  {formErrors.ncb && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.ncb}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Claims (last 3 yrs)
                    <span className="text-muted-foreground text-xs font-normal ml-1">— Number of claims</span>
                  </Label>
                  <Input type="number" placeholder="0-5" value={formData.claimsLast3Years}
                    onChange={(e) => { const val = Math.min(5, Math.max(0, Number(e.target.value) || 0)); updateField('claimsLast3Years', String(val)); }} className="rounded-xl h-11" min={0} max={5} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Vehicle Age <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs font-normal ml-1">— For depreciation calc</span>
                  </Label>
                  <Select value={formData.vehicleAge} onValueChange={(val) => updateField('vehicleAge', val)}>
                    <SelectTrigger className={`w-full rounded-xl h-11 ${formErrors.vehicleAge ? 'border-red-500 ring-1 ring-red-500/30' : ''}`}><SelectValue placeholder="Select age" /></SelectTrigger>
                    <SelectContent>{VEHICLE_AGE_OPTIONS.map((age) => <SelectItem key={age} value={age}>{age}</SelectItem>)}</SelectContent>
                  </Select>
                  {formErrors.vehicleAge && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.vehicleAge}</p>}
                </div>
              </div>
            )}

            {/* Health: Age + Family + Coverage */}
            {showHealthFields && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Your Age <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs font-normal ml-1">— Primary member</span>
                  </Label>
                  <Input type="number" placeholder="e.g., 35" value={formData.age} onChange={(e) => updateField('age', e.target.value)}
                    className={`rounded-xl h-11 ${formErrors.age ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={18} max={100} />
                  {formErrors.age && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.age}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Family Members
                    <span className="text-muted-foreground text-xs font-normal ml-1">— For floater plan</span>
                  </Label>
                  <Input type="number" placeholder="Floater count" value={formData.familyMembers} onChange={(e) => updateField('familyMembers', e.target.value)} className="rounded-xl h-11" min={0} max={10} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Coverage Type <span className="text-red-500">*</span>
                    <span className="text-muted-foreground text-xs font-normal ml-1">— Individual or family</span>
                  </Label>
                  <Select value={formData.coverageType} onValueChange={(val) => updateField('coverageType', val)}>
                    <SelectTrigger className={`w-full rounded-xl h-11 ${formErrors.coverageType ? 'border-red-500 ring-1 ring-red-500/30' : ''}`}><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{COVERAGE_TYPE_OPTIONS.map((ct) => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}</SelectContent>
                  </Select>
                  {formErrors.coverageType && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.coverageType}</p>}
                </div>
              </div>
            )}

            {/* Term: Age */}
            {showTermFields && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Your Age <span className="text-red-500">*</span>
                  <span className="text-muted-foreground text-xs font-normal ml-1">— Affects premium calculation</span>
                </Label>
                <Input type="number" placeholder="e.g., 30" value={formData.age} onChange={(e) => updateField('age', e.target.value)}
                  className={`rounded-xl h-11 max-w-[200px] ${formErrors.age ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} min={18} max={65} />
                {formErrors.age && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.age}</p>}
              </div>
            )}

            {/* Name + Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Your Name <span className="text-red-500">*</span></Label>
                <Input placeholder="Aapka naam" value={formData.name} onChange={(e) => updateField('name', e.target.value)}
                  className={`rounded-xl h-11 ${formErrors.name ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} />
                {formErrors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Mobile (WhatsApp) <span className="text-red-500">*</span></Label>
                <Input type="tel" placeholder="10-digit mobile number" value={formData.mobile} onChange={(e) => updateField('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`rounded-xl h-11 ${formErrors.mobile ? 'border-red-500 ring-1 ring-red-500/30' : ''}`} />
                {formErrors.mobile && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {formErrors.mobile}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Email <span className="text-muted-foreground text-xs font-normal">(Optional)</span></Label>
              <Input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="rounded-xl h-11" />
            </div>

            {/* GST Info Note */}
            {pt && (
              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 p-3">
                <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <BadgePercent className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold">GST:</span> {GST_INFO}
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 p-3">
                <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <Button size="lg" onClick={handleSubmit} disabled={loading}
              className="w-full rounded-full gap-2 h-12 text-base font-semibold shadow-lg shadow-blue-800/20 bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> AI Analyzing...</> : <>Run Free Audit <ArrowRight className="w-5 h-5" /></>}
            </Button>
            <p className="text-center text-xs text-muted-foreground">🔒 Your data is secure. We never share your details with third parties.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // ── Render: Report ─────────────────────────────────────────
  const renderReport = () => {
    if (!report) return null;
    const pt = formData.policyType;
    const showMotorFields = isMotorType(pt);
    const showHealthFields = isHealthType(pt);
    const showTermFields = isTermType(pt);
    const showTravelFields = isTravelType(pt);
    const showHomeFields = isHomeType(pt);
    const totalSavings = report.savingsBreakdown.idv + report.savingsBreakdown.addOns + report.savingsBreakdown.insurerSwitch + report.savingsBreakdown.ncb;

    return (
      <motion.div key="report" variants={phaseVariants} initial="enter" animate="center" exit="exit" className="max-w-4xl mx-auto space-y-6">
        {/* Report Header */}
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setPhase('form')} className="w-9 h-9 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur border border-border/50 flex items-center justify-center hover:bg-white dark:hover:bg-white/15 transition-colors" aria-label="Go back to form">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Audit Report</h3>
            <p className="text-xs text-muted-foreground">{showMotorFields ? `${formData.vehicle} • ${formData.insurer}` : `${formData.insurer}`}</p>
          </div>
        </div>

        {/* Total Potential Savings Banner */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-emerald-600 via-[#C98A1C] to-emerald-600 p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <TrendingDown className="w-7 h-7 text-white" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <p className="text-sm text-emerald-100 font-medium">Total Potential Savings</p>
              <p className="text-3xl sm:text-4xl font-extrabold mt-1">
                <AnimatedCounter target={report.potentialSavings} prefix="₹" suffix="/yr" />
              </p>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 px-3 py-1.5 text-xs font-bold rounded-full">
              <BadgeCheck className="w-3.5 h-3.5 mr-1" /> IRDAI Accurate
            </Badge>
          </div>
        </motion.div>

        {/* Health Score + Savings Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Health Score */}
          <Card className="rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur border-border/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2"><Gauge className="w-5 h-5 text-blue-700 dark:text-blue-400" /> Insurance Health Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center pb-6">
              <HealthScoreGauge score={report.healthScore} />
              <p className="mt-3 text-sm text-muted-foreground text-center">
                {report.healthScore <= 40 ? 'Aapki policy mein significant gaps hain. Immediate action recommended!'
                  : report.healthScore <= 60 ? 'Aapki policy theek hai, lekin improvements possible hain.'
                  : report.healthScore <= 80 ? 'Aapki policy achhi hai! Kuch fine-tuning se aur better ho sakti hai.'
                  : 'Excellent! Aapki policy well-optimized hai.'}
              </p>
            </CardContent>
          </Card>

          {/* Savings Breakdown with Progress Bars */}
          <Card className="rounded-3xl bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/20 backdrop-blur border-emerald-200/60 dark:border-emerald-800/40 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <TrendingDown className="w-5 h-5" /> Savings Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6 space-y-4">
              <SavingsBar label={showHealthFields || showTermFields ? 'Sum Optimization' : showTravelFields ? 'Coverage Optimization' : showHomeFields ? 'Property Optimization' : 'IDV Optimization'} value={report.savingsBreakdown.idv} total={totalSavings} color="bg-blue-500" />
              <SavingsBar label="Add-on Optimization" value={report.savingsBreakdown.addOns} total={totalSavings} color="bg-amber-500" />
              <SavingsBar label="Insurer Switch" value={report.savingsBreakdown.insurerSwitch} total={totalSavings} color="bg-emerald-500" />
              <SavingsBar label="NCB Utilization" value={report.savingsBreakdown.ncb} total={totalSavings} color="bg-[#C98A1C]" />
              <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/30 flex justify-between items-center">
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Total</span>
                <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">{formatCurrency(totalSavings)}/yr</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Red Flags */}
        {report.redFlags.length > 0 && (
          <Card className="rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur border-border/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-600" /> Red Flags Found</CardTitle>
              <CardDescription>Aapki policy mein yeh issues milein hain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {report.redFlags.map((flag, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                    className={`rounded-xl border p-3 sm:p-4 ${flag.severity === 'high' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/40' : flag.severity === 'medium' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40' : 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/40'}`}>
                    <div className="flex items-start gap-2.5">
                      <span className="text-base mt-0.5 shrink-0">{getSeverityEmoji(flag.severity)}</span>
                      <div className="min-w-0"><p className="text-sm font-bold text-foreground">{flag.issue}</p><p className="text-xs text-muted-foreground mt-0.5">{flag.impact}</p></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <Card className="rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur border-border/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-600" /> Recommendations</CardTitle>
              <CardDescription>In steps ko follow karein apni policy optimize karne ke liye</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {report.recommendations.map((rec, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-800/30">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                      <span className="text-xs font-bold text-white">{idx + 1}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed pt-0.5">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current vs Recommended */}
        <Card className="rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur border-border/50 shadow-lg overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-[#C98A1C]" /> Current vs Recommended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/60 dark:border-red-800/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center"><X className="w-4 h-4 text-red-600 dark:text-red-400" /></div>
                  <h4 className="text-sm font-bold text-red-700 dark:text-red-300">Current Policy</h4>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Premium', value: formatCurrency(report.currentPolicy.premium) },
                    ...(showMotorFields ? [{ label: 'IDV', value: formatCurrency(report.currentPolicy.idv) }] : [{ label: showHealthFields ? 'Sum Insured' : showTravelFields ? 'Sum Insured' : showHomeFields ? 'Property Value' : 'Sum Assured', value: formatCurrency(report.currentPolicy.idv) }]),
                    { label: 'CSR', value: report.currentPolicy.csr },
                    { label: 'Add-ons', value: report.currentPolicy.addOns.length > 0 ? report.currentPolicy.addOns.join(', ') : 'None' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /></div>
                  <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Recommended</h4>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'Premium', value: formatCurrency(report.recommendedPolicy.premium) },
                    { label: showMotorFields ? 'IDV' : showHealthFields ? 'Sum Insured' : showTravelFields ? 'Sum Insured' : showHomeFields ? 'Property Value' : 'Sum Assured', value: formatCurrency(report.recommendedPolicy.idv) },
                    { label: 'CSR', value: report.recommendedPolicy.csr },
                    { label: 'Savings', value: `${formatCurrency(report.recommendedPolicy.savings)}/yr`, highlight: true },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                      <span className={`text-sm font-semibold ${item.highlight ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-foreground'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Plans */}
        {report.comparisonPlans && report.comparisonPlans.length > 0 && (
          <Card className="rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur border-border/50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" /> Better Plans Available — Compare & Save
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-0 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">
                  <BadgeCheck className="w-3 h-3 mr-0.5" /> IRDAI Accurate
                </Badge>
              </CardTitle>
              <CardDescription>In plans mein se koi bhi choose karein — sab aapki current policy se sasta aur better hai</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {report.comparisonPlans.map((plan, idx) => {
                  const badgeColors: Record<string, string> = {
                    'Best Value': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
                    'Lowest Price': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
                    'Best Coverage': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
                    'Most Popular': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
                  };
                  const isBest = plan.badge === 'Best Value';
                  return (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      className={`rounded-2xl border p-4 sm:p-5 relative transition-all hover:shadow-md ${isBest ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-200 dark:ring-emerald-800' : 'bg-white/60 dark:bg-white/5 border-border/50'}`}>
                      {isBest && <div className="absolute -top-0 left-4 bg-gradient-to-r from-emerald-600 to-[#C98A1C] text-white text-[10px] font-bold px-3 py-1 rounded-b-lg shadow-sm">⭐ RECOMMENDED</div>}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mt-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-foreground">{plan.insurer}</h4>
                            <Badge className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                              <BadgeCheck className="w-2.5 h-2.5 mr-0.5" /> IRDAI Accurate
                            </Badge>
                            {plan.badge && <Badge className={`text-[10px] px-2 py-0.5 border-0 font-bold rounded-full ${badgeColors[plan.badge] || 'bg-slate-100 text-slate-700'}`}>{plan.badge}</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{plan.planName}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-extrabold text-foreground">{formatCurrency(plan.premium)}</p>
                          <p className="text-[10px] text-muted-foreground">per year</p>
                          {plan.savings > 0 ? (
                            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                              <TrendingDown className="w-3 h-3" /> Save {formatCurrency(plan.savings)}/yr
                            </div>
                          ) : plan.savings < 0 ? (
                            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold">
                              +{formatCurrency(Math.abs(plan.savings))}/yr extra
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Stats — Motor */}
                      {showMotorFields && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                          {[{ l: 'CSR', v: `${plan.csr}%` }, { l: 'IDV', v: formatCurrency(plan.idv) }, { l: 'Garages', v: `${plan.cashlessGarages.toLocaleString()}+` }, { l: 'Claim Rating', v: `${'★'.repeat(Math.floor(plan.claimRating))} ${plan.claimRating}/5` }]
                            .map((s) => <div key={s.l} className="p-2 rounded-lg bg-muted/30"><p className="text-[10px] text-muted-foreground uppercase font-medium">{s.l}</p><p className="text-sm font-bold text-foreground">{s.v}</p></div>)}
                        </div>
                      )}
                      {/* Stats — Health */}
                      {showHealthFields && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                          {[{ l: 'Network Hospitals', v: plan.networkHospitals?.toLocaleString() ?? '—' }, { l: 'Room Rent', v: plan.roomRentLimit ?? '—' }, { l: 'PED Wait', v: plan.waitingPeriodPED ?? '—' }, { l: 'Restoration', v: plan.restoration ?? '—' }]
                            .map((s) => <div key={s.l} className="p-2 rounded-lg bg-muted/30"><p className="text-[10px] text-muted-foreground uppercase font-medium">{s.l}</p><p className="text-sm font-bold text-foreground">{s.v}</p></div>)}
                        </div>
                      )}
                      {/* Stats — Term */}
                      {showTermFields && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                          {[{ l: 'Solvency Ratio', v: plan.solvencyRatio ?? '—' }, { l: 'Claim Turnaround', v: plan.claimTurnaroundDays ? `${plan.claimTurnaroundDays} days` : '—' }, { l: 'Policy Term', v: plan.policyTerm ?? '—' }, { l: 'Max Maturity Age', v: plan.maxMaturityAge ?? '—' }]
                            .map((s) => <div key={s.l} className="p-2 rounded-lg bg-muted/30"><p className="text-[10px] text-muted-foreground uppercase font-medium">{s.l}</p><p className="text-sm font-bold text-foreground">{s.v}</p></div>)}
                        </div>
                      )}

                      {/* Add-ons Included */}
                      {plan.addOnsIncluded.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider mb-1.5">{showTermFields ? 'Riders Included ✓' : 'Add-ons Included ✓'}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {plan.addOnsIncluded.map((a) => <Badge key={a} variant="outline" className="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40 rounded-full px-2 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1" />{a}</Badge>)}
                          </div>
                        </div>
                      )}
                      {plan.addOnsAvailable.length > 0 && (
                        <div className="mt-2">
                          <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1.5">{showTermFields ? 'Optional Riders' : 'Optional Add-ons'}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {plan.addOnsAvailable.map((a) => <Badge key={a} variant="outline" className="text-[10px] bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40 rounded-full px-2 py-0.5">+ {a}</Badge>)}
                          </div>
                        </div>
                      )}
                      {plan.keyFeatures.length > 0 && (
                        <div className="mt-3">
                          <p className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-1.5">Key Features</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {plan.keyFeatures.map((f, i) => <div key={i} className="flex items-center gap-1.5 text-xs text-foreground/70"><Zap className="w-3 h-3 text-amber-500 shrink-0" /><span>{f}</span></div>)}
                          </div>
                        </div>
                      )}
                      <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        <Button size="sm" onClick={handleWhatsAppCTA}
                          className={`rounded-full gap-2 text-xs font-bold shadow-sm ${isBest ? 'bg-gradient-to-r from-emerald-600 to-[#C98A1C] hover:from-emerald-700 hover:to-[#C98A1C]/80 text-white' : 'bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white'}`}>
                          <MessageCircle className="w-3.5 h-3.5" /> Get This Plan
                        </Button>
                        <a href="tel:9257877312"><Button variant="outline" size="sm" className="rounded-full gap-2 text-xs font-semibold w-full sm:w-auto"><Phone className="w-3.5 h-3.5" /> Call for Details</Button></a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Download PDF */}
        <Card className="rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur border-border/50 shadow-lg">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shrink-0"><Download className="w-6 h-6 text-white" /></div>
                <div><h4 className="text-sm font-bold text-foreground">Download Full Audit Report</h4><p className="text-xs text-muted-foreground mt-0.5">Complete PDF with all details, comparisons & recommendations</p></div>
              </div>
              <Button size="lg" onClick={handleDownloadPDF} className="rounded-full gap-2 h-11 px-6 text-sm font-bold shadow-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shrink-0">
                <Download className="w-4 h-4" /> Download PDF Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Switch & Save CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-3xl bg-gradient-to-br from-emerald-600 to-[#C98A1C] p-6 sm:p-8 text-white text-center shadow-xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Ready to Save {formatCurrency(report.potentialSavings)}/year?</h3>
          <p className="text-sm text-emerald-100/90 mb-5 max-w-lg mx-auto">Abhi WhatsApp pe baat karo – hum aapko best deal dilaenge! Free consultation, no obligation.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={handleWhatsAppCTA} className="rounded-full gap-2 h-12 px-8 text-base font-bold shadow-lg bg-white text-emerald-700 hover:bg-emerald-50">
              <MessageCircle className="w-5 h-5" /> Switch & Save on WhatsApp
            </Button>
            <a href="tel:9257877312"><Button size="lg" variant="outline" className="rounded-full gap-2 h-12 px-8 text-base font-semibold border-white/30 text-white hover:bg-white/15 w-full sm:w-auto">
              <Phone className="w-4 h-4" /> Call: 9257877312
            </Button></a>
          </div>
        </motion.div>

        {/* WhatsApp CTA — Expert Help */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="rounded-2xl bg-gradient-to-r from-green-600 to-green-700 p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-base font-bold">Get Expert Help — WhatsApp Us</h4>
              <p className="text-xs text-green-100/80 mt-0.5">Free consultation with our IRDAI licensed advisor</p>
            </div>
          </div>
          <a href="https://wa.me/919257877312?text=Namaste!%20I%20need%20help%20with%20my%20insurance%20policy" target="_blank" rel="noopener noreferrer">
            <Button className="rounded-full gap-2 bg-white text-green-700 hover:bg-green-50 font-bold shadow-lg h-11 px-6">
              <MessageCircle className="w-4 h-4" /> Chat Now
            </Button>
          </a>
        </motion.div>

        {/* GST Info */}
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 p-3">
          <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
            <BadgePercent className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold">GST Information:</span> {GST_INFO}
          </p>
        </div>

        {/* IRDAI Disclaimer */}
        <div className="rounded-xl bg-muted/40 border border-border/40 p-3">
          <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed text-center">
            ⚠️ IRDAI Disclaimer: This audit is based on the information provided by you and general market data. Actual savings may vary. This is not investment advice. Premium estimates are indicative. Please read policy wording carefully before making any changes. Paliwal Secure is an IRDAI-certified POSP. POSP Code: IP429834
          </p>
        </div>
      </motion.div>
    );
  };

  // ── Main Render ────────────────────────────────────────────
  return (
    <section id="reverse-audit" className="py-12 sm:py-20 bg-gradient-to-b from-muted/30 to-background scroll-mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {phase === 'intro' && renderIntro()}
          {phase === 'form' && renderForm()}
          {phase === 'report' && renderReport()}
        </AnimatePresence>
      </div>
    </section>
  );
}
