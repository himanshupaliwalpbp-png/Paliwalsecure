'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search, Car, Bike, MapPin, Briefcase, Building2,
  ArrowRight, ChevronRight, Phone, MessageCircle
} from 'lucide-react';
import Link from 'next/link';

// ── Search Index ─────────────────────────────────────────────────────
interface SearchItem {
  title: string;
  description: string;
  href: string;
  category: string;
  keywords: string[];
  icon: string;
}

// ── Ultra-safe Indian number formatter ───────────────────────────────
// Does NOT use .toLocaleString() at all — eliminates the Vercel build
// TypeError: Cannot read properties of undefined (reading 'toLocaleString')
// Implements Indian numbering system manually: e.g., 1,23,456 instead of 123,456
function fmtNum(val: unknown): string {
  try {
    if (val == null) return '0';
    const n = Number(val);
    if (!isFinite(n) || isNaN(n)) return '0';
    const rounded = Math.round(n);
    if (rounded === 0) return '0';
    const str = Math.abs(rounded).toString();
    // Indian grouping: last 3 digits, then groups of 2
    const lastThree = str.length > 3 ? str.substring(str.length - 3) : str;
    const remaining = str.length > 3 ? str.substring(0, str.length - 3) : '';
    const grouped = remaining !== ''
      ? remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
      : lastThree;
    return rounded < 0 ? '-' + grouped : grouped;
  } catch {
    return '0';
  }
}

// Build search index — ONLY called client-side inside useEffect
// Uses dynamic imports so data files are never imported during SSR/prerender
async function buildSearchIndex(): Promise<SearchItem[]> {
  const items: SearchItem[] = [];

  try {
    const [{ vehicles }, { cities }, { professions }, { healthInsurers }] = await Promise.all([
      import('@/data/vehicles'),
      import('@/data/cities'),
      import('@/data/professions'),
      import('@/data/insurers'),
    ]);

    // Vehicles
    const vList = Array.isArray(vehicles) ? vehicles : [];
    for (let vi = 0; vi < vList.length; vi++) {
      const v = vList[vi];
      if (!v) continue;
      const isCar = v.category === 'car' || v.type === 'car';
      const isBike = v.category === 'bike' || v.type === 'bike';
      const idv = Number(v.idv) || 0;
      const tpBase = Number(v.tp_base) || 0;
      const premium = Math.round((v.isEV ? tpBase * 0.85 : tpBase + idv * 0.025) * 1.18);
      items.push({
        title: `${v.brand || ''} ${v.name || ''} Insurance`,
        description: `${isCar ? 'Car' : isBike ? 'Bike' : 'Scooter'} insurance for ${v.brand || ''} ${v.name || ''} — IDV ₹${fmtNum(idv)}, premium starting from ₹${fmtNum(premium)}`,
        href: `/insurance/${v.slug}`,
        category: isCar ? 'Car Insurance' : isBike ? 'Bike Insurance' : 'Scooter Insurance',
        keywords: [v.brand, v.name, v.slug, `${Number(v.engineCC) || 0}cc`, v.category || v.type, 'insurance', 'premium'].filter(Boolean) as string[],
        icon: isCar ? 'car' : 'bike',
      });
    }

    // Cities
    const cList = Array.isArray(cities) ? cities : [];
    for (let ci = 0; ci < cList.length; ci++) {
      const c = cList[ci];
      if (!c) continue;
      const basePremium = c.basePremium ?? Math.round(7000 * (c.healthLoadingFactor ?? 1.0));
      const hospitalCount = c.hospitalCount ?? (c.tier === 'metro' ? 150 : c.tier === 'tier2' ? 60 : 25);
      items.push({
        title: `Health Insurance in ${c.name}`,
        description: `Best health insurance plans in ${c.name}, ${c.state}. ${fmtNum(hospitalCount)}+ hospitals, premiums from ₹${fmtNum(basePremium)}/yr. ${c.tier === 'metro' ? 'Metro' : c.tier === 'tier2' ? 'Tier-2' : 'Tier-3'} city rates.`,
        href: `/health-insurance/${c.slug}`,
        category: 'City Health Insurance',
        keywords: [c.name, c.state, c.slug, c.tier, 'health insurance', 'hospital'].filter(Boolean) as string[],
        icon: 'map',
      });
    }

    // Professions
    const pList = Array.isArray(professions) ? professions : [];
    for (let pi = 0; pi < pList.length; pi++) {
      const p = pList[pi];
      if (!p) continue;
      items.push({
        title: `Health Insurance for ${p.name}s`,
        description: `Career-specific health insurance for ${p.name}s. ${p.category || ''} profession, recommended sum insured: ${p.recommendedSumInsured || 'N/A'}.`,
        href: `/health-insurance/profession-${p.slug}`,
        category: 'Profession Health Insurance',
        keywords: [p.name, p.slug, p.category, 'health insurance', 'profession', 'career'].filter(Boolean) as string[],
        icon: 'briefcase',
      });
    }

    // Health Insurers
    const iList = Array.isArray(healthInsurers) ? healthInsurers : [];
    for (let ii = 0; ii < iList.length; ii++) {
      const ins = iList[ii];
      if (!ins) continue;
      const csr = ins.csr ?? 0;
      const shortName = ins.logoPlaceholder || ins.name;
      const hospitals = ins.networkHospitals ?? 0;
      const plans = Array.isArray(ins.popularPlans) ? ins.popularPlans.slice(0, 2).join(', ') : '';
      items.push({
        title: `${shortName} Health Insurance`,
        description: `${ins.name} — CSR ${csr}%, ${fmtNum(hospitals)} hospitals, ${plans}.`,
        href: `/claim-guide/${ins.slug}`,
        category: 'Insurer Claim Guide',
        keywords: [ins.name, shortName, ins.slug, 'claim', 'health insurance', ins.type].filter(Boolean) as string[],
        icon: 'building',
      });
    }

    // Comparisons
    for (let i = 0; i < iList.length; i++) {
      for (let j = i + 1; j < iList.length; j++) {
        if (!iList[i] || !iList[j]) continue;
        items.push({
          title: `${iList[i].logoPlaceholder || iList[i].name} vs ${iList[j].logoPlaceholder || iList[j].name}`,
          description: `Compare ${iList[i].logoPlaceholder || iList[i].name} vs ${iList[j].logoPlaceholder || iList[j].name} health insurance. CSR, premiums, hospital networks, and more.`,
          href: `/compare/${iList[i].slug}-vs-${iList[j].slug}`,
          category: 'Insurance Comparison',
          keywords: [iList[i].logoPlaceholder || iList[i].name, iList[j].logoPlaceholder || iList[j].name, 'compare', 'vs', 'comparison'].filter(Boolean) as string[],
          icon: 'building',
        });
      }
    }

    // Age pages
    const ages = [25, 30, 35, 40, 45, 50, 55, 60];
    for (let ai = 0; ai < ages.length; ai++) {
      const age = ages[ai];
      items.push({
        title: `Health Insurance for ${age}-Year-Olds`,
        description: `Age-specific health insurance guide for ${age}-year-olds in India. Premiums, coverage tips, and recommendations.`,
        href: `/health-insurance/age-${age}`,
        category: 'Age-Based Insurance',
        keywords: [String(age), `${age} years`, 'age', 'health insurance', 'premium'],
        icon: 'briefcase',
      });
    }

  } catch (err) {
    console.error('Search index build error:', err);
  }
  return items;
}

// ── Icon renderer ────────────────────────────────────────────────────
function renderIcon(type: string) {
  switch (type) {
    case 'car': return <Car className="h-4 w-4" />;
    case 'bike': return <Bike className="h-4 w-4" />;
    case 'map': return <MapPin className="h-4 w-4" />;
    case 'briefcase': return <Briefcase className="h-4 w-4" />;
    case 'building': return <Building2 className="h-4 w-4" />;
    default: return <Search className="h-4 w-4" />;
  }
}

// ── Simple Search ────────────────────────────────────────────────────
function searchItems(items: SearchItem[], query: string): SearchItem[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  return items
    .map((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const keywordsStr = item.keywords.join(' ').toLowerCase();

      if (titleLower.includes(q)) score += 100;
      for (const term of terms) {
        if (titleLower.includes(term)) score += 30;
        if (descLower.includes(term)) score += 10;
        if (keywordsStr.includes(term)) score += 15;
        if (item.category.toLowerCase().includes(term)) score += 5;
      }
      for (const kw of item.keywords) {
        if (kw.toLowerCase() === q) score += 50;
      }
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(({ item }) => item);
}

// ── Static popular items (no data imports needed) ────────────────────
const popularCars = [
  { name: 'Maruti Swift', slug: 'maruti-swift' },
  { name: 'Hyundai Creta', slug: 'hyundai-creta' },
  { name: 'Tata Nexon', slug: 'tata-nexon' },
  { name: 'Maruti Baleno', slug: 'maruti-baleno' },
];

const popularBikes = [
  { name: 'Honda Activa', slug: 'honda-activa-6g' },
  { name: 'Royal Enfield Classic 350', slug: 'royal-enfield-classic-350' },
  { name: 'Honda Shine', slug: 'honda-shine' },
  { name: 'TVS Jupiter', slug: 'tvs-jupiter' },
];

const popularCities = [
  { name: 'Delhi', state: 'Delhi', slug: 'delhi' },
  { name: 'Mumbai', state: 'Maharashtra', slug: 'mumbai' },
  { name: 'Bangalore', state: 'Karnataka', slug: 'bangalore' },
  { name: 'Jaipur', state: 'Rajasthan', slug: 'jaipur' },
  { name: 'Hyderabad', state: 'Telangana', slug: 'hyderabad' },
];

// ── Client Component ────────────────────────────────────────────────
export default function SearchClient() {
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [searchIndex, setSearchIndex] = useState<SearchItem[]>([]);

  // Build search index ONLY on client side via useEffect + dynamic imports
  // This ensures NO data files are imported during SSR/prerender on Vercel
  // Since this component uses ssr:false, this effect only runs in the browser
  useEffect(() => {
    let cancelled = false;
    buildSearchIndex()
      .then((index) => {
        if (!cancelled) setSearchIndex(index);
      })
      .catch(() => {
        if (!cancelled) setSearchIndex([]);
      })
      .finally(() => {
        if (!cancelled) setMounted(true);
      });
    return () => { cancelled = true; };
  }, []);

  const results = useMemo(() => searchItems(searchIndex, query), [searchIndex, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    for (const item of results) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [results]);

  // Loading state until client-side data is ready
  // Also serves as SSR guard — never renders real content during SSR
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading search...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Search</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Search Insurance Plans</h1>
          <p className="text-muted-foreground">
            Search across vehicle insurance, health insurance by city/age/profession, insurer comparisons, and claim guides.
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search: vehicle, city, insurer, age, profession..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        {query.trim() ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {results.length > 0
                ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
                : `No results found for "${query}". Try different keywords.`
              }
            </p>

            {results.length === 0 && (
              <Card className="mb-8">
                <CardContent className="p-6 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">No results found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try searching with different keywords like &quot;Maruti Swift&quot;, &quot;Delhi health&quot;, &quot;Star Health&quot;, or &quot;30 year old&quot;.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Car Insurance', 'Health Insurance', 'Star Health', 'Delhi', '30 years', 'Software Engineer'].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuery(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grouped Results */}
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                  {category}
                </h2>
                <div className="space-y-2">
                  {items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <Card className="hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="text-primary mt-0.5 shrink-0">{renderIcon(item.icon)}</div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">{category.split(' ')[0]}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Default - Popular Searches (static, no data imports) */
          <div>
            <h2 className="text-lg font-semibold mb-4">Popular Searches</h2>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Car className="h-4 w-4 text-primary" />
                    Popular Car Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {popularCars.map((v) => (
                      <Link key={v.slug} href={`/insurance/${v.slug}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                        <ArrowRight className="h-3 w-3 shrink-0" />
                        <span>{v.name}</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Bike className="h-4 w-4 text-primary" />
                    Popular Bike Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {popularBikes.map((v) => (
                      <Link key={v.slug} href={`/insurance/${v.slug}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                        <ArrowRight className="h-3 w-3 shrink-0" />
                        <span>{v.name}</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Health Insurance by City
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    {popularCities.map((c) => (
                      <Link key={c.slug} href={`/health-insurance/${c.slug}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                        <ArrowRight className="h-3 w-3 shrink-0" />
                        <span>{c.name}, {c.state}</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5">
                    <Link href="/compare" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <ArrowRight className="h-3 w-3 shrink-0" />
                      <span>Compare Health Insurance</span>
                    </Link>
                    <Link href="/health-insurance/age-30" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <ArrowRight className="h-3 w-3 shrink-0" />
                      <span>Insurance for 30-Year-Olds</span>
                    </Link>
                    <Link href="/health-insurance/profession-software-engineer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <ArrowRight className="h-3 w-3 shrink-0" />
                      <span>Insurance for Software Engineers</span>
                    </Link>
                    <Link href="/claim-guide/star-health" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <ArrowRight className="h-3 w-3 shrink-0" />
                      <span>Star Health Claim Guide</span>
                    </Link>
                    <Link href="/insurance-news/irdai-gst-exempt-health-insurance" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <ArrowRight className="h-3 w-3 shrink-0" />
                      <span>GST Exempt on Health Insurance</span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <Card className="border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold mb-2">Can&apos;t Find What You Need?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get personalized insurance recommendations from our IRDAI-certified advisor.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <a href="https://wa.me/919257877312?text=Hi%2C%20I%20need%20help%20finding%20the%20right%20insurance" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp Us
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="tel:+919257877312">
                      <Phone className="h-4 w-4 mr-2" />
                      Call +91 9257877312
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
