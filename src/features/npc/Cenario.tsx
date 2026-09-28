import { useId } from 'react';
import type { Cenario as TipoCenario } from '../../types';

// Paisagens ilustradas atrás da Tainá na cena de diálogo, uma por tipo de lugar:
//   rio   — nascente/rio Sarapuí (água, mata ciliar, sol)
//   serra — Serra do Vulcão (morro cônico, trilha em zigue-zague, mata)
//   horta — horta do bairro (casinhas coloridas no morro, canteiros)
// Vetorial, flat, recortado para preencher a tela (slice). O terço de baixo fica
// atrás da caixa de diálogo, então os detalhes ficam no alto.
export default function Cenario({ tipo, className }: { tipo: TipoCenario; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const ceu = `ceu-${uid}`;

  return (
    <svg className={className} viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={ceu} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tipo === 'serra' ? '#a9dcef' : '#9fd8ea'} />
          <stop offset="0.55" stopColor="#fdf0d5" />
        </linearGradient>
      </defs>
      <rect width="400" height="800" fill={`url(#${ceu})`} />
      {tipo === 'rio' && <Rio />}
      {tipo === 'serra' && <Serra />}
      {tipo === 'horta' && <Horta />}
    </svg>
  );
}

function Sol({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="72" fill="#ffd66b" opacity="0.28" />
      <circle cx={x} cy={y} r="44" fill="#ffd66b" />
    </g>
  );
}

function Nuvem({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g fill="#fff" opacity="0.92" transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="34" ry="18" />
      <ellipse cx="28" cy="-10" rx="26" ry="20" />
      <ellipse cx="54" cy="2" rx="28" ry="15" />
    </g>
  );
}

function Passaros({ x, y }: { x: number; y: number }) {
  return (
    <g stroke="#2b3a33" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.7">
      <path d={`M${x} ${y} q7 -7 14 0 q7 -7 14 0`} />
      <path d={`M${x + 34} ${y - 18} q5 -5 10 0 q5 -5 10 0`} />
    </g>
  );
}

function Arvore({ x, y, r, cor = '#2e7d4f' }: { x: number; y: number; r: number; cor?: string }) {
  return (
    <g>
      <rect x={x - r * 0.12} y={y} width={r * 0.24} height={r * 0.9} rx="2" fill="#6b4226" />
      <circle cx={x} cy={y} r={r} fill={cor} />
      <circle cx={x - r * 0.35} cy={y - r * 0.3} r={r * 0.35} fill="#fff" opacity="0.12" />
    </g>
  );
}

function Rio() {
  return (
    <g>
      <Sol x={300} y={150} />
      <Nuvem x={60} y={130} />
      <Nuvem x={220} y={236} s={0.8} />
      <Passaros x={110} y={210} />
      <path d="M0 380 Q80 300 170 350 T400 330 V800 H0 Z" fill="#a7d7b0" />
      <path d="M0 440 Q120 360 230 420 T400 400 V800 H0 Z" fill="#5fb27a" />
      {[[40, 420, 22], [80, 405, 18], [300, 402, 20], [345, 410, 24], [375, 398, 16]].map(([x, y, r]) => (
        <Arvore key={`${x}`} x={x} y={y} r={r} />
      ))}
      {/* Rio serpenteando da nascente até a frente */}
      <path d="M192 412 Q172 452 212 482 Q262 522 182 582 Q102 652 150 800 L330 800 Q252 662 302 592 Q352 522 262 482 Q222 462 212 412 Z" fill="#4fa9d6" />
      <g stroke="#9ad8f0" strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <path d="M205 450 h14" />
        <path d="M226 500 h22" />
        <path d="M200 560 h26" />
        <path d="M188 640 h30" />
      </g>
      <path d="M0 560 Q60 540 120 600 Q150 680 120 800 H0 Z" fill="#3f8f57" />
      <path d="M400 540 Q330 560 310 620 Q290 700 340 800 H400 Z" fill="#3f8f57" />
      {/* Taboas na margem */}
      <g stroke="#2e6b42" strokeWidth="3" strokeLinecap="round">
        <path d="M60 600 v-44 M72 604 v-54 M84 606 v-38" />
        <path d="M340 600 v-46 M352 596 v-34" />
      </g>
      <g fill="#7a4a2a">
        <rect x="68" y="546" width="8" height="18" rx="4" />
        <rect x="336" y="550" width="8" height="18" rx="4" />
      </g>
    </g>
  );
}

function Serra() {
  return (
    <g>
      <Sol x={84} y={150} />
      <Nuvem x={250} y={120} />
      <Nuvem x={30} y={270} s={0.7} />
      <Passaros x={280} y={220} />
      {/* O "vulcão": morro cônico */}
      <path d="M40 500 L208 176 Q220 158 232 176 L400 500 Z" fill="#4f9467" />
      <path d="M220 164 L232 176 L400 500 L270 500 Z" fill="#3f7f56" />
      <path d="M198 196 Q220 150 242 196 Q230 190 220 200 Q210 190 198 196 Z" fill="#7cbf8a" />
      {/* Trilha em zigue-zague */}
      <path d="M222 214 L196 262 L244 300 L182 350 L256 402 L200 470" fill="none" stroke="#fbe8c8" strokeWidth="5" strokeDasharray="10 9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0 470 Q100 430 200 470 T400 460 V800 H0 Z" fill="#5fb27a" />
      {[[20, 470, 20], [58, 458, 24], [100, 468, 18], [300, 462, 22], [342, 452, 26], [384, 466, 20]].map(([x, y, r], i) => (
        <Arvore key={x} x={x} y={y} r={r} cor={i % 2 ? '#2e7d4f' : '#347f52'} />
      ))}
      <path d="M0 560 Q120 520 240 560 T400 550 V800 H0 Z" fill="#3f8f57" />
      <g fill="#f7c33b">
        <circle cx="60" cy="590" r="4" /><circle cx="330" cy="584" r="4" /><circle cx="360" cy="600" r="3" />
      </g>
    </g>
  );
}

// Casinhas coloridas no morro — a paisagem de bairro de muitas cidades brasileiras.
const CASAS: [number, number, number, number, string][] = [
  [18, 360, 34, 30, '#f7c33b'], [56, 344, 30, 34, '#e0452b'], [90, 334, 36, 30, '#2f6fd6'],
  [130, 326, 30, 32, '#fbe8c8'], [164, 332, 34, 28, '#e89a5c'], [200, 344, 30, 32, '#7c4dff'],
  [236, 352, 34, 30, '#f7c33b'], [272, 360, 30, 30, '#2e9e5b'], [306, 352, 36, 32, '#e0452b'],
  [346, 340, 32, 34, '#fbe8c8'], [40, 386, 32, 28, '#2e9e5b'], [110, 372, 34, 30, '#e89a5c'],
  [186, 380, 32, 28, '#f7c33b'], [258, 392, 34, 28, '#2f6fd6'], [330, 386, 30, 28, '#e89a5c']
];

function Horta() {
  return (
    <g>
      <Sol x={316} y={140} />
      <Nuvem x={50} y={150} />
      <Passaros x={150} y={220} />
      {/* Morro com as casas erguido para aparecer acima da cabeça da Tainá */}
      <g transform="translate(0 -120)">
        <path d="M0 400 Q110 300 230 330 Q320 350 400 320 V920 H0 Z" fill="#89c290" />
        {CASAS.map(([x, y, w, h, cor]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width={w} height={h} rx="2" fill={cor} />
            <rect x={x + w * 0.2} y={y + h * 0.28} width={w * 0.24} height={h * 0.26} fill="#1c3a4a" opacity="0.75" />
            <rect x={x + w * 0.56} y={y + h * 0.28} width={w * 0.24} height={h * 0.26} fill="#1c3a4a" opacity="0.75" />
            <rect x={x - 2} y={y - 5} width={w + 4} height="6" rx="1.5" fill="#b8563a" />
          </g>
        ))}
      </g>
      <path d="M0 450 Q200 410 400 450 V800 H0 Z" fill="#6fae6f" />
      <path d="M0 500 Q200 474 400 500 V800 H0 Z" fill="#8a5a3b" />
      {/* Canteiros com mudas */}
      {[520, 580].map((y, fila) => (
        <g key={y}>
          <rect x="20" y={y} width="170" height="40" rx="10" fill="#6b4226" />
          <rect x="210" y={y} width="170" height="40" rx="10" fill="#6b4226" />
          {Array.from({ length: 7 }, (_, i) => [34 + i * 24, 226 + i * 24]).flat().map((x) => (
            <path key={x} d={`M${x} ${y + 22} v-12 M${x} ${y + 14} q-8 -2 -10 -10 q8 0 10 10 M${x} ${y + 12} q7 -3 9 -11 q-8 1 -9 11`} stroke="#3f9a55" strokeWidth="2.4" fill="#3f9a55" strokeLinecap="round" opacity={fila ? 0.9 : 1} />
          ))}
        </g>
      ))}
    </g>
  );
}
