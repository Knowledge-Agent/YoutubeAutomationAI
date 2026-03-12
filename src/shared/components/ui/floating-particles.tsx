import type { CSSProperties } from 'react';

import { cn } from '@/shared/lib/utils';

export type FloatingParticle = {
  left: string;
  top: string;
  size: string;
  opacity?: number;
  duration?: string;
  delay?: string;
  color?: string;
  blur?: string;
  variant?: 'float' | 'drift';
};

export function FloatingParticles({
  particles,
  className,
}: {
  particles: FloatingParticle[];
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {particles.map((particle, index) => {
        const style = {
          left: particle.left,
          top: particle.top,
          width: particle.size,
          height: particle.size,
          opacity: particle.opacity ?? 0.28,
          backgroundColor: particle.color ?? 'rgba(24, 24, 27, 0.42)',
          '--particle-duration': particle.duration ?? '18s',
          '--particle-delay': particle.delay ?? '0s',
          filter: particle.blur ? `blur(${particle.blur})` : undefined,
        } as CSSProperties;

        return (
          <span
            key={`${particle.left}-${particle.top}-${index}`}
            className={cn(
              'absolute rounded-full motion-reduce:animate-none',
              particle.variant === 'drift' ? 'particle-drift' : 'particle-float'
            )}
            style={style}
          />
        );
      })}
    </div>
  );
}
