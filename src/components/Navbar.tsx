'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/uiSlice';
import { Button } from '@/components/UI';
import { Moon, Sun, Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/UI';

export default function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(state => state.ui);
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="mx-auto !px-4 md:!px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="font-bold text-xl tracking-tight text-foreground">
            <span className="text-primary">Invest</span>Dash
          </Link>

          {/* Desktop Navigation */}
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

          <div className="flex items-center !gap-2">
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden h-8 w-8 !p-3"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="!w-[300px] sm:!w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <span className="text-primary">Invest</span>Dash
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 !m-6">
                  {navItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`font-medium transition-colors text-lg ${
                        isActive(item.href)
                          ? 'text-primary'
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Theme Toggle */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => dispatch(toggleTheme())}
              className="gap-2 p-2"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
