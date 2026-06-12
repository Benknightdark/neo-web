# Neo-Backend 開發指引 (neo-backend/AGENTS.md)

定義 neo-backend (.NET 10.0 Web API) 目錄的開發指令與 C# 程式碼規範。

---

## 🗺️ 目錄結構

```
neo-backend/
├── Controllers/         # API 控制器 (如 HealthController.cs)
├── Models/              # 資料模型與 DTO (目前為空)
├── Properties/          # 運行屬性 (launchSettings.json)
├── Program.cs           # 服務配置與進入點
└── neo-backend.csproj   # C# 專案檔
```

---

## 🛠️ 開發驗證指令

* **還原依賴與編譯**：
  ```bash
  dotnet build
  ```
  *修改代碼後，編譯結果必須為 0 錯誤、0 警告。*
* **本地啟動**：
  ```bash
  dotnet run
  ```
  API 預設監聽：`http://localhost:5058`
* **安裝 NuGet 套件**：
  ```bash
  dotnet add package <PackageName>
  ```
* **發布 Release 編譯**：
  ```bash
  dotnet publish -c Release -o ./publish
  ```

---

## 🎯 C# 程式碼與架構規範

### 1. 現代 C# 語法
* **File-Scoped Namespaces**：一律使用單行命名空間定義，減少巢狀縮排：
  ```csharp
  namespace neo_backend.Controllers;
  ```
* **Nullable Reference Types (NRT)**：專案已啟用 NRT，必須處理 `?` 可空標記，避免編譯器產生 Nullability 警告。
* **Top-Level Statements**：維持 `Program.cs` 採用的頂層語句結構。

### 2. 控制器 (Controllers) 設計
* 必須繼承 `ControllerBase` 並標記 `[ApiController]`：
  ```csharp
  [ApiController]
  [Route("api/[controller]")]
  ```
* 路由使用小寫 RESTful 風格。
* 回傳值使用 `IActionResult` 或 `ActionResult<T>`，並回傳明確 HTTP 狀態碼 (如 `Ok()`, `NotFound()`, `BadRequest()`)。

### 3. 異步與中斷 (Async/Await)
* 所有 I/O 操作必須使用 `async` / `await`。
* 異步方法以 `Async` 結尾。
* 關鍵非同步操作需串接 `CancellationToken` 以支援請求取消。

### 4. 日誌與錯誤處理
* 使用 `ILogger<T>` 記錄執行軌跡與異常。
* 嚴禁吞掉 Exception，應妥善寫入 Log 或向外拋出至全域異常處理。
