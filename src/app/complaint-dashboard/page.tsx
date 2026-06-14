import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Insurance Complaint Dashboard — IRDAI FY 2024-25 | Paliwal Secure AI',
  description: 'IRDAI complaint data for Indian insurers — grievance ratios, pendency rates, and claim settlement analysis. Compare insurers before you buy. POSP IP429834.',
  slug: '/complaint-dashboard',
});

export default function ComplaintDashboardPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
