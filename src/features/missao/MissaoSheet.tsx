import { useMemo, useState } from 'react';
import Sheet from '../../ui/Sheet';
import Icone from '../../ui/Icone';
import type { Insignia, Insumo } from '../../types';
import { useAcervo } from '../../store/useAcervo';
import { useT } from '../../i18n/I18nProvider';
import OuvirNpc from '../npc/OuvirNpc';

interface Props {
  missaoId: string;
  /** Insumos já registrados: vivem no fluxo para sobreviver à ida ao formulário de memória. */
  registrados: string[];
  onRegistrar: (insumoId: string) => void;
  /** Abre o formulário em steps (insumo tipo 'formulario'). */
  onResponderFormulario: (insumo: Insumo) => void;
  onFechar: () => void;
  onConcluida: (r: { recompensa: string; xp: number; novasInsignias: Insignia[] }) => void;
  onOuvirNpc: () => void;
  onAdicionarMemoria: () => void;
}

// Executar a missão: registrar (mock) cada insumo pedido e enviar. Só habilita
// "Enviar" quando os insumos obrigatórios estão registrados (RN-FIG-020).
// Memórias da missão (RN-MEM-004) são livres: não contam para o envio.
export default function MissaoSheet({ missaoId, registrados, onRegistrar, onResponderFormulario, onFechar, onConcluida, onOuvirNpc, onAdicionarMemoria }: Props) {
  const { missoes, memorias, concluirMissao } = useAcervo();
  const { t } = useT();
  const missao = missoes.find((m) => m.id === missaoId);
  const memoriasDaMissao = memorias.filter((m) => m.missaoId === missaoId);
  const [enviando, setEnviando] = useState(false);

  const faltaObrigatorio = useMemo(
    () => (missao ? missao.oQueColetar.some((i) => i.obrigatorio && !registrados.includes(i.id)) : true),
    [missao, registrados]
  );

  if (!missao) return null;

  const jaConcluida = missao.status === 'concluida';

  function enviar() {
    setEnviando(true);
    // Pequeno atraso só para dar sensação de envio (mock, sem rede).
    window.setTimeout(() => {
      const r = concluirMissao(missao!.id);
      setEnviando(false);
      if (r) onConcluida(r);
      else onFechar();
    }, 500);
  }

  return (
    <Sheet aberto onFechar={onFechar} titulo={missao.titulo} cor="var(--color-missao)">
      <span className="chip chip--missao">{t(`category.${missao.categoria}`)}</span>

      {missao.npc && <OuvirNpc npc={missao.npc} alvo="missao" onOuvir={onOuvirNpc} />}

      <section className="bloco">
        <h3 className="bloco__titulo">{t('mission.whatToDo')}</h3>
        <p className="bloco__texto">{missao.instrucao}</p>
      </section>

      <section className="bloco">
        <h3 className="bloco__titulo">{t('mission.whatToCollect')}</h3>
        <ul className="insumos">
          {missao.oQueColetar.map((i, idx) => {
            const feito = registrados.includes(i.id) || jaConcluida;
            return (
              <li key={i.id} className={`insumo${feito ? ' insumo--feito' : ''}`}>
                <span className="insumo__info">
                  <span className="insumo__rotulo">{i.rotulo}</span>
                  {!i.obrigatorio && <span className="insumo__opcional">{t('common.optional')}</span>}
                </span>
                {feito ? (
                  <span className="insumo__ok" aria-label={t('mission.recorded')}><Icone nome="check" tamanho={18} /></span>
                ) : i.tipo === 'formulario' ? (
                  <button
                    type="button"
                    className="botao-secundario botao-secundario--sm"
                    data-tour={idx === 0 ? 'registrar' : undefined}
                    onClick={() => onResponderFormulario(i)}
                  >
                    <Icone nome="message" tamanho={16} /> {t('mission.answer')}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="botao-secundario botao-secundario--sm"
                    data-tour={idx === 0 ? 'registrar' : undefined}
                    onClick={() => onRegistrar(i.id)}
                  >
                    <Icone nome="camera" tamanho={16} /> {t('mission.record')}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="bloco">
        <h3 className="bloco__titulo">{t('mission.memoriesHere')}</h3>
        {memoriasDaMissao.length > 0 ? (
          <ul className="mini-memorias">
            {memoriasDaMissao.map((m) => (
              <li key={m.id} className="mini-memoria">
                <Icone nome="message" tamanho={16} />
                <span><strong>{m.titulo}</strong>{m.descricao ? ` — ${m.descricao}` : ''}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dica">{t('mission.memoriesHint')}</p>
        )}
        <button type="button" className="botao-secundario botao-secundario--memoria" onClick={onAdicionarMemoria}>
          <Icone nome="plus" tamanho={16} /> {t('mission.addMemory')}
        </button>
      </section>

      <div className="recompensa-preview">
        <Icone nome="trophy" tamanho={18} />
        <span>{t('mission.reward')}: <strong>{missao.recompensa}</strong> · +{missao.xp} XP</span>
      </div>

      {jaConcluida ? (
        <p className="aviso aviso--sucesso"><Icone nome="check" tamanho={16} /> {t('mission.alreadyDone')}</p>
      ) : (
        <button type="button" className="botao-primario" data-tour="enviar" disabled={faltaObrigatorio || enviando} onClick={enviar}>
          {enviando ? t('mission.submitting') : t('mission.submit')}
        </button>
      )}
      {!jaConcluida && faltaObrigatorio && (
        <p className="dica">{t('mission.submitHint')}</p>
      )}
    </Sheet>
  );
}
