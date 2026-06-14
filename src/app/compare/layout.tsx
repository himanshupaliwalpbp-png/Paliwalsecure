'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const CATEGORY_MAP: Record<string, string> = {
  motor: 'Motor Insurance',
  health: 'Health Insurance',
  life: 'Life Insurance',
  travel: 'Travel Insurance',
  home: 'Home Insurance',
};

export default function CompareLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const categoryKey = segments.length >= 2 ? segments[1] : '';
  const categoryLabel = CATEGORY_MAP[categoryKey] ?? '';

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/30 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="w-3 h-3" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <Link
              href="/compare"
              className="hover:text-foreground transition-colors"
            >
              Compare
            </Link>
            {categoryLabel && (
              <>
                <ChevronRight className="w-3 h-3 opacity-50" />
                <span className="text-foreground font-medium">{categoryLabel}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      {children}
    </>
  );
}
