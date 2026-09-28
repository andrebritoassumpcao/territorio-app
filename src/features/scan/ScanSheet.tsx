import Sheet from '../../ui/Sheet';
import Icone from '../../ui/Icone';
import { QRS_MOCK } from '../../data/qrCodes';
import type { QrMock } from '../../types';
import { useAcervo } from '../../store/useAcervo';

interface Props {
  onFechar: () => void;
  onSelecionar: (qr: QrMock) => void;
}

// Scan simulado: em vez da câmera, uma lista de QRs mockados. Cada item leva ao
// fluxo certo (missão ou totem). Missões já concluídas aparecem marcadas.
export default function ScanSheet({ onFechar, onSelecionar }: Props) {
  const { missoes } = useAcervo();

  function concluida(qr: QrMock) {
    return qr.alvo === 'missao' && missoes.find((m) => m.id === qr.refId)?.status === 'concluida';
  }

  return (
    <Sheet aberto onFechar={onFechar} titulo="Escanear QR" cor="var(--color-missao)">
      <p className="dica">
        <Icone nome="scan" tamanho={16} /> Simulação de leitura. Escolha um QR do território para abrir.
      </p>
      <ul className="lista-qr">
        {QRS_MOCK.map((qr) => (
          <li key={qr.codigo}>
            <button type="button" className="qr-item" onClick={() => onSelecionar(qr)}>
              <span className={`qr-item__icone qr-item__icone--${qr.alvo}`}>
                <Icone nome={qr.alvo === 'missao' ? 'trophy' : 'map-pin'} tamanho={20} />
              </span>
              <span className="qr-item__texto">
                <span className="qr-item__rotulo">{qr.rotulo}</span>
                <span className="qr-item__codigo">{qr.codigo}</span>
              </span>
              {concluida(qr) ? (
                <span className="qr-item__tag"><Icone nome="check" tamanho={14} /> feita</span>
              ) : (
                <Icone nome="chevron-right" tamanho={18} />
              )}
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
