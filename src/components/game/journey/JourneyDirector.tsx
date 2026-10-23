'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { FireflyRig } from '../rig/FireflyRig';
import { FEET_ORIGIN, SKELETON, type JointSpec } from '../rig/skeleton';
import { JOURNEY_START } from './events';
import { playSfx } from '../audio/sound';

interface JourneyDirectorProps {
  /** vagalume de onde a cena parte */
  from: string;
  /** vagalume onde a cena termina */
  to: string;
  /** seção que a câmera leva até o topo da tela */
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

/**
 * A primeira cena da jornada: o vagalume salta da borda do título, mergulha
 * pelo poço enquanto a câmera desce e pousa na Clareira.
 *
 * Como funciona: o vagalume parado na borda some, e um "ator" idêntico,
 * fixo sobre a página, assume a mesma posição. O ator é coreografado com
 * tempo próprio (antecipação, arco, peso no pouso), em vez de arrastado
 * pela barra de rolagem. No fim ele cai exatamente onde está o vagalume da
 * Clareira, que reaparece, e o ator some.
 *
 * Dispara pelo menu ou pela primeira rolagem para baixo no topo. Dura
 * cerca de 3,5 s; Esc ou o botão "Pular" vão direto ao fim. Com movimento
 * reduzido, não há cena: a página vai direto para a Clareira.
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

    const jumpToSection = () => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY);
      section.focus({ preventScroll: true });
    };

    const onKey = (event: KeyboardEvent) => {
      if (!playing) return;
      if (event.key === 'Escape') timeline.current?.progress(1);
      else if (SCROLL_KEYS.has(event.key)) event.preventDefault();
    };

    const start = () => {
      if (playing) return;
      const source = anchor(from);
      const dest = anchor(to);
      const section = document.getElementById(sectionId);
      const parts = new Map(JOINTS.map((spec) => [spec.id, joint(spec.id)]));
      const body = actor.querySelector<HTMLElement>('[data-rig-body]');
      if (reduced || !source || !dest || !section || !body || [...parts.values()].some((el) => !el)) {
        jumpToSection();
        return;
      }

      playing = true;
      setRunning(true);

      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      root.dataset.cinematic = 'true';

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const src = source.getBoundingClientRect();

      // o ator assume o lugar e o tamanho do vagalume da borda
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
      gsap.set(body, { scaleX: 1, scaleY: 1, transformOrigin: FEET_ORIGIN });
      source.style.visibility = 'hidden';
      dest.style.visibility = 'hidden';

      const camera = { y: window.scrollY };
      const cameraTarget = section.getBoundingClientRect().top + window.scrollY;

      const finish = () => {
        dest.style.visibility = '';
        source.style.visibility = '';
        gsap.set(actor, { autoAlpha: 0 });
        root.style.scrollBehavior = previousBehavior;
        delete root.dataset.cinematic;
        playing = false;
        timeline.current = null;
        setRunning(false);
        section.focus({ preventScroll: true });
      };

      const J = (id: string) => parts.get(id)!;
      const wingsUp = [J('wing-upper'), J('wing-lower')];
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: finish });

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
      tl.addLabel('dive', 1.45)
        .to(
          camera,
          {
            y: cameraTarget,
            duration: 1.15,
            ease: 'power2.inOut',
            onUpdate: () => window.scrollTo(0, camera.y),
          },
          'dive-=0.1',
        )
        .to(J('body'), { rotation: '+=360', duration: 1.05, ease: 'power1.inOut' }, 'dive')
        .to(actor, { x: '+=' + vw * 0.04, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 'dive');

      // 5 · abre as asas, freia e plana até a pedra da Clareira
      const destRect = () => dest.getBoundingClientRect();
      tl.addLabel('flare', 2.55)
        .to(J('body'), { rotation: 360 + 6, duration: 0.45, ease: 'back.out(1.8)' }, 'flare')
        .to(J('head'), { rotation: -10, duration: 0.4 }, 'flare')
        .fromTo(
          wingsUp,
          { rotation: -30 },
          { rotation: 30, duration: 0.09, ease: 'sine.inOut', repeat: 6, yoyo: true, stagger: 0.03 },
          'flare',
        )
        .to(J('thigh-near'), { rotation: -26, duration: 0.35 }, 'flare+=0.1')
        .to(J('shin-near'), { rotation: 34, duration: 0.35 }, 'flare+=0.1')
        .to(J('thigh-far'), { rotation: 30, duration: 0.35 }, 'flare+=0.1')
        .to(J('shin-far'), { rotation: 6, duration: 0.35 }, 'flare+=0.1')
        .to(J('arm-near'), { rotation: -20, duration: 0.35 }, 'flare+=0.1')
        .to(J('arm-far'), { rotation: -10, duration: 0.35 }, 'flare+=0.1')
        .to(
          actor,
          {
            // calculado na hora: a câmera já parou e o destino está na tela
            x: () => destRect().left,
            y: () => destRect().top,
            scale: () => destRect().height / src.height,
            transformOrigin: '0 0',
            duration: 0.7,
            ease: 'power2.inOut',
          },
          'flare',
        );

      // 6 · pouso: o peso cai nos joelhos e o corpo assenta na pose de repouso
      tl.addLabel('land', 3.25)
        .call(() => playSfx('pouso'), [], 'land')
        .to(body, { scaleY: 0.86, scaleX: 1.08, duration: 0.1, ease: 'power2.out' }, 'land')
        .to(body, { scaleY: 1, scaleX: 1, duration: 0.45, ease: 'elastic.out(1, 0.5)' }, 'land+=0.1')
        .to(J('thigh-near'), { rotation: -56, duration: 0.1 }, 'land')
        .to(J('shin-near'), { rotation: 84, duration: 0.1 }, 'land');

      tl.addLabel('settle', 3.4);
      for (const spec of JOINTS) {
        // o corpo deu uma volta inteira no mergulho: assenta na mesma pose, +360
        const rest = spec.id === 'body' ? spec.rest + 360 : spec.rest;
        tl.to(J(spec.id), { rotation: rest, duration: 0.4, ease: 'power2.out' }, 'settle');
      }

      timeline.current = tl;
      // só em desenvolvimento: permite pausar e inspecionar a cena quadro a quadro
      if (process.env.NODE_ENV !== 'production') {
        (window as unknown as { __jornada?: gsap.core.Timeline }).__jornada = tl;
      }
    };

    const onStart = () => start();
    const onWheel = (event: WheelEvent) => {
      if (playing) {
        event.preventDefault();
        return;
      }
      if (window.scrollY > 4 || event.deltaY <= 0) return;
      event.preventDefault();
      start();
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
      start();
    };

    window.addEventListener(JOURNEY_START, onStart);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKey);

    return () => {
      timeline.current?.kill();
      window.removeEventListener(JOURNEY_START, onStart);
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
