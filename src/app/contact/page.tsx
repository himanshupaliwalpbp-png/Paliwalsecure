import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Paliwal Secure — Call, WhatsApp or Email Himanshu | Insurance Adviser',
  description:
    'Reach Paliwal Secure directly: Call +91 9257877312, WhatsApp instantly, or email himanshupaliwalpbp@gmail.com. IRDAI Registered POSP IP429834. Response within working hours.',
  slug: '/contact',
});

export default function ContactPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
