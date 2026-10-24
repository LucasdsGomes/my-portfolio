/** Evento que dá a largada na descida do título até a primeira região. */
export const JOURNEY_START = 'jornada:comecar';

/** Pede ao vagalume com este anchor que sente no ponto dado (fração do chão). */
export const SIT_EVENT = 'vagalume:sentar';

export interface SitDetail {
  anchor: string;
  x: number;
  y: number;
}

/** O jeito de viajar de uma região para a próxima. */
export type PassageStyle = 'salto' | 'investida' | 'planar' | 'banco';

/** Pede ao diretor uma passagem animada: o vagalume de `from` voa até o de `to`. */
export const PASSAGE_EVENT = 'jornada:passagem';

export interface PassageDetail {
  from: string;
  to: string;
  /** seção de destino: a câmera desce até ela */
  sectionId: string;
  style: PassageStyle;
}

/** Pede ao vagalume com este anchor uma volta pulando de alvo em alvo. */
export const HOP_EVENT = 'vagalume:pular-alvos';

export interface HopDetail {
  anchor: string;
  /** seletor dos alvos: ele pousa no topo de cada um, na ordem do DOM */
  selector: string;
}

/** Nova jornada: falas, banco, anúncios e acenos voltam ao começo. */
export const JOURNEY_RESET = 'jornada:reiniciar';

/** Pede ao Último Banco que o vagalume descanse (senta e salva a jornada). */
export const BENCH_REST = 'banco:descansar';

/**
 * Algo mudou no que a barra de espaço faria agora: uma fala terminou de
 * ser escrita, uma cena começou ou acabou, a jornada foi salva.
 */
export const JOURNEY_CHANGE = 'jornada:mudou';

export const announceChange = () => window.dispatchEvent(new Event(JOURNEY_CHANGE));
