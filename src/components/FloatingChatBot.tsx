'use client';

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, X, Bot, User, Sparkles, RotateCcw, ShieldCheck,
  ChevronLeft, ChevronRight, MessageCircle, Zap, Minimize2,
  Mic, MicOff, Volume2, VolumeX, Square, Trash2, Clock, History,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InlineSendStopButton } from '@/components/ui/send-stop-button';
import { useLanguage } from '@/lib/i18n';
import { registerInsureGPTHandlers, closeInsureGPT } from '@/lib/insuregpt-state';
import type { Language } from '@/lib/i18n-strings';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  language: ChatLanguage;
  createdAt: number;
  updatedAt: number;
}

type ChatLanguage = 'hing' | 'en' | 'hi';

// ── Map site Language → internal ChatLanguage ──────────────────────────────
const siteLangToChatLang: Record<Language, ChatLanguage> = {
  hinglish: 'hing',
  en: 'en',
  hi: 'hi',
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CHAT_HISTORY_KEY = 'insuregpt_chat_history';
const MAX_SESSIONS = 20;
const MAX_MESSAGES_PER_SESSION = 100;

// ---------------------------------------------------------------------------
// Language-specific content
// ---------------------------------------------------------------------------
const LANGUAGE_CONFIG: Record<ChatLanguage, {
  welcome: string;
  resetMessage: string;
  quickActions: { label: string; emoji: string }[];
  placeholder: string;
  errorMessage: string;
  connectionError: string;
  thinking: string;
  stopGenerating: string;
  voiceListening: string;
  voiceError: string;
  ttsError: string;
  ttsLoading: string;
  newChat: string;
  deleteChat: string;
  chatHistory: string;
  noHistory: string;
  msgs: string;
  stop: string;
  whatsappExpert: string;
  irdaiPOSP: string;
}> = {
  hing: {
    welcome: 'Namaste! 🙏 Main hoon **InsureGPT** — aapka AI insurance advisor! Health, Life, Motor — koi bhi sawal puchhiye, main madad karunga.',
    resetMessage: 'Chat reset ho gaya! 🔄 Main InsureGPT hoon — aapka AI insurance advisor. Kya jaanna chahiye?',
    quickActions: [
      { emoji: '🏥', label: 'Health Insurance' },
      { emoji: '🚗', label: 'Car Insurance' },
      { emoji: '🛵', label: 'Bike Insurance' },
      { emoji: '🛡️', label: 'Term Plan' },
      { emoji: '📋', label: 'Claim Help' },
      { emoji: '💰', label: 'Tax Saving' },
      { emoji: '📊', label: 'Compare Plans' },
      { emoji: '👨‍👩‍👧', label: 'Family Plans' },
      { emoji: '🏠', label: 'Home Insurance' },
      { emoji: '👴', label: 'Senior Plans' },
    ],
    placeholder: 'Apna sawaal likhiye ya boliye...',
    errorMessage: 'Maafi chahunga, main aapka sawaal process nahi kar paya. Kripya dobara try karein.',
    connectionError: 'Abhi connection mein dikkat aa rahi hai. Apna internet check karein aur dobara try karein.',
    thinking: 'InsureGPT soch raha hai...',
    stopGenerating: 'Ruko',
    voiceListening: 'Sun raha hoon...',
    voiceError: 'Voice sun nahi paya, dobara try karein',
    ttsError: 'Audio nahi bana paya',
    ttsLoading: 'Audio bana raha hoon...',
    newChat: 'Naya Chat',
    deleteChat: 'Delete Karein',
    chatHistory: 'Chat History',
    noHistory: 'Koi chat nahi hai',
    msgs: 'msgs',
    stop: 'Ruko',
    whatsappExpert: 'WhatsApp Expert',
    irdaiPOSP: 'IRDAI Registered POSP',
  },
  en: {
    welcome: 'Hello! 👋 I\'m **InsureGPT** — your AI insurance advisor! I can help you understand insurance, compare plans, and find the right coverage. What would you like to know?',
    resetMessage: 'Chat has been reset! 🔄 I am InsureGPT — your AI insurance advisor. What would you like to know?',
    quickActions: [
      { emoji: '🏥', label: 'Health Insurance' },
      { emoji: '🚗', label: 'Car Insurance' },
      { emoji: '🛵', label: 'Bike Insurance' },
      { emoji: '🛡️', label: 'Term Plan' },
      { emoji: '📋', label: 'Claim Help' },
      { emoji: '💰', label: 'Tax Savings' },
      { emoji: '📊', label: 'Compare Plans' },
      { emoji: '👨‍👩‍👧', label: 'Family Plans' },
      { emoji: '🏠', label: 'Home Insurance' },
      { emoji: '👴', label: 'Senior Plans' },
    ],
    placeholder: 'Type your question or speak...',
    errorMessage: "I'm sorry, I couldn't process your question. Please try again.",
    connectionError: "There's a connection issue right now. Please check your internet and try again.",
    thinking: 'InsureGPT is thinking...',
    stopGenerating: 'Stop',
    voiceListening: 'Listening...',
    voiceError: 'Could not hear you, please try again',
    ttsError: 'Could not generate audio',
    ttsLoading: 'Generating audio...',
    newChat: 'New Chat',
    deleteChat: 'Delete',
    chatHistory: 'Chat History',
    noHistory: 'No chat history',
    msgs: 'msgs',
    stop: 'Stop',
    whatsappExpert: 'WhatsApp Expert',
    irdaiPOSP: 'IRDAI Registered POSP',
  },
  hi: {
    welcome: 'नमस्ते! 🙏 मैं हूं **InsureGPT** — आपका AI बीमा सलाहकार! स्वास्थ्य, जीवन, मोटर — कोई भी प्रश्न पूछिए, मैं मदद करूंगा।',
    resetMessage: 'चैट रीसेट हो गई! 🔄 मैं InsureGPT हूं — आपका AI बीमा सलाहकार। आप क्या जानना चाहेंगे?',
    quickActions: [
      { emoji: '🏥', label: 'स्वास्थ्य बीमा' },
      { emoji: '🚗', label: 'कार बीमा' },
      { emoji: '🛵', label: 'बाइक बीमा' },
      { emoji: '🛡️', label: 'टर्म प्लान' },
      { emoji: '📋', label: 'क्लेम सहायता' },
      { emoji: '💰', label: 'कर बचत' },
      { emoji: '📊', label: 'योजनाओं की तुलना' },
      { emoji: '👨‍👩‍👧', label: 'परिवार योजनाएं' },
      { emoji: '🏠', label: 'गृह बीमा' },
      { emoji: '👴', label: 'वरिष्ठ योजना' },
    ],
    placeholder: 'अपना प्रश्न लिखें या बोलें...',
    errorMessage: 'क्षमा करें, मैं आपका प्रश्न प्रोसेस नहीं कर पाया। कृपया पुनः प्रयास करें।',
    connectionError: 'अभी कनेक्शन में समस्या है। अपना इंटरनेट जांचें और पुनः प्रयास करें।',
    thinking: 'InsureGPT सोच रहा है...',
    stopGenerating: 'रुकें',
    voiceListening: 'सुन रहा हूं...',
    voiceError: 'आवाज़ सुन नहीं पाया, दोबारा प्रयास करें',
    ttsError: 'ऑडियो नहीं बना पाया',
    ttsLoading: 'ऑडियो बना रहा हूं...',
    newChat: 'नई चैट',
    deleteChat: 'हटाएं',
    chatHistory: 'चैट इतिहास',
    noHistory: 'कोई चैट नहीं है',
    msgs: 'संदेश',
    stop: 'रुकें',
    whatsappExpert: 'WhatsApp विशेषज्ञ',
    irdaiPOSP: 'IRDAI पंजीकृत POSP',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ---------------------------------------------------------------------------
// Chat History Management (localStorage)
// ---------------------------------------------------------------------------
function loadSessions(): ChatSession[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]): void {
  try {
    if (typeof window === 'undefined') return;
    // Keep only last MAX_SESSIONS
    const trimmed = sessions.slice(-MAX_SESSIONS);
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full or unavailable
  }
}

function createSession(language: ChatLanguage): ChatSession {
  const id = generateId();
  const welcomeMsg = LANGUAGE_CONFIG[language].welcome;
  return {
    id,
    title: LANGUAGE_CONFIG[language].newChat,
    messages: [{
      id: generateId(),
      role: 'bot',
      content: welcomeMsg,
      timestamp: Date.now(),
    }],
    language,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// ---------------------------------------------------------------------------
// Lightweight markdown renderer (safe — React elements, no dangerouslySetInnerHTML)
// ---------------------------------------------------------------------------
function renderInlineMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    if (match[2]) {
      parts.push(<strong key={`b-${match.index}`} className="font-semibold text-primary">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={`i-${match.index}`} className="text-muted-foreground">{match[3]}</em>);
    } else if (match[4]) {
      parts.push(
        <code key={`c-${match.index}`} className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono border border-border">
          {match[4]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [text];
}

function renderBotContent(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    if (line.trim() === '') {
      nodes.push(<br key={`br-${lineIdx}`} />);
      return;
    }

    if (line.trim() === '---') {
      nodes.push(<hr key={`hr-${lineIdx}`} className="border-border my-2" />);
      return;
    }

    const ulMatch = line.match(/^[\-\*]\s+(.*)/);
    const olMatch = line.match(/^\d+\.\s+(.*)/);

    if (ulMatch || olMatch) {
      const text = ulMatch ? ulMatch[1] : (olMatch as RegExpMatchArray)[1];
      nodes.push(
        <div key={`li-${lineIdx}`} className="flex gap-2 ml-1">
          <span className="text-primary shrink-0 mt-0.5">{ulMatch ? '\u2022' : line.match(/^\d+/)?.[0] + '.'}</span>
          <span>{renderInlineMarkdown(text)}</span>
        </div>
      );
      return;
    }

    nodes.push(<span key={`line-${lineIdx}`}>{renderInlineMarkdown(line)}</span>);

    if (lineIdx < lines.length - 1) {
      nodes.push(<br key={`br-after-${lineIdx}`} />);
    }
  });

  return nodes;
}

// ---------------------------------------------------------------------------
// Streaming Bot Message
// ---------------------------------------------------------------------------
function StreamingMessage({
  content,
  isStreaming,
  onStreamComplete,
}: {
  content: string;
  isStreaming: boolean;
  onStreamComplete: () => void;
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
      <div className="space-y-0.5 text-[13.5px] leading-relaxed text-foreground">{renderBotContent(displayedContent)}</div>
      {stillStreaming && (
        <motion.span
          className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle rounded-full"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Typing Indicator — Pulse avatar with dots
// ---------------------------------------------------------------------------
function TypingIndicator({ thinkingText }: { thinkingText: string }) {
  return (
    <div className="flex items-start gap-3 mb-3">
      <motion.div
        className="w-8 h-8 rounded-full bg-[#2563EB] dark:bg-[#E8C872] flex items-center justify-center shrink-0 mt-0.5 shadow-lg ring-1 ring-[#2563EB]/10 dark:ring-[#E8C872]/10"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Bot className="w-4 h-4 text-white dark:text-[#0F172A]" />
      </motion.div>
      <div className="bg-[#F8FAFC] dark:bg-[#1E293B] rounded-2xl rounded-tl-sm px-4 py-3 border border-[#E2E8F0] dark:border-white/8 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#2563EB]/70 dark:bg-[#60A5FA]/70"
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.15, 0.7] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#2563EB]/70 dark:text-[#60A5FA]/70 font-medium">{thinkingText}</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick Reply Pills Carousel
// ---------------------------------------------------------------------------
function QuickReplyCarousel({
  actions,
  onReply,
  disabled,
}: {
  actions: { emoji: string; label: string }[];
  onReply: (label: string) => void;
  disabled: boolean;
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
  }, [checkScroll]);

  useEffect(() => {
    setTimeout(checkScroll, 100);
  }, [actions, checkScroll]);

  const scrollBy = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -120 : 120, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scrollBy('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-card/80 border border-border flex items-center justify-center hover:bg-primary/20 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-3 h-3 text-primary" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-1.5 overflow-x-auto pb-0.5"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => onReply(action.label)}
            disabled={disabled}
            className="badge-premium-blue
                       hover:scale-105 active:scale-95 cursor-pointer
                       transition-transform duration-200 shrink-0
                       disabled:opacity-40 disabled:cursor-not-allowed
                       whitespace-nowrap"
          >
            <span className="text-sm">{action.emoji}</span>
            {action.label}
          </button>
        ))}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scrollBy('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-card/80 border border-border flex items-center justify-center hover:bg-primary/20 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-3 h-3 text-primary" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat History Sidebar
// ---------------------------------------------------------------------------
function ChatHistorySidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
  language,
  onClose,
}: {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onNewChat: () => void;
  language: ChatLanguage;
  onClose: () => void;
}) {
  const langConfig = LANGUAGE_CONFIG[language];

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute inset-0 z-50 flex flex-col bg-card border-r border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">{langConfig.chatHistory}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 py-2">
        <Button
          onClick={onNewChat}
          className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold rounded-lg"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          {langConfig.newChat}
        </Button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">{langConfig.noHistory}</p>
          </div>
        ) : (
          sessions.slice().reverse().map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                session.id === currentSessionId
                  ? 'bg-primary/15 border border-primary/30'
                  : 'hover:bg-muted border border-transparent'
              }`}
              onClick={() => onSelectSession(session.id)}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${
                  session.id === currentSessionId ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {session.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatTimestamp(session.updatedAt)}
                  {' · '}
                  {session.messages.length - 1} {LANGUAGE_CONFIG[session.language || language].msgs}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="h-6 w-6 rounded-full text-muted-foreground/20 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// FloatingChatBot Component — World-Class AI Chat Design
// ---------------------------------------------------------------------------
export function FloatingChatBot({ profile }: { profile?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [language, setLanguage] = useState<ChatLanguage>('hing');
  const { t, language: siteLanguage } = useLanguage();

  // Chat state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Streaming state
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);

  // Voice state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // TTS state
  const [playingTTSId, setPlayingTTSId] = useState<string | null>(null);
  const [ttsLoadingId, setTtsLoadingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Chat history sidebar
  const [showHistory, setShowHistory] = useState(false);

  // ── StickyMobileCTA visibility (scroll > 400px on mobile) ────────────
  const [stickyCTAVisible, setStickyCTAVisible] = useState(false);

  // ── Mobile viewport detection ───────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false);

  // ── Sidebar / Sheet open detection ───────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const langConfig = LANGUAGE_CONFIG[language];

  // Current session messages
  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  // Callback when streaming completes
  const handleStreamComplete = useCallback(() => {
    setStreamingMsgId(null);
  }, []);

  // ── Sync chat language with site language ──────────────────────────
  // When site language changes, update the chat language to match.
  // This ensures the chat defaults to the correct language on first load
  // and stays in sync when the user changes site language.
  const siteLangRef = useRef<Language | null>(null);
  useEffect(() => {
    const chatLang = siteLangToChatLang[siteLanguage];
    // Only sync if site language actually changed (avoid loops)
    if (siteLangRef.current !== siteLanguage) {
      siteLangRef.current = siteLanguage;
      setLanguage(chatLang);
    }
  }, [siteLanguage]);

  // ── Load sessions from localStorage on mount ──────────────────────────
  useEffect(() => {
    const loaded = loadSessions();
    if (loaded.length > 0) {
      setSessions(loaded);
      setCurrentSessionId(loaded[loaded.length - 1].id);
      if (loaded[loaded.length - 1].language) {
        setLanguage(loaded[loaded.length - 1].language);
      }
    }
  }, []);

  // ── Save sessions to localStorage when they change ────────────────────
  useEffect(() => {
    if (sessions.length > 0) {
      saveSessions(sessions);
    }
  }, [sessions]);

  // Welcome tooltip: show after 3 seconds, auto-dismiss after 6 seconds
  useEffect(() => {
    if (isOpen || tooltipDismissed) return;
    const showTimer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(showTimer);
  }, [isOpen, tooltipDismissed]);

  useEffect(() => {
    if (!showTooltip || tooltipDismissed) return;
    const dismissTimer = setTimeout(() => {
      setShowTooltip(false);
      setTooltipDismissed(true);
    }, 6000);
    return () => clearTimeout(dismissTimer);
  }, [showTooltip, tooltipDismissed]);

  // Listen for InsureGPT open/close via global state + custom events
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  // ── Detect StickyMobileCTA visibility (appears after scroll > 400px) ─
  useEffect(() => {
    const handleScroll = () => {
      setStickyCTAVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Detect mobile viewport (< md breakpoint = 768px) ──────────────────
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ── On mobile, hide floating button when StickyMobileCTA is visible ──
  const hideFloatingButton = isMobile && stickyCTAVisible;

  // ── Detect sidebar/sheet open state via MutationObserver ─────────────
  // The shadcn Sheet uses [data-state="open"] on overlay & content.
  // When a sheet is open, we hide the floating button to prevent overlap.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkForOpenSheet = () => {
      // Check for shadcn Sheet overlays, sheet content, dialog modals,
      // and any generic [data-state="open"] elements (drawers, popovers, etc.)
      const openSheet =
        document.querySelector('[data-state="open"][data-slot="sheet-overlay"]') ||
        document.querySelector('[data-state="open"][data-slot="sheet-content"]') ||
        document.querySelector('[role="dialog"][data-state="open"]') ||
        document.querySelector('.sheet-overlay') ||
        document.querySelector('[data-state="open"]');
      setSidebarOpen(!!openSheet);
    };

    const observer = new MutationObserver(() => {
      checkForOpenSheet();
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-state', 'class'],
    });

    // Also listen for the custom sidebar-open/close events (for non-Sheet sidebars)
    const handleSidebarOpen = () => setSidebarOpen(true);
    const handleSidebarClose = () => setSidebarOpen(false);
    window.addEventListener('sidebar-open', handleSidebarOpen);
    window.addEventListener('sidebar-close', handleSidebarClose);

    checkForOpenSheet(); // initial check

    return () => {
      observer.disconnect();
      window.removeEventListener('sidebar-open', handleSidebarOpen);
      window.removeEventListener('sidebar-close', handleSidebarClose);
    };
  }, []);

  // Register global handlers so header button can open the chat
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    const handleClose = () => {
      setIsOpen(false);
    };

    // Register with the global bridge
    registerInsureGPTHandlers(handleOpen, handleClose);

    // Also keep custom event listeners for backward compatibility
    window.addEventListener('open-insuregpt', handleOpen);
    window.addEventListener('close-insuregpt', handleClose);

    return () => {
      window.removeEventListener('open-insuregpt', handleOpen);
      window.removeEventListener('close-insuregpt', handleClose);
    };
  }, []);

  // Initial session if none
  useEffect(() => {
    if (isOpen && !isMinimized && sessions.length === 0) {
      const session = createSession(language);
      setSessions([session]);
      setCurrentSessionId(session.id);
    }
  }, [isOpen, isMinimized, sessions.length, language]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 300);
    }
  }, [isOpen, isMinimized]);

  // ── Stop generating ─────────────────────────────────────────────────
  const handleStopGenerating = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsLoading(false);
    setStreamingMsgId(null);
  }, [abortController]);

  // ── Update session helper ──────────────────────────────────────────
  const updateSession = useCallback((sessionId: string, updater: (session: ChatSession) => ChatSession) => {
    setSessions((prev) => prev.map((s) => s.id === sessionId ? updater(s) : s));
  }, []);

  // ── Send message via /api/chat ──────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      setStreamingMsgId(null);

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      };

      // Add user message to current session
      const updatedSessionId = currentSessionId;
      updateSession(updatedSessionId, (s) => {
        const firstUserMsg = s.messages.filter((m) => m.role === 'user').length === 0;
        const newTitle = firstUserMsg ? text.trim().slice(0, 40) + (text.trim().length > 40 ? '...' : '') : s.title;
        return {
          ...s,
          title: newTitle,
          messages: [...s.messages, userMessage].slice(-MAX_MESSAGES_PER_SESSION),
          updatedAt: Date.now(),
        };
      });

      setInputValue('');
      setIsLoading(true);

      // Create abort controller
      const controller = new AbortController();
      setAbortController(controller);

      try {
        const history = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            profile: profile ?? undefined,
            history,
            language,
          }),
          signal: controller.signal,
        });

        const data = await res.json();

        if (data.success && data.response) {
          const botMsgId = generateId();
          const botMessage: ChatMessage = {
            id: botMsgId,
            role: 'bot',
            content: data.response,
            timestamp: Date.now(),
          };
          updateSession(updatedSessionId, (s) => ({
            ...s,
            messages: [...s.messages, botMessage].slice(-MAX_MESSAGES_PER_SESSION),
            updatedAt: Date.now(),
          }));
          setStreamingMsgId(botMsgId);
        } else {
          const errorMessage: ChatMessage = {
            id: generateId(),
            role: 'bot',
            content: langConfig.errorMessage,
            timestamp: Date.now(),
          };
          updateSession(updatedSessionId, (s) => ({
            ...s,
            messages: [...s.messages, errorMessage],
            updatedAt: Date.now(),
          }));
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          // User stopped generation
        } else {
          const errorMessage: ChatMessage = {
            id: generateId(),
            role: 'bot',
            content: langConfig.connectionError,
            timestamp: Date.now(),
          };
          updateSession(updatedSessionId, (s) => ({
            ...s,
            messages: [...s.messages, errorMessage],
            updatedAt: Date.now(),
          }));
        }
      } finally {
        setIsLoading(false);
        setAbortController(null);
      }
    },
    [isLoading, messages, profile, language, langConfig, currentSessionId, updateSession]
  );

  // ── Ref for sendMessage to avoid circular dependency with voice input ──
  const sendMessageRef = useRef<(text: string) => void>(() => {});

  // Keep ref in sync with latest sendMessage
  sendMessageRef.current = sendMessage;

  // ── Voice Input (ASR) ──────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    try {
      // Check if MediaRecorder is available
      if (typeof MediaRecorder === 'undefined') {
        alert('Voice input is not supported in this browser. Please try Chrome or Edge.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      // Determine best supported MIME type
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
            ? 'audio/mp4'
            : '';

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onerror = () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        setRecordingDuration(0);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        setRecordingDuration(0);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }

        if (chunks.length === 0) return;

        const audioBlob = new Blob(chunks, { type: mediaRecorder.mimeType || 'audio/webm' });

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          if (!base64Audio) return;

          try {
            const res = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audio: base64Audio }),
            });
            const data = await res.json();
            if (data.success && data.text) {
              setInputValue(data.text);
              // Auto-send after voice input via ref (avoids circular dep)
              sendMessageRef.current(data.text);
            } else {
              setInputValue('');
            }
          } catch {
            setInputValue('');
          }
        };
        reader.onerror = () => {
          setIsRecording(false);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250); // Collect data every 250ms for better reliability
      setIsRecording(true);
      setRecordingDuration(0);

      // Start recording timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 10) {
            // Auto-stop after 10 seconds
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      setIsRecording(false);
      alert('Could not access microphone. Please allow microphone permission and try again.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // ── TTS (Text-to-Speech) ──────────────────────────────────────────
  const playTTS = useCallback(async (msgId: string, text: string) => {
    // If already playing this message, stop it
    if (playingTTSId === msgId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingTTSId(null);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setTtsLoadingId(msgId);
    setPlayingTTSId(null);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'tongtong', speed: 1.0 }),
      });

      if (!res.ok) throw new Error('TTS failed');

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      setTtsLoadingId(null);
      setPlayingTTSId(msgId);

      audio.onended = () => {
        setPlayingTTSId(null);
        audioRef.current = null;
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setPlayingTTSId(null);
        setTtsLoadingId(null);
        audioRef.current = null;
      };

      await audio.play();
    } catch {
      setTtsLoadingId(null);
      setPlayingTTSId(null);
    }
  }, [playingTTSId]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Form submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Quick action click
  const handleQuickAction = (label: string) => {
    sendMessage(label);
  };

  // ── New chat ──────────────────────────────────────────────────────
  const handleNewChat = useCallback(() => {
    const session = createSession(language);
    setSessions((prev) => [...prev, session]);
    setCurrentSessionId(session.id);
    setInputValue('');
    setIsLoading(false);
    setStreamingMsgId(null);
    setShowHistory(false);
    inputRef.current?.focus({ preventScroll: true });
  }, [language]);

  // ── Select session ────────────────────────────────────────────────
  const handleSelectSession = useCallback((id: string) => {
    setCurrentSessionId(id);
    const session = sessions.find((s) => s.id === id);
    if (session?.language) setLanguage(session.language);
    setInputValue('');
    setIsLoading(false);
    setStreamingMsgId(null);
    setShowHistory(false);
  }, [sessions]);

  // ── Delete session ────────────────────────────────────────────────
  const handleDeleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (id === currentSessionId) {
        if (filtered.length > 0) {
          setCurrentSessionId(filtered[filtered.length - 1].id);
        } else {
          const newSession = createSession(language);
          setCurrentSessionId(newSession.id);
          return [newSession];
        }
      }
      return filtered;
    });
  }, [currentSessionId, language]);

  // Language change handler — cycles hing → hi → en → hing
  const handleLanguageToggle = useCallback(() => {
    const nextLang: Record<ChatLanguage, ChatLanguage> = { hing: 'hi', hi: 'en', en: 'hing' };
    const newLang = nextLang[language];
    setLanguage(newLang);

    // Update session language
    if (currentSessionId) {
      updateSession(currentSessionId, (s) => ({
        ...s,
        language: newLang,
        // Add a welcome message in the new language
        messages: [
          ...s.messages,
          {
            id: generateId(),
            role: 'bot' as const,
            content: LANGUAGE_CONFIG[newLang].welcome,
            timestamp: Date.now(),
          },
        ].slice(-MAX_MESSAGES_PER_SESSION),
        updatedAt: Date.now(),
      }));
    }
  }, [language, currentSessionId, updateSession]);

  // Dismiss tooltip manually
  const dismissTooltip = () => {
    setShowTooltip(false);
    setTooltipDismissed(true);
  };

  // Open chat handler
  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  return (
    <>
      {/* ── Floating InsureGPT Button — visible when chat is closed ──────────── */}
      <AnimatePresence>
        {!isOpen && !sidebarOpen && !hideFloatingButton && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed right-4 sm:right-6 z-[45] md:z-[60] transition-bottom duration-300"
            style={{
              bottom: stickyCTAVisible ? '88px' : '24px',
            }}
          >
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.button
              onClick={openChat}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-[#E8C872] dark:to-[#D4A853] text-white dark:text-[#0F172A] shadow-2xl cursor-pointer flex items-center justify-center gap-1.5 ring-1 ring-white/10 dark:ring-[#E8C872]/20"
              style={{
                boxShadow: '0 8px 32px -4px rgba(15, 23, 42, 0.35), 0 0 48px -8px rgba(15, 23, 42, 0.12)',
              }}
              aria-label="Open InsureGPT AI Chat"
            >
              <Brain className="w-6 h-6 md:w-7 md:h-7 drop-shadow-sm" />
            </motion.button>
            {/* Label */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md glass-premium text-[10px] font-bold text-[#0F172A] dark:text-[#E8C872] tracking-wider shadow-lg shadow-black/10">
              InsureGPT
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Minimized Bar ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && isMinimized && !sidebarOpen && !hideFloatingButton && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed left-1/2 -translate-x-1/2 z-[45] md:z-[70] flex items-center gap-2 bg-gradient-to-r from-[#0F172A] to-[#1E293B] dark:from-[#E8C872] dark:to-[#D4A853] text-white dark:text-[#0F172A] px-4 py-2.5 rounded-full shadow-xl cursor-pointer transition-bottom duration-300 ring-1 ring-white/10 dark:ring-[#E8C872]/20"
            style={{
              bottom: stickyCTAVisible ? '88px' : '24px',
            }}
            onClick={() => setIsMinimized(false)}
          >
            <div className="w-7 h-7 rounded-full bg-white/10 dark:bg-[#0F172A]/10 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold">InsureGPT</span>
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Window ────────────────────────────────────────────────── */}
      {isOpen && !isMinimized && (
        <>
          {/* Backdrop overlay for mobile */}
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[69] bg-black/60 md:hidden"
            onClick={() => { setIsOpen(false); closeInsureGPT(); }}
          />
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed inset-0 md:inset-auto md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[70]
                       w-full md:w-[440px]
                       h-full md:h-[660px]
                       md:rounded-3xl
                       flex flex-col overflow-hidden rounded-2xl
                       glass-premium
                       shadow-[0_24px_80px_-12px_rgba(0,0,0,0.4),0_0_1px_0_rgba(255,255,255,0.05)_inset]"
          >
            {/* ── Chat Header ── */}
            <div className="relative shrink-0 bg-gradient-to-r from-[#0F172A] to-[#1E293B] dark:from-[#E8C872]/10 dark:to-[#D4A853]/5 border-b border-[#E2E8F0]/10 dark:border-white/8">

              <div className="relative z-10 px-4 py-3 flex items-center justify-between">
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-3">
                  {/* History Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHistory(true)}
                    className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 shrink-0 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] dark:hover:bg-white/10"
                    aria-label="Chat history"
                  >
                    <History className="w-3.5 h-3.5" />
                  </Button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#2563EB] dark:bg-[#E8C872] flex items-center justify-center shadow-lg ring-1 ring-white/10 dark:ring-[#E8C872]/20">
                      <Brain className="w-5 h-5 text-white dark:text-[#0F172A] drop-shadow-sm" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0F172A] dark:border-[#1E293B] ring-1 ring-emerald-400/30" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base leading-tight text-white dark:text-[#F8FAFC] whitespace-nowrap">InsureGPT</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                      <span className="text-[10px] text-emerald-400/80 font-medium whitespace-nowrap">{t('chatBot.onlineLabel') || 'Online'}</span>
                      <Sparkles className="w-2.5 h-2.5 text-[#E8C872] dark:text-[#D4A853] shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-1">
                  {/* Language Toggle — Compact Globe button with badge */}
                  <button
                    onClick={handleLanguageToggle}
                    className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1 mr-1 border border-white/10 hover:bg-[#E8C872]/20 hover:border-[#E8C872]/30 transition-all duration-200 dark:bg-white/5 dark:border-white/10 dark:hover:bg-[#E8C872]/15 dark:hover:border-[#E8C872]/30"
                    aria-label={`Switch language (current: ${language === 'hing' ? 'Hinglish' : language === 'en' ? 'English' : 'Hindi'})`}
                    title={language === 'hing' ? 'Hinglish — Click for Hindi' : language === 'en' ? 'English — Click for Hinglish' : 'हिन्दी — Click for English'}
                  >
                    <Globe className="w-3 h-3 text-white/70 dark:text-[#94A3B8]" />
                    <span className="text-[10px] font-bold text-[#E8C872] dark:text-[#E8C872]">
                      {language === 'hing' ? 'हिं' : language === 'hi' ? 'हि' : 'EN'}
                    </span>
                  </button>
                  {/* IRDAI badge */}
                  <div className="hidden sm:flex items-center badge-premium-gold">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>IRDAI</span>
                  </div>
                  {/* Minimize */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMinimized(true)}
                    className="h-7 w-7 rounded-full text-white/50 hover:text-white hover:bg-white/10 shrink-0 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] dark:hover:bg-white/10"
                    aria-label="Minimize chat"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </Button>
                  {/* New Chat */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNewChat}
                    className="h-7 w-7 rounded-full text-white/50 hover:text-[#E8C872] hover:bg-[#E8C872]/10 shrink-0 dark:text-[#94A3B8] dark:hover:text-[#E8C872] dark:hover:bg-[#E8C872]/10"
                    aria-label="New chat"
                  >
                    <Sparkles className="w-3 h-3" />
                  </Button>
                  {/* Close */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsOpen(false);
                      closeInsureGPT();
                    }}
                    className="h-7 w-7 rounded-full text-white/50 hover:text-white hover:bg-white/10 shrink-0 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] dark:hover:bg-white/10"
                    aria-label="Close chat"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>


            </div>

            {/* ── Quick Action Pills ── */}
            <div className="px-3 py-2.5 border-b border-[#E2E8F0]/30 dark:border-white/8 shrink-0 bg-[#F8FAFC]/80 dark:bg-[#0F172A]/50">
              <QuickReplyCarousel
                actions={langConfig.quickActions}
                onReply={handleQuickAction}
                disabled={isLoading || !!streamingMsgId}
              />
            </div>

            {/* ── Messages Area ── */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-4 py-5 scroll-smooth premium-scrollbar bg-white dark:bg-[#0F172A]"
            >
              <div className="space-y-0">
                {messages.map((msg) => {
                  const isCurrentlyStreaming = msg.id === streamingMsgId;
                  const isPlayingTTS = playingTTSId === msg.id;
                  const isLoadingTTS = ttsLoadingId === msg.id;

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className={`flex items-start gap-2.5 mb-3 ${
                        msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      {msg.role === 'bot' ? (
                        <motion.div
                          className="w-8 h-8 rounded-full bg-[#2563EB] dark:bg-[#E8C872] flex items-center justify-center shrink-0 mt-0.5 shadow-lg ring-1 ring-[#2563EB]/10 dark:ring-[#E8C872]/10"
                          animate={isCurrentlyStreaming ? { scale: [1, 1.06, 1] } : {}}
                          transition={isCurrentlyStreaming ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                        >
                          <Bot className="w-4 h-4 text-white dark:text-[#0F172A] drop-shadow-sm" />
                        </motion.div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#0F172A] dark:bg-[#E8C872] flex items-center justify-center shrink-0 mt-0.5 shadow-sm ring-1 ring-[#0F172A]/10 dark:ring-[#E8C872]/10">
                          <User className="w-4 h-4 text-white dark:text-[#0F172A]" />
                        </div>
                      )}

                      {/* Bubble */}
                      <div
                        className={`max-w-[80%] relative break-words ${
                          msg.role === 'user'
                            ? 'bg-[#0F172A] dark:bg-[#E8C872] text-white dark:text-[#0F172A] rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg ring-1 ring-[#0F172A]/10 dark:ring-[#E8C872]/10'
                            : 'bg-[#F8FAFC] dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] rounded-2xl rounded-tl-sm px-4 py-3 border border-[#E2E8F0] dark:border-white/8 shadow-sm'
                        }`}
                      >
                        {msg.role === 'bot' ? (
                          <>
                            <StreamingMessage
                              key={msg.id}
                              content={msg.content}
                              isStreaming={isCurrentlyStreaming}
                              onStreamComplete={handleStreamComplete}
                            />
                            {/* TTS Play Button + Timestamp — only show when not streaming */}
                            {!isCurrentlyStreaming && (
                              <div className="flex items-center justify-between mt-1.5">
                                <p className="text-[9px] text-[#94A3B8] dark:text-[#64748B]">
                                  {formatTimestamp(msg.timestamp)}
                                </p>
                                {/* TTS / Audio button */}
                                <button
                                  onClick={() => playTTS(msg.id, msg.content)}
                                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium text-[#2563EB]/60 dark:text-[#60A5FA]/60 hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-[#2563EB]/10 dark:hover:bg-[#3B82F6]/10 transition-all duration-200"
                                  aria-label={isPlayingTTS ? 'Stop audio' : 'Play audio'}
                                  disabled={isLoadingTTS}
                                >
                                  {isLoadingTTS ? (
                                    <>
                                      <motion.div
                                        className="w-3 h-3 border border-[#2563EB]/40 border-t-[#2563EB] dark:border-[#3B82F6]/40 dark:border-t-[#3B82F6] rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                      />
                                    </>
                                  ) : isPlayingTTS ? (
                                    <VolumeX className="w-3 h-3" />
                                  ) : (
                                    <Volume2 className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="text-[13.5px] leading-relaxed font-medium">{msg.content}</p>
                            <p className="text-[9px] mt-1 text-white/40 dark:text-[#0F172A]/40 text-right">
                              {formatTimestamp(msg.timestamp)}
                            </p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing indicator */}
                {isLoading && !streamingMsgId && (
                  <TypingIndicator thinkingText={langConfig.thinking} />
                )}

                {/* Stop Generating button */}
                {isLoading && (
                  <div className="flex justify-center mt-2">
                    <Button
                      onClick={handleStopGenerating}
                      className="h-7 px-3 rounded-full bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-white/10 text-[#2563EB] dark:text-[#60A5FA] text-[11px] font-medium hover:bg-[#2563EB]/10 dark:hover:bg-[#3B82F6]/10 hover:border-[#2563EB]/40 dark:hover:border-[#3B82F6]/40 transition-all"
                    >
                      <Square className="w-2.5 h-2.5 mr-1.5 fill-current" />
                      {langConfig.stopGenerating}
                    </Button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ── Voice Recording Indicator ── */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-2 bg-red-500/5 dark:bg-red-500/10 border-t border-[#E2E8F0] dark:border-white/8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-3 h-3 rounded-full bg-red-500"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-xs text-[#0F172A] dark:text-[#F8FAFC] font-medium">{langConfig.voiceListening}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#94A3B8] font-mono">{recordingDuration}s / 10s</span>
                      <Button
                        onClick={stopRecording}
                        className="h-6 px-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-medium hover:bg-red-500/30"
                      >
                        <Square className="w-2 h-2 mr-1 fill-current" />
                        {langConfig.stop}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input Area ── */}
            <div className="px-3 py-3 border-t border-[#E2E8F0] dark:border-white/8 bg-white dark:bg-[#0F172A] shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                {/* Voice Input Button */}
                <Button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`h-10 w-10 rounded-full shrink-0 transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                      : 'bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-white/10 text-[#64748B] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-[#60A5FA] hover:bg-[#2563EB]/5 dark:hover:bg-[#3B82F6]/10 hover:border-[#2563EB]/30 dark:hover:border-[#3B82F6]/30'
                  }`}
                  disabled={isLoading || !!streamingMsgId}
                  aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>

                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={langConfig.placeholder}
                  disabled={isLoading || !!streamingMsgId}
                  className="input-premium flex-1 h-10 text-sm rounded-full px-4"
                />
                <InlineSendStopButton
                  isLoading={isLoading || !!streamingMsgId}
                  onStop={handleStopGenerating}
                  disabled={!inputValue.trim() && !isLoading && !streamingMsgId}
                  className="disabled:opacity-40"
                  aria-label={isLoading || !!streamingMsgId ? 'Stop generating' : 'Send message'}
                />
              </form>
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="badge-premium-slate" style={{ fontSize: '9px', padding: '0.125rem 0.5rem' }}>
                  <ShieldCheck className="w-2.5 h-2.5" />
                  {langConfig.irdaiPOSP}
                </span>
                <span className="text-[9px] text-[#94A3B8]">|</span>
                <a
                  href="https://wa.me/919257877312"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge-premium-green" style={{ fontSize: '9px', padding: '0.125rem 0.5rem', textDecoration: 'none' }}
                >
                  <MessageCircle className="w-2.5 h-2.5" />
                  {langConfig.whatsappExpert}
                </a>
              </div>
            </div>

            {/* ── Chat History Sidebar ── */}
            <AnimatePresence>
              {showHistory && (
                <ChatHistorySidebar
                  sessions={sessions}
                  currentSessionId={currentSessionId}
                  onSelectSession={handleSelectSession}
                  onDeleteSession={handleDeleteSession}
                  onNewChat={handleNewChat}
                  language={language}
                  onClose={() => setShowHistory(false)}
                />
              )}
            </AnimatePresence>
          </motion.div>
          </>
        )}
    </>
  );
}

export default FloatingChatBot;
