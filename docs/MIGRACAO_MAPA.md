# Migração do Mapa para o site único (controle)

Este documento registra **o que foi trazido do `Territorio-map` para dentro do `Territorio-app`** na unificação em um site só ("Território"), e o que **não** foi integrado — para controle e para retomar no futuro.

> Contexto: protótipo para o cliente apresentar como o projeto vai funcionar. O produto real será reescrito do zero (AWS etc.) em 2027. Ver também `docs/DOCUMENTACAO_ATUAL.md`.

## Arquitetura da junção

- **Repo único, o app React/TS é o host.** O mapa entra como **segunda página** do mesmo build/domínio (Vite multi-page): `index.html` (SPA do participante) e `mapa.html` (mapa vanilla + Leaflet).
- **Mapa embutido como está** (JS vanilla ~4.000 linhas), **sem reescrever**. Código em `src/mapa/`, assets em `public/mapa/`.
- Navegação: sidebar do app → **"Mapa"** abre `/mapa.html`; no mapa, **"Home"** volta para `/jornada`.

## Fluxo integrado (handoff por QR) — missões

1. No mapa, o autor (logado) cria/edita uma **missão** e escolhe o **cenário** (rio/serra/horta).
2. Ao **salvar** (criar ou editar) — e também ao **"Gerar QR"** — o mapa converte a missão para o formato `Missao` do app e faz **upsert** na tabela **`missoes`** do Supabase (`src/mapa/handoff.js`). Assim a **edição também propaga**, sem depender de regenerar o QR. O QR aponta para o **domínio atual** (`window.location.origin`) em `/m/{mapa}/missao/{id}`.
3. Um **segundo aparelho** lê o QR, abre o site; o app **sempre rebusca** a missão por ID no Supabase (`src/data/missoesRemotas.ts`) — trazendo edições — e faz **update-or-insert** no acervo (`useAcervo.adicionarMissao`, preservando `status`/conclusão locais), então **roda o fluxo** (cena de fala → executar → enviar → recompensa/insígnia/XP). Escrita exige login (RLS: insert/update só autenticado); leitura é pública.

## Migrado e garantido (foco: missões)

- Criação de missão no mapa (modal) + **novo seletor de cenário**.
- Geração de QR apontando para o domínio atual.
- Gravação da missão no Supabase (tabela `missoes`, formato `Missao`).
- Leitura por ID no app e execução completa do fluxo de missão.
- No card de missão do mapa, **"Ver missão"** faz upsert e abre a **tela de missão do app** (deep link `/m/{mapa}/missao/{id}`).
- **Formulário como insumo** (`tipo: 'formulario'`): editor de perguntas no mapa (múltipla a/b/c/d ou escrita, obrigatória/opcional); viaja no handoff (`perguntas`); no app, responder em **steps** marca a tarefa feita e **grava em `respostas`** (anônimo grava, só admin lê); o popup da missão no mapa mostra a aba **"Respostas (N)"** (só logado). Tabela `respostas` + RLS aplicadas no Supabase.

## Veio na tela (mapa inteiro) mas NÃO integra com o app

Todos os botões do mapa continuam visíveis e funcionando como no mapa original, mas **não** geram handoff para o app nesta entrega:

- Desenho de áreas e trilhas; **mutirões**; **memórias** do mapa.
- **Totens** e **percursos** (Figital); filtros e camadas; **Painel Figital** e indicadores.
- Export GeoJSON/CSV; persistência do snapshot do mapa (tabela `map_state`).
- **Login/gate de edição** (Supabase Auth) — usado só para **autorar** no mapa.

## Removido

- Personagem **Tainá** e qualquer **ilustração de pessoa** (pedido do CEO — sem figuras humanas). A cena de fala continua em tela cheia (paisagem + diálogo), **sem** figura. Os **avatares de perfil** (foto Amanda Waller, mini-avatares) foram **mantidos** (escopo confirmado: só o personagem/NPC). `docs/NPC_TAINA.md` fica **descontinuado**.

## Adiado (mesmo mecanismo, no futuro)

- Handoff de **totens/percursos** por QR (mesmo caminho das missões).
- Generalizar o fluxo do app para missões arbitrárias (hoje há defaults: `xp`, cenário e falas por ordem).
- Backend real (AWS) em 2027.

## Requisitos de ambiente

- `.env.local` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (o **mesmo** projeto Supabase que o mapa já usa). Ver `.env.example`.
- Tabela `missoes` no Supabase (SQL abaixo). Sem isso, o mapa roda em memória e o app não encontra a missão pelo QR.

```sql
create table if not exists public.missoes (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.missoes enable row level security;
create policy "leitura publica" on public.missoes for select using (true);
create policy "escrita autenticada" on public.missoes for insert to authenticated with check (true);
create policy "update autenticado" on public.missoes for update to authenticated using (true);
```
