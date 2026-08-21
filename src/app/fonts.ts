import { Saira, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';

/** Display: condensada, técnica. Títulos em caixa alta. */
export const saira = Saira({
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
  variable: '--font-saira',
});

/** Corpo: legibilidade acima de estilo. */
export const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-plex',
});

/** Utilitária: eyebrows, tags, leituras numéricas, chrome do header. */
export const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-jetbrains',
});

export const fontVariables = `${saira.variable} ${plexSans.variable} ${jetbrains.variable}`;
