import type { Metadata } from 'next';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Insurance Compare — Motor, Health, Life, Travel, Home | PaliwalSecure',
  description:
    'Compare insurance rates from IRDAI-registered insurers. Motor, Health, Life, Travel & Home insurance with accurate FY 2024-25 rates. Save up to 18% GST on Health & Life via POSP route.',
  keywords: [
    'insurance compare',
    'compare insurance India',
    'motor insurance compare',
    'health insurance compare',
    'life insurance compare',
    'travel insurance compare',
    'home insurance compare',
    'IRDAI rates',
    'insurance comparison tool',
    'Paliwal Secure compare',
  ],
  openGraph: {
    title: 'Insurance Compare — Motor, Health, Life, Travel, Home | PaliwalSecure',
    description:
      'Compare insurance rates from IRDAI-registered insurers with accurate FY 2024-25 rates. Save up to 18% GST on Health & Life via POSP route.',
    url: 'https://paliwalsecure.in/compare',
    siteName: 'Paliwal Secure',
    type: 'website',
  },
};

export default function ComparePage() {
  return <ClientContent />;
}
