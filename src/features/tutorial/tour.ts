import { driver, type Driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { t } from '../../i18n/idioma';

// Tour guiado de onboarding (spotlight) na página Minha jornada, no primeiro acesso.
// Percorre missões/memórias, abre a 1ª missão e mostra Registrar → Enviar, SEM enviar
// de verdade. Avança por "Próximo". Coordenado com o fluxo via `TourCtrl` (ver fluxo.tsx
// / TutorialTour.tsx). Trigger/flag: useAcervo.tutorialVisto.

export interface TourCtrl {
  /** Id da 1ª missão aberta (ou null se não houver — aí o tour fica só na jornada). */
  missaoId: string | null;
  /** Ids dos insumos obrigatórios da missão demo (auto-registrados para habilitar o Enviar). */
  insumosObrigatorios: string[];
  /** Abre o sheet da missão direto (sem a cena do NPC). */
  abrirSheet: (id: string) => void;
  /** Marca um insumo como registrado (mock) no fluxo. */
  registrar: (missaoId: string, insumoId: string) => void;
}

let ativo: Driver | null = null;

/** Espera um seletor existir (e, opcional, estar habilitado); resolve null no timeout. */
function esperarElemento(sel: string, opts: { enabled?: boolean; timeout?: number } = {}) {
  const { enabled = false, timeout = 2500 } = opts;
  return new Promise<Element | null>((resolve) => {
    const t0 = performance.now();
    const check = () => {
      const el = document.querySelector(sel);
      const ok = el && (!enabled || !(el as HTMLButtonElement).disabled);
      if (ok) return resolve(el);
      if (performance.now() - t0 > timeout) return resolve(null);
      requestAnimationFrame(check);
    };
    check();
  });
}

/** Inicia o tour guiado. `aoFim` roda uma vez ao concluir ou fechar. */
export function iniciarTourGuiado(ctrl: TourCtrl, aoFim: () => void) {
  if (ativo) return;

  // Passos na jornada (só os que existem na tela).
  const base: DriveStep[] = [
    {
      element: '[data-tour="scan"]',
      popover: { title: t('tour.scan.title'), description: t('tour.scan.desc') }
    },
    {
      element: '[data-tour="missao"]',
      popover: { title: t('tour.missions.title'), description: t('tour.missions.desc') }
    },
    {
      element: '[data-tour="insignias"]',
      popover: { title: t('tour.badges.title'), description: t('tour.badges.desc') }
    },
    {
      element: '[data-tour="memorias"]',
      popover: { title: t('tour.memories.title'), description: t('tour.memories.desc') }
    }
  ].filter((s) => document.querySelector(s.element as string));

  // Passos que entram na missão (só se houver uma missão demo).
  const dive: DriveStep[] = ctrl.missaoId
    ? [
        {
          element: '[data-tour="missao"]',
          popover: {
            title: t('tour.openMission.title'),
            description: t('tour.openMission.desc'),
            onNextClick: async () => {
              ctrl.abrirSheet(ctrl.missaoId!);
              await esperarElemento('[data-tour="registrar"]');
              ativo?.moveNext();
            }
          }
        },
        {
          element: '[data-tour="registrar"]',
          popover: {
            title: t('tour.register.title'),
            description: t('tour.register.desc'),
            onNextClick: async () => {
              ctrl.insumosObrigatorios.forEach((insumoId) => ctrl.registrar(ctrl.missaoId!, insumoId));
              await esperarElemento('[data-tour="enviar"]', { enabled: true });
              ativo?.moveNext();
            }
          }
        },
        {
          element: '[data-tour="enviar"]',
          popover: { title: t('tour.send.title'), description: t('tour.send.desc') }
        }
      ]
    : [];

  const steps = [...base, ...dive];
  if (steps.length === 0) {
    aoFim();
    return;
  }

  let fim = false;
  const concluir = () => {
    if (fim) return;
    fim = true;
    aoFim();
  };

  ativo = driver({
    showProgress: true,
    allowClose: true,
    // Impede clicar no elemento destacado (ex.: abrir a cena do card por acidente);
    // o avanço é só pelo "Próximo". O tour abre a missão de forma controlada.
    disableActiveInteraction: true,
    overlayOpacity: 0.6,
    nextBtnText: t('tour.next'),
    prevBtnText: t('tour.back'),
    doneBtnText: t('tour.done'),
    progressText: t('tour.progress'),
    steps,
    onDestroyed: () => {
      ativo = null;
      concluir();
    }
  });

  ativo.drive();
}
