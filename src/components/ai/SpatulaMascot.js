import React from 'react';

/**
 * Friendly cartoon spatula mascot for the AI assistant.
 * Renders a spatula shape with a simple face (eyes + smile).
 */
const SpatulaMascot = ({ className = '', size = 64, animated = false }) => {
  const s = size;
  const viewBox = `0 0 ${s} ${s}`;
  return (
    <svg
      viewBox={viewBox}
      className={`inline-block ${animated ? 'animate-bounce-slow' : ''} ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="spatula-handle" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4a574" />
          <stop offset="100%" stopColor="#c4956a" />
        </linearGradient>
        <linearGradient id="spatula-blade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5e6d3" />
          <stop offset="100%" stopColor="#e8d4b8" />
        </linearGradient>
      </defs>
      {/* Handle */}
      <rect x={s * 0.38} y={s * 0.35} width={s * 0.24} height={s * 0.5} rx={s * 0.04} fill="url(#spatula-handle)" stroke="#b8855a" strokeWidth={s * 0.012} />
      {/* Blade (rounded head) */}
      <ellipse cx={s * 0.5} cy={s * 0.28} rx={s * 0.32} ry={s * 0.2} fill="url(#spatula-blade)" stroke="#c9a876" strokeWidth={s * 0.012} />
      {/* Face: eyes */}
      <ellipse cx={s * 0.38} cy={s * 0.24} rx={s * 0.06} ry={s * 0.07} fill="#2d2d2d" />
      <ellipse cx={s * 0.62} cy={s * 0.24} rx={s * 0.06} ry={s * 0.07} fill="#2d2d2d" />
      <ellipse cx={s * 0.39} cy={s * 0.22} rx={s * 0.02} ry={s * 0.025} fill="#fff" />
      <ellipse cx={s * 0.63} cy={s * 0.22} rx={s * 0.02} ry={s * 0.025} fill="#fff" />
      {/* Smile */}
      <path d={`M ${s * 0.35} ${s * 0.3} Q ${s * 0.5} ${s * 0.42} ${s * 0.65} ${s * 0.3}`} fill="none" stroke="#2d2d2d" strokeWidth={s * 0.018} strokeLinecap="round" />
    </svg>
  );
};

export default SpatulaMascot;
