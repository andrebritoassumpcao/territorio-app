import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { QrMock, VinculoMemoria } from '../types';
import { useAcervo } from '../store/useAcervo';
import { buscarMissao } from '../data/missoesRemotas';
import { useAviso } from './aviso';
import { CAMINHO_JORNADA, useRota } from './rota';
import ScanSheet from '../features/scan/ScanSheet';
import MissaoSheet from '../features/missao/MissaoSheet';
import RecompensaSheet from '../features/missao/RecompensaSheet';
import TotemSheet from '../features/totem/TotemSheet';
import MemoriaForm from '../features/memoria/MemoriaForm';
import CenaNpc from '../features/npc/CenaNpc';

// Orquestra o que abre sobre Minha jornada — um de cada vez:
//   scan → [cena do NPC] → missão ⇄ memória → recompensa (→ memória);   [cena do NPC] → totem → memória.
type Alvo = 'missao' | 'totem';
type Estado =
  | { tipo: 'nenhum' }
  | { tipo: 'scan' }
  | { tipo: 'npc'; alvo: Alvo; id: string }
  | { tipo: 'missao'; missaoId: string }
  | { tipo: 'recompensa'; missaoId: string; recompensa: string; xp: number }
  | { tipo: 'totem'; totemId: string }
  | { tipo: 'memoria'; vinculo: VinculoMemoria };

/** De onde veio a abertura: `qr` (câmera ou simulação) sempre toca a cena do NPC. */
export type Origem = 'qr' | 'card';

interface Fluxo {
  abrirScan: () => void;
  abrirMissao: (missaoId: string, origem?: Origem) => void;
  abrirTotem: (totemId: string, origem?: Origem) => void;
}

const FluxoContext = createContext<Fluxo | null>(null);

export function FluxoProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>({ tipo: 'nenhum' });
  // Insumos registrados por missão. Ficam aqui (e não no sheet) para sobreviver à
  // ida ao formulário de memória e à cena do NPC; somem ao fechar o fluxo.
  const [registros, setRegistros] = useState<Record<string, string[]>>({});
  const fechar = () => {
    setEstado({ tipo: 'nenhum' });
    setRegistros({});
  };
  const { rota, navegar } = useRota();
  const { missoes, totens, npcVistos, marcarNpcVisto, adicionarMissao } = useAcervo();
  const avisar = useAviso();
  // Missão buscada no Supabase (autorada no mapa) esperando entrar no store para abrir.
  const [missaoPendente, setMissaoPendente] = useState<string | null>(null);

  function falasDaCena(alvo: Alvo, id: string) {
    const npc = alvo === 'missao' ? missoes.find((m) => m.id === id)?.npc : totens.find((t) => t.id === id)?.roteiroNpc;
    return npc?.falas.filter((f) => f.id !== 'ok') ?? [];
  }

  function abrirConteudo(alvo: Alvo, id: string) {
    setEstado(alvo === 'missao' ? { tipo: 'missao', missaoId: id } : { tipo: 'totem', totemId: id });
  }

  // Regra da cena (protótipo): QR sempre toca; card só na primeira vez daquele
  // ponto; missão concluída vai direto ao conteúdo. "Ouvir de novo" força a cena.
  function abrir(alvo: Alvo, id: string, origem: Origem) {
    const concluida = alvo === 'missao' && missoes.find((m) => m.id === id)?.status === 'concluida';
    const jaViu = npcVistos.includes(`${alvo}:${id}`);
    if (falasDaCena(alvo, id).length > 0 && !concluida && (origem === 'qr' || !jaViu)) {
      setEstado({ tipo: 'npc', alvo, id });
    } else {
      abrirConteudo(alvo, id);
    }
  }

  // Deep link (QR lido pela câmera nativa): /m/{mapa}/missao/{id} ou /m/{mapa}/t/{id}
  // abre a cena do NPC (e depois o sheet) sobre Minha jornada. A URL volta para
  // /jornada na hora, para que fechar/recarregar não reabra. ID desconhecido → aviso.
  // Missão não encontrada no store local é buscada no Supabase (autorada no mapa,
  // handoff por QR): ao chegar, entra no acervo e abre pelo efeito de `missaoPendente`.
  useEffect(() => {
    if (rota.tipo === 'missao') {
      const id = rota.id;
      if (missoes.some((m) => m.id === id)) {
        abrir('missao', id, 'qr');
      } else {
        avisar('Carregando missão…');
        buscarMissao(id).then((m) => {
          if (m) {
            adicionarMissao(m);
            setMissaoPendente(m.id);
          } else {
            avisar('Missão não encontrada neste protótipo.');
          }
        });
      }
      navegar(CAMINHO_JORNADA, { substituir: true });
    } else if (rota.tipo === 'totem') {
      if (totens.some((t) => t.id === rota.id)) abrir('totem', rota.id, 'qr');
      else avisar('Totem não encontrado neste protótipo.');
      navegar(CAMINHO_JORNADA, { substituir: true });
    }
    // Reage só à mudança de rota; o estado do acervo é lido no momento do deep link.
  }, [rota]);

  // Quando a missão buscada no Supabase entra no acervo, abre o fluxo (cena → sheet).
  useEffect(() => {
    if (missaoPendente && missoes.some((m) => m.id === missaoPendente)) {
      abrir('missao', missaoPendente, 'qr');
      setMissaoPendente(null);
    }
  }, [missaoPendente, missoes]);

  const fluxo: Fluxo = {
    abrirScan: () => setEstado({ tipo: 'scan' }),
    abrirMissao: (missaoId, origem = 'card') => abrir('missao', missaoId, origem),
    abrirTotem: (totemId, origem = 'card') => abrir('totem', totemId, origem)
  };

  function aoSelecionarQr(qr: QrMock) {
    abrir(qr.alvo, qr.refId, 'qr');
  }

  function cenaDoNpc(alvo: Alvo, id: string) {
    const ponto = alvo === 'missao' ? missoes.find((m) => m.id === id) : totens.find((t) => t.id === id);
    const npc = ponto && ('npc' in ponto ? ponto.npc : ponto.roteiroNpc);
    if (!ponto || !npc) return null;
    const concluir = () => {
      marcarNpcVisto(`${alvo}:${id}`);
      abrirConteudo(alvo, id);
    };
    return (
      <CenaNpc
        nome={npc.nome}
        falas={falasDaCena(alvo, id)}
        cenario={ponto.cenario}
        alvo={alvo}
        tituloPonto={'titulo' in ponto ? ponto.titulo : ponto.nome}
        cta={alvo === 'missao' ? 'Começar missão' : 'Explorar o ponto'}
        onConcluir={concluir}
      />
    );
  }

  // Memória de missão volta para a própria missão (com os registros intactos);
  // memória de totem mantém o comportamento de antes: fecha o fluxo.
  function voltarDaMemoria(vinculo: VinculoMemoria, salvou: boolean) {
    if (vinculo.tipo === 'missao') {
      setEstado({ tipo: 'missao', missaoId: vinculo.id });
      if (salvou) avisar('Memória guardada na missão.');
    } else {
      fechar();
      if (salvou) avisar('Memória guardada no ponto.');
    }
  }

  return (
    <FluxoContext.Provider value={fluxo}>
      {children}

      {estado.tipo === 'scan' && <ScanSheet onFechar={fechar} onSelecionar={aoSelecionarQr} />}

      {estado.tipo === 'npc' && cenaDoNpc(estado.alvo, estado.id)}

      {estado.tipo === 'missao' && (
        <MissaoSheet
          missaoId={estado.missaoId}
          registrados={registros[estado.missaoId] ?? []}
          onRegistrar={(insumoId) =>
            setRegistros((r) => ({ ...r, [estado.missaoId]: [...(r[estado.missaoId] ?? []), insumoId] }))
          }
          onAdicionarMemoria={() => setEstado({ tipo: 'memoria', vinculo: { tipo: 'missao', id: estado.missaoId } })}
          onFechar={fechar}
          onOuvirNpc={() => setEstado({ tipo: 'npc', alvo: 'missao', id: estado.missaoId })}
          onConcluida={(r) => setEstado({ tipo: 'recompensa', missaoId: estado.missaoId, recompensa: r.recompensa, xp: r.xp })}
        />
      )}

      {estado.tipo === 'recompensa' && (
        <RecompensaSheet
          missaoId={estado.missaoId}
          recompensa={estado.recompensa}
          xp={estado.xp}
          onFechar={fechar}
          onDeixarMemoria={() => setEstado({ tipo: 'memoria', vinculo: { tipo: 'missao', id: estado.missaoId } })}
        />
      )}

      {estado.tipo === 'totem' && (
        <TotemSheet
          totemId={estado.totemId}
          onFechar={fechar}
          onOuvirNpc={() => setEstado({ tipo: 'npc', alvo: 'totem', id: estado.totemId })}
          onDeixarMemoria={(totemId) => setEstado({ tipo: 'memoria', vinculo: { tipo: 'totem', id: totemId } })}
        />
      )}

      {estado.tipo === 'memoria' && (
        <MemoriaForm
          vinculo={estado.vinculo}
          onFechar={() => voltarDaMemoria(estado.vinculo, false)}
          onSalva={() => voltarDaMemoria(estado.vinculo, true)}
        />
      )}
    </FluxoContext.Provider>
  );
}

export function useFluxo(): Fluxo {
  const ctx = useContext(FluxoContext);
  if (!ctx) throw new Error('useFluxo precisa estar dentro de <FluxoProvider>.');
  return ctx;
}
