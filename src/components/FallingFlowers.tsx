import { useMemo } from 'react';

const FLOWER_COUNT = 40;

/** Marigold SVG: 8 petals + center, yellow or orange */
function MarigoldSvg({
  color,
  size,
  className = '',
}: {
  color: 'yellow' | 'orange';
  size: number;
  className?: string;
}) {
  const petalFill = color === 'yellow' ? '#FACC15' : '#FB923C';
  const centerFill = color === 'yellow' ? '#CA8A04' : '#EA580C';

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg}
          cx="12"
          cy="6"
          rx="2.8"
          ry="4.5"
          fill={petalFill}
          transform={`rotate(${deg} 12 12)`}
        />
      ))}
      <circle cx="12" cy="12" r="2" fill={centerFill} />
    </svg>
  );
}

/** Deterministic "random" values per index for stable layout, with more variation */
function flowerConfig(index: number) {
  const s = index * 1.618033989;
  const s2 = index * 2.718281828;
  const s3 = index * 0.866025404;
  return {
    id: index,
    left: (Math.floor(s * 137) % 96),
    delay: Math.floor((s * 1500) % 12000),
    duration: 10000 + Math.floor((s2 * 500) % 10000),
    driftX: (Math.floor(s3 * 100) % 2 === 0 ? 1 : -1) * (10 + (Math.floor(s * 47) % 20)),
    color: index % 2 === 0 ? 'yellow' : 'orange',
    size: index % 3 === 0 ? 16 : index % 3 === 1 ? 24 : 32,
  };
}

const FLOWERS = Array.from({ length: FLOWER_COUNT }, (_, i) => flowerConfig(i));

export function FallingFlowers() {
  const flowers = useMemo(() => FLOWERS, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {flowers.map((f) => (
        <div
          key={f.id}
          className="absolute animate-flower-fall opacity-90"
          style={{
            left: `${f.left}%`,
            animationDelay: `${f.delay}ms`,
            animationDuration: `${f.duration}ms`,
            ['--drift-x' as string]: `${f.driftX}px`,
          }}
        >
          <MarigoldSvg color={f.color} size={f.size} />
        </div>
      ))}
    </div>
  );
}
