import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser';
import Sheet from '../../ui/Sheet';
import Icone from '../../ui/Icone';
import { useRota } from '../../ui/rota';
import { useAviso } from '../../ui/aviso';

interface Props {
  onFechar: () => void;
}

// Escanear QR pela câmera do aparelho (getUserMedia + @zxing/browser). Ao ler um
// QR do Território (URL /m/{mapa}/missao|t/{id}), extrai o caminho e navega — é o
// mesmo deep link da câmera nativa (ui/fluxo abre a cena do NPC + o sheet).
// Fallback: câmera negada/indisponível → orienta apontar a câmera nativa do QR.
export default function ScanSheet({ onFechar }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lidoRef = useRef(false);
  const { navegar } = useRota();
  const avisar = useAviso();
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const reader = new BrowserQRCodeReader();
    let ativo = true;

    reader
      .decodeFromConstraints({ video: { facingMode: 'environment' } }, videoRef.current!, (resultado, _erro, controls) => {
        if (!resultado || lidoRef.current) return;
        lidoRef.current = true;
        controls.stop();
        rotear(resultado.getText());
      })
      .then((controls) => {
        controlsRef.current = controls;
        if (!ativo) controls.stop();
      })
      .catch(() => {
        setErro('Não foi possível abrir a câmera. Permita o acesso à câmera ou aponte a câmera do seu celular diretamente para o QR.');
      });

    return () => {
      ativo = false;
      controlsRef.current?.stop();
    };
    // Só na montagem: inicia a câmera uma vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function rotear(texto: string) {
    let caminho: string | null = null;
    try {
      caminho = new URL(texto).pathname; // QR do Território traz a URL completa
    } catch {
      if (texto.startsWith('/m/')) caminho = texto;
      else if (texto.startsWith('m/')) caminho = '/' + texto;
    }
    onFechar();
    if (caminho && caminho.startsWith('/m/')) navegar(caminho);
    else avisar('Este QR não é de uma missão ou totem do Território.');
  }

  return (
    <Sheet aberto onFechar={onFechar} titulo="Escanear QR" cor="var(--color-missao)">
      {erro ? (
        <div className="scanner-erro">
          <Icone nome="qr-code" tamanho={32} />
          <p>{erro}</p>
        </div>
      ) : (
        <div className="scanner">
          <div className="scanner__palco">
            <video ref={videoRef} className="scanner__video" muted playsInline />
            <div className="scanner__mira" aria-hidden="true" />
          </div>
          <p className="scanner__dica">Aponte a câmera para o QR da missão ou totem.</p>
        </div>
      )}
    </Sheet>
  );
}
