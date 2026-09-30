> ⚠️ **DESCONTINUADO (30/09/2026).** Por decisão do CEO, o produto **não terá figuras humanas**. A personagem Tainá foi **removida** do app (componente `Taina.tsx` excluído; a cena de fala ficou só com paisagem + diálogo). Este documento fica como **referência histórica** — não guia o estado atual. Ver `docs/MIGRACAO_MAPA.md` e `docs/DOCUMENTACAO_ATUAL.md`.

# Tainá, Guardiã do Território — ficha da personagem e prompt kit

NPC única do protótipo: explica cada missão e cada totem em uma **cena de diálogo por etapas** (roteiro fixo, RN-FIG-047; formato de falas do §14.2). Este documento descreve a personagem, a arte vetorial que está no app e como gerar uma versão ilustrada mais rica numa IA de imagem para substituir.

## 1. Conceito

| | |
|---|---|
| **Nome** | Tainá (origem tupi, "estrela") — "Tainá · Guardiã do Território" |
| **Quem é** | Jovem guardiã comunitária, ~20 anos, que conhece cada nascente, trilha e horta do território. Acolhedora, animada, fala como vizinha ("tá?", "viu?", "pra") |
| **Aparência** | Mulher negra, pele marrom (`#8d5524`), cabelo **black power** volumoso, **lenço de chita** amarrado com laço de lado, **argolas douradas**, camiseta creme, **colete de campo verde Território** com crachá "T", **bolsa de sementes** a tiracolo |
| **Referências culturais** | Chita (tecido florido do Nordeste e das festas juninas), black power, estética de bairro/periferia brasileira, mata atlântica, casinhas coloridas no morro |
| **Cuidados** | Sem símbolos religiosos (contas, guias, turbantes de culto), sem caricatura (traços exagerados de lábios/nariz), sem sexualização. Nada de "índia" genérica: o nome tupi é só o nome |

**Paleta** (casa com os tokens do mapa): pele `#8d5524` / sombra `#6f3f19` · cabelo `#2b1a12` · chita: vermelho `#e0452b`, amarelo `#f7c33b`, azul `#2f6fd6`, branco `#fff7e6`, folha `#2e9e5b` · colete `#1f7a4c` / `#19653e` · camiseta `#fbe8c8` · alça da bolsa `#c8372a` · ouro `#e8b53a`.

## 2. Expressões

A expressão sai do `id` da fala (sem mudar o contrato): `expressaoDaFala()` em `src/features/npc/Taina.tsx`.

| Expressão | Falas | Pose |
|---|---|---|
| `acenando` | `intro` | Sorriso fechado, mão direita erguida acenando |
| `explicando` | `missao`, `dica`, `historia`, `convite` (qualquer outra) | Indicador erguido na frente do peito, uma sobrancelha arqueada |
| `comemorando` | `ok` (dita na recompensa) | Olhos fechados de alegria, boca aberta, dois punhos para cima, brilhos e confete |

Animações (CSS, desligadas com "reduzir movimento"): respiração, piscada, aceno, indicador balançando, pulinho na comemoração, boca abrindo e fechando enquanto o texto é digitado.

## 3. Arte atual (SVG)

- `src/features/npc/Taina.tsx` — personagem vetorial (busto, `viewBox 0 0 320 420`; enquadramento `rosto` para avatares).
- `src/features/npc/Cenario.tsx` — paisagens `rio`, `serra`, `horta` (`viewBox 0 0 400 800`, recorte `slice`).
- Leve (sem imagens), nítida em qualquer tela, recolorível pelos tokens.

## 4. Prompt kit (versão ilustrada numa IA de imagem)

Gere com fundo **transparente** (ou fundo liso para remover depois), mesmo personagem nas três poses. Use a primeira imagem aprovada como referência de personagem nas seguintes (recurso "character reference"/"image prompt" da ferramenta).

**Prompt base (inglês costuma render melhor):**

```
Mobile game character art, half-body portrait of Tainá, a friendly young Black Brazilian woman
(about 20), warm deep brown skin, big voluminous afro hair, a red chita-print headscarf with
large yellow, blue and white flowers tied in a side bow, small gold hoop earrings, cream t-shirt
under a green field vest (#1f7a4c) with a round white "T" badge, a red strap (#c8372a) of a brown seed bag across
the chest. Big expressive eyes, soft blush, a few freckles. Clean flat-shaded 2D style with soft
cel shading, thick smooth outlines, vibrant but warm palette, like a cozy casual mobile game NPC.
Centered, facing viewer, cropped at the waist, transparent background, no text.
```

**Variações por expressão (acrescente ao base):**

- `acenando`: `smiling warmly with closed mouth, right hand raised waving hello`
- `explicando`: `mid-sentence, one eyebrow raised, right index finger raised in front of chest as if explaining a tip`
- `comemorando`: `eyes closed in joy, big open smile, both fists raised in celebration, small sparkles and confetti around`

**Negativos:** `no religious symbols, no beads, no caricature, no exaggerated lips, no sexualization, no realistic photo, no text, no watermark`.

**Cenários (1080×1920, retrato, sem personagem):**

- `rio`: `vertical mobile game background, a small spring and winding river in Atlantic Forest hills, riverside reeds, warm morning sun, flat 2D style, empty lower third`
- `serra`: `vertical mobile game background, a cone-shaped green hill with a zigzag dirt trail, Atlantic Forest trees, soft clouds, flat 2D style, empty lower third`
- `horta`: `vertical mobile game background, community vegetable garden with raised beds, colorful Brazilian hillside houses behind, sunny day, flat 2D style, empty lower third`

## 5. Especificação dos arquivos e troca

| Arquivo | Tamanho | Uso |
|---|---|---|
| `public/npc/taina-acenando.png` | 1024×1344 (proporção 320:420), transparente | Cena, falas `intro` |
| `public/npc/taina-explicando.png` | idem | Cena, demais falas; avatar "Ouvir de novo" |
| `public/npc/taina-comemorando.png` | idem | Recompensa |

Para trocar: coloque os PNGs em `public/npc/` e mude `ARTE` para `'png'` em `src/features/npc/Taina.tsx`. O enquadramento `rosto` (avatares) usa o mesmo PNG recortado pelo CSS; se ficar ruim, gere também um `taina-rosto.png` 512×512. Os cenários continuam em SVG (trocar por imagem é opcional: basta um `<img>` no lugar do `<Cenario>` em `CenaNpc.tsx`).
