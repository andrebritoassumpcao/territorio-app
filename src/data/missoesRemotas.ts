// Busca de missão autorada no mapa, por ID (RN-FIG: handoff mapa → app).
// A missão é gravada pelo mapa já no formato `Missao` do app, na tabela
// `missoes` (coluna `data` jsonb). Ver src/mapa/handoff.js e docs/MIGRACAO_MAPA.md.
import type { Missao } from '../types';
import { supabase } from './supabase';

/** Retorna a missão gravada pelo mapa, ou null (sem Supabase, não encontrada ou erro). */
export async function buscarMissao(id: string): Promise<Missao | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('missoes')
      .select('data')
      .eq('id', id)
      .maybeSingle();
    if (error) {
      console.warn('[missoesRemotas] buscarMissao:', error.message);
      return null;
    }
    return (data?.data as Missao | undefined) ?? null;
  } catch (err) {
    console.warn('[missoesRemotas] buscarMissao (exceção):', err);
    return null;
  }
}
