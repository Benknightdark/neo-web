# Neo-Web 全端專案說明文件 (Root)

Neo-Web 是一個採用 **混合式 (Hybrid) 全端架構** 的網頁應用程式。專案將強大的 **.NET 10.0 MVC** 後端與現代化的 **Vue 3 (Vite 8 + TS 6 + Tailwind 4)** 前端完美結合，前端組件以「模組島嶼 (Module Islands)」的形式嵌入後端 Razor Views 網頁中。

---

## 🗺️ 專案總覽地圖

本解決方案由以下兩個主要專案目錄構成，各自擁有獨立的開發說明文件：

*   📂 **[neo-backend/](file:///Users/ben/Projects/neo-web/neo-backend)**: ASP.NET Core 10.0 MVC 後端伺服器與靜態資源宿主。
    👉 *詳細開發指引請參閱：[後端開發文件 (neo-backend/README.md)](file:///Users/ben/Projects/neo-web/neo-backend/README.md)*
*   📂 **[neo-frontend/](file:///Users/ben/Projects/neo-web/neo-frontend)**: Vite 8 + Vue 3.5 + TS 6 前端模組島嶼源碼。
    👉 *詳細開發指引請參閱：[前端開發文件 (neo-frontend/README.md)](file:///Users/ben/Projects/neo-web/neo-frontend/README.md)*

---

## 🏗️ 混合式架構設計 (How it Works)

Neo-Web 採用「伺服器端路由 + 客戶端局部島嶼渲染」的混合模式：

1.  **後端路由與 HTML 骨架**：由 .NET MVC Controller 處理 HTTP 請求，並渲染 Razor 視圖（如 `Views/Home/Index.cshtml`）作為 HTML 外殼。
2.  **前端獨立模組**：前端代碼按模組（如 `home`, `privacy`）進行高內聚開發，各模組擁有獨立的 Vue 實例與 `index.ts` 入口。
3.  **自動打包與搬運**：執行前端編譯時，打包腳本 (`scripts/build.js`) 會使用 Vite 編譯各模組，並將產出的 JS/CSS 直接輸出至後端的 `neo-backend/wwwroot/` 目錄下。
4.  **ESM 動態加載與快取防護**：後端 Razor 視圖藉由自訂的 `<import-map>` 標籤（由 `ImportMapTagHelper` 驅動）在 Runtime 載入模組，並自動為本地資源加上版本雜湊碼（`?v=...`）進行 cache-busting，防止舊快取干擾。

---

## 🛠️ 全端快速開發流程

若要進行完整的全端整合開發，請按照以下步驟啟動服務：

### 第一步：安裝相依套件

*   **後端**還原：
    ```bash
    cd neo-backend
    dotnet restore
    ```
*   **前端**安裝：
    ```bash
    cd neo-frontend
    npm install
    ```

### 第二步：啟動雙端服務

1.  **啟動前端開發伺服器** (提供 Vite 熱重載測試，預設於 `http://localhost:5173`)：
    ```bash
    cd neo-frontend
    npm start
    ```
2.  **啟動後端伺服器** (主進入點，通常位於 `https://localhost:7146` 或 `http://localhost:5058`)：
    ```bash
    cd neo-backend
    dotnet run
    ```

### 第三步：模組編譯與發布 (Deploy)

當前端修改完成需要載入至後端 Razor 頁面時：

1.  **編譯前端模組**（分為以下兩種情況）：
    *   **情況 A：僅編譯特定模組**：
        ```bash
        cd neo-frontend
        npm run build <模組名稱>  # 例如: npm run build home
        ```
    *   **情況 B：編譯所有模組**：
        ```bash
        cd neo-frontend
        npm run build
        ```
2.  **發布後端 Release 版本**：
    ```bash
    cd neo-backend
    dotnet publish -c Release -o ./publish
    ```

---

## 🛡️ AI Agent 開發防禦網 (Harness)

本解決方案內置了高規格的 AI 輔助開發規則，請協作的 AI 助手務必遵守：
*   根目錄下的 **[AGENTS.md](file:///Users/ben/Projects/neo-web/AGENTS.md)** 提供了全專案級的 Agent Rules。
*   各子目錄中亦有針對性設計的本地 Agent 規則，請務必在工作前詳讀：
    *   [後端 Agent 規範 (neo-backend/AGENTS.md)](file:///Users/ben/Projects/neo-web/neo-backend/AGENTS.md)
    *   [前端 Agent 規範 (neo-frontend/AGENTS.md)](file:///Users/ben/Projects/neo-web/neo-frontend/AGENTS.md)
