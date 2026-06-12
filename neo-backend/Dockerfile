# 使用 .NET 10.0 SDK 作為建置環境
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build-env
WORKDIR /app

# 複製 csproj 並進行還原
COPY *.csproj ./
RUN dotnet restore

# 複製其餘程式碼並進行發布
COPY . ./
RUN dotnet publish -c Release -o out

# 建立執行階段映像檔
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build-env /app/out .

# 設定環境變數，將 API 伺服器監聽在 5000 埠
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5000

ENTRYPOINT ["dotnet", "neo-backend.dll"]
