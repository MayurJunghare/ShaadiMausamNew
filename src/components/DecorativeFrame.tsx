import { useId, type ReactNode } from 'react';

interface DecorativeFrameProps {
  children: ReactNode;
}

/** Ornate gold top border strip - repeating pattern */
function GoldTopBorder() {
  const id = useId();
  const patternId = `gold-pattern-${id.replace(/:/g, '')}`;
  return (
    <div className="w-full h-3 sm:h-4 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 400 20"
        className="w-full h-full text-gold-400"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id={patternId} x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q10 0 20 10 Q30 20 40 10" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
            <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.8" />
            <circle cx="30" cy="10" r="2" fill="currentColor" opacity="0.8" />
          </pattern>
        </defs>
        <rect width="400" height="20" fill={`url(#${patternId})`} />
        <rect x="0" y="18" width="400" height="2" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}

/** Hanging garland - flowers and bells (single side) */
function GarlandSvg({ mirror = false }: { mirror?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 200"
      className={`absolute top-0 w-12 sm:w-16 h-[200px] sm:h-[260px] text-gold-500 pointer-events-none ${
        mirror ? 'right-0 scale-x-[-1]' : 'left-0'
      }`}
      aria-hidden
    >
      {/* Rope/string */}
      <path
        d="M30 0 Q20 40 30 80 Q40 120 30 160 Q20 200 30 200"
        fill="none"
        stroke="#B56D2E"
        strokeWidth="2"
        opacity="0.8"
      />
      {/* Golden bells */}
      <ellipse cx="30" cy="25" rx="8" ry="10" fill="#D4883D" stroke="#8B5424" strokeWidth="1" />
      <ellipse cx="30" cy="70" rx="8" ry="10" fill="#D4883D" stroke="#8B5424" strokeWidth="1" />
      <ellipse cx="30" cy="115" rx="8" ry="10" fill="#D4883D" stroke="#8B5424" strokeWidth="1" />
      <ellipse cx="30" cy="160" rx="8" ry="10" fill="#D4883D" stroke="#8B5424" strokeWidth="1" />
      {/* Flowers - marigold style (red/white) */}
      <circle cx="30" cy="45" r="6" fill="#AF3747" stroke="#800020" strokeWidth="0.8" />
      <circle cx="26" cy="42" r="3" fill="#FFFDF5" opacity="0.9" />
      <circle cx="30" cy="90" r="6" fill="#AF3747" stroke="#800020" strokeWidth="0.8" />
      <circle cx="26" cy="87" r="3" fill="#FFFDF5" opacity="0.9" />
      <circle cx="30" cy="135" r="6" fill="#AF3747" stroke="#800020" strokeWidth="0.8" />
      <circle cx="26" cy="132" r="3" fill="#FFFDF5" opacity="0.9" />
    </svg>
  );
}

export function DecorativeFrame({ children }: DecorativeFrameProps) {
  return (
    <div className="relative">
      <GoldTopBorder />
      <GarlandSvg />
      <GarlandSvg mirror />
      <div className="relative z-10 px-2 sm:px-4">
        {children}
      </div>
    </div>
  );
}
