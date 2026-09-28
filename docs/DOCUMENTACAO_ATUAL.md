# Documentação atual — Visualização mobile do Território ("Minha jornada")

**Plataforma:** Território (territorio.ai)
**Produto:** visualização mobile do sistema Território, com a página "Minha jornada" do perfil (participante da campanha Figital)
**Versão deste documento:** 0.5
**Data:** 28/09/2026
**Fonte de verdade do app como está hoje:** este arquivo

> Sempre que uma funcionalidade for adicionada, alterada ou removida, este documento deve ser atualizado na mesma entrega. Ver `.cursor/rules/atualizar-documentacao-atual.mdc`.

---

## 1. O que é hoje

**Protótipo de apresentação**: não é mais um "app" (PWA) — é uma **visualização mobile do sistema Território**, com o mesmo design system do mapa, a mesma **top bar**, a **sidebar** (em drawer) e o **menu de perfil**. Todo o conteúdo de missões vive na página **"Minha jornada"** do perfil. **100% mockado (sem backend)**, em **TypeScript**; estado no navegador (`localStorage`). Publicado no **Vercel** para a apresentação.

A ideia central da demo: o participante aponta a **câmera nativa do celular** para o QR de uma missão; o link abre esta página direto na missão (deep link).

> A integração real com a API Figital (manifesto/offline, envio ao painel, assinatura HMAC — Fases 2–5) segue **suspensa**. O contrato continua em `docs/CONTRATO_API_FIGITAL.md`.

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
    ├── npc/                  # Taina.tsx (personagem SVG), Cenario.tsx (paisagens), CenaNpc.tsx (diálogo), OuvirNpc.tsx
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
| `/m/{mapaId}/missao/{missaoId}` | **Cena da Tainá** e depois o sheet da missão, sobre Minha jornada |
| `/m/{mapaId}/t/{totemId}` | **Cena da Tainá** e depois o sheet do totem, sobre Minha jornada |
| `/qrs` | QRs de demonstração (rota "escondida") |

O padrão `/m/...` é o mesmo da URL profunda do mapa (§14.1, `gerarUrlQrMissao`/`gerarUrlQr` em `Territorio-map/poc/client/src/figital/model.js`). O `?s=` (assinatura, RN-FIG-016) é **ignorado** no protótipo. O `mapaId` também é ignorado: a busca é pelo id da missão/totem no store.

**Deep link:** ao abrir `/m/...`, a cena do NPC abre (vale como QR, ver §7) e a URL é trocada na hora por `/jornada` (`replaceState`), para que fechar ou recarregar não reabra o sheet. ID desconhecido → toast "Missão/Totem não encontrado neste protótipo" e Minha jornada. Missão já concluída → pula a cena e o sheet abre mostrando "Missão já concluída".

## 5. Shell do sistema (top bar, sidebar, perfil)

- **Top bar** (do mapa): botão da sidebar, busca (**Em breve**), notificações (**Em breve**), avatar que abre o menu de perfil.
- **Sidebar** (drawer): logo + Home, Mapa, Manual, Mutirões, Comunidades, Blog — todos mostram toast "Em breve" (só Minha jornada funciona nesta visualização).
- **Menu de perfil** (igual ao do mapa): identidade (Amanda Waller, nível, XP vivo), Minha rede (**Em breve**), Organizações (vazio, **Em breve**), bloco **Minha jornada** com os 4 stats + "Ver minha jornada", Sair (**Em breve**). Só no protótipo, um bloco **Demonstração**: "QRs de demonstração" (→ `/qrs`) e "Reiniciar demo".

## 6. A página Minha jornada

- Título "Minha jornada".
- **Perfil:** Amanda Waller, Bacia do Rio Sarapuí, **Nível 12**, barra de XP (2450/3000), contadores de missões e insígnias (vivos).
- **Stats** do mapa (Saberes 12, Certificados 3, Horas 48, Manuais 48) — **estáticos**, iguais ao mapa (`STATS_JORNADA` em `src/data/perfil.ts`).
- **Dica de scan:** rosto da Tainá + "Achou um QR de missão ou totem? Aponte a câmera do celular…" + link discreto **"Simular leitura"** (abre a lista de QRs mock — plano B se a câmera/rede falhar).
- **Seções:** Missões (por fazer), Totens do território, Insígnias, Memórias, Concluídas (aparece após concluir alguma). Cada memória mostra de onde veio num chip: **Missão · …** (verde) ou **Totem · …** (dourado).

## 7. NPC — Tainá e a cena de diálogo

Uma única personagem guia todos os pontos: **Tainá, Guardiã do Território** — jovem negra de black power, lenço de chita, argolas douradas, colete verde do Território e bolsa de sementes. Arte **vetorial (SVG) desenhada no código**, estilo flat de jogo mobile; ficha, paleta e **prompt kit** para gerar uma versão ilustrada em IA de imagem em `docs/NPC_TAINA.md` (troca por PNG mudando `ARTE` em `Taina.tsx`).

**Roteiro:** cada missão e totem tem um NPC com falas `{ id, texto }` (formato do §14.2; roteiro fixo, RN-FIG-047). Missões: `intro` → `missao` → `dica`, e `ok` (dita na recompensa). Totens: `intro` → `historia` → `convite`. A **expressão** sai do `id`: `intro` = acenando, `ok` = comemorando, demais = explicando — sem mudar o contrato.

**Cena (tela cheia):** paisagem ilustrada do lugar (`cenario` do ponto: `rio`, `serra` ou `horta`), Tainá grande ao centro, caixa de diálogo com etiqueta de nome (verde na missão, dourada no totem). O texto aparece letra a letra; **toque** em qualquer lugar completa o texto e, no toque seguinte, avança um cartão. Bolinhas de progresso, "Toque para continuar", botão **Pular** no topo e, na última fala, o CTA (**Começar missão** / **Explorar o ponto**). Teclado: Enter/Espaço/→ avançam, Esc pula. Vibração curta a cada avanço (Android). Tainá respira, pisca, acena, mexe a boca enquanto "fala"; tudo desligado com *reduzir movimento*. Sem som.

**Quando a cena toca:** QR (câmera ou "Simular leitura") **sempre**; toque no card **só na primeira vez** daquele ponto (`npcVistos` no store, zerado por "Reiniciar demo"); missão concluída **não** toca. Nos sheets, o botão **"Tainá · Ouvir de novo"** reabre a cena. Na **recompensa**, a Tainá comemorando diz a fala `ok`.

## 8. Fluxo de missão (cada missão tem seu QR)

Câmera do celular lê o QR (ou "Simular leitura", ou toque no card) → **cena da Tainá** (§7) → **executar**: registrar cada insumo pedido ("o que coletar", mock) → **enviar** (habilita só com os obrigatórios registrados, RN-FIG-020) → **recompensa**: revela a Insígnia + XP. A Tainá comemora com a fala `ok`, e um botão secundário **"Deixar uma memória deste momento"** abre o formulário já ligado à missão. Ao fechar: a missão vai para **Concluídas**, a Insígnia entra na coleção e a barra de XP sobe (com rollover de nível).

**Memórias da missão (RN-MEM-004):** o sheet da missão tem a seção **"Memórias desta missão"** (lista das memórias ligadas a ela) e o botão **"Adicionar memória"**, disponível a qualquer momento (aberta ou concluída), quantas vezes quiser. É livre: **não conta** para "O que coletar" nem para liberar o envio. O formulário mostra o vínculo travado ("Na missão …"), como no mapa, e a data é a do dia. Ao salvar — ou cancelar — volta para a mesma missão com os itens já registrados intactos (os registros vivem no `fluxo.tsx` enquanto o fluxo está aberto) e o aviso "Memória guardada na missão.". A semente já traz uma memória na **Horta Comunitária** para a lista não nascer vazia.

## 9. Fluxo de totem (informacional)

QR do totem (câmera, simulação ou card) → **cena da Tainá** (§7) → **totem**: curiosidade do ponto + "Ouvir de novo" + memórias já deixadas ali → **deixar memória**: foto opcional + comentário, vínculo "No ponto …" → salva na jornada (aparece no topo de Memórias) e fecha, com o aviso "Memória guardada no ponto.".

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
