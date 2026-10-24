import type { PortfolioContent } from '@/types/portfolio';
import { Bestiary } from '../bestiary/Bestiary';
import { RegionShell } from './RegionShell';

interface ProjectsRegionProps {
  content: PortfolioContent;
}

/** Galerias do Dado Bruto: a caverna das cascatas, onde fica o diário de criaturas. */
export function ProjectsRegion({ content }: ProjectsRegionProps) {
  const { game } = content;

  return (
    <RegionShell
      firefly={{ anchor: 'projetos', label: game.firefly.poke }}
      id="projetos"
      region={game.regions.projects}
      scene="03-cavernas-profundas"
      music="galerias"
      motes="160, 210, 255"
      lead={game.bestiary.lead}
    >
      <Bestiary content={content} />
    </RegionShell>
  );
}
