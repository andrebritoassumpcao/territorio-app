import { useRef, useState } from 'react';
import Sheet from '../../ui/Sheet';
import Icone from '../../ui/Icone';
import { useAcervo } from '../../store/useAcervo';
import { salvarMemoria } from '../../data/memorias';
import type { VinculoMemoria } from '../../types';

interface Props {
  vinculo: VinculoMemoria;
  onFechar: () => void;
  onSalva: () => void;
}

// Deixar uma memória (foto opcional + comentário) ligada a uma missão ou a um
// totem (RN-MEM-004). Como no mapa, o vínculo vem de onde o fluxo partiu e fica
// travado. Fase 1 do upload real: a foto é comprimida e sobe para o Supabase
// Storage (bucket público `memorias`), e a memória grava na tabela `memorias`
// para aparecer no mapa. Em paralelo, guardamos uma cópia local (otimista) em
// `localStorage`, para a jornada do participante funcionar na hora e offline.
export default function MemoriaForm({ vinculo, onFechar, onSalva }: Props) {
  const { missoes, totens, perfil, adicionarMemoria } = useAcervo();
  const missao = vinculo.tipo === 'missao' ? missoes.find((m) => m.id === vinculo.id) : undefined;
  const totem = vinculo.tipo === 'totem' ? totens.find((t) => t.id === vinculo.id) : undefined;
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [consentido, setConsentido] = useState(false);
  const [enviando, setEnviando] = useState(false);
  // Dois caminhos no celular: "Tirar foto" abre a câmera na hora (capture);
  // "Galeria" escolhe uma imagem existente. No desktop, ambos abrem o seletor.
  const inputCamera = useRef<HTMLInputElement>(null);
  const inputGaleria = useRef<HTMLInputElement>(null);

  function escolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const selecionado = e.target.files?.[0];
    if (!selecionado) return;
    setArquivo(selecionado);
    const leitor = new FileReader();
    leitor.onload = () => setFoto(typeof leitor.result === 'string' ? leitor.result : null);
    leitor.readAsDataURL(selecionado);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);

    const missaoId = vinculo.tipo === 'missao' ? vinculo.id : null;
    const totemId = vinculo.tipo === 'totem' ? vinculo.id : null;

    // Upload real (best-effort): comprime a foto, sobe ao Storage e grava a linha.
    const resultado = await salvarMemoria({
      missaoId,
      totemId,
      titulo,
      descricao,
      autor: perfil.nome,
      arquivo,
      consentido
    });
    if (!resultado.ok && resultado.message) {
      // Sem Supabase ou falha de rede: segue só com a cópia local (dataURL).
      console.warn('[memoria] upload não concluído:', resultado.message);
    }

    // Cópia local otimista: usa a URL pública quando houve upload; senão, o dataURL.
    adicionarMemoria({
      missaoId,
      totemId,
      titulo,
      descricao,
      foto: resultado.fotoUrl ?? foto
    });

    setEnviando(false);
    onSalva();
  }

  const podeSalvar = (titulo.trim() !== '' || descricao.trim() !== '') && consentido && !enviando;

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
        <div className="foto-drop" style={foto ? { backgroundImage: `url(${foto})` } : undefined}>
          {!foto && (
            <span className="foto-drop__vazio">
              <Icone nome="camera" tamanho={24} />
              <span>Foto (opcional)</span>
            </span>
          )}
        </div>
        <div className="foto-acoes">
          <button type="button" className="foto-acao" onClick={() => inputCamera.current?.click()}>
            <Icone nome="camera" tamanho={16} /> {foto ? 'Refazer foto' : 'Tirar foto'}
          </button>
          <button type="button" className="foto-acao" onClick={() => inputGaleria.current?.click()}>
            <Icone nome="image" tamanho={16} /> Galeria
          </button>
        </div>
        <input ref={inputCamera} type="file" accept="image/*" capture="environment" hidden onChange={escolherFoto} />
        <input ref={inputGaleria} type="file" accept="image/*" hidden onChange={escolherFoto} />

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

        <label className="campo-consentimento">
          <input
            type="checkbox"
            checked={consentido}
            onChange={(e) => setConsentido(e.target.checked)}
          />
          <span>Autorizo exibir esta memória publicamente no mapa do Território.</span>
        </label>

        <button type="submit" className="botao-primario botao-primario--memoria" disabled={!podeSalvar}>
          {enviando ? 'Salvando…' : 'Salvar na jornada'}
        </button>
      </form>
    </Sheet>
  );
}
