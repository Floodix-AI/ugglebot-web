interface WaveDividerProps {
  topColor?: string;
  bottomColor?: string;
  flip?: boolean;
  className?: string;
}

export function WaveDivider({
  topColor = 'var(--color-night-900)',
  bottomColor = 'var(--color-night-50)',
  flip = false,
  className = '',
}: WaveDividerProps) {
  return (
    <div
      className={`w-full leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}
      aria-hidden="true"
      style={{ backgroundColor: topColor }}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="w-full h-[50px] md:h-[80px] block"
      >
        <path
          d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
}
