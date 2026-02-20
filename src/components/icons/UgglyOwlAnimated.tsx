'use client';

import { useId } from 'react';

interface UgglyOwlAnimatedProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export function UgglyOwlAnimated({ size = 280, animate = true, className = '' }: UgglyOwlAnimatedProps) {
  const uid = useId();
  const bodyId = `body-${uid}`;
  const headId = `head-${uid}`;
  const eyeId = `eye-${uid}`;
  const shadowId = `shadow-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Uggly — en pratande ugglekompis"
    >
      <defs>
        <linearGradient id={bodyId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="100%" stopColor="#6B4F12" />
        </linearGradient>
        <linearGradient id={headId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9B7620" />
          <stop offset="100%" stopColor="#7A5B15" />
        </linearGradient>
        <radialGradient id={eyeId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD93D" />
          <stop offset="60%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#E8941A" />
        </radialGradient>
        <filter id={shadowId} x="-10%" y="-5%" width="120%" height="115%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#3E2C0A" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Outer group: position only (SVG transform, no CSS) */}
      <g transform="translate(200, 180)" filter={`url(#${shadowId})`}>
        {/* Inner group: CSS float animation (no SVG transform to conflict) */}
        <g className={animate ? 'animate-float' : ''}>
          {/* Body */}
          <ellipse cx="0" cy="30" rx="120" ry="130" fill={`url(#${bodyId})`} />

          {/* Belly */}
          <ellipse cx="0" cy="70" rx="70" ry="75" fill="#C4A24E" opacity="0.45" />

          {/* Head */}
          <ellipse cx="0" cy="-50" rx="108" ry="92" fill={`url(#${headId})`} />

          {/* Feather texture */}
          <path d="M -50 -80 Q -30 -95 -10 -80" stroke="#6B4F12" strokeWidth="1.5" fill="none" opacity="0.3" />
          <path d="M 10 -85 Q 30 -100 50 -85" stroke="#6B4F12" strokeWidth="1.5" fill="none" opacity="0.3" />
          <path d="M -30 -70 Q -10 -82 10 -70" stroke="#6B4F12" strokeWidth="1.5" fill="none" opacity="0.25" />

          {/* Ear tufts */}
          <path d="M -75 -110 Q -90 -165 -45 -120 Q -70 -140 -60 -100 Z" fill="#7A5B15" />
          <path d="M 75 -110 Q 90 -165 45 -120 Q 70 -140 60 -100 Z" fill="#7A5B15" />

          {/* Eye rings */}
          <circle cx="-38" cy="-50" r="42" fill="#5C4410" opacity="0.4" />
          <circle cx="38" cy="-50" r="42" fill="#5C4410" opacity="0.4" />

          {/* Left eye - position group wraps blink group */}
          <g transform="translate(-38, -50)">
            <g className={animate ? 'animate-blink' : ''}>
              <circle cx="0" cy="0" r="38" fill="#FFF8EC" />
              <circle cx="4" cy="-3" r="24" fill={`url(#${eyeId})`} />
              <circle cx="8" cy="-7" r="12" fill="#2A1F08" />
              <circle cx="13" cy="-11" r="5" fill="white" opacity="0.85" />
              <circle cx="4" cy="0" r="2.5" fill="white" opacity="0.5" />
            </g>
          </g>

          {/* Right eye - position group wraps blink group */}
          <g transform="translate(38, -50)">
            <g
              className={animate ? 'animate-blink' : ''}
              style={{ animationDelay: '0.1s' }}
            >
              <circle cx="0" cy="0" r="38" fill="#FFF8EC" />
              <circle cx="4" cy="-3" r="24" fill={`url(#${eyeId})`} />
              <circle cx="8" cy="-7" r="12" fill="#2A1F08" />
              <circle cx="13" cy="-11" r="5" fill="white" opacity="0.85" />
              <circle cx="2" cy="0" r="2.5" fill="white" opacity="0.5" />
            </g>
          </g>

          {/* Beak */}
          <path d="M -10 -25 L 0 -8 L 10 -25 Z" fill="#E8941A" />

          {/* Smile */}
          <path d="M -12 -5 Q 0 5 12 -5" stroke="#5C4410" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Wings */}
          <path d="M -110 -10 Q -140 30 -120 80 Q -108 50 -95 65 Q -115 25 -100 -5 Z" fill="#5C4410" />
          <path d="M 110 -10 Q 140 30 120 80 Q 108 50 95 65 Q 115 25 100 -5 Z" fill="#5C4410" />

          {/* Wing feather lines */}
          <path d="M -118 20 Q -108 35 -105 55" stroke="#4A3610" strokeWidth="1.5" fill="none" opacity="0.3" />
          <path d="M 118 20 Q 108 35 105 55" stroke="#4A3610" strokeWidth="1.5" fill="none" opacity="0.3" />

          {/* Feet */}
          <ellipse cx="-30" cy="158" rx="25" ry="10" fill="#E8941A" />
          <ellipse cx="30" cy="158" rx="25" ry="10" fill="#E8941A" />

          {/* Toe lines */}
          <line x1="-42" y1="158" x2="-38" y2="158" stroke="#C47A12" strokeWidth="1.5" />
          <line x1="-30" y1="158" x2="-30" y2="163" stroke="#C47A12" strokeWidth="1.5" />
          <line x1="-18" y1="158" x2="-22" y2="158" stroke="#C47A12" strokeWidth="1.5" />
          <line x1="18" y1="158" x2="22" y2="158" stroke="#C47A12" strokeWidth="1.5" />
          <line x1="30" y1="158" x2="30" y2="163" stroke="#C47A12" strokeWidth="1.5" />
          <line x1="42" y1="158" x2="38" y2="158" stroke="#C47A12" strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  );
}
