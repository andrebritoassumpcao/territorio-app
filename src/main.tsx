import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './theme/tokens.css';
import './styles.css';

// A versão anterior era PWA: remove service workers que tenham ficado registrados
// no navegador, para não servirem uma versão antiga em cache.
navigator.serviceWorker?.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
