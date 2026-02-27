import React from 'react';

/**
 * Friendly cartoon spoon mascot for the AI assistant.
 * Polished tablespoon shape with metallic shading, reflection, and face.
 */
const SpoonMascot = ({ className = '', size = 64, animated = false }) => {
  const s = size;
  const viewBox = `0 0 ${s} ${s}`;
  const uid = `spoon-${size}`;

  return (
    <svg
      viewBox={viewBox}
      className={`spoon-mascot inline-block ${animated ? 'spoon-mascot--animated' : ''} ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Bowl: convex metallic (light top-left, darker bottom-right) */}
        <radialGradient id={`${uid}-bowl`} cx="35%" cy="35%" r="75%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="#faf8f3" />
          <stop offset="35%" stopColor="#ebe4d8" />
          <stop offset="70%" stopColor="#d4c9b5" />
          <stop offset="100%" stopColor="#b8a890" />
        </radialGradient>
        {/* Bowl inner shadow (depth) */}
        <radialGradient id={`${uid}-bowl-inner`} cx="50%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#c4b89c" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Reflection highlight on bowl */}
        <ellipse id={`${uid}-reflection-shape`} cx={s * 0.5} cy={s * 0.3} rx={s * 0.2} ry={s * 0.1} />
        <linearGradient id={`${uid}-reflection`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${uid}-reflection-mask`}>
          <ellipse cx={s * 0.5} cy={s * 0.28} rx={s * 0.22} ry={s * 0.12} fill="white" opacity="0.9" />
        </mask>

        {/* Handle: rounded, tapered feel */}
        <linearGradient id={`${uid}-handle`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9a8b6e" />
          <stop offset="25%" stopColor="#c9b896" />
          <stop offset="50%" stopColor="#e2d6c4" />
          <stop offset="75%" stopColor="#c9b896" />
          <stop offset="100%" stopColor="#9a8b6e" />
        </linearGradient>
        <linearGradient id={`${uid}-handle-edge`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7a6d52" />
          <stop offset="100%" stopColor="#8b7d62" />
        </linearGradient>

        {/* Soft outer shadow */}
        <filter id={`${uid}-shadow`} x="-30%" y="-20%" width="160%" height="150%">
          <feDropShadow dx="0" dy="2" stdDeviation="1" floodOpacity="0.2" floodColor="#333" />
        </filter>
        {/* Subtle inner glow for depth */}
        <filter id={`${uid}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" result="blur" />
          <feOffset in="blur" dx="0" dy="0.5" result="offset" />
          <feComposite in="SourceGraphic" in2="offset" operator="over" />
        </filter>
      </defs>

      <g className="spoon-mascot__body" filter={`url(#${uid}-shadow)`}>
        {/* Bowl (main oval) */}
        <ellipse
          cx={s * 0.5}
          cy={s * 0.32}
          rx={s * 0.3}
          ry={s * 0.195}
          fill={`url(#${uid}-bowl)`}
          stroke="#a89878"
          strokeWidth={s * 0.006}
        />
        {/* Inner depth (darker lower arc) */}
        <ellipse
          cx={s * 0.5}
          cy={s * 0.34}
          rx={s * 0.26}
          ry={s * 0.14}
          fill={`url(#${uid}-bowl-inner)`}
          stroke="none"
        />
        {/* Reflection highlight (clipped to bowl) */}
        <g mask={`url(#${uid}-reflection-mask)`}>
          <ellipse
            cx={s * 0.42}
            cy={s * 0.24}
            rx={s * 0.14}
            ry={s * 0.07}
            fill={`url(#${uid}-reflection)`}
          />
        </g>
        {/* Bowl outline (crisp edge) */}
        <ellipse
          cx={s * 0.5}
          cy={s * 0.32}
          rx={s * 0.3}
          ry={s * 0.195}
          fill="none"
          stroke="#a09070"
          strokeWidth={s * 0.005}
          opacity="0.8"
        />

        {/* Face: eyes (rounded, friendly) */}
        <g className="spoon-mascot__eyes">
          <ellipse cx={s * 0.38} cy={s * 0.285} rx={s * 0.052} ry={s * 0.062} fill="#1a1a1a" />
          <ellipse cx={s * 0.62} cy={s * 0.285} rx={s * 0.052} ry={s * 0.062} fill="#1a1a1a" />
          <ellipse cx={s * 0.392} cy={s * 0.268} rx={s * 0.02} ry={s * 0.024} fill="#fff" />
          <ellipse cx={s * 0.632} cy={s * 0.268} rx={s * 0.02} ry={s * 0.024} fill="#fff" />
        </g>
        {/* Smile */}
        <path
          className="spoon-mascot__smile"
          d={`M ${s * 0.355} ${s * 0.345} Q ${s * 0.5} ${s * 0.41} ${s * 0.645} ${s * 0.345}`}
          fill="none"
          stroke="#2d2d2d"
          strokeWidth={s * 0.014}
          strokeLinecap="round"
        />

        {/* Neck (smooth curve from bowl to handle) */}
        <path
          d={`M ${s * 0.42} ${s * 0.48} Q ${s * 0.5} ${s * 0.52} ${s * 0.58} ${s * 0.48}`}
          fill={`url(#${uid}-handle)`}
          stroke="#8b7d62"
          strokeWidth={s * 0.005}
        />

        {/* Handle (rounded rect, slightly narrower at bottom) */}
        <path
          d={`M ${s * 0.405} ${s * 0.49} L ${s * 0.595} ${s * 0.49} L ${s * 0.59} ${s * 0.92} Q ${s * 0.5} ${s * 0.945} ${s * 0.41} ${s * 0.92} Z`}
          fill={`url(#${uid}-handle)`}
          stroke="#8b7d62"
          strokeWidth={s * 0.006}
        />
        {/* Handle center highlight */}
        <path
          d={`M ${s * 0.465} ${s * 0.5} L ${s * 0.535} ${s * 0.5} L ${s * 0.53} ${s * 0.9} Q ${s * 0.5} ${s * 0.915} ${s * 0.47} ${s * 0.9} Z`}
          fill="#fff"
          opacity="0.2"
        />
      </g>
    </svg>
  );
};

export default SpoonMascot;
