import type { ElementType, ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  as?: ElementType;
  /** elevado = fundo mais claro, para painel dentro de painel */
  elevated?: boolean;
  className?: string;
}

/**
 * A unidade de layout da página: retângulo quase reto, hairline de 1px.
 * Instrumento, não card de app.
 */
export function Panel({ children, as: Tag = 'div', elevated = false, className = '' }: PanelProps) {
  return (
    <Tag
      className={`rounded-panel border border-line ${
        elevated ? 'bg-surface-2' : 'bg-surface'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
