/**
 * PII Redactor — masks sensitive personal data before sending to LLMs.
 *
 * Why: under India's DPDP Act 2023, sharing PII (phone, email, Aadhaar, PAN,
 * credit-card) with a third-party LLM processor requires consent + DPA.
 * To stay safe, we redact PII before the user's message reaches the LLM,
 * and un-redact it in the final response (only if needed).
 *
 * Token format: «TYPE_N» — angle brackets are reserved, never appear in
 * normal text, and survive LLM round-trips reliably.
 */

export interface RedactionMap {
  [token: string]: string;
}

const PHONE_RE = /(?:\+?91[\s-]?)?(?:\d[\s-]?){10}\b/g;
// Indian Aadhaar: 12 digits, often "1234 5678 9012" or "1234-5678-9012"
const AADHAAR_RE = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
// PAN: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)
const PAN_RE = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g;
// Email
const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
// Credit card: 13-19 digits, optionally space/dash separated
const CC_RE = /\b(?:\d[ -]?){13,19}\b/g;
// PIN code (6-digit Indian postal): context-sensitive — only match if preceded by "pin" / "pincode" / "zip"
const PIN_RE = /(?:pin(?:code)?|zip)[\s:;-]*\d{6}\b/gi;

/**
 * Mask a 10-digit Indian phone number for safe LLM input.
 * Strategy: keep first 2 + last 2 digits → 98****31
 */
function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10) {
    const last10 = digits.slice(-10);
    return `${last10.slice(0, 2)}****${last10.slice(-2)}`;
  }
  return '****';
}

/**
 * Redact all PII patterns from the input. Returns the redacted string and
 * a map from token → original value, so callers can un-redact in the response.
 */
export function redactPii(input: string): { redacted: string; map: RedactionMap } {
  const map: RedactionMap = {};
  let counter = 0;
  let out = input;

  const addToken = (original: string, type: string): string => {
    const token = `«${type}_${++counter}»`;
    map[token] = original;
    return token;
  };

  // Email first (before phone, since email can contain digits)
  out = out.replace(EMAIL_RE, (m) => addToken(m, 'EMAIL'));

  // Aadhaar (before generic phone, since 12-digit may overlap with phone patterns)
  out = out.replace(AADHAAR_RE, (m) => addToken(m, 'AADHAAR'));

  // PAN
  out = out.replace(PAN_RE, (m) => addToken(m, 'PAN'));

  // Credit card
  out = out.replace(CC_RE, (m) => addToken(m, 'CC'));

  // Phone
  out = out.replace(PHONE_RE, (m) => addToken(m, 'PHONE'));

  // PIN code (context-sensitive)
  out = out.replace(PIN_RE, (m) => addToken(m, 'PIN'));

  return { redacted: out, map };
}

/**
 * Un-redact: replace tokens back to original values. Only used when the LLM
 * response needs to address the user by their PII (rare — usually the LLM
 * should refer to "your phone number" not the actual number).
 */
export function unredactPii(input: string, map: RedactionMap): string {
  let out = input;
  for (const [token, original] of Object.entries(map)) {
    // Escape regex special chars in token (though « » are not special)
    out = out.split(token).join(original);
  }
  return out;
}

/**
 * Quick check — does the input contain ANY PII? Used for logging/audit.
 */
export function containsPii(input: string): boolean {
  return (
    PHONE_RE.test(input) ||
    EMAIL_RE.test(input) ||
    AADHAAR_RE.test(input) ||
    PAN_RE.test(input) ||
    CC_RE.test(input) ||
    PIN_RE.test(input)
  );
}

/**
 * Mask sensitive PII for safe logging (returns masked version, NOT a token).
 * e.g. "Call me at 9876543210" → "Call me at 98****10"
 */
export function maskPiiForLog(input: string): string {
  return input
    .replace(EMAIL_RE, (m) => {
      const [name, domain] = m.split('@');
      return `${name[0]}***@${domain}`;
    })
    .replace(AADHAAR_RE, '****-****-****')
    .replace(PAN_RE, '*****XXXX*')
    .replace(CC_RE, '****-****-****-****')
    .replace(PHONE_RE, (m) => maskPhone(m))
    .replace(PIN_RE, (m) => m.replace(/\d{6}/, '******'));
}

/**
 * Anti-prompt-injection defense.
 *
 * Detects common prompt-injection patterns in user input. Returns true if the
 * input looks like an attempt to override the system prompt.
 */
export function looksLikePromptInjection(input: string): boolean {
  const lower = input.toLowerCase();
  const patterns = [
    'ignore previous',
    'ignore all previous',
    'ignore the previous',
    'ignore your',
    'disregard previous',
    'disregard your',
    'forget your',
    'forget previous',
    'override your',
    'override previous',
    'override the system',
    'system prompt',
    'reveal your',
    'show your',
    'print your',
    'what is your',
    'what are your instructions',
    'you are now',
    'new instructions',
    'act as',
    'pretend you are',
    'jailbreak',
  ];
  return patterns.some((p) => lower.includes(p));
}
