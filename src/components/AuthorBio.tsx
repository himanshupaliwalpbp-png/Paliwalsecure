'use client';

import { Shield, Award, Phone, Mail, MapPin, Users, CheckCircle2, Star, Instagram, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n';

/**
 * AuthorBio — E-E-A-T Component for Paliwal Secure
 *
 * Displays Himanshu Paliwal's credentials, experience, and social proof.
 * Includes Schema.org Person entity for search engine trust signals.
 */

export default function AuthorBio() {
  const { t } = useLanguage();

  const credentials = [
    t('authorBio.cred1'),
    t('authorBio.cred2'),
    t('authorBio.cred3'),
    t('authorBio.cred4'),
    t('authorBio.cred5'),
    t('authorBio.cred6'),
  ];

  const achievements = [
    { value: '500+', label: t('authorBio.familiesServed') },
    { value: '51+', label: t('authorBio.partners') },
    { value: '97%', label: t('authorBio.satisfaction') },
    { value: '5+', label: t('authorBio.experience') },
  ];

  // Schema.org Person entity for E-E-A-T
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Himanshu Paliwal',
    jobTitle: 'IRDAI Certified Insurance Advisor',
    worksFor: {
      '@type': 'Organization',
      name: 'Paliwal Secure',
      url: 'https://paliwalsecure.com',
    },
    url: 'https://paliwalsecure.com',
    telephone: '+91-9257877312',
    email: 'himanshupaliwalpbp@gmail.com',
    knowsAbout: [
      'Health Insurance',
      'Term Insurance',
      'Motor Insurance',
      'Travel Insurance',
      'Insurance Claim Settlement',
      'Tax Saving under Section 80D',
      'IRDAI Regulations',
    ],
    sameAs: [
      'https://www.instagram.com/paliwalinsure',
      'https://www.instagram.com/palival_visuals',
      'https://wa.me/919257877312',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kota',
      addressRegion: 'Rajasthan',
      addressCountry: 'IN',
    },
    description:
      'IRDAI-certified insurance advisor with 5+ years of experience helping Indian families find the best insurance plans. Founder of Paliwal Secure, an AI-powered insurance advisory platform.',
    award: 'IRDAI Certification',
  };

  return (
    <section
      id="author-bio"
      aria-label="About Our Insurance Advisor"
      className="py-12 sm:py-16 bg-background scroll-mt-16"
    >
      {/* Person Schema for E-E-A-T */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800 rounded-full px-4 py-1">
            <Shield className="w-3.5 h-3.5 mr-1" />
            {t('authorBio.badge')}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {t('authorBio.meet')} <span className="gradient-text">Himanshu Paliwal</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            {t('authorBio.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1 rounded-3xl border-teal-200 dark:border-teal-800/40 overflow-hidden">
            <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-6 text-center">
              {/* Avatar placeholder */}
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-4 flex items-center justify-center border-2 border-white/30 relative overflow-hidden">
                <span className="text-3xl font-bold text-white">HP</span>
                {/* Replace with actual photo: <Image src="/himanshu-photo.jpg" alt="Himanshu Paliwal" fill className="object-cover" /> */}
              </div>
              <h3 className="text-xl font-bold text-white">Himanshu Paliwal</h3>
              <p className="text-sm text-white/80 mt-1">{t('authorBio.founder')}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 text-amber-300 fill-amber-300" />
                ))}
                <span className="text-xs text-white/70 ml-1">4.9/5</span>
              </div>
            </div>
            <CardContent className="p-5">
              {/* Contact Info */}
              <div className="space-y-3">
                <a
                  href="tel:9257877312"
                  className="flex items-center gap-3 text-sm text-foreground hover:text-[#00A9A6] transition-colors"
                >
                  <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  +91-9257877312
                </a>
                <a
                  href="mailto:himanshupaliwalpbp@gmail.com"
                  className="flex items-center gap-3 text-sm text-foreground hover:text-[#00A9A6] transition-colors"
                >
                  <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  himanshupaliwalpbp@gmail.com
                </a>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  Kota, Rajasthan, India
                </div>
                <a
                  href="https://instagram.com/paliwalinsure"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-foreground hover:text-pink-500 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  @paliwalinsure
                </a>
                <a
                  href="https://www.instagram.com/palival_visuals?igsh=YnB4MmVkdXdiejVk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-foreground hover:text-pink-500 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  @palival_visuals
                </a>
              </div>

              {/* IRDAI Badge */}
              <div className="mt-5 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/40">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-800 dark:text-amber-300">{t('authorBio.irdaiCertified')}</p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400">{t('authorBio.irdaiRegulated')}</p>
                  </div>
                </div>
              </div>

              {/* Multi-Insurer Access Badge */}
              <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Multi-Insurer Access</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">51+ Insurers • Unbiased Comparison • Certified Advisor</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credentials + Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach.label}
                  className="text-center p-4 rounded-2xl bg-muted/50 border border-border/50"
                >
                  <p className="text-2xl sm:text-3xl font-extrabold gradient-text">{ach.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{ach.label}</p>
                </div>
              ))}
            </div>

            {/* Credentials */}
            <Card className="rounded-3xl">
              <CardContent className="p-5">
                <h4 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  {t('authorBio.credentials')}
                </h4>
                <ul className="space-y-2.5">
                  {credentials.map((cred) => (
                    <li key={cred} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                      </div>
                      <span className="text-sm text-foreground">{cred}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Bio Text */}
            <Card className="rounded-3xl border-teal-200/50 dark:border-teal-800/30">
              <CardContent className="p-5">
                <h4 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  {t('authorBio.aboutTitle')}
                </h4>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    {t('authorBio.bioP1')}
                  </p>
                  <p>
                    {t('authorBio.bioP2')}
                  </p>
                  <p>
                    {t('authorBio.bioP3')}
                  </p>
                  <p>
                    {t('authorBio.bioP4')}
                  </p>
                </div>

                {/* Trust links */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="https://bimabharosa.irdai.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Bima Bharosa Portal
                  </a>
                  <a
                    href="https://www.irdai.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    IRDAI Official
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
