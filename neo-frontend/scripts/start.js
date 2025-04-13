// 簡單的啟動腳本，用於正確傳遞模塊參數給 webpack
const { spawn } = require('child_process');
const moduleName = process.argv[2]; // 獲取模塊名稱參數

console.log(`Starting module: ${moduleName || 'main app'}`);

// 構建命令參數
const args = ['serve', '--mode', 'development'];
if (moduleName) {
  args.push('--env', `module=${moduleName}`);
}

// 啟動 webpack 開發服務器
const webpack = spawn('webpack', args, { stdio: 'inherit' });

webpack.on('close', (code) => {
  console.log(`webpack process exited with code ${code}`);
});