import type { PortfolioContent } from '@/types/portfolio';
import { SectionShell } from '@/components/layout/SectionShell';

interface ContactProps {
  content: PortfolioContent;
}

export function Contact({ content }: ContactProps) {
  const { contact } = content;

  return (
    <SectionShell id="contato" eyebrow={contact.eyebrow} title={contact.title} lead={contact.lead}>
      <ul className="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
        {contact.links.map((link) => (
          <li key={link.label} className="reveal bg-surface" data-reveal-item>
            <a
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              className="group flex min-h-11 items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-surface-2"
            >
              <span>
                <span className="block font-mono text-2xs tracking-[0.14em] text-fg-muted uppercase">
                  {link.label}
                </span>
                <span className="mt-1.5 block text-xs text-fg transition-colors group-hover:text-accent">
                  {link.value}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-fg-muted transition-colors group-hover:text-accent"
              >
                {link.external ? '↗' : '→'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
