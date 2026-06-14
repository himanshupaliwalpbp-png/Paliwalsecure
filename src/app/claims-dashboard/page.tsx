import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Insurance Claims Dashboard & Guide | Paliwal Secure AI',
  description: 'Track insurance claims, understand claim settlement process, check CSR ratios, and get help with claim rejection. Cashless & reimbursement claim support.',
  slug: '/claims-dashboard',
});

export default function ClaimsDashboardPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
