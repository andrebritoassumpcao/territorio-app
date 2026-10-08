import { useCallback, useState, type ReactNode } from 'react';
import { useAcervo } from '../../store/useAcervo';
import Icone from '../Icone';
import Avatar from '../Avatar';
import SeletorIdioma from '../SeletorIdioma';
import { useAviso } from '../aviso';
import { useT } from '../../i18n/I18nProvider';
import PerfilMenu from './PerfilMenu';
import Sidebar from './Sidebar';

// Moldura do sistema Território em versão mobile: top bar do mapa (toggle da
// sidebar, busca, notificações, perfil) + sidebar em drawer + menu de perfil.
// Busca e notificações ficam "Em breve", como no mapa.
export default function Shell({ children }: { children: ReactNode }) {
  const { perfil } = useAcervo();
  const avisar = useAviso();
  const { t } = useT();
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
          title={t('shell.openMenu')}
          aria-label={t('shell.openMenu')}
          aria-expanded={sidebarAberta}
        >
          <Icone nome="panel-left" tamanho={20} />
        </button>

        <div className="search-container">
          <Icone nome="search" tamanho={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={t('shell.searchPlaceholder')}
            readOnly
            aria-label={t('shell.searchAria')}
            onFocus={(e) => {
              e.currentTarget.blur();
              avisar(t('shell.searchToast'));
            }}
          />
          <span className="soon-pill" aria-hidden="true">{t('common.comingSoon')}</span>
        </div>

        <div className="top-bar-end">
          <SeletorIdioma />
          <button
            type="button"
            className="btn-icon notification-btn is-soon"
            aria-disabled="true"
            aria-label={t('shell.notificationsAria')}
            onClick={() => avisar(t('shell.notificationsToast'))}
          >
            <Icone nome="bell" tamanho={20} />
            <span className="notification-badge" />
          </button>

          <div className="profile-cluster">
            <button
              type="button"
              className="user-profile"
              title={t('shell.profile')}
              aria-label={t('shell.profile')}
              aria-expanded={menuAberto}
              aria-controls="profile-menu"
              onClick={() => setMenuAberto((v) => !v)}
            >
              <Avatar className="avatar-photo" nome={perfil.nome} avatar={perfil.avatar} tamanho={36} />
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
