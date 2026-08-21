import type { Metadata } from 'next';
import type { Locale } from '@/types/portfolio';
import { getContent, SITE_URL, pathForLocale } from '@/content';

const OG_LOCALE: Record<Locale, string> = { pt: 'pt_BR', en: 'en_US' };
const HREFLANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };

/** Metadata idêntica em forma para os dois idiomas; só o conteúdo muda. */
export function buildMetadata(locale: Locale): Metadata {
  const content = getContent(locale);
  const path = pathForLocale(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: content.meta.title,
    description: content.meta.description,
    keywords: [...content.meta.keywords],
    authors: [{ name: content.hero.name, url: SITE_URL }],
    creator: content.hero.name,
    alternates: {
      canonical: path,
      languages: {
        [HREFLANG.pt]: pathForLocale('pt'),
        [HREFLANG.en]: pathForLocale('en'),
        'x-default': pathForLocale('pt'),
      },
    },
    openGraph: {
      type: 'profile',
      siteName: content.hero.name,
      title: content.meta.title,
      description: content.meta.description,
      url: `${SITE_URL}${path}`,
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.meta.title,
      description: content.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  };
}
