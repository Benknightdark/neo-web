// 臨時 Vite 構建配置模板
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

// 這些變量將在運行時被替換:
// - TEMP_DIST_PATH: 臨時輸出目錄
// - MODULE_NAME: 模組名稱
// - PROJECT_ROOT: 項目根目錄的絕對路徑

// 獲取入口文件
function getEntryFile(moduleName, projectRoot) {
  const tsPath = path.join(projectRoot, `src/${moduleName}/index.ts`);
  
  if (fs.existsSync(tsPath)) {
    return `PROJECT_ROOT/src/MODULE_NAME/index.ts`;
  } else {
    throw new Error(`找不到模組 ${moduleName} 的入口文件 (index.ts)`);
  }
}

// 檢測模組類型
const entryFile = getEntryFile('MODULE_NAME', 'PROJECT_ROOT');

console.log(`模組 MODULE_NAME 使用 Vue 框架，入口文件: ${entryFile}`);

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  build: {
    outDir: 'TEMP_DIST_PATH',
    emptyOutDir: true,
    assetsDir: '',
    rollupOptions: {
      external: ['vue'],
      input: {
        MODULE_NAME: entryFile
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
        paths: {
          vue: 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.5.13/vue.esm-browser.min.js'
        }
      },
    },
  },
  base: '',
});
