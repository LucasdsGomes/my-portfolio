'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import gsap from 'gsap';
import { FireflyRig } from '../rig/FireflyRig';
import { FEET_ORIGIN, RIG_BOX, RIG_FEET, SKELETON, type JointSpec } from '../rig/skeleton';
import {
  HOP_EVENT,
  JOURNEY_RESET,
  JOURNEY_START,
  PASSAGE_EVENT,
  SIT_EVENT,
  type HopDetail,
  type SitDetail,
} from '../journey/events';
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
  /** acena na primeira vez em que a região dele aparece na tela */
  greet?: boolean;
}

function walk(spec: JointSpec, out: JointSpec[] = []): JointSpec[] {
  out.push(spec);
  spec.children?.forEach((child) => walk(child, out));
  return out;
}

const JOINTS = walk(SKELETON);
const REST = Object.fromEntries(JOINTS.map((j) => [j.id, j.rest])) as Record<string, number>;

/** sentado: coxas para a frente, canelas penduradas, mãos no assento */
const SIT_POSE: Record<string, number> = {
  body: 0,
  head: -8,
  'thigh-near': -88,
  'shin-near': 88,
  'foot-near': -10,
  'thigh-far': -78,
  'shin-far': 84,
  'foot-far': -10,
  'arm-near': 18,
  'forearm-near': -30,
  'arm-far': 24,
  'forearm-far': -26,
  'wing-upper': REST['wing-upper']! + 10,
  'wing-lower': REST['wing-lower']! + 8,
};

type SeatedGesture = 'swing' | 'light' | 'stretch' | 'doze';
const SEATED: readonly SeatedGesture[] = ['swing', 'light', 'stretch', 'doze'];

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
  greet = false,
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
    // a luz sob os pés esmaece e encolhe quanto mais alto ele estiver
    const glow = wrap.querySelector<HTMLElement>('[data-glow]');
    const setLift = (lift: number) => {
      if (!glow) return;
      const l = Math.min(1, Math.max(0, lift));
      glow.style.opacity = String(1 - 0.65 * l);
      glow.style.scale = String(1 - 0.45 * l);
    };
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
      const before = Math.floor(state.phase / Math.PI + 0.5);
      state.phase += (Math.abs(state.vx) * dt) / (h * 0.45) * Math.PI;
      const p = state.phase;
      // o pé toca o chão quando a coxa chega no extremo do balanço
      if (Math.floor(p / Math.PI + 0.5) !== before) playSfx('passo');
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
      setLift(-state.y / (h * 0.8));
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

    // sentado num banco: o quadril fica preso ao assento até alguém se mexer
    let seated = false;
    let seatedWait: gsap.core.Tween | null = null;
    let seatedMove: gsap.core.Timeline | null = null;
    let lastGesture: SeatedGesture | null = null;

    const stopSeatedIdle = () => {
      seatedWait?.kill();
      seatedMove?.kill();
      seatedWait = null;
      seatedMove = null;
    };

    /**
     * Enquanto descansa, de tempos em tempos ele faz alguma coisa: balança
     * as pernas, olha a luz do abismo, se espreguiça ou cochila e acorda
     * num susto. Cada gesto volta exatamente à pose sentada.
     */
    const scheduleSeated = (delay = 2.2 + Math.random() * 2.6) => {
      seatedWait = gsap.delayedCall(delay, seatedGesture);
    };

    function seatedGesture() {
      if (!seated || state.busy) {
        scheduleSeated();
        return;
      }
      const pool = SEATED.filter((g) => g !== lastGesture);
      const kind = pool[Math.floor(Math.random() * pool.length)]!;
      lastGesture = kind;
      const P = SIT_POSE;
      const wings = [el('wing-upper'), el('wing-lower')];
      const tl = gsap.timeline({
        onComplete: () => {
          seatedMove = null;
          scheduleSeated();
        },
      });

      if (kind === 'swing') {
        // as canelas balançam no ar, uma depois da outra
        tl.to(el('shin-near'), { rotation: P['shin-near']! - 28, duration: 0.32, ease: 'sine.inOut', yoyo: true, repeat: 5 }, 0)
          .to(el('shin-far'), { rotation: P['shin-far']! - 24, duration: 0.32, ease: 'sine.inOut', yoyo: true, repeat: 5 }, 0.16)
          .to(el('head'), { rotation: P['head']! + 6, duration: 0.64, ease: 'sine.inOut', yoyo: true, repeat: 2 }, 0);
      }

      if (kind === 'light') {
        // ergue a cabeça para a luz do abismo; as asas tremulam
        tl.to(el('head'), { rotation: P['head']! - 24, duration: 0.6, ease: 'power2.out' }, 0)
          .to(el('body'), { rotation: P['body']! - 6, duration: 0.6 }, 0)
          .to(wings, { rotation: '-=14', duration: 0.12, ease: 'sine.inOut', yoyo: true, repeat: 5 }, 0.5)
          .to(el('head'), { rotation: P['head']!, duration: 0.6, ease: 'power2.inOut' }, 2)
          .to(el('body'), { rotation: P['body']!, duration: 0.6, ease: 'power2.inOut' }, 2);
      }

      if (kind === 'stretch') {
        // braços para cima, asas abertas, segura e relaxa
        tl.to(el('arm-near'), { rotation: -160, duration: 0.5, ease: 'power2.out' }, 0)
          .to(el('arm-far'), { rotation: -150, duration: 0.5, ease: 'power2.out' }, 0.06)
          .to(el('forearm-near'), { rotation: -10, duration: 0.5 }, 0)
          .to(el('forearm-far'), { rotation: -8, duration: 0.5 }, 0.06)
          .to(el('body'), { rotation: P['body']! - 8, duration: 0.5 }, 0)
          .to(el('head'), { rotation: P['head']! - 12, duration: 0.5 }, 0)
          .to(el('wing-upper'), { rotation: P['wing-upper']! - 30, duration: 0.5 }, 0)
          .to(el('wing-lower'), { rotation: P['wing-lower']! - 20, duration: 0.5 }, 0);
        for (const id of ['arm-near', 'arm-far', 'forearm-near', 'forearm-far', 'body', 'head', 'wing-upper', 'wing-lower']) {
          tl.to(el(id), { rotation: P[id]!, duration: 0.55, ease: 'power2.inOut' }, 1.15);
        }
      }

      if (kind === 'doze') {
        // a cabeça pesa devagar... e ele acorda num susto, zumbindo as asas
        tl.to(el('head'), { rotation: P['head']! + 26, duration: 1.4, ease: 'sine.inOut' }, 0)
          .to(el('body'), { rotation: P['body']! + 8, duration: 1.4, ease: 'sine.inOut' }, 0)
          .to(el('arm-near'), { rotation: P['arm-near']! + 14, duration: 1.4, ease: 'sine.inOut' }, 0)
          .to(el('head'), { rotation: P['head']! - 10, duration: 0.12, ease: 'power3.out' }, 2.3)
          .to(el('body'), { rotation: P['body']!, duration: 0.12, ease: 'power3.out' }, 2.3)
          .to(el('arm-near'), { rotation: P['arm-near']!, duration: 0.2 }, 2.3)
          .to(wings, { rotation: '-=22', duration: 0.04, ease: 'none', yoyo: true, repeat: 7 }, 2.3)
          .to(el('head'), { rotation: P['head']!, duration: 0.4 }, 2.6);
      }

      seatedMove = tl;
    }

    const setSeated = (value: boolean) => {
      seated = value;
      if (value) wrap.dataset.seated = 'true';
      else delete wrap.dataset.seated;
    };

    const standUp = (then?: () => void) => {
      setSeated(false);
      stopSeatedIdle();
      state.busy = true;
      delete rig.dataset.idle;
      const tl = gsap.timeline({
        onComplete: () => {
          state.busy = false;
          state.y = 0;
          restPose();
          then?.();
        },
      });
      for (const j of JOINTS) tl.to(el(j.id), { rotation: REST[j.id], duration: 0.25, ease: 'power2.out' }, 0);
      tl.to(mover, { y: state.y - height() * 0.12, duration: 0.16, ease: 'power2.out' }, 0).to(mover, {
        y: 0,
        duration: 0.24,
        ease: 'power2.in',
        onComplete: () => playSfx('pouso'),
      });
    };

    const press = (action: 'left' | 'right' | 'jump', down: boolean) => {
      if (state.busy || reduced) return;
      if (seated && down) {
        standUp();
        return;
      }
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

    // uma cena mediu o vagalume e partiu: ele volta para casa, escondido
    const onJourney = () =>
      window.setTimeout(() => {
        stop();
        stopSeatedIdle();
        current?.kill();
        gsap.killTweensOf(mover);
        setSeated(false);
        setLift(0);
        Object.assign(state, {
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          left: false,
          right: false,
          grounded: true,
          exited: false,
          busy: false,
        });
        setX(0);
        setY(0);
        state.facing = 1;
        gsap.set(flipper, { scaleX: 1 });
        restPose(0);
      }, 0);
    window.addEventListener(JOURNEY_START, onJourney);
    window.addEventListener(PASSAGE_EVENT, onJourney);

    /**
     * Sentar num banco pintado no cenário. O evento traz onde fica o meio do
     * assento, em fração do chão; daqui se calcula quanto andar e subir para
     * o quadril (a origem do esqueleto) cair exatamente sobre ele.
     */
    const onSit = (event: Event) => {
      const seat = (event as CustomEvent<SitDetail>).detail;
      if (seat.anchor !== anchor || state.busy) return;
      // já sentado: levanta e senta de novo, para o descanso se ver outra vez
      if (seated) standUp(() => sit(seat));
      else sit(seat);
    };

    const sit = (seat: SitDetail) => {
      const groundEl =
        ground === 'parent' ? (wrap.offsetParent as HTMLElement | null) : wrap.closest<HTMLElement>(ground);
      if (!groundEl) return;
      stop();
      state.left = state.right = false;
      state.vx = 0;

      const g = groundEl.getBoundingClientRect();
      const r = wrap.getBoundingClientRect();
      const s = r.height / RIG_BOX.height;
      const feetX = r.left + RIG_FEET.x * r.width - g.left;
      const feetY = r.top + RIG_FEET.y * r.height - g.top;
      // do pé até o quadril, em px de tela: o quadril é a origem do esqueleto
      const hipX = -(RIG_FEET.x * RIG_BOX.width + RIG_BOX.x) * s;
      const hipY = -(RIG_FEET.y * RIG_BOX.height + RIG_BOX.y) * s;
      const tx = seat.x * g.width - feetX - hipX;
      const ty = seat.y * g.height - feetY - hipY;
      const walkFrom = state.x;

      const sitPose = SIT_POSE;

      setSeated(true);
      state.busy = true;
      delete rig.dataset.idle;

      const finish = () => {
        state.x = tx;
        state.y = ty;
        state.busy = false;
        rig.dataset.idle = 'true';
        if (!reduced) scheduleSeated(1.4);
      };

      if (reduced) {
        gsap.set(mover, { x: tx, y: ty });
        gsap.set(flipper, { scaleX: 1 });
        for (const [id, deg] of Object.entries(sitPose)) gsap.set(el(id), { rotation: deg });
        finish();
        return;
      }

      const distance = Math.abs(tx - walkFrom);
      const walkTime = Math.max(0.3, distance / (height() * 1.05));
      const tl = gsap.timeline({ onComplete: finish });

      // anda até o banco, com as pernas indo e vindo
      tl.set(flipper, { scaleX: tx < walkFrom ? -1 : 1 })
        .to(mover, { x: tx, duration: walkTime, ease: 'power1.inOut' }, 0)
        .to(el('thigh-near'), { rotation: 14, duration: 0.18, yoyo: true, repeat: Math.ceil(walkTime / 0.18), ease: 'sine.inOut' }, 0)
        .to(el('thigh-far'), { rotation: -14, duration: 0.18, yoyo: true, repeat: Math.ceil(walkTime / 0.18), ease: 'sine.inOut' }, 0)
        // vira para a luz do abismo
        .set(flipper, { scaleX: 1 })
        // sobe no assento num pulinho
        .to(mover, { y: ty - height() * 0.14, duration: 0.22, ease: 'power2.out' })
        .call(() => playSfx('pulo'), [], '<')
        .to(mover, { y: ty, duration: 0.18, ease: 'power2.in' })
        .call(() => playSfx('pouso'));
      // e senta
      for (const [id, deg] of Object.entries(sitPose)) tl.to(el(id), { rotation: deg, duration: 0.35, ease: 'back.out(1.4)' }, '>-0.1');
    };
    window.addEventListener(SIT_EVENT, onSit);

    /**
     * A volta pelos troféus: pula de um alvo a outro (o topo dos cartões
     * dos chefes derrotados), comemora em cada um e volta para casa. Só os
     * alvos da mesma fileira do primeiro: numa coluna só, pular para baixo
     * da tela não faria sentido.
     */
    const onHop = (event: Event) => {
      const detail = (event as CustomEvent<HopDetail>).detail;
      if (detail.anchor !== anchor || reduced || state.busy || seated || state.running) return;
      if (document.documentElement.dataset.cinematic) return;

      const r = wrap.getBoundingClientRect();
      const fx = r.left + RIG_FEET.x * r.width;
      const fy = r.top + RIG_FEET.y * r.height;
      const boxes = [...document.querySelectorAll<HTMLElement>(detail.selector)].map((t) => t.getBoundingClientRect());
      const row = boxes.filter((b) => Math.abs(b.top - (boxes[0]?.top ?? 0)) < 8);
      if (!row.length) return;

      const h = height();
      const stops = [...row.map((b) => ({ x: b.left + b.width / 2 - fx, y: b.top - fy, trophy: true })), { x: 0, y: 0, trophy: false }];
      state.busy = true;
      delete rig.dataset.idle;
      const wings = [el('wing-upper'), el('wing-lower')];
      let from = { x: state.x, y: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          state.busy = false;
          state.x = 0;
          state.y = 0;
          state.facing = 1;
          gsap.set(flipper, { scaleX: 1 });
          setLift(0);
          restPose();
        },
      });

      for (const stop of stops) {
        const dx = stop.x - from.x;
        const dur = Math.min(0.85, Math.max(0.42, 0.36 + Math.hypot(dx, stop.y - from.y) / (h * 5)));
        const peak = Math.min(from.y, stop.y) - h * 0.38;
        const at = tl.duration();

        tl.set(flipper, { scaleX: dx < 0 ? -1 : 1 }, at)
          // agacha, salta em arco, pousa com peso
          .to(body, { scaleY: 0.86, scaleX: 1.08, duration: 0.12, ease: 'power2.in' }, at)
          .to(el('thigh-near'), { rotation: -60, duration: 0.12 }, at)
          .to(el('shin-near'), { rotation: 92, duration: 0.12 }, at)
          .call(() => playSfx('pulo'), [], at + 0.12)
          .to(body, { scaleY: 1, scaleX: 1, duration: 0.2 }, at + 0.12)
          .to(mover, { x: stop.x, duration: dur, ease: 'none' }, at + 0.12)
          .to(mover, { y: peak, duration: dur / 2, ease: 'power2.out' }, at + 0.12)
          .to(mover, { y: stop.y, duration: dur / 2, ease: 'power2.in' }, at + 0.12 + dur / 2)
          .to(glow, { opacity: 0.35, scale: 0.6, duration: dur / 2 }, at + 0.12)
          .to(glow, { opacity: 1, scale: 1, duration: dur / 2 }, at + 0.12 + dur / 2)
          .to(el('thigh-near'), { rotation: -40, duration: 0.15 }, at + 0.12)
          .to(el('shin-near'), { rotation: 72, duration: 0.15 }, at + 0.12)
          .to(el('thigh-far'), { rotation: 28, duration: 0.15 }, at + 0.12)
          .to(el('shin-far'), { rotation: 64, duration: 0.15 }, at + 0.12)
          .to(el('arm-near'), { rotation: -56, duration: 0.15 }, at + 0.12)
          .fromTo(
            wings,
            { rotation: 30 },
            { rotation: -34, duration: 0.06, ease: 'sine.inOut', yoyo: true, repeat: Math.round(dur / 0.06) | 1, immediateRender: false },
            at + 0.12,
          )
          .call(() => playSfx('pouso'), [], at + 0.12 + dur)
          .to(body, { scaleY: 0.88, scaleX: 1.06, duration: 0.08 }, at + 0.12 + dur)
          .to(body, { scaleY: 1, scaleX: 1, duration: 0.3, ease: 'back.out(3)' }, at + 0.2 + dur);
        for (const j of JOINTS) tl.to(el(j.id), { rotation: REST[j.id], duration: 0.22 }, at + 0.12 + dur);

        if (stop.trophy) {
          // em cima do troféu: punho para o alto, asas abertas
          const top = at + 0.3 + dur;
          tl.to(el('arm-near'), { rotation: -160, duration: 0.18, ease: 'back.out(2)' }, top)
            .to(el('forearm-near'), { rotation: -20, duration: 0.18 }, top)
            .to(el('head'), { rotation: REST['head']! - 10, duration: 0.18 }, top)
            .to(wings, { rotation: '-=20', duration: 0.1, yoyo: true, repeat: 3 }, top)
            .to(el('arm-near'), { rotation: REST['arm-near']!, duration: 0.2 }, top + 0.45)
            .to(el('forearm-near'), { rotation: REST['forearm-near']!, duration: 0.2 }, top + 0.45)
            .to(el('head'), { rotation: REST['head']!, duration: 0.2 }, top + 0.45);
        }
        from = stop;
      }
      current = tl;
      // só em desenvolvimento: permite pausar a volta e inspecionar quadro a quadro
      if (process.env.NODE_ENV !== 'production') {
        (window as unknown as { __pulos?: gsap.core.Timeline }).__pulos = tl;
      }
    };
    window.addEventListener(HOP_EVENT, onHop);

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

    // acena quando a região dele aparece pela primeira vez, se ninguém
    // estiver em cena: chegar voando pela passagem já é a apresentação
    let greeter: IntersectionObserver | null = null;
    const armGreeter = () => {
      greeter?.disconnect();
      if (!greet || reduced) return;
      greeter = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          greeter?.disconnect();
          if (document.documentElement.dataset.cinematic || state.busy || seated || state.running) return;
          react('wave');
        },
        { threshold: 0.9 },
      );
      greeter.observe(wrap);
    };
    armGreeter();

    // nova jornada: tudo volta ao começo, e o aceno vale de novo
    const onReset = () => {
      onJourney();
      armGreeter();
    };
    window.addEventListener(JOURNEY_RESET, onReset);

    return () => {
      stop();
      stopSeatedIdle();
      greeter?.disconnect();
      unregister();
      window.removeEventListener(JOURNEY_START, onJourney);
      window.removeEventListener(PASSAGE_EVENT, onJourney);
      window.removeEventListener(SIT_EVENT, onSit);
      window.removeEventListener(HOP_EVENT, onHop);
      window.removeEventListener(JOURNEY_RESET, onReset);
      wrap.removeEventListener('click', onPoke);
    };
  }, [range, ground, anchor, greet]);

  return (
    <button
      ref={wrapRef}
      type="button"
      aria-label={label}
      className={`player-firefly block cursor-pointer rounded-full ${className}`}
      style={{ aspectRatio: `${RIG_BOX.width} / ${RIG_BOX.height}`, ...style }}
    >
      <div ref={moverRef} className="relative h-full w-full">
        <span
          aria-hidden="true"
          data-glow
          className="firefly-glow pointer-events-none absolute"
          style={{ left: `${RIG_FEET.x * 100}%`, top: `${RIG_FEET.y * 100}%` }}
        />
        <div ref={flipRef} className="h-full w-full">
          <FireflyRig idle anchor={anchor} className="h-full" />
        </div>
      </div>
    </button>
  );
}
