import { NextResponse } from 'next/server';

// Node.js runtime — no edge needed for simple RSS feed generation

/**
 * RSS 2.0 Feed — Paliwal Secure AI
 *
 * Generates a comprehensive RSS feed with insurance blog articles.
 * Site: https://paliwalsecure.in
 * Categories: health, life, motor, travel, home
 * Contains 20+ RSS items from common insurance topics.
 */

const BASE_URL = 'https://paliwalsecure.in';

interface RSSItem {
  title: string;
  description: string;
  link: string;
  category: string;
  pubDate: string;
  guid: string;
}

const rssItems: RSSItem[] = [
  {
    title: 'Best Health Insurance in India 2025 – Complete Comparison Guide',
    description: 'Compare top health insurance plans in India for 2025. From family floater to senior citizen plans, find the best coverage at the right premium with AI-powered analysis.',
    link: `${BASE_URL}/blog/best-health-insurance-india-2026`,
    category: 'health',
    pubDate: '15 Feb 2026 09:00:00 +0530',
    guid: 'best-health-insurance-india-2026',
  },
  {
    title: 'Zero Depreciation Car Insurance Explained – Full Guide',
    description: 'Understand zero depreciation car insurance in detail. Learn how it saves you ₹50,000+ on claims, compare top insurers, and decide if zero dep is right for you.',
    link: `${BASE_URL}/blog/zero-dep-car-insurance-explained`,
    category: 'motor',
    pubDate: '10 Feb 2026 09:00:00 +0530',
    guid: 'zero-dep-car-insurance-explained',
  },
  {
    title: 'Cashless Claim Process – Step by Step Guide',
    description: 'Learn the exact step-by-step process for cashless health insurance claims in India. From intimation to settlement, master the entire process and avoid common mistakes.',
    link: `${BASE_URL}/blog/cashless-claim-process-step-by-step`,
    category: 'health',
    pubDate: '28 Jan 2026 09:00:00 +0530',
    guid: 'cashless-claim-process-step-by-step',
  },
  {
    title: 'Family Health Insurance Guide – Best Plans for Indian Families',
    description: 'Comprehensive guide to family health insurance in India. Compare family floater plans, understand coverage, and find the best plan for your family\'s needs and budget.',
    link: `${BASE_URL}/blog/family-health-insurance-guide`,
    category: 'health',
    pubDate: '20 Jan 2026 09:00:00 +0530',
    guid: 'family-health-insurance-guide',
  },
  {
    title: 'Third Party vs Comprehensive Insurance – Which is Better?',
    description: 'Detailed comparison between third-party and comprehensive motor insurance. Understand the differences, costs, and coverage to choose the right policy for your vehicle.',
    link: `${BASE_URL}/blog/third-party-vs-comprehensive-insurance`,
    category: 'motor',
    pubDate: '12 Jan 2026 09:00:00 +0530',
    guid: 'third-party-vs-comprehensive-insurance',
  },
  {
    title: 'Top 10 Insurance Claim Rejection Reasons & How to Avoid',
    description: 'Learn the top 10 reasons why insurance claims get rejected in India and how to avoid them. Practical tips from an IRDAI-certified advisor to protect your claims.',
    link: `${BASE_URL}/blog/insurance-claim-rejection-reasons`,
    category: 'health',
    pubDate: '05 Jan 2026 09:00:00 +0530',
    guid: 'insurance-claim-rejection-reasons',
  },
  {
    title: 'Best Insurance for Young Indians – Starter Guide',
    description: 'A complete starter guide for young Indians (20-35 years) on insurance. Learn which policies to buy first, how much coverage you need, and smart tips to save money.',
    link: `${BASE_URL}/blog/best-insurance-for-young-indians`,
    category: 'life',
    pubDate: '28 Dec 2025 09:00:00 +0530',
    guid: 'best-insurance-for-young-indians',
  },
  {
    title: 'Health Insurance Waiting Period Explained – What You Must Know',
    description: 'Everything about health insurance waiting periods in India — initial, pre-existing disease, maternity, and specific treatment waiting periods. Learn how to reduce or bypass them.',
    link: `${BASE_URL}/blog/health-insurance-waiting-period-explained`,
    category: 'health',
    pubDate: '20 Dec 2025 09:00:00 +0530',
    guid: 'health-insurance-waiting-period-explained',
  },
  {
    title: 'Term Insurance vs ULIP – Which One Should You Buy in 2025?',
    description: 'A detailed comparison of term insurance and ULIPs. Understand the key differences, costs, returns, and which one makes more financial sense for Indian investors.',
    link: `${BASE_URL}/blog/term-insurance-vs-ulip-2025`,
    category: 'life',
    pubDate: '15 Dec 2025 09:00:00 +0530',
    guid: 'term-insurance-vs-ulip-2025',
  },
  {
    title: 'Section 80D Tax Benefits on Health Insurance – Complete Guide',
    description: 'Maximize your tax savings under Section 80D. Learn about deductions for self, family, parents, and preventive health check-ups. Save up to ₹75,000 per year.',
    link: `${BASE_URL}/blog/section-80d-tax-benefits-health-insurance`,
    category: 'health',
    pubDate: '10 Dec 2025 09:00:00 +0530',
    guid: 'section-80d-tax-benefits-health-insurance',
  },
  {
    title: 'No Claim Bonus (NCB) in Car Insurance – How It Works',
    description: 'Understand how No Claim Bonus works in car insurance. Learn NCB slabs from 20% to 50%, how to retain NCB when switching insurers, and NCB protect add-on benefits.',
    link: `${BASE_URL}/blog/no-claim-bonus-car-insurance-calculator`,
    category: 'motor',
    pubDate: '05 Dec 2025 09:00:00 +0530',
    guid: 'no-claim-bonus-car-insurance-calculator',
  },
  {
    title: 'Travel Insurance for International Trips from India – Guide',
    description: 'Everything you need to know about travel insurance for Indians traveling abroad. Compare plans, understand coverage, and learn how to file claims overseas.',
    link: `${BASE_URL}/travel-insurance`,
    category: 'travel',
    pubDate: '01 Dec 2025 09:00:00 +0530',
    guid: 'travel-insurance-international-india',
  },
  {
    title: 'Home Insurance in India – Protect Your Biggest Investment',
    description: 'Comprehensive guide to home insurance in India. Compare building vs content cover, understand natural disaster and theft coverage, and find the best home insurance plan.',
    link: `${BASE_URL}/home-insurance`,
    category: 'home',
    pubDate: '25 Nov 2025 09:00:00 +0530',
    guid: 'home-insurance-india-guide',
  },
  {
    title: 'IDV in Car Insurance Explained – How It Affects Your Premium',
    description: 'Learn what Insured Declared Value (IDV) means, how it is calculated, and why it matters for your car insurance premium and claims settlement.',
    link: `${BASE_URL}/blog/idv-car-insurance-explained`,
    category: 'motor',
    pubDate: '20 Nov 2025 09:00:00 +0530',
    guid: 'idv-car-insurance-explained',
  },
  {
    title: 'Critical Illness Insurance vs Health Insurance – Key Differences',
    description: 'Understand the difference between critical illness insurance and regular health insurance. Learn when you need both, coverage differences, and how to choose wisely.',
    link: `${BASE_URL}/blog/critical-illness-vs-health-insurance`,
    category: 'health',
    pubDate: '15 Nov 2025 09:00:00 +0530',
    guid: 'critical-illness-vs-health-insurance',
  },
  {
    title: 'Best Bike Insurance in India 2025 – Compare Top Plans',
    description: 'Compare the best two-wheeler insurance plans in India. From comprehensive to third-party, understand IRDAI TP rates, add-ons, and find the right coverage for your bike.',
    link: `${BASE_URL}/bike-insurance`,
    category: 'motor',
    pubDate: '10 Nov 2025 09:00:00 +0530',
    guid: 'best-bike-insurance-india-2025',
  },
  {
    title: 'Insurance Ombudsman – How to File a Complaint and Win',
    description: 'Step-by-step guide to filing a complaint with the Insurance Ombudsman. Learn eligibility, process, timelines, and tips for getting your insurance dispute resolved.',
    link: `${BASE_URL}/blog/insurance-ombudsman-dispute-resolution`,
    category: 'health',
    pubDate: '05 Nov 2025 09:00:00 +0530',
    guid: 'insurance-ombudsman-dispute-resolution',
  },
  {
    title: 'Senior Citizen Health Insurance – Best Plans for Parents Above 60',
    description: 'Compare the best health insurance plans for senior citizens in India. Understand co-payment, pre-existing disease cover, and find affordable plans for your parents.',
    link: `${BASE_URL}/blog/health-insurance-senior-citizens-guide`,
    category: 'health',
    pubDate: '01 Nov 2025 09:00:00 +0530',
    guid: 'health-insurance-senior-citizens-guide',
  },
  {
    title: 'IRDAI New Rules 2025 – What Changes for Policyholders',
    description: 'Stay updated on IRDAI\'s latest regulations affecting Indian policyholders. From claim settlement timelines to portability rules, learn how these changes impact you.',
    link: `${BASE_URL}/blog/irdai-new-rules-2025`,
    category: 'life',
    pubDate: '25 Oct 2025 09:00:00 +0530',
    guid: 'irdai-new-rules-2025',
  },
  {
    title: 'Car Insurance Renewal Checklist – Don\'t Miss These Steps',
    description: 'Complete checklist for car insurance renewal in India. From comparing quotes to NCB transfer, add-on selection, and avoiding common renewal mistakes.',
    link: `${BASE_URL}/car-insurance-renewal`,
    category: 'motor',
    pubDate: '20 Oct 2025 09:00:00 +0530',
    guid: 'car-insurance-renewal-checklist',
  },
  {
    title: 'Super Top-Up Health Insurance – Why You Need One',
    description: 'Understand super top-up health insurance plans. Learn how they provide additional coverage at minimal cost, deductible concepts, and the best super top-up plans in India.',
    link: `${BASE_URL}/blog/super-top-up-health-insurance-india`,
    category: 'health',
    pubDate: '15 Oct 2025 09:00:00 +0530',
    guid: 'super-top-up-health-insurance-india',
  },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const itemsXml = rssItems
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${escapeXml(item.link)}</link>
      <category>${escapeXml(item.category)}</category>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="false">${escapeXml(item.guid)}</guid>
    </item>`
    )
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Paliwal Secure AI — Insurance Advisor India</title>
    <description>India's AI-powered insurance advisor. Compare health, life, motor, travel and home insurance from 51+ IRDAI-registered insurers. By Himanshu Paliwal — POSP Code IP429834.</description>
    <link>${BASE_URL}</link>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-IN</language>
    <copyright>Copyright ${new Date().getFullYear()} Paliwal Secure AI. All rights reserved.</copyright>
    <managingEditor>himanshu@paliwalsecure.in (Himanshu Paliwal)</managingEditor>
    <webMaster>himanshu@paliwalsecure.in (Himanshu Paliwal)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <category>Insurance</category>
    <category>Health Insurance</category>
    <category>Life Insurance</category>
    <category>Motor Insurance</category>
    <category>Travel Insurance</category>
    <category>Home Insurance</category>
    <ttl>60</ttl>
    <image>
      <url>${BASE_URL}/api/og?title=Paliwal%20Secure%20AI&type=default</url>
      <title>Paliwal Secure AI</title>
      <link>${BASE_URL}</link>
      <width>1200</width>
      <height>630</height>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
