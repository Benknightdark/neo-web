# Neo-Web AI 開發指引

前後端分離專案：**.NET 10.0 Web API** 後端 + **Vue 3 (Vite 8 / TS 6 / Tailwind 4)** 前端。

## 專案結構

```
neo-backend/         # .NET Web API (C#) → neo-backend/AGENTS.md
neo-frontend/        # Vue 3 前端模組   → neo-frontend/AGENTS.md
docker-compose.yml   # 容器化部署
neo-web.sln          # .NET 解決方案檔
```

前端編譯輸出至 `neo-frontend/deploy`，SWA CLI 託管靜態資源並反向代理 `/api/*` 至後端（預設 `localhost:5058`）。

## 驗證指令

修改後必須通過對應驗證：

```bash
cd neo-backend  && dotnet build                      # 0 錯誤、0 警告
cd neo-frontend && npm run typecheck && npm run test  # 型別檢查 + 單元測試
```

## 開發規範

1. **禁止佔位符** — 不得寫入 `TODO: 稍後實現` 或 `Lorem Ipsum`；UI 資產使用 `generate_image` 生成。
2. **保留文件完整性** — 修改時保留無關的既有註解與測試；測試失敗時修正，禁止刪除或跳過。
3. **憑證安全** — API 金鑰與密碼一律透過 `appsettings.json` 或 `.env` 管理，禁止寫死於程式碼。
4. **現代 UI 設計** — 採用漸層色、暗黑模式、微動畫、hover 狀態，禁用瀏覽器預設樣式。
