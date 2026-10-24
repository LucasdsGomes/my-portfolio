import type { PortfolioContent } from '@/types/portfolio';

export const en: PortfolioContent = {
  locale: 'en',

  meta: {
    title: 'Lucas Gomes · AI Analyst in agents, automation and data',
    description:
      'I build the intelligence layer between operational data and decisions: AI agents, process automation, production APIs and dashboards, plus websites and systems for small businesses. Curitiba, Brazil.',
    ogAlt: 'Lucas Gomes, AI Analyst. Agents, automation, APIs and systems integration.',
    keywords: [
      'AI Analyst',
      'AI agents',
      'process automation',
      'AI engineering',
      'FastAPI',
      'n8n',
      'Supabase',
      'LangChain',
      'Brazil',
    ],
  },

  nav: {
    label: 'Main navigation',
    items: [
      { href: '#perfil', label: 'Profile' },
      { href: '#foco', label: 'Focus' },
      { href: '#projetos', label: 'Work' },
      { href: '#stack', label: 'Stack' },
      { href: '#trajetoria', label: 'Path' },
      { href: '#contato', label: 'Contact' },
    ],
    languageToggle: 'PT',
    skipToContent: 'Skip to content',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
  },

  hero: {
    eyebrow: '// lucas gomes · curitiba, brazil',
    name: 'Lucas Gomes',
    role: 'AI Analyst at Milen.ia',
    headline: 'I build the intelligence layer between operational data and decisions.',
    subheadline:
      'AI agents, process automation, APIs and dashboards in production at Milen.ia. On my own, websites and systems for small businesses at L² Studio.',
    availability: 'Engaged · open to conversations',
    location: 'Curitiba, Brazil · remote',
    portraitAlt: 'Portrait of Lucas Gomes',
    ctaPrimary: 'See the work',
    ctaSecondary: 'Get in touch',
    gauges: [
      {
        label: 'SYSTEMS_INTEGRATED',
        value: 8,
        display: '08',
        caption: 'CRM, support, ERP, spreadsheets and LLMs',
      },
      {
        label: 'CERTIFICATIONS',
        value: 11,
        display: '11',
        caption: 'Agents, RAG and SQL with AI',
      },
      {
        label: 'CURRENT_FOCUS',
        display: 'APPLIED_AI',
        caption: 'Agents, automation and APIs',
      },
    ],
  },

  about: {
    eyebrow: '// profile',
    title: 'About',
    paragraphs: [
      'I work at the border between business automation and engineering. I design and ship AI agents, automation workflows, FastAPI services and data pipelines that connect CRM, customer service, operations and product. These are systems that have to keep running after I leave the room.',
      'My foundation came from n8n automation and CRM integration: Bitrix24, Chatwoot, WhatsApp Business API. From there I moved into data architecture on Supabase and PostgreSQL and into APIs of my own, with typed contracts, tests and authentication, running on Docker and Azure cloud services.',
      'Day to day I build alongside coding agents such as Claude Code, and I treat whatever a model writes as untrusted input: validation, tests and review before anything reaches production. Outside Milen.ia I bring the same care to L² Studio, where Lucas Bastos and I build websites and systems for small businesses.',
      'Remote, direct communication, delivery measured against a result.',
    ],
    facts: [
      { label: 'LOCATION', value: 'Curitiba, Brazil' },
      { label: 'ROLE', value: 'AI Analyst · Milen.ia (contractor)' },
      { label: 'FOCUS', value: 'Agents, automation, APIs and data' },
      { label: 'AVAILABILITY', value: 'Engaged · open to conversations' },
    ],
    education: {
      eyebrow: '// education',
      degree: 'Technologist Degree in Systems Analysis and Development',
      period: '2022 to 2025',
      status: 'Completed',
    },
    credentials: {
      eyebrow: '// certifications',
      issuer: 'Viver de IA',
      summary:
        'Applied training in AI agents on n8n, RAG, multi-agent platforms and SQL with AI. Every certificate turned into work shipped to production.',
      items: [
        'AI agents in n8n',
        'RAG in practice',
        'Multi-agent customer service platform',
        'Building a WhatsApp SDR with n8n',
        'Automated blog with AI 3.0',
        'n8n chatbot',
        'SQL with AI',
        'Social media automation at scale',
        'Lovable in practice',
        'Perplexity track',
        'Make configuration assistant',
      ],
    },
  },

  focus: {
    eyebrow: '// current focus',
    title: 'What I am working on now',
    lead: 'Two fronts at once: one inside Milen.ia, the other on my own, with small businesses.',
    tracks: [
      {
        label: 'MILEN.IA',
        title: 'Applied AI, APIs and data',
        description:
          'Conversational agents and n8n automations wired into the CRM and customer service, FastAPI services with typed contracts and tests, dashboards that bring CRM and ERP into a single reading, and the monitoring of all of it: flow errors and AI spend in real time.',
      },
      {
        label: 'L² STUDIO',
        title: 'Websites and systems for small businesses',
        description:
          'With Lucas Bastos, I build websites and management systems for gyms, barbershops, clinics and consultants, from layout to deploy. Online booking, subscriptions, an owner dashboard and a quote the client builds themselves: software made to measure for teams with no tech staff.',
      },
    ],
  },

  projects: {
    eyebrow: '// work',
    title: 'Selected work',
    lead: 'Each card states the problem, what I built and with what. Architecture and technical decisions, never configuration, credentials or client data.',
    filterAll: 'All',
    filterLabel: 'Filter work by category',
    categories: {
      'ia-agentes': 'AI & Agents',
      'sites-sistemas': 'Sites & Systems',
      automacao: 'Automation',
      dashboards: 'Dashboards',
      estudos: 'Studies',
    },
    labels: {
      problem: 'Problem',
      built: 'What I built',
      stack: 'Stack',
      status: 'Status',
      repo: 'View repository',
      demo: 'See it live',
      openDetail: 'Open detail',
      closeDetail: 'Close',
      confidential:
        'Configuration details, credentials and client data are left out for confidentiality.',
    },
    items: [
      {
        id: 'mila-sdr',
        title: 'Mila, a multichannel SDR agent',
        category: 'ia-agentes',
        context: 'Milen.ia',
        featured: true,
        status: 'producao',
        statusLabel: 'In production',
        problem:
          'Lead qualification depending on a human team, across several channels, with uneven response times.',
        built:
          'I built a conversational agent for outbound flows using the SPIN methodology, integrated with the CRM and the customer service platform. The hard part was never the prompt: it was migrating the WhatsApp delivery layer without losing conversations, resolving concurrency between simultaneous messages from the same lead, normalising inconsistent source data and drawing a precise boundary around what enters the agent context.',
        stack: ['n8n', 'LLM', 'Chatwoot', 'WhatsApp Business API', 'Bitrix24', 'Supabase'],
      },
      {
        id: 'milen-admin',
        title: 'Milen.ia Administration, the monitoring hub',
        category: 'dashboards',
        context: 'Milen.ia',
        status: 'producao',
        statusLabel: 'In production',
        problem:
          'Workflow errors got lost between executions, and AI service spend only really showed up on the end-of-month invoice.',
        built:
          'I built an internal dashboard that receives errors from every n8n workflow by webhook, through a global error handler that maps each workflow to its project, and shows them in real time with Supabase Realtime. The same screen tracks spend and usage of the AI services, OpenAI and ElevenLabs, with an alert when credit runs low. Member invites and usage collection run on Edge Functions.',
        stack: ['React', 'TypeScript', 'Supabase Realtime', 'Supabase Edge Functions', 'n8n', 'OpenAI API', 'ElevenLabs API'],
        note: 'Good automation tells you when it breaks. The dashboard exists so that no flow error depends on someone opening the log.',
      },
      {
        id: 'sql-copilot',
        title: 'SQL Copilot, business questions in safe SQL',
        category: 'estudos',
        context: 'Personal project',
        status: 'entregue',
        statusLabel: 'Delivered',
        repo: 'https://github.com/LucasdsGomes/sql-copilot',
        problem:
          'Letting an LLM write SQL is easy. The hard part is guaranteeing the generated query never changes, deletes or exposes what it should not.',
        built:
          'I built an API that takes a natural language question, asks Claude for the SQL and treats that query as untrusted input: a sqlglot validator rejects anything that is not a read and forces a LIMIT, and the database runs on a read-only connection with a timeout. In front of it, API key authentication with constant-time comparison and rate limiting applied before authentication. I tested it end to end on a free cloud tier and took it down so as not to expose a paid LLM key.',
        stack: ['Python', 'FastAPI', 'LangChain', 'Claude', 'sqlglot', 'SQLite', 'pytest', 'GitHub Actions'],
        note: 'No layer is trusted on its own: each one assumes the previous one failed. It is the same principle I apply to the code I write with AI agents.',
      },
      {
        id: 'dashboards-operacao',
        title: 'Sales, marketing and finance dashboards',
        category: 'dashboards',
        context: 'Milen.ia',
        status: 'entregue',
        statusLabel: 'Delivered',
        problem:
          'Metrics scattered across CRM, spreadsheets and ERP, with every team reaching a different number for the same question.',
        built:
          'I unified the sales and marketing panels with two-phase data enrichment and KPIs validated with the team before they became charts. I built the sales predictability view, with target, forecast and the gap left to close the month, designed for the weekly sales meeting. And I delivered a finance panel integrated with the ERP, closing the revenue loop.',
        stack: ['Lovable', 'Supabase', 'Bitrix24', 'Omie', 'SQL'],
      },
      {
        id: 'reativacao-base',
        title: 'Database reactivation workflows',
        category: 'automacao',
        context: 'Milen.ia',
        status: 'producao',
        statusLabel: 'In production',
        problem:
          'A dormant lead base with no re-engagement cadence and no control over send volume.',
        built:
          'I built a set of reactivation workflows with a daily send cap, validation of Brazilian phone number formats (which vary more than you would expect) and conversation creation in the service platform from an approved template. To work around the platform execution timeout I replaced waiting with timestamp-based expiry, so the flow resumes from the right point instead of holding an execution open.',
        stack: ['n8n', 'Bitrix24', 'Chatwoot', 'WhatsApp Business API', 'Google Sheets'],
      },
      {
        id: 'conteudo-automatizado',
        title: 'Automated content publishing',
        category: 'automacao',
        context: 'Milen.ia',
        status: 'producao',
        statusLabel: 'In production',
        problem:
          'Manual, irregular content production, always the first thing cut when the week gets tight.',
        built:
          'I built the pipeline that generates text and imagery, publishes through an edge function and keeps the blog current with no intervention. It has run on its own since it shipped.',
        stack: ['n8n', 'Supabase Edge Functions', 'Picsart', 'Imagen'],
      },
      {
        id: 'navalha-barbearias',
        title: 'Navalha, a management system for barbershops',
        category: 'sites-sistemas',
        context: 'L² Studio',
        status: 'entregue',
        statusLabel: 'Live demo',
        demo: 'https://barbearia-navalha-demo.vercel.app',
        problem:
          'A small barbershop books over WhatsApp and tracks subscriptions from memory, and that is where slots, clients and revenue get lost.',
        built:
          'I built the system L² Studio pitches to barbershops: five-step booking that respects shifts, breaks, days off and existing appointments, never letting two clients take the same slot; a client area with subscriptions the booking consumes on its own; and an owner dashboard with revenue, average ticket and appointments. The demo runs with no external database: sample data creates itself on the first visit.',
        stack: ['Next.js', 'TypeScript', 'Prisma', 'SQLite', 'Tailwind', 'ECharts', 'Zod', 'Playwright'],
      },
      {
        id: 'sites-pequenos-negocios',
        title: 'Websites for small businesses',
        category: 'sites-sistemas',
        context: 'L² Studio',
        status: 'andamento',
        statusLabel: 'In progress',
        demo: 'https://suaconsultorapg.com',
        problem:
          'Gyms, bakeries, clinics and consultants need to show up well on Google and WhatsApp, but have neither the time nor the budget for an agency.',
        built:
          'The studio site itself works as a portfolio and ends in a quote the visitor builds on their own. For Sua Consultora PG, a real estate consultant in Ponta Grossa, we delivered a page with a mortgage simulator, a rent calculator and a document checklist, published on Cloudflare Pages with caching and security headers. Lightweight sites, no build step, that the client can maintain.',
        stack: ['HTML', 'CSS', 'JavaScript', 'Cloudflare Pages', 'Vercel', 'SEO'],
      },
      {
        id: 'rag-conhecimento-interno',
        title: 'Internal knowledge assistant (RAG)',
        category: 'ia-agentes',
        context: 'Personal project',
        status: 'entregue',
        statusLabel: 'Delivered',
        repo: 'https://github.com/LucasdsGomes/my-chatbot-n8n',
        problem:
          'Internal documentation, from policies to manuals and technical rules, exists. But nobody finds the answer at the moment they need it.',
        built:
          'A question-answering application over internal documents using RAG: PDF ingestion, embeddings and vector search on Supabase, orchestration in n8n and an Express API layer. It taught me in practice where RAG breaks: poor chunking and irrelevant retrieval sink the answer before the model even speaks.',
        stack: ['n8n', 'Supabase', 'pgvector', 'Express', 'RAG', 'Embeddings'],
      },
      {
        id: 'otimizador-processos',
        title: 'AI business process optimiser',
        category: 'estudos',
        context: 'Personal project',
        status: 'entregue',
        statusLabel: 'Delivered',
        repo: 'https://github.com/LucasdsGomes/ai-business-process-optimizer',
        problem:
          'AI, automation and data analysis are usually studied in isolation, and that learning does not survive contact with a real flow.',
        built:
          'I built a single flow that receives process requests, orchestrates handling, analyses with an LLM and returns the result in a dashboard. It is deliberately applied study rather than a polished tutorial: the architecture decisions are recorded in the repository, iterations included.',
        stack: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'n8n', 'OpenRouter', 'Streamlit'],
      },
    ],
  },

  stack: {
    eyebrow: '// stack',
    title: 'Stack',
    lead: 'Grouped by domain, with emphasis on what I use daily. No percentage bars, because proficiency is not a number anyone can defend.',
    coreLabel: 'Daily driver',
    core: ['Python', 'FastAPI', 'n8n', 'Supabase', 'PostgreSQL', 'TypeScript', 'Claude Code'],
    groups: [
      {
        label: 'Languages & APIs',
        items: ['Python', 'TypeScript', 'SQL', 'FastAPI', 'Pydantic', 'REST'],
      },
      {
        label: 'AI & Agents',
        items: [
          'OpenAI',
          'Anthropic Claude',
          'Gemini',
          'LangChain',
          'RAG',
          'pgvector',
          'Agents',
          'Prompt engineering',
          'Claude Code',
        ],
      },
      {
        label: 'Automation & Integration',
        items: ['n8n', 'Webhooks', 'Bitrix24', 'Chatwoot', 'WhatsApp Business API', 'Omie', 'Apify'],
      },
      {
        label: 'Data & Infra',
        items: [
          'Supabase',
          'PostgreSQL',
          'Prisma',
          'MQTT',
          'Azure IoT Hub',
          'Event Hub',
          'Azure Functions',
          'Docker',
        ],
      },
      {
        label: 'Front & Deploy',
        items: ['Next.js', 'React', 'TanStack', 'Tailwind', 'Lovable', 'Vercel', 'Cloudflare'],
      },
      {
        label: 'Quality',
        items: ['pytest', 'Vitest', 'Playwright', 'Postman', 'Git', 'GitHub Actions'],
      },
    ],
  },

  timeline: {
    eyebrow: '// path',
    title: 'Path',
    lead: 'Three phases, and the order matters: each one was only possible because the previous one was already solved.',
    phases: [
      {
        index: '01',
        period: '2022 to 2024',
        title: 'Automation & integration',
        description:
          'I started as a freelance developer, writing APIs and integrations in Python and Go alongside automation bots. That is where I learned that most of an integration problem is inconsistent data, not flow logic: handling it at the source cut processing failures by 30%.',
        markers: ['Python', 'Go', 'REST', 'Selenium', 'PyAutoGUI'],
      },
      {
        index: '02',
        period: '2026',
        title: 'Applied AI & CRM',
        description:
          'I joined Milen.ia connecting systems that did not talk to each other: CRM, customer service and WhatsApp. Conversational agents and automation workflows in production, with the quality bar set by the source data rather than the prompt.',
        markers: ['n8n', 'Bitrix24', 'Chatwoot', 'WhatsApp Business API', 'LLM'],
      },
      {
        index: '03',
        period: '2026 · now',
        title: 'APIs, data & product',
        description:
          'The flows started demanding a source of truth, so I moved to owning the data architecture and writing APIs instead of chaining nodes: typed contracts, tests and authentication. In parallel, I started L² Studio to bring the same care to websites and systems for small businesses.',
        markers: ['FastAPI', 'Supabase', 'PostgreSQL', 'Docker', 'Claude Code', 'Next.js'],
      },
    ],
  },

  contact: {
    eyebrow: '// contact',
    title: 'Let us talk',
    lead: 'No form. Pick a channel, I answer on all of them.',
    links: [
      {
        label: 'Email',
        value: 'lucasdsgomes04@gmail.com',
        href: 'mailto:lucasdsgomes04@gmail.com',
        external: false,
      },
      {
        label: 'LinkedIn',
        value: '/in/lucasdsgomes',
        href: 'https://www.linkedin.com/in/lucasdsgomes/',
        external: true,
      },
      {
        label: 'GitHub',
        value: '@LucasdsGomes',
        href: 'https://github.com/LucasdsGomes',
        external: true,
      },
      {
        label: 'WhatsApp',
        value: '+55 41 9509-0844',
        href: 'https://wa.me/554195090844',
        external: true,
      },
    ],
  },

  footer: {
    rights: 'All rights reserved.',
    builtWith: 'Next.js · TypeScript · Tailwind · Vercel',
  },

  game: {
    title: {
      kicker: 'A descent into the depths of data',
      pressAnyKey: 'Press any key',
      tapToStart: 'Tap to begin',
      menuLabel: 'Main menu',
      menu: {
        start: 'Begin journey',
        language: 'Português',
        textVersion: 'Text version',
      },
      controlsHint: '↑ ↓ to choose · Enter to confirm',
    },
    regions: {
      profile: { name: 'Lantern Glade', epithet: 'where the light first wakes' },
      focus: { name: 'Chamber of Two Flames', epithet: 'two fronts, each with its own flame' },
      projects: {
        name: 'Galleries of Raw Data',
        epithet: 'where data rains and creatures lurk',
      },
      stack: { name: 'Charm Sanctum', epithet: 'what you carry into the deep' },
      path: { name: "The Cartographer's Table", epithet: 'the road so far, drawn by hand' },
      contact: { name: 'The Last Bench', epithet: 'rest here; your journey is saved' },
    },
    dialogue: {
      speaker: 'Lucas',
      advance: 'Continue',
      showAll: 'Show all',
      tabletTitle: 'Glade inscriptions',
    },
    skipToJourney: 'Skip to the journey',
    skipScene: 'Skip scene',
    bestiary: {
      lead: 'Every problem I faced became a creature in this journal. Each entry tells what it was like and how it was defeated.',
      bosses: 'Bosses',
      creatures: 'Creatures',
      defeated: 'Defeated',
      undefeated: 'Not yet defeated',
      open: 'Read the entry',
      close: 'Close the journal',
      labels: {
        creature: 'The creature',
        victory: 'How it was defeated',
        arsenal: 'Arsenal',
        dream: 'Dream vision',
        repo: 'View repository',
        demo: 'See it live',
        replay: 'Replay the battle',
      },
      entries: {
        'mila-sdr': { creature: 'chefe-cacador', name: 'Shadow Hunter', boss: true },
        'milen-admin': { creature: 'chefe-guardiao', name: 'Arcane Guardian', boss: true },
        'sql-copilot': { creature: 'chefe-colosso', name: 'Armored Colossus', boss: true },
        'dashboards-operacao': { creature: 'chefe-devorador', name: 'Deep Devourer', boss: true },
        'reativacao-base': { creature: 'espectro', name: 'Faint Specter' },
        'conteudo-automatizado': { creature: 'inseto-voador', name: 'Flying Insect' },
        'navalha-barbearias': { creature: 'sentinela', name: 'Tower Sentinel' },
        'sites-pequenos-negocios': { creature: 'agua-viva', name: 'Cave Jellyfish' },
        'rag-conhecimento-interno': { creature: 'espirito', name: 'Wandering Spirit' },
        'otimizador-processos': { creature: 'inseto-patrulha', name: 'Patrol Bug' },
      },
    },
    charms: {
      notches: 'Notches',
      notchesHint: 'The equipped charms are the ones I use every day.',
      bag: 'In the bag',
    },
    map: { here: 'You are here' },
    bench: {
      rest: 'Rest on the bench',
      saved: 'Journey saved',
      end: 'End of the journey',
      again: 'New journey',
    },
    space: {
      key: 'Space',
      finish: 'Finish the line',
      next: 'Next line',
      region: 'Next region',
      rest: 'Rest on the bench',
      again: 'New journey',
    },
    sound: {
      on: 'Turn sound off',
      off: 'Turn sound on',
      hint: 'M turns sound on and off',
    },
    firefly: {
      poke: 'Poke the firefly',
      controls: 'A D or ← → to walk · W to jump · click the firefly',
    },
  },
};
