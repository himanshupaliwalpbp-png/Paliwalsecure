'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export type CharacterMood = 'idle' | 'thinking' | 'happy' | 'excited' | 'pointing' | 'waving' | 'reading';

interface FormCharacter3DProps {
  mood?: CharacterMood;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
  onCharacterClick?: () => void;
}

// ─────────────────────────────────────────────────────────────
// Speech Bubble
// ─────────────────────────────────────────────────────────────
function SpeechBubble({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{ type: 'tween' as const, duration: 0.3 }}
          className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full mb-2 z-20"
        >
          <div
            className="relative text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl max-w-[200px] sm:max-w-[240px] text-center whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #00A9A6, #00838F)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,169,166,0.4), 0 0 60px rgba(0,169,166,0.15)',
            }}
          >
            {message}
            <div
              className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
              style={{ background: '#00838F', borderRight: '1px solid rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────
// Sparkle Particles
// ─────────────────────────────────────────────────────────────
const SPARKLE_COLORS = ['#00A9A6', '#F59E0B', '#C98A1C', '#C98A1C', '#10B981'];

function SparkleParticles({ active }: { active: boolean }) {
  if (!active) return null;

  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 30) * (Math.PI / 180),
    delay: i * 0.08,
    color: SPARKLE_COLORS[i % 5],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
          style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
          animate={{
            x: [0, Math.cos(s.angle) * 80],
            y: [0, Math.sin(s.angle) * 80],
            opacity: [0, 1, 0],
            scale: [0, 2, 0],
          }}
          transition={{
            duration: 1.2,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Floating Ring Animation
// ─────────────────────────────────────────────────────────────
function FloatingRing({ size }: { size: number }) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{
        width: size * 1.6,
        height: size * 1.6,
        border: '2px solid rgba(0,169,166,0.15)',
        boxShadow: '0 0 20px rgba(0,169,166,0.08), inset 0 0 20px rgba(0,169,166,0.05)',
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.8, 0.4],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Main 3D Form Character Component
// ─────────────────────────────────────────────────────────────
export default function FormCharacter3D({
  mood = 'idle',
  size = 'md',
  message = '',
  className = '',
  onCharacterClick,
}: FormCharacter3DProps) {
  const [blinkState, setBlinkState] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message);

  const sizeMap = {
    sm: { body: 90, eyeSize: 10, pupilSize: 5, armWidth: 14, armHeight: 30, fontSize: 'text-xs' },
    md: { body: 130, eyeSize: 14, pupilSize: 7, armWidth: 18, armHeight: 42, fontSize: 'text-sm' },
    lg: { body: 170, eyeSize: 18, pupilSize: 9, armWidth: 22, armHeight: 52, fontSize: 'text-base' },
  };

  const s = sizeMap[size];

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 150);
    }, 2500 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Update message when prop changes
  useEffect(() => {
    setCurrentMessage(message);
  }, [message]);

  const bodyAnimation = {
    idle: { y: [0, -6, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } },
    thinking: { y: [0, -3, 0], rotate: [0, -3, 3, 0], transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const } },
    happy: { y: [0, -10, 0], scale: [1, 1.06, 1], transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const } },
    excited: { y: [0, -14, 0], scale: [1, 1.1, 1], transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const } },
    pointing: { y: [0, -4, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const } },
    waving: { y: [0, -8, 0], transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const } },
    reading: { y: [0, -3, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const } },
  };

  const eyeY = mood === 'thinking' ? -2 : mood === 'happy' ? -1 : 0;
  const pupilOffsetX = mood === 'pointing' ? 3 : mood === 'reading' ? -2 : 0;
  const pupilOffsetY = mood === 'thinking' ? -2 : 0;

  const mouthPath: Record<CharacterMood, string> = {
    idle: 'M 35 55 Q 50 62 65 55',
    thinking: 'M 42 56 Q 50 52 58 56',
    happy: 'M 30 52 Q 50 70 70 52',
    excited: 'M 28 50 Q 50 75 72 50',
    pointing: 'M 38 54 Q 50 60 62 54',
    waving: 'M 32 52 Q 50 68 68 52',
    reading: 'M 40 56 Q 50 60 60 56',
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      <SpeechBubble message={currentMessage} visible={!!currentMessage} />
      <SparkleParticles active={mood === 'excited' || mood === 'happy'} />
      <FloatingRing size={s.body} />

      <motion.div
        className="relative cursor-pointer"
        style={{ perspective: '600px' }}
        onClick={onCharacterClick}
        animate={bodyAnimation[mood]}
      >
        <div className="relative" style={{ width: s.body, height: s.body * 1.15, transformStyle: 'preserve-3d' }}>
          {/* LEFT ARM */}
          <motion.div
            className="absolute"
            style={{ left: -s.armWidth * 0.7, top: s.body * 0.4, width: s.armWidth, height: s.armHeight, transformStyle: 'preserve-3d' }}
            animate={mood === 'waving' ? { rotate: [-20, -55, -20], y: [0, -6, 0] } : mood === 'pointing' ? { rotate: [-20, -40, -20], x: [-2, -10, -2] } : mood === 'excited' ? { rotate: [-15, -45, -15], y: [0, -4, 0] } : { rotate: [-10, -18, -10] }}
            transition={mood === 'waving' ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const } : mood === 'pointing' ? { duration: 1, repeat: Infinity, ease: 'easeInOut' as const } : mood === 'excited' ? { duration: 0.4, repeat: Infinity, ease: 'easeInOut' as const } : { duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'linear-gradient(135deg, #00D4D2, #008B8A)',
                boxShadow: 'inset -3px -3px 8px rgba(0,0,0,0.2), 3px 3px 12px rgba(0,0,0,0.15), 0 0 20px rgba(0,169,166,0.3)',
              }}
            />
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: s.armWidth * 0.9,
                height: s.armWidth * 0.9,
                background: 'radial-gradient(circle at 40% 40%, #FFE0B2, #FFB74D)',
                boxShadow: '2px 2px 6px rgba(0,0,0,0.2), 0 0 12px rgba(255,183,77,0.3)',
              }}
            />
          </motion.div>

          {/* RIGHT ARM */}
          <motion.div
            className="absolute"
            style={{ right: -s.armWidth * 0.7, top: s.body * 0.4, width: s.armWidth, height: s.armHeight, transformStyle: 'preserve-3d' }}
            animate={mood === 'waving' ? { rotate: [20, 55, 20], y: [0, -6, 0] } : mood === 'excited' ? { rotate: [15, 45, 15], y: [0, -4, 0] } : mood === 'happy' ? { rotate: [10, 25, 10] } : { rotate: [10, 18, 10] }}
            transition={mood === 'waving' ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.15 } : mood === 'excited' ? { duration: 0.4, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.1 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.5 }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'linear-gradient(135deg, #00D4D2, #008B8A)',
                boxShadow: 'inset 3px -3px 8px rgba(0,0,0,0.2), -3px 3px 12px rgba(0,0,0,0.15), 0 0 20px rgba(0,169,166,0.3)',
              }}
            />
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: s.armWidth * 0.9,
                height: s.armWidth * 0.9,
                background: 'radial-gradient(circle at 60% 40%, #FFE0B2, #FFB74D)',
                boxShadow: '-2px 2px 6px rgba(0,0,0,0.2), 0 0 12px rgba(255,183,77,0.3)',
              }}
            />
          </motion.div>

          {/* SHIELD BODY */}
          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
            whileHover={{ scale: 1.08, rotateY: 8 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
          >
            <svg viewBox="0 0 100 115" width={s.body} height={s.body * 1.15} style={{ filter: 'drop-shadow(0 12px 32px rgba(0,169,166,0.4)) drop-shadow(0 0 60px rgba(0,169,166,0.15))' }}>
              <defs>
                <linearGradient id="shieldGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5E2" />
                  <stop offset="40%" stopColor="#00A9A6" />
                  <stop offset="100%" stopColor="#00695C" />
                </linearGradient>
                <linearGradient id="shieldHighlight3D" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
                <filter id="innerGlow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                  <feFlood floodColor="#00A9A6" floodOpacity="0.3" />
                  <feComposite in2="blur" operator="in" />
                  <feComposite in="SourceGraphic" />
                </filter>
              </defs>

              {/* Outer glow ring */}
              <path d="M 50 3 L 92 18 L 92 55 Q 92 92 50 112 Q 8 92 8 55 L 8 18 Z" fill="none" stroke="rgba(0,169,166,0.2)" strokeWidth="1.5" />

              {/* Shield main body */}
              <path d="M 50 5 L 90 20 L 90 55 Q 90 90 50 110 Q 10 90 10 55 L 10 20 Z" fill="url(#shieldGrad3D)" stroke="#004D40" strokeWidth="1.5" />

              {/* Glass reflection */}
              <path d="M 50 5 L 90 20 L 90 55 Q 90 90 50 110 Q 10 90 10 55 L 10 20 Z" fill="url(#shieldHighlight3D)" opacity="0.4" />

              {/* Inner border */}
              <path d="M 50 15 L 80 27 L 80 52 Q 80 82 50 98 Q 20 82 20 52 L 20 27 Z" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />

              {/* Top shine arc */}
              <path d="M 25 25 Q 50 15 75 25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />

              {/* EYES */}
              <ellipse cx="38" cy="42" rx={s.eyeSize * 0.55} ry={blinkState ? s.eyeSize * 0.08 : s.eyeSize * 0.58} fill="white" style={{ transform: `translateY(${eyeY}px)`, transition: 'ry 0.1s' }} />
              <ellipse cx={38 + pupilOffsetX} cy={42 + pupilOffsetY} rx={s.pupilSize * 0.5} ry={blinkState ? s.pupilSize * 0.06 : s.pupilSize * 0.58} fill="#1a1a2e" style={{ transform: `translateY(${eyeY}px)`, transition: 'ry 0.1s' }} />
              {!blinkState && <circle cx={38 + pupilOffsetX + 2} cy={42 + pupilOffsetY - 2} r={s.pupilSize * 0.22} fill="white" style={{ transform: `translateY(${eyeY}px)` }} />}
              {!blinkState && <circle cx={38 + pupilOffsetX - 1} cy={42 + pupilOffsetY + 1} r={s.pupilSize * 0.1} fill="rgba(255,255,255,0.5)" style={{ transform: `translateY(${eyeY}px)` }} />}

              <ellipse cx="62" cy="42" rx={s.eyeSize * 0.55} ry={blinkState ? s.eyeSize * 0.08 : s.eyeSize * 0.58} fill="white" style={{ transform: `translateY(${eyeY}px)`, transition: 'ry 0.1s' }} />
              <ellipse cx={62 + pupilOffsetX} cy={42 + pupilOffsetY} rx={s.pupilSize * 0.5} ry={blinkState ? s.pupilSize * 0.06 : s.pupilSize * 0.58} fill="#1a1a2e" style={{ transform: `translateY(${eyeY}px)`, transition: 'ry 0.1s' }} />
              {!blinkState && <circle cx={62 + pupilOffsetX + 2} cy={42 + pupilOffsetY - 2} r={s.pupilSize * 0.22} fill="white" style={{ transform: `translateY(${eyeY}px)` }} />}
              {!blinkState && <circle cx={62 + pupilOffsetX - 1} cy={42 + pupilOffsetY + 1} r={s.pupilSize * 0.1} fill="rgba(255,255,255,0.5)" style={{ transform: `translateY(${eyeY}px)` }} />}

              {/* MOUTH */}
              <path d={mouthPath[mood]} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

              {/* Cheek blush */}
              {(mood === 'happy' || mood === 'excited') && (
                <>
                  <ellipse cx="26" cy="52" rx="6" ry="3.5" fill="rgba(255,120,120,0.45)" />
                  <ellipse cx="74" cy="52" rx="6" ry="3.5" fill="rgba(255,120,120,0.45)" />
                </>
              )}

              {/* Thinking dots */}
              {mood === 'thinking' && (
                <>
                  <circle cx="42" cy="8" r="2.5" fill="rgba(255,255,255,0.7)">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="50" cy="4" r="3" fill="rgba(255,255,255,0.8)">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="58" cy="8" r="2.5" fill="rgba(255,255,255,0.7)">
                    <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
                  </circle>
                </>
              )}

              {/* Star eyes for excited */}
              {mood === 'excited' && (
                <>
                  <polygon points="38,36 40.5,41 46,41 41.5,44.5 43,49.5 38,46 33,49.5 34.5,44.5 30,41 35.5,41" fill="#FFD700" opacity="0.95">
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="0.5s" repeatCount="indefinite" />
                  </polygon>
                  <polygon points="62,36 64.5,41 70,41 65.5,44.5 67,49.5 62,46 57,49.5 58.5,44.5 54,41 59.5,41" fill="#FFD700" opacity="0.95">
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="0.5s" repeatCount="indefinite" />
                  </polygon>
                </>
              )}

              {/* Shield emblem in center */}
              <path d="M 44 72 L 56 72 L 56 82 Q 56 88 50 92 Q 44 88 44 82 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
              <line x1="50" y1="75" x2="50" y2="83" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="46" y1="79" x2="54" y2="79" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* FEET */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4">
            <motion.div
              className="rounded-full"
              style={{
                width: s.armWidth * 1.2,
                height: s.armWidth * 0.65,
                background: 'linear-gradient(135deg, #00838F, #004D40)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2), 0 0 16px rgba(0,169,166,0.2)',
              }}
              animate={mood === 'excited' ? { y: [0, -4, 0, -4, 0] } : mood === 'happy' ? { y: [0, -3, 0] } : { y: 0 }}
              transition={mood === 'excited' ? { duration: 0.35, repeat: Infinity } : { duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
            />
            <motion.div
              className="rounded-full"
              style={{
                width: s.armWidth * 1.2,
                height: s.armWidth * 0.65,
                background: 'linear-gradient(135deg, #00838F, #004D40)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2), 0 0 16px rgba(0,169,166,0.2)',
              }}
              animate={mood === 'excited' ? { y: [0, -4, 0, -4, 0] } : mood === 'happy' ? { y: [0, -3, 0] } : { y: 0 }}
              transition={mood === 'excited' ? { duration: 0.35, repeat: Infinity, delay: 0.15 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.3 }}
            />
          </div>

          {/* SHADOW */}
          <motion.div
            className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: s.body * 0.75,
              height: s.body * 0.12,
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.2), transparent)',
            }}
            animate={mood === 'excited' || mood === 'happy' ? { scale: [1, 0.8, 1], opacity: [0.7, 0.4, 0.7] } : { scale: [1, 0.95, 1], opacity: [0.7, 0.55, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
          />
        </div>
      </motion.div>

      {/* Character name */}
      <motion.p
        className="mt-3 font-extrabold tracking-tight"
        style={{
          fontSize: s.fontSize === 'text-xs' ? '0.75rem' : s.fontSize === 'text-sm' ? '0.875rem' : '1rem',
          background: 'linear-gradient(135deg, #00A9A6, #00D4D2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 8px rgba(0,169,166,0.3))',
        }}
        animate={mood === 'excited' ? { scale: [1, 1.12, 1] } : {}}
        transition={{ duration: 0.5, repeat: mood === 'excited' ? Infinity : 0 }}
      >
        InsureBuddy
      </motion.p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Form Character with Auto-Mood
// ─────────────────────────────────────────────────────────────
export function FormCharacterWithAutoMood({
  formStage = 0,
  hasResult = false,
  isCalculating = false,
  size = 'md',
  className = '',
}: {
  formStage?: number;
  hasResult?: boolean;
  isCalculating?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const [clickMood, setClickMood] = useState<CharacterMood | null>(null);
  const [clickMessage, setClickMessage] = useState<string | null>(null);

  const autoMood = useMemo<CharacterMood>(() => {
    if (isCalculating) return 'thinking';
    if (hasResult) return 'excited';
    switch (formStage) {
      case 0: return 'waving';
      case 1: return 'pointing';
      case 2: return 'reading';
      case 3: return 'happy';
      default: return 'idle';
    }
  }, [formStage, hasResult, isCalculating]);

  const autoMessage = useMemo(() => {
    if (isCalculating) return 'Calculating... 🤔';
    if (hasResult) return 'Result aa gaya! 🎉';
    switch (formStage) {
      case 0: return 'Hi! Main InsureBuddy hoon 🛡️';
      case 1: return 'Details bhariye 👆';
      case 2: return 'Accha! Aur bataiye ✨';
      case 3: return 'Almost done! 🎯';
      default: return '';
    }
  }, [formStage, hasResult, isCalculating]);

  const mood = clickMood ?? autoMood;
  const message = clickMessage ?? autoMessage;

  return (
    <FormCharacter3D
      mood={mood}
      size={size}
      message={message}
      className={className}
      onCharacterClick={() => {
        const moods: CharacterMood[] = ['idle', 'waving', 'happy', 'excited', 'thinking', 'pointing'];
        const currentIndex = moods.indexOf(mood);
        const nextMood = moods[(currentIndex + 1) % moods.length];
        const messages: Record<CharacterMood, string> = {
          idle: 'Main yahan hoon! 😊',
          thinking: 'Hmm... soch raha hoon 🤔',
          happy: 'Bahut khush! 😄',
          excited: 'Yahooo! 🎉',
          waving: 'Hello! 👋',
          pointing: 'Idhar dekhiye! 👆',
          reading: 'Padh raha hoon... 📖',
        };
        setClickMood(nextMood);
        setClickMessage(messages[nextMood]);
        setTimeout(() => { setClickMood(null); setClickMessage(null); }, 3000);
      }}
    />
  );
}
