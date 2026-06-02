# Diagnóstico — Favoretto Vidigal Advogados Associados

Formulário web de **Diagnóstico de Gestão e Tecnologia Jurídica**, preparado pela
**Negrão · Diagnóstico & Soluções Empresariais** para o escritório Favoretto Vidigal.

O formulário é um único HTML estático (em `public/index.html`). Este projeto sobe um
servidor Node.js mínimo (Express) para o Railway servir essa página.

---

## Como publicar (GitHub + Railway)

1. **Crie um repositório no GitHub** (ex.: `diagnostico-favoretto-vidigal`).
2. Suba **todos os arquivos desta pasta** mantendo a estrutura:
   ```
   ├── public/
   │   └── index.html
   ├── server.js
   ├── package.json
   ├── railway.json
   └── .gitignore
   ```
3. No **Railway** → *New Project* → *Deploy from GitHub repo* → selecione o repositório.
4. O Railway detecta o Node.js automaticamente e roda `npm start`.
5. Em *Settings → Networking → Generate Domain*, gere a URL pública.
6. Pronto — envie o link ao cliente por e-mail ou WhatsApp.

> Para atualizar o formulário depois, basta dar `git push` — o Railway redeploia sozinho.

---

## Testar localmente (opcional)

```bash
npm install
npm start
# abra http://localhost:3000
```

Ou simplesmente abra `public/index.html` direto no navegador (duplo clique) — funciona
sem servidor, só não terá URL pública.

---

## O que o formulário faz

- 11 etapas de diagnóstico cobrindo carteira de clientes, processos, ferramentas,
  fluxos, indicadores, captação, financeiro, equipe, dores/objetivos e expectativas.
- **Salva automaticamente** as respostas no dispositivo (localStorage) — o cliente pode
  parar e retomar.
- Ao concluir, o cliente pode **baixar uma planilha (Excel)**, um **resumo (Word)** ou
  **enviar por e-mail** para `rafaelmnegrao@gmail.com`.
- Identidade visual Negrão (verde-escuro, dourado, Playfair Display + Inter) com a marca
  do Favoretto Vidigal aplicada no topo, na abertura e no rodapé.
