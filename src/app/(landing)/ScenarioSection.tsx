'use client';

import { motion } from 'framer-motion';
import { SpeechBubble } from '@/components/decorative/SpeechBubble';

const scenarios = [
  {
    label: 'Vid läggdags...',
    title: 'Sagor som aldrig tar slut',
    body: 'Ditt barn väljer — djungeln, rymden eller en helt ny värld. Uggly skapar en unik saga varje kväll, anpassad efter just ditt barns fantasi och ålder.',
    bubble: 'Berätta om en drake som var rädd för mörkret!',
    illustration: 'bedtime',
  },
  {
    label: 'När nyfikenheten vaknar...',
    title: 'Alla frågor är bra frågor',
    body: 'Varför är himlen blå? Hur fort springer en gepard? Uggly svarar på barnets språknivå — aldrig för svårt, aldrig för simpelt. Kunskap med glädje.',
    bubble: 'Varför har zebror ränder?',
    illustration: 'curiosity',
  },
  {
    label: 'En regnig söndag...',
    title: 'Lek, lär och skratta ihop',
    body: 'Gissningslekar, ramsor, fantasiuppdrag — Uggly är inte bara smart, den är rolig. Och barn lär sig bäst när de har kul.',
    bubble: 'Jag tänker på ett djur med lång hals!',
    illustration: 'play',
  },
];

function ScenarioIllustration({ type }: { type: string }) {
  const decorations: Record<string, React.ReactNode> = {
    bedtime: (
      <>
        {/* Moon */}
        <svg viewBox="0 0 40 40" className="absolute top-4 right-8 w-8 h-8" aria-hidden="true">
          <circle cx="20" cy="20" r="14" fill="var(--color-glow-200)" />
          <circle cx="27" cy="17" r="12" fill="var(--color-night-800)" />
        </svg>
        {/* Stars */}
        {[{ x: 20, y: 15 }, { x: 70, y: 30 }, { x: 45, y: 60 }, { x: 80, y: 10 }].map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-glow-300 animate-twinkle"
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: '4px', height: '4px', animationDelay: `${i * 0.7}s` }}
          />
        ))}
      </>
    ),
    curiosity: (
      <>
        {/* Question marks */}
        {['?', '?', '?'].map((q, i) => (
          <span
            key={i}
            className="absolute font-heading font-bold text-glow-400/40 animate-float"
            style={{
              left: `${20 + i * 25}%`,
              top: `${15 + i * 12}%`,
              fontSize: `${24 + i * 8}px`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {q}
          </span>
        ))}
        {/* Lightbulb */}
        <svg viewBox="0 0 32 32" className="absolute bottom-8 right-12 w-8 h-8" aria-hidden="true">
          <circle cx="16" cy="14" r="8" fill="var(--color-glow-300)" opacity="0.5" />
          <path d="M12 22 L12 18 Q12 14 16 12 Q20 14 20 18 L20 22 Z" fill="var(--color-glow-400)" opacity="0.6" />
        </svg>
      </>
    ),
    play: (
      <>
        {/* Musical notes */}
        {['♪', '♫', '♪'].map((note, i) => (
          <span
            key={i}
            className="absolute text-forest-400/40 animate-float font-bold"
            style={{
              left: `${15 + i * 28}%`,
              top: `${20 + i * 10}%`,
              fontSize: `${20 + i * 4}px`,
              animationDelay: `${i * 0.6}s`,
            }}
          >
            {note}
          </span>
        ))}
        {/* Puzzle piece shape */}
        <svg viewBox="0 0 32 32" className="absolute bottom-10 left-10 w-7 h-7 opacity-30" aria-hidden="true">
          <rect x="4" y="4" width="24" height="24" rx="4" fill="var(--color-glow-400)" />
        </svg>
      </>
    ),
  };

  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-3xl bg-night-900/50 border border-night-700/30 flex items-center justify-center overflow-hidden">
      {/* Owl silhouette in center */}
      <svg
        viewBox="0 0 120 120"
        className="w-20 h-20 md:w-28 md:h-28 opacity-20"
        aria-hidden="true"
      >
        <ellipse cx="60" cy="70" rx="40" ry="45" fill="var(--color-glow-500)" />
        <ellipse cx="60" cy="40" rx="38" ry="32" fill="var(--color-glow-500)" />
        <circle cx="48" cy="38" r="8" fill="var(--color-glow-300)" />
        <circle cx="72" cy="38" r="8" fill="var(--color-glow-300)" />
      </svg>
      {decorations[type]}
    </div>
  );
}

export function ScenarioSection() {
  return (
    <section className="bg-night-50 py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        {scenarios.map((scenario, i) => {
          const isReversed = i % 2 !== 0;
          return (
            <motion.div
              key={scenario.title}
              className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12 ${i > 0 ? 'mt-20 md:mt-28' : ''}`}
              initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Illustration */}
              <div className="w-full md:w-1/2">
                <ScenarioIllustration type={scenario.illustration} />
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2">
                <p className="text-glow-600 font-heading font-semibold italic text-sm mb-2">
                  {scenario.label}
                </p>
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-night-900 mb-4">
                  {scenario.title}
                </h3>
                <p className="text-night-500 leading-relaxed mb-5">
                  {scenario.body}
                </p>
                <SpeechBubble direction={isReversed ? 'right' : 'left'}>
                  <span className="text-sm italic">&ldquo;{scenario.bubble}&rdquo;</span>
                </SpeechBubble>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
