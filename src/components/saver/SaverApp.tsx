"use client";

/**
 * SaverApp — root client component of the /saver experience.
 * Owns the active-calculator tab state (SmartSearch + CTA can switch it)
 * and the smooth-scroll behavior.
 */

import { useCallback, useRef, useState } from "react";
import CalculatorsSection, { type CalcTab } from "./CalculatorsSection";
import MethodSteps from "./MethodSteps";
import SaverAI from "./SaverAI";
import SaverCTA from "./SaverCTA";
import SaverFaq from "./SaverFaq";
import SaverHero from "./SaverHero";
import SmartSearch from "./SmartSearch";

export default function SaverApp() {
  const [tab, setTab] = useState<CalcTab>("payments");
  const reduced = useRef(false);

  const openTool = useCallback((targetTab: "payments" | "tax" | "gst" | null) => {
    if (targetTab) setTab(targetTab);
    const el = document.getElementById("saver-calculators");
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reduced.current = true;
    }
    el?.scrollIntoView({ behavior: reduced.current ? "auto" : "smooth", block: "start" });
  }, []);

  const restart = useCallback(() => {
    const el = document.getElementById("saver-calculators");
    el?.scrollIntoView({ behavior: reduced.current ? "auto" : "smooth", block: "start" });
  }, []);

  return (
    <div className="relative">
      <SaverHero />
      <SmartSearch onOpenTool={openTool} />
      <MethodSteps />
      <CalculatorsSection activeTab={tab} onTabChange={setTab} />
      <SaverAI />
      <SaverFaq />
      <SaverCTA onRestart={restart} />
    </div>
  );
}
