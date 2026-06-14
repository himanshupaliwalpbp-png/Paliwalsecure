'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Bot, User, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/lib/i18n';

/* ────────────────────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────────────────────── */

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

/* ────────────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────────────── */

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Mock AI response logic — structured for easy OpenAI API integration later */
function getMockAIResponse(userMessage: string, t: (key: string) => string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('health') || lower.includes('हेल्थ') || lower.includes('medical') || lower.includes('hospital')) {
    return t('v2.chat.healthResponse');
  }
  if (lower.includes('motor') || lower.includes('car') || lower.includes('bike') || lower.includes('vehicle') || lower.includes('कार') || lower.includes('मोटर')) {
    return t('v2.chat.motorResponse');
  }
  return t('v2.chat.defaultResponse');
}

/* ────────────────────────────────────────────────────────────────────────────
   Quick Pill Component
   ──────────────────────────────────────────────────────────────────────────── */

function QuickPill({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium
                 dark:bg-[#0A1330] bg-sky-50 dark:text-[#8A96A8] text-slate-600 border border-[#C98A1C]/15
                 hover:bg-[#C98A1C]/10 hover:border-[#C98A1C]/30 hover:text-[#C98A1C]
                 transition-all duration-200 shrink-0
                 disabled:opacity-40 disabled:cursor-not-allowed
                 active:scale-95 whitespace-nowrap"
    >
      {label}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   ChatButtonWrapper Component — Floating InsureGPT Chat
   ──────────────────────────────────────────────────────────────────────────── */

export default function ChatButtonWrapper() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  // Listen for custom event to open chat from other components
  useEffect(() => {
    const handleOpenChat = () => setOpen(true);
    window.addEventListener('open-insuregpt', handleOpenChat);
    return () => window.removeEventListener('open-insuregpt', handleOpenChat);
  }, []);

  // Track whether we've shown the welcome message
  const [welcomeShown, setWelcomeShown] = useState(false);

  // Initial welcome message when chat opens
  useEffect(() => {
    if (open && !welcomeShown) {
      setWelcomeShown(true); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [open, welcomeShown]);

  // Set welcome messages when welcomeShown becomes true
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (welcomeShown && !hasInitialized.current) {
      hasInitialized.current = true;
      setMessages([ // eslint-disable-line react-hooks/set-state-in-effect
        {
          id: generateId(),
          role: 'bot' as const,
          content: t('v2.chat.welcome'),
          timestamp: new Date(),
        },
      ]);
    }
  }, [welcomeShown, t]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 300);
    }
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Send message handler
  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);

      // Simulate typing delay (500ms) then show response
      setTimeout(() => {
        const botResponse = getMockAIResponse(text, t);
        const botMessage: ChatMessage = {
          id: generateId(),
          role: 'bot',
          content: botResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 500);
    },
    [isTyping, t]
  );

  // Quick pill click
  const handleQuickPill = (pillText: string) => {
    sendMessage(pillText);
  };

  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* ── Floating Chat Button ──────────────────────────────────────── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] shadow-xl shadow-[#C98A1C]/30 hover:shadow-[#C98A1C]/50 flex items-center justify-center cursor-pointer transition-shadow duration-300 group"
            aria-label="Chat with InsureGPT"
            data-insuregpt-trigger
          >
            {/* Pulse animation — gold glow */}
            <span className="absolute inset-0 rounded-full animate-ping bg-[#C98A1C]/20" />
            <span className="absolute -inset-1 rounded-full animate-pulse bg-[#C98A1C]/10" />

            <MessageCircle className="w-6 h-6 text-[#060B1E] relative z-10 group-hover:scale-110 transition-transform duration-200" />

            {/* Green online dot */}
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-[#C98A1C] z-10" />

            <span className="sr-only">Chat with InsureGPT</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Dialog ─────────────────────────────────────────────────── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="glass-card border-[#C98A1C]/30 dark:bg-[#0A1330]/95 bg-white/95 backdrop-blur-xl dark:text-white text-slate-900 p-0 gap-0 overflow-hidden flex flex-col top-auto left-0 right-0 bottom-0 translate-x-0 translate-y-0 h-[85dvh] max-w-full rounded-t-2xl rounded-b-none sm:top-[50%] sm:left-[50%] sm:right-auto sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] sm:h-auto sm:max-h-[80vh] sm:max-w-lg sm:rounded-2xl"
          showCloseButton={false}
        >
          {/* ── Chat Header ── */}
          <DialogHeader className="p-0">
            <div className="relative bg-gradient-to-r from-slate-100 via-sky-50 to-slate-100 dark:from-[#0A1330] dark:via-[#0F1C40] dark:to-[#0A1330] px-4 py-3 border-b border-[#C98A1C]/20">
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#C98A1C]/5 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#C98A1C]/5 rounded-full" />

              <div className="relative z-10 flex items-center justify-between">
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center shadow-lg shadow-[#C98A1C]/20">
                      <Bot className="w-5 h-5 text-[#060B1E]" />
                    </div>
                    {/* Online status indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22C55E] rounded-full border-2 dark:border-[#0A1330] border-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold dark:text-white text-slate-900 leading-tight">
                      {t('v2.chat.header')}
                    </DialogTitle>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
                      <span className="text-[11px] dark:text-[#8A96A8] text-slate-500 font-medium">
                        {t('v2.chat.online')} • AI Insurance Advisor
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Close button */}
                <button
                  onClick={() => {
                    setOpen(false);
                    window.dispatchEvent(new CustomEvent('close-insuregpt'));
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center dark:text-[#8A96A8] text-slate-500 dark:hover:text-white hover:text-slate-900 dark:hover:bg-white/10 hover:bg-slate-100 transition-colors duration-200"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </DialogHeader>

          {/* ── Quick Pills ── */}
          <div className="px-4 py-2.5 border-b border-[#C98A1C]/10 dark:bg-[#060B1E]/50 bg-slate-100/50 flex gap-1.5 overflow-x-auto scrollbar-none">
            <QuickPill
              label={t('v2.chat.pillHealth')}
              onClick={() => handleQuickPill('Health Insurance')}
              disabled={isTyping}
            />
            <QuickPill
              label={t('v2.chat.pillMotor')}
              onClick={() => handleQuickPill('Motor Insurance')}
              disabled={isTyping}
            />
            <QuickPill
              label={t('v2.chat.pillLife')}
              onClick={() => handleQuickPill('Life Insurance')}
              disabled={isTyping}
            />
          </div>

          {/* ── Messages Area ── */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 scrollbar-chat dark:bg-[#060B1E]/30 bg-slate-50/50">
            <div className="space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-2.5 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  {msg.role === 'bot' ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center shrink-0 shadow-md shadow-[#C98A1C]/15">
                      <Bot className="w-4 h-4 text-[#060B1E]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br dark:from-[#0F1C40] dark:to-[#162D5A] from-sky-100 to-sky-200 flex items-center justify-center shrink-0 shadow-md dark:shadow-[#0F1C40]/15 shadow-sky-200/15">
                      <User className="w-4 h-4 dark:text-[#8A96A8] text-slate-600" />
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] break-words rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#060B1E] rounded-tr-sm shadow-md shadow-[#C98A1C]/15'
                        : 'dark:bg-[#0A1330] bg-sky-50 border border-[#C98A1C]/15 dark:text-[#8A96A8] text-slate-600 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center shrink-0 shadow-md shadow-[#C98A1C]/15">
                    <Bot className="w-4 h-4 text-[#060B1E]" />
                  </div>
                  <div className="dark:bg-[#0A1330] bg-sky-50 border border-[#C98A1C]/15 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 rounded-full bg-[#C98A1C]"
                          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ── Input Area ── */}
          <div className="px-4 py-3 border-t border-[#C98A1C]/15 dark:bg-[#0A1330]/80 bg-white/80">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('v2.chat.placeholder')}
                disabled={isTyping}
                className="flex-1 h-10 rounded-full text-sm border-[#C98A1C]/20 dark:bg-[#060B1E] bg-slate-100 dark:text-white text-slate-900 dark:placeholder:text-[#8A96A8]/50 placeholder:text-slate-400 focus-visible:ring-[#C98A1C]/30 focus-visible:border-[#C98A1C]/40 px-4"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isTyping}
                className="h-10 w-10 rounded-full bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-[#060B1E] shadow-lg shadow-[#C98A1C]/20 disabled:opacity-40 shrink-0 transition-all duration-200 hover:shadow-[#C98A1C]/40"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>

            {/* Footer note */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <Sparkles className="w-2.5 h-2.5 text-[#C98A1C]" />
              <span className="text-[9px] dark:text-[#8A96A8] text-slate-400/60">
                IRDAI Registered POSP • AI Powered
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
