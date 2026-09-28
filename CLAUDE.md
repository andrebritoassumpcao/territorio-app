# CLAUDE.md

Guia para o Claude Code (claude.ai/code) neste repositório.

## O que é este repositório

`Territorio-app` é o **aplicativo do participante** da campanha Figital da plataforma Território. É um **projeto separado** do mapa (`Territorio-map`): "dois produtos, um contrato" (`docs/referencia-mapa/CAMPANHA_FIGITAL.md` §10).

**Estado atual: protótipo de apresentação** — não é mais um "app" (PWA): é uma **visualização mobile do sistema Território** (top bar, sidebar e menu de perfil do mapa) com a página **"Minha jornada"** do perfil, onde vivem as missões. **100% mockado (sem backend)**, em **TypeScript**, publicado no **Vercel**. O QR da missão, lido pela **câmera nativa do celular**, abre `/m/{mapa}/missao/{id}` e a página abre a missão (deep link). Ver `docs/DOCUMENTACAO_ATUAL.md`.

> A integração real com a API Figital (manifesto/offline, envio ao painel, assinatura — Fases 2–5 do plano) segue **suspensa**. O contrato fica preservado em `docs/CONTRATO_API_FIGITAL.md` e o plano em `docs/referencia-mapa/` para retomar depois. As URLs dos QRs já seguem o padrão do mapa (§14.1).

## Fonte de verdade

- **Estado atual do app:** `docs/DOCUMENTACAO_ATUAL.md` (autoritativo sobre o que está implementado hoje).
- **Contrato da API consumida:** `docs/CONTRATO_API_FIGITAL.md`.
- **Regras de negócio e plano (referência, não editar aqui):** `docs/referencia-mapa/` — cópia do `Territorio-map`. IDs `RN-FIG-XXX` são citados no código.

**Regra obrigatória de doc** (`.cursor/rules/atualizar-documentacao-atual.mdc`, `alwaysApply: true`): na mesma entrega que muda comportamento, atualize `docs/DOCUMENTACAO_ATUAL.md` e, se o contrato mudar, `docs/CONTRATO_API_FIGITAL.md`. Não trate as regras de negócio como estado atual; não edite `docs/referencia-mapa/` para consertar o produto (a fonte é o mapa).

## Stack e decisões

- **Protótipo mockado**, sem backend: todo o estado no navegador (`localStorage`). Nada de rede/login real.
- **Vite 6 + React 18 + TypeScript**. `npm run build` roda `tsc --noEmit` antes do `vite build`.
- **Sem PWA** (removido). Estado global via **React Context**; rotas via History API em `src/ui/rota.tsx` (sem react-router). `vercel.json` reescreve tudo para `/index.html`.
- **QR pela câmera nativa** → deep link `/m/{mapa}/missao/{id}` ou `/m/{mapa}/t/{id}`. Os QRs da demo saem da página `/qrs` (lib `qrcode`, apontando para o domínio atual) a partir de `src/data/qrCodes.ts`. "Simular leitura" (lista mock) é o plano B.
- Shell (top bar/sidebar/perfil) portado do `style.css` do mapa; só Minha jornada funciona, o resto é "Em breve".
- Design = **tokens do mapa** (`src/theme/tokens.css`), cor por entidade. Ícones SVG inline com `currentColor` (`src/ui/Icone.tsx`) — sem emoji como ícone.
- Comentários e docs em **português**, citando `RN-FIG-XXX` como no mapa.

## Comandos

```bash
npm install
npm run dev        # vite, porta 5174 — não precisa de backend
npm run build      # tsc --noEmit + vite build (dist/, publicado no Vercel)
npm run preview
```

Não há suíte de testes, linter nem CI — não assuma `npm test`/`npm run lint`.

## Arquitetura (onde mexer)

- `src/features/jornada/MinhaJornada.tsx` — a página Minha jornada. `PerfilHeader.tsx` — perfil/nível/XP. `rotulos.ts` — rótulos e ícones por categoria/papel.
- `src/ui/shell/` — `Shell.tsx` (top bar), `Sidebar.tsx` (drawer), `PerfilMenu.tsx` (menu de perfil do mapa). `src/features/qrs/QrsDemo.tsx` — página `/qrs`.
- `src/ui/rota.tsx` — roteador mínimo e parser do padrão de URL do mapa. `src/ui/aviso.tsx` — toast.
- `src/ui/fluxo.tsx` — orquestra cena do NPC e bottom-sheets (um de cada vez): scan → missão ⇄ memória → recompensa; totem → memória. Guarda os insumos registrados enquanto o fluxo está aberto e abre o deep link.
- `src/store/useAcervo.tsx` — estado + `localStorage` + ações (`concluirMissao`, `adicionarMemoria` — memória ligada a missão ou totem, `marcarNpcVisto`, `resetar`). É o coração do protótipo.
- `src/features/{scan,missao,totem,memoria}/*` — as telas dos fluxos. `src/ui/Sheet.tsx` — bottom-sheet acessível reutilizável.
- `src/features/npc/` — NPC Tainá: `Taina.tsx` (personagem SVG, expressão pelo `id` da fala), `Cenario.tsx` (paisagens), `CenaNpc.tsx` (diálogo por etapas), `OuvirNpc.tsx`. Ficha e prompt kit em `docs/NPC_TAINA.md`.
- `src/data/` — mocks (`perfil.ts`, `acervo.ts`, `qrCodes.ts`); `src/types.ts` — modelo.

## Integração futura (suspensa)

Retomar as Fases 2–5 (scan real, API Figital, jornada online/offline, volta ao painel) troca o store mockado por chamadas à API — contrato em `docs/CONTRATO_API_FIGITAL.md`, plano em `docs/referencia-mapa/fases de implementacao/`.
