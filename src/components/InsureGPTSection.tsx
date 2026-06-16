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

// ── Quick Action Buttons — Dark pills with gold borders ────────────────────
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

// ── Typing Dots Component ──────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary"
          animate={{
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
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

// ============================================================================
// InsureGPTSection Component — Dark Premium Theme
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setSuggestions([]);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const apiLang = langToApiCode[language];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText.trim(),
          history,
          language: apiLang,
        }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (data.success && data.response) {
        setMessages((prev) => [...prev, { role: 'bot', content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', content: t('insureGPT.error') },
        ]);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', content: t('insureGPT.networkError') },
        ]);
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
  }, [sendMessage, t]);

  // Reset chat
  const handleReset = useCallback(() => {
    const apiLang = langToApiCode[language];
    const msgKey = welcomeMessageKeys[apiLang] || welcomeMessageKeys.hing;
    setMessages([{ role: 'bot', content: tLookup(msgKey, language) }]);
    setInput('');
    setSuggestions(defaultSuggestionKeys.map((k) => t(k)));
    inputRef.current?.focus({ preventScroll: true });
  }, [language, t]);

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
    sendMessage(input);
  }, [input, sendMessage]);

  // Handle open floating InsureGPT chat
  const handleOpenInsureGPT = () => {
    window.dispatchEvent(new CustomEvent('open-insuregpt'));
  };

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
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-[#F4E5DD]/60 rounded-full blur-3xl pointer-events-none dark:bg-[#D4633F]/[0.06]" />

      <div className="container-premium relative z-10">
        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10 lg:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4E5DD] dark:bg-[rgba(212,99,63,0.12)] text-[#8B3520] dark:text-[#D4633F] text-caption-premium mb-5">
            <Brain className="w-3.5 h-3.5" />
            {t('insureGPT.badge')}
          </div>
          <h2 className="text-display-h2 text-[#0E1116] dark:text-[#FAF7F2] leading-tight font-display">
            {t('insureGPT.chatWith')}
            <span className="text-accent-gradient">
              InsureGPT
            </span>
          </h2>
          <p className="mt-4 text-lead-premium text-[#4A4F57] dark:text-[#B8BCC2] max-w-2xl mx-auto">
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
          className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-8"
        >
          {/* ── Left Info Panel (2 cols) ────────────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-2 flex-col gap-4">
            {/* Branding Card — Premium */}
            <div
              className="bg-white dark:bg-[#161A21] border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] rounded-2xl p-5 shadow-premium"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0E1116] dark:bg-[#D4633F] flex items-center justify-center shadow-premium-sm">
                  <Brain className="w-5 h-5 text-[#FAF7F2]" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-[#0E1116] dark:text-[#FAF7F2] tracking-tight">InsureGPT</h3>
                  <p className="text-xs text-[#B8482C] dark:text-[#D4633F] font-medium">{t('insureGPT.byBrand')}</p>
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
                    <div key={item.labelKey} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] dark:bg-white/[0.04] text-[#4A4F57] dark:text-[#B8BCC2] border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.08)] text-caption-premium text-[0.6rem]">
                      <Icon className={`w-3 h-3 shrink-0 ${item.color}`} />
                      <span>{t(item.labelKey)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Language Toggle Card — Premium */}
            <div
              className="bg-white dark:bg-[#161A21] border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] rounded-2xl p-4 shadow-premium"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <Languages className="w-3.5 h-3.5 text-[#B8482C] dark:text-[#D4633F]" />
                <span className="text-caption-premium text-[#0E1116] dark:text-[#FAF7F2]">{t('insureGPT.language')}</span>
              </div>
              <div className="flex gap-2">
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => handleLanguageChange(opt.code)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                      language === opt.code
                        ? 'bg-[#0E1116] text-[#FAF7F2] border-[#0E1116] shadow-premium-sm dark:bg-[#FAF7F2] dark:text-[#0E1116] dark:border-[#FAF7F2]'
                        : 'bg-[#FAF7F2] text-[#4A4F57] border-[rgba(14,17,22,0.08)] hover:border-[#0E1116] hover:text-[#0E1116] dark:bg-white/5 dark:text-[#B8BCC2] dark:border-[rgba(250,247,242,0.10)] dark:hover:border-[#FAF7F2] dark:hover:text-[#FAF7F2]'
                    }`}
                  >
                    {t(opt.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* How it works — Premium */}
            <div
              className="bg-white dark:bg-[#161A21] border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] rounded-2xl p-4 shadow-premium"
            >
              <h4 className="text-caption-premium text-[#0E1116] dark:text-[#FAF7F2] mb-3">{t('insureGPT.howItWorks')}</h4>
              <div className="space-y-2.5">
                {[
                  { step: '1', textKey: 'insureGPT.step1' },
                  { step: '2', textKey: 'insureGPT.step2' },
                  { step: '3', textKey: 'insureGPT.step3' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#F4E5DD] text-[#B8482C] dark:bg-[rgba(212,99,63,0.15)] dark:text-[#D4633F] flex items-center justify-center text-[10px] font-bold shrink-0">
                      {item.step}
                    </div>
                    <span className="text-xs text-[#4A4F57] dark:text-[#B8BCC2]">{t(item.textKey)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button — On the LEFT side */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={handleOpenInsureGPT}
                className="btn-stripe min-h-[48px]"
              >
                <MessageCircle className="w-4 h-4" />
                {t('insureGPT.chatCTA')}
              </button>
              <a
                href="https://wa.me/919257877312"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ShinyButton
                  variant="secondary"
                  className="text-sm min-h-[48px]"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    {t('insureGPT.whatsappExpert')}
                  </span>
                </ShinyButton>
              </a>
            </div>

            {/* PaliwalSecure Brand Badge */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-white/[0.04] text-[#4A4F57] dark:text-[#B8BCC2] border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.08)] text-caption-premium text-[0.65rem]">
                <Zap className="w-3 h-3" />
                <span>{t('insureGPT.poweredBy')}</span>
              </div>
            </div>
          </div>

          {/* ── Right Chat Panel (3 cols) ───────────────────────────────── */}
          <div className="col-span-1 lg:col-span-3">
            <div
              className="bg-white dark:bg-[#161A21] border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] shadow-premium-xl rounded-2xl overflow-hidden flex flex-col h-[420px] sm:h-[550px] lg:h-[650px]"
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] bg-[#0E1116] dark:bg-[#161A21]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-lg bg-[#D4633F] flex items-center justify-center shadow-premium-sm">
                      <Brain className="w-4 h-4 text-[#FAF7F2]" />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0E1116] dark:border-[#161A21]" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[#FAF7F2] font-body">InsureGPT</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-emerald-400 font-medium">{t('insureGPT.online')}</span>
                      <SparkleIcon />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Language Toggle — visible on mobile too */}
                  <div className="flex gap-1">
                    {languageOptions.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => handleLanguageChange(opt.code)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all duration-200 border ${
                          language === opt.code
                            ? 'bg-[#D4633F] text-[#FAF7F2] border-[#D4633F] shadow-premium-sm'
                            : 'bg-white/10 text-white/60 border-white/15 hover:border-[#D4633F]/50 hover:text-[#FAF7F2]'
                        }`}
                        aria-label={`Switch to ${opt.code}`}
                      >
                        {t(opt.labelKey)}
                      </button>
                    ))}
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(212,99,63,0.15)] text-[#D4633F] text-caption-premium text-[0.6rem]">
                    {t('insureGPT.byBrand')}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                    aria-label="Reset chat"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Quick Action Buttons — Premium badges */}
              <div className="px-4 py-2.5 border-b border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] bg-[#FAF7F2] dark:bg-[#0E1116]/50">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {allQuickActionKeys.map((action) => (
                    <button
                      key={action.key}
                      onClick={() => handleQuickAction(t(action.key))}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4E5DD] dark:bg-[rgba(212,99,63,0.12)] text-[#8B3520] dark:text-[#D4633F] text-caption-premium text-[0.6rem] hover:scale-105 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap transition-transform duration-200"
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
                className="flex-1 overflow-y-auto px-5 py-5 space-y-5 premium-scrollbar bg-white dark:bg-[#0E1116]"
              >
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
                          <div className="w-7 h-7 rounded-lg bg-[#0E1116] dark:bg-[#D4633F] flex items-center justify-center shrink-0 mt-0.5 shadow-premium-sm">
                            <Brain className="w-3.5 h-3.5 text-[#FAF7F2]" />
                          </div>
                          {/* Bot Message Bubble */}
                          <div className="bg-[#FAF7F2] dark:bg-[#1A1F27] text-[#0E1116] dark:text-[#FAF7F2] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)]">
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
                        /* User Message Bubble — Primary accent */
                        <div className="bg-[#0E1116] dark:bg-[#D4633F] text-[#FAF7F2] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed max-w-[85%] shadow-premium font-medium border border-[rgba(14,17,22,0.20)] dark:border-[rgba(212,99,63,0.30)]">
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
                        className="w-7 h-7 rounded-lg bg-[#0E1116] dark:bg-[#D4633F] flex items-center justify-center shrink-0 mt-0.5 shadow-premium-sm"
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <Brain className="w-3.5 h-3.5 text-[#FAF7F2]" />
                      </motion.div>
                      {/* Typing Bubble */}
                      <div className="bg-[#FAF7F2] dark:bg-[#1A1F27] rounded-2xl rounded-tl-sm px-4 py-3 border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] flex items-center gap-2">
                        <span className="text-xs text-[#B8482C] dark:text-[#D4633F] font-medium font-body">InsureGPT</span>
                        <TypingDots />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestion Chips — Premium */}
              {suggestions.length > 0 && !isLoading && messages.length > 0 && (
                <div className="px-5 py-2.5 border-t border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] bg-[#FAF7F2] dark:bg-[#0E1116]/50">
                  <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6EFEE] dark:bg-[rgba(45,122,119,0.12)] text-[#1B4D4A] dark:text-[#2D7A77] text-caption-premium text-[0.6rem] cursor-pointer whitespace-nowrap shrink-0 transition-colors duration-200 hover:bg-[#1B4D4A] hover:text-[#FAF7F2] dark:hover:bg-[#2D7A77] dark:hover:text-[#0E1116]"
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
              <div className="px-5 py-3 border-t border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] bg-white dark:bg-[#0E1116]">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  {/* Voice Input Button */}
                  <Button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`h-10 w-10 rounded-xl shrink-0 transition-all duration-200 px-0 ${
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
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t('insureGPT.placeholder')}
                    disabled={isLoading}
                    className="flex-1 h-10 px-3 text-sm rounded-xl bg-white dark:bg-[#1A1F27] border border-[rgba(14,17,22,0.08)] dark:border-[rgba(250,247,242,0.10)] text-[#0E1116] dark:text-[#FAF7F2] placeholder:text-[#8B9099] dark:placeholder:text-[#8B9099] focus:border-[#B8482C] dark:focus:border-[#D4633F] focus:ring-2 focus:ring-[#B8482C]/10 dark:focus:ring-[#D4633F]/15 focus:outline-none transition-colors duration-200 disabled:opacity-50"
                  />
                  <SendStopButton
                    isLoading={isLoading}
                    onStop={handleStopGenerating}
                    disabled={!input.trim() && !isLoading}
                    className="disabled:opacity-40"
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
        </motion.div>
      </div>

      {/* Section divider */}
      <div className="h-px w-full bg-[rgba(14,17,22,0.08)] dark:bg-[rgba(250,247,242,0.10)]" />
    </section>
  );
}
