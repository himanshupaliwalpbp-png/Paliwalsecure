// ============================================================================
// InsureGPT Module — Public API
// ============================================================================
// Single entry point for the InsureGPT AI engine.
// All other code should import from here.
// ============================================================================

export {
  CORE_SYSTEM_PROMPT,
  AUTHOR_ENTITY,
  buildSystemPrompt,
  getLanguageInstruction,
  getMandatoryDisclaimer,
  needsDisclaimer,
  QUICK_ACTION_PROMPTS,
  type InsureGPTLanguage,
} from './system-prompt';

export {
  classifyIntent,
  detectLanguage,
  detectCategory,
  getGreetingResponse,
  type IntentResult,
} from './intent-classifier';

export {
  TOOLS,
  TOOL_SCHEMAS,
  executeTool,
  getToolHints,
  type ToolSchema,
  type ToolExecutor,
} from './tools';

export {
  parseSSEStream,
  readSSEFromResponse,
  chunkToSSE,
  SSE_HEADERS,
  type StreamChunk,
} from './stream-parser';
