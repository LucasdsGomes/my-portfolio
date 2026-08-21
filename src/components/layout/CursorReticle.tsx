'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE = 'a, button, summary, [role="button"], input, select, textarea';
/** quanto o quadro externo persegue o ponteiro por frame */
const CHASE = 0.22;

/**
 * Retículo de instrumento no lugar da seta: um ponto que gruda no ponteiro
 * e um quadro que o persegue com atraso, abrindo e virando âmbar sobre
 * qualquer coisa clicável.
 *
 * Só entra quando há ponteiro fino e movimento permitido. Em toque, em
 * `prefers-reduced-motion` ou sem JavaScript, o cursor do sistema fica
 * intacto: esconder o cursor nativo sem substituto é deixar a página
 * inutilizável, então a troca só acontece depois que o retículo existe.
 */
export function CursorReticle() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const root = document.documentElement;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame = 0;
    let armed = false;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;

      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!armed) {
        // só troca o cursor depois do primeiro movimento real do mouse,
        // para o retículo já nascer na posição certa
        armed = true;
        ringX = pointerX;
        ringY = pointerY;
        root.dataset.cursor = 'reticle';
      }

      const overInteractive = (event.target as Element | null)?.closest?.(INTERACTIVE) != null;
      ring.dataset.state = overInteractive ? 'interactive' : 'idle';
    };

    const onLeave = () => {
      root.removeAttribute('data-cursor');
      armed = false;
    };

    const onEnter = () => {
      if (armed) root.dataset.cursor = 'reticle';
    };

    const tick = () => {
      ringX += (pointerX - ringX) * CHASE;
      ringY += (pointerY - ringY) * CHASE;

      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);
    // segurando um botão do mouse fora da janela, o cursor nativo volta
    window.addEventListener('blur', onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      window.removeEventListener('blur', onLeave);
      root.removeAttribute('data-cursor');
    };
  }, []);

  return (
    <div aria-hidden="true" className="reticle-layer">
      <div ref={ringRef} className="reticle-ring" data-state="idle">
        <span className="reticle-frame" />
      </div>
      <div ref={dotRef} className="reticle-dot" />
    </div>
  );
}
