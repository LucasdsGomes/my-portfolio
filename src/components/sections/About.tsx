import type { PortfolioContent } from '@/types/portfolio';
import { SectionShell } from '@/components/layout/SectionShell';

interface AboutProps {
  content: PortfolioContent;
}

export function About({ content }: AboutProps) {
  const { about } = content;

  return (
    <SectionShell id="perfil" eyebrow={about.eyebrow} title={about.title}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
        <div className="space-y-5">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="reveal text-fg-muted" data-reveal-item>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="space-y-4">
          {/* bloco de dados objetivos: leitura, não prosa */}
          <dl
            className="reveal divide-y divide-line rounded-panel border border-line bg-surface"
            data-reveal-item
          >
            {about.facts.map((fact) => (
              <div key={fact.label} className="px-5 py-4">
                <dt className="font-mono text-2xs tracking-[0.14em] text-fg-muted">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-xs text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div
            className="reveal rounded-panel border border-line bg-surface px-5 py-4"
            data-reveal-item
          >
            <p className="font-mono text-2xs tracking-[0.14em] text-accent lowercase">
              {about.education.eyebrow}
            </p>
            <p className="mt-3 text-xs text-fg">{about.education.degree}</p>
            <p className="tabular mt-1.5 font-mono text-2xs text-fg-muted">
              {about.education.period} · {about.education.status}
            </p>
          </div>

          <div
            className="reveal rounded-panel border border-line bg-surface px-5 py-4"
            data-reveal-item
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-2xs tracking-[0.14em] text-accent lowercase">
                {about.credentials.eyebrow}
              </p>
              <p className="tabular font-mono text-2xs text-accent-warm">
                {String(about.credentials.count).padStart(2, '0')}
                <span className="ml-1.5 text-fg-muted">{about.credentials.issuer}</span>
              </p>
            </div>
            <p className="mt-3 text-2xs text-fg-muted">{about.credentials.summary}</p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
