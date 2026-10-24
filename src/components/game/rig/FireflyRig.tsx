'use client';

import { useId, useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Part, RigDefs } from './parts';
import { RIG_BOX, SKELETON, type JointSpec } from './skeleton';

/** meia largura da tela de cada peça: cabe a antena mais alta e a asa mais longa */
const PART_CANVAS = 420;

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
 * peça em torno da articulação. A peça é desenhada em volta da origem e as
 * juntas-filhas são posicionadas relativas a ela.
 */
function Joint({ spec, u }: { spec: JointSpec; u: string }) {
  return (
    <div
      data-joint={spec.id}
      data-rest={spec.rest}
      className="absolute"
      style={{
        left: spec.at[0],
        top: spec.at[1],
        zIndex: spec.z,
        transform: `rotate(${spec.rest}deg)`,
        transformOrigin: '0 0',
      }}
    >
      {/* uma tela de verdade, centrada no pivô: um svg de 1px com overflow
          visível some quando o esqueleto é escalado para baixo */}
      <svg
        width={PART_CANVAS * 2}
        height={PART_CANVAS * 2}
        viewBox={`${-PART_CANVAS} ${-PART_CANVAS} ${PART_CANVAS * 2} ${PART_CANVAS * 2}`}
        className="pointer-events-none absolute overflow-visible"
        style={{ left: -PART_CANVAS, top: -PART_CANVAS }}
        aria-hidden="true"
        focusable="false"
      >
        <Part name={spec.part} u={u} far={spec.far} />
      </svg>
      {spec.children?.map((child) => (
        <Joint key={child.id} spec={child} u={u} />
      ))}
    </div>
  );
}

/**
 * O vagalume articulado, montado com as peças vetoriais.
 *
 * O tamanho é decidido pelo CSS de quem usa; um ResizeObserver mede a
 * caixa e escala o esqueleto para caber nela. Até a primeira medição o
 * vagalume fica invisível, para não aparecer gigante por um quadro.
 * As juntas ficam expostas em data-joint para as coreografias.
 */
export function FireflyRig({ className = '', style, idle = false, anchor }: FireflyRigProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  // ids de gradiente só com caracteres que url(#...) aceita
  const u = `ff${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

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
      <RigDefs u={u} />
      <div ref={rootRef} className="absolute top-0 left-0" style={{ transformOrigin: '0 0' }}>
        <div data-rig-body className="absolute" style={{ transformOrigin: '0 0' }}>
          <Joint spec={SKELETON} u={u} />
        </div>
      </div>
    </div>
  );
}
