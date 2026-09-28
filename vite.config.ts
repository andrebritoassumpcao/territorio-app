import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Visualização mobile do Território ("Minha jornada") — 100% mockada, sem backend.
// Sem PWA: é uma página web servida pelo Vercel; o QR lido pela câmera nativa do
// celular abre /m/{mapa}/missao/{id} e o roteador do cliente (src/ui/rota.tsx) resolve.
export default defineConfig({
  server: { port: 5174 },
  plugins: [react()]
});
