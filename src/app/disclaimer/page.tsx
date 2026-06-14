import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Disclaimer | Paliwal Secure AI — IRDAI Compliance & Legal Disclaimer',
  description: 'Legal disclaimer for Paliwal Secure AI. Insurance is subject matter of solicitation. IRDAI Registered POSP IP429834. Read important disclosures.',
  slug: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
