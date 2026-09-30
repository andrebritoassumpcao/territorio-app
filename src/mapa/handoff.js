/* ==========================================================================
   HANDOFF MAPA → APP (missões)
   Converte a missão autorada no mapa para o formato `Missao` do app e grava
   na tabela `missoes` do Supabase, para o app buscar por ID ao ler o QR.
   Ver docs/MIGRACAO_MAPA.md e src/data/missoesRemotas.ts (lado do app).
   ========================================================================== */

import { supabase } from './db.js';

// Tipos de insumo que o fluxo do app entende (types.ts → TipoInsumo).
const TIPOS_APP = new Set(['foto', 'video', 'audio', 'texto', 'gps', 'formulario']);

// Cenários (paisagens) que o app sabe desenhar (types.ts → Cenario).
const CENARIOS_APP = new Set(['rio', 'serra', 'horta']);

// De-para de categoria: o mapa usa categoriaKey() ('meio-ambiente' |
// 'recursos-hidricos' | 'riscos'); o app usa o enum CategoriaMissao.
function categoriaParaApp(cat) {
  if (cat === 'riscos') return 'prevencao-riscos';
  if (cat === 'recursos-hidricos' || cat === 'meio-ambiente') return cat;
  return 'meio-ambiente';
}

function insumosParaApp(insumos) {
  return (insumos || [])
    .map((it, i) => {
      const tipo = TIPOS_APP.has(it.tipo) ? it.tipo : it.tipo === 'memoria' ? 'foto' : 'foto';
      return {
        id: it.id || `insumo-${i + 1}`,
        tipo,
        rotulo: it.rotulo || tipo,
        obrigatorio: it.obrigatorio ?? true
      };
    });
}

// Falas do mapa (livres) → falas do app com ids por ordem (intro/missao/dica…),
// mais uma `ok` sintetizada, dita na recompensa (a `ok` não entra na cena).
function npcParaApp(npc, titulo) {
  if (!npc) return null;
  const textos = (npc.falas || []).map((f) => (typeof f === 'string' ? f : f?.texto)).filter(Boolean);
  if (textos.length === 0) return null;
  const idsBase = ['intro', 'missao', 'dica'];
  const falas = textos.map((texto, i) => ({ id: idsBase[i] || `fala-${i + 1}`, texto }));
  falas.push({ id: 'ok', texto: `Muito bem! Você concluiu: ${titulo}.` });
  return { nome: npc.nome || 'Guia do Território', falas };
}

/** Converte a missão do mapa (entry.data) para o formato `Missao` do app. */
export function construirMissaoApp(m, cenario) {
  const cen = CENARIOS_APP.has(cenario) ? cenario : 'horta';
  return {
    id: m.id,
    titulo: m.titulo || 'Missão do território',
    descricao: m.descricao || '',
    trilhaId: null,
    categoria: categoriaParaApp(m.categoria),
    status: 'disponivel',
    instrucao: m.instrucao || '',
    oQueColetar: insumosParaApp(m.insumos),
    recompensa: m.recompensa || 'Insígnia da missão',
    xp: 100,
    npc: npcParaApp(m.npc, m.titulo || 'a missão'),
    cenario: cen,
    concluidaEm: null
  };
}

/**
 * Grava a missão (formato app) na tabela `missoes`. Escrita exige sessão (RLS);
 * o autor precisa estar logado no mapa. Retorna { ok, message? }.
 */
export async function upsertMissaoParaApp(m, cenario) {
  if (!supabase) {
    return { ok: false, message: 'Supabase desligado: a missão não será encontrada por outro aparelho.' };
  }
  const missaoApp = construirMissaoApp(m, cenario);
  try {
    const { error } = await supabase
      .from('missoes')
      .upsert({ id: missaoApp.id, data: missaoApp, created_at: new Date().toISOString() });
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, message: String(err) };
  }
}
