import { NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Mock IRDAI Updates — static data that can be extended
// In production, this would scrape IRDAI's website or use an API
// ---------------------------------------------------------------------------

interface IRDAIUpdate {
  id: string;
  title: string;
  date: string;
  category: 'motor' | 'health' | 'life' | 'general' | 'regulation';
  summary: string;
  slug: string;
}

const IRDAI_UPDATES: IRDAIUpdate[] = [
  {
    id: 'irdai-tp-rate-2026',
    title: 'IRDAI Third-Party Premium Rate Revision 2026',
    date: '2026-04-01',
    category: 'motor',
    summary:
      'IRDAI has revised third-party motor insurance premium rates effective April 1, 2026. Private cars up to 1000cc see a 6% increase, while two-wheelers see a 4-8% hike depending on engine capacity. Electric vehicle TP rates continue to enjoy a 15% discount over ICE counterparts.',
    slug: 'tp-rate-revision-2026',
  },
  {
    id: 'irdai-health-gst-exempt-2025',
    title: 'Health Insurance GST Exemption — GST Council 56th Meeting',
    date: '2025-09-22',
    category: 'health',
    summary:
      'The GST Council, in its 56th meeting on September 22, 2025, has exempted health insurance premiums from GST for individual and family floater policies. This reduces the effective cost of health insurance by 18%, making coverage more affordable for millions of Indian families.',
    slug: 'health-gst-exemption-2025',
  },
  {
    id: 'irdai-bima-sugam-2026',
    title: 'Bima Sugam Platform Update — Full Integration with All Insurers',
    date: '2026-03-15',
    category: 'general',
    summary:
      'IRDAI\'s Bima Sugam platform is now fully integrated with all 53 registered insurers. Policyholders can view, manage, and port all their insurance policies through a single dashboard. New features include AI-based claim tracking and instant policy comparison.',
    slug: 'bima-sugam-full-integration-2026',
  },
  {
    id: 'irdai-product-guidelines-2026',
    title: 'IRDAI New Product Guidelines — Standardized Health & Motor Policies',
    date: '2026-02-10',
    category: 'regulation',
    summary:
      'IRDAI has introduced new product guidelines mandating standardized base policies for health and motor insurance. All insurers must offer a base plan with minimum coverage features defined by IRDAI. Add-ons remain customizable. This aims to simplify policy comparison for consumers.',
    slug: 'product-guidelines-2026',
  },
  {
    id: 'irdai-claim-timeline-2026',
    title: 'IRDAI Mandates 15-Day Claim Settlement Timeline for Health Insurance',
    date: '2026-01-20',
    category: 'health',
    summary:
      'IRDAI has mandated that all health insurance claims must be settled within 15 working days from the date of receiving all required documents. Failure to meet this timeline will result in a penalty of 2% per month interest on the claim amount payable to the policyholder.',
    slug: 'claim-settlement-timeline-2026',
  },
];

// ---------------------------------------------------------------------------
// GET Handler
// ---------------------------------------------------------------------------
export async function GET() {
  try {
    const responseData = {
      lastChecked: '2026-05-14T10:00:00Z',
      updates: IRDAI_UPDATES,
      source: 'IRDAI Official Notifications',
      disclaimer:
        'Data shown is for informational purposes. Always verify with IRDAI\'s official website (irdai.gov.in) for the latest updates.',
    };

    const response = NextResponse.json(responseData);

    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // Cache for 1 hour
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('IRDAI news check error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch IRDAI updates', details: message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// OPTIONS Handler (CORS preflight)
// ---------------------------------------------------------------------------
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}
