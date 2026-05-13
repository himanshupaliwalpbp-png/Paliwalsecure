import { NextRequest, NextResponse } from 'next/server';
import { buildRAGContext, getRecommendations, checkIRDAICompliance } from '@/lib/scoring-engine';
import { type UserProfile, IRDAI_MANDATORY_DISCLAIMER } from '@/lib/insurance-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, profile, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400 }
      );
    }

    // Build RAG context with user profile
    const systemPrompt = buildRAGContext(message, profile as UserProfile | undefined);

    // Check if user is asking for recommendations
    const isRecommendationRequest = /recommend|suggest|which.*plan|which.*insurance|best.*for me|suitable/i.test(message);

    let recommendations = null;
    if (isRecommendationRequest && profile) {
      const recs = getRecommendations(profile as UserProfile, undefined, 3);
      recommendations = recs.map(r => ({
        planName: r.plan.name,
        provider: r.plan.provider,
        category: r.plan.category,
        premium: `₹${r.plan.premium.monthly.toLocaleString()}/mo (₹${r.plan.premium.annual.toLocaleString()}/yr)`,
        claimSettlementRatio: `${r.plan.claimSettlementRatio}%`,
        matchScore: `${r.score.percentage}%`,
        whyRecommended: r.whyRecommended,
        keyFeatures: r.plan.features.slice(0, 4),
      }));
    }

    // Build conversation messages
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...(history || []).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    // Add recommendations context if available
    if (recommendations) {
      messages[messages.length - 1] = {
        ...messages[messages.length - 1],
        content: `${message}\n\n[SYSTEM: Here are the personalized recommendations based on the user profile - include these in your response in a friendly, structured way]:\n${JSON.stringify(recommendations, null, 2)}`,
      };
    }

    // Use z-ai-web-dev-sdk for LLM
    let aiResponse: string;
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const zai = await ZAI.create();

      const completion = await zai.chat.completions.create({
        messages,
        thinking: { type: 'disabled' },
      });

      aiResponse = completion.choices[0]?.message?.content || 
        'I apologize, but I couldn\'t generate a response. Please try again.';
    } catch (llmError) {
      console.error('LLM Error:', llmError);
      // Fallback response when LLM is unavailable
      aiResponse = generateFallbackResponse(message, recommendations);
    }

    // IRDAI Compliance Check
    const compliance = checkIRDAICompliance(aiResponse);
    if (!compliance.isCompliant) {
      console.warn('IRDAI Compliance violations detected:', compliance.violations);
      aiResponse = compliance.sanitizedText;
    }

    // Add mandatory disclaimer if discussing specific plans
    if (/plan|policy|premium|cover|insurance/i.test(aiResponse)) {
      aiResponse += `\n\n---\n*⚠️ ${IRDAI_MANDATORY_DISCLAIMER}*`;
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
      recommendations: recommendations || undefined,
      complianceChecked: true,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// Fallback response generator when LLM is unavailable
function generateFallbackResponse(
  message: string,
  recommendations: Array<{
    planName: string;
    provider: string;
    category: string;
    premium: string;
    claimSettlementRatio: string;
    matchScore: string;
    whyRecommended: string;
    keyFeatures: string[];
  }> | null
): string {
  const lowerMsg = message.toLowerCase();

  if (/hi|hello|hey|namaste/i.test(lowerMsg)) {
    return 'Namaste! 👋 I\'m InsureGPT, your AI insurance assistant. I can help you understand insurance, compare plans, and find the right coverage for you. What would you like to know about insurance today?';
  }

  if (/health.*insurance|medical.*insurance/i.test(lowerMsg)) {
    return 'Health insurance covers your medical expenses including hospitalization, surgeries, and treatments. In India, medical inflation is around 14% annually, making health insurance essential. Key things to look for:\n\n• **Claim Settlement Ratio** - Higher is better (aim for 85%+)\n• **Network Hospitals** - More hospitals = easier cashless claims\n• **Waiting Period** - Shorter is better, especially for pre-existing conditions\n• **Sum Insured** - At least 10-15% of your annual income\n• **No Claim Bonus** - Look for plans that increase your cover each claim-free year\n\nWould you like me to recommend specific health insurance plans based on your profile?';
  }

  if (/term.*insurance|life.*insurance/i.test(lowerMsg)) {
    return 'Term insurance is the most affordable way to protect your family financially. Key points:\n\n• **Pure Protection** - High cover at low premiums (₹1 Crore for ~₹600/month)\n• **Claim Settlement** - Look for 97%+ CSR\n• **Riders** - Add critical illness, accidental death benefit\n• **Tax Benefits** - Up to ₹1.5L deduction under Section 80C\n\nTerm insurance has no maturity benefit, but it\'s 90% cheaper than endowment plans for the same cover. Would you like personalized recommendations?';
  }

  if (recommendations && recommendations.length > 0) {
    let response = 'Based on your profile, here are my top recommendations:\n\n';
    recommendations.forEach((rec, i) => {
      response += `**${i + 1}. ${rec.planName}** by ${rec.provider}\n`;
      response += `   • Premium: ${rec.premium}\n`;
      response += `   • Claim Settlement Ratio: ${rec.claimSettlementRatio}\n`;
      response += `   • Match Score: ${rec.matchScore}\n`;
      response += `   • Why: ${rec.whyRecommended}\n\n`;
    });
    return response;
  }

  return 'I\'m here to help you with all your insurance questions! You can ask me about:\n\n• **Health Insurance** - Medical coverage and hospitalization\n• **Life Insurance** - Term plans and financial protection\n• **Motor Insurance** - Car and bike coverage\n• **Travel Insurance** - Coverage for trips abroad\n• **Home Insurance** - Protection for your property\n\nOr try our personalization quiz to get tailored recommendations! Just type "recommend me" to get started.';
}
