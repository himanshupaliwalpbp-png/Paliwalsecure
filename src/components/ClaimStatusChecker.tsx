'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle2, Clock, XCircle, Eye, FileText, Calendar, IndianRupee, ArrowRight, Loader2 } from 'lucide-react';
import { GAEvents } from '@/lib/ga-events';

// ── Types ──────────────────────────────────────────────────────────────────────
type ClaimStatus = 'approved' | 'in_progress' | 'rejected' | 'under_review';

interface ClaimResult {
  status: ClaimStatus;
  policyNumber: string;
  claimAmount: number;
  dateFiled: string;
  estimatedResolution: string;
  claimId: string;
  insuranceType: string;
  progressSteps: { label: string; completed: boolean; active: boolean }[];
}

// ── Deterministic hash function ────────────────────────────────────────────────
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// ── Mock data generator ────────────────────────────────────────────────────────
function generateMockClaim(policyNumber: string): ClaimResult {
  const hash = simpleHash(policyNumber.toUpperCase().trim());
  const statuses: ClaimStatus[] = ['approved', 'in_progress', 'rejected', 'under_review'];
  const statusIndex = hash % statuses.length;
  const status = statuses[statusIndex];

  const insuranceTypes = ['Health Insurance', 'Motor Insurance', 'Term Life Insurance', 'Travel Insurance', 'Home Insurance'];
  const insuranceType = insuranceTypes[hash % insuranceTypes.length];

  const claimAmount = ((hash % 500000) + 10000);
  const dayOffset = (hash % 30) + 1;
  const filedDate = new Date();
  filedDate.setDate(filedDate.getDate() - dayOffset);

  const resolutionDate = new Date(filedDate);
  resolutionDate.setDate(resolutionDate.getDate() + (hash % 45) + 7);

  const claimId = `CLM-${(hash % 900000 + 100000).toString()}`;

  // Progress steps based on status
  const progressSteps = [
    { label: 'Claim Filed', completed: true, active: false },
    { label: 'Documents Verified', completed: status === 'approved' || status === 'rejected' || (status === 'in_progress' && hash % 3 !== 0), active: status === 'under_review' },
    { label: 'Under Review', completed: status === 'approved' || status === 'rejected', active: status === 'in_progress' || status === 'under_review' },
    { label: 'Assessment Complete', completed: status === 'approved' || status === 'rejected', active: false },
    { label: 'Settlement', completed: status === 'approved', active: false },
  ];

  return {
    status,
    policyNumber: policyNumber.toUpperCase().trim(),
    claimAmount,
    dateFiled: filedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    estimatedResolution: status === 'approved'
      ? 'Completed'
      : status === 'rejected'
        ? 'N/A'
        : resolutionDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    claimId,
    insuranceType,
    progressSteps,
  };
}

// ── Status config ──────────────────────────────────────────────────────────────
const statusConfig: Record<ClaimStatus, {
  label: string;
  icon: React.ReactNode;
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
  color: string;
  bgClass: string;
  emoji: string;
}> = {
  approved: {
    label: 'Approved',
    icon: <CheckCircle2 className="size-4" />,
    badgeVariant: 'default',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    emoji: '✅',
  },
  in_progress: {
    label: 'In Progress',
    icon: <Clock className="size-4" />,
    badgeVariant: 'secondary',
    color: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    emoji: '⏳',
  },
  rejected: {
    label: 'Rejected',
    icon: <XCircle className="size-4" />,
    badgeVariant: 'destructive',
    color: 'text-red-600 dark:text-red-400',
    bgClass: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    emoji: '❌',
  },
  under_review: {
    label: 'Under Review',
    icon: <Eye className="size-4" />,
    badgeVariant: 'outline',
    color: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    emoji: '🔍',
  },
};

// ── Animation variants ─────────────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 20, stiffness: 300 },
  },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } },
};

const detailVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.3 },
  }),
};

// ── Skeleton Loader ────────────────────────────────────────────────────────────
function ClaimSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="h-6 w-36 rounded bg-muted animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 rounded bg-muted animate-pulse" />
            <div className="h-5 w-28 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-2 flex-1 rounded-full bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// ── Progress Timeline ──────────────────────────────────────────────────────────
function ProgressTimeline({ steps }: { steps: ClaimResult['progressSteps'] }) {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-muted-foreground mb-3">Claim Progress</p>
      <div className="flex items-center gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            {/* Step dot and label */}
            <div className="flex flex-col items-center gap-1.5 min-w-[60px]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', damping: 15 }}
                className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
                  step.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : step.active
                      ? 'bg-amber-400 border-amber-400 text-white animate-status-pulse'
                      : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {step.completed ? '✓' : step.active ? '●' : (i + 1)}
              </motion.div>
              <span className={`text-[10px] leading-tight text-center ${
                step.completed ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : step.active ? 'text-amber-600 dark:text-amber-400 font-medium'
                    : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mt-[-18px] mx-1">
                <div className={`h-full rounded-full transition-colors ${
                  step.completed ? 'bg-emerald-500' : 'bg-muted-foreground/20'
                }`}>
                  {step.completed && (
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full animate-progress-shimmer"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ClaimStatusChecker() {
  const [policyNumber, setPolicyNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [error, setError] = useState('');

  const handleCheckStatus = useCallback(async () => {
    const trimmed = policyNumber.trim();

    if (!trimmed) {
      setError('Please enter a policy number');
      return;
    }

    if (trimmed.length < 3) {
      setError('Policy number must be at least 3 characters');
      return;
    }

    setError('');
    setIsLoading(true);
    setResult(null);

    // Track GA event
    GAEvents.categorySelect('claim_status_check');

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));

    const claim = generateMockClaim(trimmed);
    setResult(claim);
    setIsLoading(false);
  }, [policyNumber]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheckStatus();
    }
  }, [handleCheckStatus]);

  const currentStatus = result ? statusConfig[result.status] : null;

  return (
    <Card className="glass-liquid border-0 rounded-2xl overflow-hidden w-full max-w-lg mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="size-4 text-primary" />
          </div>
          Claim Status Checker
        </CardTitle>
        <CardDescription>
          Enter your policy number to track your claim status in real-time
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input Form */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Enter policy number (e.g., POL-123456)"
              value={policyNumber}
              onChange={(e) => {
                setPolicyNumber(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleKeyDown}
              className="glass border-white/20 dark:border-white/10 pr-10 h-11"
              data-cursor-hover
              aria-label="Policy number input"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
          <Button
            onClick={handleCheckStatus}
            disabled={isLoading}
            className="cta-glow btn-ripple-enhanced h-11 px-5"
            data-cursor-hover
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Check
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}

        {/* Loading State */}
        {isLoading && <ClaimSkeleton />}

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && currentStatus && !isLoading && (
            <motion.div
              key={result.claimId}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Status Banner */}
              <div className={`rounded-xl p-4 border ${currentStatus.bgClass}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currentStatus.emoji}</span>
                    <span className={`font-semibold text-base ${currentStatus.color}`}>
                      {currentStatus.label}
                    </span>
                  </div>
                  <Badge variant={currentStatus.badgeVariant} className="gap-1">
                    {currentStatus.icon}
                    {currentStatus.label}
                  </Badge>
                </div>

                {/* Claim Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <FileText className="size-3.5" />, label: 'Claim ID', value: result.claimId },
                    { icon: <IndianRupee className="size-3.5" />, label: 'Claim Amount', value: `₹${result.claimAmount.toLocaleString('en-IN')}` },
                    { icon: <Calendar className="size-3.5" />, label: 'Date Filed', value: result.dateFiled },
                    { icon: <Clock className="size-3.5" />, label: 'Est. Resolution', value: result.estimatedResolution },
                  ].map((detail, i) => (
                    <motion.div
                      key={detail.label}
                      custom={i}
                      variants={detailVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-0.5"
                    >
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        {detail.icon}
                        {detail.label}
                      </div>
                      <p className="text-sm font-medium">{detail.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Insurance Type */}
                <motion.div
                  custom={4}
                  variants={detailVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-3 pt-3 border-t border-white/10 dark:border-white/5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Insurance Type</span>
                    <span className="font-medium">{result.insuranceType}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Policy Number</span>
                    <span className="font-medium font-mono">{result.policyNumber}</span>
                  </div>
                </motion.div>
              </div>

              {/* Progress Timeline */}
              {result.status !== 'rejected' && <ProgressTimeline steps={result.progressSteps} />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State Hint */}
        {!result && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-4"
          >
            <p className="text-xs text-muted-foreground">
              Try: <span className="font-mono font-medium cursor-pointer hover:text-primary transition-colors" onClick={() => { setPolicyNumber('POL-DEMO123'); }} data-cursor-hover>POL-DEMO123</span>
              {' · '}
              <span className="font-mono font-medium cursor-pointer hover:text-primary transition-colors" onClick={() => { setPolicyNumber('HEALTH-456'); }} data-cursor-hover>HEALTH-456</span>
              {' · '}
              <span className="font-mono font-medium cursor-pointer hover:text-primary transition-colors" onClick={() => { setPolicyNumber('MOTOR-789'); }} data-cursor-hover>MOTOR-789</span>
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
