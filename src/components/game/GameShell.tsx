import type { ReactNode } from 'react';
import type { Locale } from '@/types/portfolio';
import { getContent, HTML_LANG } from '@/content';
import { gameFontVariables } from '@/app/game-fonts';
import { personJsonLd } from '@/app/jsonld';

interface GameShellProps {
  locale: Locale;
  children: ReactNode;
}

/**
 * Casca HTML do jogo. O script do topo do body marca a página como "com JS"
 * antes do primeiro quadro: só então os elementos que se revelam ficam
 * escondidos esperando a vez. Sem JS, tudo aparece de saída.
 */
export function GameShell({ locale, children }: GameShellProps) {
  const content = getContent(locale);

  return (
    <html lang={HTML_LANG[locale]} className={gameFontVariables} suppressHydrationWarning>
      <body>
        {/* primeiro filho do body: roda antes de qualquer conteúdo ser pintado */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a
          href="#perfil"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:bg-glow focus:px-4 focus:py-2 focus:font-title focus:text-sm focus:text-abyss"
        >
          {content.game.skipToJourney}
        </a>

        <main>{children}</main>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale)) }}
        />
      </body>
    </html>
  );
}
