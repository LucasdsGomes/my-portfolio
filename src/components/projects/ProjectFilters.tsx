'use client';

import type { PortfolioContent, ProjectCategory } from '@/types/portfolio';

type Filter = ProjectCategory | 'all';

interface ProjectFiltersProps {
  content: PortfolioContent['projects'];
  categories: readonly ProjectCategory[];
  active: Filter;
  counts: Readonly<Record<Filter, number>>;
  onChange: (filter: Filter) => void;
}

export function ProjectFilters({
  content,
  categories,
  active,
  counts,
  onChange,
}: ProjectFiltersProps) {
  const options: readonly Filter[] = ['all', ...categories];

  return (
    <div role="group" aria-label={content.filterLabel} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option === active;
        const label = option === 'all' ? content.filterAll : content.categories[option];

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            className={`inline-flex min-h-11 items-center gap-2 rounded-panel border px-4 font-mono text-2xs tracking-[0.08em] uppercase transition-colors ${
              isActive
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-line text-fg-muted hover:border-fg-muted hover:text-fg'
            }`}
          >
            {label}
            <span className="tabular text-fg-muted">{counts[option]}</span>
          </button>
        );
      })}
    </div>
  );
}
