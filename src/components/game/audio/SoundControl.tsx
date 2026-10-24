'use client';

import { useEffect, useSyncExternalStore } from 'react';
import type { PortfolioContent } from '@/types/portfolio';
import { getSoundState, initSound, setTrack, subscribeSound, toggleSound, type Track } from './sound';

const OFF = { enabled: false, pending: false } as const;

interface SoundControlProps {
  labels: PortfolioContent['game']['sound'];
}

/**
 * O botão de som, fixo no canto, visível desde a tela de título. Também
 * escuta as seções marcadas com data-music e troca a trilha conforme a
 * região à vista, com fade (quem faz o fade é o módulo de som).
 */
export function SoundControl({ labels }: SoundControlProps) {
  const sound = useSyncExternalStore(subscribeSound, getSoundState, () => OFF);
  const on = sound.enabled || sound.pending;

  useEffect(() => initSound(), []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-music]'));
    const observer = new IntersectionObserver(
      (entries) => {
        // a seção que ocupa mais da tela dita a música
        const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const track = best?.target.getAttribute('data-music') as Track | null;
        if (track) setTrack(track);
      },
      { threshold: [0.25, 0.5, 0.75] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={on}
      aria-label={on ? labels.on : labels.off}
      title={labels.hint}
      className="fixed top-4 right-4 z-50 inline-flex size-11 items-center justify-center rounded-full border border-bone/20 bg-abyss/70 text-bone-muted backdrop-blur-sm transition-colors hover:border-glow/60 hover:text-glow sm:top-5 sm:right-6"
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" focusable="false">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
        {on ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M15 9a4 4 0 0 1 0 6" />
            <path d="M17.6 6.6a7.5 7.5 0 0 1 0 10.8" />
          </g>
        ) : (
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M15.5 9.5l5 5" />
            <path d="M20.5 9.5l-5 5" />
          </g>
        )}
      </svg>
    </button>
  );
}
