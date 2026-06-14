import type { Metadata } from 'next';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Health Insurance Compare — 0% GST Savings | PaliwalSecure',
  description:
    'Compare health insurance premiums from 7 IRDAI-registered insurers. Save 0% GST via POSP route. PED loading, disease-specific recommendations, and add-on covers.',
  keywords: [
    'health insurance compare',
    'compare health insurance India',
    '0% GST health insurance',
    'POSP health insurance',
    'PED loading',
    'health insurance premium calculator',
    'Paliwal Secure health',
  ],
  openGraph: {
    title: 'Health Insurance Compare — 0% GST Savings | PaliwalSecure',
    description:
      'Compare health insurance premiums from 7 IRDAI-registered insurers. 0% GST via POSP route with PED loading & disease-specific recos.',
    url: 'https://paliwalsecure.in/compare/health',
    siteName: 'Paliwal Secure',
    type: 'website',
  },
};

export default function HealthComparePage() {
  return <ClientContent />;
}
