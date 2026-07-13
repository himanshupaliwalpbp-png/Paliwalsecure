import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimiter } from '@/lib/server-rate-limiter';

/**
 * POST /api/tools/policy-audit
 *
 * Audits existing insurance policies for coverage gaps.
 * Returns structured audit report with recommendations.
 *
 * Declared in /.well-known/agent-skills/index.json
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = apiRateLimiter.check(`tools-audit:${ip}`, 30, 60_000);
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': '60' } });
    }

    const body = await request.json();
    const { policies, userProfile } = body;

    if (!policies || !Array.isArray(policies) || policies.length === 0) {
      return NextResponse.json({ error: 'policies array is required (minimum 1 policy)' }, { status: 400 });
    }

    // Validate each policy entry
    for (const p of policies) {
      if (!p.type || typeof p.type !== 'string') {
        return NextResponse.json({ error: 'Each policy must have a "type" field (health/motor/life/travel/home)' }, { status: 400 });
      }
    }

    // ── Audit logic ─────────────────────────────────────────────────────
    const audit = {
      totalPolicies: policies.length,
      coverageGaps: [] as Array<{ gap: string; severity: string; recommendation: string }>,
      strengths: [] as string[],
      score: 0,
      recommendations: [] as string[],
      auditDate: new Date().toISOString(),
    };

    const policyTypes = policies.map(p => p.type.toLowerCase());
    const age = userProfile?.age || 30;
    const income = userProfile?.income || 500000;
    const dependents = userProfile?.dependents || 0;

    // Check health insurance
    if (!policyTypes.includes('health')) {
      audit.coverageGaps.push({
        gap: 'No health insurance',
        severity: 'CRITICAL',
        recommendation: 'Buy health insurance immediately. Minimum ₹10L cover for individuals, ₹25L for families in metros. One hospitalization can cost ₹2-15L.',
      });
    } else {
      const healthPolicy = policies.find(p => p.type.toLowerCase() === 'health');
      const sumInsured = healthPolicy?.sumInsured || 0;
      if (sumInsured < 1000000) {
        audit.coverageGaps.push({
          gap: `Health insurance sum insured (₹${sumInsured}) is below recommended ₹10L`,
          severity: 'HIGH',
          recommendation: 'Increase sum insured to at least ₹10L. Consider super top-up for ₹50L+ cover at low premium.',
        });
      } else {
        audit.strengths.push(`Health insurance coverage of ₹${sumInsured} is adequate`);
      }
    }

    // Check life insurance (only if dependents > 0)
    if (dependents > 0) {
      if (!policyTypes.includes('life') && !policyTypes.includes('term')) {
        audit.coverageGaps.push({
          gap: 'No life insurance despite having dependents',
          severity: 'CRITICAL',
          recommendation: `Buy term insurance immediately. Recommended cover: ₹${(income * 12).toLocaleString('en-IN')} (12x annual income). Premium: ₹8,000-15,000/year for ₹1Cr cover.`,
        });
      } else {
        const lifePolicy = policies.find(p => ['life', 'term'].includes(p.type.toLowerCase()));
        const sumAssured = lifePolicy?.sumAssured || lifePolicy?.sumInsured || 0;
        const idealCover = income * 12;
        if (sumAssured < idealCover * 0.5) {
          audit.coverageGaps.push({
            gap: `Life insurance cover (₹${sumAssured}) is below 50% of recommended (₹${idealCover.toLocaleString('en-IN')})`,
            severity: 'HIGH',
            recommendation: `Increase life cover to at least ₹${idealCover.toLocaleString('en-IN')} (12x annual income).`,
          });
        } else {
          audit.strengths.push(`Life insurance coverage of ₹${sumAssured} is adequate`);
        }
      }
    }

    // Check motor insurance
    if (!policyTypes.includes('motor') && !policyTypes.includes('car') && !policyTypes.includes('bike')) {
      audit.coverageGaps.push({
        gap: 'No motor insurance detected',
        severity: 'MEDIUM',
        recommendation: 'If you own a vehicle, motor insurance is mandatory (Motor Vehicles Act). Buy comprehensive + zero-dep.',
      });
    }

    // Calculate audit score
    let score = 100;
    for (const gap of audit.coverageGaps) {
      if (gap.severity === 'CRITICAL') score -= 30;
      else if (gap.severity === 'HIGH') score -= 20;
      else if (gap.severity === 'MEDIUM') score -= 10;
    }
    audit.score = Math.max(0, score);

    // General recommendations
    if (age > 45 && !policyTypes.includes('health')) {
      audit.recommendations.push('Buy health insurance NOW — premiums double after age 50, and pre-existing conditions develop with age.');
    }
    if (income > 1000000 && audit.score < 80) {
      audit.recommendations.push('Your income warrants higher coverage. Consider: health ₹25L+, life ₹1Cr+, critical illness ₹25L+.');
    }
    audit.recommendations.push('Review all policies annually. Use Paliwal Secure\'s free policy audit service (WhatsApp +91-92587-77312).');
    audit.recommendations.push('Check claim settlement ratio (CSR) of your insurers on IRDAI Annual Report. Target: 95%+ CSR.');

    return NextResponse.json(audit);
  } catch (error) {
    console.error('[TOOLS_POLICY_AUDIT_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'policy-audit',
    description: 'Audit existing policies for coverage gaps',
    method: 'POST',
    inputSchema: {
      type: 'object',
      properties: {
        policies: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['health', 'motor', 'life', 'term', 'travel', 'home'] },
              sumInsured: { type: 'number' },
              sumAssured: { type: 'number' },
              insurer: { type: 'string' },
            },
          },
        },
        userProfile: {
          type: 'object',
          properties: {
            age: { type: 'number' },
            income: { type: 'number' },
            dependents: { type: 'number' },
          },
        },
      },
      required: ['policies'],
    },
  });
}
