'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, AlertCircle, Info, ShieldCheck, Star, TrendingUp, Award, Activity } from 'lucide-react';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type PEDStatus = 'none' | 'diabetes' | 'bp' | 'heart' | 'thyroid' | 'asthma';

interface InsurerData {
  name: string;
  csr: number; // Claim Settlement Ratio %
  icr: number; // Incurred Claim Ratio %
  complaintsPer10k: number;
  pedWaitingMonths: number;
  specialty: string;
}

const INSURER_DATABASE: InsurerData[] = [
  { name: 'Acko General Insurance', csr: 99.91, icr: 81.23, complaintsPer10k: 2, pedWaitingMonths: 24, specialty: 'Digital-First, Quick Claims' },
  { name: 'HDFC ERGO General Insurance', csr: 98.85, icr: 84.85, complaintsPer10k: 8, pedWaitingMonths: 24, specialty: 'Optima Restore, Wide Network' },
  { name: 'Care Health Insurance', csr: 93.13, icr: 61.28, complaintsPer10k: 12, pedWaitingMonths: 24, specialty: '21.7K Hospitals, Ayurveda Cover' },
  { name: 'Star Health & Allied Insurance', csr: 88.34, icr: 67.26, complaintsPer10k: 18, pedWaitingMonths: 36, specialty: 'Diabetic Care Package' },
  { name: 'TATA AIG General Insurance', csr: 96.67, icr: 72.45, complaintsPer10k: 6, pedWaitingMonths: 24, specialty: 'Trusted Brand, Critical Illness' },
  { name: 'Bajaj Allianz General Insurance', csr: 93.65, icr: 78.90, complaintsPer10k: 10, pedWaitingMonths: 24, specialty: 'Health Guard, High Solvency' },
  { name: 'ICICI Lombard General Insurance', csr: 91.22, icr: 82.50, complaintsPer10k: 14, pedWaitingMonths: 24, specialty: 'Elevate Plan, Global Cover' },
  { name: 'Niva Bupa Health Insurance', csr: 95.20, icr: 59.80, complaintsPer10k: 9, pedWaitingMonths: 24, specialty: 'ReAssure 2.0, Wellness' },
];

const PED_LABELS: Record<PEDStatus, string> = {
  'none': 'None',
  'diabetes': 'Diabetes',
  'bp': 'BP / Hypertension',
  'heart': 'Heart Disease',
  'thyroid': 'Thyroid',
  'asthma': 'Asthma',
};

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

function getICRHealthScore(icr: number): number {
  if (icr >= 60 && icr <= 85) return 100;
  if (icr > 85 && icr <= 95) return 85;
  if (icr > 95) return 50;
  return 60; // <60%
}

function getClaimSpeedScore(csr: number): number {
  if (csr > 95) return 100;
  if (csr >= 90 && csr <= 95) return 80;
  if (csr >= 85 && csr < 90) return 60;
  return 40; // <85%
}

function getComplaintScore(complaintsPer10k: number): number {
  return Math.max(0, 100 - complaintsPer10k * 2);
}

function getOverallCSPScore(csr: number, icr: number, complaintsPer10k: number): number {
  const csrScore = csr; // Already 0-100 scale
  const icrScore = getICRHealthScore(icr);
  const claimSpeedScore = getClaimSpeedScore(csr);
  const complaintScore = getComplaintScore(complaintsPer10k);

  return Math.round(
    (csrScore * 0.40) +
    (icrScore * 0.20) +
    (claimSpeedScore * 0.20) +
    (complaintScore * 0.20)
  );
}

function getRating(score: number): { label: string; color: string; bgColor: string; textColor: string } {
  if (score >= 90) return { label: 'Excellent', color: 'text-emerald-600', bgColor: 'bg-emerald-500', textColor: 'text-emerald-700 dark:text-emerald-300' };
  if (score >= 75) return { label: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-500', textColor: 'text-yellow-700 dark:text-yellow-300' };
  if (score >= 60) return { label: 'Average', color: 'text-orange-600', bgColor: 'bg-orange-500', textColor: 'text-orange-700 dark:text-orange-300' };
  return { label: 'Poor', color: 'text-red-600', bgColor: 'bg-red-500', textColor: 'text-red-700 dark:text-red-300' };
}

// ============================================================================
// HELPERS
// ============================================================================

function formatNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

interface CSPResult {
  score: number;
  rating: { label: string; color: string; bgColor: string; textColor: string };
  breakdown: {
    csr: number;
    csrWeight: number;
    icrHealth: number;
    icrHealthWeight: number;
    claimSpeed: number;
    claimSpeedWeight: number;
    complaintIndex: number;
    complaintIndexWeight: number;
  };
  allInsurers: {
    name: string;
    score: number;
    rating: string;
    csr: number;
    icr: number;
    complaintsPer10k: number;
  }[];
  pedImpact: string;
  recommendationMessage: string;
}

function calculateCSP(
  selectedInsurer: string,
  csr: number,
  icr: number,
  complaintsPer10k: number,
  ped: PEDStatus
): CSPResult {
  const score = getOverallCSPScore(csr, icr, complaintsPer10k);
  const rating = getRating(score);

  const icrHealth = getICRHealthScore(icr);
  const claimSpeed = getClaimSpeedScore(csr);
  const complaintIndex = getComplaintScore(complaintsPer10k);

  const breakdown = {
    csr,
    csrWeight: Math.round(csr * 0.40 * 100) / 100,
    icrHealth,
    icrHealthWeight: Math.round(icrHealth * 0.20 * 100) / 100,
    claimSpeed,
    claimSpeedWeight: Math.round(claimSpeed * 0.20 * 100) / 100,
    complaintIndex,
    complaintIndexWeight: Math.round(complaintIndex * 0.20 * 100) / 100,
  };

  // Calculate scores for all insurers
  const allInsurers = INSURER_DATABASE.map((ins) => {
    const insScore = getOverallCSPScore(ins.csr, ins.icr, ins.complaintsPer10k);
    const insRating = getRating(insScore);
    return {
      name: ins.name,
      score: insScore,
      rating: insRating.label,
      csr: ins.csr,
      icr: ins.icr,
      complaintsPer10k: ins.complaintsPer10k,
    };
  }).sort((a, b) => b.score - a.score);

  // PED impact
  const pedImpactMap: Record<PEDStatus, string> = {
    'none': 'No PED impact on settlement probability.',
    'diabetes': 'Diabetes se claim settlement thoda affected ho sakta hai — longer waiting period (24-48 months) apply hota hai.',
    'bp': 'BP/Hypertension ke claims mein waiting period 24-36 months hota hai. Settlement probability normal hai after waiting period.',
    'heart': 'Heart Disease ke liye waiting period 36-48 months hota hai. Is duration mein related claims reject ho sakte hain.',
    'thyroid': 'Thyroid ke liye typically 24 months waiting period hai. Moderate impact on claim settlement.',
    'asthma': 'Asthma ke liye 24-36 months waiting period hai. Claim settlement generally smooth after waiting period.',
  };

  let recommendationMessage = '';
  if (score >= 90) {
    recommendationMessage = `${selectedInsurer} ka Claim Settlement Score bahut achha hai (${score}/100). Aap confidently choose kar sakte hain.`;
  } else if (score >= 75) {
    recommendationMessage = `${selectedInsurer} ka score good hai (${score}/100). Recommended for you, lekin terms & conditions dhyan se padhein.`;
  } else if (score >= 60) {
    recommendationMessage = `${selectedInsurer} ka score average hai (${score}/100). Dusre insurers bhi compare karein before deciding.`;
  } else {
    recommendationMessage = `${selectedInsurer} ka score below average hai (${score}/100). Dusre high-CSR insurers consider karein for better claim experience.`;
  }

  return {
    score,
    rating,
    breakdown,
    allInsurers,
    pedImpact: pedImpactMap[ped],
    recommendationMessage,
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function ClaimSettlementPredictor() {
  const [selectedInsurer, setSelectedInsurer] = useState(INSURER_DATABASE[0].name);
  const [csr, setCsr] = useState(INSURER_DATABASE[0].csr);
  const [icr, setIcr] = useState(INSURER_DATABASE[0].icr);
  const [complaintsPer10k, setComplaintsPer10k] = useState(INSURER_DATABASE[0].complaintsPer10k);
  const [ped, setPed] = useState<PEDStatus>('none');
  const [showResult, setShowResult] = useState(false);

  const handleInsurerChange = (name: string) => {
    setSelectedInsurer(name);
    const insurer = INSURER_DATABASE.find((i) => i.name === name);
    if (insurer) {
      setCsr(insurer.csr);
      setIcr(insurer.icr);
      setComplaintsPer10k(insurer.complaintsPer10k);
    }
  };

  const result = useMemo(
    () => calculateCSP(selectedInsurer, csr, icr, complaintsPer10k, ped),
    [selectedInsurer, csr, icr, complaintsPer10k, ped]
  );

  const handleCalculate = () => {
    setShowResult(true);
  };

  return (
    <Card className="w-full border-0 shadow-lg shadow-purple-500/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg sm:text-xl">Claim Settlement Probability Score</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Jaanein kaunsa insurer sabse reliable hai — data-driven scoring
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Select Insurer */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Insurer</Label>
          <Select value={selectedInsurer} onValueChange={handleInsurerChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INSURER_DATABASE.map((ins) => (
                <SelectItem key={ins.name} value={ins.name}>
                  {ins.name} (CSR {ins.csr}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* CSR % (auto-filled, editable) */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            Claim Settlement Ratio (CSR) %
            <Badge variant="outline" className="text-xs">Auto-filled</Badge>
          </Label>
          <Input
            type="number"
            value={csr}
            onChange={(e) => setCsr(Number(e.target.value) || 0)}
            min={0}
            max={100}
            step={0.01}
          />
        </div>

        {/* ICR % (auto-filled, editable) */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            Incurred Claim Ratio (ICR) %
            <Badge variant="outline" className="text-xs">Auto-filled</Badge>
          </Label>
          <Input
            type="number"
            value={icr}
            onChange={(e) => setIcr(Number(e.target.value) || 0)}
            min={0}
            max={150}
            step={0.01}
          />
        </div>

        {/* Complaints (auto-filled, editable) */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            Complaints per 10,000 policies
            <Badge variant="outline" className="text-xs">Auto-filled</Badge>
          </Label>
          <Input
            type="number"
            value={complaintsPer10k}
            onChange={(e) => setComplaintsPer10k(Number(e.target.value) || 0)}
            min={0}
            max={100}
            step={1}
          />
        </div>

        {/* PED Status */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Your PED Status</Label>
          <Select value={ped} onValueChange={(v) => setPed(v as PEDStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PED_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
          size="lg"
        >
          <BarChart3 className="h-4 w-4" />
          Calculate CSP Score
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

              {/* Score Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 p-6 text-center text-white"
              >
                <p className="text-sm opacity-80 mb-2">Claim Settlement Probability Score</p>
                <div className="relative inline-flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className={`text-6xl sm:text-7xl font-bold ${result.rating.color.replace('text-', 'text-')}`}
                    style={{ color: result.score >= 90 ? '#10b981' : result.score >= 75 ? '#eab308' : result.score >= 60 ? '#f97316' : '#ef4444' }}
                  >
                    {result.score}
                  </motion.div>
                </div>
                <p className="text-sm mt-2 opacity-75">out of 100</p>
                <Badge
                  className={`mt-3 text-sm font-semibold ${
                    result.score >= 90 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    result.score >= 75 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                    result.score >= 60 ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                    'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}
                >
                  <Star className="h-3.5 w-3.5 mr-1" />
                  {result.rating.label}
                </Badge>
              </motion.div>

              {/* Score Breakdown */}
              <div className="rounded-xl bg-white/50 dark:bg-white/5 p-4 border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  Score Breakdown (Weighted Components)
                </h3>
                <div className="space-y-3">
                  {/* CSR */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">CSR Score (40% weight)</span>
                      <span className="font-medium">{result.breakdown.csr.toFixed(2)} → {result.breakdown.csrWeight.toFixed(1)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.breakdown.csr}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* ICR Health */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">ICR Health Score (20% weight)</span>
                      <span className="font-medium">{result.breakdown.icrHealth} → {result.breakdown.icrHealthWeight.toFixed(1)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.breakdown.icrHealth}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Claim Speed */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Claim Speed Score (20% weight)</span>
                      <span className="font-medium">{result.breakdown.claimSpeed} → {result.breakdown.claimSpeedWeight.toFixed(1)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.breakdown.claimSpeed}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="h-full bg-purple-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Complaint Index */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Complaint Index (20% weight)</span>
                      <span className="font-medium">{result.breakdown.complaintIndex} → {result.breakdown.complaintIndexWeight.toFixed(1)}</span>
                    </div>
                    <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.breakdown.complaintIndex}%` }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="h-full bg-amber-500 rounded-full"
                      />
                    </div>
                  </div>

                  <Separator />
                  <div className="flex justify-between font-semibold text-sm">
                    <span>Total Weighted Score</span>
                    <span className={result.rating.textColor}>{result.score}/100</span>
                  </div>
                </div>
              </div>

              {/* PED Impact */}
              {ped !== 'none' && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <Info className="h-4 w-4 mt-0.5 shrink-0" />
                    {result.pedImpact}
                  </p>
                </div>
              )}

              {/* Recommendation */}
              <div className={`rounded-lg p-3 ${
                result.score >= 90 ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800' :
                result.score >= 75 ? 'bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800' :
                result.score >= 60 ? 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800' :
                'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
              }`}>
                <p className={`text-sm font-medium flex items-start gap-2 ${result.rating.textColor}`}>
                  <Award className="h-4 w-4 mt-0.5 shrink-0" />
                  {result.recommendationMessage}
                </p>
              </div>

              {/* All Insurers Comparison */}
              <div className="rounded-xl bg-white/50 dark:bg-white/5 p-4 border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  All Insurers Comparison (CSP Score)
                </h3>
                <div className="space-y-2">
                  {result.allInsurers.map((ins, idx) => (
                    <motion.div
                      key={ins.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      className={`flex items-center gap-3 p-2.5 rounded-lg ${
                        ins.name === selectedInsurer
                          ? 'bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800'
                          : 'bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        ins.score >= 90 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                        ins.score >= 75 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                        ins.score >= 60 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{ins.name}</p>
                          {ins.name === selectedInsurer && (
                            <Badge variant="default" className="text-[10px] h-4 bg-purple-600">Selected</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">CSR {ins.csr}% · ICR {ins.icr}% · {formatNumber(ins.complaintsPer10k)}/10K complaints</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-lg font-bold ${
                          ins.score >= 90 ? 'text-emerald-600' :
                          ins.score >= 75 ? 'text-yellow-600' :
                          ins.score >= 60 ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {ins.score}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{ins.rating}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Scoring Formula Info */}
              <div className="rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 p-4 dark:from-purple-950/30 dark:to-indigo-950/30">
                <h3 className="text-sm font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Scoring Methodology
                </h3>
                <div className="text-xs text-purple-700 dark:text-purple-400 space-y-1.5">
                  <p>• <strong>CSP Score = CSR×40% + ICR Health×20% + Claim Speed×20% + Complaint Index×20%</strong></p>
                  <p>• <strong>ICR Health:</strong> 60-85% → 100 pts, 85-95% → 85 pts, &gt;95% → 50 pts, &lt;60% → 60 pts</p>
                  <p>• <strong>Claim Speed:</strong> CSR &gt;95% → 100 pts, 90-95% → 80 pts, 85-90% → 60 pts, &lt;85% → 40 pts</p>
                  <p>• <strong>Complaint Index:</strong> max(0, 100 - complaints×2)</p>
                  <p>• Data source: IRDAI Annual Report 2025-26</p>
                </div>
              </div>

              {/* IRDAI Disclaimer */}
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
                <p className="text-xs text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  CSP Score is based on publicly available IRDAI data and is indicative only. Past claim settlement performance is not a guarantee of future outcomes. Individual claim experiences may vary based on policy terms, documentation, and circumstances.
                </p>
              </div>

              {/* Branding */}
              <p className="text-center text-xs text-muted-foreground pt-1">
                Powered by <span className="font-semibold text-purple-600">Himanshu Paliwal</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
