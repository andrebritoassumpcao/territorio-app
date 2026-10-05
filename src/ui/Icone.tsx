// Ícones inline com stroke `currentColor` (estilo Lucide, o mesmo do mapa),
// para herdarem a cor dos tokens. Evita emoji como ícone (regra da skill).

export type NomeIcone =
  | 'scan'
  | 'check'
  | 'x'
  | 'chevron-right'
  | 'star'
  | 'map-pin'
  | 'sprout'
  | 'droplet'
  | 'trophy'
  | 'camera'
  | 'image'
  | 'arrow-left'
  | 'sparkles'
  | 'message'
  | 'shield'
  // Shell do sistema (mesmos ícones Lucide da sidebar/top bar do mapa)
  | 'panel-left'
  | 'search'
  | 'bell'
  | 'home'
  | 'map'
  | 'book'
  | 'users'
  | 'grid'
  | 'pencil'
  | 'plus'
  | 'log-out'
  | 'qr-code'
  | 'rotate-ccw';

const PATHS: Record<NomeIcone, string> = {
  scan: 'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10',
  check: 'M20 6 9 17l-5-5',
  x: 'M18 6 6 18M6 6l12 12',
  'chevron-right': 'm9 18 6-6-6-6',
  star: 'M11.5 2.6a.6.6 0 0 1 1 0l2.3 4.6a.6.6 0 0 0 .45.33l5.1.74a.6.6 0 0 1 .33 1.02l-3.69 3.6a.6.6 0 0 0-.17.53l.87 5.08a.6.6 0 0 1-.87.63l-4.56-2.4a.6.6 0 0 0-.56 0l-4.56 2.4a.6.6 0 0 1-.87-.63l.87-5.08a.6.6 0 0 0-.17-.53l-3.69-3.6a.6.6 0 0 1 .33-1.02l5.1-.74a.6.6 0 0 0 .45-.33Z',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  sprout: 'M7 20h10M12 20v-8M12 12a4 4 0 0 0-4-4H5v1a4 4 0 0 0 4 4h3ZM12 10a4 4 0 0 1 4-4h3v1a4 4 0 0 1-4 4h-3Z',
  droplet: 'M12 2.7s6 5.5 6 10.3a6 6 0 1 1-12 0C6 8.2 12 2.7 12 2.7Z',
  trophy: 'M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M12 14v6',
  camera: 'M14.5 4h-5l-1.2 2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.3ZM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  image: 'M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM21 16l-5-5-6 6-3-3-4 4',
  'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
  sparkles: 'M12 3l1.8 4.6L18.4 9l-4.6 1.8L12 15l-1.8-4.2L5.6 9l4.6-1.4L12 3ZM19 14l.9 2.3L22 17l-2.1.7L19 20l-.9-2.3L16 17l2.1-.7L19 14Z',
  message: 'M21 11.5a8 8 0 0 1-11.6 7.1L3 21l2.4-6.4A8 8 0 1 1 21 11.5Z',
  shield: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z',
  'panel-left': 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM9 3v18',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2ZM9 22V12h6v10',
  map: 'M1 6v16l7-4 7 4 7-4V2l-7 4-7-4-7 4ZM8 2v16M15 6v16',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  grid: 'M3 3h7v7H3ZM14 3h7v7h-7ZM14 14h7v7h-7ZM3 14h7v7H3Z',
  pencil: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z',
  plus: 'M12 5v14M5 12h14',
  'log-out': 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  'qr-code': 'M3 3h6v6H3ZM15 3h6v6h-6ZM3 15h6v6H3ZM15 15h2v2h-2ZM19 19h2v2h-2ZM15 19h2M19 15h2',
  'rotate-ccw': 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5'
};

interface Props {
  nome: NomeIcone;
  tamanho?: number;
  className?: string;
}

export default function Icone({ nome, tamanho = 20, className }: Props) {
  return (
    <svg
      className={className}
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[nome]} />
    </svg>
  );
}
