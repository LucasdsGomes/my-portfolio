'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BestiaryEntry, PortfolioContent, Project } from '@/types/portfolio';
import { Ornament } from '../Ornament';
import { playSfx } from '../audio/sound';
import { HOP_EVENT, type HopDetail } from '../journey/events';
import { CreaturePicture } from './CreaturePicture';

interface BestiaryProps {
  content: PortfolioContent;
}

interface Creature {
  project: Project;
  entry: BestiaryEntry;
  defeated: boolean;
}

/**
 * O diário do caçador. Cada projeto é uma criatura: o problema é ela, o que
 * foi construído é como ela foi derrotada, a stack é o arsenal e a nota de
 * "por que está aqui" é a visão de sonho. Projeto em andamento é criatura
 * ainda não derrotada, e aparece só como sombra.
 */
export function Bestiary({ content }: BestiaryProps) {
  const { projects, game } = content;
  const { bestiary } = game;
  const [open, setOpen] = useState<Creature | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const creatures: Creature[] = projects.items.flatMap((project) => {
    const entry = bestiary.entries[project.id];
    return entry ? [{ project, entry, defeated: project.status !== 'andamento' }] : [];
  });
  const bosses = creatures.filter((c) => c.entry.boss);
  const common = creatures.filter((c) => !c.entry.boss);
  const bossesRef = useRef<HTMLUListElement>(null);

  // enquanto a fileira de chefes está à vista, o vagalume das Galerias dá
  // de tempos em tempos uma volta pulando de troféu em troféu
  useEffect(() => {
    const list = bossesRef.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer = 0;
    const tour = () => {
      const detail: HopDetail = { anchor: 'projetos', selector: '[data-trophy]' };
      window.dispatchEvent(new CustomEvent(HOP_EVENT, { detail }));
      timer = window.setTimeout(tour, 9000);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        if (entry?.isIntersecting) timer = window.setTimeout(tour, 900);
      },
      { threshold: 0.6 },
    );
    observer.observe(list);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const choose = (creature: Creature) => {
    playSfx('diario');
    setOpen(creature);
  };

  return (
    <>
      <h3 className="text-center font-title text-sm tracking-[0.34em] text-bone-muted uppercase">
        {bestiary.bosses}
      </h3>
      <ul ref={bossesRef} className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {bosses.map((creature) => (
          <li key={creature.project.id}>
            <CreatureCard creature={creature} content={content} onOpen={choose} large />
          </li>
        ))}
      </ul>

      <h3 className="mt-16 text-center font-title text-sm tracking-[0.34em] text-bone-muted uppercase">
        {bestiary.creatures}
      </h3>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {common.map((creature) => (
          <li key={creature.project.id}>
            <CreatureCard creature={creature} content={content} onOpen={choose} />
          </li>
        ))}
      </ul>

      <JournalEntry creature={open} content={content} onClose={close} />
    </>
  );
}

function CreatureCard({
  creature,
  content,
  onOpen,
  large = false,
}: {
  creature: Creature;
  content: PortfolioContent;
  onOpen: (creature: Creature) => void;
  large?: boolean;
}) {
  const { bestiary } = content.game;
  const { project, entry, defeated } = creature;

  return (
    <button
      type="button"
      data-trophy={large && defeated ? 'true' : undefined}
      onClick={() => onOpen(creature)}
      aria-label={`${entry.name}: ${project.title}. ${bestiary.open}`}
      className="group flex h-full w-full flex-col items-center rounded-sm border border-bone/12 bg-abyss/70 px-3 pt-3 pb-5 text-center backdrop-blur-sm transition-colors duration-300 hover:border-glow/50 focus-visible:border-glow/70"
    >
      <span className="relative block aspect-square w-full overflow-hidden">
        <CreaturePicture
          creature={entry.creature}
          silhouette={!defeated}
          sizes={large ? '(min-width: 1024px) 280px, 45vw' : '(min-width: 1024px) 180px, 45vw'}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {defeated ? null : (
          <span className="absolute inset-0 flex items-center justify-center font-title text-5xl text-bone/70">?</span>
        )}
      </span>
      <span
        className={`mt-3 block font-title tracking-[0.1em] text-bone uppercase ${
          large ? 'text-lg' : 'text-sm'
        }`}
      >
        {entry.name}
      </span>
      <span className={`mt-1 block text-bone-muted italic ${large ? 'text-base' : 'text-sm'}`}>
        {project.title}
      </span>
      <span
        className={`mt-3 inline-flex items-center gap-2 font-title text-[0.7rem] tracking-[0.24em] uppercase ${
          defeated ? 'text-glow' : 'text-bone-muted'
        }`}
      >
        <span
          aria-hidden="true"
          className={`size-1.5 rounded-full ${defeated ? 'bg-glow shadow-[0_0_6px_rgba(253,208,95,0.9)]' : 'border border-bone-muted'}`}
        />
        {defeated ? bestiary.defeated : bestiary.undefeated}
      </span>
    </button>
  );
}

/** A entrada aberta do diário: <dialog> nativo, como o detalhe da versão em texto. */
function JournalEntry({
  creature,
  content,
  onClose,
}: {
  creature: Creature | null;
  content: PortfolioContent;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const { bestiary } = content.game;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !creature) return;
    if (!dialog.open) {
      opener.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    }
    document.body.style.overflow = 'hidden';
    dialog.addEventListener('close', onClose);
    return () => {
      dialog.removeEventListener('close', onClose);
      document.body.style.overflow = '';
      opener.current?.focus();
    };
  }, [creature, onClose]);

  if (!creature) return null;
  const { project, entry, defeated } = creature;

  return (
    <dialog
      ref={ref}
      aria-labelledby="diario-titulo"
      onKeyDown={(event) => {
        // keydown borbulha; close e cancel não, e nem todo navegador os entrega
        if (event.key === 'Escape') onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className="m-auto w-[min(60rem,calc(100vw-2rem))] rounded-sm border border-bone/15 bg-abyss p-0 text-bone backdrop:bg-abyss/85 backdrop:backdrop-blur-sm"
    >
      <div className="grid max-h-[86vh] overflow-y-auto md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="relative bg-[#03060e] p-6">
          <CreaturePicture
            creature={entry.creature}
            silhouette={!defeated}
            sizes="(min-width: 768px) 380px, 90vw"
            className="mx-auto aspect-square w-full max-w-sm object-cover"
          />
        </div>

        <div className="px-6 pt-6 pb-8 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="diario-titulo" className="font-title text-2xl font-semibold tracking-[0.1em] uppercase">
                {entry.name}
              </h2>
              <p className="mt-1 text-lg text-bone-muted italic">{project.title}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-mt-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-sm text-bone-muted hover:text-glow"
            >
              <span className="sr-only">{bestiary.close}</span>
              <span aria-hidden="true" className="text-xl">
                ✕
              </span>
            </button>
          </div>

          <Ornament className="mt-4 w-48" />

          {project.context ? (
            <p className="mt-4 font-title text-xs tracking-[0.24em] text-bone-muted uppercase">
              {project.context} · {project.statusLabel}
            </p>
          ) : null}

          <dl className="mt-6 space-y-6">
            <div>
              <dt className="font-title text-xs tracking-[0.28em] text-amber uppercase">{bestiary.labels.creature}</dt>
              <dd className="mt-2 text-lg leading-relaxed text-bone/90">{project.problem}</dd>
            </div>
            <div>
              <dt className="font-title text-xs tracking-[0.28em] text-amber uppercase">{bestiary.labels.victory}</dt>
              <dd className="mt-2 text-lg leading-relaxed text-bone/90">{project.built}</dd>
            </div>
            <div>
              <dt className="font-title text-xs tracking-[0.28em] text-amber uppercase">{bestiary.labels.arsenal}</dt>
              <dd>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <li
                      key={item}
                      className="rounded-sm border border-bone/15 px-2.5 py-1 font-title text-[0.72rem] tracking-[0.12em] text-bone-muted uppercase"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            {project.note ? (
              <div>
                <dt className="font-title text-xs tracking-[0.28em] text-glow uppercase">{bestiary.labels.dream}</dt>
                <dd className="mt-2 border-l-2 border-glow/40 pl-4 text-lg leading-relaxed text-bone/85 italic">
                  {project.note}
                </dd>
              </div>
            ) : null}
          </dl>

          {project.demo || project.repo ? (
            <div className="mt-8 flex flex-wrap gap-3">
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-bone/20 px-4 font-title text-xs tracking-[0.24em] text-bone uppercase hover:border-glow/60 hover:text-glow"
              >
                {bestiary.labels.demo}
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-bone/20 px-4 font-title text-xs tracking-[0.24em] text-bone uppercase hover:border-glow/60 hover:text-glow"
              >
                {bestiary.labels.repo}
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
