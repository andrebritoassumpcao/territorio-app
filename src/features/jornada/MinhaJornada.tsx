import { useAcervo } from '../../store/useAcervo';
import { useFluxo } from '../../ui/fluxo';
import Icone from '../../ui/Icone';
import PerfilHeader from './PerfilHeader';
import { CATEGORIA_ICONE } from './rotulos';
import { useT } from '../../i18n/I18nProvider';

// Página "Minha jornada" do perfil: onde vive todo o conteúdo de missões.
// Os fluxos (missão, totem, memória, scan) abrem como bottom-sheets por cima
// (ver ui/fluxo.tsx); o QR lido pela câmera nativa entra por deep link.
export default function MinhaJornada() {
  const { missoes, memorias, insignias } = useAcervo();
  const fluxo = useFluxo();
  const { t } = useT();

  const abertas = missoes.filter((m) => m.status !== 'concluida');
  const concluidas = missoes.filter((m) => m.status === 'concluida');

  return (
    <>
      <div className="pagina-cabecalho">
        <h1 className="pagina-titulo">{t('journey.title')}</h1>
        <p className="pagina-sub">{t('journey.subtitle')}</p>
      </div>

      <PerfilHeader />

      {/* Entrada por QR: escaneie com a câmera do app, ou aponte a câmera nativa do celular. */}
      <div className="dica-scan" data-tour="scan">
        <span className="dica-scan__avatar" aria-hidden="true">
          <Icone nome="qr-code" tamanho={28} />
        </span>
        <p className="dica-scan__texto">
          {t('journey.scanHint')}
        </p>
        <button type="button" className="botao-primario botao-primario--sm" onClick={fluxo.abrirScan}>
          <Icone nome="scan" tamanho={16} /> {t('journey.scanQr')}
        </button>
      </div>

      {/* Missões */}
      <section className="secao">
        <div className="secao__cabecalho">
          <h2 className="secao__titulo"><Icone nome="trophy" tamanho={18} /> {t('journey.missions')}</h2>
          <span className="secao__contagem">{t('journey.missionsToDo', { n: abertas.length })}</span>
        </div>
        <ul className="cards">
          {abertas.map((m, i) => (
            <li key={m.id} data-tour={i === 0 ? 'missao' : undefined}>
              <button type="button" className="card card--missao" onClick={() => fluxo.abrirMissao(m.id)}>
                <span className="card__icone card__icone--missao">
                  <Icone nome={CATEGORIA_ICONE[m.categoria]} />
                </span>
                <span className="card__texto">
                  <span className="card__titulo">{m.titulo}</span>
                  <span className="card__sub">{t(`category.${m.categoria}`)}</span>
                  <span className="card__meta"><Icone nome="sparkles" tamanho={13} /> {m.recompensa}</span>
                </span>
                <Icone nome="chevron-right" tamanho={18} />
              </button>
            </li>
          ))}
          {abertas.length === 0 && (
            <li className="vazio">
              {missoes.length === 0 ? t('journey.missionsEmpty') : t('journey.missionsAllDone')}
            </li>
          )}
        </ul>
      </section>

      {/* Insígnias */}
      <section className="secao" data-tour="insignias">
        <div className="secao__cabecalho">
          <h2 className="secao__titulo"><Icone nome="star" tamanho={18} /> {t('journey.badges')}</h2>
        </div>
        <ul className="insignias">
          {insignias.map((i) => (
            <li key={i.id} className={`insignia${i.conquistada ? ' insignia--on' : ''}`} title={t(`badge.${i.id}.desc`)}>
              <span className="insignia__medalha"><Icone nome={i.icone} tamanho={22} /></span>
              <span className="insignia__nome">{t(`badge.${i.id}.nome`)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Memórias */}
      <section className="secao" data-tour="memorias">
        <div className="secao__cabecalho">
          <h2 className="secao__titulo"><Icone nome="camera" tamanho={18} /> {t('journey.memories')}</h2>
          <span className="secao__contagem">{memorias.length}</span>
        </div>
        <ul className="memorias">
          {memorias.map((m) => (
            <li key={m.id} className="memoria">
              <div className="memoria__foto" style={m.foto ? { backgroundImage: `url(${m.foto})` } : undefined}>
                {!m.foto && <Icone nome="camera" tamanho={20} />}
              </div>
              <div className="memoria__corpo">
                <VinculoChip missaoId={m.missaoId} totemId={m.totemId} />
                <p className="memoria__titulo">{m.titulo}</p>
                {m.descricao && <p className="memoria__desc">{m.descricao}</p>}
                <p className="memoria__meta">{m.autor} · {formatarData(m.data)}</p>
              </div>
            </li>
          ))}
          {memorias.length === 0 && (
            <li className="vazio">{t('journey.memoriesEmpty')}</li>
          )}
        </ul>
      </section>

      {concluidas.length > 0 && (
        <section className="secao">
          <div className="secao__cabecalho">
            <h2 className="secao__titulo"><Icone nome="check" tamanho={18} /> {t('journey.completed')}</h2>
          </div>
          <ul className="cards">
            {concluidas.map((m) => (
              <li key={m.id}>
                <div className="card card--feita">
                  <span className="card__icone card__icone--feita"><Icone nome="check" /></span>
                  <span className="card__texto">
                    <span className="card__titulo">{m.titulo}</span>
                    <span className="card__meta">{m.recompensa}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="rodape-espaco" />
    </>
  );
}

// De onde a memória veio (RN-MEM-004): missão (verde) ou totem (dourado).
function VinculoChip({ missaoId, totemId }: { missaoId: string | null; totemId: string | null }) {
  const { missoes, totens } = useAcervo();
  const { t } = useT();
  const missao = missaoId ? missoes.find((x) => x.id === missaoId) : undefined;
  const totem = totemId ? totens.find((x) => x.id === totemId) : undefined;
  if (missao) {
    return (
      <span className="chip chip--missao memoria__vinculo">
        <Icone nome="trophy" tamanho={12} /> {t('journey.chipMission')} · {missao.titulo}
      </span>
    );
  }
  if (totem) {
    return (
      <span className="chip chip--totem memoria__vinculo">
        <Icone nome="map-pin" tamanho={12} /> {t('journey.chipTotem')} · {totem.nome}
      </span>
    );
  }
  return null;
}

function formatarData(iso: string): string {
  const [a, m, d] = iso.split('-');
  if (!a || !m || !d) return iso;
  return `${d}/${m}/${a}`;
}
