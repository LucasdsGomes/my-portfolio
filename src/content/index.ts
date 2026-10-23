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

/** O jogo é a página principal de cada idioma. */
export function pathForLocale(locale: Locale): string {
  return locale === 'pt' ? '/' : '/en';
}

/**
 * A versão em texto: mesmo conteúdo, sem jogo. É o caminho para quem não
 * quer ou não pode jogar, e o que garante que nada fica preso atrás da
 * experiência.
 */
export function textPathForLocale(locale: Locale): string {
  return locale === 'pt' ? '/texto' : '/en/texto';
}

export const HTML_LANG: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };

export function alternateLocale(locale: Locale): Locale {
  return locale === 'pt' ? 'en' : 'pt';
}

export { pt, en };
