import { useEffect } from 'react';
import { useAcervo } from '../../store/useAcervo';
import Icone from '../Icone';
import Avatar from '../Avatar';
import { useAviso } from '../aviso';
import { useT } from '../../i18n/I18nProvider';
import { CAMINHO_JORNADA, useRota } from '../rota';

interface Props {
  onFechar: () => void;
}

// Menu de perfil — mesma estrutura do mapa (Territorio-map/poc/client/index.html,
// #profile-menu): identidade + nível/XP, Minha rede, Organizações, Minha jornada, Sair.
// Só "Minha jornada" navega; o resto é "Em breve". Os dois itens de demonstração
// (QRs e reiniciar) existem só no protótipo.
export default function PerfilMenu({ onFechar }: Props) {
  const { perfil, resetar } = useAcervo();
  const { navegar } = useRota();
  const avisar = useAviso();
  const { t } = useT();
  const pct = Math.min(100, Math.round((perfil.xp / perfil.xpProximoNivel) * 100));

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && onFechar();
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  }, [onFechar]);

  function emBreve() {
    avisar(t('shell.comingSoonToast'));
  }

  function ir(caminho: string) {
    onFechar();
    navegar(caminho);
  }

  return (
    <>
      <div className="profile-menu-scrim" onClick={onFechar} aria-hidden="true" />
      <div className="profile-menu" id="profile-menu" role="menu" aria-label={t('shell.profile')}>
        <div className="profile-menu-identity">
          <Avatar className="avatar-photo avatar-photo-lg" nome={perfil.nome} avatar={perfil.avatar} tamanho={48} />
          <div className="profile-menu-identity-copy">
            <p className="user-name">{perfil.nome}</p>
            <div className="profile-level-row">
              <span className="level-badge">{perfil.nivel}</span>
              <span>{t('profile.level')}</span>
              <span className="level-xp">{perfil.xp}/{perfil.xpProximoNivel} XP</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        <button type="button" className="profile-menu-link" role="menuitem" onClick={emBreve}>
          <span className="profile-icon-tile">
            <img src="/icons/profile/network.svg" alt="" width={20} height={20} />
          </span>
          <span>{t('profile.network')}</span>
          <Icone nome="chevron-right" tamanho={14} className="profile-menu-chevron" />
        </button>

        <div className="profile-menu-block">
          <h3 className="profile-menu-heading">{t('profile.orgs')}</h3>
          <div className="profile-empty">
            <span className="profile-icon-tile profile-icon-tile-lg">
              <img src="/icons/profile/organization.svg" alt="" width={22} height={22} />
            </span>
            <p className="profile-empty-title">{t('profile.noOrg')}</p>
            <p className="profile-empty-text">{t('profile.noOrgText')}</p>
            <button type="button" className="card-btn card-btn-primary profile-empty-btn" onClick={emBreve}>
              <Icone nome="plus" tamanho={14} /> {t('profile.createOrg')}
            </button>
          </div>
        </div>

        <div className="profile-menu-block">
          <h3 className="profile-menu-heading">{t('profile.myJourney')}</h3>
          <button type="button" className="profile-menu-link profile-menu-link--destaque" role="menuitem" onClick={() => ir(CAMINHO_JORNADA)}>
            <span className="profile-icon-tile"><Icone nome="trophy" tamanho={20} /></span>
            <span>{t('profile.viewJourney')}</span>
            <Icone nome="chevron-right" tamanho={14} className="profile-menu-chevron" />
          </button>
        </div>

        {/* Só no protótipo: atalhos da apresentação */}
        <div className="profile-menu-block profile-menu-demo">
          <h3 className="profile-menu-heading profile-menu-heading--sm">{t('profile.demo')}</h3>
          <button
            type="button"
            className="profile-menu-link"
            role="menuitem"
            onClick={() => {
              resetar();
              onFechar();
              avisar(t('profile.demoRestarted'));
            }}
          >
            <span className="profile-icon-tile"><Icone nome="rotate-ccw" tamanho={20} /></span>
            <span>{t('profile.restartDemo')}</span>
          </button>
        </div>

        <button type="button" className="profile-menu-link profile-menu-logout" role="menuitem" onClick={emBreve}>
          <span className="profile-icon-tile"><Icone nome="log-out" tamanho={20} /></span>
          <span>{t('profile.signOut')}</span>
        </button>
      </div>
    </>
  );
}
