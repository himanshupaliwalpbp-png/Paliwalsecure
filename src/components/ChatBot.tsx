'use client';

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic, MicOff, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { type UserProfile, IRDAI_MANDATORY_DISCLAIMER } from '@/lib/insurance-data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ChatBotProps {
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
  'What is health insurance?',
  'Recommend me a plan',
  'How to file a claim?',
  'Tax benefits under 80D?',
  'What is term insurance?',
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

    // Handle list items
    const ulMatch = line.match(/^[\-\*]\s+(.*)/);
    const olMatch = line.match(/^\d+\.\s+(.*)/);

    if (ulMatch || olMatch) {
      const text = ulMatch ? ulMatch[1] : (olMatch as RegExpMatchArray)[1];
      nodes.push(
        <div key={`li-${lineIdx}`} className="flex gap-2 ml-1">
          <span className="text-emerald-600 shrink-0">{ulMatch ? '\u2022' : line.match(/^\d+/)?.[0] + '.'}</span>
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
      parts.push(<strong key={`b-${match.index}`} className="font-semibold text-emerald-700">{match[2]}</strong>);
    } else if (match[3]) {
      // *italic*
      parts.push(<em key={`i-${match.index}`}>{match[3]}</em>);
    } else if (match[4]) {
      // `code`
      parts.push(
        <code key={`c-${match.index}`} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
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
// Typing Indicator
// ---------------------------------------------------------------------------
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 max-w-[75%]">
        <div className="flex items-center gap-1.5">
          <motion.span
            className="w-2 h-2 bg-emerald-500 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="w-2 h-2 bg-emerald-500 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          />
          <motion.span
            className="w-2 h-2 bg-emerald-500 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ChatBot Component
// ---------------------------------------------------------------------------
export default function ChatBot({ profile }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
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
        ? `Namaste! 👋 Welcome to **InsureGPT**, your AI insurance advisor. I can see you've shared your profile details. How can I help you today?\n\n_Powered by Himanshu Paliwal_`
        : `Namaste! 👋 Welcome to **InsureGPT**, your AI insurance advisor. I can help you understand insurance plans, compare options, and find the right coverage for you. How can I help?\n\n_Powered by Himanshu Paliwal_`;

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
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-slot="scroll-area-viewport"]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

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
              "I'm sorry, I couldn't process your request. Please try again or rephrase your question.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch {
        const errorMessage: ChatMessage = {
          id: generateId(),
          role: 'bot',
          content:
            "I'm having trouble connecting right now. Please check your internet connection and try again.",
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
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3">
            {/* InsureGPT Label Badge - visible on sm+ screens */}
            <motion.div
              key="chat-label"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="hidden sm:flex items-center"
            >
              <span className="bg-white shadow-md rounded-full px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                InsureGPT
              </span>
            </motion.div>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  key="chat-fab"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  onClick={() => setIsOpen(true)}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center group cursor-pointer relative"
                  aria-label="Open chat"
                >
                  <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  {/* Pulse ring */}
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={8}>
                <p>Chat with InsureGPT</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[60] w-full sm:w-[400px] h-full sm:h-[600px] sm:max-h-[calc(100vh-3rem)] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border/50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">InsureGPT</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-200 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-100">AI Insurance Advisor</span>
                  </div>
                  <span className="text-[10px] text-emerald-100/70">Powered by Himanshu Paliwal</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {profile && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs mr-1">
                    Personalized
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4">
              <div className="space-y-1">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 mb-4 ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    {msg.role === 'bot' ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-tr-sm'
                          : 'bg-muted text-foreground rounded-tl-sm'
                      }`}
                    >
                      {msg.role === 'bot' ? (
                        <div className="space-y-1">{renderBotContent(msg.content)}</div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && <TypingIndicator />}
              </div>

              {/* IRDAI Disclaimer */}
              {messages.length > 1 && (
                <div className="mt-4 mb-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700 leading-snug">
                    ⚠️ <strong>IRDAI Disclaimer:</strong> {IRDAI_MANDATORY_DISCLAIMER}
                  </p>
                </div>
              )}
            </ScrollArea>

            {/* Quick Suggestions */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 pb-2 shrink-0">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestion(suggestion)}
                      className="px-3 py-2 text-xs rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer whitespace-nowrap min-h-[32px]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t bg-white px-3 sm:px-4 py-3 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask about insurance..."
                    disabled={isLoading}
                    className="pr-0 h-10 rounded-full border-border/60 focus-visible:ring-emerald-500/30 text-sm"
                  />
                </div>

                {/* Voice Button */}
                {speechSupported ? (
                  <Button
                    type="button"
                    variant={isRecording ? 'destructive' : 'ghost'}
                    size="icon"
                    onClick={toggleVoice}
                    className={`h-10 w-10 rounded-full shrink-0 transition-all ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                        : 'hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                    aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled
                        className="h-10 w-10 rounded-full shrink-0 opacity-50"
                        aria-label="Voice not supported"
                      >
                        <MicOff className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Voice input not supported in this browser</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Send Button */}
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shrink-0 shadow-sm disabled:opacity-50"
                  size="icon"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              {/* Powered by branding */}
              <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-2">Powered by Himanshu Paliwal</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
