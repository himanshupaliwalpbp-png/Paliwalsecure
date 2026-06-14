// ============================================================================
// Paliwal Secure - AI Recommendations API Route
// POST endpoint that creates persona, scores plans, returns top recommendations
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createPersona, scorePlans, calculateProfileStrength, type Persona } from '@/lib/realAIEngine';

export const dynamic = 'force-dynamic';

interface RecommendationRequest {
  age?: number;
  income?: string;
  familySize?: number;
  dependents?: number;
  medicalHistory?: string[];
  lifestyle?: string[];
  purchaseIntent?: 'budget' | 'premium' | 'family' | 'ped_specific' | 'comprehensive';
  vehicleAge?: number;
  existingInsurance?: string[];
  category?: string;
}

const VALID_CATEGORIES = ['health', 'term', 'motor', 'senior', 'critical-illness'];
const VALID_INCOMES = ['below-3l', '3-5l', '5-10l', '10-25l', '25-50l', 'above-50l'];
const VALID_INTENTS = ['budget', 'premium', 'family', 'ped_specific', 'comprehensive'];
const VALID_MEDICAL = ['diabetes', 'bp', 'heart-disease', 'none'];
const VALID_LIFESTYLE = ['smoker', 'exercise', 'sedentary', 'none'];

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();

    // Validate inputs
    const age = body.age ?? 30;
    if (typeof age !== 'number' || age < 18 || age > 80) {
      return NextResponse.json(
        { error: 'Age must be between 18 and 80' },
        { status: 400 }
      );
    }

    const income = body.income ?? '5-10l';
    if (!VALID_INCOMES.includes(income)) {
      return NextResponse.json(
        { error: 'Invalid income bracket' },
        { status: 400 }
      );
    }

    const familySize = body.familySize ?? 2;
    if (typeof familySize !== 'number' || familySize < 1 || familySize > 8) {
      return NextResponse.json(
        { error: 'Family size must be between 1 and 8' },
        { status: 400 }
      );
    }

    const dependents = body.dependents ?? 0;
    if (typeof dependents !== 'number' || dependents < 0 || dependents > 6) {
      return NextResponse.json(
        { error: 'Dependents must be between 0 and 6' },
        { status: 400 }
      );
    }

    const medicalHistory = (body.medicalHistory ?? []).filter(
      (m) => VALID_MEDICAL.includes(m)
    );
    // If "none" is selected, clear other selections
    const finalMedicalHistory = medicalHistory.includes('none') ? [] : medicalHistory;

    const lifestyle = (body.lifestyle ?? []).filter(
      (l) => VALID_LIFESTYLE.includes(l)
    );
    const finalLifestyle = lifestyle.includes('none') ? [] : lifestyle;

    const purchaseIntent = body.purchaseIntent ?? 'budget';
    if (!VALID_INTENTS.includes(purchaseIntent)) {
      return NextResponse.json(
        { error: 'Invalid purchase intent' },
        { status: 400 }
      );
    }

    const vehicleAge = body.vehicleAge;
    if (vehicleAge !== undefined && (typeof vehicleAge !== 'number' || vehicleAge < 0 || vehicleAge > 20)) {
      return NextResponse.json(
        { error: 'Vehicle age must be between 0 and 20' },
        { status: 400 }
      );
    }

    const existingInsurance = body.existingInsurance ?? [];

    // Create persona using AI engine
    const persona: Partial<Persona> = {
      age,
      income,
      familySize,
      dependents,
      medicalHistory: finalMedicalHistory,
      lifestyle: finalLifestyle,
      purchaseIntent,
      vehicleAge,
      existingInsurance,
    };

    const createdPersona = createPersona(persona);

    // Calculate profile strength
    const profileStrength = calculateProfileStrength(createdPersona);

    // Determine which categories to score
    const categories = body.category && VALID_CATEGORIES.includes(body.category)
      ? [body.category]
      : VALID_CATEGORIES;

    // Score plans for each category
    const results: Record<string, ReturnType<typeof scorePlans>> = {};
    for (const category of categories) {
      results[category] = scorePlans(createdPersona, category);
    }

    // Get top 3 plans per category
    const topPlans: Record<string, ReturnType<typeof scorePlans>> = {};
    for (const [category, plans] of Object.entries(results)) {
      topPlans[category] = plans.slice(0, 3);
    }

    return NextResponse.json({
      success: true,
      profileStrength,
      persona: {
        age: createdPersona.age,
        income: createdPersona.income,
        familySize: createdPersona.familySize,
        dependents: createdPersona.dependents,
        purchaseIntent: createdPersona.purchaseIntent,
        profileCompleteness: createdPersona.profileCompleteness,
      },
      recommendations: topPlans,
    });
  } catch (error) {
    console.error('[Recommendations API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations. Please try again.' },
      { status: 500 }
    );
  }
}
