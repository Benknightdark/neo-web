// 啟動腳本，同時運行 Tailwind CLI 和 webpack 開發服務器
const { spawn } = require('child_process');
const moduleName = process.argv[2]; // 獲取模塊名稱參數

console.log(`Starting module: ${moduleName || 'main app'} with Tailwind CSS`);

// 根據模組名稱決定 Tailwind 命令
let tailwindCommand = 'tailwind:watch';
let tailwindArgs = ['run', 'tailwind:watch'];

if (moduleName) {
  // 如果有模組名稱，則使用模組特定的命令
  tailwindCommand = 'tailwind:module';
  tailwindArgs = ['run', 'tailwind:module'];
  
  // 替換模板變數
  process.env.MODULE = moduleName;
  
  console.log(`Generating Tailwind CSS for module: ${moduleName}`);
} else {
  console.log('Generating Tailwind CSS for main app');
}

// 啟動 Tailwind CLI watch 模式
const tailwindProcess = spawn('npm', tailwindArgs, { 
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, MODULE: moduleName }
});

console.log(`Tailwind CSS watch mode started using command: ${tailwindCommand}`);

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