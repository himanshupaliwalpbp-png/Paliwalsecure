import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms of Service | Paliwal Secure AI — Insurance Advisory Terms',
  description: 'Terms of service for Paliwal Secure AI insurance advisory platform. IRDAI compliant terms, usage policies, and service agreements.',
  slug: '/terms-of-service',
});

export default function TermsOfServicePage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
