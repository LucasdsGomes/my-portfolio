'use client';

import { useEffect, useRef } from 'react';
import type { GameRegion } from '@/types/portfolio';
import { Ornament } from './Ornament';
import { playSfx } from './audio/sound';

interface RegionCardProps {
  id: string;
  region: GameRegion;
}

/**
 * O anúncio de chegada numa região: nome em capitais entre dois traços,
 * e a linha menor embaixo. Diferente do jogo, aqui ele não some depois:
 * numa página que rola, o nome da região é também o título da seção, e
 * sumir com ele tiraria a orientação de quem chega pela rolagem.
 */
export function RegionCard({ id, region }: RegionCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.dataset.state = 'shown';
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        node.dataset.state = 'shown';
        playSfx('regiao');
        observer.disconnect();
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="region-card flex flex-col items-center text-center" data-state="hidden">
      <Ornament className="region-ornament w-56 sm:w-72" />
      <h2
        id={id}
        className="mt-3 font-title text-3xl font-semibold tracking-[0.14em] text-bone uppercase sm:text-5xl"
      >
        {region.name}
      </h2>
      <Ornament className="region-ornament mt-3 w-56 sm:w-72" flip />
      <p className="mt-3 text-lg text-bone-muted italic">{region.epithet}</p>
    </div>
  );
}
