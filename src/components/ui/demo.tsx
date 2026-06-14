"use client";

import React from "react";
import Image from "next/image";
import { Zap, Palette, Blocks } from "lucide-react";

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
];

export default function Demo() {
  return (
    <section
      aria-labelledby="demo-heading"
      className="py-16"
      style={{ backgroundColor: "#FFFFFF", color: "#1e293b" }}
    >
      <div>
        <h1
          id="demo-heading"
          className="text-3xl font-semibold text-center mx-auto"
          style={{ color: "#1e293b" }}
        >
          About our apps
        </h1>
        <p
          className="text-sm text-center mt-2 max-w-md mx-auto"
          style={{ color: "#64748b" }}
        >
          A visual collection of our most recent works - each piece crafted with intention, emotion and style.
        </p>
        <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 px-4 md:px-0 py-10">
          <div
            className="size-[520px] -top-40 left-1/2 -translate-x-1/2 rounded-full absolute blur-[300px] -z-10"
            style={{ backgroundColor: "#FBFFE1" }}
          ></div>
          <div className="max-w-sm w-full rounded-xl overflow-hidden h-auto min-h-[200px]">
            <Image
              src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop"
              alt="Our latest features preview"
              width={415}
              height={422}
              className="w-full h-auto rounded-xl"
            />
          </div>
          <div>
            <h1 className="text-3xl font-semibold" style={{ color: "#1e293b" }}>
              Our Latest features
            </h1>
            <p className="text-sm mt-2" style={{ color: "#64748b" }}>
              Ship Beautiful Frontends Without the Overhead — Customizable, Scalable and Developer-Friendly UI
              Components.
            </p>

            <div className="flex flex-col gap-10 mt-6">
              {features.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div key={feature.title} className="flex items-center gap-4">
                    <div
                      className="size-9 p-2 border rounded flex items-center justify-center"
                      style={{ backgroundColor: "#eef2ff", borderColor: "#c7d2fe" }}
                    >
                      <IconComponent className="size-4" style={{ color: "#6366f1" }} />
                    </div>
                    <div>
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
        </div>
      </div>
    </section>
  );
}
