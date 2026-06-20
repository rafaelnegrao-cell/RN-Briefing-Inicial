const express = require("express");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public"), { maxAge: 0, etag: false }));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

// Saude do servico
app.get("/healthz", (req, res) => res.json({ ok: true }));

// Recebe as respostas do briefing
app.post("/api/submissions", async (req, res) => {
  try {
    const body = req.body || {};
    const identificacao = body.identificacao || {};
    const respostas = body.respostas || {};
    const meta = body.meta || {};

    if (!respostas || Object.keys(respostas).length === 0) {
      return res.status(400).json({ ok: false, error: "Nenhuma resposta foi enviada." });
    }

    const sub = await prisma.submission.create({
      data: {
        clinica: identificacao.clinica || null,
        responsavel: identificacao.responsavel || null,
        contato: identificacao.contato || null,
        payload: { identificacao, respostas, meta },
      },
    });

    res.json({ ok: true, id: sub.id });
  } catch (e) {
    console.error("Erro ao salvar submissao:", e);
    res.status(500).json({ ok: false, error: "Nao foi possivel salvar agora. Tente novamente." });
  }
});

// Protecao simples da area administrativa
function checkAdmin(req, res, next) {
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({
      ok: false,
      error: "Area administrativa indisponivel: defina a variavel ADMIN_PASSWORD no Railway.",
    });
  }
  const pass = req.get("x-admin-password") || req.query.pass || "";
  if (pass !== ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, error: "Senha incorreta." });
  }
  next();
}

// Lista de respostas (somente com senha)
app.get("/api/submissions", checkAdmin, async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ ok: true, submissions });
  } catch (e) {
    console.error("Erro ao listar submissoes:", e);
    res.status(500).json({ ok: false, error: "Erro ao carregar as respostas." });
  }
});

app.get("/admin", (req, res) => res.sendFile(path.join(__dirname, "public", "admin.html")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Briefing rodando na porta " + PORT));
