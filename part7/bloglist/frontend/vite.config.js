import process from 'node:process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

process.env.BROWSER = 'google-chrome';
process.env.BROWSER_ARGS = '--incognito';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      include: ['src/**'],
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001/',
        changeOrigin: true,
      },
    },
  },
  build: { outDir: '../backend/dist', emptyOutDir: true },
});
