"use client";

/**
 * StickyMobileBar — appears after the hero on small screens; fixed bottom
 * mini-CTA respecting iOS safe-area insets. Hidden once the user reaches
 * the calculator section (it's served its purpose).
 */

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeIndianRupee } from "lucide-react";
import { smoothScrollTo } from "./ui";

export function StickyMobileBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const calc = document.querySelector("#saver-calculators");
      const calcTop = calc ? calc.getBoundingClientRect().top + y : Number.MAX_SAFE_INTEGER;
      setVisible(y > 640 && y < calcTop - 200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
        >
          <div className="saver-mobile-bar border-t border-white/[0.08] bg-[#0E1116]/92 px-4 pt-3 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => smoothScrollTo("#saver-calculators")}
              className="saver-btn-gold w-full"
            >
              <BadgeIndianRupee className="h-4 w-4" aria-hidden />
              Calculate Savings
              <span className="saver-num ml-1 text-xs font-medium opacity-80">free · legal</span>
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
