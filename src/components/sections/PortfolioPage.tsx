import type { Locale } from '@/types/portfolio';
import { getContent } from '@/content';
import { Hero } from '@/components/hero/Hero';
import { About } from './About';
import { CurrentFocus } from './CurrentFocus';
import { Projects } from './Projects';
import { Stack } from './Stack';
import { Timeline } from './Timeline';
import { Contact } from './Contact';

interface PortfolioPageProps {
  locale: Locale;
}

export function PortfolioPage({ locale }: PortfolioPageProps) {
  const content = getContent(locale);

  return (
    <>
      <Hero content={content} />
      <About content={content} />
      <CurrentFocus content={content} />
      <Projects content={content} />
      <Stack content={content} />
      <Timeline content={content} />
      <Contact content={content} />
    </>
  );
}
