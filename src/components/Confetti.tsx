'use client'

import confetti from 'canvas-confetti'
import * as React from 'react'
import { Button, ButtonProps } from '@/components/ui/button'

/** Blue and gold themed confetti colors */
const CONFETTI_COLORS = [
  '#1D4ED8', // blue-700
  '#2563EB', // blue-600
  '#3B82F6', // blue-500
  '#60A5FA', // blue-400
  '#d97706', // amber-600
  '#f59e0b', // amber-500
  '#fbbf24', // amber-400
  '#fcd34d', // amber-300
]

/**
 * Fires a blue/gold themed confetti burst from the top-center of the screen.
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
