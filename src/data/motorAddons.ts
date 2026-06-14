// ============================================================================
// Paliwal Secure - Motor Insurance Add-ons Data
// ============================================================================

export interface MotorAddon {
  id: string;
  name: string;
  description: string;
  avgCost: string;
  bestForVehicleAge: string;
  recommended: boolean;
}

export const motorAddons: MotorAddon[] = [
  {
    id: 'ma-001',
    name: 'Zero Depreciation Cover',
    description: 'Full claim settlement without deducting depreciation on parts. Get 100% of repair cost covered.',
    avgCost: '₹2,000 - ₹4,000/year',
    bestForVehicleAge: '0-5 years',
    recommended: true,
  },
  {
    id: 'ma-002',
    name: 'Return to Invoice (RTI)',
    description: 'Get the full invoice value (ex-showroom price + registration + road tax) in case of total loss or theft.',
    avgCost: '₹1,500 - ₹3,000/year',
    bestForVehicleAge: '0-3 years',
    recommended: true,
  },
  {
    id: 'ma-003',
    name: 'Engine Protection Cover',
    description: 'Covers damage to engine and gearbox due to water logging, hydrostatic lock, or lubricant leakage.',
    avgCost: '₹800 - ₹2,000/year',
    bestForVehicleAge: '0-7 years',
    recommended: true,
  },
  {
    id: 'ma-004',
    name: 'Roadside Assistance',
    description: '24/7 emergency roadside help including towing, flat tire, battery jumpstart, and fuel delivery.',
    avgCost: '₹500 - ₹1,000/year',
    bestForVehicleAge: 'Any age',
    recommended: true,
  },
  {
    id: 'ma-005',
    name: 'Consumables Cover',
    description: 'Covers cost of consumables like engine oil, gearbox oil, nuts, bolts, screws, and lubricants during claims.',
    avgCost: '₹600 - ₹1,200/year',
    bestForVehicleAge: '0-5 years',
    recommended: false,
  },
  {
    id: 'ma-006',
    name: 'Personal Accident Cover',
    description: 'Covers accidental death and permanent disability of the owner-driver. Mandatory as per IRDAI.',
    avgCost: '₹300 - ₹600/year',
    bestForVehicleAge: 'Any age',
    recommended: true,
  },
  {
    id: 'ma-007',
    name: 'No Claim Bonus Protection',
    description: 'Protects your NCB discount even after a claim. Your NCB stays intact for the next renewal.',
    avgCost: '₹1,000 - ₹2,500/year',
    bestForVehicleAge: '3+ years',
    recommended: false,
  },
  {
    id: 'ma-008',
    name: 'Key Replacement Cover',
    description: 'Covers cost of replacing lost or stolen car keys including locksmith charges and reprogramming.',
    avgCost: '₹400 - ₹800/year',
    bestForVehicleAge: '0-5 years',
    recommended: false,
  },
  {
    id: 'ma-009',
    name: 'Tyre Protection Cover',
    description: 'Covers damage or replacement of tyres due to accident, burst, or cut during an insured event.',
    avgCost: '₹800 - ₹1,500/year',
    bestForVehicleAge: '0-3 years',
    recommended: false,
  },
];
