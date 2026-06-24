'use client';

import { useEffect } from 'react';

/**
 * WebMCP Provider — exposes site tools to AI agents via the browser.
 *
 * Uses navigator.modelContext.provideContext() (WebMCP API) to register
 * tools that AI agents can discover and invoke when the user has a
 * compatible browser/agent extension.
 *
 * Tools exposed:
 * 1. calculate_protection_score — calculate insurance protection score
 * 2. compare_insurance_plans — compare plans from 51+ insurers
 * 3. ask_insuregpt — chat with InsureGPT
 * 4. get_insurance_quote — get a quick quote
 * 5. find_insurance_agent — find nearby IRDAI-certified agent
 */
export function WebMCPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if WebMCP API is available
    const nav = navigator as any;
    if (!nav.modelContext?.provideContext) return;

    const unregister = nav.modelContext.provideContext({
      serverInfo: {
        name: 'paliwal-secure-insurance',
        version: '1.0.0',
      },
      tools: [
        {
          name: 'calculate_protection_score',
          description: 'Calculate a personalized insurance protection score (0-100) based on age, family size, city, and budget',
          inputSchema: {
            type: 'object',
            properties: {
              age: { type: 'number', description: 'User age (18-99)' },
              familySize: { type: 'number', description: 'Number of family members' },
              city: { type: 'string', description: 'City in India' },
              budget: { type: 'number', description: 'Monthly budget in INR' },
            },
            required: ['age'],
          },
          execute: async (args: { age: number; familySize?: number; city?: string; budget?: number }) => {
            const res = await fetch('/api/tools/protection-score', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(args),
            });
            return res.json();
          },
        },
        {
          name: 'compare_insurance_plans',
          description: 'Compare insurance plans from 51+ IRDAI-registered insurers across health, life, motor, travel, and home categories',
          inputSchema: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['health', 'life', 'car', 'bike', 'travel', 'home'] },
              budget: { type: 'number', description: 'Monthly/yearly budget in INR' },
              city: { type: 'string' },
            },
            required: ['type'],
          },
          execute: async (args: { type: string; budget?: number; city?: string }) => {
            const res = await fetch('/api/tools/compare-plans', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(args),
            });
            return res.json();
          },
        },
        {
          name: 'ask_insuregpt',
          description: 'Ask InsureGPT insurance questions in Hindi, English, or Hinglish. Get IRDAI-compliant answers.',
          inputSchema: {
            type: 'object',
            properties: {
              question: { type: 'string', description: 'Insurance question' },
              language: { type: 'string', enum: ['en', 'hi', 'hinglish'] },
            },
            required: ['question'],
          },
          execute: async (args: { question: string; language?: string }) => {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: args.question, language: args.language || 'en' }),
            });
            return res.json();
          },
        },
        {
          name: 'get_insurance_quote',
          description: 'Get a quick insurance quote for any category',
          inputSchema: {
            type: 'object',
            properties: {
              category: { type: 'string', enum: ['health', 'life', 'car', 'bike', 'travel', 'home'] },
              age: { type: 'number' },
              sumInsured: { type: 'number', description: 'Desired sum insured in INR' },
            },
            required: ['category'],
          },
          execute: async (args: { category: string; age?: number; sumInsured?: number }) => {
            const res = await fetch('/api/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ insuranceType: args.category, source: 'webmcp' }),
            });
            return res.json();
          },
        },
        {
          name: 'file_insurance_claim',
          description: 'Get step-by-step guidance for filing an insurance claim, including document checklists and IRDAI escalation process',
          inputSchema: {
            type: 'object',
            properties: {
              claimType: { type: 'string', enum: ['health', 'motor', 'life', 'travel', 'home'] },
              insurer: { type: 'string', description: 'Insurance company name' },
            },
            required: ['claimType'],
          },
          execute: async (args: { claimType: string; insurer?: string }) => {
            return {
              guidance: 'Visit https://paliwalsecure.in/claim-guide for step-by-step claim filing instructions',
              steps: [
                '1. Inform insurer within 24-48 hours',
                '2. Gather required documents',
                '3. Submit claim form',
                '4. Follow up with insurer',
                '5. If rejected, file complaint with IRDAI Bima Bharosa',
              ],
              irDaiHelpline: '155255',
              claimGuideUrl: 'https://paliwalsecure.in/claim-guide',
            };
          },
        },
      ],
    });

    return () => {
      if (typeof unregister === 'function') unregister();
    };
  }, []);

  return <>{children}</>;
}
