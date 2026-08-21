import type { PortfolioContent } from '@/types/portfolio';
import { SectionShell } from '@/components/layout/SectionShell';

interface CurrentFocusProps {
  content: PortfolioContent;
}

export function CurrentFocus({ content }: CurrentFocusProps) {
  const { focus } = content;

  return (
    <SectionShell id="foco" eyebrow={focus.eyebrow} title={focus.title} lead={focus.lead}>
      <div className="grid gap-4 lg:grid-cols-2">
        {focus.tracks.map((track) => (
          <article
            key={track.label}
            className="reveal rounded-panel border border-line bg-surface p-6"
            data-reveal-item
          >
            <p className="font-mono text-2xs tracking-[0.16em] text-accent-warm">{track.label}</p>
            <h3 className="mt-4 font-display text-lg tracking-[0.01em] uppercase">{track.title}</h3>
            <p className="mt-4 text-fg-muted">{track.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
