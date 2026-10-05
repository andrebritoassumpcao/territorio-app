// Upload real de memórias ao Supabase (Fase 1 do upload real de fotos).
// Foto no bucket PÚBLICO `memorias`; metadados na tabela `memorias`.
// Participante anônimo GRAVA (insert); leitura é PÚBLICA (o mapa mostra) e só
// o admin logado APAGA (RLS). Best-effort, igual às `respostas`: sem Supabase
// configurado vira no-op e o app segue com a cópia local (dataURL).
import { supabase } from './supabase';
import { comprimirImagem } from './imagem';

export interface MemoriaEntrada {
  missaoId: string | null;
  totemId: string | null;
  titulo: string;
  descricao: string;
  autor: string;
  /** Arquivo cru escolhido no formulário (comprimido antes de subir). */
  arquivo: File | null;
  /** Consentimento de exibição pública no mapa (RN-MEM / LGPD do piloto). */
  consentido: boolean;
}

export interface MemoriaSalva {
  ok: boolean;
  /** URL pública da foto no Storage, quando houve upload. */
  fotoUrl: string | null;
  message?: string;
}

/** Comprime + sobe a foto e grava a memória. Retorna { ok, fotoUrl, message? }. */
export async function salvarMemoria(entrada: MemoriaEntrada): Promise<MemoriaSalva> {
  if (!supabase) return { ok: false, fotoUrl: null, message: 'Supabase desligado: memória guardada só localmente.' };
  try {
    let fotoUrl: string | null = null;
    if (entrada.arquivo) {
      const blob = await comprimirImagem(entrada.arquivo);
      const nome = `mem-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const { error: erroUpload } = await supabase.storage
        .from('memorias')
        .upload(nome, blob, { contentType: blob.type || 'image/jpeg', upsert: false });
      if (erroUpload) return { ok: false, fotoUrl: null, message: erroUpload.message };
      fotoUrl = supabase.storage.from('memorias').getPublicUrl(nome).data.publicUrl;
    }

    const { error } = await supabase.from('memorias').insert({
      missao_id: entrada.missaoId,
      totem_id: entrada.totemId,
      titulo: entrada.titulo.trim() || 'Memória sem título',
      descricao: entrada.descricao.trim(),
      autor: entrada.autor,
      foto_url: fotoUrl,
      consentido: entrada.consentido
    });
    if (error) return { ok: false, fotoUrl, message: error.message };
    return { ok: true, fotoUrl };
  } catch (err) {
    return { ok: false, fotoUrl: null, message: String(err) };
  }
}
