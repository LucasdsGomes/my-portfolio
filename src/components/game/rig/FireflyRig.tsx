'use client';

import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { ART } from '../art/assets.generated';
import { RIG_BOX, SKELETON, type JointSpec } from './skeleton';

interface FireflyRigProps {
  /** a altura vem do CSS (classe ou style); a escala interna se ajusta */
  className?: string;
  style?: CSSProperties;
  /** respiração em repouso: asas balançando, corpo subindo e descendo */
  idle?: boolean;
  /** marca este vagalume como ponto de partida ou chegada de uma coreografia */
  anchor?: string;
}

/**
 * Uma junta: a div tem a origem no pivô da peça, então girar a div gira a
 * peça em torno da articulação. A imagem é deslocada para trás do pivô e
 * as juntas-filhas são posicionadas relativas a ele.
 */
function Joint({ spec, parentPivot }: { spec: JointSpec; parentPivot: readonly [number, number] }) {
  const { width, height } = ART.parts[spec.part];
  const [px, py] = spec.pivot;

  return (
    <div
      data-joint={spec.id}
      data-rest={spec.rest}
      className="absolute"
      style={{
        left: spec.at[0] - parentPivot[0],
        top: spec.at[1] - parentPivot[1],
        zIndex: spec.z,
        transform: `rotate(${spec.rest}deg)`,
        transformOrigin: '0 0',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- peça de marionete, não conteúdo */}
      <img
        src={`/game/vagalume/${spec.part}.webp`}
        alt=""
        width={width}
        height={height}
        draggable={false}
        decoding="async"
        className="pointer-events-none absolute max-w-none select-none"
        style={{
          left: -px,
          top: -py,
          // espelha dentro da própria caixa: o pivô já é dado na peça espelhada
          transform: spec.flip ? 'scaleX(-1)' : undefined,
          filter: spec.far ? 'brightness(0.55) saturate(0.8)' : undefined,
        }}
      />
      {spec.children?.map((child) => (
        <Joint key={child.id} spec={child} parentPivot={spec.pivot} />
      ))}
    </div>
  );
}

/**
 * O vagalume articulado, montado com as peças pintadas.
 *
 * O tamanho é decidido pelo CSS de quem usa; um ResizeObserver mede a
 * caixa e escala o esqueleto para caber nela. Até a primeira medição o
 * vagalume fica invisível, para não aparecer gigante por um quadro.
 * As juntas ficam expostas em data-joint para as coreografias.
 */
export function FireflyRig({ className = '', style, idle = false, anchor }: FireflyRigProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const root = rootRef.current;
    if (!box || !root) return;

    const fit = () => {
      const s = box.clientHeight / RIG_BOX.height;
      root.style.transform = `scale(${s}) translate(${-RIG_BOX.x}px, ${-RIG_BOX.y}px)`;
      box.dataset.ready = 'true';
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      data-rig
      data-anchor={anchor}
      data-idle={idle ? 'true' : undefined}
      className={`firefly-rig relative ${className}`}
      style={{ aspectRatio: `${RIG_BOX.width} / ${RIG_BOX.height}`, ...style }}
    >
      <div ref={rootRef} className="absolute top-0 left-0" style={{ transformOrigin: '0 0' }}>
        <div data-rig-body className="absolute" style={{ transformOrigin: '0 0' }}>
          <Joint spec={SKELETON} parentPivot={[0, 0]} />
        </div>
      </div>
    </div>
  );
}

