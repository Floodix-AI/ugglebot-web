interface CloudIllustrationProps {
  className?: string;
}

export function CloudIllustration({ className = '' }: CloudIllustrationProps) {
  return (
    <svg
      width="200"
      height="60"
      viewBox="0 0 200 60"
      fill="none"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <path
        d="M30 45 Q30 30 50 30 Q55 15 75 18 Q85 8 105 15 Q120 5 140 15 Q160 10 165 25 Q180 25 180 40 Q180 50 165 50 L40 50 Q25 50 30 45 Z"
        fill="white"
        opacity="0.05"
      />
    </svg>
  );
}
