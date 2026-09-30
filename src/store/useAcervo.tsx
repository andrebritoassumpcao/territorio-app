import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Insignia, Memoria, Missao, Perfil, Totem, Trilha } from '../types';
import { PERFIL_INICIAL } from '../data/perfil';
import {
  INSIGNIAS_INICIAIS,
  MEMORIAS_INICIAIS,
  MISSOES_INICIAIS,
  TOTENS_INICIAIS,
  TRILHAS
} from '../data/acervo';

interface EstadoAcervo {
  perfil: Perfil;
  trilhas: Trilha[];
  missoes: Missao[];
  totens: Totem[];
  memorias: Memoria[];
  insignias: Insignia[];
  /** Cenas do NPC já vistas, por ponto (`missao:{id}` / `totem:{id}`). */
  npcVistos: string[];
}

interface Acervo extends EstadoAcervo {
  concluirMissao: (missaoId: string) => { recompensa: string; xp: number } | null;
  adicionarMemoria: (entrada: { missaoId: string | null; totemId: string | null; titulo: string; descricao: string; foto: string | null }) => void;
  /** Injeta uma missão autorada no mapa (handoff por QR). Idempotente; cria a insígnia par. */
  adicionarMissao: (missao: Missao) => void;
  marcarNpcVisto: (chave: string) => void;
  resetar: () => void;
}

// v3: memórias ganharam `missaoId` (e a semente, uma memória na Horta).
// v2: falas do NPC viraram {id, texto} (§14.2) e entrou `npcVistos`.
const CHAVE = 'territorio.acervo.v3';

function estadoInicial(): EstadoAcervo {
  return {
    perfil: { ...PERFIL_INICIAL },
    trilhas: TRILHAS,
    missoes: MISSOES_INICIAIS.map((m) => ({ ...m })),
    totens: TOTENS_INICIAIS.map((t) => ({ ...t })),
    memorias: MEMORIAS_INICIAIS.map((m) => ({ ...m })),
    insignias: INSIGNIAS_INICIAIS.map((i) => ({ ...i })),
    npcVistos: []
  };
}

function carregar(): EstadoAcervo {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) return { ...estadoInicial(), ...(JSON.parse(bruto) as Partial<EstadoAcervo>) };
  } catch {
    /* localStorage indisponível: usa o estado semente */
  }
  return estadoInicial();
}

const AcervoContext = createContext<Acervo | null>(null);

export function AcervoProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoAcervo>(carregar);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado));
    } catch {
      /* sem persistência: segue só em memória */
    }
  }, [estado]);

  const concluirMissao = useCallback<Acervo['concluirMissao']>((missaoId) => {
    const missao = estado.missoes.find((m) => m.id === missaoId);
    if (!missao || missao.status === 'concluida') return null;
    const agora = new Date().toISOString();

    setEstado((s) => {
      // XP com rollover simples de nível.
      let { nivel, xp, xpProximoNivel } = s.perfil;
      xp += missao.xp;
      while (xp >= xpProximoNivel) {
        xp -= xpProximoNivel;
        nivel += 1;
        xpProximoNivel = Math.round(xpProximoNivel * 1.15);
      }
      return {
        ...s,
        perfil: { ...s.perfil, nivel, xp, xpProximoNivel },
        missoes: s.missoes.map((m) => (m.id === missaoId ? { ...m, status: 'concluida', concluidaEm: agora } : m)),
        insignias: s.insignias.map((i) => (i.missaoId === missaoId ? { ...i, conquistada: true } : i))
      };
    });

    return { recompensa: missao.recompensa, xp: missao.xp };
  }, [estado.missoes]);

  const adicionarMemoria = useCallback<Acervo['adicionarMemoria']>((entrada) => {
    setEstado((s) => {
      const nova: Memoria = {
        id: `mem-${Date.now().toString(36)}`,
        titulo: entrada.titulo.trim() || 'Memória sem título',
        autor: s.perfil.nome,
        data: new Date().toISOString().slice(0, 10),
        foto: entrada.foto,
        descricao: entrada.descricao.trim(),
        missaoId: entrada.missaoId,
        totemId: entrada.totemId,
        comentarios: []
      };
      return { ...s, memorias: [nova, ...s.memorias] };
    });
  }, []);

  const adicionarMissao = useCallback<Acervo['adicionarMissao']>((missao) => {
    setEstado((s) => {
      if (s.missoes.some((m) => m.id === missao.id)) return s; // idempotente
      const insignia: Insignia = {
        id: `ins-${missao.id}`,
        nome: missao.recompensa || 'Insígnia da missão',
        conquistada: false,
        missaoId: missao.id
      };
      const jaTemInsignia = s.insignias.some((i) => i.id === insignia.id);
      return {
        ...s,
        missoes: [missao, ...s.missoes],
        insignias: jaTemInsignia ? s.insignias : [...s.insignias, insignia]
      };
    });
  }, []);

  const marcarNpcVisto = useCallback((chave: string) => {
    setEstado((s) => (s.npcVistos.includes(chave) ? s : { ...s, npcVistos: [...s.npcVistos, chave] }));
  }, []);

  const resetar = useCallback(() => {
    setEstado(estadoInicial());
  }, []);

  const valor = useMemo<Acervo>(
    () => ({ ...estado, concluirMissao, adicionarMemoria, adicionarMissao, marcarNpcVisto, resetar }),
    [estado, concluirMissao, adicionarMemoria, adicionarMissao, marcarNpcVisto, resetar]
  );

  return <AcervoContext.Provider value={valor}>{children}</AcervoContext.Provider>;
}

export function useAcervo(): Acervo {
  const ctx = useContext(AcervoContext);
  if (!ctx) throw new Error('useAcervo precisa estar dentro de <AcervoProvider>.');
  return ctx;
}
