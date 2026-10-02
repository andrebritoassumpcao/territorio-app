// Modelo do protótipo (mockado). Espelha as formas usadas no mapa
// (Territorio-map/poc/client/src/app.js) e as regras do Figital
// (docs/referencia-mapa/CAMPANHA_FIGITAL.md). Sem backend: só o que a demo precisa.

export type CategoriaMissao =
  | 'recursos-hidricos'
  | 'meio-ambiente'
  | 'prevencao-riscos'
  | 'agricultura-urbana';

export type StatusMissao = 'disponivel' | 'concluida';

/** Tipo de insumo que a missão pede coletar (§15). No protótipo é só ilustrativo. */
export type TipoInsumo = 'foto' | 'video' | 'audio' | 'texto' | 'gps' | 'formulario';

export interface Insumo {
  id: string;
  tipo: TipoInsumo;
  rotulo: string;
  obrigatorio: boolean;
  /** Só quando tipo === 'formulario': as perguntas do formulário (enquete). */
  perguntas?: Pergunta[];
}

/** Uma pergunta do formulário (insumo tipo 'formulario'). Enquete, sem resposta certa. */
export interface Pergunta {
  id: string;
  enunciado: string;
  /** 'multipla' = 4 opções a/b/c/d; 'aberta' = resposta escrita. */
  tipo: 'multipla' | 'aberta';
  /** 4 alternativas quando tipo === 'multipla'. */
  opcoes?: string[];
  obrigatoria: boolean;
}

/** Resposta de uma pergunta, registrada no app (enviada ao Supabase). */
export interface RespostaItem {
  perguntaId: string;
  enunciado: string;
  tipo: 'multipla' | 'aberta';
  /** Texto legível: múltipla = "a) alternativa"; aberta = o texto; null se pulada. */
  valor: string | null;
}

/**
 * Uma fala do roteiro fixo do NPC (RN-FIG-047), no formato do manifesto (§14.2).
 * O `id` segue a convenção do exemplo do mapa — `intro`, `missao`, `ok`.
 * A cena de fala não tem figura humana (decisão do CEO): mostra só o texto.
 * A fala `ok` não entra na cena de abertura: é dita na recompensa.
 */
export interface FalaNpc {
  id: string;
  texto: string;
}

export interface Npc {
  nome: string;
  falas: FalaNpc[];
}

/** Paisagem ilustrada atrás do NPC na cena de diálogo (só apresentação, protótipo). */
export type Cenario = 'rio' | 'serra' | 'horta';

export interface Missao {
  id: string;
  titulo: string;
  descricao: string;
  trilhaId: string | null;
  categoria: CategoriaMissao;
  status: StatusMissao;
  /** "O que deve ser feito". */
  instrucao: string;
  /** "O que coletar". */
  oQueColetar: Insumo[];
  recompensa: string; // ex.: "Insígnia Guardião das Águas"
  xp: number;
  npc: Npc | null;
  cenario: Cenario;
  concluidaEm: string | null;
}

export type PapelTotem = 'inicio' | 'intermediario' | 'fim';

export interface Totem {
  id: string;
  nome: string;
  trilhaId: string | null;
  papel: PapelTotem;
  descricao: string; // curiosidade / informação do ponto
  roteiroNpc: Npc | null;
  cenario: Cenario;
}

export interface Comentario {
  autor: string;
  texto: string;
  data: string;
}

export interface Memoria {
  id: string;
  titulo: string;
  autor: string;
  data: string;
  foto: string | null; // caminho ou dataURL; null usa placeholder
  descricao: string;
  /** Vínculo opcional (RN-MEM-004): memória nasce de uma missão ou de um totem, como no mapa. */
  missaoId: string | null;
  totemId: string | null;
  comentarios: Comentario[];
}

/** De onde a memória está sendo criada (o vínculo fica travado no formulário). */
export type VinculoMemoria = { tipo: 'missao'; id: string } | { tipo: 'totem'; id: string };

export interface Trilha {
  id: string;
  nome: string;
  local: string;
}

export interface Insignia {
  id: string;
  nome: string;
  conquistada: boolean;
  missaoId: string | null;
}

export interface Perfil {
  nome: string;
  local: string;
  nivel: number;
  xp: number;
  xpProximoNivel: number;
  avatar: string;
}

/** Um QR mockado que o "scanner" pode ler. Aponta para uma missão ou um totem. */
export interface QrMock {
  codigo: string; // ex.: m/serra-do-vulcao/missao/nascente
  alvo: 'missao' | 'totem';
  refId: string;
  rotulo: string; // texto amigável na lista de "scan"
}
