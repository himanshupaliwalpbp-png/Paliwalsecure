import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimiter } from '@/lib/server-rate-limiter';

/**
 * POST /api/tools/claim-guidance
 *
 * Provides step-by-step claim filing guidance + IRDAI escalation path.
 * Returns structured guidance based on claim type and insurer.
 *
 * Declared in /.well-known/agent-skills/index.json
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = apiRateLimiter.check(`tools-claim:${ip}`, 30, 60_000);
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': '60' } });
    }

    const body = await request.json();
    const { claimType, insurer, policyType } = body;

    if (!claimType || typeof claimType !== 'string') {
      return NextResponse.json({ error: 'claimType is required (health/motor/life/travel/home)' }, { status: 400 });
    }

    const validClaimTypes = ['health', 'motor', 'life', 'travel', 'home'];
    if (!validClaimTypes.includes(claimType.toLowerCase())) {
      return NextResponse.json({ error: `claimType must be one of: ${validClaimTypes.join(', ')}` }, { status: 400 });
    }

    // Structured claim guidance
    const guidance = {
      claimType: claimType.toLowerCase(),
      insurer: insurer || 'Not specified',
      policyType: policyType || 'Not specified',
      steps: [] as Array<{ step: number; action: string; details: string; timeframe: string }>,
      documentsRequired: [] as string[],
      escalationPath: '',
      irdaHelpline: 'bimabharosa.irda.gov.in (IRDAI grievance portal)',
      irdaGrievancePortal: 'https://igms.irda.gov.in/',
      tips: [] as string[],
    };

    // Generic claim steps (applicable to all types)
    guidance.steps = [
      { step: 1, action: 'Inform insurer', details: `Call insurer's toll-free number or use app within 48 hours of the event. Get claim reference number.`, timeframe: 'Within 48 hours' },
      { step: 2, action: 'Collect documents', details: 'Gather all required documents (see documentsRequired list). Keep originals safe.', timeframe: '1-3 days' },
      { step: 3, action: 'Submit claim', details: 'Submit claim form + documents via app, email, or branch. Get acknowledgment receipt.', timeframe: 'Within 7-15 days of event' },
      { step: 4, action: 'Insurer verification', details: 'Insurer assigns surveyor/valuator. Surveyor visits within 48-72 hours for motor claims. Health claims verified via hospital.', timeframe: '2-7 days' },
      { step: 5, action: 'Approval/rejection', details: 'Insurer communicates decision in writing. If approved, payout within 7 days. If rejected, ask for reason in writing.', timeframe: '7-30 days' },
      { step: 6, action: 'Payout', details: 'Amount credited to your bank account. Verify amount matches approved claim.', timeframe: '7-15 days after approval' },
    ];

    // Type-specific additions
    if (claimType === 'health') {
      guidance.documentsRequired = [
        'Claim form (duly filled)',
        'Original hospital bills + receipts',
        'Discharge summary',
        'Medical prescriptions + reports',
        'Pre-admission diagnosis reports',
        'Hospital registration certificate',
        'FIR (if accident-related)',
        'NEFT/bank details for reimbursement',
      ];
      guidance.steps.unshift({
        step: 0, action: 'Check cashless eligibility', details: 'If hospital is in insurer network, opt for cashless. Hospital insurance desk handles pre-authorization.', timeframe: 'Before admission (planned) / Within 24 hours (emergency)',
      });
      guidance.tips = [
        'Cashless is always better — no upfront payment',
        'Keep all original bills — insurer returns only after claim is processed',
        'Pre and post-hospitalization expenses (30/60 days) are claimable',
        'Day-care procedures (300+) are covered even without 24-hour stay',
      ];
    } else if (claimType === 'motor') {
      guidance.documentsRequired = [
        'Claim form',
        'FIR copy (if third-party involved)',
        'RC (Registration Certificate) copy',
        'Driving license copy',
        'Insurance policy copy',
        'Repair estimate from network garage',
        'Photos of damage',
      ];
      guidance.tips = [
        'Use cashless network garage — no upfront payment for repairs',
        'Take photos from multiple angles before moving vehicle',
        'FIR is mandatory if third-party injury/property damage',
        'Zero-dep add-on ensures full repair cost (no depreciation)',
      ];
    } else if (claimType === 'life') {
      guidance.documentsRequired = [
        'Death claim form',
        'Original policy document',
        'Death certificate (municipal)',
        'FIR + post-mortem report (if accidental death)',
        'Nominee ID + address proof',
        'Bank details of nominee',
        'Hospital/doctor certificate (if illness)',
      ];
      guidance.tips = [
        'Nominee must file the claim — keep nominee details updated',
        'Death certificate is the most critical document',
        'Insurer must pay within 30 days of receiving all documents',
        'If claim delayed beyond 30 days, insurer pays interest',
      ];
    }

    guidance.escalationPath = `1. Contact insurer grievance officer (email + phone on policy document)\n2. Wait 15 days for resolution\n3. If unresolved: File complaint on IRDAI IGMS portal (igms.irda.gov.in)\n4. If unresolved in 30 days: Approach Insurance Ombudsman (free, no lawyer needed)\n5. Ombudsman award is binding on insurer (up to ₹50L)`;

    return NextResponse.json(guidance);
  } catch (error) {
    console.error('[TOOLS_CLAIM_GUIDANCE_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'claim-guidance',
    description: 'Step-by-step claim filing + IRDAI escalation',
    method: 'POST',
    inputSchema: {
      type: 'object',
      properties: {
        claimType: { type: 'string', enum: ['health', 'motor', 'life', 'travel', 'home'] },
        insurer: { type: 'string', description: 'Insurer name (optional)' },
        policyType: { type: 'string', description: 'Policy type (optional)' },
      },
      required: ['claimType'],
    },
  });
}
