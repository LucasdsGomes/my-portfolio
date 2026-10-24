'use client';

import { useEffect, useRef, useState } from 'react';
import type { PortfolioContent } from '@/types/portfolio';
import {
  BENCH_REST,
  JOURNEY_CHANGE,
  JOURNEY_START,
  PASSAGE_EVENT,
  type PassageDetail,
  type PassageStyle,
} from './events';
import { visibleDialogue } from './dialogues';
import { playSfx } from '../audio/sound';
import { newJourney } from './restart';
import { useMediaQuery } from '../useMediaQuery';

/** As regiões em ordem, o vagalume de cada uma e o jeito de chegar até ela. */
const ROUTE: readonly { id: string; anchor: string; style: PassageStyle }[] = [
  { id: 'perfil', anchor: 'perfil', style: 'salto' },
  { id: 'foco', anchor: 'foco', style: 'salto' },
  { id: 'projetos', anchor: 'projetos', style: 'salto' },
  { id: 'stack', anchor: 'stack', style: 'investida' },
  { id: 'trajetoria', anchor: 'trajetoria', style: 'planar' },
  { id: 'contato', anchor: 'banco', style: 'banco' },
];

type Action =
  | { kind: 'none' }
  | { kind: 'start' }
  | { kind: 'finish' | 'next'; run: () => void }
  | { kind: 'region'; from: number; to: number }
  | { kind: 'rest' }
  | { kind: 'again' };

const NONE: Action = { kind: 'none' };

/** controles que o espaço já aciona sozinho, quando estão em foco pelo teclado */
const NATIVE = 'button, a[href], input, select, textarea, summary, [role="button"], [contenteditable="true"]';

/** o que a barra de espaço faria agora, lido do estado da página */
function currentAction(): Action {
  if (document.documentElement.dataset.cinematic || document.querySelector('dialog[open]')) return NONE;
  const vh = window.innerHeight;

  // no título quem conduz é o menu: a primeira tecla o abre, a segunda começa
  if (window.scrollY < vh * 0.5) return document.querySelector('[data-menu-item]') ? { kind: 'start' } : NONE;

  // a região atual é a última cujo topo já passou da linha de leitura
  let at = -1;
  ROUTE.forEach((stop, i) => {
    const el = document.getElementById(stop.id);
    if (el && el.getBoundingClientRect().top <= vh * 0.45) at = i;
  });
  if (at === -1) return { kind: 'region', from: -1, to: 0 };

  const section = document.getElementById(ROUTE[at]!.id)!;
  const dialogue = visibleDialogue(section);
  const state = dialogue?.state();
  if (dialogue && state === 'typing') return { kind: 'finish', run: dialogue.advance };
  if (dialogue && state === 'more') return { kind: 'next', run: dialogue.advance };

  if (at === ROUTE.length - 1) return section.dataset.saved === 'true' ? { kind: 'again' } : { kind: 'rest' };
  return { kind: 'region', from: at, to: at + 1 };
}

function perform(action: Action) {
  const smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

  switch (action.kind) {
    case 'start':
      playSfx('menu-confirmar');
      window.dispatchEvent(new CustomEvent(JOURNEY_START));
      break;
    case 'finish':
    case 'next':
      action.run();
      break;
    case 'region': {
      const to = ROUTE[action.to]!;
      if (action.from < 0) {
        // ainda no poço: só desce até a Clareira
        const section = document.getElementById(to.id);
        section?.scrollIntoView({ behavior: smooth });
        section?.focus({ preventScroll: true });
        break;
      }
      const detail: PassageDetail = {
        from: ROUTE[action.from]!.anchor,
        to: to.anchor,
        sectionId: to.id,
        style: to.style,
      };
      window.dispatchEvent(new CustomEvent(PASSAGE_EVENT, { detail }));
      break;
    }
    case 'rest':
      window.dispatchEvent(new CustomEvent(BENCH_REST));
      break;
    case 'again':
      newJourney();
      break;
    default:
      break;
  }
}

interface SpaceNavigatorProps {
  labels: PortfolioContent['game']['space'];
}

/**
 * A barra de espaço conduz a jornada, como o botão de ação de um jogo:
 * completa a fala que está sendo escrita, passa para a próxima, viaja até
 * a região seguinte com uma passagem animada e, no fim, descansa no banco.
 *
 * O aviso no pé da tela diz o que o espaço faz naquele momento, e é também
 * um botão: no celular, tocar nele faz a mesma coisa.
 *
 * O espaço continua sendo do navegador quando há um campo de texto ou um
 * controle em foco pelo teclado: aí ele aperta o botão, como sempre.
 */
export function SpaceNavigator({ labels }: SpaceNavigatorProps) {
  const [action, setAction] = useState<Action>(NONE);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const coarse = useMediaQuery('(pointer: coarse)');

  useEffect(() => {
    let frame = 0;
    const read = () => setAction(currentAction());
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };

    const press = () => {
      const node = buttonRef.current;
      if (!node) return;
      node.dataset.pressed = 'true';
      window.setTimeout(() => delete node.dataset.pressed, 140);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.code !== 'Space' && event.key !== ' ') return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const active = document.activeElement as HTMLElement | null;
      if (active?.matches(NATIVE) && (active.matches(':focus-visible') || active.matches('input, select, textarea'))) return;

      const next = currentAction();
      if (next.kind === 'none') {
        // durante uma cena o espaço não rola a página por baixo dela
        if (document.documentElement.dataset.cinematic) event.preventDefault();
        return;
      }
      event.preventDefault();
      if (event.repeat) return;
      press();
      perform(next);
      schedule();
    };

    read();
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener(JOURNEY_CHANGE, schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener(JOURNEY_CHANGE, schedule);
    };
  }, []);

  const text =
    action.kind === 'finish'
      ? labels.finish
      : action.kind === 'next'
        ? labels.next
        : action.kind === 'region'
          ? labels.region
          : action.kind === 'rest'
            ? labels.rest
            : action.kind === 'again'
              ? labels.again
              : '';
  // no título o menu já diz o que fazer
  const shown = text !== '';

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-keyshortcuts="Space"
      aria-hidden={shown ? undefined : true}
      tabIndex={shown ? 0 : -1}
      data-shown={shown ? 'true' : 'false'}
      onClick={() => perform(currentAction())}
      className="space-prompt fixed right-4 bottom-4 z-40 inline-flex min-h-11 items-center gap-3 rounded-sm border border-bone/12 bg-abyss/80 px-4 py-1.5 font-title text-xs tracking-[0.24em] whitespace-nowrap text-bone-muted uppercase backdrop-blur-sm hover:text-bone sm:right-6 sm:bottom-6"
    >
      {coarse ? null : (
        <span className="space-key rounded-[3px] border border-bone/30 px-3 py-0.5 text-[0.65rem] tracking-[0.2em] text-bone">
          {labels.key}
        </span>
      )}
      <span>{text}</span>
      {action.kind === 'again' ? <span aria-hidden="true">↑</span> : <span aria-hidden="true" className="text-glow">▸</span>}
    </button>
  );
}
