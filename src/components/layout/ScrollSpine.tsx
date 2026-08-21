'use client';

import { useEffect, useRef, useState } from 'react';
import type { NavItem } from '@/types/portfolio';

interface ScrollSpineProps {
  items: readonly NavItem[];
}

interface Tick {
  id: string;
  /** posição da seção como fração do scroll total */
  at: number;
}

/**
 * Escala vertical de percurso: as marcas são as seções, o preenchimento
 * acompanha a rolagem e a leitura no topo mostra a posição em porcentagem.
 * É o mesmo vocabulário do cluster do hero, aplicado à página inteira.
 *
 * Decorativa por definição (a navegação de verdade está no header), então
 * sai da árvore de acessibilidade e some abaixo de 1280px, onde não há
 * margem lateral para ela sem brigar com o conteúdo.
 */
export function ScrollSpine({ items }: ScrollSpineProps) {
  const [progress, setProgress] = useState(0);
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    const measure = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      setTicks(
        items
          .map((item) => {
            const el = document.getElementById(item.href.slice(1));
            if (!el) return null;
            const top = el.getBoundingClientRect().top + window.scrollY - 88;
            return { id: item.href.slice(1), at: top / scrollable };
          })
          .filter((tick): tick is Tick => tick !== null && tick.at >= 0 && tick.at <= 1),
      );
    };

    const read = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      setProgress(Math.min(Math.max(ratio, 0), 1));

      let current: string | null = null;
      for (const item of items) {
        const el = document.getElementById(item.href.slice(1));
        if (el && el.getBoundingClientRect().top <= 120) current = item.href.slice(1);
      }
      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(read);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    // o rAF fica suspenso em aba oculta, então a escala pode ficar defasada
    // enquanto ninguém olha; ao voltar para a aba, relê antes de pintar
    const onVisibility = () => {
      if (!document.hidden) onResize();
    };

    measure();
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [items]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-1/2 left-8 z-40 hidden h-[min(58vh,26rem)] -translate-y-1/2 xl:block"
    >
      <p className="tabular absolute -top-8 left-0 font-mono text-2xs text-fg-muted">
        {String(Math.round(progress * 100)).padStart(3, '0')}%
      </p>

      <div className="relative h-full w-px bg-line">
        <div
          className="absolute top-0 left-0 w-px origin-top bg-accent"
          style={{ height: `${progress * 100}%` }}
        />

        {ticks.map((tick) => {
          const isActive = active === tick.id;
          return (
            <span
              key={tick.id}
              className={`absolute left-0 h-px transition-all duration-300 ${
                isActive ? 'w-4 bg-accent-warm' : 'w-2 bg-line'
              }`}
              style={{ top: `${tick.at * 100}%` }}
            />
          );
        })}

        {/* cursor do percurso: a leitura atual sobre a escala */}
        <span
          className="absolute -left-[3px] size-[7px] rounded-full border border-accent bg-bg"
          style={{ top: `calc(${progress * 100}% - 3px)` }}
        />
      </div>
    </div>
  );
}
