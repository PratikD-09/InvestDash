'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/uiSlice';
import { Button } from '@/components/UI';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(state => state.ui);

  const isActive = (path: string) => pathname.startsWith(path);

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/deals', label: 'Deals' },
    { href: '/investors', label: 'Investors' },
    { href: '/corporate', label: 'Corporate' },
    { href: '/portfolio', label: 'Portfolio' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="font-bold text-xl tracking-tight text-foreground">
            <span className="text-primary">Invest</span>Dash
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch(toggleTheme())}
            className="gap-2"
          >
            {/* shadcn Button used for theme toggle */}
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </nav>
  );
}
