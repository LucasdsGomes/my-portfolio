import { Cinzel, EB_Garamond } from 'next/font/google';

/** Títulos: capitais lapidares, de inscrição em pedra. */
export const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
  variable: '--font-cinzel',
});

/** Corpo e diálogo: serifa de livro antigo, legível em tamanho de leitura. */
export const garamond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-garamond',
});

export const gameFontVariables = `${cinzel.variable} ${garamond.variable}`;
