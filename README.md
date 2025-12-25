# Neo-Web 開發與打包文件

本文件詳細說明 Neo-Web 專案的開發環境設置、開發流程以及打包部署過程。

## 目錄

1. [專案概述](#專案概述)
2. [系統需求](#系統需求)
3. [專案結構](#專案結構)
4. [開發環境設置](#開發環境設置)
5. [開發流程](#開發流程)
6. [打包與部署](#打包與部署)
7. [故障排除](#故障排除)

## 專案概述

Neo-Web 是一個使用 **.NET 10.0** 作為後端、**Vue 3** 作為前端的全端網頁應用。專案採用模組化設計，前端模組可以獨立開發並按需打包部署到後端。

### 主要技術棧

- **後端**：.NET 10.0、ASP.NET Core MVC
- **前端**：Vue 3 (Composition API)、TypeScript、Tailwind CSS 4
- **構建工具**：Vite 7、npm

## 系統需求

在開始開發前，請確保您的系統已安裝以下軟體：

- **Node.js**：v20.0.0 或更高版本
- **.NET SDK**：.NET 10.0 或更高版本
- **IDE 推薦**：Visual Studio 2022、Visual Studio Code (配合 C# Dev Kit 與 Volar 擴展)

## 專案結構

專案採用以下結構組織代碼：

```
neo-web/
├── neo-web.sln                 # 解決方案文件
├── neo-backend/                # 後端 .NET 專案
│   ├── Controllers/            # 控制器 (MVC 路由入口)
│   ├── Models/                 # 數據模型
│   ├── Views/                  # 視圖模板 (Razor Pages)
│   ├── wwwroot/                # 靜態資源目錄 (前端打包後的輸出地)
│   │   ├── css/               # 模組樣式檔案
│   │   ├── js/                # 模組腳本檔案
│   │   └── lib/               # 第三方庫
│   ├── Program.cs             # 程序入口點
│   └── neo-backend.csproj     # 專案配置文件 (Target: net10.0)
└── neo-frontend/              # 前端專案
    ├── src/                   # 源代碼目錄
    │   ├── base-style.css     # 全局基礎樣式
    │   ├── home/              # 首頁模組 (Vue 3)
    │   │   ├── App.vue        # 根組件
    │   │   ├── index.ts       # 入口文件
    │   │   └── style.css      # 模組專屬樣式
    │   └── privacy/           # 隱私頁模組 (Vue 3)
    │       ├── Privacy.vue    # 頁面組件
    │       ├── index.ts       # 入口文件
    │       └── style.css      # 模組專屬樣式
    ├── scripts/               # 構建腳本
    │   ├── build.js           # 模組打包與部署腳本
    │   └── vite-module-template.js # 構建配置模板
    ├── package.json           # npm 配置文件
    ├── vite.config.ts         # Vite 配置
    ├── tailwind.config.js     # Tailwind 配置
    └── tsconfig.json          # TypeScript 配置
```

## 開發環境設置

### 1. 克隆專案

```bash
git clone <專案倉庫URL>
cd neo-web
```

### 2. 安裝相依套件

**後端：**
```bash
cd neo-backend
dotnet restore
```

**前端：**
```bash
cd ../neo-frontend
npm install
```

## 開發流程

### 後端開發

1. **啟動後端服務**

   ```bash
   cd neo-backend
   dotnet run
   ```

   服務通常會在 https://localhost:7146 或 http://localhost:5058 啟動。

2. **MVC 開發**
   - 在 `Controllers` 中新增控制器。
   - 在 `Views` 中新增 Razor 視圖，並引用打包後的資源。

### 前端開發

1. **啟動 Vite 開發伺服器**

   ```bash
   cd neo-frontend
   npm start
   ```

   開發伺服器預設於 http://localhost:3000。

2. **模組開發規範**
   - 每個模組必須包含 `index.ts` 作為入口點。
   - 使用 Vue 3 單檔案組件 (`.vue`) 進行開發。
   - 樣式應優先使用 Tailwind CSS 類別。

3. **新增模組**
   在 `src` 目錄下創建資料夾：
   ```bash
   mkdir -p src/new-page
   touch src/new-page/index.ts src/new-page/App.vue src/new-page/style.css
   ```

## 打包與部署

### 前端自動化打包

前端模組會被編譯並直接部署到後端的 `wwwroot`：

1. **打包特定模組**
   ```bash
   npm run build <模組名稱>
   # 例如: npm run build home
   ```

2. **打包所有模組**
   ```bash
   npm run build
   ```

3. **打包產出位置**
   - JS 檔案：`neo-backend/wwwroot/js/{模組名稱}/{模組名稱}.js`
   - CSS 檔案：`neo-backend/wwwroot/css/{模組名稱}/{模組名稱}.css`

### 後端發佈

```bash
cd neo-backend
dotnet publish -c Release -o ./publish
```

## 故障排除

### 常見問題

1. **TypeScript 類型錯誤**
   - 確保 `tsconfig.json` 中的 `jsx` 設置為 `preserve`。
   - 檢查是否殘留了 React 的類型引用。

2. **樣式未更新**
   - 確認 `npm run build` 已正確執行。
   - 檢查瀏覽器快取或後端 `wwwroot` 檔案是否已覆蓋。

3. **找不到入口文件**
   - 模組目錄內必須存在 `index.ts`。本專案已移除對 `.tsx` 的支援。

### 建議工具

- **VS Code 擴展**：
  - **C# Dev Kit**: .NET 開發必備。
  - **Volar (Vue - Official)**: Vue 3 開發環境。
  - **Tailwind CSS IntelliSense**: 類別提示。

### 開發最佳實踐

1. **模組解耦**：避免模組間的直接引用，共用邏輯應提取至公用目錄。
2. **CSS 現代化**：善用 Tailwind 4 的新特性，減少自定義 CSS 量。
3. **定期更新**：執行 `dotnet restore` 與 `npm install` 保持環境最新。
