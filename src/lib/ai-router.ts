// ============================================================================
// AI Router — Multi-model fallback for InsureGPT
// Tries Claude (Sonnet 4) first, falls back to ZAI (GLM)
// ============================================================================

export interface AIRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    tool_call_id?: string;
    tool_calls?: unknown[];
  }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: unknown[];
}

export interface AIResponse {
  content: string;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }>;
}

export interface AIStreamChunk {
  content?: string;
  tool_call?: {
    id: string;
    name: string;
    arguments: string;
  };
  done?: boolean;
}

/**
 * Try Claude first (if API key available), fall back to ZAI.
 * This gives GPT-4 level intelligence when Claude is configured.
 */
export async function callAI(request: AIRequest): Promise<AIResponse> {
  // ── Try Claude (Anthropic) first ──────────────────────────────────────
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      return await callClaude(request, anthropicKey);
    } catch (err) {
      console.log('[AI-Router] Claude failed, falling back to ZAI:', err);
    }
  }

  // ── Fall back to ZAI (GLM) ────────────────────────────────────────────
  return await callZAI(request);
}

/**
 * Stream AI response — tries Claude first, falls back to ZAI.
 */
export async function* streamAI(request: AIRequest): AsyncGenerator<AIStreamChunk> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      yield* streamClaude(request, anthropicKey);
      return;
    } catch (err) {
      console.log('[AI-Router] Claude stream failed, falling back to ZAI:', err);
    }
  }

  yield* streamZAI(request);
}

// ── Claude (Anthropic) implementation ──────────────────────────────────────
async function callClaude(request: AIRequest, apiKey: string): Promise<AIResponse> {
  const { AnthropicClient } = await import('./anthropic');
  const client = new AnthropicClient({ apiKey });

  const systemMsg = request.messages.find(m => m.role === 'system')?.content || '';
  const conversationMessages = request.messages
    .filter(m => m.role !== 'system')
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  const result = await client.callClaude({
    system: systemMsg,
    messages: conversationMessages,
    model: 'claude-sonnet-4-20250514',
    maxTokens: request.maxTokens || 2048,
    temperature: request.temperature ?? 0.7,
  });

  return { content: result || '' };
}

async function* streamClaude(request: AIRequest, apiKey: string): AsyncGenerator<AIStreamChunk> {
  // Claude streaming would go here — for now use non-streaming
  const response = await callClaude(request, apiKey);
  yield { content: response.content };
  yield { done: true };
}

// ── ZAI (GLM) implementation ───────────────────────────────────────────────
async function callZAI(request: AIRequest): Promise<AIResponse> {
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  const zai = await ZAI.create();

  const completion = await zai.chat.completions.create({
    messages: request.messages as never,
    temperature: request.temperature ?? 0.7,
    max_tokens: request.maxTokens || 2048,
  } as never);

  const content = completion.choices?.[0]?.message?.content || '';
  const toolCalls = completion.choices?.[0]?.message?.tool_calls as Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }> | undefined;

  return { content, tool_calls: toolCalls };
}

async function* streamZAI(request: AIRequest): AsyncGenerator<AIStreamChunk> {
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  const zai = await ZAI.create();

  try {
    const stream = await zai.chat.completions.create({
      messages: request.messages as never,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens || 2048,
      stream: true,
    } as never) as ReadableStream<Uint8Array>;

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              yield { content };
            }
          } catch {
            // Skip non-JSON lines
          }
        }
      }
    }
  } catch {
    // Fall back to non-streaming
    const response = await callZAI(request);
    yield { content: response.content };
  }

  yield { done: true };
}
