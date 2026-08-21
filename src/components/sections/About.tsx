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

          <details
            className="reveal group rounded-panel border border-line bg-surface"
            data-reveal-item
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <span className="font-mono text-2xs tracking-[0.14em] text-accent lowercase">
                {about.credentials.eyebrow}
              </span>
              <span className="flex items-center gap-2 font-mono text-2xs">
                <span className="tabular text-accent-warm">
                  {String(about.credentials.items.length).padStart(2, '0')}
                </span>
                <span className="text-fg-muted">{about.credentials.issuer}</span>
                {/* o <summary> já anuncia aberto/fechado; isto é o sinal visual */}
                <span
                  aria-hidden="true"
                  className="w-3 text-center text-fg-muted transition-colors group-open:text-accent"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </span>
            </summary>

            <div className="border-t border-line px-5 py-4">
              <p className="text-2xs text-fg-muted">{about.credentials.summary}</p>

              <ul className="mt-4 space-y-2">
                {about.credentials.items.map((credential) => (
                  <li key={credential} className="flex items-start gap-2.5 text-2xs text-fg">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-px w-2.5 shrink-0 bg-accent/60"
                    />
                    {credential}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </div>
    </SectionShell>
  );
}
