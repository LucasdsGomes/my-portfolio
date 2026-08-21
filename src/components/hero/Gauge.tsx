'use client';

import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import type { Gauge as GaugeData } from '@/types/portfolio';

interface GaugeProps {
  gauge: GaugeData;
  index: number;
}

const SWEEP_MS = 900;
const STAGGER_MS = 120;
const TICKS = 24;

/**
 * Um mostrador do cluster. Na ignição, a leitura varre do zero até o valor
 * final e para. Leituras textuais são reveladas por um wipe no mesmo tempo.
 *
 * A varredura é escrita direto no DOM em vez de passar por estado: é um
 * efeito visual de 900ms, não informação que a árvore React precise
 * reconciliar. O HTML servido já traz o valor final, então quem tem
 * movimento reduzido, JS desligado ou a aba em segundo plano lê o número
 * certo sem nunca ver o zero.
 */
export function Gauge({ gauge, index }: GaugeProps) {
  const isNumeric = typeof gauge.value === 'number';
  const readingRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reading = readingRef.current;
    const bar = barRef.current;
    if (!reading || !bar) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // aba em segundo plano: rAF fica suspenso e a varredura nunca terminaria
    if (document.hidden) return;

    const delay = index * STAGGER_MS;
    bar.style.setProperty('--ignite-delay', `${delay}ms`);
    bar.classList.add('ignite-bar');

    if (!isNumeric) {
      reading.style.setProperty('--ignite-delay', `${delay}ms`);
      reading.classList.add('ignite-wipe');
      return () => {
        reading.classList.remove('ignite-wipe');
        bar.classList.remove('ignite-bar');
      };
    }

    const target = gauge.value ?? 0;
    const pad = gauge.display.length;
    const start = performance.now() + delay;
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;

      if (elapsed < 0) {
        reading.textContent = '0'.padStart(pad, '0');
        frame = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min(elapsed / SWEEP_MS, 1);
      // desacelera no fim, como ponteiro assentando
      const eased = 1 - Math.pow(1 - progress, 3);
      reading.textContent = String(Math.round(target * eased)).padStart(pad, '0');

      if (progress < 1) frame = requestAnimationFrame(tick);
      else reading.textContent = gauge.display;
    };

    frame = requestAnimationFrame(tick);

    // rede de segurança: aconteça o que acontecer com o rAF, o mostrador
    // termina no valor real. Um número errado no hero é pior que a animação.
    const settle = window.setTimeout(() => {
      reading.textContent = gauge.display;
    }, delay + SWEEP_MS + 400);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      reading.textContent = gauge.display;
      bar.classList.remove('ignite-bar');
    };
  }, [gauge.display, gauge.value, index, isNumeric]);

  const delayStyle = { '--ignite-delay': `${index * STAGGER_MS}ms` } as CSSProperties;

  return (
    <div className="rounded-panel border border-line bg-surface px-4 py-4">
      <p className="font-mono text-2xs tracking-[0.14em] text-fg-muted">{gauge.label}</p>

      <p
        ref={readingRef}
        className={`tabular mt-3 font-mono text-fg ${
          isNumeric ? 'text-xl' : 'text-base tracking-[0.04em]'
        }`}
        style={delayStyle}
      >
        {gauge.display}
      </p>

      {/* escala de ticks: o instrumento por trás do número */}
      <div aria-hidden="true" className="relative mt-3 h-2 overflow-hidden">
        <div className="absolute inset-0 flex justify-between">
          {Array.from({ length: TICKS }, (_, i) => (
            <span key={i} className="w-px bg-line" />
          ))}
        </div>
        <div ref={barRef} className="absolute inset-y-0 left-0 w-full bg-accent/60" style={delayStyle} />
      </div>

      <p className="mt-3 text-2xs text-fg-muted">{gauge.caption}</p>
    </div>
  );
}
