// Núcleo de i18n (sem React) compartilhado pelo app (React) e pelo mapa (vanilla).
// Idioma padrão: inglês. Preferência única em localStorage (`territorio:lang`),
// válida nas duas páginas do mesmo domínio.
import { MESSAGES, type Traducao } from './messages';

export type Lang = 'en' | 'pt';
const CHAVE = 'territorio:lang';

export function getLang(): Lang {
  try {
    const v = localStorage.getItem(CHAVE);
    if (v === 'pt' || v === 'en') return v;
  } catch {
    /* localStorage indisponível: cai no padrão */
  }
  return 'en';
}

export function setLang(lang: Lang): void {
  try {
    localStorage.setItem(CHAVE, lang);
  } catch {
    /* sem persistência */
  }
  aplicarHtmlLang(lang);
}

export function aplicarHtmlLang(lang: Lang): void {
  try {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  } catch {
    /* fora do browser */
  }
}

/** Traduz uma chave. `params` substitui marcadores `{x}` no texto. */
export function t(chave: string, lang: Lang = getLang(), params?: Record<string, string | number>): string {
  const entrada: Traducao | undefined = MESSAGES[chave];
  let texto = entrada ? entrada[lang] ?? entrada.en : chave;
  if (params) {
    for (const k of Object.keys(params)) texto = texto.split(`{${k}}`).join(String(params[k]));
  }
  return texto;
}
