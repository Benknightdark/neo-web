import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css'; // 添加對 CSS 文件的導入
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
