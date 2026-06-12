# Neo-Web 全端分離專案說明文件 (Root)

Neo-Web 是一個採用 **前後端分離 (Decoupled) 架構** 的網頁應用程式。專案將強大的 **.NET 10.0 Web API** 後端與現代化的 **Vue 3 (Vite 8 + TS 6 + Tailwind 4)** 前端結合，前端透過 **Azure Static Web Apps (SWA) CLI** 進行獨立靜態託管並提供 API 反向代理。

---

## 🗺️ 專案總覽地圖

本解決方案由以下兩個主要專案目錄構成，各自擁有獨立的開發說明文件：

* 📂 **[neo-backend/](file:///Users/ben/Projects/neo-web/neo-backend)**: ASP.NET Core 10.0 Web API 純後端服務。
  👉 *詳細開發指引請參閱：[後端開發文件 (neo-backend/README.md)](file:///Users/ben/Projects/neo-web/neo-backend/README.md)*
* 📂 **[neo-frontend/](file:///Users/ben/Projects/neo-web/neo-frontend)**: Vite 8 + Vue 3.5 + TS 6 前端獨立模組原始碼。
  👉 *詳細開發指引請參閱：[前端開發文件 (neo-frontend/README.md)](file:///Users/ben/Projects/neo-web/neo-frontend/README.md)*

---

## 🏗️ 前後端分離架構設計 (How it Works)

本專案採用純粹的前後端分離設計。前端所有的模組在編譯後都會輸出至 `neo-frontend/deploy` 中，並由 SWA CLI 提供本機與生產環境的靜態檔案託管以及對後端 API `/api` 的代理轉發。

```mermaid
graph TD
    User([使用者瀏覽器]) -->|訪問 Port 8080| SWA[SWA CLI 容器 Port 4280]
    SWA -->|重定向 / 到 /home/| SWA
    SWA -->|服務靜態資源| StaticFiles[deploy/ 靜態網頁與模組]
    SWA -->|反向代理 /api/*| DotNetAPI[neo-backend API 容器]
    DotNetAPI -->|回傳 JSON 資料| SWA
```

---

## 🛠️ 全端開發與佈署流程

### 💻 本地開發流程 (Local Development)

若要開始本地全端整合開發，請按照以下步驟啟動雙端服務：

#### 第一步：啟動後端 .NET API
```bash
cd neo-backend
dotnet run
```
* 後端 API 預設監聽於 `http://localhost:5058`。後端程式已設定適當的 CORS 策略以允許本地開發連線。

#### 第二步：編譯前端模組
```bash
cd neo-frontend
npm run build
```
* 此動作會將模組（`home`、`introduction`、`privacy`）打包至 `neo-frontend/deploy` 底下。

#### 第三步：啟動 SWA CLI 進行本地代理測試
```bash
cd neo-frontend/deploy
npx swa start local-deploy
```
* 本地開發服務將運行於 `http://localhost:4280`。造訪此網址時，SWA CLI 會自動將根目錄重定向至 `/home/`，並自動將 `/api/*` 開頭的請求代理轉發至後端的 `http://localhost:5058`。

---

### 🚀 生產環境部署流程 (Production via Docker Compose)

專案已完全容器化，並使用 Docker Compose 進行一體化建置與拉起。

```bash
docker-compose up --build -d
```

#### 容器運作機制：
1. **後端服務 (`neo-backend`)**：由 .NET 10.0 Dockerfile 編譯並執行於 `http://+:5000`。
2. **前端服務 (`neo-frontend`)**：使用 Node.js 20 映像檔作為多階段建置。第一階段於容器內自動執行前端 `npm run build`，第二階段全域安裝並執行 SWA CLI：
   `swa start container-deploy`
   * 此命令會加載寫死在 [deploy/swa-cli.config.json](file:///Users/ben/Projects/neo-web/neo-frontend/deploy/swa-cli.config.json) 中的配置，並自動將 API 轉發至 `http://neo-backend:5000`。
3. **對外暴露連接埠**：前端容器的 `4280` 埠被對應至宿主機的 **`8080`** 埠。造訪 `http://localhost:8080` (或 `https://neo-frontend.neo-web.orb.local/`) 即可瀏覽完整的應用程式。

---

## 🛡️ AI Agent 開發防禦網 (Harness)
本解決方案內置了高規格的 AI 輔助開發規則，請協作的 AI 助手務必遵守：
* 根目錄下的 **[AGENTS.md](file:///Users/ben/Projects/neo-web/AGENTS.md)** 提供了全專案級的 Agent Rules。
