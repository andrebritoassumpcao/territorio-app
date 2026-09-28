import type { CategoriaMissao, PapelTotem } from '../../types';
import type { NomeIcone } from '../../ui/Icone';

export const CATEGORIA_ROTULO: Record<CategoriaMissao, string> = {
  'recursos-hidricos': 'Proteção de nascentes e rios',
  'meio-ambiente': 'Meio ambiente & reflorestamento',
  'prevencao-riscos': 'Prevenção de alagamentos e riscos',
  'agricultura-urbana': 'Agricultura urbana e hortas'
};

export const CATEGORIA_ICONE: Record<CategoriaMissao, NomeIcone> = {
  'recursos-hidricos': 'droplet',
  'meio-ambiente': 'sprout',
  'prevencao-riscos': 'shield',
  'agricultura-urbana': 'sprout'
};

export const PAPEL_ROTULO: Record<PapelTotem, string> = {
  inicio: 'Início da trilha',
  intermediario: 'Ponto do caminho',
  fim: 'Fim da trilha'
};
