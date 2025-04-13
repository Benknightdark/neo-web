import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css'; // 直接在入口文件中引入樣式
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
