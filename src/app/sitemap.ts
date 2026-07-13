import { MetadataRoute } from 'next/server'
import { blogPosts } from '@/lib/blog-data'
import { cities } from '@/data/cities'
import { professions } from '@/data/professions'
import { healthInsurers, generateComparisonSlugs } from '@/data/insurers'
import { productCategories, locations, conditions } from '@/lib/programmaticSEO'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Enterprise Sitemap Generator — Paliwal Secure AI
 *
 * Generates sitemap entries for ALL production-ready routes:
 * - Static pages (manually verified, noindex routes excluded)
 * - Blog posts (only those with existing markdown files — no 404s)
 * - City pages (health-insurance + insurance-agent) — 100 cities × 2 = 200
 * - Profession pages — 30 professions
 * - Age pages — 8 ages
 * - Product pages — 12 products
 * - Product×Location pages — 6 top products × 20 top locations = 120
 * - Product×Condition pages — 38 (sum of conditions per product)
 * - Comparison slug pages — C(6,2) = 15
 * - Claim guide insurer pages — 10
 * - Knowledge articles — 8 (hardcoded matching knowledge-data.ts)
 * - Hub pages — 7
 * - Compare category pages — 5
 *
 * Excludes:
 * - /admin/* (noindex via proxy.ts)
 * - /api/* (not HTML pages)
 * - /search (noindex via robots.txt)
 * - /p4l1w4l-s3cur3-4dm1n (secret admin entry, noindex)
 * - /vehicle-launch-hub (307 redirect to /hub/vehicle-launch)
 * - Blog slugs without markdown files (13 entries — would 404)
 * - insurance-news/irdai-[slug] (force-dynamic, not SSG)
 */

const BASE_URL = 'https://paliwalsecure.in'
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

// Same constants as [product]/[location]/page.tsx generateStaticParams
const TOP_PRODUCTS = 6
const TOP_LOCATIONS = 20

// Same as age-[age]/page.tsx
const VALID_AGES = [25, 30, 35, 40, 45, 50, 55, 60]

// Same as claim-guide/[insurer]/page.tsx generateStaticParams (from data/insurers.ts healthInsurers)
const CLAIM_GUIDE_INSURERS = [
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

// Knowledge article slugs (matches knowledge-data.ts)
const KNOWLEDGE_SLUGS = [
  'how-to-file-health-insurance-claim',
  'term-insurance-vs-ulip',
  'why-csr-matters',
  'motor-insurance-comprehensive-guide',
  'health-insurance-waiting-period',
  'section-80d-tax-saving-guide',
  'no-claim-bonus-explained',
  'maternity-insurance-guide',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // ── 1. Static pages (manually curated, noindex routes excluded) ──────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/kota-insurance-agent`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    // Insurance category pages
    { url: `${BASE_URL}/health-insurance`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/car-insurance`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/bike-insurance`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/life-insurance`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/travel-insurance`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/home-insurance`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/family-health-insurance`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/best-health-insurance-india`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/best-term-insurance-india`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/1-crore-term-insurance`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/zero-dep-car-insurance`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/car-insurance-renewal`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // Tools & AI
    { url: `${BASE_URL}/insuregpt`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/calculators`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/free-audit`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    // Claims & Guides
    { url: `${BASE_URL}/claim-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/cashless-claim-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/cashless-vs-reimbursement-claim`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/claim-settlement-ratio`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/claims-dashboard`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/complaint-dashboard`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/how-to-file-health-insurance-claim`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // Knowledge & Glossary
    { url: `${BASE_URL}/knowledge`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/insurance-glossary`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/insurance-faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/insurance-mistakes-to-avoid`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    // Insurance concepts
    { url: `${BASE_URL}/co-pay-meaning-health-insurance`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/family-floater-vs-individual-health-insurance`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/health-insurance-for-parents`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/health-insurance-waiting-period`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/health-insurance-mistakes`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/idv-calculation`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/ncb-meaning`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/room-rent-limit-health-insurance`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/third-party-vs-comprehensive`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/tax-saving`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // Policyholder resources
    { url: `${BASE_URL}/policyholder-rights`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/industry-insights`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/insurance-agent`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // AI reference
    { url: `${BASE_URL}/ai-reference`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // Offers & WhatsApp
    { url: `${BASE_URL}/offers`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/whatsapp`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    // About
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    // Legal
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/grievance-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  // ── 2. Hub pages ─────────────────────────────────────────────────────────
  const hubRoutes: MetadataRoute.Sitemap = [
    'hub/health-insurance',
    'hub/motor-insurance',
    'hub/claims',
    'hub/faq',
    'hub/glossary',
    'hub/news',
    'hub/vehicle-launch',
  ].map((p) => ({
    url: `${BASE_URL}/${p}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // ── 3. Compare category pages ────────────────────────────────────────────
  const compareCategoryRoutes: MetadataRoute.Sitemap = ['health', 'life', 'motor', 'travel', 'home'].map(
    (cat) => ({
      url: `${BASE_URL}/compare/${cat}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  )

  // ── 4. Blog posts (only those with existing markdown files — no 404s) ───
  // Read actual markdown files from content/blog/ to filter out slugs without files
  let availableBlogSlugs: Set<string> = new Set()
  try {
    if (fs.existsSync(BLOG_DIR)) {
      availableBlogSlugs = new Set(
        fs
          .readdirSync(BLOG_DIR)
          .filter((f) => f.endsWith('.md'))
          .map((f) => f.replace(/\.md$/, ''))
      )
    }
  } catch {
    // Fallback: if filesystem read fails, include all blog-data entries
    availableBlogSlugs = new Set(blogPosts.map((p) => p.slug))
  }

  const blogRoutes: MetadataRoute.Sitemap = blogPosts
    .filter((post) => availableBlogSlugs.has(post.slug))
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  // ── 5. Knowledge articles ────────────────────────────────────────────────
  const knowledgeRoutes: MetadataRoute.Sitemap = KNOWLEDGE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/knowledge/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // ── 6. Claim guide insurer pages ─────────────────────────────────────────
  const claimGuideRoutes: MetadataRoute.Sitemap = CLAIM_GUIDE_INSURERS.map((slug) => ({
    url: `${BASE_URL}/claim-guide/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // ── 7. City pages — health-insurance/[city] ──────────────────────────────
  const cityHealthRoutes: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${BASE_URL}/health-insurance/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // ── 8. City pages — insurance-agent/[city] ───────────────────────────────
  const cityAgentRoutes: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${BASE_URL}/insurance-agent/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // ── 9. Profession pages — health-insurance/profession-[profession] ───────
  const professionRoutes: MetadataRoute.Sitemap = professions.map((p) => ({
    url: `${BASE_URL}/health-insurance/profession-${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // ── 10. Age pages — health-insurance/age-[age] ───────────────────────────
  const ageRoutes: MetadataRoute.Sitemap = VALID_AGES.map((age) => ({
    url: `${BASE_URL}/health-insurance/age-${age}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // ── 11. Product pages — [product] ────────────────────────────────────────
  const productRoutes: MetadataRoute.Sitemap = productCategories.map((p) => ({
    url: `${BASE_URL}/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // ── 12. Product×Location pages — [product]/[location] ────────────────────
  // Mirrors generateStaticParams in [product]/[location]/page.tsx
  const topProducts = productCategories.slice(0, TOP_PRODUCTS)
  const topLocations = locations.slice(0, TOP_LOCATIONS)
  const productLocationRoutes: MetadataRoute.Sitemap = []

  // Product × Location
  for (const product of topProducts) {
    for (const location of topLocations) {
      productLocationRoutes.push({
        url: `${BASE_URL}/${product.slug}/${location.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })
    }
  }

  // Product × Condition
  for (const product of productCategories) {
    const relevantConditions = conditions.filter((c) => c.relatedProducts.includes(product.slug))
    for (const condition of relevantConditions) {
      productLocationRoutes.push({
        url: `${BASE_URL}/${product.slug}/for-${condition.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })
    }
  }

  // ── 13. Comparison slug pages — compare/[slug] ───────────────────────────
  const comparisonSlugRoutes: MetadataRoute.Sitemap = generateComparisonSlugs().map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...hubRoutes,
    ...compareCategoryRoutes,
    ...blogRoutes,
    ...knowledgeRoutes,
    ...claimGuideRoutes,
    ...cityHealthRoutes,
    ...cityAgentRoutes,
    ...professionRoutes,
    ...ageRoutes,
    ...productRoutes,
    ...productLocationRoutes,
    ...comparisonSlugRoutes,
  ]
}
