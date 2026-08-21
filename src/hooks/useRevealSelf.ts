'use client';

import { useEffect, useRef } from 'react';

/**
 * Reveal por elemento, para conteúdo que entra e sai da árvore, como os
 * cards ao trocar de filtro. Um card montado já dentro da viewport revela
 * na hora; um card fora dela espera o scroll.
 */
export function useRevealSelf<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.style.setProperty('--reveal-delay', prefersReduced ? '0ms' : `${delayMs}ms`);

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      node.dataset.visible = 'true';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.visible = 'true';
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delayMs]);

  return ref;
}
