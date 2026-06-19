# Neo-Web

前後端分離網頁應用程式 — **.NET 10.0 Web API** + **Vue 3 (Vite 8 / TS 6 / Tailwind 4)**，以 **SWA CLI** 託管靜態資源並反向代理 API。

## 專案結構

| 目錄 | 說明 |
|------|------|
| [neo-backend/](neo-backend/) | ASP.NET Core 10.0 Web API |
| [neo-frontend/](neo-frontend/) | Vue 3 前端模組 |


## 本地開發

```bash
# 1. 後端 (http://localhost:5058，已設定 CORS)
cd neo-backend && dotnet run

# 2. 前端 (http://localhost:3000)
cd neo-frontend && npm install && npm start
```


### 前端模組建置

```bash
cd neo-frontend

npm run build portal             # 建置protal所有模組
npm run build portal/home           # 建置portal的模組
```


如需測試 SWA 代理路由：

```bash
cd neo-frontend && npm run build
cd deploy/portal && npx @azure/static-web-apps-cli start local-deploy   # http://localhost:4280
```

## 部署

### Docker Compose（推薦）

```bash
docker-compose up --build -d   # http://localhost:8080
docker-compose down             # 停止
```

### 手動部署

```bash
# 前端建置
cd neo-frontend && npm install && npm run build

# 後端發布
cd neo-backend && dotnet publish -c Release -o ./publish
```

將 `neo-frontend/deploy` 靜態檔案部署至網頁伺服器或 Azure SWA，後端程式啟動後設定反向代理指向 .NET 服務即可。
