'use client';

import { useEffect, useRef } from 'react';
import { seeded } from './shapes';

interface MotesProps {
  /** partículas por 100 mil px² de tela; escala com o tamanho da cena */
  density?: number;
  /** cor da luz em "r, g, b" */
  tint?: string;
  /** velocidade de subida, em px por segundo */
  rise?: number;
  className?: string;
}

interface Mote {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  sway: number;
  twinkle: number;
}

/**
 * Pontinhos de luz flutuando: esporos, poeira, vagalumes ao longe. Um canvas
 * 2D só, com um sprite de brilho pré-renderizado, então o custo por quadro é
 * só posicionar imagens. Para quando sai da tela ou quando a aba some, e com
 * movimento reduzido desenha um quadro parado e não anima.
 */
export function Motes({ density = 2.4, tint = '253, 208, 95', rise = 9, className = '' }: MotesProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rand = seeded(97);

    // sprite: um ponto com halo, desenhado uma vez
    const sprite = document.createElement('canvas');
    const S = 32;
    sprite.width = S;
    sprite.height = S;
    const sctx = sprite.getContext('2d');
    if (sctx) {
      const g = sctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      g.addColorStop(0, `rgba(${tint}, 1)`);
      g.addColorStop(0.25, `rgba(${tint}, 0.55)`);
      g.addColorStop(1, `rgba(${tint}, 0)`);
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, S, S);
    }

    let motes: Mote[] = [];
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(((width * height) / 100_000) * density);
      motes = Array.from({ length: count }, () => ({
        x: rand() * width,
        y: rand() * height,
        r: 2 + rand() * 5,
        speed: rise * (0.4 + rand() * 1.2),
        phase: rand() * Math.PI * 2,
        sway: 6 + rand() * 18,
        twinkle: 0.6 + rand() * 1.6,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const seconds = t / 1000;
      for (const m of motes) {
        const y = (((m.y - seconds * m.speed) % (height + 40)) + height + 40) % (height + 40) - 20;
        const x = m.x + Math.sin(seconds * 0.6 + m.phase) * m.sway;
        const alpha = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(seconds * m.twinkle + m.phase));
        const size = m.r * 4;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    let frame = 0;
    let running = false;
    let visible = true;

    const loop = (t: number) => {
      draw(t);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    resize();
    draw(0);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) start();
      else stop();
    });
    observer.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => {
      resize();
      if (!running) draw(0);
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);
    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
    };
  }, [density, tint, rise]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
