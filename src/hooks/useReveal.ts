'use client';

import { useEffect, useRef } from 'react';

const STAGGER_MS = 60;

/**
 * Revela os filhos marcados com [data-reveal-item] quando a seção entra
 * na viewport, com stagger de 60ms. Um observer por seção, desligado
 * assim que dispara — o reveal não se repete no scroll de volta.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const items = Array.from(node.querySelectorAll<HTMLElement>('[data-reveal-item]'));
    if (items.length === 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const show = () => {
      items.forEach((item, index) => {
        item.style.setProperty('--reveal-delay', prefersReduced ? '0ms' : `${index * STAGGER_MS}ms`);
        item.dataset.visible = 'true';
      });
    };

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show();
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}
