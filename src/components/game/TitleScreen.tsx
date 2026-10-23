'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { Locale, PortfolioContent } from '@/types/portfolio';
import { alternateLocale, pathForLocale, textPathForLocale } from '@/content';
import { RuinsBackdrop } from './scene/RuinsBackdrop';
import { Canopy, Ledge } from './scene/Foreground';
import { Motes } from './scene/Motes';
import { Ornament } from './Ornament';
import { cinematicScrollTo } from './cinematicScroll';
import { useSceneScroll } from './useSceneScroll';
import { useMediaQuery } from './useMediaQuery';

interface TitleScreenProps {
  content: PortfolioContent;
  locale: Locale;
  /** id da primeira região, destino do "Começar jornada" */
  journeyId: string;
}

const IGNORED_KEYS = new Set(['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock']);
const SCROLL_KEYS = new Set([' ', 'ArrowDown', 'PageDown', 'ArrowUp', 'PageUp']);

/** Chama pequena que ladeia o item do menu em foco. */
function MenuFlame({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 24"
      className="menu-flame h-5 w-3.5 drop-shadow-[0_0_6px_rgba(253,208,95,0.9)]"
      style={mirrored ? { scale: '-1 1' } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 1 C 13 8, 15 13, 12 18 C 10 22, 6 22, 4 18 C 1 13, 3 8, 8 1 Z" fill="#fdd05f" />
      <path d="M8 9 C 10 13, 10.5 15.5, 9 18 C 8 19.5, 6.5 19, 6 17.5 C 5.5 15, 6.5 12, 8 9 Z" fill="#fff6d6" />
    </svg>
  );
}

export function TitleScreen({ content, locale, journeyId }: TitleScreenProps) {
  const { game, hero } = content;
  const sectionRef = useSceneScroll<HTMLElement>();
  const listRef = useRef<HTMLUListElement>(null);
  const [phase, setPhase] = useState<'prompt' | 'menu'>('prompt');
  const coarse = useMediaQuery('(pointer: coarse)');
  const other = alternateLocale(locale);

  // "pressione qualquer tecla": só vale enquanto a tela de título está à vista
  useEffect(() => {
    if (phase !== 'prompt') return;

    const onKey = (event: KeyboardEvent) => {
      if (IGNORED_KEYS.has(event.key) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (window.scrollY > window.innerHeight * 0.5) return;
      // a primeira tecla abre o menu; não deve também rolar a página embora
      if (SCROLL_KEYS.has(event.key)) event.preventDefault();
      setPhase('menu');
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  // ao abrir o menu, o foco vai para o primeiro item, sem mexer na rolagem
  useEffect(() => {
    if (phase !== 'menu') return;
    listRef.current?.querySelector<HTMLElement>('[data-menu-item]')?.focus({ preventScroll: true });
  }, [phase]);

  const moveFocus = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[data-menu-item]'));
    const index = items.indexOf(document.activeElement as HTMLElement);
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    const next = items[(index + delta + items.length) % items.length];
    event.preventDefault();
    next?.focus();
  };

  const beginJourney = () => {
    const target = document.getElementById(journeyId);
    if (target) cinematicScrollTo(target);
  };

  const itemClass =
    'menu-item group inline-flex min-h-11 items-center gap-4 font-title text-sm tracking-[0.28em] text-bone-muted uppercase transition-colors duration-300 hover:text-bone focus-visible:text-glow focus-visible:outline-none sm:text-base';

  return (
    <section
      ref={sectionRef}
      id="topo"
      aria-labelledby="title-name"
      className="relative h-svh min-h-[34rem] overflow-hidden"
      onClick={phase === 'prompt' ? () => setPhase('menu') : undefined}
    >
      <RuinsBackdrop />
      <Motes density={2.6} rise={10} />
      <Canopy />
      <Ledge uid="ff-title" />

      {/* vinheta: escurece as bordas e segura o olhar no centro */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_35%,rgba(3,6,14,0.78)_100%)]"
      />

      <div
        className="relative z-10 flex h-full flex-col items-center px-6 pt-[15svh] text-center"
        style={{ opacity: 'calc(1 - var(--scroll, 0) / 420)' }}
      >
        <p
          className="title-rise font-title text-xs tracking-[0.42em] text-bone-muted uppercase sm:text-sm"
          style={{ ['--delay' as string]: '200ms' }}
        >
          {hero.role}
        </p>

        <h1
          id="title-name"
          className="title-rise mt-5 font-title text-5xl leading-none font-semibold tracking-[0.12em] text-bone uppercase drop-shadow-[0_2px_24px_rgba(3,6,14,0.9)] sm:text-7xl lg:text-8xl"
          style={{ ['--delay' as string]: '500ms' }}
        >
          {hero.name}
        </h1>

        <Ornament className="title-rise mt-6 w-64 sm:w-80" style={{ ['--delay' as string]: '900ms' }} />

        <p
          className="title-rise mt-5 max-w-md text-lg text-bone/85 italic drop-shadow-[0_1px_12px_rgba(3,6,14,1)] sm:text-xl"
          style={{ ['--delay' as string]: '1200ms' }}
        >
          {game.title.kicker}
        </p>

        <div className="mt-[9svh] flex min-h-48 flex-col items-center">
          {phase === 'prompt' ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setPhase('menu');
              }}
              className="title-rise prompt-breathe min-h-11 font-title text-sm tracking-[0.3em] text-bone uppercase focus-visible:text-glow sm:text-base"
              style={{ ['--delay' as string]: '1800ms' }}
            >
              {coarse ? game.title.tapToStart : game.title.pressAnyKey}
            </button>
          ) : (
            <nav aria-label={game.title.menuLabel}>
              <ul ref={listRef} onKeyDown={moveFocus} className="flex flex-col items-center gap-1">
                <li>
                  <button type="button" data-menu-item onClick={beginJourney} className={itemClass}>
                    <MenuFlame />
                    <span>{game.title.menu.start}</span>
                    <MenuFlame mirrored />
                  </button>
                </li>
                <li>
                  <a href={pathForLocale(other)} hrefLang={other} data-menu-item className={itemClass}>
                    <MenuFlame />
                    <span>{game.title.menu.language}</span>
                    <MenuFlame mirrored />
                  </a>
                </li>
                <li>
                  <a href={textPathForLocale(locale)} data-menu-item className={itemClass}>
                    <MenuFlame />
                    <span>{game.title.menu.textVersion}</span>
                    <MenuFlame mirrored />
                  </a>
                </li>
              </ul>
              {coarse ? null : (
                <p className="mt-6 text-sm text-bone-muted italic">{game.title.controlsHint}</p>
              )}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
