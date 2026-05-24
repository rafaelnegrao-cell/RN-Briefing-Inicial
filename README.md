# Formulário Diagnóstico do Delivery — Empório dos Animais

Aplicação web que entrega o formulário de diagnóstico do delivery do Empório dos Animais, preparado pela Negrão Consultoria.

## Estrutura

```
.
├── public/
│   └── index.html        ← O formulário (1.1 MB, autocontido)
├── server.js             ← Servidor Express (serve o HTML estático)
├── package.json          ← Dependências (apenas Express)
├── railway.json          ← Configuração do Railway
├── .gitignore
└── README.md
```

## Como subir no Railway

### Opção 1 — Via GitHub (recomendado)

1. **Suba esta pasta para um repositório no GitHub** (público ou privado).
2. Entre em [railway.app](https://railway.app) e faça login.
3. Clique em **"New Project"** → **"Deploy from GitHub repo"**.
4. Autorize o Railway no GitHub (se for a primeira vez) e selecione o repositório.
5. O Railway detecta automaticamente que é Node.js, instala as dependências e roda `npm start`.
6. Em ~1-2 minutos a aplicação está no ar.
7. Para gerar o link público: vá em **Settings** → **Networking** → **Generate Domain**.

### Opção 2 — Via Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

## Como atualizar o formulário

1. Substitua o arquivo `public/index.html` pela nova versão.
2. Commit + push para o GitHub.
3. O Railway redeploya automaticamente em ~1 minuto.

## Rodar localmente (teste)

```bash
npm install
npm start
```

Acesse http://localhost:3000

## Notas técnicas

- O HTML é totalmente autocontido (bibliotecas Word/Excel embutidas via base64).
- Não há banco de dados — as respostas são salvas no navegador do usuário (localStorage).
- Ao finalizar, o usuário baixa Word + Excel e envia por e-mail manualmente.
- A porta é definida pela variável de ambiente `PORT` (Railway define automaticamente).
