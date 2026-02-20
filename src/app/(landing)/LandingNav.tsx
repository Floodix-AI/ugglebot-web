'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UgglyLogo } from '@/components/brand/UgglyLogo';

export function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-night-900/80 backdrop-blur-lg border-b border-white/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <UgglyLogo size="sm" variant="color" onDark />
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-night-300 hover:text-white transition-colors font-heading font-semibold px-4 py-2"
          >
            Logga in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 bg-glow-500 text-night-950 rounded-full text-sm font-bold font-heading hover:bg-glow-400 transition-colors shadow-sm shadow-glow-500/20"
          >
            Kom igång
          </Link>
        </div>
      </div>
    </nav>
  );
}
