import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    host: true,
    port: 8000,
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
  root: 'src/pages/signup',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
  
      }
    }
  }
});
