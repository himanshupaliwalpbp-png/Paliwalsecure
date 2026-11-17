import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

const RATE_OG = `https://paliwalsecure.in/api/og?title=${encodeURIComponent(
  'Rate Paliwal Secure'
)}&description=${encodeURIComponent(
  'Apni 5-star rating dein — sirf 30 second. 100% genuine customer ratings.'
)}&category=${encodeURIComponent('Customer Rating')}`;

export const metadata: Metadata = generatePageMetadata({
  title: 'Rate Paliwal Secure — 5 Star Customer Rating | Apna Experience Share Karein',
  description:
    'Paliwal Secure (Himanshu Paliwal, IRDAI POSP IP429834) ke saath aapka experience kaisa raha? Apni 5-star rating dein — sirf 30 second mein. 100% genuine customer ratings.',
  slug: '/rate',
  image: RATE_OG,
});

export default function RatePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
