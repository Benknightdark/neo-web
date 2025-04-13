import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind-output.css'; // 直接引入模組資料夾中的 tailwind-output.css
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
