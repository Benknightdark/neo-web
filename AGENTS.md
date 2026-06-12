# Gemini Context for Neo-Web

This file defines the architecture, development workflow, and conventions for the `neo-web` project to guide AI agents.

## Project Overview

`neo-web` is a decoupled full-stack application. It pairs a **.NET 10.0 Web API** backend with a **Vite 6 / Vue 3** frontend, hosted locally and in production via the **Azure Static Web Apps (SWA) CLI** within Docker Compose.

* **Backend**: ASP.NET Core Web API (.NET 10.0) serving JSON endpoints.
* **Frontend**: Independent Vue modules bundled into `neo-frontend/deploy`.
* **Hosting & Proxy**: Azure Static Web Apps (SWA) CLI hosts static assets and proxies `/api` to the backend.
* **Styling**: Tailwind CSS.

## Directory Structure

```text
neo-web/
├── neo-web.sln                 # .NET Solution file
├── docker-compose.yml          # Production orchestration
├── neo-backend/                # ASP.NET Core Backend (Pure API)
│   ├── Controllers/            # API Controllers
│   ├── Program.cs              # API entry point & CORS configuration
│   ├── Dockerfile              # Backend build recipe
│   └── neo-backend.csproj      # Targets .NET 10.0
└── neo-frontend/               # Frontend Source
    ├── src/                    # Source modules
    │   ├── home/               # 'home' module (Vue entry / portal)
    │   ├── introduction/       # 'introduction' module
    │   └── privacy/            # 'privacy' module
    ├── deploy/                 # Compiled static assets (production output target)
    │   ├── staticwebapp.config.json # SWA routing rules (e.g. '/' redirect to '/home/')
    │   └── swa-cli.config.json # SWA CLI local emulator settings (local-deploy/container-deploy)
    ├── scripts/                # Custom build scripts
    │   └── build.js            # Build script outputting modules to deploy/
    ├── package.json            # Node dependencies and scripts
    ├── Dockerfile              # Frontend multi-stage build & SWA CLI runner
    └── vite.config.ts          # Base Vite configuration
```

## Development Workflow

### Prerequisites

* **.NET SDK**: 10.0 or higher.
* **Node.js**: v20.0.0 or higher.

### Local Development

1. **Backend**: Start the API:
   ```bash
   cd neo-backend
   dotnet run
   ```
   * Runs at `http://localhost:5058`. CORS allows requests from frontend dev servers.
2. **Frontend**: Build modules:
   ```bash
   cd neo-frontend
   npm run build
   ```
   * Run the SWA emulator to serve static files and proxy API requests:
   ```bash
   cd neo-frontend/deploy
   npx swa start local-deploy
   ```
   * Open `http://localhost:4280/` to test.

### Production Deployment (Docker Compose)

Run the containerized stack:
```bash
docker-compose up --build -d
```
* **Frontend**: A multi-stage Dockerfile builds the static files and starts the SWA CLI on port `4280` (mapped to host port `8080`).
* **API Proxy**: SWA proxies `/api/*` to `http://neo-backend:5000` inside the Docker network.

## Key Files

* `AGENTS.md`: Global developer/agent guidelines and workflow rules (this file).
* `neo-backend/AGENTS.md`: Backend developer/agent conventions for C# Controllers, Razor Views, and Tag Helpers.
* `neo-frontend/AGENTS.md`: Frontend developer/agent conventions for Vite 8, Vue 3.5, and Tailwind 4.
* `docker-compose.yml`: Service orchestration.
* `neo-backend/Program.cs`: API entry point and CORS setup.
* `neo-frontend/Dockerfile`: Frontend build and SWA run stages.
* `neo-frontend/deploy/swa-cli.config.json`: **CRITICAL**. SWA CLI configurations. Do not delete.
* `neo-frontend/deploy/staticwebapp.config.json`: **CRITICAL**. Route redirection rules.
* `neo-frontend/scripts/build.js`: Frontend compiler and bundle exporter.

## Critical AI Agent Rules & Constraints (Agent Harness)

### 1. Frontend Type Checking
* Run `npm run typecheck` inside `neo-frontend/` to verify TypeScript and Vue SFC types before completing tasks.

### 2. Tailwind CSS 4 Styling
* **DO NOT** modify `tailwind.config.js` or `postcss.config.js`.
* Define custom colors, fonts, or themes via `@theme` directives inside `neo-frontend/src/base-style.css` or the module's `style.css`.

### 3. Vue Dependency Isolation
* **DO NOT** bundle `vue` into frontend modules.
* The build template (`scripts/vite-module-template.js`) marks `vue` as external to share one runtime instance.
* The Vue shared library `vue.esm-browser.min.js` is loaded from `deploy/lib/vue3/`.

### 4. Routing & Links
* The frontend operates independently from the backend.
* `staticwebapp.config.json` redirects `/` to `/home/`.
* Use root-relative paths (e.g. `/privacy/`, `/introduction/`) for inter-module links.

### 5. Security Boundaries (CRITICAL)
* **ABSOLUTELY FORBIDDEN**: Do not read or modify `.env` files, `appsettings*.json`, or IDE configuration files (`launch.json`, `.vscode/*`).
* Request environment credentials directly from the user.

### 6. Git Commit Language
* All git messages must be in Taiwanese .
