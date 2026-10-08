import { useCallback, useEffect, useRef, useState } from 'react';
import type { Cenario as TipoCenario, FalaNpc } from '../../types';
import Icone from '../../ui/Icone';
import { useT } from '../../i18n/I18nProvider';
import Cenario from './Cenario';

interface Props {
  nome: string;
  /** Falas da cena de abertura, em ordem (sem a `ok`, que é dita na recompensa). */
  falas: FalaNpc[];
  cenario: TipoCenario;
  alvo: 'missao' | 'totem';
  tituloPonto: string;
  /** Rótulo do botão da última fala (ex.: "Começar missão"). */
  cta: string;
  /** CTA ou "Pular": segue para o conteúdo do ponto. */
  onConcluir: () => void;
}

const MS_POR_LETRA = 24;

function reduzirMovimento(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

// Cena do NPC (RN-FIG-047, §14.2): roteiro fixo, uma fala por cartão.
// Toque em qualquer lugar: se o texto ainda está sendo digitado, completa;
// senão, avança. A última fala mostra o CTA. "Pular" vai direto ao conteúdo.
export default function CenaNpc({ nome, falas, cenario, alvo, tituloPonto, cta, onConcluir }: Props) {
  const { t } = useT();
  const [indice, setIndice] = useState(0);
  const [letras, setLetras] = useState(0);
  const raiz = useRef<HTMLDivElement>(null);

  const fala = falas[indice];
  const texto = fala?.texto ?? '';
  const digitando = letras < texto.length;
  const ultima = indice === falas.length - 1;

  // Máquina de escrever: reinicia a cada fala; sem animação se o sistema pede menos movimento.
  useEffect(() => {
    if (reduzirMovimento()) {
      setLetras(texto.length);
      return;
    }
    setLetras(0);
    const timer = window.setInterval(() => {
      setLetras((n) => {
        if (n >= texto.length) {
          window.clearInterval(timer);
          return n;
        }
        return n + 1;
      });
    }, MS_POR_LETRA);
    return () => window.clearInterval(timer);
  }, [texto]);

  const avancar = useCallback(() => {
    if (digitando) {
      setLetras(texto.length);
      return;
    }
    if (!ultima) {
      navigator.vibrate?.(12);
      setLetras(0);
      setIndice((i) => i + 1);
    }
  }, [digitando, texto.length, ultima]);

  useEffect(() => {
    raiz.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') onConcluir();
      else if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        // Enter no botão de CTA é tratado pelo próprio botão.
        if ((e.target as HTMLElement).tagName === 'BUTTON') return;
        e.preventDefault();
        avancar();
      }
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [avancar, onConcluir]);

  if (!fala) return null;

  return (
    <div className="cena" role="dialog" aria-modal="true" aria-label={`Conversa com ${nome}`} tabIndex={-1} ref={raiz}>
      <div className={`cena__palco cena__palco--${alvo}`} onClick={avancar}>
        <Cenario tipo={cenario} className="cena__fundo" />
        <div className="cena__vinheta" aria-hidden="true" />

        <header className="cena__topo">
          <span className={`chip chip--${alvo} cena__chip`}>
            <Icone nome={alvo === 'missao' ? 'trophy' : 'map-pin'} tamanho={13} />
            <span className="cena__chip-texto">{tituloPonto}</span>
          </span>
          <button
            type="button"
            className="cena__pular"
            onClick={(e) => {
              e.stopPropagation();
              onConcluir();
            }}
          >
            {t('common.skip')} <Icone nome="chevron-right" tamanho={16} />
          </button>
        </header>

        <div className="cena__caixa" key={indice}>
          <span className="cena__nome">{nome}</span>

          <p className="cena__texto">
            {/* O texto completo reserva a altura; o digitado fica por cima. */}
            <span className="cena__texto-fantasma" aria-hidden="true">{texto}</span>
            <span className="cena__texto-visivel" aria-hidden="true">
              {texto.slice(0, letras)}
              {digitando && <span className="cena__cursor" />}
            </span>
            <span className="sr-only" aria-live="polite">{texto}</span>
          </p>

          <div className="cena__rodape">
            <span className="cena__pontos" aria-label={`Fala ${indice + 1} de ${falas.length}`}>
              {falas.map((f, i) => (
                <span key={f.id} className={`cena__ponto${i === indice ? ' is-atual' : i < indice ? ' is-lido' : ''}`} />
              ))}
            </span>
            {!(ultima && !digitando) && (
              <span className="cena__continuar">
                {digitando ? t('npc.tapToSeeAll') : t('npc.tapToContinue')}
                <Icone nome="chevron-right" tamanho={16} />
              </span>
            )}
          </div>

          {ultima && !digitando && (
            <button
              type="button"
              className={`botao-primario cena__cta${alvo === 'totem' ? ' botao-primario--totem' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onConcluir();
              }}
              autoFocus
            >
              {cta} <Icone nome="chevron-right" tamanho={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
