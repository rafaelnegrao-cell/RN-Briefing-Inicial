/* ============================================================
   Briefing online · Consultório Dra. Francielle Delgado
   Wizard mobile-first com salvamento automático.
   ============================================================ */

/* >>> AJUSTE AQUI: WhatsApp do Rafael (DDI+DDD+numero, so digitos) <<<
   Ex.: Londrina -> 55 43 9 9999 9999  =>  "5543999999999"            */
const WHATSAPP_RAFAEL = "5543000000000";

const STORAGE_KEY = "briefing_francielle_v1";

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
      <img class="emblem" src="assets/emblema.png" alt="Emblema do Consultório Dra. Francielle Delgado" />
      <p class="kicker">Briefing de diagnóstico</p>
      <h1>Consultório<br>Dra. Francielle Delgado</h1>
      <p class="sub-serif">Vamos conhecer a sua clínica de perto.</p>
      <hr class="divider" />
      <p>Este é um roteiro de perguntas sobre o dia a dia da sua clínica — da chegada de um paciente novo até o retorno dele meses depois. A partir das suas respostas, preparamos um <b>diagnóstico</b> e uma proposta de solução feita sob medida para a sua rotina.</p>
      <div class="note-card">
        <h4>Como funciona</h4>
        <p>São 11 etapas curtas. Responda com naturalidade, do seu jeito — não há resposta certa ou errada. <b>Tudo é salvo automaticamente neste aparelho</b>, então você pode parar e continuar depois. Leva entre 15 e 25 minutos.</p>
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
      <p class="error-text" id="submitError" style="display:none"></p>
    </section>
  `);
  const review = s.querySelector(".review");

  // Identificação
  const idItems = BRIEFING.identificacao.fields
    .map(f => ({ q: f.label, a: state.identificacao[f.id] || "" }));
  review.appendChild(reviewGroup("Sobre a clínica", idItems, () => { state.step = CONTENT_FIRST; render(); }));

  // Blocos
  BRIEFING.blocos.forEach((b, bi) => {
    const items = b.perguntas.map((p, pi) => ({ q: p, a: state.respostas[qid(bi, pi)] || "" }));
    review.appendChild(reviewGroup(b.n + ". " + b.title, items, () => { state.step = CONTENT_FIRST + 1 + bi; render(); }));
  });

  const errBox = s.querySelector("#submitError");
  s.appendChild(navButtons({
    onBack: () => { state.step = CONTENT_LAST; render(); },
    nextLabel: "Enviar respostas",
    nextCopper: true,
    onNext: (ev) => doSubmit(ev.currentTarget, errBox),
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

/* ---------- Envio ---------- */
async function doSubmit(btn, errBox) {
  errBox.style.display = "none";
  btn.disabled = true;
  const original = btn.textContent;
  btn.textContent = "Enviando...";

  const meta = {
    enviadoEm: new Date().toISOString(),
    userAgent: navigator.userAgent,
    versao: "v1",
  };
  const payload = { identificacao: state.identificacao, respostas: state.respostas, meta };

  try {
    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) throw new Error(data.error || "Falha ao enviar.");
    submitted = "ok";
    clearSaved();
    render();
  } catch (e) {
    btn.disabled = false;
    btn.textContent = original;
    // fallback: oferece envio pelo WhatsApp com o resumo
    submitted = "fallback";
    render();
  }
}

/* ---------- Mensagem de WhatsApp ---------- */
function buildWhatsAppText(full) {
  const id = state.identificacao || {};
  let t = "Olá, Rafael! Respondi o briefing da clínica.";
  if (id.clinica) t += "\n\nClínica: " + id.clinica;
  if (id.responsavel) t += "\nResponsável: " + id.responsavel;
  if (id.contato) t += "\nContato: " + id.contato;

  if (full) {
    BRIEFING.blocos.forEach((b, bi) => {
      const respondidas = b.perguntas
        .map((p, pi) => ({ p, a: (state.respostas[qid(bi, pi)] || "").trim() }))
        .filter(x => x.a);
      if (!respondidas.length) return;
      t += "\n\n*" + b.n + ". " + b.title + "*";
      respondidas.forEach(x => { t += "\n- " + x.p + "\nR: " + x.a; });
    });
  } else {
    t += "\n\nAs respostas já foram enviadas pelo sistema. ✅";
  }
  return t;
}
function whatsappLink(full) {
  return "https://wa.me/" + WHATSAPP_RAFAEL + "?text=" + encodeURIComponent(buildWhatsAppText(full));
}

/* ---------- Sucesso / Fallback ---------- */
function renderSuccess() {
  const isFallback = submitted === "fallback";
  const s = el(`
    <section class="stage center-stage">
      <div class="seal">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h1>${isFallback ? "Vamos enviar pelo WhatsApp" : "Respostas enviadas!"}</h1>
      <div class="msg"></div>
      <div class="acts" style="margin-top:18px"></div>
      <div class="foot-by"><img src="assets/rn.png" alt="" />RN Negrão · Diagnóstico &amp; Soluções Empresariais</div>
    </section>
  `);
  const msg = s.querySelector(".msg");
  const acts = s.querySelector(".acts");

  if (isFallback) {
    msg.appendChild(el(`<p>Não consegui registrar as respostas no sistema agora (pode ser a conexão). Sem problema: toque no botão abaixo para enviá-las direto ao Rafael pelo WhatsApp — suas respostas continuam salvas neste aparelho.</p>`));
    const wa = el(`<a class="wa-btn" href="${whatsappLink(true)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zM6.597 20.13c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 0 0 1.51 5.26l-.999 3.648 3.978-1.043z"/></svg>Enviar pelo WhatsApp</a>`);
    acts.appendChild(wa);
    const retry = el(`<div style="margin-top:14px"><button class="btn-ghost btn-wide" type="button">Tentar enviar pelo sistema de novo</button></div>`);
    retry.querySelector("button").addEventListener("click", () => { submitted = false; state.step = REVIEW_STEP; render(); });
    acts.appendChild(retry);
  } else {
    msg.appendChild(el(`<p>Obrigado, Dra. Francielle. Suas respostas chegaram até nós. A partir delas, vamos preparar o diagnóstico da clínica e marcar uma conversa para apresentar os próximos passos.</p>`));
    const wa = el(`<a class="wa-btn" href="${whatsappLink(false)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zM6.597 20.13c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 0 0 1.51 5.26l-.999 3.648 3.978-1.043z"/></svg>Avisar Rafael no WhatsApp</a>`);
    acts.appendChild(el(`<p class="muted" style="font-size:14px">Quer avisar que já respondeu?</p>`));
    acts.appendChild(wa);
  }
  return s;
}

/* ---------- Início ---------- */
render();
