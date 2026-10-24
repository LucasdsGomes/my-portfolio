'use client';

import { useEffect, useRef } from 'react';
import type { PortfolioContent } from '@/types/portfolio';
import { playSfx } from '../audio/sound';
import { JOURNEY_RESET } from '../journey/events';
import { RegionShell } from './RegionShell';

/** a trilha entre os três marcos, em coordenadas do SVG da faixa */
const TRAIL = 'M166 70 C 260 10, 400 110, 500 60 S 740 10, 833 70';

interface PathRegionProps {
  content: PortfolioContent;
}

/**
 * Mesa do Cartógrafo: a trajetória como um mapa. As fases são marcos ligados
 * por uma trilha que se desenha a traço quando a região aparece, e a fase
 * atual tem o marcador de "você está aqui".
 */
export function PathRegion({ content }: PathRegionProps) {
  const { timeline, game } = content;
  const mapRef = useRef<HTMLDivElement>(null);
  const last = timeline.phases.length - 1;

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      map.dataset.drawn = 'true';
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        map.dataset.drawn = 'true';
        playSfx('mapa');
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(map);
    const onReset = () => {
      map.dataset.drawn = 'false';
      observer.observe(map);
    };
    window.addEventListener(JOURNEY_RESET, onReset);
    return () => {
      observer.disconnect();
      window.removeEventListener(JOURNEY_RESET, onReset);
    };
  }, []);

  return (
    <RegionShell
      firefly={{ anchor: 'trajetoria', label: game.firefly.poke }}
      id="trajetoria"
      region={game.regions.path}
      scene="05-ruinas-antigas"
      music="floresta"
      motes="210, 220, 235"
      lead={timeline.lead}
    >
      <div ref={mapRef} className="map relative" data-drawn="false">
        {/* a trilha: só em telas largas, onde as fases ficam lado a lado */}
        <svg
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-0 hidden h-28 w-full lg:block"
          aria-hidden="true"
          focusable="false"
        >
          {/* a trilha é pontilhada, e animar o tracejado só faria os pontos
              andarem: quem se desenha é uma linha cheia dentro da máscara */}
          <defs>
            <mask id="map-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="120">
              <path className="map-reveal" pathLength={1} d={TRAIL} fill="none" stroke="#fff" strokeWidth="10" />
            </mask>
          </defs>
          <path
            mask="url(#map-reveal)"
            d={TRAIL}
            fill="none"
            stroke="#e6dccf"
            strokeOpacity="0.6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="2 12"
          />
        </svg>

        <ol className="relative grid gap-10 lg:grid-cols-3 lg:gap-8">
          {timeline.phases.map((phase, i) => (
            <li key={phase.index} className="map-stop flex flex-col items-center text-center" style={{ ['--i' as string]: i }}>
              {/* o marco do mapa */}
              <div className="relative flex h-28 items-center justify-center">
                <span
                  className={`flex size-14 items-center justify-center rounded-full border-2 font-title text-lg ${
                    i === last
                      ? 'border-glow bg-abyss text-glow shadow-[0_0_22px_rgba(253,208,95,0.55)]'
                      : 'border-bone/50 bg-abyss text-bone'
                  }`}
                >
                  {phase.index}
                </span>
                {i === last ? (
                  <span className="absolute -top-1 rounded-sm bg-glow px-2 py-0.5 font-title text-[0.62rem] tracking-[0.2em] whitespace-nowrap text-abyss uppercase">
                    {game.map.here}
                  </span>
                ) : null}
              </div>

              <div className="mt-2 w-full rounded-sm border border-bone/12 bg-abyss/75 px-6 pt-5 pb-6 backdrop-blur-sm">
                <p className="font-title text-xs tracking-[0.26em] text-amber uppercase">{phase.period}</p>
                <h3 className="mt-2 font-title text-xl font-semibold tracking-[0.08em] text-bone uppercase">
                  {phase.title}
                </h3>
                <p className="mt-3 text-left text-base leading-relaxed text-bone/90">{phase.description}</p>
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {phase.markers.map((marker) => (
                    <li
                      key={marker}
                      className="rounded-sm border border-bone/15 px-2 py-0.5 font-title text-[0.68rem] tracking-[0.1em] text-bone-muted uppercase"
                    >
                      {marker}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </RegionShell>
  );
}
