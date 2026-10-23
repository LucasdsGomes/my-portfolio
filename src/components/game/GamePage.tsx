import type { Locale } from '@/types/portfolio';
import { getContent, textPathForLocale } from '@/content';
import { TitleScreen } from './TitleScreen';
import { Descent } from './Descent';
import { Hud } from './Hud';
import { ProfileRegion } from './regions/ProfileRegion';
import { JourneyDirector } from './journey/JourneyDirector';
import { SoundControl } from './audio/SoundControl';

interface GamePageProps {
  locale: Locale;
}

/**
 * A jornada, de cima para baixo: título, descida e as regiões. Protótipo:
 * por enquanto só a primeira região existe, e o resto do conteúdo segue
 * inteiro na versão em texto.
 */
export function GamePage({ locale }: GamePageProps) {
  const content = getContent(locale);
  const continueLabel = locale === 'pt' ? 'Continuar na versão em texto' : 'Continue in the text version';

  return (
    <>
      <TitleScreen content={content} locale={locale} />
      <Descent />
      <ProfileRegion content={content} />

      <div className="relative bg-abyss py-20 text-center">
        <a
          href={`${textPathForLocale(locale)}#foco`}
          className="inline-flex min-h-11 items-center font-title text-sm tracking-[0.26em] text-bone-muted uppercase hover:text-glow"
        >
          {continueLabel} →
        </a>
      </div>

      <Hud content={content} locale={locale} />
      <SoundControl labels={content.game.sound} />
      <JourneyDirector from="title" to="perfil" sectionId="perfil" skipLabel={content.game.skipScene} />
    </>
  );
}
