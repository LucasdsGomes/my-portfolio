import { leaf, ridge, stalactites } from './shapes';

const W = 1600;
const H = 900;

const BACK_WALL = ridge({ width: W, height: H, baseY: 380, amplitude: 120, step: 60, seed: 211 });
const MID_FLOOR = ridge({ width: W, height: H, baseY: 700, amplitude: 60, step: 40, seed: 223 });
const NEAR_FLOOR = ridge({ width: W, height: H, baseY: 810, amplitude: 36, step: 30, seed: 227 });
const CEILING = stalactites({ width: W, topY: -2, count: 30, maxLength: 150, seed: 229 });

/** Cogumelos e brotos no chão: o único sinal de vida da caverna. */
const MUSHROOMS = [
  { x: 1120, y: 812, s: 1 },
  { x: 1162, y: 818, s: 0.7 },
  { x: 1340, y: 806, s: 1.25 },
  { x: 260, y: 820, s: 0.8 },
];

const GRASS = [
  leaf({ x: 1210, y: 820, size: 70, angle: -12 }),
  leaf({ x: 1222, y: 820, size: 52, angle: 18 }),
  leaf({ x: 420, y: 826, size: 64, angle: 14 }),
  leaf({ x: 408, y: 826, size: 46, angle: -26 }),
  leaf({ x: 1480, y: 812, size: 80, angle: -6 }),
];

/**
 * A Clareira do Lampião: uma câmara de pedra com um lampião pendurado,
 * a casa do vagalume. A luz aqui é morna, a única região que não é azul.
 */
export function ChamberBackdrop() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="cb-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#03060e" />
          <stop offset="40%" stopColor="#0b1628" />
          <stop offset="100%" stopColor="#03060e" />
        </linearGradient>
        <radialGradient id="cb-warm" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fdd05f" stopOpacity="0.42" />
          <stop offset="40%" stopColor="#c28a30" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#c28a30" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="url(#cb-bg)" />
      <path d={BACK_WALL} fill="#0e1c31" />
      <ellipse cx="1180" cy="300" rx="620" ry="520" fill="url(#cb-warm)" />
      <path d={MID_FLOOR} fill="#081322" />

      {/* o lampião: corrente, gaiola e a chama */}
      <g>
        <line x1="1180" y1="0" x2="1180" y2="226" stroke="#01050b" strokeWidth="3" />
        <path d="M1160 226 h40 l-6 12 h-28 Z" fill="#01050b" />
        <path d="M1166 238 h28 l4 56 h-36 Z" fill="#01050b" opacity="0.5" />
        <ellipse cx="1180" cy="268" rx="11" ry="19" fill="#fdd05f" />
        <ellipse cx="1180" cy="272" rx="5" ry="9" fill="#fff6d6" />
        <g fill="none" stroke="#01050b" strokeWidth="3">
          <path d="M1166 238 l-4 56" />
          <path d="M1194 238 l4 56" />
          <path d="M1180 238 v56" />
        </g>
        <path d="M1158 294 h44 l-8 10 h-28 Z" fill="#01050b" />
      </g>

      <path d={CEILING} fill="#01050b" />
      <path d={NEAR_FLOOR} fill="#01050b" />

      <g fill="#01050b">
        {MUSHROOMS.map(({ x, y, s }) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x="-3" y="-34" width="6" height="36" rx="3" />
            <path d="M-26 -30 C -24 -56, 24 -56, 26 -30 Z" />
          </g>
        ))}
        {GRASS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* chapéus dos cogumelos pegando a luz do lampião */}
      <g fill="#c28a30" opacity="0.35">
        {MUSHROOMS.map(({ x, y, s }) => (
          <ellipse key={x} cx={x + 6 * s} cy={y - 44 * s} rx={10 * s} ry={3 * s} />
        ))}
      </g>
    </svg>
  );
}
