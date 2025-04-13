/**
 * 這個文件作為入口點，根據環境變量選擇加載不同的 webpack 配置
 */
module.exports = (env) => {
  // 判斷當前環境
  const isProd = env && (env.WEBPACK_BUILD || env.production || process.env.NODE_ENV === 'production');
  
  // 輸出相關信息
  console.log(`Running webpack in ${isProd ? 'production' : 'development'} mode`);
  
  // 根據環境導入對應的配置
  if (isProd) {
    return require('./webpack.prod')(env);
  } else {
    return require('./webpack.dev')(env);
  }
};