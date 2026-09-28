import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

// Roteamento mínimo (sem dependência) via History API. As rotas de missão e
// totem seguem o padrão de URL profunda do mapa (§14.1):
//   /m/{mapaId}/missao/{missaoId}?s=…   /m/{mapaId}/t/{totemId}?s=…
// O `?s=` (assinatura, RN-FIG-016) é ignorado no protótipo.
export type Rota =
  | { tipo: 'jornada' }
  | { tipo: 'qrs' }
  | { tipo: 'missao'; mapaId: string; id: string }
  | { tipo: 'totem'; mapaId: string; id: string };

export const CAMINHO_JORNADA = '/jornada';

export function lerRota(caminho: string): Rota | null {
  const partes = caminho.split('/').filter(Boolean).map(decodeURIComponent);
  if (partes.length === 1 && partes[0] === 'jornada') return { tipo: 'jornada' };
  if (partes.length === 1 && partes[0] === 'qrs') return { tipo: 'qrs' };
  if (partes.length === 4 && partes[0] === 'm') {
    const [, mapaId, alvo, id] = partes;
    if (alvo === 'missao') return { tipo: 'missao', mapaId, id };
    if (alvo === 't') return { tipo: 'totem', mapaId, id };
  }
  return null;
}

interface Roteador {
  rota: Rota;
  navegar: (caminho: string, opcoes?: { substituir?: boolean }) => void;
}

const RotaContext = createContext<Roteador | null>(null);

// Caminho desconhecido (inclusive "/") cai em Minha jornada, com a URL corrigida.
function rotaAtual(): Rota {
  const rota = lerRota(window.location.pathname);
  if (rota) return rota;
  window.history.replaceState(null, '', CAMINHO_JORNADA);
  return { tipo: 'jornada' };
}

export function RotaProvider({ children }: { children: ReactNode }) {
  const [rota, setRota] = useState<Rota>(rotaAtual);

  useEffect(() => {
    const aoVoltar = () => setRota(rotaAtual());
    window.addEventListener('popstate', aoVoltar);
    return () => window.removeEventListener('popstate', aoVoltar);
  }, []);

  const navegar = useCallback((caminho: string, opcoes?: { substituir?: boolean }) => {
    if (opcoes?.substituir) window.history.replaceState(null, '', caminho);
    else window.history.pushState(null, '', caminho);
    setRota(rotaAtual());
    window.scrollTo(0, 0);
  }, []);

  return <RotaContext.Provider value={{ rota, navegar }}>{children}</RotaContext.Provider>;
}

export function useRota(): Roteador {
  const ctx = useContext(RotaContext);
  if (!ctx) throw new Error('useRota precisa estar dentro de <RotaProvider>.');
  return ctx;
}
