import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Paliwal Secure AI — IRDAI Registered Insurance Advisor India',
  description: 'Learn about Paliwal Secure AI — India\'s AI-powered insurance advisory by Himanshu Paliwal, IRDAI Registered POSP (IP429834). Trusted by 500+ families across Kota, Rajasthan.',
  slug: '/about',
});

export default function AboutPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
