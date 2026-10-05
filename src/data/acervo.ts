import type { Trilha, Missao, Totem, Memoria, Insignia } from '../types';

// Acervo inicial do participante. SEM dados mockados: missões chegam do mapa por
// QR (handoff via Supabase); memórias são criadas pelo próprio usuário (e sobem
// ao Supabase). Totens ainda não têm fonte de dados no app. O app começa vazio,
// com a jornada se construindo a partir do primeiro QR escaneado.

export const TRILHAS: Trilha[] = [];
export const MISSOES_INICIAIS: Missao[] = [];
export const TOTENS_INICIAIS: Totem[] = [];
export const MEMORIAS_INICIAIS: Memoria[] = [];

// Insígnias de conquista (gamificação do uso do app). São fixas e desbloqueadas
// por gatilho no store (ver useAcervo): "Primeiro passo" já nasce conquistada
// (o usuário acabou de entrar); as demais acendem ao longo da jornada.
export const INSIGNIAS_INICIAIS: Insignia[] = [
  { id: 'primeiro-acesso', nome: 'Primeiro passo', descricao: 'Você entrou no Território.', icone: 'sparkles', conquistada: true },
  { id: 'primeira-missao', nome: 'Primeira missão', descricao: 'Conclua sua primeira missão.', icone: 'trophy', conquistada: false },
  { id: 'primeira-memoria', nome: 'Primeira memória', descricao: 'Deixe sua primeira memória.', icone: 'camera', conquistada: false },
  { id: 'guardiao-territorio', nome: 'Guardião do Território', descricao: 'Conclua 3 missões.', icone: 'shield', conquistada: false }
];
