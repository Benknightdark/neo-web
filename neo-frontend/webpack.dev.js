const { merge } = require('webpack-merge');
const path = require('path');
const commonConfig = require('./webpack.common');

module.exports = (env) => {
  const common = commonConfig(env);
  const moduleName = env && env.module ? env.module : null;

  // 開發環境設定
  return merge(common, {
    mode: 'development',
    output: {
      path: moduleName ? path.resolve(__dirname, 'dist', moduleName) : path.resolve(__dirname, 'dist'),
      filename: moduleName ? `${moduleName}.js` : 'bundle.js',
      clean: true,
      publicPath: '/', // 簡化 publicPath
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'], // 簡化配置，移除 postcss-loader
        },
      ],
    },
    devtool: 'inline-source-map',
    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
      open: true,
      static: {
        directory: moduleName 
          ? path.resolve(__dirname, 'src', moduleName) 
          : path.resolve(__dirname, 'src'),
      },
    },
  });
};