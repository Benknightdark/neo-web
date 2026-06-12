/**
 * 構建前端模組到獨立部署目錄 (neo-frontend/deploy) 的腳本
 * 使用: npm run build [模組名稱]
 * 若未提供模組名稱，則會自動尋找 src 目錄下的所有模組並執行打包
 */
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 獲取當前文件的目錄路徑
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.resolve(projectRoot, 'src');

// 獲取模組名稱參數
const moduleName = process.argv[2];

/**
 * 檢查目錄是否為有效的模組 (包含 index.ts 或 index.tsx)
 * @param {string} dirPath - 目錄路徑
 * @returns {boolean} - 是否為有效模組
 */
function isValidModule(dirPath) {
  try {
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (!isDirectory) return false;
    
    const files = fs.readdirSync(dirPath);
    return files.some(file => file === 'index.ts');
  } catch (err) {
    return false;
  }
}

/**
 * 從 src 目錄中尋找所有有效模組
 * @returns {string[]} - 模組名稱列表
 */
function findAllModules() {
  const modules = [];
  
  try {
    if (!fs.existsSync(srcDir)) {
      console.error(`錯誤: src 目錄不存在: ${srcDir}`);
      return modules;
    }
    
    const items = fs.readdirSync(srcDir);
    
    for (const item of items) {
      const itemPath = path.join(srcDir, item);
      if (isValidModule(itemPath)) {
        modules.push(item);
      }
    }
  } catch (err) {
    console.error(`尋找模組時出錯: ${err.message}`);
  }
  
  return modules;
}

/**
 * 確保共享庫 Vue.js 存在於 deployRoot 中
 * @param {string} deployRootPath 
 */
function ensureSharedLibraries(deployRootPath) {
  const libTargetDir = path.join(deployRootPath, 'lib', 'vue3');
  if (!fs.existsSync(libTargetDir)) {
    fs.mkdirSync(libTargetDir, { recursive: true });
  }
  
  const targetFilePath = path.join(libTargetDir, 'vue.esm-browser.min.js');
  
  // 優先從 neo-backend/wwwroot 尋找，其次從 node_modules
  const sourcePaths = [
    path.resolve(__dirname, '../../neo-backend/wwwroot/lib/vue3/vue.esm-browser.min.js'),
    path.resolve(__dirname, '../node_modules/vue/dist/vue.esm-browser.prod.js'),
    path.resolve(__dirname, '../node_modules/vue/dist/vue.esm-browser.js')
  ];
  
  let copied = false;
  for (const srcPath of sourcePaths) {
    if (fs.existsSync(srcPath)) {
      try {
        fs.copyFileSync(srcPath, targetFilePath);
        console.log(`[Vue.js Library] 已成功將共享庫複製至: ${targetFilePath} (來源: ${srcPath})`);
        copied = true;
        break;
      } catch (err) {
        console.error(`複製共享庫失敗: ${err.message}`);
      }
    }
  }
  
  if (!copied) {
    console.warn(`警告: 無法找到 vue.esm-browser.min.js，請確認 vue 已安裝在 node_modules 中。`);
  }
}

/**
 * 生成 Portal 入口 index.html
 * @param {string} deployRootPath 
 * @param {string[]} modules 
 */
/**
 * 生成 staticwebapp.config.json 以配置路由，將首頁 / 重定向至 /home/
 * @param {string} deployRootPath 
 */
function generateStaticWebAppConfig(deployRootPath) {
  const targetPath = path.join(deployRootPath, 'staticwebapp.config.json');
  const configContent = {
    "routes": [
      {
        "route": "/",
        "redirect": "/home/"
      }
    ]
  };
  fs.writeFileSync(targetPath, JSON.stringify(configContent, null, 2), 'utf8');
  console.log(`[Config] 已生成 staticwebapp.config.json，配置首頁重定向至 /home/`);

  // 生成一個自動跳轉的 index.html 作為物理 fallback，以防止 SWA CLI 回傳 404
  const targetHtmlPath = path.join(deployRootPath, 'index.html');
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Redirecting...</title>
    <meta http-equiv="refresh" content="0; url=/home/" />
    <script>
        window.location.replace("/home/");
    </script>
</head>
<body>
    <p>正在前往首頁，請稍候...</p>
</body>
</html>`;
  fs.writeFileSync(targetHtmlPath, htmlContent, 'utf8');
  console.log(`[Redirect] 已為根目錄生成自動跳轉 index.html`);
}

/**
 * 創建 Vite 臨時配置文件
 */
function createTempViteConfig(moduleName, tempDistPath) {
  const tempConfigPath = path.resolve(__dirname, '../temp-vite.config.js');
  const templatePath = path.resolve(__dirname, './vite-module-template.js');
  const projectRoot = path.resolve(__dirname, '..');
  
  let configContent = fs.readFileSync(templatePath, 'utf8');
  
  configContent = configContent
    .replace(/TEMP_DIST_PATH/g, tempDistPath.replace(/\\/g, '\\\\'))
    .replace(/MODULE_NAME/g, moduleName)
    .replace(/PROJECT_ROOT/g, projectRoot.replace(/\\/g, '\\\\'));
  
  fs.writeFileSync(tempConfigPath, configContent, 'utf8');
  console.log(`已創建臨時構建配置: ${tempConfigPath}`);
  return tempConfigPath;
}

/**
 * 處理構建後的文件並移動至部署目錄，產生對應的 index.html
 */
function processBuiltFiles(tempDistPath, moduleName, deployRootPath) {
  const targetDir = path.join(deployRootPath, moduleName);
  
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`已創建目標目錄: ${targetDir}`);
  }
  
  let jsFound = false;
  let cssFound = false;
  
  try {
    const files = fs.readdirSync(tempDistPath);
    
    for (const file of files) {
      if (file.endsWith('.js')) {
        const sourcePath = path.join(tempDistPath, file);
        const targetPath = path.join(targetDir, `${moduleName}.js`);
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`已拷貝 JS 文件到: ${targetPath}`);
        jsFound = true;
      } else if (file.endsWith('.css')) {
        const sourcePath = path.join(tempDistPath, file);
        const targetPath = path.join(targetDir, `${moduleName}.css`);
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`已拷貝 CSS 文件到: ${targetPath}`);
        cssFound = true;
      }
    }
    
    if (jsFound) {
      const htmlContent = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Neo Web - ${moduleName.toUpperCase()}</title>
    <script type="importmap">
    {
        "imports": {
            "vue": "/lib/vue3/vue.esm-browser.min.js"
        }
    }
    </script>
    ${cssFound ? `<link rel="stylesheet" href="./${moduleName}.css" />` : ''}
</head>
<body class="bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
    <div id="root"></div>
    <script type="module" src="./${moduleName}.js"></script>
</body>
</html>`;
      fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf8');
      console.log(`已為模組 ${moduleName} 生成 index.html`);
    }
    
    // 刪除臨時目錄
    fs.rmSync(tempDistPath, { recursive: true, force: true });
    console.log(`已刪除臨時目錄: ${tempDistPath}`);
    
    return { jsFound, cssFound };
  } catch (err) {
    console.error(`處理文件時出錯: ${err.message}`);
    return { jsFound: false, cssFound: false };
  }
}

/**
 * 構建單個模組
 */
async function buildModule(moduleName) {
  console.log(`開始構建模組: ${moduleName} ...`);

  const tempDistPath = path.resolve(__dirname, `../dist-temp-${moduleName}`);

  if (!fs.existsSync(tempDistPath)) {
    fs.mkdirSync(tempDistPath, { recursive: true });
  }

  const tempConfigPath = createTempViteConfig(moduleName, tempDistPath);

  console.log('執行 Vite 構建...');
  return new Promise((resolve, reject) => {
    const vite = spawn('npx', [
      'vite',
      'build',
      '--config', tempConfigPath,
    ], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        VITE_MODULE: moduleName
      }
    });

    vite.on('close', async (code) => {
      if (fs.existsSync(tempConfigPath)) {
        fs.unlinkSync(tempConfigPath);
      }
      
      if (code === 0) {
        console.log(`Vite 構建完成`);
        
        const deployRootPath = path.resolve(__dirname, '../deploy');
        
        // 確保共享庫存在
        ensureSharedLibraries(deployRootPath);
        
        const { jsFound, cssFound } = processBuiltFiles(tempDistPath, moduleName, deployRootPath);
        
        if (jsFound) {
          console.log(`模組 ${moduleName} 已成功構建到: ${deployRootPath}/${moduleName}`);
          resolve(true);
        } else {
          const error = new Error(`構建模組 ${moduleName} 失敗，未找到輸出 JS 文件`);
          console.error(error.message);
          reject(error);
        }
      } else {
        const error = new Error(`構建模組 ${moduleName} 失敗，錯誤代碼: ${code}`);
        console.error(error.message);
        reject(error);
      }
    });
  });
}

/**
 * 批量構建所有模組
 */
async function buildAllModules(modules) {
  console.log(`=== 開始構建 ${modules.length} 個模組 ===`);
  const results = [];
  
  for (const moduleName of modules) {
    console.log(`\n=== 構建 ${moduleName} (${modules.indexOf(moduleName) + 1}/${modules.length}) ===`);
    try {
      await buildModule(moduleName);
      results.push({ moduleName, success: true });
    } catch (err) {
      console.error(`構建模組 ${moduleName} 失敗: ${err.message}`);
      results.push({ moduleName, success: false, error: err.message });
    }
  }
  
  console.log('\n=== 構建報告 ===');
  const successCount = results.filter(r => r.success).length;
  console.log(`總計: ${modules.length} 個模組, 成功: ${successCount}, 失敗: ${modules.length - successCount}`);
  
  if (modules.length - successCount > 0) {
    throw new Error('部分模組構建失敗');
  }
  
  // 生成 staticwebapp.config.json 配置首頁重定向
  const deployRootPath = path.resolve(__dirname, '../deploy');
  generateStaticWebAppConfig(deployRootPath);
}

/**
 * 主函數
 */
async function main() {
  try {
    const deployRootPath = path.resolve(__dirname, '../deploy');
    
    // 確保部署目錄存在
    if (!fs.existsSync(deployRootPath)) {
      fs.mkdirSync(deployRootPath, { recursive: true });
    }
    
    if (moduleName) {
      await buildModule(moduleName);
      // 單個模組構建後也重新生成一下配置
      generateStaticWebAppConfig(deployRootPath);
    } else {
      const modules = findAllModules();
      if (modules.length === 0) {
        console.error('錯誤: 在 src 目錄下找不到任何有效模組');
        process.exit(1);
      }
      
      console.log(`在 src 目錄下找到 ${modules.length} 個模組: ${modules.join(', ')}`);
      await buildAllModules(modules);
    }
    console.log('構建完成!');
  } catch (err) {
    console.error(`構建過程中發生錯誤: ${err.message}`);
    process.exit(1);
  }
}

main();