'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { UgglyOwlAnimated } from '@/components/icons/UgglyOwlAnimated';
import { SpeechBubble } from '@/components/decorative/SpeechBubble';
import { NightSky } from '@/components/decorative/NightSky';

export function CtaSection() {
  return (
    <section className="relative bg-gradient-to-b from-night-900 to-night-950 py-24 md:py-32 px-6 text-center overflow-hidden">
      <NightSky className="opacity-50" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <SpeechBubble direction="bottom" className="mb-3">
            <span className="text-sm">Vi ses ikväll!</span>
          </SpeechBubble>
          <div style={{ filter: 'drop-shadow(0 0 40px rgba(232,168,23,0.25))' }}>
            <UgglyOwlAnimated size={180} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Låt äventyret börja
          </h2>
          <p className="text-night-300 text-lg mb-10 max-w-lg mx-auto">
            Beställ idag — Uggly kommer hem till dig inom några dagar.
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-glow-500 text-night-950 rounded-full text-lg font-bold font-heading hover:bg-glow-400 transition-all shadow-lg shadow-glow-500/25"
          >
            Beställ nu
            <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
