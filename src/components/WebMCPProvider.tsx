'use client';

import { useEffect } from 'react';

/**
 * WebMCP Provider — exposes site tools to AI agents via the browser.
 * Uses navigator.modelContext.provideContext() (WebMCP API).
 */
export function WebMCPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const nav = navigator as any;
    if (!nav.modelContext?.provideContext) {
      // Also try window.modelContext (some implementations use this)
      const win = window as any;
      if (!win.modelContext?.provideContext) return;
      win.modelContext.provideContext(getContextConfig());
      return;
    }

    const unregister = nav.modelContext.provideContext(getContextConfig());

    return () => {
      if (typeof unregister === 'function') unregister();
    };
  }, []);

  return <>{children}</>;
}

function getContextConfig() {
  return {
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
        description: 'Compare insurance plans from 51+ IRDAI-registered insurers',
        inputSchema: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['health', 'life', 'car', 'bike', 'travel', 'home'] },
            budget: { type: 'number' },
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
        description: 'Ask InsureGPT insurance questions in Hindi, English, or Hinglish',
        inputSchema: {
          type: 'object',
          properties: {
            question: { type: 'string' },
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
        description: 'Get a quick insurance quote',
        inputSchema: {
          type: 'object',
          properties: {
            category: { type: 'string', enum: ['health', 'life', 'car', 'bike', 'travel', 'home'] },
            age: { type: 'number' },
            sumInsured: { type: 'number' },
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
        description: 'Get claim filing guidance, document checklists, IRDAI escalation',
        inputSchema: {
          type: 'object',
          properties: {
            claimType: { type: 'string', enum: ['health', 'motor', 'life', 'travel', 'home'] },
            insurer: { type: 'string' },
          },
          required: ['claimType'],
        },
        execute: async () => {
          return {
            guidance: 'Visit https://paliwalsecure.in/claim-guide',
            irDAIHelpline: '155255',
            steps: ['Inform insurer', 'Gather documents', 'Submit claim', 'Follow up', 'Escalate to IRDAI if rejected'],
          };
        },
      },
    ],
  };
}
