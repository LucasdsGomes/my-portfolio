import { ART } from '../art/assets.generated';

type CreatureName = keyof typeof ART.creatures;

interface CreaturePictureProps {
  creature: string;
  /** largura em que a imagem aparece, para o navegador escolher o arquivo */
  sizes: string;
  /** criatura ainda não derrotada: só a sombra dela, como no diário de um jogo */
  silhouette?: boolean;
  className?: string;
}

/**
 * O retrato de uma criatura. O fundo da arte é o mesmo preto-azulado da
 * página, então ela já se encaixa; a máscara radial só apaga a borda do
 * quadrado para nenhuma aresta aparecer.
 */
export function CreaturePicture({ creature, sizes, silhouette = false, className = '' }: CreaturePictureProps) {
  const art = ART.creatures[creature as CreatureName];
  if (!art) return null;

  const set = (ext: 'avif' | 'webp') =>
    art.widths.map((w) => `/game/criaturas/${creature}-${w}.${ext} ${w}w`).join(', ');
  const fallback = art.widths.find((w) => w <= 512) ?? art.widths[0];

  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`/game/criaturas/${creature}-${fallback}.webp`}
        alt=""
        width={art.width}
        height={art.height}
        loading="lazy"
        decoding="async"
        className={`[mask-image:radial-gradient(circle_at_50%_50%,#000_58%,transparent_72%)] ${className}`}
        /* a arte não tem transparência: escurecer até o preto apagaria a
           criatura junto com o fundo. Apagada e cinza, a forma continua lá */
        style={silhouette ? { filter: 'grayscale(1) brightness(0.4) contrast(1.5)' } : undefined}
      />
    </picture>
  );
}
