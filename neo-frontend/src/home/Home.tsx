import React, { useState } from 'react';

const Home: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* 添加一個測試元素，使用自訂類 */}
        <div className="bg-blue-500 text-white p-4 mb-6 rounded-lg text-center ">
         【React】 如果您能看到這個藍色背景的方塊，說明 Tailwind CSS 已正確加載！
        </div>
        
        <h1 className="main-title text-center mb-6">測試自訂 Tailwind 類</h1>
        <div className="flex justify-center mb-8">
          <button className="custom-btn mr-4">自訂按鈕樣式</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
            Tailwind 內建樣式
          </button>
        </div>
        
        <header className="text-center mb-12 py-8 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg shadow-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-wide">歡迎來到我們的網站</h1>
          <p className="text-xl opacity-90">探索更多精彩內容</p>
        </header>
        
        <main className="flex flex-col gap-10">
          <div 
            className={`bg-white rounded-lg p-8 shadow-md text-center transition-all duration-300 cursor-pointer ${isHovered ? 'shadow-xl transform -translate-y-2' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">快速上手</h2>
            <p className="text-gray-600 mb-6">我們提供簡單易用的界面，讓您輕鬆開始使用我們的服務。</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 focus:outline-none">
              了解更多
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-blue-200 pb-2">專業服務</h3>
              <p className="text-gray-600">我們的團隊擁有豐富的經驗，能夠為您提供最專業的解決方案。</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-blue-200 pb-2">可靠支持</h3>
              <p className="text-gray-600">我們的客戶服務團隊隨時為您提供幫助和支持。</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b border-blue-200 pb-2">創新設計</h3>
              <p className="text-gray-600">我們不斷創新，為您提供最先進的功能和體驗。</p>
            </div>
          </div>
        </main>
        
        <footer className="mt-16 text-center py-6 border-t border-gray-200 text-gray-500">
          <p>© 2025 Neo Web. 保留所有權利。</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;