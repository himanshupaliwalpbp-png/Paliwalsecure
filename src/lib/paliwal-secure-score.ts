// ═══════════════════════════════════════════════════════════════════════════════
// Paliwal Secure Score™ — Proprietary Insurance Rating Framework
// ═══════════════════════════════════════════════════════════════════════════════
// Based on 6 IRDAI metrics, weighted for real-world claim experience:
//   1. Claim Settlement Ratio (CSR)     — Weight: 25%
//   2. Incurred Claim Ratio (ICR)       — Weight: 15%
//   3. Network Hospitals/Garages        — Weight: 15%
//   4. Solvency Ratio                   — Weight: 15%
//   5. Complaints per 10k Policies      — Weight: 15%
//   6. Claim Turnaround Time (days)     — Weight: 15%
//
// Total Score: 0-100
// Rating Tiers:
//   90-100: Paliwal Secure Elite™    (Gold Badge)
//   75-89:  Paliwal Secure Choice™   (Silver Badge)
//   60-74:  Paliwal Secure Standard™  (Bronze Badge)
//   Below 60: Needs Improvement
// ═══════════════════════════════════════════════════════════════════════════════

export interface PaliwalSecureMetrics {
  claimSettlementRatio: number;   // 0-100%
  incurredClaimRatio?: number;    // 0-150% (ideal: 60-80%)
  networkHospitals?: number;      // count
  solvencyRatio?: number;         // >1.0 is healthy
  complaintsPer10k?: number;      // lower is better
  claimTurnaroundDays?: number;   // lower is better
  // For motor insurance
  networkGarages?: number;
}

export interface PaliwalSecureScore {
  overall: number;          // 0-100
  tier: 'elite' | 'choice' | 'standard' | 'needs_improvement';
  tierLabel: string;
  tierColor: string;
  metrics: {
    csr: { score: number; weight: number; value: number; label: string };
    icr: { score: number; weight: number; value: number; label: string };
    network: { score: number; weight: number; value: number; label: string };
    solvency: { score: number; weight: number; value: number; label: string };
    complaints: { score: number; weight: number; value: number; label: string };
    turnaround: { score: number; weight: number; value: number; label: string };
  };
}

// ── Scoring Functions ──────────────────────────────────────────────────────

function scoreCSR(csr: number): number {
  // CSR 99-100 → 95-100, 95-99 → 75-95, 90-95 → 55-75, <90 → 0-55
  if (csr >= 99) return 95 + ((csr - 99) * 5);
  if (csr >= 95) return 75 + ((csr - 95) * 5);
  if (csr >= 90) return 55 + ((csr - 90) * 4);
  if (csr >= 80) return 30 + ((csr - 80) * 2.5);
  return Math.max(0, csr * 0.375);
}

function scoreICR(icr: number): number {
  // ICR 60-80% is ideal → 90-100, 50-60 or 80-90 → 60-90, outside → lower
  if (icr >= 60 && icr <= 80) return 90 + (1 - Math.abs(icr - 70) / 10) * 10;
  if (icr >= 50 && icr < 60) return 60 + ((icr - 50) / 10) * 30;
  if (icr > 80 && icr <= 90) return 60 + ((90 - icr) / 10) * 30;
  if (icr >= 40 && icr < 50) return 30 + ((icr - 40) / 10) * 30;
  if (icr > 90 && icr <= 100) return 30 + ((100 - icr) / 10) * 30;
  return Math.max(0, 30 - Math.abs(icr - 70) * 0.5);
}

function scoreNetwork(count: number, isMotor?: boolean): number {
  // Health: 20000+ → 95-100, 10000+ → 75-95, 5000+ → 55-75
  // Motor: 5000+ → 95-100, 2000+ → 75-95, 1000+ → 55-75
  const threshold = isMotor ? { elite: 5000, good: 2000, ok: 1000 } : { elite: 20000, good: 10000, ok: 5000 };
  if (count >= threshold.elite) return 95 + Math.min(5, (count - threshold.elite) / threshold.elite * 5);
  if (count >= threshold.good) return 75 + ((count - threshold.good) / (threshold.elite - threshold.good)) * 20;
  if (count >= threshold.ok) return 55 + ((count - threshold.ok) / (threshold.good - threshold.ok)) * 20;
  return Math.max(0, (count / threshold.ok) * 55);
}

function scoreSolvency(ratio: number): number {
  // >2.0 → 95-100, 1.5-2.0 → 80-95, 1.0-1.5 → 55-80, <1.0 → 0-55
  if (ratio >= 2.0) return 95 + Math.min(5, (ratio - 2.0) * 5);
  if (ratio >= 1.5) return 80 + ((ratio - 1.5) / 0.5) * 15;
  if (ratio >= 1.0) return 55 + ((ratio - 1.0) / 0.5) * 25;
  return Math.max(0, ratio * 55);
}

function scoreComplaints(per10k: number): number {
  // <10 → 95-100, 10-20 → 75-95, 20-40 → 50-75, 40+ → lower
  if (per10k <= 10) return 95 + ((10 - per10k) / 10) * 5;
  if (per10k <= 20) return 75 + ((20 - per10k) / 10) * 20;
  if (per10k <= 40) return 50 + ((40 - per10k) / 20) * 25;
  if (per10k <= 60) return 25 + ((60 - per10k) / 20) * 25;
  return Math.max(0, 25 - (per10k - 60) * 0.5);
}

function scoreTurnaround(days: number): number {
  // <7 days → 95-100, 7-14 → 75-95, 14-21 → 55-75, 21-30 → 30-55, 30+ → lower
  if (days <= 7) return 95 + ((7 - days) / 7) * 5;
  if (days <= 14) return 75 + ((14 - days) / 7) * 20;
  if (days <= 21) return 55 + ((21 - days) / 7) * 20;
  if (days <= 30) return 30 + ((30 - days) / 9) * 25;
  return Math.max(0, 30 - (days - 30) * 0.5);
}

// ── Main Scoring Function ──────────────────────────────────────────────────

export function calculatePaliwalSecureScore(
  data: PaliwalSecureMetrics,
  isMotor?: boolean
): PaliwalSecureScore {
  const csrScore = scoreCSR(data.claimSettlementRatio);
  const icrScore = data.incurredClaimRatio != null ? scoreICR(data.incurredClaimRatio) : 60;
  const networkCount = isMotor ? (data.networkGarages || 0) : (data.networkHospitals || 0);
  const networkScore = scoreNetwork(networkCount, isMotor);
  const solvencyScore = data.solvencyRatio != null ? scoreSolvency(data.solvencyRatio) : 65;
  const complaintsScore = data.complaintsPer10k != null ? scoreComplaints(data.complaintsPer10k) : 60;
  const turnaroundScore = data.claimTurnaroundDays != null ? scoreTurnaround(data.claimTurnaroundDays) : 65;

  // Weighted average
  const overall = Math.round(
    csrScore * 0.25 +
    icrScore * 0.15 +
    networkScore * 0.15 +
    solvencyScore * 0.15 +
    complaintsScore * 0.15 +
    turnaroundScore * 0.15
  );

  let tier: PaliwalSecureScore['tier'];
  let tierLabel: string;
  let tierColor: string;

  if (overall >= 90) {
    tier = 'elite';
    tierLabel = 'Paliwal Secure Elite™';
    tierColor = '#C98A1C'; // Gold
  } else if (overall >= 75) {
    tier = 'choice';
    tierLabel = 'Paliwal Secure Choice™';
    tierColor = '#7ED3E6'; // Cyan
  } else if (overall >= 60) {
    tier = 'standard';
    tierLabel = 'Paliwal Secure Standard™';
    tierColor = '#CD7F32'; // Bronze
  } else {
    tier = 'needs_improvement';
    tierLabel = 'Needs Improvement';
    tierColor = '#94A3B8'; // Slate
  }

  return {
    overall: Math.min(100, Math.max(0, overall)),
    tier,
    tierLabel,
    tierColor,
    metrics: {
      csr: {
        score: Math.round(csrScore),
        weight: 25,
        value: data.claimSettlementRatio,
        label: 'Claim Settlement Ratio',
      },
      icr: {
        score: Math.round(icrScore),
        weight: 15,
        value: data.incurredClaimRatio || 0,
        label: 'Incurred Claim Ratio',
      },
      network: {
        score: Math.round(networkScore),
        weight: 15,
        value: networkCount,
        label: isMotor ? 'Network Garages' : 'Network Hospitals',
      },
      solvency: {
        score: Math.round(solvencyScore),
        weight: 15,
        value: data.solvencyRatio || 0,
        label: 'Solvency Ratio',
      },
      complaints: {
        score: Math.round(complaintsScore),
        weight: 15,
        value: data.complaintsPer10k || 0,
        label: 'Complaints per 10K',
      },
      turnaround: {
        score: Math.round(turnaroundScore),
        weight: 15,
        value: data.claimTurnaroundDays || 0,
        label: 'Claim Turnaround',
      },
    },
  };
}

// ── Quick lookup from insurer name ─────────────────────────────────────────

import { healthInsurancePlans, motorInsurancePlans, lifeInsurancePlans } from '@/lib/insurance-data';

export function getPaliwalScoreForInsurer(insurerName: string): PaliwalSecureScore | null {
  // Search in health plans
  const healthPlan = healthInsurancePlans.find(p => p.provider === insurerName);
  if (healthPlan) {
    return calculatePaliwalSecureScore({
      claimSettlementRatio: healthPlan.claimSettlementRatio,
      incurredClaimRatio: healthPlan.incurredClaimRatio,
      networkHospitals: healthPlan.networkHospitals,
      solvencyRatio: healthPlan.solvencyRatio,
      complaintsPer10k: healthPlan.complaintsPer10k,
      claimTurnaroundDays: healthPlan.claimTurnaroundDays,
    });
  }

  // Search in motor plans
  const motorPlan = motorInsurancePlans?.find(p => p.provider === insurerName);
  if (motorPlan) {
    return calculatePaliwalSecureScore({
      claimSettlementRatio: motorPlan.claimSettlementRatio,
      incurredClaimRatio: motorPlan.incurredClaimRatio,
      networkHospitals: motorPlan.networkGarages,
      solvencyRatio: motorPlan.solvencyRatio,
      complaintsPer10k: motorPlan.complaintsPer10k,
      claimTurnaroundDays: motorPlan.claimTurnaroundDays,
    }, true);
  }

  // Search in life/term plans
  const lifePlan = lifeInsurancePlans?.find(p => p.provider === insurerName);
  if (lifePlan) {
    return calculatePaliwalSecureScore({
      claimSettlementRatio: lifePlan.claimSettlementRatio,
      incurredClaimRatio: lifePlan.incurredClaimRatio,
      solvencyRatio: lifePlan.solvencyRatio,
      complaintsPer10k: lifePlan.complaintsPer10k,
      claimTurnaroundDays: lifePlan.claimTurnaroundDays,
    });
  }

  return null;
}
