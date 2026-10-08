/* ==========================================================================
   TERRITÓRIO — AUTENTICAÇÃO MÍNIMA (Supabase Auth)
   Login único de demonstração para proteger o protótipo durante apresentações.
   Não há cadastro nem papéis: o usuário é criado direto no Supabase Auth.
   A sessão fica no localStorage (gerenciada pelo supabase-js).
   Ver docs/DOCUMENTACAO_ATUAL.md (seção de autenticação).
   ========================================================================== */

import { supabase } from './db.js';
import { t } from '../i18n/idioma';

// Sem Supabase configurado (dev sem .env.local) o login é pulado.
export const authEnabled = Boolean(supabase);

/** @returns {Promise<object|null>} sessão atual ou null. */
export async function getSession() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}

/**
 * @returns {Promise<{ok: boolean, message?: string}>}
 */
export async function signIn(email, password) {
  if (!supabase) return { ok: false, message: t('map.login.unavailable') };
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const invalid = /invalid login credentials/i.test(error.message);
      return { ok: false, message: invalid ? t('map.login.invalid') : error.message };
    }
    return { ok: true };
  } catch (err) {
    console.warn('[auth] signIn (exceção):', err);
    return { ok: false, message: t('map.login.connectError') };
  }
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
