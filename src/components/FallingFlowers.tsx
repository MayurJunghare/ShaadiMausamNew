import { useMemo } from 'react';

const FLOWER_COUNT = 36;

/** Deterministic "random" values per index for stable layout */
function flowerConfig(index: number) {
  const s = index * 1.618033989; // golden ratio for spread
  return {
    id: index,
    left: 5 + (Math.floor(s * 100) % 90),
    delay: Math.floor((s * 1000) % 8000),
    duration: 12000 + Math.floor((s * 100) % 8000),
    color: index % 3 === 0 ? 'orange' : index % 3 === 1 ? 'yellow' : 'amber',
    size: index % 3 === 0 ? 'sm' : index % 3 === 1 ? 'md' : 'lg',
  };
}

const FLOWERS = Array.from({ length: FLOWER_COUNT }, (_, i) => flowerConfig(i));

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

const colorClasses = {
  yellow: 'bg-yellow-400/60',
  orange: 'bg-orange-400/60',
  amber: 'bg-amber-300/60',
};

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
          className={`absolute rounded-full animate-flower-fall ${sizeClasses[f.size]} ${colorClasses[f.color]}`}
          style={{
            left: `${f.left}%`,
            animationDelay: `${f.delay}ms`,
            animationDuration: `${f.duration}ms`,
          }}
        />
      ))}
    </div>
  );
}
