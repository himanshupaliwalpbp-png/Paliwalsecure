// ============================================================================
// Paliwal Secure — Anthropic/Claude API Client for InsureGPT
// Lightweight integration using fetch API (no external SDK)
// Falls back gracefully when ANTHROPIC_API_KEY is not set
// ============================================================================

// ── Types ────────────────────────────────────────────────────────────────────

export type SupportedLanguage = 'en' | 'hi' | 'hing';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeRequestParams {
  messages: Array<ChatMessage>;
  systemPrompt: string;
  language?: SupportedLanguage;
  maxTokens?: number;
}

interface ClaudeMessageContent {
  type: 'text';
  text: string;
}

interface ClaudeResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: ClaudeMessageContent[];
  model: string;
  stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence';
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface ClaudeErrorResponse {
  type: 'error';
  error: {
    type: string;
    message: string;
  };
}

// ── Constants ────────────────────────────────────────────────────────────────

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_API_VERSION = '2023-06-01';
const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_MAX_TOKENS = 1024;
const REQUEST_TIMEOUT_MS = 15_000;

// IRDAI-mandated disclaimer text
const IRDAI_MANDATORY_DISCLAIMER =
  'For more details on risk factors, terms and conditions, please read the sales brochure/policy wording carefully before concluding a sale. Insurance is the subject matter of solicitation.';

const IRDAI_TAX_DISCLAIMER =
  'Tax benefits are subject to changes in tax laws. Please consult your tax advisor for details.';

const IRDAI_CLAIM_DISCLAIMER =
  'Claim settlement ratio is based on IRDAI Annual Report data. Past performance is not indicative of future results.';

// IRDAI-prohibited words that must NEVER appear in insurance communication
const IRDAI_PROHIBITED_WORDS = [
  'guaranteed', 'assured', 'risk-free', 'sure', 'certain', 'promise',
  'warranty', 'best', 'number one', 'cheapest', 'free', 'no-risk',
  '100%', 'zero risk', "can't lose", 'foolproof', 'fail-safe',
  'bulletproof', 'ironclad', 'rock-solid', 'no-lose',
] as const;

// ── AnthropicClient Class ────────────────────────────────────────────────────

export class AnthropicClient {
  private readonly apiKey: string | undefined;
  private readonly model: string;
  private readonly timeoutMs: number;

  constructor(options?: {
    apiKey?: string;
    model?: string;
    timeoutMs?: number;
  }) {
    this.apiKey = options?.apiKey ?? process.env.ANTHROPIC_API_KEY;
    this.model = options?.model ?? DEFAULT_MODEL;
    this.timeoutMs = options?.timeoutMs ?? REQUEST_TIMEOUT_MS;
  }

  /**
   * Returns true if the client is configured and ready to make API calls.
   */
  get isConfigured(): boolean {
    return typeof this.apiKey === 'string' && this.apiKey.length > 0;
  }

  /**
   * Call the Anthropic Messages API.
   * Returns null if the API key is not configured or if the request fails.
   */
  async callClaude(params: ClaudeRequestParams): Promise<string | null> {
    if (!this.isConfigured) {
      return null;
    }

    const { messages, systemPrompt, maxTokens } = params;
    const sanitizedMessages = this.sanitizeMessages(messages);

    if (sanitizedMessages.length === 0) {
      return null;
    }

    const body = {
      model: this.model,
      max_tokens: maxTokens ?? DEFAULT_MAX_TOKENS,
      system: systemPrompt,
      messages: sanitizedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey!,
          'anthropic-version': ANTHROPIC_API_VERSION,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Unknown error');
        console.error(
          `[AnthropicClient] API error ${response.status}: ${errorBody}`
        );
        return null;
      }

      const data = (await response.json()) as
        | ClaudeResponse
        | ClaudeErrorResponse;

      // Check for error response shape
      if ('error' in data) {
        console.error(
          `[AnthropicClient] API returned error: ${data.error.type} — ${data.error.message}`
        );
        return null;
      }

      // Extract text from the response content blocks
      const textContent = data.content
        ?.filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('');

      return textContent?.trim() || null;
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.error('[AnthropicClient] Request timed out after', this.timeoutMs, 'ms');
      } else if (error instanceof TypeError) {
        console.error('[AnthropicClient] Network error:', error.message);
      } else {
        console.error('[AnthropicClient] Unexpected error:', error);
      }
      return null;
    }
  }

  /**
   * Ensure messages array follows Anthropic's required alternating pattern:
   * - First message must be from 'user'
   * - Messages must alternate between 'user' and 'assistant'
   */
  private sanitizeMessages(messages: Array<ChatMessage>): Array<ChatMessage> {
    if (messages.length === 0) return [];

    const result: Array<ChatMessage> = [];

    // Strip empty messages
    const nonEmpty = messages.filter(
      (m) => m.content.trim().length > 0
    );

    if (nonEmpty.length === 0) return [];

    // Ensure first message is from user
    let startIndex = 0;
    if (nonEmpty[0].role === 'assistant') {
      startIndex = 1;
    }

    // Merge consecutive messages of the same role
    for (let i = startIndex; i < nonEmpty.length; i++) {
      const msg = nonEmpty[i];
      const lastMsg = result[result.length - 1];

      if (lastMsg && lastMsg.role === msg.role) {
        // Merge into previous message
        lastMsg.content += '\n' + msg.content;
      } else {
        result.push({ role: msg.role, content: msg.content });
      }
    }

    return result;
  }
}

// ── System Prompt Builder ────────────────────────────────────────────────────

/**
 * Build a comprehensive insurance-domain system prompt for the InsureGPT chatbot.
 * The prompt is tailored to the specified language and includes IRDAI compliance
 * rules, prohibited words, mandatory disclaimers, specific plan data, tax benefits,
 * claim timelines, and market data for India (2025-26).
 */
export function buildInsuranceSystemPrompt(
  language: SupportedLanguage = 'en'
): string {
  const langInstruction = getLanguageInstruction(language);
  const prohibitedWordsList = IRDAI_PROHIBITED_WORDS.map((w) => `"${w}"`).join(', ');

  const basePrompt = `You are "InsureGPT", a top-tier, IRDAI-certified insurance advisor representing Paliwal Secure (paliwalsecure.in). Your firm is an authorized partner of 51+ leading insurance companies in India. Your mission is to provide expert, trustworthy, and empathetic insurance consultation.

## PRIMARY GOAL

1. **Consult, Don't Just Answer:** Your primary job is to act as a deep consultant. You must NOT give direct answers about plans or prices. Instead, you must ask a series of logical, professional questions to understand the client's complete profile.
2. **Qualify the Lead:** Before ending the conversation, you must clearly identify the client's needs, summarize them, and confidently guide them to book a free consultation with a human expert from Paliwal Secure. Your ultimate goal is lead generation.

## CRITICAL RULES & CONSTRAINTS (MUST FOLLOW)

1. **NO Pricing or Policy Data:** You have ZERO access to any insurance company's specific premium rates, terms, conditions, or comparison data.
2. **NO Comparisons:** You are strictly PROHIBITED from comparing any two insurance companies or policies.
3. **Polite Refusal:** If a user asks for specific prices, policy numbers, or comparisons, you must politely decline using this standard response:
   > "I apologize, but I do not have access to specific premium amounts or detailed policy terms. These figures depend on multiple personal factors (age, health, city, etc.). To ensure you get the most accurate and beneficial plan, I strongly recommend you speak with our expert advisor."
4. **Human Handoff:** You must ALWAYS end the consultation by asking for the user's phone number or suggesting a callback/meeting booking with a human expert.

## CONVERSATION FLOW

Follow this exact structure in every conversation:

**Step 1 (Greeting):** Start with a warm professional greeting. Briefly introduce yourself and Paliwal Secure.

**Step 2 (Discovery):** Ask at least 3 to 5 deep questions to understand the user's needs. Examples:
- What type of insurance are you looking for? (Health, Life, Car, Travel, etc.)
- Do you already have an existing policy anywhere?
- Can you share your age and monthly budget for this plan?
- Are you looking for coverage for just yourself, or for your entire family?

**Step 3 (Summary):** Briefly summarize the user's requirements based on their answers.

**Step 4 (Call to Action):** Clearly explain why a human expert is needed for accurate pricing and final selection, and confidently ask for their contact details to schedule a free consultation.

## COMMUNICATION STYLE

- **Tone:** Professional, confident, trustworthy, and empathetic. Make the user feel safe and well-guided.
- **Language:** Fluent English (or Hindi/Hinglish if user prefers). Keep sentences clear, concise, and easy to understand.
- **Formatting:** Use minimal and professional emojis (like 👍 or ✅) to make the chat warm but not childish. Use short paragraphs or bullet points for readability.

## SELF-VERIFICATION CHECKLIST

Before you respond, ensure your reply meets ALL these conditions:
- [ ] Did I avoid giving any specific prices, plan names, or company comparisons?
- [ ] Did I ask at least 2-3 questions to understand the user's needs?
- [ ] Did I professionally guide the user toward a human expert/handoff?
- [ ] Is my tone professional, clear, and engaging?
- [ ] Is my response in clear, understandable English?

## IRDAI COMPLIANCE

- Never use prohibited words: ${prohibitedWordsList}
- Never claim "best policy", "guaranteed returns", "100% claim approval", or "risk-free"
- Always recommend consulting a certified advisor before any financial decision

## AUTHOR ENTITY

This service is provided by **Himanshu Paliwal**, IRDAI Registered POSP (Code: IP429834), based in Kota, Rajasthan, India. Paliwal Secure is an authorized partner of 51+ IRDAI-registered insurance companies.

## FINAL REMINDER

You are InsureGPT — a consultant, not an encyclopedia. Your job is to:
1. Ask the right questions
2. Understand the client's needs
3. Summarize their requirements
4. Confidently hand off to a human expert

Never give direct plan recommendations, prices, or comparisons. Always guide toward a free consultation with Paliwal Secure's expert advisor.

${langInstruction}`;

  return basePrompt;
}

// ── Language Instruction Helpers ─────────────────────────────────────────────

function getLanguageInstruction(language: SupportedLanguage): string {
  switch (language) {
    case 'hi':
      return getHindiLanguageInstruction();
    case 'hing':
      return getHinglishLanguageInstruction();
    case 'en':
    default:
      return getEnglishLanguageInstruction();
  }
}

function getEnglishLanguageInstruction(): string {
  return `## LANGUAGE INSTRUCTION
Respond in English. Use clear, professional yet friendly English. Avoid jargon — explain terms simply.`;
}

function getHindiLanguageInstruction(): string {
  return `## LANGUAGE INSTRUCTION
Respond in Hindi (Devanagari script). Use clear, professional yet friendly Hindi.

Rules:
- Use Hindi (Devanagari) for all responses.
- Keep insurance terms that don't have good Hindi equivalents in English (e.g., "Claim Settlement Ratio", "No Claim Bonus", "IDV", "ULIP").
- Write numbers in standard digits (not Devanagari numerals) for readability.
- Use polite forms (आप, कीजिए) rather than informal forms.
- Keep the mandatory IRDAI disclaimers in both Hindi and English.`;
}

function getHinglishLanguageInstruction(): string {
  return `## LANGUAGE INSTRUCTION
Respond in Hinglish (Hindi-English mix — the way most Indians naturally speak and write online).

Rules:
- Mix Hindi and English naturally, as Indians do in daily conversation.
- Write in Roman script (English alphabet) for Hindi words.
- Keep insurance terms in English (e.g., "Claim Settlement Ratio", "Premium", "No Claim Bonus", "IDV").
- Use conversational Hindi in Roman script for explanations (e.g., "Yeh plan aapke liye suitable hai", "Claim file karna aasan hai").
- Use natural Hinglish phrasing — not textbook Hindi transliterated to English.
- Keep the mandatory IRDAI disclaimers in English for legal accuracy.
- Add common Indian expressions naturally: "ji", "haan", "bilkul", "zaroor", etc.`;
}

// ── Convenience Function ─────────────────────────────────────────────────────

// Singleton client instance for reuse across the application
let _client: AnthropicClient | null = null;

function getClient(): AnthropicClient {
  if (!_client) {
    _client = new AnthropicClient();
  }
  return _client;
}

/**
 * Call the Claude API with the given parameters.
 * This is the primary integration point for the InsureGPT chatbot.
 *
 * If ANTHROPIC_API_KEY is not set, returns null so the app can fall back
 * to z-ai-web-dev-sdk or another AI provider.
 *
 * @example
 * ```ts
 * const response = await callClaude({
 *   messages: [
 *     { role: 'user', content: 'Best health insurance for family?' }
 *   ],
 *   systemPrompt: buildInsuranceSystemPrompt('hing'),
 *   language: 'hing',
 * });
 *
 * if (response === null) {
 *   // Fall back to z-ai-web-dev-sdk
 * }
 * ```
 */
export async function callClaude(params: {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  systemPrompt: string;
  language?: SupportedLanguage;
  maxTokens?: number;
}): Promise<string | null> {
  const client = getClient();
  return client.callClaude(params);
}
