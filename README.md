# Território — Minha jornada (visualização mobile, protótipo)

Protótipo de apresentação: **visualização mobile do sistema Território** com o design system do mapa (top bar, sidebar e menu de perfil) e a página **"Minha jornada"** do perfil, onde ficam as missões da campanha Figital. **100% mockado (sem backend), em TypeScript.**

A ideia demonstrada: o participante aponta a **câmera do celular** para o QR de uma missão e o link abre a missão direto em Minha jornada.

Estado atual em [`docs/DOCUMENTACAO_ATUAL.md`](docs/DOCUMENTACAO_ATUAL.md).

## Rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5174` (vai para `/jornada`). Não precisa de servidor.

## Publicar no Vercel

Projeto Vite padrão (build `npm run build`, saída `dist`). O `vercel.json` já faz o rewrite de SPA, necessário para os links `/m/...` abertos pela câmera. Ex.: `npx vercel --prod` na raiz, ou importar o repositório no painel do Vercel.

## Roteiro da demo

1. No notebook/projetor, abra `https://<seu-domínio>/qrs` (ou menu de perfil → **QRs de demonstração**).
2. No celular, aponte a **câmera nativa** para o QR de uma missão → a **Tainá** (NPC) explica a missão em cartões (toque para avançar) → **Começar missão**.
3. Registre os itens de "o que coletar" (e, se quiser, **Adicionar memória** da missão) → **Enviar** → revela a **Insígnia** + XP → a missão vai para "Concluídas".
4. QR de **totem**: abre a curiosidade/NPC → **Deixar memória**.
5. Menu de perfil → **Reiniciar demo** volta ao estado inicial. Plano B sem câmera: **Simular leitura** em Minha jornada.

O estado fica em `localStorage` (por celular/navegador).

## Estrutura

```
src/
├── theme/tokens.css          # tokens do design system do mapa (cor por entidade)
├── types.ts                  # modelo (Missao, Totem, Memoria, Insignia, Perfil…)
├── data/                     # mocks: perfil (+ stats), acervo (seed), qrCodes
├── store/useAcervo.tsx       # estado + localStorage + ações
├── ui/                       # rota, aviso (toast), fluxo (sheets + deep link), shell/, Icone, Sheet
└── features/                 # jornada (a página), qrs, scan, missao, totem, memoria
docs/
├── DOCUMENTACAO_ATUAL.md     # estado atual (fonte de verdade)
├── CONTRATO_API_FIGITAL.md   # contrato da API (integração futura, suspensa)
└── referencia-mapa/          # regras de negócio e plano (espelho do mapa, só leitura)
```

Skills e regras vieram do repositório do mapa — ver [`CLAUDE.md`](CLAUDE.md).
