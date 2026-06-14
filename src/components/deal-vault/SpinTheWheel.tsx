'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Flame, Headphones, Plane, ShoppingBag, Footprints, ShieldCheck, RotateCcw, CheckCircle2 } from 'lucide-react';

/* ── Wheel Segments ─────────────────────────────────────────────────────── */
interface Segment {
  label: string;
  icon: React.ElementType;
  color: string;
  link?: string;
  isWin: boolean;
}

const segments: Segment[] = [
  { label: 'GoNoise Deal', icon: Headphones, color: '#C2562C', link: 'https://track.vcommission.com/click?campaign_id=10320&pub_id=129419', isWin: true },
  { label: 'Agoda 60% OFF', icon: Plane, color: '#3b82f6', link: 'https://bitli.in/oNhm9y9', isWin: true },
  { label: 'Amazon Deal', icon: ShoppingBag, color: '#D4845A', link: 'https://amzn.to/4cHhgQT', isWin: true },
  { label: 'Myntra 71% OFF', icon: Footprints, color: '#ec4899', link: 'https://bitli.in/myntra-fashion', isWin: true },
  { label: 'Free Consultation', icon: ShieldCheck, color: '#22c55e', link: 'https://wa.me/919257877312', isWin: true },
  { label: 'Try Again', icon: RotateCcw, color: '#6b7280', isWin: false },
];

const SEGMENT_ANGLE = 360 / segments.length; // 60 degrees each

/* ── Confetti Component ─────────────────────────────────────────────────── */
function ConfettiEffect() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string; delay: number; size: number }>>([]);

  useEffect(() => {
    const colors = ['#C2562C', '#22c55e', '#D4845A', '#ec4899', '#3b82f6', '#C2562C'];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      size: Math.random() * 8 + 4,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation: confetti-fall 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

/* ── Main Spin The Wheel Component ──────────────────────────────────────── */
export default function SpinTheWheel() {
  const [rotation, setRotation] = useState(0);
  // Check localStorage for today's spin — initialize state from storage
  const getInitialState = () => {
    if (typeof window === 'undefined') return { hasSpun: false, result: null as Segment | null };
    const lastSpinDate = localStorage.getItem('dealvault_spin_date');
    const today = new Date().toDateString();
    if (lastSpinDate === today) {
      const savedResult = localStorage.getItem('dealvault_spin_result');
      let parsedResult: Segment | null = null;
      if (savedResult) {
        try { parsedResult = JSON.parse(savedResult); } catch { /* ignore */ }
      }
      return { hasSpun: true, result: parsedResult };
    }
    return { hasSpun: false, result: null as Segment | null };
  };

  const [spinning, setSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(getInitialState().hasSpun);
  const [result, setResult] = useState<Segment | null>(getInitialState().result);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the wheel on canvas
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 8;

    ctx.clearRect(0, 0, size, size);

    segments.forEach((seg, i) => {
      const startAngle = (i * SEGMENT_ANGLE - 90) * (Math.PI / 180);
      const endAngle = ((i + 1) * SEGMENT_ANGLE - 90) * (Math.PI / 180);

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Segment border
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + (SEGMENT_ANGLE * Math.PI / 180) / 2);
      
      // Icon placeholder — draw a circle with label
      ctx.beginPath();
      ctx.arc(radius * 0.5, 0, Math.max(10, size * 0.04), 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fill();

      // Label
      ctx.font = `bold ${Math.max(8, size * 0.035)}px Inter, sans-serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 2;
      ctx.fillText(seg.label, radius * 0.72, 0);
      ctx.shadowBlur = 0;

      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(center, center, radius * 0.18, 0, 2 * Math.PI);
    ctx.fillStyle = '#0E1220';
    ctx.fill();
    ctx.strokeStyle = '#C2562C';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center text
    ctx.font = `bold ${Math.max(10, size * 0.04)}px Inter, sans-serif`;
    ctx.fillStyle = '#C2562C';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', center, center);

  }, []);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Spin handler
  const handleSpin = () => {
    if (spinning || hasSpun) return;

    setSpinning(true);
    setShowResult(false);

    // Random: weighted to mostly land on winning segments
    const isTryAgain = Math.random() < 0.15; // 15% chance of "Try Again"
    let winningIndex: number;
    
    if (isTryAgain) {
      winningIndex = 5; // "Try Again" is index 5
    } else {
      // Pick a random winning segment (0-4)
      winningIndex = Math.floor(Math.random() * 5);
    }

    const segment = segments[winningIndex];
    
    // Calculate rotation: at least 5 full spins + land on the segment
    const segmentCenter = winningIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const targetRotation = 360 * (5 + Math.random() * 3) + (360 - segmentCenter);
    
    setRotation(prev => prev + targetRotation);

    // After spin completes
    setTimeout(() => {
      setSpinning(false);
      setHasSpun(true);
      setResult(segment);
      setShowResult(true);

      // Save to localStorage
      localStorage.setItem('dealvault_spin_date', new Date().toDateString());
      localStorage.setItem('dealvault_spin_result', JSON.stringify(segment));

      if (segment.isWin) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }, 4000);
  };

  const handleCloseResult = () => {
    setShowResult(false);
  };

  return (
    <div className="relative">
      {showConfetti && <ConfettiEffect />}

      {/* Section Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2 flex items-center justify-center gap-2">
          <Flame className="w-6 h-6 text-primary" />
          Apni Deal Spin Karo!
        </h2>
        <p className="text-sm text-muted-foreground">
          Ek free spin — lucky deal jeeto! (Ek baar din mein)
        </p>
      </div>

      {/* Wheel Container */}
      <div className="flex flex-col items-center">
        {/* Pointer Triangle */}
        <div className="relative">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20"
            style={{
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '20px solid hsl(var(--primary))',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          />

          {/* Wheel */}
          <div
            className="rounded-full shadow-2xl border-4 border-primary"
            style={{
              width: '280px',
              height: '280px',
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
                : 'none',
            }}
          >
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={spinning || hasSpun}
          className={`mt-6 px-8 py-3.5 rounded-full font-extrabold text-lg text-primary-foreground transition-all
            ${spinning
              ? 'bg-muted cursor-not-allowed text-muted-foreground'
              : hasSpun
                ? 'bg-muted cursor-not-allowed text-muted-foreground'
                : 'bg-primary hover:opacity-90 active:scale-95 shadow-lg hover:shadow-xl'
            }
            ${!spinning && !hasSpun ? 'animate-pulse-slow' : ''}
          `}
        >
          {spinning ? 'Spinning...' : hasSpun ? 'Already Spun!' : 'SPIN KARO!'}
        </button>

        {hasSpun && result && !showResult && (
          <button
            onClick={() => setShowResult(true)}
            className="mt-3 text-sm font-medium text-primary hover:opacity-80 underline"
          >
            Apna result phir se dekho
          </button>
        )}
      </div>

      {/* Result Popup */}
      {showResult && result && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleCloseResult}
        >
          <div
            className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <result.icon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-extrabold text-foreground mb-2">
              {result.isWin ? 'Congratulations!' : 'Better Luck Next Time!'}
            </h3>
            <p className="text-lg font-bold text-primary mb-4">
              {result.label}
            </p>
            {result.isWin ? (
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full py-3 rounded-full font-bold text-primary-foreground text-base mb-3 bg-primary hover:opacity-90 transition-opacity"
              >
                Claim Your Deal
              </a>
            ) : (
              <p className="text-sm text-muted-foreground mb-3">
                Kal phir se try karo! Naya spin milega
              </p>
            )}
            <button
              onClick={handleCloseResult}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.4); }
          50% { box-shadow: 0 0 0 12px hsl(var(--primary) / 0); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
