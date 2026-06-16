# Neo-Frontend 開發指引

Vue 3 + Vite 8 + TypeScript 6 + Tailwind CSS 4，採用**離島多模組架構**（非 SPA）。

## 架構概述

`src/` 下含 `index.ts` 的子目錄即為獨立模組，`scripts/build.js` 逐一打包至 `deploy/<模組>/`。

核心機制：
- Vue 編譯時外置化（`external: ['vue']`），各模組透過 `importmap` 共用 `/lib/vue3/vue.esm-browser.min.js`。
- `deploy/staticwebapp.config.json` 配置 `/` → `/home/` 重定向。

## 驗證指令

```bash
npm start                # 開發伺服器 (http://localhost:3000)
npm run build            # 編譯所有模組
npm run build <模組名稱>  # 編譯指定模組 (例如：home)
npm run typecheck        # TypeScript 型別檢查（修改後必須通過）
npm run test             # 單元測試（修改後必須全數通過）
npm run lint             # ESLint 校驗與自動修復
npm run format           # Prettier 格式化

# 測試 SWA 代理路由 (須先 npm run build)
cd deploy && npx @azure/static-web-apps-cli start local-deploy
```

## 開發規範

- **Composition API** — 一律使用 `<script setup lang="ts">`，以 TypeScript 定義 props 與 emits。
- **Tailwind CSS v4** — 優先使用 Utility Classes，禁止大量自訂 CSS；支援暗黑模式 (`dark:`)，使用過渡效果。
- **測試** — 每個模組附帶 `*.test.ts`（`@vue/test-utils` + `vitest`），修改後確認全數通過。
