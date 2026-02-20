const safetyItems = [
  {
    title: 'Inga skärmar',
    description: 'Enbart röst och lyssnande. Ingen skrolling, ingen reklam, inga distraktioner.',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" aria-hidden="true">
        <rect x="8" y="8" width="24" height="18" rx="2" fill="none" stroke="var(--color-glow-400)" strokeWidth="2" />
        <rect x="14" y="28" width="12" height="2" rx="1" fill="var(--color-glow-400)" opacity="0.6" />
        <line x1="10" y1="32" x2="30" y2="10" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Du bestämmer',
    description: 'Sätt daglig tid, budget och innehållsregler. Allt i din dashboard.',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" aria-hidden="true">
        <path d="M20 6 L32 14 L32 26 Q32 34 20 38 Q8 34 8 26 L8 14 Z" fill="none" stroke="var(--color-forest-400)" strokeWidth="2" />
        <circle cx="20" cy="22" r="5" fill="var(--color-forest-400)" opacity="0.3" />
        <path d="M17 22 L19 24 L23 20" stroke="var(--color-forest-400)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Åldersanpassat',
    description: 'Varje svar anpassas efter barnets ålder. Aldrig olämpligt innehåll.',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" aria-hidden="true">
        <circle cx="20" cy="14" r="6" fill="none" stroke="var(--color-glow-400)" strokeWidth="2" />
        <path d="M10 34 Q10 24 20 24 Q30 24 30 34" fill="none" stroke="var(--color-glow-400)" strokeWidth="2" />
        <path d="M28 12 L32 8" stroke="var(--color-glow-300)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="33" cy="7" r="2" fill="var(--color-glow-300)" />
      </svg>
    ),
  },
  {
    title: 'Transparent kostnad',
    description: 'Se exakt vad samtalen kostar. Du sätter maxgräns som aldrig överskrids.',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10" aria-hidden="true">
        <rect x="6" y="12" width="28" height="18" rx="3" fill="none" stroke="var(--color-forest-400)" strokeWidth="2" />
        <line x1="6" y1="18" x2="34" y2="18" stroke="var(--color-forest-400)" strokeWidth="2" />
        <circle cx="28" cy="24" r="3" fill="var(--color-forest-400)" opacity="0.3" />
        <path d="M26 24 L27.5 25.5 L30 23" stroke="var(--color-forest-400)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function SafetySection() {
  return (
    <section className="bg-night-900 py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Gjord för barn. Styrd av dig.
          </h2>
          <p className="text-night-300 text-lg max-w-xl mx-auto">
            Vi är föräldrar själva. Därför är trygghet inbyggt i allt Uggly gör.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safetyItems.map((item) => (
            <div
              key={item.title}
              className="bg-night-800/50 border border-night-700/40 rounded-3xl p-6 md:p-8"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                {item.title}
              </h3>
              <p className="text-night-300 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
