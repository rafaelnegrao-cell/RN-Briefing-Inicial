# Briefing online — Consultório Dra. Francielle Delgado

App web do briefing de diagnóstico. A cliente responde por um link (ótimo no celular),
as respostas ficam salvas no banco e você lê tudo numa área protegida.

- **Formulário (link da cliente):** `/`
- **Painel de respostas (você):** `/admin`

Stack: Node.js + Express + Prisma + PostgreSQL (mesmo padrão do FV e do Empório).

---

## ANTES DE SUBIR — 2 ajustes rápidos

1. **Seu WhatsApp** — abra `public/app.js`, primeira linha de configuração:
   ```js
   const WHATSAPP_RAFAEL = "5543000000000";
   ```
   Troque pelos seus dígitos: DDI + DDD + número (só números).
   Ex.: `(43) 9 9999-9999` → `"5543999999999"`.

2. **(Opcional) Texto/perguntas** — tudo o que a cliente lê fica em `public/questions.js`.
   É a fonte única: editou ali, muda no formulário e no painel ao mesmo tempo.
   Para reaproveitar em outro nicho depois, basta trocar este arquivo.

> ⚠️ **Chrome traduzindo nomes de arquivo:** antes de subir no GitHub, desative a
> tradução automática em `github.com` (senão ele renomeia coisas tipo `package.json`).
> Não há `railway.json` aqui de propósito, justamente para evitar isso.

---

## SUBIR NO GITHUB (web)

1. Crie um repositório novo (ex.: `briefing-francielle`).
2. **Add file → Upload files** e arraste **todo o conteúdo desta pasta**, mantendo a estrutura:
   ```
   package.json
   server.js
   .gitignore
   prisma/schema.prisma
   public/  (index.html, admin.html, styles.css, questions.js, app.js, admin.js, assets/)
   ```
   Importante: a pasta `prisma` e a pasta `public` (com `assets` dentro) precisam ir juntas.
3. **Commit** na `main`.

---

## SUBIR NO RAILWAY

1. **New Project → Deploy from GitHub repo** → escolha o repositório.
2. Adicione o banco: **New → Database → PostgreSQL** (no mesmo projeto).
   O Railway cria a variável `DATABASE_URL` e a conecta automaticamente.
   - Se não conectar sozinho, no serviço do app vá em **Variables → New Variable** e use
     a referência do Postgres (`${{Postgres.DATABASE_URL}}`).
3. Ainda em **Variables**, crie:
   - `ADMIN_PASSWORD` = uma senha sua (é a senha do `/admin`).
4. Em **Settings → Networking → Generate Domain** para ter o link público.

O Railway roda sozinho:
- **build:** `prisma generate`
- **start:** `prisma db push --accept-data-loss && node server.js`

(O `prisma` já está em `dependencies`, como combinamos, para não dar conflito de versão.)

---

## TESTAR

1. Abra o domínio em uma **aba anônima** (celular de preferência) e responda o briefing.
2. Confirme que aparece a tela "Respostas enviadas!".
3. Abra `/admin`, entre com a `ADMIN_PASSWORD` e veja a resposta na lista.
   - Botão **Imprimir / Salvar PDF** gera uma cópia das respostas.

### Se algo falhar no envio
O formulário tem rede de segurança: se o banco estiver fora do ar na hora,
a cliente vê um botão para **enviar as respostas pelo WhatsApp** para você,
e os dados continuam salvos no aparelho dela (dá para tentar de novo).

---

## ENVIAR PARA A CLIENTE

Mande só o link raiz (o `/`). Sugestão de mensagem:

> Dra. Francielle, preparei um roteiro rápido para eu entender a rotina da sua clínica
> e montar um diagnóstico sob medida. Pode responder pelo celular, no seu tempo —
> fica tudo salvo automaticamente. Link: <SEU_LINK_AQUI>

O `/admin` é só seu — não precisa enviar.
