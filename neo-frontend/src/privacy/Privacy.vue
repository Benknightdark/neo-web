<template>
  <div class="privacy-container">
    <header class="privacy-header">
      <h1>【Vue】隱私政策</h1>
      <p class="subtitle">最後更新：2025年4月14日</p>
    </header>

    <div class="privacy-content">
      <div class="intro-card">
        <p>歡迎訪問我們的隱私政策頁面。我們非常重視您的隱私和個人資訊安全。</p>
      </div>

      <section class="policy-section">
        <div class="section-header">
          <div class="icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <h2>我們收集哪些資訊</h2>
        </div>
        <div class="section-content">
          <p>
            當您使用我們的服務時，我們可能會收集某些個人信息，例如您的姓名、電子郵件地址和使用數據等。
          </p>
          <ul>
            <li>基本帳戶資訊，如您的姓名和電子郵件</li>
            <li>登入資訊和設備識別碼</li>
            <li>您與我們服務互動的使用數據</li>
            <li>您主動提供給我們的其他資訊</li>
          </ul>
        </div>
      </section>

      <section class="policy-section">
        <div class="section-header">
          <div class="icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <h2>我們如何使用您的資訊</h2>
        </div>
        <div class="section-content">
          <p>我們使用收集的資訊來提供、維護和改進我們的服務，並開發新的服務。</p>
          <p>我們可能會使用您的資訊來：</p>
          <ul>
            <li>提供和改進我們的產品及服務</li>
            <li>與您溝通有關我們的服務和更新</li>
            <li>分析我們服務的使用情況</li>
            <li>提供個人化的內容和建議</li>
          </ul>
        </div>
      </section>

      <section class="policy-section">
        <div class="section-header">
          <div class="icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2>資訊安全</h2>
        </div>
        <div class="section-content">
          <p>我們實施各種安全措施來保護您的個人資訊安全。這些措施包括：</p>
          <ul>
            <li>使用加密技術保護數據傳輸</li>
            <li>定期審查和更新我們的安全實踐</li>
            <li>限制僅授權人員才能訪問個人資訊</li>
            <li>員工培訓關於數據安全和隱私的最佳實踐</li>
          </ul>
        </div>
      </section>

      <section class="policy-section">
        <div class="section-header">
          <div class="icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2>您的選擇和權利</h2>
        </div>
        <div class="section-content">
          <p>您有權利：</p>
          <ul>
            <li>訪問您的個人資訊</li>
            <li>更正不準確的資訊</li>
            <li>刪除您的個人資訊</li>
            <li>對您資訊的使用提出異議</li>
            <li>選擇退出特定的資訊收集</li>
          </ul>
        </div>
      </section>
    </div>

    <footer class="privacy-footer">
      <p>
        如果您對我們的隱私政策有任何疑問，請聯絡我們：<a href="mailto:privacy@neocompany.com"
          >privacy@neocompany.com</a
        >
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.privacy-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #333;
}

.privacy-header {
  margin-bottom: 2.5rem;
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.privacy-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.subtitle {
  color: #666;
  font-size: 0.9rem;
}

.intro-card {
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.policy-section {
  margin-bottom: 3rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.policy-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.icon-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
}

.icon-container svg {
  width: 24px;
  height: 24px;
}

h2 {
  font-size: 1.5rem;
  margin: 0;
  color: #2c3e50;
}

.section-content {
  padding-left: 3.5rem;
}

.section-content p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

ul {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}

.privacy-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

a {
  color: #3498db;
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #2980b9;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .privacy-container {
    padding: 1.5rem;
  }

  .privacy-header h1 {
    font-size: 2rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .icon-container {
    margin-bottom: 1rem;
    margin-right: 0;
  }

  .section-content {
    padding-left: 0;
  }
}
</style>
