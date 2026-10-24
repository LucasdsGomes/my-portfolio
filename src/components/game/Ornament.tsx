import type { CSSProperties } from 'react';

interface OrnamentProps {
  className?: string;
  /** espelha verticalmente, para usar como fecho embaixo de um título */
  flip?: boolean;
  style?: CSSProperties;
}

/**
 * O traço que emoldura títulos e caixas: uma linha que afina nas pontas,
 * um losango no centro com uma gota de luz e dois arcos que lembram asas.
 * Desenho próprio, para não emprestar o ornamento de jogo nenhum.
 */
export function Ornament({ className = '', flip = false, style }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 400 28"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={flip ? { ...style, scale: '1 -1' } : style}
    >
      {/* linha que afina até sumir nas pontas: um losango achatado */}
      <path d="M0 14 L200 12.9 L400 14 L200 15.1 Z" fill="#e6dccf" opacity="0.8" />
      {/* arcos-asa saindo do losango */}
      <g fill="none" stroke="#e6dccf" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
        <path d="M184 14 C 172 4, 156 4, 146 10" />
        <path d="M216 14 C 228 4, 244 4, 254 10" />
        <path d="M184 14 C 174 22, 162 22, 154 18" />
        <path d="M216 14 C 226 22, 238 22, 246 18" />
      </g>
      <path d="M200 3 L 211 14 L 200 25 L 189 14 Z" fill="none" stroke="#e6dccf" strokeWidth="1.3" />
      <circle cx="200" cy="14" r="3.2" fill="#fdd05f" />
    </svg>
  );
}
