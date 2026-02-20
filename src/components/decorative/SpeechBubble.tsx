interface SpeechBubbleProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'bottom';
  className?: string;
}

export function SpeechBubble({ children, direction = 'bottom', className = '' }: SpeechBubbleProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="bg-glow-50 text-night-800 font-heading font-semibold rounded-2xl px-5 py-3 shadow-lg shadow-glow-500/10">
        {children}
      </div>
      {/* Tail */}
      <svg
        className={`absolute ${
          direction === 'bottom'
            ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%-2px)]'
            : direction === 'left'
              ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(100%-2px)]'
              : 'right-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%-2px)]'
        }`}
        width="20"
        height="12"
        viewBox="0 0 20 12"
        fill="none"
        aria-hidden="true"
        style={
          direction === 'left'
            ? { transform: 'translateX(calc(-100% + 2px)) translateY(-50%) rotate(90deg)' }
            : direction === 'right'
              ? { transform: 'translateX(calc(100% - 2px)) translateY(-50%) rotate(-90deg)' }
              : undefined
        }
      >
        <path d="M0 0 L10 12 L20 0" fill="var(--color-glow-50)" />
      </svg>
    </div>
  );
}
