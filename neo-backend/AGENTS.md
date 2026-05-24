# C# Backend Rules & Constraints (neo-backend)

This folder contains the ASP.NET Core 10.0 MVC backend solution. As an AI coding agent, you must strictly follow these rules when developing in this directory.

## Backend Context & Architecture

- **Technology Stack**: .NET 10.0, ASP.NET Core MVC.
- **Routing**: Managed by C# MVC Controllers (e.g., `Controllers/HomeController.cs`).
- **Views**: Razor Views (`Views/**/*.cshtml`) serve as the HTML Shell, embedding the mounted frontend islands.
- **Static Files**: Compiled assets (JS/CSS) reside inside `wwwroot/js` and `wwwroot/css`.

## Coding Conventions

### 1. Import Maps & ESM Libraries
- External and shared packages are referenced as ES modules (ESM) in `Views/Shared/_Layout.cshtml`.
- You **MUST** use the custom C# Tag Helper `<import-map>` to define them:
  ```html
  <import-map>
  {
      "imports": {
          "vue": "/lib/vue3/vue.esm-browser.min.js"
      }
  }
  </import-map>
  ```
- The C# Tag Helper `ImportMapTagHelper.cs` (located in `TagHelpers/`) automatically parses this JSON and adds version hashing (`?v=...`) to local absolute paths for cache-busting.

### 2. Controller & Razor Views
- Frontend modules mount on `<div id="root"></div>` inside their respective Razor Views.
- When referencing frontend assets, append versions:
  ```html
  @section Styles {
      <link rel="stylesheet" href="~/css/home/home.css" asp-append-version="true" />
  }
  @section Scripts {
      <script type="module" src="~/js/home/home.js" asp-append-version="true"></script>
  }
  ```

### 3. Verification Commands
- Ensure all backend modifications compile successfully before declaring a task complete:
  - Run `dotnet build` from the solution root or `neo-backend/` folder.
  - Run `dotnet run` (under `neo-backend/`) to start the server.

### 4. Security & Sensitive Configurations Boundary (CRITICAL)
- **ABSOLUTELY FORBIDDEN**: You **MUST NOT** read or modify any `.env` files (e.g., `.env`, `.env.local`), `appsettings.json` (including `appsettings.Development.json`), or IDE/VS Code launch configs such as `launch.json` or `.vscode/launch.json`.
- These configuration files contain secrets, server URLs, database strings, and startup variables, and are strictly restricted from AI agent access. If you need any credentials, environment parameters, or database connections to fulfill a task, you **MUST** request them directly from the human developer.
