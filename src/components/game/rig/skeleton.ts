import { ATTACH, type PartName } from './parts';

export interface JointSpec {
  /** nome da junta; é o que as poses e as animações endereçam */
  id: string;
  part: PartName;
  /** onde o pivô fica, nas coordenadas da peça-mãe (o pivô dela é a origem) */
  at: readonly [number, number];
  /** rotação de repouso, em graus */
  rest: number;
  /** ordem de desenho entre irmãos */
  z: number;
  /** membro do lado de lá: mais escuro, para dar profundidade */
  far?: boolean;
  children?: readonly JointSpec[];
}

const leg = (
  side: 'near' | 'far',
  at: readonly [number, number],
  z: number,
  rest: { thigh: number; shin: number; foot: number },
): JointSpec => ({
  id: `thigh-${side}`,
  part: 'thigh',
  at,
  rest: rest.thigh,
  z,
  far: side === 'far',
  children: [
    {
      id: `shin-${side}`,
      part: 'shin',
      at: ATTACH.shin,
      rest: rest.shin,
      z: 1,
      far: side === 'far',
      children: [{ id: `foot-${side}`, part: 'foot', at: ATTACH.foot, rest: rest.foot, z: 1, far: side === 'far' }],
    },
  ],
});

const arm = (side: 'near' | 'far', at: readonly [number, number], z: number): JointSpec => ({
  id: `arm-${side}`,
  part: 'arm-upper',
  at,
  rest: side === 'near' ? -12 : 8,
  z,
  far: side === 'far',
  children: [
    {
      id: `forearm-${side}`,
      part: 'arm-fore',
      at: ATTACH.forearm,
      rest: side === 'near' ? -38 : -26,
      z: 1,
      far: side === 'far',
    },
  ],
});

/**
 * O esqueleto do vagalume, tudo pendurado no tórax, com o pivô no quadril.
 * Coordenadas nas unidades das peças vetoriais; o componente escala o
 * conjunto para a altura que o CSS pedir.
 *
 * A ordem de desenho entre filhos do tórax resolve a profundidade: asas e
 * membros do lado de lá atrás, lanterna no meio, membros de cá na frente.
 * As pernas em repouso foram acertadas para os dois pés tocarem o chão na
 * mesma altura.
 */
export const SKELETON: JointSpec = {
  id: 'body',
  part: 'thorax',
  at: [0, 0],
  rest: 14,
  z: 0,
  children: [
    { id: 'wing-upper', part: 'wing-upper', at: [-22, -108], rest: 16, z: -4 },
    { id: 'wing-lower', part: 'wing-lower', at: [-20, -96], rest: 2, z: -3 },
    arm('far', [2, -112], -2),
    leg('far', [-8, -2], -2, { thigh: 12, shin: 2, foot: -14 }),
    { id: 'abdomen', part: 'abdomen', at: [-14, -8], rest: 0, z: -1 },
    leg('near', [4, 0], 2, { thigh: -14, shin: 24, foot: -10 }),
    { id: 'head', part: 'head', at: [-2, -126], rest: -16, z: 3 },
    arm('near', [12, -110], 4),
  ],
};

/** A caixa que contém o vagalume em repouso, com folga para as asas. */
export const RIG_BOX = { x: -330, y: -540, width: 580, height: 760 } as const;

/**
 * Onde ficam os pés em repouso, em fração da caixa: o ponto que encosta
 * no chão quando o vagalume pousa num cenário. Calculado pela cinemática
 * da pose de repouso: o meio entre as duas solas.
 */
export const RIG_FEET = { x: 0.5, y: 0.987 } as const;

/** O mesmo ponto em unidades do esqueleto: o eixo do agachamento e do pouso. */
export const FEET_ORIGIN = `${RIG_FEET.x * RIG_BOX.width + RIG_BOX.x}px ${RIG_FEET.y * RIG_BOX.height + RIG_BOX.y}px`;
