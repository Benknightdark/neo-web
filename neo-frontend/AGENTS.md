# Neo-Frontend 開發指引 (Nx Monorepo)

基於 **Nx Monorepo** 管理的 **Vue 3 / Vite 8 / TS 6 / Tailwind 4 前端離島架構**（非 SPA）。

## 架構概述

* **`apps/portal/`**：主模組 `portal` 及其子離島應用（`home`、`introduction`、`privacy`），各自擁有獨立的 `index.html`、`project.json` 與 `vite.config.ts`。
* **`libs/`**：跨模組共享庫。
  * `libs/shared/vue-components`：共享 Vue 元件（如 `LayoutComponent.vue`），透過 `@neo-frontend/shared/vue-components` 引用。
  * `libs/shared/styles`：全域 Tailwind CSS 樣式。
* **`deploy/portal/`**：整合所有離島編譯產出的最終發佈目錄。

核心機制：
* **Vue 共享庫外置化**：Vite 打包時排除 Vue (`external: ['vue']`)，運行期透過 `importmap` 共用 `deploy/portal/lib/vue3/vue.esm-browser.min.js`。
* **SWA 路由重定向**：以 `deploy/portal/staticwebapp.config.json` 將 `/` 轉發至 `/home/`。

## 驗證與開發指令

```bash
# 本地開發伺服器 (啟動主模組，將自動並行執行所有子模組)
npm start                     # 啟動 portal 主模組下所有子模組 (預設)
npm start portal              # 啟動 portal 主模組下所有子模組 (3001/3002/3003 並行)

# 程式碼驗證與建置
npx nx run <project-name>:typecheck # 僅對修改的專案跑型別檢查 (如：npx nx run home:typecheck)
npx nx affected -t typecheck        # 僅對受本次修改影響的專案跑型別檢查
npx nx test <project-name>    # 僅針對修改的專案跑單元測試 (如：npx nx test home)
npx nx affected -t test       # 僅測試受本次修改影響的專案
npm run build <main>          # 編譯指定主模組下所有子模組 (如：npm run build portal)
npm run build <main>/<sub>    # 僅編譯指定離島子模組 (如：npm run build portal/home)
npx eslint <file-path> --fix  # 僅對修改的檔案跑 ESLint 校驗與自動修復 (如：npx eslint apps/portal/home/src/Home.vue --fix)
npx nx format:write           # 僅對 Git 本次修改的檔案跑 Prettier 格式化美化

# 測試 SWA 本地代理路由 (需先編譯主模組)
cd deploy/portal && npx @azure/static-web-apps-cli start local-deploy
```

## 開發規範

* **Composition API** — 統一採用 `<script setup lang="ts">`，以 TypeScript 定義 props 與 emits。
* **共享庫引用** — 共用元件與樣式統一放置於 `libs/`，各 App 透過 TS Path mapping 引用。
* **Tailwind CSS v4** — 優先使用 Utility Classes，嚴禁寫死自訂 CSS；需支援暗黑模式 (`dark:`) 並配置過渡動畫。
* **測試規範** — 各模組必須附帶單元測試 (`*.test.ts`)，修改程式後需確保受影響模組的測試全數通過。
