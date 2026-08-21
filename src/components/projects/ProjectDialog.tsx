'use client';

import { useEffect, useRef } from 'react';
import type { PortfolioContent, Project } from '@/types/portfolio';
import { StatusDot } from '@/components/ui/StatusDot';
import { Tag } from '@/components/ui/Tag';

interface ProjectDialogProps {
  project: Project | null;
  content: PortfolioContent['projects'];
  onClose: () => void;
}

/**
 * <dialog> nativo: o browser já entrega focus trap, Escape e inertização
 * do resto da página. Nenhuma biblioteca de modal envolvida.
 */
export function ProjectDialog({ project, content, onClose }: ProjectDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !project) return;

    // o dialog é desmontado ao fechar, então a devolução de foco é nossa
    if (!dialog.open) {
      opener.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    }
    document.body.style.overflow = 'hidden';

    // `close` não borbulha, então o onClose do React não chega aqui:
    // sem este listener nativo, Escape fecharia o elemento e deixaria
    // o estado do React aberto — página travada com o scroll bloqueado.
    dialog.addEventListener('close', onClose);

    return () => {
      dialog.removeEventListener('close', onClose);
      document.body.style.overflow = '';
      opener.current?.focus();
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <dialog
      ref={ref}
      onKeyDown={(event) => {
        // keydown borbulha e é o único caminho de Escape em que dá para
        // confiar: `close` e `cancel` não borbulham e nem todo browser
        // os entrega de forma previsível.
        if (event.key === 'Escape') onClose();
      }}
      onClick={(event) => {
        // clique no backdrop fecha; clique no conteúdo não
        if (event.target === ref.current) onClose();
      }}
      aria-labelledby="project-dialog-title"
      className="m-auto w-[min(46rem,calc(100vw-2rem))] rounded-panel border border-line bg-surface p-0 text-fg backdrop:bg-bg/80 backdrop:backdrop-blur-xs"
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
        <p className="font-mono text-2xs tracking-[0.12em] text-accent uppercase">
          {content.categories[project.category]}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="-my-2 -mr-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-panel font-mono text-2xs text-fg-muted transition-colors hover:text-accent"
        >
          <span className="sr-only">{content.labels.closeDetail}</span>
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
        <h2
          id="project-dialog-title"
          className="font-display text-xl tracking-[0.01em] uppercase"
        >
          {project.title}
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <StatusDot status={project.status} label={project.statusLabel} />
          {project.context ? (
            <span className="font-mono text-2xs text-fg-muted">{project.context}</span>
          ) : null}
        </div>

        <dl className="mt-8 space-y-6">
          <div>
            <dt className="font-mono text-2xs tracking-[0.12em] text-accent-warm uppercase">
              {content.labels.problem}
            </dt>
            <dd className="mt-2 text-fg-muted">{project.problem}</dd>
          </div>

          <div>
            <dt className="font-mono text-2xs tracking-[0.12em] text-accent-warm uppercase">
              {content.labels.built}
            </dt>
            <dd className="mt-2 text-fg-muted">{project.built}</dd>
          </div>

          <div>
            <dt className="font-mono text-2xs tracking-[0.12em] text-accent-warm uppercase">
              {content.labels.stack}
            </dt>
            <dd>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {project.stack.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        {project.note ? (
          <p className="mt-8 border-l-2 border-accent-warm/50 pl-4 text-xs text-fg-muted italic">
            {project.note}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-11 items-center rounded-panel border border-line px-4 font-mono text-2xs text-fg transition-colors hover:border-accent hover:text-accent"
            >
              {content.labels.repo}
              <span aria-hidden="true" className="ml-2">
                ↗
              </span>
            </a>
          ) : null}
          <p className="max-w-sm text-2xs text-fg-muted">{content.labels.confidential}</p>
        </div>
      </div>
    </dialog>
  );
}
