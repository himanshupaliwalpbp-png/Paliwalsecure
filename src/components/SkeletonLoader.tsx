'use client'

import { Skeleton } from '@/components/ui/skeleton'

/**
 * ProductCardSkeleton — mimics an insurance plan card
 * Shows placeholder for: header badge, title, stats grid, features list, and CTA button
 */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      {/* Header: badge + provider name */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Provider name */}
      <Skeleton className="h-6 w-3/4" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-18" />
          <Skeleton className="h-5 w-14" />
        </div>
      </div>

      {/* Features list */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* CTA button */}
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  )
}

/**
 * ChatMessageSkeleton — mimics a bot response bubble with typing dots
 */
export function ChatMessageSkeleton() {
  return (
    <div className="flex gap-3 items-start">
      {/* Bot avatar */}
      <Skeleton className="size-8 rounded-full shrink-0" />

      {/* Message bubble */}
      <div className="rounded-2xl rounded-tl-sm bg-muted p-4 max-w-[80%] space-y-3">
        {/* Text lines */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        {/* Typing dots animation */}
        <div className="flex items-center gap-1.5 pt-1">
          <span
            className="size-2 rounded-full bg-muted-foreground/40 animate-bounce"
            style={{ animationDelay: '0ms', animationDuration: '0.6s' }}
          />
          <span
            className="size-2 rounded-full bg-muted-foreground/40 animate-bounce"
            style={{ animationDelay: '150ms', animationDuration: '0.6s' }}
          />
          <span
            className="size-2 rounded-full bg-muted-foreground/40 animate-bounce"
            style={{ animationDelay: '300ms', animationDuration: '0.6s' }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * CalculatorSkeleton — mimics a calculator form layout
 * Shows placeholder for: title, input fields, sliders, and result area
 */
export function CalculatorSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Form fields */}
      <div className="space-y-4">
        {/* Age field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Sum Insured field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-2 w-full rounded-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* City field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Members count */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Calculate button */}
      <Skeleton className="h-11 w-full rounded-lg" />

      {/* Result area */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    </div>
  )
}
