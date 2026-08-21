import type { MetadataRoute } from 'next';
import { SITE_URL, pathForLocale } from '@/content';
import { LOCALES } from '@/types/portfolio';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return LOCALES.map((locale) => ({
    url: `${SITE_URL}${pathForLocale(locale)}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: locale === 'pt' ? 1 : 0.8,
    alternates: {
      languages: {
        'pt-BR': `${SITE_URL}${pathForLocale('pt')}`,
        en: `${SITE_URL}${pathForLocale('en')}`,
      },
    },
  }));
}
