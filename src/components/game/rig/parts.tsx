/**
 * As peças do vagalume, desenhadas em vetor no estilo dos metroidvanias:
 * silhueta escura com um fio de luz no contorno, cabeça grande e redonda,
 * um olho enorme aceso, asas e lanterna brilhando.
 *
 * Cada peça é desenhada em volta do próprio pivô (a origem): girar a junta
 * gira a peça em torno da articulação. A orientação de cada peça repete a
 * das peças pintadas da primeira versão, para que as poses e coreografias
 * continuem valendo: tórax para cima, asas para trás, pernas para baixo.
 *
 * Sem filtros de desfoque: o brilho é feito com gradientes, que custam
 * quase nada para animar.
 */

export type PartName =
  | 'thorax'
  | 'head'
  | 'wing-upper'
  | 'wing-lower'
  | 'abdomen'
  | 'thigh'
  | 'shin'
  | 'foot'
  | 'arm-upper'
  | 'arm-fore';

const INK = '#080b14';
const INK_FAR = '#04060b';
const RIM = '#26344f';
const RIM_FAR = '#121a2b';

/** um membro afinando, de (0,0) até (dx,dy), com pontas arredondadas */
function limb(dx: number, dy: number, w1: number, w2: number): string {
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const a = w1 / 2;
  const b = w2 / 2;
  const f = (v: number) => v.toFixed(1);
  return [
    `M ${f(nx * a)} ${f(ny * a)}`,
    `L ${f(dx + nx * b)} ${f(dy + ny * b)}`,
    `A ${b} ${b} 0 0 0 ${f(dx - nx * b)} ${f(dy - ny * b)}`,
    `L ${f(-nx * a)} ${f(-ny * a)}`,
    `A ${a} ${a} 0 0 0 ${f(nx * a)} ${f(ny * a)}`,
    'Z',
  ].join(' ');
}

const THIGH = limb(46, 104, 36, 24);
const SHIN = limb(-48, 78, 24, 16);
const ARM_UPPER = limb(34, 76, 22, 15);
const ARM_FORE = limb(14, 72, 15, 11);

/** Onde cada filha se prende, nas coordenadas da peça-mãe. */
export const ATTACH = {
  shin: [46, 104],
  foot: [-48, 78],
  forearm: [34, 76],
} as const;

/** Gradientes compartilhados pelas peças de um vagalume; `u` evita colisão de ids. */
export function RigDefs({ u }: { u: string }) {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${u}-eye`} cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#fffdf2" />
          <stop offset="45%" stopColor="#ffeb9c" />
          <stop offset="100%" stopColor="#f4b845" />
        </radialGradient>
        <radialGradient id={`${u}-halo`}>
          <stop offset="0%" stopColor="#fdd05f" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#fdd05f" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#fdd05f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${u}-belly`} cx="40%" cy="62%" r="62%">
          <stop offset="0%" stopColor="#fffbe8" />
          <stop offset="50%" stopColor="#ffd96e" />
          <stop offset="100%" stopColor="#e39c36" />
        </radialGradient>
        <linearGradient id={`${u}-wing`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="-318" y2="0">
          <stop offset="0%" stopColor="#fdd05f" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff0bd" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`${u}-wing2`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="-232" y2="0">
          <stop offset="0%" stopColor="#fdd05f" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff0bd" stopOpacity="0.45" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const WING_UPPER = 'M 6 -4 C -60 -56, -232 -70, -318 -14 C -262 52, -108 66, 6 12 Z';
const WING_LOWER = 'M 6 -4 C -46 -36, -168 -40, -232 -6 C -182 40, -76 44, 6 12 Z';

export function Part({ name, u, far = false }: { name: PartName; u: string; far?: boolean }) {
  const ink = far ? INK_FAR : INK;
  const rim = far ? RIM_FAR : RIM;
  const body = { fill: ink, stroke: rim, strokeWidth: 3, strokeLinejoin: 'round' as const };

  switch (name) {
    case 'thorax':
      return (
        <path
          {...body}
          d="M -20 6 C -30 -30, -34 -88, -20 -124 C -10 -138, 8 -138, 16 -124 C 28 -92, 26 -34, 16 6 C 6 14, -10 14, -20 6 Z"
        />
      );

    case 'head':
      return (
        <>
          {/* pescoço */}
          <path {...body} d={limb(8, -34, 24, 30)} />
          {/* antenas: sobem do alto da cabeça e se curvam para a frente */}
          <g fill="none" stroke={ink} strokeWidth="7" strokeLinecap="round">
            <path d="M -6 -212 C -20 -300, 30 -372, 128 -380" />
            <path d="M 34 -220 C 42 -290, 100 -322, 178 -312" />
          </g>
          <circle cx="134" cy="-380" r="30" fill={`url(#${u}-halo)`} />
          <circle cx="184" cy="-311" r="28" fill={`url(#${u}-halo)`} />
          <ellipse cx="134" cy="-380" rx="15" ry="8" transform="rotate(-6 134 -380)" fill={`url(#${u}-eye)`} />
          <ellipse cx="184" cy="-311" rx="14" ry="8" transform="rotate(8 184 -311)" fill={`url(#${u}-eye)`} />
          {/* a cabeça redonda, com um fio de luz azulada no alto de trás */}
          <circle {...body} strokeWidth={4} cx="18" cy="-112" r="112" />
          <path
            d="M -78 -150 A 104 104 0 0 1 4 -214"
            fill="none"
            stroke="#5a6f9a"
            strokeOpacity="0.35"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* o olho: halo, íris acesa e um brilho */}
          <ellipse cx="78" cy="-100" rx="70" ry="86" fill={`url(#${u}-halo)`} />
          <ellipse cx="78" cy="-100" rx="34" ry="50" transform="rotate(-12 78 -100)" fill={`url(#${u}-eye)`} />
          <ellipse cx="68" cy="-122" rx="9" ry="13" transform="rotate(-12 68 -122)" fill="#fffef8" opacity="0.85" />
        </>
      );

    case 'wing-upper':
    case 'wing-lower': {
      const upper = name === 'wing-upper';
      const d = upper ? WING_UPPER : WING_LOWER;
      return (
        <>
          {/* um contorno largo e translúcido faz as vezes de brilho */}
          <path d={d} fill="none" stroke="#fdd05f" strokeOpacity="0.18" strokeWidth="22" strokeLinejoin="round" />
          <path
            d={d}
            fill={`url(#${u}-${upper ? 'wing' : 'wing2'})`}
            stroke="#ffe7a0"
            strokeOpacity="0.9"
            strokeWidth="3"
          />
          <g fill="none" stroke="#fff6d6" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round">
            {upper ? (
              <>
                <path d="M 0 2 C -90 -18, -196 -26, -296 -14" />
                <path d="M 0 6 C -86 18, -170 26, -246 26" />
                <path d="M -120 -16 C -150 -40, -190 -50, -220 -48" />
              </>
            ) : (
              <>
                <path d="M 0 3 C -70 -6, -150 -10, -214 -6" />
                <path d="M -80 0 C -110 18, -150 26, -180 24" />
              </>
            )}
          </g>
          <circle cx="0" cy="4" r="11" fill={INK} stroke={RIM} strokeWidth="3" />
        </>
      );
    }

    case 'abdomen':
      // a lanterna aponta para trás e para baixo, sem chegar ao chão
      return (
        <>
          <ellipse cx="-58" cy="92" rx="104" ry="112" fill={`url(#${u}-halo)`} />
          <path
            d="M 4 -4 C -18 -2, -52 18, -80 52 C -112 92, -124 142, -98 160 C -72 178, -30 152, -6 110 C 14 74, 22 30, 4 -4 Z"
            fill={`url(#${u}-belly)`}
            stroke="#fff0bd"
            strokeOpacity="0.7"
            strokeWidth="2.5"
          />
          <g fill="none" stroke="#c98a2e" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round">
            <path d="M -88 84 C -62 100, -34 100, -10 86" />
            <path d="M -106 124 C -82 140, -54 138, -30 124" />
          </g>
          {/* a tampa escura onde a lanterna se prende ao tórax */}
          <path {...body} d="M 6 -8 C -16 -6, -42 10, -60 34 C -40 50, -16 56, 12 46 C 18 26, 18 4, 6 -8 Z" />
        </>
      );

    case 'thigh':
      return <path {...body} d={THIGH} />;

    case 'shin':
      return <path {...body} d={SHIN} />;

    case 'foot':
      return (
        <path
          {...body}
          d="M -9 -4 C -5 10, 0 20, 4 26 C 24 26, 48 30, 64 40 C 46 46, 18 46, -6 40 C -13 26, -13 8, -9 -4 Z"
        />
      );

    case 'arm-upper':
      return <path {...body} d={ARM_UPPER} />;

    case 'arm-fore':
      return (
        <>
          <path {...body} d={ARM_FORE} />
          {/* a mãozinha: três garras curtas */}
          <path {...body} strokeWidth={2} d="M 8 76 L 26 90 L 16 88 L 18 100 L 10 90 L 2 98 L 4 84 Z" />
        </>
      );
  }
}
