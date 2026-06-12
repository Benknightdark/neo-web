# Neo-Frontend 開發指引 (neo-frontend/AGENTS.md)

定義 neo-frontend (Vue 3 + Vite + TS + Tailwind 4) 目錄的離島多模組架構、指令與開發規範。

---

## 🗺️ 離島多模組架構與編譯邏輯

本專案非標準單頁面應用 (SPA)，採用**多模組獨立編譯部署（離島架構）**。

```
neo-frontend/
├── deploy/                  # 部署目錄 (靜態託管根目錄)
│   ├── lib/vue3/            # 共享 Vue 3 ESM 瀏覽器版
│   ├── home/                # 首頁模組
│   ├── introduction/        # 介紹模組
│   ├── privacy/             # 隱私政策模組
│   └── staticwebapp.config.json  # SWA 路由配置 (將 / 重定向至 /home/)
├── scripts/
│   ├── build.js             # 自訂離島編譯腳本
│   └── vite-module-template.js  # 臨時 Vite 編譯配置範本
├── src/                     # 原始碼
│   ├── components/          # 全域共享 Vue 元件
│   ├── home/                # Home 模組目錄 (index.ts, Home.vue, index.html)
│   ├── introduction/        # Introduction 模組目錄
│   └── privacy/             # Privacy 模組目錄
├── package.json             # 專案依賴與指令
├── tsconfig.json            # TypeScript 配置
└── vite.config.ts           # Vite 配置 (開發伺服器與測試專用)
```

### ⚙️ 核心打包機制
1. **模組入口**：`src/` 底下包含 `index.ts` 的子目錄即為獨立模組。
2. **Vue 外置化**：編譯時排除 Vue (`external: ['vue']`)，不打包進模組 JS。
3. **共用 Vue 實例**：編譯輸出的 `index.html` 透過 `<script type="importmap">` 將 `vue` 映射至 `/lib/vue3/vue.esm-browser.min.js`。
4. **自訂構建流程**：`npm run build` 呼叫 `scripts/build.js`，動態生成臨時設定並打包各模組至 `deploy/`。

---

## 🛠️ 開發驗證指令

* **啟動開發伺服器**：
  ```bash
  npm start
  ```
  本地伺服器：`http://localhost:3000` (造訪如 `http://localhost:3000/src/home/index.html` 偵錯)。
* **編譯所有模組**：
  ```bash
  npm run build
  ```
* **編譯單一模組**：
  ```bash
  npm run build <模組名稱>  # 例: npm run build home
  ```
* **TypeScript 型別檢查**：
  ```bash
  npm run typecheck
  ```
  *修改代碼後必須通過型別檢查。*
* **執行單元測試**：
  ```bash
  npm run test
  ```
* **代碼排版與語法檢查**：
  ```bash
  npm run lint    # ESLint 校驗與自動修復
  npm run format  # Prettier 格式化
  ```

---

## 🎯 Vue 3 & Tailwind 4 開發規範

### 1. Vue 元件開發
* **Composition API**：一律使用 `<script setup lang="ts">`。
* **強型別定義**：使用 TypeScript 聲明 props 與 emits：
  ```typescript
  const props = defineProps<{
    title: string;
    isActive?: boolean;
  }>();
  ```

### 2. Tailwind CSS v4 樣式
* 使用 Tailwind CSS v4 實作樣式。
* 優先使用 Tailwind Utility Classes，禁止在元件編寫大量自訂 CSS。
* UI 需支援暗黑模式 (`dark:`)，使用過渡效果 (`transition-all duration-300`)。

### 3. 測試撰寫
* 每個模組目錄需附帶單元測試 `*.test.ts` (使用 `@vue/test-utils` 與 `vitest`)。
* 修改 DOM 或元件行為後，必須確認 `npm run test` 全數通過。
