import { useEffect, useRef } from 'react';
import Icone, { type NomeIcone } from '../Icone';
import { CAMINHO_JORNADA, useRota } from '../rota';

interface Props {
  aberta: boolean;
  onFechar: () => void;
}

// Sidebar (drawer no mobile). Por enquanto só os itens que funcionam de verdade:
// Home (volta para Minha jornada) e Mapa (autoria + QR). Os demais itens do mapa
// (Manual, Mutirões, Comunidades, Blog) foram removidos até existirem nesta visualização.
const ITENS: { rotulo: string; icone: NomeIcone; href?: string; para?: string }[] = [
  { rotulo: 'Home', icone: 'home', para: CAMINHO_JORNADA },
  { rotulo: 'Mapa', icone: 'map', href: '/mapa.html' }
];

export default function Sidebar({ aberta, onFechar }: Props) {
  const { navegar } = useRota();
  const painel = useRef<HTMLElement>(null);

  // Fechada, a gaveta sai da ordem de foco (inert não está nos tipos do React 18).
  useEffect(() => {
    painel.current?.toggleAttribute('inert', !aberta);
  }, [aberta]);

  useEffect(() => {
    if (!aberta) return;
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && onFechar();
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [aberta, onFechar]);

  return (
    <>
      <div className={`sidebar-scrim${aberta ? ' is-open' : ''}`} onClick={onFechar} aria-hidden="true" />
      <aside className={`sidebar${aberta ? ' is-open' : ''}`} aria-label="Menu principal" aria-hidden={!aberta} ref={painel}>
        <div className="sidebar-header">
          <span className="brand-logo">
            <span className="logo-icon">T</span>
            <img src="/img/logo.png" className="brand-logo-img" alt="Território" />
          </span>
          <button type="button" className="btn-sidebar-toggle" onClick={onFechar} title="Recolher menu" aria-label="Recolher menu">
            <Icone nome="panel-left" tamanho={20} />
          </button>
        </div>
        <ul className="nav-menu">
          {ITENS.map((item) =>
            item.href ? (
              <li key={item.rotulo} className="nav-item">
                <a href={item.href} onClick={onFechar}>
                  <Icone nome={item.icone} tamanho={20} className="nav-icon" />
                  <span>{item.rotulo}</span>
                </a>
              </li>
            ) : (
              <li key={item.rotulo} className="nav-item">
                <button
                  type="button"
                  onClick={() => {
                    onFechar();
                    if (item.para) navegar(item.para);
                  }}
                >
                  <Icone nome={item.icone} tamanho={20} className="nav-icon" />
                  <span>{item.rotulo}</span>
                </button>
              </li>
            )
          )}
        </ul>
      </aside>
    </>
  );
}
