import type { PortfolioContent } from '@/types/portfolio';
import { ScenePicture } from '../scene/Scene';
import { Motes } from '../scene/Motes';
import { FireflyRig } from '../rig/FireflyRig';
import { Dialogue } from '../Dialogue';
import { Ornament } from '../Ornament';
import { RegionCard } from '../RegionCard';

interface ProfileRegionProps {
  content: PortfolioContent;
}

/**
 * Primeira região: o vagalume pousa na clareira e conta quem é. A fala
 * abre com o posicionamento (a frase do hero) e segue pelos parágrafos do
 * Sobre; ao lado, a tabuleta guarda os dados objetivos.
 */
export function ProfileRegion({ content }: ProfileRegionProps) {
  const { about, hero, game } = content;
  const lines = [hero.headline, ...about.paragraphs];

  return (
    <section
      id="perfil"
      tabIndex={-1}
      aria-labelledby="perfil-title"
      className="relative min-h-svh overflow-hidden py-24 outline-none sm:py-32"
    >
      <ScenePicture scene="01-floresta-luminosa" className="absolute inset-0 h-full w-full" />
      {/* escurece o centro para diálogo e tabuleta lerem sobre a floresta */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(3,6,14,0.55),rgba(3,6,14,0.25)_35%,rgba(3,6,14,0.7))]"
      />
      <Motes density={1.4} rise={6} tint="150, 240, 200" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <RegionCard id="perfil-title" region={game.regions.profile} />

        <div className="mt-16 grid items-end gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-6">
          {/* o vagalume pousado numa pedra, olhando para quem lê */}
          <div className="mx-auto flex w-40 flex-col items-center lg:w-full">
            <FireflyRig idle anchor="perfil" className="h-52 lg:h-64" />
            <svg viewBox="0 0 200 40" className="-mt-4 w-40 lg:w-48" aria-hidden="true" focusable="false">
              <path d="M8 40 C 20 12, 60 4, 104 6 C 150 8, 186 18, 196 40 Z" fill="#01050b" />
            </svg>
          </div>

          <Dialogue speaker={game.dialogue.speaker} lines={lines} labels={game.dialogue} />
        </div>

        {/* tabuleta: os fatos, sem prosa */}
        <aside
          aria-labelledby="perfil-tablet"
          className="mx-auto mt-14 max-w-3xl rounded-sm border border-bone/12 bg-abyss/70 px-6 py-7 backdrop-blur-sm sm:px-10"
        >
          <h3
            id="perfil-tablet"
            className="text-center font-title text-sm tracking-[0.3em] text-bone-muted uppercase"
          >
            {game.dialogue.tabletTitle}
          </h3>
          <Ornament className="mx-auto mt-3 w-40" />

          <dl className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-title text-xs tracking-[0.24em] text-amber uppercase">{fact.label}</dt>
                <dd className="mt-1 text-lg text-bone">{fact.value}</dd>
              </div>
            ))}
            <div className="sm:col-span-2">
              <dt className="font-title text-xs tracking-[0.24em] text-amber uppercase">
                {about.education.eyebrow.replace('// ', '')}
              </dt>
              <dd className="mt-1 text-lg text-bone">
                {about.education.degree}
                <span className="text-bone-muted italic">
                  {' '}
                  · {about.education.period} · {about.education.status}
                </span>
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
