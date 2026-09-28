import type { Trilha, Missao, Totem, Memoria, Insignia } from '../types';

// Conteúdo semente do acervo. Baseado no território do mapa (Rio Sarapuí /
// Serra do Vulcão). O estado inicial já traz coisas conquistadas (para o acervo
// não nascer vazio) e coisas por fazer (para a demo dos fluxos).

// Uma única personagem guia todos os pontos no protótipo: Tainá, Guardiã do
// Território (ver docs/NPC_TAINA.md). O nome vem do roteiro, como no mapa.
const NPC_NOME = 'Tainá';

export const TRILHAS: Trilha[] = [
  { id: 'serra-do-vulcao', nome: 'Trilha da Serra do Vulcão', local: 'Duque de Caxias · RJ' },
  { id: 'nascente-sarapui', nome: 'Caminho das Nascentes', local: 'Rio Sarapuí · RJ' }
];

export const MISSOES_INICIAIS: Missao[] = [
  {
    id: 'nascente',
    titulo: 'Recuperação da nascente Sarapuí',
    descricao: 'Registre o estado da nascente e ajude a monitorar a recuperação da mata ciliar.',
    trilhaId: 'nascente-sarapui',
    categoria: 'recursos-hidricos',
    status: 'disponivel',
    instrucao: 'Limpe as margens da nascente e registre o antes e o depois com fotos.',
    oQueColetar: [
      { id: 'i1', tipo: 'foto', rotulo: 'Foto do "antes"', obrigatorio: true },
      { id: 'i2', tipo: 'foto', rotulo: 'Foto do "depois"', obrigatorio: true },
      { id: 'i3', tipo: 'texto', rotulo: 'Observação sobre a água', obrigatorio: false }
    ],
    recompensa: 'Insígnia Guardião das Águas',
    xp: 150,
    npc: {
      nome: NPC_NOME,
      falas: [
        { id: 'intro', texto: 'Oi! Eu sou a Tainá, guardiã do território. Que bom te ver aqui na nascente do Sarapuí!' },
        { id: 'missao', texto: 'É daqui que nasce o rio que corta a nossa cidade. A missão de hoje é limpar as margens dela.' },
        { id: 'dica', texto: 'Tira uma foto do antes e outra do depois. É assim que a gente mostra a nascente se recuperando.' },
        { id: 'ok', texto: 'Isso! A nascente respira melhor graças a você. Suas fotos já estão no mapa.' }
      ]
    },
    cenario: 'rio',
    concluidaEm: null
  },
  {
    id: 'horta',
    titulo: 'Horta Comunitária Urbana',
    descricao: 'Prepare os canteiros da horta do bairro e registre o plantio da estação.',
    trilhaId: 'nascente-sarapui',
    categoria: 'agricultura-urbana',
    status: 'disponivel',
    instrucao: 'Prepare os canteiros e plante as mudas da estação no espaço comunitário.',
    oQueColetar: [
      { id: 'i1', tipo: 'foto', rotulo: 'Foto dos canteiros prontos', obrigatorio: true },
      { id: 'i2', tipo: 'gps', rotulo: 'Check-in na horta', obrigatorio: true }
    ],
    recompensa: 'Insígnia Mão na Terra',
    xp: 120,
    npc: {
      nome: NPC_NOME,
      falas: [
        { id: 'intro', texto: 'Chegou na horta do bairro! Aqui a comida nasce pertinho de casa.' },
        { id: 'missao', texto: 'Prepara os canteiros e planta as mudas da estação. Pode sujar a mão, viu?' },
        { id: 'dica', texto: 'Não esquece de fazer o check-in aqui na horta e de fotografar os canteiros prontos.' },
        { id: 'ok', texto: 'Mão na terra, missão cumprida! Daqui a pouco tem colheita pra vizinhança toda.' }
      ]
    },
    cenario: 'horta',
    concluidaEm: null
  },
  {
    id: 'reflorestamento',
    titulo: 'Reflorestamento de Encosta',
    descricao: 'Plante mudas nativas na encosta da Serra do Vulcão para conter a erosão.',
    trilhaId: 'serra-do-vulcao',
    categoria: 'meio-ambiente',
    status: 'disponivel',
    instrucao: 'Plante mudas nativas na encosta para conter a erosão do solo.',
    oQueColetar: [
      { id: 'i1', tipo: 'foto', rotulo: 'Foto das mudas plantadas', obrigatorio: true },
      { id: 'i2', tipo: 'formulario', rotulo: 'Quantas mudas você plantou?', obrigatorio: true }
    ],
    recompensa: 'Insígnia Semente do Futuro',
    xp: 180,
    npc: {
      nome: NPC_NOME,
      falas: [
        { id: 'intro', texto: 'Ufa, você subiu a encosta da Serra do Vulcão! Olha só essa vista.' },
        { id: 'missao', texto: 'Quando chove forte, a terra desce o morro. As raízes das mudas nativas seguram o solo.' },
        { id: 'dica', texto: 'Planta as mudas, tira uma foto e me conta quantas você plantou.' },
        { id: 'ok', texto: 'Cada muda é uma semente de futuro. A serra agradece!' }
      ]
    },
    cenario: 'serra',
    concluidaEm: null
  }
];

export const TOTENS_INICIAIS: Totem[] = [
  {
    id: 'portao-trilha',
    nome: 'Portão da Serra do Vulcão',
    trilhaId: 'serra-do-vulcao',
    papel: 'inicio',
    descricao:
      'A Serra do Vulcão não é um vulcão de verdade: o nome vem do formato cônico do morro. Daqui parte a trilha que liga as nascentes ao alto da encosta.',
    roteiroNpc: {
      nome: NPC_NOME,
      falas: [
        { id: 'intro', texto: 'Boas-vindas à Serra do Vulcão! Eu vou te acompanhar nessa trilha.' },
        { id: 'historia', texto: 'E não é vulcão de verdade não, tá? O nome vem do formato do morro.' },
        { id: 'convite', texto: 'Cada totem do caminho guarda uma história. Deixa a sua também numa memória!' }
      ]
    },
    cenario: 'serra'
  },
  {
    id: 'mirante-agua',
    nome: 'Mirante das Águas',
    trilhaId: 'nascente-sarapui',
    papel: 'intermediario',
    descricao:
      'Deste ponto dá para ver toda a bacia do Rio Sarapuí. Em dias de chuva forte, os moradores acompanham daqui o nível da água.',
    roteiroNpc: {
      nome: NPC_NOME,
      falas: [
        { id: 'intro', texto: 'Olha só: do Mirante das Águas dá pra ver a bacia inteira do Sarapuí.' },
        { id: 'historia', texto: 'Em dia de chuva forte, o pessoal vem aqui acompanhar o nível do rio.' },
        { id: 'convite', texto: 'Registra o que você está vendo agora numa memória. Vai ficar no mapa!' }
      ]
    },
    cenario: 'rio'
  }
];

// O acervo já nasce com uma memória (para a seção não ficar vazia na abertura).
export const MEMORIAS_INICIAIS: Memoria[] = [
  {
    id: 'mem-seed-1',
    titulo: 'Amanhecer no Mirante das Águas',
    autor: 'Amanda Waller',
    data: '2026-08-30',
    foto: null,
    descricao: 'Primeira vez que subi até o mirante. A bacia inteira aparece daqui.',
    missaoId: null,
    totemId: 'mirante-agua',
    comentarios: [{ autor: 'João', texto: 'Que vista! Preciso ir também.', data: '2026-08-31' }]
  },
  {
    // Memória ligada a uma missão ainda aberta: mostra "Memórias desta missão" preenchida na demo.
    id: 'mem-seed-2',
    titulo: 'Primeiras mudas no canteiro',
    autor: 'Amanda Waller',
    data: '2026-09-12',
    foto: null,
    descricao: 'Passei na horta para conhecer o espaço. Já tem couve e cebolinha brotando no canteiro da entrada.',
    missaoId: 'horta',
    totemId: null,
    comentarios: [{ autor: 'Dona Lurdes', texto: 'Aparece no sábado que a gente planta o resto!', data: '2026-09-13' }]
  }
];

// Insígnias: uma já conquistada (histórico) + as que vêm das missões abertas.
export const INSIGNIAS_INICIAIS: Insignia[] = [
  { id: 'ins-agua-limpa', nome: 'Insígnia Olho D\'Água', conquistada: true, missaoId: null },
  { id: 'ins-nascente', nome: 'Insígnia Guardião das Águas', conquistada: false, missaoId: 'nascente' },
  { id: 'ins-horta', nome: 'Insígnia Mão na Terra', conquistada: false, missaoId: 'horta' },
  { id: 'ins-reflor', nome: 'Insígnia Semente do Futuro', conquistada: false, missaoId: 'reflorestamento' }
];
