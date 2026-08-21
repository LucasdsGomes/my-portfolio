'use client';

import type { PortfolioContent, Project } from '@/types/portfolio';
import { useRevealSelf } from '@/hooks/useRevealSelf';
import { StatusDot } from '@/components/ui/StatusDot';
import { Tag } from '@/components/ui/Tag';

interface ProjectCardProps {
  project: Project;
  content: PortfolioContent['projects'];
  onOpen: (project: Project) => void;
  /** stagger no grid: 60ms por posição */
  index: number;
}

const MAX_VISIBLE_TAGS = 5;

export function ProjectCard({ project, content, onOpen, index }: ProjectCardProps) {
  const ref = useRevealSelf<HTMLElement>(index * 60);
  const visible = project.stack.slice(0, MAX_VISIBLE_TAGS);
  const overflow = project.stack.length - visible.length;

  return (
    <article
      ref={ref}
      className={`reveal group relative flex flex-col rounded-panel border border-line bg-surface p-6 transition-colors focus-within:border-accent hover:border-accent ${
        project.featured ? 'lg:col-span-2' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-2xs tracking-[0.12em] text-accent uppercase">
          {content.categories[project.category]}
        </p>
        <StatusDot status={project.status} label={project.statusLabel} />
      </div>

      <h3
        className={`mt-5 font-display tracking-[0.01em] text-fg uppercase ${
          project.featured ? 'text-xl sm:text-2xl' : 'text-lg'
        }`}
      >
        {/* o botão se estica sobre o card inteiro — clique em qualquer ponto abre */}
        <button
          type="button"
          onClick={() => onOpen(project)}
          aria-label={`${project.title} — ${content.labels.openDetail}`}
          className="text-left after:absolute after:inset-0 after:rounded-panel after:content-['']"
        >
          {project.title}
        </button>
      </h3>

      {project.context ? (
        <p className="mt-2 font-mono text-2xs text-fg-muted">{project.context}</p>
      ) : null}

      <p className="mt-4 text-xs text-fg-muted">{project.problem}</p>

      <ul className="mt-6 flex flex-wrap gap-1.5">
        {visible.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
        {overflow > 0 ? <Tag>{`+${overflow}`}</Tag> : null}
      </ul>

      <p
        aria-hidden="true"
        className="mt-auto inline-flex items-center gap-2 pt-6 font-mono text-2xs text-fg-muted transition-colors group-hover:text-accent"
      >
        {content.labels.openDetail}
        <span>→</span>
      </p>
    </article>
  );
}
