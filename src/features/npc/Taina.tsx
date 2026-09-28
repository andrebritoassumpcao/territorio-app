import { useId } from 'react';

// Tainá, Guardiã do Território — a NPC do protótipo (ver docs/NPC_TAINA.md).
// Arte vetorial desenhada à mão, estilo flat de jogo mobile: jovem negra de
// cabelo black power, lenço de chita (o tecido florido do Nordeste e das festas
// juninas), argolas douradas, colete verde do Território e bolsa de sementes.
//
// Três expressões/poses, escolhidas pelo `id` da fala (ver expressaoDaFala):
//   acenando    — intro: sorriso e mão erguida acenando
//   explicando  — falas do meio: indicador levantado, sobrancelha arqueada
//   comemorando — ok: olhos fechados de alegria, braços para cima, brilhos
//
// Troca pela arte final: gere os PNGs do prompt kit (docs/NPC_TAINA.md), coloque
// em public/npc/ e mude ARTE para 'png'. O resto do app não muda.
const ARTE = 'svg' as 'svg' | 'png';

export type ExpressaoTaina = 'acenando' | 'explicando' | 'comemorando';

export function expressaoDaFala(idFala: string): ExpressaoTaina {
  if (idFala === 'intro') return 'acenando';
  if (idFala === 'ok') return 'comemorando';
  return 'explicando';
}

interface Props {
  expressao: ExpressaoTaina;
  /** Boca mexendo (enquanto o texto é digitado). */
  falando?: boolean;
  /** `busto` para a cena; `rosto` recorta a cabeça para avatares. */
  enquadramento?: 'busto' | 'rosto';
  className?: string;
}

const PELE = '#8d5524';
const PELE_SOMBRA = '#6f3f19';
const CABELO = '#2b1a12';
const CABELO_LUZ = '#46291b';
const CAMISA = '#fbe8c8';
const COLETE = '#1f7a4c';
const COLETE_ESCURO = '#19653e';
const OURO = '#e8b53a';
const TRACO = '#1c120c';
// Silhueta do tronco: ombros largos em camiseta; o colete fica por dentro.
const TRONCO = 'M34 420 C36 352 60 314 104 302 C122 297 134 293 140 290 Q160 300 180 290 C186 293 198 297 216 302 C260 314 284 352 286 420 Z';

export default function Taina({ expressao, falando = false, enquadramento = 'busto', className }: Props) {
  const uid = useId().replace(/:/g, '');
  const chita = `chita-${uid}`;
  const tronco = `tronco-${uid}`;
  const classes = ['taina', `taina--${expressao}`, `taina--${enquadramento}`, falando ? 'taina--falando' : '', className ?? ''].filter(Boolean).join(' ');
  const viewBox = enquadramento === 'rosto' ? '66 58 188 188' : '0 0 320 420';

  if (ARTE === 'png') {
    return <img className={classes} src={`/npc/taina-${expressao}.png`} alt="" draggable={false} />;
  }

  const comemorando = expressao === 'comemorando';

  return (
    <svg className={classes} viewBox={viewBox} role="img" aria-label="Tainá, Guardiã do Território" focusable="false">
      <defs>
        {/* Chita: fundo vermelho com flores grandes amarelas, azuis e brancas */}
        <pattern id={chita} width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
          <rect width="46" height="46" fill="#e0452b" />
          <Flor x={12} y={12} petala="#f7c33b" miolo="#e0452b" />
          <Flor x={35} y={34} petala="#2f6fd6" miolo="#f7c33b" />
          <Flor x={36} y={9} petala="#fff7e6" miolo="#2f6fd6" r={3.6} />
          <Flor x={10} y={37} petala="#fff7e6" miolo="#f7c33b" r={3.6} />
          <ellipse cx="23" cy="20" rx="5" ry="2.2" fill="#2e9e5b" transform="rotate(-35 23 20)" />
          <ellipse cx="24" cy="30" rx="5" ry="2.2" fill="#2e9e5b" transform="rotate(30 24 30)" />
        </pattern>
        <clipPath id={tronco}>
          <path d={TRONCO} />
        </clipPath>
      </defs>

      <g className="taina__corpo">
        {/* Cabelo black power (atrás da cabeça) */}
        <g fill={CABELO}>
          <ellipse cx="160" cy="122" rx="94" ry="80" />
          {[
            [78, 172, 30], [70, 132, 32], [86, 92, 34], [120, 62, 36], [160, 52, 38],
            [200, 62, 36], [234, 92, 34], [250, 132, 32], [242, 172, 30], [86, 206, 22], [234, 206, 22]
          ].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
        <g fill="none" stroke={CABELO_LUZ} strokeWidth="3" strokeLinecap="round">
          <path d="M96 78 q8 -8 16 0" />
          <path d="M140 50 q8 -8 16 0" />
          <path d="M190 56 q8 -8 16 0" />
          <path d="M226 88 q8 -8 16 0" />
          <path d="M70 128 q8 -8 16 0" />
          <path d="M238 140 q8 -8 16 0" />
          <path d="M112 42 q6 -6 12 0" />
        </g>

        {/* Braços erguidos saem de trás dos ombros (desenhados antes do tronco) */}
        {expressao === 'acenando' && (
          <>
            <line x1="212" y1="310" x2="284" y2="262" stroke={PELE} strokeWidth="26" strokeLinecap="round" />
            <line x1="212" y1="310" x2="248" y2="286" stroke={CAMISA} strokeWidth="36" strokeLinecap="round" />
            <g className="taina__aceno">
              <line x1="284" y1="262" x2="276" y2="200" stroke={PELE} strokeWidth="24" strokeLinecap="round" />
              <Mao x={274} y={184} aberta />
            </g>
          </>
        )}
        {expressao === 'explicando' && (
          <line x1="212" y1="310" x2="262" y2="392" stroke={PELE} strokeWidth="26" strokeLinecap="round" />
        )}
        {comemorando && (
          <>
            <line x1="108" y1="310" x2="40" y2="262" stroke={PELE} strokeWidth="26" strokeLinecap="round" />
            <line x1="108" y1="310" x2="72" y2="286" stroke={CAMISA} strokeWidth="36" strokeLinecap="round" />
            <line x1="40" y1="262" x2="52" y2="204" stroke={PELE} strokeWidth="24" strokeLinecap="round" />
            <Mao x={54} y={190} />
            <line x1="212" y1="310" x2="280" y2="262" stroke={PELE} strokeWidth="26" strokeLinecap="round" />
            <line x1="212" y1="310" x2="248" y2="286" stroke={CAMISA} strokeWidth="36" strokeLinecap="round" />
            <line x1="280" y1="262" x2="268" y2="204" stroke={PELE} strokeWidth="24" strokeLinecap="round" />
            <Mao x={266} y={190} />
          </>
        )}

        {/* Pescoço, camiseta (ombros largos, manga curta) e colete do Território */}
        <path d="M140 236 L140 286 Q160 298 180 286 L180 236 Z" fill={PELE} />
        <path d="M140 248 Q160 274 180 248 L180 262 Q160 282 140 262 Z" fill={PELE_SOMBRA} />
        <path d={TRONCO} fill={CAMISA} />
        <path d="M142 289 L160 318 L178 289 Q160 298 142 289 Z" fill={PELE} />
        {/* Braço que desce ao lado do corpo: pele abaixo da barra da manga */}
        <g clipPath={`url(#${tronco})`}>
          {!comemorando && (
            <>
              <rect x="20" y="382" width="48" height="44" fill={PELE} />
              <path d="M20 382 h48" stroke="#e3c99c" strokeWidth="3" />
            </>
          )}
          {expressao === 'explicando' && (
            <>
              <rect x="252" y="382" width="48" height="44" fill={PELE} />
              <path d="M252 382 h48" stroke="#e3c99c" strokeWidth="3" />
            </>
          )}
        </g>
        <path d="M62 420 C62 350 90 312 132 294 L148 334 L142 420 Z" fill={COLETE} />
        <path d="M258 420 C258 350 230 312 188 294 L172 334 L178 420 Z" fill={COLETE} />
        <path d="M132 294 L148 334 L142 420" fill="none" stroke={COLETE_ESCURO} strokeWidth="3" />
        <path d="M188 294 L172 334 L178 420" fill="none" stroke={COLETE_ESCURO} strokeWidth="3" />
        <rect x="86" y="366" width="36" height="28" rx="5" fill={COLETE_ESCURO} />
        <path d="M86 372 h36" stroke={COLETE} strokeWidth="3" />
        <rect x="198" y="366" width="36" height="28" rx="5" fill={COLETE_ESCURO} />
        <path d="M198 372 h36" stroke={COLETE} strokeWidth="3" />
        {/* Crachá "T" do Território */}
        <circle cx="210" cy="338" r="11" fill="#fff" />
        <path d="M204 333 h12 M210 333 v11" stroke={COLETE} strokeWidth="3.2" strokeLinecap="round" />

        {/* Alça e bolsa de sementes */}
        <path d="M222 302 L90 420" stroke="#c8372a" strokeWidth="12" strokeLinecap="round" />
        <rect x="44" y="382" width="74" height="56" rx="12" fill="#c98a4b" />
        <path d="M44 394 Q81 414 118 394 L118 388 Q118 382 112 382 L50 382 Q44 382 44 388 Z" fill="#9a5f2c" />
        <path d="M81 416 v-10 M81 408 q-7 -1 -9 -8 q7 0 9 8 M81 406 q6 -2 8 -9 q-7 1 -8 9" stroke="#2e9e5b" strokeWidth="2.4" fill="#2e9e5b" strokeLinecap="round" />

        {/* Explicando: antebraço dobrado na frente do peito, indicador erguido */}
        {expressao === 'explicando' && (
          <>
            <line x1="262" y1="392" x2="228" y2="324" stroke={PELE} strokeWidth="24" strokeLinecap="round" />
            <g className="taina__indicador">
              <line x1="222" y1="304" x2="219" y2="282" stroke={PELE} strokeWidth="9" strokeLinecap="round" />
              <circle cx="225" cy="314" r="15" fill={PELE} />
              <path d="M214 316 q6 5 14 2" stroke={PELE_SOMBRA} strokeWidth="2.4" fill="none" strokeLinecap="round" />
            </g>
          </>
        )}

        {/* Orelhas e argolas */}
        <circle cx="92" cy="192" r="12" fill={PELE} />
        <circle cx="228" cy="192" r="12" fill={PELE} />
        <circle cx="90" cy="212" r="10" fill="none" stroke={OURO} strokeWidth="4" />
        <circle cx="230" cy="212" r="10" fill="none" stroke={OURO} strokeWidth="4" />

        {/* Cabeça e rosto */}
        <ellipse cx="160" cy="180" rx="70" ry="76" fill={PELE} />
        <ellipse cx="114" cy="216" rx="12" ry="7" fill="#c4674a" opacity="0.5" />
        <ellipse cx="206" cy="216" rx="12" ry="7" fill="#c4674a" opacity="0.5" />
        <g fill={PELE_SOMBRA} opacity="0.55">
          <circle cx="108" cy="206" r="1.6" /><circle cx="116" cy="204" r="1.6" /><circle cx="112" cy="210" r="1.4" />
          <circle cx="204" cy="204" r="1.6" /><circle cx="212" cy="206" r="1.6" /><circle cx="208" cy="210" r="1.4" />
        </g>

        {/* Sobrancelhas */}
        <g stroke={CABELO} strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M117 166 Q131 157 145 163" />
          <path d={expressao === 'explicando' ? 'M175 160 Q189 148 203 158' : 'M175 163 Q189 157 203 166'} />
        </g>

        {/* Olhos */}
        {comemorando ? (
          <g stroke={TRACO} strokeWidth="5" strokeLinecap="round" fill="none">
            <path d="M119 196 Q132 181 145 196" />
            <path d="M175 196 Q188 181 201 196" />
          </g>
        ) : (
          <>
            <Olho x={132} y={192} />
            <Olho x={188} y={192} />
          </>
        )}

        {/* Nariz */}
        <path d="M153 208 Q160 214 167 208" stroke={PELE_SOMBRA} strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Boca */}
        {comemorando ? (
          <g>
            <path d="M139 224 Q160 260 181 224 Z" fill="#5a1f14" />
            <path d="M142 225.5 Q160 231 178 225.5 L177 230 Q160 235 143 230 Z" fill="#fff" />
            <ellipse cx="160" cy="246" rx="9" ry="5" fill="#e0776a" />
          </g>
        ) : (
          <>
            <path className="taina__boca-fechada" d="M144 228 Q160 242 176 228" stroke="#4a1c10" strokeWidth="4" fill="none" strokeLinecap="round" />
            <g className="taina__boca-aberta">
              <path d="M146 226 Q160 250 174 226 Q160 232 146 226 Z" fill="#5a1f14" />
              <ellipse cx="160" cy="240" rx="6" ry="3.5" fill="#e0776a" />
            </g>
          </>
        )}

        {/* Lenço de chita amarrado, com o laço de lado */}
        <path d="M84 162 C80 76 240 76 236 162 C226 118 94 118 84 162 Z" fill={`url(#${chita})`} />
        <path d="M84 162 C94 118 226 118 236 162" fill="none" stroke="#b8321d" strokeWidth="2.5" />
        <g fill={`url(#${chita})`} stroke="#b8321d" strokeWidth="2.5">
          <ellipse cx="222" cy="90" rx="22" ry="14" transform="rotate(-38 222 90)" />
          <ellipse cx="244" cy="110" rx="20" ry="12" transform="rotate(22 244 110)" />
          <path d="M226 110 Q236 136 230 150 Q246 132 238 108 Z" />
          <circle cx="228" cy="104" r="10" />
        </g>
      </g>

      {/* Brilhos da comemoração */}
      {comemorando && (
        <g className="taina__brilhos">
          <Estrela x={34} y={130} r={13} cor="#f7c33b" />
          <Estrela x={292} y={118} r={15} cor="#f7c33b" />
          <Estrela x={70} y={44} r={9} cor="#fff7e6" />
          <Estrela x={262} y={40} r={10} cor="#fff7e6" />
          <rect x="20" y="70" width="8" height="14" rx="2" fill="#2f6fd6" transform="rotate(25 24 77)" />
          <rect x="294" y="66" width="8" height="14" rx="2" fill="#e0452b" transform="rotate(-20 298 73)" />
          <rect x="300" y="170" width="8" height="12" rx="2" fill="#2e9e5b" transform="rotate(35 304 176)" />
          <rect x="14" y="180" width="8" height="12" rx="2" fill="#e0452b" transform="rotate(-30 18 186)" />
        </g>
      )}
    </svg>
  );
}

function Flor({ x, y, petala, miolo, r = 5.2 }: { x: number; y: number; petala: string; miolo: string; r?: number }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => {
        const rad = (a * Math.PI) / 180;
        return <circle key={a} cx={x + Math.cos(rad) * r * 1.15} cy={y + Math.sin(rad) * r * 1.15} r={r} fill={petala} />;
      })}
      <circle cx={x} cy={y} r={r * 0.7} fill={miolo} />
    </g>
  );
}

function Olho({ x, y }: { x: number; y: number }) {
  return (
    <g className="taina__olho">
      <ellipse cx={x} cy={y} rx="13" ry="15.5" fill="#fff" />
      <circle cx={x + 1} cy={y + 2} r="10.5" fill="#3a2014" />
      <circle cx={x + 1} cy={y + 2} r="5.5" fill="#0d0806" />
      <circle cx={x - 3} cy={y - 3} r="3.8" fill="#fff" />
      <circle cx={x + 5} cy={y + 6} r="1.8" fill="#fff" />
      <path d={`M${x - 15} ${y - 6} Q${x} ${y - 21} ${x + 15} ${y - 6} l4 -4`} stroke={TRACO} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Mao({ x, y, aberta = false }: { x: number; y: number; aberta?: boolean }) {
  if (!aberta) {
    // Punho fechado, erguido na comemoração.
    return (
      <g>
        <circle cx={x} cy={y} r="17" fill={PELE} />
        <path d={`M${x - 10} ${y - 4} h20 M${x - 10} ${y + 3} h20`} stroke={PELE_SOMBRA} strokeWidth="2.2" strokeLinecap="round" />
      </g>
    );
  }
  // Mão aberta acenando: palma + quatro dedos + polegar.
  return (
    <g stroke={PELE} strokeLinecap="round">
      <line x1={x - 11} y1={y - 6} x2={x - 16} y2={y - 26} strokeWidth="8" />
      <line x1={x - 3} y1={y - 9} x2={x - 4} y2={y - 32} strokeWidth="8" />
      <line x1={x + 5} y1={y - 8} x2={x + 8} y2={y - 30} strokeWidth="8" />
      <line x1={x + 12} y1={y - 4} x2={x + 18} y2={y - 22} strokeWidth="7.5" />
      <line x1={x - 14} y1={y + 6} x2={x - 26} y2={y - 2} strokeWidth="8" />
      <circle cx={x} cy={y} r="16" fill={PELE} stroke="none" />
    </g>
  );
}

function Estrela({ x, y, r, cor }: { x: number; y: number; r: number; cor: string }) {
  const q = r * 0.28;
  return <path d={`M${x} ${y - r} Q${x + q} ${y - q} ${x + r} ${y} Q${x + q} ${y + q} ${x} ${y + r} Q${x - q} ${y + q} ${x - r} ${y} Q${x - q} ${y - q} ${x} ${y - r} Z`} fill={cor} />;
}
