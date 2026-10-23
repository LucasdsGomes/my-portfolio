'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import gsap from 'gsap';
import { FireflyRig } from '../rig/FireflyRig';
import { FEET_ORIGIN, RIG_BOX, RIG_FEET, SKELETON, type JointSpec } from '../rig/skeleton';
import { JOURNEY_START } from '../journey/events';
import { registerPlayer } from './controls';
import { playSfx } from '../audio/sound';
import { pickReaction, runReaction, type ReactionKit } from './reactions';

interface PlayerFireflyProps {
  /** nome do ponto de partida/chegada das coreografias */
  anchor: string;
  /** rótulo do botão de cutucar, para leitor de tela */
  label: string;
  /** posição e altura do vagalume; a largura sai da proporção */
  className?: string;
  style?: CSSProperties;
  /** trecho onde dá para andar, em fração da largura do chão */
  range: readonly [number, number];
  /** o chão: o pai posicionado, ou um seletor para closest() */
  ground?: 'parent' | string;
  /** passar da ponta direita; sem isso, a ponta é uma parede */
  onExitRight?: () => void;
}

function walk(spec: JointSpec, out: JointSpec[] = []): JointSpec[] {
  out.push(spec);
  spec.children?.forEach((child) => walk(child, out));
  return out;
}

const JOINTS = walk(SKELETON);
const REST = Object.fromEntries(JOINTS.map((j) => [j.id, j.rest])) as Record<string, number>;

/**
 * O vagalume que você controla: A/D ou ←/→ andam, W pula, clique cutuca.
 *
 * Três camadas de transformação, cada uma com um dono:
 *   o botão     posição no cenário (vem de quem usa)
 *   o "mover"   deslocamento da caminhada e do pulo
 *   o "flipper" o lado para onde ele olha
 * e por dentro as juntas, que a caminhada, o pulo e as reações giram.
 * Tudo passa pelo GSAP, para que as reações e a caminhada nunca briguem
 * pelo mesmo valor.
 */
export function PlayerFirefly({
  anchor,
  label,
  className = '',
  style,
  range,
  ground = 'parent',
  onExitRight,
}: PlayerFireflyProps) {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const exitRef = useRef(onExitRight);

  useEffect(() => {
    exitRef.current = onExitRight;
  }, [onExitRight]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const mover = moverRef.current;
    const flipper = flipRef.current;
    const rig = wrap?.querySelector<HTMLElement>('[data-rig]');
    const body = wrap?.querySelector<HTMLElement>('[data-rig-body]');
    if (!wrap || !mover || !flipper || !rig || !body) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = (id: string) => wrap.querySelector<HTMLElement>(`[data-joint="${id}"]`)!;
    const set = Object.fromEntries(
      JOINTS.map((j) => [j.id, gsap.quickSetter(el(j.id), 'rotation', 'deg') as (v: number) => void]),
    );
    const setX = gsap.quickSetter(mover, 'x', 'px') as (v: number) => void;
    const setY = gsap.quickSetter(mover, 'y', 'px') as (v: number) => void;
    const setBob = gsap.quickSetter(body, 'y', 'px') as (v: number) => void;
    gsap.set(body, { transformOrigin: FEET_ORIGIN });
    gsap.set(flipper, { transformOrigin: `${RIG_FEET.x * 100}% ${RIG_FEET.y * 100}%` });

    const state = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      facing: 1,
      left: false,
      right: false,
      grounded: true,
      phase: 0,
      busy: false,
      exited: false,
      min: -Infinity,
      max: Infinity,
      last: 0,
      frame: 0,
      running: false,
    };

    const height = () => wrap.clientHeight;

    /** recalcula até onde dá para andar, a partir de onde ele está agora */
    const measure = () => {
      const groundEl =
        ground === 'parent' ? (wrap.offsetParent as HTMLElement | null) : wrap.closest<HTMLElement>(ground);
      if (!groundEl) return;
      const g = groundEl.getBoundingClientRect();
      // mede pelo botão, que não anda nem espelha: a caixa do vagalume
      // virado para a esquerda é refletida em torno dos pés e erraria a conta
      const r = wrap.getBoundingClientRect();
      const feetHome = r.left + RIG_FEET.x * r.width - g.left;
      state.min = range[0] * g.width - feetHome;
      state.max = range[1] * g.width - feetHome;
    };

    const restPose = (duration = 0.25) => {
      for (const j of JOINTS) gsap.to(el(j.id), { rotation: REST[j.id], duration, ease: 'power2.out' });
      gsap.to(body, { y: 0, duration, ease: 'power2.out' });
      rig.dataset.idle = 'true';
    };

    const pose = (dt: number) => {
      const h = height();
      if (!state.grounded) {
        // no ar: pernas recolhidas, asas batendo rápido
        const t = performance.now() / 1000;
        set['thigh-near']!(-40);
        set['shin-near']!(72);
        set['thigh-far']!(28);
        set['shin-far']!(64);
        set['arm-near']!(-56);
        set['arm-far']!(-40);
        set['wing-upper']!(REST['wing-upper']! + Math.sin(t * 46) * 32);
        set['wing-lower']!(REST['wing-lower']! + Math.sin(t * 46 + 0.6) * 26);
        set['body']!(REST['body']! + state.vy / (h * 30));
        setBob(0);
        return;
      }

      const moving = Math.abs(state.vx) > h * 0.05;
      if (!moving) return;

      // um passo a cada ~0,45 altura percorrida
      state.phase += (Math.abs(state.vx) * dt) / (h * 0.45) * Math.PI;
      const p = state.phase;
      const s = Math.sin(p);
      set['thigh-near']!(-14 + 28 * s);
      set['thigh-far']!(14 - 28 * s);
      set['shin-near']!(18 + 38 * Math.max(0, -Math.cos(p)));
      set['shin-far']!(18 + 38 * Math.max(0, Math.cos(p)));
      set['foot-near']!(-6 + 12 * Math.sin(p - 0.6));
      set['foot-far']!(-6 - 12 * Math.sin(p - 0.6));
      set['arm-near']!(-12 - 24 * s);
      set['arm-far']!(8 + 24 * s);
      set['body']!(REST['body']! + 5);
      set['head']!(REST['head']! + 2.5 * Math.sin(p * 2));
      set['wing-upper']!(REST['wing-upper']! + 5 * Math.sin(p * 2));
      set['wing-lower']!(REST['wing-lower']! + 4 * Math.sin(p * 2 + 0.5));
      setBob(-Math.abs(s) * 14);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - state.last) / 1000, 1 / 30);
      state.last = now;
      const h = height();
      const speed = h * 1.05;
      const want = (state.right ? 1 : 0) - (state.left ? 1 : 0);

      // acelera e freia, em vez de ligar e desligar a velocidade
      const target = want * speed;
      const accel = (state.grounded ? 9 : 4) * speed;
      const delta = target - state.vx;
      state.vx += Math.sign(delta) * Math.min(Math.abs(delta), accel * dt);

      if (want !== 0 && want !== state.facing) {
        state.facing = want;
        gsap.set(flipper, { scaleX: want });
      }

      state.x += state.vx * dt;
      if (state.x > state.max) {
        if (exitRef.current && !state.exited) {
          state.exited = true;
          state.left = state.right = false;
          state.vx = 0;
          exitRef.current();
          return stop();
        }
        state.x = state.max;
        state.vx = 0;
      }
      if (state.x < state.min) {
        state.x = state.min;
        state.vx = 0;
      }

      if (!state.grounded) {
        const g = h * 6.2;
        state.vy += g * dt;
        state.y += state.vy * dt;
        if (state.y >= 0) {
          state.y = 0;
          state.vy = 0;
          state.grounded = true;
          playSfx('pouso');
          // pouso: o peso cai e volta
          gsap.fromTo(body, { scaleY: 0.86, scaleX: 1.07 }, { scaleY: 1, scaleX: 1, duration: 0.3, ease: 'back.out(3)' });
        }
      }

      setX(state.x);
      setY(state.y);
      pose(dt);

      const still = state.grounded && want === 0 && Math.abs(state.vx) < 1;
      if (still) {
        state.vx = 0;
        stop();
        restPose();
        return;
      }
      state.frame = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (state.running) return;
      state.running = true;
      delete rig.dataset.idle;
      state.last = performance.now();
      measure();
      state.frame = requestAnimationFrame(tick);
    };

    function stop() {
      state.running = false;
      cancelAnimationFrame(state.frame);
    }

    const press = (action: 'left' | 'right' | 'jump', down: boolean) => {
      if (state.busy || reduced) return;
      if (action === 'left') state.left = down;
      if (action === 'right') state.right = down;
      if (action === 'jump' && down && state.grounded) {
        state.grounded = false;
        state.vy = -height() * 2.35;
        playSfx('pulo');
      }
      if (down) startLoop();
    };

    const unregister = registerPlayer({ element: wrap, press });

    // a jornada mediu o vagalume e partiu: ele volta para casa, escondido
    const onJourney = () =>
      window.setTimeout(() => {
        stop();
        Object.assign(state, { x: 0, y: 0, vx: 0, vy: 0, left: false, right: false, grounded: true, exited: false });
        setX(0);
        setY(0);
        state.facing = 1;
        gsap.set(flipper, { scaleX: 1 });
        restPose(0);
      }, 0);
    window.addEventListener(JOURNEY_START, onJourney);

    // cutucar: cada clique uma reação; vários seguidos o deixam tonto
    const clicks: number[] = [];
    const kit: ReactionKit = { joint: el, body, mover, wrap, rest: REST, height };
    let current: gsap.core.Timeline | null = null;

    const react = (kind: Parameters<typeof runReaction>[0]) => {
      state.busy = true;
      stop();
      delete rig.dataset.idle;
      current = runReaction(kind, kit, () => {
        current = null;
        state.busy = false;
        restPose();
      });
    };

    const onPoke = (event: MouseEvent) => {
      event.stopPropagation();
      playSfx('cutucar');
      if (reduced || !state.grounded) return;

      // os cliques contam mesmo durante uma reação: é justamente cutucar
      // sem parar, enquanto ele ainda reage, que o deixa tonto
      const now = performance.now();
      clicks.push(now);
      while (clicks.length && now - clicks[0]! > 1800) clicks.shift();

      if (clicks.length >= 4) {
        clicks.length = 0;
        current?.kill();
        react('dizzy');
        return;
      }
      if (!state.busy) react(pickReaction());
    };
    wrap.addEventListener('click', onPoke);

    return () => {
      stop();
      unregister();
      window.removeEventListener(JOURNEY_START, onJourney);
      wrap.removeEventListener('click', onPoke);
    };
  }, [range, ground]);

  return (
    <button
      ref={wrapRef}
      type="button"
      aria-label={label}
      className={`player-firefly block cursor-pointer rounded-full ${className}`}
      style={{ aspectRatio: `${RIG_BOX.width} / ${RIG_BOX.height}`, ...style }}
    >
      <div ref={moverRef} className="h-full w-full">
        <div ref={flipRef} className="h-full w-full">
          <FireflyRig idle anchor={anchor} className="h-full" />
        </div>
      </div>
    </button>
  );
}
