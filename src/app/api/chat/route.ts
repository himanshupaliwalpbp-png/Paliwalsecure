import { NextRequest, NextResponse } from 'next/server';
import { buildRAGContext, getRecommendations, checkIRDAICompliance } from '@/lib/scoring-engine';
import { type UserProfile, IRDAI_MANDATORY_DISCLAIMER, allInsurancePlans } from '@/lib/insurance-data';

export const maxDuration = 30;

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

    // Check if user is asking for recommendations
    const isRecommendationRequest = /recommend|suggest|which.*plan|which.*insurance|suitable|batao|sujhav|chuno/i.test(message);

    let recommendations = null;
    if (isRecommendationRequest && profile) {
      try {
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
      } catch (e) {
        console.error('Recommendation error:', e);
      }
    }

    // Try LLM first, with a timeout of 10 seconds
    let aiResponse: string | null = null;

    try {
      const systemPrompt = buildRAGContext(message, profile as UserProfile | undefined);

      const apiMessages: Array<{ role: 'assistant' | 'user'; content: string }> = [
        { role: 'assistant', content: systemPrompt },
      ];

      const historyMessages: Array<{ role: 'assistant' | 'user'; content: string }> = (history || [])
        .map((m: { role: string; content: string }) => ({
          role: (m.role === 'bot' ? 'assistant' : 'user') as 'assistant' | 'user',
          content: m.content,
        }));

      const userContent = recommendations
        ? `${message}\n\n[SYSTEM: Here are the personalized recommendations based on the user profile - include these in your response in a friendly, structured way]:\n${JSON.stringify(recommendations, null, 2)}`
        : message;

      historyMessages.push({ role: 'user', content: userContent });

      for (const msg of historyMessages) {
        const lastRole = apiMessages[apiMessages.length - 1]?.role;
        if (lastRole === msg.role) {
          apiMessages[apiMessages.length - 1].content += '\n' + msg.content;
        } else {
          apiMessages.push(msg);
        }
      }

      // Only send last 6 messages to keep it fast
      const trimmedMessages = apiMessages.length > 7
        ? [apiMessages[0], ...apiMessages.slice(-6)]
        : apiMessages;

      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const zai = await ZAI.create();

      // Race with a 10-second timeout
      const completionPromise = zai.chat.completions.create({
        messages: trimmedMessages,
        thinking: { type: 'disabled' },
      });

      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 10000);
      });

      const completion = await Promise.race([completionPromise, timeoutPromise]);

      if (completion && completion.choices?.[0]?.message?.content) {
        aiResponse = completion.choices[0].message.content;
      }
    } catch (llmError) {
      console.error('LLM Error:', llmError);
    }

    // Fallback to smart static responses if LLM fails or times out
    if (!aiResponse) {
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

// Enhanced fallback response generator — comprehensive and fast
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

  // Greeting
  if (/hi|hello|hey|namaste|namaskar/i.test(lowerMsg)) {
    return 'Namaste! 👋 Welcome to **Paliwal Secure AI** — your insurance advisor! I can help you understand insurance, compare plans, and find the right coverage for you.\n\nYou can ask me about:\n• Health Insurance\n• Life/Term Insurance\n• Motor Insurance\n• Travel Insurance\n• Tax benefits\n• Claim process\n\nWhat would you like to know?';
  }

  // Health insurance questions
  if (/health.*insurance|medical.*insurance|bima.*health|health.*bima/i.test(lowerMsg)) {
    return `Health insurance covers your medical expenses including hospitalization, surgeries, and treatments. In India, medical inflation is around 14% annually, making health insurance essential.\n\n**Key things to look for:**\n• **Claim Settlement Ratio (CSR)** - Higher is better (aim for 90%+)\n• **Network Hospitals** - More hospitals = easier cashless claims\n• **Waiting Period** - Shorter is better, especially for pre-existing conditions\n• **Sum Insured** - At least 10-15% of your annual income\n• **No Claim Bonus** - Look for plans that increase your cover each claim-free year\n\n**Top Health Insurers (IRDAI 2025-26 data):**\n• Acko General: 99.91% CSR, ₹550/mo (₹5L cover)\n• HDFC ERGO: 98.85% CSR, ₹600/mo (₹5L cover)\n• Care Health: 93.13% CSR, ₹500/mo (₹5L cover)\n• TATA AIG: 96.67% CSR, ₹550/mo (₹5L cover)\n• Bajaj Allianz: 93.65% CSR, ₹520/mo (₹5L cover)\n\nWould you like personalized recommendations based on your profile?`;
  }

  // Term/Life insurance questions
  if (/term.*insurance|life.*insurance|term.*plan|jeevan.*bima/i.test(lowerMsg)) {
    return `Term insurance is the most affordable way to protect your family financially. It provides pure protection at very low premiums.\n\n**Key points:**\n• **Pure Protection** - High cover at low premiums (₹1 Crore from ~₹1,000/month)\n• **Claim Settlement** - Look for 97%+ CSR\n• **Riders** - Add critical illness, accidental death benefit\n• **Tax Benefits** - Up to ₹1.5L deduction under Section 80C\n\n**Top Life Insurers (IRDAI 2025-26 data):**\n• HDFC Life: 99.97% CSR, ₹1,250/mo (₹1Cr term)\n• Max Life: 99.08% CSR, ₹1,350/mo (₹1Cr term)\n• SBI Life: 98.50% CSR, ₹1,200/mo (₹1Cr term)\n• LIC of India: 95.55% CSR, ₹1,000/mo (₹1Cr term)\n• Bajaj Allianz Life: 97.50% CSR, ₹1,100/mo (₹1Cr term)\n\nTerm insurance has no maturity benefit, but it's 90% cheaper than endowment plans for the same cover. Would you like personalized recommendations?`;
  }

  // Motor insurance
  if (/motor|car.*insurance|bike.*insurance|gaadi.*bima|vehicle.*insurance/i.test(lowerMsg)) {
    return `Motor insurance is legally mandatory in India under the Motor Vehicles Act 1988.\n\n**Types:**\n• **Third-Party** - Mandatory, covers damage to others\n• **Comprehensive** - Third-party + your own vehicle damage\n\n**Top Motor Insurers (IRDAI 2025-26 data):**\n• ICICI Lombard: 91.22% CSR, ₹1,899/yr comprehensive\n• HDFC ERGO: 98.85% CSR, ₹2,200/yr comprehensive\n• Bajaj Allianz: 93.65% CSR, ₹1,950/yr comprehensive\n\n**Add-ons to consider:**\n• Zero Depreciation - Full claim without depreciation deduction\n• Engine Protection - Covers engine damage from flooding\n• Roadside Assistance - 24/7 emergency help\n• Return to Invoice - Get full invoice value if car is stolen/totaled\n\nWould you like more details on any specific motor insurance plan?`;
  }

  // Travel insurance
  if (/travel.*insurance|yatra.*bima|trip.*insurance/i.test(lowerMsg)) {
    return `Travel insurance protects you from unexpected expenses while traveling — medical emergencies, trip cancellations, lost baggage, and more.\n\n**Top Travel Insurers (IRDAI 2025-26 data):**\n• TATA AIG Travel: 96.67% CSR, from ₹499/trip\n• Care Health Travel: 93.13% CSR, from ₹450/trip\n\n**What's covered:**\n• Medical emergency abroad\n• Trip cancellation/interruption\n• Lost baggage and passport\n• Flight delay compensation\n• Personal liability\n\nStarting at just ₹450 per trip, travel insurance is a small price for big peace of mind. Would you like more details?`;
  }

  // Tax benefits
  if (/tax|80d|80c|tax.*benefit|tax.*save|bachat/i.test(lowerMsg)) {
    return `Insurance offers significant tax savings in India:\n\n**Section 80D (Health Insurance):**\n• Self & family: Up to ₹25,000 deduction\n• Parents: Additional ₹25,000 (₹50,000 if senior citizens)\n• Preventive health check-up: Up to ₹5,000\n• Total maximum: ₹75,000 (self + senior citizen parents)\n\n**Section 80C (Life Insurance):**\n• Life insurance premium: Up to ₹1.5 Lakhs deduction\n• Includes term plans, endowment, ULIPs\n\n**Section 80CCC (Pension Plans):**\n• Annuity/pension plan premium: Up to ₹1.5 Lakhs\n\n**Example:** If you pay ₹15,000/year for health insurance and ₹12,000/year for term insurance, you can save approximately ₹8,100 in taxes (at 30% tax bracket).\n\nWould you like help choosing a plan that maximizes your tax benefits?`;
  }

  // Claim process
  if (/claim|kaise.*file|claim.*process|reimbursement|cashless.*claim/i.test(lowerMsg)) {
    return `Here's how to file an insurance claim:\n\n**Cashless Claims (at network hospitals):**\n1. Show your health card at the hospital\n2. Hospital sends pre-authorization request to TPA/insurer\n3. Get approval (usually within 2-4 hours)\n4. Treatment happens — bill settled directly\n5. Pay only non-covered items at discharge\n\n**Reimbursement Claims:**\n1. Pay the hospital bill yourself\n2. Collect all original documents (bills, reports, discharge summary)\n3. Submit claim form + documents to insurer within 15-30 days\n4. Insurer processes and transfers amount to your bank\n\n**Emergency Claims:**\n• Notify insurer within 24-48 hours of admission\n• Cashless approval can be taken within 24 hours of admission\n\n**Documents needed:**\n• Claim form (filled)\n• Original bills and receipts\n• Discharge summary\n• Doctor's prescription and reports\n• ID proof and policy copy\n\nNeed help with a specific claim question?`;
  }

  // Waiting period
  if (/waiting.*period|intzaar|ped|pre.*existing/i.test(lowerMsg)) {
    return `Waiting period is the time you must wait before certain coverage kicks in:\n\n**Types of waiting periods:**\n1. **Initial waiting period:** 30 days from policy start (accidents covered from day 1)\n2. **Pre-existing diseases (PED):** 24-48 months for conditions you already have\n3. **Specific diseases:** 1-2 years for conditions like hernia, cataract, piles\n\n**PED waiting periods by insurer (IRDAI 2025-26):**\n• Acko: Diabetes 24mo, BP 24mo, Heart 36mo\n• HDFC ERGO: Diabetes 36mo, BP 24mo, Heart 48mo\n• Care Health: Diabetes 24mo, BP 24mo, Heart 36mo\n• Star Health: Diabetes 48mo, BP 36mo, Heart 48mo\n• TATA AIG: Diabetes 24mo, BP 24mo, Heart 36mo\n\n**Tip:** If you have pre-existing conditions, choose a plan with shorter waiting periods. Plans by Acko, Care Health, and TATA AIG have 24-month PED waiting for diabetes and BP.\n\nWould you like personalized recommendations based on your health conditions?`;
  }

  // Recommendations
  if (recommendations && recommendations.length > 0) {
    let response = 'Based on your profile, here are my top recommendations:\n\n';
    recommendations.forEach((rec, i) => {
      response += `**${i + 1}. ${rec.planName}** by ${rec.provider}\n`;
      response += `   • Premium: ${rec.premium}\n`;
      response += `   • Claim Settlement Ratio: ${rec.claimSettlementRatio}\n`;
      response += `   • Match Score: ${rec.matchScore}\n`;
      response += `   • Why: ${rec.whyRecommended}\n\n`;
    });
    response += 'Take our personalization quiz above to get even more accurate recommendations tailored to your needs!';
    return response;
  }

  // Generic insurance questions
  if (/insurance.*kya|kya.*hai.*insurance|what.*is.*insurance/i.test(lowerMsg)) {
    return `Insurance is a financial safety net. You pay a small regular amount (premium), and the insurance company covers large unexpected expenses.\n\n**Think of it this way:**\n• Health insurance: Pays hospital bills (₹2-50 Lakh cover for ₹500-5,000/month)\n• Life insurance: Gives money to your family if something happens to you (₹1 Crore for ₹1,000/month)\n• Motor insurance: Covers car/bike damage and third-party liability\n• Travel insurance: Covers medical emergencies and trip issues abroad\n\n**Why every Indian needs insurance:**\n• 700M+ Indians are uninsured or underinsured\n• Medical inflation is 14% annually\n• One hospitalization can wipe out years of savings\n• Insurance is now more affordable than ever\n\nWhich type of insurance would you like to know more about?`;
  }

  // Default response
  return `I'm here to help you with all your insurance questions! You can ask me about:\n\n• **Health Insurance** — Medical coverage, hospitalization, cashless claims\n• **Life/Term Insurance** — Financial protection for your family\n• **Motor Insurance** — Car and bike coverage (mandatory!)\n• **Travel Insurance** — Coverage for trips abroad\n• **Tax Benefits** — Save tax under Sections 80C, 80D\n• **Claim Process** — How to file and track claims\n• **Waiting Periods** — Understand PED and other waiting periods\n\n**Quick tips:**\n• Take our personalization quiz (click "Get Started") for tailored recommendations\n• Always compare CSR, ICR, and solvency ratio before choosing a plan\n• Never use words like "best" — look for plans that match YOUR needs\n\nWhat would you like to know?`;
}
