import type { Locale } from '@/types/portfolio';
import { getContent, SITE_URL, pathForLocale } from '@/content';

/** JSON-LD Person, compartilhado entre o jogo e a versão em texto. */
export function personJsonLd(locale: Locale) {
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
