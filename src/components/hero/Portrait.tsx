import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Image from 'next/image';

const PORTRAIT_FILE = 'portrait.jpg';

/**
 * O retrato só entra se o arquivo existir em /public. Sem ele, o hero
 * degrada para uma coluna só — sem moldura vazia e sem placeholder.
 * Basta soltar public/portrait.jpg para a coluna aparecer.
 */
export function hasPortrait(): boolean {
  return existsSync(join(process.cwd(), 'public', PORTRAIT_FILE));
}

interface PortraitProps {
  alt: string;
}

export function Portrait({ alt }: PortraitProps) {
  return (
    <figure className="relative">
      <div className="relative aspect-3/4 overflow-hidden rounded-panel border border-line bg-surface">
        <Image
          src={`/${PORTRAIT_FILE}`}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1023px) 60vw, 380px"
          className="object-cover object-top grayscale-[0.35] contrast-105"
        />
        {/* leitura de enquadramento — cantos de instrumento, não decoração */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 border border-fg/10"
        />
      </div>
    </figure>
  );
}
