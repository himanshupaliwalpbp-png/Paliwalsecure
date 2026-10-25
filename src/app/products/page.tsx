import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Products & Tools — Insurance, Banking & Free Calculators | Paliwal Secure',
  description:
    'Every Paliwal Secure offering in one place: term, health, motor & home insurance guides, premium calculators, plan comparison, free policy audit, InsureGPT AI assistant, and the Kotak 811 banking partnership.',
  slug: '/products',
});

export default function ProductsPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
