// ============================================================================
// InsureGPT — Streaming Chat API with Tool Use
// ============================================================================
// POST /api/chat/stream
//
// Request body:
//   { message, profile?, history?, memory?, language? }
//
// Response: text/event-stream (SSE)
//   data: {"content":"Namaste"}
//   data: {"content":"! 🙏"}
//   data: {"toolCall":{"id":"...","name":"comparePlans","arguments":"..."}}
//   data: {"toolResult":"...","content":"..."}
//   data: {"content":"final answer..."}
//   data: {"done":true}
//
// Flow:
//   1. Validate + sanitize input
//   2. Classify intent (skip LLM for greetings)
//   3. Build enriched system prompt (language + memory + tools)
//   4. Call Z.ai with stream:true
//   5. If tool_call detected → execute → feed result back → call LLM again
//   6. Stream content deltas to client in real-time
//   7. IRDAI compliance check on final text + mandatory disclaimer
//   8. Emit { done: true }
// ============================================================================

import { NextRequest } from 'next/server';
import {
  buildSystemPrompt,
  classifyIntent,
  getGreetingResponse,
  getMandatoryDisclaimer,
  needsDisclaimer,
  executeTool,
  TOOL_SCHEMAS,
  parseSSEStream,
  chunkToSSE,
  SSE_HEADERS,
  type InsureGPTLanguage,
  type StreamChunk,
} from '@/lib/insuregpt';
import { chatRateLimiter, getClientIp } from '@/lib/server-rate-limiter';
import { sanitizeString } from '@/lib/validation';
import { checkIRDAICompliance } from '@/lib/scoring-engine';
import { IRDAI_MANDATORY_DISCLAIMER } from '@/lib/insurance-data';

export const maxDuration = 60; // 60s for streaming
export const runtime = 'nodejs';

// ---------------------------------------------------------------------------
// Helper: emit SSE chunk to client
// ---------------------------------------------------------------------------
function sseSend(controller: ReadableStreamDefaultController, chunk: StreamChunk) {
  controller.enqueue(new TextEncoder().encode(chunkToSSE(chunk)));
}

// ---------------------------------------------------------------------------
// Helper: detect tool calls in non-streaming Z.ai response (fallback)
// ---------------------------------------------------------------------------
interface ZaiToolCall {
  id: string;
  function: { name: string; arguments: string };
}

// ---------------------------------------------------------------------------
// MAIN POST HANDLER
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  // ── Rate limiting ──────────────────────────────────────────────────────
  const rateLimit = chatRateLimiter.check(clientIp, 20, 60 * 1000);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Too many messages. Please slow down and try again.',
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // ── Parse + validate body ──────────────────────────────────────────────
  let body: {
    message: string;
    profile?: unknown;
    history?: Array<{ role: string; content: string }>;
    memory?: string;
    language?: InsureGPTLanguage;
  };

  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { message, profile, history, memory, language } = body;

  if (!message || typeof message !== 'string' || message.length < 1 || message.length > 2000) {
    return new Response(
      JSON.stringify({ error: 'Message must be 1-2000 characters' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const sanitizedMessage = sanitizeString(message);
  const intent = classifyIntent(sanitizedMessage);

  // ── Build system prompt ────────────────────────────────────────────────
  const systemPrompt = buildSystemPrompt({
    language: language ?? intent.detectedLanguage,
    memoryContext: memory,
  });

  // ── Build API messages ─────────────────────────────────────────────────
  type ApiMessage = { role: 'system' | 'user' | 'assistant' | 'tool'; content: string; tool_call_id?: string; tool_calls?: unknown[] };

  const apiMessages: ApiMessage[] = [{ role: 'system', content: systemPrompt }];

  // Append history (last 6 messages)
  const historyMessages = (history ?? [])
    .slice(-6)
    .map((m) => ({
      role: (m.role === 'bot' ? 'assistant' : 'user') as 'assistant' | 'user',
      content: m.content,
    }));

  for (const msg of historyMessages) {
    apiMessages.push(msg);
  }

  // Append user message
  apiMessages.push({ role: 'user', content: sanitizedMessage });

  // ── Create SSE stream ──────────────────────────────────────────────────
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // ── Greeting fast-path: skip LLM ─────────────────────────────────
        if (!intent.useLLM) {
          const greeting = getGreetingResponse(language ?? intent.detectedLanguage);
          // Stream greeting in chunks for natural feel
          const words = greeting.split(' ');
          for (let i = 0; i < words.length; i++) {
            const chunk = (i === 0 ? '' : ' ') + words[i];
            sseSend(controller, { content: chunk });
            // Small delay between words (5ms)
            await new Promise((r) => setTimeout(r, 8));
          }
          sseSend(controller, { done: true });
          controller.close();
          return;
        }

        // ── Load Z.ai SDK ────────────────────────────────────────────────
        const ZAI = (await import('z-ai-web-dev-sdk')).default;
        const zai = await ZAI.create();

        // ── Tool use loop (max 3 iterations) ────────────────────────────
        let iteration = 0;
        let finalContent = '';
        const MAX_TOOL_ITERATIONS = 3;

        while (iteration < MAX_TOOL_ITERATIONS) {
          iteration++;

          // ── Call Z.ai with stream:true + tools ────────────────────────
          let streamResponse: ReadableStream<Uint8Array> | null = null;
          let nonStreamResponse: { choices?: Array<{ message?: { content?: string; tool_calls?: ZaiToolCall[] } }> } | null = null;

          // Strip 'tool' role messages to messages Z.ai SDK accepts (system|user|assistant)
          // We append tool results as 'user' messages with a clear prefix
          const zaiSafeMessages = apiMessages.map((m) => {
            if (m.role === 'tool') {
              return {
                role: 'user' as const,
                content: `[TOOL RESULT for ${m.tool_call_id ?? 'unknown'}]:\n${m.content}`,
              };
            }
            return { role: m.role as 'system' | 'user' | 'assistant', content: m.content };
          });

          try {
            // Try streaming first — pass tools/tool_choice as extra fields Z.ai may accept
            const requestBody: Record<string, unknown> = {
              messages: zaiSafeMessages,
              stream: true,
              thinking: { type: 'disabled' },
              temperature: 0.4,
            };
            if (iteration === 1) {
              requestBody.tools = TOOL_SCHEMAS;
              if (intent.suggestedTools.length > 0) {
                requestBody.tool_choice = 'auto';
              }
            }

            const completionPromise = zai.chat.completions.create(requestBody as never);

            // Race with 25s timeout
            const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 25000));
            const result = await Promise.race([completionPromise, timeoutPromise]);

            if (result === null) {
              // Timeout — fall back to non-streaming
              const fallbackBody: Record<string, unknown> = {
                messages: zaiSafeMessages,
                thinking: { type: 'disabled' },
                temperature: 0.4,
              };
              nonStreamResponse = await zai.chat.completions.create(fallbackBody as never) as typeof nonStreamResponse;
            } else if (result instanceof ReadableStream) {
              streamResponse = result;
            } else if (typeof result === 'object' && result !== null && 'choices' in result) {
              nonStreamResponse = result as typeof nonStreamResponse;
            } else {
              // Treat as stream
              streamResponse = result as ReadableStream<Uint8Array>;
            }
          } catch (err) {
            console.error('Z.ai call failed:', err);
            // Fall back to error message
            sseSend(controller, {
              content: `⚠️ Sorry, I'm having trouble connecting to the AI service. Please try again in a moment.`,
            });
            sseSend(controller, { done: true });
            controller.close();
            return;
          }

          // ── Handle streaming response ────────────────────────────────
          let toolCallsToExecute: Array<{ id: string; name: string; arguments: string }> = [];
          let iterationContent = '';

          if (streamResponse) {
            try {
              for await (const chunk of parseSSEStream(streamResponse)) {
                if (chunk.content) {
                  iterationContent += chunk.content;
                  finalContent += chunk.content;
                  sseSend(controller, { content: chunk.content });
                }
                if (chunk.toolCall && chunk.toolCall.isComplete) {
                  toolCallsToExecute.push({
                    id: chunk.toolCall.id,
                    name: chunk.toolCall.name,
                    arguments: chunk.toolCall.arguments,
                  });
                }
                if (chunk.done) {
                  break;
                }
                if (chunk.error) {
                  console.error('Stream error:', chunk.error);
                  break;
                }
              }
            } catch (streamErr) {
              console.error('Stream parse error:', streamErr);
              if (!iterationContent) {
                sseSend(controller, {
                  content: `⚠️ Connection interrupted. Please try again.`,
                });
              }
            }
          } else if (nonStreamResponse) {
            // Non-stream fallback
            const choice = (nonStreamResponse as { choices?: Array<{ message?: { content?: string; tool_calls?: ZaiToolCall[] } }> }).choices?.[0];
            if (choice?.message?.content) {
              iterationContent = choice.message.content;
              finalContent += iterationContent;
              // Stream it word-by-word for UX
              const words = iterationContent.split(' ');
              for (let i = 0; i < words.length; i++) {
                const w = (i === 0 ? '' : ' ') + words[i];
                sseSend(controller, { content: w });
                await new Promise((r) => setTimeout(r, 5));
              }
            }
            if (choice?.message?.tool_calls && choice.message.tool_calls.length > 0) {
              toolCallsToExecute = choice.message.tool_calls.map((tc) => ({
                id: tc.id,
                name: tc.function.name,
                arguments: tc.function.arguments,
              }));
            }
          }

          // ── Execute tools (if any) ───────────────────────────────────
          if (toolCallsToExecute.length === 0) {
            // No tool calls — we're done
            break;
          }

          // Append assistant message with tool_calls to history
          apiMessages.push({
            role: 'assistant',
            content: iterationContent,
            tool_calls: toolCallsToExecute.map((tc) => ({
              id: tc.id,
              type: 'function',
              function: { name: tc.name, arguments: tc.arguments },
            })),
          });

          // Execute each tool and feed result back
          for (const tc of toolCallsToExecute) {
            // Notify client we're executing a tool
            sseSend(controller, {
              content: `\n\n_🔧 Calling tool: **${tc.name}**..._\n\n`,
            });

            let parsedArgs: Record<string, unknown> = {};
            try {
              parsedArgs = tc.arguments ? JSON.parse(tc.arguments) : {};
            } catch {
              console.error('Invalid tool args JSON:', tc.arguments);
            }

            const toolResult = await executeTool(tc.name, parsedArgs);

            // Send tool result to client (truncated if too long)
            const truncatedResult = toolResult.length > 2000
              ? toolResult.slice(0, 2000) + '\n...[truncated]'
              : toolResult;
            sseSend(controller, {
              content: `_✅ Tool result:_\n\n${truncatedResult}\n\n---\n\n`,
            });

            // Append tool result to API messages
            apiMessages.push({
              role: 'tool',
              content: toolResult,
              tool_call_id: tc.id,
            });

            // Also accumulate to finalContent for compliance check
            finalContent += '\n[Tool: ' + tc.name + ']\n' + toolResult;
          }

          // Loop back — LLM will now respond with formatted answer using tool data
        }

        // ── IRDAI Compliance Check on final content ─────────────────────
        const compliance = checkIRDAICompliance(finalContent);
        if (!compliance.isCompliant) {
          // Send sanitized version as a note (we already streamed original)
          // For streaming, we just log it — original already went to client
          console.warn('IRDAI compliance violations in stream:', compliance.violations);
        }

        // ── Append mandatory disclaimer if discussing plans ─────────────
        if (needsDisclaimer(finalContent)) {
          sseSend(controller, {
            content: `\n\n${getMandatoryDisclaimer()}`,
          });
        }

        // ── Done ────────────────────────────────────────────────────────
        sseSend(controller, { done: true });
        controller.close();
      } catch (error) {
        console.error('InsureGPT stream error:', error);
        try {
          sseSend(controller, {
            content: `\n\n⚠️ Sorry, something went wrong. Please try again or WhatsApp us at +91-92587-77312.`,
          });
          sseSend(controller, { done: true });
          controller.close();
        } catch {
          // Controller already closed
        }
      }
    },
    cancel() {
      // Client disconnected — cleanup handled by ReadableStream
      console.log('InsureGPT stream: client disconnected');
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      ...SSE_HEADERS,
      'X-RateLimit-Remaining': String(rateLimit.remaining),
    },
  });
}

// ---------------------------------------------------------------------------
// GET handler — endpoint info / health check
// ---------------------------------------------------------------------------
export async function GET() {
  return new Response(
    JSON.stringify({
      endpoint: '/api/chat/stream',
      method: 'POST',
      description: 'InsureGPT streaming chat with tool use (SSE)',
      poweredBy: 'Paliwal Secure AI — IRDAI POSP IP429834',
      supports: ['streaming', 'tool_use', 'multi-turn-memory', 'multilingual'],
      tools: ['comparePlans', 'calculatePremium', 'getPolicyDetails', 'fetchIRDAIData'],
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
