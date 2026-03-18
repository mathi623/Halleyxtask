import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite Configuration
 * ─────────────────────────────────────────────────────────────────
 * proxy: Forwards all /api requests from the React dev server
 *        to the Express backend on port 5000.
 *        This avoids CORS issues during development.
 * ─────────────────────────────────────────────────────────────────
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target      : 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
