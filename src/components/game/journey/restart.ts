'use client';

import gsap from 'gsap';
import { playSfx } from '../audio/sound';
import { JOURNEY_RESET, announceChange } from './events';

/**
 * Nova jornada, como recomeçar um jogo: a tela escurece, a página volta ao
 * título e tudo o que já aconteceu se desfaz (falas, banco, anúncios das
 * regiões, o mapa, as luzes do HUD). A volta é instantânea, por baixo do
 * escuro: rolar até o topo passaria por todas as regiões e as faria
 * anunciar de novo no caminho.
 */
export function newJourney() {
  playSfx('menu-confirmar');

  const reset = () => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previous;
    window.dispatchEvent(new CustomEvent(JOURNEY_RESET));
    announceChange();
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reset();
    return;
  }

  const curtain = document.createElement('div');
  curtain.setAttribute('aria-hidden', 'true');
  Object.assign(curtain.style, {
    position: 'fixed',
    inset: '0',
    background: '#03060e',
    zIndex: '90',
    opacity: '0',
    pointerEvents: 'none',
  });
  document.body.appendChild(curtain);

  gsap.to(curtain, {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.in',
    onComplete: () => {
      reset();
      gsap.to(curtain, { opacity: 0, duration: 0.9, delay: 0.2, ease: 'power2.out', onComplete: () => curtain.remove() });
    },
  });
}
