'use client';

/**
 * Teclado do jogador, compartilhado por todos os vagalumes da página.
 *
 * Só um vagalume obedece por vez: o que está mais à vista. Assim, quem lê a
 * Clareira mexe o da Clareira, e quem volta ao título mexe o da borda.
 *
 * As teclas foram escolhidas para não roubar a leitura: A/D e ←/→ andam
 * (setas laterais não rolam a página), W pula. ↑ também pula, mas só
 * quando nada está em foco: com foco num menu, ↑ continua navegando.
 */

export interface Player {
  element: HTMLElement;
  press: (action: 'left' | 'right' | 'jump', down: boolean) => void;
}

const players = new Set<Player>();
const held = new Set<string>();

const KEYS: Record<string, 'left' | 'right' | 'jump'> = {
  a: 'left',
  A: 'left',
  ArrowLeft: 'left',
  d: 'right',
  D: 'right',
  ArrowRight: 'right',
  w: 'jump',
  W: 'jump',
  ArrowUp: 'jump',
};

function typing(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
}

function nothingFocused(): boolean {
  const el = document.activeElement;
  return !el || el === document.body || (el as HTMLElement).tabIndex === -1;
}

/** o vagalume com mais área dentro da tela */
function activePlayer(): Player | null {
  let best: Player | null = null;
  let bestArea = 0;
  const vh = window.innerHeight;
  const vw = window.innerWidth;

  for (const player of players) {
    const r = player.element.getBoundingClientRect();
    const w = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
    const h = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
    const area = w * h;
    if (area > bestArea) {
      bestArea = area;
      best = player;
    }
  }

  return best;
}

function handle(event: KeyboardEvent, down: boolean) {
  const action = KEYS[event.key];
  if (!action || event.metaKey || event.ctrlKey || event.altKey) return;
  if (typing(event.target) || document.querySelector('dialog[open]')) return;
  if (document.documentElement.dataset.cinematic) return;
  if (event.key === 'ArrowUp' && !nothingFocused()) return;

  if (down) {
    if (held.has(event.key)) return; // repetição automática do teclado
    held.add(event.key);
  } else {
    held.delete(event.key);
  }

  const player = activePlayer();
  if (!player) return;
  if (event.key.startsWith('Arrow')) event.preventDefault();
  player.press(action, down);
}

const onDown = (event: KeyboardEvent) => handle(event, true);
const onUp = (event: KeyboardEvent) => handle(event, false);
const onBlur = () => {
  // soltar tudo ao trocar de aba: senão o vagalume anda sozinho para sempre
  for (const player of players) {
    player.press('left', false);
    player.press('right', false);
  }
  held.clear();
};

export function registerPlayer(player: Player): () => void {
  if (players.size === 0) {
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
  }
  players.add(player);

  return () => {
    players.delete(player);
    if (players.size === 0) {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    }
  };
}
