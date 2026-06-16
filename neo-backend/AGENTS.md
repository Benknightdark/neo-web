# Neo-Backend 開發指引

.NET 10.0 Web API 後端（C#）。

## 目錄結構

```
Controllers/         # API 控制器
Models/              # 資料模型與 DTO
Properties/          # launchSettings.json
Program.cs           # 服務配置與進入點
neo-backend.csproj   # 專案檔
```

## 驗證指令

```bash
dotnet build   # 修改後必須 0 錯誤、0 警告
dotnet run     # 本地啟動 (http://localhost:5058)
```

## C# 程式碼規範

- **File-Scoped Namespaces** — `namespace neo_backend.Controllers;`
- **Nullable Reference Types** — 專案已啟用 NRT，必須處理 `?` 可空標記。
- **Top-Level Statements** — 維持 `Program.cs` 的頂層語句結構。
- **Controller 設計** — 繼承 `ControllerBase`，標記 `[ApiController]` + `[Route("api/[controller]")]`，回傳 `ActionResult<T>` 搭配明確 HTTP 狀態碼。
- **Async/Await** — I/O 操作必須非同步，方法名以 `Async` 結尾，串接 `CancellationToken`。
- **日誌與錯誤** — 使用 `ILogger<T>` 記錄，嚴禁吞掉 Exception。
