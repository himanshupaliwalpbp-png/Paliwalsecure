import { NextResponse } from 'next/server';

/**
 * AI Plugin Manifest — /.well-known/ai-plugin.json
 * Describes Paliwal Secure AI's capabilities to AI chatbots, LLM agents, and plugin systems.
 * Follows the OpenAI plugin manifest specification.
 */
export async function GET() {
  const manifest = {
    schema_version: 'v1',
    name_for_model: 'paliwal_secure_ai',
    name_for_human: 'Paliwal Secure AI — Insurance Advisor',
    description_for_model:
      'Paliwal Secure AI is an Indian insurance advisory platform that helps users compare health, motor (car/bike), life (term), travel, and home insurance plans from 51+ IRDAI-registered insurers. It provides personalized recommendations, premium calculations, claims guidance, and regulatory information. The AI assistant (InsureGPT) answers insurance questions in English, Hindi, and Hinglish. Use this plugin when users ask about insurance in India, insurance comparison, premium rates, claim processes, IRDAI regulations, or need insurance recommendations.',
    description_for_human:
      'Compare 51+ insurers for health, car, bike, life, travel & home insurance. Get AI-powered recommendations with InsureGPT. By IRDAI Certified POSP Himanshu Paliwal.',
    auth: {
      type: 'none',
    },
    api: {
      type: 'openapi',
      url: 'https://paliwalsecure.in/api/well-known/openapi.json',
      has_user_authentication: false,
    },
    logo_url: 'https://paliwalsecure.in/logo.svg',
    contact_email: 'himanshu@paliwalsecure.in',
    legal_info_url: 'https://paliwalsecure.in/policyholder-rights',
    // Extended metadata for AI discoverability
    capabilities: {
      insurance_comparison: {
        description: 'Compare insurance plans across 51+ IRDAI-registered insurers',
        categories: ['health', 'car', 'bike', 'life', 'travel', 'home'],
        supported_languages: ['en-IN', 'hi-IN', 'hinglish'],
      },
      ai_advisor: {
        description: 'InsureGPT AI chatbot for insurance questions and recommendations',
        supported_topics: [
          'health insurance',
          'car insurance',
          'bike insurance',
          'term life insurance',
          'travel insurance',
          'home insurance',
          'claim process',
          'IRDAI regulations',
          'premium calculation',
          'tax benefits',
          'zero depreciation',
          'cashless claims',
        ],
      },
      premium_calculator: {
        description: 'Calculate insurance premiums using IRDAI rates',
        types: ['motor', 'health', 'term_life'],
      },
      claims_support: {
        description: 'Step-by-step guidance for cashless and reimbursement claims',
        supported_insurers: '51+ IRDAI-registered insurers',
      },
    },
    trust_signals: {
      irdai_certified: true,
      posp_code: 'IP429834',
      advisor_name: 'Himanshu Paliwal',
      families_served: 500,
      insurer_count: 51,
      location: 'Jaipur, Rajasthan, India',
      whatsapp: '+919257877312',
    },
  };

  return NextResponse.json(manifest, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
