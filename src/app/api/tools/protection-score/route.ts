import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimiter } from '@/lib/server-rate-limiter';

/**
 * POST /api/tools/protection-score
 *
 * Calculates a personalized insurance protection score (0-100) based on
 * user profile: age, income, dependents, existing insurance, health conditions.
 *
 * This endpoint is declared in /.well-known/agent-skills/index.json
 * and /.well-known/mcp/server-card.json
 *
 * Rate limited: 30 requests/minute per IP (public, no auth required)
 */
export async function POST(request: NextRequest) {
  try {
    // ── Rate limiting ────────────────────────────────────────────────────
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = apiRateLimiter.check(`tools-protection:${ip}`, 30, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const body = await request.json();
    const { age, income, dependents, hasHealthInsurance, hasLifeInsurance, hasMotorInsurance, healthConditions } = body;

    // ── Input validation ────────────────────────────────────────────────
    if (!age || typeof age !== 'number' || age < 18 || age > 100) {
      return NextResponse.json({ error: 'age must be a number between 18 and 100' }, { status: 400 });
    }
    if (!income || typeof income !== 'number' || income < 0) {
      return NextResponse.json({ error: 'income must be a non-negative number' }, { status: 400 });
    }
    if (typeof dependents !== 'number' || dependents < 0) {
      return NextResponse.json({ error: 'dependents must be a non-negative number' }, { status: 400 });
    }

    // ── Protection Score Calculation ────────────────────────────────────
    // Score components (total 100):
    // 1. Health insurance coverage (30 points)
    // 2. Life insurance coverage (25 points)
    // 3. Motor insurance coverage (10 points)
    // 4. Income-to-coverage ratio (20 points)
    // 5. Age risk factor (15 points)

    let score = 0;
    const breakdown: Record<string, number> = {};

    // 1. Health insurance (30 points)
    if (hasHealthInsurance) {
      const hiCover = typeof hasHealthInsurance === 'object' ? hasHealthInsurance.sumInsured : 500000;
      if (hiCover >= 1000000) { score += 30; breakdown.health = 30; }
      else if (hiCover >= 500000) { score += 20; breakdown.health = 20; }
      else if (hiCover >= 300000) { score += 10; breakdown.health = 10; }
      else { score += 5; breakdown.health = 5; }
    } else {
      breakdown.health = 0;
    }

    // 2. Life insurance (25 points)
    if (hasLifeInsurance) {
      const liCover = typeof hasLifeInsurance === 'object' ? hasLifeInsurance.sumAssured : 5000000;
      const idealCover = income * 12; // 12x annual income
      const coverRatio = liCover / idealCover;
      if (coverRatio >= 1) { score += 25; breakdown.life = 25; }
      else if (coverRatio >= 0.5) { score += 15; breakdown.life = 15; }
      else if (coverRatio >= 0.2) { score += 8; breakdown.life = 8; }
      else { score += 3; breakdown.life = 3; }
    } else {
      breakdown.life = 0;
    }

    // 3. Motor insurance (10 points)
    if (hasMotorInsurance) {
      score += 10; breakdown.motor = 10;
    } else {
      breakdown.motor = 0;
    }

    // 4. Income-to-coverage ratio (20 points)
    // Ideal: total coverage (health + life) >= 20x annual income
    const totalCover = (typeof hasHealthInsurance === 'object' ? hasHealthInsurance.sumInsured : hasHealthInsurance ? 500000 : 0) +
                       (typeof hasLifeInsurance === 'object' ? hasLifeInsurance.sumAssured : hasLifeInsurance ? 5000000 : 0);
    const incomeMultiple = totalCover / (income || 1);
    if (incomeMultiple >= 20) { score += 20; breakdown.coverage = 20; }
    else if (incomeMultiple >= 10) { score += 15; breakdown.coverage = 15; }
    else if (incomeMultiple >= 5) { score += 10; breakdown.coverage = 10; }
    else if (incomeMultiple >= 2) { score += 5; breakdown.coverage = 5; }
    else { breakdown.coverage = 0; }

    // 5. Age risk factor (15 points)
    // Younger = better (more time to build coverage)
    if (age < 30) { score += 15; breakdown.age = 15; }
    else if (age < 40) { score += 12; breakdown.age = 12; }
    else if (age < 50) { score += 8; breakdown.age = 8; }
    else if (age < 60) { score += 4; breakdown.age = 4; }
    else { breakdown.age = 0; }

    // ── Recommendations ─────────────────────────────────────────────────
    const recommendations: string[] = [];
    if (!hasHealthInsurance) recommendations.push('Buy health insurance immediately (minimum ₹10L cover)');
    if (!hasLifeInsurance && dependents > 0) recommendations.push('Buy term life insurance (minimum 12x annual income)');
    if (hasLifeInsurance && totalCover < income * 10) recommendations.push('Increase life insurance coverage to at least 12x annual income');
    if (!hasMotorInsurance) recommendations.push('Buy motor insurance (mandatory by law for vehicle owners)');
    if (age > 45 && !hasHealthInsurance) recommendations.push('Buy health insurance NOW — premiums increase significantly after 50');
    if (healthConditions && healthConditions.length > 0) recommendations.push('Declare all health conditions honestly to avoid claim rejection');

    const rating = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : score >= 20 ? 'Poor' : 'Critical';

    return NextResponse.json({
      score,
      rating,
      maxScore: 100,
      breakdown,
      recommendations,
      summary: `Your insurance protection score is ${score}/100 (${rating}). ${recommendations.length > 0 ? 'Action needed: ' + recommendations[0] : 'You are well-protected.'}`,
    });
  } catch (error) {
    console.error('[TOOLS_PROTECTION_SCORE_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET returns tool metadata for AI discovery
export async function GET() {
  return NextResponse.json({
    name: 'insurance-protection-score',
    description: 'Calculate personalized insurance protection score (0-100)',
    method: 'POST',
    inputSchema: {
      type: 'object',
      properties: {
        age: { type: 'number', description: 'Age (18-100)' },
        income: { type: 'number', description: 'Annual income in INR' },
        dependents: { type: 'number', description: 'Number of dependents' },
        hasHealthInsurance: { type: 'boolean', description: 'Has health insurance?' },
        hasLifeInsurance: { type: 'boolean', description: 'Has life/term insurance?' },
        hasMotorInsurance: { type: 'boolean', description: 'Has motor insurance?' },
        healthConditions: { type: 'array', items: { type: 'string' }, description: 'Pre-existing conditions' },
      },
      required: ['age', 'income', 'dependents'],
    },
    outputSchema: {
      type: 'object',
      properties: {
        score: { type: 'number', description: 'Protection score (0-100)' },
        rating: { type: 'string', description: 'Rating: Excellent/Good/Fair/Poor/Critical' },
        breakdown: { type: 'object', description: 'Score breakdown by component' },
        recommendations: { type: 'array', items: { type: 'string' } },
      },
    },
  });
}
