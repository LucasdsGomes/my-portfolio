import { ART } from '../art/assets.generated';

type PartName = keyof typeof ART.parts;

export interface JointSpec {
  /** nome da junta; é o que as poses e as animações endereçam */
  id: string;
  part: PartName;
  /** ponto da peça (em px da imagem original) em torno do qual ela gira */
  pivot: readonly [number, number];
  /** onde o pivô fica, nas coordenadas da peça-mãe */
  at: readonly [number, number];
  /** rotação de repouso, em graus */
  rest: number;
  /** ordem de desenho entre irmãos */
  z: number;
  /** a peça veio desenhada para o lado oposto */
  flip?: boolean;
  /** membro do lado de lá: mais escuro, para dar profundidade */
  far?: boolean;
  children?: readonly JointSpec[];
}

const leg = (side: 'near' | 'far', at: readonly [number, number], z: number): JointSpec => ({
  id: `thigh-${side}`,
  part: 'leg-thigh-c',
  pivot: [20, 15],
  at,
  rest: side === 'near' ? -34 : 40,
  z,
  far: side === 'far',
  children: [
    {
      id: `shin-${side}`,
      part: 'leg-shin-c',
      pivot: [88, 14],
      at: [88, 165],
      rest: side === 'near' ? 52 : -2,
      z: 1,
      far: side === 'far',
      children: [
        {
          id: `foot-${side}`,
          part: 'leg-foot-c',
          pivot: [18, 12],
          at: [18, 125],
          rest: side === 'near' ? -22 : 4,
          z: 1,
          far: side === 'far',
        },
      ],
    },
  ],
});

const arm = (side: 'near' | 'far', at: readonly [number, number], z: number): JointSpec => ({
  id: `arm-${side}`,
  part: 'arm-upper-c',
  pivot: [22, 18],
  at,
  rest: side === 'near' ? -12 : 8,
  z,
  far: side === 'far',
  children: [
    {
      id: `forearm-${side}`,
      part: 'arm-fore-c',
      pivot: [14, 12],
      at: [72, 128],
      rest: side === 'near' ? -38 : -26,
      z: 1,
      far: side === 'far',
    },
  ],
});

/**
 * O esqueleto do vagalume, tudo pendurado no tórax. Coordenadas em pixels
 * das peças recortadas da folha partes.png; o componente escala o conjunto.
 *
 * A ordem de desenho entre filhos do tórax resolve a profundidade: asas e
 * membros do lado de lá atrás, abdômen no meio, membros de cá na frente.
 */
export const SKELETON: JointSpec = {
  id: 'body',
  part: 'thorax',
  pivot: [70, 185],
  at: [0, 0],
  rest: 14,
  z: 0,
  children: [
    {
      id: 'wing-upper',
      part: 'wing-upper',
      pivot: [442, 60],
      flip: true,
      at: [30, 64],
      rest: 16,
      z: -4,
    },
    {
      id: 'wing-lower',
      part: 'wing-lower',
      pivot: [299, 16],
      flip: true,
      at: [36, 80],
      rest: 2,
      z: -3,
    },
    arm('far', [80, 54], -2),
    leg('far', [60, 180], -2),
    {
      id: 'abdomen',
      part: 'abdomen',
      pivot: [180, 20],
      at: [44, 168],
      rest: 0,
      z: -1,
    },
    leg('near', [76, 184], 2),
    {
      id: 'head',
      part: 'head',
      pivot: [72, 272],
      at: [63, 16],
      rest: -16,
      z: 3,
    },
    arm('near', [94, 60], 4),
  ],
};

/** Tamanho da caixa que contém o vagalume em repouso, em px das peças. */
export const RIG_BOX = { x: -520, y: -480, width: 900, height: 920 } as const;

/**
 * Onde ficam os pés em repouso, em fração da caixa: o ponto que encosta
 * no chão quando o vagalume pousa num cenário. Medido no browser com os
 * dois pés alinhados, não estimado.
 */
export const RIG_FEET = { x: 0.472, y: 0.861 } as const;

/** O mesmo ponto em px do esqueleto: o eixo do agachamento e do pouso. */
export const FEET_ORIGIN = `${RIG_FEET.x * RIG_BOX.width + RIG_BOX.x}px ${RIG_FEET.y * RIG_BOX.height + RIG_BOX.y}px`;
