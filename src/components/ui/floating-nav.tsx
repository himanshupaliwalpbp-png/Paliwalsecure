"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Search, Bell, User, Settings, Bookmark, Shield, GitCompare, MessageCircle, BookOpen } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   FloatingNav — Premium Animated Bottom Navigation Bar
   PaliwalSecure Edition: Dark blue bg + gold accents + spring animations
   
   Features:
   - Sliding active indicator with spring physics
   - Dark blue background with gold highlight
   - Theme-aware (dark/light mode)
   - Mobile-first responsive design
   - Smooth transitions with framer-motion
   ═══════════════════════════════════════════════════════════════════════════ */

interface FloatingNavItem {
  id: number;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}

interface FloatingNavProps {
  /** Custom navigation items (overrides defaults) */
  items?: FloatingNavItem[];
  /** Additional CSS classes */
  className?: string;
  /** Callback when an item is clicked */
  onItemClick?: (id: number, item: FloatingNavItem) => void;
}

const defaultItems: FloatingNavItem[] = [
  { id: 0, icon: <Home size={20} />, label: "Home" },
  { id: 1, icon: <GitCompare size={20} />, label: "Compare" },
  { id: 2, icon: <Shield size={20} />, label: "Plans" },
  { id: 3, icon: <BookOpen size={20} />, label: "Blog" },
  { id: 4, icon: <MessageCircle size={20} />, label: "Chat" },
];

const FloatingNav: React.FC<FloatingNavProps> = ({
  items = defaultItems,
  className = "",
  onItemClick,
}) => {
  const [active, setActive] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Update indicator position when active changes or resize
  useEffect(() => {
    const updateIndicator = () => {
      if (btnRefs.current[active] && containerRef.current) {
        const btn = btnRefs.current[active];
        const container = containerRef.current;
        if (!btn) return;
        const btnRect = btn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setIndicatorStyle({
          width: btnRect.width,
          left: btnRect.left - containerRect.left,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [active]);

  const handleItemClick = (id: number, item: FloatingNavItem) => {
    setActive(id);
    onItemClick?.(id, item);
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-3 ${className}`}
    >
      <div
        ref={containerRef}
        className="relative flex items-center justify-between rounded-2xl px-2 py-2.5 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #0A1330 0%, #0F1C40 100%)',
          border: '1px solid rgba(201, 138, 28, 0.25)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(201, 138, 28, 0.08)',
        }}
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => { btnRefs.current[index] = el; }}
            onClick={() => handleItemClick(item.id, item)}
            className={`relative flex flex-col items-center justify-center flex-1 px-1.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
              active === item.id
                ? "text-[#C98A1C]"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            <div className="z-10 transition-transform duration-200" style={{
              transform: active === item.id ? 'scale(1.15)' : 'scale(1)',
            }}>
              {item.icon}
            </div>
            {/* Hide labels on very small screens */}
            <span className="text-[10px] mt-1 tracking-wide font-semibold">{item.label}</span>
          </button>
        ))}

        {/* Sliding Active Indicator — Gold glow */}
        <motion.div
          animate={indicatorStyle}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-1.5 bottom-1.5 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(201, 138, 28, 0.15) 0%, rgba(212, 162, 76, 0.1) 100%)',
            border: '1px solid rgba(201, 138, 28, 0.25)',
            boxShadow: '0 0 12px rgba(201, 138, 28, 0.15)',
          }}
        />

        {/* Gold top accent line */}
        <div
          className="absolute top-0 left-4 right-4 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(201, 138, 28, 0.4), transparent)',
          }}
        />
      </div>
    </div>
  );
};

export default FloatingNav;
