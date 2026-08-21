import type { ReactNode } from 'react';
import type { Locale } from '@/types/portfolio';
import { getContent, SITE_URL, alternateLocale, pathForLocale } from '@/content';
import { fontVariables } from '@/app/fonts';
import { Header } from './Header';
import { Footer } from './Footer';

interface ShellProps {
  locale: Locale;
  children: ReactNode;
}

const HTML_LANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };

function personJsonLd(locale: Locale) {
  const content = getContent(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: content.hero.name,
    jobTitle: content.hero.role,
    description: content.meta.description,
    url: `${SITE_URL}${pathForLocale(locale)}`,
    email: 'mailto:lucasdsgomes04@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Curitiba',
      addressRegion: 'PR',
      addressCountry: 'BR',
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: content.about.education.degree,
    },
    knowsAbout: content.meta.keywords,
    sameAs: content.contact.links.filter((link) => link.external).map((link) => link.href),
  };
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
          alternateHref={pathForLocale(other)}
          alternateLang={HTML_LANG[other]}
        />

        <main id="conteudo">{children}</main>

        <Footer content={content} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
        />
      </body>
    </html>
  );
}
