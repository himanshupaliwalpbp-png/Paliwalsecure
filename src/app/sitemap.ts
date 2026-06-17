import { MetadataRoute } from 'next/server'
import { blogPosts } from '@/lib/blog-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://paliwalsecure.in'
  const now = new Date()

  // ── Blog post routes ──────────────────────────────────────────────────────
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // ── Knowledge article routes ──────────────────────────────────────────────
  const knowledgeSlugs = [
    'how-to-file-health-insurance-claim',
    'term-insurance-vs-ulip',
    'why-csr-matters',
    'motor-insurance-comprehensive-guide',
    'health-insurance-waiting-period',
    'section-80d-tax-saving-guide',
    'no-claim-bonus-explained',
    'maternity-insurance-guide',
  ]
  const knowledgeRoutes = knowledgeSlugs.map((slug) => ({
    url: `${baseUrl}/knowledge/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // ── Claim guide insurer routes ────────────────────────────────────────────
  const claimGuideInsurers = [
    'hdfc-ergo',
    'star-health',
    'bajaj-allianz',
    'icici-lombard',
    'new-india-assurance',
    'tata-aig',
    'sbi-general',
    'care-health',
    'niva-bupa',
    'acko',
  ]
  const claimGuideInsurerRoutes = claimGuideInsurers.map((slug) => ({
    url: `${baseUrl}/claim-guide/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // ── Insurance comparison category routes ──────────────────────────────────
  const compareCategoryRoutes = [
    'health',
    'life',
    'motor',
    'travel',
    'home',
  ].map((cat) => ({
    url: `${baseUrl}/compare/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // ── Hub / Resource routes ─────────────────────────────────────────────────
  const hubRoutes = [
    'hub/health-insurance',
    'hub/motor-insurance',
    'hub/claims',
    'hub/faq',
    'hub/glossary',
    'hub/news',
    'hub/vehicle-launch',
  ].map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // ── Key static pages ──────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    // Core pages — highest priority
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Insurance category pages — high priority
    {
      url: `${baseUrl}/health-insurance`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/car-insurance`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bike-insurance`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/life-insurance`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/travel-insurance`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/home-insurance`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Specialized insurance pages
    {
      url: `${baseUrl}/family-health-insurance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/best-health-insurance-india`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/zero-dep-car-insurance`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/car-insurance-renewal`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // Tools & Guides
    {
      url: `${baseUrl}/insuregpt`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/claim-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cashless-claim-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/knowledge`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/insurance-glossary`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/insurance-faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/policyholder-rights`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/vehicle-launch-hub`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/industry-insights`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    // Legal & About pages
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    // Tools & AI Features
    {
      url: `${baseUrl}/free-audit`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Local SEO landing pages
    {
      url: `${baseUrl}/kota-insurance-agent`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  return [
    ...staticRoutes,
    ...compareCategoryRoutes,
    ...blogRoutes,
    ...knowledgeRoutes,
    ...claimGuideInsurerRoutes,
    ...hubRoutes,
  ]
}
