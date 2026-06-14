import { NextRequest, NextResponse } from 'next/server';
import { cities } from '@/data/cities';
import { professions } from '@/data/professions';
import { healthInsurers } from '@/data/insurers';
import { ageLoadingFactors, gstInfo } from '@/data/irdai-rates';

// ---------------------------------------------------------------------------
// TypeScript Types
// ---------------------------------------------------------------------------
interface HealthCompareRequest {
  age: number;
  sumInsured: number;
  citySlug: string;
  professionSlug: string;
}

interface HealthCompareResult {
  insurer: {
    slug: string;
    name: string;
    planName: string;
  };
  basePremium: number;
  cityLoading: number;
  professionLoading: number;
  ageLoading: number;
  totalBeforeGST: number;
  gst: number;
  total: number;
  networkHospitals: number;
  csr: number;
  features: string[];
  recommended: boolean;
}

// ---------------------------------------------------------------------------
// Helper: Get age loading factor
// Uses nearest-age matching from the defined slabs
// ---------------------------------------------------------------------------
function getAgeLoadingFactor(age: number): number {
  const definedAges = Object.keys(ageLoadingFactors).map(Number).sort((a, b) => a - b);

  // If age is at or below the minimum, use the minimum
  if (age <= definedAges[0]) return ageLoadingFactors[definedAges[0]];

  // If age is at or above the maximum, use the maximum
  if (age >= definedAges[definedAges.length - 1]) return ageLoadingFactors[definedAges[definedAges.length - 1]];

  // Find exact match
  if (ageLoadingFactors[age] !== undefined) return ageLoadingFactors[age];

  // Interpolate between nearest defined ages
  let lowerAge = definedAges[0];
  let upperAge = definedAges[definedAges.length - 1];

  for (let i = 0; i < definedAges.length - 1; i++) {
    if (age >= definedAges[i] && age <= definedAges[i + 1]) {
      lowerAge = definedAges[i];
      upperAge = definedAges[i + 1];
      break;
    }
  }

  const lowerFactor = ageLoadingFactors[lowerAge];
  const upperFactor = ageLoadingFactors[upperAge];
  const ratio = (age - lowerAge) / (upperAge - lowerAge);

  return lowerFactor + (upperFactor - lowerFactor) * ratio;
}

// ---------------------------------------------------------------------------
// POST Handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body: HealthCompareRequest = await request.json();
    const { age, sumInsured, citySlug, professionSlug } = body;

    // Validate required fields
    if (!age || !sumInsured || !citySlug || !professionSlug) {
      return NextResponse.json(
        { error: 'Missing required fields: age, sumInsured, citySlug, professionSlug' },
        { status: 400 }
      );
    }

    // Validate age range
    if (Number(age) < 18 || Number(age) > 65) {
      return NextResponse.json(
        { error: 'Age must be between 18 and 65' },
        { status: 400 }
      );
    }

    // Find city by slug
    const city = cities.find((c) => c.slug === citySlug);
    if (!city) {
      return NextResponse.json(
        { error: `City not found: ${citySlug}` },
        { status: 404 }
      );
    }

    // Find profession by slug
    const profession = professions.find((p) => p.slug === professionSlug);
    if (!profession) {
      return NextResponse.json(
        { error: `Profession not found: ${professionSlug}` },
        { status: 404 }
      );
    }

    // Calculate loading factors
    const cityLoadingFactor = city.healthLoadingFactor;
    const professionLoadingFactor = profession.healthLoadingFactor;
    const ageLoadingFactor = getAgeLoadingFactor(Number(age));

    // GST: 0% for individual health insurance (exempt from Sept 2025)
    const gstRate = gstInfo.health.isExempt ? 0 : gstInfo.health.rate;

    // Calculate quotes for each insurer
    const results: HealthCompareResult[] = healthInsurers.map((insurer) => {
      // Base premium scaled by sum insured (insurer.premiumFor10L is for ₹10L SI)
      const siScale = Number(sumInsured) / 1000000;
      const basePremium = Math.round(insurer.premiumFor10L * siScale);

      // City loading amount
      const cityLoadingAmount = Math.round(basePremium * (cityLoadingFactor - 1));

      // Profession loading amount
      const professionLoadingAmount = Math.round(
        (basePremium + cityLoadingAmount) * (professionLoadingFactor - 1)
      );

      // Age loading amount
      const afterCityAndProfession = basePremium + cityLoadingAmount + professionLoadingAmount;
      const ageLoadingAmount = Math.round(afterCityAndProfession * (ageLoadingFactor - 1));

      // Total before GST
      const totalBeforeGST = basePremium + cityLoadingAmount + professionLoadingAmount + ageLoadingAmount;

      const gst = Math.round(totalBeforeGST * gstRate);

      // Final total
      const total = totalBeforeGST + gst;

      return {
        insurer: {
          slug: insurer.slug,
          name: insurer.name,
          planName: insurer.planName,
        },
        basePremium,
        cityLoading: cityLoadingAmount,
        professionLoading: professionLoadingAmount,
        ageLoading: ageLoadingAmount,
        totalBeforeGST,
        gst,
        total,
        networkHospitals: insurer.networkHospitals,
        csr: insurer.csr,
        features: insurer.features,
        recommended: false,
      };
    });

    // Sort by total ascending (cheapest first)
    results.sort((a, b) => a.total - b.total);

    // Mark lowest as recommended
    if (results.length > 0) {
      results[0].recommended = true;
    }

    const response = NextResponse.json({
      quotes: results,
      meta: {
        cityLoadingFactor,
        professionLoadingFactor,
        ageLoadingFactor: Math.round(ageLoadingFactor * 100) / 100,
        gstRate: gstInfo.rate,
        gstNote: gstInfo.healthExemptNote || gstInfo.note,
      },
      timestamp: new Date().toISOString(),
    });

    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Health comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate health quotes', details: message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// OPTIONS Handler (CORS preflight)
// ---------------------------------------------------------------------------
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
