import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType, pdfBase64, fileType } = body;

    // fileType: 'image' or 'pdf'
    // For images: imageBase64 + mimeType
    // For PDFs: pdfBase64 (base64 encoded PDF)

    if (!imageBase64 && !pdfBase64) {
      return NextResponse.json(
        { success: false, error: 'Image or PDF data is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // ── PDF TEXT EXTRACTION ──
    if (fileType === 'pdf' && pdfBase64) {
      // Decode base64 PDF to buffer
      const pdfBuffer = Buffer.from(pdfBase64, 'base64');

      // Use pdf-parse to extract text
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(pdfBuffer);
      const extractedText = pdfData.text;

      // Send extracted text to LLM for deep analysis
      const llmResponse = await zai.chat.completions.create({
        model: 'glm-4.1',
        messages: [
          {
            role: 'system',
            content: `You are India's most expert insurance document analyst. You have 15+ years of experience reading and analyzing Indian insurance policies from all major insurers including LIC, HDFC ERGO, ICICI Lombard, Bajaj Allianz, Star Health, TATA AIG, Acko, Digit, Niva Bupa, Care Health, SBI Life, Max Life, Kotak Life, etc.

You deeply understand:
- IRDAI regulations and mandatory requirements
- Motor insurance (Car, Bike, EV Car, EV Bike) with TP/OD/Comprehensive structures
- Health insurance with room rent limits, PED waiting periods, network hospitals, restoration benefits
- Term insurance with claim settlement ratios, solvency ratios, premium payment terms
- All add-on covers, riders, and their real costs
- NCB structures and claim impact
- Policy wordings, exclusions, and fine print

Extract EVERY possible detail from the document text. Be extremely thorough.`
          },
          {
            role: 'user',
            content: `Analyze this Indian insurance policy document text and extract ALL details in JSON format.

IMPORTANT: Return ONLY valid JSON, no other text.

DOCUMENT TEXT:
${extractedText}

Extract these fields (be as detailed and accurate as possible):
{
  "policyType": "car" | "bike" | "health" | "term" | "ev_car" | "ev_bike",
  "insurer": "Full insurer name",
  "vehicle": "Vehicle make, model, variant, year (for motor) or empty string for health/term",
  "idv": IDV as number or null,
  "premium": Annual premium as number or null,
  "totalPremium": Total premium with taxes as number or null,
  "addOns": ["Array of ALL add-on/rider names found"],
  "ncb": NCB percentage as number (0/20/25/35/45/50) or null,
  "ncbDiscountAmount": NCB discount amount as number or null,
  "claimsLast3Years": Number of claims as number or 0,
  "vehicleAge": "Vehicle age category: '< 1 year' | '1-2 years' | '2-3 years' | '3-5 years' | '5-7 years' | '7+ years'",
  "policyNumber": "Policy number",
  "expiryDate": "Policy expiry date",
  "registrationNumber": "Vehicle registration number",
  "sumInsured": Sum insured as number or null,
  "policyholderName": "Policyholder name",
  "coverageType": "Comprehensive | Third Party | Standalone OD | Individual | Floater",
  "policyStartDate": "Policy start date",
  "policyEndDate": "Policy end date",
  "engineCC": Engine capacity in CC as number or null,
  "fuelType": "Petrol | Diesel | CNG | Electric | Hybrid" ,
  "manufacturingYear": Manufacturing year as number or null,
  "odPremium": Own damage premium as number or null,
  "tpPremium": Third party premium as number or null,
  "addOnsTotalCost": Total add-on cost as number or null,
  "gstAmount": GST amount as number or null,
  "networkHospitals": Number of network hospitals or null,
  "roomRentLimit": "Room rent limit description",
  "waitingPeriodPED": "PED waiting period in months" or null,
  "restorationBenefit": "Restoration benefit description",
  "sumInsuredForHealth": Sum insured for health insurance as number or null,
  "familyMembersCovered": Number of family members covered or null,
  "criticalIllnessCover": Critical illness cover amount or null,
  "personalAccidentCover": Personal accident cover amount or null,
  "exclusions": ["Key exclusions found in document"],
  "deductibles": ["Deductibles/voluntary excess found"],
  "keyTerms": ["Important terms and conditions"],
  "confidence": "high" | "medium" | "low",
  "extractedText": "Brief 2-3 line summary of the document content"
}

Rules:
- For EV/electric vehicles, set policyType to ev_car or ev_bike and fuelType to "Electric"
- Convert all currency values to numbers (remove ₹, commas, "Rs", "INR")
- If NCB is mentioned as percentage, extract just the number
- If you find specific premium breakdowns (OD, TP, add-ons), extract them separately
- List ALL exclusions and deductibles you can find
- Be as accurate as possible - this is for a real financial decision
- For any field you cannot determine, use null`
          }
        ],
        thinking: { type: 'disabled' },
      });

      const content = llmResponse.choices[0]?.message?.content || '';
      // Parse JSON from response
      let extractedData;
      try {
        extractedData = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[1].trim());
        } else {
          const objectMatch = content.match(/\{[\s\S]*\}/);
          if (objectMatch) {
            extractedData = JSON.parse(objectMatch[0]);
          } else {
            return NextResponse.json({
              success: false,
              error: 'Could not parse AI response as JSON',
              rawResponse: content,
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        data: extractedData,
        source: 'pdf',
        textLength: extractedText.length,
      });
    }

    // ── IMAGE ANALYSIS (VLM) ──
    if (imageBase64) {
      const prompt = `You are India's most expert insurance document OCR and analyst. You have 15+ years of experience reading Indian insurance policies from all major insurers.

Analyze this insurance policy document image and extract ALL possible details in JSON format.

IMPORTANT: Return ONLY valid JSON, no other text.

Extract these fields (be as detailed and accurate as possible):
{
  "policyType": "car" | "bike" | "health" | "term" | "ev_car" | "ev_bike",
  "insurer": "Full insurer name as shown on document",
  "vehicle": "Vehicle make, model, variant, year (for motor) or empty string",
  "idv": IDV as number or null,
  "premium": Annual premium as number or null,
  "totalPremium": Total premium with taxes as number or null,
  "addOns": ["Array of ALL add-on/rider names found"],
  "ncb": NCB percentage as number (0/20/25/35/45/50) or null,
  "ncbDiscountAmount": NCB discount amount as number or null,
  "claimsLast3Years": Number of claims as number or 0,
  "vehicleAge": "Vehicle age category: '< 1 year' | '1-2 years' | '2-3 years' | '3-5 years' | '5-7 years' | '7+ years'",
  "policyNumber": "Policy number if found",
  "expiryDate": "Policy expiry date if found",
  "registrationNumber": "Vehicle registration number if found",
  "sumInsured": Sum insured as number or null,
  "policyholderName": "Policyholder name",
  "coverageType": "Comprehensive | Third Party | Standalone OD | Individual | Floater",
  "engineCC": Engine capacity in CC as number or null,
  "fuelType": "Petrol | Diesel | CNG | Electric | Hybrid",
  "manufacturingYear": Manufacturing year as number or null,
  "odPremium": Own damage premium as number or null,
  "tpPremium": Third party premium as number or null,
  "gstAmount": GST amount as number or null,
  "exclusions": ["Key exclusions visible in image"],
  "confidence": "high" | "medium" | "low",
  "extractedText": "Brief summary of what you could read from the document"
}

Rules:
- For electric/EV vehicles, set policyType to ev_car or ev_bike
- Convert all currency values to numbers (remove ₹, commas)
- If NCB is mentioned as percentage, extract just the number
- Be as accurate as possible with numbers
- For any field you cannot determine, use null`;

      const response = await zai.chat.completions.createVision({
        model: 'glm-4.1v',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        thinking: { type: 'disabled' },
      });

      const content = response.choices[0]?.message?.content || '';
      let extractedData;
      try {
        extractedData = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          extractedData = JSON.parse(jsonMatch[1].trim());
        } else {
          const objectMatch = content.match(/\{[\s\S]*\}/);
          if (objectMatch) {
            extractedData = JSON.parse(objectMatch[0]);
          } else {
            return NextResponse.json({
              success: false,
              error: 'Could not parse VLM response as JSON',
              rawResponse: content,
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        data: extractedData,
        source: 'image',
      });
    }

    return NextResponse.json(
      { success: false, error: 'No valid input provided' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Policy extraction error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to extract policy details' },
      { status: 500 }
    );
  }
}
