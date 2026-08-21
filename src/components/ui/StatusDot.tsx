import type { ProjectStatus } from '@/types/portfolio';

interface StatusDotProps {
  status: ProjectStatus;
  label: string;
}

/**
 * Vocabulário de estado emprestado do painel: verde = saudável e rodando,
 * âmbar = em movimento, cinza = concluído e parado.
 */
const TONE: Record<ProjectStatus, string> = {
  producao: 'bg-ok',
  evolucao: 'bg-accent-warm',
  andamento: 'bg-accent',
  entregue: 'bg-fg-muted',
};

export function StatusDot({ status, label }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-2xs text-fg-muted">
      <span aria-hidden="true" className={`size-1.5 rounded-full ${TONE[status]}`} />
      {label}
    </span>
  );
}
