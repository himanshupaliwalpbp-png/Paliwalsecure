import { NextResponse } from 'next/server';

/**
 * OpenAPI Specification — /.well-known/openapi.json
 * Describes Paliwal Secure AI's public API endpoints for AI agents and developers.
 */
export async function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Paliwal Secure AI — Insurance Advisor API',
      description:
        'Public API for comparing insurance plans, getting AI-powered recommendations, and accessing insurance knowledge from 51+ IRDAI-registered Indian insurers.',
      version: '1.0.0',
      contact: {
        name: 'Himanshu Paliwal',
        email: 'himanshu@paliwalsecure.in',
        url: 'https://paliwalsecure.in',
      },
      license: {
        name: 'Proprietary',
        url: 'https://paliwalsecure.in/terms-of-service',
      },
    },
    servers: [
      { url: 'https://paliwalsecure.in', description: 'Production' },
    ],
    paths: {
      '/api/chat': {
        post: {
          summary: 'InsureGPT AI Chat',
          description:
            'Chat with the InsureGPT AI advisor about insurance questions. Supports English, Hindi, and Hinglish.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['message'],
                  properties: {
                    message: { type: 'string', description: 'User question about insurance' },
                    language: { type: 'string', enum: ['en', 'hi', 'hinglish'], default: 'en' },
                    context: { type: 'string', description: 'Optional conversation context' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'AI response with insurance recommendation or answer',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      response: { type: 'string' },
                      recommendations: { type: 'array', items: { type: 'object' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/compare/health': {
        post: {
          summary: 'Compare Health Insurance Plans',
          description: 'Compare health insurance plans from multiple IRDAI-registered insurers.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    age: { type: 'number' },
                    familySize: { type: 'number' },
                    city: { type: 'string' },
                    sumInsured: { type: 'number' },
                    preExistingDiseases: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
          responses: { '200': { description: 'List of compared health insurance plans' } },
        },
      },
      '/api/compare/motor': {
        post: {
          summary: 'Compare Motor Insurance Plans',
          description: 'Compare car and bike insurance plans with IDV, premium, and add-on details.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    vehicleType: { type: 'string', enum: ['car', 'bike'] },
                    make: { type: 'string' },
                    model: { type: 'string' },
                    year: { type: 'number' },
                    city: { type: 'string' },
                    previousClaims: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: { '200': { description: 'List of compared motor insurance plans' } },
        },
      },
      '/api/recommendations': {
        post: {
          summary: 'Get Personalized Insurance Recommendations',
          description: 'AI-powered personalized insurance recommendations based on user profile.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    age: { type: 'number' },
                    familySize: { type: 'number' },
                    city: { type: 'string' },
                    budget: { type: 'number' },
                    insuranceType: { type: 'string', enum: ['health', 'motor', 'life', 'travel', 'home'] },
                  },
                },
              },
            },
          },
          responses: { '200': { description: 'Personalized insurance recommendations' } },
        },
      },
      '/api/advisor': {
        post: {
          summary: 'AI Advisor — Get Best Plan',
          description: 'Submit your profile and get top 3 AI-recommended insurance plans.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['age', 'familySize', 'city', 'budget'],
                  properties: {
                    age: { type: 'number', description: 'Your age' },
                    familySize: { type: 'number', description: 'Number of family members' },
                    city: { type: 'string', description: 'Your city' },
                    budget: { type: 'number', description: 'Monthly budget in INR' },
                    insuranceType: { type: 'string', enum: ['health', 'motor', 'life', 'travel', 'home'] },
                    preExistingDiseases: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
          responses: { '200': { description: 'Top 3 AI-recommended insurance plans' } },
        },
      },
      '/api/blog-translate': {
        post: {
          summary: 'Translate Blog Content',
          description: 'Translate blog articles to Hindi or Hinglish using AI.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['content', 'language', 'slug'],
                  properties: {
                    content: { type: 'string', description: 'Markdown content to translate' },
                    language: { type: 'string', enum: ['hi', 'hinglish'] },
                    slug: { type: 'string', description: 'Blog post slug for caching' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { '200': { description: 'Translated content' } },
        },
      },
    },
    components: {
      securitySchemes: {
        none: { type: 'none', description: 'No authentication required for public endpoints' },
      },
    },
  };

  return NextResponse.json(spec, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
