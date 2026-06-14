import type { Metadata } from 'next';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Home Insurance Compare — Best Rates 2026 | PaliwalSecure',
  description:
    'Compare home insurance premiums from 8 IRDAI-registered insurers. Structure + Contents coverage with earthquake, flood & burglary protection.',
  keywords: [
    'home insurance compare',
    'compare home insurance India',
    'house insurance compare',
    'property insurance compare',
    'earthquake cover home',
    'flood protection home',
    'Paliwal Secure home',
  ],
  openGraph: {
    title: 'Home Insurance Compare — Best Rates 2026 | PaliwalSecure',
    description:
      'Compare home insurance premiums from 8 IRDAI-registered insurers. Structure + Contents coverage with earthquake & flood protection.',
    url: 'https://paliwalsecure.in/compare/home',
    siteName: 'Paliwal Secure',
    type: 'website',
  },
};

export default function HomeComparePage() {
  return <ClientContent />;
}
