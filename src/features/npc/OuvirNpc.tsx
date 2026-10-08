import type { Npc } from '../../types';
import Icone from '../../ui/Icone';
import { useT } from '../../i18n/I18nProvider';

// Atalho no topo dos sheets de missão/totem para rever a cena de fala.
export default function OuvirNpc({ npc, alvo, onOuvir }: { npc: Npc; alvo: 'missao' | 'totem'; onOuvir: () => void }) {
  const { t } = useT();
  return (
    <button type="button" className={`ouvir-npc ouvir-npc--${alvo}`} onClick={onOuvir}>
      <span className="ouvir-npc__avatar" aria-hidden="true">
        <Icone nome="message" tamanho={20} />
      </span>
      <span className="ouvir-npc__texto">
        <span className="ouvir-npc__nome">{npc.nome}</span>
        <span className="ouvir-npc__acao">{t('npc.listenAgain')}</span>
      </span>
      <Icone nome="chevron-right" tamanho={18} />
    </button>
  );
}
