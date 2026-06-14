'use client';

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background page-transition overflow-x-hidden">
      <main className="pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
