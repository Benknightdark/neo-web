import React, { useState } from 'react';

const Home: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>歡迎來到我們的網站</h1>
        <p className="subtitle">探索更多精彩內容</p>
      </header>
      
      <main className="content-section">
        <div className="feature-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ transform: isHovered ? 'translateY(-10px)' : 'translateY(0)' }}
        >
          <div className="card-icon">🚀</div>
          <h2>快速上手</h2>
          <p>我們提供簡單易用的界面，讓您輕鬆開始使用我們的服務。</p>
          <button className="learn-more-btn">了解更多</button>
        </div>
        
        <div className="info-section">
          <div className="info-card">
            <h3>專業服務</h3>
            <p>我們的團隊擁有豐富的經驗，能夠為您提供最專業的解決方案。</p>
          </div>
          
          <div className="info-card">
            <h3>可靠支持</h3>
            <p>我們的客戶服務團隊隨時為您提供幫助和支持。</p>
          </div>
          
          <div className="info-card">
            <h3>創新設計</h3>
            <p>我們不斷創新，為您提供最先進的功能和體驗。</p>
          </div>
        </div>
      </main>
      
      <footer className="home-footer">
        <p>© 2025 Neo Web. 保留所有權利。</p>
      </footer>
    </div>
  );
};

export default Home;