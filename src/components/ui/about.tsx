"use client";

import React from "react";
import { Zap, Palette, Blocks, BookOpen, Box, Brain } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning-Fast Performance",
    description: "Built with speed — minimal load times and optimized.",
  },
  {
    icon: Palette,
    title: "Beautifully Designed Components",
    description: "Modern, pixel-perfect UI components ready for any project.",
  },
  {
    icon: Blocks,
    title: "Plug-and-Play Integration",
    description: "Simple setup with support for React, Next.js and Tailwind css.",
  },
  {
    icon: BookOpen,
    title: "Clear & Comprehensive",
    description: "Get started fast with usage examples, live previews and code.",
  },
  {
    icon: Box,
    title: "Fully Customizable",
    description: "Easily adapt styles, colors and layout to match your brand or product.",
  },
  {
    icon: Brain,
    title: "Accessibility First",
    description: "Built with WCAG standards in mind to ensure inclusive user experiences.",
  },
];

export default function About() {
  return (
    <section
      aria-labelledby="about-heading"
      className="py-16"
      style={{ backgroundColor: "#FFFFFF", color: "#1e293b" }}
    >
      <div>
        <h1
          id="about-heading"
          className="text-3xl font-semibold text-center mx-auto"
          style={{ color: "#1e293b" }}
        >
          About our apps
        </h1>
        <p
          className="text-sm text-center mt-2 max-w-lg mx-auto"
          style={{ color: "#64748b" }}
        >
          A visual collection of our most recent works - each piece crafted with intention, emotion and style.
        </p>
        <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 px-8 md:px-0 pt-16">
          <div
            className="size-[520px] -top-80 left-1/2 -translate-x-1/2 rounded-full absolute blur-[300px] -z-10"
            style={{ backgroundColor: "#FBFFE1" }}
          ></div>
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.title}>
                <div
                  className="size-10 p-2 border rounded flex items-center justify-center"
                  style={{ backgroundColor: "#eef2ff", borderColor: "#c7d2fe" }}
                >
                  <IconComponent className="size-5" style={{ color: "#6366f1" }} />
                </div>
                <div className="mt-5 space-y-2">
                  <h3 className="text-base font-medium" style={{ color: "#475569" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm" style={{ color: "#64748b" }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
