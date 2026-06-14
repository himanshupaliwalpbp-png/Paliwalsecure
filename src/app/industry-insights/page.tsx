import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Insurance Industry Insights 2025-26 | CSR Trends, IRDAI Rules & Market Analysis — Paliwal Secure AI',
  description: 'Data-driven analysis of India\'s insurance market — CSR trends, regulatory updates, compliance checklist, and market opportunities. IRDAI Registered POSP IP429834.',
  slug: '/industry-insights',
});

export default function IndustryInsightsPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
