/* ============================================================
   PERGUNTAS DO BRIEFING — Produção · Assessoria em Licitações
   Fonte única: usado pelo formulário (app.js) e pelo painel (admin.js).

   Estrutura: identificacao + blocos (n / title / purpose / perguntas).
   IDs das perguntas são automáticos (b1_q1, b1_q2, ...).
   ============================================================ */
window.BRIEFING = {
  identificacao: {
    eyebrow: "Ponto de partida",
    title: "Sobre a empresa",
    intro: "Alguns dados básicos para começar. Pode deixar em branco o que não quiser preencher agora.",
    fields: [
      { id: "clinica", label: "Nome da empresa", type: "text", placeholder: "Produção Assessoria em Licitações" },
      { id: "responsavel", label: "Responsável", type: "text", placeholder: "Quem responde por aqui" },
      { id: "cidade", label: "Cidade / UF", type: "text", placeholder: "Ex.: Londrina / PR" },
      { id: "contato", label: "Telefone / WhatsApp", type: "text", placeholder: "(00) 0 0000-0000" },
      { id: "instagram", label: "Site ou Instagram", type: "text", placeholder: "producaolicitacoes.com.br", optional: true },
    ],
  },
  blocos: [
    {
      n: "01", title: "A empresa hoje",
      purpose: "Um panorama geral: modelo de atuação, clientes atendidos, tamanho e momento atual.",
      perguntas: [
        "Como você descreveria a Produção em poucas palavras — o que faz, para quem e o que diferencia vocês?",
        "Quais serviços vocês oferecem hoje (captação, cadastro em órgãos, documentação, disputa, jurídico, gestão de contrato, busca de fornecedores)? Há um carro-chefe?",
        "Que tipos de empresa vocês atendem e em quais segmentos/produtos elas costumam atuar?",
        "Quantas pessoas trabalham na operação e como as funções são divididas (captação, disputa, documentação, jurídico, financeiro)?",
        "Quantos clientes ativos vocês têm hoje e quantas licitações chegam a acompanhar por semana ou por mês?",
        "Há sazonalidade no volume de editais ao longo do ano? Quais os períodos de pico?",
        "Fora a disputa em si, o que mais consome o tempo da equipe no dia a dia?",
        "Se você pudesse resolver um único gargalo da operação agora, qual seria?",
      ],
    },
    {
      n: "02", title: "Captação e triagem de oportunidades",
      purpose: "A porta de entrada: como os editais são encontrados e filtrados para cada cliente.",
      perguntas: [
        "Em quais portais e fontes vocês buscam editais hoje (PNCP, ComprasNet, BLL, portais estaduais e municipais, etc.)?",
        "A captação é manual ou usam alguma ferramenta de busca/monitoramento de editais? Quais?",
        "Como vocês decidem se uma oportunidade é compatível com o que cada cliente vende (palavras-chave, catálogo, margem)?",
        "Quantos editais relevantes vocês captam por dia/semana e quantos viram participação de fato?",
        "Como o cliente é avisado das oportunidades e como ele aprova (ou não) a participação?",
        "Já aconteceu de perder um bom edital por não ter captado a tempo? Com que frequência isso acontece?",
      ],
    },
    {
      n: "03", title: "Análise do edital e decisão de disputar",
      purpose: "A leitura do edital, as exigências e o critério de go / no-go.",
      perguntas: [
        "Como é feita a leitura do edital — quem analisa exigências, documentação e condições de entrega?",
        "Como vocês identificam os pontos de risco (exigências difíceis, prazos curtos, garantias, multas e penalidades)?",
        "Existe um processo para calcular se a disputa vale a pena (preço-alvo, margem mínima, custo de entrega)?",
        "Como e onde fica registrada a decisão de participar ou não, e o motivo?",
        "Onde costuma haver erro, retrabalho ou demora nessa etapa?",
      ],
    },
    {
      n: "04", title: "Fornecedores, cotação e formação de preço",
      purpose: "O sourcing que sustenta a proposta: encontrar fornecedor, negociar e fechar o preço de disputa.",
      perguntas: [
        "Para os itens de um edital, como vocês encontram e selecionam fornecedores?",
        "Como é feita a cotação (telefone, e-mail, WhatsApp, planilha)? Quantos fornecedores costumam consultar por item?",
        "Como negociam preço, volume, prazo e condição de entrega com o fornecedor?",
        "Como o preço final de disputa é montado (custo do fornecedor + impostos + frete + margem)? Onde fica esse cálculo?",
        "Como garantem que o fornecedor honra o preço cotado caso vocês vençam (validade da cotação, compromisso por escrito)?",
        "Vocês mantêm uma base de fornecedores por tipo de produto, com histórico de preços e desempenho? Onde fica isso?",
        "Qual o maior risco dessa etapa hoje (fornecedor que volta atrás, preço que muda, prazo que não fecha)?",
      ],
    },
    {
      n: "05", title: "Habilitação, certidões e documentação",
      purpose: "A papelada que pode desclassificar: cadastros, certidões com validade e montagem dos documentos.",
      perguntas: [
        "Quais documentos e certidões de cada cliente vocês precisam manter em dia (SICAF, certidões federal/estadual/municipal, FGTS, trabalhista, balanço)?",
        "Como vocês controlam as datas de validade dessas certidões hoje? Já perderam disputa por documento vencido?",
        "Como é feita a montagem da documentação de habilitação para cada participação?",
        "O cadastro nos órgãos e portais (SICAF e plataformas) — quem faz e como é mantido atualizado?",
        "Onde ficam guardados os documentos de cada cliente e quão rápido vocês os encontram quando precisam?",
      ],
    },
    {
      n: "06", title: "A disputa (pregão eletrônico e presencial)",
      purpose: "O momento da sessão: estratégia de lances e acompanhamento em tempo real.",
      perguntas: [
        "Como vocês acompanham e disputam os pregões — manual ou com robô de lances? Quantos simultâneos a equipe consegue?",
        "Como é definida a estratégia de lances e o preço mínimo de cada disputa?",
        "Como acompanham mensagens do pregoeiro, convocações e prazos durante a sessão?",
        "Já houve perda por erro de operação na sessão (lance errado, mensagem não vista, prazo da sessão perdido)?",
        "Como vocês registram o resultado de cada disputa (ganhou/perdeu, preço final, concorrente vencedor)?",
      ],
    },
    {
      n: "07", title: "Pós-disputa: contrato, ata, empenho e entrega",
      purpose: "Do 'ganhou' até a entrega e o recebimento — a fase que gera multa quando escapa.",
      perguntas: [
        "Vencida a licitação, qual é o passo a passo até o contrato/ata e até a entrega?",
        "Como vocês controlam atas de registro de preço (vigência, saldo de cada item, empenhos que chegam ao longo do ano)?",
        "Como acompanham empenhos, ordens de fornecimento e prazos de entrega de cada contrato?",
        "Quem cuida da entrega/logística junto ao fornecedor e ao órgão? Como isso é acompanhado?",
        "Como vocês sabem, a qualquer momento, em que estágio está cada contrato sem precisar abrir caso por caso?",
        "Onde costuma haver atraso, multa ou problema nessa fase?",
      ],
    },
    {
      n: "08", title: "Jurídico e prazos",
      purpose: "Impugnações, recursos e os prazos legais que não podem passar.",
      perguntas: [
        "Como vocês cuidam de pedidos de esclarecimento, impugnações, recursos e contrarrazões? Quem faz?",
        "Como controlam os prazos legais (impugnação, recurso, envio de documentos após a disputa)?",
        "Já perderam um prazo legal? Qual foi o impacto quando isso aconteceu?",
        "Vocês reaproveitam modelos e peças jurídicas? Onde ficam guardados?",
      ],
    },
    {
      n: "09", title: "Financeiro, honorários e repasses",
      purpose: "Como a assessoria é remunerada e como o dinheiro circula entre cliente e fornecedor.",
      perguntas: [
        "Como a Produção cobra pelo serviço (mensalidade, taxa de sucesso/% sobre contrato ganho, por edital)?",
        "Como vocês controlam o que têm a receber de cada cliente?",
        "Quando vocês fazem a gestão de recursos (pagamento de fornecedores pelo cliente através de vocês), como isso é controlado?",
        "A inadimplência de clientes é um problema? Como funciona a cobrança?",
        "Vocês conseguem enxergar a margem ou o resultado de cada contrato ganho?",
      ],
    },
    {
      n: "10", title: "Indicadores, ferramentas e prioridades",
      purpose: "Como você enxerga os números, o que usa hoje e o que falta para decidir melhor.",
      perguntas: [
        "Quais números vocês acompanham hoje (taxa de vitória, nº de disputas, faturamento gerado para os clientes, ticket por contrato)?",
        "Quais informações você gostaria de ter na palma da mão e hoje não tem?",
        "Quais ferramentas e sistemas usam hoje (portais, planilhas, CRM, robô de lances, WhatsApp)? O que falta neles?",
        "As informações de captação, disputa, documentação e financeiro ficam espalhadas ou centralizadas em um lugar só?",
        "Pensando nos próximos 6 a 12 meses, qual é o maior objetivo da Produção?",
        "Se existisse um sistema sob medida para a rotina de vocês, o que ele precisaria resolver primeiro?",
      ],
    },
  ],
};

/* IDs estáveis das perguntas: bloco + pergunta */
window.qid = function (bi, pi) { return "b" + (bi + 1) + "_q" + (pi + 1); };
