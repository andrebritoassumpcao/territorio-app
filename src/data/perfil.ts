import type { Perfil } from '../types';

// Mesmo usuário do mapa (Território) — ver Territorio-map/poc/client/index.html.
export const PERFIL_INICIAL: Perfil = {
  nome: 'Amanda Waller',
  local: 'Bacia do Rio Sarapuí',
  nivel: 12,
  xp: 2450,
  xpProximoNivel: 3000,
  avatar: '/icons/profile/amanda-waller.png'
};

// Bloco "Minha jornada" do menu de perfil do mapa (Territorio-map/poc/client/index.html).
// Valores estáticos, iguais aos do mapa: não reagem à demo (o que reage é XP/nível,
// missões e insígnias, no store).
export interface StatJornada {
  id: string;
  rotulo: string;
  valor: string;
  icone: string;
}

export const STATS_JORNADA: StatJornada[] = [
  { id: 'saberes', rotulo: 'Saberes', valor: '12 conquistados', icone: '/icons/profile/saberes.svg' },
  { id: 'certificados', rotulo: 'Certificados', valor: '3 completos', icone: '/icons/profile/certificados.svg' },
  { id: 'horas', rotulo: 'Horas de aprendizado', valor: '48 horas', icone: '/icons/profile/horas.svg' },
  { id: 'manuais', rotulo: 'Manuais', valor: '48 completos', icone: '/icons/profile/manuais.svg' }
];
