import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  //adding  this section to route /api calls to backend
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // express backend
        changeOrigin: true,
      },
    },
  },

  preview: {
    port: 4173,
    host: true,
    allowedHosts: ['squadup-frontend-production.up.railway.app'],
  },
});
