/* ============================================================
   Briefing online · Produção · Assessoria em Licitações
   Wizard mobile-first com salvamento automático.
   ============================================================ */

/* Configuração do cliente vem de config.js (window.CLIENT) */
const CLIENT = window.CLIENT || {};
const WHATSAPP_RAFAEL = CLIENT.whatsapp || "";
const EMAIL_RAFAEL = CLIENT.email || "";

/* Aplica a cor de acento da marca do cliente e o nome na barra */
(function applyClient() {
  try {
    const r = document.documentElement.style;
    if (CLIENT.acento) r.setProperty("--copper", CLIENT.acento);
    if (CLIENT.acentoEscuro) r.setProperty("--copper-deep", CLIENT.acentoEscuro);
    if (CLIENT.acentoClaro) r.setProperty("--copper-soft", CLIENT.acentoClaro);
    const bn = document.getElementById("brandName");
    if (bn && CLIENT.nomeCurto) bn.textContent = CLIENT.nomeCurto;
  } catch (e) {}
})();

const STORAGE_KEY = "briefing_producao_v1";

/* Conteúdo e helper qid: ver questions.js (window.BRIEFING / window.qid) */

/* ---------- Estado ---------- */
let state = {
  step: 0,            // 0 = welcome; 1 = identificacao; 2..11 = blocos; 12 = revisao
  identificacao: {},
  respostas: {},
};
let submitted = false;

const CONTENT_FIRST = 1;                              // primeira etapa de conteúdo
const CONTENT_LAST = 1 + BRIEFING.blocos.length;     // = 11 (último bloco)
const REVIEW_STEP = CONTENT_LAST + 1;                // = 12
const TOTAL_CONTENT = BRIEFING.blocos.length + 1;    // identificação + blocos

/* ---------- Persistência ---------- */
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      step: state.step,
      identificacao: state.identificacao,
      respostas: state.respostas,
      ts: Date.now(),
    }));
  } catch (e) { /* sem localStorage: segue sem salvar */ }
}
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}
function clearSaved() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

/* ---------- Helpers de DOM ---------- */
const app = document.getElementById("app");
const topbar = document.getElementById("topbar");
const topStep = document.getElementById("topStep");
const progressBar = document.getElementById("progressBar");

function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function esc(s) { return (s == null ? "" : String(s)).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function scrollTop() { window.scrollTo({ top: 0, behavior: "auto" }); }

/* ---------- Barra de progresso ---------- */
function updateProgress() {
  if (state.step < CONTENT_FIRST || submitted) { topbar.classList.add("is-hidden"); return; }
  topbar.classList.remove("is-hidden");
  let pos, label;
  if (state.step <= CONTENT_LAST) {
    pos = state.step; // 1..11
    label = "Etapa " + pos + " de " + TOTAL_CONTENT;
  } else {
    pos = TOTAL_CONTENT; label = "Revisão final";
  }
  const pct = Math.round((pos / TOTAL_CONTENT) * 100);
  progressBar.style.width = pct + "%";
  topStep.textContent = label;
}

/* ============================================================
   Renderização das etapas
   ============================================================ */
function render() {
  updateProgress();
  app.innerHTML = "";
  let node;
  if (submitted) node = renderSuccess();
  else if (state.step === 0) node = renderWelcome();
  else if (state.step === CONTENT_FIRST) node = renderIdentificacao();
  else if (state.step <= CONTENT_LAST) node = renderBloco(state.step - CONTENT_FIRST - 1);
  else node = renderRevisao();
  app.appendChild(node);
  scrollTop();
}

function navButtons({ backLabel, nextLabel, onBack, onNext, nextCopper, nextWide }) {
  const nav = el(`<div class="nav"><div class="nav-inner"></div></div>`);
  const inner = nav.querySelector(".nav-inner");
  if (onBack) {
    const b = el(`<button class="btn-ghost" type="button">${esc(backLabel || "Voltar")}</button>`);
    b.addEventListener("click", onBack);
    inner.appendChild(b);
  }
  const n = el(`<button class="btn-primary${nextCopper ? " copper" : ""}${nextWide ? " btn-wide" : ""}" type="button">${esc(nextLabel)}</button>`);
  n.addEventListener("click", onNext);
  inner.appendChild(n);
  return nav;
}

/* ---------- Welcome ---------- */
function renderWelcome() {
  const saved = load();
  const hasProgress = saved && saved.respostas && Object.keys(saved.respostas).length > 0;
  const s = el(`
    <section class="stage welcome">
      <img class="emblem" src="assets/emblema.png" alt="Emblema Produção" />
      <p class="kicker">${esc(CLIENT.kicker || "Briefing de diagnóstico")}</p>
      <h1>${esc(CLIENT.nome || "Cliente")}</h1>
      <p class="sub-serif">${esc(CLIENT.subtitulo || "Vamos conhecer o seu negócio de perto.")}</p>
      <hr class="divider" />
      <p>${CLIENT.intro || "Este é um roteiro de perguntas sobre o seu dia a dia. A partir das suas respostas, preparamos um <b>diagnóstico</b> e uma proposta de solução sob medida."}</p>
      <div class="note-card">
        <h4>Como funciona</h4>
        <p>São ${TOTAL_CONTENT} etapas curtas. Responda com naturalidade, do seu jeito — não há resposta certa ou errada. <b>Tudo é salvo automaticamente neste aparelho</b>, então você pode parar e continuar depois.</p>
      </div>
      <div class="actions"></div>
      <div class="foot-by"><img src="assets/rn.png" alt="" />preparado por RN Negrão · Diagnóstico &amp; Soluções Empresariais</div>
    </section>
  `);
  const actions = s.querySelector(".actions");
  const startBtn = el(`<button class="btn-primary copper btn-wide" type="button" style="margin-top:20px">${hasProgress ? "Continuar de onde parei" : "Começar"}</button>`);
  startBtn.addEventListener("click", () => {
    if (hasProgress) {
      state.identificacao = saved.identificacao || {};
      state.respostas = saved.respostas || {};
      state.step = Math.max(CONTENT_FIRST, saved.step || CONTENT_FIRST);
      if (state.step > REVIEW_STEP) state.step = REVIEW_STEP;
    } else {
      state.step = CONTENT_FIRST;
    }
    render();
  });
  actions.appendChild(startBtn);
  if (hasProgress) {
    const fresh = el(`<button class="btn-link" type="button" style="margin-top:12px">Recomeçar do zero</button>`);
    fresh.addEventListener("click", () => {
      if (confirm("Isso apaga as respostas salvas neste aparelho. Deseja recomeçar?")) {
        clearSaved(); state.identificacao = {}; state.respostas = {}; state.step = CONTENT_FIRST; render();
      }
    });
    actions.appendChild(fresh);
  }
  return s;
}

/* ---------- Identificação ---------- */
function renderIdentificacao() {
  const cfg = BRIEFING.identificacao;
  const s = el(`
    <section class="stage">
      <p class="eyebrow">${esc(cfg.eyebrow)}</p>
      <h1 class="title">${esc(cfg.title)}</h1>
      <p class="purpose">${esc(cfg.intro)}</p>
      <div class="fields"></div>
    </section>
  `);
  const box = s.querySelector(".fields");
  cfg.fields.forEach(f => {
    const val = state.identificacao[f.id] || "";
    const field = el(`
      <div class="field${val ? " answered" : ""}">
        <label for="${f.id}">${esc(f.label)}${f.optional ? ' <span class="optional">(opcional)</span>' : ""}</label>
        <input type="text" id="${f.id}" value="${esc(val)}" placeholder="${esc(f.placeholder || "")}" autocomplete="off" />
      </div>
    `);
    const input = field.querySelector("input");
    input.addEventListener("input", () => {
      state.identificacao[f.id] = input.value;
      field.classList.toggle("answered", !!input.value.trim());
      save();
    });
    box.appendChild(field);
  });
  s.appendChild(savedHint());
  s.appendChild(navButtons({
    onBack: () => { state.step = 0; render(); },
    nextLabel: "Continuar",
    nextCopper: true,
    onNext: () => { state.step = CONTENT_FIRST + 1; render(); },
  }));
  return s;
}

/* ---------- Bloco ---------- */
function renderBloco(bi) {
  const b = BRIEFING.blocos[bi];
  const s = el(`
    <section class="stage">
      <div class="block-head">
        <div class="badge">${esc(b.n)}</div>
        <h2>${esc(b.title)}</h2>
      </div>
      <p class="purpose">${esc(b.purpose)}</p>
      <div class="fields"></div>
    </section>
  `);
  const box = s.querySelector(".fields");
  b.perguntas.forEach((p, pi) => {
    const id = qid(bi, pi);
    const val = state.respostas[id] || "";
    const field = el(`
      <div class="field${val.trim() ? " answered" : ""}">
        <label for="${id}"><span class="qnum">${pi + 1}.</span>${esc(p)}</label>
        <textarea id="${id}" rows="3" placeholder="Escreva aqui...">${esc(val)}</textarea>
      </div>
    `);
    const ta = field.querySelector("textarea");
    autoGrow(ta);
    ta.addEventListener("input", () => {
      state.respostas[id] = ta.value;
      field.classList.toggle("answered", !!ta.value.trim());
      autoGrow(ta);
      save();
    });
    box.appendChild(field);
  });
  s.appendChild(savedHint());

  const isLast = bi === BRIEFING.blocos.length - 1;
  s.appendChild(navButtons({
    onBack: () => { state.step = CONTENT_FIRST + bi; render(); },
    nextLabel: isLast ? "Revisar respostas" : "Continuar",
    nextCopper: true,
    onNext: () => { state.step = CONTENT_FIRST + bi + 2; render(); },
  }));
  return s;
}

function autoGrow(ta) {
  ta.style.height = "auto";
  ta.style.height = Math.max(ta.scrollHeight, 96) + "px";
}

function savedHint() {
  return el(`<p class="saved-hint">Suas respostas ficam <b>salvas automaticamente</b> neste aparelho.</p>`);
}

/* ---------- Revisão ---------- */
function renderRevisao() {
  const s = el(`
    <section class="stage">
      <p class="eyebrow">Quase lá</p>
      <h1 class="title">Revise antes de enviar</h1>
      <p class="purpose">Confira suas respostas. Toque em qualquer bloco para editar. Não precisa ter respondido tudo — envie o que conseguir.</p>
      <div class="review"></div>
    </section>
  `);
  const review = s.querySelector(".review");

  // Identificação
  const idItems = BRIEFING.identificacao.fields
    .map(f => ({ q: f.label, a: state.identificacao[f.id] || "" }));
  review.appendChild(reviewGroup("Sobre a empresa", idItems, () => { state.step = CONTENT_FIRST; render(); }));

  // Blocos
  BRIEFING.blocos.forEach((b, bi) => {
    const items = b.perguntas.map((p, pi) => ({ q: p, a: state.respostas[qid(bi, pi)] || "" }));
    review.appendChild(reviewGroup(b.n + ". " + b.title, items, () => { state.step = CONTENT_FIRST + 1 + bi; render(); }));
  });

  s.appendChild(navButtons({
    onBack: () => { state.step = CONTENT_LAST; render(); },
    nextLabel: "Concluir e gerar PDF",
    nextCopper: true,
    onNext: () => finish(),
  }));
  return s;
}

function reviewGroup(title, items, onEdit) {
  const g = el(`
    <div class="review-group">
      <div class="rg-head">
        <h3>${esc(title)}</h3>
        <button class="btn-link" type="button">Editar</button>
      </div>
      <div class="qa-list"></div>
    </div>
  `);
  g.querySelector("button").addEventListener("click", onEdit);
  const list = g.querySelector(".qa-list");
  items.forEach(it => {
    const a = (it.a || "").trim();
    list.appendChild(el(`
      <div class="qa">
        <p class="q">${esc(it.q)}</p>
        <p class="a${a ? "" : " empty"}">${a ? esc(a) : "— não respondido"}</p>
      </div>
    `));
  });
  return g;
}

/* ============================================================
   Conclusão: PDF das respostas + envio (WhatsApp / e-mail / share)
   ============================================================ */

let _emblemDataUrl = null;
(function preloadEmblem() {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext("2d").drawImage(img, 0, 0);
        _emblemDataUrl = c.toDataURL("image/png");
      } catch (e) {}
    };
    img.src = "assets/emblema.png";
  } catch (e) {}
})();

function stripAccents(s) { return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
function sanitizeFile(s) {
  return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 _-]/g, "").trim().replace(/\s+/g, "-").slice(0, 60);
}
function pdfFilename() {
  const nome = sanitizeFile(state.identificacao.clinica) || sanitizeFile(CLIENT.nome) || "Briefing";
  return "Briefing-" + nome + ".pdf";
}
function dataHoje() {
  return new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function buildPdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, H = 297, M = 18;
  const maxW = W - M * 2;
  let y = M;

  const GREEN = [31, 58, 46], COPPER = [164, 103, 63], INK = [43, 43, 43], SOFT = [90, 90, 86], LINE = [210, 198, 180];

  function footer() {
    doc.setDrawColor(LINE[0], LINE[1], LINE[2]); doc.setLineWidth(0.2);
    doc.line(M, H - 14, W - M, H - 14);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(SOFT[0], SOFT[1], SOFT[2]);
    doc.text("preparado por RN Negrao - Diagnostico & Solucoes Empresariais", M, H - 9);
    doc.text("Pagina " + doc.internal.getNumberOfPages(), W - M, H - 9, { align: "right" });
  }
  function ensure(h) { if (y + h > H - 20) { footer(); doc.addPage(); y = M; } }

  // Cabeçalho
  if (_emblemDataUrl) {
    try { doc.addImage(_emblemDataUrl, "PNG", W / 2 - 11, y, 22, 22); } catch (e) {}
    y += 26;
  }
  doc.setFont("times", "italic"); doc.setFontSize(9.5); doc.setTextColor(COPPER[0], COPPER[1], COPPER[2]);
  doc.text("BRIEFING DE DIAGNOSTICO OPERACIONAL", W / 2, y, { align: "center" }); y += 7;
  doc.setFont("times", "bold"); doc.setFontSize(18); doc.setTextColor(GREEN[0], GREEN[1], GREEN[2]);
  doc.text(stripAccents(CLIENT.nome || "Briefing"), W / 2, y, { align: "center" }); y += 7;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(SOFT[0], SOFT[1], SOFT[2]);
  doc.text("Respostas preenchidas em " + dataHoje(), W / 2, y, { align: "center" }); y += 6;
  doc.setDrawColor(COPPER[0], COPPER[1], COPPER[2]); doc.setLineWidth(0.5);
  doc.line(W / 2 - 20, y, W / 2 + 20, y); y += 8;

  // Identificação
  const idFields = BRIEFING.identificacao.fields
    .map(f => ({ l: f.label, v: (state.identificacao[f.id] || "").trim() }))
    .filter(x => x.v);
  if (idFields.length) {
    doc.setFont("times", "bold"); doc.setFontSize(12); doc.setTextColor(GREEN[0], GREEN[1], GREEN[2]);
    ensure(8); doc.text("Sobre a empresa", M, y); y += 6;
    doc.setFontSize(9.8);
    idFields.forEach(x => {
      ensure(6);
      doc.setFont("helvetica", "bold"); doc.setTextColor(SOFT[0], SOFT[1], SOFT[2]);
      doc.text(x.l + ": ", M, y);
      const lw = doc.getTextWidth(x.l + ": ");
      doc.setFont("helvetica", "normal"); doc.setTextColor(INK[0], INK[1], INK[2]);
      const lines = doc.splitTextToSize(x.v, maxW - lw);
      doc.text(lines, M + lw, y);
      y += Math.max(5, lines.length * 5);
    });
    y += 3;
  }

  // Blocos
  BRIEFING.blocos.forEach((b, bi) => {
    ensure(14);
    doc.setDrawColor(LINE[0], LINE[1], LINE[2]); doc.setLineWidth(0.2);
    doc.line(M, y, W - M, y); y += 6;
    doc.setFont("times", "bold"); doc.setFontSize(12.5); doc.setTextColor(GREEN[0], GREEN[1], GREEN[2]);
    doc.text(b.n + ". " + b.title, M, y); y += 6;

    b.perguntas.forEach((p, pi) => {
      const a = (state.respostas[qid(bi, pi)] || "").trim();
      const qLines = doc.splitTextToSize((pi + 1) + ". " + p, maxW);
      const aLines = doc.splitTextToSize(a || "(nao respondido)", maxW - 4);
      ensure(qLines.length * 4.6 + aLines.length * 4.8 + 5);
      doc.setFont("helvetica", "bold"); doc.setFontSize(9.3); doc.setTextColor(SOFT[0], SOFT[1], SOFT[2]);
      doc.text(qLines, M, y); y += qLines.length * 4.6 + 1;
      doc.setFont("helvetica", a ? "normal" : "italic"); doc.setFontSize(10);
      if (a) doc.setTextColor(INK[0], INK[1], INK[2]); else doc.setTextColor(150, 150, 150);
      doc.text(aLines, M + 4, y); y += aLines.length * 4.8 + 4;
    });
    y += 2;
  });

  footer();
  return doc;
}

let _cachedDoc = null;
function getDoc() { if (!_cachedDoc) _cachedDoc = buildPdf(); return _cachedDoc; }
function downloadPdf() { getDoc().save(pdfFilename()); }
function pdfBlob() { return getDoc().output("blob"); }

async function trySharePdf(extraText) {
  if (!(navigator.canShare && navigator.share)) return null;
  try {
    const file = new File([pdfBlob()], pdfFilename(), { type: "application/pdf" });
    if (!navigator.canShare({ files: [file] })) return null;
    await navigator.share({ files: [file], title: "Briefing preenchido", text: extraText || "Segue o briefing preenchido." });
    return true;
  } catch (e) { return false; }
}

function whatsappTextShort() {
  const c = (state.identificacao.clinica || "").trim();
  return "Ola, Rafael! Preenchi o briefing" + (c ? " da " + c : "") + ". Estou enviando o PDF com as respostas.";
}
function whatsappLink() {
  return "https://wa.me/" + WHATSAPP_RAFAEL + "?text=" + encodeURIComponent(whatsappTextShort());
}
function emailLink() {
  const subject = "Briefing preenchido" + (state.identificacao.clinica ? " - " + state.identificacao.clinica : "");
  const body = whatsappTextShort() + "\n\n(O PDF das respostas esta anexado a este e-mail.)";
  return "mailto:" + EMAIL_RAFAEL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

/* salvamento no banco em segundo plano (best-effort) */
function saveToServer() {
  try {
    const payload = {
      identificacao: state.identificacao,
      respostas: state.respostas,
      meta: { enviadoEm: new Date().toISOString(), userAgent: navigator.userAgent, versao: "v1" },
    };
    fetch("/api/submissions", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    }).catch(() => {});
  } catch (e) {}
}

function finish() {
  _cachedDoc = null;   // PDF sempre com os dados mais recentes
  saveToServer();      // best-effort, nao bloqueia
  submitted = true;
  render();
}

const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zM6.597 20.13c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 0 0 1.51 5.26l-.999 3.648 3.978-1.043z"/></svg>';

function renderSuccess() {
  const s = el(`
    <section class="stage center-stage">
      <div class="seal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h1>Tudo pronto!</h1>
      <p>Gere o PDF com as suas respostas e envie pelo canal que preferir. No celular, o arquivo já vai anexado ao tocar em enviar.</p>
      <div class="acts"></div>
      <p class="saved-hint" id="sendHint" style="display:none"></p>
      <div class="foot-by"><img src="assets/rn.png" alt="" />RN Negrão · Diagnóstico &amp; Soluções Empresariais</div>
    </section>
  `);
  const acts = s.querySelector(".acts");
  const hint = s.querySelector("#sendHint");
  function showHint(msg) { hint.style.display = "block"; hint.innerHTML = msg; }

  const dl = el(`<button class="btn-primary copper btn-wide" type="button" style="margin-bottom:11px">Baixar PDF das respostas</button>`);
  dl.addEventListener("click", () => { downloadPdf(); showHint("PDF baixado. Você pode anexá-lo no WhatsApp ou e-mail."); });
  acts.appendChild(dl);

  const wa = el(`<button class="wa-btn btn-wide" type="button" style="margin-bottom:11px">${WA_ICON}Enviar pelo WhatsApp</button>`);
  wa.addEventListener("click", async () => {
    const shared = await trySharePdf(whatsappTextShort());
    if (shared) return;
    downloadPdf();
    window.open(whatsappLink(), "_blank");
    showHint("Abrimos a conversa e baixamos o PDF. <b>Toque no clipe e anexe o arquivo</b> que acabou de baixar.");
  });
  acts.appendChild(wa);

  const mail = el(`<button class="btn-ghost btn-wide" type="button">Enviar por e-mail</button>`);
  mail.addEventListener("click", async () => {
    const shared = await trySharePdf("Segue o briefing preenchido.");
    if (shared) return;
    downloadPdf();
    window.location.href = emailLink();
    showHint("Baixamos o PDF e abrimos o e-mail. <b>Anexe o arquivo</b> antes de enviar.");
  });
  acts.appendChild(mail);

  return s;
}


/* ---------- Início ---------- */
render();
