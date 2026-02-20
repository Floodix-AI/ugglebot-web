'use client';

const STARS = [
  { x: 5, y: 8, s: 1.5, d: 0 }, { x: 12, y: 15, s: 1, d: 1.8 },
  { x: 18, y: 5, s: 2, d: 0.5 }, { x: 25, y: 22, s: 1, d: 2.3 },
  { x: 32, y: 10, s: 1.5, d: 1.1 }, { x: 38, y: 28, s: 1, d: 0.3 },
  { x: 45, y: 6, s: 2, d: 2.8 }, { x: 52, y: 18, s: 1, d: 1.5 },
  { x: 58, y: 32, s: 1.5, d: 0.8 }, { x: 65, y: 12, s: 1, d: 2.1 },
  { x: 72, y: 25, s: 2, d: 0.2 }, { x: 78, y: 8, s: 1, d: 1.7 },
  { x: 85, y: 20, s: 1.5, d: 2.6 }, { x: 92, y: 14, s: 1, d: 0.9 },
  { x: 95, y: 30, s: 2, d: 1.3 }, { x: 8, y: 40, s: 1, d: 2.0 },
  { x: 15, y: 55, s: 1.5, d: 0.6 }, { x: 22, y: 45, s: 1, d: 1.9 },
  { x: 35, y: 50, s: 2, d: 0.1 }, { x: 42, y: 38, s: 1, d: 2.5 },
  { x: 55, y: 48, s: 1.5, d: 1.0 }, { x: 62, y: 42, s: 1, d: 0.4 },
  { x: 75, y: 52, s: 2, d: 2.2 }, { x: 82, y: 35, s: 1, d: 1.6 },
  { x: 88, y: 45, s: 1.5, d: 2.9 }, { x: 48, y: 60, s: 1, d: 0.7 },
  { x: 3, y: 68, s: 1.5, d: 1.4 }, { x: 28, y: 65, s: 1, d: 2.7 },
  { x: 68, y: 58, s: 2, d: 0.3 }, { x: 90, y: 62, s: 1, d: 1.2 },
  { x: 50, y: 3, s: 1.5, d: 2.4 }, { x: 97, y: 5, s: 1, d: 0.8 },
  { x: 2, y: 25, s: 1, d: 1.6 }, { x: 40, y: 15, s: 1.5, d: 2.0 },
];

interface NightSkyProps {
  className?: string;
  density?: 'full' | 'sparse';
}

export function NightSky({ className = '', density = 'full' }: NightSkyProps) {
  const stars = density === 'sparse' ? STARS.slice(0, 15) : STARS;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.s}px`,
            height: `${star.s}px`,
            animationDelay: `${star.d}s`,
            animationDuration: `${2.5 + star.d * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}
