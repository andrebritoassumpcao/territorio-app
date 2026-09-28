# Contrato da API Figital (integração futura)

> ⚠️ **Não consumido pelo protótipo atual.** O app hoje é 100% mockado, sem backend (ver `docs/DOCUMENTACAO_ATUAL.md`). Este documento fica preservado como o contrato para **retomar a integração** (Fases 2–5) depois da apresentação. Os códigos de QR mockados (`src/data/qrCodes.ts`) já seguem o padrão de URL abaixo, para a virada ser suave.

**Fonte da API:** `Territorio-map/poc/server/figital.js` (Fase 1.7 — persistência mínima, em memória).
**Montada em:** `/api` (ver `Territorio-map/poc/server/index.js`).
**Regras de referência:** `docs/referencia-mapa/CAMPANHA_FIGITAL.md` §13.1.

> A Fase 1.7 é deliberadamente pequena: sem autenticação, papéis ou banco geoespacial. O **contrato** importa mais que a implementação; `jornadas`/`insumos`/`export` são stubs até as Fases 3–5. Quando a API virar produção, RN-FIG-016 (HMAC real) substitui a assinatura mock (ver `src/features/scan/assinatura.js`).

## Endpoints que o app usa hoje (Fase 2)

| Método | Rota | Uso no app |
|--------|------|------------|
| GET | `/api/mapas/:mapaId/totens/:totemId` | Resolver o totem escaneado (deep link) |
| GET | `/api/mapas/:mapaId/totens?percursoId=` | Listar totens (vizinhos do percurso) |
| GET | `/api/mapas/:mapaId/percursos` | Listar percursos de um mapa |
| GET | `/api/mapas/:mapaId/percursos/:percursoId/manifest` | **Manifesto do percurso** — pacote cacheável offline (§13.1, §14.3) |

## Endpoints previstos para as próximas fases

| Método | Rota | Fase | Situação na API |
|--------|------|------|-----------------|
| GET/POST | `/api/mapas/:mapaId/percursos` (POST) | autoria (mapa) | real |
| GET/PATCH | `/api/mapas/:mapaId/percursos/:id` | autoria (mapa) | real |
| POST/PATCH/DELETE | `/api/mapas/:mapaId/totens` | autoria (mapa) | real |
| POST | `/api/jornadas` | 3 | stub |
| GET | `/api/jornadas/:id` | 3 | stub |
| POST | `/api/jornadas/:id/checkins` | 3 | stub |
| POST | `/api/jornadas/:id/insumos` | 3 | stub |
| POST | `/api/jornadas/:id/missoes/:missaoId/concluir` | 3 | stub |
| GET | `/api/mapas/:mapaId/insumos` | 5 | stub (vazio) |
| GET | `/api/mapas/:mapaId/export?formato=geojson\|csv` | 5 | stub (vazio) |

## Forma do manifesto do percurso

```jsonc
{
  "mapaId": "…",
  "percursoId": "…",
  "titulo": "…",
  "modo": "sequencial | livre",
  "recompensaFinal": "…",
  "textoConsentimento": "…",
  "ativo": true,
  "permiteReplay": false,
  "prontoParaJornada": true,          // RN-FIG-009/010
  "avisos": ["…"],
  "geradoEm": "ISO-8601",
  "totens": [
    {
      "totemId": "…",
      "nome": "…",
      "papel": "inicio | intermediario | fim",
      "lat": -22.78, "lng": -43.34,
      "npc": { "nome": "…", "falas": [] },   // roteiro fixo (RN-FIG-047)
      "missao": null                          // catálogo de insumos entra na Fase 3
    }
  ]
}
```

## Formato da URL do QR (§14.1)

```
https://{dominio}/m/{mapaId}/t/{totemId}?s={assinatura}
https://{dominio}/m/{mapaId}/missao/{missaoId}?s={assinatura}
```

`{dominio}` padrão na Fase 1 é `app.territorio.ai`. `s` é a assinatura — hoje um hash mock determinístico (`gerarAssinaturaMock`), **não HMAC de produção**. Validação (RN-FIG-016): online contra o servidor; offline, aceitar se o totem consta do manifesto em cache e a assinatura confere.
