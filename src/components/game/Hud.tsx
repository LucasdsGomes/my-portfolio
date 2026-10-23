'use client';

import { useEffect, useRef } from 'react';
import type { GameRegionId, Locale, PortfolioContent } from '@/types/portfolio';
import { alternateLocale, pathForLocale, textPathForLocale } from '@/content';
import { Firefly } from './Firefly';

/** Região do jogo → id da seção na página (os mesmos da versão em texto). */
export const REGION_SECTIONS: Readonly<Record<GameRegionId, string>> = {
  profile: 'perfil',
  focus: 'foco',
  projects: 'projetos',
  stack: 'stack',
  path: 'trajetoria',
  contact: 'contato',
};

interface HudProps {
  content: PortfolioContent;
  locale: Locale;
}

const REGIONS = Object.keys(REGION_SECTIONS) as GameRegionId[];
const RING = 2 * Math.PI * 30;

/**
 * O HUD do canto: o retrato do vagalume dentro de um anel que enche
 * conforme se desce a página, e uma luz por região que acende quando a
 * região é visitada. Só aparece depois da tela de título.
 *
 * Tudo é escrito direto no DOM: são indicadores, mudam a cada quadro de
 * rolagem e não carregam informação que a página não tenha em texto.
 */
export function Hud({ content, locale }: HudProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const other = alternateLocale(locale);

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    if (!root || !ring) return;

    let frame = 0;
    const read = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
      ring.style.strokeDashoffset = String(RING * (1 - p));
      root.dataset.shown = window.scrollY > window.innerHeight * 0.6 ? 'true' : 'false';
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const orb = root.querySelector<HTMLElement>(`[data-orb="${entry.target.id}"]`);
          if (orb) orb.dataset.lit = 'true';
        }
      },
      { threshold: 0.35 },
    );

    for (const region of REGIONS) {
      const section = document.getElementById(REGION_SECTIONS[region]);
      if (section) observer.observe(section);
    }

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-shown="false"
      className="hud pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-4 pt-4 sm:px-6 sm:pt-5"
    >
      <div aria-hidden="true" className="flex items-center gap-3">
        <div className="relative size-16">
          <svg viewBox="0 0 68 68" className="absolute inset-0 -rotate-90">
            <circle cx="34" cy="34" r="30" fill="#03060e" fillOpacity="0.8" stroke="#e6dccf" strokeOpacity="0.18" strokeWidth="2" />
            <circle
              ref={ringRef}
              cx="34"
              cy="34"
              r="30"
              fill="none"
              stroke="#fdd05f"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={RING}
              className="drop-shadow-[0_0_4px_rgba(253,208,95,0.8)]"
            />
          </svg>
          <Firefly uid="ff-hud" className="absolute inset-2.5" />
        </div>
        <div className="flex gap-1.5">
          {REGIONS.map((region) => (
            <span
              key={region}
              data-orb={REGION_SECTIONS[region]}
              className="hud-orb size-3.5 rounded-full border border-bone/30"
            />
          ))}
        </div>
      </div>

      <nav aria-label={content.game.title.menuLabel} className="hud-links pointer-events-auto flex gap-1">
        <a
          href={textPathForLocale(locale)}
          className="inline-flex min-h-11 items-center rounded-sm px-3 font-title text-xs tracking-[0.2em] text-bone-muted uppercase hover:text-bone"
        >
          {content.game.title.menu.textVersion}
        </a>
        <a
          href={pathForLocale(other)}
          hrefLang={other}
          className="inline-flex min-h-11 items-center rounded-sm px-3 font-title text-xs tracking-[0.2em] text-bone-muted uppercase hover:text-bone"
        >
          {content.game.title.menu.language}
        </a>
      </nav>
    </div>
  );
}
