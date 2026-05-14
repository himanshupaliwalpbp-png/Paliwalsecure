// ── Chat Memory Utility ──────────────────────────────────────────────────────
// Stores user preferences in localStorage for AI personalization
// Detects: name, budget, insurance interests, age, PEDs, language

export interface ChatMemory {
  name: string;
  language: string; // 'hi' | 'en' | 'hinglish'
  interests: string[]; // health, life, motor, travel, term, etc.
  budget: string;
  ageGroup: string; // young, middle, senior
  ped: string[]; // pre-existing diseases
  lastVisit: string;
  visitCount: number;
  previousTopics: string[];
}

const STORAGE_KEY = 'paliwal_secure_chat_memory';

const DEFAULT_MEMORY: ChatMemory = {
  name: '',
  language: 'en',
  interests: [],
  budget: '',
  ageGroup: '',
  ped: [],
  lastVisit: '',
  visitCount: 0,
  previousTopics: [],
};

export function loadChatMemory(): ChatMemory {
  if (typeof window === 'undefined') return DEFAULT_MEMORY;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_MEMORY;
    return { ...DEFAULT_MEMORY, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_MEMORY;
  }
}

export function saveChatMemory(data: ChatMemory): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail if localStorage is full
  }
}

export function updateChatMemory(partial: Partial<ChatMemory>): ChatMemory {
  const current = loadChatMemory();
  const updated = { ...current, ...partial };
  saveChatMemory(updated);
  return updated;
}

export function isReturningUser(): boolean {
  const mem = loadChatMemory();
  return mem.visitCount > 1;
}

export function recordVisit(): ChatMemory {
  const mem = loadChatMemory();
  return updateChatMemory({
    visitCount: mem.visitCount + 1,
    lastVisit: new Date().toISOString(),
  });
}

/**
 * Extract personal info from a chat message using keyword detection.
 */
export function extractInfoFromMessage(message: string): Partial<ChatMemory> {
  const lower = message.toLowerCase();
  const updates: Partial<ChatMemory> = {};

  // ── Name detection ──────────────────────────────────────────────────────
  const namePatterns = [
    /mera\s+naam\s+(\w+)/i,
    /mera\s+nam\s+(\w+)/i,
    /my\s+name\s+is\s+(\w+)/i,
    /i'?m\s+(\w+)(?:\s|$)/i,
    /call\s+me\s+(\w+)/i,
    /main\s+(\w+)\s+bol\s+raha/i,
    /main\s+(\w+)\s+bol\s+rahi/i,
  ];
  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match?.[1] && match[1].length > 1 && !['main', 'hum', 'mein'].includes(match[1].toLowerCase())) {
      updates.name = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      break;
    }
  }

  // ── Budget detection ────────────────────────────────────────────────────
  const budgetPatterns = [
    /budget\s*[₹]?\s*(\d[\d,]*)/i,
    /(\d[\d,]*)\s*tak\s+ka\s+plan/i,
    /around\s*[₹]?\s*(\d[\d,]*)/i,
    /₹\s*(\d[\d,]*)\s*(?:per\s+month|monthly|per\s+year|yearly|\/mo|\/yr)/i,
    /(\d[\d,]*)\s*(?:per\s+month|monthly|rupees)/i,
  ];
  for (const pattern of budgetPatterns) {
    const match = message.match(pattern);
    if (match?.[1]) {
      updates.budget = `₹${match[1]}`;
      break;
    }
  }

  // ── Insurance interest detection ────────────────────────────────────────
  const interestMap: Record<string, string[]> = {
    health: ['health', 'medical', 'hospital', 'disease', 'illness', 'surgery', 'cashless', 'sehat'],
    life: ['life', 'jivan', 'term', 'endowment', 'death', 'sum assured', 'cover'],
    motor: ['car', 'bike', 'motor', 'vehicle', 'auto', 'gadi', 'comprehensive', 'third.?party'],
    travel: ['travel', 'trip', 'flight', 'visa', 'international', 'yatra'],
    home: ['home', 'house', 'property', 'ghar', 'fire'],
  };

  const currentInterests = loadChatMemory().interests;
  const newInterests = [...currentInterests];

  for (const [interest, keywords] of Object.entries(interestMap)) {
    if (keywords.some((kw) => new RegExp(kw, 'i').test(lower))) {
      if (!newInterests.includes(interest)) {
        newInterests.push(interest);
      }
    }
  }
  if (newInterests.length > currentInterests.length) {
    updates.interests = newInterests;
  }

  // ── Age detection ───────────────────────────────────────────────────────
  const agePatterns = [
    /main\s+(\d{1,3})\s+saal\s+ka/i,
    /main\s+(\d{1,3})\s+saal\s+ki/i,
    /i'?m?\s+(?:am\s+)?(\d{1,3})\s+years?\s+old/i,
    /age\s+(?:is\s+)?(\d{1,3})/i,
  ];
  for (const pattern of agePatterns) {
    const match = message.match(pattern);
    if (match?.[1]) {
      const age = parseInt(match[1], 10);
      if (age >= 18 && age <= 100) {
        updates.ageGroup = age < 30 ? 'young' : age < 50 ? 'middle' : 'senior';
      }
      break;
    }
  }

  // ── Pre-existing disease detection ──────────────────────────────────────
  const pedKeywords = [
    'diabetes', 'sugar', 'bp', 'blood pressure', 'hypertension',
    'heart disease', 'cardiac', 'thyroid', 'hypothyroid', 'hyperthyroid',
    'asthma', 'breathing', 'cancer', 'tumor', 'kidney', 'liver',
    'arthritis', 'joint pain', 'spondylitis', 'migraine', 'epilepsy',
  ];
  const currentPed = loadChatMemory().ped;
  const newPed = [...currentPed];
  for (const disease of pedKeywords) {
    if (lower.includes(disease) && !newPed.includes(disease)) {
      newPed.push(disease);
    }
  }
  if (newPed.length > currentPed.length) {
    updates.ped = newPed;
  }

  // ── Language detection ──────────────────────────────────────────────────
  const hasHindi = /[\u0900-\u097F]/.test(message);
  const hasEnglish = /[a-zA-Z]/.test(message);
  if (hasHindi && hasEnglish) {
    updates.language = 'hinglish';
  } else if (hasHindi) {
    updates.language = 'hi';
  } else if (hasEnglish) {
    updates.language = 'en';
  }

  // ── Topic tracking ─────────────────────────────────────────────────────
  const topicKeywords: Record<string, string[]> = {
    'Health Insurance': ['health', 'medical', 'hospital', 'disease'],
    'Term Insurance': ['term', 'life cover', 'death benefit'],
    'Car Insurance': ['car', 'motor', 'comprehensive'],
    'Tax Benefits': ['tax', '80d', '80c', 'deduction'],
    'Claim Process': ['claim', 'reimbursement', 'cashless', 'settlement'],
  };

  const currentTopics = loadChatMemory().previousTopics;
  const newTopics = [...currentTopics].slice(-9); // Keep last 10
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((kw) => lower.includes(kw)) && !newTopics.includes(topic)) {
      newTopics.push(topic);
    }
  }
  if (newTopics.length > currentTopics.length) {
    updates.previousTopics = newTopics;
  }

  return updates;
}

/**
 * Build a personalized greeting for returning users.
 */
export function buildPersonalizedGreeting(): string {
  const mem = loadChatMemory();
  if (mem.visitCount <= 1 || !mem.lastVisit) return '';

  const parts: string[] = ['Welcome back'];
  if (mem.name) {
    parts[0] += `, **${mem.name}**`;
  }
  parts[0] += '! 🙏';

  if (mem.previousTopics.length > 0) {
    const lastTopic = mem.previousTopics[mem.previousTopics.length - 1];
    parts.push(`Last time we discussed **${lastTopic}**.`);
  }

  if (mem.interests.length > 0) {
    const interestStr = mem.interests.map((i) => `**${i}** insurance`).join(' and ');
    parts.push(`I remember you're interested in ${interestStr}.`);
  }

  return parts.join(' ');
}

/**
 * Build a context string for the AI from the chat memory.
 */
export function buildMemoryContextString(): string {
  const mem = loadChatMemory();
  if (mem.visitCount === 0) return '';

  const parts: string[] = [];

  if (mem.name) parts.push(`User's name is ${mem.name}.`);
  if (mem.language === 'hi') parts.push('User prefers Hindi responses.');
  if (mem.language === 'hinglish') parts.push('User prefers Hinglish (Hindi-English mix) responses.');
  if (mem.interests.length > 0) parts.push(`They are interested in ${mem.interests.join(', ')} insurance.`);
  if (mem.budget) parts.push(`Their budget is ${mem.budget}.`);
  if (mem.ageGroup) parts.push(`They fall in the ${mem.ageGroup} age group.`);
  if (mem.ped.length > 0) parts.push(`They have pre-existing conditions: ${mem.ped.join(', ')}.`);
  if (mem.previousTopics.length > 0) parts.push(`Previously discussed: ${mem.previousTopics.join(', ')}.`);

  return parts.join(' ');
}

export function clearChatMemory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}
