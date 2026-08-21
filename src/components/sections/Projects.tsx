'use client';

import { useCallback, useMemo, useState } from 'react';
import type { PortfolioContent, Project, ProjectCategory } from '@/types/portfolio';
import { SectionShell } from '@/components/layout/SectionShell';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { ProjectDialog } from '@/components/projects/ProjectDialog';

type Filter = ProjectCategory | 'all';

const CATEGORY_ORDER: readonly ProjectCategory[] = [
  'ia-agentes',
  'dados-iot',
  'automacao',
  'dashboards',
  'estudos',
];

interface ProjectsProps {
  content: PortfolioContent;
}

export function Projects({ content }: ProjectsProps) {
  const { projects } = content;
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<Project | null>(null);
  // estável: o efeito do dialog depende dela e não pode re-rodar a cada render
  const closeDialog = useCallback(() => setOpen(null), []);

  const counts = useMemo(() => {
    const base = { all: projects.items.length } as Record<Filter, number>;
    for (const category of CATEGORY_ORDER) {
      base[category] = projects.items.filter((item) => item.category === category).length;
    }
    return base;
  }, [projects.items]);

  const visible = useMemo(
    () =>
      filter === 'all'
        ? projects.items
        : projects.items.filter((item) => item.category === filter),
    [filter, projects.items],
  );

  return (
    <SectionShell
      id="projetos"
      eyebrow={projects.eyebrow}
      title={projects.title}
      lead={projects.lead}
    >
      <div className="reveal" data-reveal-item>
        <ProjectFilters
          content={projects}
          categories={CATEGORY_ORDER}
          active={filter}
          counts={counts}
          onChange={setFilter}
        />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            content={projects}
            onOpen={setOpen}
            index={index}
          />
        ))}
      </div>

      <ProjectDialog project={open} content={projects} onClose={closeDialog} />
    </SectionShell>
  );
}
