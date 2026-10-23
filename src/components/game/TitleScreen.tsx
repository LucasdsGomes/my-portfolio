'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { Locale, PortfolioContent } from '@/types/portfolio';
import { alternateLocale, pathForLocale, textPathForLocale } from '@/content';
import { SceneCover } from './scene/Scene';
import { Motes } from './scene/Motes';
import { Ornament } from './Ornament';
import { PlayerFirefly } from './player/PlayerFirefly';
import { RIG_FEET } from './rig/skeleton';
import { JOURNEY_START } from './journey/events';
import { useSceneScroll } from './useSceneScroll';
import { playSfx } from './audio/sound';
import { useMediaQuery } from './useMediaQuery';

interface TitleScreenProps {
  content: PortfolioContent;
  locale: Locale;
}

/** Topo plano da borda de pedra pintada em 00-titulo, em fração da imagem. */
const LEDGE = { x: 0.335, y: 0.752 } as const;
/** Onde dá para andar na borda; passar da ponta direita é cair no poço. */
const LEDGE_RANGE = [0.17, 0.455] as const;
const jumpIntoShaft = () => window.dispatchEvent(new CustomEvent(JOURNEY_START));

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

export function TitleScreen({ content, locale }: TitleScreenProps) {
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
    playSfx('menu-mover');
  };

  // quem conduz a descida é o diretor da jornada; o menu só dá a largada
  const beginJourney = () => {
    playSfx('menu-confirmar');
    window.dispatchEvent(new CustomEvent(JOURNEY_START));
  };

  const itemClass =
    'menu-item group inline-flex min-h-11 items-center gap-4 font-title text-sm tracking-[0.28em] text-bone-muted uppercase transition-colors duration-300 hover:text-bone focus-visible:text-glow focus-visible:outline-none sm:text-base';

  return (
    <section
      ref={sectionRef}
      id="topo"
      data-music="floresta"
      aria-labelledby="title-name"
      className="relative h-svh min-h-[34rem] overflow-hidden"
      onClick={phase === 'prompt' ? () => setPhase('menu') : undefined}
    >
      <SceneCover
        scene="00-titulo"
        priority
        focusClassName="[--fx:0.5] [--fy:0.55] portrait:[--fx:0.3]"
      >
        <PlayerFirefly
          anchor="title"
          label={game.firefly.poke}
          range={LEDGE_RANGE}
          onExitRight={jumpIntoShaft}
          className="absolute h-[21%]"
          style={{
            left: `${LEDGE.x * 100}%`,
            top: `${LEDGE.y * 100}%`,
            translate: `${-RIG_FEET.x * 100}% ${-RIG_FEET.y * 100}%`,
          }}
        />
      </SceneCover>
      <Motes density={2.2} rise={10} />

      {/* vinheta: escurece as bordas e segura o olhar no centro */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_35%,rgba(3,6,14,0.78)_100%)]"
      />
      {/* faixa escura atrás do bloco de texto: o castelo da pintura é claro */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(ellipse_55%_60%_at_50%_32%,rgba(3,6,14,0.62),transparent_75%)]"
      />

      {/* a coluna cobre a tela inteira, então deixa o clique passar para o
          vagalume; só o menu e o aviso voltam a receber clique */}
      <div
        className="pointer-events-none relative z-10 flex h-full flex-col items-center px-6 pt-[15svh] text-center"
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

        <div className="pointer-events-auto mt-[9svh] flex min-h-48 flex-col items-center">
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
                <>
                  <p className="mt-6 text-sm text-bone-muted italic">{game.title.controlsHint}</p>
                  <p className="mt-1 text-sm text-bone-muted italic">{game.firefly.controls}</p>
                  <p className="mt-1 text-sm text-bone-muted italic">{game.sound.hint}</p>
                </>
              )}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
