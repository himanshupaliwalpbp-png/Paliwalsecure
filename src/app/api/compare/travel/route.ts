import { NextRequest, NextResponse } from 'next/server';
import {
  calculateTravelQuote,
  formatINR,
} from '@/lib/compare/compare-engine';
import type { TravelDetails, TravellerType } from '@/lib/compare/compare-engine';
import { INSURER_MASTER } from '@/lib/compare/insurer-master';
import { calculateGST } from '@/lib/compare/gst-rules';

// ---------------------------------------------------------------------------
// Travel Insurers for comparison
// ---------------------------------------------------------------------------
const TRAVEL_INSURERS = [
  'HDFC_ERGO',
  'BAJAJ_ALLIANZ',
  'ICICI_LOMBARD',
  'TATA_AIG',
  'RELIANCE',
  'GO_DIGIT',
  'STAR_HEALTH',
];

// ---------------------------------------------------------------------------
// Senior multiplier (2.8× for age 60+)
// ---------------------------------------------------------------------------
const SENIOR_MULTIPLIER = 2.8;

// ---------------------------------------------------------------------------
// POST Handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      destination,
      tripDurationDays,
      adults,
      children,
      seniors,
      medicalCover,
      addons,
      departureDate,
    } = body;

    // Validate required fields
    if (!destination || !tripDurationDays || !departureDate) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, tripDurationDays, departureDate' },
        { status: 400 }
      );
    }

    // Validate trip duration
    const duration = Number(tripDurationDays);
    if (duration < 1 || duration > 180) {
      return NextResponse.json(
        { error: 'Trip duration must be between 1 and 180 days' },
        { status: 400 }
      );
    }

    // Validate at least one traveller
    const numAdults = Number(adults) || 0;
    const numChildren = Number(children) || 0;
    const numSeniors = Number(seniors) || 0;
    const totalTravellers = numAdults + numChildren + numSeniors;

    if (totalTravellers < 1) {
      return NextResponse.json(
        { error: 'At least one traveller is required' },
        { status: 400 }
      );
    }

    // Build travellers array
    const travellers: Array<{ type: TravellerType; count: number }> = [];
    if (numAdults > 0) travellers.push({ type: 'ADULT', count: numAdults });
    if (numChildren > 0) travellers.push({ type: 'CHILD', count: numChildren });
    if (numSeniors > 0) travellers.push({ type: 'SENIOR', count: numSeniors });

    const selectedAddons: string[] = Array.isArray(addons) ? addons : [];

    const travelDetails: TravelDetails = {
      region: String(destination) as TravelRegion,
      tripDurationDays: duration,
      travellers,
      selectedAddons,
    };

    // Calculate quotes for all insurers
    const quotes = TRAVEL_INSURERS.map((insurerId) => {
      const quote = calculateTravelQuote(travelDetails, insurerId);
      const insurerRecord = INSURER_MASTER[insurerId];

      // Apply senior multiplier for senior travellers
      let adjustedBase = quote.basePremium;
      let adjustedAddOn = quote.addOnPremium;

      if (numSeniors > 0) {
        // SENIOR rates are already ~1.6× ADULT rates in travel-rates.ts
        // Apply additional multiplier to reach 2.8× total (2.8/1.6 ≈ 1.75)
        const seniorBaseKey = Object.keys(quote.breakdown).find((k) =>
          k.startsWith('Traveller_SENIOR')
        );
        if (seniorBaseKey) {
          const seniorBase = quote.breakdown[seniorBaseKey];
          const additionalSeniorLoading = Math.round(seniorBase * (SENIOR_MULTIPLIER / 1.6 - 1));
          adjustedBase += additionalSeniorLoading;
          quote.breakdown['Senior_Loading_2.8x'] = additionalSeniorLoading;
          quote.notes.push(`Senior loading (2.8×): +${formatINR(additionalSeniorLoading)}`);
        }
      }

      const premiumBeforeGST = adjustedBase + adjustedAddOn;
      const gstAmount = calculateGST(premiumBeforeGST, 'travel');
      const totalPremium = premiumBeforeGST + gstAmount;

      return {
        insurerId,
        insurerName: insurerRecord?.shortName ?? insurerId,
        ...quote,
        basePremium: adjustedBase,
        addOnPremium: adjustedAddOn,
        gstAmount,
        totalPremium,
        totalTravellers,
        breakdown: {
          ...quote.breakdown,
          Base_Premium: adjustedBase,
          AddOn_Total: adjustedAddOn,
          GST: gstAmount,
        },
      };
    });

    // Sort by total premium (cheapest first)
    quotes.sort((a, b) => (a.totalPremium ?? Infinity) - (b.totalPremium ?? Infinity));

    // Mark first as recommended
    if (quotes.length > 0) {
      (quotes[0] as any).isRecommended = true;
    }

    const response = NextResponse.json({
      quotes,
      timestamp: new Date().toISOString(),
      meta: {
        gstRate: 0.18,
        gstNote: 'GST @ 18% applicable on travel insurance',
        destination: String(destination),
        tripDurationDays: duration,
        totalTravellers,
        seniors: numSeniors,
        seniorMultiplier: SENIOR_MULTIPLIER,
        medicalCover: Number(medicalCover) || 100000,
        selectedAddons,
      },
    });

    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error: any) {
    console.error('Travel comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate travel quotes', details: error.message },
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
