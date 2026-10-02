# Documentação atual — Visualização mobile do Território ("Minha jornada")

**Plataforma:** Território (territorio.ai)
**Produto:** visualização mobile do sistema Território, com a página "Minha jornada" do perfil (participante da campanha Figital)
**Versão deste documento:** 0.6
**Data:** 30/09/2026
**Fonte de verdade do app como está hoje:** este arquivo

> Sempre que uma funcionalidade for adicionada, alterada ou removida, este documento deve ser atualizado na mesma entrega. Ver `.cursor/rules/atualizar-documentacao-atual.mdc`.

---

## 1. O que é hoje

**Protótipo de apresentação**, agora um **site único "Território"** com **duas páginas** no mesmo build/domínio (Vite multi-page):

- **`index.html`** — a **visualização mobile do participante** (SPA React/TS): top bar, sidebar (drawer), menu de perfil e a página **"Minha jornada"**, onde vivem as missões. Estado no navegador (`localStorage`).
- **`mapa.html`** — o **mapa colaborativo** do `Territorio-map` embutido como está (**JS vanilla + Leaflet**, desktop), para **autorar missões e gerar QR**. Ver `docs/MIGRACAO_MAPA.md`.

A ideia central da demo (handoff por QR, **só missões**): no mapa, o autor cria uma missão e gera o QR; um **segundo aparelho** lê o QR, abre o site e o app **recebe a missão e roda o fluxo** (cena de fala → executar → enviar → recompensa). A missão trafega por uma tabela **`missoes` no Supabase** (o QR carrega só o ID). Deixou de ser "100% mockado": **missões persistem no Supabase** (projeto leve, reutilizado do mapa); o resto do acervo do participante segue em `localStorage`.

> As demais Fases da API Figital (manifesto/offline, painel, assinatura HMAC) seguem **suspensas**; o contrato continua em `docs/CONTRATO_API_FIGITAL.md`. Sem figuras humanas (decisão do CEO): a personagem Tainá foi removida; a cena de fala mostra só a paisagem e o diálogo.

## 2. Como executar e publicar

```bash
npm install
npm run dev        # vite, porta 5174
npm run build      # tsc --noEmit + vite build (saída em dist/)
```

Não precisa de servidor. Abre em `http://localhost:5174` (redireciona para `/jornada`).

**Vercel:** projeto Vite padrão (build `npm run build`, saída `dist`). O `vercel.json` reescreve qualquer caminho para `/index.html` (SPA), para que as URLs profundas `/m/...` funcionem ao serem abertas direto pela câmera. O deploy é feito pelo usuário (Vercel CLI ou import do GitHub).

## 3. Arquitetura

| Parte | Tecnologia | Papel |
|-------|------------|-------|
| App | Vite 6 + React 18 + **TypeScript** | Visualização mobile (SPA) |
| Rotas | History API, sem dependência (`src/ui/rota.tsx`) | `/jornada`, `/qrs`, deep links `/m/...` |
| Estado | React Context + `localStorage` | Jornada do participante (`src/store/useAcervo.tsx`) |
| Dados | Mocks em `src/data/` | Perfil + stats, trilhas, missões, totens, memórias, insígnias, QRs |
| QR | `qrcode` (mesma lib do mapa) | Gera os QRs da página `/qrs` no cliente |
| Design | Tokens do mapa (`src/theme/tokens.css`) + shell portado do `style.css` do mapa | Mesmas cores, top bar, sidebar e perfil do Território |

Sem PWA: `vite-plugin-pwa` foi removido. `main.tsx` desregistra service workers antigos que tenham ficado no navegador.

Estrutura:

```
src/
├── theme/tokens.css          # tokens copiados do mapa (cor por entidade)
├── types.ts                  # Missao, Totem, Memoria, Insignia, Perfil, QrMock…
├── data/                     # perfil.ts (+ STATS_JORNADA), acervo.ts (seed), qrCodes.ts (QRs mock)
├── store/useAcervo.tsx       # estado + localStorage (chave v3) + ações (concluir missão, add memória, cena vista, reset)
├── ui/
│   ├── rota.tsx              # roteador mínimo + parser do padrão de URL do mapa
│   ├── aviso.tsx             # toast ("Em breve", avisos do deep link)
│   ├── fluxo.tsx             # orquestra cena do NPC + sheets; abre o deep link
│   ├── shell/                # Shell.tsx (top bar), Sidebar.tsx (drawer), PerfilMenu.tsx
│   └── Icone.tsx, Sheet.tsx
└── features/
    ├── jornada/              # MinhaJornada.tsx (a página), PerfilHeader.tsx, rotulos.ts
    ├── npc/                  # Cenario.tsx (paisagens), CenaNpc.tsx (cena de fala, sem figura), OuvirNpc.tsx
    ├── qrs/QrsDemo.tsx        # página /qrs (QRs de demonstração)
    ├── scan/ScanSheet.tsx     # scan simulado (plano B da demo)
    ├── missao/               # MissaoSheet.tsx (executar/enviar), RecompensaSheet.tsx
    ├── totem/TotemSheet.tsx    # info do ponto + "Ouvir de novo"
    └── memoria/MemoriaForm.tsx # deixar memória (foto + comentário) ligada a missão ou totem
```

## 4. Rotas

| Caminho | O que mostra |
|---------|--------------|
| `/` ou qualquer caminho desconhecido | Redireciona para `/jornada` |
| `/jornada` | Página Minha jornada dentro do shell |
| `/m/{mapaId}/missao/{missaoId}` | **Cena de fala** e depois o sheet da missão, sobre Minha jornada. Com Supabase ligado, a missão é **sempre rebuscada** por ID e injetada/atualizada no acervo (traz edições feitas no mapa, preservando o progresso local); missão-semente sem linha no Supabase abre a versão local |
| `/m/{mapaId}/t/{totemId}` | **Cena de fala** e depois o sheet do totem, sobre Minha jornada |
| `/qrs` | QRs de demonstração (rota "escondida") |
| `/mapa` (`/mapa.html`) | **Mapa colaborativo** (autoria de missão + geração de QR); página vanilla + Leaflet, fora do SPA |

O padrão `/m/...` é o mesmo da URL profunda do mapa (§14.1, `gerarUrlQrMissao`/`gerarUrlQr` em `Territorio-map/poc/client/src/figital/model.js`). O `?s=` (assinatura, RN-FIG-016) é **ignorado** no protótipo. O `mapaId` também é ignorado: a busca é pelo id da missão/totem no store.

**Deep link:** ao abrir `/m/...`, a cena do NPC abre (vale como QR, ver §7) e a URL é trocada na hora por `/jornada` (`replaceState`), para que fechar ou recarregar não reabra o sheet. ID desconhecido → toast "Missão/Totem não encontrado neste protótipo" e Minha jornada. Missão já concluída → pula a cena e o sheet abre mostrando "Missão já concluída".

## 5. Shell do sistema (top bar, sidebar, perfil)

- **Top bar** (do mapa): botão da sidebar, busca (**Em breve**), notificações (**Em breve**), avatar que abre o menu de perfil.
- **Sidebar** (drawer): logo + Home, Mapa, Manual, Mutirões, Comunidades, Blog. **Mapa** navega para `/mapa.html` (autoria + QR); os demais mostram toast "Em breve".
- **Menu de perfil** (igual ao do mapa): identidade (Amanda Waller, nível, XP vivo), Minha rede (**Em breve**), Organizações (vazio, **Em breve**), bloco **Minha jornada** só com "Ver minha jornada", Sair (**Em breve**). Os 4 stats estáticos (Saberes/Certificados/Horas/Manuais) foram **removidos** daqui e da página — não faziam sentido para o participante. Só no protótipo, um bloco **Demonstração**: "QRs de demonstração" (→ `/qrs`) e "Reiniciar demo".

## 5.1 Tutorial de onboarding (tour guiado com spotlight)

No **primeiro acesso**, roda **uma vez** um **tour guiado** (biblioteca **driver.js**): a tela escurece e um recorte iluminado destaca cada passo, com balão que avança no **"Próximo"** (o alvo fica **não clicável** — `disableActiveInteraction` — para não disparar ações por acidente). Sequência (6 passos): **dica de scan** → **missões** → **memórias** → **abre a 1ª missão** (o próprio tour abre o sheet, sem a cena) → **Registrar** (auto-registra os obrigatórios para habilitar) → **Enviar** (destacado). Ao concluir, **fecha o sheet sem enviar** — não conclui a missão nem mexe no XP.

Se o participante entra por **deep link de missão**, a **cena do NPC é adiada**: o tour roda primeiro e, ao terminar, a cena da missão real abre. Flag `tutorialVisto` no store (**"Reiniciar demo" reexibe**). Peças: `src/features/tutorial/tour.ts` (`iniciarTourGuiado`) + `src/features/tutorial/TutorialTour.tsx` (disparo, dentro do `FluxoProvider`); o `fluxo.tsx` expõe o controlador (abrir sheet direto, registrar, fim) e faz o adiamento; âncoras `data-tour="…"` em `MinhaJornada.tsx` e `MissaoSheet.tsx`.

## 6. A página Minha jornada

- Título "Minha jornada".
- **Perfil:** Amanda Waller, Bacia do Rio Sarapuí, **Nível 12**, barra de XP (2450/3000), contadores de missões e insígnias (vivos).
- **Dica de scan:** ícone de QR + "Achou um QR de missão ou totem? Aponte a câmera do celular…" + link discreto **"Simular leitura"** (abre a lista de QRs mock — plano B se a câmera/rede falhar).
- **Seções:** Missões (por fazer), Totens do território, Insígnias, Memórias, Concluídas (aparece após concluir alguma). Cada memória mostra de onde veio num chip: **Missão · …** (verde) ou **Totem · …** (dourado).

## 7. NPC — a cena de fala (sem figura humana)

**Sem figuras humanas (decisão do CEO):** a personagem Tainá foi **removida** (arquivo `Taina.tsx` excluído; `docs/NPC_TAINA.md` descontinuado). A "voz" que narra é só um **rótulo de roteiro** (`Guia do Território` na semente, ou o nome que o autor digitar no mapa), sem personagem ilustrada. Os avatares de perfil (foto e mini-avatares) foram mantidos.

**Roteiro:** cada missão e totem tem um NPC com falas `{ id, texto }` (formato do §14.2; roteiro fixo, RN-FIG-047). Missões: `intro` → `missao` → `dica`, e `ok` (dita na recompensa). Totens: `intro` → `historia` → `convite`. Como não há figura, o `id` **não** escolhe mais expressão — é só a ordem das falas.

**Cena (tela cheia):** paisagem ilustrada do lugar (`cenario` do ponto: `rio`, `serra` ou `horta`) e a caixa de diálogo (empurrada para a base, `margin-top: auto`) com etiqueta de nome (verde na missão, dourada no totem) — **sem figura**. O texto aparece letra a letra; **toque** em qualquer lugar completa o texto e, no toque seguinte, avança um cartão. Bolinhas de progresso, "Toque para continuar", botão **Pular** no topo e, na última fala, o CTA (**Começar missão** / **Explorar o ponto**). Teclado: Enter/Espaço/→ avançam, Esc pula. Vibração curta a cada avanço (Android). Cursor piscando enquanto "digita"; desligado com *reduzir movimento*. Sem som.

**Quando a cena toca:** QR (câmera ou "Simular leitura") **sempre**; toque no card **só na primeira vez** daquele ponto (`npcVistos` no store, zerado por "Reiniciar demo"); missão concluída **não** toca. Nos sheets, o botão **"Ouvir de novo"** reabre a cena. Na **recompensa**, a fala `ok` é exibida como texto.

## 8. Fluxo de missão (cada missão tem seu QR)

Câmera do celular lê o QR (ou "Simular leitura", ou toque no card) → **cena de fala** (§7) → **executar**: registrar cada insumo pedido ("o que coletar", mock) → **enviar** (habilita só com os obrigatórios registrados, RN-FIG-020) → **recompensa**: revela a Insígnia + XP. A fala `ok` aparece como texto, e um botão secundário **"Deixar uma memória deste momento"** abre o formulário já ligado à missão. Ao fechar: a missão vai para **Concluídas**, a Insígnia entra na coleção e a barra de XP sobe (com rollover de nível).

**Memórias da missão (RN-MEM-004):** o sheet da missão tem a seção **"Memórias desta missão"** (lista das memórias ligadas a ela) e o botão **"Adicionar memória"**, disponível a qualquer momento (aberta ou concluída), quantas vezes quiser. É livre: **não conta** para "O que coletar" nem para liberar o envio. O formulário mostra o vínculo travado ("Na missão …"), como no mapa, e a data é a do dia. Ao salvar — ou cancelar — volta para a mesma missão com os itens já registrados intactos (os registros vivem no `fluxo.tsx` enquanto o fluxo está aberto) e o aviso "Memória guardada na missão.". A semente já traz uma memória na **Horta Comunitária** para a lista não nascer vazia.

## 8.1 Formulário (um insumo da missão)

"Responder formulário" é **um insumo** (`tipo: 'formulario'`) na lista "O que coletar", ao lado de "Tirar foto…". O admin monta as perguntas no mapa (editor dentro do insumo): cada pergunta é **múltipla escolha (a/b/c/d)** ou **resposta escrita**, com toggle **obrigatória/opcional**. Se não quiser formulário, não adiciona o insumo. O flag **obrigatório** do insumo decide se concluir o formulário é necessário para liberar "Enviar".

No app, o insumo mostra o botão **"Responder"**, que abre o formulário em **steps** (`src/features/formulario/FormularioSheet.tsx`): uma pergunta por tela, barra "Pergunta X de N", **Voltar/Próximo**; obrigatória trava o Próximo, opcional vira **"Pular"**; a última é **"Concluir"**. Ao concluir, marca a tarefa como feita (como registrar um insumo) e **grava as respostas no Supabase** (`src/data/respostas.ts`, tabela `respostas`) — participante **anônimo grava**; **só o admin logado lê** (RLS). É enquete (sem resposta certa); respostas gravam texto legível (`"b) alternativa"` / o texto aberto) + autor + data.

No mapa, o popup da missão ganha a aba **"Respostas (N)"** — visível **só logado** — que busca e lista cada envio (`src/mapa/app.js`: `buildParentCardHtml`/`switchCardTab`/`carregarRespostas`). Sem Supabase/sem login, a aba não traz dados.

## 9. Fluxo de totem (informacional)

QR do totem (câmera, simulação ou card) → **cena de fala** (§7) → **totem**: curiosidade do ponto + "Ouvir de novo" + memórias já deixadas ali → **deixar memória**: foto opcional + comentário, vínculo "No ponto …" → salva na jornada (aparece no topo de Memórias) e fecha, com o aviso "Memória guardada no ponto.".

## 10. QRs de demonstração (`/qrs`)

Página pensada para notebook/projetor: um cartão por item de `QRS_MOCK` (3 missões, 2 totens), com o QR gerado no cliente para `{origem atual}/{codigo}` — ou seja, no Vercel o QR aponta para o próprio domínio publicado. Em `localhost` mostra um alerta (o celular não alcança esse endereço). Os QRs reais gerados pelo mapa usam o domínio `app.territorio.ai` e IDs próprios, que não batem com os mocks — por isso a demo usa estes.

## 11. Design system

Tokens copiados 1:1 do mapa (`Territorio-map/poc/client/src/style.css`): fundo `#f7f8f6`, Inter, e **cor por entidade** — missão verde `#1f7a4c`, memória roxo `#7c4dff`, totem dourado `#b8860b`, XP/gamificação laranja `#d4832a`. Top bar, sidebar e menu de perfil portados do mesmo CSS (classes `.top-bar`, `.sidebar`, `.profile-menu`…). Ícones de navegação são SVG inline com `currentColor` (Lucide, como no mapa); os ícones dos stats e do perfil (`public/icons/profile/*.svg`) são os mesmos arquivos do mapa. Sem emoji como ícone. No desktop, a visualização fica numa coluna de até 440px.

## 12. Limitações conscientes (protótipo)

- Sem backend, sem rede, sem login real; estado só em `localStorage` (por dispositivo/navegador).
- Captura de insumo é simulada (botão "Registrar"), sem câmera/áudio/GPS reais.
- A leitura do QR é da câmera nativa do celular (fora do app); não há leitor de QR dentro da página.
- Assinatura `?s=` e `mapaId` do deep link não são validados.
- NPC com roteiro fixo, sem áudio nem IA; uma única personagem para todos os pontos.
- Só Minha jornada funciona; os demais itens do shell são "Em breve".
- Sem sincronização, sem envio ao painel do mapa, sem múltiplos usuários.
- Sem testes automatizados, linter ou CI.

---

*Documento atualizado em 27/09/2026 — descreve o protótipo neste repositório, não o produto final.*
