/* Painel administrativo do briefing — leitura das respostas.
   Usa window.BRIEFING / window.qid de questions.js */

const root = document.getElementById("adminApp");
(function setAdminTitle(){ try { var c=window.CLIENT||{}; var el=document.getElementById("adminSub"); if(el && c.nomeCurto) el.textContent = c.nomeCurto + " · RN Negrão"; } catch(e){} })();
let PASS = sessionStorage.getItem("rn_admin_pass") || "";

function esc(s) { return (s == null ? "" : String(s)).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }

function gate(msg) {
  root.innerHTML = "";
  const g = el(`
    <div class="gate">
      <h2>Acesso restrito</h2>
      <p class="muted">Informe a senha definida em <b>ADMIN_PASSWORD</b> no Railway.</p>
      <input type="password" id="pw" placeholder="Senha" autocomplete="current-password" />
      ${msg ? `<p class="error-text">${esc(msg)}</p>` : ""}
      <button class="btn-primary btn-wide" id="enter" type="button">Entrar</button>
    </div>
  `);
  root.appendChild(g);
  const pw = g.querySelector("#pw");
  const go = () => { PASS = pw.value; sessionStorage.setItem("rn_admin_pass", PASS); loadList(); };
  g.querySelector("#enter").addEventListener("click", go);
  pw.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
  pw.focus();
}

async function loadList() {
  root.innerHTML = `<p class="count">Carregando...</p>`;
  try {
    const res = await fetch("/api/submissions", { headers: { "x-admin-password": PASS } });
    if (res.status === 401) { sessionStorage.removeItem("rn_admin_pass"); return gate("Senha incorreta."); }
    if (res.status === 503) { const d = await res.json().catch(() => ({})); return gate(d.error || "Defina ADMIN_PASSWORD no Railway."); }
    const data = await res.json();
    if (!data.ok) return gate(data.error || "Erro ao carregar.");
    renderList(data.submissions || []);
  } catch (e) {
    root.innerHTML = `<p class="error-text">Não foi possível carregar as respostas. ${esc(e.message)}</p>`;
  }
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function renderList(subs) {
  root.innerHTML = "";
  const tools = el(`
    <div class="tools no-print">
      <button class="btn-ghost" id="reload" type="button">Atualizar</button>
      <button class="btn-ghost" id="print" type="button">Imprimir / Salvar PDF</button>
      <button class="btn-ghost" id="logout" type="button">Sair</button>
    </div>
  `);
  tools.querySelector("#reload").addEventListener("click", loadList);
  tools.querySelector("#print").addEventListener("click", () => {
    root.querySelectorAll("details.sub-card").forEach(d => (d.open = true));
    window.print();
  });
  tools.querySelector("#logout").addEventListener("click", () => { sessionStorage.removeItem("rn_admin_pass"); PASS = ""; gate(); });
  root.appendChild(tools);

  root.appendChild(el(`<p class="count">${subs.length} ${subs.length === 1 ? "resposta recebida" : "respostas recebidas"}.</p>`));

  if (!subs.length) {
    root.appendChild(el(`<div class="note-card green"><h4>Nenhuma resposta ainda</h4><p>Quando o cliente enviar o briefing, ele aparece aqui automaticamente.</p></div>`));
    return;
  }

  const blocos = window.BRIEFING.blocos;

  subs.forEach((sub, idx) => {
    const p = sub.payload || {};
    const id = p.identificacao || {};
    const respostas = p.respostas || {};
    const who = id.clinica || sub.clinica || ("Resposta " + (subs.length - idx));

    const card = el(`
      <details class="sub-card"${idx === 0 ? " open" : ""}>
        <summary>
          <span class="who">${esc(who)}</span>
          <span class="when">${esc(fmtDate(sub.createdAt))}</span>
        </summary>
        <div class="sub-body"></div>
      </details>
    `);
    const body = card.querySelector(".sub-body");

    const metaBits = [];
    if (id.responsavel) metaBits.push("Responsável: " + id.responsavel);
    if (id.cidade) metaBits.push(id.cidade);
    if (id.contato) metaBits.push("Contato: " + id.contato);
    if (id.instagram) metaBits.push(id.instagram);
    if (metaBits.length) body.appendChild(el(`<p class="meta-line">${esc(metaBits.join("  ·  "))}</p>`));

    let total = 0, answered = 0;
    const ans = el(`<div class="answers"></div>`);
    blocos.forEach((b, bi) => {
      ans.appendChild(el(`<h4>${esc(b.n + ". " + b.title)}</h4>`));
      b.perguntas.forEach((q, pi) => {
        const key = window.qid(bi, pi);
        const a = (respostas[key] || "").trim();
        total++; if (a) answered++;
        ans.appendChild(el(`
          <div class="qa">
            <p class="q">${esc(q)}</p>
            <p class="a${a ? "" : " empty"}">${a ? esc(a) : "— não respondido"}</p>
          </div>
        `));
      });
    });
    body.appendChild(el(`<p class="count">${answered} de ${total} perguntas respondidas.</p>`));
    body.appendChild(ans);
    root.appendChild(card);
  });
}

if (PASS) loadList(); else gate();
