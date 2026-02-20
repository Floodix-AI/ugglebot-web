'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { UgglyOwlAnimated } from '@/components/icons/UgglyOwlAnimated';
import { NightSky } from '@/components/decorative/NightSky';
import { SpeechBubble } from '@/components/decorative/SpeechBubble';
import { MoonIllustration } from '@/components/decorative/MoonIllustration';
import { CloudIllustration } from '@/components/decorative/CloudIllustration';

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center bg-gradient-to-b from-night-950 via-night-900 to-night-950 overflow-hidden">
      {/* Night sky background */}
      <NightSky />

      {/* Moon */}
      <div className="absolute top-20 right-[8%] md:right-[12%]">
        <MoonIllustration size={60} className="md:w-[80px] md:h-[80px]" />
      </div>

      {/* Drifting clouds */}
      <div className="absolute top-[15%] animate-drift" style={{ animationDuration: '50s' }}>
        <CloudIllustration />
      </div>
      <div className="absolute top-[35%] animate-drift" style={{ animationDuration: '65s', animationDelay: '15s' }}>
        <CloudIllustration />
      </div>

      {/* Main glow behind owl */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(232,168,23,0.18) 0%, rgba(232,168,23,0.05) 40%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20 pb-16">
        {/* Owl + Speech Bubble */}
        <motion.div
          className="mb-6 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Speech bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4, ease: 'easeOut' }}
            className="mb-4"
          >
            <SpeechBubble direction="bottom">
              <span className="text-sm md:text-base">Hej! Ska vi hitta på något kul? ✨</span>
            </SpeechBubble>
          </motion.div>

          {/* Animated Owl */}
          <div
            style={{ filter: 'drop-shadow(0 0 60px rgba(232,168,23,0.3))' }}
          >
            <UgglyOwlAnimated size={200} className="w-[180px] h-[180px] md:w-[260px] md:h-[260px] lg:w-[300px] lg:h-[300px]" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-tight mb-5 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Ugglan som lär ditt barn nya saker varje dag
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-night-300 max-w-2xl mx-auto mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Uggly berättar sagor, svarar på nyfikna frågor och gör lärande
          till lek. Helt utan skärm.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-glow-500 text-night-950 rounded-full text-lg font-bold font-heading hover:bg-glow-400 transition-all shadow-lg shadow-glow-500/25"
          >
            Kom igång
            <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
