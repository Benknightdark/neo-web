# C# Backend Rules & Constraints (neo-backend)

This file defines the C# MVC backend rules and conventions for AI agents.

## Backend Context & Architecture

* **Technology Stack**: .NET 10.0, ASP.NET Core MVC.
* **Routing**: Managed by C# MVC Controllers (e.g., `Controllers/HomeController.cs`).
* **Views**: Razor Views (`Views/**/*.cshtml`) serve as the HTML Shell, embedding the mounted frontend islands.
* **Static Files**: Compiled assets (JS/CSS) reside inside `wwwroot/js` and `wwwroot/css`.

## Coding Conventions

### 1. Import Maps & ESM Libraries
* Define external and shared packages as ES modules (ESM) in `Views/Shared/_Layout.cshtml`.
* Use the custom C# Tag Helper `<import-map>`:
  ```html
  <import-map>
  {
      "imports": {
          "vue": "/lib/vue3/vue.esm-browser.min.js"
      }
  }
  </import-map>
  ```
* The C# Tag Helper `ImportMapTagHelper.cs` (in `TagHelpers/`) parses this JSON and automatically appends version hashes (`?v=...`) to local absolute paths for cache-busting.

### 2. Controller & Razor Views
* Mount frontend modules on `<div id="root"></div>` inside their respective Razor Views.
* Append asset versions when referencing them:
  ```html
  @section Styles {
      <link rel="stylesheet" href="~/css/home/home.css" asp-append-version="true" />
  }
  @section Scripts {
      <script type="module" src="~/js/home/home.js" asp-append-version="true"></script>
  }
  ```

### 3. Verification Commands
* Run `dotnet build` from the solution root or `neo-backend/` folder to verify compilation.
* Run `dotnet run` (under `neo-backend/`) to start the server.

### 4. Security Boundaries (CRITICAL)
* **ABSOLUTELY FORBIDDEN**: Do not read or modify `.env` files, `appsettings*.json`, or IDE configuration files (`launch.json`, `.vscode/*`).
* Request environment credentials directly from the user.
