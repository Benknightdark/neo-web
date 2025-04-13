const { merge } = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // 引入 CssMinimizerPlugin
const commonConfig = require('./webpack.common');

module.exports = (env) => {
  const common = commonConfig(env);
  const moduleName = env && env.module ? env.module : null;
  const skipLicense = env && env.skipLicense === 'true';

  // 定義 backend wwwroot 路徑
  const backendWwwrootPath = path.resolve(__dirname, '../neo-backend/wwwroot');
  const backendCssPath = path.resolve(backendWwwrootPath, 'css');
  const backendJsPath = path.resolve(backendWwwrootPath, 'js');

  let outputPath;
  if (moduleName) {
    // 如果有模組名稱，輸出到對應的後端路徑
    outputPath = path.resolve(backendJsPath, moduleName);
  } else {
    outputPath = path.resolve(backendWwwrootPath);
  }

  // 添加 CSS 提取插件
  common.plugins.push(
    new MiniCssExtractPlugin({
      filename: moduleName 
        ? `../../css/${moduleName}/${moduleName}.css` 
        : 'styles.css',
    })
  );

  // 生產環境設定
  return merge(common, {
    mode: 'production',
    output: {
      path: outputPath,
      filename: moduleName ? `${moduleName}.js` : 'bundle.js',
      clean: true,
      publicPath: moduleName ? `/${moduleName}/` : '/',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader', // 移除 postcss-loader
          ],
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: !skipLicense, // 當 skipLicense 為 true 時不提取註釋
          terserOptions: {
            format: {
              comments: skipLicense ? false : 'some', // 當 skipLicense 為 true 時忽略所有註釋
            },
          },
        }),
        new CssMinimizerPlugin({ // 加入 CssMinimizerPlugin
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true }, // 移除所有註解
              },
            ],
          },
        }),
      ],
    },
  });
};