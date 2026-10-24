'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { FireflyRig } from '../rig/FireflyRig';
import { FEET_ORIGIN, RIG_FEET, SKELETON, type JointSpec } from '../rig/skeleton';
import {
  BENCH_REST,
  JOURNEY_START,
  PASSAGE_EVENT,
  announceChange,
  type PassageDetail,
  type PassageStyle,
} from './events';
import { playSfx } from '../audio/sound';

interface JourneyDirectorProps {
  /** vagalume de onde a descida parte */
  from: string;
  /** vagalume onde a descida termina */
  to: string;
  /** seção que a câmera leva até o topo da tela no fim da descida */
  sectionId: string;
  skipLabel: string;
}

const SCROLL_KEYS = new Set([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End']);

function walk(spec: JointSpec, out: JointSpec[] = []): JointSpec[] {
  out.push(spec);
  spec.children?.forEach((child) => walk(child, out));
  return out;
}

const JOINTS = walk(SKELETON);

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** O que cada coreografia recebe: o ator, as juntas e onde a cena acontece. */
interface Stage {
  tl: gsap.core.Timeline;
  actor: HTMLElement;
  body: HTMLElement;
  J: (id: string) => HTMLElement;
  /** de onde o ator parte, em px de tela */
  src: Box;
  /** o vagalume de partida estava fora da tela: o ator entra por cima */
  offscreen: boolean;
  vw: number;
  vh: number;
  /** calculado na hora: depois que a câmera para, o destino está na tela */
  destRect: () => DOMRect;
  /** a câmera desce até o destino, a partir de `at`, por `duration` segundos */
  camera: (at: number, duration: number) => void;
  /** efeitos soltos na página, removidos quando a cena acaba */
  fx: HTMLElement[];
  /** a luz guia: começa sob os pés do vagalume de partida */
  wisp: HTMLElement;
  /** onde ficam os pés do vagalume de destino, agora */
  destFeet: () => { x: number; y: number };
}

/**
 * O diretor das cenas da jornada. Duas famílias de cena:
 *
 * A descida, do título até a Clareira: o vagalume salta da borda do
 * título, mergulha pelo poço enquanto a câmera desce e pousa na pedra.
 * Dispara pelo menu, pela primeira rolagem para baixo no topo ou pela
 * barra de espaço. Dura cerca de 3,5 s.
 *
 * As passagens, de uma região para a próxima, pedidas pela barra de
 * espaço. Cada uma tem seu jeito: um salto, uma investida, um planeio e,
 * no fim, a chegada ao banco.
 *
 * Em todas, a luz que fica sob os pés do vagalume vai na frente: sai de
 * baixo dele, desce guiando o caminho e espera no ponto de pouso.
 *
 * Como funciona: o vagalume parado some, e um "ator" idêntico, fixo sobre
 * a página, assume a mesma posição. O ator é coreografado com tempo
 * próprio (antecipação, arco, peso no pouso), em vez de arrastado pela
 * barra de rolagem. No fim ele cai exatamente onde está o vagalume de
 * destino, que reaparece, e o ator some.
 *
 * Esc ou o botão "Pular" vão direto ao fim. Com movimento reduzido, não
 * há cena: a página vai direto para o destino.
 */
export function JourneyDirector({ from, to, sectionId, skipLabel }: JourneyDirectorProps) {
  const actorRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const actor = actorRef.current;
    if (!actor) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let playing = false;

    const anchor = (name: string) => document.querySelector<HTMLElement>(`[data-anchor="${name}"]`);
    const joint = (id: string) => actor.querySelector<HTMLElement>(`[data-joint="${id}"]`);

    const jumpTo = (section: HTMLElement | null, y?: number) => {
      if (!section) return;
      window.scrollTo(0, y ?? section.getBoundingClientRect().top + window.scrollY);
      section.focus({ preventScroll: true });
    };

    const onKey = (event: KeyboardEvent) => {
      if (!playing) return;
      if (event.key === 'Escape') timeline.current?.progress(1);
      else if (SCROLL_KEYS.has(event.key)) event.preventDefault();
    };

    interface Scene {
      from: string;
      to: string;
      sectionId: string;
      /** onde a câmera para; sem isto, no topo da seção */
      cameraY?: (section: HTMLElement, dest: HTMLElement) => number;
      build: (stage: Stage) => void;
      /** depois do pouso, ou direto, com movimento reduzido */
      after?: () => void;
    }

    const play = (scene: Scene) => {
      if (playing) return;
      const source = anchor(scene.from);
      const dest = anchor(scene.to);
      const section = document.getElementById(scene.sectionId);
      const parts = new Map(JOINTS.map((spec) => [spec.id, joint(spec.id)]));
      const body = actor.querySelector<HTMLElement>('[data-rig-body]');
      const cameraY = (s: HTMLElement, d: HTMLElement) =>
        scene.cameraY ? scene.cameraY(s, d) : s.getBoundingClientRect().top + window.scrollY;

      if (reduced || !dest || !section || !body || [...parts.values()].some((el) => !el)) {
        jumpTo(section, section && dest ? cameraY(section, dest) : undefined);
        scene.after?.();
        return;
      }

      playing = true;
      setRunning(true);

      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      root.dataset.cinematic = 'true';
      announceChange();

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = source?.getBoundingClientRect();
      const d = dest.getBoundingClientRect();
      const offscreen = !s || s.bottom < 0 || s.top > vh;
      // sem o vagalume de partida à vista, o ator tem o tamanho do de chegada
      const src: Box = s && !offscreen ? s : { left: vw * 0.22, top: -d.height * 1.1, width: d.width, height: d.height };

      // o ator assume o lugar e o tamanho do vagalume de partida
      gsap.set(actor, {
        x: src.left,
        y: src.top,
        width: src.width,
        height: src.height,
        scale: 1,
        transformOrigin: '0 0',
        autoAlpha: 1,
      });
      for (const spec of JOINTS) gsap.set(parts.get(spec.id)!, { rotation: spec.rest });
      gsap.set(body, { scaleX: 1, scaleY: 1, y: 0, transformOrigin: FEET_ORIGIN });
      // some o vagalume inteiro, com a luz dos pés: quem anda agora é o ator
      const whole = (el: HTMLElement) => el.closest<HTMLElement>('.player-firefly') ?? el;
      const hidden = [dest, ...(source ? [source] : [])].map(whole);
      for (const el of hidden) el.style.visibility = 'hidden';

      const camera = { y: window.scrollY };
      const cameraTarget = cameraY(section, dest);
      const fx: HTMLElement[] = [];
      const wisp = guideLight(src);
      fx.push(wisp);

      const finish = () => {
        for (const el of hidden) el.style.visibility = '';
        for (const el of fx) el.remove();
        gsap.set(actor, { autoAlpha: 0 });
        root.style.scrollBehavior = previousBehavior;
        delete root.dataset.cinematic;
        playing = false;
        timeline.current = null;
        setRunning(false);
        section.focus({ preventScroll: true });
        announceChange();
        scene.after?.();
      };

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: finish });
      scene.build({
        tl,
        actor,
        body,
        J: (id) => parts.get(id)!,
        src,
        offscreen,
        vw,
        vh,
        destRect: () => dest.getBoundingClientRect(),
        destFeet: () => {
          const d = dest.getBoundingClientRect();
          return { x: d.left + RIG_FEET.x * d.width, y: d.top + RIG_FEET.y * d.height };
        },
        wisp,
        camera: (at, duration) => {
          tl.to(
            camera,
            {
              y: cameraTarget,
              duration,
              ease: 'power2.inOut',
              onUpdate: () => window.scrollTo(0, camera.y),
            },
            at,
          );
        },
        fx,
      });

      timeline.current = tl;
      // só em desenvolvimento: permite pausar e inspecionar a cena quadro a quadro
      if (process.env.NODE_ENV !== 'production') {
        (window as unknown as { __jornada?: gsap.core.Timeline }).__jornada = tl;
      }
    };

    const onStart = () => play({ from, to, sectionId, build: descent });

    const onPassage = (event: Event) => {
      const detail = (event as CustomEvent<PassageDetail>).detail;
      play({
        from: detail.from,
        to: detail.to,
        sectionId: detail.sectionId,
        // a câmera para no topo da região, a não ser que o vagalume de
        // destino fique baixo demais: aí desce até ele aparecer inteiro
        cameraY: (section, dest) => {
          const top = section.getBoundingClientRect().top + window.scrollY;
          const feet = dest.getBoundingClientRect().bottom + window.scrollY;
          return Math.max(top, feet - window.innerHeight * 0.85);
        },
        build: (stage) => passage(stage, detail.style),
        after: detail.style === 'banco' ? () => window.dispatchEvent(new CustomEvent(BENCH_REST)) : undefined,
      });
    };

    const onWheel = (event: WheelEvent) => {
      if (playing) {
        event.preventDefault();
        return;
      }
      if (window.scrollY > 4 || event.deltaY <= 0) return;
      event.preventDefault();
      onStart();
    };

    let touchY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (playing) {
        event.preventDefault();
        return;
      }
      const dy = touchY - (event.touches[0]?.clientY ?? touchY);
      if (window.scrollY > 4 || dy < 24) return;
      event.preventDefault();
      onStart();
    };

    window.addEventListener(JOURNEY_START, onStart);
    window.addEventListener(PASSAGE_EVENT, onPassage);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKey);

    return () => {
      timeline.current?.kill();
      window.removeEventListener(JOURNEY_START, onStart);
      window.removeEventListener(PASSAGE_EVENT, onPassage);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [from, to, sectionId]);

  return (
    <>
      <div
        ref={actorRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed top-0 left-0 z-50 opacity-0"
      >
        <FireflyRig className="h-full" />
      </div>

      {running ? (
        <button
          type="button"
          onClick={() => timeline.current?.progress(1)}
          className="fixed right-5 bottom-5 z-50 inline-flex min-h-11 items-center gap-2 rounded-sm px-4 font-title text-xs tracking-[0.26em] text-bone-muted uppercase hover:text-glow"
        >
          {skipLabel}
          <span aria-hidden="true">▸</span>
        </button>
      ) : null}
    </>
  );
}

/** A descida do título: salto da borda, mergulho pelo poço, pouso na Clareira. */
function descent(stage: Stage) {
  const { tl, actor, body, J, src, vw, vh, camera, wisp } = stage;
  const wingsUp = [J('wing-upper'), J('wing-lower')];

  // a luz sai de sob os pés, passa à frente e desce pelo poço antes dele
  tl.to(wisp, { x: '+=' + vw * 0.16, y: '-=' + vh * 0.12, duration: 0.7, ease: 'sine.out' }, 0.2)
    .to(wisp, { x: vw * 0.5, y: vh * 0.72, duration: 0.9, ease: 'sine.inOut' }, 1.1);

  // 1 · antecipação: agacha, dobra os joelhos, recolhe as asas
  tl.addLabel('crouch', 0)
    .to(body, { scaleY: 0.88, scaleX: 1.07, duration: 0.3, ease: 'power2.inOut' }, 'crouch')
    .to(J('body'), { rotation: 28, duration: 0.3, ease: 'power2.inOut' }, 'crouch')
    .to(J('thigh-near'), { rotation: -64, duration: 0.3 }, 'crouch')
    .to(J('shin-near'), { rotation: 96, duration: 0.3 }, 'crouch')
    .to(J('thigh-far'), { rotation: 16, duration: 0.3 }, 'crouch')
    .to(J('shin-far'), { rotation: 34, duration: 0.3 }, 'crouch')
    .to(J('wing-upper'), { rotation: 40, duration: 0.3 }, 'crouch')
    .to(J('wing-lower'), { rotation: 24, duration: 0.3 }, 'crouch')
    .to(J('arm-near'), { rotation: 30, duration: 0.3 }, 'crouch');

  // 2 · salto: estica, sobe em arco para a frente, asas começam a bater
  tl.addLabel('leap', 0.3)
    .call(() => playSfx('pulo'), [], 'leap')
    .to(body, { scaleY: 1.1, scaleX: 0.94, duration: 0.16, ease: 'power3.out' }, 'leap')
    .to(body, { scaleY: 1, scaleX: 1, duration: 0.3 }, 'leap+=0.16')
    .to(actor, { x: src.left + vw * 0.12, duration: 0.6, ease: 'power1.out' }, 'leap')
    .to(actor, { y: src.top - vh * 0.17, duration: 0.6, ease: 'power2.out' }, 'leap')
    .to(J('body'), { rotation: 2, duration: 0.35 }, 'leap')
    .to(J('thigh-near'), { rotation: -6, duration: 0.2 }, 'leap')
    .to(J('shin-near'), { rotation: 12, duration: 0.2 }, 'leap')
    .to(J('thigh-far'), { rotation: 66, duration: 0.2 }, 'leap')
    .to(J('shin-far'), { rotation: -4, duration: 0.2 }, 'leap')
    .to(J('arm-near'), { rotation: -76, duration: 0.25 }, 'leap')
    .to(J('forearm-near'), { rotation: -18, duration: 0.25 }, 'leap')
    .to(J('arm-far'), { rotation: -60, duration: 0.25 }, 'leap')
    .fromTo(
      wingsUp,
      { rotation: 34 },
      { rotation: -34, duration: 0.07, ease: 'sine.inOut', repeat: 9, yoyo: true, stagger: 0.025 },
      'leap',
    );

  // 3 · topo do arco: vira de cabeça para baixo e encolhe tudo para mergulhar
  tl.addLabel('apex', 0.88)
    .to(J('body'), { rotation: 84, duration: 0.42, ease: 'power2.in' }, 'apex')
    .to(J('head'), { rotation: -34, duration: 0.42 }, 'apex')
    .to(J('thigh-near'), { rotation: -48, duration: 0.3 }, 'apex')
    .to(J('shin-near'), { rotation: 112, duration: 0.3 }, 'apex')
    .to(J('thigh-far'), { rotation: -26, duration: 0.3 }, 'apex')
    .to(J('shin-far'), { rotation: 96, duration: 0.3 }, 'apex')
    .to(J('arm-near'), { rotation: 40, duration: 0.3 }, 'apex')
    .to(J('arm-far'), { rotation: 50, duration: 0.3 }, 'apex')
    .to(wingsUp, { rotation: 66, duration: 0.24 }, 'apex+=0.18')
    .to(actor, { x: vw * 0.5 - src.width * 0.48, y: vh * 0.3, duration: 0.6, ease: 'power2.in' }, 'apex');

  // 4 · mergulho: a câmera desce pelo poço e o vagalume gira uma volta
  tl.addLabel('dive', 1.45);
  camera(1.35, 1.15);
  tl.to(J('body'), { rotation: '+=360', duration: 1.05, ease: 'power1.inOut' }, 'dive').to(
    actor,
    { x: '+=' + vw * 0.04, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 1 },
    'dive',
  );

  // 5 e 6 · abre as asas, plana até a pedra e pousa; o corpo deu uma volta
  // inteira no mergulho, então assenta na mesma pose, +360
  land(stage, 2.55, 360);
}

/** Abre as asas, freia, plana até o vagalume de destino e pousa com peso. */
function land({ tl, actor, body, J, src, destRect, destFeet, wisp }: Stage, at: number, spin = 0) {
  const wings = [J('wing-upper'), J('wing-lower')];

  // a luz chega antes e espera no ponto de pouso
  tl.to(wisp, { x: () => destFeet().x, y: () => destFeet().y, duration: 0.65, ease: 'power2.inOut' }, at - 0.2);

  tl.to(J('body'), { rotation: spin + 6, duration: 0.45, ease: 'back.out(1.8)' }, at)
    .to(J('head'), { rotation: -10, duration: 0.4 }, at)
    .fromTo(
      wings,
      { rotation: -30 },
      { rotation: 30, duration: 0.09, ease: 'sine.inOut', repeat: 6, yoyo: true, stagger: 0.03, immediateRender: false },
      at,
    )
    .to(J('thigh-near'), { rotation: -26, duration: 0.35 }, at + 0.1)
    .to(J('shin-near'), { rotation: 34, duration: 0.35 }, at + 0.1)
    .to(J('thigh-far'), { rotation: 30, duration: 0.35 }, at + 0.1)
    .to(J('shin-far'), { rotation: 6, duration: 0.35 }, at + 0.1)
    .to(J('arm-near'), { rotation: -20, duration: 0.35 }, at + 0.1)
    .to(J('arm-far'), { rotation: -10, duration: 0.35 }, at + 0.1)
    .to(
      actor,
      {
        x: () => destRect().left,
        y: () => destRect().top,
        scale: () => destRect().height / src.height,
        transformOrigin: '0 0',
        duration: 0.7,
        ease: 'power2.inOut',
      },
      at,
    );

  // pouso: o peso cai nos joelhos e o corpo assenta na pose de repouso
  const touch = at + 0.7;
  // ao pousar, a luz guia se acomoda e vira a luz dos pés de novo
  tl.to(wisp, { scale: 0.8, opacity: 0, duration: 0.3, ease: 'power1.in' }, touch + 0.25);
  tl.call(() => playSfx('pouso'), [], touch)
    .to(body, { scaleY: 0.86, scaleX: 1.08, duration: 0.1, ease: 'power2.out' }, touch)
    .to(body, { scaleY: 1, scaleX: 1, duration: 0.45, ease: 'elastic.out(1, 0.5)' }, touch + 0.1)
    .to(J('thigh-near'), { rotation: -56, duration: 0.1 }, touch)
    .to(J('shin-near'), { rotation: 84, duration: 0.1 }, touch);

  for (const spec of JOINTS) {
    const rest = spec.id === 'body' ? spec.rest + spin : spec.rest;
    tl.to(J(spec.id), { rotation: rest, duration: 0.4, ease: 'power2.out' }, touch + 0.15);
  }
}

/**
 * Uma passagem entre regiões: decola, atravessa a tela enquanto a câmera
 * desce até a próxima região e pousa no vagalume de lá. O miolo muda com
 * o estilo de cada passagem.
 */
function passage(stage: Stage, style: PassageStyle) {
  const { tl, actor, body, J, src, offscreen, vw, vh } = stage;
  const wings = [J('wing-upper'), J('wing-lower')];
  let t = 0;

  if (offscreen) {
    // a região de partida já rolou para fora: o ator entra voando por cima
    tl.to(actor, { y: vh * 0.14, duration: 0.45, ease: 'power2.out' }, 0);
    t = 0.3;
  } else {
    // antecipação e salto, como na borda do título, mais curtos
    tl.to(body, { scaleY: 0.88, scaleX: 1.07, duration: 0.24, ease: 'power2.inOut' }, 0)
      .to(J('body'), { rotation: 26, duration: 0.24, ease: 'power2.inOut' }, 0)
      .to(J('thigh-near'), { rotation: -60, duration: 0.24 }, 0)
      .to(J('shin-near'), { rotation: 92, duration: 0.24 }, 0)
      .to(J('thigh-far'), { rotation: 14, duration: 0.24 }, 0)
      .to(J('shin-far'), { rotation: 30, duration: 0.24 }, 0)
      .to(wings, { rotation: 36, duration: 0.24 }, 0);
    t = 0.24;
    tl.call(() => playSfx('pulo'), [], t)
      .to(body, { scaleY: 1.08, scaleX: 0.95, duration: 0.14, ease: 'power3.out' }, t)
      .to(body, { scaleY: 1, scaleX: 1, duration: 0.25 }, t + 0.14)
      .to(actor, { y: src.top - vh * 0.14, duration: 0.45, ease: 'power2.out' }, t)
      .to(actor, { x: src.left + vw * 0.06, duration: 0.45, ease: 'power1.out' }, t)
      .to(J('body'), { rotation: 4, duration: 0.3 }, t)
      .to(J('thigh-near'), { rotation: -10, duration: 0.2 }, t)
      .to(J('shin-near'), { rotation: 20, duration: 0.2 }, t)
      .to(J('thigh-far'), { rotation: 60, duration: 0.2 }, t)
      .to(J('shin-far'), { rotation: 0, duration: 0.2 }, t);
    t += 0.36;
  }

  const travel = style === 'planar' ? 1.7 : 1.3;
  const mid = { x: vw * 0.5 - src.width * 0.48, y: vh * 0.3 };
  stage.camera(t, travel);

  // a luz sobe de sob os pés, passa à frente e desce mostrando o caminho
  tl.to(stage.wisp, { y: '-=' + src.height * 0.5, x: '+=' + vw * 0.06, duration: 0.45, ease: 'sine.out' }, 0.05).to(
    stage.wisp,
    { x: vw * 0.5 + src.width * 0.6, y: vh * 0.3 + src.height * 1.5, duration: travel * 0.75, ease: 'sine.inOut' },
    t,
  );

  if (style !== 'planar') {
    // as asas batem durante toda a viagem
    tl.fromTo(
      wings,
      { rotation: 34 },
      {
        rotation: -34,
        duration: 0.08,
        ease: 'sine.inOut',
        repeat: Math.round(travel / 0.08) | 1,
        yoyo: true,
        stagger: 0.025,
        immediateRender: false,
      },
      t - 0.2,
    );
  }

  if (style === 'salto' || style === 'banco') {
    // um arco largo até o meio da tela, inclinado para a frente, pernas recolhidas
    tl.to(actor, { x: mid.x, y: mid.y, duration: travel * 0.7, ease: 'sine.inOut' }, t)
      .to(actor, { y: '+=' + vh * 0.04, duration: travel * 0.3, ease: 'sine.inOut' }, t + travel * 0.7)
      .to(J('body'), { rotation: 22, duration: 0.4 }, t)
      .to(J('thigh-near'), { rotation: -48, duration: 0.3 }, t)
      .to(J('shin-near'), { rotation: 96, duration: 0.3 }, t)
      .to(J('thigh-far'), { rotation: -20, duration: 0.3 }, t)
      .to(J('shin-far'), { rotation: 88, duration: 0.3 }, t)
      .to(J('arm-near'), { rotation: -70, duration: 0.3 }, t)
      .to(J('arm-far'), { rotation: -56, duration: 0.3 }, t);
  }

  if (style === 'investida') {
    // a investida: deita no ar e dispara pela tela, deixando um rastro de luz
    const dash = t + 0.25;
    tl.to(actor, { x: vw * 0.12, y: mid.y, duration: 0.25, ease: 'power2.out' }, t)
      .to(J('body'), { rotation: 80, duration: 0.2 }, t)
      .to(J('head'), { rotation: -60, duration: 0.2 }, t)
      .to(J('thigh-near'), { rotation: 20, duration: 0.2 }, t)
      .to(J('thigh-far'), { rotation: 30, duration: 0.2 }, t)
      .to(J('arm-near'), { rotation: 60, duration: 0.2 }, t)
      .call(() => playSfx('pulo'), [], dash)
      .call(() => streak(stage), [], dash)
      .to(actor, { x: vw * 0.72, duration: 0.28, ease: 'expo.out' }, dash)
      .to(actor, { x: mid.x, duration: travel - 0.55, ease: 'sine.inOut' }, dash + 0.3)
      .to(J('body'), { rotation: 16, duration: 0.4 }, dash + 0.3)
      .to(J('head'), { rotation: -16, duration: 0.4 }, dash + 0.3);
  }

  if (style === 'planar') {
    // asas abertas e paradas, o corpo deitado, descendo em balanço suave
    tl.to(J('wing-upper'), { rotation: -26, duration: 0.3 }, t)
      .to(J('wing-lower'), { rotation: -14, duration: 0.3 }, t)
      .to(J('body'), { rotation: 36, duration: 0.5 }, t)
      .to(J('head'), { rotation: -30, duration: 0.5 }, t)
      .to(J('thigh-near'), { rotation: 10, duration: 0.4 }, t)
      .to(J('thigh-far'), { rotation: 24, duration: 0.4 }, t)
      .to(J('arm-near'), { rotation: -96, duration: 0.4 }, t)
      .to(J('arm-far'), { rotation: -84, duration: 0.4 }, t)
      .to(actor, { x: vw * 0.66, y: vh * 0.24, duration: travel * 0.5, ease: 'sine.inOut' }, t)
      .to(actor, { x: mid.x, y: mid.y, duration: travel * 0.5, ease: 'sine.inOut' }, t + travel * 0.5)
      .to(J('wing-upper'), { rotation: -18, duration: 0.4, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t + 0.3);
  }

  land(stage, t + travel);
}

/** O rastro da investida: uma faixa de luz que estica atrás do ator e se apaga. */
function streak({ actor, fx }: Stage) {
  const r = actor.getBoundingClientRect();
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  Object.assign(el.style, {
    position: 'fixed',
    left: `${r.left + r.width * 0.3}px`,
    top: `${r.top + r.height * 0.46}px`,
    width: `${window.innerWidth * 0.6}px`,
    height: `${Math.max(6, r.height * 0.08)}px`,
    borderRadius: '999px',
    background: 'linear-gradient(to right, rgba(253,208,95,0), rgba(253,208,95,0.85) 70%, #fff3c4)',
    boxShadow: '0 0 18px rgba(253,208,95,0.7)',
    pointerEvents: 'none',
    zIndex: '49',
    transformOrigin: '0 50%',
  });
  document.body.appendChild(el);
  fx.push(el);
  gsap.fromTo(el, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: 0.28, ease: 'expo.out' });
  gsap.to(el, { opacity: 0, scaleY: 0.2, duration: 0.5, delay: 0.25, ease: 'power2.in' });
}

/**
 * A luz guia: o mesmo brilho que fica sob os pés do vagalume, solto na
 * página. Nasce exatamente onde estava a luz do vagalume de partida.
 */
function guideLight(src: Box): HTMLElement {
  const size = src.height * 0.5;
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.className = 'guide-light';
  Object.assign(el.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: `${size}px`,
    height: `${size}px`,
    pointerEvents: 'none',
    zIndex: '49',
  });
  document.body.appendChild(el);
  gsap.set(el, {
    x: src.left + RIG_FEET.x * src.width,
    y: src.top + RIG_FEET.y * src.height,
    xPercent: -50,
    yPercent: -50,
  });
  return el;
}
