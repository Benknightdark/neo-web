# Gemini Context for Neo-Web

This file documents the architecture, development workflow, and conventions for the `neo-web` project. It is intended to guide AI agents in understanding and working with the codebase.

## Project Overview

`neo-web` is a hybrid full-stack web application combining a **.NET 10.0** backend with a modern frontend built using **Vite 6**, supporting **Vue 3**.

*   **Backend**: ASP.NET Core MVC (running on .NET 10.0). Acts as the primary server and host for the frontend assets.
*   **Frontend**: A modular frontend architecture where pages/features are developed as independent modules (using Vue) and bundled into the backend's `wwwroot` directory.
*   **Styling**: Tailwind CSS is used for styling.

## Directory Structure

```
neo-web/
├── neo-web.sln                 # .NET Solution file
├── neo-backend/                # ASP.NET Core Backend
│   ├── Controllers/            # MVC Controllers
│   ├── Views/                  # Razor Views (serve the HTML shell)
│   ├── wwwroot/                # Static assets (compiled frontend code goes here)
│   │   ├── css/
│   │   └── js/
│   ├── Program.cs              # App entry point
│   └── neo-backend.csproj      # Project file (Targets .NET 10.0)
└── neo-frontend/               # Frontend Source
    ├── src/                    # Source modules
    │   ├── home/               # 'home' module (Vue implementation observed)
    │   └── privacy/            # 'privacy' module
    ├── scripts/                # Custom build scripts
    │   └── build.js            # Main build script for bundling modules
    ├── package.json            # Node dependencies and scripts
    └── vite.config.ts          # Base Vite configuration
```

## Development Workflow

### Prerequisites

*   **.NET SDK**: 10.0 or higher.
*   **Node.js**: v20.0.0 or higher.

### Backend

The backend is a standard ASP.NET Core MVC application.

*   **Run**: `dotnet run` (inside `neo-backend/`)
*   **URL**: Typically `https://localhost:7146` or `http://localhost:5058` (check launch logs).

### Frontend

The frontend uses a custom build process to integrate with the backend.

*   **Install Dependencies**: `npm install` (inside `neo-frontend/`)
*   **Start Dev Server**: `npm start` (Runs `vite .`). This starts a Vite dev server, typically at `http://localhost:5173`.
    *   *Note*: During development, you may access the frontend directly via Vite or through the backend if properly configured to proxy/load assets.
*   **Build Modules**:
    *   Build all modules: `npm run build`
    *   This script (`scripts/build.js`) bundles the modules and copies the output artifacts (JS/CSS) into `neo-backend/wwwroot/`.

### Architecture & Conventions

*   **Hybrid Routing**: The backend handles routing (MVC Controllers). The frontend modules are "islands" or specific pages injected into the Razor views.
*   **Module Independence**: Each folder in `neo-frontend/src/` (e.g., `home`, `privacy`) represents a distinct module. It should have its own entry point (`index.ts`).
*   **Framework**: The build system is configured for **Vue 3**.
*   **Styling**: Tailwind CSS is configured. Ensure `@tailwindcss/vite` plugin is active in the build.

## Key Files

*   `neo-backend/Program.cs`: Configures the HTTP pipeline and services.
*   `neo-frontend/package.json`: Defines build scripts and dependencies.
*   `neo-frontend/scripts/build.js`: **CRITICAL**. This script handles the logic of building specific modules and moving them to the backend. Modify this if changing the build/deployment strategy.
*   `neo-frontend/vite.config.ts`: Vite configuration.

## Common Tasks

*   **Adding a new page**:
    1.  Create a new folder in `neo-frontend/src/<module_name>`.
    2.  Add your Vue code and an entry point (`index.ts`).
    3.  Create a corresponding Controller/View in `neo-backend`.
    4.  Run `npm run build` to compile the assets to the backend.
    5.  Reference the compiled JS/CSS in the backend View.

## Critical AI Agent Rules & Constraints (Agent Harness)

### 1. Front-End Type Verification (Feedback Sensor)
Before claiming a task is complete, you **MUST** run type-checking:
*   Run `npm run typecheck` inside `neo-frontend/` to verify TypeScript and Vue SFC types. Do not rely solely on `npm run build` since Vite does not block on type errors.

### 2. Tailwind CSS 4 Styling Conventions
*   **DO NOT** edit `tailwind.config.js` or `postcss.config.js` to modify the theme or add utilities. Tailwind 4 is configured in this project.
*   Custom colors, fonts, or themes must be configured using standard CSS `@theme` directives inside `neo-frontend/src/base-style.css` or the module's `style.css`.
    Example:
    ```css
    @theme {
      --color-primary: #1e40af;
    }
    ```

### 3. External Dependencies & Vue ESM Boundaries
*   **DO NOT** bundle the core `vue` package into your frontend modules.
*   The build template `scripts/vite-module-template.js` enforces `external: ['vue']` to ensure all modules share a single Vue instance at runtime.
*   If you use other third-party libraries, they should be mapped via the custom C# Tag Helper `<import-map>` in `neo-backend/Views/Shared/_Layout.cshtml`.
*   Local/versioned ESM files (mapped via `/lib/...`) are automatically version-stamped (for cache-busting) by the C# `ImportMapTagHelper`.

### 4. Hybrid Routing & Razor HTML Shells
*   All frontend modules act as independent Vue islands mounted on `<div id="root"></div>` inside their respective ASP.NET Core Razor Views (e.g., `Views/Home/Index.cshtml`).
*   Ensure any links between modules use server-side routing (e.g., `<a href="/Home/Privacy">` or Tag Helpers) rather than frontend router links, unless it is a sub-page within the *same* module.

### 5. Security & Sensitive Configurations Boundary (CRITICAL)
*   **ABSOLUTELY FORBIDDEN**: You **MUST NOT** read or modify any `.env` files (e.g., `.env`, `.env.local`), `appsettings.json` (including `appsettings.Development.json`), or IDE/VS Code launch configs such as `launch.json` or `.vscode/launch.json`.
*   These configuration files contain secrets, server URLs, database strings, and startup variables, and are strictly restricted from AI agent access. If you need any credentials, environment parameters, or database connections to fulfill a task, you **MUST** request them directly from the human developer.
