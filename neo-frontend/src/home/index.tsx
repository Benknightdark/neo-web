import React from 'react';
import ReactDOM from 'react-dom/client';
import '../../src/tailwind-output.css'; // 引入由 Tailwind CLI 生成的 CSS 文件
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
