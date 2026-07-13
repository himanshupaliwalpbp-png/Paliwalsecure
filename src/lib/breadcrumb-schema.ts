/**
 * Breadcrumb Schema Helper
 *
 * Generates BreadcrumbList JSON-LD for any page.
 * Usage: Add to page's inline schema block.
 *
 * Example:
 *   const breadcrumbSchema = generateBreadcrumbSchema([
 *     { name: 'Home', url: 'https://paliwalsecure.in' },
 *     { name: 'Health Insurance', url: 'https://paliwalsecure.in/health-insurance' },
 *   ]);
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Common breadcrumb paths for Paliwal Secure pages.
 * Each entry returns the full breadcrumb trail for that page.
 */
export const BREADCRUMB_PATHS: Record<string, BreadcrumbItem[]> = {
  '/': [{ name: 'Home', url: 'https://paliwalsecure.in' }],
  '/health-insurance': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Health Insurance', url: 'https://paliwalsecure.in/health-insurance' },
  ],
  '/car-insurance': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Car Insurance', url: 'https://paliwalsecure.in/car-insurance' },
  ],
  '/bike-insurance': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Bike Insurance', url: 'https://paliwalsecure.in/bike-insurance' },
  ],
  '/life-insurance': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Life Insurance', url: 'https://paliwalsecure.in/life-insurance' },
  ],
  '/travel-insurance': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Travel Insurance', url: 'https://paliwalsecure.in/travel-insurance' },
  ],
  '/home-insurance': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Home Insurance', url: 'https://paliwalsecure.in/home-insurance' },
  ],
  '/compare': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Compare', url: 'https://paliwalsecure.in/compare' },
  ],
  '/compare/health': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Compare', url: 'https://paliwalsecure.in/compare' },
    { name: 'Health Insurance Comparison', url: 'https://paliwalsecure.in/compare/health' },
  ],
  '/compare/motor': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Compare', url: 'https://paliwalsecure.in/compare' },
    { name: 'Motor Insurance Comparison', url: 'https://paliwalsecure.in/compare/motor' },
  ],
  '/compare/life': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Compare', url: 'https://paliwalsecure.in/compare' },
    { name: 'Life Insurance Comparison', url: 'https://paliwalsecure.in/compare/life' },
  ],
  '/compare/travel': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Compare', url: 'https://paliwalsecure.in/compare' },
    { name: 'Travel Insurance Comparison', url: 'https://paliwalsecure.in/compare/travel' },
  ],
  '/compare/home': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Compare', url: 'https://paliwalsecure.in/compare' },
    { name: 'Home Insurance Comparison', url: 'https://paliwalsecure.in/compare/home' },
  ],
  '/claim-guide': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Claim Guide', url: 'https://paliwalsecure.in/claim-guide' },
  ],
  '/calculators': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Calculators', url: 'https://paliwalsecure.in/calculators' },
  ],
  '/insuregpt': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'InsureGPT', url: 'https://paliwalsecure.in/insuregpt' },
  ],
  '/free-audit': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Free Audit', url: 'https://paliwalsecure.in/free-audit' },
  ],
  '/about': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'About', url: 'https://paliwalsecure.in/about' },
  ],
  '/about/himanshu-paliwal': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'About', url: 'https://paliwalsecure.in/about' },
    { name: 'Himanshu Paliwal', url: 'https://paliwalsecure.in/about/himanshu-paliwal' },
  ],
  '/blog': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Blog', url: 'https://paliwalsecure.in/blog' },
  ],
  '/kota-insurance-agent': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Kota Insurance Agent', url: 'https://paliwalsecure.in/kota-insurance-agent' },
  ],
  '/insurance-glossary': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Insurance Glossary', url: 'https://paliwalsecure.in/insurance-glossary' },
  ],
  '/insurance-faq': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Insurance FAQ', url: 'https://paliwalsecure.in/insurance-faq' },
  ],
  '/tax-saving': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Tax Saving', url: 'https://paliwalsecure.in/tax-saving' },
  ],
  '/claim-settlement-ratio': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Claim Settlement Ratio', url: 'https://paliwalsecure.in/claim-settlement-ratio' },
  ],
  '/idv-calculation': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'IDV Calculation', url: 'https://paliwalsecure.in/idv-calculation' },
  ],
  '/ncb-meaning': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'NCB Meaning', url: 'https://paliwalsecure.in/ncb-meaning' },
  ],
  '/zero-dep-car-insurance': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Zero Dep Car Insurance', url: 'https://paliwalsecure.in/zero-dep-car-insurance' },
  ],
  '/family-health-insurance': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Family Health Insurance', url: 'https://paliwalsecure.in/family-health-insurance' },
  ],
  '/best-health-insurance-india': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Best Health Insurance India', url: 'https://paliwalsecure.in/best-health-insurance-india' },
  ],
  '/best-term-insurance-india': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Best Term Insurance India', url: 'https://paliwalsecure.in/best-term-insurance-india' },
  ],
  '/1-crore-term-insurance': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: '1 Crore Term Insurance', url: 'https://paliwalsecure.in/1-crore-term-insurance' },
  ],
  '/car-insurance-renewal': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Car Insurance Renewal', url: 'https://paliwalsecure.in/car-insurance-renewal' },
  ],
  '/cashless-claim-guide': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Cashless Claim Guide', url: 'https://paliwalsecure.in/cashless-claim-guide' },
  ],
  '/policyholder-rights': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Policyholder Rights', url: 'https://paliwalsecure.in/policyholder-rights' },
  ],
  '/privacy-policy': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Privacy Policy', url: 'https://paliwalsecure.in/privacy-policy' },
  ],
  '/terms-of-service': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Terms of Service', url: 'https://paliwalsecure.in/terms-of-service' },
  ],
  '/disclaimer': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Disclaimer', url: 'https://paliwalsecure.in/disclaimer' },
  ],
  '/offers': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'Offers', url: 'https://paliwalsecure.in/offers' },
  ],
  '/whatsapp': [
    { name: 'Home', url: 'https://paliwalsecure.in' },
    { name: 'WhatsApp', url: 'https://paliwalsecure.in/whatsapp' },
  ],
};

/**
 * Get breadcrumb schema for a page path.
 * Returns null if no breadcrumb path is defined.
 */
export function getBreadcrumbForPath(pathname: string): ReturnType<typeof generateBreadcrumbSchema> | null {
  const items = BREADCRUMB_PATHS[pathname];
  if (!items) return null;
  return generateBreadcrumbSchema(items);
}
