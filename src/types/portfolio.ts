export type Locale = 'pt' | 'en';

export const LOCALES: readonly Locale[] = ['pt', 'en'] as const;

export type ProjectCategory =
  | 'ia-agentes'
  | 'sites-sistemas'
  | 'automacao'
  | 'dashboards'
  | 'estudos';

/** Estado real do projeto. Controla a cor do indicador no card. */
export type ProjectStatus = 'producao' | 'evolucao' | 'andamento' | 'entregue';

export interface Project {
  /** slug estável, usado como id do dialog e âncora */
  id: string;
  title: string;
  category: ProjectCategory;
  /** o problema, em uma frase */
  problem: string;
  /** o que eu construí, em 2 a 3 frases */
  built: string;
  stack: readonly string[];
  status: ProjectStatus;
  /** rótulo curto do estado, já no idioma da página */
  statusLabel: string;
  /** repositório público, quando existe */
  repo?: string;
  /** o trabalho no ar (site ou demonstração), quando existe */
  demo?: string;
  /** contexto do trabalho (empregador/cliente), quando aplicável */
  context?: string;
  /** destaque #1: ocupa duas colunas no grid */
  featured?: boolean;
  /** por que este projeto está no portfólio (aparece só no detalhe) */
  note?: string;
}

export interface StackGroup {
  label: string;
  items: readonly string[];
}

export interface TimelinePhase {
  /** a ordem carrega informação aqui, por isso é numerada */
  index: string;
  /** recorte de tempo da fase */
  period: string;
  title: string;
  description: string;
  markers: readonly string[];
}

export interface Gauge {
  label: string;
  /** valor numérico para o sweep; ausente = leitura textual */
  value?: number;
  /** valor exibido depois do sweep */
  display: string;
  caption: string;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  external: boolean;
}

export interface NavItem {
  href: string;
  label: string;
}

/** Uma região do reino. Cada seção do portfólio é uma região. */
export interface GameRegion {
  /** nome que aparece no cartão de título ao entrar */
  name: string;
  /** a linha menor sob o nome */
  epithet: string;
}

export type GameRegionId = 'profile' | 'focus' | 'projects' | 'stack' | 'path' | 'contact';

/** Cada projeto vira uma criatura do bestiário. */
export interface BestiaryEntry {
  /** arquivo em art/source/criaturas, sem extensão */
  creature: string;
  /** nome da criatura */
  name: string;
  /** chefes ocupam o topo do bestiário, maiores */
  boss?: boolean;
}

/** Tudo o que o jogo diz. O conteúdo de verdade continua nos blocos acima. */
export interface GameContent {
  title: {
    kicker: string;
    pressAnyKey: string;
    tapToStart: string;
    menuLabel: string;
    menu: { start: string; language: string; textVersion: string };
    controlsHint: string;
  };
  regions: Readonly<Record<GameRegionId, GameRegion>>;
  dialogue: {
    speaker: string;
    advance: string;
    showAll: string;
    tabletTitle: string;
  };
  skipToJourney: string;
  skipScene: string;
  firefly: { poke: string; controls: string };
  sound: { on: string; off: string; hint: string };
  bestiary: {
    lead: string;
    bosses: string;
    creatures: string;
    defeated: string;
    undefeated: string;
    open: string;
    close: string;
    labels: { creature: string; victory: string; arsenal: string; dream: string; repo: string; demo: string; replay: string };
    /** chave: id do projeto */
    entries: Readonly<Record<string, BestiaryEntry>>;
  };
  charms: { notches: string; notchesHint: string; bag: string };
  map: { here: string };
  bench: { rest: string; saved: string; end: string; again: string };
  /** o aviso da barra de espaço: o que ela faz agora */
  space: { key: string; finish: string; next: string; region: string; rest: string; again: string };
}

export interface PortfolioContent {
  locale: Locale;
  meta: {
    title: string;
    description: string;
    ogAlt: string;
    keywords: readonly string[];
  };
  nav: {
    label: string;
    items: readonly NavItem[];
    languageToggle: string;
    skipToContent: string;
    menuOpen: string;
    menuClose: string;
  };
  hero: {
    eyebrow: string;
    name: string;
    role: string;
    headline: string;
    subheadline: string;
    availability: string;
    location: string;
    portraitAlt: string;
    ctaPrimary: string;
    ctaSecondary: string;
    gauges: readonly Gauge[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: readonly string[];
    facts: readonly { label: string; value: string }[];
    education: { eyebrow: string; degree: string; period: string; status: string };
    credentials: {
      eyebrow: string;
      issuer: string;
      summary: string;
      /** a contagem exibida sai daqui, não de um campo separado */
      items: readonly string[];
    };
  };
  focus: {
    eyebrow: string;
    title: string;
    lead: string;
    tracks: readonly { label: string; title: string; description: string }[];
  };
  projects: {
    eyebrow: string;
    title: string;
    lead: string;
    filterAll: string;
    filterLabel: string;
    categories: Readonly<Record<ProjectCategory, string>>;
    labels: {
      problem: string;
      built: string;
      stack: string;
      status: string;
      repo: string;
      demo: string;
      openDetail: string;
      closeDetail: string;
      confidential: string;
    };
    items: readonly Project[];
  };
  stack: {
    eyebrow: string;
    title: string;
    lead: string;
    coreLabel: string;
    /** 5 a 6 tecnologias centrais, com destaque visual leve */
    core: readonly string[];
    groups: readonly StackGroup[];
  };
  timeline: {
    eyebrow: string;
    title: string;
    lead: string;
    phases: readonly TimelinePhase[];
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    links: readonly ContactLink[];
  };
  footer: {
    rights: string;
    builtWith: string;
  };
  game: GameContent;
}
