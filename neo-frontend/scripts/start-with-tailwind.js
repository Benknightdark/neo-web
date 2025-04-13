// 啟動腳本，同時運行 Tailwind CLI 和 webpack 開發服務器
const { spawn } = require('child_process');
const moduleName = process.argv[2]; // 獲取模塊名稱參數

console.log(`Starting module: ${moduleName || 'main app'} with Tailwind CSS`);

// 啟動 Tailwind CLI watch 模式
const tailwindProcess = spawn('npm', ['run', 'tailwind:watch'], { 
  stdio: 'inherit',
  shell: true
});

console.log('Tailwind CSS watch mode started...');

// 構建 webpack 命令參數
const args = ['serve', '--mode', 'development'];
if (moduleName) {
  args.push('--env', `module=${moduleName}`);
}

// 等待 1 秒後啟動 webpack 開發服務器，確保 tailwind 已經編譯出初始 CSS
setTimeout(() => {
  console.log('Starting webpack development server...');
  const webpack = spawn('webpack', args, { stdio: 'inherit' });

  webpack.on('close', (code) => {
    console.log(`webpack process exited with code ${code}`);
    // 當 webpack 退出時，也停止 tailwind 進程
    tailwindProcess.kill();
  });

  // 處理進程終止信號
  process.on('SIGINT', () => {
    console.log('Terminating processes...');
    webpack.kill();
    tailwindProcess.kill();
    process.exit(0);
  });
}, 1000);

// 處理 tailwind 進程結束
tailwindProcess.on('close', (code) => {
  console.log(`Tailwind process exited with code ${code}`);
});