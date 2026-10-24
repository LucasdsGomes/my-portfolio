'use client';

import { ART } from '../art/assets.generated';

/**
 * Som do jogo: uma música de fundo por região e efeitos curtos.
 *
 * Regras que valem para tudo:
 *   - Nada toca antes de a pessoa ligar o som. Navegador bloqueia áudio
 *     automático, e som que dispara sozinho é o jeito mais rápido de
 *     alguém fechar a aba.
 *   - A escolha fica lembrada. Se ela ligou na última visita, o som volta
 *     no primeiro clique ou tecla (o navegador exige um gesto).
 *   - Nada baixa antes de ligar: quem nunca liga o som não paga por ele.
 *
 * Tudo passa pela Web Audio API. A música é decodificada inteira e repete
 * sem emenda; o elemento <audio> comum deixa um soluço audível a cada
 * volta de MP3, por causa do silêncio que o formato embute nas pontas.
 */

export type Sfx =
  | 'menu-mover'
  | 'menu-confirmar'
  | 'regiao'
  | 'pulo'
  | 'pouso'
  | 'cutucar'
  | 'passo'
  | 'dialogo'
  | 'golpe'
  | 'criatura-desfaz'
  | 'diario'
  | 'amuleto'
  | 'mapa'
  | 'banco';
export type Track = 'floresta' | 'galerias' | 'abismo';

const STORAGE_KEY = 'lg-som';
/** só os arquivos que o pipeline publicou: pedir o resto daria 404 no console */
const AVAILABLE = new Set<string>(Object.keys(ART.audio));
const MUSIC_VOLUME = 0.42;
const FADE = 1.6;

const SFX_FILES: Record<Sfx, string[]> = {
  'menu-mover': ['menu-mover'],
  'menu-confirmar': ['menu-confirmar'],
  regiao: ['regiao'],
  pulo: ['pulo'],
  pouso: ['pouso'],
  // o som mais tocado alterna entre duas versões para não cansar
  cutucar: ['cutucar-1', 'cutucar-2'],
  passo: ['passo-1', 'passo-2'],
  dialogo: ['dialogo'],
  golpe: ['golpe'],
  'criatura-desfaz': ['criatura-desfaz'],
  diario: ['diario'],
  amuleto: ['amuleto'],
  mapa: ['mapa'],
  banco: ['banco'],
};

const SFX_VOLUME: Record<Sfx, number> = {
  'menu-mover': 0.35,
  'menu-confirmar': 0.5,
  regiao: 0.45,
  pulo: 0.4,
  pouso: 0.35,
  cutucar: 0.55,
  passo: 0.22,
  dialogo: 0.3,
  golpe: 0.5,
  'criatura-desfaz': 0.45,
  diario: 0.45,
  amuleto: 0.45,
  mapa: 0.35,
  banco: 0.5,
};

// a trilha das galerias é opcional: se o arquivo não existir, a floresta segue tocando
const TRACK_FILES: Record<Track, string> = {
  floresta: 'musica-floresta',
  galerias: 'musica-galerias',
  abismo: 'musica-abismo',
};

interface State {
  enabled: boolean;
  /** ligado, mas esperando o primeiro gesto para o navegador deixar tocar */
  pending: boolean;
}

let state: State = { enabled: false, pending: false };
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const buffers = new Map<string, Promise<AudioBuffer | null>>();
const rotation = new Map<Sfx, number>();
let desiredTrack: Track = 'floresta';
let music: { track: Track; source: AudioBufferSourceNode; gain: GainNode } | null = null;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((fn) => fn());

function load(name: string): Promise<AudioBuffer | null> {
  if (!AVAILABLE.has(name)) return Promise.resolve(null);
  let pending = buffers.get(name);
  if (!pending) {
    pending = fetch(`/game/audio/${name}.mp3`)
      .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(new Error(res.statusText))))
      .then((data) => ctx!.decodeAudioData(data))
      .catch(() => null);
    buffers.set(name, pending);
  }
  return pending;
}

function ensureContext(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.connect(ctx.destination);
  return ctx;
}

/**
 * Onde o loop começa e termina. Os geradores de música costumam deixar
 * silêncio nas pontas e às vezes um fade-out no fim, mesmo quando se pede
 * o contrário; repetido, isso vira um buraco a cada volta. Aqui o começo
 * pula o silêncio e o fim para antes de o volume despencar.
 */
function loopPoints(buffer: AudioBuffer): [number, number] {
  const data = buffer.getChannelData(0);
  const rate = buffer.sampleRate;

  let first = 0;
  while (first < data.length && Math.abs(data[first]!) < 0.003) first += 1;

  let sum = 0;
  for (let i = first; i < data.length; i += 16) sum += data[i]! * data[i]!;
  const overall = Math.sqrt(sum / ((data.length - first) / 16));

  const win = Math.round(rate * 0.05);
  let end = data.length;
  while (end - win > first) {
    let w = 0;
    for (let i = end - win; i < end; i += 4) w += data[i]! * data[i]!;
    if (Math.sqrt(w / (win / 4)) >= overall * 0.3) break;
    end -= win;
  }

  return [first / rate, end / rate];
}

async function startTrack(track: Track) {
  const audio = ensureContext();
  if (!audio || !master) return;
  if (music?.track === track) return;

  const buffer = await load(TRACK_FILES[track]);
  // a pessoa pode ter desligado ou trocado de região enquanto baixava
  if (!buffer || !state.enabled || desiredTrack !== track) return;

  const now = audio.currentTime;
  if (music) {
    const old = music;
    old.gain.gain.cancelScheduledValues(now);
    old.gain.gain.setValueAtTime(old.gain.gain.value, now);
    old.gain.gain.linearRampToValueAtTime(0, now + FADE);
    old.source.stop(now + FADE + 0.05);
  }

  const gain = audio.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(MUSIC_VOLUME, now + FADE);
  gain.connect(master);

  const [loopStart, loopEnd] = loopPoints(buffer);
  const source = audio.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.loopStart = loopStart;
  source.loopEnd = loopEnd;
  source.connect(gain);
  source.start(0, loopStart);
  music = { track, source, gain };
}

function stopMusic() {
  if (!ctx || !music) return;
  const now = ctx.currentTime;
  const old = music;
  old.gain.gain.cancelScheduledValues(now);
  old.gain.gain.setValueAtTime(old.gain.gain.value, now);
  old.gain.gain.linearRampToValueAtTime(0, now + 0.6);
  old.source.stop(now + 0.7);
  music = null;
}

/** liga de verdade: precisa rodar dentro de um gesto (clique, tecla) */
async function activate() {
  const audio = ensureContext();
  if (!audio) return;
  if (audio.state === 'suspended') await audio.resume();
  state = { enabled: true, pending: false };
  emit();
  // os efeitos são minúsculos: baixa todos de uma vez
  Object.values(SFX_FILES).flat().forEach(load);
  void startTrack(desiredTrack);
}

export function getSoundState(): State {
  return state;
}

export function subscribeSound(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setSoundEnabled(on: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
  } catch {
    // modo privado ou armazenamento bloqueado: a escolha vale só nesta visita
  }
  if (on) {
    void activate();
  } else {
    state = { enabled: false, pending: false };
    stopMusic();
    emit();
  }
}

export function toggleSound() {
  setSoundEnabled(!(state.enabled || state.pending));
}

/** escolhe a música da região à vista; toca só se o som estiver ligado */
export function setTrack(track: Track) {
  desiredTrack = track;
  if (state.enabled) void startTrack(track);
}

export function playSfx(name: Sfx) {
  if (!state.enabled || !ctx || !master) return;
  const files = SFX_FILES[name];
  const index = rotation.get(name) ?? 0;
  rotation.set(name, (index + 1) % files.length);

  void load(files[index]!).then((buffer) => {
    if (!buffer || !ctx || !master || !state.enabled) return;
    const gain = ctx.createGain();
    gain.gain.value = SFX_VOLUME[name];
    gain.connect(master);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    // um pouco de variação de altura: o mesmo som repetido soa menos mecânico
    source.playbackRate.value = 0.96 + Math.random() * 0.08;
    source.connect(gain);
    source.start();
  });
}

/**
 * Chamado uma vez ao abrir a página: se a pessoa tinha ligado o som,
 * espera o primeiro gesto para retomar. Também liga a tecla M.
 */
export function initSound(): () => void {
  let remembered = false;
  try {
    remembered = window.localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    remembered = false;
  }

  const onGesture = (event: Event) => {
    // M é do atalho de ligar/desligar: se valesse como gesto também, os dois
    // ouvintes disparariam juntos, um ligando e outro desligando
    if (event instanceof KeyboardEvent && (event.key === 'm' || event.key === 'M')) return;
    if (state.pending) void activate();
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'm' && event.key !== 'M') return;
    const el = event.target as HTMLElement | null;
    if (el?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el?.tagName ?? '')) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    toggleSound();
  };

  if (remembered) {
    state = { enabled: false, pending: true };
    emit();
  }

  window.addEventListener('pointerdown', onGesture);
  window.addEventListener('keydown', onGesture);
  window.addEventListener('keydown', onKey);

  return () => {
    window.removeEventListener('pointerdown', onGesture);
    window.removeEventListener('keydown', onGesture);
    window.removeEventListener('keydown', onKey);
  };
}
