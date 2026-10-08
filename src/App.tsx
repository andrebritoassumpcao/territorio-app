import { AcervoProvider } from './store/useAcervo';
import { FluxoProvider } from './ui/fluxo';
import { AvisoProvider } from './ui/aviso';
import { RotaProvider } from './ui/rota';
import { I18nProvider } from './i18n/I18nProvider';
import Shell from './ui/shell/Shell';
import MinhaJornada from './features/jornada/MinhaJornada';

// Visualização mobile do Território: a página "Minha jornada" dentro da moldura
// do sistema (top bar + sidebar + menu de perfil), fluxos em bottom-sheets e
// deep link de missão/totem (/m/{mapa}/missao/{id}) vindo do QR.
// O tour de onboarding (primeiro acesso) é disparado dentro do FluxoProvider
// (ver features/tutorial/TutorialTour), pois precisa do controlador do fluxo.
export default function App() {
  return (
    <I18nProvider>
      <RotaProvider>
        <AcervoProvider>
          <AvisoProvider>
            <FluxoProvider>
              <Paginas />
            </FluxoProvider>
          </AvisoProvider>
        </AcervoProvider>
      </RotaProvider>
    </I18nProvider>
  );
}

function Paginas() {
  // jornada, missao e totem renderizam Minha jornada; o fluxo abre o sheet do deep link.
  return (
    <Shell>
      <MinhaJornada />
    </Shell>
  );
}
