import { useT } from '../i18n/I18nProvider';

// Toggle EN | PT na top bar. Troca o idioma do app ao vivo (e persiste a
// preferência compartilhada com o mapa).
export default function SeletorIdioma() {
  const { lang, setLang, t } = useT();
  return (
    <div className="lang-switch" role="group" aria-label={t('lang.aria')}>
      <button
        type="button"
        className={`lang-switch__opt${lang === 'en' ? ' is-active' : ''}`}
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
      >
        EN
      </button>
      <button
        type="button"
        className={`lang-switch__opt${lang === 'pt' ? ' is-active' : ''}`}
        aria-pressed={lang === 'pt'}
        onClick={() => setLang('pt')}
      >
        PT
      </button>
    </div>
  );
}
