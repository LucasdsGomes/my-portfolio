const TILE_WIDTH = 600;
const HEIGHT = 24;
const STEPS = 120;

/**
 * Traço de sinal determinístico: mesma saída no servidor e no cliente,
 * e as pontas fecham no mesmo valor para o tile emendar sem salto.
 */
function buildTile(): string {
  const points: string[] = [];

  for (let i = 0; i <= STEPS; i += 1) {
    const t = (i / STEPS) * Math.PI * 2;
    const amplitude =
      Math.sin(t) * 3.1 + Math.sin(t * 3 + 0.8) * 2.2 + Math.sin(t * 7 + 2.1) * 1.1;
    const x = ((i / STEPS) * TILE_WIDTH).toFixed(2);
    const y = (HEIGHT / 2 - amplitude).toFixed(2);
    points.push(`${i === 0 ? 'M' : 'L'}${x} ${y}`);
  }

  return points.join(' ');
}

const TILE = buildTile();

/**
 * A única coisa da página que se move o tempo todo. Vive na base do header
 * fixo e existe para lembrar que há dado chegando por baixo de tudo.
 */
export function SignalBar() {
  return (
    <div aria-hidden="true" className="pointer-events-none h-6 overflow-hidden opacity-45">
      <svg
        className="signal-sweep h-6 w-[1200px]"
        viewBox={`0 0 ${TILE_WIDTH * 2} ${HEIGHT}`}
        fill="none"
        preserveAspectRatio="none"
      >
        <path d={TILE} stroke="var(--color-accent)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path
          d={TILE}
          transform={`translate(${TILE_WIDTH} 0)`}
          stroke="var(--color-accent)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
