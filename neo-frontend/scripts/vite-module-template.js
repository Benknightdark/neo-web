// 臨時 Vite 構建配置模板
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

// 這些變量將在運行時被替換:
// - TEMP_DIST_PATH: 臨時輸出目錄
// - MODULE_NAME: 模組名稱
// - PROJECT_ROOT: 項目根目錄的絕對路徑

// 檢測模組是否使用 Vue 還是 React
function detectFramework(moduleName, projectRoot) {
  const moduleDir = path.join(projectRoot, `src/${moduleName}`);
  
  // 檢查是否有 .vue 文件
  const hasVueFiles = fs.readdirSync(moduleDir).some(file => file.endsWith('.vue'));
  
  // 檢查是否有 .tsx 文件
  const hasReactFiles = fs.readdirSync(moduleDir).some(file => file.endsWith('.tsx'));
  
  if (hasVueFiles) return 'vue';
  if (hasReactFiles) return 'react';
  
  // 預設使用 React
  return 'react';
}

// 獲取入口文件
function getEntryFile(moduleName, projectRoot, framework) {
  const tsxPath = path.join(projectRoot, `src/${moduleName}/index.tsx`);
  const tsPath = path.join(projectRoot, `src/${moduleName}/index.ts`);
  
  if (fs.existsSync(tsxPath)) {
    return `PROJECT_ROOT/src/MODULE_NAME/index.tsx`;
  } else if (fs.existsSync(tsPath)) {
    return `PROJECT_ROOT/src/MODULE_NAME/index.ts`;
  } else {
    throw new Error(`找不到模組 ${moduleName} 的入口文件 (index.ts 或 index.tsx)`);
  }
}

// 檢測模組類型
const framework = detectFramework('MODULE_NAME', 'PROJECT_ROOT');
const entryFile = getEntryFile('MODULE_NAME', 'PROJECT_ROOT', framework);

console.log(`模組 MODULE_NAME 使用 ${framework} 框架，入口文件: ${entryFile}`);

export default defineConfig({
  plugins: [
    // 根據模組類型動態選擇插件
    ...(framework === 'react' ? [react()] : []),
    ...(framework === 'vue' ? [vue()] : []),
    tailwindcss()
  ],
  build: {
    outDir: 'TEMP_DIST_PATH',
    emptyOutDir: true,
    assetsDir: '',
    rollupOptions: {
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
      },
    },
  },
  base: '',
});