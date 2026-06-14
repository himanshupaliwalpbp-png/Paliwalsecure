'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface QuickReply {
  label: string;
  value: string;
}

interface InsureGPTChatInterfaceProps {
  onSendMessage?: (message: string) => Promise<string>;
  quickReplies?: QuickReply[];
  className?: string;
}

export default function InsureGPTChatInterface({
  onSendMessage,
  quickReplies = [
    { label: 'Health Insurance', value: 'Mujhe health insurance ke bare mein batao' },
    { label: 'Car Insurance', value: 'Car insurance ke liye best plan kaun sa hai?' },
    { label: 'Claim Process', value: 'Claim kaise file karte hain?' },
  ],
  className = '',
}: InsureGPTChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content:
        'Namaste! 🙏 Main InsureGPT hoon, aapka AI insurance advisor. Aapke insurance ke bare mein kuch poochna hai?',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setShowQuickReplies(false);
    setIsLoading(true);

    try {
      let aiResponse = 'Samajh gaya! Ek minute...';

      if (onSendMessage) {
        aiResponse = await onSendMessage(message);
      } else {
        // Try the /api/chat endpoint
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
          });
          if (res.ok) {
            const data = await res.json();
            aiResponse = data.response || data.message || aiResponse;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            aiResponse = `Aapka sawaal: "${message}". Main iska jawab dhundh raha hoon... Kripya WhatsApp par chat karein for instant help!`;
          }
        } catch {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          aiResponse = `Aapka sawaal: "${message}". Main iska jawab dhundh raha hoon... Kripya WhatsApp par chat karein for instant help!`;
        }
      }

      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        type: 'ai',
        content:
          'Maafi chahta hoon, kuch technical issue aya hai. WhatsApp par 9257877312 par contact kijiye.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.value);
  };

  return (
    <div
      className={`
        flex flex-col h-full max-h-[600px] rounded-2xl
        dark:bg-gradient-to-b dark:from-[#0A192F]/80 dark:to-[#020617]/80
        bg-gradient-to-b from-white/90 to-sky-50/90
        backdrop-blur-xl
        dark:border-white/10 border-slate-200/60
        shadow-2xl overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div className="dark:bg-gradient-to-r dark:from-[#C98A1C]/10 dark:to-[#00BFA5]/10 bg-gradient-to-r from-[#C98A1C]/5 to-sky-100/50 dark:border-white/10 border-slate-200/40 border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C98A1C] to-[#E0A830] flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="dark:text-white text-slate-900 font-bold">
              InsureGPT
            </h3>
            <p className="text-xs dark:text-gray-400 text-slate-500">
              Aapka AI insurance advisor
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 dark:bg-[#060B1E]/30 bg-slate-50/30">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-xs px-4 py-3 rounded-lg
                  ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white rounded-br-none'
                      : 'dark:bg-white/10 bg-white/80 backdrop-blur-sm dark:text-white text-slate-800 dark:border-white/20 border-slate-200/60 border rounded-bl-none'
                  }
                `}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="dark:bg-white/10 bg-white/80 backdrop-blur-sm dark:text-white text-slate-800 px-4 py-3 rounded-lg rounded-bl-none dark:border-white/20 border-slate-200/60 border">
              <div className="flex gap-2">
                {[0, 0.1, 0.2].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-[#C98A1C] rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      <AnimatePresence>
        {showQuickReplies && !isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 py-4 dark:border-white/10 border-slate-200/40 border-t space-y-2"
          >
            <p className="text-xs dark:text-gray-400 text-slate-500 mb-2">
              Quick suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs px-3 py-2 rounded-full dark:bg-white/10 bg-sky-50 dark:hover:bg-[#C98A1C]/20 hover:bg-[#C98A1C]/10 dark:text-white text-slate-700 dark:border-white/20 border-slate-200/60 border dark:hover:border-[#C98A1C]/50 hover:border-[#C98A1C]/50 transition-all"
                >
                  {reply.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="dark:border-white/10 border-slate-200/40 border-t dark:bg-[#020617]/50 bg-white/50 px-6 py-4 flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
          placeholder="Apna sawaal likho..."
          className="flex-1 dark:bg-white/5 bg-slate-100 dark:border-white/20 border-slate-200/60 border rounded-lg px-4 py-2 dark:text-white text-slate-900 dark:placeholder-gray-500 placeholder-slate-400 focus:outline-none dark:focus:border-[#C98A1C]/50 focus:border-[#C98A1C]/50 transition-colors"
          disabled={isLoading}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSendMessage(inputValue)}
          disabled={isLoading || !inputValue.trim()}
          className="bg-gradient-to-r from-[#C98A1C] to-[#E0A830] text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#C98A1C]/50 disabled:opacity-50 transition-all"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
