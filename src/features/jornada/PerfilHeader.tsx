import { useAcervo } from '../../store/useAcervo';
import Avatar from '../../ui/Avatar';
import { useT } from '../../i18n/I18nProvider';

// Cabeçalho com o perfil do Território e a barra de XP.
export default function PerfilHeader() {
  const { perfil, insignias, missoes } = useAcervo();
  const { t } = useT();
  const pct = Math.min(100, Math.round((perfil.xp / perfil.xpProximoNivel) * 100));
  const conquistadas = insignias.filter((i) => i.conquistada).length;
  const feitas = missoes.filter((m) => m.status === 'concluida').length;

  return (
    <header className="perfil">
      <div className="perfil__topo">
        <Avatar className="perfil__avatar" nome={perfil.nome} avatar={perfil.avatar} tamanho={56} />
        <div className="perfil__id">
          <p className="perfil__nome">{perfil.nome}</p>
          <p className="perfil__local">{perfil.local}</p>
        </div>
        <div className="perfil__nivel">
          <span className="perfil__nivel-num">{perfil.nivel}</span>
          <span className="perfil__nivel-rot">{t('profile.level')}</span>
        </div>
      </div>

      <div className="perfil__xp">
        <div className="perfil__xp-barra">
          <div className="perfil__xp-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="perfil__xp-num">{perfil.xp}/{perfil.xpProximoNivel} XP</span>
      </div>

      <div className="perfil__stats">
        <span><strong>{feitas}</strong> {t('journey.profileMissions')}</span>
        <span><strong>{conquistadas}</strong> {t('journey.profileBadges')}</span>
      </div>
    </header>
  );
}
