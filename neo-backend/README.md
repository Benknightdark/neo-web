# Neo-Backend 後端開發文件

本目錄包含了基於 **.NET 10.0** 與 **ASP.NET Core MVC** 架構構建的後端伺服器應用程式。它同時作為前端模組編譯打包後的靜態資源宿主伺服器。

---

## 🛠️ 開發環境需求

在開始之前，請確保您的開發環境已安裝以下組件：
*   **.NET SDK**: 10.0 或更高版本。
*   **推薦 IDE**: Visual Studio 2022 / VS Code (需安裝 C# Dev Kit 擴充套件)。

---

## 📂 目錄結構說明

後端專案目錄遵循標準的 ASP.NET Core MVC 結構：

```
neo-backend/
├── Controllers/            # 控制器 (處理 HTTP 請求與路由映射)
│   └── HomeController.cs   # 首頁控制器
├── Models/                 # 數據模型與視圖模型 (ViewModel)
├── Views/                  # Razor 視圖模板 (伺服器端渲染 HTML 骨架)
│   ├── Home/               # HomeController 對應的視圖目錄
│   │   ├── Index.cshtml    # 首頁 (Home 模組掛載點)
│   │   └── Privacy.cshtml  # 隱私政策頁 (Privacy 模組掛載點)
│   └── Shared/             # 共享視圖模板 (包含全域版面配置 _Layout.cshtml)
├── TagHelpers/             # 自訂 Razor 標籤協助程式
│   └── ImportMapTagHelper.cs # import-map 標籤處理器 (處理 ESM 加載與快取控制)
├── wwwroot/                # 靜態資源根目錄 (前端打包後的輸出位置)
│   ├── css/               # 前端編譯輸出的模組專屬 CSS
│   ├── js/                # 前端編譯輸出的模組專屬 JS (ES module)
│   └── lib/               # 第三方共享庫 (如 vue.esm-browser.min.js)
├── Program.cs             # 應用程式進入點與服務管道設定
└── neo-backend.csproj     # .NET 10.0 專案設定檔
```

---

## 🔗 前後端整合關鍵技術：Import Maps

後端使用 ES modules (ESM) 的原生瀏覽器載入方式來與 Vue 3 進行整合，並藉由自訂的 `<import-map>` 標籤處理第三方依賴：

### 1. 什麼是 Import Map？
由於前端各個獨立模組（例如 `home.js`、`privacy.js`）在編譯時將 Vue 排除在 Bundle 之外 (`external: ['vue']`)，因此瀏覽器在執行這些模組時需要找到對應的 `"vue"` 對象。我們在 `Views/Shared/_Layout.cshtml` 中定義了 Import Map，將其指向本地的 ESM 檔案：

```html
<import-map>
{
    "imports": {
        "vue": "/lib/vue3/vue.esm-browser.min.js"
    }
}
</import-map>
```

### 2. ImportMapTagHelper 的防快取機制
在專案編譯執行後，位於 `TagHelpers/ImportMapTagHelper.cs` 的 C# 類別會自動攔截 `<import-map>` 標籤，並將其替換為標準的 `<script type="importmap">`。

為了避免瀏覽器快取舊的程式碼，TagHelper 會為所有以 `/` 開頭的本地資源路徑（例如 `/lib/...`）**自動添加版本雜湊值**（例如 `vue.esm-browser.min.js?v=hash_code`），達成自動 Cache-Busting。

---

## 💻 常用 CLI 開發指令

在 `neo-backend/` 目錄下，您可以使用 .NET CLI 執行以下任務：

### 1. 還原 NuGet 套件
```bash
dotnet restore
```

### 2. 編譯專案
```bash
dotnet build
```

### 3. 啟動後端服務
```bash
dotnet run
```
啟動後，伺服器預設會監聽：
*   安全連線：`https://localhost:7146`
*   非安全連線：`http://localhost:5058`

### 4. 專案清理
```bash
dotnet clean
```

### 5. 發布部署版本
```bash
dotnet publish -c Release -o ./publish
```

---

## 🛡️ AI Agent 開發守則
當 AI 協作助手在此目錄進行開發時，必須嚴格遵守 [後端 Agent 規範 (neo-backend/AGENTS.md)](file:///Users/ben/Projects/neo-web/neo-backend/AGENTS.md) 中所制定的 Controller 設計原則與 TagHelper 使用規定。
