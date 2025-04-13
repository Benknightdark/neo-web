const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// Convert module.exports to a function to access env variables
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
  
  // Define backend wwwroot paths for production build
  const backendWwwrootPath = path.resolve(__dirname, '../neo-backend/wwwroot');
  const backendCssPath = path.resolve(backendWwwrootPath, 'css');
  const backendJsPath = path.resolve(backendWwwrootPath, 'js');

  // Determine entry, template, and output paths based on module name
  let entryPath;
  let templatePath;
  let outputPath;
  let outputJsPath;
  let outputCssPath;

  if (moduleName) {
    // Module name is provided, use module-specific paths
    entryPath = path.resolve(baseSrcPath, moduleName, 'index.tsx'); // src/<moduleName>/index.tsx
    templatePath = path.resolve(baseSrcPath, moduleName, 'index.html'); // src/<moduleName>/index.html
    
    // For development mode, output to dist/<moduleName>
    outputPath = path.resolve(baseDistPath, moduleName);
    
    // For production mode, output to backend paths
    if (env.WEBPACK_BUILD || process.env.NODE_ENV === 'production') {
      outputJsPath = path.resolve(backendJsPath, moduleName);
      outputCssPath = path.resolve(backendCssPath, moduleName);
    }
  } else {
    // No module name provided, use default root paths
    entryPath = path.resolve(baseSrcPath, 'index.tsx');
    templatePath = path.resolve(baseSrcPath, 'index.html');
    outputPath = baseDistPath; // Output to dist
  }

  // Determine final output path based on environment
  const finalOutputPath = (env.WEBPACK_BUILD || process.env.NODE_ENV === 'production') && moduleName 
    ? outputJsPath 
    : outputPath;

  // 準備 plugins 陣列
  const plugins = [];
  
  // 只有在不跳過 HTML 時才添加 HtmlWebpackPlugin
  if (!skipHtml) {
    plugins.push(
      new HtmlWebpackPlugin({
        template: templatePath, // Use dynamic template path
        filename: 'index.html', // Always output as index.html in the root
      })
    );
  }
  
  // 添加 CSS 提取插件（僅在生產環境）
  if (env.WEBPACK_BUILD || process.env.NODE_ENV === 'production') {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: moduleName 
          ? `../../css/${moduleName}/${moduleName}.css` 
          : 'styles.css',
      })
    );
  }

  // Return the webpack configuration object
  return {
    entry: entryPath, // Use dynamic entry path
    output: {
      path: finalOutputPath, // Dynamic output path based on env and module
      filename: moduleName ? `${moduleName}.js` : 'bundle.js',
      clean: true, // Clean the specific output directory
      publicPath: moduleName ? `/${moduleName}/` : '/',
    },
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
          use: 'ts-loader',
        },
        {
          test: /\.css$/,
          use: [
            (env.WEBPACK_BUILD || process.env.NODE_ENV === 'production') 
              ? MiniCssExtractPlugin.loader 
              : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [require('@tailwindcss/postcss'), require('autoprefixer')],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: plugins,
    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
      open: true, // 簡化開啟選項
      // Serve content from the correct base directory in dev mode
      static: {
        directory: moduleName ? path.resolve(__dirname, 'src', moduleName) : path.resolve(__dirname, 'src'),
      },
    },
    performance: {
      hints: false,
    },
    // Ensure mode is correctly passed
    mode: process.env.NODE_ENV || 'development',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: !skipLicense, // 當 skipLicense 為 true 時不提取註釋（不生成 LICENSE 文件）
          terserOptions: {
            format: {
              comments: skipLicense ? false : 'some', // 當 skipLicense 為 true 時忽略所有註釋
            },
          },
        }),
      ],
    },
  };
};