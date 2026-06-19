/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// These options were migrated by @nx/vite:convert-to-inferred from the project.json file.
const configValues = { default: {} };

// Determine the correct configValue to use based on the configuration
const nxConfiguration = process.env.NX_TASK_TARGET_CONFIGURATION ?? 'default';

const options = {
  ...configValues.default,
  ...(configValues[nxConfiguration] ?? {}),
};

export default defineConfig({
  base: '',
  test: {
    environment: 'happy-dom',
  },
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/apps/introduction',
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, '../../../deploy/portal/introduction'),
    emptyOutDir: true,
    reportCompressedSize: true,
    rollupOptions: {
      external: ['vue'],
      input: {
        introduction: './index.html',
      },
      output: {
        format: 'es',
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
    },
  },
  server: {
    port: 3002,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5058',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
