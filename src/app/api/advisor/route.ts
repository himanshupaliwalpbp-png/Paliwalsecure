// ============================================================================
// Paliwal Secure AI - Advisor API Route
// POST endpoint: Receives user profile, generates AI insurance recommendations,
// saves lead to database, and returns structured recommendations
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ── Input Types ──────────────────────────────────────────────────────────────
interface AdvisorRequest {
  age: number;
  familySize: number;
  city: string;
  budget: number;
  name?: string;
  phone?: string;
}

// ── Recommendation Structure ─────────────────────────────────────────────────
interface PlanRecommendation {
  insurer: string;
  plan: string;
  monthlyPremium: string;
  sumInsured: string;
  whyItFits: string;
  claimRatio: string;
  rating: number;
}

interface AdvisorResponse {
  plans: PlanRecommendation[];
  advisorMessage: string;
  followUpQuestion: string;
}

// ── Validation ───────────────────────────────────────────────────────────────
function validateInputs(body: AdvisorRequest): string | null {
  if (!body.age || typeof body.age !== 'number' || body.age < 18 || body.age > 80) {
    return 'Age must be between 18 and 80';
  }
  if (!body.familySize || typeof body.familySize !== 'number' || body.familySize < 1 || body.familySize > 10) {
    return 'Family size must be between 1 and 10';
  }
  if (!body.city || typeof body.city !== 'string' || body.city.trim().length === 0) {
    return 'City is required';
  }
  if (!body.budget || typeof body.budget !== 'number' || body.budget < 500 || body.budget > 50000) {
    return 'Monthly budget must be between ₹500 and ₹50,000';
  }
  if (body.name !== undefined && typeof body.name !== 'string') {
    return 'Name must be a string';
  }
  if (body.phone !== undefined && typeof body.phone !== 'string') {
    return 'Phone must be a string';
  }
  return null;
}

// ── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an Indian licensed insurance advisor, IRDAI-registered (POSP IP429834), working for Paliwal Secure AI. You are conservative, transparent about commissions, and never recommend without enough info. You reply in the user's language (Hindi/Hinglish if they write in Hindi, English otherwise).

Based on the user's profile, recommend 3 insurance plans. For each plan provide:
- insurer: Company name
- plan: Plan name  
- monthlyPremium: Estimated monthly premium (label as "indicative")
- sumInsured: Coverage amount
- whyItFits: 1-2 line reason why this fits
- claimRatio: Claim settlement ratio percentage
- rating: Star rating out of 5

Also provide:
- advisorMessage: A personal 2-3 line message to the user
- followUpQuestion: One question to learn more about their needs

IMPORTANT: Always label premiums as "indicative". Always end with "talk to a human advisor for exact quotes". Only discuss insurance topics.

You MUST respond with valid JSON only, in this exact format:
{
  "plans": [
    {
      "insurer": "Company Name",
      "plan": "Plan Name",
      "monthlyPremium": "₹X/month (indicative)",
      "sumInsured": "₹Y",
      "whyItFits": "Reason...",
      "claimRatio": "XX%",
      "rating": 4.5
    }
  ],
  "advisorMessage": "Personal message...",
  "followUpQuestion": "Question..."
}`;

// ── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: AdvisorRequest = await request.json();

    // Validate inputs
    const validationError = validateInputs(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const { age, familySize, city, budget, name, phone } = body;

    // Build user message for the AI
    const userMessage = `User profile: Age ${age}, Family size ${familySize}, City ${city}, Monthly budget ₹${budget}. Please recommend the best insurance plans.`;

    // ── Call AI via z-ai-web-dev-sdk ──────────────────────────────────────
    let recommendations: AdvisorResponse | null = null;
    let rawAIResponse: string | null = null;
    let advisorMessage = '';

    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const zai = await ZAI.create();

      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        thinking: { type: 'disabled' },
        temperature: 0.3,
      });

      rawAIResponse = completion?.choices?.[0]?.message?.content || null;

      if (rawAIResponse) {
        // Try to extract JSON from the response
        recommendations = extractJSON(rawAIResponse);

        if (recommendations) {
          advisorMessage = recommendations.advisorMessage || '';
        } else {
          // JSON parsing failed — use raw text as advisorMessage
          advisorMessage = rawAIResponse;
          recommendations = null;
        }
      }
    } catch (aiError) {
      console.error('[Advisor API] AI service error:', aiError);
      advisorMessage = 'We could not generate AI recommendations at this time. Please try again shortly or talk to a human advisor for exact quotes.';
    }

    // ── Save lead to database ─────────────────────────────────────────────
    let savedLeadId: string | null = null;
    try {
      const lead = await db.advisorLead.create({
        data: {
          age,
          familySize,
          city: city.trim(),
          budget,
          name: name?.trim() || null,
          phone: phone?.trim() || null,
          recommendations: recommendations ? JSON.stringify(recommendations) : (rawAIResponse || null),
          advisorMessage: advisorMessage || null,
          source: 'advisor-form',
        },
      });
      savedLeadId = lead.id;
    } catch (dbError) {
      console.error('[Advisor API] Database save error:', dbError);
      // Non-fatal — we still return recommendations even if DB save fails
    }

    // ── Build response ────────────────────────────────────────────────────
    const responseData: {
      success: boolean;
      plans?: PlanRecommendation[];
      advisorMessage?: string;
      followUpQuestion?: string;
      leadId?: string;
      error?: string;
    } = {
      success: true,
    };

    if (recommendations) {
      responseData.plans = recommendations.plans;
      responseData.advisorMessage = recommendations.advisorMessage;
      responseData.followUpQuestion = recommendations.followUpQuestion;
    } else if (rawAIResponse) {
      // AI responded but we couldn't parse structured JSON
      responseData.advisorMessage = rawAIResponse;
      responseData.plans = [];
    } else {
      // AI service failed entirely
      responseData.advisorMessage = advisorMessage;
      responseData.plans = [];
    }

    if (savedLeadId) {
      responseData.leadId = savedLeadId;
    }

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('[Advisor API] Unhandled error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// ── JSON Extraction Utility ──────────────────────────────────────────────────
function extractJSON(text: string): AdvisorResponse | null {
  // Strategy 1: Try direct JSON parse
  try {
    const parsed = JSON.parse(text);
    if (isValidAdvisorResponse(parsed)) {
      return parsed;
    }
  } catch {
    // Not direct JSON, try extraction strategies
  }

  // Strategy 2: Extract JSON from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (isValidAdvisorResponse(parsed)) {
        return parsed;
      }
    } catch {
      // Code block didn't contain valid JSON
    }
  }

  // Strategy 3: Find first { ... } block
  const braceStart = text.indexOf('{');
  const braceEnd = text.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd > braceStart) {
    try {
      const jsonCandidate = text.substring(braceStart, braceEnd + 1);
      const parsed = JSON.parse(jsonCandidate);
      if (isValidAdvisorResponse(parsed)) {
        return parsed;
      }
    } catch {
      // Braces didn't form valid JSON
    }
  }

  return null;
}

// ── Response Validation ──────────────────────────────────────────────────────
function isValidAdvisorResponse(obj: unknown): obj is AdvisorResponse {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;

  // Must have plans array
  if (!Array.isArray(o.plans)) return false;

  // Must have advisorMessage and followUpQuestion
  if (typeof o.advisorMessage !== 'string') return false;
  if (typeof o.followUpQuestion !== 'string') return false;

  // Validate each plan has required fields
  for (const plan of o.plans) {
    if (!plan || typeof plan !== 'object') return false;
    const p = plan as Record<string, unknown>;
    if (typeof p.insurer !== 'string') return false;
    if (typeof p.plan !== 'string') return false;
    if (typeof p.monthlyPremium !== 'string') return false;
    if (typeof p.sumInsured !== 'string') return false;
    if (typeof p.whyItFits !== 'string') return false;
    if (typeof p.claimRatio !== 'string') return false;
    if (typeof p.rating !== 'number') return false;
  }

  return true;
}
