import type { PortfolioContent } from '@/types/portfolio';

interface FooterProps {
  content: PortfolioContent;
}

export function Footer({ content }: FooterProps) {
  const { contact, footer, hero } = content;
  // resolvido no build; o site é estático e refaz o build a cada deploy
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-line">
      <div className="mx-auto flex w-full max-w-shell flex-col gap-6 px-[var(--gutter)] py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="tabular font-mono text-2xs text-fg-muted">
          {hero.name} · {year} · {footer.rights}
        </p>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {contact.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                className="inline-flex min-h-11 items-center font-mono text-2xs text-fg-muted transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto w-full max-w-shell px-[var(--gutter)] py-4 font-mono text-2xs text-fg-muted">
          {footer.builtWith}
        </p>
      </div>
    </footer>
  );
}
