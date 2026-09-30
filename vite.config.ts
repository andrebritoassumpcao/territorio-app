import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Site único "Território": duas páginas no mesmo build/domínio.
//   index.html  → SPA do participante (Minha jornada, deep links /m/..., /qrs)
//   mapa.html   → mapa colaborativo (autoria de missão + geração de QR), vanilla + Leaflet
// O QR gerado no mapa aponta para o domínio atual e o app resolve /m/{mapa}/missao/{id}.
export default defineConfig({
  server: { port: 5174 },
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        app: fileURLToPath(new URL('./index.html', import.meta.url)),
        mapa: fileURLToPath(new URL('./mapa.html', import.meta.url))
      }
    }
  }
});
