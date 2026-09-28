import { AcervoProvider } from './store/useAcervo';
import { FluxoProvider } from './ui/fluxo';
import { AvisoProvider } from './ui/aviso';
import { RotaProvider, useRota } from './ui/rota';
import Shell from './ui/shell/Shell';
import MinhaJornada from './features/jornada/MinhaJornada';
import QrsDemo from './features/qrs/QrsDemo';

// Visualização mobile do Território: a página "Minha jornada" dentro da moldura
// do sistema (top bar + sidebar + menu de perfil), fluxos em bottom-sheets e
// deep link de missão/totem (/m/{mapa}/missao/{id}) vindo do QR. /qrs apoia a demo.
export default function App() {
  return (
    <RotaProvider>
      <AcervoProvider>
        <AvisoProvider>
          <FluxoProvider>
            <Paginas />
          </FluxoProvider>
        </AvisoProvider>
      </AcervoProvider>
    </RotaProvider>
  );
}

function Paginas() {
  const { rota } = useRota();
  if (rota.tipo === 'qrs') return <QrsDemo />;
  // jornada, missao e totem renderizam Minha jornada; o fluxo abre o sheet do deep link.
  return (
    <Shell>
      <MinhaJornada />
    </Shell>
  );
}
