'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Ornament } from './Ornament';
import { playSfx } from './audio/sound';
import { registerDialogue } from './journey/dialogues';
import { JOURNEY_RESET, announceChange } from './journey/events';

interface DialogueProps {
  speaker: string;
  lines: readonly string[];
  labels: { advance: string; showAll: string };
}

/** caracteres por segundo; rápido o bastante para não irritar quem lê */
const CPS = 52;

/**
 * Caixa de diálogo com o texto aparecendo letra a letra.
 *
 * A letra a letra é só visual: o texto animado fica fora da árvore de
 * acessibilidade, e a fala inteira da vez está num nó irmão invisível que
 * o leitor de tela anuncia quando muda. "Mostrar tudo" abre todas as falas
 * de uma vez para quem quer ler sem esperar.
 */
export function Dialogue({ speaker, lines, labels }: DialogueProps) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  // muda a cada nova jornada: força a caixa a esperar aparecer de novo
  const [round, setRound] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const typing = useRef(false);
  const frame = useRef(0);
  const started = useRef(false);

  const line = lines[index] ?? '';
  const isLast = index >= lines.length - 1;

  const finishLine = useCallback(() => {
    cancelAnimationFrame(frame.current);
    typing.current = false;
    if (textRef.current) textRef.current.textContent = line;
    announceChange();
  }, [line]);

  const typeLine = useCallback(() => {
    const node = textRef.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = line;
      return;
    }

    typing.current = true;
    node.textContent = '';
    const start = performance.now();
    announceChange();

    const step = (now: number) => {
      const count = Math.floor(((now - start) / 1000) * CPS);
      node.textContent = line.slice(0, count);
      if (count < line.length) frame.current = requestAnimationFrame(step);
      else {
        typing.current = false;
        announceChange();
      }
    };

    frame.current = requestAnimationFrame(step);
  }, [line]);

  // a primeira fala só começa quando a caixa aparece na tela
  useEffect(() => {
    const node = boxRef.current;
    if (!node) return;

    if (started.current) {
      typeLine();
      return () => cancelAnimationFrame(frame.current);
    }

    // antes de começar, a caixa já mostra a fala inteira: sem JS ou fora da
    // tela, o texto existe e é legível
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        started.current = true;
        typeLine();
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [typeLine, round]);

  // nova jornada: volta à primeira fala, inteira, à espera de ser lida
  useEffect(() => {
    const onReset = () => {
      cancelAnimationFrame(frame.current);
      typing.current = false;
      started.current = false;
      if (textRef.current) textRef.current.textContent = lines[0] ?? '';
      setExpanded(false);
      setIndex(0);
      setRound((r) => r + 1);
    };
    window.addEventListener(JOURNEY_RESET, onReset);
    return () => window.removeEventListener(JOURNEY_RESET, onReset);
  }, [lines]);

  const advance = () => {
    if (typing.current) {
      finishLine();
      return;
    }
    if (isLast) return;
    playSfx('dialogo');
    setIndex((i) => i + 1);
  };

  // a barra de espaço conduz a fala: completa, avança e, na última, segue viagem
  const advanceRef = useRef(advance);
  const lastRef = useRef(isLast);
  useEffect(() => {
    advanceRef.current = advance;
    lastRef.current = isLast;
  });
  useEffect(() => {
    const node = boxRef.current;
    if (!node || expanded) return;
    return registerDialogue({
      element: node,
      state: () => (typing.current ? 'typing' : lastRef.current ? 'done' : 'more'),
      advance: () => advanceRef.current(),
    });
  }, [expanded]);

  if (expanded) {
    return (
      <div className="rounded-sm border border-bone/15 bg-abyss/85 px-6 py-6 backdrop-blur-sm sm:px-9">
        <p className="font-title text-sm tracking-[0.3em] text-glow uppercase">{speaker}</p>
        <div className="mt-4 space-y-4 text-lg leading-relaxed text-bone">
          {lines.map((text) => (
            <p key={text.slice(0, 40)}>{text}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={boxRef}
      className="relative rounded-sm border border-bone/15 bg-abyss/85 px-6 pt-5 pb-4 backdrop-blur-sm sm:px-9"
    >
      <Ornament className="absolute -top-3.5 left-1/2 w-48 -translate-x-1/2" />

      <div className="flex items-baseline justify-between gap-4">
        <p className="font-title text-sm tracking-[0.3em] text-glow uppercase">{speaker}</p>
        <p className="font-title text-xs tracking-[0.2em] text-bone-muted tabular-nums">
          {index + 1} / {lines.length}
        </p>
      </div>

      {/* clicar no texto também avança, como num jogo */}
      <div className="mt-3 min-h-[7.5em] cursor-pointer text-lg leading-relaxed text-bone sm:text-xl" onClick={advance}>
        <span ref={textRef} aria-hidden="true">
          {line}
        </span>
        <span className="sr-only" aria-live="polite">
          {line}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="min-h-11 text-base text-bone-muted italic underline-offset-4 hover:text-bone hover:underline"
        >
          {labels.showAll}
        </button>

        {isLast ? null : (
          <button
            type="button"
            onClick={advance}
            className="inline-flex min-h-11 items-center gap-2 font-title text-sm tracking-[0.24em] text-bone uppercase hover:text-glow"
          >
            {labels.advance}
            <svg viewBox="0 0 12 8" className="dialogue-caret h-2 w-3" aria-hidden="true" focusable="false">
              <path d="M0 0 L6 8 L12 0 Z" fill="#fdd05f" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
