'use client';

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, MicOff, Bot, User, Sparkles, ShieldCheck,
  Phone, MessageCircle, Mail, Clock, ChevronDown, ChevronLeft, ChevronRight,
  ThumbsUp, ThumbsDown, Headset, ExternalLink, ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { type UserProfile, IRDAI_MANDATORY_DISCLAIMER } from '@/lib/insurance-data';
import CallbackRequestForm from '@/components/CallbackRequestForm';
import { GAEvents } from '@/lib/ga-events';
import {
  loadChatMemory,
  recordVisit,
  extractInfoFromMessage,
  updateChatMemory,
  buildPersonalizedGreeting,
  buildMemoryContextString,
  type ChatMemory,
} from '@/lib/chat-memory';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface EmbeddedChatBotProps {
  profile?: UserProfile | null;
  onOnboardingTrigger?: () => void;
  isFloating?: boolean;
}

type CSATState = 'neutral' | 'positive' | 'negative';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  csatFeedback: CSATState;
  /** True if the bot message contains a plan recommendation */
  isRecommendation: boolean;
  /** True if this message shows escalation options */
  isEscalation: boolean;
}

// ---------------------------------------------------------------------------
// Speech Recognition types (not in standard TS libs)
// ---------------------------------------------------------------------------
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ---------------------------------------------------------------------------
// Quick Reply Config — contextual suggestions with emojis
// ---------------------------------------------------------------------------
const INITIAL_QUICK_REPLIES = [
  '🏥 Health Insurance',
  '🚗 Car Insurance',
  '🛵 Bike Insurance',
  '🛡️ Term Plan',
  '📋 Claim Help',
  '💰 Tax Saving',
  '📊 Compare Plans',
  '👨‍👩‍👧 Family Plans',
];

const FOLLOWUP_MAP: Record<string, string[]> = {
  health: ['👨‍👩‍👧 Family Floater', '🏥 Cashless Hospitals', '⏳ Waiting Period', '🩺 Pre-existing Disease', '⬆️ Top-up Plans'],
  term: ['⚖️ Term vs Whole Life', '🫀 Critical Illness Rider', '🧮 Premium Calculator', '⚠️ Accidental Death Benefit'],
  claim: ['💳 Cashless Claim', '🧾 Reimbursement Claim', '📄 Documents Required', '❌ Claim Rejection'],
  tax: ['📋 80D Benefits', '📋 80C Benefits', '🏢 HUF Tax Saving', '🏛️ NPS + Insurance'],
  compare: ['🏥 Health vs Top-up', '🛡️ Term vs Endowment', '👤 Individual vs Floater', '📈 Best CSR Plans'],
  life: ['🛡️ Term Insurance', '💰 Endowment Plans', '📈 ULIPs', '👴 Pension Plans'],
  motor: ['🔄 Comprehensive vs TP', '🚫 Zero Depreciation', '🎁 No Claim Bonus', '💵 IDV Calculator'],
  car: ['🔄 Comprehensive vs TP', '🚫 Zero Depreciation', '🎁 No Claim Bonus', '🔧 Engine Protection'],
  bike: ['🔄 Comprehensive vs TP', '🚫 Zero Depreciation', '🎁 No Claim Bonus', '💵 IDV Calculator'],
  family: ['👨‍👩‍👧 Family Floater', '👶 Child Plans', '👴 Senior Citizen', '🤒 Critical Illness'],
};

function getFollowUpReplies(userMessage: string): string[] {
  const lower = userMessage.toLowerCase();
  if (/health|medical|hospital|disease|illness|surgery/i.test(lower)) return FOLLOWUP_MAP.health;
  if (/car|gaadi|four.*wheel/i.test(lower)) return FOLLOWUP_MAP.car;
  if (/bike|motor|two.*wheel|scooty|scooter/i.test(lower)) return FOLLOWUP_MAP.bike;
  if (/term|life|death|cover|sum assured/i.test(lower)) return FOLLOWUP_MAP.term;
  if (/claim|reimburse|cashless|settle/i.test(lower)) return FOLLOWUP_MAP.claim;
  if (/tax|80d|80c|deduct|save/i.test(lower)) return FOLLOWUP_MAP.tax;
  if (/compare|versus|vs|difference|better/i.test(lower)) return FOLLOWUP_MAP.compare;
  if (/jivan|endowment|pension|ulip|child/i.test(lower)) return FOLLOWUP_MAP.life;
  if (/motor|vehicle|auto/i.test(lower)) return FOLLOWUP_MAP.motor;
  if (/family|parivar|depend/i.test(lower)) return FOLLOWUP_MAP.family;
  return INITIAL_QUICK_REPLIES;
}

/**
 * Lightweight markdown-like renderer for bot messages.
 * Supports: **bold**, *italic*, `code`, - lists, numbered lists, [link](url)
 */
function renderBotContent(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    if (line.trim() === '') {
      nodes.push(<br key={`br-${lineIdx}`} />);
      return;
    }

    // Handle separator lines (---)
    if (line.trim() === '---') {
      nodes.push(<hr key={`hr-${lineIdx}`} className="border-slate-200 dark:border-slate-700 my-2" />);
      return;
    }

    // Handle list items
    const ulMatch = line.match(/^[\-\*]\s+(.*)/);
    const olMatch = line.match(/^\d+\.\s+(.*)/);

    if (ulMatch || olMatch) {
      const text = ulMatch ? ulMatch[1] : (olMatch as RegExpMatchArray)[1];
      nodes.push(
        <div key={`li-${lineIdx}`} className="flex gap-2 ml-1">
          <span className="text-teal-600 dark:text-teal-400 shrink-0">{ulMatch ? '\u2022' : line.match(/^\d+/)?.[0] + '.'}</span>
          <span>{renderInlineMarkdown(text)}</span>
        </div>
      );
      return;
    }

    nodes.push(<span key={`line-${lineIdx}`}>{renderInlineMarkdown(line)}</span>);

    // Add newline between lines (but not after the last one)
    if (lineIdx < lines.length - 1) {
      nodes.push(<br key={`br-after-${lineIdx}`} />);
    }
  });

  return nodes;
}

function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Pattern: [link text](url), **bold**, *italic*, `code`
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }

    if (match[2] && match[3]) {
      // [link text](url)
      parts.push(
        <a
          key={`a-${match.index}`}
          href={match[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-600 dark:text-cyan-400 underline underline-offset-2 hover:text-cyan-800 dark:hover:text-cyan-300 inline-flex items-center gap-0.5"
        >
          {match[2]}
          <ExternalLink className="w-2.5 h-2.5 inline" />
        </a>
      );
    } else if (match[4]) {
      // **bold**
      parts.push(<strong key={`b-${match.index}`} className="font-semibold text-teal-700 dark:text-teal-300">{match[4]}</strong>);
    } else if (match[5]) {
      // *italic*
      parts.push(<em key={`i-${match.index}`} className="text-slate-500 dark:text-slate-400">{match[5]}</em>);
    } else if (match[6]) {
      // `code`
      parts.push(
        <code key={`c-${match.index}`} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">
          {match[6]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return parts;
}

// ---------------------------------------------------------------------------
// Escalation keyword detection
// ---------------------------------------------------------------------------
function shouldEscalate(message: string): boolean {
  const lower = message.toLowerCase();
  const keywords = [
    'agent', 'human', 'call me', 'callback', 'talk to person',
    'bahut pareshan', 'agent se baat', 'insaan se baat',
    'live agent', 'real person', 'frustrated', 'not helping',
    'waste of time', 'useless', 'complaint', 'grievance'
  ];
  return keywords.some(kw => lower.includes(kw));
}

// ---------------------------------------------------------------------------
// Escalation Options — inline buttons inside chat
// ---------------------------------------------------------------------------
function EscalationOptions({
  onWhatsApp,
  onCallback,
  onEmail,
}: {
  onWhatsApp: () => void;
  onCallback: () => void;
  onEmail: () => void;
}) {
  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-1.5 mb-2">
        <Headset className="w-3.5 h-3.5 text-teal-500" />
        <span className="text-xs font-medium text-teal-600 dark:text-teal-400">Expert se connect karein:</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <button
          onClick={onWhatsApp}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/40 hover:shadow-md transition-all text-left group"
        >
          <span className="text-base">🟢</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">WhatsApp Chat</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Instant messaging pe baat karein</p>
          </div>
        </button>
        <button
          onClick={onCallback}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 border border-cyan-200 dark:border-cyan-800/40 hover:shadow-md transition-all text-left group"
        >
          <span className="text-base">📞</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Request Callback</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Hum aapko call karenge</p>
          </div>
        </button>
        <button
          onClick={onEmail}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/40 hover:shadow-md transition-all text-left group"
        >
          <span className="text-base">✉️</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Email Us</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Detailed query bhejiye</p>
          </div>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detect if a bot message contains a recommendation
// ---------------------------------------------------------------------------
function isRecommendationMessage(content: string): boolean {
  const lower = content.toLowerCase();
  return (
    /recommend|suggest|best plan|top plan|yeh plan|aapke liye|suitable|ideal choice/i.test(lower) ||
    /claim settlement ratio|csr|premium.*₹|network hospital/i.test(lower)
  );
}

// ---------------------------------------------------------------------------
// Typing Indicator — Premium with pulse avatar and "Generating..." text
// ---------------------------------------------------------------------------
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 mb-4">
      <motion.div
        className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Bot className="w-4 h-4 text-white" />
      </motion.div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-100 dark:border-slate-700 border-l-2 border-l-cyan-400 dark:border-l-cyan-600">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <motion.span
              className="w-1.5 h-1.5 bg-cyan-500 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
            />
            <motion.span
              className="w-1.5 h-1.5 bg-teal-500 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
              className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            />
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Generating</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CSAT Feedback Component — small thumbs up/down
// ---------------------------------------------------------------------------
function CSATFeedback({
  feedback,
  onFeedback,
}: {
  feedback: CSATState;
  onFeedback: (state: CSATState) => void;
}) {
  if (feedback !== 'neutral') {
    return (
      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 inline-block">
        Shukriya! 🙏
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <span className="text-[10px] text-slate-400 dark:text-slate-500">Kya yeh helpful tha?</span>
      <button
        onClick={() => onFeedback('positive')}
        className="p-0.5 rounded hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors group"
        aria-label="Helpful"
      >
        <ThumbsUp className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-green-500 transition-colors" />
      </button>
      <button
        onClick={() => onFeedback('negative')}
        className="p-0.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors group"
        aria-label="Not helpful"
      >
        <ThumbsDown className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-red-500 transition-colors" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Explainability Component — "Kyun yeh plan?" collapsible
// ---------------------------------------------------------------------------
function ExplainabilitySection() {
  return (
    <Accordion type="single" collapsible className="mt-2 w-full">
      <AccordionItem value="explainability" className="border-b-0">
        <AccordionTrigger className="py-1.5 text-[11px] text-teal-500 hover:no-underline hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300 gap-1">
          <span className="flex items-center gap-1">
            <ChevronDown className="w-3 h-3" />
            Kyun yeh plan?
          </span>
        </AccordionTrigger>
        <AccordionContent className="text-[11px] text-slate-500 dark:text-slate-400 pb-1">
          <div className="space-y-1.5 pl-1">
            <div className="flex items-center justify-between">
              <span>Claim Settlement Ratio (CSR)</span>
              <span className="font-medium text-cyan-600 dark:text-cyan-400">40% weight</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1">
              <div className="bg-cyan-500 h-1 rounded-full" style={{ width: '40%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span>Premium Affordability</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">30% weight</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1">
              <div className="bg-emerald-500 h-1 rounded-full" style={{ width: '30%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span>Network Hospitals</span>
              <span className="font-medium text-amber-600 dark:text-amber-400">20% weight</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1">
              <div className="bg-amber-500 h-1 rounded-full" style={{ width: '20%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span>Solvency Ratio</span>
              <span className="font-medium text-rose-600 dark:text-rose-400">10% weight</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1">
              <div className="bg-rose-500 h-1 rounded-full" style={{ width: '10%' }} />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// ---------------------------------------------------------------------------
// Human Handoff Dialog
// ---------------------------------------------------------------------------
function HumanHandoffDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Headset className="w-5 h-5 text-teal-600" />
            Expert se Baat Karein
          </DialogTitle>
          <DialogDescription>
            Hamari insurance experts aapki madad ke liye ready hain.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {/* Live Agent */}
          <a
            href="tel:+919999999999"
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 border border-cyan-100 dark:border-cyan-800/40 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center shrink-0 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/50 transition-colors">
              <Phone className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Live Agent</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">+91-9999-999-999</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-100 dark:border-green-800/40 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
              <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">WhatsApp</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">wa.me/919999999999</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          </a>

          {/* Email */}
          <a
            href="mailto:support@paliwalsecure.com"
            className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100 dark:border-amber-800/40 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/50 transition-colors">
              <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Email</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">support@paliwalsecure.com</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          </a>
        </div>

        {/* Availability Note */}
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 mt-1">
          <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hamari team <strong className="text-slate-700 dark:text-slate-300">Mon-Sat, 9 AM - 7 PM</strong> available hai
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Progressive Disclosure Suggestion
// ---------------------------------------------------------------------------
function ProgressiveDisclosureSuggestion({
  profile,
  onOnboardingTrigger,
}: {
  profile?: UserProfile | null;
  onOnboardingTrigger?: () => void;
}) {
  if (profile) return null;

  const handleClick = () => {
    if (onOnboardingTrigger) {
      onOnboardingTrigger();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-cyan-200 dark:border-cyan-800/50 bg-cyan-50/50 dark:bg-cyan-950/20 text-[11px] text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-950/30 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all cursor-pointer group mt-1"
    >
      <ClipboardList className="w-3 h-3 shrink-0" />
      <span>Personalized sujhav ke liye apna profile banaayein (2 min)</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Streaming Bot Message — component that reveals text character by character
// ---------------------------------------------------------------------------
function StreamingBotMessage({
  content,
  isStreaming,
  onStreamComplete,
  children,
}: {
  content: string;
  isStreaming: boolean;
  onStreamComplete: () => void;
  children: React.ReactNode;
}) {
  const [chars, setChars] = useState(isStreaming ? 0 : content.length);

  useEffect(() => {
    if (!isStreaming || content.length === 0) return;

    const interval = setInterval(() => {
      setChars((prev) => {
        const next = prev + 3;
        if (next >= content.length) {
          clearInterval(interval);
          onStreamComplete();
          return content.length;
        }
        return next;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isStreaming, content.length, onStreamComplete]);

  const displayedContent = isStreaming ? content.slice(0, chars) : content;
  const stillStreaming = isStreaming && chars < content.length;

  return (
    <div>
      <div className="space-y-1">{renderBotContent(displayedContent)}</div>
      {/* Streaming cursor */}
      {stillStreaming && (
        <motion.span
          className="inline-block w-0.5 h-4 bg-cyan-500 dark:bg-cyan-400 ml-0.5 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
      {/* Show children (CSAT, escalation, etc.) only after streaming completes */}
      {!stillStreaming && children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Swipeable Quick Reply Carousel
// ---------------------------------------------------------------------------
function QuickReplyCarousel({
  replies,
  onReply,
  disabled,
  label,
}: {
  replies: string[];
  onReply: (reply: string) => void;
  disabled: boolean;
  label?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll, replies]);

  // Recheck on replies change
  useEffect(() => {
    setTimeout(checkScroll, 50);
  }, [replies, checkScroll]);

  const scrollBy = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -120 : 120, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {label && (
        <div className="flex items-center gap-1.5 mb-1.5 px-1">
          <Sparkles className="w-3 h-3 text-cyan-500" />
          <p className="text-[10px] text-slate-400 font-medium">{label}</p>
        </div>
      )}
      <div className="relative group/carousel">
        {/* Left scroll indicator */}
        {canScrollLeft && (
          <button
            onClick={() => scrollBy('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all opacity-0 group-hover/carousel:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
          </button>
        )}

        {/* Scrollable chips */}
        <div
          ref={scrollRef}
          className="flex gap-1.5 overflow-x-auto flex-nowrap pb-1 scrollbar-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <AnimatePresence mode="popLayout">
            {replies.map((reply) => (
              <motion.button
                key={reply}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => onReply(reply)}
                disabled={disabled}
                className="px-3 py-1.5 text-xs rounded-full whitespace-nowrap min-h-[32px] cursor-pointer transition-all shrink-0
                  bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30
                  border border-cyan-200 dark:border-cyan-800/40
                  text-cyan-700 dark:text-cyan-300
                  hover:from-cyan-100 hover:to-teal-100 dark:hover:from-cyan-900/40 dark:hover:to-teal-900/40
                  hover:border-cyan-300 dark:hover:border-cyan-700
                  hover:shadow-md hover:shadow-cyan-500/10
                  active:scale-95
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {reply}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Right scroll indicator */}
        {canScrollRight && (
          <button
            onClick={() => scrollBy('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all opacity-0 group-hover/carousel:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmbeddedChatBot Component — Premium AI Chat Design
// Full-width, prominent, and responsive with cyan/teal/emerald theme
// ---------------------------------------------------------------------------
export default function EmbeddedChatBot({ profile, onOnboardingTrigger, isFloating = false }: EmbeddedChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [showHandoffDialog, setShowHandoffDialog] = useState(false);
  const [showCallbackDialog, setShowCallbackDialog] = useState(false);
  const [currentQuickReplies, setCurrentQuickReplies] = useState<string[]>(INITIAL_QUICK_REPLIES);
  const [chatMemory, setChatMemory] = useState<ChatMemory | null>(null);
  const [isReturning, setIsReturning] = useState(false);

  // Streaming state — tracks which message is currently being streamed
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Callback when streaming completes
  const handleStreamComplete = useCallback(() => {
    setStreamingMsgId(null);
  }, []);

  // Check Speech API support on mount
  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognitionAPI);
  }, []);

  // Load chat memory and record visit on mount
  useEffect(() => {
    const memory = loadChatMemory();
    const returning = memory.visitCount > 0;
    setIsReturning(returning);
    setChatMemory(memory);

    // Record this visit
    const updated = recordVisit();
    setChatMemory(updated);
  }, []);

  // Initial welcome message (with personalization)
  useEffect(() => {
    if (messages.length === 0 && chatMemory !== null) {
      const greeting = buildPersonalizedGreeting();

      setMessages([
        {
          id: generateId(),
          role: 'bot',
          content: greeting,
          timestamp: new Date(),
          csatFeedback: 'neutral',
          isRecommendation: false,
          isEscalation: false,
        },
      ]);
    }
  }, [chatMemory]);

  // Auto-scroll to bottom (only within chat container, NOT the whole page)
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // ---------------------------------------------------------------------------
  // CSAT feedback handler
  // ---------------------------------------------------------------------------
  const handleCSATFeedback = useCallback((messageId: string, feedback: CSATState) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, csatFeedback: feedback } : msg
      )
    );
  }, []);

  // ---------------------------------------------------------------------------
  // Send message
  // ---------------------------------------------------------------------------
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      GAEvents.chatMessage(text.trim().length);

      // Stop any ongoing streaming
      setStreamingMsgId(null);

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
        csatFeedback: 'neutral',
        isRecommendation: false,
        isEscalation: false,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);

      // Extract info from message and update chat memory
      const extracted = extractInfoFromMessage(text.trim());
      const hasExtractedInfo = Object.keys(extracted).length > 0;
      if (hasExtractedInfo) {
        const updated = updateChatMemory(extracted);
        setChatMemory(updated);
      }

      // Update quick replies based on what the user asked
      const newReplies = getFollowUpReplies(text);
      setCurrentQuickReplies(newReplies);

      try {
        const history = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // Build memory context for API
        const memoryContext = buildMemoryContextString();

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            profile: profile ?? undefined,
            history,
            memory: memoryContext || undefined,
          }),
        });

        const data = await res.json();

        if (data.success && data.response) {
          const botMsgId = generateId();
          const botMessage: ChatMessage = {
            id: botMsgId,
            role: 'bot',
            content: data.response,
            timestamp: new Date(),
            csatFeedback: 'neutral',
            isRecommendation: isRecommendationMessage(data.response),
            isEscalation: false,
          };
          setMessages((prev) => [...prev, botMessage]);

          // Start streaming effect for the new bot message
          setStreamingMsgId(botMsgId);

          // Task 9: Real-time alert for claim rejection queries
          const claimRejectionKeywords = /claim.*reject|reject.*claim|insurer.*not.*pay|not.*paying|claim.*denied|denied.*claim|क्लेम.*रिजेक्ट|claim.*repudiat/i;
          if (claimRejectionKeywords.test(text.trim())) {
            const alertMessage: ChatMessage = {
              id: generateId(),
              role: 'bot',
              content: `⚠️ **IRDAI Alert — Your Rights When a Claim is Rejected:**\n\n**IRDAI Moratorium (5-Year Protection):**\nAfter 5 continuous years of coverage, no claim can be rejected for non-disclosure (except fraud). [IRDAI Regulations 2025-26]\n\n**How to Appeal a Rejected Claim:**\n1. **Step 1:** Contact your insurer's Grievance Redressal Officer (GRO) — they must respond within 30 days\n2. **Step 2:** File complaint on **Bima Bharosa Portal** (IRDAI's online platform) at igms.irda.gov.in\n3. **Step 3:** Approach **Insurance Ombudsman** (for claims up to ₹50 Lakh) — free, no lawyer needed\n\n**Cashless Claim Rights:**\n• Pre-authorisation must come within **1 hour** of document receipt\n• Discharge approval within **3 hours** of final bill submission\n\n**Remember:** 65% of rejected claims get approved on appeal! Don't give up.\n\n📞 Insurance Ombudsman: Visit https://www.irdai.gov.in for your nearest office`,
              timestamp: new Date(),
              csatFeedback: 'neutral',
              isRecommendation: false,
              isEscalation: false,
            };
            setMessages((prev) => [...prev, alertMessage]);
          }

          // Check for escalation after bot response
          if (shouldEscalate(text.trim())) {
            const escalationMessage: ChatMessage = {
              id: generateId(),
              role: 'bot',
              content: 'Samajh gaya! Aap ek expert se baat karna chahte hain. Neeche option choose karein:',
              timestamp: new Date(),
              csatFeedback: 'neutral',
              isRecommendation: false,
              isEscalation: true,
            };
            setMessages((prev) => [...prev, escalationMessage]);
          }
        } else {
          const errorMessage: ChatMessage = {
            id: generateId(),
            role: 'bot',
            content:
              "Maafi chahunga, main aapka sawaal process nahi kar paya. Kripya dobara try karein ya apna sawaal alag tarike se poochiye.",
            timestamp: new Date(),
            csatFeedback: 'neutral',
            isRecommendation: false,
            isEscalation: false,
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch {
        const errorMessage: ChatMessage = {
          id: generateId(),
          role: 'bot',
          content:
            "Abhi connection mein dikkat aa rahi hai. Apna internet check karein aur dobara try karein.",
          timestamp: new Date(),
          csatFeedback: 'neutral',
          isRecommendation: false,
          isEscalation: false,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, profile]
  );

  // ---------------------------------------------------------------------------
  // Form submit
  // ---------------------------------------------------------------------------
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // ---------------------------------------------------------------------------
  // Voice input
  // ---------------------------------------------------------------------------
  const toggleVoice = useCallback(() => {
    if (!speechSupported) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognitionAPI =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return;

    const recognition = new (SpeechRecognitionAPI as new () => ISpeechRecognition)();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isRecording, speechSupported]);

  // ---------------------------------------------------------------------------
  // Quick reply click
  // ---------------------------------------------------------------------------
  const handleSuggestion = (suggestion: string) => {
    // Remove emoji prefix for sending (extract text after emoji)
    const cleanSuggestion = suggestion.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+/u, '').trim() || suggestion;
    sendMessage(cleanSuggestion);
  };

  // ---------------------------------------------------------------------------
  // Render — Premium AI Chat Design
  // ---------------------------------------------------------------------------
  return (
    <div className={`w-full bg-background overflow-hidden flex flex-col h-full ${isFloating ? '' : 'rounded-3xl shadow-xl border border-cyan-100/50 dark:border-cyan-900/30'}`}>
      {/* Header — Premium Animated Gradient (hidden in floating mode) */}
      {!isFloating ? (
        <div className="relative bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 backdrop-blur-md text-white px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between shrink-0 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-600 opacity-80" style={{ backgroundSize: '200% 100%', animation: 'shimmer-gradient 6s ease infinite' }} />
          
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full" />
          <div className="absolute top-2 right-20 w-12 h-12 bg-white/5 rounded-full" />

          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            {/* Bot avatar with pulse ring */}
            <div className="relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              {/* Green live dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-teal-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg leading-tight">InsureGPT</h3>
                <span className="text-[10px] text-white/70">•</span>
                <span className="text-xs text-white/80 font-medium">Powered by AI</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-white/80">Online</span>
                </div>
                <Badge className="bg-white/15 text-white border-0 text-[9px] px-1.5 py-0 h-4 gap-0.5 font-semibold">
                  <Sparkles className="w-2.5 h-2.5" />
                  Paliwal Secure
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            {/* Human Handoff Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowHandoffDialog(true)}
              className="h-8 gap-1.5 bg-white/15 hover:bg-white/25 text-white border-0 rounded-full px-3 text-xs font-medium transition-all"
              aria-label="Talk to an expert"
            >
              <Headset className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Expert se Baat Karein</span>
              <span className="sm:hidden">Expert</span>
            </Button>
            {(profile || isReturning) && (
              <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs hidden sm:inline-flex gap-1">
                🧠 Personalized
              </Badge>
            )}
            <div className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span className="text-[10px] sm:text-xs font-medium">IRDAI Compliant</span>
            </div>
          </div>
          
          {/* Shimmer animation keyframes injected */}
          <style jsx>{`
            @keyframes shimmer-gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
          `}</style>
        </div>
      ) : null}

      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        className={`${isFloating ? 'flex-1' : 'h-[400px] sm:h-[450px] lg:h-[500px]'} overflow-y-auto px-4 sm:px-6 py-4 scroll-smooth`}
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#5eead4 transparent' }}
      >
        <div className="space-y-1">
          {messages.map((msg) => {
            const isCurrentlyStreaming = msg.id === streamingMsgId;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`flex items-start gap-2.5 mb-4 ${
                  msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                {msg.role === 'bot' ? (
                  <motion.div
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20"
                    animate={isCurrentlyStreaming ? { scale: [1, 1.08, 1] } : {}}
                    transition={isCurrentlyStreaming ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </motion.div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center shrink-0 shadow-md shadow-slate-500/20">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Bubble — Professional AI Chat Design */}
                <div
                  className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed relative ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-500 to-teal-400 text-white rounded-tr-sm shadow-md shadow-cyan-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700 border-l-[3px] border-l-cyan-400 dark:border-l-cyan-600'
                  }`}
                >
                  {msg.role === 'bot' ? (
                    <StreamingBotMessage
                      key={msg.id}
                      content={msg.content}
                      isStreaming={isCurrentlyStreaming}
                      onStreamComplete={handleStreamComplete}
                    >
                      {/* Escalation Options */}
                      {msg.isEscalation && (
                        <EscalationOptions
                          onWhatsApp={() => {
                            const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';
                            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Namaste! Mujhe insurance ke baare mein jaankari chahiye. Paliwal Secure se contact kar raha/rahi hoon.')}`;
                            window.open(whatsappUrl, '_blank');
                          }}
                          onCallback={() => setShowCallbackDialog(true)}
                          onEmail={() => {
                            const mailtoUrl = 'mailto:support@paliwalsecure.com?subject=Insurance%20Query%20-%20Callback%20Requested&body=Namaste%2C%0A%0AMujhe%20insurance%20ke%20baare%20mein%20jaankari%20chahiye.%0A%0ADhanyavaad';
                            window.open(mailtoUrl);
                          }}
                        />
                      )}
                      {/* Explainability Section for recommendations */}
                      {msg.isRecommendation && <ExplainabilitySection />}
                      {/* CSAT Feedback */}
                      <CSATFeedback
                        feedback={msg.csatFeedback}
                        onFeedback={(state) => handleCSATFeedback(msg.id, state)}
                      />
                      {/* Progressive Disclosure Suggestion */}
                      <ProgressiveDisclosureSuggestion
                        profile={profile}
                        onOnboardingTrigger={onOnboardingTrigger}
                      />
                    </StreamingBotMessage>
                  ) : (
                    <>
                      <p>{msg.content}</p>
                      {/* Timestamp */}
                      <p className="text-[9px] mt-1.5 text-white/60 text-right">
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </>
                  )}
                  {/* Timestamp for bot messages (shown by StreamingBotMessage) */}
                  {msg.role === 'bot' && (
                    <p className="text-[9px] mt-1.5 text-slate-400 dark:text-slate-500">
                      {formatTimestamp(msg.timestamp)}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Typing indicator */}
          {isLoading && !streamingMsgId && <TypingIndicator />}

          {/* IRDAI Disclaimer */}
          {messages.length > 1 && !streamingMsgId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 mb-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg"
            >
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-snug">
                ⚠️ <strong>IRDAI Disclaimer:</strong> {IRDAI_MANDATORY_DISCLAIMER}
              </p>
            </motion.div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Reply Carousel — swipeable single-line chips */}
      {!isLoading && messages.length >= 1 && (
        <div className="px-4 sm:px-6 pb-2 shrink-0">
          <QuickReplyCarousel
            replies={currentQuickReplies}
            onReply={handleSuggestion}
            disabled={isLoading || !!streamingMsgId}
            label="Quick Replies"
          />
        </div>
      )}

      {/* Input Area — Rounded full with glass background */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm px-4 sm:px-6 py-3 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Insurance ke baare mein poochiye... (Hindi, English, Hinglish)"
              disabled={isLoading || !!streamingMsgId}
              className="h-11 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus-visible:ring-cyan-500/30 focus-visible:border-cyan-300 text-sm pl-4 pr-0 shadow-sm"
            />
          </div>

          {/* Voice Button */}
          {speechSupported ? (
            <Button
              type="button"
              variant={isRecording ? 'destructive' : 'ghost'}
              size="icon"
              onClick={toggleVoice}
              className={`h-11 w-11 rounded-full shrink-0 transition-all ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/30'
                  : 'hover:bg-cyan-50 hover:text-cyan-600 dark:hover:bg-cyan-950/30'
              }`}
              aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled
              className="h-11 w-11 rounded-full shrink-0 opacity-50"
              aria-label="Voice not supported"
            >
              <MicOff className="w-4 h-4" />
            </Button>
          )}

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading || !!streamingMsgId}
            className="h-11 w-11 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shrink-0 shadow-md shadow-cyan-500/25 disabled:opacity-50 transition-all"
            size="icon"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        {/* Powered by branding */}
        <div className="flex items-center justify-center gap-2 mt-2.5">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <p className="text-center text-[10px] sm:text-xs text-slate-400 font-medium whitespace-nowrap">
            Powered by <span className="text-teal-600 font-semibold">Himanshu Paliwal</span>
          </p>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>

      {/* Human Handoff Dialog */}
      <HumanHandoffDialog
        open={showHandoffDialog}
        onOpenChange={setShowHandoffDialog}
      />

      {/* Callback Request Dialog */}
      <Dialog open={showCallbackDialog} onOpenChange={setShowCallbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Phone className="w-5 h-5 text-teal-600" />
              Callback Request
            </DialogTitle>
            <DialogDescription>
              Apna details daalein, hamari expert team aapko call karegi.
            </DialogDescription>
          </DialogHeader>
          <CallbackRequestForm
            source="chatbot"
            onSuccess={() => {
              setTimeout(() => setShowCallbackDialog(false), 2000);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
