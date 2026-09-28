import { useEffect, useRef, type ReactNode } from 'react';
import Icone from './Icone';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  titulo: string;
  /** cor de destaque do cabeçalho (token da entidade) */
  cor?: string;
  children: ReactNode;
}

// Bottom-sheet mobile: scrim medido, foco preso, fecha no Esc e no scrim,
// respeita prefers-reduced-motion (via CSS). Rola por dentro em telas pequenas.
export default function Sheet({ aberto, onFechar, titulo, cor, children }: Props) {
  const painelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    painelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      anterior?.focus?.();
    };
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div className="sheet-scrim" onClick={onFechar}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        tabIndex={-1}
        ref={painelRef}
        onClick={(e) => e.stopPropagation()}
        style={cor ? ({ ['--sheet-accent' as string]: cor } as React.CSSProperties) : undefined}
      >
        <div className="sheet__grip" aria-hidden="true" />
        <header className="sheet__header">
          <h2 className="sheet__titulo">{titulo}</h2>
          <button type="button" className="botao-icone" onClick={onFechar} aria-label="Fechar">
            <Icone nome="x" />
          </button>
        </header>
        <div className="sheet__corpo">{children}</div>
      </div>
    </div>
  );
}
