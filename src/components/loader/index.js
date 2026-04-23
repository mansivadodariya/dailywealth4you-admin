'use client';

import React from 'react';

export default function Loader({ color = '#22c55e' }) {
  const dotStyle = (delay) => ({
    borderRadius: '50%',
    background: color,
    animation: `dotGrow 1.2s ease-in-out infinite`,
    animationDelay: delay,
  });

  return (
    <span
      role="status"
      aria-label="Loading"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
    >
      <style>{`
        @keyframes dotGrow {
          0%, 100% { width: 4px;  height: 4px;  opacity: 0.4; }
          50%       { width: 12px; height: 12px; opacity: 1; }
        }
      `}</style>
      <span style={dotStyle('0s')} />
      <span style={dotStyle('0.2s')} />
      <span style={dotStyle('0.4s')} />
    </span>
  );
}
