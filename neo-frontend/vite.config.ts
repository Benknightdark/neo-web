import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vue(),
    tailwindcss()
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  css: {
    postcss: true,
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});