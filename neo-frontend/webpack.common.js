const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 輸出通用配置
module.exports = (env) => {
  // Determine the module name from env, if provided
  const moduleName = env && env.module ? env.module : null; // Use null if not provided
  // 檢查是否需要跳過 HTML 生成
  const skipHtml = env && env.skipHtml === 'true';
  // 檢查是否需要跳過 LICENSE.txt 檔案
  const skipLicense = env && env.skipLicense === 'true';

  console.log(`Building module: ${moduleName || 'main app'}`);
  if (skipHtml) {
    console.log('Skipping HTML generation');
  }
  if (skipLicense) {
    console.log('Skipping LICENSE.txt generation');
  }

  // Define base paths
  const baseSrcPath = path.resolve(__dirname, 'src');
  const baseDistPath = path.resolve(__dirname, 'dist');
  
  // Determine entry, template, and output paths based on module name
  let entryPath;
  let templatePath;
  let outputPath;

  if (moduleName) {
    // Module name is provided, use module-specific paths
    entryPath = path.resolve(baseSrcPath, moduleName, 'index.tsx'); // src/<moduleName>/index.tsx
    templatePath = path.resolve(baseSrcPath, moduleName, 'index.html'); // src/<moduleName>/index.html
    // For development mode, output to dist/<moduleName>
    outputPath = path.resolve(baseDistPath, moduleName);
  } else {
    // No module name provided, use default root paths
    entryPath = path.resolve(baseSrcPath, 'index.tsx');
    templatePath = path.resolve(baseSrcPath, 'index.html');
    outputPath = baseDistPath; // Output to dist
  }

  // 準備 plugins 陣列
  const plugins = [];
  
  // 只有在不跳過 HTML 時才添加 HtmlWebpackPlugin
  if (!skipHtml) {
    plugins.push(
      new HtmlWebpackPlugin({
        template: templatePath, // Use dynamic template path
        filename: 'index.html', // Always output as index.html in the root
        inject: true, // 確保 JS 和 CSS 都被自動注入
      })
    );
  }
  
  // 通用配置
  return {
    entry: entryPath, // Use dynamic entry path
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      // 確保模組路徑正確解析
      modules: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'src'),
        moduleName ? path.resolve(__dirname, 'src', moduleName) : null
      ].filter(Boolean)
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
          },
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: plugins,
    performance: {
      hints: false,
    },
  };
};