'use client';

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, MicOff, Bot, User, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { type UserProfile, IRDAI_MANDATORY_DISCLAIMER } from '@/lib/insurance-data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface EmbeddedChatBotProps {
  profile?: UserProfile | null;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
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

const QUICK_SUGGESTIONS = [
  'Health insurance kya hai?',
  'Recommended plan batao',
  'Claim kaise file karein?',
  '80D mein tax benefits?',
  'Term insurance kya hota hai?',
];

/**
 * Lightweight markdown-like renderer for bot messages.
 * Supports: **bold**, *italic*, `code`, - lists, numbered lists
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
          <span className="text-indigo-600 dark:text-indigo-400 shrink-0">{ulMatch ? '\u2022' : line.match(/^\d+/)?.[0] + '.'}</span>
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
  // Pattern: **bold**, *italic*, `code`
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }

    if (match[2]) {
      // **bold**
      parts.push(<strong key={`b-${match.index}`} className="font-semibold text-indigo-700 dark:text-indigo-300">{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      parts.push(<em key={`i-${match.index}`} className="text-slate-500 dark:text-slate-400">{match[3]}</em>);
    } else if (match[4]) {
      // `code`
      parts.push(
        <code key={`c-${match.index}`} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">
          {match[4]}
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
// Typing Indicator — Premium
// ---------------------------------------------------------------------------
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-1.5">
          <motion.span
            className="w-2 h-2 bg-indigo-500 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="w-2 h-2 bg-indigo-500 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          />
          <motion.span
            className="w-2 h-2 bg-indigo-500 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmbeddedChatBot Component — Premium Design
// Full-width, prominent, and responsive
// ---------------------------------------------------------------------------
export default function EmbeddedChatBot({ profile }: EmbeddedChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Check Speech API support on mount
  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognitionAPI);
  }, []);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = profile
        ? `Namaste! 👋 Welcome to **InsureGPT**, your AI insurance advisor by Paliwal Secure. I can see you've shared your profile details. How can I help you today?\n\n_Powered by Himanshu Paliwal_`
        : `Namaste! 👋 Welcome to **InsureGPT**, your AI insurance advisor by Paliwal Secure. I can help you understand insurance plans, compare options, and find the right coverage for you. How can I help?\n\n_Powered by Himanshu Paliwal_`;

      setMessages([
        {
          id: generateId(),
          role: 'bot',
          content: greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ---------------------------------------------------------------------------
  // Send message
  // ---------------------------------------------------------------------------
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);

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
          }),
        });

        const data = await res.json();

        if (data.success && data.response) {
          const botMessage: ChatMessage = {
            id: generateId(),
            role: 'bot',
            content: data.response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
        } else {
          const errorMessage: ChatMessage = {
            id: generateId(),
            role: 'bot',
            content:
              "Maafi chahunga, main aapka sawaal process nahi kar paya. Kripya dobara try karein ya apna sawaal alag tarike se poochiye.",
            timestamp: new Date(),
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
  // Quick suggestion click
  // ---------------------------------------------------------------------------
  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  // ---------------------------------------------------------------------------
  // Render — Premium full-width inline chatbot
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full bg-background rounded-3xl shadow-xl border border-indigo-100/50 dark:border-indigo-900/30 overflow-hidden flex flex-col">
      {/* Header — Premium Glassmorphic Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 backdrop-blur-md text-white px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between shrink-0 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full" />
        <div className="absolute top-2 right-20 w-12 h-12 bg-white/5 rounded-full" />

        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
          {/* Bot avatar with live-dot */}
          <div className="live-dot">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg leading-tight">InsureGPT</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-indigo-100">Online • AI Insurance Advisor</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          {profile && (
            <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs hidden sm:inline-flex">
              Personalized
            </Badge>
          )}
          <div className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[10px] sm:text-xs font-medium">IRDAI Compliant</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        className="h-[400px] sm:h-[450px] lg:h-[500px] overflow-y-auto px-4 sm:px-6 py-4 scroll-smooth"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#a5b4fc transparent' }}
      >
        <div className="space-y-1">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-2.5 mb-4 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              {msg.role === 'bot' ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shrink-0 shadow-md shadow-slate-500/20">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Bubble — Premium shadows */}
              <div
                className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-tr-sm shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700'
                }`}
              >
                {msg.role === 'bot' ? (
                  <div className="space-y-1">{renderBotContent(msg.content)}</div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isLoading && <TypingIndicator />}

          {/* IRDAI Disclaimer */}
          {messages.length > 1 && (
            <div className="mt-4 mb-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-snug">
                ⚠️ <strong>IRDAI Disclaimer:</strong> {IRDAI_MANDATORY_DISCLAIMER}
              </p>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Suggestions — Pill-shaped with hover glow */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-4 sm:px-6 pb-3 shrink-0 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <p className="text-xs text-slate-500 font-medium">Try asking:</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestion(suggestion)}
                className="px-3.5 py-1.5 text-xs rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer whitespace-nowrap min-h-[32px]"
              >
                {suggestion}
              </button>
            ))}
          </div>
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
              disabled={isLoading}
              className="h-11 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-300 text-sm pl-4 pr-0 shadow-sm"
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
                  : 'hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/30'
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

          {/* Send Button — btn-ripple */}
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="btn-ripple h-11 w-11 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shrink-0 shadow-md shadow-indigo-500/25 disabled:opacity-50"
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
            Powered by <span className="text-blue-600 font-semibold">Himanshu Paliwal</span>
          </p>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
