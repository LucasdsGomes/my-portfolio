import type { PortfolioContent } from '@/types/portfolio';
import { SectionShell } from '@/components/layout/SectionShell';

interface TimelineProps {
  content: PortfolioContent;
}

export function Timeline({ content }: TimelineProps) {
  const { timeline } = content;

  return (
    <SectionShell
      id="trajetoria"
      eyebrow={timeline.eyebrow}
      title={timeline.title}
      lead={timeline.lead}
    >
      <ol className="grid gap-px overflow-hidden rounded-panel border border-line bg-line lg:grid-cols-3">
        {timeline.phases.map((phase) => (
          <li key={phase.index} className="reveal bg-surface p-6" data-reveal-item>
            <div className="flex items-baseline gap-3">
              <span className="tabular font-mono text-lg text-accent-warm">{phase.index}</span>
              <h3 className="font-display text-lg tracking-[0.01em] uppercase">{phase.title}</h3>
            </div>

            <p className="mt-4 text-xs text-fg-muted">{phase.description}</p>

            <ul className="mt-5 space-y-1.5">
              {phase.markers.map((marker) => (
                <li key={marker} className="flex items-center gap-2 font-mono text-2xs text-fg-muted">
                  <span aria-hidden="true" className="h-px w-3 bg-accent/60" />
                  {marker}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
