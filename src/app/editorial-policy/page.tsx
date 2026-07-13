import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Editorial Policy — Paliwal Secure',
  description: 'Paliwal Secure editorial policy: how we create, review, and maintain insurance content. E-E-A-T standards, author credentials, and content quality guidelines.',
  alternates: { canonical: 'https://paliwalsecure.in/editorial-policy' },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BreadcrumbSchema items={[{ name: 'Home', url: 'https://paliwalsecure.in' }, { name: 'Editorial Policy', url: 'https://paliwalsecure.in/editorial-policy' }]} />
      <h1 className="text-3xl font-bold mb-6">Editorial Policy</h1>
      <p className="text-slate-600 mb-4">Last updated: January 2026</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
        <p className="text-slate-700 leading-relaxed mb-3">
          Paliwal Secure is committed to producing the most accurate, helpful, and trustworthy insurance content in India.
          Every article is created to help Indians make informed insurance decisions. We follow Google's Helpful Content
          guidelines, E-E-A-T principles, and IRDAI compliance standards.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Content Creation Standards</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>Every article is written or reviewed by Himanshu Paliwal, IRDAI Registered POSP (Code: IP429834)</li>
          <li>Content is created for users first — never for search engines alone</li>
          <li>We do not use AI-generated content without human review and verification</li>
          <li>Every insurance fact is verified against IRDAI publications or official insurer documents</li>
          <li>Premium estimates are clearly marked as "indicative" with ±15% variance disclaimer</li>
          <li>Waiting periods and coverage details are stated as "general guidance" with "verify policy wording" reminders</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Author Credentials</h2>
        <p className="text-slate-700 leading-relaxed mb-3">
          All content is authored by <strong>Himanshu Paliwal</strong>, IRDAI Registered POSP (Point of Sale Person)
          with Code IP429834. This code can be verified on the IRDAI POSP registry. Himanshu has 5+ years of
          experience in insurance advisory and has served 500+ Indian families across health, motor, life, and
          travel insurance.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Content Review Process</h2>
        <ol className="list-decimal list-inside space-y-2 text-slate-700">
          <li>Topic selection based on user search intent and insurance trends</li>
          <li>Initial draft created with real data (IRDAI Annual Report, insurer websites)</li>
          <li>Review for factual accuracy — all CSR data, premium estimates, and tax rules verified</li>
          <li>IRDAI compliance check — disclaimer added, solicitation language reviewed</li>
          <li>Publication with author byline, date, and source references</li>
          <li>Annual review of all content for accuracy and freshness</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Content Updates</h2>
        <p className="text-slate-700 leading-relaxed">
          We review and update content when: (1) IRDAI publishes new regulations, (2) insurers change premiums or
          policy features, (3) tax laws change (annual budget), (4) user feedback indicates errors or gaps.
          Each article displays "Last updated" date for transparency.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Conflict of Interest</h2>
        <p className="text-slate-700 leading-relaxed">
          Paliwal Secure earns commission from insurers when policies are purchased through our platform. This does not
          influence our content — we recommend plans based on user needs, not commission rates. Our comparison tools
          show all 51+ insurers regardless of commission structure. We disclose this relationship transparently.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Contact</h2>
        <p className="text-slate-700">
          Questions about our editorial process? Email: himanshupaliwalpbp@gmail.com or WhatsApp: +91-92587-77312
        </p>
      </section>
    </div>
  );
}
