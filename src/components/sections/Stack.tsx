import type { PortfolioContent } from '@/types/portfolio';
import { SectionShell } from '@/components/layout/SectionShell';
import { Tag } from '@/components/ui/Tag';

interface StackProps {
  content: PortfolioContent;
}

export function Stack({ content }: StackProps) {
  const { stack } = content;
  const core = new Set(stack.core);

  return (
    <SectionShell id="stack" eyebrow={stack.eyebrow} title={stack.title} lead={stack.lead}>
      {/* legenda do destaque em âmbar — sem ela o realce fica sem significado */}
      <p
        className="reveal inline-flex items-center gap-2 font-mono text-2xs text-fg-muted"
        data-reveal-item
      >
        <span
          aria-hidden="true"
          className="size-2 rounded-full border border-accent-warm/40 bg-accent-warm/60"
        />
        {stack.coreLabel}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stack.groups.map((group) => (
          <section
            key={group.label}
            className="reveal rounded-panel border border-line bg-surface p-5"
            data-reveal-item
          >
            <h3 className="font-mono text-2xs tracking-[0.12em] text-fg-muted uppercase">
              {group.label}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Tag key={item} emphasis={core.has(item)}>
                  {item}
                </Tag>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </SectionShell>
  );
}
