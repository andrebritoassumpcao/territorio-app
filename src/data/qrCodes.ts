import type { QrMock } from '../types';

// QRs mockados que o "scanner" pode ler (scan simulado). Cada missão tem seu
// próprio QR; totens têm QR informacional. Os códigos seguem o padrão de URL
// do mapa (§14.1): m/{mapa}/{missao|t}/{id}.
export const QRS_MOCK: QrMock[] = [
  {
    codigo: 'm/nascente-sarapui/missao/nascente',
    alvo: 'missao',
    refId: 'nascente',
    rotulo: 'QR da missão — Recuperação da nascente Sarapuí'
  },
  {
    codigo: 'm/nascente-sarapui/missao/horta',
    alvo: 'missao',
    refId: 'horta',
    rotulo: 'QR da missão — Horta Comunitária Urbana'
  },
  {
    codigo: 'm/serra-do-vulcao/missao/reflorestamento',
    alvo: 'missao',
    refId: 'reflorestamento',
    rotulo: 'QR da missão — Reflorestamento de Encosta'
  },
  {
    codigo: 'm/serra-do-vulcao/t/portao-trilha',
    alvo: 'totem',
    refId: 'portao-trilha',
    rotulo: 'QR do totem — Portão da Serra do Vulcão'
  },
  {
    codigo: 'm/nascente-sarapui/t/mirante-agua',
    alvo: 'totem',
    refId: 'mirante-agua',
    rotulo: 'QR do totem — Mirante das Águas'
  }
];
