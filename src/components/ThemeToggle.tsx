'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full transition-all duration-300 hover:bg-accent"
          aria-label="Toggle theme"
        >
          {/* Sun icon - visible in dark mode, hidden in light */}
          <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
          {/* Moon icon - hidden in dark mode, visible in light */}
          <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="cursor-pointer gap-2"
        >
          <Sun className="size-4" />
          <span>Light</span>
          {mounted && theme === 'light' && (
            <span className="ml-auto flex size-2 rounded-full bg-emerald-500" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="cursor-pointer gap-2"
        >
          <Moon className="size-4" />
          <span>Dark</span>
          {mounted && theme === 'dark' && (
            <span className="ml-auto flex size-2 rounded-full bg-emerald-500" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="cursor-pointer gap-2"
        >
          <Monitor className="size-4" />
          <span>System</span>
          {mounted && theme === 'system' && (
            <span className="ml-auto flex size-2 rounded-full bg-emerald-500" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
