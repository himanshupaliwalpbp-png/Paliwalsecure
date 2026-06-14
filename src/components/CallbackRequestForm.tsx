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
import { useLanguage } from '@/lib/i18n';

interface CallbackRequestFormProps {
  source?: 'chatbot' | 'website' | 'whatsapp';
  onSuccess?: () => void;
  className?: string;
}

export default function CallbackRequestForm({
  source = 'chatbot',
  onSuccess,
  className = '',
}: CallbackRequestFormProps) {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const isEnglish = language === 'en';

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Localized strings
  const t = {
    headerBadge: isHindi ? 'कॉलबैक अनुरोध' : isEnglish ? 'Callback Request' : 'Callback Request',
    heading: isHindi ? 'हम आपको कॉल करें! 📞' : isEnglish ? 'We\'ll Call You! 📞' : 'Hum Aapko Call Karein! 📞',
    subheading: isHindi ? 'अपना विवरण भरें, हमारी विशेषज्ञ टीम आपको कॉल करेगी' : isEnglish ? 'Fill in your details, our expert team will call you' : 'Apna details daalein, hamari expert team aapko call karegi',
    nameLabel: isHindi ? 'आपका नाम' : isEnglish ? 'Your Name' : 'Aapka Naam',
    namePlaceholder: isHindi ? 'अपना नाम लिखें' : isEnglish ? 'Enter your name' : 'Apna naam likhiye',
    mobileLabel: isHindi ? 'मोबाइल नंबर' : isEnglish ? 'Mobile Number' : 'Mobile Number',
    timeLabel: isHindi ? 'कब कॉल करें?' : isEnglish ? 'When to Call?' : 'Kab Call Karein?',
    timePlaceholder: isHindi ? 'पसंदीदा समय चुनें' : isEnglish ? 'Choose preferred time' : 'Preferred time choose karein',
    messageLabel: isHindi ? 'संदेश' : isEnglish ? 'Message' : 'Message',
    messageOptional: isHindi ? '(वैकल्पिक)' : isEnglish ? '(optional)' : '(optional)',
    messagePlaceholder: isHindi ? 'कोई विशिष्ट प्रश्न या संदर्भ लिखें...' : isEnglish ? 'Any specific question or context...' : 'Koi specific sawaal ya context likhiye...',
    submitBtn: isHindi ? 'कॉलबैक अनुरोध भेजें' : isEnglish ? 'Send Callback Request' : 'Callback Request Bhejein',
    submitting: isHindi ? 'भेज रहे हैं...' : isEnglish ? 'Sending...' : 'Bhej rahe hain...',
    trustNote: isHindi ? '🔒 आपका डेटा सुरक्षित है। हम स्पैम नहीं करेंगे।' : isEnglish ? '🔒 Your data is safe. We won\'t spam you.' : '🔒 Aapka data safe hai. Hum spam nahi karenge.',
    successHeading: isHindi ? 'कॉलबैक अनुरोध भेज दिया! 🎉' : isEnglish ? 'Callback Request Sent! 🎉' : 'Callback Request Bhej Diya! 🎉',
    successSubtext: isHindi ? 'हमारी टीम जल्द आपको कॉल करेगी। धन्यवाद!' : isEnglish ? 'Our team will call you soon. Thank you!' : 'Hamari team jaldi aapko call karegi. Dhanyavaad!',
    asapCall: isHindi ? 'जल्द से जल्द कॉल होगा' : isEnglish ? 'Call as soon as possible' : 'Jaldi se jaldi call hoga',
    within1hr: isHindi ? '1 घंटे के भीतर' : isEnglish ? 'Within 1 hour' : '1 ghante ke andar',
    between2to5: isHindi ? 'दोपहर 2-5 बजे के बीच' : isEnglish ? 'Between 2-5 PM' : '2-5 PM ke beech',
    nameError: isHindi ? 'नाम कम से कम 2 अक्षर का होना चाहिए' : isEnglish ? 'Name must be at least 2 characters' : 'Naam kam se kam 2 characters ka hona chahiye',
    mobileError: isHindi ? 'सही 10-अंकीय भारतीय मोबाइल नंबर डालें (6-9 से शुरू)' : isEnglish ? 'Enter a valid 10-digit Indian mobile number (starts with 6-9)' : 'Sahi 10-digit Indian mobile number daalein (6-9 se shuru)',
    timeError: isHindi ? 'कृपया पसंदीदा समय चुनें' : isEnglish ? 'Please select preferred time' : 'Kripya preferred time select karein',
    connectionError: isHindi ? 'कनेक्शन में समस्या है। दोबारा प्रयास करें।' : isEnglish ? 'Connection issue. Please try again.' : 'Connection mein dikkat aa rahi hai. Dobara try karein.',
    genericError: isHindi ? 'कुछ गड़बड़ हो गई। दोबारा प्रयास करें।' : isEnglish ? 'Something went wrong. Please try again.' : 'Kuch gadbad ho gayi. Dobara try karein.',
    digitsRemaining: (n: number) => isHindi ? `${n} और अंक डालें` : isEnglish ? `${n} more digits needed` : `${n} aur digit daalein`,
    invalidStart: isHindi ? 'नंबर 6-9 से शुरू होना चाहिए' : isEnglish ? 'Number should start with 6-9' : 'Number 6-9 se shuru hona chahiye',
    validNumber: isHindi ? '✓ सही नंबर है' : isEnglish ? '✓ Valid number' : '✓ Sahi number hai',
  };

  const PREFERRED_TIME_OPTIONS = [
    { value: 'asap', label: isHindi ? 'जल्द से जल्द' : isEnglish ? 'ASAP' : 'ASAP - Jaldi se jaldi', icon: '⚡' },
    { value: '1hour', label: isHindi ? '1 घंटे के भीतर' : isEnglish ? 'Within 1 Hour' : 'Within 1 Hour', icon: '🕐' },
    { value: '2-5pm', label: isHindi ? 'दोपहर 2-5 बजे' : isEnglish ? 'Between 2-5 PM' : 'Between 2-5 PM', icon: '📅' },
  ] as const;

  const validateMobile = (value: string): boolean => {
    return /^[6-9]\d{9}$/.test(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (name.trim().length < 2) {
      setError(t.nameError);
      return;
    }

    if (!validateMobile(mobile)) {
      setError(t.mobileError);
      return;
    }

    if (!preferredTime) {
      setError(t.timeError);
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
        setError(data.error || t.genericError);
      }
    } catch {
      setError(t.connectionError);
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
                backgroundColor: ['#C98A1C', '#C98A1C', '#f59e0b', '#10b981', '#ef4444', '#C98A1C'][i % 6],
              }}
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0.5],
                y: [0, -30 - Math.random() * 40, -60 - Math.random() * 40],
                x: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 80],
              }}
              transition={{ duration: 1.5, delay: i * 0.05, ease: 'easeOut' as const }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' as const, stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
        >
          <CheckCircle2 className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
          {t.successHeading}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {t.successSubtext}
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
            {preferredTime === 'asap' ? t.asapCall :
             preferredTime === '1hour' ? t.within1hr : t.between2to5}
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
          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">{t.headerBadge}</span>
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          {t.heading}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.subheading}
        </p>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="cb-name" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          {t.nameLabel}
        </Label>
        <Input
          id="cb-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.namePlaceholder}
          disabled={isSubmitting}
          className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-300 text-sm"
        />
      </div>

      {/* Mobile */}
      <div className="space-y-1.5">
        <Label htmlFor="cb-mobile" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" />
          {t.mobileLabel}
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
            placeholder="9876543210"
            disabled={isSubmitting}
            className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-300 text-sm pl-12"
            maxLength={10}
          />
        </div>
        {mobile.length > 0 && mobile.length < 10 && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400">{t.digitsRemaining(10 - mobile.length)}</p>
        )}
        {mobile.length === 10 && !validateMobile(mobile) && (
          <p className="text-[11px] text-red-500">{t.invalidStart}</p>
        )}
        {mobile.length === 10 && validateMobile(mobile) && (
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">{t.validNumber}</p>
        )}
      </div>

      {/* Preferred Time */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {t.timeLabel}
        </Label>
        <Select value={preferredTime} onValueChange={setPreferredTime} disabled={isSubmitting}>
          <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-sm">
            <SelectValue placeholder={t.timePlaceholder} />
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
          {t.messageLabel} <span className="text-slate-400 font-normal">{t.messageOptional}</span>
        </Label>
        <Textarea
          id="cb-message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 500))}
          placeholder={t.messagePlaceholder}
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
            {t.submitting}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {t.submitBtn}
          </span>
        )}
      </Button>

      {/* Trust indicator */}
      <p className="text-center text-[10px] text-slate-400 mt-1">
        {t.trustNote}
      </p>
    </form>
  );
}
