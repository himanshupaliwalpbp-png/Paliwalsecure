import type { Metadata } from 'next';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Motor Insurance Compare — Car, Bike & EV | PaliwalSecure',
  description:
    'Compare motor insurance premiums from 8 IRDAI-registered insurers. Car, Bike & EV insurance with IRDAI-mandated TP rates, NCB & IDV calculators.',
  keywords: [
    'motor insurance compare',
    'car insurance compare',
    'bike insurance compare',
    'EV insurance compare',
    'IRDAI motor rates',
    'NCB calculator',
    'IDV calculator',
    'Paliwal Secure motor',
  ],
  openGraph: {
    title: 'Motor Insurance Compare — Car, Bike & EV | PaliwalSecure',
    description:
      'Compare motor insurance premiums from 8 IRDAI-registered insurers. IRDAI-mandated TP rates with NCB & IDV calculators.',
    url: 'https://paliwalsecure.in/compare/motor',
    siteName: 'Paliwal Secure',
    type: 'website',
  },
};

export default function MotorComparePage() {
  return <ClientContent />;
}
