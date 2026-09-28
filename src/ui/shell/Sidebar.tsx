import { useEffect, useRef } from 'react';
import Icone, { type NomeIcone } from '../Icone';
import { useAviso } from '../aviso';

interface Props {
  aberta: boolean;
  onFechar: () => void;
}

// Mesmos itens da sidebar do mapa (Territorio-map/poc/client/index.html, #sidebar).
// No mobile vira drawer. Nesta visualização nenhum deles navega ainda: "Em breve".
const ITENS: { rotulo: string; icone: NomeIcone }[] = [
  { rotulo: 'Home', icone: 'home' },
  { rotulo: 'Mapa', icone: 'map' },
  { rotulo: 'Manual', icone: 'book' },
  { rotulo: 'Mutirões', icone: 'users' },
  { rotulo: 'Comunidades', icone: 'grid' },
  { rotulo: 'Blog', icone: 'pencil' }
];

export default function Sidebar({ aberta, onFechar }: Props) {
  const avisar = useAviso();
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
          {ITENS.map((item) => (
            <li key={item.rotulo} className="nav-item">
              <button
                type="button"
                onClick={() => {
                  onFechar();
                  avisar(`${item.rotulo}: em breve nesta visualização.`);
                }}
              >
                <Icone nome={item.icone} tamanho={20} className="nav-icon" />
                <span>{item.rotulo}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
