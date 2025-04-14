/**
 * 構建前端模組到後端目錄的腳本
 * 使用: npm run build:backend <模組名稱>
 */
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// 獲取當前文件的目錄路徑
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 獲取模組名稱參數
const moduleName = process.argv[2];

if (!moduleName) {
  console.error('請提供模組名稱，例如: npm run build:backend home');
  process.exit(1);
}

/**
 * 創建 Vite 臨時配置文件
 * @param {string} moduleName - 模組名稱
 * @param {string} tempDistPath - 臨時輸出路徑
 * @returns {string} - 配置文件路徑
 */
function createTempViteConfig(moduleName, tempDistPath) {
  const tempConfigPath = path.resolve(__dirname, '../temp-vite.config.js');
  const templatePath = path.resolve(__dirname, './vite-module-template.js');
  const projectRoot = path.resolve(__dirname, '..');
  
  // 讀取模板文件
  let configContent = fs.readFileSync(templatePath, 'utf8');
  
  // 替換模板中的變量
  configContent = configContent
    .replace(/TEMP_DIST_PATH/g, tempDistPath.replace(/\\/g, '\\\\'))
    .replace(/MODULE_NAME/g, moduleName)
    .replace(/PROJECT_ROOT/g, projectRoot.replace(/\\/g, '\\\\'));
  
  fs.writeFileSync(tempConfigPath, configContent, 'utf8');
  console.log(`已創建臨時構建配置: ${tempConfigPath}`);
  return tempConfigPath;
}

/**
 * 處理構建後的文件，移除版權注釋並複製到目標位置
 * @param {string} tempDistPath - 臨時構建目錄
 * @param {string} moduleName - 模組名稱
 * @param {string} backendRootPath - 後端根目錄
 * @returns {object} - 處理結果
 */
function processBuiltFiles(tempDistPath, moduleName, backendRootPath) {
  // 設置後端目錄路徑
  const jsTargetDir = path.join(backendRootPath, 'js', moduleName);
  const cssTargetDir = path.join(backendRootPath, 'css', moduleName);
  
  // 確保目標目錄存在
  if (!fs.existsSync(jsTargetDir)) {
    fs.mkdirSync(jsTargetDir, { recursive: true });
    console.log(`已創建 JS 目標目錄: ${jsTargetDir}`);
  }
  
  if (!fs.existsSync(cssTargetDir)) {
    fs.mkdirSync(cssTargetDir, { recursive: true });
    console.log(`已創建 CSS 目標目錄: ${cssTargetDir}`);
  }
  
  // 移動文件到正確的位置
  let jsFound = false;
  let cssFound = false;
  
  try {
    // 搜索臨時目錄中的文件
    const files = fs.readdirSync(tempDistPath);
    
    for (const file of files) {
      if (file.endsWith('.js')) {
        jsFound = processJsFile(tempDistPath, file, jsTargetDir, moduleName);
      } else if (file.endsWith('.css')) {
        cssFound = processCssFile(tempDistPath, file, cssTargetDir, moduleName);
      }
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
 * 處理 JS 文件
 * @param {string} tempDistPath - 臨時目錄路徑
 * @param {string} file - 文件名
 * @param {string} jsTargetDir - JS 目標目錄
 * @param {string} moduleName - 模組名稱
 * @returns {boolean} - 是否成功處理
 */
function processJsFile(tempDistPath, file, jsTargetDir, moduleName) {
  // 讀取 JS 文件內容
  const sourcePath = path.join(tempDistPath, file);
  let content = fs.readFileSync(sourcePath, 'utf8');
  
  // 寫入處理後的 JS 文件到目標位置
  const targetPath = path.join(jsTargetDir, `${moduleName}.js`);
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log(`已拷貝 JS 文件到: ${targetPath}`);
  return true;
}

/**
 * 處理 CSS 文件
 * @param {string} tempDistPath - 臨時目錄路徑
 * @param {string} file - 文件名
 * @param {string} cssTargetDir - CSS 目標目錄
 * @param {string} moduleName - 模組名稱
 * @returns {boolean} - 是否成功處理
 */
function processCssFile(tempDistPath, file, cssTargetDir, moduleName) {
  // 讀取 CSS 文件內容
  const sourcePath = path.join(tempDistPath, file);
  let content = fs.readFileSync(sourcePath, 'utf8');
  
  // 移除版權和許可證注釋
  content = content.replace(/\/\*\*[\s\S]*?Copyright[\s\S]*?\*\//g, '');
  content = content.replace(/\/\*[\s\S]*?@license[\s\S]*?\*\//g, '');
  
  // 寫入處理後的 CSS 文件到目標位置
  const targetPath = path.join(cssTargetDir, `${moduleName}.css`);
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log(`已拷貝 CSS 文件到: ${targetPath}`);
  return true;
}

/**
 * 主函數: 執行構建流程
 */
async function buildModule() {
  console.log(`開始構建模組: ${moduleName} 到後端目錄...`);

  // 設置構建輸出目錄 - 臨時目錄
  const tempDistPath = path.resolve(__dirname, '../dist-temp');

  // 確保臨時輸出目錄存在
  if (!fs.existsSync(tempDistPath)) {
    fs.mkdirSync(tempDistPath, { recursive: true });
    console.log(`已創建臨時輸出目錄: ${tempDistPath}`);
  }

  // 創建臨時 Vite 配置文件
  const tempConfigPath = createTempViteConfig(moduleName, tempDistPath);

  // 執行 Vite 構建命令
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
      // 清理臨時配置文件
      if (fs.existsSync(tempConfigPath)) {
        fs.unlinkSync(tempConfigPath);
        console.log(`已刪除臨時構建配置`);
      }
      
      if (code === 0) {
        console.log(`Vite 構建完成`);
        
        // 設置後端目錄路徑
        const backendRootPath = path.resolve(__dirname, '../../neo-backend/wwwroot');
        
        // 處理構建後的文件
        const { jsFound, cssFound } = processBuiltFiles(tempDistPath, moduleName, backendRootPath);
        
        if (!jsFound) {
          console.error(`警告: 未找到 JS 文件`);
        }
        
        if (!cssFound) {
          console.error(`警告: 未找到 CSS 文件`);
        }
        
        if (jsFound && cssFound) {
          console.log(`模組 ${moduleName} 已成功構建到指定目錄:`);
          console.log(`- JS: /js/${moduleName}/${moduleName}.js`);
          console.log(`- CSS: /css/${moduleName}/${moduleName}.css`);
          resolve();
        } else {
          const error = new Error(`構建模組 ${moduleName} 部分失敗，未找到所有輸出文件`);
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

// 執行主函數
buildModule().catch(err => {
  console.error(`構建過程中發生錯誤: ${err.message}`);
  process.exit(1);
});