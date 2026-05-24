# Neo-Frontend 前端開發文件

本目錄為獨立開發的前端單頁面應用程式 (SPA) 與模組島嶼 (Module Islands) 源碼路徑。我們採用最新的前端技術棧，並透過自動化腳本編譯輸出至後端的靜態資源目錄。

---

## 🛠️ 開發環境需求

* **Node.js**: v20.0.0 或更高版本。
* **套件管理工具**: npm (隨 Node.js 一併安裝)。
* **推薦 IDE 擴充套件**:
  * **Vue - Official (Volar)**: Vue 官方語法支援。
  * **Tailwind CSS IntelliSense**: 類別提示。

---

## 🚀 現代化前端技術棧

本前端專案已全面升級至最新世代的技術規格：
* **編譯器**: **Vite 8** (`^8.0.14`) — 極速的開發與模組打包速度。
* **程式語言**: **TypeScript 6** (`^6.0.3`) — 最嚴格且穩定的型別安全防禦。
* **前端框架**: **Vue 3.5** (`^3.5.34`) — 採用 Composition API (`<script setup>`)。
* **樣式系統**: **Tailwind CSS 4** (`^4.3.0`) — 使用 `@tailwindcss/vite` 原生編譯，完全擺脫舊版的 JS 設定配置。
* **測試框架**: **Vitest** (`^4.1.7`) 搭配 `@vue/test-utils` 與 **Happy DOM** — 提供毫秒級的組件單元測試反饋。

---

## 📂 目錄結構說明

```text
neo-frontend/
├── src/                   # 前端原始碼根目錄
│   ├── base-style.css     # 全域 Tailwind CSS 4 基礎設定與主題擴充
│   ├── components/        # 全域共享組件 (如 LayoutComponent.vue)
│   ├── home/              # 首頁模組 (獨立島嶼)
│   │   ├── App.vue        # 模組根組件
│   │   ├── Home.vue       # 主要內容頁組件
│   │   ├── Home.test.ts   # 首頁單元測試檔 (與組件同目錄鄰近放置)
│   │   ├── index.ts       # 模組打包進入點 (掛載 Vue 實例)
│   │   ├── index.html     # 開發階段模組獨立進入點
│   │   └── style.css      # 模組專屬 CSS
│   └── privacy/           # 隱私政策模組
├── scripts/               # 自動化打包與搬運腳本
│   ├── build.js           # 模組編譯與部署主腳本 (Vite build 封裝)
│   └── vite-module-template.js # 臨時 Vite 編譯設定檔模板
├── package.json           # npm 設定與依賴庫清單
├── vite.config.ts         # Vite 基礎配置與測試環境設定 ( happy-dom )
└── tsconfig.json          # TypeScript 6 設定配置
```

### 🔑 開發階段的 index.html 模組獨立性設計

在 `src/` 的各個模組資料夾（例如 `src/home/index.html`、`src/privacy/index.html`）中都包含了一個 `index.html`：
* **開發階段專用**：這些 `index.html` 是在本地開發階段（執行 `npm start` 啟動 Vite 開發伺服器時）專供 Vite 作為各模組獨立進入點所使用的網頁檔案。
* **避免模組競爭**：之所以為每個模組配置專屬的 `index.html`，是為了讓各模組完全解耦。這能**避免不同開發模組或獨立 Vue Islands 在開發時搶奪同一個根目錄 `index.html`**，進而保障了模組之間的獨立開發環境與高內聚性。
* **正式佈署時不依賴**：在正式環境中，這些 HTML 檔案完全不參與佈署，瀏覽器會直接讀取 .NET 後端提供的 Razor 視圖（如 `Views/Home/Index.cshtml`），並直接動態載入搬移至 `wwwroot` 底下的模組 JS 檔案。

---

## 🎨 Tailwind CSS 4 樣式配置規則

Tailwind 4 移除了舊有的 `tailwind.config.js` 機制。任何主題色系、字型或響應式中斷點的擴充，**一律使用 CSS 的 `@theme` 指令**。

請在 `src/base-style.css` 中進行主題擴充：
```css
@import "tailwindcss";

@theme {
  --color-primary-blue: #3498db;
  --color-accent-purple: #9b59b6;
  --font-display: "Outfit", sans-serif;
}
```

---

## 🧪 測試與驗證體系 (Test & Typecheck)

為保障代碼品質，專案配置了型別與測試的雙重驗證網：

### 1. TypeScript & Vue SFC 型別檢查
我們使用 `vue-tsc` 進行嚴格的靜態型別校驗：
```bash
npm run typecheck
```

### 2. Vitest 單元測試
測試檔採用鄰近源碼放置原則（例如 `Home.test.ts` 與 `Home.vue` 置於同目錄），模擬環境使用超高速的 `happy-dom`：
* **單次執行測試** (適合驗證與 CI)：
  ```bash
  npm run test
  ```
* **監聽熱重載測試** (適合本地開發互動)：
  ```bash
  npm run test:watch
  ```

---

## 💻 常用 CLI 開發指令

請在 `neo-frontend/` 目錄下執行以下 npm 指令：

* **安裝套件**：`npm install`
* **啟動 Vite 開發伺服器** (預設運行於 `http://localhost:3000`)：`npm start`
* **編譯並打包所有模組至後端 wwwroot**：`npm run build`
* **編譯並打包特定模組**：`npm run build <模組名稱>` (例如 `npm run build home`)
* **執行型別驗證**：`npm run typecheck`
* **執行單元測試**：`npm run test`

---

## 🛡️ AI Agent 開發守則

當 AI 協作助手在此目錄進行前端組件與邏輯開發時，必須嚴格遵守 [前端 Agent 規範 (neo-frontend/AGENTS.md)](file:///Users/ben/Projects/neo-web/neo-frontend/AGENTS.md) 中所制定的樣式宣告與 Vue 外部依賴規範。
