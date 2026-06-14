import { NextRequest, NextResponse } from 'next/server';
import {
  calculateHomeQuote,
  formatINR,
} from '@/lib/compare/compare-engine';
import type { HomeDetails, HomeCoverType, HomeContentsCoverType } from '@/lib/compare/compare-engine';
import { INSURER_MASTER } from '@/lib/compare/insurer-master';
import { calculateGST } from '@/lib/compare/gst-rules';
import {
  HIGH_SEISMIC_STATES,
  FLOOD_PRONE_CITIES,
  SEISMIC_LOADING,
  FLOOD_LOADING,
} from '@/lib/compare/home-rates';

// ---------------------------------------------------------------------------
// Home Insurers for comparison
// ---------------------------------------------------------------------------
const HOME_INSURERS = [
  'HDFC_ERGO',
  'ICICI_LOMBARD',
  'BAJAJ_ALLIANZ',
  'TATA_AIG',
  'RELIANCE',
  'GO_DIGIT',
  'NEW_INDIA',
  'SBI_GENERAL',
];

// ---------------------------------------------------------------------------
// POST Handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      coverType,
      propertyType,
      structureSI,
      contentsSI,
      state,
      city,
      earthquakeCover,
      burglaryCover,
    } = body;

    // Validate required fields
    if (!state || !city) {
      return NextResponse.json(
        { error: 'Missing required fields: state, city' },
        { status: 400 }
      );
    }

    // Determine cover types
    const structureCover: HomeCoverType = earthquakeCover ? 'WITH_EARTHQUAKE' : 'STANDARD';
    const contentsCover: HomeContentsCoverType = burglaryCover ? 'WITH_BURGLARY' : 'STANDARD';

    // Determine SI values based on cover type
    const effectiveStructureSI =
      coverType === 'CONTENTS_ONLY' ? 0 : Number(structureSI) || 0;
    const effectiveContentsSI =
      coverType === 'STRUCTURE_ONLY' ? 0 : Number(contentsSI) || 0;

    if (effectiveStructureSI === 0 && effectiveContentsSI === 0) {
      return NextResponse.json(
        { error: 'At least one sum insured must be provided' },
        { status: 400 }
      );
    }

    const homeDetails: HomeDetails = {
      structureSI: effectiveStructureSI,
      contentsSI: effectiveContentsSI,
      structureCover,
      contentsCover,
      state: String(state),
      city: String(city),
      isRented: false,
    };

    // Calculate quotes for all insurers
    const quotes = HOME_INSURERS.map((insurerId) => {
      const quote = calculateHomeQuote(homeDetails, insurerId);
      const insurerRecord = INSURER_MASTER[insurerId];

      return {
        insurerId,
        insurerName: insurerRecord?.shortName ?? insurerId,
        ...quote,
        structureSI: effectiveStructureSI,
        contentsSI: effectiveContentsSI,
      };
    });

    // Sort by total premium (cheapest first)
    quotes.sort((a, b) => (a.totalPremium ?? Infinity) - (b.totalPremium ?? Infinity));

    // Mark first as recommended
    if (quotes.length > 0) {
      (quotes[0] as any).isRecommended = true;
    }

    // Zone loading info
    const isSeismic = (HIGH_SEISMIC_STATES as readonly string[]).some(
      (s) => s.toLowerCase() === String(state).toLowerCase()
    );
    const isFlood = (FLOOD_PRONE_CITIES as readonly string[]).some(
      (c) => c.toLowerCase() === String(city).toLowerCase()
    );

    const response = NextResponse.json({
      quotes,
      timestamp: new Date().toISOString(),
      meta: {
        gstRate: 0.18,
        gstNote: 'GST @ 18% applicable on home insurance',
        coverType: String(coverType),
        propertyType: String(propertyType),
        structureSI: effectiveStructureSI,
        contentsSI: effectiveContentsSI,
        earthquakeCover: !!earthquakeCover,
        burglaryCover: !!burglaryCover,
        zoneLoading: {
          seismic: isSeismic ? SEISMIC_LOADING : 1,
          flood: isFlood ? FLOOD_LOADING : 1,
          applied: isSeismic || isFlood,
        },
      },
    });

    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error: any) {
    console.error('Home comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate home quotes', details: error.message },
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
