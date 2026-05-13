'use client'

import confetti from 'canvas-confetti'
import * as React from 'react'
import { Button, ButtonProps } from '@/components/ui/button'

/** Emerald and gold themed confetti colors */
const CONFETTI_COLORS = [
  '#059669', // emerald-600
  '#10b981', // emerald-500
  '#34d399', // emerald-400
  '#6ee7b7', // emerald-300
  '#d97706', // amber-600
  '#f59e0b', // amber-500
  '#fbbf24', // amber-400
  '#fcd34d', // amber-300
]

/**
 * Fires an emerald/gold themed confetti burst from the top-center of the screen.
 * Can be called imperatively from any event handler.
 */
export function fireConfetti(): void {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.5, y: 0.15 },
    colors: CONFETTI_COLORS,
    ticks: 200,
    gravity: 1.1,
    scalar: 0.9,
    shapes: ['circle', 'square'],
    drift: 0,
  })
}

interface ConfettiButtonProps extends ButtonProps {
  /** Whether to fire confetti on click. Defaults to true. */
  enableConfetti?: boolean
}

/**
 * A button that fires confetti when clicked.
 * Wraps any children and supports all shadcn Button props.
 */
export function ConfettiButton({
  children,
  onClick,
  enableConfetti = true,
  ...props
}: ConfettiButtonProps) {
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableConfetti) {
        fireConfetti()
      }
      onClick?.(e)
    },
    [enableConfetti, onClick]
  )

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}
