import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

// ═══════════════════════════════════════════════════════════════════════════════
// IRDAI-MANDATED THIRD-PARTY PREMIUM RATES (Effective FY 2024-25)
// ═══════════════════════════════════════════════════════════════════════════════

const TP_RATES_CAR: Record<string, number> = {
  'below_1000cc': 2094,
  '1000_1500cc': 3416,
  'above_1500cc': 7890,
};

const TP_RATES_BIKE: Record<string, number> = {
  'below_75cc': 538,
  '75_150cc': 714,
  '150_350cc': 1366,
  'above_350cc': 2804,
};

// EV-specific TP rates (slightly different per IRDAI for electric vehicles)
const TP_RATES_EV_CAR: Record<string, number> = {
  'below_1000cc': 1779,   // ~15% lower than ICE
  '1000_1500cc': 2903,
  'above_1500cc': 6706,
};

const TP_RATES_EV_BIKE: Record<string, number> = {
  'below_75cc': 457,
  '75_150cc': 607,
  '150_350cc': 1161,
  'above_350cc': 2383,
};

// ═══════════════════════════════════════════════════════════════════════════════
// VEHICLE AGE DEPRECIATION TABLE (IRDAI Standard)
// ═══════════════════════════════════════════════════════════════════════════════

const VEHICLE_AGE_DEPRECIATION: Record<string, number> = {
  '< 1 year': 0.05,
  '1-2 years': 0.10,
  '2-3 years': 0.15,
  '3-5 years': 0.25,
  '5-7 years': 0.35,
  '7+ years': 0.45,
};

// Age-based own-damage rate loading/discount factors
const AGE_RATE_FACTOR: Record<string, number> = {
  '< 1 year': 0.90,  // New cars get 10% discount on OD
  '1-2 years': 0.95,
  '2-3 years': 1.00,
  '3-5 years': 1.05,
  '5-7 years': 1.10,
  '7+ years': 1.20,  // Old cars loaded 20%
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE INSURER DATABASE (Motor Insurance — 2024-25 Market Data)
// ═══════════════════════════════════════════════════════════════════════════════

interface AddOnCost {
  name: string;
  carCost: number;   // Annual cost for car
  bikeCost: number;  // Annual cost for bike
}

interface PlanData {
  name: string;
  odRatePercent: number;   // Own Damage rate as % of IDV
  addOnsIncluded: string[];
  keyFeatures: string[];
  claimProcessRating: number; // 1-5
}

interface InsurerData {
  csr: number;                    // Claim Settlement Ratio 2024-25
  cashlessGarages: number;        // Network garage count
  complaintRatio: number;         // Complaints per 1000 claims (lower = better)
  plans: PlanData[];
  addOnCosts: AddOnCost[];
  strengths: string[];
  digitalFirst: boolean;          // Digital-first insurer?
  claimSpeedHrs: number;          // Average claim settlement time in hours
}

const INSURER_DB: Record<string, InsurerData> = {
  'HDFC ERGO': {
    csr: 97.8,
    cashlessGarages: 13000,
    complaintRatio: 2.1,
    plans: [
      {
        name: 'HDFC ERGO Basic',
        odRatePercent: 3.8,
        addOnsIncluded: [],
        keyFeatures: ['13,000+ cashless garages', 'Quick claim settlement', '24/7 customer support'],
        claimProcessRating: 4.2,
      },
      {
        name: 'HDFC ERGO Comprehensive',
        odRatePercent: 3.5,
        addOnsIncluded: ['Zero Depreciation', 'Roadside Assistance'],
        keyFeatures: ['Zero dep included', 'RSA included', 'Fast digital claims', '13,000+ network garages'],
        claimProcessRating: 4.4,
      },
      {
        name: 'HDFC ERGO Premium',
        odRatePercent: 3.3,
        addOnsIncluded: ['Zero Depreciation', 'Roadside Assistance', 'Engine Cover', 'Consumables Cover'],
        keyFeatures: ['All essential add-ons bundled', 'Priority claim processing', 'Doorstep claim settlement', 'Consumables covered'],
        claimProcessRating: 4.6,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 4500, bikeCost: 1200 },
      { name: 'Engine Cover', carCost: 1500, bikeCost: 600 },
      { name: 'Roadside Assistance', carCost: 800, bikeCost: 350 },
      { name: 'Return to Invoice', carCost: 3500, bikeCost: 900 },
      { name: 'Consumables Cover', carCost: 1200, bikeCost: 400 },
      { name: 'NCB Protection', carCost: 1500, bikeCost: 500 },
      { name: 'Passenger Cover', carCost: 600, bikeCost: 300 },
      { name: 'Key Replacement', carCost: 800, bikeCost: 350 },
    ],
    strengths: ['Widest cashless network in India', 'Quick claim settlement', 'Strong add-on portfolio', 'Trusted brand'],
    digitalFirst: false,
    claimSpeedHrs: 72,
  },

  'ICICI Lombard': {
    csr: 96.5,
    cashlessGarages: 9500,
    complaintRatio: 2.8,
    plans: [
      {
        name: 'ICICI Lombard Basic',
        odRatePercent: 3.6,
        addOnsIncluded: [],
        keyFeatures: ['Strong digital platform', 'Wide coverage options', '9,500+ garages'],
        claimProcessRating: 4.0,
      },
      {
        name: 'ICICI Lombard Comprehensive',
        odRatePercent: 3.4,
        addOnsIncluded: ['Zero Depreciation'],
        keyFeatures: ['Zero dep included', 'Good NCB protection', 'IL Take Care app', 'Instant policy issuance'],
        claimProcessRating: 4.3,
      },
      {
        name: 'ICICI Lombard Premium',
        odRatePercent: 3.1,
        addOnsIncluded: ['Zero Depreciation', 'NCB Protection', 'Engine Cover', 'Roadside Assistance'],
        keyFeatures: ['All major add-ons bundled', 'Priority claim service', 'NCB protection included', 'Engine protect + RSA'],
        claimProcessRating: 4.5,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 4200, bikeCost: 1100 },
      { name: 'Engine Cover', carCost: 1400, bikeCost: 550 },
      { name: 'Roadside Assistance', carCost: 750, bikeCost: 300 },
      { name: 'Return to Invoice', carCost: 3200, bikeCost: 850 },
      { name: 'Consumables Cover', carCost: 1100, bikeCost: 380 },
      { name: 'NCB Protection', carCost: 1300, bikeCost: 450 },
      { name: 'Passenger Cover', carCost: 550, bikeCost: 250 },
      { name: 'Key Replacement', carCost: 750, bikeCost: 300 },
    ],
    strengths: ['Best digital experience', 'IL Take Care app', 'Strong NCB protection', 'Instant policy issuance'],
    digitalFirst: false,
    claimSpeedHrs: 80,
  },

  'Bajaj Allianz': {
    csr: 97.2,
    cashlessGarages: 11000,
    complaintRatio: 2.4,
    plans: [
      {
        name: 'Bajaj Allianz Basic',
        odRatePercent: 3.5,
        addOnsIncluded: [],
        keyFeatures: ['Competitive pricing', '11,000+ garages', 'Fast claims processing'],
        claimProcessRating: 4.1,
      },
      {
        name: 'Bajaj Allianz Comprehensive',
        odRatePercent: 3.2,
        addOnsIncluded: ['Zero Depreciation', 'Consumables Cover'],
        keyFeatures: ['Zero dep + consumables bundled', 'Good add-on suite', 'CASHLESS claim at 11K+ garages', 'Quick settlement'],
        claimProcessRating: 4.4,
      },
      {
        name: 'Bajaj Allianz Premium',
        odRatePercent: 3.0,
        addOnsIncluded: ['Zero Depreciation', 'Engine Cover', 'Consumables Cover', 'Roadside Assistance', 'NCB Protection'],
        keyFeatures: ['Maximum add-on coverage', '5 add-ons bundled', 'Priority claims', 'Best for new cars'],
        claimProcessRating: 4.7,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 4000, bikeCost: 1050 },
      { name: 'Engine Cover', carCost: 1300, bikeCost: 500 },
      { name: 'Roadside Assistance', carCost: 700, bikeCost: 300 },
      { name: 'Return to Invoice', carCost: 3000, bikeCost: 800 },
      { name: 'Consumables Cover', carCost: 1000, bikeCost: 350 },
      { name: 'NCB Protection', carCost: 1200, bikeCost: 400 },
      { name: 'Passenger Cover', carCost: 500, bikeCost: 250 },
      { name: 'Key Replacement', carCost: 700, bikeCost: 280 },
    ],
    strengths: ['Best add-on portfolio in India', 'Competitive pricing', 'Fast claim settlement', 'Strong brand trust'],
    digitalFirst: false,
    claimSpeedHrs: 68,
  },

  'Acko': {
    csr: 98.1,
    cashlessGarages: 5000,
    complaintRatio: 1.2,
    plans: [
      {
        name: 'Acko Basic',
        odRatePercent: 2.8,
        addOnsIncluded: [],
        keyFeatures: ['Lowest premiums', 'No inspection needed', 'Digital-first process'],
        claimProcessRating: 4.3,
      },
      {
        name: 'Acko Comprehensive',
        odRatePercent: 2.6,
        addOnsIncluded: ['Zero Depreciation'],
        keyFeatures: ['Zero dep included', 'Digital claims in 2 hrs', 'Pickup-drop claims', 'No paperwork'],
        claimProcessRating: 4.5,
      },
      {
        name: 'Acko Premium',
        odRatePercent: 2.4,
        addOnsIncluded: ['Zero Depreciation', 'Engine Cover', 'Roadside Assistance'],
        keyFeatures: ['3 add-ons bundled', 'Fastest digital claims', 'Doorstep pickup & drop', '2-hour claim settlement'],
        claimProcessRating: 4.8,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 3200, bikeCost: 900 },
      { name: 'Engine Cover', carCost: 1200, bikeCost: 450 },
      { name: 'Roadside Assistance', carCost: 600, bikeCost: 250 },
      { name: 'Return to Invoice', carCost: 2800, bikeCost: 750 },
      { name: 'Consumables Cover', carCost: 900, bikeCost: 300 },
      { name: 'NCB Protection', carCost: 1000, bikeCost: 350 },
      { name: 'Passenger Cover', carCost: 450, bikeCost: 200 },
      { name: 'Key Replacement', carCost: 600, bikeCost: 250 },
    ],
    strengths: ['Lowest premiums in market', 'Fastest claim settlement (2 hrs)', '100% digital process', 'No inspection needed for renewal'],
    digitalFirst: true,
    claimSpeedHrs: 2,
  },

  'TATA AIG': {
    csr: 96.8,
    cashlessGarages: 10000,
    complaintRatio: 2.3,
    plans: [
      {
        name: 'TATA AIG Basic',
        odRatePercent: 3.7,
        addOnsIncluded: [],
        keyFeatures: ['TATA brand trust', '10,000+ garages', 'Comprehensive coverage'],
        claimProcessRating: 4.0,
      },
      {
        name: 'TATA AIG Comprehensive',
        odRatePercent: 3.4,
        addOnsIncluded: ['Zero Depreciation', 'NCB Protection'],
        keyFeatures: ['Zero dep + NCB protection', 'TATA brand reliability', 'Good NCB discounts', 'Wide coverage'],
        claimProcessRating: 4.3,
      },
      {
        name: 'TATA AIG Premium',
        odRatePercent: 3.2,
        addOnsIncluded: ['Zero Depreciation', 'Return to Invoice', 'NCB Protection', 'Engine Cover'],
        keyFeatures: ['4 add-ons bundled', 'Return to Invoice included', 'Best NCB protection', 'Strong claim support'],
        claimProcessRating: 4.5,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 4300, bikeCost: 1150 },
      { name: 'Engine Cover', carCost: 1400, bikeCost: 550 },
      { name: 'Roadside Assistance', carCost: 750, bikeCost: 320 },
      { name: 'Return to Invoice', carCost: 3300, bikeCost: 850 },
      { name: 'Consumables Cover', carCost: 1050, bikeCost: 380 },
      { name: 'NCB Protection', carCost: 1400, bikeCost: 480 },
      { name: 'Passenger Cover', carCost: 550, bikeCost: 260 },
      { name: 'Key Replacement', carCost: 720, bikeCost: 300 },
    ],
    strengths: ['TATA brand trust', 'Best NCB protection scheme', 'Return to Invoice specialist', 'Wide cashless network'],
    digitalFirst: false,
    claimSpeedHrs: 78,
  },

  'Digit': {
    csr: 97.5,
    cashlessGarages: 7500,
    complaintRatio: 1.5,
    plans: [
      {
        name: 'Digit Basic',
        odRatePercent: 3.0,
        addOnsIncluded: [],
        keyFeatures: ['Affordable premiums', 'Smart customization', 'Good digital experience'],
        claimProcessRating: 4.2,
      },
      {
        name: 'Digit Comprehensive',
        odRatePercent: 2.8,
        addOnsIncluded: ['Zero Depreciation'],
        keyFeatures: ['Zero dep included', 'Smartphone self-inspection', 'Customizable IDV', 'Affordable pricing'],
        claimProcessRating: 4.4,
      },
      {
        name: 'Digit Premium',
        odRatePercent: 2.6,
        addOnsIncluded: ['Zero Depreciation', 'Consumables Cover', 'Roadside Assistance'],
        keyFeatures: ['3 add-ons bundled', 'Choose your own IDV', 'Smartphone claims', 'Great value for money'],
        claimProcessRating: 4.6,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 3500, bikeCost: 950 },
      { name: 'Engine Cover', carCost: 1250, bikeCost: 480 },
      { name: 'Roadside Assistance', carCost: 650, bikeCost: 270 },
      { name: 'Return to Invoice', carCost: 2900, bikeCost: 780 },
      { name: 'Consumables Cover', carCost: 950, bikeCost: 320 },
      { name: 'NCB Protection', carCost: 1100, bikeCost: 380 },
      { name: 'Passenger Cover', carCost: 480, bikeCost: 220 },
      { name: 'Key Replacement', carCost: 650, bikeCost: 260 },
    ],
    strengths: ['Smart IDV customization', 'Affordable premiums', 'Smartphone self-inspection', 'Good digital experience'],
    digitalFirst: true,
    claimSpeedHrs: 36,
  },

  'Niva Bupa': {
    csr: 95.2,
    cashlessGarages: 6000,
    complaintRatio: 3.2,
    plans: [
      {
        name: 'Niva Bupa Basic',
        odRatePercent: 3.4,
        addOnsIncluded: [],
        keyFeatures: ['Health + Motor combo options', 'Good customer service', '6,000+ garages'],
        claimProcessRating: 3.8,
      },
      {
        name: 'Niva Bupa Comprehensive',
        odRatePercent: 3.2,
        addOnsIncluded: ['Zero Depreciation'],
        keyFeatures: ['Zero dep included', 'Health combo discounts', 'Dedicated relationship manager'],
        claimProcessRating: 4.0,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 3800, bikeCost: 1000 },
      { name: 'Engine Cover', carCost: 1350, bikeCost: 520 },
      { name: 'Roadside Assistance', carCost: 700, bikeCost: 280 },
      { name: 'Return to Invoice', carCost: 3100, bikeCost: 820 },
      { name: 'Consumables Cover', carCost: 1050, bikeCost: 360 },
      { name: 'NCB Protection', carCost: 1250, bikeCost: 420 },
      { name: 'Passenger Cover', carCost: 520, bikeCost: 240 },
      { name: 'Key Replacement', carCost: 680, bikeCost: 280 },
    ],
    strengths: ['Health + Motor combo plans', 'Good customer service', 'Dedicated relationship manager'],
    digitalFirst: false,
    claimSpeedHrs: 96,
  },

  'Star Health': {
    csr: 94.8,
    cashlessGarages: 5500,
    complaintRatio: 3.5,
    plans: [
      {
        name: 'Star Health Basic',
        odRatePercent: 3.3,
        addOnsIncluded: [],
        keyFeatures: ['Health specialist brand', 'Simple process', '5,500+ garages'],
        claimProcessRating: 3.7,
      },
      {
        name: 'Star Health Comprehensive',
        odRatePercent: 3.1,
        addOnsIncluded: ['Zero Depreciation'],
        keyFeatures: ['Zero dep included', 'Simple claim process', 'Health insurance cross-sell discounts'],
        claimProcessRating: 3.9,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 3700, bikeCost: 980 },
      { name: 'Engine Cover', carCost: 1300, bikeCost: 500 },
      { name: 'Roadside Assistance', carCost: 680, bikeCost: 270 },
      { name: 'Return to Invoice', carCost: 3000, bikeCost: 800 },
      { name: 'Consumables Cover', carCost: 1000, bikeCost: 340 },
      { name: 'NCB Protection', carCost: 1200, bikeCost: 400 },
      { name: 'Passenger Cover', carCost: 500, bikeCost: 230 },
      { name: 'Key Replacement', carCost: 650, bikeCost: 260 },
    ],
    strengths: ['Health insurance specialist', 'Simple claim process', 'Cross-sell discounts'],
    digitalFirst: false,
    claimSpeedHrs: 100,
  },

  'Care Health': {
    csr: 95.5,
    cashlessGarages: 5800,
    complaintRatio: 3.0,
    plans: [
      {
        name: 'Care Health Basic',
        odRatePercent: 3.4,
        addOnsIncluded: [],
        keyFeatures: ['Good value plans', 'Health focus', '5,800+ garages'],
        claimProcessRating: 3.9,
      },
      {
        name: 'Care Health Comprehensive',
        odRatePercent: 3.2,
        addOnsIncluded: ['Zero Depreciation', 'Consumables Cover'],
        keyFeatures: ['Zero dep + consumables', 'Value pricing', 'Health combo benefits'],
        claimProcessRating: 4.1,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 3900, bikeCost: 1020 },
      { name: 'Engine Cover', carCost: 1320, bikeCost: 510 },
      { name: 'Roadside Assistance', carCost: 690, bikeCost: 275 },
      { name: 'Return to Invoice', carCost: 3050, bikeCost: 810 },
      { name: 'Consumables Cover', carCost: 1020, bikeCost: 350 },
      { name: 'NCB Protection', carCost: 1230, bikeCost: 410 },
      { name: 'Passenger Cover', carCost: 510, bikeCost: 235 },
      { name: 'Key Replacement', carCost: 660, bikeCost: 270 },
    ],
    strengths: ['Good value plans', 'Health combo benefits', 'Competitive pricing'],
    digitalFirst: false,
    claimSpeedHrs: 90,
  },

  'New India Assurance': {
    csr: 94.2,
    cashlessGarages: 8500,
    complaintRatio: 3.8,
    plans: [
      {
        name: 'New India Basic',
        odRatePercent: 3.6,
        addOnsIncluded: [],
        keyFeatures: ['Government-backed', 'Widely trusted', '8,500+ garages'],
        claimProcessRating: 3.5,
      },
      {
        name: 'New India Comprehensive',
        odRatePercent: 3.4,
        addOnsIncluded: ['Zero Depreciation'],
        keyFeatures: ['Zero dep available', 'Government backing', 'Wide network', 'Reliable claims'],
        claimProcessRating: 3.7,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 4100, bikeCost: 1080 },
      { name: 'Engine Cover', carCost: 1450, bikeCost: 560 },
      { name: 'Roadside Assistance', carCost: 780, bikeCost: 310 },
      { name: 'Return to Invoice', carCost: 3200, bikeCost: 860 },
      { name: 'Consumables Cover', carCost: 1080, bikeCost: 370 },
      { name: 'NCB Protection', carCost: 1280, bikeCost: 430 },
      { name: 'Passenger Cover', carCost: 530, bikeCost: 245 },
      { name: 'Key Replacement', carCost: 700, bikeCost: 290 },
    ],
    strengths: ['Government-backed insurer', 'Highest trust factor', 'Wide garage network', 'Long-standing reputation'],
    digitalFirst: false,
    claimSpeedHrs: 120,
  },

  'United India': {
    csr: 93.5,
    cashlessGarages: 7500,
    complaintRatio: 4.2,
    plans: [
      {
        name: 'United India Basic',
        odRatePercent: 3.7,
        addOnsIncluded: [],
        keyFeatures: ['Public sector insurer', '7,500+ garages', 'Budget-friendly'],
        claimProcessRating: 3.3,
      },
      {
        name: 'United India Comprehensive',
        odRatePercent: 3.5,
        addOnsIncluded: ['Zero Depreciation'],
        keyFeatures: ['Zero dep available', 'Public sector trust', 'Affordable premiums'],
        claimProcessRating: 3.5,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 4200, bikeCost: 1100 },
      { name: 'Engine Cover', carCost: 1500, bikeCost: 580 },
      { name: 'Roadside Assistance', carCost: 800, bikeCost: 320 },
      { name: 'Return to Invoice', carCost: 3300, bikeCost: 880 },
      { name: 'Consumables Cover', carCost: 1100, bikeCost: 380 },
      { name: 'NCB Protection', carCost: 1300, bikeCost: 450 },
      { name: 'Passenger Cover', carCost: 550, bikeCost: 250 },
      { name: 'Key Replacement', carCost: 720, bikeCost: 300 },
    ],
    strengths: ['Public sector insurer', 'Affordable premiums', 'Wide network'],
    digitalFirst: false,
    claimSpeedHrs: 130,
  },

  'Oriental': {
    csr: 93.0,
    cashlessGarages: 7000,
    complaintRatio: 4.5,
    plans: [
      {
        name: 'Oriental Basic',
        odRatePercent: 3.8,
        addOnsIncluded: [],
        keyFeatures: ['Public sector insurer', '7,000+ garages', 'Traditional coverage'],
        claimProcessRating: 3.2,
      },
      {
        name: 'Oriental Comprehensive',
        odRatePercent: 3.6,
        addOnsIncluded: ['Zero Depreciation'],
        keyFeatures: ['Zero dep available', 'Public sector reliability', 'Traditional process'],
        claimProcessRating: 3.4,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 4300, bikeCost: 1120 },
      { name: 'Engine Cover', carCost: 1520, bikeCost: 590 },
      { name: 'Roadside Assistance', carCost: 820, bikeCost: 330 },
      { name: 'Return to Invoice', carCost: 3350, bikeCost: 900 },
      { name: 'Consumables Cover', carCost: 1120, bikeCost: 390 },
      { name: 'NCB Protection', carCost: 1320, bikeCost: 460 },
      { name: 'Passenger Cover', carCost: 560, bikeCost: 255 },
      { name: 'Key Replacement', carCost: 730, bikeCost: 305 },
    ],
    strengths: ['Public sector insurer', 'Budget-friendly', 'Traditional trust'],
    digitalFirst: false,
    claimSpeedHrs: 140,
  },

  'Magma HDI': {
    csr: 95.0,
    cashlessGarages: 5500,
    complaintRatio: 2.9,
    plans: [
      {
        name: 'Magma HDI Basic',
        odRatePercent: 3.3,
        addOnsIncluded: [],
        keyFeatures: ['Competitive pricing', '5,500+ garages', 'Good regional presence'],
        claimProcessRating: 3.8,
      },
      {
        name: 'Magma HDI Comprehensive',
        odRatePercent: 3.1,
        addOnsIncluded: ['Zero Depreciation'],
        keyFeatures: ['Zero dep included', 'Competitive pricing', 'Good regional service'],
        claimProcessRating: 4.0,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 3600, bikeCost: 960 },
      { name: 'Engine Cover', carCost: 1280, bikeCost: 490 },
      { name: 'Roadside Assistance', carCost: 670, bikeCost: 265 },
      { name: 'Return to Invoice', carCost: 2950, bikeCost: 790 },
      { name: 'Consumables Cover', carCost: 970, bikeCost: 330 },
      { name: 'NCB Protection', carCost: 1150, bikeCost: 390 },
      { name: 'Passenger Cover', carCost: 490, bikeCost: 225 },
      { name: 'Key Replacement', carCost: 640, bikeCost: 255 },
    ],
    strengths: ['Competitive pricing', 'Good regional presence', 'Quick processing'],
    digitalFirst: false,
    claimSpeedHrs: 85,
  },

  'Shriram': {
    csr: 93.8,
    cashlessGarages: 6000,
    complaintRatio: 3.6,
    plans: [
      {
        name: 'Shriram Basic',
        odRatePercent: 3.5,
        addOnsIncluded: [],
        keyFeatures: ['Affordable premiums', '6,000+ garages', 'Good for commercial vehicles'],
        claimProcessRating: 3.5,
      },
      {
        name: 'Shriram Comprehensive',
        odRatePercent: 3.3,
        addOnsIncluded: ['Zero Depreciation'],
        keyFeatures: ['Zero dep included', 'Affordable pricing', 'Commercial vehicle expertise'],
        claimProcessRating: 3.7,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 3800, bikeCost: 1000 },
      { name: 'Engine Cover', carCost: 1350, bikeCost: 520 },
      { name: 'Roadside Assistance', carCost: 700, bikeCost: 280 },
      { name: 'Return to Invoice', carCost: 3100, bikeCost: 830 },
      { name: 'Consumables Cover', carCost: 1030, bikeCost: 355 },
      { name: 'NCB Protection', carCost: 1220, bikeCost: 415 },
      { name: 'Passenger Cover', carCost: 520, bikeCost: 240 },
      { name: 'Key Replacement', carCost: 670, bikeCost: 275 },
    ],
    strengths: ['Affordable premiums', 'Commercial vehicle specialist', 'Good for fleet insurance'],
    digitalFirst: false,
    claimSpeedHrs: 95,
  },

  'Royal Sundaram': {
    csr: 95.8,
    cashlessGarages: 6500,
    complaintRatio: 2.6,
    plans: [
      {
        name: 'Royal Sundaram Basic',
        odRatePercent: 3.4,
        addOnsIncluded: [],
        keyFeatures: ['Good claim experience', '6,500+ garages', 'International expertise'],
        claimProcessRating: 4.0,
      },
      {
        name: 'Royal Sundaram Comprehensive',
        odRatePercent: 3.2,
        addOnsIncluded: ['Zero Depreciation', 'Roadside Assistance'],
        keyFeatures: ['Zero dep + RSA bundled', 'Good claim settlement', 'International backing'],
        claimProcessRating: 4.2,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 3700, bikeCost: 990 },
      { name: 'Engine Cover', carCost: 1300, bikeCost: 500 },
      { name: 'Roadside Assistance', carCost: 680, bikeCost: 275 },
      { name: 'Return to Invoice', carCost: 3000, bikeCost: 800 },
      { name: 'Consumables Cover', carCost: 1000, bikeCost: 345 },
      { name: 'NCB Protection', carCost: 1180, bikeCost: 400 },
      { name: 'Passenger Cover', carCost: 500, bikeCost: 230 },
      { name: 'Key Replacement', carCost: 650, bikeCost: 265 },
    ],
    strengths: ['Good claim settlement ratio', 'International backing (Ageas)', 'Strong add-on portfolio'],
    digitalFirst: false,
    claimSpeedHrs: 82,
  },

  'Liberty': {
    csr: 96.0,
    cashlessGarages: 5800,
    complaintRatio: 2.5,
    plans: [
      {
        name: 'Liberty Basic',
        odRatePercent: 3.4,
        addOnsIncluded: [],
        keyFeatures: ['Global insurance expertise', '5,800+ garages', 'Innovative products'],
        claimProcessRating: 4.0,
      },
      {
        name: 'Liberty Comprehensive',
        odRatePercent: 3.2,
        addOnsIncluded: ['Zero Depreciation'],
        keyFeatures: ['Zero dep included', 'Global expertise', 'Innovative claim solutions'],
        claimProcessRating: 4.2,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 3800, bikeCost: 1010 },
      { name: 'Engine Cover', carCost: 1320, bikeCost: 510 },
      { name: 'Roadside Assistance', carCost: 690, bikeCost: 278 },
      { name: 'Return to Invoice', carCost: 3050, bikeCost: 815 },
      { name: 'Consumables Cover', carCost: 1015, bikeCost: 348 },
      { name: 'NCB Protection', carCost: 1200, bikeCost: 408 },
      { name: 'Passenger Cover', carCost: 505, bikeCost: 233 },
      { name: 'Key Replacement', carCost: 660, bikeCost: 268 },
    ],
    strengths: ['Global insurance expertise', 'Innovative products', 'Good claim experience'],
    digitalFirst: false,
    claimSpeedHrs: 88,
  },

  'Raheja QBE': {
    csr: 94.5,
    cashlessGarages: 5000,
    complaintRatio: 3.3,
    plans: [
      {
        name: 'Raheja QBE Basic',
        odRatePercent: 3.5,
        addOnsIncluded: [],
        keyFeatures: ['Niche products', '5,000+ garages', 'Customizable plans'],
        claimProcessRating: 3.6,
      },
      {
        name: 'Raheja QBE Comprehensive',
        odRatePercent: 3.3,
        addOnsIncluded: ['Zero Depreciation'],
        keyFeatures: ['Zero dep included', 'Customizable coverage', 'QBE global backing'],
        claimProcessRating: 3.8,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 3900, bikeCost: 1040 },
      { name: 'Engine Cover', carCost: 1380, bikeCost: 530 },
      { name: 'Roadside Assistance', carCost: 720, bikeCost: 290 },
      { name: 'Return to Invoice', carCost: 3150, bikeCost: 840 },
      { name: 'Consumables Cover', carCost: 1060, bikeCost: 365 },
      { name: 'NCB Protection', carCost: 1260, bikeCost: 425 },
      { name: 'Passenger Cover', carCost: 525, bikeCost: 242 },
      { name: 'Key Replacement', carCost: 690, bikeCost: 282 },
    ],
    strengths: ['QBE global backing', 'Customizable plans', 'Niche products'],
    digitalFirst: false,
    claimSpeedHrs: 100,
  },

  'Other': {
    csr: 93.0,
    cashlessGarages: 4000,
    complaintRatio: 4.0,
    plans: [
      {
        name: 'Standard Comprehensive',
        odRatePercent: 4.0,
        addOnsIncluded: [],
        keyFeatures: ['Standard coverage', 'Basic protection'],
        claimProcessRating: 3.2,
      },
    ],
    addOnCosts: [
      { name: 'Zero Depreciation', carCost: 4500, bikeCost: 1200 },
      { name: 'Engine Cover', carCost: 1500, bikeCost: 600 },
      { name: 'Roadside Assistance', carCost: 800, bikeCost: 350 },
      { name: 'Return to Invoice', carCost: 3500, bikeCost: 900 },
      { name: 'Consumables Cover', carCost: 1200, bikeCost: 400 },
      { name: 'NCB Protection', carCost: 1400, bikeCost: 500 },
      { name: 'Passenger Cover', carCost: 600, bikeCost: 300 },
      { name: 'Key Replacement', carCost: 800, bikeCost: 350 },
    ],
    strengths: ['Varies by insurer'],
    digitalFirst: false,
    claimSpeedHrs: 120,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EV-SPECIFIC INSURER PLANS (Electric Vehicles — 2024-25 Market Data)
// Lower OD rates (EVs have fewer moving parts, less risk), EV-specific add-ons
// ═══════════════════════════════════════════════════════════════════════════════

interface EVPlanData extends PlanData {
  isEV: true;
}

interface EVInsurerData extends InsurerData {
  evPlans: EVPlanData[];
}

// EV-specific add-on costs appended to each insurer
const EV_ADD_ON_COSTS: AddOnCost[] = [
  { name: 'Battery Degradation Cover', carCost: 5000, bikeCost: 2000 },
  { name: 'Charging Cable Cover', carCost: 1500, bikeCost: 600 },
  { name: 'Charging Station RSA', carCost: 1200, bikeCost: 500 },
  { name: 'EV Motor Cover', carCost: 3000, bikeCost: 1200 },
];

const EV_INSURER_DB: Record<string, EVInsurerData> = {
  'HDFC ERGO': {
    csr: 97.8,
    cashlessGarages: 13000,
    complaintRatio: 2.1,
    plans: [
      {
        name: 'HDFC ERGO EV Basic',
        odRatePercent: 3.4,
        addOnsIncluded: [],
        keyFeatures: ['EV-optimized coverage', '13,000+ cashless garages', 'Quick claim settlement'],
        claimProcessRating: 4.2,
        isEV: true,
      },
      {
        name: 'HDFC ERGO EV Comprehensive',
        odRatePercent: 3.1,
        addOnsIncluded: ['Zero Depreciation', 'Battery Degradation Cover'],
        keyFeatures: ['EV-optimized coverage', 'Battery degradation included', 'Charging station RSA', 'Fast digital claims'],
        claimProcessRating: 4.5,
        isEV: true,
      },
      {
        name: 'HDFC ERGO EV Premium',
        odRatePercent: 2.9,
        addOnsIncluded: ['Zero Depreciation', 'Battery Degradation Cover', 'Charging Cable Cover', 'EV Motor Cover'],
        keyFeatures: ['All EV add-ons bundled', 'Battery warranty cover', 'Charging infrastructure support', 'Priority claim processing'],
        claimProcessRating: 4.7,
        isEV: true,
      },
    ],
    addOnCosts: [
      ...INSURER_DB['HDFC ERGO'].addOnCosts,
      ...EV_ADD_ON_COSTS,
    ],
    strengths: ['Widest cashless network in India', 'Quick claim settlement', 'Strong EV add-on portfolio', 'Trusted brand'],
    digitalFirst: false,
    claimSpeedHrs: 72,
    evPlans: [],
  },

  'ICICI Lombard': {
    csr: 96.5,
    cashlessGarages: 9500,
    complaintRatio: 2.8,
    plans: [
      {
        name: 'ICICI Lombard EV Basic',
        odRatePercent: 3.2,
        addOnsIncluded: [],
        keyFeatures: ['Strong digital platform', 'EV coverage options', '9,500+ garages'],
        claimProcessRating: 4.0,
        isEV: true,
      },
      {
        name: 'ICICI Lombard EV Comprehensive',
        odRatePercent: 3.0,
        addOnsIncluded: ['Zero Depreciation', 'Battery Degradation Cover'],
        keyFeatures: ['Zero dep + battery cover', 'IL Take Care app', 'Instant policy issuance', 'EV-optimized'],
        claimProcessRating: 4.4,
        isEV: true,
      },
      {
        name: 'ICICI Lombard EV Premium',
        odRatePercent: 2.7,
        addOnsIncluded: ['Zero Depreciation', 'Battery Degradation Cover', 'Charging Cable Cover', 'EV Motor Cover'],
        keyFeatures: ['Full EV coverage', 'Battery warranty included', 'Charging infrastructure support', 'Priority claims'],
        claimProcessRating: 4.6,
        isEV: true,
      },
    ],
    addOnCosts: [
      ...INSURER_DB['ICICI Lombard'].addOnCosts,
      ...EV_ADD_ON_COSTS,
    ],
    strengths: ['Best digital experience', 'IL Take Care app', 'Strong EV coverage', 'Instant policy issuance'],
    digitalFirst: false,
    claimSpeedHrs: 80,
    evPlans: [],
  },

  'Bajaj Allianz': {
    csr: 97.2,
    cashlessGarages: 11000,
    complaintRatio: 2.4,
    plans: [
      {
        name: 'Bajaj Allianz EV Basic',
        odRatePercent: 3.1,
        addOnsIncluded: [],
        keyFeatures: ['Competitive EV pricing', '11,000+ garages', 'Fast claims processing'],
        claimProcessRating: 4.1,
        isEV: true,
      },
      {
        name: 'Bajaj Allianz EV Comprehensive',
        odRatePercent: 2.8,
        addOnsIncluded: ['Zero Depreciation', 'Battery Degradation Cover', 'Consumables Cover'],
        keyFeatures: ['Zero dep + battery + consumables', 'Good EV add-on suite', 'Quick settlement'],
        claimProcessRating: 4.5,
        isEV: true,
      },
      {
        name: 'Bajaj Allianz EV Premium',
        odRatePercent: 2.6,
        addOnsIncluded: ['Zero Depreciation', 'Battery Degradation Cover', 'Charging Cable Cover', 'EV Motor Cover', 'Charging Station RSA'],
        keyFeatures: ['Maximum EV add-on coverage', '5 EV add-ons bundled', 'Priority claims', 'Best for new EVs'],
        claimProcessRating: 4.8,
        isEV: true,
      },
    ],
    addOnCosts: [
      ...INSURER_DB['Bajaj Allianz'].addOnCosts,
      ...EV_ADD_ON_COSTS,
    ],
    strengths: ['Best add-on portfolio in India', 'Competitive EV pricing', 'Fast claim settlement', 'Strong brand trust'],
    digitalFirst: false,
    claimSpeedHrs: 68,
    evPlans: [],
  },

  'Acko': {
    csr: 98.1,
    cashlessGarages: 5000,
    complaintRatio: 1.2,
    plans: [
      {
        name: 'Acko EV Basic',
        odRatePercent: 2.5,
        addOnsIncluded: [],
        keyFeatures: ['Lowest EV premiums', 'No inspection needed', 'Digital-first process'],
        claimProcessRating: 4.3,
        isEV: true,
      },
      {
        name: 'Acko EV Comprehensive',
        odRatePercent: 2.3,
        addOnsIncluded: ['Zero Depreciation', 'Battery Degradation Cover'],
        keyFeatures: ['EV-optimized coverage', 'Battery degradation included', 'Charging station RSA', 'Digital claims in 2 hrs'],
        claimProcessRating: 4.6,
        isEV: true,
      },
      {
        name: 'Acko EV Premium',
        odRatePercent: 2.1,
        addOnsIncluded: ['Zero Depreciation', 'Battery Degradation Cover', 'EV Motor Cover', 'Charging Cable Cover'],
        keyFeatures: ['Full EV coverage bundled', 'Fastest digital claims', 'Doorstep pickup & drop', '2-hour claim settlement'],
        claimProcessRating: 4.9,
        isEV: true,
      },
    ],
    addOnCosts: [
      ...INSURER_DB['Acko'].addOnCosts,
      ...EV_ADD_ON_COSTS,
    ],
    strengths: ['Lowest premiums in market', 'Fastest claim settlement (2 hrs)', '100% digital process', 'Best EV pricing'],
    digitalFirst: true,
    claimSpeedHrs: 2,
    evPlans: [],
  },

  'TATA AIG': {
    csr: 96.8,
    cashlessGarages: 10000,
    complaintRatio: 2.3,
    plans: [
      {
        name: 'TATA AIG EV Basic',
        odRatePercent: 3.3,
        addOnsIncluded: [],
        keyFeatures: ['TATA brand trust', '10,000+ garages', 'EV coverage'],
        claimProcessRating: 4.0,
        isEV: true,
      },
      {
        name: 'TATA AIG EV Comprehensive',
        odRatePercent: 3.0,
        addOnsIncluded: ['Zero Depreciation', 'Battery Degradation Cover', 'NCB Protection'],
        keyFeatures: ['Zero dep + battery + NCB', 'TATA brand reliability', 'Good NCB discounts', 'EV-optimized'],
        claimProcessRating: 4.4,
        isEV: true,
      },
      {
        name: 'TATA AIG EV Premium',
        odRatePercent: 2.8,
        addOnsIncluded: ['Zero Depreciation', 'Battery Degradation Cover', 'EV Motor Cover', 'Charging Cable Cover'],
        keyFeatures: ['4 EV add-ons bundled', 'Battery warranty cover', 'Best NCB protection', 'Charging infrastructure support'],
        claimProcessRating: 4.6,
        isEV: true,
      },
    ],
    addOnCosts: [
      ...INSURER_DB['TATA AIG'].addOnCosts,
      ...EV_ADD_ON_COSTS,
    ],
    strengths: ['TATA brand trust', 'Best NCB protection scheme', 'EV specialist', 'Wide cashless network'],
    digitalFirst: false,
    claimSpeedHrs: 78,
    evPlans: [],
  },

  'Digit': {
    csr: 97.5,
    cashlessGarages: 7500,
    complaintRatio: 1.5,
    plans: [
      {
        name: 'Digit EV Basic',
        odRatePercent: 2.7,
        addOnsIncluded: [],
        keyFeatures: ['Affordable EV premiums', 'Smart customization', 'Good digital experience'],
        claimProcessRating: 4.2,
        isEV: true,
      },
      {
        name: 'Digit EV Comprehensive',
        odRatePercent: 2.5,
        addOnsIncluded: ['Zero Depreciation', 'Battery Degradation Cover'],
        keyFeatures: ['Zero dep + battery cover', 'Smartphone self-inspection', 'Customizable IDV', 'Affordable EV pricing'],
        claimProcessRating: 4.5,
        isEV: true,
      },
      {
        name: 'Digit EV Premium',
        odRatePercent: 2.3,
        addOnsIncluded: ['Zero Depreciation', 'Battery Degradation Cover', 'Charging Station RSA', 'EV Motor Cover'],
        keyFeatures: ['4 EV add-ons bundled', 'Choose your own IDV', 'Smartphone claims', 'Great EV value'],
        claimProcessRating: 4.7,
        isEV: true,
      },
    ],
    addOnCosts: [
      ...INSURER_DB['Digit'].addOnCosts,
      ...EV_ADD_ON_COSTS,
    ],
    strengths: ['Smart IDV customization', 'Affordable EV premiums', 'Smartphone self-inspection', 'Good digital experience'],
    digitalFirst: true,
    claimSpeedHrs: 36,
    evPlans: [],
  },

  'Other': {
    csr: 93.0,
    cashlessGarages: 4000,
    complaintRatio: 4.0,
    plans: [
      {
        name: 'Standard EV Comprehensive',
        odRatePercent: 3.6,
        addOnsIncluded: [],
        keyFeatures: ['Standard EV coverage', 'Basic protection'],
        claimProcessRating: 3.2,
        isEV: true,
      },
    ],
    addOnCosts: [
      ...INSURER_DB['Other'].addOnCosts,
      ...EV_ADD_ON_COSTS,
    ],
    strengths: ['Varies by insurer'],
    digitalFirst: false,
    claimSpeedHrs: 120,
    evPlans: [],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADD-ON USEFULNESS TABLE — by vehicle age (Motor/ICE)
// ═══════════════════════════════════════════════════════════════════════════════

const ADD_ON_USEFULNESS: Record<string, Record<string, 'essential' | 'useful' | 'optional' | 'unnecessary'>> = {
  'Zero Depreciation': {
    '< 1 year': 'essential',
    '1-2 years': 'essential',
    '2-3 years': 'essential',
    '3-5 years': 'essential',
    '5-7 years': 'useful',
    '7+ years': 'optional',
  },
  'Engine Cover': {
    '< 1 year': 'unnecessary',  // Under warranty
    '1-2 years': 'unnecessary', // Under warranty
    '2-3 years': 'optional',
    '3-5 years': 'useful',
    '5-7 years': 'essential',
    '7+ years': 'essential',
  },
  'Roadside Assistance': {
    '< 1 year': 'optional',
    '1-2 years': 'optional',
    '2-3 years': 'useful',
    '3-5 years': 'useful',
    '5-7 years': 'essential',
    '7+ years': 'essential',
  },
  'Return to Invoice': {
    '< 1 year': 'essential',
    '1-2 years': 'essential',
    '2-3 years': 'useful',
    '3-5 years': 'optional',
    '5-7 years': 'unnecessary',
    '7+ years': 'unnecessary',
  },
  'Consumables Cover': {
    '< 1 year': 'optional',
    '1-2 years': 'optional',
    '2-3 years': 'useful',
    '3-5 years': 'useful',
    '5-7 years': 'useful',
    '7+ years': 'optional',
  },
  'NCB Protection': {
    '< 1 year': 'useful',
    '1-2 years': 'useful',
    '2-3 years': 'essential',
    '3-5 years': 'essential',
    '5-7 years': 'essential',
    '7+ years': 'essential',
  },
  'Passenger Cover': {
    '< 1 year': 'optional',
    '1-2 years': 'optional',
    '2-3 years': 'optional',
    '3-5 years': 'optional',
    '5-7 years': 'optional',
    '7+ years': 'optional',
  },
  'Key Replacement': {
    '< 1 year': 'optional',
    '1-2 years': 'optional',
    '2-3 years': 'optional',
    '3-5 years': 'optional',
    '5-7 years': 'optional',
    '7+ years': 'optional',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EV-SPECIFIC ADD-ON USEFULNESS TABLE — by vehicle age
// ═══════════════════════════════════════════════════════════════════════════════

const EV_ADD_ON_USEFULNESS: Record<string, Record<string, 'essential' | 'useful' | 'optional' | 'unnecessary'>> = {
  'Battery Degradation Cover': {
    '< 1 year': 'useful',
    '1-2 years': 'useful',
    '2-3 years': 'essential',
    '3-5 years': 'essential',
    '5-7 years': 'essential',
    '7+ years': 'essential',
  },
  'Charging Cable Cover': {
    '< 1 year': 'useful',
    '1-2 years': 'useful',
    '2-3 years': 'useful',
    '3-5 years': 'essential',
    '5-7 years': 'essential',
    '7+ years': 'useful',
  },
  'Charging Station RSA': {
    '< 1 year': 'optional',
    '1-2 years': 'useful',
    '2-3 years': 'useful',
    '3-5 years': 'essential',
    '5-7 years': 'essential',
    '7+ years': 'essential',
  },
  'EV Motor Cover': {
    '< 1 year': 'unnecessary',
    '1-2 years': 'unnecessary',
    '2-3 years': 'optional',
    '3-5 years': 'useful',
    '5-7 years': 'essential',
    '7+ years': 'essential',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH INSURANCE DATABASE (2024-25 Market Data)
// ═══════════════════════════════════════════════════════════════════════════════

interface HealthAddOnCost {
  name: string;
  costPerLakh: number; // Cost per lakh of sum insured
}

interface HealthPlanData {
  name: string;
  basePremiumPercent: number; // Base premium as % of sum insured
  roomRentLimit: string;
  addOnsIncluded: string[];
  keyFeatures: string[];
  claimProcessRating: number;
  waitingPeriodPED: number; // months for pre-existing diseases
  restoration: boolean;
  noClaimBonus: string;
}

interface HealthInsurerData {
  csr: number;
  networkHospitals: number;
  complaintRatio: number;
  plans: HealthPlanData[];
  addOnCosts: HealthAddOnCost[];
  strengths: string[];
  claimSpeedDays: number;
}

const HEALTH_ADD_ONS: HealthAddOnCost[] = [
  { name: 'Critical Illness Rider', costPerLakh: 120 },
  { name: 'Hospital Cash', costPerLakh: 45 },
  { name: 'Maternity Plus', costPerLakh: 200 },
  { name: 'Personal Accident', costPerLakh: 80 },
  { name: 'Global Cover', costPerLakh: 150 },
  { name: 'OPD Cover', costPerLakh: 180 },
  { name: 'Room Rent Upgrade', costPerLakh: 35 },
  { name: 'Consumables Cover', costPerLakh: 50 },
];

const HEALTH_INSURER_DB: Record<string, HealthInsurerData> = {
  'HDFC ERGO': {
    csr: 97.8,
    networkHospitals: 13000,
    complaintRatio: 2.1,
    claimSpeedDays: 7,
    plans: [
      {
        name: 'HDFC ERGO Optima Secure',
        basePremiumPercent: 4.2,
        roomRentLimit: 'Single AC',
        addOnsIncluded: ['Room Rent Upgrade', 'Consumables Cover'],
        keyFeatures: ['13,000+ network hospitals', 'No room rent capping', 'Restoration 100%', 'Modern treatment covered'],
        claimProcessRating: 4.5,
        waitingPeriodPED: 48,
        restoration: true,
        noClaimBonus: '50% cumulative per year (max 100%)',
      },
      {
        name: 'HDFC ERGO my:health Suraksha',
        basePremiumPercent: 3.8,
        roomRentLimit: 'Single Standard',
        addOnsIncluded: [],
        keyFeatures: ['Affordable premium', 'Day care procedures covered', 'AYUSH treatment', 'No co-payment'],
        claimProcessRating: 4.3,
        waitingPeriodPED: 36,
        restoration: false,
        noClaimBonus: '25% cumulative per year (max 50%)',
      },
    ],
    addOnCosts: [...HEALTH_ADD_ONS],
    strengths: ['Widest hospital network', 'Quick claim settlement', 'No room rent capping', 'Strong brand trust'],
  },

  'ICICI Lombard': {
    csr: 96.5,
    networkHospitals: 9500,
    complaintRatio: 2.8,
    claimSpeedDays: 8,
    plans: [
      {
        name: 'ICICI Lombard Complete Health Insurance',
        basePremiumPercent: 4.0,
        roomRentLimit: 'Single AC',
        addOnsIncluded: ['Room Rent Upgrade'],
        keyFeatures: ['9,500+ network hospitals', 'No sub-limits on room rent', 'In-patient + day care', 'Wellness rewards'],
        claimProcessRating: 4.3,
        waitingPeriodPED: 36,
        restoration: true,
        noClaimBonus: '50% cumulative per year (max 100%)',
      },
      {
        name: 'ICICI Lombard Health AdvantEdge',
        basePremiumPercent: 3.5,
        roomRentLimit: 'Shared Standard',
        addOnsIncluded: [],
        keyFeatures: ['Value for money', 'Day care procedures', 'AYUSH covered', 'Ambulance charges'],
        claimProcessRating: 4.1,
        waitingPeriodPED: 48,
        restoration: false,
        noClaimBonus: '20% cumulative per year (max 50%)',
      },
    ],
    addOnCosts: [...HEALTH_ADD_ONS],
    strengths: ['Best digital experience', 'IL Take Care app', 'Wellness rewards program', 'Quick cashless'],
  },

  'Star Health': {
    csr: 94.8,
    networkHospitals: 14000,
    complaintRatio: 3.5,
    claimSpeedDays: 6,
    plans: [
      {
        name: 'Star Health Comprehensive',
        basePremiumPercent: 3.9,
        roomRentLimit: 'Single Standard',
        addOnsIncluded: ['Hospital Cash', 'Consumables Cover'],
        keyFeatures: ['14,000+ network hospitals (largest)', 'Specialist in health insurance', 'No TPA - in-house claims', 'Automatic restoration'],
        claimProcessRating: 4.4,
        waitingPeriodPED: 36,
        restoration: true,
        noClaimBonus: '50% cumulative per year (max 100%)',
      },
      {
        name: 'Star Family Health Optima',
        basePremiumPercent: 3.6,
        roomRentLimit: 'Shared Standard',
        addOnsIncluded: [],
        keyFeatures: ['Family floater specialist', 'Largest hospital network', 'Day care procedures', 'AYUSH covered'],
        claimProcessRating: 4.2,
        waitingPeriodPED: 48,
        restoration: false,
        noClaimBonus: '30% cumulative per year (max 60%)',
      },
    ],
    addOnCosts: [...HEALTH_ADD_ONS],
    strengths: ['Largest hospital network (14K+)', 'Health insurance specialist', 'In-house claim settlement', 'No TPA hassle'],
  },

  'Care Health': {
    csr: 95.5,
    networkHospitals: 8500,
    complaintRatio: 3.0,
    claimSpeedDays: 9,
    plans: [
      {
        name: 'Care Health Advantage',
        basePremiumPercent: 3.7,
        roomRentLimit: 'Single AC',
        addOnsIncluded: ['Room Rent Upgrade', 'Consumables Cover'],
        keyFeatures: ['No room rent limit', 'Automatic restoration', 'Modern treatments covered', 'Global coverage option'],
        claimProcessRating: 4.3,
        waitingPeriodPED: 36,
        restoration: true,
        noClaimBonus: '50% cumulative per year (max 100%)',
      },
      {
        name: 'Care Essential',
        basePremiumPercent: 3.3,
        roomRentLimit: 'Shared Standard',
        addOnsIncluded: [],
        keyFeatures: ['Affordable premiums', 'Day care coverage', 'No co-payment', 'Ambulance covered'],
        claimProcessRating: 4.0,
        waitingPeriodPED: 48,
        restoration: false,
        noClaimBonus: '25% cumulative per year (max 50%)',
      },
    ],
    addOnCosts: [...HEALTH_ADD_ONS],
    strengths: ['No room rent limit', 'Good value plans', 'Automatic restoration', 'Modern treatments covered'],
  },

  'Niva Bupa': {
    csr: 95.2,
    networkHospitals: 10000,
    complaintRatio: 3.2,
    claimSpeedDays: 8,
    plans: [
      {
        name: 'Niva Bupa ReAssure',
        basePremiumPercent: 4.0,
        roomRentLimit: 'Single AC',
        addOnsIncluded: ['Room Rent Upgrade', 'Hospital Cash'],
        keyFeatures: ['Unlimited restoration', 'No room rent capping', 'In-house claims team', 'Wellness benefits'],
        claimProcessRating: 4.2,
        waitingPeriodPED: 36,
        restoration: true,
        noClaimBonus: '50% cumulative per year (max 150%)',
      },
      {
        name: 'Niva Bupa Health Companion',
        basePremiumPercent: 3.5,
        roomRentLimit: 'Shared Standard',
        addOnsIncluded: [],
        keyFeatures: ['Affordable premium', 'Dedicated relationship manager', 'Day care covered', 'AYUSH treatment'],
        claimProcessRating: 4.0,
        waitingPeriodPED: 48,
        restoration: false,
        noClaimBonus: '25% cumulative per year (max 50%)',
      },
    ],
    addOnCosts: [...HEALTH_ADD_ONS],
    strengths: ['Unlimited restoration', 'In-house claims', 'Dedicated relationship manager', 'Wellness benefits'],
  },

  'Bajaj Allianz': {
    csr: 97.2,
    networkHospitals: 11000,
    complaintRatio: 2.4,
    claimSpeedDays: 7,
    plans: [
      {
        name: 'Bajaj Allianz Health Guard',
        basePremiumPercent: 4.1,
        roomRentLimit: 'Single AC',
        addOnsIncluded: ['Room Rent Upgrade', 'Consumables Cover', 'Hospital Cash'],
        keyFeatures: ['11,000+ hospitals', 'No room rent limit', 'Cumulative bonus up to 100%', 'Good add-on portfolio'],
        claimProcessRating: 4.4,
        waitingPeriodPED: 36,
        restoration: true,
        noClaimBonus: '50% cumulative per year (max 100%)',
      },
      {
        name: 'Bajaj Allianz Silver Health',
        basePremiumPercent: 3.4,
        roomRentLimit: 'Shared Standard',
        addOnsIncluded: [],
        keyFeatures: ['Budget-friendly', 'Day care procedures', 'Ambulance cover', 'AYUSH treatment'],
        claimProcessRating: 4.1,
        waitingPeriodPED: 48,
        restoration: false,
        noClaimBonus: '20% cumulative per year (max 40%)',
      },
    ],
    addOnCosts: [...HEALTH_ADD_ONS],
    strengths: ['Best add-on portfolio', 'Quick claim settlement', 'Strong brand trust', 'Cumulative bonus up to 100%'],
  },

  'TATA AIG': {
    csr: 96.8,
    networkHospitals: 9000,
    complaintRatio: 2.3,
    claimSpeedDays: 8,
    plans: [
      {
        name: 'TATA AIG Medicare Premier',
        basePremiumPercent: 3.9,
        roomRentLimit: 'Single AC',
        addOnsIncluded: ['Room Rent Upgrade', 'Consumables Cover'],
        keyFeatures: ['TATA brand trust', 'No room rent sub-limit', 'Modern treatments', 'In-patient + day care'],
        claimProcessRating: 4.3,
        waitingPeriodPED: 36,
        restoration: true,
        noClaimBonus: '50% cumulative per year (max 100%)',
      },
      {
        name: 'TATA AIG Medicare Classic',
        basePremiumPercent: 3.4,
        roomRentLimit: 'Shared Standard',
        addOnsIncluded: [],
        keyFeatures: ['Good value', 'Day care coverage', 'Ambulance charges', 'AYUSH treatment'],
        claimProcessRating: 4.0,
        waitingPeriodPED: 48,
        restoration: false,
        noClaimBonus: '25% cumulative per year (max 50%)',
      },
    ],
    addOnCosts: [...HEALTH_ADD_ONS],
    strengths: ['TATA brand trust', 'Good claim settlement', 'Wide hospital network', 'Modern treatments covered'],
  },

  'Acko': {
    csr: 98.1,
    networkHospitals: 6500,
    complaintRatio: 1.2,
    claimSpeedDays: 2,
    plans: [
      {
        name: 'Acko Platinum Health',
        basePremiumPercent: 3.5,
        roomRentLimit: 'No Limit',
        addOnsIncluded: ['Room Rent Upgrade', 'Consumables Cover', 'OPD Cover'],
        keyFeatures: ['No room rent limit at all', '100% digital claims', 'Fastest settlement', 'No co-payment ever'],
        claimProcessRating: 4.7,
        waitingPeriodPED: 36,
        restoration: true,
        noClaimBonus: '50% cumulative per year (max 100%)',
      },
      {
        name: 'Acko Standard Health',
        basePremiumPercent: 3.0,
        roomRentLimit: 'Single Standard',
        addOnsIncluded: [],
        keyFeatures: ['Lowest premiums', 'Digital-first', 'Quick cashless', 'No paperwork'],
        claimProcessRating: 4.4,
        waitingPeriodPED: 48,
        restoration: false,
        noClaimBonus: '25% cumulative per year (max 50%)',
      },
    ],
    addOnCosts: [...HEALTH_ADD_ONS],
    strengths: ['Fastest claim settlement', 'Lowest premiums', '100% digital process', 'No room rent limit'],
  },

  'Digit': {
    csr: 97.5,
    networkHospitals: 7500,
    complaintRatio: 1.5,
    claimSpeedDays: 4,
    plans: [
      {
        name: 'Digit Health Care Plus',
        basePremiumPercent: 3.6,
        roomRentLimit: 'Single AC',
        addOnsIncluded: ['Room Rent Upgrade', 'Consumables Cover'],
        keyFeatures: ['Smartphone claims', 'No room rent capping', 'Automatic restoration', 'Good digital experience'],
        claimProcessRating: 4.5,
        waitingPeriodPED: 36,
        restoration: true,
        noClaimBonus: '50% cumulative per year (max 100%)',
      },
      {
        name: 'Digit Health Value',
        basePremiumPercent: 3.2,
        roomRentLimit: 'Shared Standard',
        addOnsIncluded: [],
        keyFeatures: ['Affordable pricing', 'Day care covered', 'Smartphone self-inspection', 'Good value'],
        claimProcessRating: 4.2,
        waitingPeriodPED: 48,
        restoration: false,
        noClaimBonus: '25% cumulative per year (max 50%)',
      },
    ],
    addOnCosts: [...HEALTH_ADD_ONS],
    strengths: ['Smartphone claims', 'Affordable premiums', 'Automatic restoration', 'Good digital experience'],
  },

  'Aditya Birla': {
    csr: 96.0,
    networkHospitals: 9500,
    complaintRatio: 2.7,
    claimSpeedDays: 10,
    plans: [
      {
        name: 'Aditya Birla Activ Health Platinum',
        basePremiumPercent: 4.0,
        roomRentLimit: 'Single AC',
        addOnsIncluded: ['Room Rent Upgrade', 'Hospital Cash', 'Consumables Cover'],
        keyFeatures: ['Chronic management program', 'No room rent limit', 'Wellness rewards', 'Day 1 PED cover option'],
        claimProcessRating: 4.3,
        waitingPeriodPED: 36,
        restoration: true,
        noClaimBonus: '50% cumulative per year (max 100%)',
      },
      {
        name: 'Aditya Birla Activ Assure Diamond',
        basePremiumPercent: 3.4,
        roomRentLimit: 'Shared Standard',
        addOnsIncluded: [],
        keyFeatures: ['Affordable premium', 'Chronic management', 'Day care coverage', 'AYUSH covered'],
        claimProcessRating: 4.0,
        waitingPeriodPED: 48,
        restoration: false,
        noClaimBonus: '25% cumulative per year (max 50%)',
      },
    ],
    addOnCosts: [...HEALTH_ADD_ONS],
    strengths: ['Chronic management program', 'Wellness rewards', 'Day 1 PED cover option', 'Good brand trust'],
  },

  'New India Assurance': {
    csr: 94.2,
    networkHospitals: 8000,
    complaintRatio: 3.8,
    claimSpeedDays: 14,
    plans: [
      {
        name: 'New India Assurance Floater Mediclaim',
        basePremiumPercent: 3.5,
        roomRentLimit: 'Shared Standard',
        addOnsIncluded: [],
        keyFeatures: ['Government-backed', 'Widely trusted', 'Family floater option', 'Day care covered'],
        claimProcessRating: 3.6,
        waitingPeriodPED: 48,
        restoration: false,
        noClaimBonus: '20% cumulative per year (max 40%)',
      },
    ],
    addOnCosts: [...HEALTH_ADD_ONS],
    strengths: ['Government-backed insurer', 'Highest trust factor', 'Wide hospital network', 'Long-standing reputation'],
  },

  'Oriental': {
    csr: 93.0,
    networkHospitals: 7000,
    complaintRatio: 4.5,
    claimSpeedDays: 16,
    plans: [
      {
        name: 'Oriental Happy Family Floater',
        basePremiumPercent: 3.3,
        roomRentLimit: 'Shared Standard',
        addOnsIncluded: [],
        keyFeatures: ['Budget-friendly', 'Government insurer', 'Family floater', 'Basic coverage'],
        claimProcessRating: 3.3,
        waitingPeriodPED: 48,
        restoration: false,
        noClaimBonus: '15% cumulative per year (max 30%)',
      },
    ],
    addOnCosts: [...HEALTH_ADD_ONS],
    strengths: ['Budget-friendly', 'Government-backed', 'Simple process'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TERM INSURANCE DATABASE (2024-25 Market Data)
// ═══════════════════════════════════════════════════════════════════════════════

interface TermRiderData {
  name: string;
  additionalCostPercent: number; // Additional % of base premium
}

interface TermPlanData {
  name: string;
  premiumPerLakh: number; // Annual premium per lakh for 30-year-old male
  policyTerm: string;
  maxMaturityAge: number;
  addOnsIncluded: string[];
  keyFeatures: string[];
  claimProcessRating: number;
}

interface TermInsurerData {
  csr: number;
  claimTurnaroundDays: number;
  solvencyRatio: number;
  plans: TermPlanData[];
  riders: TermRiderData[];
  strengths: string[];
}

const TERM_RIDERS: TermRiderData[] = [
  { name: 'Critical Illness', additionalCostPercent: 25 },
  { name: 'Accidental Death', additionalCostPercent: 15 },
  { name: 'Waiver of Premium', additionalCostPercent: 10 },
  { name: 'Income Accelerator', additionalCostPercent: 20 },
  { name: 'Terminal Illness', additionalCostPercent: 8 },
  { name: 'Disability Income', additionalCostPercent: 18 },
];

const TERM_INSURER_DB: Record<string, TermInsurerData> = {
  'HDFC Life': {
    csr: 98.6,
    claimTurnaroundDays: 7,
    solvencyRatio: 1.98,
    plans: [
      {
        name: 'HDFC Life Click 2 Protect Super',
        premiumPerLakh: 735,
        policyTerm: '10-40 years',
        maxMaturityAge: 85,
        addOnsIncluded: ['Terminal Illness', 'Waiver of Premium'],
        keyFeatures: ['Online-only plan', 'Lowest premiums', 'Terminal illness cover included', 'Waiver of premium on CI'],
        claimProcessRating: 4.6,
      },
      {
        name: 'HDFC Life Click 2 Protect Life',
        premiumPerLakh: 820,
        policyTerm: '10-40 years',
        maxMaturityAge: 80,
        addOnsIncluded: ['Terminal Illness'],
        keyFeatures: ['Comprehensive coverage', 'Option for increasing cover', 'Balance cover option', 'Terminal illness cover'],
        claimProcessRating: 4.5,
      },
    ],
    riders: [...TERM_RIDERS],
    strengths: ['Highest CSR (98.6%)', 'Quick claim settlement', 'Strong brand trust', 'Best online plans'],
  },

  'ICICI Pru': {
    csr: 98.2,
    claimTurnaroundDays: 8,
    solvencyRatio: 2.05,
    plans: [
      {
        name: 'ICICI Pru iProtect Smart',
        premiumPerLakh: 750,
        policyTerm: '10-40 years',
        maxMaturityAge: 85,
        addOnsIncluded: ['Terminal Illness', 'Accidental Death'],
        keyFeatures: ['Online term plan', 'Terminal illness cover', 'Accidental death benefit', 'Flexible payout options'],
        claimProcessRating: 4.5,
      },
      {
        name: 'ICICI Pru iProtect Saral',
        premiumPerLakh: 690,
        policyTerm: '5-40 years',
        maxMaturityAge: 80,
        addOnsIncluded: [],
        keyFeatures: ['Simple application', 'No medical up to 1 cr', 'Affordable premiums', 'Quick issuance'],
        claimProcessRating: 4.3,
      },
    ],
    riders: [...TERM_RIDERS],
    strengths: ['High CSR (98.2%)', 'Strong digital platform', 'No medical up to 1 cr', 'Quick issuance'],
  },

  'SBI Life': {
    csr: 98.3,
    claimTurnaroundDays: 9,
    solvencyRatio: 2.20,
    plans: [
      {
        name: 'SBI Life eShield Next',
        premiumPerLakh: 770,
        policyTerm: '10-40 years',
        maxMaturityAge: 85,
        addOnsIncluded: ['Terminal Illness'],
        keyFeatures: ['SBI brand trust', 'Increasing cover option', 'Terminal illness cover', 'Flexible payout'],
        claimProcessRating: 4.4,
      },
      {
        name: 'SBI Life Smart Shield',
        premiumPerLakh: 710,
        policyTerm: '5-30 years',
        maxMaturityAge: 75,
        addOnsIncluded: [],
        keyFeatures: ['Affordable premium', 'SBI backing', 'Simple process', 'Good for salaried'],
        claimProcessRating: 4.2,
      },
    ],
    riders: [...TERM_RIDERS],
    strengths: ['SBI brand trust', 'Highest solvency ratio', 'Government backing', 'Wide branch network'],
  },

  'Max Life': {
    csr: 97.8,
    claimTurnaroundDays: 7,
    solvencyRatio: 1.85,
    plans: [
      {
        name: 'Max Life Smart Term Plan',
        premiumPerLakh: 760,
        policyTerm: '10-40 years',
        maxMaturityAge: 85,
        addOnsIncluded: ['Terminal Illness', 'Critical Illness'],
        keyFeatures: ['Multiple payout options', 'Critical illness cover included', 'Premium back option', 'Joint life cover'],
        claimProcessRating: 4.5,
      },
      {
        name: 'Max Life Online Term Plan Plus',
        premiumPerLakh: 700,
        policyTerm: '10-40 years',
        maxMaturityAge: 80,
        addOnsIncluded: [],
        keyFeatures: ['Lowest online premium', 'Quick issuance', 'No medical up to 50L', 'Simple process'],
        claimProcessRating: 4.3,
      },
    ],
    riders: [...TERM_RIDERS],
    strengths: ['Multiple payout options', 'Critical illness specialist', 'Quick claim settlement', 'Good rider portfolio'],
  },

  'Bajaj Allianz Life': {
    csr: 97.5,
    claimTurnaroundDays: 10,
    solvencyRatio: 1.90,
    plans: [
      {
        name: 'Bajaj Allianz Life Smart Protect Goal',
        premiumPerLakh: 740,
        policyTerm: '10-40 years',
        maxMaturityAge: 80,
        addOnsIncluded: ['Terminal Illness', 'Accidental Death'],
        keyFeatures: ['Return of premium option', 'Terminal illness cover', 'Accidental death benefit', 'Flexible cover options'],
        claimProcessRating: 4.3,
      },
      {
        name: 'Bajaj Allianz Life eTouch Online Term',
        premiumPerLakh: 680,
        policyTerm: '10-40 years',
        maxMaturityAge: 75,
        addOnsIncluded: [],
        keyFeatures: ['Online-only plan', 'Lowest premiums', 'Quick issuance', 'Simple process'],
        claimProcessRating: 4.1,
      },
    ],
    riders: [...TERM_RIDERS],
    strengths: ['Return of premium option', 'Good rider portfolio', 'Competitive pricing', 'Strong brand trust'],
  },

  'LIC': {
    csr: 98.5,
    claimTurnaroundDays: 12,
    solvencyRatio: 1.88,
    plans: [
      {
        name: 'LIC Tech Term',
        premiumPerLakh: 820,
        policyTerm: '10-40 years',
        maxMaturityAge: 80,
        addOnsIncluded: [],
        keyFeatures: ['LIC brand trust — highest in India', 'Government-backed', 'Online-only', 'Special rate for women'],
        claimProcessRating: 4.2,
      },
      {
        name: 'LIC Jeevan Amar',
        premiumPerLakh: 850,
        policyTerm: '10-40 years',
        maxMaturityAge: 80,
        addOnsIncluded: [],
        keyFeatures: ['Traditional offline plan', 'LIC agent support', 'Increasing cover option', 'Flexible premium paying terms'],
        claimProcessRating: 4.0,
      },
    ],
    riders: [...TERM_RIDERS],
    strengths: ['Highest brand trust in India', 'Government-backed', 'Agent network', 'Women get lower premiums'],
  },

  'Kotak Life': {
    csr: 97.2,
    claimTurnaroundDays: 8,
    solvencyRatio: 2.10,
    plans: [
      {
        name: 'Kotak e-Term Plan',
        premiumPerLakh: 720,
        policyTerm: '10-40 years',
        maxMaturityAge: 80,
        addOnsIncluded: ['Terminal Illness'],
        keyFeatures: ['Affordable premiums', 'Terminal illness cover', 'Online-only', 'Quick issuance'],
        claimProcessRating: 4.3,
      },
      {
        name: 'Kotak Term Plan',
        premiumPerLakh: 760,
        policyTerm: '10-40 years',
        maxMaturityAge: 75,
        addOnsIncluded: [],
        keyFeatures: ['Flexible payout options', 'Offline available', 'Good for HNI', 'Waiver of premium option'],
        claimProcessRating: 4.1,
      },
    ],
    riders: [...TERM_RIDERS],
    strengths: ['Affordable premiums', 'High solvency ratio', 'Quick claim settlement', 'Good for HNI'],
  },

  'Tata AIA': {
    csr: 97.8,
    claimTurnaroundDays: 7,
    solvencyRatio: 2.15,
    plans: [
      {
        name: 'Tata AIA Sampoorna Raksha Supreme',
        premiumPerLakh: 730,
        policyTerm: '10-40 years',
        maxMaturityAge: 85,
        addOnsIncluded: ['Terminal Illness', 'Critical Illness'],
        keyFeatures: ['TATA brand trust', 'Critical illness included', 'Terminal illness cover', 'Wellness program'],
        claimProcessRating: 4.5,
      },
      {
        name: 'Tata AIA iRaksha Term',
        premiumPerLakh: 690,
        policyTerm: '10-40 years',
        maxMaturityAge: 80,
        addOnsIncluded: [],
        keyFeatures: ['Online-only plan', 'Affordable premium', 'Quick issuance', 'Simple process'],
        claimProcessRating: 4.2,
      },
    ],
    riders: [...TERM_RIDERS],
    strengths: ['TATA brand trust', 'High solvency ratio', 'Wellness program', 'Quick claim settlement'],
  },

  'PNB MetLife': {
    csr: 96.5,
    claimTurnaroundDays: 11,
    solvencyRatio: 1.75,
    plans: [
      {
        name: 'PNB MetLife Mera Term Plan Plus',
        premiumPerLakh: 760,
        policyTerm: '10-40 years',
        maxMaturityAge: 80,
        addOnsIncluded: ['Terminal Illness'],
        keyFeatures: ['PNB backing', 'Terminal illness cover', 'Flexible payout', 'Good for government employees'],
        claimProcessRating: 4.1,
      },
      {
        name: 'PNB MetLife Super Saver Term',
        premiumPerLakh: 710,
        policyTerm: '10-30 years',
        maxMaturityAge: 75,
        addOnsIncluded: [],
        keyFeatures: ['Affordable premiums', 'Simple process', 'Good for young buyers', 'Quick issuance'],
        claimProcessRating: 3.9,
      },
    ],
    riders: [...TERM_RIDERS],
    strengths: ['PNB backing', 'Good for government employees', 'Competitive pricing', 'Flexible options'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRAVEL INSURANCE DATABASE (2024-25 Market Data)
// ═══════════════════════════════════════════════════════════════════════════════

interface TravelAddOnCost {
  name: string;
  costPerLakh: number;
}

interface TravelPlanData {
  name: string;
  basePremiumPerLakh: number; // Base premium per lakh of sum insured
  coverageType: 'domestic' | 'international' | 'both';
  addOnsIncluded: string[];
  keyFeatures: string[];
  claimProcessRating: number;
  medicalCoverMultiplier: number; // Multiplier for medical coverage
  tripCancellationCover: boolean;
  baggageLossCover: boolean;
}

interface TravelInsurerData {
  csr: number;
  networkHospitals: number;
  complaintRatio: number;
  claimSpeedHrs: number;
  plans: TravelPlanData[];
  addOnCosts: TravelAddOnCost[];
  strengths: string[];
}

const TRAVEL_ADD_ONS: TravelAddOnCost[] = [
  { name: 'Adventure Sports Cover', costPerLakh: 180 },
  { name: 'Trip Cancellation', costPerLakh: 120 },
  { name: 'Baggage Loss', costPerLakh: 90 },
  { name: 'Flight Delay', costPerLakh: 45 },
  { name: 'Emergency Evacuation', costPerLakh: 150 },
  { name: 'Passport Loss', costPerLakh: 75 },
];

const TRAVEL_INSURER_DB: Record<string, TravelInsurerData> = {
  'HDFC ERGO': {
    csr: 97.8,
    networkHospitals: 13000,
    complaintRatio: 2.1,
    claimSpeedHrs: 48,
    plans: [
      {
        name: 'HDFC ERGO Travel Basic',
        basePremiumPerLakh: 350,
        coverageType: 'both',
        addOnsIncluded: [],
        keyFeatures: ['13,000+ network hospitals', '24/7 global assistance', 'Cashless medical abroad'],
        claimProcessRating: 4.3,
        medicalCoverMultiplier: 1.0,
        tripCancellationCover: false,
        baggageLossCover: false,
      },
      {
        name: 'HDFC ERGO Travel Comprehensive',
        basePremiumPerLakh: 450,
        coverageType: 'both',
        addOnsIncluded: ['Trip Cancellation', 'Baggage Loss'],
        keyFeatures: ['Trip cancellation included', 'Baggage loss cover', 'Cashless hospitalization worldwide', '24/7 helpline'],
        claimProcessRating: 4.5,
        medicalCoverMultiplier: 1.2,
        tripCancellationCover: true,
        baggageLossCover: true,
      },
      {
        name: 'HDFC ERGO Travel Premium',
        basePremiumPerLakh: 550,
        coverageType: 'international',
        addOnsIncluded: ['Adventure Sports Cover', 'Trip Cancellation', 'Baggage Loss', 'Emergency Evacuation'],
        keyFeatures: ['Full adventure sports cover', 'Emergency evacuation', 'Trip cancellation + baggage loss', 'Priority claim settlement'],
        claimProcessRating: 4.7,
        medicalCoverMultiplier: 1.5,
        tripCancellationCover: true,
        baggageLossCover: true,
      },
    ],
    addOnCosts: [...TRAVEL_ADD_ONS],
    strengths: ['Widest hospital network', '24/7 global assistance', 'Fast claim settlement', 'Trusted brand'],
  },

  'ICICI Lombard': {
    csr: 96.5,
    networkHospitals: 9500,
    complaintRatio: 2.8,
    claimSpeedHrs: 56,
    plans: [
      {
        name: 'ICICI Lombard Travel Basic',
        basePremiumPerLakh: 320,
        coverageType: 'both',
        addOnsIncluded: [],
        keyFeatures: ['Strong digital platform', '9,500+ hospitals', 'Quick claim processing'],
        claimProcessRating: 4.1,
        medicalCoverMultiplier: 1.0,
        tripCancellationCover: false,
        baggageLossCover: false,
      },
      {
        name: 'ICICI Lombard Travel Comprehensive',
        basePremiumPerLakh: 420,
        coverageType: 'both',
        addOnsIncluded: ['Trip Cancellation', 'Flight Delay'],
        keyFeatures: ['Trip cancellation + flight delay', 'Good digital claims', 'Instant policy issuance'],
        claimProcessRating: 4.4,
        medicalCoverMultiplier: 1.2,
        tripCancellationCover: true,
        baggageLossCover: false,
      },
    ],
    addOnCosts: [...TRAVEL_ADD_ONS],
    strengths: ['Best digital experience', 'Instant policy issuance', 'Good international coverage', 'IL Take Care app'],
  },

  'Bajaj Allianz': {
    csr: 97.2,
    networkHospitals: 11000,
    complaintRatio: 2.4,
    claimSpeedHrs: 44,
    plans: [
      {
        name: 'Bajaj Allianz Travel Basic',
        basePremiumPerLakh: 330,
        coverageType: 'both',
        addOnsIncluded: [],
        keyFeatures: ['Competitive pricing', '11,000+ hospitals', 'Quick claims processing'],
        claimProcessRating: 4.2,
        medicalCoverMultiplier: 1.0,
        tripCancellationCover: false,
        baggageLossCover: false,
      },
      {
        name: 'Bajaj Allianz Travel Comprehensive',
        basePremiumPerLakh: 430,
        coverageType: 'both',
        addOnsIncluded: ['Trip Cancellation', 'Baggage Loss', 'Passport Loss'],
        keyFeatures: ['Trip cancellation + baggage + passport loss', 'Good add-on suite', 'Worldwide cashless'],
        claimProcessRating: 4.5,
        medicalCoverMultiplier: 1.3,
        tripCancellationCover: true,
        baggageLossCover: true,
      },
      {
        name: 'Bajaj Allianz Travel Premium',
        basePremiumPerLakh: 530,
        coverageType: 'international',
        addOnsIncluded: ['Adventure Sports Cover', 'Trip Cancellation', 'Baggage Loss', 'Emergency Evacuation', 'Passport Loss'],
        keyFeatures: ['Full adventure sports cover', 'Emergency evacuation', 'Passport loss protection', 'Maximum add-on coverage'],
        claimProcessRating: 4.7,
        medicalCoverMultiplier: 1.5,
        tripCancellationCover: true,
        baggageLossCover: true,
      },
    ],
    addOnCosts: [...TRAVEL_ADD_ONS],
    strengths: ['Best add-on portfolio', 'Competitive pricing', 'Fast claim settlement', 'Strong brand trust'],
  },

  'TATA AIG': {
    csr: 96.8,
    networkHospitals: 10000,
    complaintRatio: 2.3,
    claimSpeedHrs: 52,
    plans: [
      {
        name: 'TATA AIG Travel Basic',
        basePremiumPerLakh: 340,
        coverageType: 'both',
        addOnsIncluded: [],
        keyFeatures: ['TATA brand trust', '10,000+ hospitals', 'Comprehensive travel coverage'],
        claimProcessRating: 4.1,
        medicalCoverMultiplier: 1.0,
        tripCancellationCover: false,
        baggageLossCover: false,
      },
      {
        name: 'TATA AIG Travel Comprehensive',
        basePremiumPerLakh: 440,
        coverageType: 'both',
        addOnsIncluded: ['Trip Cancellation', 'Baggage Loss'],
        keyFeatures: ['Trip cancellation + baggage loss', 'TATA brand reliability', 'Good international coverage'],
        claimProcessRating: 4.4,
        medicalCoverMultiplier: 1.2,
        tripCancellationCover: true,
        baggageLossCover: true,
      },
    ],
    addOnCosts: [...TRAVEL_ADD_ONS],
    strengths: ['TATA brand trust', 'Strong international coverage', 'Good claim support', 'Wide hospital network'],
  },

  'Acko': {
    csr: 98.1,
    networkHospitals: 5000,
    complaintRatio: 1.2,
    claimSpeedHrs: 24,
    plans: [
      {
        name: 'Acko Travel Basic',
        basePremiumPerLakh: 280,
        coverageType: 'domestic',
        addOnsIncluded: [],
        keyFeatures: ['Lowest premiums', 'Digital-first process', 'Quick claims'],
        claimProcessRating: 4.4,
        medicalCoverMultiplier: 1.0,
        tripCancellationCover: false,
        baggageLossCover: false,
      },
      {
        name: 'Acko Travel Comprehensive',
        basePremiumPerLakh: 380,
        coverageType: 'both',
        addOnsIncluded: ['Trip Cancellation', 'Flight Delay'],
        keyFeatures: ['Digital claims in 2 hrs', 'Trip cancellation + flight delay', 'No paperwork'],
        claimProcessRating: 4.6,
        medicalCoverMultiplier: 1.2,
        tripCancellationCover: true,
        baggageLossCover: false,
      },
    ],
    addOnCosts: [...TRAVEL_ADD_ONS],
    strengths: ['Lowest premiums in market', 'Fastest claim settlement', '100% digital process', 'No paperwork'],
  },

  'Digit': {
    csr: 97.5,
    networkHospitals: 7500,
    complaintRatio: 1.5,
    claimSpeedHrs: 36,
    plans: [
      {
        name: 'Digit Travel Basic',
        basePremiumPerLakh: 300,
        coverageType: 'both',
        addOnsIncluded: [],
        keyFeatures: ['Affordable premiums', 'Smart customization', 'Good digital experience'],
        claimProcessRating: 4.2,
        medicalCoverMultiplier: 1.0,
        tripCancellationCover: false,
        baggageLossCover: false,
      },
      {
        name: 'Digit Travel Comprehensive',
        basePremiumPerLakh: 400,
        coverageType: 'both',
        addOnsIncluded: ['Trip Cancellation', 'Baggage Loss'],
        keyFeatures: ['Smartphone claims', 'Trip cancellation + baggage', 'Customizable coverage'],
        claimProcessRating: 4.5,
        medicalCoverMultiplier: 1.2,
        tripCancellationCover: true,
        baggageLossCover: true,
      },
    ],
    addOnCosts: [...TRAVEL_ADD_ONS],
    strengths: ['Smart customization', 'Affordable premiums', 'Smartphone claims', 'Good digital experience'],
  },

  'Star Health': {
    csr: 94.8,
    networkHospitals: 14000,
    complaintRatio: 3.5,
    claimSpeedHrs: 60,
    plans: [
      {
        name: 'Star Health Travel Basic',
        basePremiumPerLakh: 360,
        coverageType: 'both',
        addOnsIncluded: [],
        keyFeatures: ['14,000+ network hospitals (largest)', 'Health specialist brand', 'In-house claims'],
        claimProcessRating: 4.0,
        medicalCoverMultiplier: 1.1,
        tripCancellationCover: false,
        baggageLossCover: false,
      },
      {
        name: 'Star Health Travel Comprehensive',
        basePremiumPerLakh: 460,
        coverageType: 'both',
        addOnsIncluded: ['Trip Cancellation', 'Emergency Evacuation'],
        keyFeatures: ['Largest hospital network', 'Emergency evacuation included', 'No TPA - in-house claims'],
        claimProcessRating: 4.3,
        medicalCoverMultiplier: 1.3,
        tripCancellationCover: true,
        baggageLossCover: false,
      },
    ],
    addOnCosts: [...TRAVEL_ADD_ONS],
    strengths: ['Largest hospital network (14K+)', 'Health insurance specialist', 'In-house claim settlement', 'No TPA hassle'],
  },

  'Care Health': {
    csr: 95.5,
    networkHospitals: 8500,
    complaintRatio: 3.0,
    claimSpeedHrs: 64,
    plans: [
      {
        name: 'Care Health Travel Basic',
        basePremiumPerLakh: 340,
        coverageType: 'both',
        addOnsIncluded: [],
        keyFeatures: ['Good value plans', '8,500+ hospitals', 'Health focus'],
        claimProcessRating: 4.0,
        medicalCoverMultiplier: 1.0,
        tripCancellationCover: false,
        baggageLossCover: false,
      },
      {
        name: 'Care Health Travel Comprehensive',
        basePremiumPerLakh: 440,
        coverageType: 'both',
        addOnsIncluded: ['Trip Cancellation', 'Baggage Loss'],
        keyFeatures: ['Trip cancellation + baggage', 'Value pricing', 'Good medical coverage'],
        claimProcessRating: 4.2,
        medicalCoverMultiplier: 1.2,
        tripCancellationCover: true,
        baggageLossCover: true,
      },
    ],
    addOnCosts: [...TRAVEL_ADD_ONS],
    strengths: ['Good value plans', 'Health combo benefits', 'Competitive pricing'],
  },

  'Niva Bupa': {
    csr: 95.2,
    networkHospitals: 6000,
    complaintRatio: 3.2,
    claimSpeedHrs: 68,
    plans: [
      {
        name: 'Niva Bupa Travel Basic',
        basePremiumPerLakh: 330,
        coverageType: 'both',
        addOnsIncluded: [],
        keyFeatures: ['6,000+ hospitals', 'Good customer service', 'Competitive pricing'],
        claimProcessRating: 3.9,
        medicalCoverMultiplier: 1.0,
        tripCancellationCover: false,
        baggageLossCover: false,
      },
      {
        name: 'Niva Bupa Travel Comprehensive',
        basePremiumPerLakh: 430,
        coverageType: 'both',
        addOnsIncluded: ['Trip Cancellation', 'Flight Delay'],
        keyFeatures: ['Trip cancellation + flight delay', 'Dedicated relationship manager', 'Health combo discounts'],
        claimProcessRating: 4.1,
        medicalCoverMultiplier: 1.2,
        tripCancellationCover: true,
        baggageLossCover: false,
      },
    ],
    addOnCosts: [...TRAVEL_ADD_ONS],
    strengths: ['Health + Travel combo plans', 'Good customer service', 'Dedicated relationship manager'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOME INSURANCE DATABASE (2024-25 Market Data)
// ═══════════════════════════════════════════════════════════════════════════════

interface HomeAddOnCost {
  name: string;
  costPerLakh: number;
}

interface HomePlanData {
  name: string;
  basePremiumPercent: number; // Base premium as % of property value
  planType: 'structure_only' | 'structure_content' | 'comprehensive';
  addOnsIncluded: string[];
  keyFeatures: string[];
  claimProcessRating: number;
  fireCover: boolean;
  floodCover: boolean;
  earthquakeCover: boolean;
  theftCover: boolean;
}

interface HomeInsurerData {
  csr: number;
  complaintRatio: number;
  claimSpeedDays: number;
  plans: HomePlanData[];
  addOnCosts: HomeAddOnCost[];
  strengths: string[];
}

const HOME_ADD_ONS: HomeAddOnCost[] = [
  { name: 'Terrorism Cover', costPerLakh: 60 },
  { name: 'Valuable Articles', costPerLakh: 150 },
  { name: 'Tenant Liability', costPerLakh: 40 },
  { name: 'Temporary Accommodation', costPerLakh: 80 },
  { name: 'Pet Insurance', costPerLakh: 100 },
];

const HOME_INSURER_DB: Record<string, HomeInsurerData> = {
  'HDFC ERGO': {
    csr: 97.8,
    complaintRatio: 2.1,
    claimSpeedDays: 10,
    plans: [
      {
        name: 'HDFC ERGO Home Structure',
        basePremiumPercent: 0.15,
        planType: 'structure_only',
        addOnsIncluded: [],
        keyFeatures: ['Structure-only coverage', 'Fire & flood cover', 'Quick claim settlement'],
        claimProcessRating: 4.2,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: false,
      },
      {
        name: 'HDFC ERGO Home Plus',
        basePremiumPercent: 0.25,
        planType: 'structure_content',
        addOnsIncluded: ['Temporary Accommodation'],
        keyFeatures: ['Structure + content cover', 'Temporary accommodation included', 'Theft protection'],
        claimProcessRating: 4.4,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: true,
      },
      {
        name: 'HDFC ERGO Home Comprehensive',
        basePremiumPercent: 0.35,
        planType: 'comprehensive',
        addOnsIncluded: ['Terrorism Cover', 'Valuable Articles', 'Temporary Accommodation'],
        keyFeatures: ['All-risk comprehensive cover', 'Earthquake + terrorism included', 'Valuable articles protection', 'Temporary accommodation'],
        claimProcessRating: 4.6,
        fireCover: true,
        floodCover: true,
        earthquakeCover: true,
        theftCover: true,
      },
    ],
    addOnCosts: [...HOME_ADD_ONS],
    strengths: ['Widest coverage options', 'Quick claim settlement', 'Strong brand trust', 'Comprehensive plans'],
  },

  'ICICI Lombard': {
    csr: 96.5,
    complaintRatio: 2.8,
    claimSpeedDays: 12,
    plans: [
      {
        name: 'ICICI Lombard Home Structure',
        basePremiumPercent: 0.14,
        planType: 'structure_only',
        addOnsIncluded: [],
        keyFeatures: ['Structure-only coverage', 'Good digital platform', 'Fire cover included'],
        claimProcessRating: 4.0,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: false,
      },
      {
        name: 'ICICI Lombard Home Complete',
        basePremiumPercent: 0.24,
        planType: 'structure_content',
        addOnsIncluded: ['Tenant Liability'],
        keyFeatures: ['Structure + content', 'Tenant liability included', 'Good digital claims'],
        claimProcessRating: 4.3,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: true,
      },
      {
        name: 'ICICI Lombard Home Comprehensive',
        basePremiumPercent: 0.33,
        planType: 'comprehensive',
        addOnsIncluded: ['Terrorism Cover', 'Valuable Articles', 'Temporary Accommodation'],
        keyFeatures: ['All-risk cover', 'Earthquake + terrorism', 'Valuable articles', 'Priority claim processing'],
        claimProcessRating: 4.5,
        fireCover: true,
        floodCover: true,
        earthquakeCover: true,
        theftCover: true,
      },
    ],
    addOnCosts: [...HOME_ADD_ONS],
    strengths: ['Best digital experience', 'Instant policy issuance', 'Strong coverage options', 'Good claim support'],
  },

  'Bajaj Allianz': {
    csr: 97.2,
    complaintRatio: 2.4,
    claimSpeedDays: 9,
    plans: [
      {
        name: 'Bajaj Allianz Home Structure',
        basePremiumPercent: 0.13,
        planType: 'structure_only',
        addOnsIncluded: [],
        keyFeatures: ['Competitive pricing', 'Fire & flood cover', 'Fast claims'],
        claimProcessRating: 4.1,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: false,
      },
      {
        name: 'Bajaj Allianz Home Guard',
        basePremiumPercent: 0.22,
        planType: 'structure_content',
        addOnsIncluded: ['Temporary Accommodation', 'Pet Insurance'],
        keyFeatures: ['Structure + content', 'Pet insurance included', 'Temporary accommodation'],
        claimProcessRating: 4.4,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: true,
      },
      {
        name: 'Bajaj Allianz Home Comprehensive',
        basePremiumPercent: 0.32,
        planType: 'comprehensive',
        addOnsIncluded: ['Terrorism Cover', 'Valuable Articles', 'Temporary Accommodation', 'Pet Insurance'],
        keyFeatures: ['Maximum add-on coverage', 'Earthquake + terrorism', 'Pet insurance', 'All-risk cover'],
        claimProcessRating: 4.7,
        fireCover: true,
        floodCover: true,
        earthquakeCover: true,
        theftCover: true,
      },
    ],
    addOnCosts: [...HOME_ADD_ONS],
    strengths: ['Best add-on portfolio', 'Competitive pricing', 'Pet insurance available', 'Fast claim settlement'],
  },

  'TATA AIG': {
    csr: 96.8,
    complaintRatio: 2.3,
    claimSpeedDays: 11,
    plans: [
      {
        name: 'TATA AIG Home Structure',
        basePremiumPercent: 0.14,
        planType: 'structure_only',
        addOnsIncluded: [],
        keyFeatures: ['TATA brand trust', 'Fire & flood cover', 'Reliable claims'],
        claimProcessRating: 4.0,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: false,
      },
      {
        name: 'TATA AIG Home Complete',
        basePremiumPercent: 0.23,
        planType: 'structure_content',
        addOnsIncluded: ['Valuable Articles'],
        keyFeatures: ['Structure + content', 'Valuable articles included', 'TATA brand reliability'],
        claimProcessRating: 4.3,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: true,
      },
      {
        name: 'TATA AIG Home Comprehensive',
        basePremiumPercent: 0.34,
        planType: 'comprehensive',
        addOnsIncluded: ['Terrorism Cover', 'Valuable Articles', 'Temporary Accommodation'],
        keyFeatures: ['All-risk comprehensive', 'Earthquake + terrorism', 'TATA brand trust', 'Full coverage'],
        claimProcessRating: 4.5,
        fireCover: true,
        floodCover: true,
        earthquakeCover: true,
        theftCover: true,
      },
    ],
    addOnCosts: [...HOME_ADD_ONS],
    strengths: ['TATA brand trust', 'Strong claim support', 'Good earthquake cover', 'Reliable processing'],
  },

  'New India Assurance': {
    csr: 94.2,
    complaintRatio: 3.8,
    claimSpeedDays: 18,
    plans: [
      {
        name: 'New India Home Structure',
        basePremiumPercent: 0.12,
        planType: 'structure_only',
        addOnsIncluded: [],
        keyFeatures: ['Government-backed', 'Budget-friendly', 'Fire cover included'],
        claimProcessRating: 3.5,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: false,
      },
      {
        name: 'New India Home Complete',
        basePremiumPercent: 0.20,
        planType: 'structure_content',
        addOnsIncluded: [],
        keyFeatures: ['Government-backed', 'Structure + content', 'Affordable premiums'],
        claimProcessRating: 3.7,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: true,
      },
    ],
    addOnCosts: [...HOME_ADD_ONS],
    strengths: ['Government-backed insurer', 'Highest trust factor', 'Budget-friendly', 'Long-standing reputation'],
  },

  'United India': {
    csr: 93.5,
    complaintRatio: 4.2,
    claimSpeedDays: 20,
    plans: [
      {
        name: 'United India Home Structure',
        basePremiumPercent: 0.12,
        planType: 'structure_only',
        addOnsIncluded: [],
        keyFeatures: ['Public sector insurer', 'Budget-friendly', 'Basic fire cover'],
        claimProcessRating: 3.3,
        fireCover: true,
        floodCover: false,
        earthquakeCover: false,
        theftCover: false,
      },
      {
        name: 'United India Home Complete',
        basePremiumPercent: 0.19,
        planType: 'structure_content',
        addOnsIncluded: [],
        keyFeatures: ['Public sector trust', 'Structure + content', 'Affordable'],
        claimProcessRating: 3.5,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: true,
      },
    ],
    addOnCosts: [...HOME_ADD_ONS],
    strengths: ['Public sector insurer', 'Affordable premiums', 'Simple process'],
  },

  'Oriental': {
    csr: 93.0,
    complaintRatio: 4.5,
    claimSpeedDays: 22,
    plans: [
      {
        name: 'Oriental Home Structure',
        basePremiumPercent: 0.13,
        planType: 'structure_only',
        addOnsIncluded: [],
        keyFeatures: ['Public sector insurer', 'Budget-friendly', 'Fire cover'],
        claimProcessRating: 3.2,
        fireCover: true,
        floodCover: false,
        earthquakeCover: false,
        theftCover: false,
      },
    ],
    addOnCosts: [...HOME_ADD_ONS],
    strengths: ['Budget-friendly', 'Government-backed', 'Simple process'],
  },

  'Digit': {
    csr: 97.5,
    complaintRatio: 1.5,
    claimSpeedDays: 7,
    plans: [
      {
        name: 'Digit Home Structure',
        basePremiumPercent: 0.12,
        planType: 'structure_only',
        addOnsIncluded: [],
        keyFeatures: ['Affordable premiums', 'Smart customization', 'Quick claims'],
        claimProcessRating: 4.2,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: false,
      },
      {
        name: 'Digit Home Complete',
        basePremiumPercent: 0.21,
        planType: 'structure_content',
        addOnsIncluded: ['Temporary Accommodation'],
        keyFeatures: ['Structure + content', 'Temporary accommodation', 'Smartphone claims', 'Affordable pricing'],
        claimProcessRating: 4.4,
        fireCover: true,
        floodCover: true,
        earthquakeCover: false,
        theftCover: true,
      },
      {
        name: 'Digit Home Comprehensive',
        basePremiumPercent: 0.30,
        planType: 'comprehensive',
        addOnsIncluded: ['Terrorism Cover', 'Valuable Articles', 'Temporary Accommodation'],
        keyFeatures: ['All-risk cover', 'Earthquake + terrorism', 'Smartphone claims', 'Fastest settlement'],
        claimProcessRating: 4.6,
        fireCover: true,
        floodCover: true,
        earthquakeCover: true,
        theftCover: true,
      },
    ],
    addOnCosts: [...HOME_ADD_ONS],
    strengths: ['Smart customization', 'Affordable premiums', 'Fastest claim settlement', 'Good digital experience'],
  },
};

// Destination risk multiplier for travel insurance
const DESTINATION_RISK: Record<string, number> = {
  'domestic': 0.7,
  'southeast_asia': 0.85,
  'europe': 1.1,
  'usa': 1.3,
  'canada': 1.2,
  'australia': 1.15,
  'middle_east': 1.0,
  'africa': 1.25,
  'south_america': 1.2,
};

// City risk zones for home insurance (seismic/flood)
const CITY_RISK_ZONES: Record<string, { seismic: 'low' | 'moderate' | 'high' | 'very_high'; flood: 'low' | 'moderate' | 'high' }> = {
  'delhi': { seismic: 'moderate', flood: 'moderate' },
  'mumbai': { seismic: 'low', flood: 'high' },
  'chennai': { seismic: 'low', flood: 'high' },
  'kolkata': { seismic: 'moderate', flood: 'high' },
  'bangalore': { seismic: 'low', flood: 'moderate' },
  'hyderabad': { seismic: 'low', flood: 'low' },
  'pune': { seismic: 'low', flood: 'low' },
  'ahmedabad': { seismic: 'moderate', flood: 'low' },
  'jaipur': { seismic: 'low', flood: 'low' },
  'lucknow': { seismic: 'moderate', flood: 'moderate' },
  'patna': { seismic: 'high', flood: 'high' },
  'guwahati': { seismic: 'very_high', flood: 'high' },
  'dehradun': { seismic: 'high', flood: 'moderate' },
  'shimla': { seismic: 'high', flood: 'low' },
  'srinagar': { seismic: 'very_high', flood: 'moderate' },
  'bhubaneswar': { seismic: 'moderate', flood: 'high' },
  'kochi': { seismic: 'low', flood: 'high' },
  'trivandrum': { seismic: 'low', flood: 'moderate' },
  'chandigarh': { seismic: 'moderate', flood: 'low' },
  'bhopal': { seismic: 'moderate', flood: 'moderate' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UPDATED VALIDATION SCHEMA (Supports all policy types)
// ═══════════════════════════════════════════════════════════════════════════════

const auditSchema = z.object({
  policyType: z.enum(['car', 'bike', 'ev_car', 'ev_bike', 'health', 'term', 'travel', 'home']),
  insurer: z.string().min(1),
  vehicle: z.string().optional(), // optional for health/term/travel/home
  idv: z.number().positive().optional(), // optional for health/term/travel/home (use sumInsured)
  premium: z.number().positive(),
  addOns: z.array(z.string()),
  ncb: z.number().min(0).max(50).optional(), // only for motor/EV
  claimsLast3Years: z.number().min(0).max(5),
  vehicleAge: z.string().optional(), // only for motor/EV
  name: z.string().min(2, 'Name is required'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit mobile number required'),
  email: z.string().email().optional().or(z.literal('')),
  // NEW fields for health/term
  sumInsured: z.number().positive().optional(), // for health insurance
  age: z.number().min(18).max(75).optional(), // for health/term
  familyMembers: z.number().min(1).max(6).optional(), // for health floater
  coverageType: z.string().optional(), // Individual/Floater for health, Comprehensive/TP for motor
  registrationNumber: z.string().optional(), // from OCR
  policyNumber: z.string().optional(), // from OCR
  // NEW fields for travel
  destination: z.string().optional(), // for travel insurance (domestic/international)
  tripDuration: z.string().optional(), // for travel insurance (e.g., "7 days", "30 days")
  // NEW fields for home
  constructionType: z.string().optional(), // for home insurance (e.g., "Kutcha", "Pucca")
  city: z.string().optional(), // for home insurance (seismic/flood zone assessment)
});

type AuditInput = z.infer<typeof auditSchema>;

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function formatCurrency(num: number): string {
  return `₹${num.toLocaleString('en-IN')}`;
}

function getScoreLabel(score: number): string {
  if (score <= 40) return 'Poor';
  if (score <= 60) return 'Fair';
  if (score <= 80) return 'Good';
  return 'Excellent';
}

/** Check if policy type is motor (car/bike) */
function isMotorType(pt: string): pt is 'car' | 'bike' {
  return pt === 'car' || pt === 'bike';
}

/** Check if policy type is EV */
function isEVType(pt: string): pt is 'ev_car' | 'ev_bike' {
  return pt === 'ev_car' || pt === 'ev_bike';
}

/** Check if policy type is any motor/EV */
function isMotorOrEV(pt: string): boolean {
  return isMotorType(pt) || isEVType(pt);
}

/** Get the base motor type from EV type */
function getMotorType(pt: string): 'car' | 'bike' {
  return (pt === 'ev_bike' || pt === 'bike') ? 'bike' : 'car';
}

/** Estimate engine CC bracket from IDV for premium calculation */
function estimateCCBracket(policyType: 'car' | 'bike', idv: number): string {
  if (policyType === 'bike') {
    if (idv < 40000) return 'below_75cc';
    if (idv < 80000) return '75_150cc';
    if (idv < 200000) return '150_350cc';
    return 'above_350cc';
  }
  // Car
  if (idv < 350000) return 'below_1000cc';
  if (idv < 700000) return '1000_1500cc';
  return 'above_1500cc';
}

/** Calculate third-party premium from IRDAI fixed rates (motor/EV) */
function calculateTPPremium(policyType: 'car' | 'bike', idv: number, isEV: boolean = false): number {
  const bracket = estimateCCBracket(policyType, idv);
  if (isEV) {
    const rates = policyType === 'car' ? TP_RATES_EV_CAR : TP_RATES_EV_BIKE;
    return rates[bracket] ?? (policyType === 'car' ? 2903 : 607);
  }
  const rates = policyType === 'car' ? TP_RATES_CAR : TP_RATES_BIKE;
  return rates[bracket] ?? (policyType === 'car' ? 3416 : 714);
}

/** Calculate a specific insurer's plan premium (motor/EV) */
function calculatePlanPremium(
  insurerKey: string,
  plan: PlanData,
  policyType: 'car' | 'bike',
  idv: number,
  vehicleAge: string,
  ncb: number,
  isEV: boolean = false,
): number {
  const motorType = policyType;
  const tpPremium = calculateTPPremium(motorType, idv, isEV);

  const ageFactor = AGE_RATE_FACTOR[vehicleAge] ?? 1.0;
  const odPremium = Math.round(idv * (plan.odRatePercent / 100) * ageFactor);

  const ncbDiscount = Math.round(odPremium * (ncb / 100));

  const insurerData = isEV
    ? (EV_INSURER_DB[insurerKey] || EV_INSURER_DB['Other'])
    : (INSURER_DB[insurerKey] || INSURER_DB['Other']);
  let addOnTotal = 0;
  for (const addOnName of plan.addOnsIncluded) {
    const addOnCost = insurerData.addOnCosts.find((a) => a.name === addOnName);
    if (addOnCost) {
      addOnTotal += motorType === 'car' ? addOnCost.carCost : addOnCost.bikeCost;
    }
  }

  const total = tpPremium + (odPremium - ncbDiscount) + addOnTotal;
  return Math.max(Math.round(total), motorType === 'car' ? 3000 : 1500);
}

/** Calculate health plan premium */
function calculateHealthPlanPremium(
  plan: HealthPlanData,
  sumInsured: number,
  age: number,
  familyMembers: number,
): number {
  let basePremium = Math.round(sumInsured * (plan.basePremiumPercent / 100));

  // Age loading
  if (age > 55) basePremium = Math.round(basePremium * 1.5);
  else if (age > 45) basePremium = Math.round(basePremium * 1.3);
  else if (age > 35) basePremium = Math.round(basePremium * 1.1);

  // Floater loading (family members)
  if (familyMembers > 1) {
    basePremium = Math.round(basePremium * (1 + (familyMembers - 1) * 0.35));
  }

  // Add-on costs
  let addOnCost = 0;
  for (const addOnName of plan.addOnsIncluded) {
    const addOn = HEALTH_ADD_ONS.find((a) => a.name === addOnName);
    if (addOn) {
      addOnCost += Math.round((sumInsured / 100000) * addOn.costPerLakh);
    }
  }

  return Math.max(Math.round(basePremium + addOnCost), 3000);
}

/** Calculate term plan premium */
function calculateTermPlanPremium(
  plan: TermPlanData,
  sumAssured: number,
  age: number,
  addOns: string[],
): number {
  let basePremium = Math.round((sumAssured / 100000) * plan.premiumPerLakh);

  // Age loading for term
  if (age > 50) basePremium = Math.round(basePremium * 2.0);
  else if (age > 40) basePremium = Math.round(basePremium * 1.5);
  else if (age > 30) basePremium = Math.round(basePremium * 1.0);
  else basePremium = Math.round(basePremium * 0.85);

  // Rider costs
  let riderCost = 0;
  const insurerRiders = Object.values(TERM_INSURER_DB).flatMap((i) => i.riders);
  for (const addOn of addOns) {
    const rider = insurerRiders.find((r) => r.name === addOn);
    if (rider) {
      riderCost += Math.round(basePremium * (rider.additionalCostPercent / 100));
    }
  }

  return Math.max(Math.round(basePremium + riderCost), 1500);
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPARISON PLAN GENERATOR (Motor/EV — Market-style)
// ═══════════════════════════════════════════════════════════════════════════════

interface ComparisonPlan {
  insurer: string;
  planName: string;
  premium: number;
  idv: number;
  csr: number;
  cashlessGarages: number;
  addOnsIncluded: string[];
  addOnsAvailable: string[];
  keyFeatures: string[];
  claimRating: number;
  savings: number;
  badge: 'Best Value' | 'Lowest Price' | 'Best Coverage' | 'Most Popular' | '';
}

function generateComparisonPlans(
  currentInsurer: string,
  policyType: 'car' | 'bike',
  idv: number,
  vehicleAge: string,
  ncb: number,
  currentPremium: number,
  currentAddOns: string[],
  isEV: boolean = false,
): ComparisonPlan[] {
  const plans: ComparisonPlan[] = [];
  const db = isEV ? EV_INSURER_DB : INSURER_DB;
  const insurerKeys = Object.keys(db).filter((k) => k !== currentInsurer && k !== 'Other');

  for (const insurerKey of insurerKeys) {
    const insurerData = db[insurerKey];

    for (const plan of insurerData.plans) {
      const premium = calculatePlanPremium(insurerKey, plan, policyType, idv, vehicleAge, ncb, isEV);
      const savings = currentPremium - premium;

      const addOnsAvailable: string[] = [];
      for (const addOn of insurerData.addOnCosts) {
        if (!plan.addOnsIncluded.includes(addOn.name)) {
          const cost = policyType === 'car' ? addOn.carCost : addOn.bikeCost;
          addOnsAvailable.push(`${addOn.name} (${formatCurrency(cost)})`);
        }
      }

      plans.push({
        insurer: insurerKey,
        planName: plan.name,
        premium,
        idv,
        csr: insurerData.csr,
        cashlessGarages: insurerData.cashlessGarages,
        addOnsIncluded: [...plan.addOnsIncluded],
        addOnsAvailable,
        keyFeatures: [...plan.keyFeatures],
        claimRating: plan.claimProcessRating,
        savings,
        badge: '',
      });
    }
  }

  plans.sort((a, b) => a.premium - b.premium);

  if (plans.length > 0) {
    plans[0].badge = 'Lowest Price';

    let bestValueIdx = 0;
    let bestValueScore = 0;
    for (let i = 0; i < plans.length; i++) {
      const score = (plans[i].claimRating * plans[i].csr * Math.max(plans[i].addOnsIncluded.length, 1)) / plans[i].premium;
      if (score > bestValueScore) {
        bestValueScore = score;
        bestValueIdx = i;
      }
    }
    plans[bestValueIdx].badge = 'Best Value';

    let bestCovIdx = 0;
    let bestCovScore = 0;
    for (let i = 0; i < plans.length; i++) {
      const score = plans[i].addOnsIncluded.length * 10 + plans[i].csr + plans[i].claimRating * 5;
      if (score > bestCovScore) {
        bestCovScore = score;
        bestCovIdx = i;
      }
    }
    if (plans[bestCovIdx].badge === '' || plans[bestCovIdx].badge === 'Best Value') {
      // Only override if different from Best Value
      if (bestCovIdx !== bestValueIdx) {
        plans[bestCovIdx].badge = 'Best Coverage';
      }
    }

    const popularIdx = plans.findIndex(
      (p) =>
        (p.insurer === 'HDFC ERGO' || p.insurer === 'Bajaj Allianz' || p.insurer === 'ICICI Lombard') &&
        p.planName.includes('Comprehensive'),
    );
    if (popularIdx >= 0 && plans[popularIdx].badge === '') {
      plans[popularIdx].badge = 'Most Popular';
    }
  }

  const badgePlans = plans.filter((p) => p.badge !== '');
  const remainingPlans = plans.filter((p) => p.badge === '');
  const selectedPlans: ComparisonPlan[] = [];

  for (const p of badgePlans) {
    if (!selectedPlans.find((sp) => sp.insurer === p.insurer && sp.planName === p.planName)) {
      selectedPlans.push(p);
    }
  }

  if (remainingPlans.length > 0 && !selectedPlans.find((p) => p.premium === remainingPlans[0].premium)) {
    selectedPlans.push(remainingPlans[0]);
  }

  if (remainingPlans.length > 1) {
    const expensive = remainingPlans[remainingPlans.length - 1];
    if (!selectedPlans.find((p) => p.insurer === expensive.insurer && p.planName === expensive.planName)) {
      selectedPlans.push(expensive);
    }
  }

  if (remainingPlans.length > 2) {
    const midIdx = Math.floor(remainingPlans.length / 2);
    const mid = remainingPlans[midIdx];
    if (!selectedPlans.find((p) => p.insurer === mid.insurer && p.planName === mid.planName)) {
      selectedPlans.push(mid);
    }
  }

  return selectedPlans.slice(0, 5).sort((a, b) => a.premium - b.premium);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH COMPARISON PLAN GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

interface HealthComparisonPlan {
  insurer: string;
  planName: string;
  premium: number;
  sumInsured: number;
  csr: number;
  networkHospitals: number;
  addOnsIncluded: string[];
  addOnsAvailable: string[];
  keyFeatures: string[];
  claimRating: number;
  savings: number;
  roomRentLimit: string;
  waitingPeriodPED: number;
  restoration: boolean;
  badge: 'Best Value' | 'Lowest Price' | 'Best Coverage' | 'Most Popular' | '';
}

function generateHealthComparisonPlans(
  currentInsurer: string,
  sumInsured: number,
  currentPremium: number,
  age: number,
  familyMembers: number,
  currentAddOns: string[],
): HealthComparisonPlan[] {
  const plans: HealthComparisonPlan[] = [];
  const insurerKeys = Object.keys(HEALTH_INSURER_DB).filter((k) => k !== currentInsurer);

  for (const insurerKey of insurerKeys) {
    const insurerData = HEALTH_INSURER_DB[insurerKey];

    for (const plan of insurerData.plans) {
      const premium = calculateHealthPlanPremium(plan, sumInsured, age, familyMembers);
      const savings = currentPremium - premium;

      const addOnsAvailable: string[] = [];
      for (const addOn of insurerData.addOnCosts) {
        if (!plan.addOnsIncluded.includes(addOn.name)) {
          const cost = Math.round((sumInsured / 100000) * addOn.costPerLakh);
          addOnsAvailable.push(`${addOn.name} (${formatCurrency(cost)})`);
        }
      }

      plans.push({
        insurer: insurerKey,
        planName: plan.name,
        premium,
        sumInsured,
        csr: insurerData.csr,
        networkHospitals: insurerData.networkHospitals,
        addOnsIncluded: [...plan.addOnsIncluded],
        addOnsAvailable,
        keyFeatures: [...plan.keyFeatures],
        claimRating: plan.claimProcessRating,
        savings,
        roomRentLimit: plan.roomRentLimit,
        waitingPeriodPED: plan.waitingPeriodPED,
        restoration: plan.restoration,
        badge: '',
      });
    }
  }

  plans.sort((a, b) => a.premium - b.premium);

  if (plans.length > 0) {
    plans[0].badge = 'Lowest Price';

    let bestValueIdx = 0;
    let bestValueScore = 0;
    for (let i = 0; i < plans.length; i++) {
      const restorationBonus = plans[i].restoration ? 10 : 0;
      const score = ((plans[i].claimRating + restorationBonus) * plans[i].csr * Math.max(plans[i].addOnsIncluded.length, 1)) / plans[i].premium;
      if (score > bestValueScore) {
        bestValueScore = score;
        bestValueIdx = i;
      }
    }
    plans[bestValueIdx].badge = 'Best Value';

    let bestCovIdx = 0;
    let bestCovScore = 0;
    for (let i = 0; i < plans.length; i++) {
      const restorationBonus = plans[i].restoration ? 15 : 0;
      const score = plans[i].addOnsIncluded.length * 10 + plans[i].csr + plans[i].claimRating * 5 + restorationBonus + (48 - plans[i].waitingPeriodPED);
      if (score > bestCovScore) {
        bestCovScore = score;
        bestCovIdx = i;
      }
    }
    if (bestCovIdx !== bestValueIdx) {
      plans[bestCovIdx].badge = 'Best Coverage';
    }

    const popularIdx = plans.findIndex(
      (p) =>
        (p.insurer === 'Star Health' || p.insurer === 'HDFC ERGO' || p.insurer === 'ICICI Lombard') &&
        p.claimRating >= 4.3,
    );
    if (popularIdx >= 0 && plans[popularIdx].badge === '') {
      plans[popularIdx].badge = 'Most Popular';
    }
  }

  const badgePlans = plans.filter((p) => p.badge !== '');
  const remainingPlans = plans.filter((p) => p.badge === '');
  const selectedPlans: HealthComparisonPlan[] = [];

  for (const p of badgePlans) {
    if (!selectedPlans.find((sp) => sp.insurer === p.insurer && sp.planName === p.planName)) {
      selectedPlans.push(p);
    }
  }

  if (remainingPlans.length > 0) {
    selectedPlans.push(remainingPlans[0]);
  }
  if (remainingPlans.length > 1) {
    const expensive = remainingPlans[remainingPlans.length - 1];
    if (!selectedPlans.find((p) => p.insurer === expensive.insurer)) {
      selectedPlans.push(expensive);
    }
  }

  return selectedPlans.slice(0, 5).sort((a, b) => a.premium - b.premium);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TERM COMPARISON PLAN GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

interface TermComparisonPlan {
  insurer: string;
  planName: string;
  premium: number;
  sumAssured: number;
  csr: number;
  solvencyRatio: number;
  claimTurnaroundDays: number;
  addOnsIncluded: string[];
  ridersAvailable: string[];
  keyFeatures: string[];
  claimRating: number;
  savings: number;
  policyTerm: string;
  maxMaturityAge: number;
  badge: 'Best Value' | 'Lowest Price' | 'Best Coverage' | 'Most Popular' | '';
}

function generateTermComparisonPlans(
  currentInsurer: string,
  sumAssured: number,
  currentPremium: number,
  age: number,
  currentAddOns: string[],
): TermComparisonPlan[] {
  const plans: TermComparisonPlan[] = [];
  const insurerKeys = Object.keys(TERM_INSURER_DB).filter((k) => k !== currentInsurer);

  for (const insurerKey of insurerKeys) {
    const insurerData = TERM_INSURER_DB[insurerKey];

    for (const plan of insurerData.plans) {
      const premium = calculateTermPlanPremium(plan, sumAssured, age, currentAddOns);
      const savings = currentPremium - premium;

      const ridersAvailable = insurerData.riders.map((r) => `${r.name} (+${r.additionalCostPercent}%)`);

      plans.push({
        insurer: insurerKey,
        planName: plan.name,
        premium,
        sumAssured,
        csr: insurerData.csr,
        solvencyRatio: insurerData.solvencyRatio,
        claimTurnaroundDays: insurerData.claimTurnaroundDays,
        addOnsIncluded: [...plan.addOnsIncluded],
        ridersAvailable,
        keyFeatures: [...plan.keyFeatures],
        claimRating: plan.claimProcessRating,
        savings,
        policyTerm: plan.policyTerm,
        maxMaturityAge: plan.maxMaturityAge,
        badge: '',
      });
    }
  }

  plans.sort((a, b) => a.premium - b.premium);

  if (plans.length > 0) {
    plans[0].badge = 'Lowest Price';

    let bestValueIdx = 0;
    let bestValueScore = 0;
    for (let i = 0; i < plans.length; i++) {
      const score = (plans[i].claimRating * plans[i].csr * plans[i].solvencyRatio * Math.max(plans[i].addOnsIncluded.length, 1)) / plans[i].premium;
      if (score > bestValueScore) {
        bestValueScore = score;
        bestValueIdx = i;
      }
    }
    plans[bestValueIdx].badge = 'Best Value';

    let bestCovIdx = 0;
    let bestCovScore = 0;
    for (let i = 0; i < plans.length; i++) {
      const score = plans[i].addOnsIncluded.length * 10 + plans[i].csr + plans[i].claimRating * 5 + plans[i].solvencyRatio * 10;
      if (score > bestCovScore) {
        bestCovScore = score;
        bestCovIdx = i;
      }
    }
    if (bestCovIdx !== bestValueIdx) {
      plans[bestCovIdx].badge = 'Best Coverage';
    }

    const popularIdx = plans.findIndex(
      (p) =>
        (p.insurer === 'HDFC Life' || p.insurer === 'ICICI Pru' || p.insurer === 'LIC') &&
        p.claimRating >= 4.3,
    );
    if (popularIdx >= 0 && plans[popularIdx].badge === '') {
      plans[popularIdx].badge = 'Most Popular';
    }
  }

  const badgePlans = plans.filter((p) => p.badge !== '');
  const remainingPlans = plans.filter((p) => p.badge === '');
  const selectedPlans: TermComparisonPlan[] = [];

  for (const p of badgePlans) {
    if (!selectedPlans.find((sp) => sp.insurer === p.insurer && sp.planName === p.planName)) {
      selectedPlans.push(p);
    }
  }

  if (remainingPlans.length > 0) {
    selectedPlans.push(remainingPlans[0]);
  }

  return selectedPlans.slice(0, 5).sort((a, b) => a.premium - b.premium);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH SCORE CALCULATION (Multi-policy-type weighted formula)
// ═══════════════════════════════════════════════════════════════════════════════

function calculateHealthScore(
  csr: number,
  premiumIdvRatio: number,
  addOns: string[],
  vehicleAge: string,
  cashlessGarages: number,
  complaintRatio: number,
  ncb: number,
  claimsLast3Years: number,
): number {
  // CSR Score (0-100)
  let csrScore = 0;
  if (csr >= 98) csrScore = 100;
  else if (csr >= 97) csrScore = 90;
  else if (csr >= 96) csrScore = 80;
  else if (csr >= 95) csrScore = 70;
  else if (csr >= 94) csrScore = 55;
  else if (csr >= 93) csrScore = 40;
  else csrScore = 25;

  // Premium Score (0-100) based on premium/IDV ratio
  let premiumScore = 50;
  if (premiumIdvRatio < 0.025) premiumScore = 35;
  else if (premiumIdvRatio <= 0.030) premiumScore = 85;
  else if (premiumIdvRatio <= 0.035) premiumScore = 95;
  else if (premiumIdvRatio <= 0.040) premiumScore = 80;
  else if (premiumIdvRatio <= 0.050) premiumScore = 60;
  else if (premiumIdvRatio <= 0.060) premiumScore = 40;
  else premiumScore = 25;

  // Add-on Value Score (0-100)
  let addOnScore = 50;
  const hasZeroDep = addOns.includes('Zero Depreciation');

  const ageBracket = vehicleAge;
  let essentialCount = 0;
  let unnecessaryCount = 0;

  for (const addOn of addOns) {
    const usefulness = ADD_ON_USEFULNESS[addOn]?.[ageBracket];
    if (usefulness === 'essential') essentialCount += 2;
    else if (usefulness === 'useful') essentialCount += 1;
    else if (usefulness === 'unnecessary') unnecessaryCount += 2;
    else if (usefulness === 'optional') essentialCount += 0;
  }

  const essentialAddOns = ['Zero Depreciation', 'NCB Protection'];
  const missingEssential = essentialAddOns.filter(
    (a) => !addOns.includes(a) && ADD_ON_USEFULNESS[a]?.[ageBracket] === 'essential',
  );

  addOnScore = 50 + (essentialCount * 8) - (unnecessaryCount * 10) - (missingEssential.length * 12);
  addOnScore = Math.max(10, Math.min(100, addOnScore));

  // Network Score (0-100)
  let networkScore = 50;
  if (cashlessGarages >= 12000) networkScore = 100;
  else if (cashlessGarages >= 9000) networkScore = 85;
  else if (cashlessGarages >= 7000) networkScore = 70;
  else if (cashlessGarages >= 5000) networkScore = 55;
  else if (cashlessGarages >= 3000) networkScore = 40;
  else networkScore = 25;

  // Complaint Score (0-100)
  let complaintScore = 50;
  if (complaintRatio <= 1.5) complaintScore = 100;
  else if (complaintRatio <= 2.0) complaintScore = 85;
  else if (complaintRatio <= 2.5) complaintScore = 70;
  else if (complaintRatio <= 3.0) complaintScore = 55;
  else if (complaintRatio <= 3.5) complaintScore = 40;
  else complaintScore = 25;

  // Weighted formula for Motor: CSR 35%, Premium 25%, Add-on 20%, Network 10%, Complaints 10%
  let healthScore = Math.round(
    (csrScore * 0.35) +
    (premiumScore * 0.25) +
    (addOnScore * 0.20) +
    (networkScore * 0.10) +
    (complaintScore * 0.10),
  );

  // NCB bonus
  if (ncb >= 50) healthScore += 5;
  else if (ncb >= 35) healthScore += 3;
  else if (ncb >= 20) healthScore += 1;

  // Claims history penalty
  if (claimsLast3Years >= 4) healthScore -= 10;
  else if (claimsLast3Years >= 2) healthScore -= 5;
  else if (claimsLast3Years === 0) healthScore += 3;

  // Missing zero dep penalty
  if (!hasZeroDep && !['7+ years'].includes(vehicleAge)) {
    healthScore -= 5;
  }

  return Math.max(15, Math.min(95, healthScore));
}

/** Health insurance score: CSR 30%, Premium 25%, Waiting Period 15%, Network 15%, Add-on 10%, Complaints 5% */
function calculateHealthInsuranceScore(
  csr: number,
  premiumSumInsuredRatio: number,
  addOns: string[],
  networkHospitals: number,
  complaintRatio: number,
  waitingPeriodPED: number,
  age: number,
  familyMembers: number,
  claimsLast3Years: number,
): number {
  // CSR Score
  let csrScore = 0;
  if (csr >= 98) csrScore = 100;
  else if (csr >= 97) csrScore = 90;
  else if (csr >= 96) csrScore = 80;
  else if (csr >= 95) csrScore = 70;
  else if (csr >= 94) csrScore = 55;
  else csrScore = 35;

  // Premium Score (based on premium/sumInsured ratio — typically 3-5%)
  let premiumScore = 50;
  if (premiumSumInsuredRatio < 0.030) premiumScore = 90;
  else if (premiumSumInsuredRatio <= 0.040) premiumScore = 95;
  else if (premiumSumInsuredRatio <= 0.050) premiumScore = 80;
  else if (premiumSumInsuredRatio <= 0.060) premiumScore = 60;
  else if (premiumSumInsuredRatio <= 0.080) premiumScore = 40;
  else premiumScore = 25;

  // Waiting Period Score (lower is better)
  let waitingScore = 50;
  if (waitingPeriodPED <= 24) waitingScore = 100;
  else if (waitingPeriodPED <= 36) waitingScore = 75;
  else if (waitingPeriodPED <= 48) waitingScore = 50;
  else waitingScore = 25;

  // Network Score
  let networkScore = 50;
  if (networkHospitals >= 12000) networkScore = 100;
  else if (networkHospitals >= 9000) networkScore = 80;
  else if (networkHospitals >= 7000) networkScore = 65;
  else if (networkHospitals >= 5000) networkScore = 50;
  else networkScore = 30;

  // Add-on Value Score
  const healthEssential = ['Critical Illness Rider', 'Consumables Cover', 'Room Rent Upgrade'];
  let addOnScore = 40;
  for (const essential of healthEssential) {
    if (addOns.includes(essential)) addOnScore += 15;
  }
  if (addOns.includes('Maternity Plus') && age <= 40) addOnScore += 10;
  if (addOns.includes('OPD Cover')) addOnScore += 8;
  addOnScore = Math.min(100, addOnScore);

  // Complaint Score
  let complaintScore = 50;
  if (complaintRatio <= 1.5) complaintScore = 100;
  else if (complaintRatio <= 2.5) complaintScore = 75;
  else if (complaintRatio <= 3.5) complaintScore = 50;
  else complaintScore = 25;

  let healthScore = Math.round(
    (csrScore * 0.30) +
    (premiumScore * 0.25) +
    (waitingScore * 0.15) +
    (networkScore * 0.15) +
    (addOnScore * 0.10) +
    (complaintScore * 0.05),
  );

  // Age adjustment
  if (age > 55) healthScore -= 5;

  // Claims penalty
  if (claimsLast3Years >= 3) healthScore -= 8;
  else if (claimsLast3Years >= 1) healthScore -= 3;

  // Family floater bonus
  if (familyMembers >= 3) healthScore += 2;

  return Math.max(15, Math.min(95, healthScore));
}

/** Term insurance score: CSR 35%, Premium 25%, Solvency Ratio 15%, Claim Turnaround 15%, Rider Value 10% */
function calculateTermInsuranceScore(
  csr: number,
  premiumPerLakh: number,
  solvencyRatio: number,
  claimTurnaroundDays: number,
  addOns: string[],
  age: number,
  claimsLast3Years: number,
): number {
  // CSR Score
  let csrScore = 0;
  if (csr >= 98.5) csrScore = 100;
  else if (csr >= 98) csrScore = 90;
  else if (csr >= 97) csrScore = 75;
  else if (csr >= 96) csrScore = 60;
  else csrScore = 40;

  // Premium Score (lower premium per lakh is better)
  let premiumScore = 50;
  if (premiumPerLakh <= 700) premiumScore = 95;
  else if (premiumPerLakh <= 750) premiumScore = 85;
  else if (premiumPerLakh <= 800) premiumScore = 70;
  else if (premiumPerLakh <= 850) premiumScore = 55;
  else premiumScore = 35;

  // Solvency Score (higher is better, IRDAI minimum is 1.5)
  let solvencyScore = 50;
  if (solvencyRatio >= 2.0) solvencyScore = 100;
  else if (solvencyRatio >= 1.8) solvencyScore = 80;
  else if (solvencyRatio >= 1.5) solvencyScore = 60;
  else solvencyScore = 30;

  // Claim Turnaround Score (lower is better)
  let turnaroundScore = 50;
  if (claimTurnaroundDays <= 7) turnaroundScore = 100;
  else if (claimTurnaroundDays <= 10) turnaroundScore = 75;
  else if (claimTurnaroundDays <= 15) turnaroundScore = 50;
  else turnaroundScore = 25;

  // Rider Value Score
  const termEssential = ['Critical Illness', 'Accidental Death', 'Waiver of Premium'];
  let riderScore = 40;
  for (const essential of termEssential) {
    if (addOns.includes(essential)) riderScore += 15;
  }
  if (addOns.includes('Terminal Illness')) riderScore += 10;
  riderScore = Math.min(100, riderScore);

  let healthScore = Math.round(
    (csrScore * 0.35) +
    (premiumScore * 0.25) +
    (solvencyScore * 0.15) +
    (turnaroundScore * 0.15) +
    (riderScore * 0.10),
  );

  // Age adjustment
  if (age > 45) healthScore += 3;
  if (age <= 30) healthScore += 2;

  // Claims history (for term, not as impactful)
  if (claimsLast3Years >= 3) healthScore -= 5;

  return Math.max(15, Math.min(95, healthScore));
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAVINGS CALCULATION (Motor/EV)
// ═══════════════════════════════════════════════════════════════════════════════

interface SavingsResult {
  idvSavings: number;
  addOnSavings: number;
  insurerSwitchSavings: number;
  ncbSavings: number;
  potentialSavings: number;
  unnecessaryAddOns: string[];
}

function calculateSavings(
  currentPremium: number,
  currentIDV: number,
  currentAddOns: string[],
  currentInsurer: string,
  vehicleAge: string,
  ncb: number,
  claimsLast3Years: number,
  policyType: 'car' | 'bike',
  isEV: boolean = false,
): SavingsResult {
  let idvSavings = 0;
  let addOnSavings = 0;
  let insurerSwitchSavings = 0;
  let ncbSavings = 0;

  // ── IDV Savings ──────────────────────────────────────────────
  const vehicleAgeDep = VEHICLE_AGE_DEPRECIATION[vehicleAge] ?? 0.25;
  const recommendedIDV = Math.round(currentIDV * (1 + vehicleAgeDep * 0.3));
  if (recommendedIDV > currentIDV) {
    idvSavings = Math.round((recommendedIDV - currentIDV) * (currentPremium / currentIDV) * 0.5);
  } else {
    idvSavings = Math.round(currentPremium * 0.05);
  }

  // ── Add-on Savings ───────────────────────────────────────────
  const unnecessaryAddOns: string[] = [];
  const db = isEV ? EV_INSURER_DB : INSURER_DB;
  const insurerData = db[currentInsurer] || db['Other'];
  const usefulnessTable = isEV ? { ...ADD_ON_USEFULNESS, ...EV_ADD_ON_USEFULNESS } : ADD_ON_USEFULNESS;

  for (const addOn of currentAddOns) {
    const usefulness = usefulnessTable[addOn]?.[vehicleAge];
    if (usefulness === 'unnecessary') {
      const addOnCost = insurerData.addOnCosts.find((a) => a.name === addOn);
      if (addOnCost) {
        const cost = policyType === 'car' ? addOnCost.carCost : addOnCost.bikeCost;
        addOnSavings += cost;
        unnecessaryAddOns.push(addOn);
      }
    }
  }

  // ── Insurer Switch Savings ───────────────────────────────────
  let cheapestPremium = currentPremium;
  const altInsurers = Object.keys(db).filter(
    (k) => k !== currentInsurer && k !== 'Other',
  );

  for (const insKey of altInsurers) {
    const insData = db[insKey];
    for (const plan of insData.plans) {
      const premium = calculatePlanPremium(insKey, plan, policyType, currentIDV, vehicleAge, ncb, isEV);
      if (premium < cheapestPremium) {
        cheapestPremium = premium;
      }
    }
  }
  insurerSwitchSavings = Math.max(0, currentPremium - cheapestPremium);

  // ── NCB Savings ──────────────────────────────────────────────
  if (ncb === 0 && claimsLast3Years === 0) {
    ncbSavings = Math.round(currentPremium * 0.20);
  } else if (ncb < 50 && claimsLast3Years === 0) {
    ncbSavings = Math.round(currentPremium * ((50 - ncb) / 100) * 0.5);
  }

  const potentialSavings = idvSavings + addOnSavings + insurerSwitchSavings + ncbSavings;

  return {
    idvSavings,
    addOnSavings,
    insurerSwitchSavings,
    ncbSavings,
    potentialSavings,
    unnecessaryAddOns,
  };
}

/** Health insurance savings calculation */
function calculateHealthSavings(
  currentPremium: number,
  sumInsured: number,
  currentAddOns: string[],
  currentInsurer: string,
  age: number,
  familyMembers: number,
  claimsLast3Years: number,
): { potentialSavings: number; addOnSavings: number; insurerSwitchSavings: number; unnecessaryAddOns: string[] } {
  let addOnSavings = 0;
  let insurerSwitchSavings = 0;
  const unnecessaryAddOns: string[] = [];

  // Add-on optimization for health
  const healthOptional = ['Global Cover', 'Maternity Plus'];
  if (age > 45) {
    // Maternity Plus not useful above 45
    if (currentAddOns.includes('Maternity Plus')) {
      const cost = Math.round((sumInsured / 100000) * 200);
      addOnSavings += cost;
      unnecessaryAddOns.push('Maternity Plus');
    }
  }
  // Global cover is optional for most
  if (currentAddOns.includes('Global Cover') && age < 35) {
    // Young people may not need global cover
    const cost = Math.round((sumInsured / 100000) * 150);
    addOnSavings += Math.round(cost * 0.5); // Partial savings
  }

  // Insurer switch savings
  let cheapestPremium = currentPremium;
  const altInsurers = Object.keys(HEALTH_INSURER_DB).filter((k) => k !== currentInsurer);
  for (const insKey of altInsurers) {
    const insData = HEALTH_INSURER_DB[insKey];
    for (const plan of insData.plans) {
      const premium = calculateHealthPlanPremium(plan, sumInsured, age, familyMembers);
      if (premium < cheapestPremium) {
        cheapestPremium = premium;
      }
    }
  }
  insurerSwitchSavings = Math.max(0, currentPremium - cheapestPremium);

  const potentialSavings = addOnSavings + insurerSwitchSavings;
  return { potentialSavings, addOnSavings, insurerSwitchSavings, unnecessaryAddOns };
}

/** Term insurance savings calculation */
function calculateTermSavings(
  currentPremium: number,
  sumAssured: number,
  currentAddOns: string[],
  currentInsurer: string,
  age: number,
): { potentialSavings: number; insurerSwitchSavings: number; riderSavings: number; unnecessaryRiders: string[] } {
  let riderSavings = 0;
  const unnecessaryRiders: string[] = [];

  // Young people may not need Critical Illness rider immediately
  if (age < 30 && currentAddOns.includes('Critical Illness')) {
    riderSavings += Math.round(currentPremium * 0.25 * 0.3); // Partial
    unnecessaryRiders.push('Critical Illness (consider later)');
  }

  // Insurer switch savings
  let cheapestPremium = currentPremium;
  const altInsurers = Object.keys(TERM_INSURER_DB).filter((k) => k !== currentInsurer);
  for (const insKey of altInsurers) {
    const insData = TERM_INSURER_DB[insKey];
    for (const plan of insData.plans) {
      const premium = calculateTermPlanPremium(plan, sumAssured, age, currentAddOns);
      if (premium < cheapestPremium) {
        cheapestPremium = premium;
      }
    }
  }
  const insurerSwitchSavings = Math.max(0, currentPremium - cheapestPremium);

  const potentialSavings = riderSavings + insurerSwitchSavings;
  return { potentialSavings, insurerSwitchSavings, riderSavings, unnecessaryRiders };
}

// ═══════════════════════════════════════════════════════════════════════════════
// RED FLAG GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

function generateMotorRedFlags(
  premium: number,
  idv: number,
  csr: number,
  addOns: string[],
  vehicleAge: string,
  ncb: number,
  claimsLast3Years: number,
  complaintRatio: number,
  isEV: boolean,
): { issue: string; impact: string; severity: 'high' | 'medium' | 'low' }[] {
  const flags: { issue: string; impact: string; severity: 'high' | 'medium' | 'low' }[] = [];
  const premiumIdvRatio = premium / idv;

  if (premiumIdvRatio > 0.06) {
    flags.push({ issue: 'Premium is very high (>6% of IDV)', impact: `You may be overpaying by ₹${Math.round((premiumIdvRatio - 0.04) * idv)} annually`, severity: 'high' });
  } else if (premiumIdvRatio > 0.045) {
    flags.push({ issue: 'Premium is above optimal range', impact: 'Competitive plans may save you ₹2,000-5,000/year', severity: 'medium' });
  }

  if (csr < 94) {
    flags.push({ issue: `Low Claim Settlement Ratio (${csr}%)`, impact: 'Higher chance of claim rejection', severity: 'high' });
  } else if (csr < 96) {
    flags.push({ issue: `Claim Settlement Ratio could be better (${csr}%)`, impact: 'Consider insurers with 97%+ CSR', severity: 'medium' });
  }

  const usefulnessTable = isEV ? { ...ADD_ON_USEFULNESS, ...EV_ADD_ON_USEFULNESS } : ADD_ON_USEFULNESS;
  for (const addOn of addOns) {
    const usefulness = usefulnessTable[addOn]?.[vehicleAge];
    if (usefulness === 'unnecessary') {
      flags.push({ issue: `${addOn} may be unnecessary for ${vehicleAge} vehicle`, impact: 'Remove to save on premium', severity: 'medium' });
    }
  }

  if (ncb === 0 && claimsLast3Years === 0) {
    flags.push({ issue: 'Missing No Claim Bonus despite no claims', impact: 'You could get 20-50% discount on own-damage premium', severity: 'high' });
  }

  if (!addOns.includes('Zero Depreciation') && !['7+ years'].includes(vehicleAge)) {
    flags.push({ issue: 'Zero Depreciation add-on is missing', impact: 'You bear depreciation cost on claims (up to 50%)', severity: 'medium' });
  }

  if (addOns.includes('Return to Invoice') && ['5-7 years', '7+ years'].includes(vehicleAge)) {
    flags.push({ issue: 'Return to Invoice on old vehicle has low value', impact: 'RTI payout decreases significantly with age', severity: 'low' });
  }

  if (isEV && !addOns.includes('Battery Degradation Cover') && ['2-3 years', '3-5 years', '5-7 years', '7+ years'].includes(vehicleAge)) {
    flags.push({ issue: 'Missing Battery Degradation Cover for EV', impact: 'Battery replacement cost can be ₹50,000-2,00,000', severity: 'high' });
  }

  if (claimsLast3Years >= 3) {
    flags.push({ issue: 'High claim frequency', impact: 'May affect NCB and future premiums', severity: 'medium' });
  }

  if (complaintRatio > 3.5) {
    flags.push({ issue: 'High complaint ratio', impact: 'Poor customer service experience likely', severity: 'medium' });
  }

  if (flags.length === 0) {
    flags.push({ issue: 'Policy appears reasonably structured', impact: 'Minor optimizations may still be possible', severity: 'low' });
  }

  return flags;
}

function generateHealthRedFlags(
  premium: number,
  sumInsured: number,
  csr: number,
  addOns: string[],
  waitingPeriodPED: number,
  networkHospitals: number,
  age: number,
  complaintRatio: number,
): { issue: string; impact: string; severity: 'high' | 'medium' | 'low' }[] {
  const flags: { issue: string; impact: string; severity: 'high' | 'medium' | 'low' }[] = [];
  const premiumRatio = premium / sumInsured;

  if (premiumRatio > 0.07) {
    flags.push({ issue: 'Premium is very high for the sum insured', impact: `You may save ₹${Math.round((premiumRatio - 0.045) * sumInsured)}/year with better plans`, severity: 'high' });
  } else if (premiumRatio > 0.05) {
    flags.push({ issue: 'Premium is above optimal range', impact: 'Compare with top insurers for better rates', severity: 'medium' });
  }

  if (csr < 95) {
    flags.push({ issue: `Low Claim Settlement Ratio (${csr}%)`, impact: 'Higher claim rejection risk', severity: 'high' });
  }

  if (waitingPeriodPED > 36) {
    flags.push({ issue: `Long waiting period for pre-existing diseases (${waitingPeriodPED} months)`, impact: 'Plans with 24-month PED waiting are available', severity: 'high' });
  }

  if (networkHospitals < 5000) {
    flags.push({ issue: 'Limited hospital network', impact: 'May need to go out-of-network for cashless treatment', severity: 'medium' });
  }

  if (age > 45 && !addOns.includes('Critical Illness Rider')) {
    flags.push({ issue: 'Missing Critical Illness Rider after age 45', impact: 'Critical illness risk increases significantly with age', severity: 'high' });
  }

  if (age > 45 && addOns.includes('Maternity Plus')) {
    flags.push({ issue: 'Maternity Plus may not be useful above 45', impact: 'Remove to save on premium', severity: 'medium' });
  }

  if (complaintRatio > 3.5) {
    flags.push({ issue: 'High complaint ratio', impact: 'Poor claim experience likely', severity: 'medium' });
  }

  if (flags.length === 0) {
    flags.push({ issue: 'Health policy appears well-structured', impact: 'Minor optimizations possible', severity: 'low' });
  }

  return flags;
}

function generateTermRedFlags(
  premium: number,
  sumAssured: number,
  csr: number,
  solvencyRatio: number,
  claimTurnaroundDays: number,
  addOns: string[],
  age: number,
): { issue: string; impact: string; severity: 'high' | 'medium' | 'low' }[] {
  const flags: { issue: string; impact: string; severity: 'high' | 'medium' | 'low' }[] = [];
  const premiumPerLakh = (premium / sumAssured) * 100000;

  if (premiumPerLakh > 900) {
    flags.push({ issue: 'Premium is very high per lakh of cover', impact: `You may save ₹${Math.round((premiumPerLakh - 750) * sumAssured / 100000)}/year`, severity: 'high' });
  } else if (premiumPerLakh > 800) {
    flags.push({ issue: 'Premium could be more competitive', impact: 'Compare with online term plans', severity: 'medium' });
  }

  if (csr < 97) {
    flags.push({ issue: `Claim Settlement Ratio is low (${csr}%)`, impact: 'Consider insurers with 98%+ CSR', severity: 'high' });
  }

  if (solvencyRatio < 1.5) {
    flags.push({ issue: `Low solvency ratio (${solvencyRatio})`, impact: 'IRDAI minimum is 1.5 — financial stability concern', severity: 'high' });
  }

  if (claimTurnaroundDays > 12) {
    flags.push({ issue: `Slow claim settlement (${claimTurnaroundDays} days)`, impact: 'Top insurers settle in 7-8 days', severity: 'medium' });
  }

  if (age > 40 && !addOns.includes('Critical Illness')) {
    flags.push({ issue: 'Missing Critical Illness rider after 40', impact: 'CI risk doubles every 10 years after 40', severity: 'high' });
  }

  if (age < 30 && addOns.includes('Critical Illness')) {
    flags.push({ issue: 'Critical Illness rider at young age', impact: 'Consider adding later — premiums increase with age anyway', severity: 'low' });
  }

  if (flags.length === 0) {
    flags.push({ issue: 'Term plan appears well-structured', impact: 'Compare online for better rates', severity: 'low' });
  }

  return flags;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RECOMMENDATION GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

function generateMotorRecommendations(
  healthScore: number,
  redFlags: { severity: string }[],
  savings: SavingsResult,
  ncb: number,
  isEV: boolean,
): string[] {
  const recs: string[] = [];

  if (healthScore < 60) {
    recs.push('🔴 Immediate action needed — switch to a better insurer to save ₹5,000+');
  } else if (healthScore < 80) {
    recs.push('🟡 Compare top 3 insurers — potential savings of ₹2,000-5,000');
  } else {
    recs.push('🟢 Your policy is well-optimized. Fine-tune for extra savings.');
  }

  if (savings.unnecessaryAddOns.length > 0) {
    recs.push(`Remove unnecessary add-ons: ${savings.unnecessaryAddOns.join(', ')}`);
  }

  if (ncb === 0) {
    recs.push('Claim NCB discount — you\'re entitled to 20-50% OD discount if claim-free');
  }

  if (isEV) {
    recs.push('Consider Battery Degradation Cover — EV battery replacement costs ₹50K-2L');
    recs.push('EV-specific plans offer 15-20% lower premiums than standard motor insurance');
  }

  if (redFlags.filter(f => f.severity === 'high').length >= 2) {
    recs.push('Multiple high-severity issues found — switch insurer immediately');
  }

  recs.push('Review your IDV — ensure it matches current market value');
  recs.push('Check for digital-first insurers (Acko, Digit) — often 20-30% cheaper');

  return recs;
}

function generateHealthRecommendations(healthScore: number, waitingPeriodPED: number, age: number): string[] {
  const recs: string[] = [];

  if (healthScore < 60) {
    recs.push('🔴 Switch to a better health insurer — you\'re likely overpaying');
  } else if (healthScore < 80) {
    recs.push('🟡 Compare plans with 24-month PED waiting and 10,000+ hospitals');
  }

  if (waitingPeriodPED > 36) {
    recs.push('Switch to insurer with 24-month PED waiting (Care Health, Acko, Niva Bupa)');
  }

  if (age > 40) {
    recs.push('Add Critical Illness rider — risk increases significantly after 40');
  }

  recs.push('Choose plans with unlimited restoration benefit');
  recs.push('Opt for no room rent capping plans');
  recs.push('Consider family floater for 10-15% savings');

  return recs;
}

function generateTermRecommendations(healthScore: number, premiumPerLakh: number, age: number): string[] {
  const recs = [];

  if (healthScore < 60) {
    recs.push('🔴 Switch to online term plan — save 30-40% on premiums');
  }

  if (premiumPerLakh > 800) {
    recs.push('Online term plans (HDFC Click 2 Protect, ICICI iProtect) offer ₹700-750/lakh');
  }

  if (age <= 35) {
    recs.push('Lock in low premiums now — rates increase with age');
  }

  recs.push('Add Waiver of Premium rider — ensures coverage even if you can\'t pay');
  recs.push('Choose increasing cover option to beat inflation');
  recs.push('Consider return of premium option if risk-averse');

  return recs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRAVEL INSURANCE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Calculate travel plan premium */
function calculateTravelPlanPremium(
  plan: TravelPlanData,
  sumInsured: number,
  destination: string,
  tripDuration: string,
): number {
  let basePremium = Math.round((sumInsured / 100000) * plan.basePremiumPerLakh);

  // Destination risk loading
  const destKey = destination.toLowerCase().replace(/[\s-]/g, '_');
  const riskMultiplier = DESTINATION_RISK[destKey] ?? (destKey === 'domestic' || destination.includes('india') ? 0.7 : 1.1);
  basePremium = Math.round(basePremium * riskMultiplier);

  // Trip duration loading
  const days = parseInt(tripDuration) || 7;
  if (days <= 7) basePremium = Math.round(basePremium * 0.7);
  else if (days <= 15) basePremium = Math.round(basePremium * 0.85);
  else if (days <= 30) basePremium = Math.round(basePremium * 1.0);
  else if (days <= 90) basePremium = Math.round(basePremium * 1.3);
  else basePremium = Math.round(basePremium * 1.6);

  // Add-on costs
  let addOnCost = 0;
  for (const addOnName of plan.addOnsIncluded) {
    const addOn = TRAVEL_ADD_ONS.find((a) => a.name === addOnName);
    if (addOn) {
      addOnCost += Math.round((sumInsured / 100000) * addOn.costPerLakh);
    }
  }

  // GST note: Travel insurance = 18% GST (already included in displayed premium)
  const withGST = Math.round((basePremium + addOnCost) * 1.18);
  return Math.max(withGST, 500);
}

/** Travel insurance score: CSR 30%, Premium 25%, Coverage 20%, Claim Speed 15%, Add-on 10% */
function calculateTravelInsuranceScore(
  csr: number,
  premiumSumInsuredRatio: number,
  addOns: string[],
  networkHospitals: number,
  complaintRatio: number,
  destination: string,
  tripDuration: string,
): number {
  // CSR Score
  let csrScore = 0;
  if (csr >= 98) csrScore = 100;
  else if (csr >= 97) csrScore = 90;
  else if (csr >= 96) csrScore = 80;
  else if (csr >= 95) csrScore = 70;
  else if (csr >= 94) csrScore = 55;
  else csrScore = 35;

  // Premium Score (based on premium/sumInsured ratio — typically 0.3-0.6% for travel)
  let premiumScore = 50;
  if (premiumSumInsuredRatio < 0.003) premiumScore = 95;
  else if (premiumSumInsuredRatio <= 0.005) premiumScore = 85;
  else if (premiumSumInsuredRatio <= 0.007) premiumScore = 70;
  else if (premiumSumInsuredRatio <= 0.010) premiumScore = 50;
  else if (premiumSumInsuredRatio <= 0.015) premiumScore = 35;
  else premiumScore = 20;

  // Coverage Score (based on destination and add-ons)
  let coverageScore = 50;
  const destKey = destination.toLowerCase().replace(/[\s-]/g, '_');
  const isInternational = !['domestic', 'india'].includes(destKey) && !destination.toLowerCase().includes('india');
  if (isInternational) {
    if (addOns.includes('Emergency Evacuation')) coverageScore += 15;
    if (addOns.includes('Trip Cancellation')) coverageScore += 10;
    if (addOns.includes('Passport Loss')) coverageScore += 8;
  } else {
    if (addOns.includes('Trip Cancellation')) coverageScore += 12;
    if (addOns.includes('Baggage Loss')) coverageScore += 8;
  }
  if (addOns.includes('Adventure Sports Cover')) coverageScore += 5;
  coverageScore = Math.min(100, coverageScore);

  // Network Score
  let networkScore = 50;
  if (networkHospitals >= 12000) networkScore = 100;
  else if (networkHospitals >= 9000) networkScore = 80;
  else if (networkHospitals >= 7000) networkScore = 65;
  else if (networkHospitals >= 5000) networkScore = 50;
  else networkScore = 30;

  // Claim Speed Score
  let claimSpeedScore = 50;
  if (networkHospitals > 0) {
    // Use complaint ratio as proxy for claim quality
    if (complaintRatio <= 1.5) claimSpeedScore = 100;
    else if (complaintRatio <= 2.5) claimSpeedScore = 75;
    else if (complaintRatio <= 3.5) claimSpeedScore = 50;
    else claimSpeedScore = 25;
  }

  // Add-on Value Score
  const travelEssential = ['Trip Cancellation', 'Emergency Evacuation'];
  let addOnScore = 40;
  for (const essential of travelEssential) {
    if (addOns.includes(essential)) addOnScore += 15;
  }
  addOnScore = Math.min(100, addOnScore);

  let healthScore = Math.round(
    (csrScore * 0.30) +
    (premiumScore * 0.25) +
    (coverageScore * 0.20) +
    (claimSpeedScore * 0.15) +
    (addOnScore * 0.10),
  );

  // Trip duration adjustment — longer trips have higher risk
  const days = parseInt(tripDuration) || 7;
  if (days > 60) healthScore -= 5;

  return Math.max(15, Math.min(95, healthScore));
}

/** Travel insurance savings calculation */
function calculateTravelSavings(
  currentPremium: number,
  sumInsured: number,
  currentAddOns: string[],
  currentInsurer: string,
  destination: string,
  tripDuration: string,
): { potentialSavings: number; addOnSavings: number; insurerSwitchSavings: number; unnecessaryAddOns: string[] } {
  let addOnSavings = 0;
  const unnecessaryAddOns: string[] = [];

  // Add-on optimization for travel
  const destKey = destination.toLowerCase().replace(/[\s-]/g, '_');
  const isDomestic = destKey === 'domestic' || destination.toLowerCase().includes('india');
  if (isDomestic) {
    // Passport loss not needed for domestic travel
    if (currentAddOns.includes('Passport Loss')) {
      const cost = Math.round((sumInsured / 100000) * 75);
      addOnSavings += cost;
      unnecessaryAddOns.push('Passport Loss');
    }
    // Emergency evacuation less critical for domestic
    if (currentAddOns.includes('Emergency Evacuation')) {
      const cost = Math.round((sumInsured / 100000) * 75); // partial savings
      addOnSavings += cost;
      unnecessaryAddOns.push('Emergency Evacuation (domestic trip)');
    }
  }
  // Adventure Sports Cover may be unnecessary for non-adventure trips
  if (currentAddOns.includes('Adventure Sports Cover') && !currentAddOns.includes('Adventure Sports')) {
    // If they have it but don't need it, flag it
    const cost = Math.round((sumInsured / 100000) * 90); // partial
    addOnSavings += cost;
    unnecessaryAddOns.push('Adventure Sports Cover (if not doing adventure activities)');
  }

  // Insurer switch savings
  let cheapestPremium = currentPremium;
  const altInsurers = Object.keys(TRAVEL_INSURER_DB).filter((k) => k !== currentInsurer);
  for (const insKey of altInsurers) {
    const insData = TRAVEL_INSURER_DB[insKey];
    for (const plan of insData.plans) {
      const premium = calculateTravelPlanPremium(plan, sumInsured, destination, tripDuration);
      if (premium < cheapestPremium) {
        cheapestPremium = premium;
      }
    }
  }
  const insurerSwitchSavings = Math.max(0, currentPremium - cheapestPremium);

  const potentialSavings = addOnSavings + insurerSwitchSavings;
  return { potentialSavings, addOnSavings, insurerSwitchSavings, unnecessaryAddOns };
}

/** Travel red flags generator */
function generateTravelRedFlags(
  premium: number,
  sumInsured: number,
  csr: number,
  addOns: string[],
  destination: string,
  tripDuration: string,
  complaintRatio: number,
): { issue: string; impact: string; severity: 'high' | 'medium' | 'low' }[] {
  const flags: { issue: string; impact: string; severity: 'high' | 'medium' | 'low' }[] = [];
  const premiumRatio = premium / sumInsured;
  const destKey = destination.toLowerCase().replace(/[\s-]/g, '_');
  const isInternational = !['domestic', 'india'].includes(destKey) && !destination.toLowerCase().includes('india');

  if (premiumRatio > 0.015) {
    flags.push({ issue: 'Premium is very high for the sum insured', impact: `You may save ₹${Math.round((premiumRatio - 0.007) * sumInsured)}/year with better plans`, severity: 'high' });
  } else if (premiumRatio > 0.010) {
    flags.push({ issue: 'Premium is above optimal range for travel insurance', impact: 'Compare with top insurers for better rates', severity: 'medium' });
  }

  if (csr < 95) {
    flags.push({ issue: `Low Claim Settlement Ratio (${csr}%)`, impact: 'Higher claim rejection risk, especially abroad', severity: 'high' });
  }

  if (isInternational && !addOns.includes('Emergency Evacuation')) {
    flags.push({ issue: 'Missing Emergency Evacuation for international travel', impact: 'Medical evacuation can cost ₹5-25 lakh abroad', severity: 'high' });
  }

  if (isInternational && !addOns.includes('Passport Loss')) {
    flags.push({ issue: 'Missing Passport Loss cover for international travel', impact: 'Passport replacement + travel disruption costs ₹15,000-50,000', severity: 'medium' });
  }

  if (!addOns.includes('Trip Cancellation')) {
    flags.push({ issue: 'Trip Cancellation cover is missing', impact: 'Non-refundable bookings (flights, hotels) at risk', severity: 'medium' });
  }

  const days = parseInt(tripDuration) || 7;
  if (days > 30 && !addOns.includes('Adventure Sports Cover')) {
    flags.push({ issue: 'Long trip without Adventure Sports Cover', impact: 'Extended trips have higher risk of adventure-related injuries', severity: 'low' });
  }

  if (complaintRatio > 3.5) {
    flags.push({ issue: 'High complaint ratio', impact: 'Poor claim experience likely, especially problematic abroad', severity: 'medium' });
  }

  if (flags.length === 0) {
    flags.push({ issue: 'Travel policy appears well-structured', impact: 'Minor optimizations possible', severity: 'low' });
  }

  return flags;
}

/** Travel comparison plan generator */
interface TravelComparisonPlan {
  insurer: string;
  planName: string;
  premium: number;
  sumInsured: number;
  csr: number;
  networkHospitals: number;
  addOnsIncluded: string[];
  addOnsAvailable: string[];
  keyFeatures: string[];
  claimRating: number;
  savings: number;
  coverageType: string;
  tripCancellation: boolean;
  baggageLoss: boolean;
  badge: 'Best Value' | 'Lowest Price' | 'Best Coverage' | 'Most Popular' | '';
}

function generateTravelComparisonPlans(
  currentInsurer: string,
  sumInsured: number,
  currentPremium: number,
  destination: string,
  tripDuration: string,
  currentAddOns: string[],
): TravelComparisonPlan[] {
  const plans: TravelComparisonPlan[] = [];
  const insurerKeys = Object.keys(TRAVEL_INSURER_DB).filter((k) => k !== currentInsurer);

  for (const insurerKey of insurerKeys) {
    const insurerData = TRAVEL_INSURER_DB[insurerKey];

    for (const plan of insurerData.plans) {
      const premium = calculateTravelPlanPremium(plan, sumInsured, destination, tripDuration);
      const savings = currentPremium - premium;

      const addOnsAvailable: string[] = [];
      for (const addOn of insurerData.addOnCosts) {
        if (!plan.addOnsIncluded.includes(addOn.name)) {
          const cost = Math.round((sumInsured / 100000) * addOn.costPerLakh);
          addOnsAvailable.push(`${addOn.name} (${formatCurrency(cost)})`);
        }
      }

      plans.push({
        insurer: insurerKey,
        planName: plan.name,
        premium,
        sumInsured,
        csr: insurerData.csr,
        networkHospitals: insurerData.networkHospitals,
        addOnsIncluded: [...plan.addOnsIncluded],
        addOnsAvailable,
        keyFeatures: [...plan.keyFeatures],
        claimRating: plan.claimProcessRating,
        savings,
        coverageType: plan.coverageType,
        tripCancellation: plan.tripCancellationCover,
        baggageLoss: plan.baggageLossCover,
        badge: '',
      });
    }
  }

  plans.sort((a, b) => a.premium - b.premium);

  if (plans.length > 0) {
    plans[0].badge = 'Lowest Price';

    let bestValueIdx = 0;
    let bestValueScore = 0;
    for (let i = 0; i < plans.length; i++) {
      const tripCancelBonus = plans[i].tripCancellation ? 10 : 0;
      const score = ((plans[i].claimRating + tripCancelBonus) * plans[i].csr * Math.max(plans[i].addOnsIncluded.length, 1)) / plans[i].premium;
      if (score > bestValueScore) {
        bestValueScore = score;
        bestValueIdx = i;
      }
    }
    plans[bestValueIdx].badge = 'Best Value';

    let bestCovIdx = 0;
    let bestCovScore = 0;
    for (let i = 0; i < plans.length; i++) {
      const tripCancelBonus = plans[i].tripCancellation ? 15 : 0;
      const baggageBonus = plans[i].baggageLoss ? 10 : 0;
      const score = plans[i].addOnsIncluded.length * 10 + plans[i].csr + plans[i].claimRating * 5 + tripCancelBonus + baggageBonus;
      if (score > bestCovScore) {
        bestCovScore = score;
        bestCovIdx = i;
      }
    }
    if (bestCovIdx !== bestValueIdx) {
      plans[bestCovIdx].badge = 'Best Coverage';
    }

    const popularIdx = plans.findIndex(
      (p) =>
        (p.insurer === 'HDFC ERGO' || p.insurer === 'Bajaj Allianz' || p.insurer === 'ICICI Lombard') &&
        p.claimRating >= 4.3,
    );
    if (popularIdx >= 0 && plans[popularIdx].badge === '') {
      plans[popularIdx].badge = 'Most Popular';
    }
  }

  const badgePlans = plans.filter((p) => p.badge !== '');
  const remainingPlans = plans.filter((p) => p.badge === '');
  const selectedPlans: TravelComparisonPlan[] = [];

  for (const p of badgePlans) {
    if (!selectedPlans.find((sp) => sp.insurer === p.insurer && sp.planName === p.planName)) {
      selectedPlans.push(p);
    }
  }

  if (remainingPlans.length > 0) {
    selectedPlans.push(remainingPlans[0]);
  }

  return selectedPlans.slice(0, 5).sort((a, b) => a.premium - b.premium);
}

/** Travel insurance recommendations */
function generateTravelRecommendations(healthScore: number, destination: string, tripDuration: string): string[] {
  const recs: string[] = [];
  const destKey = destination.toLowerCase().replace(/[\s-]/g, '_');
  const isInternational = !['domestic', 'india'].includes(destKey) && !destination.toLowerCase().includes('india');

  if (healthScore < 60) {
    recs.push('🔴 Switch to a better travel insurer — you\'re likely overpaying');
  } else if (healthScore < 80) {
    recs.push('🟡 Compare plans with emergency evacuation and trip cancellation');
  }

  if (isInternational) {
    recs.push('Ensure Emergency Evacuation cover — medical evacuation abroad costs ₹5-25 lakh');
    recs.push('Add Passport Loss cover — replacement + travel disruption is expensive');
    recs.push('Check if your destination requires specific medical coverage minimums');
  } else {
    recs.push('Domestic travel insurance is cheaper — ensure you\'re not paying international rates');
  }

  recs.push('Trip Cancellation cover is essential — protects non-refundable bookings');

  const days = parseInt(tripDuration) || 7;
  if (days > 15) {
    recs.push('Long trip — consider comprehensive plan with baggage loss and flight delay');
  }

  recs.push('Note: Travel insurance attracts 18% GST — factor this into cost comparison');

  return recs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOME INSURANCE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/** Calculate home plan premium */
function calculateHomePlanPremium(
  plan: HomePlanData,
  propertyValue: number,
  constructionType: string,
  city: string,
): number {
  let basePremium = Math.round(propertyValue * (plan.basePremiumPercent / 100));

  // Construction type loading (Kutcha = higher risk)
  if (constructionType.toLowerCase() === 'kutcha') {
    basePremium = Math.round(basePremium * 1.3);
  }

  // City risk loading
  const cityKey = city.toLowerCase().replace(/[\s-]/g, '_');
  const cityRisk = CITY_RISK_ZONES[cityKey];
  if (cityRisk) {
    if (cityRisk.seismic === 'very_high') basePremium = Math.round(basePremium * 1.4);
    else if (cityRisk.seismic === 'high') basePremium = Math.round(basePremium * 1.25);
    else if (cityRisk.seismic === 'moderate') basePremium = Math.round(basePremium * 1.1);

    if (cityRisk.flood === 'high') basePremium = Math.round(basePremium * 1.15);
    else if (cityRisk.flood === 'moderate') basePremium = Math.round(basePremium * 1.05);
  }

  // Add-on costs
  let addOnCost = 0;
  for (const addOnName of plan.addOnsIncluded) {
    const addOn = HOME_ADD_ONS.find((a) => a.name === addOnName);
    if (addOn) {
      addOnCost += Math.round((propertyValue / 100000) * addOn.costPerLakh);
    }
  }

  // GST note: Home insurance = 18% GST (already included in displayed premium)
  const withGST = Math.round((basePremium + addOnCost) * 1.18);
  return Math.max(withGST, 800);
}

/** Home insurance score: CSR 30%, Premium 25%, Coverage 20%, Claim Speed 15%, Add-on 10% */
function calculateHomeInsuranceScore(
  csr: number,
  premiumPropertyValueRatio: number,
  addOns: string[],
  complaintRatio: number,
  constructionType: string,
  city: string,
): number {
  // CSR Score
  let csrScore = 0;
  if (csr >= 97) csrScore = 100;
  else if (csr >= 96) csrScore = 90;
  else if (csr >= 95) csrScore = 80;
  else if (csr >= 94) csrScore = 65;
  else if (csr >= 93) csrScore = 50;
  else csrScore = 35;

  // Premium Score (based on premium/property value ratio — typically 0.15-0.35%)
  let premiumScore = 50;
  if (premiumPropertyValueRatio < 0.002) premiumScore = 95;
  else if (premiumPropertyValueRatio <= 0.003) premiumScore = 85;
  else if (premiumPropertyValueRatio <= 0.004) premiumScore = 70;
  else if (premiumPropertyValueRatio <= 0.005) premiumScore = 55;
  else if (premiumPropertyValueRatio <= 0.007) premiumScore = 40;
  else premiumScore = 25;

  // Coverage Score (based on city risk and add-ons)
  let coverageScore = 50;
  const cityKey = city.toLowerCase().replace(/[\s-]/g, '_');
  const cityRisk = CITY_RISK_ZONES[cityKey];
  if (cityRisk) {
    if (cityRisk.seismic === 'very_high' || cityRisk.seismic === 'high') {
      if (addOns.includes('Earthquake Cover') || addOns.some(a => a.toLowerCase().includes('earthquake'))) {
        coverageScore += 20;
      } else {
        coverageScore -= 15;
      }
    }
    if (cityRisk.flood === 'high') {
      if (addOns.some(a => a.toLowerCase().includes('flood'))) {
        coverageScore += 15;
      }
    }
  }
  if (addOns.includes('Terrorism Cover')) coverageScore += 8;
  if (addOns.includes('Valuable Articles')) coverageScore += 5;
  coverageScore = Math.max(20, Math.min(100, coverageScore));

  // Claim Speed Score (using complaint ratio as proxy)
  let claimSpeedScore = 50;
  if (complaintRatio <= 1.5) claimSpeedScore = 100;
  else if (complaintRatio <= 2.5) claimSpeedScore = 75;
  else if (complaintRatio <= 3.5) claimSpeedScore = 50;
  else claimSpeedScore = 25;

  // Add-on Value Score
  const homeEssential = ['Terrorism Cover', 'Valuable Articles'];
  let addOnScore = 40;
  for (const essential of homeEssential) {
    if (addOns.includes(essential)) addOnScore += 12;
  }
  if (constructionType.toLowerCase() === 'kutcha') {
    // Kutcha construction needs more coverage
    addOnScore += 5;
  }
  addOnScore = Math.min(100, addOnScore);

  let healthScore = Math.round(
    (csrScore * 0.30) +
    (premiumScore * 0.25) +
    (coverageScore * 0.20) +
    (claimSpeedScore * 0.15) +
    (addOnScore * 0.10),
  );

  return Math.max(15, Math.min(95, healthScore));
}

/** Home insurance savings calculation */
function calculateHomeSavings(
  currentPremium: number,
  propertyValue: number,
  currentAddOns: string[],
  currentInsurer: string,
  constructionType: string,
  city: string,
): { potentialSavings: number; addOnSavings: number; insurerSwitchSavings: number; unnecessaryAddOns: string[] } {
  let addOnSavings = 0;
  const unnecessaryAddOns: string[] = [];

  // Pet Insurance may not be needed
  if (currentAddOns.includes('Pet Insurance') && !currentAddOns.some(a => a.toLowerCase().includes('pet'))) {
    const cost = Math.round((propertyValue / 100000) * 50);
    addOnSavings += cost;
    unnecessaryAddOns.push('Pet Insurance (if you don\'t have pets)');
  }

  // Tenant Liability only useful for tenants
  if (currentAddOns.includes('Tenant Liability') && constructionType.toLowerCase() === 'pucca') {
    // If owner-occupied, tenant liability may be unnecessary
    const cost = Math.round((propertyValue / 100000) * 20);
    addOnSavings += cost;
    unnecessaryAddOns.push('Tenant Liability (if owner-occupied)');
  }

  // Insurer switch savings
  let cheapestPremium = currentPremium;
  const altInsurers = Object.keys(HOME_INSURER_DB).filter((k) => k !== currentInsurer);
  for (const insKey of altInsurers) {
    const insData = HOME_INSURER_DB[insKey];
    for (const plan of insData.plans) {
      const premium = calculateHomePlanPremium(plan, propertyValue, constructionType, city);
      if (premium < cheapestPremium) {
        cheapestPremium = premium;
      }
    }
  }
  const insurerSwitchSavings = Math.max(0, currentPremium - cheapestPremium);

  const potentialSavings = addOnSavings + insurerSwitchSavings;
  return { potentialSavings, addOnSavings, insurerSwitchSavings, unnecessaryAddOns };
}

/** Home red flags generator */
function generateHomeRedFlags(
  premium: number,
  propertyValue: number,
  csr: number,
  addOns: string[],
  constructionType: string,
  city: string,
  complaintRatio: number,
  hasEarthquakeCover: boolean,
  hasFloodCover: boolean,
): { issue: string; impact: string; severity: 'high' | 'medium' | 'low' }[] {
  const flags: { issue: string; impact: string; severity: 'high' | 'medium' | 'low' }[] = [];
  const premiumRatio = premium / propertyValue;
  const cityKey = city.toLowerCase().replace(/[\s-]/g, '_');
  const cityRisk = CITY_RISK_ZONES[cityKey];

  if (premiumRatio > 0.007) {
    flags.push({ issue: 'Premium is very high for the property value', impact: `You may save ₹${Math.round((premiumRatio - 0.004) * propertyValue)}/year with better plans`, severity: 'high' });
  } else if (premiumRatio > 0.005) {
    flags.push({ issue: 'Premium is above optimal range for home insurance', impact: 'Compare with top insurers for better rates', severity: 'medium' });
  }

  if (csr < 94) {
    flags.push({ issue: `Low Claim Settlement Ratio (${csr}%)`, impact: 'Higher claim rejection risk during disasters', severity: 'high' });
  }

  // Earthquake cover check
  if (cityRisk && (cityRisk.seismic === 'very_high' || cityRisk.seismic === 'high') && !hasEarthquakeCover) {
    flags.push({ issue: `Missing Earthquake Cover in seismic zone (${cityRisk.seismic} risk in ${city})`, impact: 'Earthquake damage can be catastrophic — repair costs run into lakhs', severity: 'high' });
  }

  // Flood cover check
  if (cityRisk && cityRisk.flood === 'high' && !hasFloodCover) {
    flags.push({ issue: `Missing Flood Cover in flood-prone area (${city})`, impact: 'Flood damage to structure and contents can be devastating', severity: 'high' });
  }

  // Underinsured property check
  if (premiumRatio < 0.001) {
    flags.push({ issue: 'Property may be underinsured (premium very low relative to value)', impact: 'Claim payout may not cover actual reconstruction costs', severity: 'high' });
  }

  if (constructionType.toLowerCase() === 'kutcha' && !hasFireOnly(addOns)) {
    flags.push({ issue: 'Kutcha construction needs comprehensive fire cover', impact: 'Kutcha structures are more vulnerable to fire damage', severity: 'medium' });
  }

  if (complaintRatio > 3.5) {
    flags.push({ issue: 'High complaint ratio', impact: 'Poor claim experience likely during emergencies', severity: 'medium' });
  }

  if (!addOns.includes('Terrorism Cover')) {
    flags.push({ issue: 'Terrorism Cover is missing', impact: 'Terrorism-related damage is not covered', severity: 'low' });
  }

  if (flags.length === 0) {
    flags.push({ issue: 'Home insurance policy appears well-structured', impact: 'Minor optimizations possible', severity: 'low' });
  }

  return flags;
}

/** Helper to check if add-ons include fire-related cover */
function hasFireOnly(addOns: string[]): boolean {
  return addOns.some(a => a.toLowerCase().includes('fire'));
}

/** Home comparison plan generator */
interface HomeComparisonPlan {
  insurer: string;
  planName: string;
  premium: number;
  propertyValue: number;
  csr: number;
  addOnsIncluded: string[];
  addOnsAvailable: string[];
  keyFeatures: string[];
  claimRating: number;
  savings: number;
  planType: string;
  fireCover: boolean;
  earthquakeCover: boolean;
  floodCover: boolean;
  badge: 'Best Value' | 'Lowest Price' | 'Best Coverage' | 'Most Popular' | '';
}

function generateHomeComparisonPlans(
  currentInsurer: string,
  propertyValue: number,
  currentPremium: number,
  constructionType: string,
  city: string,
  currentAddOns: string[],
): HomeComparisonPlan[] {
  const plans: HomeComparisonPlan[] = [];
  const insurerKeys = Object.keys(HOME_INSURER_DB).filter((k) => k !== currentInsurer);

  for (const insurerKey of insurerKeys) {
    const insurerData = HOME_INSURER_DB[insurerKey];

    for (const plan of insurerData.plans) {
      const premium = calculateHomePlanPremium(plan, propertyValue, constructionType, city);
      const savings = currentPremium - premium;

      const addOnsAvailable: string[] = [];
      for (const addOn of insurerData.addOnCosts) {
        if (!plan.addOnsIncluded.includes(addOn.name)) {
          const cost = Math.round((propertyValue / 100000) * addOn.costPerLakh);
          addOnsAvailable.push(`${addOn.name} (${formatCurrency(cost)})`);
        }
      }

      plans.push({
        insurer: insurerKey,
        planName: plan.name,
        premium,
        propertyValue,
        csr: insurerData.csr,
        addOnsIncluded: [...plan.addOnsIncluded],
        addOnsAvailable,
        keyFeatures: [...plan.keyFeatures],
        claimRating: plan.claimProcessRating,
        savings,
        planType: plan.planType,
        fireCover: plan.fireCover,
        earthquakeCover: plan.earthquakeCover,
        floodCover: plan.floodCover,
        badge: '',
      });
    }
  }

  plans.sort((a, b) => a.premium - b.premium);

  if (plans.length > 0) {
    plans[0].badge = 'Lowest Price';

    let bestValueIdx = 0;
    let bestValueScore = 0;
    for (let i = 0; i < plans.length; i++) {
      const eqBonus = plans[i].earthquakeCover ? 15 : 0;
      const score = ((plans[i].claimRating + eqBonus) * plans[i].csr * Math.max(plans[i].addOnsIncluded.length, 1)) / plans[i].premium;
      if (score > bestValueScore) {
        bestValueScore = score;
        bestValueIdx = i;
      }
    }
    plans[bestValueIdx].badge = 'Best Value';

    let bestCovIdx = 0;
    let bestCovScore = 0;
    for (let i = 0; i < plans.length; i++) {
      const eqBonus = plans[i].earthquakeCover ? 15 : 0;
      const floodBonus = plans[i].floodCover ? 10 : 0;
      const score = plans[i].addOnsIncluded.length * 10 + plans[i].csr + plans[i].claimRating * 5 + eqBonus + floodBonus;
      if (score > bestCovScore) {
        bestCovScore = score;
        bestCovIdx = i;
      }
    }
    if (bestCovIdx !== bestValueIdx) {
      plans[bestCovIdx].badge = 'Best Coverage';
    }

    const popularIdx = plans.findIndex(
      (p) =>
        (p.insurer === 'HDFC ERGO' || p.insurer === 'Bajaj Allianz' || p.insurer === 'ICICI Lombard') &&
        p.claimRating >= 4.3,
    );
    if (popularIdx >= 0 && plans[popularIdx].badge === '') {
      plans[popularIdx].badge = 'Most Popular';
    }
  }

  const badgePlans = plans.filter((p) => p.badge !== '');
  const remainingPlans = plans.filter((p) => p.badge === '');
  const selectedPlans: HomeComparisonPlan[] = [];

  for (const p of badgePlans) {
    if (!selectedPlans.find((sp) => sp.insurer === p.insurer && sp.planName === p.planName)) {
      selectedPlans.push(p);
    }
  }

  if (remainingPlans.length > 0) {
    selectedPlans.push(remainingPlans[0]);
  }

  return selectedPlans.slice(0, 5).sort((a, b) => a.premium - b.premium);
}

/** Home insurance recommendations */
function generateHomeRecommendations(healthScore: number, city: string, constructionType: string): string[] {
  const recs: string[] = [];
  const cityKey = city.toLowerCase().replace(/[\s-]/g, '_');
  const cityRisk = CITY_RISK_ZONES[cityKey];

  if (healthScore < 60) {
    recs.push('🔴 Switch to a better home insurer — you\'re likely overpaying or undercovered');
  } else if (healthScore < 80) {
    recs.push('🟡 Compare comprehensive plans with earthquake and flood cover');
  }

  if (cityRisk) {
    if (cityRisk.seismic === 'very_high' || cityRisk.seismic === 'high') {
      recs.push(`⚠️ ${city} is in a ${cityRisk.seismic} seismic zone — Earthquake Cover is ESSENTIAL`);
    }
    if (cityRisk.flood === 'high') {
      recs.push(`⚠️ ${city} is flood-prone — ensure comprehensive flood cover`);
    }
  }

  if (constructionType.toLowerCase() === 'kutcha') {
    recs.push('Kutcha construction has higher premiums — ensure fire cover is comprehensive');
  }

  recs.push('Consider Structure + Content cover for full protection');
  recs.push('Add Valuable Articles cover for jewelry, electronics, and art');
  recs.push('Note: Home insurance attracts 18% GST — factor this into cost comparison');
  recs.push('Review property value annually — ensure sum insured matches reconstruction cost');

  return recs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLAUDE AI DEEP INSIGHTS (Non-blocking, gracefully falls back)
// ═══════════════════════════════════════════════════════════════════════════════

async function getClaudeAIInsights(
  policyDetails: Record<string, unknown>,
  auditResults: Record<string, unknown>,
): Promise<{
  summary: string;
  isOverpaying: boolean;
  overpayingAmount: number;
  coverageGaps: string[];
  moneySavingTips: string[];
  personalizedNote: string;
  detailedBreakdown: string;
  marketComparison: string;
  riskAssessment: string;
  actionPlan: string[];
} | null> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return null;

    const anthropic = new Anthropic({ apiKey });

    const policyType = String(policyDetails.policyType || 'car');
    const isEV = policyType.startsWith('ev_');
    const isHealth = policyType === 'health';
    const isTerm = policyType === 'term';
    const isTravel = policyType === 'travel';
    const isHome = policyType === 'home';
    const isMotor = isEV || policyType === 'car' || policyType === 'bike';

    const systemPrompt = `You are India's #1 insurance audit expert with 20+ years of experience. You have personally audited 10,000+ insurance policies and saved Indian families over ₹50 Crore in wasted premiums.

You are known for:
- Finding hidden overcharges that no one else catches
- Knowing EXACTLY what each insurer charges vs market average
- Understanding IRDAI regulations better than most insurance agents
- Being brutally honest about bad policies
- Recommending only what's truly needed, never upselling

Your analysis style:
- Use REAL market rates and benchmarks (you know them by heart)
- Compare with ackodrive/tataaig actual rates
- Point out SPECIFIC numbers, not vague advice
- Use Hinglish (Hindi+English mix) for all text
- Be direct and honest - if the policy is good, say it; if it's bad, say why

Current Indian Insurance Market Knowledge (2024-25):
- Average car insurance: ₹8,000-18,000/year for ₹5-10L IDV
- Average bike insurance: ₹1,500-4,000/year for ₹50K-1L IDV
- EV insurance: 15-20% cheaper than ICE (lower TP rates)
- Zero Dep add-on: ₹3,000-5,000 for cars, ₹800-1,200 for bikes
- Health insurance: ₹5,000-25,000/year for ₹5-25L cover (age 25-50)
- Term insurance: ₹500-2,000/month for ₹50L-1Cr cover (age 25-40)
- CSR benchmark: Above 95% is good, above 97% is excellent
- NCB: 20% after 1 year, 25% after 2, 35% after 3, 45% after 4, 50% after 5+
- Travel insurance: ₹500-5,000/trip for ₹5-50L cover (domestic/international)
- Home insurance: ₹1,500-10,000/year for ₹25L-2Cr property value
- Travel GST: 18%, Home GST: 18%, Health GST: 0%, Life GST: 0% (from 22 Sept 2025)`;

    const userPrompt = `Analyze this insurance policy audit DEEPLY. Think like a forensic auditor.

POLICY TYPE: ${policyType}
${isEV ? '⚠️ This is an ELECTRIC VEHICLE policy - analyze EV-specific aspects' : ''}
${isHealth ? '⚠️ This is HEALTH INSURANCE - analyze network, room rent, PED waiting' : ''}
${isTerm ? '⚠️ This is TERM INSURANCE - analyze claim settlement, solvency, riders' : ''}
${isTravel ? '✈️ This is TRAVEL INSURANCE - analyze destination risk, medical cover, evacuation, trip cancellation' : ''}
${isHome ? '🏠 This is HOME INSURANCE - analyze property coverage, earthquake/flood risk, reconstruction cost' : ''}
${isMotor ? '📊 This is MOTOR INSURANCE - analyze OD/TP split, add-on value, IDV correctness' : ''}

POLICY DETAILS:
${JSON.stringify(policyDetails, null, 2)}

AUDIT RESULTS:
${JSON.stringify(auditResults, null, 2)}

Respond in Hinglish with this EXACT JSON format:
{
  "summary": "3-4 line Hinglish summary - be SPECIFIC with numbers, not vague. Example: 'Aapki HDFC ERGO car policy ka premium ₹12,000 hai jabki market average ₹9,500 hai - aap roughly ₹2,500 zyada pay kar rahe hain. Zero Dep add-on ki value theek hai lekin Roadside Assistance miss kiya hua hai jo ₹800 mein mil jata.'",
  "isOverpaying": true/false,
  "overpayingAmount": number (realistic estimate based on market rates),
  "coverageGaps": ["Specific gap 1 with impact", "Specific gap 2 with impact", "Specific gap 3 with impact"],
  "moneySavingTips": ["Specific tip 1 with exact ₹ amount", "Specific tip 2 with exact ₹ amount", "Specific tip 3 with exact ₹ amount", "Specific tip 4"],
  "personalizedNote": "3-4 line personal advice in Hinglish - be direct, be specific, name specific insurers that are better",
  "detailedBreakdown": "2-3 paragraph detailed analysis in Hinglish of why the current policy is good or bad, comparing specific line items with market rates. Be specific about OD premium, TP premium, add-on costs.",
  "marketComparison": "2-3 sentence comparison in Hinglish with what other platforms would show for similar coverage. Name specific alternative insurers.",
  "riskAssessment": "2-3 sentence risk assessment in Hinglish - what's the risk if they keep this policy vs switch",
  "actionPlan": ["Step 1: specific action", "Step 2: specific action", "Step 3: specific action", "Step 4: specific action"]
}`;

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || '',
      isOverpaying: parsed.isOverpaying ?? false,
      overpayingAmount: parsed.overpayingAmount ?? 0,
      coverageGaps: parsed.coverageGaps || [],
      moneySavingTips: parsed.moneySavingTips || [],
      personalizedNote: parsed.personalizedNote || '',
      detailedBreakdown: parsed.detailedBreakdown || '',
      marketComparison: parsed.marketComparison || '',
      riskAssessment: parsed.riskAssessment || '',
      actionPlan: parsed.actionPlan || [],
    };
  } catch (error) {
    console.error('Claude AI insights error:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN POST HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = auditSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const {
      policyType, insurer, vehicle, premium, addOns,
      ncb, claimsLast3Years, vehicleAge, name, mobile, email,
      sumInsured, age, familyMembers, coverageType,
      registrationNumber, policyNumber,
      destination, tripDuration, constructionType, city,
    } = data;

    const idv = data.idv || sumInsured || 0;
    const evFlag = isEVType(policyType);
    const motorFlag = isMotorOrEV(policyType);

    // ── MOTOR / EV AUDIT ─────────────────────────────────────
    if (motorFlag) {
      const motorType = getMotorType(policyType);
      const effectiveIDV = idv || 500000;
      const effectiveNCB = ncb || 0;
      const effectiveVehicleAge = vehicleAge || '2-3 years';

      const db = evFlag ? EV_INSURER_DB : INSURER_DB;
      const insurerData = db[insurer] || db['Other'];

      const healthScore = calculateHealthScore(
        insurerData.csr,
        premium / effectiveIDV,
        addOns,
        effectiveVehicleAge,
        insurerData.cashlessGarages,
        insurerData.complaintRatio,
        effectiveNCB,
        claimsLast3Years,
      );

      const savings = calculateSavings(
        premium, effectiveIDV, addOns, insurer, effectiveVehicleAge,
        effectiveNCB, claimsLast3Years, motorType, evFlag,
      );

      const redFlags = generateMotorRedFlags(
        premium, effectiveIDV, insurerData.csr, addOns, effectiveVehicleAge,
        effectiveNCB, claimsLast3Years, insurerData.complaintRatio, evFlag,
      );

      const comparisonPlans = generateComparisonPlans(
        insurer, motorType, effectiveIDV, effectiveVehicleAge,
        effectiveNCB, premium, addOns, evFlag,
      ).slice(0, 5);

      const recommendations = generateMotorRecommendations(healthScore, redFlags, savings, effectiveNCB, evFlag);

      // Find best recommended plan
      const bestPlan = comparisonPlans.find(p => p.badge === 'Best Value') || comparisonPlans[0];

      // Claude AI (non-blocking)
      const aiInsights = await getClaudeAIInsights(
        { policyType, insurer, vehicle, idv: effectiveIDV, premium, addOns, ncb: effectiveNCB, vehicleAge: effectiveVehicleAge, claimsLast3Years, isEV: evFlag },
        { healthScore, potentialSavings: savings.potentialSavings, redFlags: redFlags.length, comparisonPlanCount: comparisonPlans.length },
      );

      // Generate raw text report
      const rawReport = `
INSURANCE REVERSE AUDIT REPORT
================================
Policy Type: ${evFlag ? 'Electric ' : ''}${motorType === 'car' ? 'Car' : 'Bike'} Insurance
Insurer: ${insurer}
Vehicle: ${vehicle || 'N/A'}
IDV: ${formatCurrency(effectiveIDV)}
Premium: ${formatCurrency(premium)}/year
NCB: ${effectiveNCB}%
Claims (3yr): ${claimsLast3Years}
Vehicle Age: ${effectiveVehicleAge}

HEALTH SCORE: ${healthScore}/100 (${getScoreLabel(healthScore)})
POTENTIAL SAVINGS: ${formatCurrency(savings.potentialSavings)}/year

SAVINGS BREAKDOWN:
- IDV Optimization: ${formatCurrency(savings.idvSavings)}
- Add-on Optimization: ${formatCurrency(savings.addOnSavings)}
- Insurer Switch: ${formatCurrency(savings.insurerSwitchSavings)}
- NCB Utilization: ${formatCurrency(savings.ncbSavings)}

RED FLAGS: ${redFlags.length} found
${redFlags.map((f, i) => `  ${i + 1}. [${f.severity.toUpperCase()}] ${f.issue} — ${f.impact}`).join('\n')}

RECOMMENDATIONS:
${recommendations.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

TOP ALTERNATIVE PLANS:
${comparisonPlans.map((p, i) => `  ${i + 1}. ${p.insurer} - ${p.planName}: ${formatCurrency(p.premium)}/yr (Save ${formatCurrency(p.savings)}) [${p.badge || 'Standard'}]`).join('\n')}
`.trim();

      // Store lead in database (non-blocking)
      try {
        const { db: dbClient } = await import('@/lib/db');
        await dbClient.auditLead.create({
          data: {
            policyType,
            insurer,
            vehicle: vehicle || '',
            idv: effectiveIDV,
            premium,
            addOns: JSON.stringify(addOns),
            ncb: effectiveNCB,
            claimsLast3Years,
            vehicleAge: effectiveVehicleAge,
            name,
            mobile,
            email: email || '',
            healthScore,
            potentialSavings: savings.potentialSavings,
          },
        });
      } catch (dbError) {
        console.error('DB save error (non-critical):', dbError);
      }

      return NextResponse.json({
        success: true,
        healthScore,
        potentialSavings: savings.potentialSavings,
        savingsBreakdown: {
          idv: savings.idvSavings,
          addOns: savings.addOnSavings,
          insurerSwitch: savings.insurerSwitchSavings,
          ncb: savings.ncbSavings,
        },
        redFlags,
        recommendations,
        currentPolicy: {
          premium,
          idv: effectiveIDV,
          addOns,
          csr: `${insurerData.csr}%`,
        },
        recommendedPolicy: bestPlan ? {
          insurer: bestPlan.insurer,
          premium: bestPlan.premium,
          idv: effectiveIDV,
          addOns: bestPlan.addOnsIncluded,
          csr: `${bestPlan.csr}%`,
          savings: bestPlan.savings,
        } : null,
        comparisonPlans,
        aiInsights,
        rawReport,
        policyType,
      });
    }

    // ── HEALTH INSURANCE AUDIT ────────────────────────────────
    if (policyType === 'health') {
      const effectiveSumInsured = sumInsured || idv || 500000;
      const effectiveAge = age || 30;
      const effectiveFamilyMembers = familyMembers || 1;

      const healthData = HEALTH_INSURER_DB[insurer] || HEALTH_INSURER_DB['HDFC ERGO'];
      const defaultPED = healthData.plans[0]?.waitingPeriodPED || 36;

      const healthScore = calculateHealthInsuranceScore(
        healthData.csr,
        premium / effectiveSumInsured,
        addOns,
        healthData.networkHospitals,
        healthData.complaintRatio,
        defaultPED,
        effectiveAge,
        effectiveFamilyMembers,
        claimsLast3Years,
      );

      const savings = calculateHealthSavings(
        premium, effectiveSumInsured, addOns, insurer,
        effectiveAge, effectiveFamilyMembers, claimsLast3Years,
      );

      const redFlags = generateHealthRedFlags(
        premium, effectiveSumInsured, healthData.csr, addOns,
        defaultPED, healthData.networkHospitals, effectiveAge, healthData.complaintRatio,
      );

      const comparisonPlans = generateHealthComparisonPlans(
        insurer, effectiveSumInsured, premium, effectiveAge,
        effectiveFamilyMembers, addOns,
      ).slice(0, 5);

      const recommendations = generateHealthRecommendations(healthScore, defaultPED, effectiveAge);

      const bestPlan = comparisonPlans.find(p => p.badge === 'Best Value') || comparisonPlans[0];

      const aiInsights = await getClaudeAIInsights(
        { policyType, insurer, sumInsured: effectiveSumInsured, premium, addOns, age: effectiveAge, familyMembers: effectiveFamilyMembers },
        { healthScore, potentialSavings: savings.potentialSavings },
      );

      const rawReport = `
HEALTH INSURANCE REVERSE AUDIT REPORT
======================================
Insurer: ${insurer}
Sum Insured: ${formatCurrency(effectiveSumInsured)}
Premium: ${formatCurrency(premium)}/year
Age: ${effectiveAge}
Family Members: ${effectiveFamilyMembers}

HEALTH SCORE: ${healthScore}/100 (${getScoreLabel(healthScore)})
POTENTIAL SAVINGS: ${formatCurrency(savings.potentialSavings)}/year
`.trim();

      try {
        const { db: dbClient } = await import('@/lib/db');
        await dbClient.auditLead.create({
          data: {
            policyType,
            insurer,
            vehicle: '',
            idv: effectiveSumInsured,
            premium,
            addOns: JSON.stringify(addOns),
            ncb: 0,
            claimsLast3Years,
            vehicleAge: '',
            name,
            mobile,
            email: email || '',
            healthScore,
            potentialSavings: savings.potentialSavings,
          },
        });
      } catch (dbError) {
        console.error('DB save error (non-critical):', dbError);
      }

      return NextResponse.json({
        success: true,
        healthScore,
        potentialSavings: savings.potentialSavings,
        savingsBreakdown: {
          idv: 0,
          addOns: savings.addOnSavings,
          insurerSwitch: savings.insurerSwitchSavings,
          ncb: 0,
        },
        redFlags,
        recommendations,
        currentPolicy: {
          premium,
          idv: effectiveSumInsured,
          addOns,
          csr: `${healthData.csr}%`,
        },
        recommendedPolicy: bestPlan ? {
          insurer: bestPlan.insurer,
          premium: bestPlan.premium,
          idv: effectiveSumInsured,
          addOns: bestPlan.addOnsIncluded,
          csr: `${bestPlan.csr}%`,
          savings: bestPlan.savings,
        } : null,
        comparisonPlans,
        aiInsights,
        rawReport,
        policyType,
      });
    }

    // ── TERM INSURANCE AUDIT ──────────────────────────────────
    if (policyType === 'term') {
      const effectiveSumAssured = sumInsured || idv || 1000000;
      const effectiveAge = age || 30;

      const termData = TERM_INSURER_DB[insurer] || TERM_INSURER_DB['HDFC Life'];
      const premiumPerLakh = (premium / effectiveSumAssured) * 100000;

      const healthScore = calculateTermInsuranceScore(
        termData.csr,
        premiumPerLakh,
        termData.solvencyRatio,
        termData.claimTurnaroundDays,
        addOns,
        effectiveAge,
        claimsLast3Years,
      );

      const savings = calculateTermSavings(
        premium, effectiveSumAssured, addOns, insurer, effectiveAge,
      );

      const redFlags = generateTermRedFlags(
        premium, effectiveSumAssured, termData.csr,
        termData.solvencyRatio, termData.claimTurnaroundDays, addOns, effectiveAge,
      );

      const comparisonPlans = generateTermComparisonPlans(
        insurer, effectiveSumAssured, premium, effectiveAge, addOns,
      ).slice(0, 5);

      const recommendations = generateTermRecommendations(healthScore, premiumPerLakh, effectiveAge);

      const bestPlan = comparisonPlans.find(p => p.badge === 'Best Value') || comparisonPlans[0];

      const aiInsights = await getClaudeAIInsights(
        { policyType, insurer, sumAssured: effectiveSumAssured, premium, addOns, age: effectiveAge },
        { healthScore, potentialSavings: savings.potentialSavings },
      );

      const rawReport = `
TERM INSURANCE REVERSE AUDIT REPORT
====================================
Insurer: ${insurer}
Sum Assured: ${formatCurrency(effectiveSumAssured)}
Premium: ${formatCurrency(premium)}/year
Age: ${effectiveAge}

HEALTH SCORE: ${healthScore}/100 (${getScoreLabel(healthScore)})
POTENTIAL SAVINGS: ${formatCurrency(savings.potentialSavings)}/year
`.trim();

      try {
        const { db: dbClient } = await import('@/lib/db');
        await dbClient.auditLead.create({
          data: {
            policyType,
            insurer,
            vehicle: '',
            idv: effectiveSumAssured,
            premium,
            addOns: JSON.stringify(addOns),
            ncb: 0,
            claimsLast3Years,
            vehicleAge: '',
            name,
            mobile,
            email: email || '',
            healthScore,
            potentialSavings: savings.potentialSavings,
          },
        });
      } catch (dbError) {
        console.error('DB save error (non-critical):', dbError);
      }

      return NextResponse.json({
        success: true,
        healthScore,
        potentialSavings: savings.potentialSavings,
        savingsBreakdown: {
          idv: 0,
          addOns: 0,
          insurerSwitch: savings.insurerSwitchSavings,
          ncb: savings.riderSavings,
        },
        redFlags,
        recommendations,
        currentPolicy: {
          premium,
          idv: effectiveSumAssured,
          addOns,
          csr: `${termData.csr}%`,
        },
        recommendedPolicy: bestPlan ? {
          insurer: bestPlan.insurer,
          premium: bestPlan.premium,
          idv: effectiveSumAssured,
          addOns: bestPlan.addOnsIncluded,
          csr: `${bestPlan.csr}%`,
          savings: bestPlan.savings,
        } : null,
        comparisonPlans,
        aiInsights,
        rawReport,
        policyType,
      });
    }

    // ── TRAVEL INSURANCE AUDIT ───────────────────────────────
    if (policyType === 'travel') {
      const effectiveSumInsured = sumInsured || idv || 500000;
      const effectiveDestination = destination || 'domestic';
      const effectiveTripDuration = tripDuration || '7 days';

      const travelData = TRAVEL_INSURER_DB[insurer] || TRAVEL_INSURER_DB['HDFC ERGO'];

      const healthScore = calculateTravelInsuranceScore(
        travelData.csr,
        premium / effectiveSumInsured,
        addOns,
        travelData.networkHospitals,
        travelData.complaintRatio,
        effectiveDestination,
        effectiveTripDuration,
      );

      const savings = calculateTravelSavings(
        premium, effectiveSumInsured, addOns, insurer,
        effectiveDestination, effectiveTripDuration,
      );

      const redFlags = generateTravelRedFlags(
        premium, effectiveSumInsured, travelData.csr, addOns,
        effectiveDestination, effectiveTripDuration, travelData.complaintRatio,
      );

      const comparisonPlans = generateTravelComparisonPlans(
        insurer, effectiveSumInsured, premium, effectiveDestination,
        effectiveTripDuration, addOns,
      ).slice(0, 5);

      const recommendations = generateTravelRecommendations(healthScore, effectiveDestination, effectiveTripDuration);

      const bestPlan = comparisonPlans.find(p => p.badge === 'Best Value') || comparisonPlans[0];

      const aiInsights = await getClaudeAIInsights(
        { policyType, insurer, sumInsured: effectiveSumInsured, premium, addOns, destination: effectiveDestination, tripDuration: effectiveTripDuration },
        { healthScore, potentialSavings: savings.potentialSavings },
      );

      const rawReport = `
TRAVEL INSURANCE REVERSE AUDIT REPORT
======================================
Insurer: ${insurer}
Sum Insured: ${formatCurrency(effectiveSumInsured)}
Premium: ${formatCurrency(premium)}/year
Destination: ${effectiveDestination}
Trip Duration: ${effectiveTripDuration}

HEALTH SCORE: ${healthScore}/100 (${getScoreLabel(healthScore)})
POTENTIAL SAVINGS: ${formatCurrency(savings.potentialSavings)}/year
GST: 18% (included in premium)

SAVINGS BREAKDOWN:
- Add-on Optimization: ${formatCurrency(savings.addOnSavings)}
- Insurer Switch: ${formatCurrency(savings.insurerSwitchSavings)}

RED FLAGS: ${redFlags.length} found
${redFlags.map((f, i) => `  ${i + 1}. [${f.severity.toUpperCase()}] ${f.issue} — ${f.impact}`).join('\n')}

RECOMMENDATIONS:
${recommendations.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

TOP ALTERNATIVE PLANS:
${comparisonPlans.map((p, i) => `  ${i + 1}. ${p.insurer} - ${p.planName}: ${formatCurrency(p.premium)}/yr (Save ${formatCurrency(p.savings)}) [${p.badge || 'Standard'}]`).join('\n')}
`.trim();

      try {
        const { db: dbClient } = await import('@/lib/db');
        await dbClient.auditLead.create({
          data: {
            policyType,
            insurer,
            vehicle: '',
            idv: effectiveSumInsured,
            premium,
            addOns: JSON.stringify(addOns),
            ncb: 0,
            claimsLast3Years,
            vehicleAge: '',
            name,
            mobile,
            email: email || '',
            healthScore,
            potentialSavings: savings.potentialSavings,
          },
        });
      } catch (dbError) {
        console.error('DB save error (non-critical):', dbError);
      }

      return NextResponse.json({
        success: true,
        healthScore,
        potentialSavings: savings.potentialSavings,
        savingsBreakdown: {
          idv: 0,
          addOns: savings.addOnSavings,
          insurerSwitch: savings.insurerSwitchSavings,
          ncb: 0,
        },
        redFlags,
        recommendations,
        currentPolicy: {
          premium,
          idv: effectiveSumInsured,
          addOns,
          csr: `${travelData.csr}%`,
        },
        recommendedPolicy: bestPlan ? {
          insurer: bestPlan.insurer,
          premium: bestPlan.premium,
          idv: effectiveSumInsured,
          addOns: bestPlan.addOnsIncluded,
          csr: `${bestPlan.csr}%`,
          savings: bestPlan.savings,
        } : null,
        comparisonPlans,
        aiInsights,
        rawReport,
        policyType,
      });
    }

    // ── HOME INSURANCE AUDIT ─────────────────────────────────
    if (policyType === 'home') {
      const effectivePropertyValue = sumInsured || idv || 5000000;
      const effectiveConstructionType = constructionType || 'Pucca';
      const effectiveCity = city || 'Mumbai';

      const homeData = HOME_INSURER_DB[insurer] || HOME_INSURER_DB['HDFC ERGO'];

      // Check if current plan includes earthquake/flood cover
      const defaultPlan = homeData.plans[0];
      const hasEarthquakeCover = addOns.some(a => a.toLowerCase().includes('earthquake')) || (defaultPlan?.earthquakeCover ?? false);
      const hasFloodCover = addOns.some(a => a.toLowerCase().includes('flood')) || (defaultPlan?.floodCover ?? false);

      const healthScore = calculateHomeInsuranceScore(
        homeData.csr,
        premium / effectivePropertyValue,
        addOns,
        homeData.complaintRatio,
        effectiveConstructionType,
        effectiveCity,
      );

      const savings = calculateHomeSavings(
        premium, effectivePropertyValue, addOns, insurer,
        effectiveConstructionType, effectiveCity,
      );

      const redFlags = generateHomeRedFlags(
        premium, effectivePropertyValue, homeData.csr, addOns,
        effectiveConstructionType, effectiveCity, homeData.complaintRatio,
        hasEarthquakeCover, hasFloodCover,
      );

      const comparisonPlans = generateHomeComparisonPlans(
        insurer, effectivePropertyValue, premium, effectiveConstructionType,
        effectiveCity, addOns,
      ).slice(0, 5);

      const recommendations = generateHomeRecommendations(healthScore, effectiveCity, effectiveConstructionType);

      const bestPlan = comparisonPlans.find(p => p.badge === 'Best Value') || comparisonPlans[0];

      const aiInsights = await getClaudeAIInsights(
        { policyType, insurer, propertyValue: effectivePropertyValue, premium, addOns, constructionType: effectiveConstructionType, city: effectiveCity },
        { healthScore, potentialSavings: savings.potentialSavings },
      );

      const rawReport = `
HOME INSURANCE REVERSE AUDIT REPORT
====================================
Insurer: ${insurer}
Property Value: ${formatCurrency(effectivePropertyValue)}
Premium: ${formatCurrency(premium)}/year
Construction Type: ${effectiveConstructionType}
City: ${effectiveCity}
Earthquake Cover: ${hasEarthquakeCover ? 'Yes' : 'No'}
Flood Cover: ${hasFloodCover ? 'Yes' : 'No'}

HEALTH SCORE: ${healthScore}/100 (${getScoreLabel(healthScore)})
POTENTIAL SAVINGS: ${formatCurrency(savings.potentialSavings)}/year
GST: 18% (included in premium)

SAVINGS BREAKDOWN:
- Add-on Optimization: ${formatCurrency(savings.addOnSavings)}
- Insurer Switch: ${formatCurrency(savings.insurerSwitchSavings)}

RED FLAGS: ${redFlags.length} found
${redFlags.map((f, i) => `  ${i + 1}. [${f.severity.toUpperCase()}] ${f.issue} — ${f.impact}`).join('\n')}

RECOMMENDATIONS:
${recommendations.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

TOP ALTERNATIVE PLANS:
${comparisonPlans.map((p, i) => `  ${i + 1}. ${p.insurer} - ${p.planName}: ${formatCurrency(p.premium)}/yr (Save ${formatCurrency(p.savings)}) [${p.badge || 'Standard'}]`).join('\n')}
`.trim();

      try {
        const { db: dbClient } = await import('@/lib/db');
        await dbClient.auditLead.create({
          data: {
            policyType,
            insurer,
            vehicle: '',
            idv: effectivePropertyValue,
            premium,
            addOns: JSON.stringify(addOns),
            ncb: 0,
            claimsLast3Years,
            vehicleAge: '',
            name,
            mobile,
            email: email || '',
            healthScore,
            potentialSavings: savings.potentialSavings,
          },
        });
      } catch (dbError) {
        console.error('DB save error (non-critical):', dbError);
      }

      return NextResponse.json({
        success: true,
        healthScore,
        potentialSavings: savings.potentialSavings,
        savingsBreakdown: {
          idv: 0,
          addOns: savings.addOnSavings,
          insurerSwitch: savings.insurerSwitchSavings,
          ncb: 0,
        },
        redFlags,
        recommendations,
        currentPolicy: {
          premium,
          idv: effectivePropertyValue,
          addOns,
          csr: `${homeData.csr}%`,
        },
        recommendedPolicy: bestPlan ? {
          insurer: bestPlan.insurer,
          premium: bestPlan.premium,
          idv: effectivePropertyValue,
          addOns: bestPlan.addOnsIncluded,
          csr: `${bestPlan.csr}%`,
          savings: bestPlan.savings,
        } : null,
        comparisonPlans,
        aiInsights,
        rawReport,
        policyType,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid policy type' }, { status: 400 });
  } catch (error: any) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
