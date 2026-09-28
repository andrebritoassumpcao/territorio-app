import { useAcervo } from '../../store/useAcervo';

// Cabeçalho com o perfil do Território (mesmo usuário do mapa) e a barra de XP.
export default function PerfilHeader() {
  const { perfil, insignias, missoes } = useAcervo();
  const pct = Math.min(100, Math.round((perfil.xp / perfil.xpProximoNivel) * 100));
  const conquistadas = insignias.filter((i) => i.conquistada).length;
  const feitas = missoes.filter((m) => m.status === 'concluida').length;

  return (
    <header className="perfil">
      <div className="perfil__topo">
        <img className="perfil__avatar" src={perfil.avatar} alt="" width={56} height={56} />
        <div className="perfil__id">
          <p className="perfil__nome">{perfil.nome}</p>
          <p className="perfil__local">{perfil.local}</p>
        </div>
        <div className="perfil__nivel">
          <span className="perfil__nivel-num">{perfil.nivel}</span>
          <span className="perfil__nivel-rot">Nível</span>
        </div>
      </div>

      <div className="perfil__xp">
        <div className="perfil__xp-barra">
          <div className="perfil__xp-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="perfil__xp-num">{perfil.xp}/{perfil.xpProximoNivel} XP</span>
      </div>

      <div className="perfil__stats">
        <span><strong>{feitas}</strong> missões</span>
        <span><strong>{conquistadas}</strong> insígnias</span>
      </div>
    </header>
  );
}
