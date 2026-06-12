# Neo-Web 前後端分離專案說明 (Root)

Neo-Web 是採用前後端分離架構的網頁應用程式。本專案整合 **.NET 10.0 Web API** 後端與 **Vue 3 (Vite 8 + TS 6 + Tailwind 4)** 前端，並透過 **Azure Static Web Apps (SWA) CLI** 進行靜態託管與 API 反向代理。

---

## 🗺️ 專案總覽

解決方案包含以下兩個專案目錄，皆附有獨立說明文件：

* 📂 **[neo-backend/](file:///Users/ben/Projects/neo-web/neo-backend)**: ASP.NET Core 10.0 Web API 後端服務。
  👉 *開發指引：[後端開發文件 (neo-backend/README.md)](file:///Users/ben/Projects/neo-web/neo-backend/README.md)*
* 📂 **[neo-frontend/](file:///Users/ben/Projects/neo-web/neo-frontend)**: Vite 8 + Vue 3.5 + TS 6 前端獨立模組。
  👉 *開發指引：[前端開發文件 (neo-frontend/README.md)](file:///Users/ben/Projects/neo-web/neo-frontend/README.md)*

---

## 🏗️ 架構設計

本專案為前後端分離設計。前端模組編譯後輸出至 `neo-frontend/deploy`，由 SWA CLI 託管靜態檔案並轉發 `/api` 請求至後端。

```mermaid
graph TD
    User([使用者瀏覽器]) -->|訪問 Port 8080| SWA[SWA CLI 容器 Port 4280]
    SWA -->|重定向 / 到 /home/| SWA
    SWA -->|服務靜態資源| StaticFiles[deploy/ 靜態網頁與模組]
    SWA -->|反向代理 /api/*| DotNetAPI[neo-backend API 容器]
    DotNetAPI -->|回傳 JSON 資料| SWA
```

---

## 🛠️ 開發與部署流程

### 💻 本地開發 (Local Development)

請依序啟動雙端服務：

#### 1. 啟動後端 .NET API
```bash
cd neo-backend
dotnet run
```
* 後端預設監聽 `http://localhost:5058`。已設定 CORS 允許本地連線。

#### 2. 編譯前端模組
```bash
cd neo-frontend
npm run build
```
* 打包前端模組至 `neo-frontend/deploy`。

#### 3. 啟動 SWA CLI 代理
```bash
cd neo-frontend/deploy
npx swa start local-deploy
```
* 本地服務運行於 `http://localhost:4280`。SWA CLI 會將根路徑導向 `/home/`，並將 `/api/*` 轉發至後端 `http://localhost:5058`。

---

### 🚀 生產環境部署 (Docker Compose)

專案已容器化，可使用 Docker Compose 建置與啟動：

```bash
docker-compose up --build -d
```

#### 容器運作機制：
1. **後端服務 (`neo-backend`)**：由 .NET 10.0 Dockerfile 編譯，運行於 `http://+:5000`。
2. **前端服務 (`neo-frontend`)**：使用 Node.js 20 進行多階段建置。第一階段於容器內執行 `npm run build`，第二階段執行 SWA CLI：
   `swa start container-deploy`
   * 讀取 `deploy/swa-cli.config.json` 的設定，將 API 請求轉發至 `http://neo-backend:5000`。
3. **對外埠口**：前端容器的 `4280` 埠對應至主機的 `8080` 埠。造訪 `http://localhost:8080` 即可瀏覽應用程式。

---

## 🛡️ AI Agent 開發規範 (Harness)
協作 AI 助手務必遵守開發規範：
* 根目錄的 **[AGENTS.md](file:///Users/ben/Projects/neo-web/AGENTS.md)** 包含專案全域的 Agent 規則。
