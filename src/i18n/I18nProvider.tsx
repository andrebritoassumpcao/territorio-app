import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { aplicarHtmlLang, getLang, setLang as persistir, t as traduzir, type Lang } from './idioma';

interface I18n {
  lang: Lang;
  /** Traduz uma chave; `params` substitui marcadores `{x}`. */
  t: (chave: string, params?: Record<string, string | number>) => string;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18n | null>(null);

// No app React a troca de idioma é AO VIVO (re-render); a preferência é a mesma
// chave de localStorage do mapa (ver i18n/idioma), então vale nas duas páginas.
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getLang);

  useEffect(() => {
    aplicarHtmlLang(lang);
  }, [lang]);

  const setLang = useCallback((novo: Lang) => {
    persistir(novo);
    setLangState(novo);
  }, []);

  const valor = useMemo<I18n>(
    () => ({ lang, setLang, t: (chave, params) => traduzir(chave, lang, params) }),
    [lang, setLang]
  );

  return <I18nContext.Provider value={valor}>{children}</I18nContext.Provider>;
}

export function useT(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useT precisa estar dentro de <I18nProvider>.');
  return ctx;
}
