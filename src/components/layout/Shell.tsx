import type { ReactNode } from 'react';
import type { Locale } from '@/types/portfolio';
import { getContent, alternateLocale, textPathForLocale, HTML_LANG } from '@/content';
import { fontVariables } from '@/app/fonts';
import { personJsonLd } from '@/app/jsonld';
import { CursorReticle } from './CursorReticle';
import { ScrollSpine } from './ScrollSpine';
import { Header } from './Header';
import { Footer } from './Footer';

interface ShellProps {
  locale: Locale;
  children: ReactNode;
}

export function Shell({ locale, children }: ShellProps) {
  const content = getContent(locale);
  const other = alternateLocale(locale);

  return (
    <html lang={HTML_LANG[locale]} className={fontVariables}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-panel focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-2xs focus:text-bg"
        >
          {content.nav.skipToContent}
        </a>

        <Header
          content={content}
          alternateHref={textPathForLocale(other)}
          alternateLang={HTML_LANG[other]}
        />

        <ScrollSpine items={content.nav.items} />

        <main id="conteudo">{children}</main>

        <Footer content={content} />

        <CursorReticle />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
        />
      </body>
    </html>
  );
}
