'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, RotateCcw, ShieldCheck, Globe, Zap,
  Languages, Sparkles, ArrowRight, MessageCircle,
  Mic, MicOff, Volume2, VolumeX, Square, History, Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SendStopButton } from '@/components/ui/send-stop-button';
import { useLanguage } from '@/lib/i18n';
import { ShinyButton } from '@/components/ui/shiny-button';

import type { Language } from '@/lib/i18n-strings';
import { translations } from '@/lib/i18n-strings';
import { useThemeAware } from '@/lib/use-theme-aware';

// ── Static translation helper (for use outside React render cycle) ──────────
function tLookup(key: string, lang: Language): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}

// ── Types ──────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: 'bot' | 'user';
  content: string;
}

// ── Language map: i18n Language → API language code ────────────────────────
const langToApiCode: Record<Language, string> = {
  hinglish: 'hing',
  en: 'en',
  hi: 'hi',
};

// ── Welcome messages (resolved via t() at runtime) ────────────────────────
const welcomeMessageKeys: Record<string, string> = {
  hing: 'insureGPT.welcome',
  en: 'insureGPT.welcome',
  hi: 'insureGPT.welcome',
};

// ── Quick Action Buttons — Gold aurum chips ─────────────────────────────────
const allQuickActionKeys = [
  { key: 'insureGPT.quickAction.health', emoji: '' },
  { key: 'insureGPT.quickAction.term', emoji: '' },
  { key: 'insureGPT.quickAction.motor', emoji: '' },
  { key: 'insureGPT.quickAction.travel', emoji: '' },
  { key: 'insureGPT.quickAction.home', emoji: '' },
  { key: 'insureGPT.quickAction.healthClaim', emoji: '' },
  { key: 'insureGPT.quickAction.lifeClaim', emoji: '' },
  { key: 'insureGPT.quickAction.motorClaim', emoji: '' },
  { key: 'insureGPT.quickAction.taxSavings', emoji: '' },
  { key: 'insureGPT.quickAction.comparePlans', emoji: '' },
];

// ── Suggestion Chips (context-aware) ───────────────────────────────────────
const defaultSuggestionKeys = [
  'insureGPT.suggestion.healthPlan',
  'insureGPT.suggestion.claim',
  'insureGPT.suggestion.tax',
  'insureGPT.suggestion.compareTerm',
];

// ── Live Demo Conversation (keys resolved at runtime → trilingual) ─────────
// The right-side chat auto-plays this attract-mode script: the user question
// types out character-by-character, InsureGPT "thinks", then the answer
// streams in word-by-word — looping through all four exchanges until the
// visitor interacts, at which point the REAL chat takes over seamlessly.
const demoScript: { q: string; a: string }[] = [
  { q: 'insureGPT.demo.q1.q', a: 'insureGPT.demo.q1.a' },
  { q: 'insureGPT.demo.q2.q', a: 'insureGPT.demo.q2.a' },
  { q: 'insureGPT.demo.q3.q', a: 'insureGPT.demo.q3.a' },
  { q: 'insureGPT.demo.q4.q', a: 'insureGPT.demo.q4.a' },
];

// Quick-question chips under the chat window — one tap opens the real chat
const demoChipKeys = [
  'insureGPT.demo.chip.term',
  'insureGPT.demo.chip.tax',
  'insureGPT.demo.chip.zeroDep',
  'insureGPT.demo.chip.claim',
];

// Demo pacing (ms) — fast enough to feel alive, slow enough to read
const DEMO_TYPE_MS = 28;
const DEMO_THINK_MS = 950;
const DEMO_STREAM_MS = 36;
const DEMO_HOLD_MS = 2600;

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Simple Markdown Renderer ───────────────────────────────────────────────
function renderMarkdown(text: string, isDark: boolean): string {
  const preBg = isDark ? 'bg-white/[0.06]' : 'bg-gray-100';
  const preBorder = isDark ? 'border-white/10' : 'border-gray-200';
  const strongColor = isDark ? 'text-[#D4633F]' : 'text-[#B8482C]';

  let html = text
    .replace(/```(\w*)\n([\s\S]*?)```/g, `<pre class="${preBg} rounded-lg p-3 my-2 overflow-x-auto text-xs border ${preBorder}"><code>$2</code></pre>`)
    .replace(/`([^`]+)`/g, `<code class="${preBg} px-1.5 py-0.5 rounded text-xs font-mono border ${preBorder}">$1</code>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong class="${strongColor}">$1</strong>`)
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^• (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^---$/gm, '<hr class="border-border my-2" />')
    .replace(/\n/g, '<br />');

  return html;
}

// ── Language Toggle Options ────────────────────────────────────────────────
const languageOptions: { code: Language; labelKey: string }[] = [
  { code: 'hinglish', labelKey: 'insureGPT.langHing' },
  { code: 'en', labelKey: 'insureGPT.langEn' },
  { code: 'hi', labelKey: 'insureGPT.langHi' },
];

// ── Typing Dots Component — bouncing gold trio ─────────────────────────────
function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      <span className="igpt-dot" />
      <span className="igpt-dot" />
      <span className="igpt-dot" />
    </span>
  );
}

// ── Sparkle Animation Component ────────────────────────────────────────────
function SparkleIcon() {
  return (
    <motion.div
      className="inline-flex items-center justify-center"
      style={{ willChange: 'transform' }}
      animate={{
        rotate: [0, 15, -15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <Sparkles className="w-3.5 h-3.5 text-[#D4633F]" />
    </motion.div>
  );
}

// ── Stagger variants for the left info panel ───────────────────────────────
const panelStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const panelItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' as const } },
};

// ============================================================================
// InsureGPTSection Component — Light Premium Theme with Live AI Demo
// ============================================================================
export default function InsureGPTSection() {
  const { language, setLanguage, t } = useLanguage();
  const { isDark } = useThemeAware();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(defaultSuggestionKeys.map((k) => t(k)));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ── Live demo state (auto-playing attract mode) ─────────────────────────
  const [demoActive, setDemoActive] = useState(true);
  const [demoPaused, setDemoPaused] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const [demoStage, setDemoStage] = useState<'typing' | 'thinking' | 'streaming' | 'hold'>('typing');
  const [demoTyped, setDemoTyped] = useState('');
  const [demoStreamWords, setDemoStreamWords] = useState<string[]>([]);
  const [demoLog, setDemoLog] = useState<{ role: 'user' | 'bot'; key: string }[]>([]);
  const typedLenRef = useRef(0);
  const streamedLenRef = useRef(0);

  // Any real interaction hands the stage over to the live chat
  const exitDemo = useCallback(() => setDemoActive(false), []);

  // Voice input state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // TTS state
  const [playingTTSIdx, setPlayingTTSIdx] = useState<number | null>(null);
  const [ttsLoadingIdx, setTtsLoadingIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize welcome message based on language
  useEffect(() => {
    const apiLang = langToApiCode[language];
    const msgKey = welcomeMessageKeys[apiLang] || welcomeMessageKeys.hing;
    setMessages([{ role: 'bot', content: tLookup(msgKey, language) }]);
  }, [language]);

  // ── Live demo engine — types → thinks → streams → holds → loops ─────────
  useEffect(() => {
    if (!demoActive || demoPaused) return;
    const qa = demoScript[demoIndex];
    const question = tLookup(qa.q, language);
    const answer = tLookup(qa.a, language);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let interval: ReturnType<typeof setInterval> | undefined;

    if (demoStage === 'typing') {
      const chars = Array.from(question);
      if (prefersReducedMotion) {
        timer = setTimeout(() => {
          setDemoTyped(question);
          typedLenRef.current = chars.length;
          setDemoStage('thinking');
        }, 40);
      } else {
        let i = Math.min(typedLenRef.current, chars.length);
        interval = setInterval(() => {
          i += 1;
          setDemoTyped(chars.slice(0, i).join(''));
          typedLenRef.current = i;
          if (i >= chars.length) {
            if (interval) clearInterval(interval);
            setDemoStage('thinking');
          }
        }, DEMO_TYPE_MS);
      }
    } else if (demoStage === 'thinking') {
      timer = setTimeout(() => setDemoStage('streaming'), prefersReducedMotion ? 350 : DEMO_THINK_MS);
    } else if (demoStage === 'streaming') {
      const words = answer.split(/(\s+)/).filter((w) => w.length > 0);
      if (prefersReducedMotion) {
        timer = setTimeout(() => {
          setDemoStreamWords(words);
          streamedLenRef.current = words.length;
          setDemoStage('hold');
        }, 40);
      } else {
        let i = Math.min(streamedLenRef.current, words.length);
        interval = setInterval(() => {
          i += 1;
          setDemoStreamWords(words.slice(0, i));
          streamedLenRef.current = i;
          if (i >= words.length) {
            if (interval) clearInterval(interval);
            setDemoStage('hold');
          }
        }, DEMO_STREAM_MS);
      }
    } else {
      // hold → archive the finished exchange and move to the next one
      timer = setTimeout(() => {
        setDemoLog((prev) => {
          const next = [...prev, { role: 'user' as const, key: qa.q }, { role: 'bot' as const, key: qa.a }];
          return (demoIndex + 1) % demoScript.length === 0 ? [] : next;
        });
        setDemoIndex((demoIndex + 1) % demoScript.length);
        setDemoTyped('');
        setDemoStreamWords([]);
        typedLenRef.current = 0;
        streamedLenRef.current = 0;
        setDemoStage('typing');
      }, prefersReducedMotion ? 800 : DEMO_HOLD_MS);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [demoActive, demoPaused, demoStage, demoIndex, language]);

  // Auto-scroll to bottom (during the demo, only when the reader is near the
  // bottom so they can scroll back through the transcript without fighting it)
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (demoActive) {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
      if (!nearBottom) return;
    }
    el.scrollTop = el.scrollHeight;
  }, [messages, isLoading, demoActive, demoTyped, demoStreamWords, demoStage, demoIndex]);

  // Stop generating
  const handleStopGenerating = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsLoading(false);
  }, [abortController]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Ref for sendMessage to avoid circular dependency with startRecording
  const sendMessageRef = useRef<(text: string) => void>(() => {});

  // Voice Input (ASR)
  const startRecording = useCallback(async () => {
    try {
      // Guard: MediaRecorder not available in all browsers
      if (typeof MediaRecorder === 'undefined') {
        console.warn('MediaRecorder not supported in this browser');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm',
      });
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((tr) => tr.stop());
        setIsRecording(false);
        setRecordingDuration(0);
        if (recordingTimerRef.current) { clearInterval(recordingTimerRef.current); recordingTimerRef.current = null; }
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        if (audioBlob.size === 0) {
          console.warn('Recorded audio blob is empty');
          return;
        }
        setIsTranscribing(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          if (!base64Audio) {
            setIsTranscribing(false);
            return;
          }
          try {
            const res = await fetch('/api/transcribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ audio: base64Audio }) });
            const data = await res.json();
            if (data.success && data.text) {
              sendMessageRef.current(data.text);
            } else {
              console.warn('ASR returned no text:', data);
            }
          } catch (err) {
            console.error('ASR transcription error:', err);
          } finally {
            setIsTranscribing(false);
          }
        };
        reader.onerror = () => {
          console.error('FileReader error during audio conversion');
          setIsTranscribing(false);
        };
        reader.readAsDataURL(audioBlob);
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 10) { if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop(); return 0; }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop();
  }, []);

  // TTS (Text-to-Speech)
  const playTTS = useCallback(async (idx: number, text: string) => {
    // If already playing this message, stop it
    if (playingTTSIdx === idx) {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setPlayingTTSIdx(null);
      return;
    }
    // Stop any currently playing audio
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

    setTtsLoadingIdx(idx);
    setPlayingTTSIdx(null);

    try {
      // Clean text before sending to TTS — strip markdown, emojis, HTML entities
      const cleanText = text
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/^[-•]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        .replace(/^---$/gm, '')
        .replace(/[🏥🛡️🚗✈️🏠💰📋🩺🔧⚠️💡✅❌🛵👨‍👩‍👧👴📱📊🤖🙏👋📈🎯]/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 1024);

      if (!cleanText) {
        setTtsLoadingIdx(null);
        return;
      }

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voice: 'tongtong', speed: 1.0 }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error('TTS API error:', res.status, errorData);
        setTtsLoadingIdx(null);
        return;
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.startsWith('audio/')) {
        console.error('TTS returned non-audio content-type:', contentType);
        setTtsLoadingIdx(null);
        return;
      }

      const audioBlob = await res.blob();
      if (audioBlob.size === 0) {
        console.error('TTS returned empty audio blob');
        setTtsLoadingIdx(null);
        return;
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setTtsLoadingIdx(null);
      setPlayingTTSIdx(idx);

      audio.onended = () => {
        setPlayingTTSIdx(null);
        audioRef.current = null;
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        console.error('Audio playback error');
        setPlayingTTSIdx(null);
        setTtsLoadingIdx(null);
        audioRef.current = null;
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      setTtsLoadingIdx(null);
      setPlayingTTSIdx(null);
    }
  }, [playingTTSIdx]);

  // Send message to API
  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: messageText.trim() };
    // Placeholder bot message that we'll mutate as chunks arrive
    const botPlaceholder: ChatMessage = { role: 'bot', content: '' };
    setMessages((prev) => [...prev, userMessage, botPlaceholder]);
    setInput('');
    setIsLoading(true);
    setSuggestions([]);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const apiLang = langToApiCode[language];

      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
        body: JSON.stringify({
          message: messageText.trim(),
          history,
          language: apiLang,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      // ── Read SSE stream ─────────────────────────────────────────────
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedContent = '';
      // We mutate the LAST message (the bot placeholder) in place
      const updateLastBot = (content: string) => {
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const next = [...prev];
          next[next.length - 1] = { role: 'bot', content };
          return next;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
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
                updateLastBot(accumulatedContent);
              }
              if (chunk.done) {
                reader.cancel();
                break;
              }
              if (chunk.error) {
                if (!accumulatedContent) {
                  updateLastBot(t('insureGPT.error'));
                }
                reader.cancel();
                break;
              }
            } catch {
              continue;
            }
          }
        }
      }

      // If no content received, show error
      if (!accumulatedContent) {
        updateLastBot(t('insureGPT.error'));
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        // Update last (empty) bot message with error
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const next = [...prev];
          const last = next[next.length - 1];
          if (last.role === 'bot' && !last.content) {
            next[next.length - 1] = { role: 'bot', content: t('insureGPT.networkError') };
          } else {
            next.push({ role: 'bot', content: t('insureGPT.networkError') });
          }
          return next;
        });
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
      const lowerMsg = messageText.toLowerCase();
      if (/health|medical/.test(lowerMsg)) {
        setSuggestions([t('insureGPT.suggestion.healthPlan'), t('insureGPT.suggest.claimRatio'), t('insureGPT.suggest.waitingPeriod'), t('insureGPT.suggest.cashlessVsReimb')]);
      } else if (/term|life/.test(lowerMsg)) {
        setSuggestions([t('insureGPT.suggestion.compareTerm'), t('insureGPT.suggest.termRiders'), t('insureGPT.suggest.tax80C'), t('insureGPT.suggest.coverNeeded')]);
      } else if (/motor|car|bike/.test(lowerMsg)) {
        setSuggestions([t('insureGPT.suggest.compVsTP'), t('insureGPT.suggest.zeroDep'), t('insureGPT.quickAction.motorClaim'), t('insureGPT.suggest.bestMotor')]);
      } else if (/claim/.test(lowerMsg)) {
        setSuggestions([t('insureGPT.suggest.claimDocs'), t('insureGPT.suggest.cashlessClaim'), t('insureGPT.suggest.irdaiComplaint'), t('insureGPT.suggest.claimTimeline')]);
      } else if (/tax|80d|80c/.test(lowerMsg)) {
        setSuggestions([t('insureGPT.suggest.80DLimits'), t('insureGPT.suggest.80CDeduction'), t('insureGPT.suggest.taxCalc'), t('insureGPT.suggest.bestTaxPlans')]);
      } else {
        setSuggestions(defaultSuggestionKeys.map((k) => t(k)));
      }
    }
  }, [isLoading, messages, language, t]);

  // Keep ref in sync for voice input callback
  sendMessageRef.current = sendMessage;

  // Handle quick action click
  const handleQuickAction = useCallback((label: string) => {
    exitDemo();
    const queryMap: Record<string, string> = {
      [t('insureGPT.quickAction.health')]: 'Tell me about health insurance plans and coverage',
      [t('insureGPT.quickAction.term')]: 'Explain term life insurance and best plans',
      [t('insureGPT.quickAction.motor')]: 'What should I know about motor insurance?',
      [t('insureGPT.quickAction.travel')]: 'Tell me about travel insurance options',
      [t('insureGPT.quickAction.home')]: 'Explain home insurance coverage',
      [t('insureGPT.quickAction.healthClaim')]: 'How do I file a health insurance claim?',
      [t('insureGPT.quickAction.lifeClaim')]: 'What is the life insurance claim process?',
      [t('insureGPT.quickAction.motorClaim')]: 'How to file a motor insurance claim?',
      [t('insureGPT.quickAction.taxSavings')]: 'What tax benefits do I get from insurance?',
      [t('insureGPT.quickAction.comparePlans')]: 'Help me compare different insurance plans',
    };
    sendMessage(queryMap[label] || `Tell me about ${label}`);
  }, [sendMessage, t, exitDemo]);

  // Reset chat
  const handleReset = useCallback(() => {
    exitDemo();
    const apiLang = langToApiCode[language];
    const msgKey = welcomeMessageKeys[apiLang] || welcomeMessageKeys.hing;
    setMessages([{ role: 'bot', content: tLookup(msgKey, language) }]);
    setInput('');
    setSuggestions(defaultSuggestionKeys.map((k) => t(k)));
    inputRef.current?.focus({ preventScroll: true });
  }, [language, t, exitDemo]);

  // Handle language change within chat
  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    const apiLang = langToApiCode[lang];
    const msgKey = welcomeMessageKeys[apiLang] || welcomeMessageKeys.hing;
    setMessages([{ role: 'bot', content: tLookup(msgKey, lang) }]);
    setSuggestions(defaultSuggestionKeys.map((k) => tLookup(k, lang)));
  }, [setLanguage]);

  // Handle form submit
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    exitDemo();
    sendMessage(input);
  }, [input, sendMessage, exitDemo]);

  // Handle open floating InsureGPT chat
  const handleOpenInsureGPT = () => {
    window.dispatchEvent(new CustomEvent('open-insuregpt'));
  };

  // Current demo exchange (resolved fresh so a language switch live-updates)
  const currentDemo = demoScript[demoIndex];

  return (
    <section
      id="insuregpt"
      className="relative section-premium overflow-hidden scroll-mt-16 bg-[#FAF7F2] dark:bg-[#0E1116]"
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(184, 72, 44, 0.05) 0%, transparent 60%)',
        }}
      />

      {/* Decorative orbs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-[#F4E5DD]/60 rounded-full blur-3xl pointer-events-none dark:bg-[#D4633F]/[0.06]" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-[#F8EFD3]/70 rounded-full blur-3xl pointer-events-none dark:bg-[#D4633F]/[0.06]" />

      <div className="container-premium relative z-10">
        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-10 lg:mb-14"
        >
          <div className="nl-eyebrow nl-eyebrow-center dark:text-[#E8C97E]! mb-6">
            <Brain className="w-3.5 h-3.5 shrink-0" />
            <span>{t('insureGPT.badge')}</span>
          </div>
          <h2 className="nl-h2 dark:text-[#FAF7F2]! mb-6">
            {t('insureGPT.chatWith')}
            <span className="relative inline-block">
              <span className="text-accent-gradient">
                InsureGPT
              </span>
              {/* Gold underline flourish */}
              <motion.span
                aria-hidden="true"
                className="absolute left-0 -bottom-1.5 h-[3px] w-full rounded-full bg-[linear-gradient(90deg,#D4A853_0%,#E8C872_45%,#B8482C_100%)] origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </h2>
          <p className="nl-sub dark:text-[#A8B0C2]! mx-auto">
            {t('insureGPT.subtitle')}
          </p>
          {/* Powered by PaliwalSecure — full brand name */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6EFEE] dark:bg-[rgba(45,122,119,0.12)] text-[#1B4D4A] dark:text-[#2D7A77] text-caption-premium">
            <Zap className="w-3 h-3" />
            <span>{t('insureGPT.poweredBy')}</span>
          </div>
        </motion.div>

        {/* ── Two-Column Layout ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-8"
        >
          {/* ── Left Info Panel (2 cols — stacks above the chat on mobile) ── */}
          <motion.div
            variants={panelStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-col gap-4 lg:col-span-2"
          >
            {/* Branding Card — Premium */}
            <motion.div
              variants={panelItem}
              className="card-aurum p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="igpt-avatar w-10 h-10 shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-[#0E1116] dark:text-[#FAF7F2] tracking-tight">InsureGPT</h3>
                  <p className="text-xs text-[#B8482C] dark:text-[#D4633F] font-semibold">{t('insureGPT.byBrand')}</p>
                </div>
              </div>
              <p className="text-sm text-[#4A4F57] dark:text-[#B8BCC2] leading-relaxed mb-4">
                {t('insureGPT.brandDesc')}
              </p>

              {/* Trust Indicators — Compact Grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: ShieldCheck, labelKey: 'insureGPT.trust.irdaiCertified', color: 'text-[#1B4D4A] dark:text-[#2D7A77]' },
                  { icon: Globe, labelKey: 'insureGPT.trust.insurers', color: 'text-[#1B4D4A] dark:text-[#2D7A77]' },
                  { icon: Zap, labelKey: 'insureGPT.trust.free', color: 'text-[#B8482C] dark:text-[#D4633F]' },
                  { icon: Brain, labelKey: 'insureGPT.trust.aiPowered', color: 'text-[#1B4D4A] dark:text-[#2D7A77]' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.labelKey} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2]/90 dark:bg-white/[0.04] text-[#4A4F57] dark:text-[#B8BCC2] border border-[#D4A853]/25 dark:border-[rgba(250,247,242,0.08)] text-caption-premium text-[0.6rem]">
                      <Icon className={`w-3 h-3 shrink-0 ${item.color}`} />
                      <span>{t(item.labelKey)}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Language Toggle Card — Premium segmented control */}
            <motion.div
              variants={panelItem}
              className="card-aurum p-4"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <Languages className="w-3.5 h-3.5 text-[#B8482C] dark:text-[#D4633F]" />
                <span className="text-caption-premium text-[#0E1116] dark:text-[#FAF7F2]">{t('insureGPT.language')}</span>
              </div>
              <div className="relative flex gap-1 bg-[#F3EADB] dark:bg-white/[0.05] rounded-full p-1 border border-[#D4A853]/30 dark:border-[rgba(212,168,83,0.25)]">
                {languageOptions.map((opt) => {
                  const active = language === opt.code;
                  return (
                    <button
                      key={opt.code}
                      onClick={() => handleLanguageChange(opt.code)}
                      className="relative flex-1 min-h-[40px] rounded-full text-xs font-bold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]/70 transition-colors duration-200"
                      aria-pressed={active}
                      aria-label={`Switch to ${opt.code}`}
                    >
                      {active && (
                        <motion.span
                          layoutId="insuregpt-lang-thumb"
                          className="absolute inset-0 rounded-full bg-[linear-gradient(135deg,#B8482C_0%,#5E1223_100%)] border border-[#E8C872]/40 shadow-[0_3px_10px_-2px_rgba(94,18,35,0.55)]"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span
                        className={`relative z-10 transition-colors duration-200 ${
                          active
                            ? 'text-[#FDF6EC]'
                            : 'text-[#5A4632] dark:text-[#B8BCC2] hover:text-[#B8482C] dark:hover:text-[#D4633F]'
                        }`}
                      >
                        {t(opt.labelKey)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* How it works — Premium */}
            <motion.div
              variants={panelItem}
              className="card-aurum p-4"
            >
              <h4 className="text-caption-premium text-[#0E1116] dark:text-[#FAF7F2] mb-3">{t('insureGPT.howItWorks')}</h4>
              <div className="relative">
                {[
                  { step: '1', textKey: 'insureGPT.step1' },
                  { step: '2', textKey: 'insureGPT.step2' },
                  { step: '3', textKey: 'insureGPT.step3' },
                ].map((item, i) => (
                  <div key={item.step} className="relative flex items-center gap-3 py-1.5">
                    {i < 2 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[15px] top-[34px] w-[2px] h-[16px] bg-[linear-gradient(180deg,rgba(212,168,83,0.55),rgba(212,168,83,0.15))]"
                      />
                    )}
                    <div className="w-8 h-8 rounded-full bg-[linear-gradient(135deg,#B8482C_0%,#5E1223_100%)] text-[#F5E7B8] flex items-center justify-center text-xs font-bold shrink-0 border border-[#E8C872]/40 shadow-[0_3px_10px_-3px_rgba(94,18,35,0.5)]">
                      {item.step}
                    </div>
                    <span className="text-xs text-[#4A4F57] dark:text-[#B8BCC2] leading-relaxed">{t(item.textKey)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons — On the LEFT side */}
            <motion.div variants={panelItem} className="flex flex-col sm:flex-row gap-3 pt-1">
              <motion.button
                onClick={handleOpenInsureGPT}
                className="btn-stripe min-h-[48px] w-full sm:w-auto justify-center"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-4 h-4" />
                {t('insureGPT.chatCTA')}
              </motion.button>
              <motion.a
                href="https://wa.me/919257877312"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <ShinyButton
                  variant="secondary"
                  className="text-sm min-h-[48px] w-full sm:w-auto"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {t('insureGPT.whatsappExpert')}
                  </span>
                </ShinyButton>
              </motion.a>
            </motion.div>

            {/* PaliwalSecure Brand Badge */}
            <motion.div variants={panelItem} className="flex items-center justify-center gap-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-white/[0.04] text-[#4A4F57] dark:text-[#B8BCC2] border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.08)] text-caption-premium text-[0.65rem]">
                <Zap className="w-3 h-3" />
                <span>{t('insureGPT.poweredBy')}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Right Chat Panel (3 cols) — live-feel AI demo ─────────────── */}
          <div className="col-span-1 lg:col-span-3 flex flex-col">
            {/* Animated conic gold frame wrapper (hover pauses the demo) */}
            <div
              className="igpt-frame rounded-[1.625rem]"
              onMouseEnter={() => setDemoPaused(true)}
              onMouseLeave={() => setDemoPaused(false)}
            >
              <div className="bg-white dark:bg-[#161A21] rounded-[1.625rem] shadow-premium-xl overflow-hidden flex flex-col h-[480px] sm:h-[560px] lg:h-[640px]">
                {/* Chat Header — light premium */}
                <div className="relative flex items-center justify-between gap-2 px-3.5 sm:px-5 py-3 border-b border-[#D4A853]/25 dark:border-[rgba(212,168,83,0.22)] bg-[linear-gradient(135deg,#FBF4E4_0%,#F6EDDC_55%,#F3EADB_100%)] dark:bg-[linear-gradient(135deg,#231318_0%,#1A0F13_100%)]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="igpt-avatar w-9 h-9 shrink-0">
                      <Brain className="w-[18px] h-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-bold text-[#0E1116] dark:text-[#FAF7F2] font-display tracking-tight truncate">InsureGPT</span>
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2" aria-hidden="true">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[11px] text-[#1B4D4A] dark:text-emerald-400 font-semibold whitespace-nowrap">{t('insureGPT.online')}</span>
                        <SparkleIcon />
                        <span className="hidden md:inline text-[10px] text-[#8B9099] dark:text-[#8B9099] whitespace-nowrap">· {t('insureGPT.byBrand')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Live demo badge (shows the attract mode is running) */}
                    {demoActive && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F8EFD3] dark:bg-[rgba(212,168,83,0.12)] border border-[#D4A853]/40 dark:border-[rgba(212,168,83,0.35)] text-[#8F5A1E] dark:text-[#E8C872] text-caption-premium text-[0.58rem]">
                        <span className={`w-1.5 h-1.5 rounded-full ${demoPaused ? 'bg-[#B8482C]' : 'bg-[#D4A853] animate-pulse'}`} />
                        {t('insureGPT.demo.live')}
                      </span>
                    )}
                    {/* IRDAI-compliant mini badge */}
                    <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E6EFEE] dark:bg-[rgba(45,122,119,0.12)] border border-[#2D7A77]/25 dark:border-[rgba(45,122,119,0.35)] text-[#1B4D4A] dark:text-[#2D7A77] text-caption-premium text-[0.58rem]">
                      <ShieldCheck className="w-3 h-3" />
                      {t('insureGPT.demo.irdaiBadge')}
                    </span>
                    {/* Language Toggle — visible on mobile too */}
                    <div className="flex gap-0.5 bg-[#F3EADB] dark:bg-white/[0.06] rounded-full p-0.5 border border-[#D4A853]/30 dark:border-[rgba(212,168,83,0.25)]">
                      {languageOptions.map((opt) => (
                        <button
                          key={opt.code}
                          onClick={() => handleLanguageChange(opt.code)}
                          className={`px-2.5 min-h-[30px] rounded-full text-[10px] font-bold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]/70 ${
                            language === opt.code
                              ? 'bg-[linear-gradient(135deg,#B8482C,#5E1223)] text-[#FDF6EC] shadow-[0_2px_8px_-2px_rgba(94,18,35,0.5)]'
                              : 'text-[#5A4632] dark:text-[#B8BCC2] hover:text-[#B8482C] dark:hover:text-[#D4633F]'
                          }`}
                          aria-label={`Switch to ${opt.code}`}
                          aria-pressed={language === opt.code}
                        >
                          {t(opt.labelKey)}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleReset}
                      className="h-8 w-8 rounded-full text-[#8B9099] hover:text-[#B8482C] hover:bg-[#F4E5DD] dark:text-[#8B9099] dark:hover:text-[#D4633F] dark:hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#D4A853]/70"
                      aria-label="Reset chat"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Quick Action Buttons — aurum chips */}
                <div className="px-4 py-2.5 border-b border-[#D4A853]/20 dark:border-[rgba(212,168,83,0.18)] bg-[linear-gradient(180deg,#FDFAF2_0%,#FAF4E6_100%)] dark:bg-[#0E1116]/50">
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {allQuickActionKeys.map((action) => (
                      <button
                        key={action.key}
                        onClick={() => handleQuickAction(t(action.key))}
                        className="chip-aurum min-h-[36px] px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]/70 shrink-0"
                      >
                        <span>{action.emoji}</span>
                        {t(action.key)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages Area */}
                <div
                  ref={scrollContainerRef}
                  className="flex-1 min-h-0 overflow-y-auto px-3.5 sm:px-5 py-4 sm:py-5 space-y-4 premium-scrollbar bg-[linear-gradient(180deg,#FFFDF8_0%,#FAF5E9_100%)] dark:bg-[#0E1116]"
                >
                  {demoActive ? (
                    <>
                      {/* ── Auto-playing demo transcript ─────────────────────── */}
                      <AnimatePresence mode="popLayout">
                        {demoLog.map((entry, i) => (
                          <motion.div
                            key={`demo-log-${i}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {entry.role === 'user' ? (
                              <div className="bg-[linear-gradient(135deg,#D4633F_0%,#B8482C_50%,#5E1223_100%)] dark:bg-[#D4633F] text-[#FAF7F2] rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed max-w-[85%] shadow-[0_6px_18px_-6px_rgba(94,18,35,0.45)] font-medium">
                                <span>{t(entry.key)}</span>
                              </div>
                            ) : (
                              <div className="flex gap-2.5 max-w-[92%]">
                                <div className="igpt-avatar w-7 h-7 shrink-0 mt-0.5">
                                  <Brain className="w-3.5 h-3.5" />
                                </div>
                                <div className="bg-[#F8EFD3] dark:bg-[#1A1F27] text-[#0E1116] dark:text-[#FAF7F2] rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed border border-[#D4A853]/30 dark:border-[rgba(212,168,83,0.22)]">
                                  <div
                                    className="prose-sm [&_strong]:text-primary [&_em]:italic [&_li]:ml-4 [&_li]:list-disc [&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-2 [&_pre]:my-1 [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:border [&_pre]:border-border [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_code]:border [&_code]:border-border [&_hr]:border-border [&_hr]:my-2"
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(t(entry.key), isDark) }}
                                  />
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Current demo turn — question types out with a caret */}
                      <motion.div
                        key={`demo-q-${demoIndex}`}
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                        className="flex justify-end"
                      >
                        <div className="bg-[linear-gradient(135deg,#D4633F_0%,#B8482C_50%,#5E1223_100%)] dark:bg-[#D4633F] text-[#FAF7F2] rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed max-w-[85%] shadow-[0_6px_18px_-6px_rgba(94,18,35,0.45)] font-medium">
                          {demoStage === 'typing' ? (
                            <span className="type-caret">{demoTyped}</span>
                          ) : (
                            <span>{t(currentDemo.q)}</span>
                          )}
                        </div>
                      </motion.div>

                      {/* Thinking indicator → streaming answer */}
                      <AnimatePresence mode="wait">
                        {demoStage === 'thinking' && (
                          <motion.div
                            key="demo-thinking"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="flex justify-start"
                          >
                            <div className="flex gap-2.5">
                              <div className="igpt-avatar is-thinking w-7 h-7 shrink-0 mt-0.5">
                                <Brain className="w-3.5 h-3.5" />
                              </div>
                              <div className="bg-[#F8EFD3] dark:bg-[#1A1F27] rounded-2xl rounded-bl-md border border-[#D4A853]/30 dark:border-[rgba(212,168,83,0.22)] px-4 py-3 flex items-center gap-2.5">
                                <TypingDots />
                                <span className="text-xs text-[#8F5A1E] dark:text-[#D4A853] font-semibold">{t('insureGPT.demo.thinking')}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        {(demoStage === 'streaming' || demoStage === 'hold') && (
                          <motion.div
                            key="demo-answer"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="flex justify-start"
                          >
                            <div className="flex gap-2.5 max-w-[92%]">
                              <div className="igpt-avatar w-7 h-7 shrink-0 mt-0.5">
                                <Brain className="w-3.5 h-3.5" />
                              </div>
                              <div className="bg-[#F8EFD3] dark:bg-[#1A1F27] text-[#0E1116] dark:text-[#FAF7F2] rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed border border-[#D4A853]/30 dark:border-[rgba(212,168,83,0.22)]">
                                <div
                                  className="prose-sm [&_strong]:text-primary [&_em]:italic [&_li]:ml-4 [&_li]:list-disc [&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-2 [&_pre]:my-1 [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:border [&_pre]:border-border [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_code]:border [&_code]:border-border [&_hr]:border-border [&_hr]:my-2"
                                  dangerouslySetInnerHTML={{
                                    __html: renderMarkdown(
                                      demoStage === 'streaming' ? demoStreamWords.join('') : t(currentDemo.a),
                                      isDark
                                    ),
                                  }}
                                />
                                {demoStage === 'streaming' && <span className="type-caret" aria-hidden="true" />}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <>
                      {/* ── Real chat transcript ─────────────────────────────── */}
                      <AnimatePresence mode="popLayout">
                        {messages.map((msg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {msg.role === 'bot' ? (
                              <div className="flex gap-2.5 max-w-[90%]">
                                {/* Bot Avatar */}
                                <div className="igpt-avatar w-7 h-7 shrink-0 mt-0.5">
                                  <Brain className="w-3.5 h-3.5" />
                                </div>
                                {/* Bot Message Bubble */}
                                <div className="bg-[#F8EFD3] dark:bg-[#1A1F27] text-[#0E1116] dark:text-[#FAF7F2] rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed border border-[#D4A853]/30 dark:border-[rgba(250,247,242,0.10)]">
                                  <div
                                    className="prose-sm [&_strong]:text-primary [&_em]:italic [&_li]:ml-4 [&_li]:list-disc [&_pre]:bg-muted [&_pre]:rounded-lg [&_pre]:p-2 [&_pre]:my-1 [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:border [&_pre]:border-border [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_code]:border [&_code]:border-border [&_hr]:border-border [&_hr]:my-2"
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content, isDark) }}
                                  />
                                  {/* TTS Play Button */}
                                  <div className="flex justify-end mt-1.5">
                                    <button
                                      onClick={() => playTTS(idx, msg.content)}
                                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium text-primary/50 hover:text-primary hover:bg-primary/10 transition-all duration-200"
                                      aria-label={playingTTSIdx === idx ? 'Stop audio' : 'Play audio'}
                                    >
                                      {ttsLoadingIdx === idx ? (
                                        <>
                                          <motion.div className="w-3 h-3 border border-primary/40 border-t-primary rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                                          <span>{t('insureGPT.ttsLoading')}</span>
                                        </>
                                      ) : playingTTSIdx === idx ? (
                                        <>
                                          <VolumeX className="w-3 h-3" />
                                          <span>{t('insureGPT.ttsPlaying')}</span>
                                        </>
                                      ) : (
                                        <>
                                          <Volume2 className="w-3 h-3" />
                                          <span>{t('insureGPT.ttsListen')}</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* User Message Bubble — terracotta→maroon gradient */
                              <div className="bg-[linear-gradient(135deg,#D4633F_0%,#B8482C_50%,#5E1223_100%)] dark:bg-[#D4633F] text-[#FAF7F2] rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed max-w-[85%] shadow-[0_6px_18px_-6px_rgba(94,18,35,0.45)] font-medium border border-[rgba(94,18,35,0.35)] dark:border-[rgba(212,99,63,0.30)]">
                                <span>{msg.content}</span>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Typing Indicator */}
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <div className="flex gap-2.5">
                            {/* Bot Avatar */}
                            <motion.div
                              className="igpt-avatar is-thinking w-7 h-7 shrink-0 mt-0.5"
                              animate={{ scale: [1, 1.06, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                              <Brain className="w-3.5 h-3.5" />
                            </motion.div>
                            {/* Typing Bubble */}
                            <div className="bg-[#F8EFD3] dark:bg-[#1A1F27] rounded-2xl rounded-bl-md px-4 py-3 border border-[#D4A853]/30 dark:border-[rgba(212,168,83,0.22)] flex items-center gap-2">
                              <span className="text-xs text-[#8F5A1E] dark:text-[#D4A853] font-semibold font-body">InsureGPT</span>
                              <TypingDots />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestion Chips — Premium */}
                {suggestions.length > 0 && !isLoading && messages.length > 0 && (
                  <div className="px-5 py-2.5 border-t border-[#D4A853]/20 dark:border-[rgba(212,168,83,0.18)] bg-[linear-gradient(180deg,#FAF4E6,#F8EFD3)] dark:bg-[#0E1116]/50">
                    <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => { exitDemo(); sendMessage(suggestion); }}
                          className="inline-flex items-center gap-1.5 min-h-[34px] px-3.5 rounded-full bg-[#E6EFEE] dark:bg-[rgba(45,122,119,0.12)] text-[#1B4D4A] dark:text-[#2D7A77] text-xs font-medium cursor-pointer whitespace-nowrap shrink-0 transition-all duration-200 hover:bg-[#1B4D4A] hover:text-[#FAF7F2] dark:hover:bg-[#2D7A77] dark:hover:text-[#0E1116] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]/70"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voice Recording Indicator */}
                <AnimatePresence>
                  {(isRecording || isTranscribing) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 py-2 bg-[#F4E5DD] dark:bg-[rgba(212,99,63,0.08)] border-t border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isTranscribing ? (
                            <>
                              <motion.div className="w-3 h-3 border border-primary/40 border-t-primary rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                              <span className="text-xs text-primary font-medium">{t('insureGPT.transcribing')}</span>
                            </>
                          ) : (
                            <>
                              <motion.div className="w-3 h-3 rounded-full bg-red-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                              <span className="text-xs text-primary font-medium">{t('insureGPT.listening')}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isRecording && (
                            <>
                              <span className={`text-xs ${isDark ? 'text-white/50' : 'text-[#8B9099]'} font-mono`}>{recordingDuration}s / 10s</span>
                              <Button onClick={stopRecording} className="h-6 px-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-medium hover:bg-red-500/30">
                                <Square className="w-2 h-2 mr-1 fill-current" />{t('insureGPT.stop')}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input Area — Premium */}
                <div className="px-4 sm:px-5 py-3 border-t border-[#D4A853]/25 dark:border-[rgba(212,168,83,0.22)] bg-white dark:bg-[#0E1116]">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    {/* Voice Input Button */}
                    <Button
                      type="button"
                      onClick={() => { exitDemo(); if (isRecording) stopRecording(); else startRecording(); }}
                      className={`h-11 w-11 rounded-xl shrink-0 transition-all duration-200 px-0 ${
                        isRecording
                          ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                          : isTranscribing
                          ? 'bg-[#F4E5DD] dark:bg-[rgba(212,99,63,0.15)] border border-[#B8482C]/30 dark:border-[#D4633F]/40 text-[#B8482C] dark:text-[#D4633F]'
                          : 'bg-[#FAF7F2] dark:bg-[#1A1F27] border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] text-[#8B9099] dark:text-[#B8BCC2] hover:text-[#B8482C] dark:hover:text-[#D4633F] hover:bg-[#F4E5DD] dark:hover:bg-[rgba(212,99,63,0.10)] hover:border-[#B8482C]/30 dark:hover:border-[#D4633F]/40'
                      }`}
                      disabled={isLoading || isTranscribing}
                      aria-label={isRecording ? 'Stop recording' : isTranscribing ? 'Transcribing' : 'Start voice input'}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : isTranscribing ? (
                        <motion.div className="w-4 h-4 border-2 border-[#B8482C]/40 border-t-[#B8482C] dark:border-[#D4633F]/40 dark:border-t-[#D4633F] rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                      ) : <Mic className="w-4 h-4" />}
                    </Button>
                    <input
                      ref={inputRef}
                      value={input}
                      onFocus={exitDemo}
                      onChange={(e) => { if (demoActive) exitDemo(); setInput(e.target.value); }}
                      placeholder={t('insureGPT.placeholder')}
                      disabled={isLoading}
                      className="flex-1 h-11 px-3.5 text-sm rounded-xl bg-white dark:bg-[#1A1F27] border border-[#D4A853]/30 dark:border-[rgba(250,247,242,0.10)] text-[#0E1116] dark:text-[#FAF7F2] placeholder:text-[#737B85] dark:placeholder:text-[#8B9099] focus:border-[#B8482C] dark:focus:border-[#D4633F] focus:ring-2 focus:ring-[#D4A853]/40 focus:outline-none transition-colors duration-200 disabled:opacity-50"
                    />
                    <SendStopButton
                      isLoading={isLoading}
                      onStop={handleStopGenerating}
                      disabled={!input.trim() && !isLoading}
                      className="disabled:opacity-40 h-11"
                    >
                      {t('insureGPT.send')}
                    </SendStopButton>
                  </form>
                  <p className="text-[10px] text-[#8B9099] dark:text-[#8B9099] mt-2 text-center">
                    {t('insureGPT.irdaiDisclaimer')}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick-question chips — one tap opens the real InsureGPT chat */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
              className="mt-4 lg:mt-5 flex flex-wrap items-center justify-center gap-2"
            >
              <span className="inline-flex items-center gap-1.5 mr-0.5 text-caption-premium text-[#8B9099] dark:text-[#8B9099]">
                <Sparkles className="w-3 h-3 text-[#D4A853]" />
                {t('insureGPT.demo.tryAsking')}
              </span>
              {demoChipKeys.map((key) => (
                <motion.button
                  key={key}
                  onClick={handleOpenInsureGPT}
                  className="chip-aurum min-h-[44px] px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853]/70"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                >
                  {t(key)}
                  <ArrowRight className="w-3 h-3 opacity-60" />
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Section divider */}
      <div className="h-px w-full bg-[rgba(14,17,22,0.08)] dark:bg-[rgba(250,247,242,0.10)]" />
    </section>
  );
}
