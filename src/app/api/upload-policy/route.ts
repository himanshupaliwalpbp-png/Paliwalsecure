import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getClientIp, uploadRateLimiter } from '@/lib/server-rate-limiter';

export const maxDuration = 60;

// ── Extracted Policy Data Interface ──────────────────────────────────────────
interface ExtractedPolicyData {
  insurer: string;
  policyType: string;
  sumInsured: number | null;
  premium: number | null;
  premiumFrequency: string;
  waitingPeriods: Record<string, number>;
  exclusions: string[];
  keyCoverages: string[];
  ncbDetails: string | null;
  networkHospitals: string | null;
  startDate: string | null;
  endDate: string | null;
  missingBenefits: string[];
  llmSummary: string;
}

// ── POST: Upload and analyze policy PDF ──────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Rate limit: 5 uploads per minute per IP
    const rateLimit = uploadRateLimiter.check(clientIp, 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many uploads. Please wait and try again.' },
        { status: 429 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Please upload a PDF.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are accepted. Please upload a PDF document.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // ── Step 1: Extract text from PDF ──────────────────────────────────────
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let extractedText: string;
    try {
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text || '';
    } catch {
      return NextResponse.json(
        { error: 'Could not read the PDF. Please ensure it is a valid, non-password-protected PDF.' },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length < 20) {
      // Text extraction failed — likely a scanned/image-based PDF
      // Try VLM (Vision Language Model) for document analysis directly
      console.log('PDF text extraction failed, using VLM for scanned document...');
      try {
        const vlmData = await extractPolicyDataWithVLM(buffer, file.name);
        if (vlmData.insurer !== 'Unknown' || vlmData.sumInsured !== null) {
          // VLM succeeded — store and return
          const uploadedPolicy = await db.uploadedPolicy.create({
            data: {
              userId: userId || null,
              insurer: vlmData.insurer,
              policyType: vlmData.policyType,
              sumInsured: vlmData.sumInsured,
              premium: vlmData.premium,
              premiumFrequency: vlmData.premiumFrequency,
              waitingPeriods: JSON.stringify(vlmData.waitingPeriods),
              exclusions: JSON.stringify(vlmData.exclusions),
              keyCoverages: JSON.stringify(vlmData.keyCoverages),
              ncbDetails: vlmData.ncbDetails,
              networkHospitals: vlmData.networkHospitals,
              startDate: vlmData.startDate ? new Date(vlmData.startDate) : null,
              endDate: vlmData.endDate ? new Date(vlmData.endDate) : null,
              missingBenefits: JSON.stringify(vlmData.missingBenefits),
              extractedText: '[Scanned PDF - analyzed via Vision AI]',
              llmSummary: vlmData.llmSummary,
            },
          });

          return NextResponse.json({
            success: true,
            policy: {
              id: uploadedPolicy.id,
              insurer: uploadedPolicy.insurer,
              policyType: uploadedPolicy.policyType,
              sumInsured: uploadedPolicy.sumInsured,
              premium: uploadedPolicy.premium,
              premiumFrequency: uploadedPolicy.premiumFrequency,
              waitingPeriods: vlmData.waitingPeriods,
              exclusions: vlmData.exclusions,
              keyCoverages: vlmData.keyCoverages,
              ncbDetails: uploadedPolicy.ncbDetails,
              networkHospitals: uploadedPolicy.networkHospitals,
              startDate: uploadedPolicy.startDate,
              endDate: uploadedPolicy.endDate,
              missingBenefits: vlmData.missingBenefits,
              llmSummary: vlmData.llmSummary,
              analyzedWith: 'Vision AI (VLM)',
            },
          });
        }
      } catch (vlmError) {
        console.error('VLM fallback also failed:', vlmError);
      }

      return NextResponse.json(
        { error: 'Could not extract data from this PDF. The document appears to be image-based and our Vision AI could not read it. Please upload a text-based PDF or a clearer scan.' },
        { status: 400 }
      );
    }

    // Truncate text to ~4000 chars to stay within LLM context limits
    const truncatedText = extractedText.substring(0, 4000);

    // ── Step 2: Use AI (LLM + VLM) to extract structured data ────────────
    // Try text-based LLM first, then VLM for image-heavy documents
    let extractedData = await extractPolicyDataWithLLM(truncatedText);

    // If LLM extraction returned mostly defaults (low confidence),
    // try VLM with the PDF as a document for better analysis
    if (extractedData.insurer === 'Unknown' && extractedData.sumInsured === null) {
      console.log('LLM extraction low confidence, trying VLM document analysis...');
      const vlmData = await extractPolicyDataWithVLM(buffer, file.name);
      if (vlmData.insurer !== 'Unknown' || vlmData.sumInsured !== null) {
        extractedData = vlmData; // VLM gave better results
      }
    }

    // ── Step 3: Store in database ─────────────────────────────────────────
    const uploadedPolicy = await db.uploadedPolicy.create({
      data: {
        userId: userId || null,
        insurer: extractedData.insurer,
        policyType: extractedData.policyType,
        sumInsured: extractedData.sumInsured,
        premium: extractedData.premium,
        premiumFrequency: extractedData.premiumFrequency,
        waitingPeriods: JSON.stringify(extractedData.waitingPeriods),
        exclusions: JSON.stringify(extractedData.exclusions),
        keyCoverages: JSON.stringify(extractedData.keyCoverages),
        ncbDetails: extractedData.ncbDetails,
        networkHospitals: extractedData.networkHospitals,
        startDate: extractedData.startDate ? new Date(extractedData.startDate) : null,
        endDate: extractedData.endDate ? new Date(extractedData.endDate) : null,
        missingBenefits: JSON.stringify(extractedData.missingBenefits),
        extractedText: truncatedText,
        llmSummary: extractedData.llmSummary,
      },
    });

    return NextResponse.json({
      success: true,
      policy: {
        id: uploadedPolicy.id,
        insurer: uploadedPolicy.insurer,
        policyType: uploadedPolicy.policyType,
        sumInsured: uploadedPolicy.sumInsured,
        premium: uploadedPolicy.premium,
        premiumFrequency: uploadedPolicy.premiumFrequency,
        waitingPeriods: extractedData.waitingPeriods,
        exclusions: extractedData.exclusions,
        keyCoverages: extractedData.keyCoverages,
        ncbDetails: uploadedPolicy.ncbDetails,
        networkHospitals: uploadedPolicy.networkHospitals,
        startDate: uploadedPolicy.startDate,
        endDate: uploadedPolicy.endDate,
        missingBenefits: extractedData.missingBenefits,
        llmSummary: extractedData.llmSummary,
      },
    });
  } catch (error) {
    console.error('Policy upload error:', error);
    return NextResponse.json(
      { error: 'Something went wrong while analyzing your policy. Please try again.' },
      { status: 500 }
    );
  }
}

// ── GET: List uploaded policies ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);

    const policies = await db.uploadedPolicy.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, policies });
  } catch (error) {
    console.error('GET /api/upload-policy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policies.' },
      { status: 500 }
    );
  }
}

// ── LLM Extraction Function ─────────────────────────────────────────────────
async function extractPolicyDataWithLLM(pdfText: string): Promise<ExtractedPolicyData> {
  const defaultData: ExtractedPolicyData = {
    insurer: 'Unknown',
    policyType: 'health',
    sumInsured: null,
    premium: null,
    premiumFrequency: 'yearly',
    waitingPeriods: {},
    exclusions: [],
    keyCoverages: [],
    ncbDetails: null,
    networkHospitals: null,
    startDate: null,
    endDate: null,
    missingBenefits: [],
    llmSummary: 'Policy document analysis is being processed. Please check back shortly.',
  };

  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    const systemPrompt = `You are InsureGPT, an AI insurance policy document analyzer for Indian insurance policies by Paliwal Secure. You extract structured data from insurance policy documents and provide Hinglish summaries.

IMPORTANT RULES:
1. Extract ONLY what is clearly mentioned in the document. If something is not found, use null/empty.
2. For insurer name, try to identify the insurance company (e.g., "HDFC ERGO", "Star Health", "ICICI Lombard", "Bajaj Allianz", "Care Health", "Niva Bupa", "Acko", "TATA AIG", "LIC", etc.)
3. For policy type, categorize as: health, life, motor, travel, or home
4. For sum insured and premium, extract numeric values in INR (no commas or symbols)
5. For waiting periods, extract months for each condition (diabetes, bp/hypertension, heart/cardiac, etc.)
6. For exclusions, list at least 5 if found
7. For keyCoverages, list what IS covered (e.g., hospitalization, daycare procedures, ambulance, etc.)
8. For missingBenefits, identify common benefits that are MISSING from the policy (e.g., restoration benefit, NCB, maternity cover, wellness programs, room rent waiver, etc.)
9. The llmSummary MUST be in Hinglish (Hindi-English mix) - explain the policy simply, highlight waiting periods for PEDs, and mention if any waiting period is >24 months as "bahut lamba" (too long). Use conversational tone.
10. Respond with valid JSON only - no markdown, no code blocks, no extra text.

RESPONSE FORMAT (JSON only):
{
  "insurer": "string",
  "policyType": "health|life|motor|travel|home",
  "sumInsured": number or null,
  "premium": number or null,
  "premiumFrequency": "monthly|yearly",
  "waitingPeriods": { "diabetes": number, "bp": number, "heart": number, "other_conditions": number },
  "exclusions": ["string1", "string2", ...],
  "keyCoverages": ["string1", "string2", ...],
  "ncbDetails": "string or null",
  "networkHospitals": "string or null",
  "startDate": "YYYY-MM-DD or null",
  "endDate": "YYYY-MM-DD or null",
  "missingBenefits": ["string1", "string2", ...],
  "llmSummary": "Hinglish summary paragraph"
}`;

    const userPrompt = `Analyze this insurance policy document text extracted from a PDF and extract structured data:\n\n${pdfText}`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    });

    const response = completion.choices?.[0]?.message?.content;
    if (!response) return defaultData;

    // Parse JSON from the response (handle potential markdown wrapping)
    let jsonStr = response.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    return {
      insurer: parsed.insurer || defaultData.insurer,
      policyType: validatePolicyType(parsed.policyType),
      sumInsured: typeof parsed.sumInsured === 'number' ? parsed.sumInsured : null,
      premium: typeof parsed.premium === 'number' ? parsed.premium : null,
      premiumFrequency: parsed.premiumFrequency === 'monthly' ? 'monthly' : 'yearly',
      waitingPeriods: typeof parsed.waitingPeriods === 'object' && parsed.waitingPeriods !== null ? parsed.waitingPeriods : {},
      exclusions: Array.isArray(parsed.exclusions) ? parsed.exclusions.slice(0, 10) : [],
      keyCoverages: Array.isArray(parsed.keyCoverages) ? parsed.keyCoverages.slice(0, 10) : [],
      ncbDetails: parsed.ncbDetails || null,
      networkHospitals: parsed.networkHospitals || null,
      startDate: parsed.startDate || null,
      endDate: parsed.endDate || null,
      missingBenefits: Array.isArray(parsed.missingBenefits) ? parsed.missingBenefits.slice(0, 10) : [],
      llmSummary: parsed.llmSummary || defaultData.llmSummary,
    };
  } catch (error) {
    console.error('LLM extraction error:', error);
    // Fallback: try to extract basic info from text using regex
    return extractWithRegex(pdfText);
  }
}

// ── Fallback: Regex-based extraction ────────────────────────────────────────
function extractWithRegex(text: string): ExtractedPolicyData {
  const data: ExtractedPolicyData = {
    insurer: 'Unknown',
    policyType: 'health',
    sumInsured: null,
    premium: null,
    premiumFrequency: 'yearly',
    waitingPeriods: {},
    exclusions: [],
    keyCoverages: [],
    ncbDetails: null,
    networkHospitals: null,
    startDate: null,
    endDate: null,
    missingBenefits: [],
    llmSummary: 'AI analysis could not be completed. Here is a basic summary based on text scanning. Kripaya apni policy document ko dhyan se padhein aur key details note karein.',
  };

  // Try to identify insurer
  const insurerPatterns = [
    { pattern: /HDFC\s*ERGO/i, name: 'HDFC ERGO General Insurance' },
    { pattern: /Star\s*Health/i, name: 'Star Health & Allied Insurance' },
    { pattern: /ICICI\s*Lombard/i, name: 'ICICI Lombard General Insurance' },
    { pattern: /Bajaj\s*Allianz/i, name: 'Bajaj Allianz General Insurance' },
    { pattern: /Care\s*Health/i, name: 'Care Health Insurance' },
    { pattern: /Niva\s*Bupa/i, name: 'Niva Bupa Health Insurance' },
    { pattern: /Acko/i, name: 'Acko General Insurance' },
    { pattern: /TATA\s*AIG/i, name: 'TATA AIG General Insurance' },
    { pattern: /LIC|Life\s*Insurance\s*Corporation/i, name: 'LIC of India' },
    { pattern: /SBI\s*Life/i, name: 'SBI Life Insurance' },
    { pattern: /HDFC\s*Life/i, name: 'HDFC Life Insurance' },
    { pattern: /Max\s*Life/i, name: 'Max Life Insurance' },
    { pattern: /Kotak/i, name: 'Kotak Mahindra Life Insurance' },
    { pattern: /ICICI\s*Prudential/i, name: 'ICICI Prudential Life Insurance' },
    { pattern: /New\s*India\s*Assurance/i, name: 'New India Assurance' },
    { pattern: /Oriental\s*Insurance/i, name: 'Oriental Insurance' },
    { pattern: /United\s*India/i, name: 'United India Insurance' },
    { pattern: /National\s*Insurance/i, name: 'National Insurance' },
    { pattern: /Digit/i, name: 'Go Digit General Insurance' },
    { pattern: /Aditya\s*Birla/i, name: 'Aditya Birla Health Insurance' },
    { pattern: /Religare/i, name: 'Care Health Insurance (Religare)' },
  ];

  for (const { pattern, name } of insurerPatterns) {
    if (pattern.test(text)) {
      data.insurer = name;
      break;
    }
  }

  // Identify policy type
  if (/health|medical|hospital|cashless|surgical/i.test(text)) data.policyType = 'health';
  else if (/term\s*plan|life\s*insurance|sum\s*assured|death\s*benefit/i.test(text)) data.policyType = 'life';
  else if (/motor|car|vehicle|two.?wheeler|comprehensive|third.?party/i.test(text)) data.policyType = 'motor';
  else if (/travel|trip|overseas|international/i.test(text)) data.policyType = 'travel';
  else if (/home|house|property|fire/i.test(text)) data.policyType = 'home';

  // Extract sum insured
  const sumInsuredMatch = text.match(/sum\s*insured[:\s]*[₹\s]*([\d,]+)/i) ||
    text.match(/coverage\s*amount[:\s]*[₹\s]*([\d,]+)/i) ||
    text.match(/sum\s*assured[:\s]*[₹\s]*([\d,]+)/i);
  if (sumInsuredMatch) {
    data.sumInsured = parseFloat(sumInsuredMatch[1].replace(/,/g, ''));
  }

  // Extract premium
  const premiumMatch = text.match(/premium[:\s]*[₹\s]*([\d,]+)/i) ||
    text.match(/annual\s*premium[:\s]*[₹\s]*([\d,]+)/i) ||
    text.match(/monthly\s*premium[:\s]*[₹\s]*([\d,]+)/i);
  if (premiumMatch) {
    data.premium = parseFloat(premiumMatch[1].replace(/,/g, ''));
    if (/monthly/i.test(premiumMatch[0])) data.premiumFrequency = 'monthly';
  }

  // Extract waiting periods
  const diabetesMatch = text.match(/diabetes[^.]*?(\d{1,3})\s*months?/i);
  const bpMatch = text.match(/(?:bp|blood\s*pressure|hypertension)[^.]*?(\d{1,3})\s*months?/i);
  const heartMatch = text.match(/(?:heart|cardiac|cardiovascular)[^.]*?(\d{1,3})\s*months?/i);

  if (diabetesMatch) data.waitingPeriods.diabetes = parseInt(diabetesMatch[1]);
  if (bpMatch) data.waitingPeriods.bp = parseInt(bpMatch[1]);
  if (heartMatch) data.waitingPeriods.heart = parseInt(heartMatch[1]);

  // Build a basic Hinglish summary
  const parts: string[] = [];
  if (data.insurer !== 'Unknown') parts.push(`Yeh policy ${data.insurer} ki hai.`);
  if (data.sumInsured) parts.push(`Sum insured ₹${data.sumInsured.toLocaleString()} hai.`);
  if (data.premium) parts.push(`Premium ₹${data.premium.toLocaleString()} ${data.premiumFrequency === 'monthly' ? 'per month' : 'per year'} hai.`);

  if (Object.keys(data.waitingPeriods).length > 0) {
    const wpParts: string[] = [];
    if (data.waitingPeriods.diabetes) {
      wpParts.push(`Diabetes ke liye ${data.waitingPeriods.diabetes} mahine${data.waitingPeriods.diabetes > 24 ? ' — yeh bahut lamba hai!' : ''}`);
    }
    if (data.waitingPeriods.bp) {
      wpParts.push(`BP ke liye ${data.waitingPeriods.bp} mahine${data.waitingPeriods.bp > 24 ? ' — yeh bahut lamba hai!' : ''}`);
    }
    if (data.waitingPeriods.heart) {
      wpParts.push(`Heart disease ke liye ${data.waitingPeriods.heart} mahine${data.waitingPeriods.heart > 24 ? ' — yeh bahut lamba hai!' : ''}`);
    }
    if (wpParts.length > 0) {
      parts.push(`Waiting periods: ${wpParts.join(', ')}.`);
    }
  }

  if (parts.length > 0) {
    data.llmSummary = parts.join(' ') + ' Kripaha poori policy document dhyan se padhein.';
  }

  return data;
}

// ── Validate policy type ────────────────────────────────────────────────────
function validatePolicyType(type: string): string {
  const validTypes = ['health', 'life', 'motor', 'travel', 'home'];
  if (validTypes.includes(type?.toLowerCase())) return type.toLowerCase();
  // Try to map common variations
  const lower = type?.toLowerCase() || '';
  if (lower.includes('health') || lower.includes('medical')) return 'health';
  if (lower.includes('life') || lower.includes('term')) return 'life';
  if (lower.includes('motor') || lower.includes('car') || lower.includes('vehicle')) return 'motor';
  if (lower.includes('travel') || lower.includes('trip')) return 'travel';
  if (lower.includes('home') || lower.includes('property')) return 'home';
  return 'health';
}

// ── VLM (Vision Language Model) Extraction for scanned/image-based PDFs ────
async function extractPolicyDataWithVLM(pdfBuffer: Buffer, fileName: string): Promise<ExtractedPolicyData> {
  const defaultData: ExtractedPolicyData = {
    insurer: 'Unknown',
    policyType: 'health',
    sumInsured: null,
    premium: null,
    premiumFrequency: 'yearly',
    waitingPeriods: {},
    exclusions: [],
    keyCoverages: [],
    ncbDetails: null,
    networkHospitals: null,
    startDate: null,
    endDate: null,
    missingBenefits: [],
    llmSummary: 'VLM document analysis could not extract data. Kripaya apni policy document ko dhyan se padhein.',
  };

  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();

    // Convert PDF buffer to base64 for VLM
    const base64Pdf = pdfBuffer.toString('base64');
    const pdfDataUrl = `data:application/pdf;base64,${base64Pdf}`;

    const systemPrompt = `You are InsureGPT, an AI insurance policy document analyzer by Paliwal Secure. You are analyzing a PDF document (possibly scanned/image-based) of an Indian insurance policy.

Extract ALL structured data from this document. Be thorough - check every page for:
1. Insurer/Company name
2. Policy type (health/life/motor/travel/home)
3. Sum insured/coverage amount
4. Premium amount and frequency
5. Waiting periods for pre-existing diseases (diabetes, BP, heart, etc.)
6. Exclusions list
7. Key coverages/benefits
8. NCB (No Claim Bonus) details
9. Network hospitals info
10. Policy start and end dates
11. Missing benefits that should be there but aren't

Respond with valid JSON only. The llmSummary must be in Hinglish (Hindi-English mix).`;

    const completion = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: systemPrompt },
            { type: 'file_url', file_url: { url: pdfDataUrl } },
          ],
        },
      ],
      thinking: { type: 'disabled' },
    });

    const response = completion.choices?.[0]?.message?.content;
    if (!response) return defaultData;

    // Parse JSON from the response
    let jsonStr = response.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // Try to find JSON object in the response
    const jsonObjMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonObjMatch) return defaultData;

    const parsed = JSON.parse(jsonObjMatch[0]);

    return {
      insurer: parsed.insurer || defaultData.insurer,
      policyType: validatePolicyType(parsed.policyType),
      sumInsured: typeof parsed.sumInsured === 'number' ? parsed.sumInsured : null,
      premium: typeof parsed.premium === 'number' ? parsed.premium : null,
      premiumFrequency: parsed.premiumFrequency === 'monthly' ? 'monthly' : 'yearly',
      waitingPeriods: typeof parsed.waitingPeriods === 'object' && parsed.waitingPeriods !== null ? parsed.waitingPeriods : {},
      exclusions: Array.isArray(parsed.exclusions) ? parsed.exclusions.slice(0, 10) : [],
      keyCoverages: Array.isArray(parsed.keyCoverages) ? parsed.keyCoverages.slice(0, 10) : [],
      ncbDetails: parsed.ncbDetails || null,
      networkHospitals: parsed.networkHospitals || null,
      startDate: parsed.startDate || null,
      endDate: parsed.endDate || null,
      missingBenefits: Array.isArray(parsed.missingBenefits) ? parsed.missingBenefits.slice(0, 10) : [],
      llmSummary: parsed.llmSummary || defaultData.llmSummary,
    };
  } catch (error) {
    console.error('VLM extraction error:', error);
    return defaultData;
  }
}
