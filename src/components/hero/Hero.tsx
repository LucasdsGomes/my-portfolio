import type { PortfolioContent } from '@/types/portfolio';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { InstrumentCluster } from './InstrumentCluster';
import { Portrait, hasPortrait } from './Portrait';

interface HeroProps {
  content: PortfolioContent;
}

export function Hero({ content }: HeroProps) {
  const { hero } = content;
  const showPortrait = hasPortrait();

  return (
    <section
      id="topo"
      aria-labelledby="hero-title"
      className="relative z-10 pt-28 pb-[var(--section-gap)] sm:pt-36"
    >
      <div className="mx-auto w-full max-w-shell px-[var(--gutter)]">
        <div
          className={`grid items-start gap-10 ${
            showPortrait ? 'lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16' : ''
          }`}
        >
          <div className="max-w-3xl">
            <Eyebrow>{hero.eyebrow}</Eyebrow>

            <h1
              id="hero-title"
              className="mt-6 font-display text-2xl tracking-[0.01em] text-balance uppercase sm:text-3xl"
            >
              {hero.headline}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
              {hero.subheadline}
            </p>

            <dl className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-2xs">
              <div className="flex items-center gap-2">
                <dt className="sr-only">Status</dt>
                <span aria-hidden="true" className="size-1.5 rounded-full bg-ok" />
                <dd className="text-fg">{hero.availability}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">Local</dt>
                <dd className="text-fg-muted">{hero.location}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">Cargo</dt>
                <dd className="text-fg-muted">{hero.role}</dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#projetos"
                className="inline-flex min-h-11 items-center rounded-panel bg-accent px-5 font-mono text-xs font-medium text-bg transition-colors hover:bg-accent/85"
              >
                {hero.ctaPrimary}
              </a>
              <a
                href="#contato"
                className="inline-flex min-h-11 items-center rounded-panel border border-line px-5 font-mono text-xs text-fg transition-colors hover:border-accent hover:text-accent"
              >
                {hero.ctaSecondary}
              </a>
            </div>
          </div>

          {showPortrait ? <Portrait alt={hero.portraitAlt} /> : null}
        </div>

        <div className="mt-16">
          <InstrumentCluster gauges={hero.gauges} />
        </div>
      </div>
    </section>
  );
}
