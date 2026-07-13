import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog-data';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Sitemap — All Insurance Guides & Pages | Paliwal Secure',
  description: 'Complete sitemap of Paliwal Secure — India\'s AI-powered insurance platform. Browse 390+ insurance guides, comparison tools, calculators, claim guides, and city-specific resources.',
  alternates: { canonical: 'https://paliwalsecure.in/sitemap-html' },
  robots: { index: true, follow: true },
};

export default function SitemapHTMLPage() {
  // Group blog posts by category
  const categories: Record<string, typeof blogPosts> = {};
  for (const post of blogPosts) {
    const slug = post.slug;
    let cat = 'Other';
    if (slug.includes('car') || slug.includes('motor') || slug.includes('bike') || slug.includes('vehicle') || slug.includes('ev') || slug.includes('hyundai') || slug.includes('maruti') || slug.includes('tata') || slug.includes('honda') || slug.includes('kia') || slug.includes('mahindra') || slug.includes('toyota') || slug.includes('mg') || slug.includes('skoda') || slug.includes('volkswagen') || slug.includes('renault') || slug.includes('nissan') || slug.includes('bajaj') || slug.includes('yamaha') || slug.includes('ktm')) cat = 'Motor Insurance';
    else if (slug.includes('health') || slug.includes('mediclaim') || slug.includes('maternity') || slug.includes('diabetic') || slug.includes('senior') || slug.includes('critical')) cat = 'Health Insurance';
    else if (slug.includes('term') || slug.includes('life') || slug.includes('ulip')) cat = 'Life Insurance';
    else if (slug.includes('travel')) cat = 'Travel Insurance';
    else if (slug.includes('home') || slug.includes('property')) cat = 'Home Insurance';
    else if (slug.includes('tax') || slug.includes('gst') || slug.includes('80d') || slug.includes('80c')) cat = 'Tax & Insurance';
    else if (slug.includes('claim') || slug.includes('cashless')) cat = 'Claims Guide';
    else if (slug.includes('vs') || slug.includes('compar')) cat = 'Comparisons';
    else if (slug.includes('city') || slug.includes('delhi') || slug.includes('mumbai') || slug.includes('bangalore') || slug.includes('jaipur') || slug.includes('kota')) cat = 'City Guides';
    else if (slug.includes('for-') && (slug.includes('india') || slug.includes('2026'))) cat = 'Profession & Business';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(post);
  }

  const categoryOrder = ['Health Insurance', 'Motor Insurance', 'Life Insurance', 'Travel Insurance', 'Home Insurance', 'Tax & Insurance', 'Claims Guide', 'Comparisons', 'City Guides', 'Profession & Business', 'Other'];

  return (
    <div className="min-h-screen bg-slate-50">
      <BreadcrumbSchema path="/sitemap-html" />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Sitemap</h1>
        <p className="text-slate-600 mb-8">
          Complete index of {blogPosts.length}+ insurance guides, tools, and resources on Paliwal Secure.
          India's #1 AI-powered insurance knowledge platform.
        </p>

        {/* Main Pages */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">Main Pages</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { href: '/', label: 'Homepage' },
              { href: '/health-insurance', label: 'Health Insurance' },
              { href: '/car-insurance', label: 'Car Insurance' },
              { href: '/bike-insurance', label: 'Bike Insurance' },
              { href: '/life-insurance', label: 'Life Insurance' },
              { href: '/travel-insurance', label: 'Travel Insurance' },
              { href: '/home-insurance', label: 'Home Insurance' },
              { href: '/compare', label: 'Compare Plans' },
              { href: '/insuregpt', label: 'InsureGPT AI' },
              { href: '/calculators', label: 'Insurance Calculators' },
              { href: '/free-audit', label: 'Free Policy Audit' },
              { href: '/claim-guide', label: 'Claim Guide' },
              { href: '/blog', label: 'Insurance Blog' },
              { href: '/kota-insurance-agent', label: 'Kota Insurance Agent' },
              { href: '/about', label: 'About' },
              { href: '/about/himanshu-paliwal', label: 'About Himanshu Paliwal' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="block p-3 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all">
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Tools & Resources */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">Tools & Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { href: '/insurance-glossary', label: 'Insurance Glossary' },
              { href: '/insurance-faq', label: 'Insurance FAQ' },
              { href: '/insurance-mistakes-to-avoid', label: 'Common Mistakes' },
              { href: '/claim-settlement-ratio', label: 'Claim Settlement Ratio' },
              { href: '/idv-calculation', label: 'IDV Calculation' },
              { href: '/ncb-meaning', label: 'NCB Meaning' },
              { href: '/zero-dep-car-insurance', label: 'Zero Depreciation' },
              { href: '/tax-saving', label: 'Tax Saving (80D)' },
              { href: '/policyholder-rights', label: 'Policyholder Rights' },
              { href: '/cashless-claim-guide', label: 'Cashless Claim Guide' },
              { href: '/best-health-insurance-india', label: 'Best Health Insurance India' },
              { href: '/best-term-insurance-india', label: 'Best Term Insurance India' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="block p-3 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all">
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Blog Posts by Category */}
        {categoryOrder.map((cat) => {
          const posts = categories[cat];
          if (!posts || posts.length === 0) return null;
          return (
            <section key={cat} className="mb-10">
              <h2 className="text-xl font-semibold text-slate-900 mb-2 pb-2 border-b border-slate-200">
                {cat} <span className="text-sm font-normal text-slate-400">({posts.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {posts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block p-2 rounded hover:bg-amber-50 transition-colors">
                    <span className="text-sm text-slate-600 hover:text-amber-700">{post.title}</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* Legal */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">Legal & Policies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { href: '/privacy-policy', label: 'Privacy Policy' },
              { href: '/terms-of-service', label: 'Terms of Service' },
              { href: '/disclaimer', label: 'Disclaimer' },
              { href: '/cookie-policy', label: 'Cookie Policy' },
              { href: '/grievance-policy', label: 'Grievance Policy' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="block p-3 rounded-lg bg-white border border-slate-200 hover:border-amber-400 transition-all">
                <span className="text-sm text-slate-600">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            Total pages: {blogPosts.length + 30}+ · Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            <Link href="/sitemap.xml" className="text-amber-600 hover:underline">XML Sitemap</Link>
            {' · '}
            <Link href="/feed.xml" className="text-amber-600 hover:underline">RSS Feed</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
