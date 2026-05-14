import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ── Insurer CSR Database ──────────────────────────────────────────────────────
const INSURER_CSR: Record<string, { csr: number; icr: number; pedWaitingMonths: number }> = {
  'HDFC ERGO': { csr: 98.85, icr: 89.47, pedWaitingMonths: 24 },
  'Star Health': { csr: 92.02, icr: 67.26, pedWaitingMonths: 36 },
  'Care Health': { csr: 100, icr: 58.68, pedWaitingMonths: 24 },
  'Niva Bupa': { csr: 100, icr: 58.10, pedWaitingMonths: 24 },
  'Acko': { csr: 99.91, icr: 81.23, pedWaitingMonths: 24 },
};

// ── Validation Schema ─────────────────────────────────────────────────────────
const simulateSchema = z.object({
  age: z.number().min(18).max(80),
  sumInsured: z.number().min(200000).max(5000000),
  claimAmount: z.number().min(1000),
  pedPresent: z.boolean(),
  waitingPeriodCompleted: z.boolean().optional().default(false),
  insurer: z.enum(['HDFC ERGO', 'Star Health', 'Care Health', 'Niva Bupa', 'Acko']),
});

// ── POST Handler ──────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = simulateSchema.parse(body);

    const insurerData = INSURER_CSR[validated.insurer];
    if (!insurerData) {
      return NextResponse.json(
        { success: false, error: 'Invalid insurer' },
        { status: 400 }
      );
    }

    // Base probability = CSR
    let probability = insurerData.csr;
    const adjustments: { factor: string; impact: number; reasoning: string }[] = [];

    // PED + waiting period not completed
    if (validated.pedPresent && !validated.waitingPeriodCompleted) {
      const reduction = -20;
      adjustments.push({
        factor: 'PED within waiting period',
        impact: reduction,
        reasoning: `Aapke paas PED (Pre-existing Disease) hai aur ${insurerData.pedWaitingMonths} mahine ka waiting period complete nahi hua hai. Isse claim probability ${Math.abs(reduction)}% kam hoti hai.`,
      });
      probability += reduction;
    }

    // PED + waiting period completed
    if (validated.pedPresent && validated.waitingPeriodCompleted) {
      const reduction = -5;
      adjustments.push({
        factor: 'PED - waiting period completed',
        impact: reduction,
        reasoning: `PED hai lekin waiting period complete ho chuka hai. Isse sirf ${Math.abs(reduction)}% reduction hai kyunki insurer dhyan se review karta hai.`,
      });
      probability += reduction;
    }

    // Claim amount > 80% of sum insured
    if (validated.claimAmount > validated.sumInsured * 0.8) {
      const reduction = -5;
      adjustments.push({
        factor: 'High claim-to-sum-insured ratio',
        impact: reduction,
        reasoning: `Claim amount sum insured ke 80% se zyada hai (${Math.round((validated.claimAmount / validated.sumInsured) * 100)}%). High-value claims mein zyada scrutiny hoti hai.`,
      });
      probability += reduction;
    }

    // Claim amount < 20% of sum insured (minor claim - more likely approved)
    if (validated.claimAmount < validated.sumInsured * 0.2) {
      const boost = 2;
      adjustments.push({
        factor: 'Low claim-to-sum-insured ratio',
        impact: boost,
        reasoning: `Claim amount sum insured ka sirf ${Math.round((validated.claimAmount / validated.sumInsured) * 100)}% hai. Chhote claims generally zyada easily approve hote hain.`,
      });
      probability += boost;
    }

    // Age > 60
    if (validated.age > 60) {
      const reduction = -5;
      adjustments.push({
        factor: 'Senior citizen age',
        impact: reduction,
        reasoning: `Age ${validated.age} hai. Senior citizens ke claims mein sometimes additional documentation chahiye hota hai, isliye ${Math.abs(reduction)}% reduction.`,
      });
      probability += reduction;
    }

    // No PED bonus
    if (!validated.pedPresent) {
      adjustments.push({
        factor: 'No PED',
        impact: 0,
        reasoning: 'Koi Pre-existing Disease nahi hai. Yeh claim approval ke liye positive hai.',
      });
    }

    // Clamp probability
    probability = Math.max(10, Math.min(99, Math.round(probability * 100) / 100));

    // Risk level
    let riskLevel: 'High' | 'Medium' | 'Low';
    let riskColor: string;
    if (probability >= 80) {
      riskLevel = 'High';
      riskColor = 'emerald';
    } else if (probability >= 60) {
      riskLevel = 'Medium';
      riskColor = 'amber';
    } else {
      riskLevel = 'Low';
      riskColor = 'red';
    }

    // Tips
    const tips = [
      'Sabhi medical documents aur bills safe rakhein — original copies ke saath.',
      'Claim file karte waqt insurer ki checklist follow karein.',
      'Cashless claim ke liye pre-approval hospital se karwayein.',
      'Claim intimation policy period ke andar karein — delay se rejection ho sakta hai.',
      'Room rent limit check karein — exceeding amount khud pay karni padti hai.',
      'Pre-existing disease ke liye waiting period complete hone ke baad hi claim file karein.',
    ];

    return NextResponse.json({
      success: true,
      data: {
        probability,
        riskLevel,
        riskColor,
        adjustments,
        insurerData: {
          name: validated.insurer,
          csr: insurerData.csr,
          icr: insurerData.icr,
          pedWaitingMonths: insurerData.pedWaitingMonths,
        },
        tips,
        disclaimer: 'Yeh educational tool hai. Actual claim approval insurer ki underwriting policy pe depend karta hai. Past performance future results ki guarantee nahi hai.',
      },
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues?.[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message || 'Validation failed' },
        { status: 400 }
      );
    }
    console.error('Claim simulation error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
