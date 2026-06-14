// ============================================================================
// Paliwal Secure — Auto Internal Linking Engine
// Builds a link graph from all known pages and returns relevant internal links
// for any given content, ensuring topical authority and SEO silo structure.
// ============================================================================

import { vehicles } from '@/data/vehicles';
import { cities } from '@/data/cities';
import { healthInsurers, motorInsurers } from '@/data/insurers';
import { healthPlans } from '@/data/healthPlans';
import { professions } from '@/data/professions';

// ── Link Graph Types ─────────────────────────────────────────────────────

interface LinkNode {
  slug: string;
  title: string;
  category: string;
  keywords: string[];
  url: string;
}

// ── Build Link Graph ─────────────────────────────────────────────────────

let cachedGraph: LinkNode[] | null = null;

export function buildLinkGraph(): LinkNode[] {
  if (cachedGraph) return cachedGraph;

  const graph: LinkNode[] = [];
  const BASE = 'https://paliwalsecure.in';

  // ── Core Pillar Pages ────────────────────────────────────────────────
  const pillarPages = [
    { slug: 'health-insurance', title: 'Health Insurance Guide India 2025', category: 'health', keywords: ['health insurance', 'medical insurance', 'health plan', 'hospitalization'] },
    { slug: 'car-insurance', title: 'Car Insurance Guide India 2025', category: 'motor', keywords: ['car insurance', 'motor insurance', 'vehicle insurance', 'comprehensive car'] },
    { slug: 'life-insurance', title: 'Life Insurance Guide India 2025', category: 'life', keywords: ['life insurance', 'term insurance', 'term plan', 'life cover'] },
    { slug: 'bike-insurance', title: 'Bike Insurance Guide India 2025', category: 'motor', keywords: ['bike insurance', 'two wheeler', 'motorcycle insurance', 'scooter insurance'] },
    { slug: 'travel-insurance', title: 'Travel Insurance Guide India 2025', category: 'travel', keywords: ['travel insurance', 'trip insurance', 'international travel', 'domestic travel'] },
    { slug: 'home-insurance', title: 'Home Insurance Guide India 2025', category: 'home', keywords: ['home insurance', 'house insurance', 'property insurance', 'fire insurance'] },
    { slug: 'claim-guide', title: 'Insurance Claim Guide India 2025', category: 'claims', keywords: ['claim', 'claim process', 'claim settlement', 'cashless claim', 'reimbursement'] },
    { slug: 'insurance-faq', title: 'Insurance FAQ — 55 Questions Answered', category: 'general', keywords: ['faq', 'questions', 'insurance questions', 'answers'] },
    { slug: 'insurance-glossary', title: 'Insurance Glossary — 31 Terms Explained', category: 'general', keywords: ['glossary', 'terms', 'meaning', 'definition', 'insurance terms'] },
    { slug: 'best-health-insurance-india', title: 'Best Health Insurance Plans India 2025', category: 'health', keywords: ['best health insurance', 'top health plans', 'health insurance comparison', 'health insurance reviews'] },
    { slug: 'car-insurance-renewal', title: 'Car Insurance Renewal Guide 2025', category: 'motor', keywords: ['car renewal', 'insurance renewal', 'ncb', 'renew car policy', 'car insurance renewal'] },
    { slug: 'family-health-insurance', title: 'Family Health Insurance Guide 2025', category: 'health', keywords: ['family health', 'family floater', 'health insurance family', 'family plan'] },
    { slug: 'cashless-claim-guide', title: 'Cashless Claim Guide — Step by Step', category: 'claims', keywords: ['cashless', 'cashless claim', 'network hospital', 'cashless hospitalization'] },
    { slug: 'zero-dep-car-insurance', title: 'Zero Depreciation Car Insurance Guide', category: 'motor', keywords: ['zero dep', 'zero depreciation', 'bumper to bumper', 'depfree'] },
    { slug: 'policyholder-rights', title: 'Policyholder Rights — IRDAI Guidelines', category: 'general', keywords: ['rights', 'policyholder', 'irdai', 'ombudsman', 'grievance'] },
    { slug: 'blog', title: 'Insurance Blog — Tips & Guides', category: 'general', keywords: ['blog', 'articles', 'tips', 'insurance news'] },
    { slug: 'insuregpt', title: 'InsureGPT — AI Insurance Advisor', category: 'general', keywords: ['insuregpt', 'ai', 'chat', 'insurance advisor', 'ai help'] },
    { slug: 'compare', title: 'Compare Insurance Plans', category: 'general', keywords: ['compare', 'comparison', 'vs', 'versus', 'compare plans'] },
    { slug: 'industry-insights', title: 'Insurance Industry Insights Dashboard', category: 'general', keywords: ['insights', 'industry', 'statistics', 'data', 'irdai data'] },
  ];

  for (const page of pillarPages) {
    graph.push({
      ...page,
      url: `${BASE}/${page.slug}`,
    });
  }

  // ── Hub Pages ────────────────────────────────────────────────────────
  const hubPages = [
    { slug: 'hub/health-insurance', title: 'Health Insurance Hub — Complete Guide', category: 'health', keywords: ['health hub', 'health insurance guide', 'complete health insurance'] },
    { slug: 'hub/motor-insurance', title: 'Motor Insurance Hub — Car, Bike & EV Guide', category: 'motor', keywords: ['motor hub', 'motor insurance guide', 'car bike insurance'] },
    { slug: 'hub/claims', title: 'Insurance Claims Hub — Claim Guide', category: 'claims', keywords: ['claims hub', 'claim guide', 'how to claim', 'claim process'] },
  ];

  for (const page of hubPages) {
    graph.push({
      ...page,
      url: `${BASE}/${page.slug}`,
    });
  }

  // ── Vehicle Pages ────────────────────────────────────────────────────
  for (const vehicle of vehicles) {
    graph.push({
      slug: `insurance/${vehicle.slug}`,
      title: `${vehicle.brand} ${vehicle.name} Insurance 2025`,
      category: vehicle.isEV ? 'ev' : 'motor',
      keywords: [
        vehicle.primaryKeyword,
        ...vehicle.relatedKeywords,
        vehicle.brand.toLowerCase(),
        vehicle.name.toLowerCase(),
        ...(vehicle.isEV ? ['ev insurance', 'electric vehicle'] : []),
      ],
      url: `${BASE}/insurance/${vehicle.slug}`,
    });
  }

  // ── City Pages (top 30) ──────────────────────────────────────────────
  const topCities = cities.slice(0, 30);
  for (const city of topCities) {
    graph.push({
      slug: `health-insurance/${city.slug}`,
      title: `Health Insurance in ${city.name}, ${city.state}`,
      category: 'health',
      keywords: [
        `health insurance ${city.name.toLowerCase()}`,
        `medical insurance ${city.name.toLowerCase()}`,
        `${city.name.toLowerCase()} insurance`,
        `insurance in ${city.state.toLowerCase()}`,
      ],
      url: `${BASE}/health-insurance/${city.slug}`,
    });
  }

  // ── Age Pages ────────────────────────────────────────────────────────
  const ages = [25, 30, 35, 40, 45, 50, 55, 60];
  for (const age of ages) {
    graph.push({
      slug: `health-insurance/age-${age}`,
      title: `Health Insurance at Age ${age} — Best Plans & Premiums`,
      category: 'health',
      keywords: [
        `health insurance age ${age}`,
        `${age} year old insurance`,
        `premium at ${age}`,
        `insurance plan ${age}`,
      ],
      url: `${BASE}/health-insurance/age-${age}`,
    });
  }

  // ── Profession Pages ─────────────────────────────────────────────────
  for (const prof of professions) {
    graph.push({
      slug: `health-insurance/profession-${prof.slug}`,
      title: `Health Insurance for ${prof.name} — Best Plans`,
      category: 'health',
      keywords: [
        `${prof.name.toLowerCase()} insurance`,
        `insurance for ${prof.category.toLowerCase()}`,
        `${prof.slug} health plan`,
      ],
      url: `${BASE}/health-insurance/profession-${prof.slug}`,
    });
  }

  // ── Health Insurer Comparison Pages ──────────────────────────────────
  for (let i = 0; i < healthInsurers.length; i++) {
    for (let j = i + 1; j < healthInsurers.length; j++) {
      const a = healthInsurers[i];
      const b = healthInsurers[j];
      const slug = `${a.slug}-vs-${b.slug}`;
      graph.push({
        slug: `compare/${slug}`,
        title: `${a.shortName} vs ${b.shortName} — Health Insurance Comparison`,
        category: 'health',
        keywords: [
          `${a.shortName.toLowerCase()} vs ${b.shortName.toLowerCase()}`,
          `compare ${a.shortName.toLowerCase()} ${b.shortName.toLowerCase()}`,
          `${a.shortName.toLowerCase()} or ${b.shortName.toLowerCase()}`,
        ],
        url: `${BASE}/compare/${slug}`,
      });
    }
  }

  // ── Claim Guide Per Insurer ──────────────────────────────────────────
  const allInsurers = [...healthInsurers, ...motorInsurers];
  for (const insurer of allInsurers) {
    graph.push({
      slug: `claim-guide/${insurer.slug}`,
      title: `How to File Claim with ${insurer.name || insurer.slug}`,
      category: 'claims',
      keywords: [
        `${insurer.slug} claim`,
        `${insurer.name?.toLowerCase() || insurer.slug} claim process`,
        `file claim ${insurer.slug}`,
      ],
      url: `${BASE}/claim-guide/${insurer.slug}`,
    });
  }

  cachedGraph = graph;
  return graph;
}

// ── Get Internal Links ────────────────────────────────────────────────

interface InternalLink {
  title: string;
  url: string;
  category: string;
  relevanceScore: number;
}

export function getInternalLinks(
  content: string,
  currentSlug: string,
  category?: string,
  maxLinks: number = 8,
): InternalLink[] {
  const graph = buildLinkGraph();
  const contentLower = content.toLowerCase();
  const scoredLinks: InternalLink[] = [];

  // Track links per destination to enforce max 2 per destination rule
  const destinationCount = new Map<string, number>();

  for (const node of graph) {
    // Never link to self
    if (node.slug === currentSlug || node.url.endsWith(`/${currentSlug}`)) continue;

    let score = 0;

    // Category match boost
    if (category && node.category === category) {
      score += 10;
    }

    // Keyword matching in content
    for (const keyword of node.keywords) {
      if (contentLower.includes(keyword.toLowerCase())) {
        score += 3;
      }
    }

    // Title word overlap
    const titleWords = node.title.toLowerCase().split(/\s+/);
    for (const word of titleWords) {
      if (word.length < 3) continue; // skip short words
      if (contentLower.includes(word)) {
        score += 1;
      }
    }

    // Only include if there's some relevance
    if (score > 0) {
      // Check destination count (max 2 links to same base path)
      const basePath = node.slug.split('/')[0];
      const currentCount = destinationCount.get(basePath) ?? 0;
      if (currentCount >= 2) continue;
      destinationCount.set(basePath, currentCount + 1);

      scoredLinks.push({
        title: node.title,
        url: node.url,
        category: node.category,
        relevanceScore: score,
      });
    }
  }

  // Sort by relevance score (descending)
  scoredLinks.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Return top N links
  return scoredLinks.slice(0, maxLinks);
}

/**
 * Clears the cached link graph (useful for testing or when data changes).
 */
export function clearLinkGraphCache(): void {
  cachedGraph = null;
}
