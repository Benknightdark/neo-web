/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  base: '',
  test: {
    environment: 'happy-dom'
  },
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/apps/privacy',
  plugins: [
    vue(),
    tailwindcss(),
    nxViteTsPaths()
  ],
  build: {
    outDir: '../../../deploy/portal/privacy',
    emptyOutDir: true,
    reportCompressedSize: true,
    rollupOptions: {
      external: ['vue'],
      input: {
        privacy: './index.html'
      },
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      }
    }
  },
  server: {
    port: 3003,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5058',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
