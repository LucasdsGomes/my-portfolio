/**
 * Geradores de silhueta para o cenário. Tudo é determinístico: a mesma
 * semente produz o mesmo desenho no servidor e no cliente, então não há
 * divergência de hidratação e o cenário não "pula" ao carregar.
 */

/** PRNG pequeno e rápido; suficiente para rocha, nada criptográfico. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => n.toFixed(1);

interface RidgeOptions {
  width: number;
  height: number;
  /** altura média da crista, medida do topo */
  baseY: number;
  /** quanto a crista sobe e desce */
  amplitude: number;
  /** distância horizontal entre pontos */
  step: number;
  seed: number;
}

/**
 * Crista horizontal fechada embaixo: montanhas, chão de caverna, borda de
 * floresta. A altura anda em passeio aleatório suavizado, que é o que faz
 * parecer rocha e não ruído.
 */
export function ridge({ width, height, baseY, amplitude, step, seed }: RidgeOptions): string {
  const rand = seeded(seed);
  let y = baseY;
  const parts = [`M0 ${height}`, `L0 ${f(baseY)}`];

  for (let x = step; x <= width + step; x += step) {
    y += (rand() - 0.5) * amplitude;
    y += (baseY - y) * 0.18; // puxa de volta para a média
    parts.push(`L${f(Math.min(x, width))} ${f(y)}`);
  }

  parts.push(`L${width} ${height}`, 'Z');
  return parts.join(' ');
}

interface WallOptions {
  side: 'left' | 'right';
  width: number;
  height: number;
  /** quanto a parede avança para dentro da tela, em média */
  reach: number;
  /** variação do avanço */
  jag: number;
  step: number;
  seed: number;
}

/** Parede vertical de poço: a descida passa entre duas destas. */
export function wall({ side, width, height, reach, jag, step, seed }: WallOptions): string {
  const rand = seeded(seed);
  let x = reach;
  const edge = side === 'left' ? 0 : width;
  const toX = (d: number) => (side === 'left' ? d : width - d);
  const parts = [`M${edge} 0`, `L${f(toX(reach))} 0`];

  for (let y = step; y <= height + step; y += step) {
    x += (rand() - 0.5) * jag;
    x += (reach - x) * 0.22;
    // de vez em quando, uma saliência: degrau de rocha
    if (rand() > 0.86) x += jag * 0.6;
    parts.push(`L${f(toX(Math.max(x, 4)))} ${f(Math.min(y, height))}`);
  }

  parts.push(`L${edge} ${height}`, 'Z');
  return parts.join(' ');
}

interface DripOptions {
  width: number;
  /** linha do teto de onde as pontas descem */
  topY: number;
  count: number;
  maxLength: number;
  seed: number;
}

/** Estalactites: triângulos estreitos pendurados de uma linha de teto. */
export function stalactites({ width, topY, count, maxLength, seed }: DripOptions): string {
  const rand = seeded(seed);
  const parts: string[] = [];

  for (let i = 0; i < count; i += 1) {
    const cx = rand() * width;
    const half = 6 + rand() * 18;
    const len = maxLength * (0.25 + rand() * 0.75);
    parts.push(
      `M${f(cx - half)} ${f(topY)} L${f(cx + rand() * 4 - 2)} ${f(topY + len)} L${f(cx + half)} ${f(topY)} Z`,
    );
  }

  return parts.join(' ');
}

interface VineOptions {
  x: number;
  y: number;
  length: number;
  sway: number;
  seed: number;
}

/** Cipó pendurado: uma curva que balança de leve conforme desce. */
export function vine({ x, y, length, sway, seed }: VineOptions): string {
  const rand = seeded(seed);
  const segments = 4;
  const seg = length / segments;
  let cx = x;
  const parts = [`M${f(x)} ${f(y)}`];

  for (let i = 1; i <= segments; i += 1) {
    const nx = x + (rand() - 0.5) * sway;
    const ny = y + seg * i;
    const c1x = cx + (rand() - 0.5) * sway * 1.4;
    parts.push(`Q${f(c1x)} ${f(ny - seg / 2)} ${f(nx)} ${f(ny)}`);
    cx = nx;
  }

  return parts.join(' ');
}

interface LeafOptions {
  x: number;
  y: number;
  /** comprimento da folha */
  size: number;
  /** ângulo em graus; 0 aponta para cima */
  angle: number;
}

/** Folha lanceolada simples, para a vegetação do primeiro plano. */
export function leaf({ x, y, size, angle }: LeafOptions): string {
  const a = (angle * Math.PI) / 180;
  const tipX = x + Math.sin(a) * size;
  const tipY = y - Math.cos(a) * size;
  const w = size * 0.28;
  const nx = Math.cos(a) * w;
  const ny = Math.sin(a) * w;
  const mx = (x + tipX) / 2;
  const my = (y + tipY) / 2;

  return `M${f(x)} ${f(y)} Q${f(mx + nx)} ${f(my + ny)} ${f(tipX)} ${f(tipY)} Q${f(mx - nx)} ${f(my - ny)} ${f(x)} ${f(y)} Z`;
}
