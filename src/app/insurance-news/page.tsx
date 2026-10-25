import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Insurance News & IRDAI Updates — Latest Rules, GST & Rate Changes | Paliwal Secure',
  description:
    'Latest Indian insurance news decoded: IRDAI regulations, GST changes on health insurance, third-party motor rate revisions — explained in plain language with actionable takeaways.',
  slug: '/insurance-news',
});

export default function InsuranceNewsPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
