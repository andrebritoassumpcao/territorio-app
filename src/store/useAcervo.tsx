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
  /** Tutorial de onboarding já visto (mostrado uma vez no primeiro acesso). */
  tutorialVisto: boolean;
}

interface Acervo extends EstadoAcervo {
  /** Conclui a missão (XP + conquistas). Retorna também as insígnias recém-desbloqueadas. */
  concluirMissao: (missaoId: string) => { recompensa: string; xp: number; novasInsignias: Insignia[] } | null;
  /** Adiciona a memória; retorna as insígnias recém-desbloqueadas (ex.: "Primeira memória"). */
  adicionarMemoria: (entrada: { missaoId: string | null; totemId: string | null; titulo: string; descricao: string; foto: string | null }) => Insignia[];
  /** Injeta uma missão autorada no mapa (handoff por QR). Idempotente. */
  adicionarMissao: (missao: Missao) => void;
  marcarNpcVisto: (chave: string) => void;
  marcarTutorialVisto: () => void;
  resetar: () => void;
}

// v5: perfil inicial "Usuário".
// v4: removidos os mocks (missões/totens/memórias) e insígnias passaram a ser 4
// conquistas por gatilho (não mais por missão). Bump da chave para zerar quem já
// tinha o estado mockado salvo.
// v3: memórias ganharam `missaoId`. v2: falas do NPC {id, texto} + `npcVistos`.
const CHAVE = 'territorio.acervo.v5';

function estadoInicial(): EstadoAcervo {
  return {
    perfil: { ...PERFIL_INICIAL },
    trilhas: TRILHAS,
    missoes: MISSOES_INICIAIS.map((m) => ({ ...m })),
    totens: TOTENS_INICIAIS.map((t) => ({ ...t })),
    memorias: MEMORIAS_INICIAIS.map((m) => ({ ...m })),
    insignias: INSIGNIAS_INICIAIS.map((i) => ({ ...i })),
    npcVistos: [],
    tutorialVisto: false
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

// Acende as insígnias cujos ids estão na lista (só se ainda não conquistadas).
function desbloquear(insignias: Insignia[], ids: string[]): Insignia[] {
  return insignias.map((i) => (ids.includes(i.id) && !i.conquistada ? { ...i, conquistada: true } : i));
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

    // Conquistas: "Primeira missão" na 1ª; "Guardião do Território" ao chegar a 3 concluídas.
    const totalConcluidas = estado.missoes.filter((m) => m.status === 'concluida').length + 1;
    const alvos = ['primeira-missao', ...(totalConcluidas >= 3 ? ['guardiao-territorio'] : [])];
    const novasInsignias = estado.insignias
      .filter((i) => alvos.includes(i.id) && !i.conquistada)
      .map((i) => ({ ...i, conquistada: true }));

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
        insignias: desbloquear(s.insignias, alvos)
      };
    });

    return { recompensa: missao.recompensa, xp: missao.xp, novasInsignias };
  }, [estado.missoes, estado.insignias]);

  const adicionarMemoria = useCallback<Acervo['adicionarMemoria']>((entrada) => {
    const novasInsignias = estado.insignias
      .filter((i) => i.id === 'primeira-memoria' && !i.conquistada)
      .map((i) => ({ ...i, conquistada: true }));

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
      return { ...s, memorias: [nova, ...s.memorias], insignias: desbloquear(s.insignias, ['primeira-memoria']) };
    });

    return novasInsignias;
  }, [estado.insignias]);

  const adicionarMissao = useCallback<Acervo['adicionarMissao']>((missao) => {
    setEstado((s) => {
      const existente = s.missoes.find((m) => m.id === missao.id);
      // Update-or-insert: ao rebuscar do mapa (edição), atualiza o conteúdo mas
      // PRESERVA o progresso local (status/conclusão) para não zerar quem já concluiu.
      const missoes = existente
        ? s.missoes.map((m) =>
            m.id === missao.id ? { ...missao, status: m.status, concluidaEm: m.concluidaEm } : m
          )
        : [missao, ...s.missoes];
      return { ...s, missoes };
    });
  }, []);

  const marcarNpcVisto = useCallback((chave: string) => {
    setEstado((s) => (s.npcVistos.includes(chave) ? s : { ...s, npcVistos: [...s.npcVistos, chave] }));
  }, []);

  const marcarTutorialVisto = useCallback(() => {
    setEstado((s) => (s.tutorialVisto ? s : { ...s, tutorialVisto: true }));
  }, []);

  const resetar = useCallback(() => {
    setEstado(estadoInicial());
  }, []);

  const valor = useMemo<Acervo>(
    () => ({ ...estado, concluirMissao, adicionarMemoria, adicionarMissao, marcarNpcVisto, marcarTutorialVisto, resetar }),
    [estado, concluirMissao, adicionarMemoria, adicionarMissao, marcarNpcVisto, marcarTutorialVisto, resetar]
  );

  return <AcervoContext.Provider value={valor}>{children}</AcervoContext.Provider>;
}

export function useAcervo(): Acervo {
  const ctx = useContext(AcervoContext);
  if (!ctx) throw new Error('useAcervo precisa estar dentro de <AcervoProvider>.');
  return ctx;
}
