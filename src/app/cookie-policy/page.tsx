import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-utils';
import PageLayout from '@/components/PageLayout';
import ClientContent from './ClientContent';

export const metadata: Metadata = generatePageMetadata({
  title: 'Cookie Policy | Paliwal Secure AI — How We Use Cookies',
  description: 'Paliwal Secure AI cookie policy. Understand how we use cookies for authentication, analytics, and preferences. Learn how to manage or disable cookies in your browser.',
  slug: '/cookie-policy',
});

export default function CookiePolicyPage() {
  return (
    <PageLayout>
      <ClientContent />
    </PageLayout>
  );
}
