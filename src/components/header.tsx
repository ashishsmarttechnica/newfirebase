'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Zap } from 'lucide-react'; // Using Zap as a placeholder logo icon

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Zap className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">FileDrop</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
