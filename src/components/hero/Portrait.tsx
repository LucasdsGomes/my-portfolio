import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Image from 'next/image';

const PORTRAIT_FILE = 'portrait.jpg';

/** Dimensões reais do arquivo em /public. */
const SOURCE = { width: 1284, height: 2282 };

/**
 * Janela de recorte em pixels da imagem original: cabeça, ombros e braços.
 * O arquivo é um retrato de corpo inteiro em fundo claro; enquadrar aqui
 * corta a maior parte do fundo, que de outro modo viraria um bloco branco
 * no meio de uma página grafite.
 *
 * Para reenquadrar, mexa só nestes quatro números.
 */
const CROP = { x: 300, y: 400, width: 640, height: 800 };

const pct = (value: number) => `${value * 100}%`;

/**
 * O retrato só entra se o arquivo existir em /public. Sem ele, o hero
 * degrada para uma coluna só, sem moldura vazia e sem placeholder.
 */
export function hasPortrait(): boolean {
  return existsSync(join(process.cwd(), 'public', PORTRAIT_FILE));
}

interface PortraitProps {
  alt: string;
}

/** Marca de canto: o instrumento enquadrando o alvo, não uma borda decorativa. */
function CornerTick({ position }: { position: string }) {
  return <span aria-hidden="true" className={`absolute size-3 border-fg/25 ${position}`} />;
}

export function Portrait({ alt }: PortraitProps) {
  return (
    <figure className="relative">
      <div
        className="relative overflow-hidden rounded-panel border border-line bg-surface"
        style={{ aspectRatio: `${CROP.width} / ${CROP.height}` }}
      >
        <Image
          src={`/${PORTRAIT_FILE}`}
          alt={alt}
          width={SOURCE.width}
          height={SOURCE.height}
          priority
          /* a imagem é ~2x mais larga que a moldura por causa do recorte,
             então `sizes` descreve o <img>, não o quadro visível */
          sizes="(max-width: 1023px) 175vw, 780px"
          className="absolute max-w-none grayscale-[0.85] contrast-[1.06]"
          style={{
            width: pct(SOURCE.width / CROP.width),
            height: 'auto',
            left: pct(-CROP.x / CROP.width),
            top: pct(-CROP.y / CROP.height),
          }}
        />

        <CornerTick position="top-3 left-3 border-t border-l" />
        <CornerTick position="top-3 right-3 border-t border-r" />
        <CornerTick position="bottom-3 left-3 border-b border-l" />
        <CornerTick position="bottom-3 right-3 border-b border-r" />
      </div>
    </figure>
  );
}
