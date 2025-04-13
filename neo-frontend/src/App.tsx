import React from 'react';
import Home from './home/Home'; // 匯入 Home 元件

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Neo Web 專案</h1>
          <p className="text-gray-600">
            這是一個使用 React, TypeScript, Webpack 和 Tailwind CSS 建立的專案。
          </p>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">技術堆疊</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>React 18 - 前端框架</li>
              <li>TypeScript - 靜態類型檢查</li>
              <li>Webpack 5 - 打包與構建工具</li>
              <li>Tailwind CSS - 實用優先的 CSS 框架</li>
            </ul>
          </div>
          
          <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300">
            開始使用
          </button>
        </div>
      </div>
      <Home /> {/* 在這裡使用 Home 元件 */}
    </div>
  );
};

export default App;