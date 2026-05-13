'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Shield, MessageSquare, Phone, Calculator } from 'lucide-react';

interface MobileBottomNavProps {
  onNavigate: (sectionId: string) => void;
}

const navItems = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'products', label: 'Plans', icon: Shield },
  { id: 'insuregpt-chat', label: 'Chat', icon: MessageSquare },
  { id: 'calculators', label: 'Calc', icon: Calculator },
  { id: 'contact', label: 'Contact', icon: Phone },
];

export default function MobileBottomNav({ onNavigate }: MobileBottomNavProps) {
  const [activeId, setActiveId] = useState('hero');

  const handleNav = (id: string) => {
    setActiveId(id);
    onNavigate(id);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-background/80 backdrop-blur-md safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] relative"
              aria-label={item.label}
            >
              <div className="relative">
                <IconComp
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-emerald-600' : 'text-muted-foreground'
                  }`}
                />
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </div>
              <span
                className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-emerald-600' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
