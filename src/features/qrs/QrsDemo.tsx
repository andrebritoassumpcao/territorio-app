import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QRS_MOCK } from '../../data/qrCodes';
import Icone from '../../ui/Icone';
import { CAMINHO_JORNADA, useRota } from '../../ui/rota';

// Página de apoio à apresentação (rota "escondida" /qrs): mostra o QR de cada
// missão/totem mockado apontando para ESTE domínio, no padrão de URL do mapa
// (§14.1). Aberta no notebook/projetor; o celular lê com a câmera nativa.
export default function QrsDemo() {
  const { navegar } = useRota();
  const origem = window.location.origin;
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
  const [imagens, setImagens] = useState<Record<string, string>>({});

  useEffect(() => {
    let ativo = true;
    Promise.all(
      QRS_MOCK.map(async (qr) => [qr.codigo, await QRCode.toDataURL(`${origem}/${qr.codigo}`, { width: 320, margin: 1 })] as const)
    ).then((pares) => {
      if (ativo) setImagens(Object.fromEntries(pares));
    });
    return () => {
      ativo = false;
    };
  }, [origem]);

  return (
    <div className="qrs">
      <header className="qrs__cabecalho">
        <button type="button" className="botao-secundario botao-secundario--sm" onClick={() => navegar(CAMINHO_JORNADA)}>
          <Icone nome="arrow-left" tamanho={16} /> Minha jornada
        </button>
        <h1 className="qrs__titulo">QRs de demonstração</h1>
        <p className="qrs__sub">
          Aponte a câmera do celular para um QR: o link abre a missão ou o totem direto em Minha jornada.
        </p>
        {local && (
          <p className="qrs__alerta">
            Você está em <strong>{window.location.host}</strong>: o celular não alcança este endereço. Use a versão publicada no Vercel.
          </p>
        )}
      </header>

      <ul className="qrs__grade">
        {QRS_MOCK.map((qr) => {
          const url = `${origem}/${qr.codigo}`;
          return (
            <li key={qr.codigo} className={`qr-cartao qr-cartao--${qr.alvo}`}>
              <span className={`chip chip--${qr.alvo}`}>
                <Icone nome={qr.alvo === 'missao' ? 'trophy' : 'map-pin'} tamanho={13} />
                {qr.alvo === 'missao' ? 'Missão' : 'Totem'}
              </span>
              <div className="qr-cartao__img">
                {imagens[qr.codigo] ? <img src={imagens[qr.codigo]} alt={`QR: ${qr.rotulo}`} width={220} height={220} /> : null}
              </div>
              <p className="qr-cartao__rotulo">{qr.rotulo.replace(/^QR d[oa] (missão|totem) — /, '')}</p>
              <a className="qr-cartao__url" href={`/${qr.codigo}`} onClick={(e) => {
                e.preventDefault();
                navegar(`/${qr.codigo}`);
              }}>
                {url}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
