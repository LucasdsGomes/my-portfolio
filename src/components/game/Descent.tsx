'use client';

import { ART } from './art/assets.generated';
import { Motes } from './scene/Motes';
import { ScenePicture } from './scene/Scene';
import { seeded, stalactites, vine, wall, wallEdge } from './scene/shapes';
import { useSceneScroll } from './useSceneScroll';

const W = 1600;
const H = 3600;

interface Layer {
  /** quanto a camada sobe ao longo da descida: as mais próximas sobem mais */
  travel: string;
  fill: string;
  /** desfoque de profundidade de campo: o fundo fica mole, a frente nítida */
  blur: number;
  left: string;
  right: string;
  vines: string[];
  /** brotos de luz na borda da rocha */
  glow: { x: number; y: number; r: number; warm: boolean }[];
}

function buildLayer(
  travel: string,
  fill: string,
  blur: number,
  reach: number,
  jag: number,
  step: number,
  seed: number,
): Layer {
  const left = { side: 'left' as const, width: W, height: H, reach, jag, step, seed };
  const right = { side: 'right' as const, width: W, height: H, reach: reach * 0.94, jag, step: step * 0.92, seed: seed + 2 };
  const edges = [...wallEdge(left), ...wallEdge(right)];
  const rand = seeded(seed + 7);

  const vines: string[] = [];
  const glow: Layer['glow'] = [];
  for (const [x, y] of edges) {
    if (rand() > 0.78) vines.push(vine({ x, y, length: 120 + rand() * 260, sway: 30, seed: Math.round(x + y) }));
    if (rand() > 0.7) glow.push({ x: x + (rand() - 0.5) * 20, y, r: 3 + rand() * 5, warm: rand() > 0.55 });
  }

  return { travel, fill, blur, left: wall(left), right: wall(right), vines, glow };
}

/** Três profundidades: quanto mais perto, mais escura, mais nítida e mais rápida. */
const LAYERS: Layer[] = [
  buildLayer('-28%', '#16294a', 7, 420, 170, 70, 101),
  buildLayer('-48%', '#0a1628', 2.5, 270, 140, 56, 107),
  buildLayer('-66.6%', '#01050b', 0, 120, 110, 44, 113),
];

const ROOTS = stalactites({ width: W, topY: 0, count: 34, maxLength: 260, seed: 131 });

/** Cascatas finas escorrendo das paredes do fundo. */
const FALLS = [
  { x: 470, w: 10, top: 400 },
  { x: 1140, w: 14, top: 900 },
  { x: 560, w: 8, top: 1900 },
  { x: 1060, w: 9, top: 2500 },
];

const HAS_PAINTING = 'descida' in ART.scenes;

/**
 * A descida entre a tela de título e a primeira região: o poço que a câmera
 * atravessa enquanto o vagalume mergulha (ele é animado pelo diretor da
 * jornada, por cima da página).
 *
 * Se existir a pintura art/source/cenarios/descida.png, a câmera percorre
 * ela de cima a baixo. Sem ela, o poço é montado em camadas: desfoque de
 * profundidade no fundo, cipós e flora brilhando na borda da rocha, feixes
 * de luz e névoa. Fora da árvore de acessibilidade; sem conteúdo.
 */
export function Descent() {
  const ref = useSceneScroll<HTMLElement>();

  return (
    <section ref={ref} aria-hidden="true" data-music="floresta" className="relative h-[170svh] bg-abyss">
      <div className="sticky top-0 h-svh overflow-hidden">
        {HAS_PAINTING ? <PaintedShaft /> : <LayeredShaft />}

        {/* névoa em faixas, subindo mais rápido que o fundo */}
        <div
          className="absolute inset-x-0 top-0 h-[260%] bg-[repeating-linear-gradient(to_bottom,transparent_0,rgba(120,160,210,0.07)_9%,transparent_18%)]"
          style={{ transform: 'translate3d(0, calc(var(--p, 0) * -60%), 0)' }}
        />

        {/* a floresta lá embaixo: um brilho verde que cresce na chegada */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_50%_100%,rgba(110,230,185,0.32),transparent_65%)]"
          style={{ opacity: 'calc(var(--p, 0) * 1.3 - 0.25)' }}
        />

        <Motes density={1.8} rise={-40} tint="230, 220, 207" />

        {/* vinheta: segura o olho no centro, onde o vagalume cai */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_90%_at_50%_45%,transparent_40%,rgba(1,5,11,0.85))]" />
      </div>
    </section>
  );
}

function PaintedShaft() {
  const { width, height } = ART.scenes['descida' as keyof typeof ART.scenes];
  const ratio = width / height;
  // largura nativa numa tela larga; no celular, larga o bastante para a
  // pintura ser mais alta que a tela e ainda haver percurso para descer
  const front = `max(min(100vw, ${width}px), calc(118svh * ${ratio}))`;

  return (
    <>
      {/* fundo: a mesma pintura, ampliada e desfocada, preenche as laterais */}
      <div
        className="absolute top-0 left-1/2 w-[max(100vw,100svh)] will-change-transform"
        style={{
          transform: 'translate3d(-50%, calc(var(--p, 0) * (100svh - 100%)), 0)',
          filter: 'blur(28px) brightness(0.45) saturate(1.2)',
        }}
      >
        <ScenePicture scene={'descida' as keyof typeof ART.scenes} className="block h-auto w-full" />
      </div>

      {/* frente: a pintura nítida, que a câmera percorre de cima a baixo */}
      <div
        className="absolute top-0 left-1/2 will-change-transform"
        style={{ width: front, transform: 'translate3d(-50%, calc(var(--p, 0) * (100svh - 100%)), 0)' }}
      >
        <ScenePicture scene={'descida' as keyof typeof ART.scenes} className="block h-auto w-full" />
        {/* as bordas da pintura somem no fundo desfocado, sem corte seco */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#01050b,transparent_9%,transparent_91%,#01050b)]" />
        {/* topo e pé escuros, presos à pintura: ela nasce do pé escuro do título
            e morre no escuro antes da Clareira, sem linha de emenda */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#03060e,transparent_16%,transparent_80%,#03060e)]" />
      </div>
    </>
  );
}

function LayeredShaft() {
  return (
    <>
      {/* começa no escuro do pé da pintura do título, clareia no meio e apaga embaixo */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#03060e,#12233d_30%,#0b1628_70%,#03060e)]" />

      {/* feixes de luz entrando pela boca do poço, apagando conforme se desce */}
      <div
        className="absolute inset-0 bg-[linear-gradient(100deg,transparent_38%,rgba(180,210,255,0.08)_44%,transparent_52%),linear-gradient(80deg,transparent_55%,rgba(180,210,255,0.06)_60%,transparent_66%)]"
        style={{ opacity: 'calc(1 - var(--p, 0) * 1.4)' }}
      />

      {LAYERS.map((layer, i) => (
        <div
          key={layer.fill}
          className="absolute inset-x-0 top-0 h-[300%] will-change-transform"
          style={{
            transform: `translate3d(0, calc(var(--p, 0) * ${layer.travel}), 0)`,
            filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
          }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full" focusable="false">
            {i === 0
              ? FALLS.map((fall) => (
                  <rect
                    key={fall.x}
                    x={fall.x}
                    y={fall.top}
                    width={fall.w}
                    height={900}
                    fill="url(#descent-fall)"
                  />
                ))
              : null}
            {i === 0 ? (
              <defs>
                <linearGradient id="descent-fall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9cc0e6" stopOpacity="0" />
                  <stop offset="20%" stopColor="#9cc0e6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#9cc0e6" stopOpacity="0" />
                </linearGradient>
              </defs>
            ) : null}
            <path d={layer.left} fill={layer.fill} />
            <path d={layer.right} fill={layer.fill} />
            <g fill="none" stroke={layer.fill} strokeWidth={i === 2 ? 7 : 5} strokeLinecap="round">
              {layer.vines.map((d) => (
                <path key={d} d={d} />
              ))}
            </g>
            {/* a flora só brilha nas camadas do meio e da frente */}
            {i > 0 ? (
              <g style={{ filter: 'drop-shadow(0 0 5px rgba(253,208,95,0.8)) drop-shadow(0 0 12px rgba(127,232,196,0.5))' }}>
              {layer.glow.map((g) => (
                  <circle
                    key={`${g.x}-${g.y}`}
                    cx={g.x}
                    cy={g.y}
                    r={g.r}
                    fill={g.warm ? '#fdd05f' : '#7fe8c4'}
                    opacity={i === 2 ? 0.95 : 0.6}
                  />
                ))}
              </g>
            ) : null}
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
    </>
  );
}
