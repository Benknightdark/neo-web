import { spawn } from 'child_process';
import process from 'process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 自動讀取 apps/portal 目錄下的所有子資料夾，動態取得所有子模組
const portalDir = path.resolve(__dirname, '../apps/portal');
const ALL_MODULES = fs.readdirSync(portalDir).filter(file => {
  const filePath = path.join(portalDir, file);
  return fs.statSync(filePath).isDirectory();
});

// 取得傳入的模組名稱，預設為主模組 'portal'
const targetModule = process.argv[2] || 'portal';

if (targetModule !== 'portal') {
  console.error(`[Error] 不支援單獨啟動子模組 "${targetModule}"。`);
  console.error(`本地開發模式僅支援啟動主模組 "portal" 以確保多模組聯調功能。`);
  console.error(`請執行: npm start portal 或是直接執行 npm start`);
  process.exit(1);
}

console.log(`[Start] 正在啟動主模組 portal 底下的所有開發伺服器 (${ALL_MODULES.join(', ')})...`);

const nxArgs = ['nx', 'run-many', '-t', 'serve', `--projects=${ALL_MODULES.join(',')}`, `--parallel=${ALL_MODULES.length}`];

const nx = spawn('npx', nxArgs, {
  stdio: 'inherit',
  shell: true
});

nx.on('close', (code) => {
  process.exit(code || 0);
});

