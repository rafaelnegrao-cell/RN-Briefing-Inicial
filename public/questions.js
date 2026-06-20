/* ============================================================
   Conteúdo do briefing — fonte única de verdade.
   Usado pelo formulário (app.js) e pelo painel (admin.js).
   Para adaptar a outro nicho, edite apenas este arquivo.
   ============================================================ */

window.BRIEFING = {
  identificacao: {
    eyebrow: "Ponto de partida",
    title: "Sobre a clínica",
    intro: "Alguns dados básicos para começar. Se preferir, pode deixar em branco o que não quiser preencher agora.",
    fields: [
      { id: "clinica", label: "Nome da clínica", type: "text", placeholder: "Ex.: Consultório Dra. Francielle Delgado" },
      { id: "responsavel", label: "Responsável técnica (CRO)", type: "text", placeholder: "Nome e número do CRO" },
      { id: "cidade", label: "Cidade / UF", type: "text", placeholder: "Ex.: Londrina / PR" },
      { id: "contato", label: "Telefone / WhatsApp", type: "text", placeholder: "(00) 0 0000-0000" },
      { id: "instagram", label: "Instagram ou site", type: "text", placeholder: "@suaclinica", optional: true },
    ],
  },
  blocos: [
    {
      n: "01", title: "A clínica hoje",
      purpose: "Para começar, um panorama geral: tamanho, estrutura e o momento atual da clínica.",
      perguntas: [
        "Como você descreveria a clínica em poucas palavras — especialidades, perfil dos pacientes e o que diferencia o seu atendimento?",
        "Quais procedimentos são oferecidos hoje? Há um foco principal (ex.: clínico geral, ortodontia, estética, implantes)?",
        "Quantas pessoas atuam na clínica (dentistas, auxiliares/ASB, recepção, gestão) e como o trabalho é dividido entre elas?",
        "Quantas cadeiras/consultórios estão em funcionamento e quais são os dias e horários de atendimento?",
        "Em média, quantos pacientes são atendidos por dia ou por semana? Há épocas de mais e de menos movimento?",
        "Fora o atendimento clínico em si, o que mais consome o seu tempo e o da equipe no dia a dia?",
        "Se você pudesse resolver um único problema da rotina da clínica agora, qual seria?",
      ],
    },
    {
      n: "02", title: "Como os pacientes chegam",
      purpose: "A porta de entrada: por onde vêm os pacientes e como é o primeiro contato.",
      perguntas: [
        "Por quais canais os novos pacientes chegam (indicação, Instagram, Google, convênio, passagem na rua)? Algum se destaca?",
        "Quem responde os contatos (WhatsApp, telefone, redes) e em quanto tempo, em média?",
        "Você consegue saber de onde veio cada paciente novo? Isso fica registrado em algum lugar?",
        "De cada 10 pessoas que entram em contato, quantas costumam agendar uma avaliação?",
        "Existe alguma divulgação ativa hoje (posts, anúncios, parcerias)? Quem cuida disso?",
      ],
    },
    {
      n: "03", title: "Agenda e agendamento",
      purpose: "O coração operacional: como os horários são organizados e protegidos.",
      perguntas: [
        "Como a agenda é organizada hoje (caderno, WhatsApp, planilha, algum sistema)?",
        "Como funciona a confirmação de consultas — quem faz e quando?",
        "Faltas e desmarcações de última hora são um problema? Você tem ideia de quanto representam?",
        "Como são tratados os encaixes e a lista de espera quando abre um horário?",
        "Quando há mais de um profissional ou cadeira, como a agenda é dividida sem conflito?",
        "O paciente consegue, de alguma forma, ver ou pedir horário sozinho, ou tudo passa pela recepção?",
      ],
    },
    {
      n: "04", title: "Avaliação e primeira consulta",
      purpose: "O momento em que o paciente vira um caso clínico e os registros começam.",
      perguntas: [
        "Como é registrada a ficha do paciente na primeira consulta (anamnese, histórico de saúde, dados pessoais)? Em papel ou digital?",
        "Como são guardados exames, radiografias e fotos do paciente?",
        "Onde fica registrado o diagnóstico clínico e o que foi observado na avaliação?",
        "Esses registros ficam fáceis de encontrar depois, quando o paciente retorna?",
      ],
    },
    {
      n: "05", title: "Plano de tratamento e orçamento",
      purpose: "Onde a clínica transforma diagnóstico em proposta — e proposta em decisão.",
      perguntas: [
        "Como o plano de tratamento é montado e apresentado ao paciente?",
        "Como o orçamento é gerado hoje (de cabeça, planilha, tabela de preços, sistema)?",
        "De cada 10 orçamentos apresentados, quantos costumam ser aceitos?",
        "Quando o paciente não fecha na hora, existe algum acompanhamento depois para retomar o contato? Como?",
        "Quais formas de pagamento são oferecidas (à vista, cartão, parcelado pela clínica, convênio)?",
        "Quando a clínica parcela direto com o paciente, como esse controle é feito?",
      ],
    },
    {
      n: "06", title: "Atendimento clínico e prontuário",
      purpose: "A execução do tratamento e a memória clínica de cada paciente.",
      perguntas: [
        "Como é registrado o que foi feito em cada sessão (a evolução do tratamento)?",
        "Você usa odontograma / prontuário em papel ou digital?",
        "Como sabe em que etapa cada paciente em tratamento está, sem precisar abrir caso por caso?",
        "Termos de consentimento e documentos clínicos — como são gerados e arquivados?",
        "Como os dados de saúde dos pacientes são protegidos hoje (acesso, backup, sigilo)?",
      ],
    },
    {
      n: "07", title: "Financeiro e recebimentos",
      purpose: "O dinheiro entrando, saindo e o que sobra no fim do mês.",
      perguntas: [
        "Como é feito o controle do que entra (recebimentos do dia e do mês)?",
        "Como você acompanha as parcelas a receber e quem está em atraso?",
        "A inadimplência é um problema hoje? Como a cobrança é feita?",
        "Se atende convênios, como funciona o repasse e a conferência dos valores?",
        "Há controle de contas a pagar e de quanto sobra no fim do mês (fluxo de caixa)?",
        "Caso trabalhe com outros dentistas ou parceiros, como são calculadas as comissões e repasses?",
      ],
    },
    {
      n: "08", title: "Materiais, estoque e laboratório",
      purpose: "Os insumos e os trabalhos externos que sustentam o atendimento.",
      perguntas: [
        "Como é controlado o estoque de materiais e descartáveis? Já faltou material em um momento crítico?",
        "Como são feitas as compras e o acompanhamento dos fornecedores?",
        "Para trabalhos de laboratório (próteses, alinhadores), como controla o que foi enviado e o prazo de retorno?",
      ],
    },
    {
      n: "09", title: "Retorno, manutenção e fidelização",
      purpose: "O que faz o paciente voltar, manter o tratamento e indicar a clínica.",
      perguntas: [
        "Existe rotina de retorno ou manutenção (ex.: limpeza periódica, controle)? Como o paciente é lembrado?",
        "Como você reativa pacientes que sumiram há algum tempo?",
        "Há alguma forma de medir a satisfação de quem é atendido?",
        "Na sua percepção, o que mais faz um paciente voltar e indicar a clínica?",
      ],
    },
    {
      n: "10", title: "Indicadores, ferramentas e prioridades",
      purpose: "Como você enxerga os números hoje e o que gostaria de ter para decidir melhor.",
      perguntas: [
        "Quais números você acompanha hoje para saber como a clínica vai (faturamento, novos pacientes, etc.)?",
        "Quais informações você gostaria de ter na palma da mão e hoje não tem?",
        "Quais ferramentas ou sistemas a clínica usa atualmente (incluindo papel e planilhas)? O que falta neles?",
        "Pensando nos próximos 6 a 12 meses, qual é o maior objetivo da clínica?",
        "Se existisse uma ferramenta feita sob medida para a sua rotina, o que ela precisaria resolver primeiro?",
      ],
    },
  ],
};

/* IDs estáveis das perguntas: bloco + pergunta */
window.qid = function (bi, pi) { return "b" + (bi + 1) + "_q" + (pi + 1); };
