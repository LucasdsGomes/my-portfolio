'use client';

import type { PortfolioContent } from '@/types/portfolio';
import { playSfx } from '../audio/sound';
import { RegionShell } from './RegionShell';

interface StackRegionProps {
  content: PortfolioContent;
}

/** Runas dos amuletos: formas simples, reconhecíveis de longe. */
const RUNES = [
  'M12 4 L20 12 L12 20 L4 12 Z', // losango
  'M12 4 L20 19 H4 Z', // triângulo
  'M16 5 A8 8 0 1 0 16 19 A6 6 0 1 1 16 5 Z', // lua crescente
  'M12 3 L14.5 9.5 L21 10 L16 14 L17.5 21 L12 17 L6.5 21 L8 14 L3 10 L9.5 9.5 Z', // estrela
  'M3 12 Q12 4 21 12 Q12 20 3 12 Z M12 9 A3 3 0 1 1 12 15 A3 3 0 1 1 12 9 Z', // olho
  'M12 12 m-1 0 a1 1 0 1 1 2 0 a3 3 0 1 1 -6 0 a5 5 0 1 1 10 0 a7 7 0 1 1 -14 0', // espiral
] as const;

/** a mesma tecnologia sempre ganha a mesma runa */
function runeFor(name: string): string {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return RUNES[h % RUNES.length]!;
}

function Charm({ name, equipped, size }: { name: string; equipped: boolean; size: 'lg' | 'sm' }) {
  const box = size === 'lg' ? 'size-16' : 'size-10';
  return (
    <button
      type="button"
      onClick={(event) => {
        playSfx('amuleto');
        const el = event.currentTarget;
        el.dataset.pulse = 'false';
        void el.offsetWidth; // reinicia a animação se clicar de novo
        el.dataset.pulse = 'true';
      }}
      className={`charm group flex flex-col items-center gap-2 w-24 text-center`}
    >
      <span
        className={`charm-gem relative flex ${box} items-center justify-center rounded-full border ${
          equipped
            ? 'border-glow/70 bg-[radial-gradient(circle,rgba(253,208,95,0.35),rgba(3,6,14,0.9)_70%)] shadow-[0_0_18px_rgba(253,208,95,0.45)]'
            : 'border-bone/25 bg-abyss/80'
        } transition-colors duration-300 group-hover:border-glow/70`}
      >
        <svg viewBox="0 0 24 24" className={size === 'lg' ? 'size-8' : 'size-5'} aria-hidden="true" focusable="false">
          <path
            d={runeFor(name)}
            fill={equipped ? '#fdd05f' : 'none'}
            stroke={equipped ? '#fff3c4' : '#a9afbd'}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={`font-title tracking-[0.08em] uppercase ${
          size === 'lg' ? 'text-xs text-bone' : 'text-[0.68rem] text-bone-muted group-hover:text-bone'
        }`}
      >
        {name}
      </span>
    </button>
  );
}

/**
 * Santuário dos Amuletos: as tecnologias do dia a dia ficam equipadas nos
 * entalhes, brilhando; o resto vai na bolsa, agrupado por domínio.
 */
export function StackRegion({ content }: StackRegionProps) {
  const { stack, game } = content;
  const core = new Set(stack.core);

  return (
    <RegionShell
      firefly={{ anchor: 'stack', label: game.firefly.poke }}
      id="stack"
      region={game.regions.stack}
      scene="04-reino-arcano"
      music="floresta"
      motes="200, 150, 255"
      lead={stack.lead}
    >
      <div className="mx-auto max-w-4xl rounded-sm border border-glow/20 bg-abyss/75 px-6 py-8 text-center backdrop-blur-sm">
        <h3 className="font-title text-sm tracking-[0.34em] text-glow uppercase">{game.charms.notches}</h3>
        <p className="mt-2 text-base text-bone-muted italic">{game.charms.notchesHint}</p>
        <ul className="mt-7 flex flex-wrap justify-center gap-x-4 gap-y-6">
          {stack.core.map((name) => (
            <li key={name}>
              <Charm name={name} equipped size="lg" />
            </li>
          ))}
        </ul>
      </div>

      <h3 className="mt-14 text-center font-title text-sm tracking-[0.34em] text-bone-muted uppercase">
        {game.charms.bag}
      </h3>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stack.groups.map((group) => (
          <section
            key={group.label}
            aria-label={group.label}
            className="rounded-sm border border-bone/12 bg-abyss/70 px-5 pt-5 pb-6 backdrop-blur-sm"
          >
            <h4 className="font-title text-xs tracking-[0.26em] text-amber uppercase">{group.label}</h4>
            <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-4">
              {group.items.map((name) => (
                <li key={name}>
                  <Charm name={name} equipped={core.has(name)} size="sm" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </RegionShell>
  );
}
