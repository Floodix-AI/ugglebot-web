'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Anna L.',
    location: 'Stockholm',
    text: 'Min dotter pratar med Uggly varje kväll. Hon ber om godnattsagor och ställer de galnaste frågorna — och Uggly svarar alltid tålmodigt.',
    stars: 5,
    rotate: '-rotate-1',
  },
  {
    name: 'Erik M.',
    location: 'Göteborg',
    text: 'Äntligen en AI-produkt som jag känner mig trygg med som förälder. Budgetgränsen och föräldrakontrollen är fantastisk.',
    stars: 5,
    rotate: 'rotate-1',
  },
  {
    name: 'Sara K.',
    location: 'Malmö',
    text: 'Våra barn (5 och 8 år) är helt förtjusta. Uggly anpassar sig efter deras åldrar och pratar perfekt svenska.',
    stars: 5,
    rotate: '-rotate-0.5',
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-glow-50 py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-night-900">
            Familjer som redan älskar Uggly
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className={`bg-white rounded-3xl p-6 md:p-8 shadow-md shadow-glow-500/5 border border-glow-100 ${t.rotate}`}
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-glow-500 fill-glow-500" />
                ))}
              </div>
              <p className="text-night-600 leading-relaxed mb-5">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="text-sm">
                <span className="font-heading font-bold text-night-900">{t.name}</span>
                <span className="text-night-400 ml-2">{t.location}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
