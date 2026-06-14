'use client';

import dynamic from 'next/dynamic';

// ✅ NEVER SSR SearchClient on Vercel — eliminates toLocaleString build error
// This must be a Client Component because ssr: false is not allowed in Server Components
const SearchClient = dynamic(() => import('./SearchClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Loading search...</p>
      </div>
    </div>
  ),
});

export default function SearchClientWrapper() {
  return <SearchClient />;
}
