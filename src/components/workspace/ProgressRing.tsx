import React from 'react';

interface ProgressRingProps {
  pct: number;
  color?: string;
  size?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  pct,
  color = '#7c5cf0',
  size = 16,
}) => {
  const r = 6;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c;

  return (
    <svg
      className="progress-ring"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ flexShrink: 0 }}
    >
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        stroke="#eceae4"
        strokeWidth="2"
      />
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 8 8)"
        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
      />
    </svg>
  );
};

export default ProgressRing;
