import { NextRequest, NextResponse } from 'next/server';
import {
  calculateLifeQuote,
  formatINR,
} from '@/lib/compare/compare-engine';
import type { LifePayTerm, LifeDetails } from '@/lib/compare/compare-engine';
import { INSURER_MASTER } from '@/lib/compare/insurer-master';
import {
  LIFE_INSURER_DATA,
  SMOKER_LOADING,
  LIMITED_PAY,
  RETURN_OF_PREMIUM,
} from '@/lib/compare/life-rates';
import { calculateGST } from '@/lib/compare/gst-rules';

// ---------------------------------------------------------------------------
// Life Insurers for comparison
// ---------------------------------------------------------------------------
const LIFE_INSURERS = [
  'HDFC_LIFE',
  'ICICI_PRU',
  'SBI_LIFE',
  'MAX_LIFE',
  'TATA_AIA',
  'LIC',
  'BAJAJ_LIFE',
  'KOTAK',
];

// ---------------------------------------------------------------------------
// Extended pay term mapping (form pay15 not in original data)
// ---------------------------------------------------------------------------
const PAY_TERM_MAP: Record<string, LifePayTerm> = {
  regular: 'regular',
  pay12: 'pay12',
  pay15: 'pay12', // Map to pay12 as nearest available; apply factor adjustment below
  single: 'single',
};

// Pay15 factor — between pay12 (2.30) and regular (1.00)
// Estimated based on actuarial interpolation for 15-year pay
const PAY15_FACTOR = 1.90;

// ---------------------------------------------------------------------------
// POST Handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      gender,
      age,
      isSmoker,
      sumAssured,
      policyTerm,
      payMode,
      isROP,
      annualIncome,
      currentLifeCover,
    } = body;

    // Validate required fields
    if (!age || !sumAssured || !gender) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: age, sumAssured, gender',
        },
        { status: 400 }
      );
    }

    // Validate age range
    if (Number(age) < 25 || Number(age) > 60) {
      return NextResponse.json(
        { error: 'Age must be between 25 and 60' },
        { status: 400 }
      );
    }

    // Validate sum assured
    const sa = Number(sumAssured);
    const validSA = [5000000, 7500000, 10000000, 15000000, 20000000, 50000000];
    if (!validSA.includes(sa)) {
      return NextResponse.json(
        { error: 'Invalid sum assured value' },
        { status: 400 }
      );
    }

    const isPay15 = payMode === 'pay15';
    const mappedPayTerm: LifePayTerm = PAY_TERM_MAP[payMode] ?? 'regular';

    const lifeDetails: LifeDetails = {
      age: Number(age),
      sumAssured: sa,
      gender: gender === 'FEMALE' ? 'FEMALE' : 'MALE',
      isSmoker: Boolean(isSmoker),
      payTerm: mappedPayTerm,
      isROP: Boolean(isROP),
      isGroup: false, // Individual term insurance
    };

    // Calculate quotes for all life insurers
    const quotes = LIFE_INSURERS.map((insurerId) => {
      const quote = calculateLifeQuote(lifeDetails, insurerId);
      const insurerRecord = INSURER_MASTER[insurerId];
      const insurerData = LIFE_INSURER_DATA[insurerId];

      // Adjust for pay15 if needed
      let adjustedTotal = quote.totalPremium;
      let adjustedBase = quote.basePremium;

      if (isPay15) {
        // Reverse the pay12 factor, apply pay15 factor
        const pay12Factor = LIMITED_PAY['pay12'] ?? 2.30;
        const baseBeforeLimitedPay = adjustedBase / pay12Factor;
        adjustedBase = Math.round(baseBeforeLimitedPay * PAY15_FACTOR);

        // Recalculate GST (0% for life)
        const gstAmount = calculateGST(adjustedBase, 'life', false);
        adjustedTotal = adjustedBase + gstAmount;

        // Update breakdown
        quote.breakdown['Limited_Pay_Factor'] = Math.round(adjustedBase - baseBeforeLimitedPay);
        quote.breakdown['Base_Premium_Final'] = adjustedBase;
        quote.breakdown['GST'] = gstAmount;

        // Update notes
        const lpNoteIdx = quote.notes.findIndex((n) => n.includes('Limited pay'));
        if (lpNoteIdx >= 0) {
          quote.notes[lpNoteIdx] = `Limited pay (pay15, ×${PAY15_FACTOR}): ${formatINR(adjustedBase)}`;
        }
      }

      return {
        insurerId,
        insurerName: insurerRecord?.shortName ?? insurerId,
        planName: insurerData?.planName ?? '',
        csr: insurerData?.csr ?? 0,
        solvencyRatio: insurerData?.solvencyRatio ?? 0,
        uniqueFeature: insurerData?.uniqueFeature ?? '',
        appRating: insurerData?.appRating ?? 0,
        ...quote,
        basePremium: adjustedBase,
        totalPremium: adjustedTotal,
        sumAssured: sa,
      };
    });

    // Sort by total premium (cheapest first)
    quotes.sort(
      (a, b) => (a.totalPremium ?? Infinity) - (b.totalPremium ?? Infinity)
    );

    // Mark first as recommended
    if (quotes.length > 0) {
      (quotes[0] as Record<string, unknown>).isRecommended = true;
    }

    const response = NextResponse.json({
      quotes,
      timestamp: new Date().toISOString(),
      meta: {
        gstRate: 0,
        gstNote: 'GST exempt on term life insurance w.e.f. 22 Sept 2025 (GST Council 56th Meeting)',
        gender: lifeDetails.gender,
        age: lifeDetails.age,
        isSmoker: lifeDetails.isSmoker,
        sumAssured: sa,
        policyTerm: Number(policyTerm),
        payMode,
        isROP: lifeDetails.isROP,
        smokerLoading: SMOKER_LOADING,
        ropFactor: RETURN_OF_PREMIUM,
        limitedPayFactor: isPay15 ? PAY15_FACTOR : (LIMITED_PAY[mappedPayTerm] ?? 1),
        annualIncome: Number(annualIncome) || 0,
        currentLifeCover: Number(currentLifeCover) || 0,
      },
    });

    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error: any) {
    console.error('Life comparison error:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate life quotes',
        details: error.message,
      },
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
