import { Firefly } from '../Firefly';
import { leaf, vine } from './shapes';

/** Topo da rocha onde o vagalume pousa, no sistema de coordenadas da borda. */
const LEDGE_TOP = 318;

const LEDGE = `M0 560 L0 300 C 40 288, 90 296, 140 302 C 210 310, 290 ${LEDGE_TOP}, 360 ${LEDGE_TOP - 4}
  C 420 314, 470 320, 500 336 C 520 348, 528 372, 540 404 C 556 446, 570 500, 590 560 Z`;

const LEDGE_LEAVES = [
  leaf({ x: 26, y: 560, size: 150, angle: -18 }),
  leaf({ x: 54, y: 560, size: 120, angle: 12 }),
  leaf({ x: 92, y: 560, size: 96, angle: 38 }),
  leaf({ x: 420, y: 330, size: 64, angle: 24 }),
  leaf({ x: 438, y: 334, size: 52, angle: 52 }),
  leaf({ x: 120, y: 300, size: 58, angle: -34 }),
  leaf({ x: 140, y: 304, size: 46, angle: -6 }),
];

const CANOPY = `M0 0 H900 C 860 40, 780 52, 700 60 C 610 70, 560 96, 480 104
  C 400 112, 360 150, 290 168 C 220 186, 160 232, 96 262 C 60 278, 26 300, 0 316 Z`;

const VINES = [
  vine({ x: 120, y: 240, length: 210, sway: 26, seed: 3 }),
  vine({ x: 210, y: 190, length: 150, sway: 20, seed: 5 }),
  vine({ x: 330, y: 150, length: 250, sway: 30, seed: 8 }),
  vine({ x: 470, y: 104, length: 120, sway: 18, seed: 13 }),
  vine({ x: 600, y: 72, length: 190, sway: 24, seed: 17 }),
];

const CANOPY_LEAVES = [
  leaf({ x: 330, y: 400, size: 40, angle: 168 }),
  leaf({ x: 124, y: 450, size: 34, angle: 196 }),
  leaf({ x: 604, y: 262, size: 30, angle: 172 }),
  leaf({ x: 520, y: 110, size: 44, angle: 150 }),
  leaf({ x: 250, y: 176, size: 52, angle: 140 }),
];

/**
 * A borda de rocha no canto inferior esquerdo, com o vagalume pousado
 * olhando as ruínas. Fica ancorada no canto em qualquer proporção de tela,
 * por isso vive num SVG próprio em vez de dentro do fundo.
 */
export function Ledge({ uid }: { uid: string }) {
  return (
    <svg
      viewBox="0 0 600 560"
      preserveAspectRatio="xMinYMax meet"
      className="parallax-layer pointer-events-none absolute bottom-0 left-0 w-[min(88vw,640px)]"
      style={{ ['--depth' as string]: -0.12 }}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="#050c18">
        <path d={leaf({ x: 6, y: 560, size: 210, angle: 4 })} />
        <path d={leaf({ x: 150, y: 560, size: 130, angle: 30 })} />
      </g>
      <path d={LEDGE} fill="#01050b" />
      {/* rachaduras com um fio de luz de reflexo */}
      <g fill="none" stroke="#12233d" strokeWidth="1.4" opacity="0.7">
        <path d="M150 340 C 170 380, 160 420, 190 470" />
        <path d="M380 340 C 392 370, 410 380, 420 420" />
      </g>
      <g fill="#01050b">
        {LEDGE_LEAVES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <Firefly
        uid={uid}
        frame={{ x: 196, y: LEDGE_TOP - 176, width: 204, height: 204 }}
      />
    </svg>
  );
}

/** A copa pendurada no canto superior esquerdo, com cipós. */
export function Canopy() {
  return (
    <svg
      viewBox="0 0 900 520"
      preserveAspectRatio="xMinYMin meet"
      className="parallax-layer pointer-events-none absolute top-0 left-0 w-[min(96vw,900px)]"
      style={{ ['--depth' as string]: -0.06 }}
      aria-hidden="true"
      focusable="false"
    >
      <path d={CANOPY} fill="#01050b" />
      <g fill="none" stroke="#01050b" strokeLinecap="round">
        {VINES.map((d, i) => (
          <path key={d} d={d} strokeWidth={i % 2 === 0 ? 6 : 4} />
        ))}
      </g>
      <g fill="#01050b">
        {CANOPY_LEAVES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
