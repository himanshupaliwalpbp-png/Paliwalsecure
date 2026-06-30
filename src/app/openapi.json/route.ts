import { NextResponse } from 'next/server';

/**
 * /openapi.json — OpenAPI 3.1 spec with MPP x-payment-info extensions
 */
export async function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Paliwal Secure AI — Insurance Intelligence API',
      version: '1.0.0',
      description: 'AI-powered insurance advisory platform with 51+ insurers. Protection score, plan comparison, InsureGPT chat, claim guidance, and policy audit.',
      contact: { email: 'himanshupaliwalpbp@gmail.com', name: 'Himanshu Paliwal' },
    },
    servers: [{ url: 'https://paliwalsecure.in/api' }],
    paths: {
      '/chat': {
        post: {
          summary: 'Chat with InsureGPT',
          'x-payment-info': {
            intent: 'session',
            method: 'tempo',
            amount: '0',
            currency: 'INR',
          },
          responses: { '200': { description: 'Chat response' } },
        },
      },
      '/leads': {
        post: {
          summary: 'Create insurance lead',
          'x-payment-info': {
            intent: 'charge',
            method: 'stripe',
            amount: '0',
            currency: 'INR',
          },
          responses: { '201': { description: 'Lead created' } },
        },
      },
      '/audit': {
        post: {
          summary: 'Audit insurance policy',
          'x-payment-info': {
            intent: 'charge',
            method: 'stripe',
            amount: '99',
            currency: 'INR',
          },
          responses: { '200': { description: 'Audit result' } },
        },
      },
      '/tools/protection-score': {
        post: {
          summary: 'Calculate protection score',
          'x-payment-info': { intent: 'session', method: 'tempo', amount: '0', currency: 'INR' },
          responses: { '200': { description: 'Score calculated' } },
        },
      },
      '/tools/compare-plans': {
        post: {
          summary: 'Compare insurance plans',
          'x-payment-info': { intent: 'session', method: 'tempo', amount: '0', currency: 'INR' },
          responses: { '200': { description: 'Comparison results' } },
        },
      },
    },
  };
  return NextResponse.json(spec, {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
  });
}
