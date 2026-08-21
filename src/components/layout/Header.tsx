'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { PortfolioContent } from '@/types/portfolio';
import { useActiveSection } from '@/hooks/useActiveSection';
import { SignalBar } from './SignalBar';

interface HeaderProps {
  content: PortfolioContent;
  alternateHref: string;
  alternateLang: string;
}

export function Header({ content, alternateHref, alternateLang }: HeaderProps) {
  const { nav, hero } = content;
  const [menuOpen, setMenuOpen] = useState(false);

  const ids = useMemo(() => nav.items.map((item) => item.href.slice(1)), [nav.items]);
  const active = useActiveSection(ids);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/92 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-shell items-center justify-between gap-6 px-[var(--gutter)]">
        <a
          href="#topo"
          className="inline-flex min-h-11 items-center font-mono text-xs tracking-[0.16em] text-fg uppercase"
          aria-label={hero.name}
        >
          LG<span className="text-accent">.</span>
        </a>

        <nav aria-label={nav.label} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.items.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={`inline-flex min-h-11 items-center rounded-panel px-3 font-mono text-2xs tracking-[0.1em] uppercase transition-colors ${
                      isActive ? 'text-accent' : 'text-fg-muted hover:text-fg'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={alternateHref}
            hrefLang={alternateLang}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-panel border border-line px-3 font-mono text-2xs text-fg-muted transition-colors hover:border-accent hover:text-accent"
          >
            {nav.languageToggle}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-panel border border-line font-mono text-2xs text-fg-muted transition-colors hover:border-accent hover:text-accent lg:hidden"
          >
            <span className="sr-only">{menuOpen ? nav.menuClose : nav.menuOpen}</span>
            <span aria-hidden="true" className="flex w-4 flex-col gap-1">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      <SignalBar />

      <div
        id="menu-mobile"
        hidden={!menuOpen}
        className="border-t border-line bg-surface lg:hidden"
      >
        <ul className="mx-auto w-full max-w-shell px-[var(--gutter)] py-2">
          {nav.items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center border-b border-line/60 font-mono text-xs tracking-[0.1em] text-fg-muted uppercase last:border-b-0 hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
