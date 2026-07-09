'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  const isExplore = pathname.includes('/explore');
  const isDashboard = pathname.includes('/dashboard');

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-primary p-2">
            <BarChart3 className="size-5 text-primary-foreground" />
          </div>
          <Link href="/explore" className="text-lg font-bold text-foreground hover:text-primary transition-colors">
            Pulse
          </Link>
        </div>

        <nav className="hidden gap-1 md:flex">
          <Link href="/explore">
            <Button
              variant={isExplore ? 'default' : 'ghost'}
              size="sm"
              className="rounded-full"
            >
              Explore
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant={isDashboard ? 'default' : 'ghost'}
              size="sm"
              className="rounded-full"
            >
              Dashboard
            </Button>
          </Link>
        </nav>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>

      {/* Mobile navigation */}
      <div className="flex gap-1 border-t border-border bg-background px-4 py-2 md:hidden">
        <Link href="/explore" className="flex-1">
          <Button
            variant={isExplore ? 'default' : 'ghost'}
            size="sm"
            className="w-full rounded-full"
          >
            Explore
          </Button>
        </Link>
        <Link href="/dashboard" className="flex-1">
          <Button
            variant={isDashboard ? 'default' : 'ghost'}
            size="sm"
            className="w-full rounded-full"
          >
            Dashboard
          </Button>
        </Link>
      </div>
    </header>
  );
}
