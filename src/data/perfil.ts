import type { Perfil } from '../types';

// Perfil inicial: novo usuário (sem mock). Começa no nível 1, sem XP e sem foto;
// o avatar é renderizado por iniciais quando `avatar` está vazio. Nome/nível/XP
// evoluem no store conforme a jornada (missões concluídas, etc.).
export const PERFIL_INICIAL: Perfil = {
  nome: 'Usuário',
  local: 'Território',
  nivel: 1,
  xp: 0,
  xpProximoNivel: 100,
  avatar: ''
};
