// Envio das respostas de formulário ao Supabase (tabela `respostas`).
// Participante anônimo GRAVA (insert); só o admin logado LÊ (select), por RLS.
// Best-effort: sem Supabase configurado, vira no-op (o app segue local).
import type { RespostaItem } from '../types';
import { supabase } from './supabase';

export interface RespostaPayload {
  autor: string;
  enviadoEm: string;
  itens: RespostaItem[];
}

/** Grava as respostas de um formulário de missão. Retorna { ok, message? }. */
export async function enviarRespostas(missaoId: string, payload: RespostaPayload): Promise<{ ok: boolean; message?: string }> {
  if (!supabase) return { ok: false, message: 'Supabase desligado: respostas não foram enviadas.' };
  try {
    const { error } = await supabase.from('respostas').insert({ missao_id: missaoId, data: payload });
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, message: String(err) };
  }
}
