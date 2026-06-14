import { NextRequest, NextResponse } from 'next/server';
import {
  calculateMotorQuote,
  formatINR,
  type MotorVehicleType,
  type MotorCCBand,
  type MotorAddOn,
} from '@/lib/compare/compare-engine';
import { INSURER_MASTER } from '@/lib/compare/insurer-master';
import { getVehicleById, type VehicleCategory } from '@/lib/compare/vehicle-database';

// ---------------------------------------------------------------------------
// TypeScript Types
// ---------------------------------------------------------------------------
interface MotorCompareRequest {
  vehicleCategory: VehicleCategory;
  vehicleId?: string;
  makeModel?: string;
  fuelType: string;
  registrationYear: number;
  rtoCode: string;
  exShowroomPrice: number;
  engineCC: number;
  seatingCapacity?: number;
  ncbYears: number;
  addons: string[];
}

// ---------------------------------------------------------------------------
// Motor Insurers
// ---------------------------------------------------------------------------
const MOTOR_INSURERS = [
  'HDFC_ERGO',
  'ACKO',
  'GO_DIGIT',
  'ICICI_LOMBARD',
  'TATA_AIG',
  'BAJAJ_ALLIANZ',
  'NEW_INDIA',
  'RELIANCE',
];

// ---------------------------------------------------------------------------
// CC / kW Band Mapping
// ---------------------------------------------------------------------------
function getCCBand(vehicleCategory: string, exShowroomPrice: number, engineCC: number, powerKW?: number): MotorCCBand {
  if (vehicleCategory === 'EV_CAR') {
    if ((powerKW ?? 0) <= 30 || exShowroomPrice <= 1500000) return 'upto30kW';
    if ((powerKW ?? 0) <= 65 || exShowroomPrice <= 2500000) return '30to65kW';
    return 'above65kW';
  }
  if (vehicleCategory === 'EV_BIKE') {
    if ((powerKW ?? 0) <= 4 || exShowroomPrice <= 100000) return 'upto4kW';
    if ((powerKW ?? 0) <= 25 || exShowroomPrice <= 200000) return '4to25kW';
    return 'above25kW';
  }
  if (vehicleCategory === 'Bike') {
    if (engineCC <= 75) return 'upTo75cc';
    if (engineCC <= 150) return '76to150cc';
    if (engineCC <= 350) return '151to350cc';
    return 'above350cc';
  }
  // Car
  if (engineCC <= 1000) return 'upTo1000cc';
  if (engineCC <= 1500) return '1001to1500cc';
  return 'above1500cc';
}

// ---------------------------------------------------------------------------
// Zone Helper
// ---------------------------------------------------------------------------
const ZONE_A_RTO_PREFIXES = ['DL', 'MH01', 'MH02', 'MH03', 'KA', 'TN01', 'TN02', 'GJ01', 'TS', 'AP01', 'PN'];

function getZone(rtoCode: string): 'A' | 'B' {
  return ZONE_A_RTO_PREFIXES.some((z) => rtoCode.trim().toUpperCase().startsWith(z)) ? 'A' : 'B';
}

// ---------------------------------------------------------------------------
// Map form category to engine vehicle type
// ---------------------------------------------------------------------------
function mapVehicleType(category: string): MotorVehicleType {
  const mapping: Record<string, MotorVehicleType> = {
    Car: 'Car',
    Bike: 'Bike',
    EV_CAR: 'EV_CAR',
    EV_BIKE: 'EV_BIKE',
  };
  return mapping[category] ?? 'Car';
}

// ---------------------------------------------------------------------------
// POST Handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body: MotorCompareRequest = await request.json();
    const {
      vehicleCategory,
      vehicleId,
      fuelType,
      registrationYear,
      rtoCode,
      exShowroomPrice,
      engineCC,
      ncbYears,
      addons,
    } = body;

    // Validate required fields
    if (!vehicleCategory || !exShowroomPrice || !rtoCode) {
      return NextResponse.json(
        { error: 'Missing required fields: vehicleCategory, exShowroomPrice, rtoCode' },
        { status: 400 }
      );
    }

    // Look up vehicle from database if vehicleId provided
    let resolvedExShowroom = exShowroomPrice;
    let resolvedEngineCC = engineCC ?? 0;
    let resolvedFuelType = fuelType ?? 'Petrol';
    let powerKW: number | undefined;

    if (vehicleId) {
      const vehicle = getVehicleById(vehicleId);
      if (vehicle) {
        resolvedExShowroom = vehicle.exShowroomPrice;
        resolvedEngineCC = vehicle.engineCC;
        resolvedFuelType = vehicle.fuelType;
        powerKW = vehicle.powerKW;
      }
    }

    // Calculate
    const vehicleType = mapVehicleType(vehicleCategory);
    const ccBand = getCCBand(vehicleCategory, resolvedExShowroom, resolvedEngineCC, powerKW);
    const currentYear = new Date().getFullYear();
    const ageYears = Math.max(0, currentYear - (registrationYear ?? currentYear));
    const zone = getZone(rtoCode);
    const isNew = registrationYear === currentYear;
    const isCNG = resolvedFuelType === 'CNG';

    const vehicleDetailsForCalc = {
      vehicleType,
      ccBand,
      exShowroomPrice: resolvedExShowroom,
      ageYears,
      zone,
      isNew,
      ncbYears: Math.min(ncbYears ?? 0, 5),
      isCNG,
    };

    const selectedAddOns = (addons ?? []) as MotorAddOn[];

    const quotes: any[] = MOTOR_INSURERS.map((insurerId) => {
      const quote = calculateMotorQuote(vehicleDetailsForCalc, insurerId, selectedAddOns);
      const insurerRecord = INSURER_MASTER[insurerId];
      return {
        insurerId,
        insurerName: insurerRecord?.shortName ?? insurerId,
        exShowroomPrice: resolvedExShowroom,
        ...quote,
        zone,
        vehicleType,
        ccBand,
        ageYears,
      };
    });

    // Sort by total premium (cheapest first)
    quotes.sort((a, b) => (a.totalPremium ?? Infinity) - (b.totalPremium ?? Infinity));

    // Mark first as recommended
    if (quotes.length > 0) {
      quotes[0].isRecommended = true;
    }

    const response = NextResponse.json({ quotes });

    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Motor comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate motor quotes', details: message },
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
