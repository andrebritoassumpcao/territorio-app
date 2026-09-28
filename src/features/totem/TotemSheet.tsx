import Sheet from '../../ui/Sheet';
import Icone from '../../ui/Icone';
import { useAcervo } from '../../store/useAcervo';
import { PAPEL_ROTULO } from '../jornada/rotulos';
import OuvirNpc from '../npc/OuvirNpc';

interface Props {
  totemId: string;
  onFechar: () => void;
  onDeixarMemoria: (totemId: string) => void;
  onOuvirNpc: () => void;
}

// Totem informacional: mostra a curiosidade do ponto e o NPC (se houver), e
// oferece deixar uma memória com comentário.
export default function TotemSheet({ totemId, onFechar, onDeixarMemoria, onOuvirNpc }: Props) {
  const { totens, memorias } = useAcervo();
  const totem = totens.find((t) => t.id === totemId);
  if (!totem) return null;

  const memoriasDoTotem = memorias.filter((m) => m.totemId === totemId);

  return (
    <Sheet aberto onFechar={onFechar} titulo={totem.nome} cor="var(--color-totem)">
      <span className="chip chip--totem">
        <Icone nome="map-pin" tamanho={14} /> {PAPEL_ROTULO[totem.papel]}
      </span>

      {totem.roteiroNpc && <OuvirNpc npc={totem.roteiroNpc} alvo="totem" onOuvir={onOuvirNpc} />}

      <section className="bloco">
        <h3 className="bloco__titulo">Sobre este ponto</h3>
        <p className="bloco__texto">{totem.descricao}</p>
      </section>

      {memoriasDoTotem.length > 0 && (
        <section className="bloco">
          <h3 className="bloco__titulo">Memórias deixadas aqui</h3>
          <ul className="mini-memorias">
            {memoriasDoTotem.map((m) => (
              <li key={m.id} className="mini-memoria">
                <Icone nome="message" tamanho={16} />
                <span><strong>{m.titulo}</strong> — {m.descricao || 'sem comentário'}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <button type="button" className="botao-primario botao-primario--totem" onClick={() => onDeixarMemoria(totemId)}>
        <Icone nome="camera" tamanho={18} /> Deixar uma memória
      </button>
    </Sheet>
  );
}
