import type { PortfolioContent } from '@/types/portfolio';
import { RegionShell } from './RegionShell';

interface FocusRegionProps {
  content: PortfolioContent;
}

/** Uma chama que tremula: três línguas de fogo sobrepostas, cada uma no seu ritmo. */
function Flame({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 60 90" className="mx-auto h-20 w-14" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="70%" r="55%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="45%" stopColor="#fdd05f" />
          <stop offset="100%" stopColor="#c28a30" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="30" cy="62" rx="26" ry="24" fill={`url(#${uid}-glow)`} opacity="0.5" />
      <path className="flame-a" d="M30 6 C 44 28, 50 44, 44 62 C 40 74, 20 74, 16 62 C 10 44, 18 28, 30 6 Z" fill="#c28a30" />
      <path className="flame-b" d="M30 22 C 40 38, 43 50, 39 62 C 36 70, 24 70, 21 62 C 17 50, 22 38, 30 22 Z" fill="#fdd05f" />
      <path className="flame-c" d="M30 40 C 35 48, 36 56, 34 62 C 32 66, 28 66, 26 62 C 24 56, 25 48, 30 40 Z" fill="#fff6d6" />
      {/* o braseiro de pedra */}
      <path d="M8 74 H52 L46 86 H14 Z" fill="#01050b" />
      <rect x="4" y="70" width="52" height="6" rx="1" fill="#0a1424" />
    </svg>
  );
}

/**
 * Câmara das Duas Chamas: as duas frentes de trabalho, uma em produção e
 * outra em estudo, cada uma diante do seu braseiro.
 */
export function FocusRegion({ content }: FocusRegionProps) {
  const { focus, game } = content;

  return (
    <RegionShell
      firefly={{ anchor: 'foco', label: game.firefly.poke }}
      id="foco"
      region={game.regions.focus}
      scene="02-minas-de-cristal"
      music="floresta"
      motes="253, 190, 90"
      lead={focus.lead}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {focus.tracks.map((track, i) => (
          <article
            key={track.label}
            className="rounded-sm border border-amber/25 bg-abyss/75 px-7 pt-6 pb-8 text-center backdrop-blur-sm"
          >
            <Flame uid={`chama-${i}`} />
            <p className="mt-3 font-title text-xs tracking-[0.32em] text-amber uppercase">{track.label}</p>
            <h3 className="mt-3 font-title text-2xl font-semibold tracking-[0.08em] text-bone uppercase">
              {track.title}
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-left text-lg leading-relaxed text-bone/90">
              {track.description}
            </p>
          </article>
        ))}
      </div>
    </RegionShell>
  );
}
