"use client"

import type React from "react"

interface ShinyButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  variant?: "primary" | "secondary" | "blue" | "dark"
}

export function ShinyButton({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  variant = "primary",
}: ShinyButtonProps) {
  const variantClass =
    variant === "secondary"
      ? "shiny-cta-secondary"
      : variant === "blue"
      ? "shiny-cta-blue"
      : variant === "dark"
      ? "shiny-cta-dark"
      : "shiny-cta-primary"

  return (
    <>
      <style jsx>{`
        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-angle-offset {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-percent {
          syntax: "<percentage>";
          initial-value: 5%;
          inherits: false;
        }

        @property --gradient-shine {
          syntax: "<color>";
          initial-value: white;
          inherits: false;
        }

        .shiny-cta {
          /* v19.1: de-blued — was navy #0F1C40/#162D5A; warm deep maroon now */
          --shiny-cta-bg: #7A2E1B;
          --shiny-cta-bg-subtle: #4A1D12;
          --shiny-cta-fg: #ffffff;
          --shiny-cta-highlight: #C98A1C;
          --shiny-cta-highlight-subtle: #C98A1C;
          --animation: gradient-angle linear infinite;
          --duration: 3s;
          --shadow-size: 2px;
          --transition: 800ms cubic-bezier(0.25, 1, 0.5, 1);
          
          isolation: isolate;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          outline-offset: 4px;
          padding: 1rem 2rem;
          font-family: var(--font-sans), 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1rem;
          line-height: 1.2;
          font-weight: 700;
          border: 1px solid transparent;
          border-radius: 360px;
          color: var(--shiny-cta-fg);
          background: linear-gradient(var(--shiny-cta-bg), var(--shiny-cta-bg-subtle)) padding-box,
            conic-gradient(
              from calc(var(--gradient-angle) - var(--gradient-angle-offset)),
              transparent,
              var(--shiny-cta-highlight) var(--gradient-percent),
              var(--gradient-shine) calc(var(--gradient-percent) * 2),
              var(--shiny-cta-highlight) calc(var(--gradient-percent) * 3),
              transparent calc(var(--gradient-percent) * 4)
            ) border-box;
          box-shadow:
            inset 0 0 0 1px rgba(74, 29, 18, 0.4),
            0 2px 12px rgba(74, 29, 18, 0.35),
            0 0 20px rgba(201, 138, 28, 0.12);
          transition: var(--transition);
          transition-property: --gradient-angle-offset, --gradient-percent, --gradient-shine, box-shadow;
        }

        .shiny-cta:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .shiny-cta::before,
        .shiny-cta::after,
        .shiny-cta span::before {
          content: "";
          pointer-events: none;
          position: absolute;
          inset-inline-start: 50%;
          inset-block-start: 50%;
          translate: -50% -50%;
          z-index: -1;
        }

        .shiny-cta:active:not(:disabled) {
          translate: 0 1px;
        }

        /* Dots pattern */
        .shiny-cta::before {
          --size: calc(100% - var(--shadow-size) * 3);
          --position: 2px;
          --space: calc(var(--position) * 2);
          width: var(--size);
          height: var(--size);
          background: radial-gradient(
            circle at var(--position) var(--position),
            white calc(var(--position) / 4),
            transparent 0
          ) padding-box;
          background-size: var(--space) var(--space);
          background-repeat: space;
          mask-image: conic-gradient(
            from calc(var(--gradient-angle) + 45deg),
            black,
            transparent 10% 90%,
            black
          );
          border-radius: inherit;
          opacity: 0.4;
          z-index: -1;
        }

        /* Inner shimmer */
        .shiny-cta::after {
          --animation: shimmer linear infinite;
          width: 100%;
          aspect-ratio: 1;
          background: linear-gradient(
            -50deg,
            transparent,
            var(--shiny-cta-highlight),
            transparent
          );
          mask-image: radial-gradient(circle at bottom, transparent 40%, black);
          opacity: 0.6;
        }

        .shiny-cta span {
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .shiny-cta span::before {
          --size: calc(100% + 1rem);
          width: var(--size);
          height: var(--size);
          box-shadow: inset 0 -1ex 2rem 4px var(--shiny-cta-highlight);
          opacity: 0;
          transition: opacity var(--transition);
          animation: calc(var(--duration) * 1.5) breathe linear infinite;
        }

        /* Animate */
        .shiny-cta,
        .shiny-cta::before,
        .shiny-cta::after {
          animation: var(--animation) var(--duration),
            var(--animation) calc(var(--duration) / 0.4) reverse paused;
          animation-composition: add;
        }

        .shiny-cta:is(:hover, :focus-visible):not(:disabled) {
          --gradient-percent: 20%;
          --gradient-angle-offset: 95deg;
          --gradient-shine: var(--shiny-cta-highlight-subtle);
        }

        .shiny-cta:is(:hover, :focus-visible):not(:disabled),
        .shiny-cta:is(:hover, :focus-visible):not(:disabled)::before,
        .shiny-cta:is(:hover, :focus-visible):not(:disabled)::after {
          animation-play-state: running;
        }

        .shiny-cta:is(:hover, :focus-visible):not(:disabled) span::before {
          opacity: 1;
        }

        /* Primary variant — v19.1: deep maroon bg + white text + gold animated border (de-blued) */
        .shiny-cta-primary {
          --shiny-cta-bg: #7A2E1B;
          --shiny-cta-bg-subtle: #4A1D12;
          --shiny-cta-fg: #ffffff;
          --shiny-cta-highlight: #C98A1C;
          --shiny-cta-highlight-subtle: #C98A1C;
        }

        .shiny-cta-primary:is(:hover, :focus-visible):not(:disabled) {
          box-shadow:
            inset 0 0 0 1px rgba(74, 29, 18, 0.5),
            0 4px 20px rgba(74, 29, 18, 0.4),
            0 0 30px rgba(201, 138, 28, 0.2),
            0 0 60px rgba(201, 138, 28, 0.1);
        }

        /* Secondary variant — v19.1: warm ink bg + white text + gold border outline (de-blued) */
        .shiny-cta-secondary {
          --shiny-cta-bg: #2A1A10;
          --shiny-cta-bg-subtle: #1A130C;
          --shiny-cta-fg: #ffffff;
          --shiny-cta-highlight: #C98A1C;
          --shiny-cta-highlight-subtle: #C98A1C;
          border: 2px solid rgba(201, 138, 28, 0.5);
          box-shadow:
            inset 0 0 0 1px rgba(42, 26, 16, 0.4),
            0 2px 12px rgba(26, 19, 12, 0.3),
            0 0 15px rgba(201, 138, 28, 0.1);
        }

        .shiny-cta-secondary:is(:hover, :focus-visible):not(:disabled) {
          border-color: rgba(201, 138, 28, 0.8);
          box-shadow:
            inset 0 0 0 1px rgba(42, 26, 16, 0.5),
            0 4px 20px rgba(26, 19, 12, 0.4),
            0 0 30px rgba(201, 138, 28, 0.2),
            0 0 60px rgba(201, 138, 28, 0.1);
        }

        /* "Blue" variant — SAFFRON DAWN v19: sienna → maroon bg + gold highlights (de-blued) */
        .shiny-cta-blue {
          --shiny-cta-bg: #B8482C;
          --shiny-cta-bg-subtle: #8B3520;
          --shiny-cta-fg: #ffffff;
          --shiny-cta-highlight: #E8C97E;
          --shiny-cta-highlight-subtle: #C98A1C;
        }

        /* Dark variant — v19: ink bg + gold animated border (de-blued) */
        .shiny-cta-dark {
          --shiny-cta-bg: #0E1116;
          --shiny-cta-bg-subtle: #1A1F27;
          --shiny-cta-fg: #ffffff;
          --shiny-cta-highlight: #E8C97E;
          --shiny-cta-highlight-subtle: #C98A1C;
        }

        .shiny-cta-dark:is(:hover, :focus-visible):not(:disabled) {
          box-shadow:
            inset 0 0 0 1px rgba(26, 31, 39, 0.5),
            0 4px 20px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(201, 138, 28, 0.2),
            0 0 60px rgba(201, 138, 28, 0.1);
        }

        @keyframes gradient-angle {
          to {
            --gradient-angle: 360deg;
          }
        }

        @keyframes shimmer {
          to {
            rotate: 360deg;
          }
        }

        @keyframes breathe {
          from, to {
            scale: 1;
          }
          50% {
            scale: 1.2;
          }
        }
      `}</style>

      <button
        type={type}
        className={`shiny-cta ${variantClass} ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        <span>{children}</span>
      </button>
    </>
  )
}
