export type Locale = 'pt' | 'en';

export const LOCALES: readonly Locale[] = ['pt', 'en'] as const;

export type ProjectCategory =
  | 'ia-agentes'
  | 'dados-iot'
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
}
