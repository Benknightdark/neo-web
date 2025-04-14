// 臨時 Vite 構建配置模板
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// 這些變量將在運行時被替換:
// - TEMP_DIST_PATH: 臨時輸出目錄
// - MODULE_NAME: 模組名稱
// - PROJECT_ROOT: 項目根目錄的絕對路徑

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    outDir: 'TEMP_DIST_PATH',
    emptyOutDir: true,
    assetsDir: '',
    rollupOptions: {
      input: {
        MODULE_NAME: 'PROJECT_ROOT/src/MODULE_NAME/index.tsx'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (/\.css$/.test(assetInfo.name)) {
            return '[name].css';
          }
          return '[name].[ext]';
        },
      },
    },
  },
  base: '',
});