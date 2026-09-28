import type { Npc } from '../../types';
import Icone from '../../ui/Icone';
import Taina from './Taina';

// Atalho no topo dos sheets de missão/totem para rever a cena do NPC.
export default function OuvirNpc({ npc, alvo, onOuvir }: { npc: Npc; alvo: 'missao' | 'totem'; onOuvir: () => void }) {
  return (
    <button type="button" className={`ouvir-npc ouvir-npc--${alvo}`} onClick={onOuvir}>
      <span className="ouvir-npc__avatar" aria-hidden="true">
        <Taina expressao="explicando" enquadramento="rosto" />
      </span>
      <span className="ouvir-npc__texto">
        <span className="ouvir-npc__nome">{npc.nome}</span>
        <span className="ouvir-npc__acao">Ouvir de novo</span>
      </span>
      <Icone nome="message" tamanho={18} />
    </button>
  );
}
