'use client';

import React, { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Loader2, MessageCircle, X, RotateCcw, Minimize2,
  Mic, MicOff, Paperclip, ShieldCheck, Sparkles, Bot, User, Square,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n-strings';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

interface QuickReply {
  label: string;
  value: string;
}

interface InsureGPTChatInterfaceProps {
  className?: string;
  profile?: unknown;
}

// ---------------------------------------------------------------------------
// Language config
// ---------------------------------------------------------------------------
interface LangConfig {
  welcome: string;
  resetMessage: string;
  placeholder: string;
  errorMessage: string;
  connectionError: string;
}

const LANG_CONFIG: Record<string, LangConfig> = {
  hing: {
    welcome: 'Namaste! 🙏 Main hoon **InsureGPT** — aapka AI insurance advisor! Health, Life, Motor — koi bhi sawal puchhiye, main madad karunga.',
    resetMessage: 'Chat reset ho gaya! 🔄 Main InsureGPT hoon — kya jaanna chahiye?',
    placeholder: 'Apna sawaal likhiye...',
    errorMessage: 'Maafi chahunga, main aapka sawaal process nahi kar paya. Kripya dobara try karein.',
    connectionError: 'Abhi connection mein dikkat aa rahi hai. Apna internet check karein aur dobara try karein.',
  },
  en: {
    welcome: "Hello! 👋 I'm **InsureGPT** — your AI insurance advisor! I can help you understand insurance, compare plans, and find the right coverage. What would you like to know?",
    resetMessage: "Chat has been reset! 🔄 I'm InsureGPT — what would you like to know?",
    placeholder: 'Type your question...',
    errorMessage: "I'm sorry, I couldn't process your question. Please try again.",
    connectionError: "There's a connection issue right now. Please check your internet and try again.",
  },
  hi: {
    welcome: 'नमस्ते! 🙏 मैं हूं **InsureGPT** — आपका AI बीमा सलाहकार! स्वास्थ्य, जीवन, मोटर — कोई भी प्रश्न पूछिए, मैं मदद करूंगा।',
    resetMessage: 'चैट रीसेट हो गई! 🔄 मैं InsureGPT हूं — आप क्या जानना चाहेंगे?',
    placeholder: 'अपना प्रश्न लिखें...',
    errorMessage: 'क्षमा करें, मैं आपका प्रश्न प्रोसेस नहीं कर पाया। कृपया पुनः प्रयास करें।',
    connectionError: 'अभी कनेक्शन में समस्या है। अपना इंटरनेट जांचें और पुनः प्रयास करें।',
  },
};

const QUICK_REPLIES: QuickReply[] = [
  { label: '🏥 Health Insurance', value: 'Health Insurance details' },
  { label: '🛡️ Term Insurance', value: 'Term Insurance details' },
  { label: '🚗 Motor Insurance', value: 'Motor Insurance details' },
  { label: '📋 Claim Support', value: 'How to file insurance claim' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function mapLanguage(lang: Language): 'en' | 'hi' | 'hing' {
  if (lang === 'hi') return 'hi';
  if (lang === 'hinglish') return 'hing';
  return 'en';
}

function getLangKey(lang: Language): string {
  return mapLanguage(lang);
}

/** Lightweight markdown renderer — safe (no dangerouslySetInnerHTML) */
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
      parts.push(<strong key={`b-${match.index}`} className="font-semibold dark:text-amber-300 text-[#C98A1C]">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<em key={`i-${match.index}`} className="dark:text-slate-400 text-slate-500">{match[3]}</em>);
    } else if (match[4]) {
      parts.push(
        <code key={`c-${match.index}`} className="dark:bg-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">
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
      nodes.push(<hr key={`hr-${lineIdx}`} className="border-slate-200 dark:border-slate-700 my-2" />);
      return;
    }

    const ulMatch = line.match(/^[\-\*•]\s+(.*)/);
    const olMatch = line.match(/^\d+\.\s+(.*)/);

    if (ulMatch || olMatch) {
      const text = ulMatch ? ulMatch[1] : (olMatch as RegExpMatchArray)[1];
      nodes.push(
        <div key={`li-${lineIdx}`} className="flex gap-2 ml-1">
          <span className="text-[#C98A1C] dark:text-amber-400 shrink-0 mt-0.5">{ulMatch ? '\u2022' : line.match(/^\d+/)?.[0] + '.'}</span>
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
      {content.length === 0 && isStreaming ? (
        // Typing indicator while waiting for first chunk
        <div className="flex items-center gap-1.5 py-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-[#C98A1C] dark:bg-amber-400"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
          <span className="text-[10px] dark:text-slate-500 text-slate-400 font-medium ml-1">
            InsureGPT soch raha hai...
          </span>
        </div>
      ) : (
        <>
          <div className="space-y-0.5 text-[13.5px] leading-relaxed">{renderBotContent(displayedContent)}</div>
          {stillStreaming && (
            <motion.span
              className="inline-block w-0.5 h-4 bg-[#C98A1C] dark:bg-amber-400 ml-0.5 align-middle rounded-full"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            />
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component — Floating InsureGPT Chat Interface
// ---------------------------------------------------------------------------
const InsureGPTChatInterface: React.FC<InsureGPTChatInterfaceProps> = ({
  className = '',
  profile,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialized = useRef(false);

  const { t, language } = useLanguage();
  const langConfig = LANG_CONFIG[getLangKey(language)] || LANG_CONFIG.hing;

  // Callback when streaming completes
  const handleStreamComplete = useCallback(() => {
    setStreamingMsgId(null);
  }, []);

  // Welcome tooltip: show after 3 seconds
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

  // Listen for custom events
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-insuregpt', handleOpenChat);
    return () => window.removeEventListener('open-insuregpt', handleOpenChat);
  }, []);

  // Welcome message
  useEffect(() => {
    if (isOpen && !isMinimized && !hasInitialized.current) {
      hasInitialized.current = true;
      setMessages([
        {
          id: generateId(),
          role: 'bot',
          content: langConfig.welcome,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, isMinimized, langConfig.welcome]);

  // Auto-scroll
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

  // Cleanup recording
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearTimeout(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // ── Streaming abort controller (stop button) ───────────────────────────────
  const abortControllerRef = useRef<AbortController | null>(null);

  // ---------------------------------------------------------------------------
  // Send message via /api/chat/stream (SSE real-time streaming)
  // ---------------------------------------------------------------------------
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      setStreamingMsgId(null);

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      // Build a placeholder bot message that we'll mutate as chunks arrive
      const botMsgId = generateId();
      const botPlaceholder: ChatMessage = {
        id: botMsgId,
        role: 'bot',
        content: '',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage, botPlaceholder]);
      setInputValue('');
      setIsLoading(true);
      setStreamingMsgId(botMsgId);

      // Abort controller for stop button
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const history = messages.slice(-10).map((m) => ({
          role: m.role === 'bot' ? 'bot' : 'user',
          content: m.content,
        }));

        const apiLanguage = mapLanguage(language);

        const res = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
          body: JSON.stringify({
            message: text.trim(),
            profile: profile ?? undefined,
            history,
            language: apiLanguage,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        if (!res.body) {
          throw new Error('No response body');
        }

        // ── Read SSE stream ─────────────────────────────────────────────
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulatedContent = '';
        let firstChunkReceived = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE events (separated by "\n\n")
          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';

          for (const event of events) {
            const lines = event.split('\n');
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              const data = trimmed.slice(5).trim();
              if (!data) continue;

              try {
                const chunk = JSON.parse(data);

                if (chunk.content) {
                  accumulatedContent += chunk.content;
                  firstChunkReceived = true;
                  // Update bot message in place
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === botMsgId
                        ? { ...m, content: accumulatedContent }
                        : m
                    )
                  );
                }

                if (chunk.done) {
                  // Stream complete
                  setStreamingMsgId(null);
                  reader.cancel();
                  return;
                }

                if (chunk.error) {
                  console.error('Stream error:', chunk.error);
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === botMsgId
                        ? {
                            ...m,
                            content: accumulatedContent || langConfig.errorMessage,
                            isError: !accumulatedContent,
                          }
                        : m
                    )
                  );
                  setStreamingMsgId(null);
                  reader.cancel();
                  return;
                }
              } catch {
                // Skip malformed JSON
                continue;
              }
            }
          }
        }

        // Stream ended — if we got no content, show error
        if (!firstChunkReceived) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? { ...m, content: langConfig.errorMessage, isError: true }
                : m
            )
          );
        }
        setStreamingMsgId(null);
      } catch (err) {
        // Abort is expected when user clicks stop
        if (err instanceof Error && err.name === 'AbortError') {
          setStreamingMsgId(null);
          return;
        }

        console.error('InsureGPT stream fetch error:', err);
        setMessages((prev) => {
          // Replace placeholder with error
          const placeholder = prev.find((m) => m.id === botMsgId);
          if (placeholder && !placeholder.content) {
            return prev.map((m) =>
              m.id === botMsgId
                ? { ...m, content: langConfig.connectionError, isError: true }
                : m
            );
          }
          return prev;
        });
        setStreamingMsgId(null);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [isLoading, messages, profile, language, langConfig]
  );

  // ── Stop streaming (user clicks stop) ─────────────────────────────────────
  const handleStopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    setStreamingMsgId(null);
  }, []);

  // Form submit
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Quick reply click
  const handleQuickReply = (reply: QuickReply) => {
    sendMessage(reply.value);
  };

  // Reset chat
  const handleResetChat = () => {
    setStreamingMsgId(null);
    setMessages([
      {
        id: generateId(),
        role: 'bot',
        content: langConfig.resetMessage,
        timestamp: new Date(),
      },
    ]);
    setInputValue('');
    setIsLoading(false);
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show user message about file upload
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: `📎 I've uploaded my policy document: ${file.name}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Send to API
    sendMessage(`I've uploaded my policy document: ${file.name}. Please help me with a reverse audit - I want to compare my current plan with better alternatives and find savings.`);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });

      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          if (!base64Audio) return;
          try {
            const response = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audio: base64Audio }),
            });
            const data = await response.json();
            if (data.success && data.text) {
              setInputValue(data.text);
              setTimeout(() => inputRef.current?.focus(), 100);
            }
          } catch (err) {
            console.error('Transcription error:', err);
          }
        };
        reader.readAsDataURL(audioBlob);
        setIsRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      recordingTimerRef.current = setTimeout(() => {
        if (mediaRecorder.state === 'recording') mediaRecorder.stop();
      }, 10000);
    } catch (err) {
      console.error('Microphone error:', err);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileUpload}
        aria-label="Upload policy document"
      />

      {/* ── Floating Chat Button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-24 md:bottom-8 left-4 md:left-8 z-[60] flex items-center gap-3"
          >
            {/* Welcome tooltip */}
            <AnimatePresence>
              {showTooltip && !isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="hidden sm:flex items-center gap-2 dark:bg-[#0A1330] bg-white px-4 py-2.5 rounded-2xl shadow-xl border dark:border-[#C98A1C]/30 border-[#C98A1C]/20 max-w-[240px] relative"
                >
                  <Sparkles className="w-4 h-4 text-[#C98A1C] shrink-0" />
                  <p className="text-xs font-medium dark:text-white/90 text-slate-700 leading-snug">
                    Chat with InsureGPT — AI Insurance Advisor
                  </p>
                  <button
                    onClick={() => { setShowTooltip(false); setTooltipDismissed(true); }}
                    className="shrink-0 dark:text-slate-400 text-slate-400 hover:dark:text-white hover:text-slate-600"
                    aria-label="Dismiss tooltip"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 dark:bg-[#0A1330] bg-white border-r border-t dark:border-[#C98A1C]/30 border-[#C98A1C]/20 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Label (desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="hidden md:flex flex-col items-end"
            >
              <span className="text-sm font-bold dark:text-white text-slate-800 leading-none whitespace-nowrap">InsureGPT</span>
              <span className="text-[10px] font-medium text-[#C98A1C] dark:text-amber-400 leading-none mt-0.5 whitespace-nowrap">AI Insurance Advisor</span>
            </motion.div>

            {/* Main floating button */}
            <motion.button
              onClick={() => { setIsOpen(true); setIsMinimized(false); }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              data-insuregpt-trigger
              className="group relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#0A1330] via-[#162D5A] to-[#C98A1C] shadow-xl shadow-[#0A1330]/25 hover:shadow-2xl hover:shadow-[#C98A1C]/30 transition-all duration-300 flex items-center justify-center cursor-pointer"
              aria-label="Chat with InsureGPT"
            >
              <span className="absolute inset-0 rounded-full bg-[#C98A1C]/15 animate-pulse" />
              <span className="absolute inset-0 rounded-full overflow-hidden">
                <span className="absolute inset-[-100%] animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </span>
              <Bot className="w-6 h-6 md:w-7 md:h-7 text-white relative z-10" />
              <Sparkles className="w-3.5 h-3.5 text-amber-400 absolute -top-1 -right-1 animate-pulse z-10" />
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0A1330] z-10" />
              <span className="sr-only">Chat with InsureGPT</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Minimized Bar ── */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 md:bottom-8 left-4 md:left-8 z-[70] flex items-center gap-2 bg-gradient-to-r from-[#0A1330] via-[#162D5A] to-[#C98A1C] text-white px-4 py-2.5 rounded-full shadow-xl cursor-pointer"
            onClick={() => setIsMinimized(false)}
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold">InsureGPT</span>
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`fixed bottom-24 md:bottom-8 left-3 md:left-8 z-[70]
                       w-[calc(100vw-1.5rem)] md:w-[420px]
                       h-[calc(100dvh-7rem)] md:h-[640px]
                       flex flex-col overflow-hidden rounded-2xl
                       border dark:border-white/10 border-slate-200/60
                       dark:bg-[#0A1330]/95 bg-white/95
                       backdrop-blur-xl
                       shadow-2xl shadow-black/20
                       ${className}`}
          >
            {/* ── Header ── */}
            <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-[#0A1330] via-[#162D5A] to-[#C98A1C] text-white">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full" />

              <div className="relative z-10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                      <Bot className="w-5 h-5" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0A1330]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base leading-tight whitespace-nowrap">InsureGPT</h3>
                    <span className="inline-flex items-center gap-0.5 bg-white/15 px-1.5 py-0 rounded-full text-[10px] font-semibold whitespace-nowrap mt-0.5">
                      <Sparkles className="w-2.5 h-2.5 shrink-0" />
                      Powered by Paliwal Secure
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shrink-0" />
                      <span className="text-[10px] sm:text-[11px] text-white/70 font-medium whitespace-nowrap">Online • AI बीमा सलाहकार</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="h-7 w-7 rounded-full text-white/50 hover:text-white hover:bg-white/15 shrink-0" aria-label="Minimize chat">
                    <Minimize2 className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleResetChat} className="h-7 w-7 rounded-full text-white/50 hover:text-white hover:bg-white/15 shrink-0" aria-label="Reset chat" title="Reset chat">
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { setIsOpen(false); window.dispatchEvent(new CustomEvent('close-insuregpt')); }} className="h-7 w-7 rounded-full text-white/50 hover:text-white hover:bg-white/15 shrink-0" aria-label="Close chat">
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Quick Replies ── */}
            <div className="px-3 py-2.5 border-b dark:border-white/5 border-slate-100 shrink-0 dark:bg-[#060B1E]/50 bg-slate-50/50">
              <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                {QUICK_REPLIES.map((reply, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickReply(reply)}
                    disabled={isLoading || !!streamingMsgId}
                    className="text-xs px-3 py-1.5 rounded-full dark:bg-white/10 bg-slate-100 dark:text-white text-slate-600 border dark:border-white/20 border-slate-200 dark:hover:bg-[#C98A1C]/20 dark:hover:border-[#C98A1C]/50 hover:bg-[#C98A1C]/10 hover:border-[#C98A1C]/30 dark:hover:text-amber-300 hover:text-[#C98A1C] transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {reply.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* ── Messages Area ── */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(201, 138, 28, 0.2) transparent' }}
            >
              <div className="space-y-1">
                {messages.map((msg) => {
                  const isCurrentlyStreaming = msg.id === streamingMsgId;

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className={`flex items-start gap-2.5 mb-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {msg.role === 'bot' ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-[#C98A1C]/15">
                          <Bot className="w-4 h-4 text-[#060B1E]" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A1330] to-[#162D5A] flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-[#0A1330]/15">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] relative break-words ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#060B1E] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-md shadow-[#C98A1C]/15'
                            : msg.isError
                              ? 'dark:bg-red-950/30 bg-red-50 border border-red-300/30 dark:text-red-300 text-red-700 rounded-2xl rounded-tl-sm px-4 py-2.5'
                              : 'dark:bg-[#060B1E] bg-sky-50 text-slate-600 dark:text-slate-300 border dark:border-[#C98A1C]/15 border-sky-200/50 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm'
                        }`}
                      >
                        {msg.role === 'bot' && !msg.isError ? (
                          <>
                            <StreamingMessage
                              key={msg.id}
                              content={msg.content}
                              isStreaming={isCurrentlyStreaming}
                              onStreamComplete={handleStreamComplete}
                            />
                            {!isCurrentlyStreaming && (
                              <p className="text-[9px] mt-1.5 dark:text-slate-500 text-slate-400">
                                {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-[13.5px] leading-relaxed">{msg.content}</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing indicator */}
                {isLoading && !streamingMsgId && (
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center shrink-0 shadow-md shadow-[#C98A1C]/15">
                      <Bot className="w-4 h-4 text-[#060B1E]" />
                    </div>
                    <div className="dark:bg-[#060B1E] bg-sky-50 border dark:border-[#C98A1C]/15 border-sky-200/50 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 rounded-full bg-[#C98A1C]"
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                        <span className="text-[10px] dark:text-slate-500 text-slate-400 font-medium ml-1">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recording indicator */}
                {isRecording && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-3 py-2 rounded-xl dark:bg-red-950/30 bg-red-50 border border-red-400/20 max-w-[70%]">
                    <motion.span className="w-2.5 h-2.5 rounded-full bg-red-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                    <span className="text-[12px] text-red-400 font-medium">Recording...</span>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ── Input Area ── */}
            <div className="px-3 py-3 border-t dark:border-white/5 border-slate-100 dark:bg-[#0A1330]/80 bg-white/80 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                {/* File upload button */}
                <Button
                  type="button"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || !!streamingMsgId}
                  className="h-10 w-10 rounded-full shrink-0 dark:bg-[#0F1C40] bg-slate-100 dark:text-[#8A96A8] text-slate-500 dark:hover:bg-[#162D5A] hover:bg-slate-200 hover:text-[#C98A1C] transition-all duration-200"
                  aria-label="Upload policy document"
                  title="Upload policy PDF"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>

                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={langConfig.placeholder}
                  disabled={isLoading || !!streamingMsgId}
                  className="flex-1 h-10 rounded-full text-sm dark:border-white/10 border-slate-200 dark:bg-[#060B1E] bg-slate-100 dark:text-white text-slate-900 dark:placeholder:text-[#8A96A8]/50 placeholder:text-slate-400 focus-visible:ring-[#C98A1C]/30 focus-visible:border-[#C98A1C]/40 px-4"
                />

                {/* Microphone button */}
                <Button
                  type="button"
                  size="icon"
                  onClick={toggleRecording}
                  disabled={isLoading || !!streamingMsgId}
                  className={`h-10 w-10 rounded-full shrink-0 transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 animate-pulse'
                      : 'dark:bg-[#0F1C40] bg-slate-100 dark:text-[#8A96A8] text-slate-500 dark:hover:bg-[#162D5A] hover:bg-slate-200 hover:text-[#C98A1C]'
                  }`}
                  aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>

                {/* Send / Stop button — toggles based on streaming state */}
                {isLoading ? (
                  <Button
                    type="button"
                    size="icon"
                    onClick={handleStopStreaming}
                    className="h-10 w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 shrink-0 transition-all duration-200"
                    aria-label="Stop streaming"
                    title="Stop"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim()}
                    className="h-10 w-10 rounded-full bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#060B1E] shadow-lg shadow-[#C98A1C]/20 disabled:opacity-40 shrink-0 transition-all duration-200 hover:shadow-[#C98A1C]/40"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                )}
              </form>

              {/* Footer */}
              <div className="flex items-center justify-center gap-3 mt-2">
                <span className="text-[9px] dark:text-[#8A96A8]/60 text-slate-400/60 flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  IRDAI Registered POSP
                </span>
                <span className="text-[9px] dark:text-slate-600 text-slate-300">|</span>
                <a
                  href="https://wa.me/919257877312"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] text-[#C98A1C] dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <MessageCircle className="w-2.5 h-2.5" />
                  WhatsApp Expert
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InsureGPTChatInterface;
