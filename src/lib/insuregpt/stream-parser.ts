// ============================================================================
// InsureGPT — SSE Stream Parser for Z.ai SDK
// ============================================================================
// Z.ai SDK returns a ReadableStream<Uint8Array> when stream: true is passed.
// We need to:
//   1. Decode the Uint8Array chunks to text
//   2. Parse SSE format: "data: {...}\n\n"
//   3. Extract delta content from each chunk
//   4. Detect tool_calls in the stream
//   5. Detect "[DONE]" sentinel
// ============================================================================

// ---------------------------------------------------------------------------
// SSE Event Types (matches OpenAI/Z.ai chat completion stream format)
// ---------------------------------------------------------------------------
export interface StreamChunk {
  /** Content delta — partial text to append */
  content?: string;
  /** Tool call detected — LLM wants to call a tool */
  toolCall?: {
    id: string;
    name: string;
    arguments: string;
    isComplete: boolean;
  };
  /** Stream finished */
  done?: boolean;
  /** Error */
  error?: string;
  /** Reasoning content (if thinking enabled) */
  reasoning?: string;
}

// ---------------------------------------------------------------------------
// SSE Parser — converts a ReadableStream into StreamChunk events
// ---------------------------------------------------------------------------
export async function* parseSSEStream(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<StreamChunk, void, unknown> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  // Accumulators for tool calls (chunks come in pieces)
  const toolCallAccumulators = new Map<number, { id: string; name: string; arguments: string }>();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE events (separated by "\n\n")
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? ''; // Last incomplete event stays in buffer

      for (const event of events) {
        const lines = event.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') {
            yield { done: true };
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const choice = parsed.choices?.[0];
            if (!choice) continue;

            const delta = choice.delta ?? {};
            const finishReason = choice.finish_reason;

            // ── Content delta ────────────────────────────────────────────
            if (delta.content) {
              yield { content: delta.content };
            }

            // ── Reasoning delta (if thinking enabled) ────────────────────
            if (delta.reasoning_content) {
              yield { reasoning: delta.reasoning_content };
            }

            // ── Tool call delta ─────────────────────────────────────────
            if (delta.tool_calls && Array.isArray(delta.tool_calls)) {
              for (const tc of delta.tool_calls) {
                const idx = tc.index ?? 0;
                if (!toolCallAccumulators.has(idx)) {
                  toolCallAccumulators.set(idx, {
                    id: tc.id ?? '',
                    name: tc.function?.name ?? '',
                    arguments: '',
                  });
                }
                const acc = toolCallAccumulators.get(idx)!;
                if (tc.id) acc.id = tc.id;
                if (tc.function?.name) acc.name = tc.function.name;
                if (tc.function?.arguments) acc.arguments += tc.function.arguments;
              }
            }

            // ── Finish reason — emit accumulated tool calls ─────────────
            if (finishReason === 'tool_calls') {
              for (const [, acc] of toolCallAccumulators) {
                yield {
                  toolCall: {
                    id: acc.id,
                    name: acc.name,
                    arguments: acc.arguments,
                    isComplete: true,
                  },
                };
              }
              toolCallAccumulators.clear();
            }

            // ── Stop reason — content finished ─────────────────────────
            if (finishReason === 'stop' || finishReason === 'length') {
              yield { done: true };
              return;
            }
          } catch {
            // Skip malformed JSON
            continue;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  // Stream ended without explicit [DONE]
  yield { done: true };
}

// ---------------------------------------------------------------------------
// Server-Sent Events Writer (server → client)
// ---------------------------------------------------------------------------
// Helper to convert our StreamChunk into SSE wire format for the client
export function chunkToSSE(chunk: StreamChunk): string {
  const payload = JSON.stringify(chunk);
  return `data: ${payload}\n\n`;
}

// Headers for SSE response
export const SSE_HEADERS: Record<string, string> = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no', // Disable nginx buffering
  'X-Content-Type-Options': 'nosniff',
};

// ---------------------------------------------------------------------------
// Client-side SSE reader (browser fetch + ReadableStream)
// ---------------------------------------------------------------------------
export async function* readSSEFromResponse(
  response: Response
): AsyncGenerator<StreamChunk, void, unknown> {
  if (!response.body) {
    throw new Error('Response body is null');
  }
  yield* parseSSEStream(response.body);
}
