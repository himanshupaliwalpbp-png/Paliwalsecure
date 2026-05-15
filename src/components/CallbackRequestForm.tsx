'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CheckCircle2, Loader2, Clock, MessageSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CallbackRequestFormProps {
  source?: 'chatbot' | 'website' | 'whatsapp';
  onSuccess?: () => void;
  className?: string;
}

const PREFERRED_TIME_OPTIONS = [
  { value: 'asap', label: 'ASAP - Jaldi se jaldi', icon: '⚡' },
  { value: '1hour', label: 'Within 1 Hour', icon: '🕐' },
  { value: '2-5pm', label: 'Between 2-5 PM', icon: '📅' },
] as const;

export default function CallbackRequestForm({
  source = 'chatbot',
  onSuccess,
  className = '',
}: CallbackRequestFormProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateMobile = (value: string): boolean => {
    return /^[6-9]\d{9}$/.test(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (name.trim().length < 2) {
      setError('Naam kam se kam 2 characters ka hona chahiye');
      return;
    }

    if (!validateMobile(mobile)) {
      setError('Sahi 10-digit Indian mobile number daalein (6-9 se shuru)');
      return;
    }

    if (!preferredTime) {
      setError('Kripya preferred time select karein');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          mobile,
          preferredTime,
          message: message.trim() || undefined,
          source,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        onSuccess?.();
      } else {
        setError(data.error || 'Kuch gadbad ho gayi. Dobara try karein.');
      }
    } catch {
      setError('Connection mein dikkat aa rahi hai. Dobara try karein.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state with confetti effect
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center py-8 px-4 ${className}`}
      >
        {/* Confetti dots */}
        <div className="relative">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 30}%`,
                backgroundColor: ['#6366f1', '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'][i % 6],
              }}
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0.5],
                y: [0, -30 - Math.random() * 40, -60 - Math.random() * 40],
                x: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 80],
              }}
              transition={{ duration: 1.5, delay: i * 0.05, ease: 'easeOut' }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
        >
          <CheckCircle2 className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
          Callback Request Bhej Diya! 🎉
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Hamari team jaldi aapko call karegi. Dhanyavaad!
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            {preferredTime === 'asap' ? 'Jaldi se jaldi call hoga' :
             preferredTime === '1hour' ? '1 ghante ke andar' : '2-5 PM ke beech'}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 mb-3">
          <Phone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Callback Request</span>
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Hum Aapko Call Karein! 📞
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Apna details daalein, hamari expert team aapko call karegi
        </p>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="cb-name" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          Aapka Naam
        </Label>
        <Input
          id="cb-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Apna naam likhiye"
          disabled={isSubmitting}
          className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-300 text-sm"
        />
      </div>

      {/* Mobile */}
      <div className="space-y-1.5">
        <Label htmlFor="cb-mobile" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" />
          Mobile Number
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">+91</span>
          <Input
            id="cb-mobile"
            value={mobile}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              setMobile(val);
            }}
            placeholder="9257877312"
            disabled={isSubmitting}
            className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-300 text-sm pl-12"
            maxLength={10}
          />
        </div>
        {mobile.length > 0 && mobile.length < 10 && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400">{10 - mobile.length} aur digit daalein</p>
        )}
        {mobile.length === 10 && !validateMobile(mobile) && (
          <p className="text-[11px] text-red-500">Number 6-9 se shuru hona chahiye</p>
        )}
        {mobile.length === 10 && validateMobile(mobile) && (
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">✓ Sahi number hai</p>
        )}
      </div>

      {/* Preferred Time */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Kab Call Karein?
        </Label>
        <Select value={preferredTime} onValueChange={setPreferredTime} disabled={isSubmitting}>
          <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-sm">
            <SelectValue placeholder="Preferred time choose karein" />
          </SelectTrigger>
          <SelectContent>
            {PREFERRED_TIME_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <span className="flex items-center gap-2">
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Message (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="cb-message" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Message <span className="text-slate-400 font-normal">(optional)</span>
        </Label>
        <Textarea
          id="cb-message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 500))}
          placeholder="Koi specific sawaal ya context likhiye..."
          disabled={isSubmitting}
          rows={3}
          className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-300 text-sm resize-none"
        />
        <p className="text-[10px] text-slate-400 text-right">{message.length}/500</p>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
          >
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !name.trim() || !validateMobile(mobile) || !preferredTime}
        className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Bhej rahe hain...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Callback Request Bhejein
          </span>
        )}
      </Button>

      {/* Trust indicator */}
      <p className="text-center text-[10px] text-slate-400 mt-1">
        🔒 Aapka data safe hai. Hum spam nahi karenge.
      </p>
    </form>
  );
}
