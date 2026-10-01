import { useEffect, useRef } from 'react';
import { useAcervo } from '../../store/useAcervo';
import { useRota } from '../../ui/rota';
import { iniciarTourGuiado, type TourCtrl } from './tour';

interface Props {
  /** True quando nenhum sheet/cena está aberto (fluxo livre para o tour rodar). */
  estadoLivre: boolean;
  /** Abre o sheet da missão direto (sem a cena do NPC). */
  abrirSheet: (id: string) => void;
  /** Marca um insumo como registrado (mock). */
  registrar: (missaoId: string, insumoId: string) => void;
  /** Fim do tour: fecha o sheet, marca visto e abre a missão adiada (se houver). */
  aoFim: () => void;
}

// Dispara o tour guiado (driver.js) na primeira vez que o participante vê a página
// Minha jornada. Vive dentro do FluxoProvider para receber o controlador do fluxo.
// Renderiza null (o tour é imperativo). Reaparece com "Reiniciar demo" (reseta a flag).
export default function TutorialTour({ estadoLivre, abrirSheet, registrar, aoFim }: Props) {
  const { rota } = useRota();
  const { tutorialVisto, missoes } = useAcervo();
  const jaRodou = useRef(false);
  // Valores mais recentes sem virar dependência do efeito (evita cancelar o agendamento).
  const dados = useRef({ missoes, abrirSheet, registrar, aoFim });
  dados.current = { missoes, abrirSheet, registrar, aoFim };

  useEffect(() => {
    if (tutorialVisto || rota.tipo !== 'jornada' || !estadoLivre) return;
    const t = window.setTimeout(() => {
      if (jaRodou.current) return;
      jaRodou.current = true;
      const atual = dados.current;
      const demo = atual.missoes.find((m) => m.status !== 'concluida') ?? null;
      const ctrl: TourCtrl = {
        missaoId: demo?.id ?? null,
        insumosObrigatorios: demo ? demo.oQueColetar.filter((i) => i.obrigatorio).map((i) => i.id) : [],
        abrirSheet: atual.abrirSheet,
        registrar: atual.registrar
      };
      // Chama SEMPRE a versão mais recente de aoFim (lê o alvo adiado atual, não o do
      // momento em que o tour começou — a busca da missão pode resolver depois).
      iniciarTourGuiado(ctrl, () => dados.current.aoFim());
    }, 400);
    return () => window.clearTimeout(t);
  }, [tutorialVisto, rota.tipo, estadoLivre]);

  return null;
}
