'use client';

import { useSyncExternalStore } from 'react';

/**
 * Media query como estado externo: o React assina a mudança em vez de um
 * efeito copiar o valor para estado. No servidor, sempre falso.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
