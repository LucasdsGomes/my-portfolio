'use client';

import type { ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { Eyebrow } from '@/components/ui/Eyebrow';

interface SectionShellProps {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children: ReactNode;
  /** o hero cuida do próprio espaçamento */
  flush?: boolean;
}

export function SectionShell({ id, eyebrow, title, lead, children, flush = false }: SectionShellProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative z-10 ${flush ? '' : 'py-[var(--section-gap)]'}`}
    >
      <div className="mx-auto w-full max-w-shell px-[var(--gutter)]">
        <header className="max-w-2xl">
          <div className="reveal" data-reveal-item>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <h2
            id={`${id}-title`}
            className="reveal fill-in mt-3 font-display text-xl tracking-[0.02em] uppercase sm:text-2xl"
            data-reveal-item
          >
            {title}
          </h2>
          {lead ? (
            <p className="reveal mt-4 text-fg-muted" data-reveal-item>
              {lead}
            </p>
          ) : null}
        </header>

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
