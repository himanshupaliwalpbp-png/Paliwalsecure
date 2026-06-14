'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';

/* ────────────────────────────────────────────────────────────────────────────
   EyeCatchingButton — Spinning border gradient, premium feel
   Brand colors: Gold (#C98A1C) & Cyan (#7ED3E6)
   ──────────────────────────────────────────────────────────────────────────── */

export const EyeCatchingButton = ({ ...props }: ButtonProps) => {
  return (
    <div className="relative overflow-hidden rounded-full dark:bg-zinc-900 bg-white shadow border dark:border-zinc-800 group border-zinc-400 p-0.5">
      <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite_reverse] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#7ED3E6_0%,#C98A1C_14%,#09090B_28%)] bg-[conic-gradient(from_90deg_at_50%_50%,#C98A1C_0%,#7ED3E6_7%,#fff_14%)] group-hover:bg-none" />
      <Button
        {...props}
        className={cn(
          'h-10 px-5 rounded-full font-semibold text-zinc-800 dark:text-zinc-200 backdrop-blur-xl bg-zinc-50 dark:bg-zinc-900',
          props.className,
        )}
      />
    </div>
  );
};
