import type { Locale, PortfolioContent } from '@/types/portfolio';
import { pt } from './portfolio.pt';
import { en } from './portfolio.en';

/**
 * Ambos os idiomas obedecem ao mesmo tipo. Se um projeto existir em um
 * idioma e faltar no outro, o build quebra antes de chegar na Vercel.
 */
const content: Record<Locale, PortfolioContent> = { pt, en };

export function getContent(locale: Locale): PortfolioContent {
  return content[locale];
}

/**
 * URL canônica do site. Não há domínio hard-coded aqui de propósito:
 * defina NEXT_PUBLIC_SITE_URL na Vercel com o domínio de produção.
 * Sem ele, cai na URL do deploy, que serve mas não é canônica.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return 'http://localhost:3000';
}

export const SITE_URL = resolveSiteUrl();

export function pathForLocale(locale: Locale): string {
  return locale === 'pt' ? '/' : '/en';
}

export function alternateLocale(locale: Locale): Locale {
  return locale === 'pt' ? 'en' : 'pt';
}

export { pt, en };
