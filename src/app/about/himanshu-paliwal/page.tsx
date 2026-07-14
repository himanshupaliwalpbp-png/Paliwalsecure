import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Himanshu Paliwal — IRDAI Registered POSP IP429834 | Insurance Expert | Paliwal Secure AI',
  description:
    'Himanshu Paliwal is an IRDAI Registered POSP (Code: IP429834) based in Kota, Rajasthan, India. Founder of Paliwal Secure AI — India\'s AI-powered insurance advisor platform. 500+ families served. Expert in health, life, motor, travel, and home insurance.',
  keywords: [
    'Himanshu Paliwal insurance',
    'IRDAI POSP IP429834',
    'insurance advisor Kota Rajasthan',
    'Paliwal Secure founder',
    'Indian insurance expert',
    'AI insurance advisor India',
    'insurance consultant India',
  ],
  alternates: {
    canonical: 'https://paliwalsecure.in/about/himanshu-paliwal',
  },
  openGraph: {
    title: 'Himanshu Paliwal — IRDAI POSP IP429834 | Insurance Expert',
    description: 'IRDAI Registered POSP, Founder of Paliwal Secure AI. 500+ families served. Kota, Rajasthan, India.',
    url: 'https://paliwalsecure.in/about/himanshu-paliwal',
    type: 'profile',
  },
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Himanshu Paliwal',
  jobTitle: 'IRDAI Registered POSP (Point of Sale Person)',
  identifier: 'IP429834',
  worksFor: {
    '@type': 'Organization',
    name: 'Paliwal Secure AI',
    url: 'https://paliwalsecure.in',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kota',
    addressRegion: 'Rajasthan',
    addressCountry: 'IN',
  },
  telephone: '+91-92587-77312',
  email: 'himanshupaliwalpbp@gmail.com',
  url: 'https://paliwalsecure.in/about/himanshu-paliwal',
  image: 'https://paliwalsecure.in/images/himanshu-photo.jpg',
  knowsAbout: [
    'Health Insurance India',
    'Life Insurance India',
    'Term Insurance India',
    'Motor Insurance India',
    'Travel Insurance India',
    'Home Insurance India',
    'IRDAI Regulations',
    'Insurance Claim Settlement',
    'Insurance Premium Calculation',
    'Cashless Health Insurance',
    'Family Floater Insurance',
    'Senior Citizen Insurance',
    'Critical Illness Insurance',
    'Section 80D Tax Savings',
    'Insurance Portability',
  ],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'IRDAI Certified POSP Training',
  },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'IRDAI Point of Sale Person License',
    identifier: 'IP429834',
    credentialCategory: 'Insurance License',
    recognizedBy: {
      '@type': 'GovernmentOrganization',
      name: 'Insurance Regulatory and Development Authority of India (IRDAI)',
    },
  },
};

export default function HimanshuPaliwalPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F4EF] dark:bg-[rgba(45,106,79,0.18)] border border-[rgba(45,106,79,0.25)] text-[#2D6A4F] dark:text-[#6EE7B7] text-xs font-semibold mb-6">
            IRDAI Registered POSP • Code: IP429834
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0E1116] dark:text-[#FAF7F2] mb-4">
            Himanshu Paliwal
          </h1>
          <p className="text-lg sm:text-xl text-[#4A4F57] dark:text-[#A8B0C2] max-w-2xl mx-auto mb-6">
            Founder of Paliwal Secure AI — India's AI-powered insurance advisor platform.
            IRDAI Registered POSP, Kota, Rajasthan. 500+ families served.
          </p>
        </div>
      </section>

      {/* Profile */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Photo + Quick Info */}
          <div className="md:col-span-1">
            <div className="rounded-2xl bg-white dark:bg-[#161A24] p-6 border border-[rgba(15,19,32,0.08)] dark:border-[rgba(232,200,114,0.10)] text-center">
              <img
                src="/images/himanshu-photo.jpg"
                alt="Himanshu Paliwal — IRDAI Registered POSP IP429834"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                width={128}
                height={128}
              />
              <h2 className="text-lg font-bold text-[#0E1116] dark:text-[#FAF7F2]">Himanshu Paliwal</h2>
              <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2] mt-1">IRDAI Registered POSP</p>
              <p className="text-xs text-[#B8482C] font-semibold mt-1">Code: IP429834</p>
              <div className="mt-4 pt-4 border-t border-[rgba(15,19,32,0.08)] space-y-2 text-sm text-left">
                <div className="flex justify-between">
                  <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Location</span>
                  <span className="font-medium text-[#0E1116] dark:text-[#FAF7F2]">Kota, Rajasthan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Families served</span>
                  <span className="font-medium text-[#0E1116] dark:text-[#FAF7F2]">500+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Rating</span>
                  <span className="font-medium text-[#2D6A4F]">4.9/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4A4F57] dark:text-[#A8B0C2]">Phone</span>
                  <span className="font-medium text-[#0E1116] dark:text-[#FAF7F2]">WhatsApp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <div className="rounded-2xl bg-white dark:bg-[#161A24] p-6 border border-[rgba(15,19,32,0.08)] dark:border-[rgba(232,200,114,0.10)]">
              <h2 className="text-xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-4">
                About Himanshu Paliwal
              </h2>
              <div className="space-y-4 text-sm text-[#4A4F57] dark:text-[#A8B0C2] leading-relaxed">
                <p>
                  <strong className="text-[#0E1116] dark:text-[#FAF7F2]">Himanshu Paliwal</strong> is an
                  IRDAI Registered Point of Sale Person (POSP) with certification code <strong className="text-[#B8482C]">IP429834</strong>.
                  He is the founder of <strong className="text-[#0E1116] dark:text-[#FAF7F2]">Paliwal Secure AI</strong> —
                  India's AI-powered insurance advisor platform based in Kota, Rajasthan.
                </p>
                <p>
                  With over <strong className="text-[#0E1116] dark:text-[#FAF7F2]">500 Indian families served</strong>,
                  Himanshu has established himself as a trusted insurance advisor in Rajasthan and across India.
                  His platform compares <strong className="text-[#0E1116] dark:text-[#FAF7F2]">51+ IRDAI-registered insurers</strong> and
                  provides AI-powered recommendations through <strong className="text-[#0E1116] dark:text-[#FAF7F2]">InsureGPT</strong> —
                  a 24/7 AI chatbot that answers insurance questions in Hinglish, Hindi, and English.
                </p>
                <p>
                  Himanshu specializes in <strong className="text-[#0E1116] dark:text-[#FAF7F2]">health insurance</strong> (family floater,
                  senior citizen, disease-specific plans), <strong className="text-[#0E1116] dark:text-[#FAF7F2]">term insurance</strong> (Rs 1 Crore+ cover),
                  <strong className="text-[#0E1116] dark:text-[#FAF7F2]"> motor insurance</strong> (car, bike, EV),
                  <strong className="text-[#0E1116] dark:text-[#FAF7F2]"> travel insurance</strong>, and
                  <strong className="text-[#0E1116] dark:text-[#FAF7F2]"> home insurance</strong>.
                  He is known for his transparent, no-pressure approach and end-to-end claim support.
                </p>
                <p>
                  As an IRDAI-certified POSP, Himanshu is legally authorized to sell insurance across India.
                  His POSP code <strong className="text-[#B8482C]">IP429834</strong> can be verified on the
                  IRDAI website. He maintains strict compliance with all IRDAI regulations and guidelines.
                </p>
              </div>
            </div>

            {/* Expertise */}
            <div className="rounded-2xl bg-white dark:bg-[#161A24] p-6 border border-[rgba(15,19,32,0.08)] dark:border-[rgba(232,200,114,0.10)] mt-4">
              <h2 className="text-xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-4">
                Areas of Expertise
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Health Insurance (Family Floater, Senior Citizen, Disease-Specific)',
                  'Term Insurance (Rs 1-10 Crore Cover, Return of Premium)',
                  'Motor Insurance (Car, Bike, EV — Comprehensive + Zero Dep)',
                  'Travel Insurance (International, Schengen, Student)',
                  'Home Insurance (Structure, Contents, Natural Disaster)',
                  'Critical Illness Insurance (20+ Diseases Covered)',
                  'Section 80D + 80C Tax Planning',
                  'Insurance Portability + Policy Review',
                  'Claim Settlement Support (Cashless + Reimbursement)',
                  'IRDAI Regulatory Compliance',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#4A4F57] dark:text-[#A8B0C2]">
                    <span className="w-2 h-2 rounded-full bg-[#2D6A4F] shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <div className="rounded-2xl bg-white dark:bg-[#161A24] p-6 border border-[rgba(15,19,32,0.08)] dark:border-[rgba(232,200,114,0.10)] mt-4">
              <h2 className="text-xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-4">
                Credentials & Certifications
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF7F2] dark:bg-[#1A1F27]">
                  <div className="w-10 h-10 rounded-lg bg-[#E6F4EF] flex items-center justify-center text-[#2D6A4F] font-bold text-xs">
                    IRDAI
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0E1116] dark:text-[#FAF7F2]">IRDAI POSP License</p>
                    <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2]">Code: IP429834 | Valid pan-India</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF7F2] dark:bg-[#1A1F27]">
                  <div className="w-10 h-10 rounded-lg bg-[#FBF3DD] flex items-center justify-center text-[#B8860B] font-bold text-xs">
                    500+
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0E1116] dark:text-[#FAF7F2]">Families Served</p>
                    <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2]">Across Rajasthan and India</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FAF7F2] dark:bg-[#1A1F27]">
                  <div className="w-10 h-10 rounded-lg bg-[#FBE8E1] flex items-center justify-center text-[#B8482C] font-bold text-xs">
                    4.9
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0E1116] dark:text-[#FAF7F2]">Client Rating</p>
                    <p className="text-xs text-[#4A4F57] dark:text-[#A8B0C2]">200+ reviews | 4.9/5 stars</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#0E1116] dark:text-[#FAF7F2] mb-4">
            Get Free Insurance Consultation
          </h2>
          <p className="text-sm text-[#4A4F57] dark:text-[#A8B0C2] mb-6">
            Himanshu Paliwal personally provides free insurance consultation.
            Compare 51+ insurers and get the best plan for your needs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/919257877312?text=Hi%20Himanshu%2C%20I%20need%20insurance%20consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D6A4F] hover:bg-[#235541] text-white text-sm font-semibold transition-colors"
            >
              WhatsApp: +91-92587-77312
            </a>
            <Link
              href="/insuregpt"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#B8482C] text-[#B8482C] hover:bg-[#FBE8E1] text-sm font-semibold transition-colors"
            >
              Chat with InsureGPT AI
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
