# Neo-Web AI 開發指引

最高層 Agent 規範。子資料夾規範僅能補充本文件，嚴禁放寬安全邊界。

## 0. 閱讀順序

- 任何工作開始前，必須先閱讀本文件。
- 進入 `neo-backend/` 前，須閱讀 `neo-backend/AGENTS.md`
- 進入 `neo-frontend/` 前，須閱讀 `neo-frontend/AGENTS.md`

## 1. 安全邊界

- 所有回覆、Git Commit 訊息、PR 標題與說明均須使用繁體中文（台灣）。
- 嚴禁讀取、搜尋、修改或重寫以下檔案：`appsettings*.json`、`launchSettings.json`、`.env`、`.env.*`、`build.gradle.kts`、`*.xcconfig`。
- 嚴禁輸出、複製或散播金鑰、憑證、連線字串、Token、帳密或個資。遇疑似敏感資訊一律概述為「含敏感資訊」。
- 未經明確授權，嚴禁執行不可逆操作（如刪除資料、重設 Git、推送分支、建立 PR、部署、發送郵件、寫入正式環境或修改雲端資源）。
- 嚴禁手動修改 EF Core Power Tools 產生的 `DBModels`。資料庫變更須由 EFPT 重新產生，除非使用者明確同意手動修改風險。
- AI 語意審查不可取代確定性檢查（Deterministic checks）；能以 build、test、lint 驗證的事項，必須優先使用工具驗證。

## 2. 專案入口

- `neo-backend/`：後端專案
- `neo-frontend/`：前端專案

## 3. 開工與驗證

- 先確認任務所屬目錄（根目錄、`neo-backend/`、`neo-frontend/` 等）。
- 使用 `rg` 或 `rg --files` 搜尋檔案與符號，並排除禁讀設定檔、`bin/`、`obj/`、`node_modules/` 及第三方產物。
- 修改前，必須閱讀目標檔案、相鄰類別、既有介面、呼叫端、註冊位置與相關測試代碼。
- 若文件與實際專案檔衝突，以程式碼、專案檔與可執行腳本為準，並主動回報文件過期。

