import { useId, type ReactNode } from 'react';

interface WeddingFrameProps {
  children: ReactNode;
}

/** Decorative golden top border – ornamental, separates header from body */
function GoldenTopBorder() {
  const id = useId();
  const pid = `gold-border-${id.replace(/:/g, '')}`;
  return (
    <div className="w-full h-2 sm:h-3 flex-shrink-0" aria-hidden>
      <svg viewBox="0 0 400 16" className="w-full h-full text-amber-700/90" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`${pid}-g`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8D4A0" />
            <stop offset="50%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#A67C00" />
          </linearGradient>
          <pattern id={pid} x="0" y="0" width="50" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 8 Q12 2 25 8 Q38 14 50 8" fill="none" stroke={`url(#${pid}-g)`} strokeWidth="1" opacity="0.9" />
            <circle cx="12" cy="8" r="1.5" fill="#C9A227" opacity="0.85" />
            <circle cx="38" cy="8" r="1.5" fill="#C9A227" opacity="0.85" />
          </pattern>
        </defs>
        <rect width="400" height="16" fill={`url(#${pid})`} />
      </svg>
    </div>
  );
}

/** Soft vertical garland – flowers and beads, frames the stage */
function SideGarland({ mirror, gradientId }: { mirror?: boolean; gradientId: string }) {
  return (
    <svg
      viewBox="0 0 56 180"
      className={`absolute top-0 w-10 sm:w-14 md:w-16 h-[160px] sm:h-[200px] md:h-[220px] pointer-events-none opacity-95 ${
        mirror ? 'right-0 scale-x-[-1]' : 'left-0'
      }`}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A67C00" />
        </linearGradient>
      </defs>
      {/* String */}
      <path d="M28 0 Q24 45 28 90 Q32 135 28 180" fill="none" stroke="#B8860B" strokeWidth="1.5" opacity="0.75" />
      {/* Beads */}
      <ellipse cx="28" cy="22" rx="6" ry="8" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="0.8" opacity="0.9" />
      <ellipse cx="28" cy="58" rx="6" ry="8" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="0.8" opacity="0.9" />
      <ellipse cx="28" cy="94" rx="6" ry="8" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="0.8" opacity="0.9" />
      <ellipse cx="28" cy="130" rx="6" ry="8" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="0.8" opacity="0.9" />
      {/* Soft flowers – maroon and ivory */}
      <circle cx="28" cy="40" r="5" fill="#800020" fillOpacity="0.85" stroke="#66001A" strokeWidth="0.5" />
      <circle cx="25" cy="37" r="2" fill="#FFFDF5" opacity="0.9" />
      <circle cx="28" cy="76" r="4.5" fill="#FFFBF7" stroke="#E8DED0" strokeWidth="0.5" />
      <circle cx="28" cy="112" r="5" fill="#800020" fillOpacity="0.85" stroke="#66001A" strokeWidth="0.5" />
      <circle cx="25" cy="109" r="2" fill="#FFFDF5" opacity="0.9" />
      <circle cx="28" cy="148" r="4.5" fill="#FFFBF7" stroke="#E8DED0" strokeWidth="0.5" />
    </svg>
  );
}

/** Very subtle petal accents (optional wedding iconography) */
function PetalAccents() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      <span className="absolute top-16 left-[8%] w-2 h-3 rounded-full bg-rose-200/30 transform -rotate-12" />
      <span className="absolute top-28 right-[10%] w-2.5 h-2 rounded-full bg-pink-100/40 transform rotate-6" />
      <span className="absolute bottom-32 left-[12%] w-2 h-2.5 rounded-full bg-rose-100/25 transform -rotate-6" />
      <span className="absolute bottom-48 right-[8%] w-2 h-2 rounded-full bg-pink-200/20" />
    </div>
  );
}

export function WeddingFrame({ children }: WeddingFrameProps) {
  const idPrefix = useId().replace(/:/g, '');
  return (
    <div className="relative">
      <GoldenTopBorder />
      <SideGarland gradientId={`${idPrefix}-g-l`} />
      <SideGarland mirror gradientId={`${idPrefix}-g-r`} />
      <PetalAccents />
      <div className="relative z-10 px-3 sm:px-4 md:px-6">
        {children}
      </div>
    </div>
  );
}
