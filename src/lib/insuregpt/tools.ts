// ============================================================================
// InsureGPT — Tool Definitions (Function Calling)
// ============================================================================
// These tools let InsureGPT autonomously:
//   - comparePlans(category, criteria) → Top 3-5 plans
//   - calculatePremium(category, age, sumInsured, ...) → Estimated premium
//   - getPolicyDetails(planName or insurerName) → Full plan specs
//   - fetchIRDAIData(topic) → Latest IRDAI published data
//
// Each tool:
//   1. Has a JSON schema (for LLM function calling)
//   2. Has an executor that reads from src/lib/insurance-data.ts + scoring-engine.ts
//   3. Returns structured data the LLM can format into natural language
// ============================================================================

import {
  allInsurancePlans,
  type InsurancePlan,
  type InsuranceCategory,
  irdaiRegulations2025,
  marketTrends2026,
} from '@/lib/insurance-data';
import { INSURER_MASTER } from '@/lib/compare/insurer-master';

// ---------------------------------------------------------------------------
// Tool Schema Type (OpenAI-compatible function calling format)
// ---------------------------------------------------------------------------
export interface ToolSchema {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, unknown>;
      required: string[];
    };
  };
}

// ---------------------------------------------------------------------------
// Tool Executor Type
// ---------------------------------------------------------------------------
export type ToolExecutor = (args: Record<string, unknown>) => Promise<string>;

interface ToolDefinition {
  schema: ToolSchema;
  executor: ToolExecutor;
}

// ---------------------------------------------------------------------------
// Helper: format a plan as readable string
// ---------------------------------------------------------------------------
function formatPlan(plan: InsurancePlan): string {
  const lines: string[] = [
    `**${plan.name}** by ${plan.provider}`,
    `• Category: ${plan.category}`,
    `• Premium: ₹${plan.premium.monthly.toLocaleString('en-IN')}/mo (₹${plan.premium.annual.toLocaleString('en-IN')}/yr)`,
    `• Sum Insured: ₹${plan.sumInsured.min.toLocaleString('en-IN')} - ₹${plan.sumInsured.max.toLocaleString('en-IN')}`,
    `• Claim Settlement Ratio: ${plan.claimSettlementRatio}%`,
  ];

  if (plan.incurredClaimRatio !== undefined) {
    lines.push(`• Incurred Claim Ratio: ${plan.incurredClaimRatio}%`);
  }
  if (plan.solvencyRatio !== undefined) {
    lines.push(`• Solvency Ratio: ${plan.solvencyRatio}`);
  }
  if (plan.claimTurnaroundDays !== undefined) {
    lines.push(`• Claim Turnaround: ${plan.claimTurnaroundDays} days`);
  }
  if (plan.networkHospitals !== undefined) {
    lines.push(`• Network Hospitals: ${plan.networkHospitals.toLocaleString('en-IN')}+`);
  }
  if (plan.networkGarages !== undefined) {
    lines.push(`• Network Garages: ${plan.networkGarages.toLocaleString('en-IN')}+`);
  }
  if (plan.waitingPeriod) {
    lines.push(`• Waiting Period: ${plan.waitingPeriod}`);
  }
  if (plan.noClaimBonus) {
    lines.push(`• No Claim Bonus: ${plan.noClaimBonus}`);
  }
  if (plan.taxBenefit) {
    lines.push(`• Tax Benefit: ${plan.taxBenefit}`);
  }
  if (plan.roomRentLimit) {
    lines.push(`• Room Rent: ${plan.roomRentLimit}`);
  }
  if (plan.waitingPeriodDetailed) {
    const wp = plan.waitingPeriodDetailed;
    lines.push(`• PED Waiting: Diabetes ${wp.diabetes}mo, BP ${wp.bp}mo, Heart ${wp.heart}mo`);
  }
  if (plan.complaintsPer10k !== undefined) {
    lines.push(`• Complaints per 10k: ${plan.complaintsPer10k}`);
  }
  if (plan.features && plan.features.length > 0) {
    lines.push(`• Features: ${plan.features.slice(0, 5).join(', ')}`);
  }
  if (plan.exclusions && plan.exclusions.length > 0) {
    lines.push(`• Exclusions: ${plan.exclusions.slice(0, 3).join(', ')}`);
  }
  lines.push(`• IRDAI Reg. No: ${plan.irdaRegistrationNo}`);
  lines.push(`• Rating: ${plan.rating}/5`);

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Helper: get top plans by category with optional filters
// ---------------------------------------------------------------------------
function getTopPlans(
  category: InsuranceCategory | undefined,
  limit: number = 5,
  filters?: {
    maxMonthlyPremium?: number;
    minCSR?: number;
    minNetworkHospitals?: number;
    disease?: 'diabetes' | 'bp' | 'heart';
    maxPEDWaitingMonths?: number;
  }
): InsurancePlan[] {
  let plans = allInsurancePlans.filter((p) => p.category === category);

  if (filters?.maxMonthlyPremium !== undefined) {
    plans = plans.filter((p) => p.premium.monthly <= filters.maxMonthlyPremium!);
  }
  if (filters?.minCSR !== undefined) {
    plans = plans.filter((p) => p.claimSettlementRatio >= filters.minCSR!);
  }
  if (filters?.minNetworkHospitals !== undefined) {
    plans = plans.filter((p) => (p.networkHospitals ?? 0) >= filters.minNetworkHospitals!);
  }
  if (filters?.disease && filters?.maxPEDWaitingMonths !== undefined) {
    plans = plans.filter((p) => {
      if (!p.waitingPeriodDetailed) return false;
      const wp = p.waitingPeriodDetailed[filters.disease!];
      return wp !== undefined && wp <= filters.maxPEDWaitingMonths!;
    });
  }

  // Sort by claim settlement ratio (highest first), then by premium (lowest first)
  return plans
    .sort((a, b) => {
      const csrDiff = b.claimSettlementRatio - a.claimSettlementRatio;
      if (csrDiff !== 0) return csrDiff;
      return a.premium.monthly - b.premium.monthly;
    })
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// TOOL 1: comparePlans
// ---------------------------------------------------------------------------
const comparePlansTool: ToolDefinition = {
  schema: {
    type: 'function',
    function: {
      name: 'comparePlans',
      description:
        'Compare top insurance plans for a given category. Use this when the user asks to compare, wants best/top plans, or wants recommendations. Returns 3-5 plans with full specifications (CSR, premium, network, waiting periods, exclusions).',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['health', 'life', 'motor', 'travel', 'home'],
            description: 'Insurance category to compare',
          },
          maxMonthlyPremium: {
            type: 'number',
            description: 'Maximum monthly premium in INR (optional filter)',
          },
          minCSR: {
            type: 'number',
            description: 'Minimum claim settlement ratio percentage (e.g. 95)',
          },
          minNetworkHospitals: {
            type: 'number',
            description: 'Minimum network hospitals count (for health insurance)',
          },
          disease: {
            type: 'string',
            enum: ['diabetes', 'bp', 'heart'],
            description: 'If user has a pre-existing disease, filter by shorter PED waiting period',
          },
          maxPEDWaitingMonths: {
            type: 'number',
            description: 'Maximum PED waiting period in months (e.g. 24)',
          },
          limit: {
            type: 'number',
            description: 'Number of plans to return (default 5, max 8)',
          },
        },
        required: ['category'],
      },
    },
  },
  executor: async (args) => {
    const category = args.category as InsuranceCategory;
    const limit = Math.min(Number(args.limit) || 5, 8);
    const filters: Record<string, unknown> = {};
    if (args.maxMonthlyPremium !== undefined) filters.maxMonthlyPremium = Number(args.maxMonthlyPremium);
    if (args.minCSR !== undefined) filters.minCSR = Number(args.minCSR);
    if (args.minNetworkHospitals !== undefined) filters.minNetworkHospitals = Number(args.minNetworkHospitals);
    if (args.disease !== undefined) filters.disease = args.disease;
    if (args.maxPEDWaitingMonths !== undefined) filters.maxPEDWaitingMonths = Number(args.maxPEDWaitingMonths);

    const plans = getTopPlans(category, limit, filters as never);

    if (plans.length === 0) {
      return `No ${category} insurance plans found matching the criteria. Try broadening filters.`;
    }

    const header = `Top ${plans.length} ${category.toUpperCase()} insurance plans in India (Source: IRDAI Annual Report 2025-26):\n\n`;
    const body = plans.map((p, i) => `${i + 1}. ${formatPlan(p)}`).join('\n\n');
    const footer = `\n\n---\n💰 Quick comparison:\n• Lowest premium: ₹${Math.min(...plans.map((p) => p.premium.monthly))}/mo — ${plans.find((p) => p.premium.monthly === Math.min(...plans.map((pl) => pl.premium.monthly)))?.name}\n• Highest CSR: ${Math.max(...plans.map((p) => p.claimSettlementRatio))}% — ${plans.find((p) => p.claimSettlementRatio === Math.max(...plans.map((pl) => pl.claimSettlementRatio)))?.name}\n• Most network hospitals: ${Math.max(...plans.map((p) => p.networkHospitals ?? 0))}+`;

    return header + body + footer;
  },
};

// ---------------------------------------------------------------------------
// TOOL 2: calculatePremium
// ---------------------------------------------------------------------------
const calculatePremiumTool: ToolDefinition = {
  schema: {
    type: 'function',
    function: {
      name: 'calculatePremium',
      description:
        'Calculate estimated insurance premium based on user inputs. Returns premium range across top 3 insurers with breakdown. Use this when user asks "kitna premium hoga" or "how much will it cost".',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['health', 'life', 'motor', 'travel', 'home'],
            description: 'Insurance category',
          },
          age: {
            type: 'number',
            description: 'Primary member age in years',
          },
          sumInsured: {
            type: 'number',
            description: 'Desired sum insured in INR (e.g. 1000000 for ₹10 Lakh, 10000000 for ₹1 Crore)',
          },
          familySize: {
            type: 'number',
            description: 'Number of family members to cover (for family floater, default 1)',
          },
          isSmoker: {
            type: 'boolean',
            description: 'Whether the user is a smoker (affects life insurance premium)',
          },
          city: {
            type: 'string',
            description: 'User city (affects motor and health premium)',
          },
        },
        required: ['category'],
      },
    },
  },
  executor: async (args) => {
    const category = args.category as InsuranceCategory;
    const age = Number(args.age) || 30;
    const sumInsured = Number(args.sumInsured) || 0;
    const familySize = Number(args.familySize) || 1;

    const plans = getTopPlans(category, 3);

    if (plans.length === 0) {
      return `No plans available for ${category} category.`;
    }

    let result = `**Estimated Premium Range for ${category.toUpperCase()} Insurance**\n`;
    result += `User profile: Age ${age}, ${familySize > 1 ? `Family floater (${familySize} members)` : 'Individual'}${sumInsured > 0 ? `, Sum Insured ₹${sumInsured.toLocaleString('en-IN')}` : ''}\n\n`;

    result += `**Top 3 plans with estimated premium:**\n\n`;

    plans.forEach((plan, i) => {
      // Base premium from plan data
      let baseMonthly = plan.premium.monthly;

      // Age-based adjustment (older = higher premium for health/life)
      if (category === 'health' || category === 'life') {
        if (age > 45) baseMonthly *= 1.8;
        else if (age > 35) baseMonthly *= 1.4;
        else if (age < 25) baseMonthly *= 0.85;
      }

      // Family size adjustment (family floater multiplier)
      if (familySize > 1 && category === 'health') {
        baseMonthly *= 1 + (familySize - 1) * 0.35;
      }

      // Sum insured adjustment (if specified and different from default)
      if (sumInsured > 0) {
        const defaultSI = (plan.sumInsured.min + plan.sumInsured.max) / 2;
        const ratio = sumInsured / defaultSI;
        baseMonthly *= Math.sqrt(ratio); // Square root — premium doesn't scale linearly
      }

      // Smoker surcharge (life insurance)
      if (args.isSmoker === true && category === 'life') {
        baseMonthly *= 1.25;
      }

      const finalMonthly = Math.round(baseMonthly);
      const finalAnnual = finalMonthly * 12;

      result += `**${i + 1}. ${plan.name}** by ${plan.provider}\n`;
      result += `   • Estimated Premium: ₹${finalMonthly.toLocaleString('en-IN')}/mo (₹${finalAnnual.toLocaleString('en-IN')}/yr)\n`;
      result += `   • CSR: ${plan.claimSettlementRatio}%\n`;
      if (plan.networkHospitals) {
        result += `   • Network: ${plan.networkHospitals.toLocaleString('en-IN')}+ hospitals\n`;
      }
      if (plan.waitingPeriodDetailed) {
        result += `   • PED Waiting: Diabetes ${plan.waitingPeriodDetailed.diabetes}mo\n`;
      }
      result += `\n`;
    });

    result += `**Note:** Yeh estimates hain — actual premium aapki exact age, medical history, city, aur insurer underwriting ke basis pe vary karega. Exact quote ke liye certified advisor se baat karein.\n\n`;
    result += `**Tax Benefit:** Section 80D ke under ₹${Math.round(plans[0].premium.monthly * 12 * 0.3).toLocaleString('en-IN')} tak tax bachat (30% bracket me).`;

    return result;
  },
};

// ---------------------------------------------------------------------------
// TOOL 3: getPolicyDetails
// ---------------------------------------------------------------------------
const getPolicyDetailsTool: ToolDefinition = {
  schema: {
    type: 'function',
    function: {
      name: 'getPolicyDetails',
      description:
        'Get full specifications of a specific insurance plan or all plans from a specific insurer. Use this when user asks about a specific plan by name (e.g. "Care Health plan details") or insurer (e.g. "HDFC ERGO plans").',
      parameters: {
        type: 'object',
        properties: {
          planName: {
            type: 'string',
            description: 'Plan name to search for (partial match supported)',
          },
          insurerName: {
            type: 'string',
            description: 'Insurer name (e.g. "HDFC ERGO", "Care Health", "ICICI Lombard")',
          },
        },
        required: [],
      },
    },
  },
  executor: async (args) => {
    const planName = (args.planName as string)?.toLowerCase().trim();
    const insurerName = (args.insurerName as string)?.toLowerCase().trim();

    if (!planName && !insurerName) {
      return 'Please provide either planName or insurerName.';
    }

    let matchedPlans: InsurancePlan[] = allInsurancePlans.filter((p) => {
      const nameMatch = planName && p.name.toLowerCase().includes(planName);
      const providerMatch = insurerName && p.provider.toLowerCase().includes(insurerName);
      return planName && insurerName ? (nameMatch && providerMatch) : (nameMatch || providerMatch);
    });

    if (matchedPlans.length === 0) {
      // Try fuzzy match on insurer master
      const insurerKeys = Object.keys(INSURER_MASTER);
      const matchedKey = insurerKeys.find((k) => {
        const ins = INSURER_MASTER[k];
        return (
          ins.name.toLowerCase().includes(insurerName || '') ||
          ins.shortName.toLowerCase().includes(insurerName || '')
        );
      });

      if (matchedKey) {
        const ins = INSURER_MASTER[matchedKey];
        let result = `**${ins.name}** (${ins.shortName}) — Insurer Master Data\n\n`;
        result += `• Type: ${ins.type}\n`;
        result += `• Categories: ${ins.categories.join(', ')}\n`;
        result += `• Claim Settlement Ratio: ${ins.CSR}%\n`;
        if (ins.motorCSR) result += `• Motor CSR: ${ins.motorCSR}%\n`;
        if (ins.healthCSR) result += `• Health CSR: ${ins.healthCSR}%\n`;
        result += `• Network Garages: ${ins.garages.toLocaleString('en-IN')}\n`;
        result += `• Network Hospitals: ${ins.hospitals.toLocaleString('en-IN')}\n`;
        result += `• App Rating: ${ins.appRating}/5\n`;
        result += `• Average Claim Time: ${ins.claimTime}\n`;
        result += `• Solvency Ratio: ${ins.solvencyRatio}\n`;
        result += `• Customer Care: ${ins.customerCare}\n`;
        result += `• Website: ${ins.websiteUrl}\n`;
        return result;
      }

      return `No plan or insurer found matching "${planName || insurerName}". Try different spelling or check available plans at /compare.`;
    }

    if (matchedPlans.length > 5) {
      matchedPlans = matchedPlans.slice(0, 5);
    }

    const header = matchedPlans.length === 1
      ? `**Plan Details:**\n\n`
      : `Found ${matchedPlans.length} matching plans:\n\n`;

    return header + matchedPlans.map((p, i) => `${i + 1}. ${formatPlan(p)}`).join('\n\n');
  },
};

// ---------------------------------------------------------------------------
// TOOL 4: fetchIRDAIData
// ---------------------------------------------------------------------------
const fetchIRDAIDataTool: ToolDefinition = {
  schema: {
    type: 'function',
    function: {
      name: 'fetchIRDAIData',
      description:
        'Fetch latest IRDAI published data — regulations, claim settlement ratios, market trends, solvency ratios. Use this when user asks about IRDAI rules, latest regulations, claim settlement ratios, or industry data.',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            enum: ['regulations', 'csr', 'solvency', 'complaints', 'trends'],
            description: 'Type of IRDAI data to fetch',
          },
        },
        required: ['topic'],
      },
    },
  },
  executor: async (args) => {
    const topic = args.topic as string;

    switch (topic) {
      case 'regulations': {
        const regs = irdaiRegulations2025.slice(0, 5);
        let result = `**IRDAI 2025-26 Latest Regulations** (Source: IRDAI Gazette Notifications)\n\n`;
        regs.forEach((reg, i) => {
          result += `**${i + 1}. ${reg.title}** (Effective: ${reg.effectiveDate})\n`;
          result += `   ❌ Before: ${reg.beforeChange}\n`;
          result += `   ✅ Now: ${reg.afterChange}\n`;
          result += `   🎯 Impact: ${reg.impactLevel.toUpperCase()}\n\n`;
        });
        result += `💡 Policyholders should check if their existing policies comply with new rules. Contact insurer for updates.`;
        return result;
      }

      case 'csr': {
        let result = `**IRDAI Claim Settlement Ratios FY 2024-25** (Source: IRDAI Annual Report 2025-26)\n\n`;
        result += `**General Insurance (Motor, Health, Travel, Home):**\n`;
        const generalInsurers = Object.entries(INSURER_MASTER)
          .filter(([, ins]) => ins.type === 'general')
          .sort(([, a], [, b]) => b.CSR - a.CSR)
          .slice(0, 8);
        generalInsurers.forEach(([, ins]) => {
          result += `• ${ins.shortName}: ${ins.CSR}% (Solvency: ${ins.solvencyRatio})\n`;
        });

        result += `\n**Life Insurance (Term Plans):**\n`;
        const lifeInsurers = Object.entries(INSURER_MASTER)
          .filter(([, ins]) => ins.type === 'life')
          .sort(([, a], [, b]) => b.CSR - a.CSR);
        lifeInsurers.forEach(([, ins]) => {
          result += `• ${ins.shortName}: ${ins.CSR}%\n`;
        });

        result += `\n⚠️ Note: CSR is one factor — also check incurred claim ratio, solvency, complaint ratio, and network size.`;
        return result;
      }

      case 'solvency': {
        let result = `**IRDAI Solvency Ratios** (Source: IRDAI Annual Report 2025-26)\n\n`;
        result += `**IRDAI Mandate:**\n• Life insurers: Minimum 1.50 (150%)\n• General insurers: Minimum 1.50 (150%)\n\n`;
        result += `**Top insurers by solvency:**\n`;
        const sorted = Object.entries(INSURER_MASTER)
          .sort(([, a], [, b]) => b.solvencyRatio - a.solvencyRatio)
          .slice(0, 10);
        sorted.forEach(([, ins]) => {
          const margin = ((ins.solvencyRatio - 1.5) * 100).toFixed(0);
          result += `• ${ins.shortName}: ${ins.solvencyRatio} (margin: +${margin}% above mandate)\n`;
        });
        return result;
      }

      case 'complaints': {
        let result = `**IRDAI Complaint Data FY 2024-25** (Source: IRDAI Grievance Report)\n\n`;
        result += `**Complaints per 10,000 claims (lower = better):**\n\n`;
        // We have complaints data in plans, aggregate by insurer
        const complaintsByInsurer = new Map<string, { count: number; total: number }>();
        for (const plan of allInsurancePlans) {
          if (plan.complaintsPer10k !== undefined) {
            const current = complaintsByInsurer.get(plan.provider) ?? { count: 0, total: 0 };
            current.count += plan.complaintsPer10k;
            current.total += 1;
            complaintsByInsurer.set(plan.provider, current);
          }
        }
        const ranked = Array.from(complaintsByInsurer.entries())
          .map(([name, { count, total }]) => ({ name, avg: count / total }))
          .sort((a, b) => a.avg - b.avg)
          .slice(0, 10);
        ranked.forEach((c) => {
          result += `• ${c.name}: ${c.avg.toFixed(1)} per 10k claims\n`;
        });
        result += `\n💡 File complaints at igms.irda.gov.in or call 1800-258-1111 (IRDAI helpline).`;
        return result;
      }

      case 'trends': {
        let result = `**Indian Insurance Industry Trends 2025-26** (Source: IRDAI Annual Report)\n\n`;
        marketTrends2026.slice(0, 5).forEach((trend, i) => {
          result += `**${i + 1}. ${trend.title}** (${trend.year})\n`;
          result += `${trend.summary}\n`;
          result += `Impact: ${trend.impact}\n`;
          result += `Source: ${trend.source}\n\n`;
        });
        return result;
      }

      default:
        return `Unknown topic: ${topic}. Available: regulations, csr, solvency, complaints, trends.`;
    }
  },
};

// ---------------------------------------------------------------------------
// Export all tools
// ---------------------------------------------------------------------------
export const TOOLS: Record<string, ToolDefinition> = {
  comparePlans: comparePlansTool,
  calculatePremium: calculatePremiumTool,
  getPolicyDetails: getPolicyDetailsTool,
  fetchIRDAIData: fetchIRDAIDataTool,
};

// Array of tool schemas for LLM
export const TOOL_SCHEMAS: ToolSchema[] = Object.values(TOOLS).map((t) => t.schema);

// Execute a tool by name
export async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  const tool = TOOLS[name];
  if (!tool) {
    return `Unknown tool: ${name}. Available tools: ${Object.keys(TOOLS).join(', ')}`;
  }
  try {
    return await tool.executor(args);
  } catch (error) {
    console.error(`Tool ${name} error:`, error);
    return `Tool ${name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

// Check if a tool call is needed based on message (hint for LLM)
export function getToolHints(message: string): string[] {
  const lower = message.toLowerCase();
  const hints: string[] = [];

  if (/\b(compare|vs|versus|best|top|recommend|suggest|achha|sahi|sujhav)\b/i.test(lower)) {
    hints.push('comparePlans');
  }
  if (/\b(kitna|kitni|how\s*much|premium|cost|calculate|price)\b/i.test(lower)) {
    hints.push('calculatePremium');
  }
  if (/\b(plan\s*detail|specific\s*plan|kya\s*hai|details|info)\b/i.test(lower)) {
    hints.push('getPolicyDetails');
  }
  if (/\b(irdai|regulation|rule|niyam|latest|update|new\s*rule)\b/i.test(lower)) {
    hints.push('fetchIRDAIData');
  }

  return hints;
}
