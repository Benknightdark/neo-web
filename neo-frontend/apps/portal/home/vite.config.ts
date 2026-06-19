/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  base: '',
  test: {
    environment: 'happy-dom',
  },
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/apps/home',
  plugins: [vue(), tailwindcss(), nxViteTsPaths()],
  build: {
    // 強制輸出到統一的 deploy 目錄
    outDir: '../../../deploy/portal/home',
    emptyOutDir: true,
    reportCompressedSize: true,
    rollupOptions: {
      external: ['vue'],
      input: {
        home: './index.html',
      },
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
  server: {
    port: 3001,
    host: true,
    proxy: {
      '/introduction': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/privacy': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:5058',
        changeOrigin: true,
        secure: false,
      }
    }
  },
});

