# Build stage
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
# 全域安裝 Azure Static Web Apps CLI
RUN npm install -g @azure/static-web-apps-cli
# 將 build-stage 產出的 deploy 目錄複製進來
COPY --from=build-stage /app/deploy ./deploy

# SWA CLI 在非特殊權限下僅允許監聽 1024-65535 之間的埠，故使用其預設 4280 埠
EXPOSE 4280

# 使用命令列參數直接啟動 SWA CLI 服務，並配置代理到後端 API
CMD ["swa", "start", "./deploy", "--api-devserver-url", "http://neo-backend:5000", "--host", "0.0.0.0", "--port", "4280"]
