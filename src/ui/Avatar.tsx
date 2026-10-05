interface Props {
  nome: string;
  avatar?: string;
  tamanho: number;
  className?: string;
}

// Avatar do usuário: mostra a foto quando há `avatar`; senão, as iniciais do nome
// (novo usuário começa sem foto). Mantém a classe de layout (tamanho/borda) do
// elemento original e só troca <img> por um círculo com iniciais.
export default function Avatar({ nome, avatar, tamanho, className }: Props) {
  if (avatar) {
    return <img className={className} src={avatar} alt="" width={tamanho} height={tamanho} />;
  }
  const iniciais =
    nome
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('') || '?';
  return (
    <span
      className={`${className ?? ''} avatar-iniciais`.trim()}
      style={{ width: tamanho, height: tamanho, fontSize: Math.round(tamanho * 0.4) }}
      aria-hidden="true"
    >
      {iniciais}
    </span>
  );
}
