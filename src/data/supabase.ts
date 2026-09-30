// Cliente Supabase do app (leitura das missões autoradas no mapa).
// Usa as MESMAS variáveis do mapa (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY),
// para reaproveitar o projeto Supabase que o mapa já usa.
//
// Sem as variáveis definidas, `dbEnabled` fica false e o app segue mockado:
// um deep link de missão criada no mapa mostrará "Missão não encontrada".
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const dbEnabled = Boolean(url && key);

export const supabase: SupabaseClient | null = dbEnabled ? createClient(url!, key!) : null;

if (!dbEnabled) {
  console.warn(
    '[supabase] Leitura de missões desligada: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY. ' +
      'Missões criadas no mapa não serão encontradas por deep link.'
  );
}
