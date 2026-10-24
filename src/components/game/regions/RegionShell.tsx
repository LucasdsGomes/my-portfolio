import type { ReactNode } from 'react';
import type { GameRegion } from '@/types/portfolio';
import type { Track } from '../audio/sound';
import { RegionCard } from '../RegionCard';
import { Motes } from '../scene/Motes';
import { ScenePicture, type SceneName } from '../scene/Scene';
import { PlayerFirefly } from '../player/PlayerFirefly';

/** dá para andar por toda a largura do conteúdo, por cima dele */
const GROUND_RANGE = [0.02, 0.98] as const;

interface RegionShellProps {
  /** id da seção: o mesmo da versão em texto, para links e HUD */
  id: string;
  region: GameRegion;
  scene: SceneName;
  music: Track;
  /** cor das partículas em "r, g, b": a luz própria da região */
  motes: string;
  /** frase de abertura, sob o cartão */
  lead?: string;
  /** o vagalume da região: nome para as passagens e rótulo de cutucar */
  firefly: { anchor: string; label: string };
  children: ReactNode;
}

/**
 * A moldura comum das regiões: a pintura de fundo, escura nas emendas com a
 * região anterior e a próxima, as partículas na cor do lugar, o cartão de
 * título e o conteúdo por cima.
 *
 * O vagalume da região espera logo acima do conteúdo, sobre a própria
 * luz, onde as passagens animadas o fazem pousar; dá para andar com ele
 * por cima de tudo, como na Clareira.
 */
export function RegionShell({ id, region, scene, music, motes, lead, firefly, children }: RegionShellProps) {
  return (
    <section
      id={id}
      data-music={music}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      className="relative min-h-svh overflow-hidden py-24 outline-none sm:py-32"
    >
      <ScenePicture scene={scene} className="absolute inset-0 h-full w-full" />
      {/* escuro no topo e no pé, para emendar com as regiões vizinhas, e um
          véu leve no meio para o texto ler sobre a pintura */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,#03060e,rgba(3,6,14,0.5)_14%,rgba(3,6,14,0.35)_50%,rgba(3,6,14,0.55)_86%,#03060e)]"
      />
      <Motes density={1.3} rise={7} tint={motes} />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <RegionCard id={`${id}-title`} region={region} />
        {lead ? (
          <p className="mx-auto mt-8 max-w-2xl text-center text-lg text-bone/85 italic">{lead}</p>
        ) : null}
        <div data-ground className="relative mt-32 lg:mt-14">
          <div className="pointer-events-none absolute bottom-full left-[3%] z-20">
            <PlayerFirefly
              anchor={firefly.anchor}
              label={firefly.label}
              range={GROUND_RANGE}
              ground="[data-ground]"
              greet
              className="pointer-events-auto relative h-24 lg:h-32"
            />
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
