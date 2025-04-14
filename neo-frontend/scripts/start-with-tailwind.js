// 啟動 Vite 開發服務器
// 不再需要單獨運行 Tailwind CLI，因為 Vite 和 @tailwindcss/vite 插件會自動處理
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// 獲取當前文件的目錄路徑
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleName = process.argv[2]; // 獲取模塊名稱參數

console.log(`Starting module: ${moduleName || 'main app'} with Vite and Tailwind CSS`);

// 設置環境變數（如果需要）
if (moduleName) {
  process.env.MODULE = moduleName;
  console.log(`Setting module environment variable: ${moduleName}`);
}

// 啟動 Vite 開發服務器
console.log('Starting Vite development server...');
const vite = spawn('npx', ['vite'], { 
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
});

// 處理進程終止信號
process.on('SIGINT', () => {
  console.log('Terminating processes...');
  vite.kill();
  process.exit(0);
});