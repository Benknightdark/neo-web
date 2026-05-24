import { createApp } from 'vue';
import App from './App.vue';
// 直接引入樣式，而不是通過中間文件
import './style.css';

// 在頁面完全加載後創建和掛載 Vue 應用
document.addEventListener('DOMContentLoaded', () => {
  const app = createApp(App);

  // Vue 3 錯誤處理
  app.config.errorHandler = (err, instance, info) => {
    console.error('Vue 錯誤:', err);
    console.error('錯誤來源:', info);
  };

  // 掛載應用
  app.mount('#app');
});
