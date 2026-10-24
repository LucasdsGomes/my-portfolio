'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale, PortfolioContent } from '@/types/portfolio';
import { textPathForLocale } from '@/content';
import { BENCH_REST, JOURNEY_RESET, SIT_EVENT, announceChange, type SitDetail } from '../journey/events';
import { newJourney } from '../journey/restart';
import { playSfx } from '../audio/sound';
import { PlayerFirefly } from '../player/PlayerFirefly';
import { RIG_FEET } from '../rig/skeleton';
import { SceneCover } from '../scene/Scene';
import { Motes } from '../scene/Motes';
import { Ornament } from '../Ornament';
import { RegionCard } from '../RegionCard';

interface ContactRegionProps {
  content: PortfolioContent;
  locale: Locale;
}

/** Medidos na pintura 06-abismo, em fração da imagem. */
const FLOOR = { x: 0.28, y: 0.757 } as const;
const SEAT = { x: 0.185, y: 0.689 } as const;
const FLOOR_RANGE = [0.05, 0.34] as const;

/**
 * O Último Banco: o contato e o fim da jornada. Descansar no banco faz o
 * vagalume sentar, olhando a luz do abismo, e a jornada fica "salva": os
 * canais de contato estão logo ao lado. Embaixo, os créditos.
 */
export function ContactRegion({ content, locale }: ContactRegionProps) {
  const { contact, game, hero, footer } = content;
  const sectionRef = useRef<HTMLElement>(null);
  const [saved, setSaved] = useState(false);
  // cada descanso reinicia o pulso de luz do banco; cada nova jornada, a chegada
  const [pulse, setPulse] = useState(0);
  const [round, setRound] = useState(0);

  const rest = useCallback(() => {
    playSfx('banco');
    const detail: SitDetail = { anchor: 'banco', ...SEAT };
    window.dispatchEvent(new CustomEvent(SIT_EVENT, { detail }));
    setSaved(true);
    setPulse((p) => p + 1);
  }, []);

  useEffect(() => {
    const onReset = () => {
      setSaved(false);
      setRound((r) => r + 1);
    };
    window.addEventListener(JOURNEY_RESET, onReset);
    return () => window.removeEventListener(JOURNEY_RESET, onReset);
  }, []);

  // a barra de espaço lê no DOM se a jornada já foi salva
  useEffect(() => {
    announceChange();
  }, [saved]);

  // chegar ao fim é sentar: pela passagem animada, pela barra de espaço ou
  // rolando até aqui; o botão continua valendo para descansar de novo
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    window.addEventListener(BENCH_REST, rest);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || document.documentElement.dataset.cinematic) return;
        observer.disconnect();
        rest();
      },
      { threshold: 0.6 },
    );
    observer.observe(section);
    return () => {
      window.removeEventListener(BENCH_REST, rest);
      observer.disconnect();
    };
  }, [rest, round]);

  return (
    <section
      ref={sectionRef}
      id="contato"
      data-music="abismo"
      data-saved={saved ? 'true' : 'false'}
      tabIndex={-1}
      aria-labelledby="contato-title"
      className="relative min-h-svh overflow-hidden outline-none"
    >
      <SceneCover scene="06-abismo" focusClassName="[--fx:0.5] [--fy:0.6] portrait:[--fx:0.12]">
        {/* ao salvar, a luz do banco pulsa como num ponto de descanso */}
        <span
          key={pulse}
          aria-hidden="true"
          data-on={saved ? 'true' : 'false'}
          className="bench-glow pointer-events-none absolute h-[34%] aspect-square rounded-full"
          style={{ left: `${SEAT.x * 100}%`, top: `${SEAT.y * 100}%`, translate: '-50% -50%' }}
        />
        <PlayerFirefly
          anchor="banco"
          label={game.firefly.poke}
          range={FLOOR_RANGE}
          className="absolute h-[13%]"
          style={{
            left: `${FLOOR.x * 100}%`,
            top: `${FLOOR.y * 100}%`,
            translate: `${-RIG_FEET.x * 100}% ${-RIG_FEET.y * 100}%`,
          }}
        />
      </SceneCover>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-[linear-gradient(#03060e,transparent)]" />
      <Motes density={0.9} rise={5} tint="220, 232, 255" />

      {/* o conteúdo não pode engolir o clique no vagalume: só os filhos recebem */}
      <div className="pointer-events-none relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 pt-24 pb-10 sm:px-8 sm:pt-32">
        <div className="pointer-events-auto lg:ml-auto lg:w-[34rem]">
          <RegionCard id="contato-title" region={game.regions.contact} />
          <p className="mt-6 text-center text-lg text-bone/85 italic">{contact.lead}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {contact.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="group flex min-h-11 flex-col rounded-sm border border-bone/15 bg-abyss/75 px-4 py-3 backdrop-blur-sm transition-colors hover:border-glow/60"
                >
                  <span className="font-title text-[0.7rem] tracking-[0.26em] text-bone-muted uppercase">
                    {link.label}
                  </span>
                  <span className="mt-1 text-base break-all text-bone group-hover:text-glow">{link.value}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={rest}
              className="inline-flex min-h-11 items-center gap-3 rounded-sm border border-glow/50 bg-abyss/80 px-6 font-title text-sm tracking-[0.26em] text-glow uppercase transition-colors hover:bg-glow hover:text-abyss"
            >
              {game.bench.rest}
            </button>
            <p aria-live="polite" className="min-h-6 font-title text-xs tracking-[0.3em] text-bone-muted uppercase">
              {saved ? `✦ ${game.bench.saved} ✦` : ''}
            </p>
          </div>
        </div>

        {/* créditos: o fim do jogo */}
        <footer className="pointer-events-auto mt-auto pt-16 text-center">
          <Ornament className="mx-auto w-48" />
          <p className="mt-4 font-title text-sm tracking-[0.34em] text-bone uppercase">{game.bench.end}</p>
          <button
            type="button"
            onClick={newJourney}
            className="mt-3 inline-flex min-h-11 items-center gap-2 font-title text-xs tracking-[0.28em] text-glow uppercase hover:text-bone"
          >
            {game.bench.again} <span aria-hidden="true">↑</span>
          </button>
          <p className="mt-4 text-sm text-bone-muted">
            {hero.name} · {new Date().getFullYear()} · {footer.rights} ·{' '}
            <a href={textPathForLocale(locale)} className="underline underline-offset-4 hover:text-bone">
              {game.title.menu.textVersion}
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
}
