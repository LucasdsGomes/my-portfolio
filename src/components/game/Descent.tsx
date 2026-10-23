'use client';

import { Firefly } from './Firefly';
import { Motes } from './scene/Motes';
import { stalactites, wall } from './scene/shapes';
import { useSceneScroll } from './useSceneScroll';

const W = 1600;
const H = 3600;

/** Três profundidades de parede: quanto mais perto, mais escura e mais rápida. */
const LAYERS = [
  {
    travel: '-28%',
    fill: '#12233d',
    left: wall({ side: 'left', width: W, height: H, reach: 380, jag: 160, step: 70, seed: 101 }),
    right: wall({ side: 'right', width: W, height: H, reach: 360, jag: 150, step: 64, seed: 103 }),
  },
  {
    travel: '-48%',
    fill: '#0a1628',
    left: wall({ side: 'left', width: W, height: H, reach: 250, jag: 140, step: 56, seed: 107 }),
    right: wall({ side: 'right', width: W, height: H, reach: 230, jag: 130, step: 52, seed: 109 }),
  },
  {
    travel: '-66.6%',
    fill: '#01050b',
    left: wall({ side: 'left', width: W, height: H, reach: 120, jag: 110, step: 44, seed: 113 }),
    right: wall({ side: 'right', width: W, height: H, reach: 110, jag: 100, step: 40, seed: 127 }),
  },
] as const;

const ROOTS = stalactites({ width: W, topY: 0, count: 34, maxLength: 260, seed: 131 });

/**
 * A descida entre a tela de título e a primeira região. É só cenário: um
 * poço que o vagalume atravessa enquanto a página rola, com a luz de cima
 * sumindo e o brilho morno da clareira aparecendo embaixo.
 *
 * Fica fora da árvore de acessibilidade e não tem conteúdo; com movimento
 * reduzido, é só um trecho escuro de rolagem.
 */
export function Descent() {
  const ref = useSceneScroll<HTMLElement>();

  return (
    <section ref={ref} aria-hidden="true" className="relative h-[260svh] bg-cave">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* a luz de cima apaga conforme se desce */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#1a2f4f,#0b1628_55%,#03060e)]" />
        <div className="absolute inset-0 bg-abyss" style={{ opacity: 'calc(var(--p, 0) * 0.55)' }} />

        {LAYERS.map((layer) => (
          <div
            key={layer.fill}
            className="absolute inset-x-0 top-0 h-[300%] will-change-transform"
            style={{ transform: `translate3d(0, calc(var(--p, 0) * ${layer.travel}), 0)` }}
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="h-full w-full"
              focusable="false"
            >
              <path d={layer.left} fill={layer.fill} />
              <path d={layer.right} fill={layer.fill} />
            </svg>
          </div>
        ))}

        {/* raízes penduradas logo na entrada do poço */}
        <svg
          viewBox={`0 0 ${W} 300`}
          preserveAspectRatio="none"
          className="absolute inset-x-0 top-0 h-[30%] w-full"
          style={{ transform: 'translate3d(0, calc(var(--p, 0) * -140%), 0)' }}
          focusable="false"
        >
          <path d={ROOTS} fill="#01050b" />
        </svg>

        {/* a clareira lá embaixo: um brilho morno que cresce na chegada */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_100%,rgba(253,208,95,0.32),transparent_65%)]"
          style={{ opacity: 'calc(var(--p, 0) * 1.2 - 0.2)' }}
        />

        <Motes density={1.6} rise={-34} tint="230, 220, 207" />

        {/* o vagalume caindo, balançando de leve de um lado para o outro */}
        <div
          className="absolute top-[38%] left-1/2 w-28 sm:w-36"
          style={{
            transform:
              'translate3d(calc(-50% + sin(calc(var(--p, 0) * 900deg)) * 28px), 0, 0) rotate(calc(sin(calc(var(--p, 0) * 900deg)) * 9deg))',
          }}
        >
          <div className="absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(253,208,95,0.28),transparent_65%)]" />
          <Firefly uid="ff-descent" pose="flying" className="relative w-full" />
        </div>
      </div>
    </section>
  );
}
