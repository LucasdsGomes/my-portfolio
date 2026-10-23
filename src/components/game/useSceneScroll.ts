'use client';

import { useEffect, useRef } from 'react';

/**
 * Escreve na seção duas variáveis CSS a cada quadro de rolagem:
 *   --scroll  px rolados desde que o topo da seção chegou ao topo da tela
 *   --p       progresso de 0 a 1 ao longo da seção
 *
 * Só escuta enquanto a seção está perto da tela, e nunca passa por estado
 * do React: o parallax inteiro é CSS lendo esses dois números.
 */
export function useSceneScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let listening = false;

    const write = () => {
      const rect = node.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const scrolled = -rect.top;
      node.style.setProperty('--scroll', scrolled.toFixed(1));
      node.style.setProperty('--p', Math.min(Math.max(scrolled / travel, 0), 1).toFixed(4));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(write);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const near = entry?.isIntersecting ?? false;
        if (near && !listening) {
          listening = true;
          window.addEventListener('scroll', onScroll, { passive: true });
          write();
        } else if (!near && listening) {
          listening = false;
          window.removeEventListener('scroll', onScroll);
        }
      },
      { rootMargin: '50% 0px' },
    );

    observer.observe(node);
    write();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return ref;
}
