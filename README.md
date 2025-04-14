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

Neo-Web 是一個使用 .NET 9.0 作為後端、React 和 Vue 作為前端的全端網頁應用。專案採用模組化設計，前端模組可以獨立開發並按需打包部署到後端。

### 主要技術棧

- **後端**：.NET 9.0、ASP.NET Core MVC
- **前端**：React 19、Vue、TypeScript、Tailwind CSS
- **構建工具**：Vite 6、npm

## 系統需求

在開始開發前，請確保您的系統已安裝以下軟體：

- **Node.js**：v20.0.0 或更高版本
- **.NET SDK**：.NET 9.0 或更高版本
- **IDE 推薦**：Visual Studio 2022、Visual Studio Code 配合 C# 擴展

## 專案結構

專案採用以下結構組織代碼：

```
neo-web/
├── neo-web.sln                 # 解決方案文件
├── neo-backend/                # 後端 .NET 專案
│   ├── Controllers/            # 控制器
│   ├── Models/                 # 數據模型
│   ├── Views/                  # 視圖模板
│   ├── wwwroot/                # 靜態資源目錄
│   │   ├── css/               # 樣式文件
│   │   ├── js/                # 腳本文件
│   │   └── lib/               # 第三方庫
│   ├── Program.cs             # 程序入口點
│   └── neo-backend.csproj     # 專案配置文件
└── neo-frontend/              # 前端專案
    ├── src/                   # 源代碼目錄
    │   ├── base-style.css     # 全局樣式
    │   ├── home/              # 首頁模組
    │   │   ├── App.tsx        # React 組件
    │   │   ├── Home.tsx       # 頁面組件
    │   │   ├── index.html     # HTML 模板
    │   │   ├── index.tsx      # 入口文件
    │   │   └── style.css      # 模組樣式
    │   └── privacy/           # 隱私頁模組
    │       ├── Privacy.vue    # Vue 組件
    │       ├── index.html     # HTML 模板
    │       ├── index.ts       # 入口文件
    │       └── style.css      # 模組樣式
    ├── scripts/               # 構建腳本
    │   ├── build-backend.js   # 模組打包腳本
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

### 2. 安裝後端相依套件

```bash
cd neo-backend
dotnet restore
```

### 3. 安裝前端相依套件

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

   後端服務會在 https://localhost:5001 或 http://localhost:5000 啟動。

2. **API 開發**

   在 `Controllers` 資料夾中新增或修改控制器。

3. **視圖開發**

   在 `Views` 資料夾中新增或修改視圖模板。

### 前端開發

1. **啟動前端開發服務器**

   ```bash
   cd neo-frontend
   npm start
   ```

   前端開發服務器會在 http://localhost:3000 啟動。

2. **模組開發**

   每個模組應包含以下文件：
   - `index.ts` 或 `index.tsx`：模組入口點
   - 組件文件（`.tsx` 或 `.vue`）
   - `style.css`：模組專用樣式

3. **新增模組**

   在 `src` 目錄下創建新的資料夾，並包含必要的入口文件：

   ```bash
   mkdir -p src/new-module
   touch src/new-module/index.tsx src/new-module/NewModule.tsx src/new-module/style.css
   ```

## 打包與部署

### 前端打包

前端模組可以單獨或批量打包部署到後端：

1. **打包單個模組**

   ```bash
   cd neo-frontend
   npm run build <模組名稱>
   ```

   例如：`npm run build home`

2. **打包所有模組**

   ```bash
   cd neo-frontend
   npm run build
   ```

3. **打包過程說明**

   打包流程會：
   - 根據模組名稱創建臨時的 Vite 配置文件
   - 檢測模組使用的框架（React 或 Vue）
   - 編譯並優化模組代碼
   - 生成 JS 和 CSS 資源
   - 將資源複製到後端的 `wwwroot` 目錄中相應的位置
   
   打包完成後，資源會位於：
   - JS 文件：`neo-backend/wwwroot/js/{模組名稱}/{模組名稱}.js`
   - CSS 文件：`neo-backend/wwwroot/css/{模組名稱}/{模組名稱}.css`

### 後端打包與發佈

1. **打包後端應用**

   ```bash
   cd neo-backend
   dotnet publish -c Release
   ```

2. **發佈到 IIS 或其他宿主環境**

   ```bash
   dotnet publish -c Release -o ./publish
   ```

   發佈後的檔案位於 `./publish` 資料夾中，可以直接部署到 IIS 或其他支援 .NET 的宿主環境。

## 故障排除

### 常見問題

1. **前端模組打包失敗**

   - 確認模組目錄下有 `index.ts` 或 `index.tsx` 入口文件
   - 檢查 console 錯誤訊息，修復缺失的引用或語法錯誤
   - 確認使用的框架（React/Vue）對應的插件已正確安裝

2. **後端找不到前端資源**

   - 確認資源是否已正確打包到 `wwwroot` 的對應目錄
   - 檢查後端是否啟用了靜態檔案服務
   - 確認資源引用路徑是否正確

3. **開發工具相容性問題**

   - Node.js 版本不相容：確保使用 Node.js v20.0.0 或更新版本
   - .NET SDK 版本不匹配：更新至 .NET 9.0 或設置適當的全域 JSON 配置

### 建議的開發工具

- **Visual Studio Code 擴展**：
  - C# Dev Kit
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - React 開發工具
  - Volar（Vue 3）

### 開發最佳實踐

1. 前端模組應保持獨立，避免跨模組依賴
2. 使用 Tailwind CSS 工具類減少自定義 CSS 的需求
3. 共用組件應放在專用目錄方便重用
4. 定期執行 `npm update` 和 `dotnet restore` 更新相依套件