import { useCallback, useState, type ReactNode } from 'react';
import { useAcervo } from '../../store/useAcervo';
import Icone from '../Icone';
import { useAviso } from '../aviso';
import PerfilMenu from './PerfilMenu';
import Sidebar from './Sidebar';

// Moldura do sistema Território em versão mobile: top bar do mapa (toggle da
// sidebar, busca, notificações, perfil) + sidebar em drawer + menu de perfil.
// Busca e notificações ficam "Em breve", como no mapa.
export default function Shell({ children }: { children: ReactNode }) {
  const { perfil } = useAcervo();
  const avisar = useAviso();
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const fecharSidebar = useCallback(() => setSidebarAberta(false), []);
  const fecharMenu = useCallback(() => setMenuAberto(false), []);

  return (
    <div className="app">
      <header className="top-bar">
        <button
          type="button"
          className="btn-icon"
          onClick={() => setSidebarAberta(true)}
          title="Abrir menu"
          aria-label="Abrir menu"
          aria-expanded={sidebarAberta}
        >
          <Icone nome="panel-left" tamanho={20} />
        </button>

        <div className="search-container">
          <Icone nome="search" tamanho={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar…"
            readOnly
            aria-label="Buscar (em breve)"
            onFocus={(e) => {
              e.currentTarget.blur();
              avisar('Busca: em breve nesta visualização.');
            }}
          />
          <span className="soon-pill" aria-hidden="true">Em breve</span>
        </div>

        <div className="top-bar-end">
          <button
            type="button"
            className="btn-icon notification-btn is-soon"
            aria-disabled="true"
            aria-label="Notificações (em breve)"
            onClick={() => avisar('Notificações: em breve nesta visualização.')}
          >
            <Icone nome="bell" tamanho={20} />
            <span className="notification-badge" />
          </button>

          <div className="profile-cluster">
            <button
              type="button"
              className="user-profile"
              title="Perfil"
              aria-label="Perfil"
              aria-expanded={menuAberto}
              aria-controls="profile-menu"
              onClick={() => setMenuAberto((v) => !v)}
            >
              <img className="avatar-photo" src={perfil.avatar} alt="" width={36} height={36} />
            </button>
            {menuAberto && <PerfilMenu onFechar={fecharMenu} />}
          </div>
        </div>
      </header>

      <Sidebar aberta={sidebarAberta} onFechar={fecharSidebar} />

      <main className="app__scroll">{children}</main>
    </div>
  );
}
