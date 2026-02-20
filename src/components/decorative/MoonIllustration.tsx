interface MoonIllustrationProps {
  size?: number;
  className?: string;
}

export function MoonIllustration({ size = 80, className = '' }: MoonIllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      aria-hidden="true"
      role="presentation"
      style={{ filter: 'drop-shadow(0 0 20px rgba(232,168,23,0.3))' }}
    >
      <circle cx="40" cy="40" r="30" fill="var(--color-glow-200)" />
      <circle cx="52" cy="34" r="26" fill="var(--color-night-900)" />
    </svg>
  );
}
