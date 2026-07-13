import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimiter } from '@/lib/server-rate-limiter';

/**
 * POST /api/tools/compare-plans
 *
 * Compares insurance plans from 51+ IRDAI-registered insurers.
 * Returns ranked plans based on user profile.
 *
 * Declared in /.well-known/agent-skills/index.json
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = apiRateLimiter.check(`tools-compare:${ip}`, 30, 60_000);
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': '60' } });
    }

    const body = await request.json();
    const { insuranceType, age, sumInsured, city, familySize } = body;

    if (!insuranceType || typeof insuranceType !== 'string') {
      return NextResponse.json({ error: 'insuranceType is required (health/motor/life/travel/home)' }, { status: 400 });
    }

    // Route to existing comparison engines
    const validTypes = ['health', 'motor', 'life', 'travel', 'home'];
    if (!validTypes.includes(insuranceType.toLowerCase())) {
      return NextResponse.json({ error: `insuranceType must be one of: ${validTypes.join(', ')}` }, { status: 400 });
    }

    // Import the appropriate comparison module dynamically
    try {
      const compareModule = await import(`@/app/api/compare/${insuranceType.toLowerCase()}/route`);
      if (compareModule.POST) {
        // Forward request to existing comparison API
        const compareResponse = await compareModule.POST(request);
        return compareResponse;
      }
    } catch {
      // If dynamic import fails, return guidance
    }

    // Fallback: return comparison guidance
    return NextResponse.json({
      insuranceType,
      message: 'Use the comparison page for detailed plan comparison',
      compareUrl: `https://paliwalsecure.in/compare/${insuranceType.toLowerCase()}`,
      toolsAvailable: ['protection-score', 'claim-guidance', 'policy-audit'],
      recommendation: 'Visit the comparison page or ask InsureGPT for personalized recommendations.',
    });
  } catch (error) {
    console.error('[TOOLS_COMPARE_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    name: 'compare-insurance-plans',
    description: 'Compare plans from 51+ IRDAI insurers',
    method: 'POST',
    inputSchema: {
      type: 'object',
      properties: {
        insuranceType: { type: 'string', enum: ['health', 'motor', 'life', 'travel', 'home'] },
        age: { type: 'number' },
        sumInsured: { type: 'number' },
        city: { type: 'string' },
        familySize: { type: 'number' },
      },
      required: ['insuranceType'],
    },
  });
}
