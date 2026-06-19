# Nx + Vite + Vue 3 + TypeScript + Tailwind 4 前端離島多模組單體庫 (Monorepo) 開發規格書

## 一、 專案概述 (Project Overview)
本專案採行**前端離島多模組（Islands Architecture）單體庫 (Monorepo)** 架構，旨在建立一個高效、高可複用性且易於擴充的多模組系統。系統核心由全域配置基礎環境、多個高度自治的「獨立離島模組（應用程式）」，以及「共用函式庫」組成。

各離島模組皆為非 SPA（單頁應用）的自治應用，具備獨立的進入點，且彼此在邏輯與部署上完全解耦。在編譯時，各模組排除 Vue 核心庫（`external: ['vue']`），並在運行期透過 `importmap` 共享部署目錄下的統一 Vue 執行期模組。技術團隊可針對單一模組進行個別建構、開發，或進行批量編譯，所有發佈產出物將統整至 `deploy/` 目錄中，以便透過 Azure Static Web Apps (SWA) CLI 進行自動化託管與 API 反向代理。

---

## 二、 技術棧與核心套件規範 (Tech Stack Specs)

| 技術項目 | 採用版本/規範 | 說明 |
| :--- | :--- | :--- |
| **工作區管理** | Nx | 負責工作區依賴圖表分析、增量建構、工作流快取調度。 |
| **核心框架** | Vue 3 (Composition API) | 全面導入 `<script setup lang="ts">` 語法糖。 |
| **建構工具** | Vite | 負責本地開發 HMR 熱更新及生產環境的高速打包。 |
| **程式語言** | TypeScript | 啟用嚴格模式（`strict: true`），全面禁止使用 `any` 型別。 |
| **樣式處理** | Tailwind CSS v4 | 使用現代化 CSS 驅動的 Utility Classes，減少不必要的自訂 CSS 樣式。 |
| **路由管理** | Vue Router / Native | 各離島模組獨立配置或不配置路由，視模組複雜度決定。 |
| **程式碼規範** | ESLint + Prettier | 搭配 `@nx/enforce-module-boundaries` 管控模組相依邊界。 |
| **共享機制** | Importmap | 透過外置化（`external: ['vue']`）將 Vue 核心庫抽離，於運行期共用單一 Vue 執行期模組。 |

---

## 三、 工作區目錄結構 (Directory Structure)

```text
neo-frontend/
├── apps/                          # 獨立離島模組目錄 (Applications)
│   ├── home/                      # 模組 A：首頁模組
│   │   ├── src/
│   │   │   ├── App.vue            # 模組根元件
│   │   │   ├── Home.vue           # 核心視圖元件
│   │   │   ├── Home.test.ts       # 單元測試
│   │   │   └── main.ts            # 模組獨立進入點 (取代原 index.ts)
│   │   ├── index.html             # 本地開發與部署入口頁面 (包含 importmap)
│   │   ├── project.json           # Nx 專案特定設定檔
│   │   └── vite.config.ts         # Vite 專案特定設定檔
│   │
│   ├── introduction/              # 模組 B：介紹模組 (結構同上)
│   └── privacy/                   # 模組 C：隱私權政策模組 (結構同上)
│
├── libs/                          # 核心共用功能庫目錄 (Libraries)
│   ├── shared/
│   │   ├── vue-components/        # 跨模組共用 Vue 元件庫
│   │   ├── data-access/           # 網路請求封裝 (Axios 實例、全域 API 攔截器、代理配置)
│   │   └── styles/                # 全域 Tailwind CSS 基礎設定與設計系統樣式
│
├── deploy/                        # 生產環境統一輸出與託管資料夾
│   ├── staticwebapp.config.json   # SWA 路由重定向設定檔 (如將 / 重定向至 /home/)
│   ├── swa-cli.config.json        # SWA CLI 代理與啟動設定檔
│   ├── lib/
│   │   └── vue3/
│   │       └── vue.esm-browser.min.js # 外置化的共享 Vue 庫
│   ├── home/                      # 模組 A 編譯產出物 (home.js, home.css, index.html)
│   ├── introduction/              # 模組 B 編譯產出物
│   └── privacy/                   # 模組 C 編譯產出物
│
├── nx.json                        # Nx 工作區全域配置管理檔
├── package.json                   # 依賴套件與全域指令定義
└── tsconfig.base.json             # TypeScript 全域路徑映射配置檔 (Path Mapping)
```

---

## 四、 共用功能庫設計規範 (Shared Libraries Layout)

### 1. 全域樣式與變數管理 (`libs/shared/styles`)
全域樣式採用 Tailwind CSS v4，並於共享庫中定義基礎主題變數、全域 CSS 屬性與字型規範。各獨立模組的進入點無須重複導入全量樣式，由各模組的 `index.html` 或 Vite 設定於打包時自動注入引用。

### 2. 資料訪問層基礎結構 (`libs/shared/data-access`)
封裝 Axios 實例，定義共用的 API 請求、響應攔截器，並抽離出基礎的 API 請求與響應介面。在本地開發時，所有模組透過 SWA CLI 或者是 Vite 的 Dev Server 代理，將對 `/api/*` 的請求轉發給後端服務。

```typescript
// libs/shared/data-access/src/lib/types/api.interface.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

### 3. 共用 UI 元件庫 (`libs/shared/vue-components`)
所有共用元件必須具備高度可配置性（透過 Vue Props 與 Slots 實作）。
* **範例：** 封裝全域通用按鈕、輸入框與彈出視窗組件，各模組僅需自定義屬性與事件，即可呈現一致的 UI 視覺風格。

---

## 五、 離島模組開發與測試規範 (Islands Module Specification)

每個獨立離島模組（如 `home`）內部應維持一致的頁面結構與開發風格，確保團隊程式碼品質：

### 1. 入口 HTML 檔案配置 (`index.html`)
離島模組在本地開發與部署時，均採用 `importmap` 機制來共享運行期的 Vue：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Neo Web - HOME</title>
    <script type="importmap">
    {
        "imports": {
            "vue": "/lib/vue3/vue.esm-browser.min.js"
        }
    }
    </script>
</head>
<body class="bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
    <div id="root"></div>
    <script type="module" src="./src/main.ts"></script>
</body>
</html>
```

### 2. 測試規範 (Testing Spec)
每個模組必須包含對應的單元測試（如 `Home.test.ts`），透過 `@vue/test-utils`、`vitest` 及 `happy-dom` 進行行爲驗證，確保邏輯的正確性：

```typescript
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Home from './Home.vue';

describe('Home.vue', () => {
  it('renders correctly', () => {
    const wrapper = mount(Home);
    expect(wrapper.exists()).toBe(true);
  });
});
```

---

## 六、 精準建構與統一發佈策略 (Build & Deployment Strategy)

本專案的核心需求在於**彈性的編譯模式**與**集中的產出管理**。我們透過各離島應用程式的 `project.json` 及專屬 `vite.config.ts` 的 `outDir` 與 `rollupOptions` 來落實此機制。

### 1. 各獨立模組的設定規範範例
在每個離島模組的設定檔中，將其輸出路徑強制導向根目錄下的 `deploy/{模組名稱}`，並指定 Vue 外置化。

**以 `apps/home/project.json` 為例：**
```json
{
  "name": "home",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "projectType": "application",
  "sourceRoot": "apps/home/src",
  "targets": {
    "build": {
      "executor": "@nx/vite:build",
      "outputs": ["{options.outputPath}"],
      "defaultConfiguration": "production",
      "options": {
        "outputPath": "deploy/home"
      }
    },
    "serve": {
      "executor": "@nx/vite:dev-server",
      "options": {
        "buildTarget": "home:build"
      }
    },
    "test": {
      "executor": "@nx/vite:test",
      "outputs": ["{options.reportsDirectory}"]
    }
  }
}
```

**以 `apps/home/vite.config.ts` 為例：**
```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/home',
  plugins: [
    vue(), 
    tailwindcss(), 
    nxViteTsPaths()
  ],
  build: {
    // 強制輸出到統一的 deploy 目錄
    outDir: '../../deploy/home',
    emptyOutDir: true,
    reportCompressedSize: true,
    rollupOptions: {
      // 排除 Vue 3，由 importmap 在運行時加載共享庫
      external: ['vue'],
      input: {
        home: './index.html'
      },
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      }
    }
  }
});
```

---

## 七、 全自動與手動發佈指令規範

在根目錄的 `package.json` 中配置快捷指令，開發團隊與 CI/CD 伺服器即可依需求靈活建構與啟動：

```json
"scripts": {
  "serve:home": "nx serve home",
  "serve:intro": "nx serve introduction",
  "build:home": "nx build home",
  "build:intro": "nx build introduction",
  "build:multi": "nx run-many -t build --projects=home,introduction",
  "build:all": "nx run-many -t build --all",
  "test:all": "nx run-many -t test --all"
}
```

* **情境一：個別啟動與開發模組**
  執行 `npm run serve:home`，僅會啟動首頁離島模組的本地 Vite 開發伺服器。
* **情境二：同時建立多個指定模組**
  執行 `npm run build:multi`，會同時啟動並行編譯（Parallel Build）所選定的模組，產出至 `deploy/` 中對應的目錄。
* **情境三：全模組一次性完整發佈**
  執行 `npm run build:all`，Nx 將掃描 `apps/` 下所有的離島模組並執行打包，將成果整合到 `deploy/`。

---

## 八、 後續部署與 SWA 整合說明

當建構結束後，運維人員或 CI/CD 自動化腳本僅需要針對 `deploy/` 進行整份封裝打包。專案採用 Azure Static Web Apps (SWA) CLI 託管靜態資源並進行 API 反向代理。

在發佈目錄下，需配置 `staticwebapp.config.json` 用於路由重寫與重定向，並配置 `swa-cli.config.json` 供本地與容器化環境測試。

#### (1) SWA 路由配置文件 (`deploy/staticwebapp.config.json`)
此配置檔負責處理多個獨立離島模組的路由重定向（例如首頁重定向）：

```json
{
  "routes": [
    {
      "route": "/",
      "redirect": "/home/"
    }
  ]
}
```

#### (2) SWA CLI 配置文件 (`deploy/swa-cli.config.json`)
此配置檔定義了 SWA CLI 的啟動參數，以及反向代理 `/api/*` 至後端 API 服務的設定：

```json
{
  "$schema": "https://aka.ms/azure/static-web-apps-cli/schema",
  "configurations": {
    "local-deploy": {
      "appLocation": ".",
      "outputLocation": ".",
      "apiDevserverUrl": "http://localhost:5058",
      "host": "localhost",
      "port": 4280
    },
    "container-deploy": {
      "appLocation": ".",
      "outputLocation": ".",
      "apiDevserverUrl": "http://neo-backend:5000",
      "host": "0.0.0.0",
      "port": 4280
    }
  }
}
```

#### (3) 啟動與託管指令
建構完成後，可以使用下列指令啟動 SWA CLI 來託管並進行 API 反向代理：

```bash
# 切換到發佈目錄並啟動本地託管與代理
cd deploy
npx @azure/static-web-apps-cli start local-deploy
```
這樣一來，SWA 服務將在 `http://localhost:4280` 啟動，所有對 `/api/*` 的請求都會被自動反向代理至預設的後端服務 `http://localhost:5058`。
