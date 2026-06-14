import type { Metadata } from 'next';
import ClientContent from './ClientContent';

export const metadata: Metadata = {
  title: 'Travel Insurance Compare — Best Rates 2026 | PaliwalSecure',
  description:
    'Compare travel insurance premiums from 7 IRDAI-registered insurers. Senior-friendly plans, 4 destination zones, 6 add-on covers. Instant quotes.',
  keywords: [
    'travel insurance compare',
    'compare travel insurance India',
    'senior travel insurance',
    'international travel insurance',
    'travel insurance premium',
    'Paliwal Secure travel',
  ],
  openGraph: {
    title: 'Travel Insurance Compare — Best Rates 2026 | PaliwalSecure',
    description:
      'Compare travel insurance premiums from 7 IRDAI-registered insurers. Senior-friendly, 4 destination zones, 6 add-on covers.',
    url: 'https://paliwalsecure.in/compare/travel',
    siteName: 'Paliwal Secure',
    type: 'website',
  },
};

export default function TravelComparePage() {
  return <ClientContent />;
}
