import { useId, type ReactNode } from 'react';

interface DecorativeFrameProps {
  children: ReactNode;
}

/** Grand ornate gold top border - traditional Indian style */
function GoldTopBorder() {
  const id = useId();
  const patternId = `gold-ornate-${id.replace(/:/g, '')}`;
  return (
    <div className="w-full h-6 sm:h-8 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 400 32"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`${patternId}-grad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8C547" />
            <stop offset="50%" stopColor="#D4A84B" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <pattern id={patternId} x="0" y="0" width="80" height="32" patternUnits="userSpaceOnUse">
            <path d="M0 16 Q20 4 40 16 Q60 28 80 16" fill="none" stroke={`url(#${patternId}-grad)`} strokeWidth="1.2" opacity="0.95" />
            <path d="M10 12 L14 20 L10 28 M70 12 L66 20 L70 28" fill="none" stroke={`url(#${patternId}-grad)`} strokeWidth="0.8" opacity="0.8" />
            <circle cx="20" cy="16" r="2.5" fill="#D4A84B" opacity="0.9" />
            <circle cx="60" cy="16" r="2.5" fill="#D4A84B" opacity="0.9" />
          </pattern>
        </defs>
        <rect width="400" height="32" fill={`url(#${patternId})`} />
        <rect x="0" y="28" width="400" height="4" fill="#B8860B" opacity="0.7" />
      </svg>
    </div>
  );
}

/** Flower shape for garland */
function Flower({ cx, cy, r = 6, red = true }: { cx: number; cy: number; r?: number; red?: boolean }) {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <circle r={r} fill={red ? '#AF3747' : '#FFF8F0'} stroke="#800020" strokeWidth="0.6" opacity={red ? 1 : 0.95} />
      <circle r={r * 0.4} cx={-r * 0.3} cy={-r * 0.3} fill="#FFFDF5" opacity="0.9" />
    </g>
  );
}

/** Hanging garland - red/white flowers, golden beads, tassels */
function GarlandSvg({ mirror = false }: { mirror?: boolean }) {
  return (
    <svg
      viewBox="0 0 80 240"
      className={`absolute top-0 w-14 sm:w-20 h-[220px] sm:h-[280px] pointer-events-none ${
        mirror ? 'right-0 scale-x-[-1]' : 'left-0'
      }`}
      aria-hidden
    >
      {/* Main string/rope */}
      <path
        d="M40 0 C35 50 45 100 40 150 C35 200 40 240 40 240"
        fill="none"
        stroke="#8B6914"
        strokeWidth="2.5"
        opacity="0.85"
      />
      {/* Golden beads/tassels */}
      <ellipse cx="40" cy="22" rx="10" ry="12" fill="#D4A84B" stroke="#8B6914" strokeWidth="1" />
      <ellipse cx="40" cy="70" rx="10" ry="12" fill="#D4A84B" stroke="#8B6914" strokeWidth="1" />
      <ellipse cx="40" cy="118" rx="10" ry="12" fill="#D4A84B" stroke="#8B6914" strokeWidth="1" />
      <ellipse cx="40" cy="166" rx="10" ry="12" fill="#D4A84B" stroke="#8B6914" strokeWidth="1" />
      {/* Tassel at bottom */}
      <path d="M40 220 L38 235 M40 220 L40 238 M40 220 L42 235" stroke="#B8860B" strokeWidth="1.2" strokeLinecap="round" />
      {/* Red/white flowers */}
      <Flower cx={40} cy={46} r={7} red />
      <Flower cx={40} cy={94} r={6} red={false} />
      <Flower cx={40} cy={142} r={7} red />
      <Flower cx={40} cy={190} r={6} red={false} />
    </svg>
  );
}

/** Bottom-left corner floral cluster */
function CornerFloralCluster() {
  return (
    <svg
      viewBox="0 0 120 100"
      className="absolute bottom-0 left-0 w-24 sm:w-32 h-20 sm:h-28 pointer-events-none opacity-90"
      aria-hidden
    >
      {/* Leaves */}
      <ellipse cx="25" cy="75" rx="12" ry="6" fill="#2D5A27" opacity="0.85" transform="rotate(-20 25 75)" />
      <ellipse cx="45" cy="82" rx="10" ry="5" fill="#3D6B35" opacity="0.8" transform="rotate(10 45 82)" />
      <ellipse cx="60" cy="78" rx="11" ry="5" fill="#2D5A27" opacity="0.85" transform="rotate(-5 60 78)" />
      {/* Red/pink flowers */}
      <circle cx="20" cy="70" r="8" fill="#AF3747" stroke="#800020" strokeWidth="0.8" />
      <circle cx="20" cy="70" r="3" fill="#FFF5F5" opacity="0.9" />
      <circle cx="50" cy="75" r="9" fill="#C71585" opacity="0.9" stroke="#800020" strokeWidth="0.6" />
      <circle cx="50" cy="75" r="3.5" fill="#FFF0F5" opacity="0.9" />
      <circle cx="75" cy="72" r="7" fill="#AF3747" stroke="#800020" strokeWidth="0.7" />
      <circle cx="75" cy="72" r="2.5" fill="#FFFDF5" opacity="0.9" />
    </svg>
  );
}

export function DecorativeFrame({ children }: DecorativeFrameProps) {
  return (
    <div className="relative">
      <GoldTopBorder />
      <GarlandSvg />
      <GarlandSvg mirror />
      <CornerFloralCluster />
      <div className="relative z-10 px-2 sm:px-4">
        {children}
      </div>
    </div>
  );
}
