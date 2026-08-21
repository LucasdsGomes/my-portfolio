import type { PortfolioContent } from '@/types/portfolio';

export const pt: PortfolioContent = {
  locale: 'pt',

  meta: {
    title: 'Lucas Gomes — Analista de IA · automação, dados e telemetria',
    description:
      'Construo a camada de inteligência entre dados operacionais e decisão: agentes de IA, automação de processos, pipelines de telemetria IoT e APIs em produção. Curitiba, PR.',
    ogAlt:
      'Lucas Gomes — Analista de IA. Automação, integração de sistemas e engenharia de dados aplicada.',
    keywords: [
      'Analista de IA',
      'automação de processos',
      'engenharia de dados',
      'telemetria IoT',
      'FastAPI',
      'n8n',
      'Supabase',
      'Azure IoT Hub',
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
      'De agentes de IA e automação de processos a pipelines de telemetria IoT e APIs de produção. Hoje, construindo a plataforma de telemetria de uma frota de veículos comerciais elétricos.',
    availability: 'Alocado · aberto a conversas',
    location: 'Curitiba, PR — remoto',
    portraitAlt: 'Retrato de Lucas Gomes',
    ctaPrimary: 'Ver projetos',
    ctaSecondary: 'Falar comigo',
    gauges: [
      {
        label: 'ENDPOINTS_EM_PRODUÇÃO',
        value: 28,
        display: '28',
        caption: 'API de dados da plataforma · 6 domínios',
      },
      {
        label: 'INTEGRAÇÕES_ATIVAS',
        value: 4,
        display: '04',
        caption: 'Rodando sem intervenção manual',
      },
      {
        label: 'FOCO_ATUAL',
        display: 'TELEMETRIA_DE_FROTA',
        caption: 'Veículos comerciais elétricos',
      },
    ],
  },

  about: {
    eyebrow: '// perfil',
    title: 'Sobre',
    paragraphs: [
      'Atuo na fronteira entre automação de negócio e engenharia. Desenho e implemento agentes de IA, workflows de automação, APIs em FastAPI e pipelines de dados que ligam CRM, atendimento, operação e produto — sistemas que precisam funcionar sozinhos depois que eu saio da sala.',
      'A base veio de automação com n8n e integração de CRM: Bitrix24, Chatwoot, WhatsApp Business API. Dali evoluí para arquitetura de dados em Supabase e PostgreSQL e, mais recentemente, para ingestão de telemetria em tempo real com MQTT e Azure IoT Hub.',
      'Hoje estou aprofundando fundamentos de machine learning de forma prática: baseline honesto antes de modelo, F1-macro em classes desbalanceadas, split por grupo para não vazar dado entre treino e teste. Aplico o mesmo rigor tanto num projeto de classificação de áudio quanto em dados reais de frota.',
      'Trabalho remoto, comunicação direta e entrega orientada a resultado mensurável.',
    ],
    facts: [
      { label: 'LOCALIZAÇÃO', value: 'Curitiba, PR — Brasil' },
      { label: 'CARGO', value: 'Analista de IA · Milen.ia (PJ)' },
      { label: 'FOCO', value: 'Telemetria de frota · agentes · dados' },
      { label: 'DISPONIBILIDADE', value: 'Alocado · aberto a conversas' },
    ],
    education: {
      eyebrow: '// formação',
      degree: 'Tecnologia em Análise e Desenvolvimento de Sistemas',
      period: '2022 — 2025',
      status: 'Concluído',
    },
    credentials: {
      eyebrow: '// certificações',
      summary:
        'Formação aplicada em IA e automação — cada certificado abaixo virou trabalho entregue em produção.',
      items: [
        { title: 'Agentes de IA no n8n', issuer: 'Viver de IA', year: '2026' },
        { title: 'Como fazer RAG na prática', issuer: 'Viver de IA', year: '2026' },
        {
          title: 'Plataforma de atendimento multiagentes com AI',
          issuer: 'Viver de IA',
          year: '2026',
        },
        { title: 'Crie um SDR no WhatsApp com n8n', issuer: 'Viver de IA', year: '2026' },
        { title: 'Blog automático com IA 3.0', issuer: 'Viver de IA', year: '2026' },
        { title: 'Chatbot n8n', issuer: 'Viver de IA', year: '2026' },
        { title: 'Formação de SQL com AI', issuer: 'Viver de IA', year: '2026' },
        { title: 'Mega automação de redes sociais', issuer: 'Viver de IA', year: '2026' },
        { title: 'Lovable na prática', issuer: 'Viver de IA', year: '2026' },
        { title: 'Formação de Perplexity', issuer: 'Viver de IA', year: '2026' },
        { title: 'Assistente de configuração do Make', issuer: 'Viver de IA', year: '2026' },
      ],
    },
  },

  focus: {
    eyebrow: '// foco atual',
    title: 'No que estou trabalhando agora',
    lead: 'Duas frentes ao mesmo tempo: uma roda em produção, a outra garante que eu não pare de aprender o fundamento por baixo dela.',
    tracks: [
      {
        label: 'PRODUÇÃO',
        title: 'Telemetria de frota elétrica',
        description:
          'Ingestão de sinais de veículo em tempo real, schema canônico de banco e dashboard operacional para uma frota de veículos urbanos de carga elétricos. O próximo passo é sair da leitura descritiva para a preditiva: anomalia, previsão e, por fim, modelos supervisionados sobre dados reais de bateria e uso.',
      },
      {
        label: 'ESTUDO',
        title: 'Fundamentos de machine learning',
        description:
          'Ciclo completo de um problema de classificação difícil — bioacústica com 42 espécies e forte desbalanceamento — feito na ordem certa: split por grupo antes de tudo, baseline burro para ter régua, F1-macro como métrica. Método antes de resultado.',
      },
    ],
  },

  projects: {
    eyebrow: '// projetos',
    title: 'Projetos',
    lead: 'Cada card descreve o problema, o que eu construí e com quê. Arquitetura e decisão técnica — nunca configuração, credencial ou dado de cliente.',
    filterAll: 'Todos',
    filterLabel: 'Filtrar projetos por categoria',
    categories: {
      'ia-agentes': 'IA & Agentes',
      'dados-iot': 'Dados & IoT',
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
      openDetail: 'Abrir detalhe',
      closeDetail: 'Fechar',
      confidential:
        'Detalhes de configuração, credenciais e dados de cliente ficam de fora por confidencialidade.',
    },
    items: [
      {
        id: 'telemetria-frota',
        title: 'Plataforma de telemetria — frota elétrica',
        category: 'dados-iot',
        context: 'Milen.ia · Hitech Electric',
        featured: true,
        status: 'evolucao',
        statusLabel: 'Em produção · evolução',
        problem:
          'Uma frota de veículos urbanos de carga elétricos sem visibilidade operacional unificada: estado de bateria, saúde de células e uso real viviam em fontes separadas.',
        built:
          'Construí o pipeline completo de ingestão em tempo real — do veículo ao banco, passando por MQTT, Azure IoT Hub, Event Hub e Azure Functions — e o dashboard operacional em Next.js. Defini o schema canônico do banco com nomenclatura padronizada de sinais, o que eliminou a ambiguidade entre fontes e viabilizou análise histórica consistente. É a fundação sobre a qual a API e o diagnóstico por IA foram construídos.',
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
        title: 'API Anel 0 — camada de dados da plataforma',
        category: 'dados-iot',
        context: 'Milen.ia · Hitech Electric',
        status: 'producao',
        statusLabel: 'Em produção',
        problem:
          'Dashboard, diagnóstico por IA e análises acessavam o banco direto, cada um com sua própria interpretação dos dados.',
        built:
          'Escrevi uma API em FastAPI cobrindo 6 domínios e 28 endpoints, com contratos tipados em Pydantic e cobertura de testes em pytest. Empacotei uma coleção Postman para validação e handoff, de modo que qualquer consumidor novo entra pela mesma porta e com o mesmo contrato.',
        stack: ['Python', 'FastAPI', 'Pydantic', 'pytest', 'Supabase', 'PostgreSQL', 'Postman'],
      },
      {
        id: 'diagnostico-ia',
        title: 'Diagnóstico de frota assistido por IA',
        category: 'ia-agentes',
        context: 'Milen.ia · Hitech Electric',
        status: 'evolucao',
        statusLabel: 'Em produção · evolução',
        problem:
          'Telemetria bruta não é acionável para quem opera a frota — quem lê o painel precisa de uma conclusão, não de uma série temporal.',
        built:
          'Construí a camada de diagnóstico que interpreta sinais de bateria e padrão de uso e devolve a leitura em linguagem natural, apoiada no schema canônico da plataforma. Deixei definido o roadmap de ML em três fases: detecção de anomalia, previsão de séries temporais e, por fim, modelos supervisionados.',
        stack: ['Gemini Flash', 'Python', 'Supabase', 'Isolation Forest', 'Prophet', 'LightGBM'],
        note: 'As três fases do roadmap são deliberadamente incrementais: só entra modelo supervisionado depois que houver histórico rotulado suficiente para treinar sem se enganar.',
      },
      {
        id: 'mila-sdr',
        title: 'Mila — agente de SDR multicanal',
        category: 'ia-agentes',
        context: 'Milen.ia',
        status: 'producao',
        statusLabel: 'Em produção',
        problem:
          'Qualificação de leads dependente de time humano, em múltiplos canais, com tempo de resposta desigual.',
        built:
          'Construí um agente conversacional para fluxos de outbound com metodologia SPIN, integrado ao CRM e à plataforma de atendimento. O trabalho difícil não foi o prompt: foi migrar a camada de entrega de WhatsApp sem perder conversa, resolver concorrência entre mensagens simultâneas do mesmo lead, normalizar dados de origem inconsistentes e delimitar com precisão o que entra no contexto do agente.',
        stack: ['n8n', 'LLM', 'Chatwoot', 'WhatsApp Business API', 'Bitrix24', 'Supabase'],
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
          'Montei um conjunto de workflows de reativação com limite diário de disparo, validação de números nos formatos brasileiros (que variam mais do que parece) e criação de conversa no atendimento a partir de template aprovado. Para contornar o timeout de execução da plataforma, troquei espera por expiração baseada em timestamp — o fluxo retoma do ponto certo em vez de segurar a execução aberta.',
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
        id: 'dashboards-operacao',
        title: 'Dashboards comercial, marketing e financeiro',
        category: 'dashboards',
        context: 'Milen.ia',
        status: 'entregue',
        statusLabel: 'Entregue',
        problem:
          'Métricas espalhadas entre CRM, planilhas e ERP — cada área com um número diferente para a mesma pergunta.',
        built:
          'Unifiquei os painéis comercial e de marketing com enriquecimento de dados em duas fases e KPIs validados junto com o time antes de virar gráfico. Entreguei também um painel financeiro integrado ao ERP, fechando o ciclo de receita.',
        stack: ['Lovable', 'Supabase', 'Bitrix24', 'Omie', 'SQL'],
      },
      {
        id: 'prospeccao-b2b',
        title: 'Pipeline de prospecção B2B',
        category: 'automacao',
        context: 'Milen.ia',
        status: 'entregue',
        statusLabel: 'Entregue',
        problem: 'Listas de prospecção frias, sem contexto de negócio e sem critério de priorização.',
        built:
          'Construí a coleta de estabelecimentos, o enriquecimento por LLM de cada registro e a importação estruturada direto no CRM. O time passou a receber lead com contexto em vez de linha de planilha.',
        stack: ['Apify', 'OpenAI', 'Bitrix24', 'Python'],
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
          'Documentação interna — políticas, manuais, regras técnicas — existe, mas ninguém acha a resposta na hora em que precisa.',
        built:
          'Aplicação de perguntas e respostas sobre documentos internos usando RAG: ingestão de PDFs, embeddings e busca vetorial no Supabase, orquestração em n8n e uma camada de API em Express. Serviu para eu entender na prática onde RAG quebra — chunking ruim e recuperação irrelevante derrubam a resposta antes de o modelo abrir a boca.',
        stack: ['n8n', 'Supabase', 'pgvector', 'Express', 'RAG', 'Embeddings'],
      },
      {
        id: 'otimizador-processos',
        title: 'Otimizador de processos de negócio com IA',
        category: 'automacao',
        context: 'Projeto pessoal',
        status: 'entregue',
        statusLabel: 'Entregue',
        repo: 'https://github.com/LucasdsGomes/ai-business-process-optimizer',
        problem:
          'IA, automação e análise de dados costumam ser estudadas isoladas — e o aprendizado não sobrevive ao encontro com um fluxo real.',
        built:
          'Montei um fluxo único que recebe solicitações de processo, orquestra o tratamento, analisa com LLM e devolve o resultado em dashboard. É deliberadamente um estudo aplicado, não um tutorial polido: as decisões de arquitetura estão registradas no repositório, iterações inclusive.',
        stack: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'n8n', 'OpenRouter', 'Streamlit'],
      },
      {
        id: 'anuros-ml',
        title: 'Classificação de cantos de anuros',
        category: 'estudos',
        context: 'Estudo de ML',
        status: 'andamento',
        statusLabel: 'Em andamento',
        problem:
          'AnuraSet: dataset brasileiro de bioacústica com 42 espécies e desbalanceamento severo entre classes.',
        built:
          'Projeto de estudo do ciclo completo de ML feito na ordem certa. Split por grupo antes de qualquer modelagem, para que gravações do mesmo sítio não vazem de treino para teste. Baseline com DummyClassifier para estabelecer a régua honesta, e F1-macro como métrica — acurácia num dataset assim mente.',
        stack: ['Python', 'pandas', 'scikit-learn', 'librosa'],
        note: 'Está no portfólio pelo método, não pelo resultado. A parte difícil de um problema desbalanceado é montar uma avaliação em que você não consegue se enganar.',
      },
      {
        id: 'data-quality-analyzer',
        title: 'Analisador de qualidade de dados',
        category: 'estudos',
        context: 'Projeto pessoal',
        status: 'entregue',
        statusLabel: 'Entregue',
        repo: 'https://github.com/LucasdsGomes/data-quality-analyzer',
        problem:
          'Antes de confiar num dataset, alguém precisa dizer o quanto ele é confiável — e normalmente ninguém diz.',
        built:
          'Aplicação que recebe um CSV e devolve estatística descritiva, detecção de nulos e outliers, um score de qualidade de 0 a 100 e um relatório exportável. Nasceu do mesmo princípio que aplico em ML: diagnosticar o dado antes de tirar conclusão dele.',
        stack: ['Python', 'Streamlit', 'pandas', 'Matplotlib', 'ReportLab'],
      },
    ],
  },

  stack: {
    eyebrow: '// stack',
    title: 'Stack',
    lead: 'Agrupada por domínio, com destaque no que eu uso todo dia. Sem barra de porcentagem — proficiência não é um número que alguém consiga defender.',
    coreLabel: 'Uso diário',
    core: ['Python', 'FastAPI', 'n8n', 'Supabase', 'PostgreSQL', 'TypeScript'],
    groups: [
      {
        label: 'Linguagens & APIs',
        items: ['Python', 'TypeScript', 'SQL', 'FastAPI', 'REST'],
      },
      {
        label: 'IA & ML',
        items: [
          'OpenAI',
          'Anthropic Claude',
          'Gemini',
          'Engenharia de prompt',
          'Agentes',
          'scikit-learn',
          'LightGBM',
          'Prophet',
          'Isolation Forest',
        ],
      },
      {
        label: 'Automação & Integração',
        items: ['n8n', 'Webhooks', 'Bitrix24', 'Chatwoot', 'WhatsApp Business API', 'Apify'],
      },
      {
        label: 'Dados & Infra',
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
        label: 'Qualidade',
        items: ['pytest', 'Postman', 'Git'],
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
        title: 'Automação & CRM',
        description:
          'Comecei ligando sistemas que não conversavam: CRM, atendimento e WhatsApp. Aprendi que a maior parte do problema de automação é dado inconsistente, não lógica de fluxo.',
        markers: ['n8n', 'Bitrix24', 'Chatwoot', 'WhatsApp Business API'],
      },
      {
        index: '02',
        title: 'Integração & Dados',
        description:
          'Os fluxos passaram a exigir uma fonte de verdade. Migrei para arquitetura de dados própria e passei a escrever APIs em vez de encadear nós — com contrato, teste e schema pensado antes.',
        markers: ['FastAPI', 'Supabase', 'PostgreSQL', 'Agentes de IA', 'pytest'],
      },
      {
        index: '03',
        title: 'Telemetria IoT & ML',
        description:
          'A frequência de dados aumentou em ordens de grandeza e o problema virou ingestão em tempo real. É onde estou: telemetria de frota elétrica em produção e fundamentos de ML sendo construídos por baixo dela.',
        markers: ['MQTT', 'Azure IoT Hub', 'Event Hub', 'scikit-learn', 'Next.js'],
      },
    ],
  },

  contact: {
    eyebrow: '// contato',
    title: 'Vamos conversar',
    lead: 'Sem formulário. Escolha o canal — respondo em todos.',
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
};
