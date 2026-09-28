import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

// Toast simples (um por vez), usado para "Em breve" e avisos do deep link.
const AvisoContext = createContext<((mensagem: string) => void) | null>(null);

export function AvisoProvider({ children }: { children: ReactNode }) {
  const [mensagem, setMensagem] = useState<string | null>(null);
  const timer = useRef<number>();

  const avisar = useCallback((texto: string) => {
    window.clearTimeout(timer.current);
    setMensagem(texto);
    timer.current = window.setTimeout(() => setMensagem(null), 2800);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <AvisoContext.Provider value={avisar}>
      {children}
      <div className="toast-area" role="status" aria-live="polite">
        {mensagem && <div className="toast">{mensagem}</div>}
      </div>
    </AvisoContext.Provider>
  );
}

export function useAviso(): (mensagem: string) => void {
  const ctx = useContext(AvisoContext);
  if (!ctx) throw new Error('useAviso precisa estar dentro de <AvisoProvider>.');
  return ctx;
}
