/**
 * 構建前端模組到後端目錄的腳本
 * 使用: npm run build:backend <模組名稱>
 */
const { spawn } = require('child_process');
const path = require('path');

// 獲取模組名稱參數
const moduleName = process.argv[2];

if (!moduleName) {
  console.error('請提供模組名稱，例如: npm run build:backend home');
  process.exit(1);
}

console.log(`開始構建模組: ${moduleName} 到後端目錄...`);

// 執行 webpack 構建命令
const webpack = spawn('npx', [
  'webpack',
  '--mode', 'production',
  '--progress',
  '--env', 'WEBPACK_BUILD=true',
  '--env', `module=${moduleName}`,
  '--env', 'skipHtml=true', // 添加參數告知 webpack 不要複製 index.html
  '--env', 'skipLicense=true', // 添加參數告知 webpack 不要複製 license.txt
], {
  stdio: 'inherit',
  shell: true
});

webpack.on('close', (code) => {
  if (code === 0) {
    console.log(`模組 ${moduleName} 已成功構建到後端目錄！`);
  } else {
    console.error(`構建模組 ${moduleName} 失敗，錯誤代碼: ${code}`);
  }
});