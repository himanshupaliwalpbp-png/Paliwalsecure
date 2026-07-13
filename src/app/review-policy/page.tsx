import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Review Policy — Paliwal Secure',
  description: 'How Paliwal Secure reviews and moderates customer reviews.',
  alternates: { canonical: 'https://paliwalsecure.in/review-policy' },
};

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://paliwalsecure.in' }, { name: 'Review Policy', url: 'https://paliwalsecure.in/review-policy' }]} />
      <h1 className="text-3xl font-bold mb-6">Review Policy</h1>
      <p className="text-slate-600 mb-4">Last updated: January 2026</p>
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-700 leading-relaxed mb-4">All customer reviews on Paliwal Secure are moderated before publication. We verify that the reviewer is a genuine insurance customer. Reviews are not edited except to remove personally identifiable information or offensive language. We do not pay for reviews or incentivize positive ratings. Negative reviews are published if they meet our guidelines. Reviews are checked for factual accuracy — if a review claims a specific CSR or premium, we verify against IRDAI data.</p>
      </div>
    </div>
  );
}
