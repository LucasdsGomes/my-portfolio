'use client';

/**
 * As caixas de diálogo da página, para a barra de espaço saber se há uma
 * fala para completar ou avançar antes de seguir para a próxima região.
 */

export type DialogueState = 'typing' | 'more' | 'done';

export interface DialogueHandle {
  element: HTMLElement;
  state: () => DialogueState;
  advance: () => void;
}

const dialogues = new Set<DialogueHandle>();

export function registerDialogue(handle: DialogueHandle): () => void {
  dialogues.add(handle);
  return () => dialogues.delete(handle);
}

/** a caixa desta seção que está pelo menos meio à vista */
export function visibleDialogue(section: HTMLElement): DialogueHandle | null {
  const vh = window.innerHeight;
  for (const handle of dialogues) {
    if (!section.contains(handle.element)) continue;
    const r = handle.element.getBoundingClientRect();
    const seen = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    if (r.height > 0 && seen / r.height >= 0.5) return handle;
  }
  return null;
}
