import type { PortfolioContent } from '@/types/portfolio';

export const pt: PortfolioContent = {
  locale: 'pt',

  meta: {
    title: 'Lucas Gomes · Analista de IA em agentes, automação e dados',
    description:
      'Construo a camada de inteligência entre dados operacionais e decisão: agentes de IA, automação de processos, APIs e dashboards em produção, e sites e sistemas para pequenos negócios. Curitiba, PR.',
    ogAlt:
      'Lucas Gomes, Analista de IA. Agentes, automação, APIs e integração de sistemas.',
    keywords: [
      'Analista de IA',
      'agentes de IA',
      'automação de processos',
      'engenharia de IA',
      'FastAPI',
      'n8n',
      'Supabase',
      'LangChain',
      'Curitiba',
    ],
  },

  nav: {
    label: 'Navegação principal',
    items: [
      { href: '#perfil', label: 'Perfil' },
      { href: '#foco', label: 'Foco' },
      { href: '#projetos', label: 'Projetos' },
      { href: '#stack', label: 'Stack' },
      { href: '#trajetoria', label: 'Trajetória' },
      { href: '#contato', label: 'Contato' },
    ],
    languageToggle: 'EN',
    skipToContent: 'Pular para o conteúdo',
    menuOpen: 'Abrir menu',
    menuClose: 'Fechar menu',
  },

  hero: {
    eyebrow: '// lucas gomes · curitiba, pr',
    name: 'Lucas Gomes',
    role: 'Analista de IA na Milen.ia',
    headline: 'Construo a camada de inteligência entre dados operacionais e decisão.',
    subheadline:
      'Agentes de IA, automação de processos, APIs e dashboards em produção na Milen.ia. Por conta própria, sites e sistemas para pequenos negócios no L² Studio.',
    availability: 'Alocado · aberto a conversas',
    location: 'Curitiba, PR · remoto',
    portraitAlt: 'Retrato de Lucas Gomes',
    ctaPrimary: 'Ver projetos',
    ctaSecondary: 'Falar comigo',
    gauges: [
      {
        label: 'SISTEMAS_INTEGRADOS',
        value: 8,
        display: '08',
        caption: 'CRM, atendimento, ERP, planilhas e LLMs',
      },
      {
        label: 'CERTIFICAÇÕES',
        value: 11,
        display: '11',
        caption: 'Agentes, RAG e SQL com IA',
      },
      {
        label: 'FOCO_ATUAL',
        display: 'IA_APLICADA',
        caption: 'Agentes, automação e APIs',
      },
    ],
  },

  about: {
    eyebrow: '// perfil',
    title: 'Sobre',
    paragraphs: [
      'Atuo na fronteira entre automação de negócio e engenharia. Desenho e implemento agentes de IA, workflows de automação, APIs em FastAPI e pipelines de dados que ligam CRM, atendimento, operação e produto. São sistemas que precisam funcionar sozinhos depois que eu saio da sala.',
      'A base veio de automação com n8n e integração de CRM: Bitrix24, Chatwoot, WhatsApp Business API. Dali evoluí para arquitetura de dados em Supabase e PostgreSQL e para APIs próprias, com contrato tipado, testes e autenticação, rodando em Docker e em serviços de nuvem da Azure.',
      'No dia a dia desenvolvo junto com agentes de código, como o Claude Code, e trato o que um modelo escreve como entrada não confiável: validação, testes e revisão antes de qualquer coisa chegar à produção. Fora da Milen.ia, levo o mesmo cuidado ao L² Studio, onde crio sites e sistemas para pequenos negócios com o Lucas Bastos.',
      'Trabalho remoto, comunicação direta e entrega orientada a resultado mensurável.',
    ],
    facts: [
      { label: 'LOCALIZAÇÃO', value: 'Curitiba, PR · Brasil' },
      { label: 'CARGO', value: 'Analista de IA · Milen.ia (PJ)' },
      { label: 'FOCO', value: 'Agentes, automação, APIs e dados' },
      { label: 'DISPONIBILIDADE', value: 'Alocado · aberto a conversas' },
    ],
    education: {
      eyebrow: '// formação',
      degree: 'Tecnologia em Análise e Desenvolvimento de Sistemas',
      period: '2022 a 2025',
      status: 'Concluído',
    },
    credentials: {
      eyebrow: '// certificações',
      issuer: 'Viver de IA',
      summary:
        'Formação aplicada em agentes de IA no n8n, RAG, plataformas multiagente e SQL com IA. Cada certificado virou trabalho entregue em produção.',
      items: [
        'Agentes de IA no n8n',
        'Como fazer RAG na prática',
        'Plataforma de atendimento multiagentes com AI',
        'Crie um SDR no WhatsApp com n8n',
        'Blog automático com IA 3.0',
        'Chatbot n8n',
        'Formação de SQL com AI',
        'Mega automação de redes sociais',
        'Lovable na prática',
        'Formação de Perplexity',
        'Assistente de configuração do Make',
      ],
    },
  },

  focus: {
    eyebrow: '// foco atual',
    title: 'No que estou trabalhando agora',
    lead: 'Duas frentes ao mesmo tempo: uma dentro da Milen.ia, a outra por conta própria, com pequenos negócios.',
    tracks: [
      {
        label: 'MILEN.IA',
        title: 'IA aplicada, APIs e dados',
        description:
          'Agentes conversacionais e automações em n8n ligados ao CRM e ao atendimento, APIs em FastAPI com contrato tipado e testes, dashboards que juntam CRM e ERP numa única leitura e o monitoramento de tudo isso: erros de fluxo e custo de IA em tempo real.',
      },
      {
        label: 'L² STUDIO',
        title: 'Sites e sistemas para pequenos negócios',
        description:
          'Com o Lucas Bastos, faço sites e sistemas de gestão para academias, barbearias, clínicas e consultores, do layout ao deploy. Agendamento online, assinaturas, painel do dono e orçamento que o próprio cliente monta: software sob medida para quem não tem time de tecnologia.',
      },
    ],
  },

  projects: {
    eyebrow: '// projetos',
    title: 'Projetos',
    lead: 'Cada card descreve o problema, o que eu construí e com quê. Arquitetura e decisão técnica, nunca configuração, credencial ou dado de cliente.',
    filterAll: 'Todos',
    filterLabel: 'Filtrar projetos por categoria',
    categories: {
      'ia-agentes': 'IA & Agentes',
      'sites-sistemas': 'Sites & Sistemas',
      automacao: 'Automação',
      dashboards: 'Dashboards',
      estudos: 'Estudos',
    },
    labels: {
      problem: 'Problema',
      built: 'O que eu construí',
      stack: 'Stack',
      status: 'Estado',
      repo: 'Ver repositório',
      demo: 'Ver no ar',
      openDetail: 'Abrir detalhe',
      closeDetail: 'Fechar',
      confidential:
        'Detalhes de configuração, credenciais e dados de cliente ficam de fora por confidencialidade.',
    },
    items: [
      {
        id: 'mila-sdr',
        title: 'Mila, agente de SDR multicanal',
        category: 'ia-agentes',
        context: 'Milen.ia',
        featured: true,
        status: 'producao',
        statusLabel: 'Em produção',
        problem:
          'Qualificação de leads dependente de time humano, em múltiplos canais, com tempo de resposta desigual.',
        built:
          'Construí um agente conversacional para fluxos de outbound com metodologia SPIN, integrado ao CRM e à plataforma de atendimento. O trabalho difícil não foi o prompt: foi migrar a camada de entrega de WhatsApp sem perder conversa, resolver concorrência entre mensagens simultâneas do mesmo lead, normalizar dados de origem inconsistentes e delimitar com precisão o que entra no contexto do agente.',
        stack: ['n8n', 'LLM', 'Chatwoot', 'WhatsApp Business API', 'Bitrix24', 'Supabase'],
      },
      {
        id: 'milen-admin',
        title: 'Milen.ia Administration, a central de monitoramento',
        category: 'dashboards',
        context: 'Milen.ia',
        status: 'producao',
        statusLabel: 'Em produção',
        problem:
          'Erros de workflow se perdiam entre execuções, e o custo dos serviços de IA só aparecia de verdade na fatura do fim do mês.',
        built:
          'Construí um painel interno que recebe os erros de todos os workflows do n8n por webhook, por meio de um error handler global que liga cada workflow ao seu projeto, e mostra tudo em tempo real com Supabase Realtime. Na mesma tela ficam o custo e o consumo dos serviços de IA, OpenAI e ElevenLabs, com alerta quando o crédito se aproxima do fim. Convite de membros e coleta de uso rodam em Edge Functions.',
        stack: ['React', 'TypeScript', 'Supabase Realtime', 'Supabase Edge Functions', 'n8n', 'OpenAI API', 'ElevenLabs API'],
        note: 'Automação boa é a que avisa quando quebra. O painel existe para que nenhum erro de fluxo dependa de alguém abrir o log.',
      },
      {
        id: 'sql-copilot',
        title: 'SQL Copilot, perguntas de negócio em SQL seguro',
        category: 'estudos',
        context: 'Projeto pessoal',
        status: 'entregue',
        statusLabel: 'Entregue',
        repo: 'https://github.com/LucasdsGomes/sql-copilot',
        problem:
          'Deixar um LLM escrever SQL é fácil. O difícil é garantir que a consulta gerada nunca altere, apague ou exponha o que não deve.',
        built:
          'Construí uma API que recebe uma pergunta em linguagem natural, pede o SQL ao Claude e trata essa consulta como entrada não confiável: um validador com sqlglot recusa tudo o que não for leitura e força um LIMIT, e o banco roda numa conexão somente leitura, com tempo limite. Na frente, autenticação por chave com comparação em tempo constante e limite de requisições aplicado antes da autenticação. Testei de ponta a ponta numa nuvem gratuita e tirei do ar para não expor uma chave paga de LLM.',
        stack: ['Python', 'FastAPI', 'LangChain', 'Claude', 'sqlglot', 'SQLite', 'pytest', 'GitHub Actions'],
        note: 'Nenhuma camada é confiável sozinha: cada uma assume que a anterior falhou. É o mesmo princípio que aplico ao código que escrevo com agentes de IA.',
      },
      {
        id: 'dashboards-operacao',
        title: 'Dashboards comercial, marketing e financeiro',
        category: 'dashboards',
        context: 'Milen.ia',
        status: 'entregue',
        statusLabel: 'Entregue',
        problem:
          'Métricas espalhadas entre CRM, planilhas e ERP, com cada área chegando a um número diferente para a mesma pergunta.',
        built:
          'Unifiquei os painéis comercial e de marketing com enriquecimento de dados em duas fases e KPIs validados junto com o time antes de virar gráfico. Montei a visão de previsibilidade comercial, com meta, forecast e o que falta para bater o mês, pensada para a reunião semanal de vendas. E entreguei um painel financeiro integrado ao ERP, fechando o ciclo de receita.',
        stack: ['Lovable', 'Supabase', 'Bitrix24', 'Omie', 'SQL'],
      },
      {
        id: 'reativacao-base',
        title: 'Workflows de reativação de base',
        category: 'automacao',
        context: 'Milen.ia',
        status: 'producao',
        statusLabel: 'Em produção',
        problem:
          'Base de leads inativos parada, sem nenhuma cadência de retomada e sem controle de volume de disparo.',
        built:
          'Montei um conjunto de workflows de reativação com limite diário de disparo, validação de números nos formatos brasileiros (que variam mais do que parece) e criação de conversa no atendimento a partir de template aprovado. Para contornar o timeout de execução da plataforma, troquei espera por expiração baseada em timestamp: o fluxo retoma do ponto certo em vez de segurar a execução aberta.',
        stack: ['n8n', 'Bitrix24', 'Chatwoot', 'WhatsApp Business API', 'Google Sheets'],
      },
      {
        id: 'conteudo-automatizado',
        title: 'Publicação automatizada de conteúdo',
        category: 'automacao',
        context: 'Milen.ia',
        status: 'producao',
        statusLabel: 'Em produção',
        problem:
          'Produção de conteúdo manual, irregular e sempre a primeira coisa a ser cortada quando a semana aperta.',
        built:
          'Construí o pipeline que gera texto e imagem, publica via edge function e mantém o blog atualizado sem intervenção. Roda sozinho desde que subiu.',
        stack: ['n8n', 'Supabase Edge Functions', 'Picsart', 'Imagen'],
      },
      {
        id: 'navalha-barbearias',
        title: 'Navalha, sistema de gestão para barbearias',
        category: 'sites-sistemas',
        context: 'L² Studio',
        status: 'entregue',
        statusLabel: 'Demonstração no ar',
        demo: 'https://barbearia-navalha-demo.vercel.app',
        problem:
          'Barbearia pequena agenda pelo WhatsApp e controla assinatura de cabeça, e é aí que se perdem horário, cliente e receita.',
        built:
          'Construí o sistema que o L² Studio apresenta a barbearias: agendamento em cinco passos que respeita jornada, intervalo, folgas e agenda ocupada, sem deixar dois clientes no mesmo horário; área do cliente com assinaturas que o agendamento consome sozinho; e um painel do dono com receita, ticket médio e atendimentos. A demonstração roda sem banco externo: os dados de exemplo se criam na primeira visita.',
        stack: ['Next.js', 'TypeScript', 'Prisma', 'SQLite', 'Tailwind', 'ECharts', 'Zod', 'Playwright'],
      },
      {
        id: 'sites-pequenos-negocios',
        title: 'Sites para pequenos negócios',
        category: 'sites-sistemas',
        context: 'L² Studio',
        status: 'andamento',
        statusLabel: 'Em andamento',
        demo: 'https://suaconsultorapg.com',
        problem:
          'Academia, padaria, clínica e consultor precisam aparecer bem no Google e no WhatsApp, mas não têm tempo nem orçamento para uma agência.',
        built:
          'O site do próprio estúdio funciona como portfólio e termina num orçamento que o visitante monta sozinho. Para a Sua Consultora PG, de uma consultora imobiliária em Ponta Grossa, entregamos uma página com simulador de financiamento, calculadora de aluguel e checklist de documentos, publicada no Cloudflare Pages com cache e cabeçalhos de segurança. Sites leves, sem etapa de build, que o cliente consegue manter.',
        stack: ['HTML', 'CSS', 'JavaScript', 'Cloudflare Pages', 'Vercel', 'SEO'],
      },
      {
        id: 'rag-conhecimento-interno',
        title: 'Assistente de conhecimento interno (RAG)',
        category: 'ia-agentes',
        context: 'Projeto pessoal',
        status: 'entregue',
        statusLabel: 'Entregue',
        repo: 'https://github.com/LucasdsGomes/my-chatbot-n8n',
        problem:
          'Documentação interna, de políticas a manuais e regras técnicas, existe. Mas ninguém acha a resposta na hora em que precisa.',
        built:
          'Aplicação de perguntas e respostas sobre documentos internos usando RAG: ingestão de PDFs, embeddings e busca vetorial no Supabase, orquestração em n8n e uma camada de API em Express. Serviu para eu entender na prática onde RAG quebra: chunking ruim e recuperação irrelevante derrubam a resposta antes de o modelo abrir a boca.',
        stack: ['n8n', 'Supabase', 'pgvector', 'Express', 'RAG', 'Embeddings'],
      },
      {
        id: 'otimizador-processos',
        title: 'Otimizador de processos de negócio com IA',
        category: 'estudos',
        context: 'Projeto pessoal',
        status: 'entregue',
        statusLabel: 'Entregue',
        repo: 'https://github.com/LucasdsGomes/ai-business-process-optimizer',
        problem:
          'IA, automação e análise de dados costumam ser estudadas isoladas, e o aprendizado não sobrevive ao encontro com um fluxo real.',
        built:
          'Montei um fluxo único que recebe solicitações de processo, orquestra o tratamento, analisa com LLM e devolve o resultado em dashboard. É deliberadamente um estudo aplicado, não um tutorial polido: as decisões de arquitetura estão registradas no repositório, iterações inclusive.',
        stack: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'n8n', 'OpenRouter', 'Streamlit'],
      },
    ],
  },

  stack: {
    eyebrow: '// stack',
    title: 'Stack',
    lead: 'Agrupada por domínio, com destaque no que eu uso todo dia. Sem barra de porcentagem, porque proficiência não é um número que alguém consiga defender.',
    coreLabel: 'Uso diário',
    core: ['Python', 'FastAPI', 'n8n', 'Supabase', 'PostgreSQL', 'TypeScript', 'Claude Code'],
    groups: [
      {
        label: 'Linguagens & APIs',
        items: ['Python', 'TypeScript', 'SQL', 'FastAPI', 'Pydantic', 'REST'],
      },
      {
        label: 'IA & Agentes',
        items: [
          'OpenAI',
          'Anthropic Claude',
          'Gemini',
          'LangChain',
          'RAG',
          'pgvector',
          'Agentes',
          'Engenharia de prompt',
          'Claude Code',
        ],
      },
      {
        label: 'Automação & Integração',
        items: ['n8n', 'Webhooks', 'Bitrix24', 'Chatwoot', 'WhatsApp Business API', 'Omie', 'Apify'],
      },
      {
        label: 'Dados & Infra',
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
        label: 'Qualidade',
        items: ['pytest', 'Vitest', 'Playwright', 'Postman', 'Git', 'GitHub Actions'],
      },
    ],
  },

  timeline: {
    eyebrow: '// trajetória',
    title: 'Trajetória',
    lead: 'Três fases, e a ordem importa: cada uma só foi possível porque a anterior já estava resolvida.',
    phases: [
      {
        index: '01',
        period: '2022 a 2024',
        title: 'Automação & integração',
        description:
          'Comecei como desenvolvedor freelance, escrevendo APIs e integrações em Python e Go e robôs de automação. Foi ali que aprendi que a maior parte de um problema de integração é dado inconsistente, não lógica de fluxo: tratando isso na origem, as falhas de processamento caíram 30%.',
        markers: ['Python', 'Go', 'REST', 'Selenium', 'PyAutoGUI'],
      },
      {
        index: '02',
        period: '2026',
        title: 'IA aplicada & CRM',
        description:
          'Entrei na Milen.ia ligando sistemas que não conversavam: CRM, atendimento e WhatsApp. Agentes conversacionais e workflows de automação em produção, com a régua de qualidade vindo do dado de origem, não do prompt.',
        markers: ['n8n', 'Bitrix24', 'Chatwoot', 'WhatsApp Business API', 'LLM'],
      },
      {
        index: '03',
        period: '2026 · atual',
        title: 'APIs, dados & produto',
        description:
          'Os fluxos passaram a exigir uma fonte de verdade, então migrei para arquitetura de dados própria e passei a escrever APIs em vez de encadear nós: contrato tipado, testes e autenticação. Em paralelo, abri o L² Studio para levar o mesmo cuidado a sites e sistemas de pequenos negócios.',
        markers: ['FastAPI', 'Supabase', 'PostgreSQL', 'Docker', 'Claude Code', 'Next.js'],
      },
    ],
  },

  contact: {
    eyebrow: '// contato',
    title: 'Vamos conversar',
    lead: 'Sem formulário. Escolha o canal, respondo em todos.',
    links: [
      {
        label: 'E-mail',
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
    rights: 'Todos os direitos reservados.',
    builtWith: 'Next.js · TypeScript · Tailwind · Vercel',
  },

  game: {
    title: {
      kicker: 'Uma descida pelas profundezas do dado',
      pressAnyKey: 'Pressione qualquer tecla',
      tapToStart: 'Toque para começar',
      menuLabel: 'Menu principal',
      menu: {
        start: 'Começar jornada',
        language: 'English',
        textVersion: 'Versão em texto',
      },
      controlsHint: '↑ ↓ para escolher · Enter para confirmar',
    },
    regions: {
      profile: { name: 'Clareira do Lampião', epithet: 'onde a luz acende' },
      focus: { name: 'Câmara das Duas Chamas', epithet: 'duas frentes, cada uma com sua chama' },
      projects: {
        name: 'Galerias do Dado Bruto',
        epithet: 'onde chove fluxo e as criaturas espreitam',
      },
      stack: { name: 'Santuário dos Amuletos', epithet: 'o que se carrega para a jornada' },
      path: { name: 'Mesa do Cartógrafo', epithet: 'o caminho até aqui, traçado à mão' },
      contact: { name: 'O Último Banco', epithet: 'descanse; a jornada fica salva' },
    },
    dialogue: {
      speaker: 'Lucas',
      advance: 'Continuar',
      showAll: 'Mostrar tudo',
      tabletTitle: 'Inscrições da clareira',
    },
    skipToJourney: 'Pular para a jornada',
    skipScene: 'Pular cena',
    bestiary: {
      lead: 'Cada problema que enfrentei virou uma criatura deste diário. A entrada conta como ela era e como foi derrotada.',
      bosses: 'Chefes',
      creatures: 'Criaturas',
      defeated: 'Derrotada',
      undefeated: 'Ainda não derrotada',
      open: 'Ler a entrada',
      close: 'Fechar o diário',
      labels: {
        creature: 'A criatura',
        victory: 'Como foi derrotada',
        arsenal: 'Arsenal',
        dream: 'Visão de sonho',
        repo: 'Ver repositório',
        demo: 'Ver no ar',
        replay: 'Rever a batalha',
      },
      entries: {
        'mila-sdr': { creature: 'chefe-cacador', name: 'Caçador das Sombras', boss: true },
        'milen-admin': { creature: 'chefe-guardiao', name: 'Guardião Arcano', boss: true },
        'sql-copilot': { creature: 'chefe-colosso', name: 'Colosso Blindado', boss: true },
        'dashboards-operacao': { creature: 'chefe-devorador', name: 'Devorador das Profundezas', boss: true },
        'reativacao-base': { creature: 'espectro', name: 'Espectro Fraco' },
        'conteudo-automatizado': { creature: 'inseto-voador', name: 'Inseto Voador' },
        'navalha-barbearias': { creature: 'sentinela', name: 'Sentinela de Torre' },
        'sites-pequenos-negocios': { creature: 'agua-viva', name: 'Água-viva das Cavernas' },
        'rag-conhecimento-interno': { creature: 'espirito', name: 'Espírito Errante' },
        'otimizador-processos': { creature: 'inseto-patrulha', name: 'Inseto Patrulha' },
      },
    },
    charms: {
      notches: 'Entalhes',
      notchesHint: 'Os amuletos equipados são os que uso todo dia.',
      bag: 'Na bolsa',
    },
    map: { here: 'Você está aqui' },
    bench: {
      rest: 'Descansar no banco',
      saved: 'Jornada salva',
      end: 'Fim da jornada',
      again: 'Nova jornada',
    },
    space: {
      key: 'Espaço',
      finish: 'Completar a fala',
      next: 'Próxima fala',
      region: 'Próxima região',
      rest: 'Descansar no banco',
      again: 'Nova jornada',
    },
    sound: {
      on: 'Desligar o som',
      off: 'Ligar o som',
      hint: 'M liga e desliga o som',
    },
    firefly: {
      poke: 'Cutucar o vagalume',
      controls: 'A D ou ← → para andar · W para pular · clique no vagalume',
    },
  },
};
