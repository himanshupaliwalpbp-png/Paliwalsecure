// API Route: Motor Insurance Comparison
import { NextRequest, NextResponse } from 'next/server';
import { calculateMotorPremium, getSmartRecommendation, type AddOnSelection, type MotorCalculationInput } from '@/lib/motor-calculator';
import { VEHICLE_DB, type Vehicle } from '@/lib/vehicle-database';
import { IDV_DEP, NCB_SCHEDULE } from '@/lib/motor-rates-calibrated';

// Convert frontend addOn IDs (string[]) to calculator AddOnSelection object
function convertAddOns(addOns: string[] | AddOnSelection | undefined): AddOnSelection {
  if (!addOns) {
    return { nilDep: false, rti: false, rsa: false, consumables: false, engineProtect: false, tyreProtect: false, evCover: false, ncbProtect: false, keyReplacement: false, passengerCover: false, lossOfBelongings: false, hospitalDailyCash: false, personalAccidentEnhanced: false, windshieldCover: false };
  }
  // If already an object with boolean values, use it directly
  if (!Array.isArray(addOns)) {
    return {
      nilDep: !!(addOns as AddOnSelection).nilDep,
      rti: !!(addOns as AddOnSelection).rti,
      rsa: !!(addOns as AddOnSelection).rsa,
      consumables: !!(addOns as AddOnSelection).consumables,
      engineProtect: !!(addOns as AddOnSelection).engineProtect,
      tyreProtect: !!(addOns as AddOnSelection).tyreProtect,
      evCover: !!(addOns as AddOnSelection).evCover,
      ncbProtect: !!(addOns as AddOnSelection).ncbProtect,
      keyReplacement: !!(addOns as AddOnSelection).keyReplacement,
      passengerCover: !!(addOns as AddOnSelection).passengerCover,
      lossOfBelongings: !!(addOns as AddOnSelection).lossOfBelongings,
      hospitalDailyCash: !!(addOns as AddOnSelection).hospitalDailyCash,
      personalAccidentEnhanced: !!(addOns as AddOnSelection).personalAccidentEnhanced,
      windshieldCover: !!(addOns as AddOnSelection).windshieldCover,
    };
  }
  // Convert string array: ['zeroDep', 'rsa', ...] → AddOnSelection
  const arr = addOns as string[];
  return {
    nilDep: arr.includes('zeroDep'),
    rti: arr.includes('returnToInvoice'),
    rsa: arr.includes('roadSideAssistance'),
    consumables: arr.includes('consumables'),
    engineProtect: arr.includes('engineProtect'),
    tyreProtect: arr.includes('tyreProtect'),
    evCover: arr.includes('evMotorCover'),
    ncbProtect: arr.includes('ncbProtect'),
    keyReplacement: arr.includes('keyReplacement'),
    passengerCover: arr.includes('passengerCover'),
    lossOfBelongings: arr.includes('lossOfBelongings'),
    hospitalDailyCash: arr.includes('hospitalDailyCash'),
    personalAccidentEnhanced: arr.includes('personalAccidentEnhanced'),
    windshieldCover: arr.includes('windshieldCover'),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { vehicleId, year, idv, zone, ncbYears, isNew, addOns } = body as {
      vehicleId: string;
      year: number;
      idv?: number;
      zone: 'A' | 'B';
      ncbYears: number;
      isNew: boolean;
      addOns: string[] | AddOnSelection;
    };

    if (!vehicleId || !year || !zone) {
      return NextResponse.json(
        { error: 'vehicleId, year, and zone are required' },
        { status: 400 }
      );
    }

    const convertedAddOns = convertAddOns(addOns);

    const input: MotorCalculationInput = {
      vehicleId,
      year,
      idv,
      zone,
      ncbYears: ncbYears ?? 0,
      isNew: isNew ?? false,
      addOns: convertedAddOns,
    };

    let quotes = calculateMotorPremium(input);

    // Add insurerId to each quote for frontend key usage
    quotes = quotes.map(q => ({ ...q, insurerId: q.insurer }));

    const vehicle = VEHICLE_DB.find(v => v.id === vehicleId);
    const vehicleAge = new Date().getFullYear() - year;
    const recommendation = vehicle
      ? getSmartRecommendation(quotes, vehicle, vehicleAge, zone)
      : null;

    // Calculate meta info for the frontend
    const depKey = Math.min(vehicleAge, 5);
    const depreciationPercent = (IDV_DEP[depKey] ?? 0.40) * 100;
    const estimatedIDV = vehicle ? Math.round(vehicle.exShowroom2026 * (1 - (IDV_DEP[depKey] ?? 0.40))) : 0;
    const ncbDiscountPercent = (NCB_SCHEDULE[Math.min(ncbYears ?? 0, 5)] ?? 0) * 100;
    const selectedAddOnNames = Object.entries(convertedAddOns)
      .filter(([, v]) => v)
      .map(([k]) => k);

    return NextResponse.json({
      quotes,
      recommendation,
      vehicle: vehicle ? {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        type: vehicle.type,
        fuelType: vehicle.fuelType,
        cc: vehicle.cc,
        kw: vehicle.kw,
        exShowroom: vehicle.exShowroom2026,
        segment: getSegment(vehicle),
      } : null,
      meta: {
        year,
        zone,
        ncbYears: ncbYears ?? 0,
        isNew: isNew ?? false,
        estimatedIDV,
        addOns: selectedAddOnNames,
        ncbDiscountPercent,
        depreciationPercent,
        generatedAt: new Date().toISOString(),
        source: 'IRDAI Calibrated — 5 real policies (May 2026)',
        tpAccuracy: '100% (IRDAI/MoRTH fixed)',
        odAccuracy: '±8-15% (insurer loading/discount may apply)',
        addonAccuracy: '±10-20% (varies by policy)',
        lastCalibrated: 'May 2026',
      },
    });
  } catch (error) {
    console.error('Motor compare error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate premiums' },
      { status: 500 }
    );
  }
}

function getSegment(vehicle: Vehicle): string {
  if (vehicle.type === 'BIKE' || vehicle.type === 'SCOOTER') {
    if ((vehicle.cc ?? 0) <= 110) return 'Entry Commuter';
    if ((vehicle.cc ?? 0) <= 150) return 'Commuter';
    if ((vehicle.cc ?? 0) <= 200) return 'Sports Commuter';
    return 'Premium';
  }
  if (vehicle.type === 'EV_BIKE') {
    if ((vehicle.kw ?? 0) <= 1) return 'Low Speed EV';
    if ((vehicle.kw ?? 0) <= 4) return 'Mid Speed EV';
    return 'High Speed EV';
  }
  if (vehicle.type === 'CAR') {
    if ((vehicle.cc ?? 0) <= 1000) return 'Hatchback';
    if ((vehicle.cc ?? 0) <= 1500) return 'Mid Sedan/SUV';
    return 'Premium SUV';
  }
  if (vehicle.type === 'EV_CAR') {
    if ((vehicle.kw ?? 0) <= 30) return 'Entry EV';
    if ((vehicle.kw ?? 0) <= 65) return 'Mid EV';
    return 'Premium EV';
  }
  return 'Standard';
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || '';

  // Search vehicles
  const q = query.toLowerCase();
  let results = VEHICLE_DB.filter(v => {
    const matchesQuery = v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.id.toLowerCase().includes(q);
    if (!matchesQuery) return false;

    if (type && type !== 'all') {
      if (type === 'BIKE') return v.type === 'BIKE' || v.type === 'SCOOTER';
      if (type === 'EV_BIKE') return v.type === 'EV_BIKE';
      if (type === 'CAR') return v.type === 'CAR';
      if (type === 'EV_CAR') return v.type === 'EV_CAR';
    }
    return true;
  }).slice(0, 12).map(v => ({
    id: v.id,
    make: v.make,
    model: v.model,
    type: v.type,
    fuelType: v.fuelType,
    cc: v.cc,
    kw: v.kw,
    exShowroom: v.exShowroom2026,
    popular: v.popular,
  }));

  return NextResponse.json({ vehicles: results });
}
