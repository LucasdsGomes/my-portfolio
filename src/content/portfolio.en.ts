import type { PortfolioContent } from '@/types/portfolio';

export const en: PortfolioContent = {
  locale: 'en',

  meta: {
    title: 'Lucas Gomes · AI Analyst in automation, data and telemetry',
    description:
      'I build the intelligence layer between operational data and decisions: AI agents, process automation, IoT telemetry pipelines and production APIs. Curitiba, Brazil.',
    ogAlt: 'Lucas Gomes, AI Analyst. Automation, systems integration and applied data engineering.',
    keywords: [
      'AI Analyst',
      'process automation',
      'data engineering',
      'IoT telemetry',
      'FastAPI',
      'n8n',
      'Supabase',
      'Azure IoT Hub',
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
      'From AI agents and process automation to IoT telemetry pipelines and production APIs. Currently building the telemetry platform for a fleet of electric commercial vehicles.',
    availability: 'Engaged · open to conversations',
    location: 'Curitiba, Brazil · remote',
    portraitAlt: 'Portrait of Lucas Gomes',
    ctaPrimary: 'See the work',
    ctaSecondary: 'Get in touch',
    gauges: [
      {
        label: 'ENDPOINTS_IN_PRODUCTION',
        value: 28,
        display: '28',
        caption: 'Platform data API, across 6 domains',
      },
      {
        label: 'SYSTEMS_INTEGRATED',
        value: 8,
        display: '08',
        caption: 'CRM, support, ERP, spreadsheets and IoT',
      },
      {
        label: 'CURRENT_FOCUS',
        display: 'FLEET_TELEMETRY',
        caption: 'Electric commercial vehicles',
      },
    ],
  },

  about: {
    eyebrow: '// profile',
    title: 'About',
    paragraphs: [
      'I work at the border between business automation and engineering. I design and ship AI agents, automation workflows, FastAPI services and data pipelines that connect CRM, customer service, operations and product. These are systems that have to keep running after I leave the room.',
      'My foundation came from n8n automation and CRM integration: Bitrix24, Chatwoot, WhatsApp Business API. From there I moved into data architecture on Supabase and PostgreSQL and, more recently, into real-time telemetry ingestion with MQTT and Azure IoT Hub.',
      'I am currently deepening machine learning fundamentals in a practical way: an honest baseline before any model, F1-macro on imbalanced classes, group-aware splits so nothing leaks between train and test. I apply the same rigour to an audio classification project and to real fleet data alike.',
      'Remote, direct communication, delivery measured against a result.',
    ],
    facts: [
      { label: 'LOCATION', value: 'Curitiba, Brazil' },
      { label: 'ROLE', value: 'AI Analyst · Milen.ia (contractor)' },
      { label: 'FOCUS', value: 'Fleet telemetry, agents and data' },
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
    lead: 'Two fronts at once: one runs in production, the other keeps me learning the fundamentals underneath it.',
    tracks: [
      {
        label: 'PRODUCTION',
        title: 'Electric fleet telemetry',
        description:
          'Real-time vehicle signal ingestion, a canonical database schema and an operational dashboard for a fleet of electric urban cargo vehicles. The next step is moving from descriptive to predictive: anomaly detection, forecasting and eventually supervised models over real battery and usage data.',
      },
      {
        label: 'STUDY',
        title: 'Machine learning fundamentals',
        description:
          'The full cycle of a genuinely hard classification problem, bioacoustics with 42 species and severe class imbalance, done in the right order: group-aware split first, a dumb baseline to set the bar, F1-macro as the metric. Method before result.',
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
      'dados-iot': 'Data & IoT',
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
      openDetail: 'Open detail',
      closeDetail: 'Close',
      confidential:
        'Configuration details, credentials and client data are left out for confidentiality.',
    },
    items: [
      {
        id: 'telemetria-frota',
        title: 'Electric fleet telemetry platform',
        category: 'dados-iot',
        context: 'Milen.ia · Hitech Electric',
        featured: true,
        status: 'evolucao',
        statusLabel: 'In production · evolving',
        problem:
          'A fleet of electric urban cargo vehicles with no unified operational visibility: battery state, cell health and real usage lived in separate sources.',
        built:
          'I built the full real-time ingestion pipeline, from vehicle to database through MQTT, Azure IoT Hub, Event Hub and Azure Functions, plus the operational dashboard in Next.js. I defined the canonical database schema with standardised signal naming, which removed ambiguity between sources and made consistent historical analysis possible. It is the foundation the API and the AI diagnostics were built on.',
        stack: [
          'MQTT',
          'Azure IoT Hub',
          'Event Hub',
          'Azure Functions',
          'Supabase',
          'PostgreSQL',
          'Next.js',
          'TypeScript',
        ],
      },
      {
        id: 'api-anel-0',
        title: 'Ring 0 API, the platform data layer',
        category: 'dados-iot',
        context: 'Milen.ia · Hitech Electric',
        status: 'producao',
        statusLabel: 'In production',
        problem:
          'Dashboard, AI diagnostics and analyses all hit the database directly, each with its own interpretation of the data.',
        built:
          'I wrote a FastAPI service covering 6 domains and 28 endpoints, with typed Pydantic contracts and pytest coverage. I packaged a Postman collection for validation and handoff, so every new consumer comes through the same door under the same contract.',
        stack: ['Python', 'FastAPI', 'Pydantic', 'pytest', 'Supabase', 'PostgreSQL', 'Postman'],
      },
      {
        id: 'diagnostico-ia',
        title: 'AI-assisted fleet diagnostics',
        category: 'ia-agentes',
        context: 'Milen.ia · Hitech Electric',
        status: 'evolucao',
        statusLabel: 'In production · evolving',
        problem:
          'Raw telemetry is not actionable for the people running the fleet. Whoever reads the panel needs a conclusion, not a time series.',
        built:
          'I built the diagnostics layer that reads battery signals and usage patterns and returns them in natural language, grounded in the platform canonical schema. I also defined the three-phase ML roadmap: anomaly detection, time series forecasting and finally supervised models.',
        stack: ['Gemini Flash', 'Python', 'Supabase', 'Isolation Forest', 'Prophet', 'LightGBM'],
        note: 'The three phases are deliberately incremental: supervised models only enter once there is enough labelled history to train on without fooling yourself.',
      },
      {
        id: 'mila-sdr',
        title: 'Mila, a multichannel SDR agent',
        category: 'ia-agentes',
        context: 'Milen.ia',
        status: 'producao',
        statusLabel: 'In production',
        problem:
          'Lead qualification depending on a human team, across several channels, with uneven response times.',
        built:
          'I built a conversational agent for outbound flows using the SPIN methodology, integrated with the CRM and the customer service platform. The hard part was never the prompt: it was migrating the WhatsApp delivery layer without losing conversations, resolving concurrency between simultaneous messages from the same lead, normalising inconsistent source data and drawing a precise boundary around what enters the agent context.',
        stack: ['n8n', 'LLM', 'Chatwoot', 'WhatsApp Business API', 'Bitrix24', 'Supabase'],
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
        id: 'dashboards-operacao',
        title: 'Sales, marketing and finance dashboards',
        category: 'dashboards',
        context: 'Milen.ia',
        status: 'entregue',
        statusLabel: 'Delivered',
        problem:
          'Metrics scattered across CRM, spreadsheets and ERP, with every team reaching a different number for the same question.',
        built:
          'I unified the sales and marketing panels with two-phase data enrichment and KPIs validated with the team before they became charts. I also delivered a finance panel integrated with the ERP, closing the revenue loop.',
        stack: ['Lovable', 'Supabase', 'Bitrix24', 'Omie', 'SQL'],
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
        category: 'automacao',
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
      {
        id: 'anuros-ml',
        title: 'Anuran call classification',
        category: 'estudos',
        context: 'ML study',
        status: 'andamento',
        statusLabel: 'In progress',
        problem:
          'AnuraSet: a Brazilian bioacoustics dataset with 42 species and severe class imbalance.',
        built:
          'A study project covering the full ML cycle in the right order. A group-aware split before any modelling, so recordings from the same site cannot leak from train into test. A DummyClassifier baseline to set an honest bar, and F1-macro as the metric, because accuracy on a dataset like this lies.',
        stack: ['Python', 'pandas', 'scikit-learn', 'librosa'],
        note: 'It is in the portfolio for the method, not the result. The hard part of an imbalanced problem is building an evaluation you cannot fool yourself with.',
      },
    ],
  },

  stack: {
    eyebrow: '// stack',
    title: 'Stack',
    lead: 'Grouped by domain, with emphasis on what I use daily. No percentage bars, because proficiency is not a number anyone can defend.',
    coreLabel: 'Daily driver',
    core: ['Python', 'FastAPI', 'n8n', 'Supabase', 'PostgreSQL', 'TypeScript'],
    groups: [
      {
        label: 'Languages & APIs',
        items: ['Python', 'TypeScript', 'SQL', 'FastAPI', 'REST'],
      },
      {
        label: 'AI & ML',
        items: [
          'OpenAI',
          'Anthropic Claude',
          'Gemini',
          'Prompt engineering',
          'Agents',
          'scikit-learn',
          'LightGBM',
          'Prophet',
          'Isolation Forest',
        ],
      },
      {
        label: 'Automation & Integration',
        items: ['n8n', 'Webhooks', 'Bitrix24', 'Chatwoot', 'WhatsApp Business API', 'Apify'],
      },
      {
        label: 'Data & Infra',
        items: [
          'Supabase',
          'PostgreSQL',
          'MQTT',
          'Azure IoT Hub',
          'Event Hub',
          'Azure Functions',
          'Docker',
        ],
      },
      {
        label: 'Front & Deploy',
        items: ['Next.js', 'React', 'Tailwind', 'Vercel'],
      },
      {
        label: 'Quality',
        items: ['pytest', 'Postman', 'Git'],
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
        title: 'Data & telemetry',
        description:
          'The flows started demanding a source of truth, so I moved to owning the data architecture and writing APIs instead of chaining nodes. Today the data frequency is telemetry: real-time ingestion from an electric fleet, with ML fundamentals being built underneath.',
        markers: ['FastAPI', 'Supabase', 'PostgreSQL', 'MQTT', 'Azure IoT Hub', 'scikit-learn'],
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
};
