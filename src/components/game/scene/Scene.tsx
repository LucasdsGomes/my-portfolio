import type { CSSProperties, ReactNode } from 'react';
import { ART } from '../art/assets.generated';

export type SceneName = keyof typeof ART.scenes;

const WIDTHS = [768, 1280, 1672] as const;

const srcset = (scene: SceneName, ext: 'avif' | 'webp') =>
  WIDTHS.map((w) => `/game/cenarios/${scene}-${w}.${ext} ${w}w`).join(', ');

interface ScenePictureProps {
  scene: SceneName;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A pintura em AVIF com WebP de reserva, na largura que a tela pede. O
 * borrão minúsculo fica de fundo e aparece enquanto a imagem carrega,
 * então o cenário nunca entra como um retângulo preto.
 */
export function ScenePicture({ scene, priority = false, className = '', style }: ScenePictureProps) {
  const { width, height, lqip } = ART.scenes[scene];

  return (
    <picture>
      <source type="image/avif" srcSet={srcset(scene, 'avif')} sizes="100vw" />
      <source type="image/webp" srcSet={srcset(scene, 'webp')} sizes="100vw" />
      <img
        src={`/game/cenarios/${scene}-1280.webp`}
        alt=""
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={`object-cover ${className}`}
        style={{ backgroundImage: `url(${lqip})`, backgroundSize: 'cover', ...style }}
      />
    </picture>
  );
}

interface SceneCoverProps {
  scene: SceneName;
  priority?: boolean;
  /**
   * Classes que definem --fx e --fy (0 a 1): que parte da pintura fica à
   * vista quando a tela é mais estreita ou mais alta que ela. Ex.:
   * "[--fx:0.5] portrait:[--fx:0.3]".
   */
  focusClassName?: string;
  /** coisas posicionadas em % da pintura: continuam no lugar em qualquer tela */
  children?: ReactNode;
}

/**
 * Cobre a área inteira como object-fit: cover, mas com uma caixa de verdade
 * do tamanho da pintura. Assim o vagalume pode ser posicionado sobre a
 * borda de pedra em porcentagem da imagem e fica em cima dela em qualquer
 * proporção de tela. Tudo em CSS, com unidades de container.
 */
export function SceneCover({ scene, priority, focusClassName = '', children }: SceneCoverProps) {
  const { width, height } = ART.scenes[scene];
  const ratio = width / height;

  return (
    <div className={`absolute inset-0 overflow-hidden [container-type:size] ${focusClassName}`}>
      <div
        className="absolute"
        style={
          {
            '--cw': `max(100cqw, calc(100cqh * ${ratio}))`,
            '--ch': `max(100cqh, calc(100cqw / ${ratio}))`,
            width: 'var(--cw)',
            height: 'var(--ch)',
            left: 'calc((100cqw - var(--cw)) * var(--fx, 0.5))',
            top: 'calc((100cqh - var(--ch)) * var(--fy, 0.5))',
          } as CSSProperties
        }
      >
        <ScenePicture scene={scene} priority={priority} className="absolute inset-0 h-full w-full" />
        {children}
      </div>
    </div>
  );
}
