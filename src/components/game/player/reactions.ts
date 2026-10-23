'use client';

import gsap from 'gsap';

export type Reaction = 'wave' | 'startle' | 'flip' | 'dizzy';

export interface ReactionKit {
  joint: (id: string) => HTMLElement;
  /** caixa do corpo (agachamento e quedas giram em torno dos pés) */
  body: HTMLElement;
  /** camada de deslocamento: pulos sobem e descem nela */
  mover: HTMLElement;
  /** o botão inteiro: as faíscas nascem a partir dele */
  wrap: HTMLElement;
  rest: Record<string, number>;
  height: () => number;
}

let lastReaction: Reaction | null = null;

// só em desenvolvimento: permite congelar as animações para inspecionar quadros
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  (window as unknown as { __gsap?: typeof gsap }).__gsap = gsap;
}

/** sorteia uma reação comum, nunca a mesma duas vezes seguidas */
export function pickReaction(): Reaction {
  const pool: Reaction[] = (['wave', 'startle', 'flip'] as const).filter((r) => r !== lastReaction);
  const pick = pool[Math.floor(Math.random() * pool.length)]!;
  lastReaction = pick;
  return pick;
}

/** faíscas saindo da lanterna, desenhadas fora do vagalume para não serem cortadas */
function sparks(kit: ReactionKit) {
  const lantern = kit.joint('abdomen').getBoundingClientRect();
  const cx = lantern.left + lantern.width * 0.3;
  const cy = lantern.top + lantern.height * 0.7;
  const size = Math.max(4, kit.height() * 0.03);

  for (let i = 0; i < 14; i += 1) {
    const dot = document.createElement('span');
    dot.setAttribute('aria-hidden', 'true');
    Object.assign(dot.style, {
      position: 'fixed',
      left: `${cx}px`,
      top: `${cy}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: '#fff3c4',
      boxShadow: '0 0 8px 2px rgba(253,208,95,0.9)',
      pointerEvents: 'none',
      zIndex: '60',
    });
    document.body.appendChild(dot);

    const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
    const dist = kit.height() * (0.35 + Math.random() * 0.35);
    gsap.to(dot, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - kit.height() * 0.15,
      opacity: 0,
      scale: 0.3,
      duration: 0.7 + Math.random() * 0.4,
      ease: 'power2.out',
      onComplete: () => dot.remove(),
    });
  }
}

export function runReaction(kind: Reaction, kit: ReactionKit, done: () => void) {
  const j = kit.joint;
  const r = kit.rest;
  const h = kit.height();
  const tl = gsap.timeline({ onComplete: done });

  if (kind === 'wave') {
    // vira para quem clicou e acena
    tl.to(j('head'), { rotation: r['head']! + 14, duration: 0.25, ease: 'power2.out' }, 0)
      .to(j('body'), { rotation: r['body']! - 8, duration: 0.3 }, 0)
      .to(j('arm-near'), { rotation: -150, duration: 0.3, ease: 'back.out(2)' }, 0.05)
      .to(j('forearm-near'), { rotation: -70, duration: 0.18, ease: 'sine.inOut', yoyo: true, repeat: 5 }, 0.3)
      .to(j('wing-upper'), { rotation: r['wing-upper']! - 12, duration: 0.2, yoyo: true, repeat: 3 }, 0.3)
      .to({}, { duration: 0.15 });
  }

  if (kind === 'startle') {
    // pula de susto: pernas abertas, asas zumbindo, cai de volta
    tl.to(kit.mover, { y: -h * 0.32, duration: 0.18, ease: 'power3.out' }, 0)
      .to(kit.mover, { y: 0, duration: 0.32, ease: 'bounce.out' }, 0.22)
      .to(j('thigh-near'), { rotation: -70, duration: 0.12 }, 0)
      .to(j('thigh-far'), { rotation: 80, duration: 0.12 }, 0)
      .to(j('shin-near'), { rotation: 0, duration: 0.12 }, 0)
      .to(j('shin-far'), { rotation: 0, duration: 0.12 }, 0)
      .to(j('arm-near'), { rotation: -120, duration: 0.12 }, 0)
      .to(j('arm-far'), { rotation: -110, duration: 0.12 }, 0)
      .to(j('head'), { rotation: r['head']! - 12, duration: 0.12 }, 0)
      .fromTo(
        [j('wing-upper'), j('wing-lower')],
        { rotation: 30 },
        { rotation: -36, duration: 0.04, ease: 'none', yoyo: true, repeat: 11 },
        0,
      )
      .to({}, { duration: 0.2 });
  }

  if (kind === 'flip') {
    // mortal para trás com faíscas da lanterna
    tl.to(kit.body, { scaleY: 0.85, scaleX: 1.08, duration: 0.14, ease: 'power2.in' }, 0)
      .to(kit.body, { scaleY: 1, scaleX: 1, duration: 0.2 }, 0.14)
      .to(kit.mover, { y: -h * 0.55, duration: 0.32, ease: 'power2.out' }, 0.14)
      .to(kit.mover, { y: 0, duration: 0.3, ease: 'power2.in' }, 0.46)
      .to(j('body'), { rotation: r['body']! - 360, duration: 0.6, ease: 'power1.inOut' }, 0.14)
      .to(j('thigh-near'), { rotation: -60, duration: 0.15 }, 0.14)
      .to(j('shin-near'), { rotation: 100, duration: 0.15 }, 0.14)
      .to(j('thigh-far'), { rotation: -40, duration: 0.15 }, 0.14)
      .to(j('shin-far'), { rotation: 100, duration: 0.15 }, 0.14)
      .call(() => sparks(kit), [], 0.3)
      .to(kit.body, { scaleY: 0.88, scaleX: 1.06, duration: 0.08 }, 0.76)
      .to(kit.body, { scaleY: 1, scaleX: 1, duration: 0.3, ease: 'back.out(3)' }, 0.84)
      // a volta inteira terminou: devolve o ângulo para o repouso sem girar de novo
      .set(j('body'), { rotation: r['body']! }, 0.78);
  }

  if (kind === 'dizzy') {
    // tonto: roda, cambaleia, cai de costas sacudindo as pernas e levanta
    tl.to(j('body'), { rotation: r['body']! + 18, duration: 0.16, ease: 'sine.inOut', yoyo: true, repeat: 5 }, 0)
      .to(j('head'), { rotation: r['head']! - 20, duration: 0.12, ease: 'sine.inOut', yoyo: true, repeat: 7 }, 0)
      .to(kit.mover, { x: '+=' + h * 0.06, duration: 0.2, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 0)
      .to(j('body'), { rotation: -95, duration: 0.35, ease: 'power2.in' }, 1)
      // gira na cintura: sem subir um pouco, metade do corpo afundaria na pedra
      .to(kit.mover, { y: -h * 0.16, duration: 0.35, ease: 'power2.in' }, 1)
      .to(j('thigh-near'), { rotation: -100, duration: 0.12, yoyo: true, repeat: 5 }, 1.35)
      .to(j('thigh-far'), { rotation: -70, duration: 0.14, yoyo: true, repeat: 5 }, 1.35)
      .to(j('shin-near'), { rotation: 40, duration: 0.12, yoyo: true, repeat: 5 }, 1.35)
      .to(j('arm-near'), { rotation: -140, duration: 0.2 }, 1.35)
      .to({}, { duration: 0.3 })
      .to(j('body'), { rotation: r['body']!, duration: 0.4, ease: 'back.out(1.6)' })
      .to(kit.mover, { y: 0, duration: 0.4, ease: 'back.out(1.6)' }, '<');
  }

  // só em desenvolvimento: permite pausar a reação e inspecionar quadro a quadro
  if (process.env.NODE_ENV !== 'production') {
    (window as unknown as { __reacao?: gsap.core.Timeline }).__reacao = tl;
  }

  return tl;
}
