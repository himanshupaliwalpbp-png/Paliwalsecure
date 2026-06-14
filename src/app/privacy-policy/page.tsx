import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy | Paliwal Secure AI — Your Data Security Matters',
  description: 'Paliwal Secure AI privacy policy. How we protect your personal data, insurance information, and communication. IRDAI compliant, GDPR-aware data handling.',
  slug: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
