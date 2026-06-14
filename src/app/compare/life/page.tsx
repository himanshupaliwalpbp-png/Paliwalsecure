import type { Metadata } from 'next';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Term Insurance Compare — 0% GST + Best CSR | PaliwalSecure',
  description:
    'Compare term life insurance quotes from 8 IRDAI-licensed insurers. 0% GST from 22 Sept 2025. Check CSR, solvency ratios, and find the cheapest term plan.',
  keywords: [
    'term insurance compare',
    'life insurance comparison',
    '0% GST term plan',
    'best CSR term insurance',
    'cheapest term plan',
    'IRDAI term insurance',
    'Paliwal Secure life',
  ],
  openGraph: {
    title: 'Term Insurance Compare — 0% GST + Best CSR | PaliwalSecure',
    description:
      'Compare term life insurance quotes from 8 IRDAI-licensed insurers. 0% GST from 22 Sept 2025. Best CSR & solvency ratios.',
    url: 'https://paliwalsecure.in/compare/life',
    siteName: 'Paliwal Secure',
    type: 'website',
  },
};

export default function LifeComparePage() {
  return <ClientContent />;
}
