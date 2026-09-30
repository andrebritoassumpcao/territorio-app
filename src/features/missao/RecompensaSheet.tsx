import Sheet from '../../ui/Sheet';
import Icone from '../../ui/Icone';
import { useAcervo } from '../../store/useAcervo';

interface Props {
  missaoId: string;
  recompensa: string;
  xp: number;
  onFechar: () => void;
  /** Abre o formulário de memória já ligado a esta missão. */
  onDeixarMemoria: () => void;
}

// Revelação da recompensa após enviar a missão. A insígnia e o XP já foram
// gravados pelo store; aqui é só a celebração — com a fala `ok` do roteiro
// (§14.2) exibida como texto, quando a missão tem NPC (sem figura humana).
export default function RecompensaSheet({ missaoId, recompensa, xp, onFechar, onDeixarMemoria }: Props) {
  const { missoes } = useAcervo();
  const npc = missoes.find((m) => m.id === missaoId)?.npc;
  const falaOk = npc?.falas.find((f) => f.id === 'ok');

  return (
    <Sheet aberto onFechar={onFechar} titulo="Recompensa resgatada" cor="var(--color-game-xp)">
      <div className="recompensa">
        <div className="recompensa__medalha" aria-hidden="true">
          <Icone nome="trophy" tamanho={40} />
        </div>
        <p className="recompensa__parabens">Missão concluída!</p>
        <p className="recompensa__insignia">{recompensa}</p>
        <p className="recompensa__xp"><Icone nome="sparkles" tamanho={16} /> +{xp} XP</p>

        {npc && falaOk ? (
          <div className="recompensa__npc">
            <p className="recompensa__npc-balao">
              <strong>{npc.nome}</strong>
              {falaOk.texto}
            </p>
          </div>
        ) : (
          <p className="recompensa__nota">Guardado na sua jornada no território.</p>
        )}

        <button type="button" className="botao-secundario botao-secundario--memoria recompensa__memoria" onClick={onDeixarMemoria}>
          <Icone nome="camera" tamanho={16} /> Deixar uma memória deste momento
        </button>
        <button type="button" className="botao-primario" onClick={onFechar}>Ver minha jornada</button>
      </div>
    </Sheet>
  );
}
