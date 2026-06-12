# Neo-Web AI 開發指引 (AGENTS.md)

本文件定義 Neo-Web 專案的架構分工、核心指令與 AI 開發規範。

---

## 🗺️ 專案架構與運行邏輯

本專案採用前後端分離設計：

```
/ (專案根目錄)
├── neo-backend/         # .NET 10.0 Web API 後端 (C#) -> [neo-backend/AGENTS.md](file:///Users/ben/Projects/neo-web/neo-backend/AGENTS.md)
├── neo-frontend/        # Vue 3 (Vite 8 + TS 6 + Tailwind 4) 前端 -> [neo-frontend/AGENTS.md](file:///Users/ben/Projects/neo-web/neo-frontend/AGENTS.md)
├── docs/                # 架構圖與說明文件
├── docker-compose.yml   # 容器化部署配置
└── neo-web.sln          # .NET 解決方案檔
```

* **連線路由**：
  * 前端編譯輸出至 `neo-frontend/deploy`。
  * 使用 **Azure Static Web Apps (SWA) CLI** 進行託管，根路徑 `/` 重定向至 `/home/`。
  * SWA CLI 反向代理 `/api/*` 請求至後端 API (預設 `http://localhost:5058`)。

---

## 🛠️ 全域核心指令

* **容器化啟動（後端 + 前端 + SWA 代理）**：
  ```bash
  docker-compose up --build -d
  ```
  啟動後造訪 `http://localhost:8080` 瀏覽完整系統。
* **停止容器**：
  ```bash
  docker-compose down
  ```

---

## 🎯 開發規範與限制

### 1. 修改後必體驗證
所有代碼修改後必須在對應目錄通過驗證：
* **後端驗證**：`cd neo-backend && dotnet build` (編譯無錯誤、無警告)
* **前端驗證**：`cd neo-frontend && npm run typecheck && npm run test`

### 2. 禁止預留佔位符 (No Placeholders)
* 嚴禁寫入 `TODO: 稍後實現` 或 `Lorem Ipsum` 等假資料。
* 需要 UI 資產時使用 `generate_image` 生成真實圖片。
* UI 需採用現代設計（漸層色、暗黑模式、微動畫、hover 狀態），禁用瀏覽器預設樣式。

### 3. 保留文件完整性
* 修改時保留所有無關的既有註解、文件說明與測試。
* 測試失敗時優先排查修正，禁止直接刪除或跳過 (Skip) 測試。

### 4. 憑證與環境變數安全
* 嚴禁將 API 金鑰、密碼或敏感環境變數寫死在程式碼中。
* 一律使用 `appsettings.json` 或 `.env` 管理，並加入 `.gitignore`。
