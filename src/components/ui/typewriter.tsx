'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════════════
   TypewriterText — Premium Typewriter Effect Component
   Types out text character by character with a blinking gold cursor.
   Cycles through an array of words with configurable speeds.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TypewriterTextProps {
  /** Array of words/phrases to cycle through */
  words: string[];
  /** Static prefix text that doesn't type (e.g. "Insurance Made") */
  prefix?: string;
  /** Typing speed in ms per character (default: 80) */
  typingSpeed?: number;
  /** Deleting speed in ms per character (default: 40) */
  deleteSpeed?: number;
  /** Pause duration after word is fully typed (default: 2000ms) */
  pauseDuration?: number;
  /** Additional CSS classes */
  className?: string;
  /** Color for the typed text (default: white) */
  textColor?: string;
  /** Color for the blinking cursor (default: gold #C98A1C) */
  cursorColor?: string;
}

type TypewriterPhase = 'typing' | 'pausing' | 'deleting';

export default function TypewriterText({
  words,
  prefix,
  typingSpeed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
  className = '',
  textColor = '#FFFFFF',
  cursorColor = '#C98A1C',
}: TypewriterTextProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phase, setPhase] = useState<TypewriterPhase>('typing');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWord = words[wordIndex % words.length];

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimeouts();

    if (phase === 'typing') {
      if (displayText.length < currentWord.length) {
        // Type next character
        timeoutRef.current = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing — pause
        timeoutRef.current = setTimeout(() => {
          setPhase('pausing');
        }, typingSpeed);
      }
    } else if (phase === 'pausing') {
      timeoutRef.current = setTimeout(() => {
        setPhase('deleting');
      }, pauseDuration);
    } else if (phase === 'deleting') {
      if (displayText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
      } else {
        // Move to next word — wrapped in setTimeout to avoid synchronous setState in effect
        timeoutRef.current = setTimeout(() => {
          setWordIndex((prev) => (prev + 1) % words.length);
          setPhase('typing');
        }, deleteSpeed);
      }
    }

    return clearTimeouts;
  }, [displayText, phase, currentWord, typingSpeed, deleteSpeed, pauseDuration, words.length, clearTimeouts]);

  return (
    <span className={className} style={{ color: textColor }}>
      {prefix && <span>{prefix} </span>}
      <span style={{ color: textColor }}>{displayText}</span>
      <motion.span
        style={{ color: cursorColor }}
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0, 0, 1, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'steps(1)',
          times: [0, 0.4, 0.4, 0.6, 0.6, 1],
        }}
      >
        |
      </motion.span>
    </span>
  );
}
