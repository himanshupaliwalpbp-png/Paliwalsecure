'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { IoSend } from 'react-icons/io5';
import {
  Button,
} from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type BaseButtonProps = React.ComponentProps<typeof Button>;

type SendStopButtonProps = {
  children: React.ReactNode;
} & BaseButtonProps & {
  isLoading?: boolean;
  onStop?: () => void;
};

/* ────────────────────────────────────────────────────────────────────────────
   SendStopButton — Morphs between Send and Loading Spinner when AI is answering
   Loading state: Gold (#C98A1C) spinner with stop-on-click
   Idle state: Gold-themed send button with hover animation
   Brand colors: Gold (#C98A1C) accent, Cyan (#7ED3E6) glow
   ──────────────────────────────────────────────────────────────────────────── */

export const SendStopButton = ({
  children,
  isLoading = false,
  onStop,
  ...rest
}: SendStopButtonProps) => {
  if (isLoading) {
    return (
      <Button
        type="button"
        onClick={onStop}
        className={cn(
          'relative overflow-hidden border shadow group',
          'border-[#C98A1C]/40 text-[#C98A1C] bg-[#C98A1C]/10',
          'hover:bg-[#C98A1C]/20 hover:border-[#C98A1C]/60',
          'h-10 w-10 rounded-xl shrink-0 transition-all duration-300 px-0',
          rest.className,
        )}
        aria-label="Stop generating"
      >
        {/* Gold spinning loader — clicking stops generation */}
        <Loader2 className="w-5 h-5 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      {...rest}
      type="submit"
      className={cn(
        'relative overflow-hidden border shadow group',
        // light mode
        'border-[#C98A1C]/30 text-[#C98A1C] bg-[#C98A1C]/8',
        // dark mode
        'dark:border-[#C98A1C]/30 dark:text-[#C98A1C] dark:bg-[#C98A1C]/10',
        'hover:bg-[#C98A1C]/20 hover:border-[#C98A1C]/50',
        'dark:hover:bg-[#C98A1C]/20 dark:hover:border-[#C98A1C]/50',
        'h-10 w-10 rounded-xl shrink-0 transition-all duration-300 px-0',
        rest.className,
      )}
      aria-label="Send message"
    >
      <span className="absolute inset-0 rounded-sm flex items-center justify-center size-full duration-700 ease-[cubic-bezier(0.50,0.20,0,1)] -translate-x-full group-hover:translate-x-0 bg-[#C98A1C] dark:bg-[#C98A1C] text-[#0A1330] dark:text-[#0A1330]">
        <IoSend size="18" />
      </span>
      <span className="absolute flex items-center justify-center w-full h-full transition-all duration-500 ease-out transform group-hover:translate-x-full">
        <IoSend size="18" />
      </span>
      <span className="relative invisible">
        <IoSend size="18" />
      </span>
    </Button>
  );
};

/* ────────────────────────────────────────────────────────────────────────────
   InlineSendStopButton — Compact version for the floating chat
   No hover animation, just clean send/loading toggle
   ──────────────────────────────────────────────────────────────────────────── */

export const InlineSendStopButton = ({
  isLoading = false,
  onStop,
  ...rest
}: { isLoading?: boolean; onStop?: () => void } & BaseButtonProps) => {
  if (isLoading) {
    return (
      <Button
        type="button"
        onClick={onStop}
        className={cn(
          'h-10 w-10 rounded-xl shrink-0 transition-all duration-300 px-0',
          'border border-[#C98A1C]/40 text-[#C98A1C] bg-[#C98A1C]/10',
          'hover:bg-[#C98A1C]/20 hover:border-[#C98A1C]/60',
          rest.className,
        )}
        aria-label="Stop generating"
      >
        <Loader2 className="w-5 h-5 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      {...rest}
      type="submit"
      className={cn(
        'h-10 w-10 rounded-xl shrink-0 transition-all duration-300 px-0',
        'border border-[#C98A1C]/30 text-[#C98A1C] bg-[#C98A1C]/10',
        'hover:bg-[#C98A1C]/20 hover:border-[#C98A1C]/50',
        rest.className,
      )}
      aria-label="Send message"
    >
      <IoSend size="18" />
    </Button>
  );
};
