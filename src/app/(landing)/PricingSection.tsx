import Link from 'next/link';
import { SpeechBubble } from '@/components/decorative/SpeechBubble';
import { UgglyOwl } from '@/components/icons/UgglyOwl';

const pricingFeatures = [
  'AI-samtal anpassade efter barnets ålder',
  'Fullständig föräldrakontroll',
  'Kostnadsöversikt i realtid',
  'Daglig budgetgräns',
  'Obegränsat antal Ugglys',
  'Avbryt när som helst',
];

export function PricingSection() {
  return (
    <section className="bg-gradient-to-b from-night-800 to-night-900 py-20 md:py-28 px-6">
      <div className="max-w-lg mx-auto">
        {/* Owl with speech bubble */}
        <div className="flex flex-col items-center mb-8">
          <SpeechBubble direction="bottom" className="mb-3">
            <span className="text-sm">Jag kostar mindre än en fika!</span>
          </SpeechBubble>
          <UgglyOwl size={64} variant="color" />
        </div>

        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-3">
            En enkel plan för hela familjen
          </h2>
        </div>

        <div className="bg-night-900/80 border border-night-700/50 rounded-[2rem] shadow-2xl p-8 md:p-10 text-center relative overflow-hidden">
          {/* Decorative glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full animate-pulse-glow"
            style={{
              background: 'radial-gradient(circle, rgba(232,168,23,0.4) 0%, transparent 70%)',
            }}
          />

          <div className="relative">
            <div className="mb-6">
              <span className="font-heading font-extrabold text-5xl text-white">99 kr</span>
              <span className="text-night-300 text-xl">/mån</span>
            </div>
            <p className="text-night-400 text-sm mb-8">
              Inkl. Uggly-enheten vid första beställningen
            </p>

            <ul className="space-y-3 text-left mb-10">
              {pricingFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-night-200 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 20 20" aria-hidden="true">
                    <circle cx="10" cy="10" r="10" fill="var(--color-forest-500)" opacity="0.2" />
                    <path d="M6 10 L9 13 L14 7" stroke="var(--color-forest-400)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="block w-full py-4 bg-glow-500 text-night-950 rounded-full text-lg font-bold font-heading hover:bg-glow-400 transition-colors shadow-lg shadow-glow-500/20 text-center"
            >
              Beställ din Uggly
            </Link>
            <p className="text-night-500 text-xs mt-4">
              Fri frakt. Inga dolda avgifter. Avbryt när som helst.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
