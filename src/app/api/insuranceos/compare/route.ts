import { NextRequest, NextResponse } from 'next/server';

// OD Rate Factors (approximate, based on IRDAI filed rates)
const OD_RATE_FACTORS: Record<string, { A: number; B: number }> = {
  'TATA_AIG':      { A: 0.0172, B: 0.0167 },
  'HDFC_ERGO':     { A: 0.0160, B: 0.0155 },
  'GO_DIGIT':      { A: 0.0165, B: 0.0160 },
  'ACKO':          { A: 0.0158, B: 0.0152 },
  'BAJAJ_ALLIANZ': { A: 0.0170, B: 0.0165 },
  'ICICI_LOMBARD': { A: 0.0168, B: 0.0163 },
};

// TP Premiums (IRDAI fixed, EVs get 15% discount)
const TP_RATES: Record<string, Record<string, number>> = {
  'four_wheeler': {
    'PETROL': 7890, 'DIESEL': 7890, 'CNG': 7890, 'ELECTRIC': 6707, 'HYBRID': 7890,
  },
  'two_wheeler': {
    'PETROL_75_150': 1366, 'PETROL_150_350': 3385, 'PETROL_ABOVE_350': 7695,
    'ELECTRIC': 3273,
  },
};

// Add-on rates (percentage of IDV)
const ADDON_RATES: Record<string, Record<string, number>> = {
  'zero_depreciation': { 'TATA_AIG': 0.15, 'HDFC_ERGO': 0.13, 'GO_DIGIT': 0.14, 'ACKO': 0.12, 'BAJAJ_ALLIANZ': 0.15, 'ICICI_LOMBARD': 0.14 },
  'engine_cover': { 'TATA_AIG': 0.02, 'HDFC_ERGO': 0.02, 'GO_DIGIT': 0.018, 'ACKO': 0.015, 'BAJAJ_ALLIANZ': 0.02, 'ICICI_LOMBARD': 0.018 },
  'roadside_assistance': { 'TATA_AIG': 750, 'HDFC_ERGO': 700, 'GO_DIGIT': 650, 'ACKO': 599, 'BAJAJ_ALLIANZ': 750, 'ICICI_LOMBARD': 700 },
  'return_to_invoice': { 'TATA_AIG': 0.04, 'HDFC_ERGO': 0.035, 'GO_DIGIT': 0.038, 'ACKO': 0.03, 'BAJAJ_ALLIANZ': 0.04, 'ICICI_LOMBARD': 0.037 },
  'consumables_cover': { 'TATA_AIG': 0.02, 'HDFC_ERGO': 0.018, 'GO_DIGIT': 0.02, 'ACKO': 0.015, 'BAJAJ_ALLIANZ': 0.02, 'ICICI_LOMBARD': 0.018 },
  'ncb_protection': { 'TATA_AIG': 0.01, 'HDFC_ERGO': 0.01, 'GO_DIGIT': 0.009, 'ACKO': 0.008, 'BAJAJ_ALLIANZ': 0.01, 'ICICI_LOMBARD': 0.009 },
  'pa_cover': { 'TATA_AIG': 750, 'HDFC_ERGO': 750, 'GO_DIGIT': 700, 'ACKO': 699, 'BAJAJ_ALLIANZ': 750, 'ICICI_LOMBARD': 700 },
  'battery_degradation': { 'TATA_AIG': 0.025, 'HDFC_ERGO': 0.022, 'GO_DIGIT': 0.024, 'ACKO': 0.02, 'BAJAJ_ALLIANZ': 0.025, 'ICICI_LOMBARD': 0.023 },
  'charging_cable': { 'TATA_AIG': 500, 'HDFC_ERGO': 450, 'GO_DIGIT': 475, 'ACKO': 399, 'BAJAJ_ALLIANZ': 500, 'ICICI_LOMBARD': 475 },
  'ev_motor_cover': { 'TATA_AIG': 0.02, 'HDFC_ERGO': 0.018, 'GO_DIGIT': 0.019, 'ACKO': 0.015, 'BAJAJ_ALLIANZ': 0.02, 'ICICI_LOMBARD': 0.018 },
};

// CSR data
const CSR_DATA: Record<string, number> = {
  'TATA_AIG': 94.5, 'HDFC_ERGO': 97.8, 'GO_DIGIT': 96.2, 'ACKO': 91.5, 'BAJAJ_ALLIANZ': 95.3, 'ICICI_LOMBARD': 96.7,
};

// Cashless garages
const GARAGE_DATA: Record<string, number> = {
  'TATA_AIG': 7500, 'HDFC_ERGO': 13000, 'GO_DIGIT': 11000, 'ACKO': 5000, 'BAJAJ_ALLIANZ': 9000, 'ICICI_LOMBARD': 10500,
};

const DISPLAY_NAMES: Record<string, string> = {
  'TATA_AIG': 'TATA AIG', 'HDFC_ERGO': 'HDFC ERGO', 'GO_DIGIT': 'Go Digit', 'ACKO': 'Acko', 'BAJAJ_ALLIANZ': 'Bajaj Allianz', 'ICICI_LOMBARD': 'ICICI Lombard',
};

// POST /api/insuranceos/compare - Compare premiums across insurers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicleType, fuelType, idv, zone, addOns, ncbPercent } = body;

    if (!vehicleType || !fuelType || !idv) {
      return NextResponse.json(
        { success: false, error: 'vehicleType, fuelType, and idv are required' },
        { status: 400 }
      );
    }

    const results = Object.entries(OD_RATE_FACTORS).map(([key, rates]) => {
      const zoneKey = (zone || 'B') as 'A' | 'B';
      const odRate = rates[zoneKey];
      const basicOD = idv * odRate;

      // NCB discount on OD
      const ncbDiscount = basicOD * (ncbPercent || 0) / 100;
      const totalOD = basicOD - ncbDiscount;

      // TP premium
      let tpPremium = 7890; // default 4w
      if (vehicleType === 'two_wheeler') {
        tpPremium = fuelType === 'ELECTRIC' ? 3273 : 1366;
      } else {
        tpPremium = fuelType === 'ELECTRIC' ? 6707 : 7890;
      }

      // Add-ons
      const addOnPremiums: { name: string; premium: number }[] = [];
      let totalAddOn = 0;
      if (Array.isArray(addOns)) {
        addOns.forEach((addOn: string) => {
          const addOnKey = addOn.toLowerCase().replace(/[\s-]/g, '_');
          const rateData = ADDON_RATES[addOnKey];
          if (rateData && rateData[key]) {
            const rate = rateData[key];
            const premium = typeof rate === 'number' && rate < 1 ? idv * rate : rate;
            addOnPremiums.push({ name: addOn, premium: Math.round(premium) });
            totalAddOn += Math.round(premium);
          }
        });
      }

      const netPremium = totalOD + tpPremium + totalAddOn + 750; // 750 = PA cover
      const gst = netPremium * 0.18;
      const totalPremium = Math.round(netPremium + gst);

      return {
        insurer: DISPLAY_NAMES[key] || key,
        insurerKey: key,
        basicOD: Math.round(basicOD),
        ncbDiscount: Math.round(ncbDiscount),
        totalOD: Math.round(totalOD),
        tpPremium,
        addOns: addOnPremiums,
        totalAddOn,
        paCover: 750,
        netPremium: Math.round(netPremium),
        gst: Math.round(gst),
        totalPremium,
        csr: CSR_DATA[key] || 95,
        cashlessGarages: GARAGE_DATA[key] || 8000,
        evCover: fuelType === 'ELECTRIC',
      };
    });

    // Sort by lowest premium first
    results.sort((a, b) => a.totalPremium - b.totalPremium);

    // Add badges
    if (results.length > 0) {
      results[0].badge = 'Lowest Price';
      // Find best value (lowest premium + highest CSR)
      const bestValue = results.reduce((best, curr) => {
        const score = (curr.csr / 100) * (1 / curr.totalPremium);
        const bestScore = (best.csr / 100) * (1 / best.totalPremium);
        return score > bestScore ? curr : best;
      });
      if (bestValue !== results[0]) bestValue.badge = 'Best Value';
      // Find highest CSR
      const highestCSR = results.reduce((best, curr) => curr.csr > best.csr ? curr : best);
      if (highestCSR.badge !== 'Lowest Price' && highestCSR.badge !== 'Best Value') highestCSR.badge = 'Best Claims';
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
