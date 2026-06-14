import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Tax Saving Guide 2025 — Section 80D, 80C, 80CCC | Paliwal Secure AI',
  description: 'Save up to ₹75,000 under Section 80D on health insurance premiums. Complete guide to insurance tax benefits under 80D, 80C, 80CCC, 80DDB. Expert tips by IRDAI POSP IP429834.',
  slug: '/tax-saving',
});

export default function TaxSavingPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
