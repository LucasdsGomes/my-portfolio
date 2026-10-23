import { ridge, stalactites, wall } from './shapes';

const W = 1600;
const H = 900;

/** Pilares do aqueduto, em x; os vãos entre eles viram arcos. */
const PILLARS = [700, 846, 992, 1138, 1284, 1430];
const PILLAR_W = 30;
const BEAM_Y = 508;

function aqueductArches(): string {
  const parts: string[] = [];
  for (let i = 0; i < PILLARS.length - 1; i += 1) {
    const a = PILLARS[i]! + PILLAR_W;
    const b = PILLARS[i + 1]!;
    const r = (b - a) / 2;
    // retângulo sob a viga menos o arco: sobram os tímpanos
    parts.push(`M${a} ${BEAM_Y} H${b} V${BEAM_Y + r * 1.15} A${r} ${r * 1.05} 0 0 0 ${a} ${BEAM_Y + r * 1.15} Z`);
  }
  return parts.join(' ');
}

/** Janela em arco: o vão por onde a luz de trás escapa. */
function archWindow(x: number, y: number, w: number, h: number): string {
  const r = w / 2;
  return `M${x} ${y + h} V${y + r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h} Z`;
}

const FAR_RIDGE = ridge({ width: W, height: H, baseY: 640, amplitude: 70, step: 40, seed: 11 });
const MID_LEFT = wall({ side: 'left', width: W, height: H, reach: 230, jag: 90, step: 46, seed: 23 });
const MID_RIGHT = wall({ side: 'right', width: W, height: H, reach: 170, jag: 80, step: 42, seed: 31 });
const NEAR_FLOOR = ridge({ width: W, height: H, baseY: 820, amplitude: 50, step: 34, seed: 47 });
const CEILING_DRIPS = stalactites({ width: W, topY: -4, count: 26, maxLength: 120, seed: 53 });

/**
 * Parallax: a página sobe a velocidade 1 e cada camada é empurrada para
 * baixo por scroll × depth, então parece subir a (1 − depth). O fundo tem
 * depth alto e anda devagar; o primeiro plano tem depth baixo e passa rápido.
 *
 * O fundo da tela de título: as ruínas iluminadas por trás, como na arte de
 * conceito. Camadas do fundo para a frente, cada uma mais escura e mais
 * próxima, com parallax quando a página começa a rolar.
 */
export function RuinsBackdrop() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="rb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b1628" />
          <stop offset="45%" stopColor="#12233d" />
          <stop offset="100%" stopColor="#03060e" />
        </linearGradient>
        <radialGradient id="rb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6d9bcc" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#4b7cae" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#294f7e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rb-fall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9cc0e6" stopOpacity="0" />
          <stop offset="25%" stopColor="#9cc0e6" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#9cc0e6" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="rb-fog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#294f7e" stopOpacity="0" />
          <stop offset="55%" stopColor="#3a6492" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#03060e" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rb-shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfe2ff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#cfe2ff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="url(#rb-sky)" />
      <ellipse cx="1060" cy="440" rx="560" ry="400" fill="url(#rb-glow)" />

      {/* feixes de luz entrando por rachaduras do teto */}
      <g className="parallax-layer" style={{ ['--depth' as string]: 0.55 }}>
        <polygon points="1120,0 1180,0 1010,900 900,900" fill="url(#rb-shaft)" />
        <polygon points="1290,0 1320,0 1210,900 1150,900" fill="url(#rb-shaft)" opacity="0.7" />
      </g>

      {/* cordilheira do fundo da caverna */}
      <g className="parallax-layer" style={{ ['--depth' as string]: 0.5 }}>
        <path d={FAR_RIDGE} fill="#1a3354" opacity="0.9" />
      </g>

      {/* ruínas: torres, aqueduto e a cascata no meio */}
      <g className="parallax-layer" style={{ ['--depth' as string]: 0.42 }}>
        <rect x="978" y="150" width="40" height="760" fill="url(#rb-fall)" />

        <g fill="#203f66">
          {/* torre alta */}
          <path d="M1182 118 h20 v-22 h16 v22 h22 v-30 h16 v30 h20 v-18 h16 v18 h20 V900 H1182 Z" />
          {/* torre baixa, à esquerda */}
          <path d="M760 262 h14 v-16 h14 v16 h20 v-24 h14 v24 h18 V900 H760 Z" />
          {/* viga e pilares do aqueduto */}
          <rect x={PILLARS[0]} y={BEAM_Y - 34} width={PILLARS.at(-1)! + PILLAR_W - PILLARS[0]!} height="34" />
          {PILLARS.map((x) => (
            <rect key={x} x={x} y={BEAM_Y} width={PILLAR_W} height={H - BEAM_Y} />
          ))}
          <path d={aqueductArches()} />
          {/* colunas quebradas */}
          <path d="M640 900 V610 l10 -14 l12 10 V900 Z" />
          <path d="M1490 900 V560 l14 -8 l8 16 V900 Z" />
        </g>

        {/* janelas: a luz de trás vazando pelos vãos */}
        <g fill="#5b8cc0" opacity="0.55">
          <path d={archWindow(1218, 200, 34, 74)} />
          <path d={archWindow(1218, 330, 34, 74)} />
          <path d={archWindow(1272, 200, 34, 74)} />
          <path d={archWindow(784, 330, 24, 56)} />
        </g>
      </g>

      {/* névoa assentada no fundo das ruínas */}
      <g className="parallax-layer" style={{ ['--depth' as string]: 0.35 }}>
        <rect y="500" width={W} height="320" fill="url(#rb-fog)" />
      </g>

      {/* paredes laterais da caverna, mais escuras e mais perto */}
      <g className="parallax-layer" style={{ ['--depth' as string]: 0.22 }}>
        <path d={MID_LEFT} fill="#0c1a2e" />
        <path d={MID_RIGHT} fill="#0a1628" />
        <path d={CEILING_DRIPS} fill="#0a1628" />
      </g>

      {/* chão do primeiro plano distante */}
      <g className="parallax-layer" style={{ ['--depth' as string]: 0.1 }}>
        <path d={NEAR_FLOOR} fill="#050b16" />
      </g>
    </svg>
  );
}
