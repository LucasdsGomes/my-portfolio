/**
 * Rolagem com duração própria, para a descida do "Começar jornada" virar
 * uma pequena cena em vez do salto seco do smooth nativo.
 *
 * Qualquer gesto da pessoa (roda, toque, tecla) cancela na hora: ninguém
 * fica preso assistindo. Com movimento reduzido, vai direto ao destino.
 */
export function cinematicScrollTo(target: HTMLElement, duration = 2600): void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const endY = target.getBoundingClientRect().top + window.scrollY;

  if (reduced) {
    window.scrollTo(0, endY);
    target.focus({ preventScroll: true });
    return;
  }

  const startY = window.scrollY;
  const distance = endY - startY;
  const start = performance.now();
  let frame = 0;

  // o smooth do CSS brigaria com cada scrollTo deste loop
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';

  const finish = () => {
    cancelAnimationFrame(frame);
    root.style.scrollBehavior = previous;
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
    window.removeEventListener('keydown', cancel);
  };

  function cancel() {
    finish();
  }

  // começa devagar, acelera no meio e pousa: queda com chegada suave
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    window.scrollTo(0, startY + distance * ease(t));
    if (t < 1) {
      frame = requestAnimationFrame(step);
    } else {
      finish();
      target.focus({ preventScroll: true });
    }
  };

  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('keydown', cancel);
  frame = requestAnimationFrame(step);
}
