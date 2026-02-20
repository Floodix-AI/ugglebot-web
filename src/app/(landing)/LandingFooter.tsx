import Link from 'next/link';
import { UgglyLogo } from '@/components/brand/UgglyLogo';

export function LandingFooter() {
  return (
    <footer className="relative bg-night-950 pt-0 pb-12 px-6 border-t border-night-800">
      {/* Tree silhouettes */}
      <div className="w-full overflow-hidden -mt-px" aria-hidden="true">
        <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="w-full h-[30px] md:h-[50px] block">
          <path d="M0,50 L0,30 L40,30 L60,8 L80,30 L120,30 L150,5 L180,30 L220,30 L240,12 L260,30 L340,30 L370,3 L400,30 L440,30 L460,15 L480,30 L560,30 L590,6 L620,30 L660,30 L680,18 L700,30 L780,30 L810,4 L840,30 L880,30 L900,14 L920,30 L1000,30 L1030,7 L1060,30 L1100,30 L1120,16 L1140,30 L1220,30 L1250,5 L1280,30 L1320,30 L1340,12 L1360,30 L1440,30 L1440,50 Z"
            fill="var(--color-night-950)"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <UgglyLogo size="sm" variant="color" onDark />
          <div className="flex items-center gap-6 text-night-500 text-sm">
            <Link href="/login" className="hover:text-night-300 transition-colors">
              Logga in
            </Link>
            <Link href="/signup" className="hover:text-night-300 transition-colors">
              Skapa konto
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-night-800 text-center">
          <p className="text-night-500 text-sm">
            &copy; {new Date().getFullYear()} Uggly. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
}
