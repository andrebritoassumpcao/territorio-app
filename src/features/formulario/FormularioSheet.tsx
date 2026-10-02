import { useEffect, useRef, useState } from 'react';
import type { Insumo, RespostaItem } from '../../types';
import Icone from '../../ui/Icone';

interface Props {
  insumo: Insumo;
  /** Concluiu: entrega as respostas (uma por pergunta; valor null = pulada). */
  onConcluir: (itens: RespostaItem[]) => void;
  /** Fechou sem concluir (não marca a tarefa). */
  onFechar: () => void;
}

const LETRAS = ['a', 'b', 'c', 'd'];

// Responde o formulário de uma missão em steps: 1 pergunta por tela, "passa pra
// direita". Múltipla = a/b/c/d; aberta = texto. Obrigatória trava o avanço; opcional
// pode pular. Enquete (sem resposta certa). Ver features/missao + ui/fluxo.
export default function FormularioSheet({ insumo, onConcluir, onFechar }: Props) {
  const perguntas = insumo.perguntas ?? [];
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number | string>>({});
  const raiz = useRef<HTMLDivElement>(null);

  const pergunta = perguntas[indice];
  const ultima = indice === perguntas.length - 1;

  useEffect(() => {
    raiz.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar();
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [onFechar]);

  if (!pergunta) {
    // Formulário sem perguntas: conclui direto (tarefa vira "feita").
    onConcluir([]);
    return null;
  }

  const valor = respostas[pergunta.id];
  const respondida = pergunta.tipo === 'multipla' ? typeof valor === 'number' : typeof valor === 'string' && valor.trim().length > 0;
  const podeAvancar = !pergunta.obrigatoria || respondida;

  function setValor(v: number | string) {
    setRespostas((r) => ({ ...r, [pergunta.id]: v }));
  }

  function montarItens(): RespostaItem[] {
    return perguntas.map((p) => {
      const v = respostas[p.id];
      let valor: string | null = null;
      if (p.tipo === 'multipla') {
        if (typeof v === 'number' && p.opcoes?.[v]) valor = `${LETRAS[v]}) ${p.opcoes[v]}`;
      } else if (typeof v === 'string' && v.trim()) {
        valor = v.trim();
      }
      return { perguntaId: p.id, enunciado: p.enunciado, tipo: p.tipo, valor };
    });
  }

  function avancar() {
    if (!podeAvancar) return;
    if (ultima) onConcluir(montarItens());
    else {
      navigator.vibrate?.(10);
      setIndice((i) => i + 1);
    }
  }

  const rotuloAvancar = ultima ? 'Concluir' : pergunta.obrigatoria ? 'Próximo' : respondida ? 'Próximo' : 'Pular';

  return (
    <div className="formulario" role="dialog" aria-modal="true" aria-label={insumo.rotulo || 'Formulário'} tabIndex={-1} ref={raiz}>
      <div className="formulario__palco">
        <header className="formulario__topo">
          <span className="formulario__rotulo">{insumo.rotulo || 'Formulário'}</span>
          <button type="button" className="botao-icone" onClick={onFechar} aria-label="Fechar">
            <Icone nome="x" />
          </button>
        </header>

        <div className="formulario__progresso" aria-label={`Pergunta ${indice + 1} de ${perguntas.length}`}>
          <span className="formulario__progresso-texto">Pergunta {indice + 1} de {perguntas.length}</span>
          <span className="formulario__barra">
            <span className="formulario__barra-fill" style={{ width: `${((indice + 1) / perguntas.length) * 100}%` }} />
          </span>
        </div>

        <div className="formulario__conteudo" key={pergunta.id}>
          <h2 className="formulario__enunciado">
            {pergunta.enunciado}
            {!pergunta.obrigatoria && <span className="formulario__opcional"> (opcional)</span>}
          </h2>

          {pergunta.tipo === 'multipla' ? (
            <ul className="formulario__opcoes">
              {(pergunta.opcoes ?? []).map((opcao, i) =>
                opcao.trim() ? (
                  <li key={i}>
                    <button
                      type="button"
                      className={`formulario__opcao${valor === i ? ' is-sel' : ''}`}
                      onClick={() => setValor(i)}
                    >
                      <span className="formulario__letra">{LETRAS[i]}</span>
                      <span className="formulario__opcao-texto">{opcao}</span>
                      {valor === i && <Icone nome="check" tamanho={18} />}
                    </button>
                  </li>
                ) : null
              )}
            </ul>
          ) : (
            <textarea
              className="formulario__texto"
              placeholder="Escreva sua resposta…"
              value={typeof valor === 'string' ? valor : ''}
              onChange={(e) => setValor(e.target.value)}
              rows={5}
              autoFocus
            />
          )}
        </div>

        <div className="formulario__rodape">
          {indice > 0 ? (
            <button type="button" className="botao-secundario" onClick={() => setIndice((i) => i - 1)}>
              <Icone nome="arrow-left" tamanho={16} /> Voltar
            </button>
          ) : (
            <span />
          )}
          <button type="button" className="botao-primario formulario__avancar" disabled={!podeAvancar} onClick={avancar}>
            {rotuloAvancar} <Icone nome="chevron-right" tamanho={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
