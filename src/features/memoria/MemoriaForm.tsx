import { useRef, useState } from 'react';
import Sheet from '../../ui/Sheet';
import Icone from '../../ui/Icone';
import { useAcervo } from '../../store/useAcervo';
import type { VinculoMemoria } from '../../types';

interface Props {
  vinculo: VinculoMemoria;
  onFechar: () => void;
  onSalva: () => void;
}

// Deixar uma memória (foto opcional + comentário) ligada a uma missão ou a um
// totem (RN-MEM-004). Como no mapa, o vínculo vem de onde o fluxo partiu e fica
// travado. Mockado: a foto vira um dataURL local só para pré-visualização.
export default function MemoriaForm({ vinculo, onFechar, onSalva }: Props) {
  const { missoes, totens, adicionarMemoria } = useAcervo();
  const missao = vinculo.tipo === 'missao' ? missoes.find((m) => m.id === vinculo.id) : undefined;
  const totem = vinculo.tipo === 'totem' ? totens.find((t) => t.id === vinculo.id) : undefined;
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const inputFoto = useRef<HTMLInputElement>(null);

  function escolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => setFoto(typeof leitor.result === 'string' ? leitor.result : null);
    leitor.readAsDataURL(arquivo);
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    adicionarMemoria({
      missaoId: vinculo.tipo === 'missao' ? vinculo.id : null,
      totemId: vinculo.tipo === 'totem' ? vinculo.id : null,
      titulo,
      descricao,
      foto
    });
    onSalva();
  }

  return (
    <Sheet aberto onFechar={onFechar} titulo="Deixar memória" cor="var(--color-memoria)">
      {missao && (
        <span className="chip chip--missao">
          <Icone nome="trophy" tamanho={13} /> Na missão {missao.titulo}
        </span>
      )}
      {totem && (
        <span className="chip chip--totem">
          <Icone nome="map-pin" tamanho={13} /> No ponto {totem.nome}
        </span>
      )}

      <form className="form" onSubmit={salvar}>
        <button
          type="button"
          className="foto-drop"
          onClick={() => inputFoto.current?.click()}
          style={foto ? { backgroundImage: `url(${foto})` } : undefined}
        >
          {!foto && (
            <span className="foto-drop__vazio">
              <Icone nome="camera" tamanho={24} />
              <span>Adicionar foto (opcional)</span>
            </span>
          )}
        </button>
        <input ref={inputFoto} type="file" accept="image/*" hidden onChange={escolherFoto} />

        <label className="campo">
          <span className="campo__label">Título</span>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Vista do mirante"
            maxLength={80}
          />
        </label>

        <label className="campo">
          <span className="campo__label">Comentário</span>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder={missao ? 'Conte como foi este momento da missão…' : 'Escreva o que você quer registrar deste lugar…'}
            rows={3}
            maxLength={280}
          />
        </label>

        <button type="submit" className="botao-primario botao-primario--memoria" disabled={!titulo.trim() && !descricao.trim()}>
          Salvar na jornada
        </button>
      </form>
    </Sheet>
  );
}
