import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const deployRootPath = path.resolve(projectRoot, 'deploy/portal');

// 取得傳入的編譯參數，例如 'portal' 或 'portal/home'
const buildTarget = process.argv[2];

if (!buildTarget) {
  console.error(`[Error] 未指定編譯目標！為了防止編譯過多無用檔案，請明確指定主模組或子模組。`);
  console.error(`使用範例:`);
  console.error(`  npm run build portal           # 編譯 portal 主模組下的所有子模組`);
  console.error(`  npm run build portal/home      # 僅編譯 portal 下的 home 子模組`);
  process.exit(1);
}

// 實體路徑解析
const targetPath = path.resolve(projectRoot, `apps/${buildTarget}`);

if (!fs.existsSync(targetPath)) {
  console.error(`[Error] 找不到指定的編譯目標路徑: apps/${buildTarget}`);
  process.exit(1);
}

const isDirectory = fs.statSync(targetPath).isDirectory();

if (isDirectory && !buildTarget.includes('/')) {
  // 如果是目錄且不包含斜線，代表使用者指定的是「主模組」（例如 'portal'）
  // 動態讀取該主模組目錄底下的所有子模組
  const subModules = fs.readdirSync(targetPath).filter(file => {
    const filePath = path.join(targetPath, file);
    return fs.statSync(filePath).isDirectory();
  });

  if (subModules.length === 0) {
    console.error(`[Error] 主模組 ${buildTarget} 底下沒有找到任何子模組。`);
    process.exit(1);
  }

  console.log(`[Build] 正在編譯主模組: ${buildTarget} 底下的所有子模組 (${subModules.join(', ')})...`);
  
  // 使用 run-many 並行編譯所有子模組
  const result = spawnSync('npx', ['nx', 'run-many', '-t', 'build', `--projects=${subModules.join(',')}`], {
    stdio: 'inherit',
    shell: true
  });

  if (result.status !== 0) {
    console.error(`[Error] 編譯主模組 ${buildTarget} 失敗。`);
    process.exit(result.status || 1);
  }
} else {
  // 傳入 "主模組/子模組" 時，將其解析為 Nx 目錄唯一的定位路徑 "apps/主模組/子模組"
  const nxProjectPath = `apps/${buildTarget}`;
  console.log(`[Build] 正在編譯指定子模組: ${buildTarget} (定位路徑: ${nxProjectPath})...`);
  
  const result = spawnSync('npx', ['nx', 'build', nxProjectPath], {
    stdio: 'inherit',
    shell: true
  });
  
  if (result.status !== 0) {
    console.error(`[Error] 編譯子模組 ${buildTarget} 失敗。`);
    process.exit(result.status || 1);
  }
}

console.log(`[Post-Build] 開始執行編譯後處理...`);


// 1. 確保共享庫 Vue.js 存在於 deploy/lib/vue3 中
const libTargetDir = path.join(deployRootPath, 'lib', 'vue3');
if (!fs.existsSync(libTargetDir)) {
  fs.mkdirSync(libTargetDir, { recursive: true });
}
const targetFilePath = path.join(libTargetDir, 'vue.esm-browser.min.js');
const sourcePaths = [
  path.resolve(__dirname, '../../../neo-backend/wwwroot/lib/vue3/vue.esm-browser.min.js'),
  path.resolve(projectRoot, 'node_modules/vue/dist/vue.esm-browser.prod.js'),
  path.resolve(projectRoot, 'node_modules/vue/dist/vue.esm-browser.js')
];

let copied = false;
for (const srcPath of sourcePaths) {
  if (fs.existsSync(srcPath)) {
    try {
      fs.copyFileSync(srcPath, targetFilePath);
      console.log(`[Vue.js Library] 複製成功至: ${targetFilePath}`);
      copied = true;
      break;
    } catch (err) {
      console.error(`複製共享庫失敗: ${err.message}`);
    }
  }
}

// 2. 生成 staticwebapp.config.json 配置首頁重定向與 HTML 快取控制
const staticWebConfigPath = path.join(deployRootPath, 'staticwebapp.config.json');
const configContent = {
  "routes": [
    {
      "route": "/",
      "redirect": "/home/"
    },
    {
      "route": "/*.html",
      "headers": {
        "Cache-Control": "must-revalidate, max-age=0"
      }
    },
    {
      "route": "/*/*.html",
      "headers": {
        "Cache-Control": "must-revalidate, max-age=0"
      }
    }
  ]
};
fs.writeFileSync(staticWebConfigPath, JSON.stringify(configContent, null, 2), 'utf8');
console.log(`[Config] 已生成 staticwebapp.config.json`);

// 3. 確保 swa-cli.config.json 存在於 deploy/swa-cli.config.json
const swaConfigPath = path.join(deployRootPath, 'swa-cli.config.json');
if (!fs.existsSync(swaConfigPath)) {
  const swaConfigContent = {
    "$schema": "https://aka.ms/azure/static-web-apps-cli/schema",
    "configurations": {
      "container-deploy": {
        "appLocation": ".",
        "outputLocation": ".",
        "apiDevserverUrl": "http://neo-backend:5000",
        "host": "0.0.0.0",
        "port": 4280
      },
      "local-deploy": {
        "appLocation": ".",
        "outputLocation": ".",
        "apiDevserverUrl": "http://localhost:5058",
        "host": "localhost",
        "port": 4280
      }
    }
  };
  fs.writeFileSync(swaConfigPath, JSON.stringify(swaConfigContent, null, 2), 'utf8');
  console.log(`[Config] 已生成 swa-cli.config.json`);
}
