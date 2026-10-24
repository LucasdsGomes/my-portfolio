import type { Locale } from '@/types/portfolio';
import { getContent } from '@/content';
import { TitleScreen } from './TitleScreen';
import { Descent } from './Descent';
import { Hud } from './Hud';
import { ProfileRegion } from './regions/ProfileRegion';
import { FocusRegion } from './regions/FocusRegion';
import { ProjectsRegion } from './regions/ProjectsRegion';
import { StackRegion } from './regions/StackRegion';
import { PathRegion } from './regions/PathRegion';
import { ContactRegion } from './regions/ContactRegion';
import { JourneyDirector } from './journey/JourneyDirector';
import { SpaceNavigator } from './journey/SpaceNavigator';
import { SoundControl } from './audio/SoundControl';

interface GamePageProps {
  locale: Locale;
}

/**
 * A jornada, de cima para baixo: título, descida e as seis regiões, do
 * perfil ao contato. Todo o conteúdo da versão em texto está aqui também,
 * em forma de jogo.
 */
export function GamePage({ locale }: GamePageProps) {
  const content = getContent(locale);

  return (
    <>
      <TitleScreen content={content} locale={locale} />
      <Descent />
      <ProfileRegion content={content} />
      <FocusRegion content={content} />
      <ProjectsRegion content={content} />
      <StackRegion content={content} />
      <PathRegion content={content} />
      <ContactRegion content={content} locale={locale} />

      <Hud content={content} locale={locale} />
      <SoundControl labels={content.game.sound} />
      <SpaceNavigator labels={content.game.space} />
      <JourneyDirector from="title" to="perfil" sectionId="perfil" skipLabel={content.game.skipScene} />
    </>
  );
}
